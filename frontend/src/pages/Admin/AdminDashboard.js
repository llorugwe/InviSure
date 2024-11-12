import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaClipboardList } from 'react-icons/fa';
import { getTotalPolicies, getPendingClaims, getTotalClaims } from '../../services/claimsService';
import { getPublicInsurancePlans } from '../../services/insurancePlansService';

const AdminDashboard = () => {
  const [adminName, setAdminName] = useState('Admin');
  const [totalPolicies, setTotalPolicies] = useState(0);
  const [pendingClaims, setPendingClaims] = useState(0);
  const [totalClaims, setTotalClaims] = useState(0);
  const [groupedPlans, setGroupedPlans] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedAdminName = localStorage.getItem('userName');
    if (storedAdminName) {
      setAdminName(storedAdminName);
    }

    const fetchMetricsAndPlans = async () => {
      try {
        const policiesResponse = await getTotalPolicies();
        const pendingClaimsResponse = await getPendingClaims();
        const totalClaimsResponse = await getTotalClaims();
        const plansResponse = await getPublicInsurancePlans();

        setTotalPolicies(policiesResponse.total || 0);
        setPendingClaims(pendingClaimsResponse.pending || 0);
        setTotalClaims(totalClaimsResponse.total || 0);

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
    <div className="container mt-5 text-center">
      <h1>Welcome Admin, {adminName}!</h1>
      <p className="dashboard-subtitle">Manage insurance policies and claims here.</p>

      {error && <p className="alert alert-danger">{error}</p>}

      <div className="mt-4">
        <h3>Key Metrics</h3>
        <ul className="list-unstyled d-flex justify-content-center">
          <li className="mx-3"><strong>Total Policies:</strong> {totalPolicies}</li>
          <li className="mx-3"><strong>Pending Claims:</strong> {pendingClaims}</li>
          <li className="mx-3"><strong>Total Claims:</strong> {totalClaims}</li>
        </ul>
      </div>

      <div className="mt-5">
        <h3>Insurance Plans by Type</h3>
        {Object.keys(groupedPlans).length > 0 ? (
          Object.keys(groupedPlans).map((type) => (
            <div key={type} className="plan-group mb-4 text-center">
              <h4>{type} Insurance</h4>
              <div className="d-flex justify-content-center flex-wrap">
                {groupedPlans[type].map((plan) => (
                  <div key={plan._id} className="card m-2" style={{ width: '18rem' }}>
                    <div className="card-body text-center">
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

      {/* Actions with Icons */}
      <div className="mt-4 actions text-center">
        <h3>Actions</h3>
        <ul className="list-unstyled d-flex justify-content-center">
          <li className="mx-3">
            <Link to="/admin/manage-claims" className="btn btn-primary">
              <FaFileAlt style={{ marginRight: '8px' }} /> Manage Claims
            </Link>
          </li>
          <li className="mx-3">
            <Link to="/admin/manage-policies" className="btn btn-primary">
              <FaClipboardList style={{ marginRight: '8px' }} /> Manage Policies
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
