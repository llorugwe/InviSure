import React, { useState } from 'react';
import { login } from '../../services/claimsService';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting to log in...");  // Log when login starts
      const response = await login(email, password);
      console.log("Login response:", response);  // Log the response from the server
  
      const { role, accessToken } = response;
  
      // Store the token and role
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('role', role);
  
      console.log("Role stored:", role);
      console.log("Access token stored:", accessToken);
  
      // Redirect based on user role
      if (role === "admin") {
        navigate('/admin');
      } else if (role === "policyholder") {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error("Login failed:", err);  // Log any error encountered
      setError('Login failed. Please check your email and password.');
    }
  };

  return (
    <div className="container mt-5">
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
      {/* Forgot Password Link */}
      <p className="mt-3">
        Forgot your password?{' '}
        <Link to="/forgot-password">Reset it here</Link>
      </p>
    </div>
  );
};

export default Login;
