// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPublicInsurancePlans } from '../services/insurancePlansService';

const HomePage = () => {
  const [plans, setPlans] = useState([]);
  const [groupedPlans, setGroupedPlans] = useState({
    Health: [],
    Life: [],
    Car: [],
    Home: [],
    Travel: [],
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available insurance plans from the public endpoint
    const fetchPlans = async () => {
      try {
        const data = await getPublicInsurancePlans();
        setPlans(data);
        groupPlansByType(data);
      } catch (error) {
        setError("Failed to load insurance plans.");
        console.error("Error fetching insurance plans:", error);
      }
    };
    fetchPlans();
  }, []);

  // Function to group plans by type
  const groupPlansByType = (plans) => {
    const grouped = {
      Health: [],
      Life: [],
      Car: [],
      Home: [],
      Travel: [],
    };

    plans.forEach((plan) => {
      switch (plan.insuranceType) {
        case 'Health':
          grouped.Health.push(plan);
          break;
        case 'Life':
          grouped.Life.push(plan);
          break;
        case 'Car':
          grouped.Car.push(plan);
          break;
        case 'Home':
          grouped.Home.push(plan);
          break;
        case 'Travel':
          grouped.Travel.push(plan);
          break;
        default:
          console.warn(`Unrecognized insurance type: ${plan.insuranceType}`);
          break;
      }
    });

    setGroupedPlans(grouped);
  };

  const handleViewDetails = (planId) => {
    navigate(`/plan/${planId}`);
  };

  return (
    <div className="homepage container mt-5">
      {/* Welcome Message and Overview */}
      <section className="welcome-section text-center">
        <h1>Welcome to InviSure</h1>
        <p>At InviSure, we make insurance accessible to everyone. Our microinsurance options are tailored for individuals and small businesses, offering affordable premiums, a user-friendly claims process, and efficient policy tracking.</p>
      </section>

      {/* Navigation to Key Actions */}
      <section className="auth-navigation text-center mt-4">
        <Link to="/login" className="btn btn-primary mx-2">
          Login
        </Link>
        <Link to="/register" className="btn btn-secondary mx-2">
          Register
        </Link>
        <p className="mt-3">Login to access your dashboard, or register to join and start managing your policies.</p>
      </section>

      {/* Grouped Insurance Products */}
      <section className="insurance-preview mt-5">
        <h2>Our Insurance Plans</h2>
        <p>Explore our range of insurance plans designed to meet the needs of diverse users.</p>
        {error && <p className="alert alert-danger">{error}</p>}

        {['Health', 'Life', 'Car', 'Home', 'Travel'].map((type) => (
          <div key={type} className="plan-group mb-5">
            <h3 className="text-center">{type} Insurance</h3>
            <div className="d-flex justify-content-around flex-wrap">
              {groupedPlans[type].length > 0 ? (
                groupedPlans[type].map((plan) => (
                  <div key={plan._id} className="card m-2" style={{ width: '18rem' }}>
                    <div className="card-body">
                      <h5 className="card-title">{plan.policyName}</h5>
                      <p className="card-text">{plan.description}</p>
                      <p><strong>Coverage:</strong> R {plan.coverageAmount.toLocaleString()}</p>
                      {/* Display premium type: Fixed or Dynamic */}
                      {plan.premiumType === 'Fixed' ? (
                        <p><strong>Premium:</strong> R {plan.premiumAmount.toLocaleString()}</p>
                      ) : (
                        <p><strong>Premium:</strong> Calculated based on risk assessment</p>
                      )}
                      <button onClick={() => handleViewDetails(plan._id)} className="btn btn-info mx-1">
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No {type.toLowerCase()} insurance plans available at the moment.</p>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Footer Links */}
      <footer className="footer mt-5 pt-4 border-top text-center">
        <p>
          <Link to="/contact" className="mx-2">Contact Us</Link> |
          <Link to="/privacy-policy" className="mx-2">Privacy Policy</Link> |
          <Link to="/terms-of-service" className="mx-2">Terms of Service</Link>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
