import instance from './axiosAuth';

export async function registerMember({ username, password }) {
  const response = await instance.post('/api/auth/register/', {
    username,
    password,
  });

  return response.data;
}

export async function loginMember({ username, password }) {
  const response = await instance.post('/api/auth/login/', {
    username,
    password,
  });

  return response.data;
}

export async function logoutMember() {
  const response = await instance.post('/api/auth/logout/');
  return response.data;
}

export async function fetchCurrentMember() {
  const response = await instance.get('/api/auth/me/');
  return response.data;
}
