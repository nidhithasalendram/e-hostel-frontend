import api from './api';

export const authService = {
  login: async (usernameOrEmail, password) => {
    const res = await api.post('/auth/login', { usernameOrEmail, password });
    if (res.data && res.data.token) {
      localStorage.setItem('ehostel_token', res.data.token);
      localStorage.setItem('ehostel_user', JSON.stringify(res.data));
    }
    return res;
  },

  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  getCurrentUser: async () => {
    return await api.get('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('ehostel_token');
    localStorage.removeItem('ehostel_user');
  },

  getStoredUser: () => {
    const userStr = localStorage.getItem('ehostel_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};
