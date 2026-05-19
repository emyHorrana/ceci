import apiClient from './api';

export async function sendMessage(userId, message, context = {}) {
  return await apiClient.post('/chatbot/message', {
    userId,
    message,
    context,
    timestamp: new Date().toISOString()
  });
}

export async function getChatHistory(userId, limit = 20) {
  return await apiClient.get(`/chatbot/history/${userId}?limit=${limit}`);
}

export async function getContextualHelp(topic, userLevel) {
  return await apiClient.get(`/chatbot/help/${topic}?level=${userLevel}`);
}