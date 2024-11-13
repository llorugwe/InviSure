// src/pages/Auth/Register.js
import React, { useState } from 'react';
import { register } from '../../services/claimsService';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Auth.css'; // Import the shared CSS file

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await register({ name, email, password });
      setMessage('Registration successful! Please check your email for verification.');
      setTimeout(() => navigate('/login'), 5000); // Redirect after 5 seconds
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {message && <p className="alert alert-success">{message}</p>}
      {error && <p className="alert alert-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-3">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Register</button>
      </form>
      
      <p className="mt-3">
        Already have an account? <Link to="/login" className="btn-link">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
