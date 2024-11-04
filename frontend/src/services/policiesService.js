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

// Function to fetch all policies, optionally filtered by insurance type
export const fetchPolicies = async (insuranceType = '') => {
  try {
    const response = await api.get('/api/policies', {
      params: { type: insuranceType },
    });
    
    // Map through policies to add premium display logic
    const policiesWithDisplayPremium = response.data.map((policy) => ({
      ...policy,
      displayPremium: policy.premiumType === 'Fixed'
        ? `R ${policy.premiumAmount?.toLocaleString()}`
        : 'Calculated based on risk assessment',
    }));
    
    console.log("Fetched policies with premium display:", policiesWithDisplayPremium);
    return policiesWithDisplayPremium;
  } catch (error) {
    console.error("Error fetching policies:", error);
    throw error;
  }
};

// Function to create a new insurance policy (Admin only)
export const createPolicy = async (policyData) => {
  try {
    const response = await api.post('/api/policies', policyData);
    console.log("Policy created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating policy:", error);
    throw error;
  }
};

// Function to fetch all policies associated with the logged-in user
export const getUserPolicies = async () => {
  console.log("Attempting to fetch user policies from /api/policies");
  try {
    const response = await api.get('/api/policies');
    const userPoliciesWithDisplayPremium = response.data.map((policy) => ({
      ...policy,
      displayPremium: policy.premiumType === 'Fixed'
        ? `R ${policy.premiumAmount?.toLocaleString()}`
        : 'Calculated based on risk assessment',
    }));
    console.log("Received user policies:", userPoliciesWithDisplayPremium);
    return userPoliciesWithDisplayPremium;
  } catch (error) {
    console.error("Error fetching user policies:", error);
    throw error;
  }
};

// Function to retrieve premium information for each policy
export const getPremiums = async () => {
  try {
    const response = await api.get('/premium/user-premiums');
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
