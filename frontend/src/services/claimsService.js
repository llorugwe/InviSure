import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',  // Base URL for the backend
});

// Add a request interceptor to include the token in all requests if available
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Add the Authorization header with the token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Login function
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    // Store the token in localStorage
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Register function
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    // Store the token in localStorage
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

// Submit a new claim
export const submitClaim = async (claimData) => {
  try {
    const response = await api.post('/claims', claimData);
    return response.data;
  } catch (error) {
    console.error('Error submitting claim:', error);
    throw error;
  }
};

// Retrieve all claims for the policyholder
export const getClaims = async () => {
  try {
    const response = await api.get('/claims');
    return response.data;
  } catch (error) {
    console.error('Error fetching claims:', error);
    throw error;
  }
};

// Update the status of a claim (Admin functionality)
export const updateClaimStatus = async (claimId, newStatus) => {
  try {
    const response = await api.put(`/claims/${claimId}`, { status: newStatus });
    return response.data;
  } catch (error) {
    console.error('Error updating claim status:', error);
    throw error;
  }
};
