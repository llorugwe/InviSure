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
      // Call the login function and retrieve the role from the response
      const response = await login(email, password);
      const { role } = response; // Assume response contains 'role' from the backend

      // Redirect based on user role
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'policyholder') {
        navigate('/dashboard');
      } else {
        navigate('/'); // Default redirect if role is unknown
      }
    } catch (err) {
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
