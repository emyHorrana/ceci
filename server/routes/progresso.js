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

  res.json({
    licoesConcluidas,
    totalPoints: licoesConcluidas * 50,
    streak: 0,          // futuramente calculado por data
    coins: licoesConcluidas * 10,
    dailyProgress: Math.min(licoesConcluidas, 10),
    achievements: (conquistas || []).map(c => ({
      id: c.id,
      title: c.title,
      emoji: '🏆',
    })),
    progressos: progressos || [],
  });
});

module.exports = router;