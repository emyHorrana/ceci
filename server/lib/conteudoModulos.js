// server/lib/conteudoModulos.js
// Fonte da verdade das etapas teóricas no servidor.
// Garante que o conteúdo de contexto enviado ao Gemini venha sempre do catálogo
// estático e confiável do curso, prevenindo manipulações e Prompt Injections pelo cliente.

const conteudoTeoria = require('../data/conteudoTeoria.json');

/**
 * Busca o conteúdo estático e confiável de uma etapa teórica.
 *
 * @param {Object} params
 * @param {string} params.miniModuloId - Identificador do mini-módulo (ex: '1-1', '2-3')
 * @param {number|string} [params.etapaIndice] - Índice numérico da etapa no mini-módulo
 * @param {string} [params.etapaId] - ID da etapa se disponível
 * @returns {Object|null} Dados da etapa { titulo, conteudo, tituloEtapa, moduloTitulo, miniModuloTitulo }
 */
function buscarEtapa({ miniModuloId, etapaIndice, etapaId }) {
  if (!miniModuloId) return null;

  const mm = conteudoTeoria[String(miniModuloId)];
  if (!mm || !Array.isArray(mm.etapas)) return null;

  let etapa = null;

  if (etapaIndice !== undefined && etapaIndice !== null && etapaIndice !== '') {
    const idx = parseInt(etapaIndice, 10);
    if (!Number.isNaN(idx)) {
      etapa = mm.etapas.find((e) => e.indice === idx) || mm.etapas[idx] || null;
    }
  }

  if (!etapa && etapaId) {
    etapa = mm.etapas.find(
      (e) => e.id === String(etapaId) || e.id === `${miniModuloId}-${etapaId}`
    ) || null;
  }

  if (!etapa || !etapa.conteudo) {
    return null;
  }

  return {
    titulo: `${mm.moduloTitulo} - ${etapa.titulo}`,
    tituloEtapa: etapa.titulo,
    moduloTitulo: mm.moduloTitulo,
    miniModuloTitulo: mm.miniModuloTitulo,
    conteudo: etapa.conteudo,
  };
}

module.exports = {
  buscarEtapa,
};
