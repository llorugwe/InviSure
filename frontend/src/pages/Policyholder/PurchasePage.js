// src/pages/Policyholder/PurchasePage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInsurancePlanDetails } from '../../services/insurancePlansService'; // Updated path
import { purchaseInsurancePlan } from '../../services/policiesService'; // Updated path

const PurchasePage = () => {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const data = await getInsurancePlanDetails(planId);
        setPlan(data);
      } catch (error) {
        setError('Failed to load plan details.');
        console.error('Error fetching plan details:', error);
      } finally {
        setIsLoading(false); // Stop loading after fetch completes
      }
    };
    fetchPlanDetails();
  }, [planId]);

  const handlePurchase = async () => {
    try {
      await purchaseInsurancePlan(planId);
      alert('Purchase successful! You can view your policy in your dashboard.');
      navigate('/dashboard'); // Redirect to dashboard after purchase
    } catch (error) {
      setError('Failed to complete the purchase. Please try again.');
      console.error('Error purchasing plan:', error);
    }
  };

  if (isLoading) return <p>Loading plan details...</p>; // Show loading message
  if (error) return <p className="alert alert-danger">{error}</p>; // Show error if any

  return (
    <div className="container mt-5">
      <h2>Purchase Insurance Plan</h2>
      {plan && (
        <div className="card p-4 shadow-sm">
          <h3>{plan.policyName}</h3>
          <p><strong>Description:</strong> {plan.description}</p>
          <p><strong>Coverage Amount:</strong> R {plan.coverageAmount.toLocaleString()}</p>
          <p><strong>Premium:</strong> R {plan.premiumAmount.toLocaleString()}</p>
          <button onClick={handlePurchase} className="btn btn-success mt-3">
            Confirm Purchase
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary mt-3 ml-2"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default PurchasePage;
