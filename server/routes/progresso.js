const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabaseClient');
const requireAuth = require('../middleware/auth');

const { validate } = require('../middleware/validate');
const { salvarProgressoSchema, salvarConquistaSchema } = require('../lib/validationSchemas');

// Salvar/atualizar progresso
// Usa req.user.id do token autenticado, ignorando qualquer usuario_id vindo do body.
router.post('/', requireAuth, validate({ body: salvarProgressoSchema }), async (req, res) => {
  const usuario_id = req.user.id;
  const { licao_id, progress, completed } = req.body;

  const { data, error } = await supabase
    .from('progresso_usuario')
    .upsert({
      usuario_id,
      licao_id,
      progress: progress ?? 0,
      completed: completed ?? false,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'usuario_id,licao_id' })
    .select()
    .single();

  if (error) {
    console.error('[POST /api/progresso] Erro no Supabase ao salvar progresso:', error);
    return res.status(500).json({ error: 'Erro interno ao salvar progresso.' });
  }
  res.json({ success: true, data });
});

function calculateStreakFromDates(dates) {
  if (!dates || dates.length === 0) return 0;
  const toYMD = (d) => {
    const date = new Date(d);
    if (isNaN(date.getTime())) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const dateSet = new Set(dates.map(toYMD).filter(Boolean));
  const now = new Date();
  const todayStr = toYMD(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toYMD(yesterday);

  let streak = 0;
  let check = new Date(now);
  if (dateSet.has(todayStr)) {
    while (dateSet.has(toYMD(check))) {
      streak++;
      check.setDate(check.getDate() - 1);
    }
  } else if (dateSet.has(yesterdayStr)) {
    check = yesterday;
    while (dateSet.has(toYMD(check))) {
      streak++;
      check.setDate(check.getDate() - 1);
    }
  }
  return streak;
}

// Salvar/desbloquear conquista do usuário
// Usa req.user.id do token autenticado, ignorando qualquer usuario_id vindo do body.
router.post('/conquistas', requireAuth, validate({ body: salvarConquistaSchema }), async (req, res) => {
  const usuario_id = req.user.id;
  const { title } = req.body;
  const cleanTitle = title.trim();

  // Verifica se o usuário já tem essa conquista desbloqueada
  const { data: existente, error: findError } = await supabase
    .from('conquistas')
    .select('id, title, created_at')
    .eq('usuario_id', usuario_id)
    .ilike('title', cleanTitle)
    .maybeSingle();

  if (findError && findError.code !== 'PGRST116') {
    console.error('[POST /api/progresso/conquistas] Erro no Supabase ao verificar conquista existente:', findError);
    return res.status(500).json({ error: 'Erro interno ao verificar conquista.' });
  }

  if (existente) {
    return res.json({ success: true, alreadyUnlocked: true, data: existente });
  }

  const { data, error } = await supabase
    .from('conquistas')
    .insert({
      usuario_id,
      title: cleanTitle,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('[POST /api/progresso/conquistas] Erro no Supabase ao inserir conquista:', error);
    return res.status(500).json({ error: 'Erro interno ao salvar conquista.' });
  }
  res.json({ success: true, alreadyUnlocked: false, data });
});

// Buscar progresso geral do usuário (para o dashboard)
// Usa req.user.id do token autenticado, ignorando qualquer :usuarioId da URL.
router.get(['/:usuarioId', '/'], requireAuth, async (req, res) => {
  const usuarioId = req.user.id;

  const { data: progressos, error } = await supabase
    .from('progresso_usuario')
    .select('*, licoes(title, emoji)')
    .eq('usuario_id', usuarioId);

  if (error) {
    console.error('[GET /api/progresso] Erro no Supabase ao buscar progresso do usuário:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar progresso.' });
  }

  const { data: conquistas } = await supabase
    .from('conquistas')
    .select('*')
    .eq('usuario_id', usuarioId)
    .order('created_at', { ascending: false });

  const licoesConcluidas = progressos?.filter(p => p.completed).length || 0;
  const streak = calculateStreakFromDates(progressos?.map(p => p.updated_at) || []);

  const hoje = new Date().toDateString();
  const dailyProgress = (progressos || []).filter(
    (p) => new Date(p.updated_at).toDateString() === hoje
  ).length;

  res.json({
    licoesConcluidas,
    totalPoints: licoesConcluidas * 50,
    streak,
    coins: licoesConcluidas * 10,
    dailyProgress,
    achievements: (conquistas || []).map(c => ({
      id: c.id,
      title: c.title,
      emoji: '🏆',
    })),
    progressos: progressos || [],
  });
});

module.exports = router;