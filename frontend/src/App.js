import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './services/api';
import Navbar from './components/Navbar';

// Pages - Public
import HomePage from './pages/HomePage';
import PublicBookingPage from './pages/PublicBookingPage';
import BookingConfirmation from './pages/BookingConfirmation';

// Pages - Admin
import Dashboard from './pages/Dashboard';
import EventTypeForm from './pages/EventTypeForm';
import AvailabilitySettings from './pages/AvailabilitySettings';
import LoginPage from './pages/LoginPage';

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const initAuth = async () => {
    try {
      // Step 1: Create session
      await authAPI.initializeSession();

      // Step 2: Verify session
      const response = await authAPI.verifySession();
      setIsAuthenticated(response.data.authenticated);
    } catch (error) {
      console.error("Auth init failed:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  initAuth();
}, []);

  const verifySession = async () => {
    try {
      const response = await authAPI.verifySession();
      setIsAuthenticated(response.data.authenticated);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      await authAPI.initializeSession();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Navbar isAdmin={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        {/* Admin Routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/admin" />}
        />
        <Route
          path="/event-types"
          element={isAuthenticated ? <EventTypeForm /> : <Navigate to="/admin" />}
        />
        <Route
          path="/event-types/:id"
          element={isAuthenticated ? <EventTypeForm /> : <Navigate to="/admin" />}
        />
        <Route
          path="/availability"
          element={isAuthenticated ? <AvailabilitySettings /> : <Navigate to="/admin" />}
        />

        {/* Admin Login */}
        <Route
          path="/admin"
          element={<LoginPage onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
        />

        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:slug" element={<PublicBookingPage />} />
        <Route path="/confirmation/:bookingId" element={<BookingConfirmation />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
