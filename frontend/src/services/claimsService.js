import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',  // Base URL for the backend
});

// Add a request interceptor to include the accessToken in all requests if available
api.interceptors.request.use(
  (config) => {
      const accessToken = localStorage.getItem('accessToken');
      console.log('Access Token:', accessToken);  // Log token to verify
      if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
  },
  (error) => Promise.reject(error)
);

// Refresh accessToken function
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token available');
  
  const response = await api.post('/auth/refresh-token', { token: refreshToken });
  const { accessToken: newAccessToken } = response.data;
  localStorage.setItem('accessToken', newAccessToken);
  return newAccessToken;
};

// Add a response interceptor to handle 401 errors and refresh the accessToken
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to check if the user is an admin
const isAdmin = () => {
  const role = localStorage.getItem('role');
  return role === 'admin';
};

// Login function
export const login = async (email, password) => {
  try {
      const response = await api.post('/auth/login', { email, password });
      // Store the access token and role in local storage
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('role', response.data.role);  // Save user role for reference
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
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

// Submit a new claim (Accessible to all users)
export const submitClaim = async (claimData) => {
  try {
    const response = await api.post('/claims', claimData);
    return response.data;
  } catch (error) {
    console.error('Error submitting claim:', error);
    throw error;
  }
};

// Retrieve all claims for the policyholder (Accessible to all users)
export const getClaims = async () => {
  try {
    const response = await api.get('/claims');
    return response.data;
  } catch (error) {
    console.error('Error fetching claims:', error);
    throw error;
  }
};

// Update the status of a claim (Admin functionality only)
export const updateClaimStatus = async (claimId, newStatus) => {
  if (!isAdmin()) {
    console.warn('Access denied: Only admins can update claim status.');
    return Promise.reject('Access Denied');
  }
  try {
    const response = await api.put(`/claims/${claimId}`, { status: newStatus });
    return response.data;
  } catch (error) {
    console.error('Error updating claim status:', error);
    throw error;
  }
};

// Admin Dashboard Metrics - Fetch total policies (Admin functionality only)
export const getTotalPolicies = async () => {
  if (!isAdmin()) {
    console.warn('Access denied: Only admins can access total policies.');
    return Promise.reject('Access Denied');
  }
  try {
    const response = await api.get('/admin/policies/total');
    return response.data;
  } catch (error) {
    console.error('Error fetching total policies:', error);
    throw error;
  }
};

// Admin Dashboard Metrics - Fetch pending claims (Admin functionality only)
export const getPendingClaims = async () => {
  if (!isAdmin()) {
    console.warn('Access denied: Only admins can access pending claims.');
    return Promise.reject('Access Denied');
  }
  try {
    const response = await api.get('/admin/claims/pending');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending claims:', error);
    throw error;
  }
};

// Admin Dashboard Metrics - Fetch total claims (Admin functionality only)
export const getTotalClaims = async () => {
  if (!isAdmin()) {
    console.warn('Access denied: Only admins can access total claims.');
    return Promise.reject('Access Denied');
  }
  try {
    const response = await api.get('/admin/claims/total');
    return response.data;
  } catch (error) {
    console.error('Error fetching total claims:', error);
    throw error;
  }
};

// Request Password Reset function
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/auth/request-password-reset', { email });
    return response.data;
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
};

// Reset Password function
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};
