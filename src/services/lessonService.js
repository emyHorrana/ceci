// lessonService.js
// Serviço de lições do CECI.
// Faz as chamadas à API relacionadas a lições, exercícios e progresso por lição.

import apiClient from './api';

// Busca os dados completos de uma lição pelo ID (título, steps, tipo, etc.)
export async function getLesson(lessonId) {
  return await apiClient.get(`/lessons/${lessonId}`);
}

// Busca todas as lições de um módulo específico
export async function getLessonsByModule(moduleId) {
  return await apiClient.get(`/modules/${moduleId}/lessons`);
}

// Atualiza o progresso do aluno em uma lição (ex: step concluído, lição finalizada)
export async function updateLessonProgress(lessonId, progressData) {
  return await apiClient.put(`/lessons/${lessonId}/progress`, progressData);
}

// Envia a resposta do aluno para um exercício de uma lição
export async function submitExerciseAnswer(lessonId, exerciseId, answer) {
  return await apiClient.post(
    `/lessons/${lessonId}/exercises/${exerciseId}/answer`,
    {
      answer,
      timestamp: new Date().toISOString(),
    }
  );
}

// Solicita feedback da API para a resposta enviada pelo aluno em um exercício
export async function getExerciseFeedback(lessonId, exerciseId, answer) {
  return await apiClient.post(
    `/lessons/${lessonId}/exercises/${exerciseId}/feedback`,
    { answer }
  );
}