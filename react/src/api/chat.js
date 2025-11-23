import instance from './axios';
import './axiosAuth';

export async function fetchMessages() {
  const response = await instance.get('/api/chat/messages/');
  const data = response.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (data && Array.isArray(data.results)) {
    return data.results;
  }

  return [];
}

export async function sendMessage({ text }) {
  const response = await instance.post('/api/chat/messages/', { text });
  return response.data;
}
