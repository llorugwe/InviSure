// services/insurancePlansService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Ensure this matches your backend server URL
});

// Function to fetch all available insurance plans
export const getInsurancePlans = async () => {
  try {
    const response = await api.get('/insurance-plans');
    return response.data;
  } catch (error) {
    console.error('Error fetching insurance plans:', error);
    throw error;
  }
};

// Function to fetch details of a specific insurance plan by ID
export const getInsurancePlanDetails = async (planId) => {
  try {
    const response = await api.get(`/insurance-plans/${planId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching insurance plan details:', error);
    throw error;
  }
};

// Function to purchase an insurance plan
export const purchaseInsurancePlan = async (planId) => {
  try {
    const response = await api.post(`/insurance-plans/${planId}/purchase`);
    return response.data;
  } catch (error) {
    console.error('Error purchasing insurance plan:', error);
    throw error;
  }
};
