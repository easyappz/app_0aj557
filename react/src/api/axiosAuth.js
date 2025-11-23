import instance from './axios';

// Attach a request interceptor to automatically include auth token if it exists
instance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('authToken');

      if (token) {
        if (!config.headers) {
          config.headers = {};
        }
        config.headers.Authorization = 'Token ' + token;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export { instance };
export default instance;
