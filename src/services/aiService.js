// aiService.js
// Serviço de integração com o Gemini Flash (via backend CECI)
// para reformulação de explicações com analogias do cotidiano e tom acolhedor.

import apiClient from './api';

/**
 * Solicita uma reformulação personalizada da explicação de uma etapa.
 * Envia os identificadores da etapa (miniModuloId, etapaIndice) para que o backend
 * obtenha o conteúdo estático oficial e seguro diretamente do servidor.
 *
 * @param {Object} params
 * @param {string} params.miniModuloId - ID do mini-módulo (ex: '1-1')
 * @param {number} params.etapaIndice - Índice da etapa dentro do mini-módulo
 * @param {string} [params.etapaId] - ID específico da etapa
 * @param {string} [params.moduleId] - ID do módulo pai
 * @param {string} [params.nivel] - Nível adaptativo do aluno (ex: 'Iniciante', 'Básico')
 * @param {string} [params.motivo] - 'reforco' ou 'duvida'
 * @returns {Promise<{ success: boolean, explicacao: string, titulo: string, nivel: string }>}
 */
export async function reformularExplicacao({
  miniModuloId,
  etapaIndice,
  etapaId,
  moduleId,
  nivel,
  motivo = 'duvida',
}) {
  try {
    const data = await apiClient.post(
      '/conteudo/reformular',
      {
        miniModuloId,
        etapaIndice,
        etapaId,
        moduleId,
        nivel,
        motivo,
      },
      { timeout: 45000 }
    );
    return data;
  } catch (err) {
    console.error('[aiService.reformularExplicacao]', err);
    throw err;
  }
}
