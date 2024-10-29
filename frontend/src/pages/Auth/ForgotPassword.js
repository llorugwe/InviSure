import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../../services/claimsService'; // Named import for the specific function

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await requestPasswordReset(email); // Updated function call
      setMessage('Password reset link has been sent to your email.');
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Forgot Password</h2>
      {message && <p className="alert alert-success">{message}</p>}
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
        <button type="submit" className="btn btn-primary mt-3">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
