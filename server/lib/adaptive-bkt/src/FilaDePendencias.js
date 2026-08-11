// server/lib/adaptive-bkt/src/FilaDePendencias.js
// -----------------------------------------
//
// Não depende de Supabase, só recebe os
// domínios já calculados (o `dominio`/L que o BKTAdaptativo devolve) e
// devolve decisões. Isso é o que permite construir essa peça agora,
// mesmo sem a decisão de persistência estar fechada.

const LIMIAR_PADRAO = 0.5;

/**
 * Monta um lookup rápido id -> unidade, pra consultar `temJogo` sem
 * precisar de find() repetido dentro dos filtros abaixo.
 */
function indexarPorId(unidades) {
  return Object.fromEntries(unidades.map((u) => [u.id, u]));
}

/**
 * Uma unidade está "pendente" se JÁ TEM JOGO, já foi tentada e ficou
 * abaixo do limiar. Unidades sem jogo (`temJogo: false`) nunca entram
 * na fila de pendência, não existe sinal nenhum pra avaliar ainda.
 */
function estaPendente(unidadeId, dominiosPorUnidade, limiar, unidadesPorId) {
  const unidade = unidadesPorId[unidadeId];
  if (unidade && unidade.temJogo === false) return false;
  const d = dominiosPorUnidade[unidadeId];
  return d !== undefined && d !== null && d < limiar;
}

/**
 * Uma unidade está "dominada" (satisfaz pré-requisito de outra) se:
 * - não tem jogo (`temJogo: false`) -> conta como satisfeita automaticamente, ou
 * - tem jogo E já foi tentada com domínio no limiar ou acima.
 */
function estaDominada(unidadeId, dominiosPorUnidade, limiar, unidadesPorId) {
  const unidade = unidadesPorId[unidadeId];
  if (unidade && unidade.temJogo === false) return true;
  const d = dominiosPorUnidade[unidadeId];
  return d !== undefined && d !== null && d >= limiar;
}

/**
 * Monta o backlog completo de pendências, separando as que já podem ser
 * atacadas agora (pré-requisitos OK) das que estão bloqueadas esperando
 * outra pendência ser resolvida primeiro.
 *
 * @param {Array} unidades              a lista estática (data/unidades.js)
 * @param {Object} dominiosPorUnidade   { 'U1.1': 0.82, 'U1.2': 0.31, ... }  unidades nunca tentadas simplesmente não aparecem aqui
 * @param {number} limiar               domínio mínimo pra considerar "dominado" (padrão 0.5 ( podemos mudar isso ali em cima))
 */
function montarBacklog(unidades, dominiosPorUnidade, limiar = LIMIAR_PADRAO) {
  const unidadesPorId = indexarPorId(unidades);
  // só unidades com jogo entram como candidatas, as sem jogo são transparentes
  const comJogo = unidades.filter((u) => u.temJogo !== false);
  const pendentes = comJogo.filter((u) => estaPendente(u.id, dominiosPorUnidade, limiar, unidadesPorId));

  const elegiveis = pendentes.filter(
    (u) => !u.prerequisitos.some((pid) => estaPendente(pid, dominiosPorUnidade, limiar, unidadesPorId))
  );
  const bloqueadas = pendentes.filter((u) =>
    u.prerequisitos.some((pid) => estaPendente(pid, dominiosPorUnidade, limiar, unidadesPorId))
  );

  const porTierEOrdem = (a, b) => a.tier - b.tier || a.ordem - b.ordem;
  elegiveis.sort(porTierEOrdem);
  bloqueadas.sort(porTierEOrdem);

  return { elegiveis, bloqueadas };
}

/**
 * Decide a PRÓXIMA unidade a apresentar ao aluno. Prioridade:
 *   1) uma pendência elegível (tier mais baixo primeiro)
 *   2) se não há pendência nenhuma, a próxima unidade nova na sequência
 *      normal (nunca tentada, com pré-requisitos já dominados)
 *   3) null se não sobrou nada (tudo dominado, nada pendente)
 *
 * @returns {{ unidade: object, motivo: 'reforco'|'nova' } | null}
 */
function decidirProximaUnidade(unidades, dominiosPorUnidade, limiar = LIMIAR_PADRAO) {
  const unidadesPorId = indexarPorId(unidades);
  const { elegiveis } = montarBacklog(unidades, dominiosPorUnidade, limiar);
  if (elegiveis.length > 0) {
    return { unidade: elegiveis[0], motivo: 'reforco' };
  }

  // só unidades com jogo passam pela decisão adaptativa (A parte teórica não faz aplicar isso) as sem jogo
  // (temJogo: false) continuam existindo no currículo, mas a navegação
  // por elas é a ordem simples de sempre, fora do algoritmo
  const comJogo = unidades.filter((u) => u.temJogo !== false);
  const naoTentadas = comJogo.filter((u) => dominiosPorUnidade[u.id] === undefined);
  const prontas = naoTentadas.filter(
    (u) => !u.prerequisitos.some((pid) => !estaDominada(pid, dominiosPorUnidade, limiar, unidadesPorId))
  );
  if (prontas.length === 0) return null;

  const porTierEOrdem = (a, b) => a.tier - b.tier || a.ordem - b.ordem;
  prontas.sort(porTierEOrdem);
  return { unidade: prontas[0], motivo: 'nova' };
}

module.exports = { montarBacklog, decidirProximaUnidade, estaPendente, estaDominada, LIMIAR_PADRAO };
