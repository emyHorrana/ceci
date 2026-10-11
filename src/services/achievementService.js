// achievementService.js
// Serviço responsável pela avaliação, verificação e desbloqueio de conquistas do CECI.
// Conecta o progresso real do aluno (lições concluídas, checkpoints, BKT, atividade diária)
// com o catálogo oficial de conquistas (data/conquistas.js).

import { CONQUISTAS, getConquistaInfo } from '../data/conquistas';
import { UNIDADES } from '../data/unidades';
import { MODULOS } from '../data/modulos';
import { salvarConquista, toLocalDateStr } from './progressService';
import { getPerfisAluno } from './algorithmService';
import { supabase } from '../lib/supabaseClient';
import { lerCheckpoints } from './checkpointService';

const ACTIVITY_STORAGE_KEY_PREFIX = 'ceci_activity_log_';
const COMPLETED_MINIMODULOS_KEY_PREFIX = 'ceci_minimodulos_completos_';

/**
 * Lê os mini-módulos concluídos registrados no localStorage.
 */
export function lerMiniModulosConcluidosLocais(userId) {
  if (!userId) return new Set();
  try {
    const key = `${COMPLETED_MINIMODULOS_KEY_PREFIX}${userId}`;
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

/**
 * Registra um mini-módulo como concluído no cache local do usuário.
 */
export function marcarMiniModuloConcluidoLocal(userId, miniModuloId) {
  if (!userId || !miniModuloId) return;
  try {
    const key = `${COMPLETED_MINIMODULOS_KEY_PREFIX}${userId}`;
    const existentes = lerMiniModulosConcluidosLocais(userId);
    existentes.add(miniModuloId);
    localStorage.setItem(key, JSON.stringify(Array.from(existentes)));
  } catch (err) {
    console.warn('Erro ao salvar mini-módulo concluído localmente:', err);
  }
}

/**
 * Verifica se uma Unidade específica foi concluída pelo aluno.
 * Critérios:
 * 1) Todos os seus mini-módulos foram concluídos no progresso_usuario ou localmente; OU
 * 2) O checkpoint da unidade foi superado com domínio estrito (dominou === true); OU
 * 3) O algoritmo BKT registrou domínio >= limiar.
 */
export function isUnidadeConcluida(unidade, {
  miniModulosConcluidos = new Set(),
  checkpoints = {},
  dominiosPorUnidade = {},
  origemPorUnidade = {},
  limiar = 0.5,
}) {
  if (!unidade) return false;

  // 1. Mini-módulos da unidade
  const miniIds = unidade.miniModuloIds || [];
  if (miniIds.length > 0 && miniIds.every((id) => miniModulosConcluidos.has(id))) {
    return true;
  }

  // 2. Checkpoint da unidade (estrito dominou === true)
  const cp = checkpoints[unidade.id];
  if (cp && cp.dominou === true) {
    return true;
  }

  // 3. Domínio BKT
  const dominio = dominiosPorUnidade[unidade.id];
  if (dominio !== undefined && dominio !== null && dominio >= limiar) {
    return true;
  }

  return false;
}

/**
 * Verifica se um Módulo completo foi concluído pelo aluno.
 * (Todos as unidades do módulo foram concluídas).
 */
export function isModuloConcluido(moduloId, context) {
  const unidadesDoModulo = UNIDADES.filter((u) => u.moduloId === String(moduloId));
  if (unidadesDoModulo.length === 0) return false;

  return unidadesDoModulo.every((u) => isUnidadeConcluida(u, context));
}

/**
 * Avalia o catálogo completo de conquistas para o usuário e determina
 * quais devem estar desbloqueadas.
 *
 * @param {Object} params
 * @param {string} params.userId
 * @param {Object} [params.user]
 * @param {Array}  [params.progressoUsuario]
 * @param {Array}  [params.conquistasAtuais]
 * @param {Object} [params.dominiosPorUnidade]
 * @param {Object} [params.origemPorUnidade]
 * @param {Array}  [params.miniModulosComAtividade]
 * @param {number} [params.streak]
 * @returns {Array<string>} Lista dos IDs das conquistas elegíveis para desbloqueio
 */
export function avaliarConquistas({
  userId,
  user,
  progressoUsuario = [],
  dominiosPorUnidade = {},
  origemPorUnidade = {},
  miniModulosComAtividade = [],
  streak = 0,
  checkpoints: checkpointsParam = null,
}) {
  if (!userId) return [];

  // Reúne todos os mini-módulos concluídos (do Supabase + localStorage + atividade adaptativa)
  const miniModulosConcluidos = lerMiniModulosConcluidosLocais(userId);
  (progressoUsuario || []).forEach((p) => {
    if (p.completed || (p.progress && p.progress >= 100)) {
      if (p.licao_id) miniModulosConcluidos.add(p.licao_id);
    }
  });
  (miniModulosComAtividade || []).forEach((id) => {
    if (id) miniModulosConcluidos.add(id);
  });

  const checkpoints = checkpointsParam || lerCheckpoints(userId);

  const evalContext = {
    miniModulosConcluidos,
    checkpoints,
    dominiosPorUnidade,
    origemPorUnidade,
    limiar: 0.5,
  };

  // Reúne datas de atividade para a conquista "Resiliência é a chave"
  const activityDates = new Set();
  (progressoUsuario || []).forEach((p) => {
    const dStr = toLocalDateStr(p.updated_at);
    if (dStr) activityDates.add(dStr);
  });
  try {
    const localDates = JSON.parse(
      localStorage.getItem(`${ACTIVITY_STORAGE_KEY_PREFIX}${userId}`) || '[]'
    );
    if (Array.isArray(localDates)) {
      localDates.forEach((d) => activityDates.add(d));
    }
  } catch (e) {
    // ignore
  }

  const hoje = toLocalDateStr(new Date());
  if (hoje) activityDates.add(hoje);

  // Data do primeiro contato (data de criação da conta ou primeira atividade)
  let dataPrimeiroContato = null;
  if (user?.created_at) {
    dataPrimeiroContato = toLocalDateStr(user.created_at);
  }
  if (!dataPrimeiroContato && activityDates.size > 0) {
    const sorted = Array.from(activityDates).sort();
    dataPrimeiroContato = sorted[0];
  }

  const elegiveis = [];

  // 1. Primeiros Passos: Concluir o cadastro
  // Se o usuário possui userId (autenticado no sistema), concluiu o cadastro.
  if (userId) {
    elegiveis.push('primeiros-passos');
  }

  // 2. Terminar a primeira unidade: Concluir a primeira unidade de uma lição
  const algumaUnidadeConcluida = UNIDADES.some((u) => isUnidadeConcluida(u, evalContext));
  if (algumaUnidadeConcluida) {
    elegiveis.push('primeira-unidade');
  }

  // 3. Resiliência é a chave: Voltar à plataforma em dia diferente do primeiro contato
  const voltouEmOutroDia =
    activityDates.size >= 2 ||
    streak >= 2 ||
    (dataPrimeiroContato && dataPrimeiroContato < hoje && activityDates.has(hoje));

  if (voltouEmOutroDia) {
    elegiveis.push('resiliencia-e-a-chave');
  }

  // 4. No controle!: Conclusão do módulo de mouse (Módulo 1)
  const modulo1Concluido = isModuloConcluido('1', evalContext);
  if (modulo1Concluido) {
    elegiveis.push('no-controle');
  }

  // 5. Pronto para digitar: Conclusão do módulo de teclado (Módulo 2)
  const modulo2Concluido = isModuloConcluido('2', evalContext);
  if (modulo2Concluido) {
    elegiveis.push('pronto-para-digitar');
  }

  // 6. Conhecendo meu computador: Conclusão do módulo de hardware (Módulo 3)
  const modulo3Concluido = isModuloConcluido('3', evalContext);
  if (modulo3Concluido) {
    elegiveis.push('conhecendo-meu-computador');
  }

  // 7. Explorador Iniciante: Domínio dos 3 primeiros módulos básicos
  if (modulo1Concluido && modulo2Concluido && modulo3Concluido) {
    elegiveis.push('explorador-iniciante');
  }

  return elegiveis;
}

/**
 * Avalia e sincroniza as conquistas do usuário, persistindo as que ainda
 * não foram salvas e retornando as recém-desbloqueadas para feedback visual.
 *
 * @param {string} userId
 * @param {Object} [user]
 * @param {Object} [dadosAtuais]
 * @returns {Promise<{ recemDesbloqueadas: Array, todasConquistas: Array }>}
 */
export async function sincronizarProgressoEConquistas(userId, user = null, dadosAtuais = {}) {
  if (!userId) {
    return { recemDesbloqueadas: [], todasConquistas: [] };
  }

  try {
    // 1. Busca dados necessários se não fornecidos
    let progressoUsuario = dadosAtuais.progressoUsuario;
    let conquistasExistentes = dadosAtuais.achievements;
    let streak = dadosAtuais.streak ?? 0;
    let dominiosPorUnidade = dadosAtuais.dominiosPorUnidade || {};
    let origemPorUnidade = dadosAtuais.origemPorUnidade || {};
    let miniModulosComAtividade = dadosAtuais.miniModulosComAtividade || [];

    if (!progressoUsuario || !conquistasExistentes) {
      const [resProg, resConq] = await Promise.all([
        supabase
          .from('progresso_usuario')
          .select('licao_id, progress, completed, updated_at')
          .eq('usuario_id', userId),
        supabase
          .from('conquistas')
          .select('id, title, created_at')
          .eq('usuario_id', userId),
      ]);

      progressoUsuario = resProg.data || [];
      conquistasExistentes = resConq.data || [];
    }

    // Se ainda não temos dados do BKT, tenta buscar
    if (Object.keys(dominiosPorUnidade).length === 0) {
      try {
        const bktPerfis = await getPerfisAluno(userId);
        if (bktPerfis) {
          dominiosPorUnidade = bktPerfis.dominiosPorUnidade || {};
          origemPorUnidade = bktPerfis.origemPorUnidade || {};
          miniModulosComAtividade = bktPerfis.miniModulosComAtividade || [];
        }
      } catch (err) {
        // Fallback gracioso se backend BKT estiver inacessível
      }
    }

    // Títulos de conquistas já desbloqueadas no banco
    const titulosJaSalvos = new Set(
      (conquistasExistentes || [])
        .map((c) => (c.title || c.titulo || '').trim().toLowerCase())
        .filter(Boolean)
    );

    let checkpoints = dadosAtuais.checkpoints || lerCheckpoints(userId);

    // 2. Avalia quais conquistas o usuário atinge
    const idsElegiveis = avaliarConquistas({
      userId,
      user,
      progressoUsuario,
      dominiosPorUnidade,
      origemPorUnidade,
      miniModulosComAtividade,
      streak,
      checkpoints,
    });

    const recemDesbloqueadas = [];
    const promessasSalvar = [];

    for (const id of idsElegiveis) {
      const info = getConquistaInfo(id);
      if (!info) continue;

      const jaDesbloqueada = titulosJaSalvos.has(info.titulo.trim().toLowerCase());
      if (!jaDesbloqueada) {
        recemDesbloqueadas.push(info);
        titulosJaSalvos.add(info.titulo.trim().toLowerCase());
        promessasSalvar.push(salvarConquista(userId, info.titulo));
      }
    }

    // Salva novas conquistas de forma paralela e resiliente
    if (promessasSalvar.length > 0) {
      await Promise.allSettled(promessasSalvar);
    }

    // 3. Monta a lista completa de conquistas desbloqueadas
    const todasConquistas = CONQUISTAS.filter((c) =>
      titulosJaSalvos.has(c.titulo.trim().toLowerCase())
    ).map((c) => ({
      id: c.id,
      title: c.titulo,
      emoji: c.emoji,
      motivo: c.motivo,
      tipo: c.tipo,
    }));

    return {
      recemDesbloqueadas,
      todasConquistas,
    };
  } catch (err) {
    console.error('Erro ao sincronizar conquistas:', err);
    return { recemDesbloqueadas: [], todasConquistas: [] };
  }
}
