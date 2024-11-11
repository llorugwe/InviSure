import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const isAuthenticated = !!localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  useEffect(() => {
    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar fixed-top navbar-expand-lg ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">InviSure</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated && role === 'policyholder' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-policies">My Policies</Link>
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
                <button className="btn btn-link nav-link" onClick={handleLogout}>
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
