/*
  CalculadoraPesos
 
    S = w1*acerto + w2*velocidade + w3*foco + w4*persistencia - w5*erros + biasAluno + biasModulo
 
  Os pesos (w1..w5) continuam sendo definidos manualmente, isso é
  exatamente a parte "manual" descrita no PDF do algoritmo adaptativo.
  O que muda é que aqui, o score alimenta o BKT em vez de decidir
  a dificuldade sozinho.
 */
class CalculadoraPesos {
  constructor(pesos = {}) {
    // valores default, os mesmos do exemplo do PDF 
    this.pesos = {
      acerto: pesos.acerto ?? 0.8,
      velocidade: pesos.velocidade ?? 0.4,
      foco: pesos.foco ?? 0.3,
      persistencia: pesos.persistencia ?? 0.3,
      erros: pesos.erros ?? 0.9,
    };
  }

  static limitar(valor, min, max) {
    return Math.max(min, Math.min(max, valor));
  }

  
  calcularScore(indicadores, biasAluno = 0, biasModulo = 0) {
    const { acerto, velocidade, foco, persistencia, erros } = indicadores;
    const w = this.pesos;

    let score =
      w.acerto * acerto +
      w.velocidade * velocidade +
      w.foco * foco +
      w.persistencia * persistencia -
      w.erros * erros +
      biasAluno +
      biasModulo;

    // normaliza pra faixa 0-1 
    const teto = w.acerto + w.velocidade + w.foco + w.persistencia;
    score = teto > 0 ? score / teto : score;

    return CalculadoraPesos.limitar(score, 0, 1);
  }
}

module.exports = CalculadoraPesos;
