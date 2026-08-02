/*
 Transforma os dados brutos do RastreadorEventos em indicadores normalizados.
 */
class Indicadores {
  static calcularVelocidade(tempoIdeal, tempoReal) {
    if (!tempoReal || tempoReal <= 0) return 0;
    return Indicadores.normalizar(tempoIdeal / tempoReal, 0, 2); 
  }

  static calcularFoco(trocasDeAba, tempoInativo, abandonado) {
    const penalidadeAbas = trocasDeAba * 0.05;
    const penalidadeInatividade = tempoInativo * 0.02;
    const penalidadeAbandono = abandonado ? 0.15 : 0;
    const foco = 1 - penalidadeAbas - penalidadeInatividade - penalidadeAbandono;
    return Indicadores.normalizar(foco, 0, 1);
  }

  /*
   Persistência: o aluno tenta de novo depois de errar ou desiste?
   tentativas: quantas vezes tentou essa questão
   tentativasAposErro: quantas tentativas aconteceram depois de um erro
   abandonado
   */
  static calcularPersistencia(tentativas, tentativasAposErro, abandonado) {
    if (abandonado) return 0.2; // desistiu, mas não zera — pode ter tentado antes
    const base = 0.6;
    const bonus = Math.min(tentativasAposErro, 3) * 0.1; // até +0.3 por insistir
    return Indicadores.normalizar(base + bonus, 0, 1);
  }

  static normalizar(valor, min, max) {
    if (max === min) return 0;
    const n = (valor - min) / (max - min);
    return Math.max(0, Math.min(1, n));
  }

  static aPartirDoEvento(dadosEvento, { tempoIdeal, tentativas = 1, tentativasAposErro = 0 }) {
    const { tempoResposta, trocasDeAba, tempoInativo, abandonado } = dadosEvento;
    return {
      velocidade: Indicadores.calcularVelocidade(tempoIdeal, tempoResposta),
      foco: Indicadores.calcularFoco(trocasDeAba, tempoInativo, abandonado),
      persistencia: Indicadores.calcularPersistencia(tentativas, tentativasAposErro, abandonado),
    };
  }
}

module.exports = Indicadores;
