// src/components/InsurancePlans/PurchaseButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { purchaseInsurancePlan } from '../../services/insurancePlansService';

const PurchaseButton = ({ planId, premium }) => {
  const navigate = useNavigate();

  const handlePurchase = async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      // If the user is not logged in, redirect to login
      alert('Please log in or register to make a purchase.');
      localStorage.setItem('redirectPath', `/purchase/${planId}`);
      navigate('/login');
      return;
    }

    try {
      // Redirect authenticated user to the dedicated purchase page
      navigate(`/purchase/${planId}?premium=${premium}`);
    } catch (error) {
      console.error('Error initiating purchase:', error);
      alert('Failed to initiate purchase. Please try again.');
    }
  };

  return (
    <button onClick={handlePurchase} className="btn btn-primary">
      Purchase Plan
    </button>
  );
};

export default PurchaseButton;
