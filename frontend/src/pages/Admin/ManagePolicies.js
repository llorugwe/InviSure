import React, { useEffect, useState } from 'react';
import { getAllPoliciesAdmin, createPolicy } from '../../services/insurancePlansService';

const ManagePolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    description: '',
    premium: '',
    coverage: '',
    riskFactors: [], // Default value as empty array
    isAvailable: true // Default value as true
  });

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const policiesData = await getAllPoliciesAdmin(); // Fetch policies from admin endpoint
        setPolicies(policiesData);
      } catch (err) {
        setError('Failed to load policies');
      }
    };
    fetchPolicies();
  }, []);

  const handleCreatePolicy = async () => {
    try {
      await createPolicy(newPolicy);
      setShowModal(false);
      setNewPolicy({ name: '', description: '', premium: '', coverage: '', riskFactors: [], isAvailable: true });
      
      // Refresh the policies list to include the newly created policy
      const updatedPolicies = await getAllPoliciesAdmin();
      setPolicies(updatedPolicies);
      setError(null); // Clear any previous error
    } catch (error) {
      setError('Failed to create policy');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Manage Policies</h1>
      {error && <p className="alert alert-danger">{error}</p>}

      <button onClick={() => setShowModal(true)} className="btn btn-primary mb-3">Create New Policy</button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create New Policy</h2>
            <form>
              <label>Policy Name:</label>
              <input
                type="text"
                value={newPolicy.name}
                onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
              />
              <label>Description:</label>
              <input
                type="text"
                value={newPolicy.description}
                onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
              />
              <label>Premium:</label>
              <input
                type="number"
                value={newPolicy.premium}
                onChange={(e) => setNewPolicy({ ...newPolicy, premium: Number(e.target.value) })}
              />
              <label>Coverage:</label>
              <input
                type="number"
                value={newPolicy.coverage}
                onChange={(e) => setNewPolicy({ ...newPolicy, coverage: Number(e.target.value) })}
              />
              <label>Risk Factors (Optional):</label>
              <input
                type="text"
                placeholder="Enter risk factors separated by commas"
                onChange={(e) => setNewPolicy({ ...newPolicy, riskFactors: e.target.value.split(',').map(f => f.trim()) })}
              />
              <label>Availability:</label>
              <select
                value={newPolicy.isAvailable}
                onChange={(e) => setNewPolicy({ ...newPolicy, isAvailable: e.target.value === 'true' })}
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
              <button type="button" onClick={handleCreatePolicy} className="btn btn-success mt-3">Create Policy</button>
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary mt-3">Cancel</button>
            </form>
          </div>
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Premium</th>
            <th>Coverage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((policy) => (
            <tr key={policy._id}>
              <td>{policy.name}</td>
              <td>{policy.description}</td>
              <td>${policy.premium}</td>
              <td>{policy.coverage}</td>
              <td>
                {/* Placeholder for future Edit/Delete actions */}
                <button className="btn btn-warning btn-sm">Edit</button>
                <button className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagePolicies;
