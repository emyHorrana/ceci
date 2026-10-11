// laboratorioService.js
// Serviço que gerencia o desbloqueio pedagógico dos treinos do Laboratório.
// Conecta a conclusão de aulas teóricas e diagnósticos do algoritmo adaptativo
// à liberação dos modos de prática livre (mouse e teclado).

import { UNIDADES } from '../data/unidades';
import { isAdmin } from '../utils/roles';
import { isModuloConcluido, lerMiniModulosConcluidosLocais } from './achievementService';
import { getPerfisAluno } from './algorithmService';
import { supabase } from '../lib/supabaseClient';
import { lerCheckpoints } from './checkpointService';

const LAB_UNLOCKED_PREFIX = 'ceci_lab_unlocked_';
const LAB_NOTIFIED_PREFIX = 'ceci_lab_notified_';
const LAB_TEORIA_PREFIX = 'ceci_lab_teoria_';

export const MODOS_LABORATORIO = [
  {
    id: 'mouse',
    label: 'Mira com o mouse',
    emoji: '🎯',
    categoria: 'mouse',
    miniModuloRequisito: '1-2', // Movimento do cursor
    unidadeRequisito: 'U1.1',   // Fundamentos do mouse
    tituloAula: 'Movimento do cursor',
    rotaAula: '/mini-modulo/1-2',
    descricaoDesbloqueio: 'Você concluiu a teoria de movimento do cursor e liberou a Mira com o mouse no Laboratório!',
  },
  {
    id: 'arrastar',
    label: 'Arrastar e soltar',
    emoji: '🛋️',
    categoria: 'mouse',
    miniModuloRequisito: '1-5', // Arrastar e soltar
    unidadeRequisito: 'U1.2',   // Cliques com timing
    tituloAula: 'Arrastar e soltar',
    rotaAula: '/mini-modulo/1-5',
    descricaoDesbloqueio: 'Você aprendeu a segurar e soltar itens e liberou o treino de Arrastar e Soltar no Laboratório!',
  },
  {
    id: 'desenho',
    label: 'Desenho livre',
    emoji: '🎨',
    categoria: 'mouse',
    miniModuloRequisito: '1-6', // Coordenação e precisão
    unidadeRequisito: 'U1.3',   // Rolagem e precisão
    tituloAula: 'Coordenação e precisão',
    rotaAula: '/mini-modulo/1-6',
    descricaoDesbloqueio: 'Você concluiu a aula de coordenação e precisão e liberou o Desenho Livre no Laboratório!',
  },
  {
    id: 'teclado',
    label: 'Tecla certa',
    emoji: '⌨️',
    categoria: 'teclado',
    miniModuloRequisito: '2-1', // Reconhecendo o teclado (identificação de teclas)
    unidadeRequisito: 'U2.1',   // Fundamentos do teclado
    tituloAula: 'Reconhecendo o teclado',
    rotaAula: '/mini-modulo/2-1',
    descricaoDesbloqueio: 'Você aprendeu a identificar as teclas e liberou o treino de Tecla Certa no Laboratório!',
  },
  {
    id: 'dedos',
    label: 'Treino de dedos',
    emoji: '🖐️',
    categoria: 'teclado',
    moduloRequisito: '2',       // Todo o módulo de teclado
    miniModuloRequisito: '2-14',// Atalhos básicos (conclusão do módulo)
    unidadeRequisito: 'U2.7',   // Última unidade do teclado
    tituloAula: 'Tudo sobre Teclado',
    rotaAula: '/modulos',
    descricaoDesbloqueio: 'Parabéns por dominar todo o teclado! O Treino de Dedos completo foi liberado no Laboratório.',
  },
];

/**
 * Lê os modos de laboratório desbloqueados no cache local.
 */
export function lerModosDesbloqueadosLocais(userId) {
  const id = userId || 'convidado';
  try {
    const raw = localStorage.getItem(`${LAB_UNLOCKED_PREFIX}${id}`);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

/**
 * Salva um modo de laboratório como desbloqueado no cache local.
 */
export function salvarModoDesbloqueadoLocal(userId, modoId) {
  if (!modoId) return;
  const id = userId || 'convidado';
  try {
    const set = lerModosDesbloqueadosLocais(id);
    set.add(modoId);
    localStorage.setItem(`${LAB_UNLOCKED_PREFIX}${id}`, JSON.stringify(Array.from(set)));
  } catch (err) {
    console.warn('Erro ao salvar modo de lab desbloqueado localmente:', err);
  }
}

/**
 * Lê os modos de laboratório já notificados ao usuário.
 */
export function lerModosNotificadosLocais(userId) {
  const id = userId || 'convidado';
  try {
    const raw = localStorage.getItem(`${LAB_NOTIFIED_PREFIX}${id}`);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

/**
 * Salva um modo de laboratório como já notificado ao usuário.
 */
export function marcarModoNotificadoLocal(userId, modoId) {
  if (!modoId) return;
  const id = userId || 'convidado';
  try {
    const set = lerModosNotificadosLocais(id);
    set.add(modoId);
    localStorage.setItem(`${LAB_NOTIFIED_PREFIX}${id}`, JSON.stringify(Array.from(set)));
  } catch (err) {
    console.warn('Erro ao salvar modo notificado localmente:', err);
  }
}

/**
 * Lê os mini-módulos cuja parte teórica já foi concluída.
 */
export function lerTeoriasConcluidasLocais(userId) {
  const id = userId || 'convidado';
  try {
    const raw = localStorage.getItem(`${LAB_TEORIA_PREFIX}${id}`);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

/**
 * Salva a conclusão da teoria de um mini-módulo no cache local.
 */
export function salvarTeoriaConcluidaLocal(userId, miniModuloId) {
  if (!miniModuloId) return;
  const id = userId || 'convidado';
  try {
    const set = lerTeoriasConcluidasLocais(id);
    set.add(String(miniModuloId));
    localStorage.setItem(`${LAB_TEORIA_PREFIX}${id}`, JSON.stringify(Array.from(set)));
  } catch (err) {
    console.warn('Erro ao salvar teoria concluída localmente:', err);
  }
}

/**
 * Registra a conclusão da parte teórica de uma aula e dispara a notificação
 * de desbloqueio para os modos correspondentes do laboratório.
 */
export async function registrarConclusaoTeoria(userId, miniModuloId, user = null, checkAchievements = null) {
  if (!miniModuloId) return [];
  salvarTeoriaConcluidaLocal(userId, miniModuloId);

  if (typeof checkAchievements === 'function' && userId) {
    try {
      return await checkAchievements(userId, user);
    } catch (err) {
      console.warn('Erro ao verificar conquistas após conclusão de teoria:', err);
    }
  }

  if (userId) {
    return await verificarNovosDesbloqueiosLaboratorio(userId, user);
  }
  return [];
}

/**
 * Avalia se um modo de laboratório específico está desbloqueado.
 * 
 * Regras pedagógicas:
 * 1. ADM: tudo liberado por padrão.
 * 2. Comprovou pelo algoritmo adaptativo que não precisa das partes teóricas:
 *    - Se comprovou mouse no onboarding / BKT: mira, arrastar e desenho ficam todos desbloqueados.
 *    - Se comprovou teclado no onboarding / BKT: tecla certa e treino de dedos ficam desbloqueados.
 *    - Se comprovou ambos: todos os 5 modos desbloqueados por padrão.
 * 3. Passou pela aula teórica correspondente (ou concluiu o mini-módulo):
 *    - 'mouse': teoria de movimento do cursor (1-2) ou U1.1.
 *    - 'arrastar': teoria de arrastar e soltar (1-5) ou U1.2.
 *    - 'desenho': teoria de coordenação e precisão (1-6) ou U1.3.
 *    - 'teclado': teoria de reconhecimento de teclas (2-1) ou U2.1.
 *    - 'dedos': todo o teclado concluído (módulo 2 ou 2-14/2-15) ou U2.7.
 */
export function isModoLaboratorioDesbloqueado(modoId, {
  userId,
  user,
  miniModulosConcluidos = new Set(),
  teoriasConcluidas = null,
  checkpoints = {},
  dominiosPorUnidade = {},
  origemPorUnidade = {},
  modosDesbloqueadosLocais = null,
  limiar = 0.5,
} = {}) {
  // 1. Conta ADM: tudo liberado sempre
  if (user && isAdmin(user)) {
    return true;
  }

  const modosLocais = modosDesbloqueadosLocais || lerModosDesbloqueadosLocais(userId);
  if (modosLocais.has(modoId)) {
    return true;
  }

  const modo = MODOS_LABORATORIO.find((m) => m.id === modoId);
  if (!modo) return false;

  const teorias = teoriasConcluidas || lerTeoriasConcluidasLocais(userId);

  const evalContext = {
    miniModulosConcluidos,
    checkpoints,
    dominiosPorUnidade,
    origemPorUnidade,
    limiar,
  };

  // 2. Comprovou pelo algoritmo que não precisa passar pelas partes teóricas
  // Verificação de Mouse e Teclado no algoritmo / onboarding (U1.1 / U2.1 marcadas como onboarding ou domínio alto)
  let onboardingLocal = null;
  try {
    onboardingLocal = JSON.parse(localStorage.getItem('ceci_onboarding') || '{}');
  } catch {
    // Fallback silencioso caso localStorage não esteja acessível
  }

  const mouseComprovadoPorAlgoritmo =
    origemPorUnidade['U1.1'] === 'onboarding' ||
    (dominiosPorUnidade['U1.1'] !== undefined && dominiosPorUnidade['U1.1'] !== null && dominiosPorUnidade['U1.1'] >= limiar) ||
    Boolean(checkpoints['U1.1']?.dominou) ||
    Boolean(onboardingLocal?.verificacao_mouse_confirmada) ||
    isModuloConcluido('1', evalContext);

  const tecladoComprovadoPorAlgoritmo =
    origemPorUnidade['U2.1'] === 'onboarding' ||
    (dominiosPorUnidade['U2.1'] !== undefined && dominiosPorUnidade['U2.1'] !== null && dominiosPorUnidade['U2.1'] >= limiar) ||
    Boolean(checkpoints['U2.1']?.dominou) ||
    Boolean(onboardingLocal?.verificacao_teclado_confirmada) ||
    isModuloConcluido('2', evalContext);

  if (modo.categoria === 'mouse' && mouseComprovadoPorAlgoritmo) {
    return true;
  }

  if (modo.categoria === 'teclado' && tecladoComprovadoPorAlgoritmo) {
    return true;
  }

  // 3. Critério para Treino de Dedos: após tudo sobre teclado
  if (modoId === 'dedos') {
    if (tecladoComprovadoPorAlgoritmo) return true;

    const unidadesTeclado = UNIDADES.filter((u) => u.moduloId === '2');
    const todasUnidadesTecladoDominadas = unidadesTeclado.every((u) => {
      if (origemPorUnidade[u.id] === 'onboarding') return true;
      const d = dominiosPorUnidade[u.id];
      return d !== undefined && d !== null && d >= limiar;
    });
    if (todasUnidadesTecladoDominadas) return true;

    if (isModuloConcluido('2', evalContext)) return true;
    if (miniModulosConcluidos.has('2-14') || teorias.has('2-14')) return true;
    if (miniModulosConcluidos.has('2-15') || teorias.has('2-15')) return true;

    return false;
  }

  // 4. Critério para os outros modos:
  // A. Comprovou pelo algoritmo adaptativo da unidade específica
  if (modo.unidadeRequisito) {
    const unid = modo.unidadeRequisito;
    if (origemPorUnidade[unid] === 'onboarding') return true;
    const dom = dominiosPorUnidade[unid];
    if (dom !== undefined && dom !== null && dom >= limiar) return true;
    if (checkpoints[unid]?.dominou) return true;
  }

  // B. Passou pela parte teórica do jogo (ou concluiu o mini-módulo)
  if (modo.miniModuloRequisito) {
    if (teorias.has(modo.miniModuloRequisito)) return true;
    if (miniModulosConcluidos.has(modo.miniModuloRequisito)) return true;
  }

  return false;
}

/**
 * Retorna o mapa de status de todos os 5 modos do Laboratório:
 * { [modoId]: { desbloqueado: boolean, info: Object } }
 */
export function obterStatusModosLaboratorio({
  userId,
  user,
  progressoUsuario = [],
  dominiosPorUnidade = {},
  origemPorUnidade = {},
  miniModulosComAtividade = [],
  checkpoints = null,
} = {}) {
  const miniModulosConcluidos = lerMiniModulosConcluidosLocais(userId);
  (progressoUsuario || []).forEach((p) => {
    if (p.completed || (p.progress && p.progress >= 100)) {
      if (p.licao_id) miniModulosConcluidos.add(String(p.licao_id));
    }
  });
  (miniModulosComAtividade || []).forEach((id) => {
    if (id) miniModulosConcluidos.add(String(id));
  });

  const modosDesbloqueadosLocais = lerModosDesbloqueadosLocais(userId);
  const teoriasConcluidas = lerTeoriasConcluidasLocais(userId);
  const cps = (checkpoints && Object.keys(checkpoints).length > 0) ? checkpoints : (userId ? lerCheckpoints(userId) : {});

  const context = {
    userId,
    user,
    miniModulosConcluidos,
    teoriasConcluidas,
    checkpoints: cps,
    dominiosPorUnidade,
    origemPorUnidade,
    modosDesbloqueadosLocais,
    limiar: 0.5,
  };

  const status = {};
  MODOS_LABORATORIO.forEach((m) => {
    const desbloqueado = isModoLaboratorioDesbloqueado(m.id, context);
    status[m.id] = {
      desbloqueado,
      info: m,
    };
  });

  return status;
}

/**
 * Verifica se novas atividades do laboratório foram desbloqueadas e devem
 * gerar notificação celebratória para o usuário.
 *
 * @param {string} userId
 * @param {Object} [user]
 * @param {Object} [dadosAtuais]
 * @returns {Promise<Array>} Lista de objetos de notificação para os modos recém-desbloqueados
 */
export async function verificarNovosDesbloqueiosLaboratorio(userId, user = null, dadosAtuais = {}) {
  if (!userId) return [];

  try {
    let progressoUsuario = dadosAtuais.progressoUsuario;
    let dominiosPorUnidade = dadosAtuais.dominiosPorUnidade || {};
    let origemPorUnidade = dadosAtuais.origemPorUnidade || {};
    let miniModulosComAtividade = dadosAtuais.miniModulosComAtividade || [];
    let checkpoints = dadosAtuais.checkpoints || (userId ? lerCheckpoints(userId) : {});

    if (!progressoUsuario) {
      const { data: resProg } = await supabase
        .from('progresso_usuario')
        .select('licao_id, progress, completed, updated_at')
        .eq('usuario_id', userId);
      progressoUsuario = resProg || [];
    }

    if (Object.keys(dominiosPorUnidade).length === 0) {
      try {
        const perfis = await getPerfisAluno(userId);
        if (perfis) {
          dominiosPorUnidade = perfis.dominiosPorUnidade || {};
          origemPorUnidade = perfis.origemPorUnidade || {};
          miniModulosComAtividade = perfis.miniModulosComAtividade || [];
        }
      } catch {
        // Fallback gracioso
      }
    }

    const statusModos = obterStatusModosLaboratorio({
      userId,
      user,
      progressoUsuario,
      dominiosPorUnidade,
      origemPorUnidade,
      miniModulosComAtividade,
      checkpoints,
    });

    const jaNotificados = lerModosNotificadosLocais(userId);
    const notificacoes = [];

    // Checa se o usuário comprovou pelo algoritmo no onboarding
    const mouseComprovadoOnboarding = origemPorUnidade['U1.1'] === 'onboarding';
    const tecladoComprovadoOnboarding = origemPorUnidade['U2.1'] === 'onboarding';

    MODOS_LABORATORIO.forEach((m) => {
      const { desbloqueado } = statusModos[m.id];
      if (desbloqueado) {
        salvarModoDesbloqueadoLocal(userId, m.id);

        if (!jaNotificados.has(m.id)) {
          marcarModoNotificadoLocal(userId, m.id);

          // Se o usuário comprovou pelo algoritmo no onboarding, os jogos
          // se mantêm desbloqueados por padrão sem gerar a notificação de
          // "você concluiu a teoria" (já que ele não precisou passar pela teoria).
          const veioDeOnboarding =
            (m.categoria === 'mouse' && mouseComprovadoOnboarding) ||
            (m.categoria === 'teclado' && tecladoComprovadoOnboarding);

          if (!veioDeOnboarding) {
            notificacoes.push({
              id: `lab-${m.id}`,
              categoria: 'laboratorio',
              tipo: 'Laboratório',
              titulo: `Treino Liberado: ${m.label}`,
              motivo: m.descricaoDesbloqueio,
              emoji: m.emoji,
              barraTitulo: 'Novo Treino no Laboratório! 🧪',
              barraIcone: '🧪',
              botaoLabel: 'Ir para o Laboratório',
              destino: `/laboratorio?modo=${m.id}`,
            });
          }
        }
      }
    });

    return notificacoes;
  } catch (err) {
    console.warn('Erro ao verificar desbloqueios do Laboratório:', err);
    return [];
  }
}
