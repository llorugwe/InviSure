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

// Function to fetch all available insurance plans for the homepage
export const getInsurancePlans = async () => {
  try {
    const response = await api.get('/insurance-plans');
    return response.data;
  } catch (error) {
    console.error('Error fetching insurance plans:', error);
    throw error;
  }
};

// Function to fetch all policies for admin management
export const getAllPoliciesAdmin = async () => {
  try {
    const response = await api.get('/admin/policies');
    return response.data;
  } catch (error) {
    console.error('Error fetching all policies for admin:', error);
    throw error;
  }
};

// Function to create a new insurance policy (Admin only)
export const createPolicy = async (policyData) => {
  try {
    const response = await api.post('/admin/create-plan', policyData);
    return response.data;
  } catch (error) {
    console.error('Error creating policy:', error);
    throw error;
  }
};

// Function to update an insurance policy (Admin only)
export const updatePolicy = async (policyId, updatedData) => {
  try {
    const response = await api.put(`/admin/policies/${policyId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating policy:', error);
    throw error;
  }
};

// Function to delete an insurance policy (Admin only)
export const deletePolicy = async (policyId) => {
  try {
    const response = await api.delete(`/admin/policies/${policyId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting policy:', error);
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
