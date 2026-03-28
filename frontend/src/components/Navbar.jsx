import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isAdmin, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          📅 Scheduler
        </Link>

        <div className="navbar-menu">
          {isAdmin ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/event-types" className="nav-link">Event Types</Link>
              <Link to="/availability" className="nav-link">Availability</Link>
              <button onClick={onLogout} className="nav-link nav-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/admin" className="nav-link nav-login">Go to Admin</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
