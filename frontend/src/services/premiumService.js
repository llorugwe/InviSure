// src/services/premiumService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Ensure this matches your backend server URL
});

// Interceptor to add JWT token for authorization
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Calculate premium based on risk data
 * @param {Object} riskData - The data related to user risk assessment (e.g., age, health conditions)
 * @returns {Promise<number>} - The calculated premium amount
 */
export const calculatePremium = async (riskData) => {
  try {
    const response = await api.post('/premiums/calculate', riskData);
    console.log('Calculated premium:', response.data); // Log for debugging
    return response.data.premium; // Assuming the backend returns { premium: <calculatedAmount> }
  } catch (error) {
    console.error('Error calculating premium:', error);
    throw error;
  }
};

export default {
  calculatePremium,
};
