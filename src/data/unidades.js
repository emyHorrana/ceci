/**
 * unidades.js
 * Agrupa os mini-módulos existentes (data/modulos.js) em Unidades,
 * conforme a "Sugestão de Arquitetura Adaptativa" - ver documento.
 *
 * Por que isso existe: hoje o algoritmo adaptativo (quando existir)
 * trabalharia com ~30 mini-módulos isolados, alguns com só 1-2 etapas.
 * Isso faz uma dificuldade específica (ex: uma tecla) mandar a pessoa
 * pra um mini-módulo minúsculo isolado, em vez de pra um agrupamento
 * mais completo que já reforça o que está ao redor daquele conceito
 * (ex: números, símbolos, Shift juntos). A Unidade é o novo "nó" que
 * o algoritmo vai enxergar - uma dúzia por módulo, em vez de ~30.
 *
 * IMPORTANTE: isso aqui é só a estrutura/listagem. Nenhuma lógica de
 * algoritmo, score de confiança, fila de pendências ou progresso do
 * usuário mora neste arquivo - só o agrupamento em si. Ver seção 3 do
 * documento de arquitetura pra a lógica adaptativa (ainda não
 * implementada).
 *
 * Cada Unidade tem uma `tier` de essencialidade (0 = mínimo absoluto,
 * 1 = importante, 2 = complementar) - usada tanto pra ordenar a
 * progressão quanto, futuramente, pro algoritmo decidir prioridade.
 *
 * `miniModulos` é resolvido automaticamente a partir de `MODULOS` (não
 * precisa manter os dados dos mini-módulos duplicados aqui, só os ids).
 *
 * `checkpoint` (opcional): o desafio de fim de Unidade - um jogo um
 * pouco mais difícil (associação ou quiz), pensado como a etapa que dá
 * o veredito de domínio daquela Unidade (ver pages/UnidadeCheckpoint.jsx).
 * Nem toda Unidade tem um ainda - só as que já foram escritas como
 * exemplo do padrão (U1.1 e U2.3). Formato:
 *   {
 *     tipo: 'associacao' | 'quiz',
 *     titulo, instructions (mesma cara de uma etapa normal),
 *     jogoProps: as props exatas do jogo escolhido (ArrastarSoltarGame
 *       pra 'associacao', QuizGame pra 'quiz')
 *   }
 */

import { MODULOS } from './modulos';

const MAPA_MINI_MODULOS = MODULOS.reduce((mapa, modulo) => {
  modulo.miniModulos.forEach((mm) => {
    mapa[mm.id] = mm;
  });
  return mapa;
}, {});

export const TIERS = {
  0: { label: 'Essencial', descricao: 'Mínimo pra usar a plataforma' },
  1: { label: 'Importante', descricao: 'Necessário pra tarefas comuns' },
  2: { label: 'Complementar', descricao: 'Não bloqueia o uso básico' },
};

const DEFINICOES_UNIDADES = [
  // Módulo 1 - Mouse (Tier 0: conhecimento mínimo absoluto)
  {
    id: 'U1.1', moduloId: '1', tier: 0, titulo: 'Fundamentos do mouse', miniModuloIds: ['1-1', '1-2'],
    checkpoint: {
      tipo: 'associacao',
      titulo: 'Desafio: qual botão faz o quê?',
      instructions: 'Arraste a ação até o botão certo do mouse.',
      jogoProps: {
        item: { id: 'abrir-menu', label: 'Abrir o menu de opções' },
        zonas: [
          { id: 'esquerdo', label: 'Clique esquerdo', correta: false },
          { id: 'direito', label: 'Clique direito', correta: true },
        ],
      },
    },
  },
  { id: 'U1.2', moduloId: '1', tier: 0, titulo: 'Cliques com timing', miniModuloIds: ['1-3', '1-5'] },
  { id: 'U1.3', moduloId: '1', tier: 0, titulo: 'Rolagem e precisão', miniModuloIds: ['1-4', '1-6'] },

  // Módulo 2 - Teclado (Tier 1: segundo conhecimento mínimo, necessário pra login/cadastro)
  { id: 'U2.1', moduloId: '2', tier: 1, titulo: 'Fundamentos do teclado', miniModuloIds: ['2-1', '2-2'] },
  { id: 'U2.2', moduloId: '2', tier: 1, titulo: 'Escrever e confirmar', miniModuloIds: ['2-3', '2-4', '2-5'] },
  {
    id: 'U2.3', moduloId: '2', tier: 1, titulo: 'Corrigindo erros', miniModuloIds: ['2-6', '2-7'],
    checkpoint: {
      tipo: 'quiz',
      titulo: 'Desafio: Backspace ou Delete?',
      instructions: 'Escolha a resposta certa.',
      jogoProps: {
        pergunta: 'Qual tecla apaga o caractere que vem DEPOIS do cursor?',
        alternativas: [
          { id: 'backspace', texto: 'Backspace', correta: false },
          { id: 'delete', texto: 'Delete', correta: true },
          { id: 'enter', texto: 'Enter', correta: false },
          { id: 'espaco', texto: 'Barra de espaço', correta: false },
        ],
      },
    },
  },
  { id: 'U2.4', moduloId: '2', tier: 1, titulo: 'Maiúsculas', miniModuloIds: ['2-8', '2-9'] },
  { id: 'U2.5', moduloId: '2', tier: 1, titulo: 'Números e símbolos', miniModuloIds: ['2-10', '2-11'] },
  { id: 'U2.6', moduloId: '2', tier: 1, titulo: 'Teclas especiais e navegação', miniModuloIds: ['2-12', '2-13'] },
  { id: 'U2.7', moduloId: '2', tier: 2, titulo: 'Atalhos', miniModuloIds: ['2-14'] },
  { id: 'U2.8', moduloId: '2', tier: 1, titulo: 'Prática funcional', miniModuloIds: ['2-15'] },

  // Módulo 3 - Hardware (Tier 2: complementar, não bloqueia o uso básico da plataforma)
  { id: 'U3.1', moduloId: '3', tier: 2, titulo: 'O que é hardware e o monitor', miniModuloIds: ['3-1', '3-2'] },
  { id: 'U3.2', moduloId: '3', tier: 2, titulo: 'Gabinete, ligar e desligar', miniModuloIds: ['3-3', '3-9'] },
  { id: 'U3.3', moduloId: '3', tier: 2, titulo: 'Periféricos de entrada', miniModuloIds: ['3-4'] },
  { id: 'U3.4', moduloId: '3', tier: 2, titulo: 'Áudio e imagem', miniModuloIds: ['3-5', '3-6', '3-7'] },
  { id: 'U3.5', moduloId: '3', tier: 2, titulo: 'Cabos e conexões', miniModuloIds: ['3-8'] },
  { id: 'U3.6', moduloId: '3', tier: 2, titulo: 'Internet e cuidados com o equipamento', miniModuloIds: ['3-10', '3-11'] },
];

export const UNIDADES = DEFINICOES_UNIDADES.map((def) => ({
  ...def,
  miniModulos: def.miniModuloIds
    .map((id) => MAPA_MINI_MODULOS[id])
    .filter(Boolean), // se um id não existir em modulos.js, ignora em vez de quebrar a tela
}));

// Unidades agrupadas por módulo, na ordem de MODULOS - é o formato que
// o Dashboard consome pra renderizar Módulo → Unidade → mini-módulos.
export const UNIDADES_POR_MODULO = MODULOS.map((modulo) => ({
  moduloId: modulo.id,
  moduloEmoji: modulo.emoji,
  moduloTitulo: modulo.titulo,
  unidades: UNIDADES.filter((u) => u.moduloId === modulo.id),
}));

// A que Unidade um mini-módulo pertence - é o `moduleId` que o algoritmo
// adaptativo espera (ver server/lib/adaptive-bkt), já que ele trabalha
// no nível de Unidade, não de mini-módulo isolado. Retorna undefined se
// o mini-módulo não estiver em nenhuma Unidade ainda.
export function getUnidadeByMiniModulo(miniModuloId) {
  return UNIDADES.find((u) => u.miniModuloIds.includes(miniModuloId));
}