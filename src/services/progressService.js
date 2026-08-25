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

// Chave de armazenamento das datas de atividade do usuário
const ACTIVITY_STORAGE_KEY_PREFIX = 'ceci_activity_log_';

// Formata uma data para YYYY-MM-DD em fuso horário local
export function toLocalDateStr(dateInput) {
  if (!dateInput) return null;
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Registra atividade no dia de hoje para o usuário (login, acesso, exercício)
export function recordDailyActivity(userId) {
  if (!userId) return;
  try {
    const key = `${ACTIVITY_STORAGE_KEY_PREFIX}${userId}`;
    const today = toLocalDateStr(new Date());
    const stored = localStorage.getItem(key);
    let dates = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(dates)) dates = [];
    if (!dates.includes(today)) {
      dates.push(today);
      if (dates.length > 365) dates = dates.slice(-365);
      localStorage.setItem(key, JSON.stringify(dates));
    }
  } catch (err) {
    console.warn('Erro ao salvar data de atividade:', err);
  }
}

// Calcula a quantidade de dias consecutivos (streak)
export function calculateStreak(dateStrings) {
  if (!dateStrings || dateStrings.length === 0) return 0;
  const dateSet = new Set(dateStrings.filter(Boolean));

  const now = new Date();
  const todayStr = toLocalDateStr(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toLocalDateStr(yesterday);

  let streak = 0;
  let checkDate = new Date(now);

  if (dateSet.has(todayStr)) {
    // Se esteve ativo hoje, começa de hoje e retrocede dia a dia
    while (dateSet.has(toLocalDateStr(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else if (dateSet.has(yesterdayStr)) {
    // Se ainda não logou atividade hoje mas teve ontem, preserva a sequência ativa
    checkDate = yesterday;
    while (dateSet.has(toLocalDateStr(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  return streak;
}

// Busca o progresso geral do aluno: pontos totais, dias seguidos, meta diária e conquistas.
export async function getUserProgress(userId) {
  if (userId) {
    recordDailyActivity(userId);
  }

  const { data: progresso } = await supabase
    .from('progresso_usuario')
    .select('progress, completed, updated_at')
    .eq('usuario_id', userId);

  const { data: conquistas } = await supabase
    .from('conquistas')
    .select('id, title')
    .eq('usuario_id', userId);

  const totalPoints = (progresso || []).reduce((acc, p) => acc + (p.progress || 0), 0);

  const hoje = toLocalDateStr(new Date());
  const dailyProgress = (progresso || []).filter(
    (p) => toLocalDateStr(p.updated_at) === hoje
  ).length;

  // Reúne todas as datas de atividade: do Supabase + do log local
  const activityDates = new Set();
  (progresso || []).forEach((p) => {
    const dStr = toLocalDateStr(p.updated_at);
    if (dStr) activityDates.add(dStr);
  });

  if (userId) {
    try {
      const localDates = JSON.parse(localStorage.getItem(`${ACTIVITY_STORAGE_KEY_PREFIX}${userId}`) || '[]');
      if (Array.isArray(localDates)) {
        localDates.forEach((d) => activityDates.add(d));
      }
    } catch (e) {
      // ignore
    }
  }

  const streak = calculateStreak(Array.from(activityDates));

  return {
    totalPoints,
    streak,
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