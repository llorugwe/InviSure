import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/claimsService'; // Named import for reset password function

const ResetPassword = () => {
  const { token } = useParams();  // Retrieve token from URL
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await resetPassword(token, password); // Updated function call with token and new password
      setMessage('Password has been reset successfully.');
      setTimeout(() => navigate('/login'), 5000);  // Redirect to login after 5 seconds
    } catch (err) {
      setError('Failed to reset password. The link may have expired.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Reset Password</h2>
      {message && <p className="alert alert-success">{message}</p>}
      {error && <p className="alert alert-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
