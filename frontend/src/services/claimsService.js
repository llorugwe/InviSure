import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // Replace with your backend API base URL
});

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
