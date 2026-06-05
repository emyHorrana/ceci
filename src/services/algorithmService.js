// algorithmService.js
// Serviço de integração com o algoritmo adaptativo do CECI.
// Responsável por análise de perfil, recomendação de lições,
// ajuste de dificuldade e monitoramento de interações do aluno.

import apiClient from './api';

// Analisa o perfil de aprendizado do aluno (histórico, padrões, nível estimado)
export async function analyzeUserProfile(userId) {
  return await apiClient.get(`/algorithm/profile/${userId}`);
}

// Retorna a próxima lição recomendada pelo algoritmo para o aluno
export async function getNextRecommendedLesson(userId) {
  return await apiClient.get(`/algorithm/recommend/${userId}`);
}

// Ajusta a dificuldade das próximas lições com base na performance recente
// performanceData: { correctAnswers, totalAnswers, timeSpent, etc. }
export async function adjustDifficulty(userId, performanceData) {
  return await apiClient.post(`/algorithm/adjust-difficulty/${userId}`, performanceData);
}

// Registra uma interação do aluno para análise pelo algoritmo adaptativo
// interactionData: { lessonId, exerciseId, action, result, etc. }
export async function monitorInteraction(userId, interactionData) {
  return await apiClient.post(`/algorithm/monitor/${userId}`, {
    ...interactionData,
    timestamp: new Date().toISOString(),
  });
}