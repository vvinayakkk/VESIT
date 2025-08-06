import axios from 'axios';
import { API_URL } from '../config';

export const userService = {
  donate: async (foodData) => {
    return axios.post(`${API_URL}/user/donate`, foodData);
  },

  getUserFoodListings: async (userId) => {
    return axios.get(`${API_URL}/user/food-listings/${userId}`);
  },

  getProfile: async (userId) => {
    return axios.get(`${API_URL}/user/profile/${userId}`);
  },

  updateProfile: async (userId, profileData) => {
    return axios.put(`${API_URL}/user/profile/${userId}`, profileData);
  },

  deleteProfile: async (userId) => {
    return axios.delete(`${API_URL}/user/profile/${userId}`);
  }
};
