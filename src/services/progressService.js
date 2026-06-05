import apiClient from './api';

export async function getUserModules(userId) {
  return await apiClient.get(`/licoes?usuario_id=${userId}`);
}

export async function getUserProgress(userId) {
  return await apiClient.get(`/progresso/${userId}`);
}

export async function updateProgress(usuarioId, licaoId, progress, completed = false) {
  return await apiClient.post('/progresso', { usuario_id: usuarioId, licao_id: licaoId, progress, completed });
}

export async function concluirLicao(licaoId, usuarioId) {
  return await apiClient.post(`/licoes/${licaoId}/concluir`, { usuario_id: usuarioId });
}