/*
  Classificador
  Transforma a probabilidade de domínio (L) em um nível categórico.
 */
class Classificador {
  static classificar(L) {
    if (L < 0.30) return 'Iniciante';
    if (L < 0.60) return 'Básico';
    if (L < 0.85) return 'Intermediário';
    return 'Avançado';
  }
}

module.exports = Classificador;
