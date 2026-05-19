import apiClient from './api';

export async function getUserProgress(userId) {
  return await apiClient.get(`/progress/${userId}`);
}

export async function getUserModules(userId) {
  return await apiClient.get(`/modules/${userId}`);
}

export async function updateProgress(lessonId, progressData) {
  return await apiClient.put(`/progress/lesson/${lessonId}`, progressData);
}

export async function getAchievements(userId) {
  return await apiClient.get(`/achievements/${userId}`);
}
