import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  const role = localStorage.getItem('userRole'); // Store role in localStorage after login

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">InviSure</Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isAuthenticated && role === 'policyholder' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/submit-claim">Submit Claim</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/track-claim">Track Claims</Link>
                </li>
              </>
            )}
            {isAuthenticated && role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin Dashboard</Link>
              </li>
            )}
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => {
                  localStorage.removeItem('accessToken');
                  localStorage.removeItem('userRole');
                  window.location.href = '/';
                }}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
