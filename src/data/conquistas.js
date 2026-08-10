/**
 * conquistas.js
 * Fonte da verdade local para o catálogo de conquistas do CECI.
 * Não precisa estar no banco - é conteúdo estático (nome, tipo, motivo,
 * emoji). O que vem do banco (tabela `conquistas`, via
 * services/progressService.js) é só a LISTA DE CONQUISTAS JÁ
 * DESBLOQUEADAS por usuário - hoje apenas { id, title }, sem nenhum
 * identificador estável. Por isso o cruzamento com esse catálogo (ver
 * getConquistasComStatus, usado em pages/Conquistas.jsx) é feito
 * comparando pelo título - se o título salvo no banco mudar, o vínculo
 * quebra. Quando existir um identificador estável (slug/código) vindo do
 * back-end, trocar esse cruzamento para usar `id` em vez de `titulo`.
 *
 * Conteúdo tirado do documento de conquistas (nomes, tipos e motivos).
 *
 * Sobre a observação do documento: para quem pula um dos módulos
 * iniciais (não passou por mouse/teclado/hardware do jeito linear),
 * a conquista correspondente ("No controle!", "Pronto para digitar",
 * "Conhecendo meu computador") só é liberada depois de um teste no
 * laboratório (jogos mais repetitivos/determinísticos, tipo o "pule
 * esta unidade" do Duolingo). Esse fluxo de teste ainda não existe no
 * produto - por enquanto as 3 conquistas de "Grandes Marcos" só são
 * concedidas pela conclusão normal do módulo.
 */

export const TIPOS_CONQUISTA = ['Iniciativa', 'Grandes Marcos', 'Exploração'];

export const CONQUISTAS = [
  {
    id: 'primeiros-passos',
    tipo: 'Iniciativa',
    titulo: 'Primeiros Passos',
    motivo: 'Concluir o cadastro',
    emoji: '🌱',
  },
  {
    id: 'primeira-unidade',
    tipo: 'Iniciativa',
    titulo: 'Terminar a primeira unidade',
    motivo: 'Concluir a primeira unidade de uma lição',
    emoji: '📗',
  },
  {
    id: 'resiliencia-e-a-chave',
    tipo: 'Iniciativa',
    titulo: 'Resiliência é a chave',
    motivo: 'Voltar à plataforma para realizar uma nova atividade, num dia diferente do dia do primeiro contato',
    emoji: '🔁',
  },
  {
    id: 'no-controle',
    tipo: 'Grandes Marcos',
    titulo: 'No controle!',
    motivo: 'Conclusão do módulo de mouse',
    emoji: '🖱️',
  },
  {
    id: 'pronto-para-digitar',
    tipo: 'Grandes Marcos',
    titulo: 'Pronto para digitar',
    motivo: 'Conclusão do módulo de teclado',
    emoji: '⌨️',
  },
  {
    id: 'conhecendo-meu-computador',
    tipo: 'Grandes Marcos',
    titulo: 'Conhecendo meu computador',
    motivo: 'Conclusão do módulo de hardware e periféricos',
    emoji: '🖥️',
  },
  {
    id: 'explorador-iniciante',
    tipo: 'Exploração',
    titulo: 'Explorador Iniciante',
    motivo: 'Domínio dos 3 primeiros módulos básicos',
    emoji: '🧭',
  },
];

/**
 * Cruza o catálogo estático com a lista de conquistas desbloqueadas do
 * usuário (vinda de ProgressContext -> progress.achievements, cada item
 * { id, title, emoji }) e devolve o catálogo completo com `unlocked`.
 *
 * O cruzamento é por título (ver nota no topo do arquivo) - normaliza
 * espaços/maiúsculas pra não perder o vínculo por diferença boba.
 */
export function getConquistasComStatus(achievements = []) {
  const titulosDesbloqueados = new Set(
    achievements
      .map((a) => a?.title?.trim().toLowerCase())
      .filter(Boolean)
  );

  return CONQUISTAS.map((c) => ({
    ...c,
    unlocked: titulosDesbloqueados.has(c.titulo.trim().toLowerCase()),
  }));
}

/** Agrupa uma lista de conquistas (já com `unlocked`, ou não) por tipo. */
export function agruparPorTipo(conquistas) {
  return TIPOS_CONQUISTA.map((tipo) => ({
    tipo,
    conquistas: conquistas.filter((c) => c.tipo === tipo),
  })).filter((grupo) => grupo.conquistas.length > 0);
}