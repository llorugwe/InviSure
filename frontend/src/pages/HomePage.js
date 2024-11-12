// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPublicInsurancePlans } from '../services/insurancePlansService';
import welcomeImage from '../assets/images/HomePage.jpg';
import './HomePage.css';

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
    const fetchPlans = async () => {
      try {
        const data = await getPublicInsurancePlans();
        setPlans(data);
        groupPlansByType(data);
      } catch (error) {
        setError("Failed to load insurance plans.");
      }
    };
    fetchPlans();
  }, []);

  const groupPlansByType = (plans) => {
    const grouped = {
      Health: [],
      Life: [],
      Car: [],
      Home: [],
      Travel: [],
    };

    plans.forEach((plan) => {
      grouped[plan.insuranceType]?.push(plan);
    });

    setGroupedPlans(grouped);
  };

  const handleViewDetails = (planId) => {
    navigate(`/plan/${planId}`);
  };

  return (
    <div className="homepage container mt-5">
      <section className="welcome-frame">
        <div className="welcome-image-container">
          <img src={welcomeImage} alt="Insurance umbrella" className="welcome-image" />
        </div>
        <div className="welcome-text">
          <h1>Welcome to InviSure</h1>
          <p>
            At InviSure, we make insurance accessible for everyone. Our microinsurance options are tailored to meet the needs of individuals and small businesses with affordable premiums and easy claims management.
          </p>
        </div>
      </section>

      <section className="auth-navigation text-center mt-4">
        <Link to="/login" className="btn btn-primary mx-2">Login</Link>
        <Link to="/register" className="btn btn-secondary mx-2">Register</Link>
      </section>

      <section className="insurance-preview mt-5">
        <h2>Our Insurance Plans</h2>
        <p>Explore our range of insurance plans designed to meet the needs of diverse users.</p>
        {error && <p className="alert alert-danger">{error}</p>}

        {['Health', 'Life', 'Car', 'Home', 'Travel'].map((type) => (
          <div key={type} className="plan-group mb-5">
            <h3 className="text-center">{type} Insurance</h3>
            <div className="card-container">
              {groupedPlans[type].length > 0 ? (
                groupedPlans[type].map((plan) => (
                  <div key={plan._id} className="card">
                    <div className="card-body">
                      <h5 className="card-title">{plan.policyName}</h5>
                      <p className="card-text">{plan.description}</p>
                      <p><strong>Coverage:</strong> R {plan.coverageAmount?.toLocaleString() || 'N/A'}</p>
                      {plan.premiumType === 'Fixed' ? (
                        <p><strong>Premium:</strong> R {plan.premiumAmount?.toLocaleString() || 'N/A'}</p>
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
