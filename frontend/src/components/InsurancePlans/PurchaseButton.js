// src/components/InsurancePlans/PurchaseButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PurchaseButton = ({ planId, premium }) => {
  const navigate = useNavigate();

  const handlePurchase = () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      // If the user is not logged in, redirect to login
      alert('Please log in or register to make a purchase.');
      localStorage.setItem('redirectPath', `/purchase/${planId}`);
      navigate('/login');
      return;
    }

    // Redirect authenticated user to the dedicated purchase page with premium as state
    navigate(`/purchase/${planId}`, { state: { premium } });
  };

  return (
    <button onClick={handlePurchase} className="btn btn-primary">
      Purchase Plan
    </button>
  );
};

export default PurchaseButton;
