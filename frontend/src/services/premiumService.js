// src/services/premiumService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ensure this matches your backend server URL and includes '/api' if needed
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
 * Fetch insurance metadata for the risk assessment form based on insurance type
 * @param {string} insuranceType - Type of the insurance (e.g., 'Health', 'Life', etc.)
 * @returns {Promise<Array>} - Array of form fields for the specified insurance type
 */
export const fetchInsuranceMetadata = async (insuranceType) => {
  try {
    const response = await api.get(`/insurance-metadata/${insuranceType}`);
    console.log('Fetched insurance metadata:', response.data.fields);
    return response.data.fields;  // Ensure response contains .fields as expected
  } catch (error) {
    console.error('Error fetching insurance metadata:', error);
    throw error;
  }
};

/**
 * Calculate premium based on risk data
 * @param {string} planId - ID of the insurance plan
 * @param {Object} riskData - The data related to user risk assessment (e.g., age, health conditions)
 * @returns {Promise<number>} - The calculated premium amount
 */
export const calculatePremium = async (planId, riskData) => {
  try {
    const response = await api.post('/premium/calculate', { policyId: planId, riskData });
    console.log('Calculated premium:', response.data.premiumAmount); // Assuming response includes premiumAmount
    return response.data.premiumAmount;
  } catch (error) {
    console.error('Error calculating premium:', error);
    throw error;
  }
};

/**
 * Handle the policy purchase process by navigating to purchase page with calculated premium
 * @param {string} planId - The ID of the insurance plan to purchase
 * @param {number} premium - The premium amount for the purchase
 * @param {Function} navigate - Navigation function to redirect to the purchase page
 */
export const initiatePurchase = (planId, premium, navigate) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    // If the user is not logged in, redirect to login page
    alert('Please log in or register to make a purchase.');
    localStorage.setItem('redirectPath', `/purchase/${planId}`);
    navigate('/login');
    return;
  }

  // Redirect to the dedicated purchase page with the calculated premium
  navigate(`/purchase/${planId}?premium=${premium}`);
};

export default {
  fetchInsuranceMetadata,
  calculatePremium,
  initiatePurchase,
};
