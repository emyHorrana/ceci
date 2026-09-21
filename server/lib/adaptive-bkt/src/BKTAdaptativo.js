const Indicadores = require('./Indicadores');
const CalculadoraPesos = require('./CalculadoraPesos');
const ParametrosAdaptativos = require('./ParametrosAdaptativos');
const RastreamentoBayesiano = require('./RastreamentoBayesiano');
const Classificador = require('./Classificador');
const Recomendacao = require('./Recomendacao');
const PerfilAluno = require('./PerfilAluno');

/*
  Junta as 7 classes de backend numa única API.
  (RastreadorEventos fica de fora - roda só no front-end.)

  Uso (dentro do server, ex: server/routes/licao.js):

    const bkt = new BKTAdaptativo({ supabase, userId, moduleId, pesos }

 */
// Teto pro domínio calculado a partir de sinais FÁCEIS do onboarding
// (etapaId no formato "boas-vindas#..." - aula guiada de mouse/teclado,
// "digite seu nome"). São interações de tutorial, de baixa dificuldade
// e quase impossíveis de errar - mesmo calculando o score de verdade
// (não tem mais nada "fingido" aqui), UMA resposta fácil isolada não é
// evidência estatística suficiente pra considerar uma Unidade inteira
// "dominada" (>= LIMIAR_PADRAO em FilaDePendencias) e pular seu
// conteúdo real. Isso NÃO se aplica ao desafio de verificação
// ("boas-vindas-verificacao#...", ver BoasVindas.jsx) - esse é
// desenhado pra ser mais difícil e discriminar de verdade quem já sabe.
const TETO_DOMINIO_ONBOARDING = 0.45;

class BKTAdaptativo {
  constructor({ supabase, userId, moduleId, pesos }) {
    this.perfil = new PerfilAluno(supabase, userId, moduleId);
    this.calculadoraPesos = new CalculadoraPesos(pesos);
    this._iniciado = false;
  }

  /*
    Núcleo puro do algoritmo: eventos brutos -> indicadores -> score ->
    parâmetros do BKT -> domínio -> nível -> recomendação. Não toca em
    `this.perfil` nem no Supabase - dá pra chamar isso ANTES de existir
    conta/userId, recebendo o histórico (dominioAnterior/biasAluno/
    questoesAnteriores) por fora em vez de carregar de PerfilAluno.

    Usado tanto por finalizarQuestao() (fluxo normal, com persistência)
    quanto pela rota /api/licao/simular (onboarding em /boas-vindas, que
    calcula o score real a cada resposta - mouse, teclado, diagnóstico -
    SEM precisar de conta ainda). O cálculo em si é sempre o de verdade;
    só sinais de baixa dificuldade (etapaId "boas-vindas#...") passam
    pelo teto acima - ver TETO_DOMINIO_ONBOARDING.
   */
  static calcular({
    correto,
    dadosEvento,
    tempoIdeal,
    tentativas = 1,
    tentativasAposErro = 0,
    biasModulo = 0,
    biasAluno = 0,
    dominioAnterior = null,
    questoesAnteriores = 0,
    pesos,
    etapaId = null,
  }) {
    const indicadores = Indicadores.aPartirDoEvento(dadosEvento, {
      tempoIdeal,
      tentativas,
      tentativasAposErro,
    });
    const acerto = correto ? 1 : 0;
    const erros = correto ? 0 : 1;

    const calculadoraPesos = new CalculadoraPesos(pesos);
    const score = calculadoraPesos.calcularScore(
      { ...indicadores, acerto, erros },
      biasAluno,
      biasModulo
    );

    const parametros = ParametrosAdaptativos.calcularTodos({
      score,
      foco: indicadores.foco,
      velocidade: indicadores.velocidade,
      dominioAnterior,
    });

    let dominio = RastreamentoBayesiano.atualizar(
      parametros.L0,
      parametros.T,
      parametros.Guess,
      parametros.Slip,
      correto
    );

    // Piso é Math.max(TETO, dominioAnterior) - não Math.max(TETO, 0) -
    // de propósito: esse mesmo módulo pode já ter recebido um sinal
    // FORTE antes (ex: verificação confirmada, sem teto). Sem esse
    // piso, um sinal fácil posterior (ex: "digite seu nome", que roda
    // pra todo mundo no final do onboarding) derrubaria de volta um
    // domínio que já tinha sido legitimamente confirmado.
    if (etapaId && etapaId.startsWith('boas-vindas#')) {
      const piso = dominioAnterior ?? 0.30;
      dominio = Math.min(dominio, Math.max(TETO_DOMINIO_ONBOARDING, piso));
    }

    const nivel = Classificador.classificar(dominio, questoesAnteriores + 1);
    const recomendacao = Recomendacao.recomendar(nivel);

    return { score, dominio, nivel, recomendacao, indicadores, acerto, erros };
  }

  /* Carrega o histórico do aluno (chamar uma vez, antes da primeira questão do módulo) */
  async iniciar() {
    await this.perfil.carregar();
    this._iniciado = true;
    return this;
  }

  /* Marca o início de uma questão*/
  iniciarQuestao() {
    if (!this._iniciado) {
      throw new Error('Chame bkt.iniciar() antes de iniciarQuestao().');
    }
  }

  /*
    Processa a resposta de uma questão e retorna o resultado completo:
    score, domínio atualizado, nível, recomendação e os indicadores usados.
   */
  async finalizarQuestao({
    correto,
    dadosEvento,
    tempoIdeal,
    tentativas = 1,
    tentativasAposErro = 0,
    biasModulo = 0,
    etapaId = null,
  }) {
    const { score, dominio: novoDominio, nivel, recomendacao, indicadores, acerto, erros } =
      BKTAdaptativo.calcular({
        correto,
        dadosEvento,
        tempoIdeal,
        tentativas,
        tentativasAposErro,
        biasModulo,
        biasAluno: this.perfil.biasAluno,
        dominioAnterior: this.perfil.dominio,
        questoesAnteriores: this.perfil.questoes,
        pesos: this.calculadoraPesos.pesos,
        etapaId,
      });

    // persiste o novo estado do aluno (agregado por módulo)
    this.perfil.registrarTentativa({
      correto,
      tempoReal: dadosEvento.tempoResposta,
      foco: indicadores.foco,
      velocidade: indicadores.velocidade,
      novoDominio,
    });
    await this.perfil.salvar();

    // loga a resposta individual (auditoria por etapa)
    if (etapaId) {
      await this.perfil.registrarAtividade({
        etapaId,
        acerto,
        velocidade: indicadores.velocidade,
        foco: indicadores.foco,
        erros,
        scoreUsuario: score,
        scoreFinal: novoDominio,
        tempoReal: dadosEvento.tempoResposta,
      });
    }

    return {
      score,
      dominio: novoDominio,
      nivel,
      recomendacao,
      indicadores,
    };
  }
}

module.exports = BKTAdaptativo;
