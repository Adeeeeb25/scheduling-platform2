import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventTypesAPI, bookingsAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [eventTypes, setEventTypes] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [eventTypesRes, bookingsRes] = await Promise.all([
        eventTypesAPI.getAll(),
        bookingsAPI.getAll('all')
      ]);
      setEventTypes(eventTypesRes.data);

      // Separate upcoming and past bookings (exclude cancelled)
      const today = new Date().toISOString().split('T')[0];
      const upcoming = bookingsRes.data.filter(b => b.booked_date >= today && b.status !== 'cancelled');
      const past = bookingsRes.data.filter(b => b.booked_date < today && b.status !== 'cancelled');
      setUpcomingBookings(upcoming);
      setPastBookings(past);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEventType = async (id) => {
    if (window.confirm('Are you sure you want to delete this event type?')) {
      try {
        await eventTypesAPI.delete(id);
        setEventTypes(eventTypes.filter(et => et.id !== id));
      } catch (err) {
        setError('Failed to delete event type');
      }
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingsAPI.cancel(bookingId);
        loadData();
      } catch (err) {
        setError('Failed to cancel booking');
      }
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div className="page-header-container">
          <h1>Dashboard</h1>
          <p>Manage your event types and bookings</p>
        </div>
      </div>

      <div className="page-content">
        {error && <div className="error">{error}</div>}

        <div className="dashboard-section">
          <div className="section-header flex-between">
            <h2>Event Types</h2>
            <button className="btn btn-primary" onClick={() => navigate('/event-types')}>
              + New Event
            </button>
          </div>

          {eventTypes.length === 0 ? (
            <div className="empty-state">
              <p>No event types yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {eventTypes.map(et => (
                <div key={et.id} className="card">
                  <h3>{et.title}</h3>
                  <p className="text-muted">{et.description}</p>
                  <p className="event-duration">{et.duration_minutes} minutes</p>
                  <p className="event-slug">
                    <strong>Link:</strong> /book/{et.slug}
                  </p>
                  <div className="card-actions flex">
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate(`/event-types/${et.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteEventType(et.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-section mt-2">
          <h2>Upcoming Bookings</h2>
          {upcomingBookings.length === 0 ? (
            <div className="empty-state">
              <p>No upcoming bookings</p>
            </div>
          ) : (
            <BookingsList bookings={upcomingBookings} onCancel={handleCancelBooking} />
          )}
        </div>

        <div className="dashboard-section mt-2">
          <h2>Past Bookings</h2>
          {pastBookings.length === 0 ? (
            <div className="empty-state">
              <p>No past bookings</p>
            </div>
          ) : (
            <BookingsList bookings={pastBookings} />
          )}
        </div>
      </div>
    </div>
  );
};

const BookingsList = ({ bookings, onCancel }) => (
  <div className="table-container">
    <table>
      <thead>
        <tr>
          <th>Event Type</th>
          <th>Booker</th>
          <th>Email</th>
          <th>Date</th>
          <th>Time</th>
          <th>Status</th>
          {onCancel && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {bookings.map(booking => (
          <tr key={booking.id}>
            <td>{booking.title}</td>
            <td>{booking.booker_name}</td>
            <td>{booking.booker_email}</td>
            <td>{booking.booked_date}</td>
            <td>{booking.booked_time}</td>
            <td>
              <span className={`status status-${booking.status}`}>
                {booking.status}
              </span>
            </td>
            {onCancel && (
              <td>
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => onCancel(booking.id)}
                >
                  Cancel
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Dashboard;
