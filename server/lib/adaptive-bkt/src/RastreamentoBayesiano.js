/*
Implementação do BKT clássico (Corbett & Anderson, 1994). Essa classe é o algoritmo original
Tudo que é "adaptativo" acontece antes (ParametrosAdaptativos),
calculando T/Guess/Slip/L0 a cada chamada.

Entrada: L (mastery atual), T, Guess, Slip, resposta (correta ou não)
Saída:   nova probabilidade de domínio (L atualizado)
 */
class RastreamentoBayesiano {

  static atualizar(L, T, Guess, Slip, correto) {
    let posteriori;

    if (correto) {
      // P(sabia | acertou)
      posteriori = (L * (1 - Slip)) / (L * (1 - Slip) + (1 - L) * Guess);
    } else {
      // P(sabia | errou)
      posteriori = (L * Slip) / (L * Slip + (1 - L) * (1 - Guess));
    }

    // aplica a chance de ter aprendido nessa oportunidade
    const novoL = posteriori + (1 - posteriori) * T;

    return Math.max(0, Math.min(1, novoL));
  }
}

module.exports = RastreamentoBayesiano;
