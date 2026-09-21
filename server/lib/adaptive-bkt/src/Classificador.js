/*
  Classificador
  Transforma a probabilidade de domínio (L) em um nível categórico.
 */

// Nº mínimo de respostas no módulo antes de confiar o suficiente pra
// classificar como "Avançado" (que libera Recomendacao 'Próximo módulo').
// Sem isso, 1-2 respostas certas (ex: onboarding) já bastavam pra L
// ficar alto o bastante pra virar "Avançado" - estatisticamente pouca
// evidência pra uma decisão dessas.
const MINIMO_QUESTOES_PARA_AVANCADO = 3;

class Classificador {
  static classificar(L, questoes = Infinity) {
    if (L < 0.30) return 'Iniciante';
    if (L < 0.60) return 'Básico';
    if (L < 0.85) return 'Intermediário';
    if (questoes < MINIMO_QUESTOES_PARA_AVANCADO) return 'Intermediário';
    return 'Avançado';
  }
}

module.exports = Classificador;
