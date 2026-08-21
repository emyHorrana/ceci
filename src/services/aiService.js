// aiService.js
// Serviço de integração com o Gemini 2.0 Flash (via backend CECI)
// para reformulação de explicações com analogias do cotidiano e tom acolhedor.

import apiClient from './api';

/**
 * Solicita uma reformulação personalizada da explicação de uma etapa
 * @param {Object} params
 * @param {string} params.contexto - Texto original da etapa (HTML ou texto puro)
 * @param {string} [params.titulo] - Título da etapa ou do mini-módulo
 * @param {string} [params.nivel] - Nível adaptativo do aluno (ex: 'Iniciante', 'Básico')
 * @param {string} [params.motivo] - 'reforco' (pós erro em desafio/prática) ou 'duvida' (clique voluntário)
 * @returns {Promise<{ success: boolean, explicacao: string, titulo: string, nivel: string }>}
 */
export async function reformularExplicacao({ contexto, titulo, nivel, motivo = 'duvida' }) {
  try {
    const data = await apiClient.post('/conteudo/reformular', {
      contexto,
      titulo,
      nivel,
      motivo,
    });
    return data;
  } catch (err) {
    console.error('[aiService.reformularExplicacao]', err);
    throw err;
  }
}
