// src/pages/Policyholder/PlanDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInsurancePlanDetails, purchaseInsurancePlan } from '../../services/insurancePlansService';

const PlanDetails = () => {
  const { planId } = useParams(); // Extract planId from the route
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [purchaseError, setPurchaseError] = useState(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

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

  // Handle purchasing the plan
  const handlePurchase = async () => {
    try {
      await purchaseInsurancePlan(planId);
      setPurchaseSuccess(true);
      setPurchaseError(null); // Clear any previous errors
    } catch (err) {
      setPurchaseError("Failed to purchase the insurance plan.");
      console.error("Error purchasing insurance plan:", err);
    }
  };

  // Navigate back to the dashboard or refresh plan details if purchase was successful
  useEffect(() => {
    if (purchaseSuccess) {
      navigate("/dashboard"); // Redirects user to their dashboard
    }
  }, [purchaseSuccess, navigate]);

  return (
    <div className="container mt-5">
      {error && <p className="alert alert-danger">{error}</p>}
      {plan ? (
        <>
          <h1>{plan.policyName}</h1>
          <p>{plan.description}</p>
          <p><strong>Coverage:</strong> R {plan.coverageAmount.toLocaleString()}</p>
          <p><strong>Premium:</strong> R {plan.premiumAmount.toLocaleString()}</p>

          {/* Purchase button */}
          {purchaseError && <p className="alert alert-danger">{purchaseError}</p>}
          <button className="btn btn-success" onClick={handlePurchase}>
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
