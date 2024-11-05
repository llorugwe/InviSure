// src/components/InsurancePlans/PlanDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInsurancePlanDetails } from '../../services/insurancePlansService';
import PremiumCalculator from './PremiumCalculator';
import { fetchInsuranceMetadata, calculatePremium } from '../../services/premiumService';
import PurchaseButton from './PurchaseButton';

const PlanDetails = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [formFields, setFormFields] = useState([]); // Dynamic form fields
  const [riskData, setRiskData] = useState({});
  const [calculatedPremium, setCalculatedPremium] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const planData = await getInsurancePlanDetails(planId);
        setPlan(planData);

        // Only fetch metadata fields if the premium type is dynamic
        if (planData.premiumType === 'Dynamic') {
          fetchInsuranceMetadataFields(planData.insuranceType);
        }
      } catch (err) {
        setError("Failed to load plan details.");
      }
    };

    const fetchInsuranceMetadataFields = async (insuranceType) => {
      try {
        const fields = await fetchInsuranceMetadata(insuranceType);
        if (fields && fields.length > 0) {
          setFormFields(fields);
        } else {
          setError("No form fields available for this insurance type.");
        }
      } catch (err) {
        console.error("Error fetching metadata:", err);
        setError("Failed to load insurance metadata.");
      }
    };

    fetchPlanDetails();
  }, [planId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRiskData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCalculatePremium = async (e) => {
    e.preventDefault();
    try {
      const premium = await calculatePremium(planId, riskData);
      setCalculatedPremium(premium);
    } catch (error) {
      setError("Failed to calculate premium.");
    }
  };

  return (
    <div className="container mt-5">
      {error && <p className="alert alert-danger">{error}</p>}
      {plan ? (
        <div>
          <h1>{plan.policyName}</h1>
          <p>{plan.description}</p>
          <p><strong>Coverage:</strong> R {plan.coverageAmount.toLocaleString()}</p>
          <p><strong>Insurance Type:</strong> {plan.insuranceType}</p>

          {/* Show either the base premium or the dynamic premium calculation */}
          {plan.premiumType === 'Fixed' ? (
            <p><strong>Premium:</strong> R {plan.premiumAmount.toLocaleString()}</p>
          ) : (
            <>
              <h3>Risk Assessment Form</h3>
              
              {/* Display a message if no form fields are available */}
              {formFields.length > 0 ? (
                <form onSubmit={handleCalculatePremium}>
                  {/* Dynamic form fields based on insurance type */}
                  {formFields.map((field) => (
                    <div key={field.name} className="mb-3">
                      <label>{field.label || field.name}</label>
                      {field.type === "select" ? (
                        <select
                          name={field.name}
                          onChange={handleChange}
                          required={field.required}
                          className="form-select"
                        >
                          <option value="">Select</option>
                          {field.options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type || "text"}
                          name={field.name}
                          onChange={handleChange}
                          required={field.required}
                          className="form-control"
                        />
                      )}
                    </div>
                  ))}
                  <button type="submit" className="btn btn-info mt-3">Calculate Premium</button>
                </form>
              ) : (
                <p>No dynamic form fields are available for this insurance type.</p>
              )}

              {/* Display the calculated premium and purchase button */}
              {calculatedPremium && (
                <div className="mt-4">
                  <PremiumCalculator premium={calculatedPremium} />
                  <PurchaseButton planId={planId} />
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PlanDetails;
