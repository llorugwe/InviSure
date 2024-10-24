import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">InviSure</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/submit-claim">Submit Claim</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/track-claim">Track Claims</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/manage-claims">Admin Dashboard</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
