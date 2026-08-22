/*
Decide a próxima ação pedagógica com base no nível classificado.
Isso é o que o BKT clássico NÃO faz sozinho - ele só estima
probabilidade de domínio, não decide o que fazer com isso.
 */

class Recomendacao {
  static recomendar(nivel) {
    const mapa = {
      Avançado: 'Próximo módulo',
      Intermediário: 'Questão mais difícil',
      Básico: 'Mesmo módulo',
      Iniciante: 'Revisão',
    };
    return mapa[nivel] ?? 'Mesmo módulo';
  }
}

module.exports = Recomendacao;
