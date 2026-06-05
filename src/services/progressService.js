// progressService.js
// Serviço de progresso do CECI.
// Busca módulos (licoes) e progresso do aluno diretamente do Supabase.

import { supabase } from '../lib/supabaseClient';

// Busca todas as lições com o progresso do aluno mesclado.
// Retorna array no formato que Dashboard e ModuleCard esperam:
//   { id, title, emoji, progress, lessonCount, status }
export async function getUserModules(userId) {
  const { data: licoes, error: licaoErr } = await supabase
    .from('licoes')
    .select('id, title, emoji')
    .order('created_at', { ascending: true });

  if (licaoErr) throw new Error(licaoErr.message);
  if (!licoes?.length) return [];

  const { data: progresso, error: progErr } = await supabase
    .from('progresso_usuario')
    .select('licao_id, progress, completed')
    .eq('usuario_id', userId);

  if (progErr) throw new Error(progErr.message);

  const progressoMap = Object.fromEntries(
    (progresso || []).map((p) => [p.licao_id, p])
  );

  return licoes.map((licao, index) => {
    const reg = progressoMap[licao.id];
    const progressoAtual = reg?.progress ?? 0;
    const concluida = reg?.completed ?? false;

    let status;
    if (index === 0) {
      status = concluida ? 'inprogress' : 'featured';
    } else {
      const anterior = progressoMap[licoes[index - 1].id];
      status = anterior?.completed ? 'inprogress' : 'locked';
    }
    if (concluida) status = 'inprogress';

    return {
      id: licao.id,
      title: licao.title,
      emoji: licao.emoji || '📘',
      progress: progressoAtual,
      lessonCount: 10,
      status,
    };
  });
}

// Busca o progresso geral do aluno: pontos totais, meta diária e conquistas.
export async function getUserProgress(userId) {
  const { data: progresso } = await supabase
    .from('progresso_usuario')
    .select('progress, completed, updated_at')
    .eq('usuario_id', userId);

  const { data: conquistas } = await supabase
    .from('conquistas')
    .select('id, title')
    .eq('usuario_id', userId);

  const totalPoints = (progresso || []).reduce((acc, p) => acc + (p.progress || 0), 0);

  const hoje = new Date().toDateString();
  const dailyProgress = (progresso || []).filter(
    (p) => new Date(p.updated_at).toDateString() === hoje
  ).length;

  return {
    totalPoints,
    streak: 0,
    dailyProgress,
    achievements: (conquistas || []).map((c) => ({
      id: c.id,
      title: c.title,
      emoji: '🏆',
    })),
  };
}

// Atualiza (ou cria) o progresso de uma lição específica.
export async function updateProgress(licaoId, userId, progressData) {
  const { data, error } = await supabase
    .from('progresso_usuario')
    .upsert(
      {
        usuario_id: userId,
        licao_id: licaoId,
        ...progressData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'usuario_id,licao_id' }
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}