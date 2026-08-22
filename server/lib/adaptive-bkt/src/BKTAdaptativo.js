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
class BKTAdaptativo {
  constructor({ supabase, userId, moduleId, pesos }) {
    this.perfil = new PerfilAluno(supabase, userId, moduleId);
    this.calculadoraPesos = new CalculadoraPesos(pesos);
    this._iniciado = false;
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
    // 1. eventos brutos -> indicadores normalizados
    const indicadores = Indicadores.aPartirDoEvento(dadosEvento, {
      tempoIdeal,
      tentativas,
      tentativasAposErro,
    });
    const acerto = correto ? 1 : 0;
    const erros = correto ? 0 : 1;

    // 2. indicadores + bias -> score adaptativo
    const score = this.calculadoraPesos.calcularScore(
      { ...indicadores, acerto, erros },
      this.perfil.biasAluno,
      biasModulo
    );

    // 3. score/indicadores/histórico -> parâmetros do BKT (T, Guess, Slip, L0)
    const parametros = ParametrosAdaptativos.calcularTodos({
      score,
      foco: indicadores.foco,
      velocidade: indicadores.velocidade,
      dominioAnterior: this.perfil.dominio,
    });

    // 4. BKT clássico -> novo domínio
    const novoDominio = RastreamentoBayesiano.atualizar(
      parametros.L0,
      parametros.T,
      parametros.Guess,
      parametros.Slip,
      correto
    );

    // 5. domínio -> nível -> recomendação
    const nivel = Classificador.classificar(novoDominio);
    const recomendacao = Recomendacao.recomendar(nivel);

    // 6. persiste o novo estado do aluno (agregado por módulo)
    this.perfil.registrarTentativa({
      correto,
      tempoReal: dadosEvento.tempoResposta,
      foco: indicadores.foco,
      velocidade: indicadores.velocidade,
      novoDominio,
    });
    await this.perfil.salvar();

    // 7. loga a resposta individual (auditoria por etapa)
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
      parametros,
    };
  }
}

module.exports = BKTAdaptativo;
