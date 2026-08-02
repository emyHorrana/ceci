/*
O BKT clássico usa 4 parâmetros fixos por módulo:
  L0    = probabilidade inicial de já saber o conteúdo
  T     = probabilidade de aprender a cada oportunidade
  Guess = probabilidade de acertar "no chute" mesmo sem saber
  Slip  = probabilidade de errar "por descuido" mesmo sabendo
 
Aqui, em vez de fixos, eles são recalculados a cada questão a
partir do comportamento observado, essa é a parte adaptativa adicionada ao BKT original.
 
 As fórmulas abaixo são um ponto de partida, temos que ajustar as constantes conforme os dados reais forem
 chegando 
 */
class ParametrosAdaptativos {
  static limitar(valor, min, max) {
    return Math.max(min, Math.min(max, valor));
  }

  /* T: quanto maior o score adaptativo (engajamento geral), maior a chance de aprender agora */
  static calcularT(score) {
    const T = 0.10 + 0.30 * score; // varia entre 0.10 e 0.40
    return ParametrosAdaptativos.limitar(T, 0.05, 0.40);
  }

  /* Guess: baixo foco = mais "cliques no escuro" = maior chance de acertar sem saber */
  static calcularGuess(foco) {
    const guess = 0.30 - 0.20 * foco; // foco=1 -> 0.10 | foco=0 -> 0.30
    return ParametrosAdaptativos.limitar(guess, 0.05, 0.35);
  }

  /* Slip: velocidade muito acima do esperado sugere resposta apressada, sem cuidado */
  static calcularSlip(velocidade) {
    const slip = 0.05 + 0.20 * velocidade; // resposta rápida demais aumenta risco de descuido
    return ParametrosAdaptativos.limitar(slip, 0.05, 0.30);
  }

  /* L0: parte do histórico de domínio do próprio aluno naquele módulo (PerfilAluno) */
  static calcularL0(dominioAnterior, valorPadrao = 0.30) {
    if (dominioAnterior === null || dominioAnterior === undefined) return valorPadrao;
    return ParametrosAdaptativos.limitar(dominioAnterior, 0.01, 0.99);
  }

  /* Atalho: calcula os 4 parâmetros de uma vez */
  static calcularTodos({ score, foco, velocidade, dominioAnterior }) {
    return {
      T: ParametrosAdaptativos.calcularT(score),
      Guess: ParametrosAdaptativos.calcularGuess(foco),
      Slip: ParametrosAdaptativos.calcularSlip(velocidade),
      L0: ParametrosAdaptativos.calcularL0(dominioAnterior),
    };
  }
}

module.exports = ParametrosAdaptativos;
