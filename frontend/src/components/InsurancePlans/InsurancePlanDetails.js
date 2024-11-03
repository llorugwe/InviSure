import React from 'react';
import { useNavigate } from 'react-router-dom';
import PurchaseButton from './PurchaseButton';

const InsurancePlanDetails = ({ plan }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken'); // Check if the user is logged in
  const navigate = useNavigate();

  const handlePurchaseClick = () => {
    if (isAuthenticated) {
      // Redirect to purchase page or process purchase
      navigate(`/purchase/${plan.id}`);
    } else {
      // Prompt user to register or login
      navigate('/register');
    }
  };

  return (
    <div className="card p-4">
      <h3>{plan.name}</h3>
      <p><strong>Description:</strong> {plan.description}</p>
      <p><strong>Coverage Amount:</strong> R {plan.coverageAmount}</p>
      <p><strong>Premium:</strong> R {plan.premiumAmount}</p>
      <button onClick={handlePurchaseClick} className="btn btn-primary mt-3">
        {isAuthenticated ? 'Purchase' : 'Register to Purchase'}
      </button>
    </div>
  );
};

export default InsurancePlanDetails;
