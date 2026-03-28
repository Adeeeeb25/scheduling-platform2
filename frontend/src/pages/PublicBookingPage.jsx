import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicAPI, formatDateRange } from '../services/api';
import Calendar from '../components/Calendar';
import './PublicBookingPage.css';

const PublicBookingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [eventType, setEventType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadEventType = useCallback(async () => {
    try {
      const response = await publicAPI.getEventType(slug);
      setEventType(response.data);
    } catch (err) {
      setError('Event type not found');
      setTimeout(() => navigate('/'), 2000);
    } finally {
      setLoading(false);
    }
  }, [slug, navigate]);

  const loadAvailableSlots = useCallback(async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await publicAPI.getAvailability(slug, dateStr);
      setAvailableSlots(response.data.availableSlots);
      setSelectedTime(null);
    } catch (err) {
      setError('Failed to load available slots');
    }
  }, [selectedDate, slug]);

  useEffect(() => {
    loadEventType();
  }, [loadEventType]);

  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDate, loadAvailableSlots]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !formData.name || !formData.email) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await publicAPI.createBooking({
        eventTypeSlug: slug,
        bookerName: formData.name,
        bookerEmail: formData.email,
        bookedDate: dateStr,
        bookedTime: selectedTime + ':00'
      });
      navigate(`/confirmation/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading event details...</div>;
  }

  if (!eventType) {
    return <div className="error-screen">{error}</div>;
  }

  return (
    <div className="public-booking">
      <div className="booking-container">
        <div className="booking-left">
          <h1>{eventType.title}</h1>
          <p className="event-description">{eventType.description}</p>
          <div className="event-details">
            <div className="detail">
              <span className="detail-label">Duration</span>
              <span className="detail-value">{eventType.duration_minutes} minutes</span>
            </div>
            {(eventType.date_from || eventType.date_to) && (
              <div className="detail">
                <span className="detail-label">Available Dates</span>
                <span className="detail-value">
                  {formatDateRange(eventType.date_from, eventType.date_to)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="booking-right">
          {error && <div className="error">{error}</div>}

          <div className="booking-section">
            <h2>Select a Date</h2>
            <Calendar
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
              dateFrom={eventType.date_from}
              dateTo={eventType.date_to}
            />
          </div>

          {selectedDate && availableSlots.length > 0 && (
            <div className="booking-section">
              <h2>Select a Time</h2>
              <div className="time-slots">
                {availableSlots.map(time => (
                  <button
                    key={time}
                    className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedDate && availableSlots.length === 0 && (
            <div className="no-slots-message">
              <p>No available time slots for this date. Please select another date.</p>
            </div>
          )}

          {selectedTime && (
            <div className="booking-section">
              <h2>Your Details</h2>
              <form onSubmit={handleBooking}>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="booking-summary">
                  <h3>Booking Summary</h3>
                  <p><strong>Event:</strong> {eventType.title}</p>
                  <p><strong>Date:</strong> {selectedDate.toDateString()}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                  <p><strong>Duration:</strong> {eventType.duration_minutes} minutes</p>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={submitting}
                >
                  {submitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicBookingPage;
