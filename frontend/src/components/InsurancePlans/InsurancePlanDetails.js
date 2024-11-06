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
  const [formFields, setFormFields] = useState([]);
  const [riskData, setRiskData] = useState({});
  const [calculatedPremium, setCalculatedPremium] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching plan details for planId:", planId);

    const fetchPlanDetails = async () => {
      try {
        const planData = await getInsurancePlanDetails(planId);
        console.log("Fetched plan details:", planData);
        setPlan(planData);

        // Only fetch metadata fields if the premium type is dynamic
        if (planData.premiumType === 'Dynamic') {
          console.log("Plan is dynamic. Fetching insurance metadata for type:", planData.insuranceType);
          fetchInsuranceMetadataFields(planData.insuranceType);
        }
      } catch (err) {
        setError("Failed to load plan details.");
        console.error("Error fetching plan details:", err);
      }
    };

    const fetchInsuranceMetadataFields = async (insuranceType) => {
      try {
        console.log("Fetching metadata for insurance type:", insuranceType);
        const fields = await fetchInsuranceMetadata(insuranceType);
        console.log("Metadata response:", fields);

        if (fields && fields.length > 0) {
          setFormFields(fields);
          console.log("Form fields set for metadata:", fields);
          // Initialize riskData with default empty values for each field
          setRiskData(fields.reduce((data, field) => {
            data[field.name] = field.type === 'number' ? 0 : ''; // Set numeric fields to 0 as default
            return data;
          }, {}));
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
    const { name, value, type } = e.target;
    const formattedValue = type === "number" ? parseFloat(value) || 0 : value; // Handle numeric and text input types
    setRiskData((prevData) => ({ ...prevData, [name]: formattedValue }));
  };

  const handleCalculatePremium = async (e) => {
    e.preventDefault();
    if (!plan.insuranceType || !riskData) {
      setError("Please complete the form with all required fields.");
      return;
    }
    try {
      const premium = await calculatePremium(planId, { insuranceType: plan.insuranceType, riskData });
      setCalculatedPremium(premium);
      console.log("Calculated premium:", premium);
    } catch (error) {
      setError("Failed to calculate premium.");
      console.error("Error calculating premium:", error);
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
                          value={riskData[field.name] || ""}
                          onChange={handleChange}
                          required={field.required}
                          className="form-select"
                        >
                          <option value="">Select</option>
                          {field.options.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type === "number" ? "number" : "text"}
                          name={field.name}
                          value={riskData[field.name] || ""}
                          onChange={handleChange}
                          required={field.required}
                          className="form-control"
                          min={0} // Optional: restricts input to positive numbers
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
