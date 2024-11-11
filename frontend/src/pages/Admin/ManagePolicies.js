// src/pages/Admin/ManagePolicies.js
import React, { useEffect, useState } from 'react';
import { getAllPoliciesAdmin, createPolicy, deletePolicy, updatePolicy } from '../../services/insurancePlansService';
import './ManagePolicies.css'; // Import CSS for styling

const ManagePolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPolicyId, setEditPolicyId] = useState(null);

  const [policyData, setPolicyData] = useState({
    policyName: '',
    description: '',
    premiumType: 'Fixed',
    premiumAmount: 0,
    coverageAmount: 0,
    riskFactors: [],
    isAvailable: true,
    insuranceType: '',
  });

  const insuranceTypes = ['Health', 'Life', 'Car', 'Home', 'Travel'];

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const policiesData = await getAllPoliciesAdmin();
        setPolicies(policiesData);
      } catch (err) {
        setError('Failed to load policies');
      }
    };
    fetchPolicies();
  }, []);

  const handleCreateOrEditPolicy = async () => {
    const payload = { ...policyData };
    if (policyData.premiumType === 'Dynamic') {
      delete payload.premiumAmount;
    }

    try {
      if (isEditing) {
        await updatePolicy(editPolicyId, payload);
      } else {
        await createPolicy(payload);
      }
      setShowModal(false);
      setPolicyData({
        policyName: '',
        description: '',
        premiumType: 'Fixed',
        premiumAmount: 0,
        coverageAmount: 0,
        riskFactors: [],
        isAvailable: true,
        insuranceType: '',
      });
      setIsEditing(false);
      setEditPolicyId(null);

      const updatedPolicies = await getAllPoliciesAdmin();
      setPolicies(updatedPolicies);
      setError(null);
    } catch (error) {
      setError(isEditing ? 'Failed to update policy' : 'Failed to create policy');
    }
  };

  const handleDeletePolicy = async (policyId) => {
    try {
      await deletePolicy(policyId);
      const updatedPolicies = await getAllPoliciesAdmin();
      setPolicies(updatedPolicies);
      setError(null);
    } catch (error) {
      setError('Failed to delete policy');
    }
  };

  const handleEditClick = (policy) => {
    setIsEditing(true);
    setEditPolicyId(policy._id);
    setPolicyData({
      policyName: policy.policyName || '',
      description: policy.description || '',
      premiumType: policy.premiumType || 'Fixed',
      premiumAmount: policy.premiumAmount || 0,
      coverageAmount: policy.coverageAmount || 0,
      riskFactors: policy.riskFactors || [],
      isAvailable: policy.isAvailable !== undefined ? policy.isAvailable : true,
      insuranceType: policy.insuranceType || '',
    });
    setShowModal(true);
  };

  return (
    <div className="container mt-5">
      <h1>Manage Policies</h1>
      {error && <p className="alert alert-danger">{error}</p>}

      <button onClick={() => { setShowModal(true); setIsEditing(false); setPolicyData({ policyName: '', description: '', premiumType: 'Fixed', premiumAmount: 0, coverageAmount: 0, riskFactors: [], isAvailable: true, insuranceType: '' }); }} className="btn btn-primary mb-3">
        Create New Policy
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEditing ? 'Edit Policy' : 'Create New Policy'}</h2>
            <form className="policy-form">
              <div className="form-group">
                <label>Policy Name:</label>
                <input
                  type="text"
                  value={policyData.policyName}
                  onChange={(e) => setPolicyData({ ...policyData, policyName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <input
                  type="text"
                  value={policyData.description}
                  onChange={(e) => setPolicyData({ ...policyData, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Premium Type:</label>
                <select
                  value={policyData.premiumType}
                  onChange={(e) => setPolicyData({ ...policyData, premiumType: e.target.value })}
                >
                  <option value="Fixed">Fixed</option>
                  <option value="Dynamic">Dynamic</option>
                </select>
              </div>
              {policyData.premiumType === 'Fixed' && (
                <div className="form-group">
                  <label>Premium Amount:</label>
                  <input
                    type="number"
                    value={policyData.premiumAmount}
                    onChange={(e) => setPolicyData({ ...policyData, premiumAmount: Number(e.target.value) })}
                  />
                </div>
              )}
              <div className="form-group">
                <label>Coverage Amount:</label>
                <input
                  type="number"
                  value={policyData.coverageAmount}
                  onChange={(e) => setPolicyData({ ...policyData, coverageAmount: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Risk Factors (Optional):</label>
                <input
                  type="text"
                  placeholder="Enter risk factors separated by commas"
                  value={policyData.riskFactors.join(', ')}
                  onChange={(e) => setPolicyData({ ...policyData, riskFactors: e.target.value.split(',').map(f => f.trim()) })}
                />
              </div>
              <div className="form-group">
                <label>Availability:</label>
                <select
                  value={policyData.isAvailable}
                  onChange={(e) => setPolicyData({ ...policyData, isAvailable: e.target.value === 'true' })}
                >
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              </div>
              <div className="form-group">
                <label>Insurance Type:</label>
                <select
                  value={policyData.insuranceType}
                  onChange={(e) => setPolicyData({ ...policyData, insuranceType: e.target.value })}
                >
                  <option value="">Select Type</option>
                  {insuranceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type} Insurance
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-buttons">
                <button type="button" onClick={handleCreateOrEditPolicy} className="btn btn-success mt-3">
                  {isEditing ? 'Update Policy' : 'Create Policy'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary mt-3">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Premium Type</th>
            <th>Premium Amount</th>
            <th>Coverage Amount</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((policy) => (
            <tr key={policy._id}>
              <td>{policy.policyName}</td>
              <td>{policy.description}</td>
              <td>{policy.premiumType}</td>
              <td>{policy.premiumType === 'Fixed' ? `R ${policy.premiumAmount?.toLocaleString()}` : 'Calculated based on risk assessment'}</td>
              <td>R {policy.coverageAmount?.toLocaleString()}</td>
              <td>{policy.insuranceType || 'N/A'}</td>
              <td>
                <button className="btn btn-warning btn-sm" onClick={() => handleEditClick(policy)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeletePolicy(policy._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagePolicies;
