import React from 'react';
import { Navigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ onLogin, isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Admin Access</h1>
        <p className="login-subtitle">Access the scheduling platform admin panel</p>

        <div className="login-content">
          <p className="login-description">
            Click the button below to access the admin dashboard. No credentials required.
          </p>

          <button className="btn btn-primary login-btn" onClick={onLogin}>
            Enter Admin Panel
          </button>

          <div className="login-info">
            <h3>Looking to book a meeting?</h3>
            <p>You can access public booking pages directly using event type URLs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
