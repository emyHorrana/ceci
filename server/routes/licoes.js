const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabaseClient');
const requireAuth = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { licaoIdParamSchema } = require('../lib/validationSchemas');

// Listar todas as lições com progresso do usuário autenticado
// Ignora usuario_id da query e utiliza req.user.id do token autenticado.
router.get('/', requireAuth, async (req, res) => {
  const usuario_id = req.user.id;

  const { data: licoes, error: licaoError } = await supabase
    .from('licoes')
    .select('*')
    .order('created_at');

  if (licaoError) {
    console.error('[GET /api/licoes] Erro no Supabase ao listar lições:', licaoError);
    return res.status(500).json({ error: 'Erro interno ao buscar lições.' });
  }

  // Busca o progresso do usuário logado
  let progressos = [];
  if (usuario_id) {
    const { data } = await supabase
      .from('progresso_usuario')
      .select('*')
      .eq('usuario_id', usuario_id);
    progressos = data || [];
  }

  const result = licoes.map((licao, index) => {
    const prog = progressos.find(p => p.licao_id === licao.id);
    const prevCompleted = index === 0 ||
      progressos.find(p => p.licao_id === licoes[index - 1]?.id && p.completed);

    return {
      id: licao.id,
      title: licao.title,
      description: licao.description,
      emoji: licao.emoji || '📘',
      progress: prog?.progress || 0,
      lessonCount: 10,
      completed: prog?.completed || false,
      status: prog?.completed   ? 'featured'
            : (prevCompleted || index === 0) ? 'inprogress'
            : 'locked',
    };
  });

  res.json(result);
});

// Buscar etapas de uma lição específica
router.get('/:id/etapas', requireAuth, validate({ params: licaoIdParamSchema }), async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('etapas')
    .select('*')
    .eq('licao_id', id)
    .order('ordem');

  if (error) {
    console.error('[GET /api/licoes/:id/etapas] Erro no Supabase:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar etapas da lição.' });
  }
  res.json(data);
});

// Marcar lição como concluída
// Usa req.user.id do token autenticado, ignorando qualquer usuario_id vindo do body.
router.post('/:id/concluir', requireAuth, validate({ params: licaoIdParamSchema }), async (req, res) => {
  const { id } = req.params;
  const usuario_id = req.user.id;

  const { data, error } = await supabase
    .from('progresso_usuario')
    .upsert({
      usuario_id,
      licao_id: id,
      completed: true,
      progress: 100,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'usuario_id,licao_id' })
    .select()
    .single();

  if (error) {
    console.error('[POST /api/licoes/:id/concluir] Erro no Supabase:', error);
    return res.status(500).json({ error: 'Erro interno ao registrar conclusão da lição.' });
  }
  res.json({ success: true, data });
});

module.exports = router;