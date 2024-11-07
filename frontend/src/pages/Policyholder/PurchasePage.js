import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getInsurancePlanDetails } from '../../services/insurancePlansService';
import { purchaseInsurancePlan } from '../../services/policiesService';

const PurchasePage = () => {
  const { planId } = useParams();
  const { state } = useLocation(); // Access location state to get the premium
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const data = await getInsurancePlanDetails(planId);
        setPlan(data);
      } catch (error) {
        setError('Failed to load plan details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlanDetails();
  }, [planId]);

  const handlePurchase = async () => {
    try {
      // Include premiumAmount if it's a dynamic premium plan
      const purchaseData = {
        premiumAmount: state?.premium // Pass calculated premium for dynamic plans
      };
      await purchaseInsurancePlan(planId, purchaseData);
      alert('Purchase successful! You can view your policy in your dashboard.');
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to complete the purchase. Please try again.');
    }
  };

  if (isLoading) return <p>Loading plan details...</p>;
  if (error) return <p className="alert alert-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <h2>Purchase Insurance Plan</h2>
      {plan && (
        <div className="card p-4 shadow-sm">
          <h3>{plan.policyName}</h3>
          <p><strong>Description:</strong> {plan.description}</p>
          <p><strong>Coverage Amount:</strong> R {plan.coverageAmount?.toLocaleString() || 'N/A'}</p>
          <p><strong>Premium:</strong> R {state?.premium?.toLocaleString() || 'N/A'}</p>
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
