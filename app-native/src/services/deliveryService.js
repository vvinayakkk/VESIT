import axios from 'axios';
import { API_URL } from '../config';

export const deliveryService = {
  getAllListings: async () => {
    return axios.get(`${API_URL}/delivery/foodlistings`);
  },

  acceptPickup: async (deliveryId, pickupData) => {
    return axios.post(`${API_URL}/delivery/pickup/${deliveryId}`, pickupData);
  },

  updateDeliveryStatus: async (deliveryId, statusData) => {
    return axios.put(`${API_URL}/delivery/delivery/${deliveryId}`, statusData);
  },

  getAgentDeliveries: async (agentId) => {
    return axios.get(`${API_URL}/delivery/deliveries/${agentId}`);
  },

  getDeliveryHistory: async (agentId) => {
    return axios.get(`${API_URL}/delivery/history/${agentId}`);
  }
};
