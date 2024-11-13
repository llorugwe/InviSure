// src/pages/Auth/Login.js
import React, { useState } from 'react';
import { login } from '../../services/claimsService';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Auth.css'; // Import the shared CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      const { role, accessToken, name } = response;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('role', role);
      localStorage.setItem('userName', name);

      const redirectPath = localStorage.getItem('redirectPath') || (role === "admin" ? '/admin' : '/dashboard');
      localStorage.removeItem('redirectPath');
      navigate(redirectPath);
    } catch (err) {
      setError('Login failed. Please check your email and password.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="alert alert-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
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
        <button type="submit" className="btn btn-primary mt-3">Login</button>
      </form>

      <p className="mt-3">
        Forgot your password? <Link to="/forgot-password" className="btn-link">Reset it here</Link>
      </p>
      <p className="mt-2">
        Don’t have an account? <Link to="/register" className="btn-link">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
