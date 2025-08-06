import axios from 'axios';
import { API_URL } from '../config';

export const authService = {
  login: async (credentials) => {
    return axios.post(`${API_URL}/auth/login`, credentials);
  },
  
  register: async (userData) => {
    return axios.post(`${API_URL}/auth/register`, userData);
  }
};
