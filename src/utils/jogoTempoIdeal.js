// jogoTempoIdeal.js
// Tempo (ms) esperado pra responder cada tipo de jogo/desafio - é o
// `tempoIdeal` que Indicadores.calcularVelocidade (backend) usa como
// referência (tempoIdeal / tempoReal). Nenhuma etapa em data/modulos.js
// carrega isso hoje, então fica centralizado aqui em vez de duplicar em
// cada jogoProps - ajustar os valores conforme os dados reais chegarem
// (mesmo espírito do ParametrosAdaptativos.js no backend).

const TEMPO_IDEAL_PADRAO_MS = 6000;

const TEMPO_IDEAL_POR_JOGO_MS = {
  clicar: 4000,
  scroll: 6000,
  arrastar: 8000,
  digitar: 10000,
  pressionar: 4000,
  associacao: 8000,
  quiz: 6000,
};

export function getTempoIdealMs(jogo) {
  return TEMPO_IDEAL_POR_JOGO_MS[jogo] ?? TEMPO_IDEAL_PADRAO_MS;
}
