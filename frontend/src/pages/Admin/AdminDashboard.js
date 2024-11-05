// src/pages/Admin/AdminDashboard.js
import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import { getTotalPolicies, getPendingClaims, getTotalClaims } from '../../services/claimsService';
import { getPublicInsurancePlans } from '../../services/insurancePlansService';

const AdminDashboard = () => {
  const [totalPolicies, setTotalPolicies] = useState(0);
  const [pendingClaims, setPendingClaims] = useState(0);
  const [totalClaims, setTotalClaims] = useState(0);
  const [groupedPlans, setGroupedPlans] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch key metrics and grouped plans when the component mounts
    const fetchMetricsAndPlans = async () => {
      try {
        const policiesResponse = await getTotalPolicies();
        const pendingClaimsResponse = await getPendingClaims();
        const totalClaimsResponse = await getTotalClaims();
        const plansResponse = await getPublicInsurancePlans(); // Fetch all plans

        setTotalPolicies(policiesResponse.total || 0);
        setPendingClaims(pendingClaimsResponse.pending || 0);
        setTotalClaims(totalClaimsResponse.total || 0);

        // Group plans by insurance type
        const grouped = plansResponse.reduce((acc, plan) => {
          const type = plan.insuranceType || 'Other';
          if (!acc[type]) acc[type] = [];
          acc[type].push(plan);
          return acc;
        }, {});
        setGroupedPlans(grouped);

      } catch (err) {
        setError('Failed to load metrics or plans. Please try again.');
        console.error('Error fetching admin metrics and plans:', err);
      }
    };

    fetchMetricsAndPlans();
  }, []);

  return (
    <div className="container mt-5">
      <h1>Admin Dashboard</h1>
      <p>Manage insurance policies and claims here.</p>

      {error && <p className="alert alert-danger">{error}</p>}

      <div className="mt-4">
        <h3>Key Metrics</h3>
        <ul>
          <li><strong>Total Policies:</strong> {totalPolicies}</li>
          <li><strong>Pending Claims:</strong> {pendingClaims}</li>
          <li><strong>Total Claims:</strong> {totalClaims}</li>
        </ul>
      </div>

      {/* Grouped Insurance Plans */}
      <div className="mt-5">
        <h3>Insurance Plans by Type</h3>
        {Object.keys(groupedPlans).length > 0 ? (
          Object.keys(groupedPlans).map((type) => (
            <div key={type} className="plan-group mb-4">
              <h4>{type} Insurance</h4>
              <div className="d-flex justify-content-start flex-wrap">
                {groupedPlans[type].map((plan) => (
                  <div key={plan._id} className="card m-2" style={{ width: '18rem' }}>
                    <div className="card-body">
                      <h5 className="card-title">{plan.policyName}</h5>
                      <p className="card-text">{plan.description}</p>
                      <p><strong>Coverage:</strong> R {plan.coverageAmount != null ? plan.coverageAmount.toLocaleString() : 'N/A'}</p>
                      <p><strong>Premium:</strong> {plan.premiumType === 'Fixed' ? 
                         `R ${plan.premiumAmount != null ? plan.premiumAmount.toLocaleString() : 'N/A'}` 
                         : 'Calculated based on risk assessment'}
                      </p>
                      <Link to={`/admin/manage-policies/${plan._id}`} className="btn btn-info mt-2">
                        Manage Policy
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No insurance plans available at the moment. Please check back later.</p>
        )}
      </div>

      <div className="mt-4">
        <h3>Actions</h3>
        <ul>
          <li>
            <Link to="/admin/manage-claims">Manage Claims</Link> {/* Link to claims management */}
          </li>
          <li>
            <Link to="/admin/manage-policies">Manage Policies</Link> {/* Link to policies management */}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
