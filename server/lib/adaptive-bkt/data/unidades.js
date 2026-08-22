// server/lib/adaptive-bkt/data/unidades.js
// -----------------------------------------
// Unidades = agrupamento de mini-módulos
//
// `temJogo` sinaliza se ALGUM mini-módulo da Unidade tem etapa tipo
// 'jogo' - a FilaDePendencias trata `temJogo: false` como "não entra
// na fila de pendência automaticamente" (o BKT nunca vai ter uma
// observação real pra ela).
//
// CORRIGIDO (21/08): U2.1, U3.1 e U3.6 estavam marcadas `temJogo:
// false` desde a criação deste espelho, mas os mini-módulos delas
// passaram a ter etapas de jogo.

const unidades = [
  // Módulo 1 - Mouse (Tier 0)
  { id: 'U1.1', moduloId: '1', tier: 0, ordem: 0, prerequisitos: [], miniModulos: ['1-1', '1-2'], temJogo: true },
  { id: 'U1.2', moduloId: '1', tier: 0, ordem: 1, prerequisitos: ['U1.1'], miniModulos: ['1-3', '1-5'], temJogo: true },
  { id: 'U1.3', moduloId: '1', tier: 0, ordem: 2, prerequisitos: ['U1.2'], miniModulos: ['1-4', '1-6'], temJogo: true },

  // Módulo 2 - Teclado (Tier 1, exceto U2.7)
  { id: 'U2.1', moduloId: '2', tier: 1, ordem: 0, prerequisitos: [], miniModulos: ['2-1', '2-2'], temJogo: true },
  { id: 'U2.2', moduloId: '2', tier: 1, ordem: 1, prerequisitos: ['U2.1'], miniModulos: ['2-3', '2-4', '2-5'], temJogo: true },
  { id: 'U2.3', moduloId: '2', tier: 1, ordem: 2, prerequisitos: ['U2.2'], miniModulos: ['2-6', '2-7'], temJogo: true },
  { id: 'U2.4', moduloId: '2', tier: 1, ordem: 3, prerequisitos: ['U2.3'], miniModulos: ['2-8', '2-9'], temJogo: true },
  { id: 'U2.5', moduloId: '2', tier: 1, ordem: 4, prerequisitos: ['U2.4'], miniModulos: ['2-10', '2-11'], temJogo: true }, // pré-requisito explícito no doc: Shift (U2.4) antes de Números/Símbolos
  { id: 'U2.6', moduloId: '2', tier: 1, ordem: 5, prerequisitos: ['U2.5'], miniModulos: ['2-12', '2-13'], temJogo: true },
  { id: 'U2.7', moduloId: '2', tier: 2, ordem: 6, prerequisitos: [], miniModulos: ['2-14'], temJogo: true }, // Atalhos: extra, não bloqueia
  { id: 'U2.8', moduloId: '2', tier: 1, ordem: 7, prerequisitos: ['U2.6'], miniModulos: ['2-15'], temJogo: true },

  // Módulo 3 - Hardware (Tier 2)
  { id: 'U3.1', moduloId: '3', tier: 2, ordem: 0, prerequisitos: [], miniModulos: ['3-1', '3-2'], temJogo: true },
  { id: 'U3.2', moduloId: '3', tier: 2, ordem: 1, prerequisitos: ['U3.1'], miniModulos: ['3-3', '3-9'], temJogo: true },
  { id: 'U3.3', moduloId: '3', tier: 2, ordem: 2, prerequisitos: ['U3.1'], miniModulos: ['3-4'], temJogo: true },
  { id: 'U3.4', moduloId: '3', tier: 2, ordem: 3, prerequisitos: ['U3.1'], miniModulos: ['3-5', '3-6', '3-7'], temJogo: true },
  { id: 'U3.5', moduloId: '3', tier: 2, ordem: 4, prerequisitos: ['U3.1'], miniModulos: ['3-8'], temJogo: true },
  { id: 'U3.6', moduloId: '3', tier: 2, ordem: 5, prerequisitos: ['U3.4', 'U3.5'], miniModulos: ['3-10', '3-11'], temJogo: true },
];

module.exports = unidades;