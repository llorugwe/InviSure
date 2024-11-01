// services/policiesService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Ensure this matches your backend server URL
});

// Function to fetch all policies associated with the logged-in user
export const getUserPolicies = async () => {
  try {
    const response = await api.get('/api/policies');
    return response.data;
  } catch (error) {
    console.error('Error fetching user policies:', error);
    throw error;
  }
};

// Function to retrieve premium information for each policy
export const getPremiums = async () => {
  try {
    const response = await api.get('/api/premiums');
    return response.data;
  } catch (error) {
    console.error('Error fetching premium information:', error);
    throw error;
  }
};
