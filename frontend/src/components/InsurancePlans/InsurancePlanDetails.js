import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculatePremium } from '../../services/premiumService'; // Import premium calculation function

const InsurancePlanDetails = ({ plan }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken'); // Check if the user is logged in
  const navigate = useNavigate();

  // State for risk assessment form and calculated premium
  const [riskData, setRiskData] = useState({});
  const [calculatedPremium, setCalculatedPremium] = useState(null);
  const [error, setError] = useState(null);

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRiskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission for premium calculation
  const handleCalculatePremium = async () => {
    try {
      const premium = await calculatePremium(riskData);
      setCalculatedPremium(premium);
      setError(null);
    } catch (err) {
      setError('Failed to calculate premium. Please try again.');
    }
  };

  // Handle purchase click based on authentication
  const handlePurchaseClick = () => {
    if (isAuthenticated) {
      navigate(`/purchase/${plan.id}`); // Redirect to purchase page if authenticated
    } else {
      navigate('/register'); // Prompt to register or login if not authenticated
    }
  };

  return (
    <div className="card p-4">
      <h3>{plan.name}</h3>
      <p><strong>Description:</strong> {plan.description}</p>
      <p><strong>Coverage Amount:</strong> R {plan.coverageAmount}</p>
      <p><strong>Base Premium:</strong> R {plan.premiumAmount}</p>

      {/* Risk Assessment Form */}
      <h4>Risk Assessment</h4>
      {plan.insuranceType === 'health' && (
        <>
          <div className="form-group">
            <label>Age</label>
            <input type="number" name="age" onChange={handleChange} className="form-control" />
          </div>
          <div className="form-group">
            <label>Health Conditions</label>
            <input type="text" name="healthConditions" onChange={handleChange} className="form-control" />
          </div>
          <div className="form-group">
            <label>Smoking Status</label>
            <select name="smokingStatus" onChange={handleChange} className="form-control">
              <option value="">Select</option>
              <option value="smoker">Smoker</option>
              <option value="non-smoker">Non-Smoker</option>
            </select>
          </div>
        </>
      )}
      {/* Add more fields for other insurance types as needed */}

      <button onClick={handleCalculatePremium} className="btn btn-info mt-3">
        Calculate Premium
      </button>

      {error && <p className="alert alert-danger mt-3">{error}</p>}

      {calculatedPremium && (
        <div className="mt-4">
          <h4>Calculated Premium: R {calculatedPremium.toLocaleString()}</h4>
          <button onClick={handlePurchaseClick} className="btn btn-primary mt-3">
            Confirm and Purchase
          </button>
        </div>
      )}

      {!calculatedPremium && (
        <button onClick={handlePurchaseClick} className="btn btn-primary mt-3" disabled>
          {isAuthenticated ? 'Calculate Premium to Purchase' : 'Register to Purchase'}
        </button>
      )}
    </div>
  );
};

export default InsurancePlanDetails;
