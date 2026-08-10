const express = require('express');
const router = express.Router();
const supabaseModule = require('../../supabaseClient');
const supabase = supabaseModule.supabase || supabaseModule;
const { BKTAdaptativo } = require('../index');

router.post('/responder', async (req, res) => {
  try {
    const {
      correto,
      dadosEvento,
      tempoIdeal,
      tentativas,
      tentativasAposErro,
      moduleId,
      biasModulo,
    } = req.body;

    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado (userId ausente).' });
    }
    if (!moduleId) {
      return res.status(400).json({ error: 'moduleId é obrigatório.' });
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
    });

    res.json(resultado);
  } catch (err) {
    console.error('[POST /api/licao/responder]', err);
    res.status(500).json({ error: 'Erro ao processar resposta.' });
  }
});

module.exports = router;