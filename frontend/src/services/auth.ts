import { makeApiCall } from '@/src/config/apiconfig';

export const authService = {
  login: async (credentials: any) => {
    return await makeApiCall('POST', '/auth/login', credentials);
  },

  register: async (userData: any) => {
    return await makeApiCall('POST', '/auth/register', userData);
  },

  logout: async () => {
    return await makeApiCall('POST', '/auth/logout');
  },

  changePassword: async (data: any) => {
    return await makeApiCall('POST', '/auth/change-password', data);
  },

  getCurrentUser: async () => {
    return await makeApiCall('GET', '/auth/me');
  }
};
