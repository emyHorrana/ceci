const express = require('express');
const router = express.Router();
const supabaseModule = require('../../supabaseClient');
const supabase = supabaseModule.supabase || supabaseModule;
const { BKTAdaptativo, FilaDePendencias, Classificador, Recomendacao } = require('../index');
const unidades = require('../data/unidades');

router.post('/responder', async (req, res) => {
  try {
    const {
      correto,
      dadosEvento,
      tempoIdeal,
      tentativas,
      tentativasAposErro,
      moduleId,
      etapaId,
      biasModulo,
    } = req.body;

    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado (userId ausente).' });
    }
    if (!moduleId) {
      return res.status(400).json({ error: 'moduleId é obrigatório.' });
    }
    if (!etapaId) {
      return res.status(400).json({ error: 'etapaId é obrigatório.' });
    }
    if (correto === undefined || !dadosEvento || !tempoIdeal) {
      return res.status(400).json({ error: 'correto, dadosEvento e tempoIdeal são obrigatórios.' });
    }

    const bkt = new BKTAdaptativo({ supabase, userId, moduleId });
    await bkt.iniciar();

    const resultado = await bkt.finalizarQuestao({
      correto,
      dadosEvento,
      tempoIdeal,
      tentativas,
      tentativasAposErro,
      biasModulo,
      etapaId,
    });

    res.json(resultado);
  } catch (err) {
    console.error('[POST /api/licao/responder]', err);
    res.status(500).json({ error: 'Erro ao processar resposta.' });
  }
});

/*
  Calcula (sem persistir nada, sem exigir userId/moduleId) o score
  adaptativo de uma resposta - o mesmo núcleo puro que /responder usa,
  só que recebendo o histórico (dominioAnterior/biasAluno/
  questoesAnteriores) direto no corpo da requisição em vez de carregar
  de `perfis_aluno`. Existe pro onboarding (/boas-vindas): antes da
  conta existir, ainda queremos saber "quanto seria o domínio até
  agora" com o cálculo de verdade (incluindo o teto pra sinais fáceis
  do onboarding, se `etapaId` indicar isso - ver TETO_DOMINIO_ONBOARDING
  em BKTAdaptativo.js), em vez de confiar cegamente numa autodeclaração
  "já sei usar mouse/teclado" - ver BoasVindas.jsx.
 */
router.post('/simular', (req, res) => {
  try {
    const {
      correto,
      dadosEvento,
      tempoIdeal,
      tentativas,
      tentativasAposErro,
      biasModulo,
      biasAluno,
      dominioAnterior,
      questoesAnteriores,
      etapaId,
    } = req.body;

    if (correto === undefined || !dadosEvento || !tempoIdeal) {
      return res.status(400).json({ error: 'correto, dadosEvento e tempoIdeal são obrigatórios.' });
    }

    const resultado = BKTAdaptativo.calcular({
      correto,
      dadosEvento,
      tempoIdeal,
      tentativas,
      tentativasAposErro,
      biasModulo,
      biasAluno,
      dominioAnterior,
      questoesAnteriores,
      etapaId,
    });

    res.json({ ...resultado, limiar: FilaDePendencias.LIMIAR_PADRAO });
  } catch (err) {
    console.error('[POST /api/licao/simular]', err);
    res.status(500).json({ error: 'Erro ao simular questão.' });
  }
});

/*
  Devolve o domínio (L do BKT) e a classificação categórica (Iniciante/Básico/Intermediário/Avançado)
  de TODAS as Unidades já tentadas pelo aluno.
 */
router.get('/perfis/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: perfis, error } = await supabase
      .from('perfis_aluno')
      .select('module_id, dominio, questoes')
      .eq('user_id', userId);

    if (error) throw error;

    const dominiosPorUnidade = Object.fromEntries(
      (perfis || []).map((p) => [p.module_id, p.dominio])
    );

    const classificacaoPorUnidade = Object.fromEntries(
      (perfis || []).map((p) => [p.module_id, Classificador.classificar(p.dominio, p.questoes)])
    );

    // Recomendação pedagógica por Unidade (frase acionável, não só o
    // nível) - usada no card "Seu progresso" do Dashboard. Antes esse
    // texto só era calculado em /responder e nunca chegava a aparecer
    // em nenhuma tela - ver comentário em Recomendacao.js.
    const recomendacaoPorUnidade = Object.fromEntries(
      Object.entries(classificacaoPorUnidade).map(([moduleId, nivel]) => [
        moduleId,
        Recomendacao.recomendar(nivel),
      ])
    );

    // `atividade_usuario` não guarda module_id, só etapa_id - então pra
    // saber SE uma Unidade foi feita de verdade (mini-módulo/checkpoint)
    // ou só confirmada pelo desafio de verificação do onboarding
    // (etapaId "boas-vindas..."), precisamos casar o etapaId com o
    // currículo: "1-1#..." -> miniModuloId "1-1" -> Unidade dona dele;
    // "U1.1#checkpoint" -> a própria chave já é o id da Unidade.
    const { data: atividades, error: erroAtividades } = await supabase
      .from('atividade_usuario')
      .select('etapa_id')
      .eq('usuario_id', userId);

    if (erroAtividades) throw erroAtividades;

    const miniModuloParaUnidade = {};
    unidades.forEach((u) => {
      (u.miniModulos || []).forEach((mmId) => {
        miniModuloParaUnidade[mmId] = u.id;
      });
    });

    const unidadesPorId = new Set(unidades.map((u) => u.id));
    const unidadesComAtividadeReal = new Set();
    const miniModulosComAtividade = new Set();

    (atividades || []).forEach(({ etapa_id: etapaId }) => {
      if (!etapaId || etapaId.startsWith('boas-vindas')) return;
      const [chave] = etapaId.split('#');
      if (miniModuloParaUnidade[chave]) {
        unidadesComAtividadeReal.add(miniModuloParaUnidade[chave]);
        miniModulosComAtividade.add(chave);
      } else if (unidadesPorId.has(chave)) {
        unidadesComAtividadeReal.add(chave);
      }
    });

    // 'licao' = fez de verdade (mini-módulo e/ou checkpoint); 'onboarding'
    // = o domínio salvo veio só do desafio de verificação (ver
    // BoasVindas.jsx) - a pessoa nunca abriu essa Unidade de verdade.
    const origemPorUnidade = Object.fromEntries(
      Object.keys(dominiosPorUnidade).map((id) => [
        id,
        unidadesComAtividadeReal.has(id) ? 'licao' : 'onboarding',
      ])
    );

    res.json({
      dominiosPorUnidade,
      classificacaoPorUnidade,
      recomendacaoPorUnidade,
      origemPorUnidade,
      miniModulosComAtividade: Array.from(miniModulosComAtividade),
      limiar: FilaDePendencias.LIMIAR_PADRAO,
    });
  } catch (err) {
    console.error('[GET /api/licao/perfis/:userId]', err);
    res.status(500).json({ error: 'Erro ao buscar perfis do aluno.' });
  }
});

/*
  Devolve a próxima Unidade que o aluno deveria estudar: uma pendência
  (Unidade já tentada e abaixo do limiar) tem prioridade sobre a
  próxima Unidade nova da sequência - ver FilaDePendencias.js.
 */
router.get('/proxima-unidade/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: perfis, error } = await supabase
      .from('perfis_aluno')
      .select('module_id, dominio')
      .eq('user_id', userId);

    if (error) throw error;

    const dominiosPorUnidade = Object.fromEntries(
      (perfis || []).map((p) => [p.module_id, p.dominio])
    );

    const proxima = FilaDePendencias.decidirProximaUnidade(unidades, dominiosPorUnidade);

    if (!proxima) {
      return res.json({ unidade: null, motivo: null, mensagem: 'Nada pendente - currículo concluído.' });
    }

    res.json(proxima);
  } catch (err) {
    console.error('[GET /api/licao/proxima-unidade/:userId]', err);
    res.status(500).json({ error: 'Erro ao calcular a próxima unidade.' });
  }
});

module.exports = router;