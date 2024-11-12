// src/services/insurancePlansService.js
import axios from 'axios';

// Set up axios instance with the base URL for backend API
const api = axios.create({
  baseURL: 'http://localhost:5000', // Ensure this matches your backend server URL
});

// Interceptor to add JWT token from localStorage to request headers, if available
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

// Fetch all available insurance plans for the homepage
export const getInsurancePlans = async () => {
  console.log("Attempting to fetch insurance plans from /insurance-plans/available");
  try {
    const response = await api.get('/insurance-plans/available');
    console.log("Received insurance plans:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching insurance plans:", error);
    throw error;
  }
};

// Admin function to fetch all policies with full details
export const getAllPoliciesAdmin = async () => {
  try {
    const response = await api.get('/admin/policies');
    // Ensure the backend route returns details such as policyName, description, premiumAmount, coverageAmount, and insuranceType
    return response.data;
  } catch (error) {
    console.error('Error fetching all policies for admin:', error);
    throw error;
  }
};

// Admin function to create a new insurance policy
export const createPolicy = async (policyData) => {
  try {
    const response = await api.post('/admin/create-plan', policyData);
    return response.data;
  } catch (error) {
    console.error('Error creating policy:', error);
    throw error;
  }
};

// Admin function to update an insurance policy by ID
export const updatePolicy = async (policyId, updatedData) => {
  try {
    const response = await api.put(`/admin/policies/${policyId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating policy:', error);
    throw error;
  }
};

// Admin function to delete an insurance policy by ID
export const deletePolicy = async (policyId) => {
  try {
    const response = await api.delete(`/admin/policies/${policyId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting policy:', error);
    throw error;
  }
};

// Fetch publicly available insurance plans (for non-authenticated users)
export const getPublicInsurancePlans = async () => {
  try {
    const response = await api.get('/insurance-plans/available'); // Ensures route matches backend
    return response.data;
  } catch (error) {
    console.error('Error fetching public insurance plans:', error);
    throw error;
  }
};

// Fetch details of a specific insurance plan by ID
export const getInsurancePlanDetails = async (planId) => {
  try {
    const response = await api.get(`/insurance-plans/${planId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching insurance plan details:', error);
    throw error;
  }
};

// Purchase an insurance plan by ID
export const purchaseInsurancePlan = async (planId) => {
  try {
    const response = await api.post(`/insurance-plans/${planId}/purchase`);
    return response.data;
  } catch (error) {
    console.error('Error purchasing insurance plan:', error);
    throw error;
  }
};

// Exporting all functions for use in frontend components
export default {
  getInsurancePlans,
  getAllPoliciesAdmin,
  createPolicy,
  updatePolicy,
  deletePolicy,
  getPublicInsurancePlans,
  getInsurancePlanDetails,
  purchaseInsurancePlan,
};
