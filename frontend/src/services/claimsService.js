import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Base URL for the backend
});

// Interceptor to include accessToken in headers
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

// Refresh accessToken if expired
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token available');

  const response = await api.post('/auth/refresh-token', { token: refreshToken });
  const { accessToken: newAccessToken } = response.data;
  localStorage.setItem('accessToken', newAccessToken);
  return newAccessToken;
};

// 401 error handler for token refresh
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
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Helper to check if user is an admin
const isAdmin = () => localStorage.getItem('role') === 'admin';

// **Policyholder Functions**

// Submit a new claim
export const submitClaim = async (claimData) => {
  try {
    const response = await api.post('/claims/submit', claimData);
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

// Retrieve policy details available to policyholders
export const getAvailablePolicies = async () => {
  try {
    const response = await api.get('/api/policies');
    return response.data;
  } catch (error) {
    console.error('Error fetching available policies:', error);
    throw error;
  }
};

// **Admin Functions**

// Retrieve all claims with user and policy details
export const getAllClaims = async () => {
  if (!isAdmin()) {
    console.warn('Access denied: Only admins can retrieve all claims.');
    return Promise.reject('Access Denied');
  }
  try {
    const response = await api.get('/admin/all-claims');
    return response.data;
  } catch (error) {
    console.error('Error fetching all claims:', error);
    throw error;
  }
};

// Update the status of a claim
export const updateClaimStatus = async (claimId, newStatus) => {
  if (!isAdmin()) {
    console.warn('Access denied: Only admins can update claim status.');
    return Promise.reject('Access Denied');
  }
  try {
    const response = await api.put(`/admin/update-claim-status/${claimId}`, { status: newStatus });
    return response.data;
  } catch (error) {
    console.error('Error updating claim status:', error);
    throw error;
  }
};

// **Admin Dashboard Metrics**

// Fetch total policies
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

// Fetch pending claims
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

// Fetch total claims
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

// **Authentication Functions**

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('role', response.data.role);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

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

export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/auth/request-password-reset', { email });
    return response.data;
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};
