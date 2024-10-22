import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // Replace with your backend API base URL
});

export const submitClaim = async (claimData) => {
  try {
    const response = await api.post('/claims', claimData);
    return response.data;
  } catch (error) {
    console.error('Error submitting claim:', error);
    throw error;
  }
};
