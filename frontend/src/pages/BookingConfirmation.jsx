import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicAPI } from '../services/api';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBooking = useCallback(async () => {
    try {
      const response = await publicAPI.getConfirmation(bookingId);
      setBooking(response.data);
    } catch (err) {
      setError('Booking not found');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  if (loading) {
    return <div className="loading-screen">Loading confirmation...</div>;
  }

  if (error) {
    return (
      <div className="confirmation">
        <div className="confirmation-container">
          <div className="error-message">
            <h1>❌ {error}</h1>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation">
      <div className="confirmation-container">
        <div className="confirmation-card">
          <div className="confirmation-icon">✅</div>

          <h1>Booking Confirmed!</h1>

          <p className="confirmation-message">
            Your booking has been successfully created. Check your email for details.
          </p>

          <div className="booking-details">
            <div className="detail-group">
              <label>Event Type</label>
              <p>{booking.title}</p>
            </div>

            <div className="detail-group">
              <label>Attendee</label>
              <p>{booking.booker_name}</p>
            </div>

            <div className="detail-group">
              <label>Email</label>
              <p>{booking.booker_email}</p>
            </div>

            <div className="detail-group">
              <label>Date & Time</label>
              <p>
                {new Date(`${booking.booked_date}T${booking.booked_time}`).toLocaleString()}
              </p>
            </div>

            <div className="detail-group">
              <label>Duration</label>
              <p>{booking.duration_minutes} minutes</p>
            </div>

            <div className="detail-group">
              <label>Status</label>
              <p className="status-badge">{booking.status}</p>
            </div>
          </div>

          <div className="confirmation-actions">
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Book Another Event
            </button>
            <button className="btn btn-secondary" onClick={() => window.print()}>
              Print Confirmation
            </button>
          </div>

          <div className="confirmation-footer">
            <p>
              Confirmation details have been sent to <strong>{booking.booker_email}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
