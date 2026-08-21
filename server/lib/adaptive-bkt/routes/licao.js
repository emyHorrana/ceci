const express = require('express');
const router = express.Router();
const supabaseModule = require('../../supabaseClient');
const supabase = supabaseModule.supabase || supabaseModule;
const { BKTAdaptativo, FilaDePendencias, Classificador } = require('../index');
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
  Devolve o domínio (L do BKT) e a classificação categórica (Iniciante/Básico/Intermediário/Avançado)
  de TODAS as Unidades já tentadas pelo aluno.
 */
router.get('/perfis/:userId', async (req, res) => {
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

    const classificacaoPorUnidade = Object.fromEntries(
      (perfis || []).map((p) => [p.module_id, Classificador.classificar(p.dominio)])
    );

    res.json({ dominiosPorUnidade, classificacaoPorUnidade, limiar: FilaDePendencias.LIMIAR_PADRAO });
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