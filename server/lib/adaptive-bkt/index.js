/*
Exporta as 8 classes num pacote só, pra facilitar o import em outros lugares.
 */

const BKTAdaptativo = require('./src/BKTAdaptativo');
const PerfilAluno = require('./src/PerfilAluno');
const CalculadoraPesos = require('./src/CalculadoraPesos');
const ParametrosAdaptativos = require('./src/ParametrosAdaptativos');
const RastreamentoBayesiano = require('./src/RastreamentoBayesiano');
const Classificador = require('./src/Classificador');
const Recomendacao = require('./src/Recomendacao');
const Indicadores = require('./src/Indicadores');

module.exports = {
  BKTAdaptativo,
  PerfilAluno,
  CalculadoraPesos,
  ParametrosAdaptativos,
  RastreamentoBayesiano,
  Classificador,
  Recomendacao,
  Indicadores,
};
