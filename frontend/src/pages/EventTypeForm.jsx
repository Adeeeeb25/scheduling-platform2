import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventTypesAPI } from '../services/api';
import './EventTypeForm.css';

const EventTypeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    slug: '',
    date_from: '',
    date_to: ''
  });
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadEventType = useCallback(async () => {
    try {
      const response = await eventTypesAPI.getById(id);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load event type');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadEventType();
    }
  }, [id, loadEventType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value
    }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.duration || !formData.slug) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (id) {
        await eventTypesAPI.update(id, formData);
        setSuccess('Event type updated successfully!');
      } else {
        await eventTypesAPI.create(formData);
        setSuccess('Event type created successfully!');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save event type');
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="event-type-form">
      <div className="page-header">
        <div className="page-header-container">
          <h1>{id ? 'Edit Event Type' : 'Create Event Type'}</h1>
          <p>Configure your meeting details</p>
        </div>
      </div>

      <div className="page-content">
        <div className="form-card">
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Event Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., 30-min Meeting"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe what this meeting is about"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="duration">Duration (minutes) *</label>
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  min="15"
                  max="480"
                  step="15"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="slug">URL Slug *</label>
                <div className="slug-input-group">
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    placeholder="meeting-slug"
                    value={formData.slug}
                    onChange={handleChange}
                    disabled={!!id}
                    required
                  />
                  {!id && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={generateSlug}
                    >
                      Generate
                    </button>
                  )}
                </div>
                <p className="slug-preview">
                  Public URL: <code>/book/{formData.slug}</code>
                </p>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date_from">Available From (Optional)</label>
                <input
                  id="date_from"
                  name="date_from"
                  type="date"
                  value={formData.date_from}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="date_to">Available Until (Optional)</label>
                <input
                  id="date_to"
                  name="date_to"
                  type="date"
                  value={formData.date_to}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {id ? 'Update Event Type' : 'Create Event Type'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventTypeForm;
