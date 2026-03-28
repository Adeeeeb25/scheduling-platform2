import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventTypesAPI } from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEventTypes();
  }, []);

  const loadEventTypes = async () => {
    try {
      const response = await eventTypesAPI.getAll();
      setEventTypes(response.data);
    } catch (error) {
      console.error('Failed to load event types:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Schedule meetings without the back-and-forth</h1>
          <p className="hero-subtitle">
            Share your availability and let others book time with you instantly. No more emails, no more confusion.
          </p>
          <div className="hero-cta">
            <Link to="/admin" className="btn btn-primary btn-large">
              Get Started
            </Link>
            <a href="#featured" className="btn btn-secondary btn-large">
              Browse Events
            </a>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="calendar-icon">📅</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2>How it works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Create Event Types</h3>
              <p>Define different types of meetings with custom durations and descriptions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>Set Availability</h3>
              <p>Choose your working hours and available days. You're always in control.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h3>Share Your Link</h3>
              <p>Get a unique booking link to share with clients, colleagues, and friends</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Receive Bookings</h3>
              <p>People book directly into your calendar with no scheduling conflicts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section id="featured" className="featured-section">
        <div className="featured-container">
          <h2>Featured Event Types</h2>
          {loading ? (
            <div className="loading">Loading event types...</div>
          ) : eventTypes.length > 0 ? (
            <div className="featured-grid">
              {eventTypes.map(eventType => (
                <Link
                  key={eventType.id}
                  to={`/book/${eventType.slug}`}
                  className="featured-card"
                >
                  <div className="featured-header">
                    <h3>{eventType.title}</h3>
                    <span className="duration-badge">{eventType.duration_minutes}m</span>
                  </div>
                  <p className="featured-description">{eventType.description}</p>
                  <div className="featured-footer">
                    <span className="book-link">Book Now →</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-events">
              <p>No event types available yet</p>
              <Link to="/admin" className="btn btn-primary">
                Create Your First Event
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to streamline your scheduling?</h2>
          <p>Start creating event types and sharing your availability in minutes</p>
          <Link to="/admin" className="btn btn-primary btn-large">
            Launch Admin Dashboard
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="home-footer">
        <div className="footer-content">
          <p>&copy; 2024 Scheduling Platform. Share your time, simplify your life.</p>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#featured">Events</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
