const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabaseClient');

// Salvar/atualizar progresso
router.post('/', async (req, res) => {
  const { usuario_id, licao_id, progress, completed } = req.body;

  if (!usuario_id || !licao_id) {
    return res.status(400).json({ error: 'usuario_id e licao_id são obrigatórios' });
  }

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

  if (error) return res.status(500).json({ error: error.message });
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

// Buscar progresso geral do usuário (para o dashboard)
router.get('/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  const { data: progressos, error } = await supabase
    .from('progresso_usuario')
    .select('*, licoes(title, emoji)')
    .eq('usuario_id', usuarioId);

  if (error) return res.status(500).json({ error: error.message });

  const { data: conquistas } = await supabase
    .from('conquistas')
    .select('*')
    .eq('usuario_id', usuarioId)
    .order('created_at', { ascending: false })
    .limit(4);

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