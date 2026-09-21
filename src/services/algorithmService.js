// algorithmService.js
// Serviço de integração com o algoritmo adaptativo (AB-BKT) do CECI.
// Único ponto do front que fala com server/lib/adaptive-bkt - os nomes
// de campo aqui têm que bater exatamente com o que
// Indicadores.aPartirDoEvento (backend) espera.

import apiClient from './api';

// GameMoment.jsx entrega os sinais brutos do navegador como
// { tempoRespostaMs, trocasDeAba, tempoInativoMs, abandonado }.
// O backend (Indicadores.js) espera { tempoResposta, trocasDeAba,
// tempoInativo, abandonado } - o nome de dois campos muda (sem o
// sufixo "Ms"), mas divergir aqui silenciosamente vira NaN lá no meio
// do cálculo do BKT, então a conversão fica centralizada nesta função.
//
// `tempoResposta` fica em ms mesmo (Indicadores.calcularVelocidade só
// faz uma RAZÃO tempoIdeal/tempoReal - unidade não importa, contanto
// que os dois lados usem a mesma). Já `tempoInativo` precisa virar
// SEGUNDOS: Indicadores.calcularFoco faz `tempoInativo * 0.02`, uma
// penalidade em escala absoluta (não uma razão) - só faz sentido com
// segundos. GameMoment só registra pausas > 3000ms (nunca um valor
// pequeno), então sem essa conversão a penalidade mínima já era
// 3000 * 0.02 = 60, sessenta vezes o teto da escala (0-1): QUALQUER
// pausa registrada zerava o foco por completo, sempre - o sinal nunca
// foi o gradiente que devia ser.
export function sinaisParaDadosEvento(sinais) {
  return {
    tempoResposta: sinais?.tempoRespostaMs ?? 0,
    trocasDeAba: sinais?.trocasDeAba ?? 0,
    tempoInativo: (sinais?.tempoInativoMs ?? 0) / 1000,
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

// Calcula o score adaptativo de uma resposta SEM persistir nada (não
// precisa de userId/moduleId) - usado no onboarding (/boas-vindas),
// antes de existir conta, pra saber "quanto seria o domínio até agora"
// com o cálculo de verdade. `etapaId` importa aqui: sinais fáceis (ex:
// "boas-vindas#...", a aula guiada) passam pelo teto de
// TETO_DOMINIO_ONBOARDING no backend; sinais do desafio de verificação
// ("boas-vindas-verificacao#...") não - ver BKTAdaptativo.js. Quem
// chama guarda o `dominio`/`questoesAnteriores` devolvidos e repassa na
// chamada seguinte, encadeando o histórico manualmente (não tem
// PerfilAluno carregado do Supabase pra isso ainda).
export async function simularQuestao({
  correto,
  sinais,
  tempoIdeal,
  tentativas,
  tentativasAposErro,
  biasModulo,
  biasAluno,
  dominioAnterior,
  questoesAnteriores,
  etapaId,
}) {
  return await apiClient.post('/licao/simular', {
    correto,
    dadosEvento: sinaisParaDadosEvento(sinais),
    tempoIdeal,
    tentativas,
    tentativasAposErro,
    etapaId,
    biasModulo,
    biasAluno,
    dominioAnterior,
    questoesAnteriores,
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