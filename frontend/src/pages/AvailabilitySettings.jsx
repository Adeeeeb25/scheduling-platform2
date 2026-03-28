import React, { useState, useEffect } from 'react';
import { availabilityAPI } from '../services/api';
import './AvailabilitySettings.css';

const AvailabilitySettings = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      const response = await availabilityAPI.get();
      const availMap = {};
      response.data.forEach(item => {
        availMap[item.day_of_week] = {
          start_time: item.start_time,
          end_time: item.end_time
        };
      });
      setAvailability(availMap);
    } catch (err) {
      setError('Failed to load availability settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...(prev[day] || { start_time: '09:00:00', end_time: '17:00:00' }),
        [field]: value
      }
    }));
  };

  const handleToggleDay = (day) => {
    if (availability[day]) {
      const newAvail = { ...availability };
      delete newAvail[day];
      setAvailability(newAvail);
    } else {
      setAvailability(prev => ({
        ...prev,
        [day]: { start_time: '09:00:00', end_time: '17:00:00' }
      }));
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    try {
      const schedule = Object.entries(availability).map(([day, times]) => ({
        dayOfWeek: parseInt(day),
        startTime: times.start_time,
        endTime: times.end_time
      }));
      await availabilityAPI.set(schedule);
      setSuccess('Availability settings saved successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save availability');
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading availability settings...</div>;
  }

  return (
    <div className="availability-settings">
      <div className="page-header">
        <div className="page-header-container">
          <h1>Availability Settings</h1>
          <p>Set your working hours and available days</p>
        </div>
      </div>

      <div className="page-content">
        <div className="settings-card">
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <div className="availability-grid">
            {days.map((dayName, dayIndex) => (
              <div key={dayIndex} className="day-setting">
                <div className="day-header flex-between">
                  <label className="day-label">
                    <input
                      type="checkbox"
                      checked={!!availability[dayIndex]}
                      onChange={() => handleToggleDay(dayIndex)}
                    />
                    <span>{dayName}</span>
                  </label>
                </div>

                {availability[dayIndex] && (
                  <div className="day-times">
                    <div className="time-group">
                      <label htmlFor={`start-${dayIndex}`}>Start Time</label>
                      <input
                        id={`start-${dayIndex}`}
                        type="time"
                        value={availability[dayIndex].start_time?.slice(0, 5)}
                        onChange={(e) => handleTimeChange(dayIndex, 'start_time', e.target.value + ':00')}
                      />
                    </div>

                    <div className="time-group">
                      <label htmlFor={`end-${dayIndex}`}>End Time</label>
                      <input
                        id={`end-${dayIndex}`}
                        type="time"
                        value={availability[dayIndex].end_time?.slice(0, 5)}
                        onChange={(e) => handleTimeChange(dayIndex, 'end_time', e.target.value + ':00')}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="info-box">
            <p>
              <strong>Note:</strong> These times define when you're available for bookings.
              Visitors will only be able to book within these hours on selected days.
            </p>
          </div>

          <div className="settings-actions">
            <button className="btn btn-primary" onClick={handleSave}>
              Save Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilitySettings;
