// services/policiesService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Ensure this matches your backend server URL
});

// Add a request interceptor to include the access token in all requests if available
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

// Function to fetch all policies associated with the logged-in user
export const getUserPolicies = async () => {
  console.log("Attempting to fetch user policies from /api/policies");
  try {
    const response = await api.get('/api/policies');
    console.log("Received user policies:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user policies:", error);
    throw error;
  }
};

// Function to retrieve premium information for each policy
export const getPremiums = async () => {
  try {
    const response = await api.get('/premium/user-premiums'); // Ensure this matches backend endpoint for premiums
    return response.data;
  } catch (error) {
    console.error('Error fetching premium information:', error);
    throw error;
  }
};

// Function to purchase an insurance plan
export const purchaseInsurancePlan = async (planId) => {
  try {
    const response = await api.post(`/insurance-plans/${planId}/purchase`);
    console.log("Purchase successful:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error purchasing insurance plan:', error);
    throw error;
  }
};

export default api;
