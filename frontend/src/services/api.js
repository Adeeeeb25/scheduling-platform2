import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// Utility function to parse date strings without timezone conversion
export const parseDate = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Utility function to format date for display
export const formatDateRange = (dateFrom, dateTo) => {
  if (dateFrom && dateTo) {
    return `${parseDate(dateFrom).toDateString()} - ${parseDate(dateTo).toDateString()}`;
  }
  if (dateFrom) {
    return `From ${parseDate(dateFrom).toDateString()}`;
  }
  if (dateTo) {
    return `Until ${parseDate(dateTo).toDateString()}`;
  }
  return '';
};

// Auth endpoints
export const authAPI = {
  initializeSession: () => api.post('/auth/session'),
  verifySession: () => api.get('/auth/verify'),
  getUser: () => api.get('/auth/user'),
  logout: () => api.post('/auth/logout')
};

// Event Types endpoints
export const eventTypesAPI = {
  getAll: () => api.get('/event-types'),
  getById: (id) => api.get(`/event-types/${id}`),
  create: (data) => api.post('/event-types', data),
  update: (id, data) => api.put(`/event-types/${id}`, data),
  delete: (id) => api.delete(`/event-types/${id}`)
};

// Availability endpoints
export const availabilityAPI = {
  get: () => api.get('/availability'),
  set: (schedule) => api.post('/availability', { schedule }),
  deleteDay: (dayOfWeek) => api.delete(`/availability/${dayOfWeek}`)
};

// Bookings endpoints
export const bookingsAPI = {
  getAll: (type) => api.get('/bookings', { params: { type } }),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.delete(`/bookings/${id}/cancel`)
};

// Public endpoints
export const publicAPI = {
  getEventType: (slug) => api.get(`/public/event-types/${slug}`),
  getAvailability: (slug, date) => api.get(`/public/availability/${slug}`, { params: { date } }),
  createBooking: (data) => api.post('/public/bookings', data),
  getConfirmation: (id) => api.get(`/public/bookings/${id}/confirmation`)
};

export default api;
