// checkpointService.js
// Guarda o resultado dos desafios de fim de Unidade (ver UnidadeCheckpoint.jsx).
// Armazenado no localStorage de forma isolada por aluno (ceci_checkpoints_<userId>).

const CHAVE_PREFIX = 'ceci_checkpoints_';

function obterChave(userId) {
  return userId ? `${CHAVE_PREFIX}${userId}` : null;
}

export function lerCheckpoints(userId) {
  if (!userId) return {};
  try {
    const chave = obterChave(userId);
    const bruto = chave ? localStorage.getItem(chave) : null;
    return bruto ? JSON.parse(bruto) : {};
  } catch {
    return {};
  }
}

export function salvarCheckpoints(userId, dados) {
  if (!userId) return;
  try {
    const chave = obterChave(userId);
    if (chave) {
      localStorage.setItem(chave, JSON.stringify(dados));
    }
  } catch {
    // localStorage indisponível (modo privado, quota cheia etc)
  }
}

export function limparCheckpoints(userId) {
  if (!userId) return;
  try {
    const chave = obterChave(userId);
    if (chave) {
      localStorage.removeItem(chave);
    }
  } catch {
    // ignore
  }
}

// Registra o resultado de um checkpoint para o aluno autenticado.
// dominou=true → domínio demonstrado; dominou=false → precisa de reforço.
export function registrarResultadoCheckpoint(unidadeId, dominou, { attempts, sinais, acertos, total, taxa, respostas, userId } = {}) {
  if (!userId) return;
  const dados = lerCheckpoints(userId);
  dados[unidadeId] = {
    dominou: Boolean(dominou),
    attempts: attempts ?? 0,
    acertos: acertos ?? 0,
    total: total ?? 0,
    taxa: taxa ?? 0,
    sinais: sinais ?? null,
    respostas: respostas ?? null,
    em: new Date().toISOString(),
  };
  salvarCheckpoints(userId, dados);
}