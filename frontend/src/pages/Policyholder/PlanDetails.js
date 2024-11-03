// src/pages/Policyholder/PlanDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInsurancePlanDetails } from '../../services/insurancePlansService';

const PlanDetails = () => {
  const { planId } = useParams(); // Extract planId from the route
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('accessToken');

  // Fetch the plan details when the component loads
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const planData = await getInsurancePlanDetails(planId);
        setPlan(planData);
      } catch (err) {
        setError("Failed to load plan details.");
        console.error("Error fetching plan details:", err);
      }
    };
    fetchPlan();
  }, [planId]);

  // Handle the purchase button click
  const handlePurchase = () => {
    if (isAuthenticated) {
      navigate(`/purchase/${planId}`); // Go to purchase page directly if authenticated
    } else {
      alert("Please log in or register to purchase this plan.");
      localStorage.setItem("redirectPath", `/purchase/${planId}`); // Store the intended path
      navigate('/login'); // Redirect to login page
    }
  }; 

  return (
    <div className="container mt-5">
      {error && <p className="alert alert-danger">{error}</p>}
      {plan ? (
        <>
          <h1>{plan.policyName}</h1>
          <p>{plan.description}</p>
          <p><strong>Coverage:</strong> R {plan.coverageAmount.toLocaleString()}</p>
          <p><strong>Premium:</strong> R {plan.premiumAmount.toLocaleString()}</p>

          {/* Purchase button, conditional based on authentication status */}
          <button className="btn btn-primary mt-3" onClick={handlePurchase}>
            Purchase Plan
          </button>
        </>
      ) : (
        <p>Loading plan details...</p>
      )}
    </div>
  );
};

export default PlanDetails;
