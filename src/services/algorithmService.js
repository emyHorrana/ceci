// algorithmService.js
// Serviço de integração com o algoritmo adaptativo (AB-BKT) do CECI.
// Único ponto do front que fala com server/lib/adaptive-bkt - os nomes
// de campo aqui têm que bater exatamente com o que
// Indicadores.aPartirDoEvento (backend) espera.

import apiClient from './api';

// GameMoment.jsx entrega os sinais brutos do navegador como
// { tempoRespostaMs, trocasDeAba, tempoInativoMs, abandonado }.
// O backend (Indicadores.js) espera { tempoResposta, trocasDeAba,
// tempoInativo, abandonado } - só o nome de dois campos muda (sem o
// sufixo "Ms"), mas divergir aqui silenciosamente vira NaN lá no meio
// do cálculo do BKT, então a conversão fica centralizada nesta função.
export function sinaisParaDadosEvento(sinais) {
  return {
    tempoResposta: sinais?.tempoRespostaMs ?? 0,
    trocasDeAba: sinais?.trocasDeAba ?? 0,
    tempoInativo: sinais?.tempoInativoMs ?? 0,
    abandonado: sinais?.abandonado ?? false,
  };
}

// Envia o resultado de uma resposta (jogo, checkpoint) pro AB-BKT e
// recebe de volta o domínio atualizado, o nível e a recomendação.
// moduleId = id da Unidade (ex: "U1.1"), etapaId = string única
// identificando a etapa/desafio respondido.
export async function responderQuestao({
  userId,
  moduleId,
  etapaId,
  correto,
  sinais,
  tempoIdeal,
  tentativas,
  tentativasAposErro,
  biasModulo,
}) {
  return await apiClient.post('/licao/responder', {
    userId,
    moduleId,
    etapaId,
    correto,
    dadosEvento: sinaisParaDadosEvento(sinais),
    tempoIdeal,
    tentativas,
    tentativasAposErro,
    biasModulo,
  });
}

// Retorna a próxima Unidade recomendada pro aluno (reforço pendente ou
// a próxima nova na sequência), calculada a partir dos perfis salvos.
export async function getProximaUnidade(userId) {
  return await apiClient.get(`/licao/proxima-unidade/${userId}`);
}

// Retorna o domínio (L do BKT) de todas as Unidades já tentadas pelo
// aluno - { dominiosPorUnidade: { 'U1.1': 0.82, ... }, limiar: 0.5 }.
// Usado pra pintar a trilha inteira (concluída/pendente/não tentada),
// não só a próxima Unidade recomendada.
export async function getPerfisAluno(userId) {
  return await apiClient.get(`/licao/perfis/${userId}`);
}