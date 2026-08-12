// checkpointService.js
// Guarda o resultado dos desafios de fim de Unidade (ver
// UnidadeCheckpoint.jsx) - PLACEHOLDER local, no localStorage do
// navegador, até a integração de verdade com o algoritmo adaptativo
// existir (fila de pendências real, por aluno, no back-end).
//
// Isso deixa o fluxo inteiro testável hoje (fazer o desafio, ver o
// resultado, ver a Unidade marcada) sem depender de nada que ainda
// não foi construído. Quando a integração real existir, trocar as 3
// funções abaixo por chamadas à API - quem consome (UnidadeCheckpoint,
// futuramente o Dashboard) não precisa mudar nada além do import.

const CHAVE = 'ceci-checkpoints';

function lerTudo() {
  try {
    const bruto = localStorage.getItem(CHAVE);
    return bruto ? JSON.parse(bruto) : {};
  } catch {
    return {};
  }
}

function salvarTudo(dados) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(dados));
  } catch {
    // localStorage indisponível (modo privado, quota cheia etc) - não
    // é crítico pra esse placeholder, só não persiste desta vez.
  }
}

// Registra o resultado de um checkpoint. dominou=true → domínio
// demonstrado; dominou=false → precisa de reforço (erro esgotado ou
// pulou). `sinais` é o objeto cru que o GameMoment já captura (tempo
// de resposta, trocas de aba, tempo inativo, abandono) - guardado
// junto e não só o veredito booleano, porque é exatamente esse dado
// bruto que o algoritmo da Emily consome (ver Indicadores.js) quando
// a integração de verdade existir. `attempts` também guardado por ser
// a base de tentativas/tentativasAposErro do contrato dela.
export function registrarResultadoCheckpoint(unidadeId, dominou, { attempts, sinais } = {}) {
  const dados = lerTudo();
  dados[unidadeId] = {
    dominou,
    attempts: attempts ?? 0,
    sinais: sinais ?? null,
    em: new Date().toISOString(),
  };
  salvarTudo(dados);
}

// Resultado do último checkpoint feito pra essa Unidade, ou null se
// ainda não foi feito nenhum.
export function getResultadoCheckpoint(unidadeId) {
  return lerTudo()[unidadeId] ?? null;
}

// IDs de todas as Unidades marcadas como "precisa de reforço" -
// candidato natural a alimentar uma seção de pendências no Dashboard
// mais pra frente.
export function getUnidadesPendentes() {
  const dados = lerTudo();
  return Object.entries(dados)
    .filter(([, resultado]) => resultado.dominou === false)
    .map(([unidadeId]) => unidadeId);
}