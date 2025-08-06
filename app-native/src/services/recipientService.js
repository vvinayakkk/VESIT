import axios from 'axios';
import { API_URL } from '../config';

export const recipientService = {
  requestFood: async (requestData) => {
    return axios.post(`${API_URL}/recipient/req`, requestData);
  },

  getFoodRequest: async (requestId) => {
    return axios.get(`${API_URL}/recipient/req/${requestId}`);
  },

  claimFood: async (requestId, claimData) => {
    return axios.put(`${API_URL}/recipient/req/${requestId}`, claimData);
  },

  cancelRequest: async (requestId) => {
    return axios.delete(`${API_URL}/recipient/req/${requestId}`);
  },

  getRecipientProfile: async (recipientId) => {
    return axios.get(`${API_URL}/recipient/profile/${recipientId}`);
  },

  updateRecipientProfile: async (recipientId, profileData) => {
    return axios.put(`${API_URL}/recipient/profile/${recipientId}`, profileData);
  }
};
