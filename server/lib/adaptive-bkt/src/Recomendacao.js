/*
Decide a próxima ação pedagógica com base no nível classificado.
Isso é o que o BKT clássico NÃO faz sozinho - ele só estima
probabilidade de domínio, não decide o que fazer com isso.

Os textos são propositalmente frases completas e acionáveis (não
rótulos curtos tipo "Próximo módulo") porque, junto com
recomendacaoPorUnidade em routes/licao.js, isso aparece de verdade pro
aluno no card "Seu progresso" do Dashboard - antes disso, esse campo
era calculado a cada resposta e devolvido pela API, mas nenhuma tela do
front chegava a mostrar ou usar o texto (só `nivel`/`dominio` eram
consumidos) - o "direcionamento individual" ficava só no cálculo,
nunca chegava no aluno.
 */

class Recomendacao {
  static recomendar(nivel) {
    const mapa = {
      Avançado: 'Você já domina isso - siga para a próxima Unidade!',
      Intermediário: 'Está indo bem! Tente um desafio um pouco mais difícil.',
      Básico: 'Continue praticando nesta mesma Unidade.',
      Iniciante: 'Vale revisar esse conteúdo com calma antes de seguir.',
    };
    return mapa[nivel] ?? mapa.Básico;
  }
}

module.exports = Recomendacao;
