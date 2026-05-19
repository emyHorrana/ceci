import apiClient from './api';

export async function getLesson(lessonId) {
  return await apiClient.get(`/lessons/${lessonId}`);
}

export async function getLessonsByModule(moduleId) {
  return await apiClient.get(`/modules/${moduleId}/lessons`);
}

export async function updateLessonProgress(lessonId, progressData) {
  return await apiClient.put(`/lessons/${lessonId}/progress`, progressData);
}

export async function submitExerciseAnswer(lessonId, exerciseId, answer) {
  return await apiClient.post(`/lessons/${lessonId}/exercises/${exerciseId}/answer`, {
    answer,
    timestamp: new Date().toISOString()
  });
}

export async function getExerciseFeedback(lessonId, exerciseId, answer) {
  return await apiClient.post(`/lessons/${lessonId}/exercises/${exerciseId}/feedback`, {
    answer
  });
}