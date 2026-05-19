import apiClient from './api';

export async function analyzeUserProfile(userId) {
  return await apiClient.get(`/algorithm/profile/${userId}`);
}

export async function getNextRecommendedLesson(userId) {
  return await apiClient.get(`/algorithm/recommend/${userId}`);
}

export async function adjustDifficulty(userId, performanceData) {
  return await apiClient.post(`/algorithm/adjust-difficulty/${userId}`, performanceData);
}

export async function monitorInteraction(userId, interactionData) {
  return await apiClient.post(`/algorithm/monitor/${userId}`, {
    ...interactionData,
    timestamp: new Date().toISOString()
  });
}
