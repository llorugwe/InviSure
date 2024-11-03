// src/services/paymentsService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Ensure this URL matches your backend server URL
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
 * Fetch payment details for a specific policy
 * @param {string} policyId - The ID of the policy
 * @returns {Promise<Object>} - Payment details including balance and due date
 */
export const getPolicyPaymentDetails = async (policyId) => {
  try {
    const response = await api.get(`/payments/${policyId}`);
    console.log("Payment details fetched:", response.data); // Log for debugging
    return response.data;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw error;
  }
};

/**
 * Make a payment for a specific policy
 * @param {string} policyId - The ID of the policy
 * @param {number} amount - The amount to pay toward the policy
 * @returns {Promise<Object>} - Updated payment information after payment is processed
 */
export const makePayment = async (policyId, amount) => {
  try {
    const response = await api.post(`/payments/${policyId}/pay`, { amount });
    console.log("Payment made successfully:", response.data); // Log for debugging
    return response.data;
  } catch (error) {
    console.error('Error making payment:', error);
    throw error;
  }
};

export default {
  getPolicyPaymentDetails,
  makePayment,
};
