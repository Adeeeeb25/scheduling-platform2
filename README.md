# Cal.com Clone - Scheduling Platform

A fully functional scheduling/booking web application that replicates Cal.com's design and user experience. allows users to create event types, set availability, and manage bookings through a clean, intuitive interface.

## Features

### Core Features
- **Event Types Management** - Create, edit, and delete event types with customizable durations
- **Date Range Selection** - Set specific date ranges for when events can be booked
- **Availability Settings** - Set available days and time slots for your schedule
- **Public Booking Page** - Clean calendar interface for booking appointments
- **Bookings Dashboard** - View and manage upcoming and past bookings
- **Double-Booking Prevention** - Prevents scheduling conflicts with database constraints
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

### Technical Highlights
- Cal.com-inspired UI with modern design patterns
- Separate frontend and backend repositories
- Real-time availability calculation
- Auto-seeded sample data for immediate testing
- Session-based authentication (no login UI required)
- Date range constraints for event availability

## Tech Stack

### Frontend
- **React.js** - UI library with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Responsive styling with custom design system

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Relational database
- **Express Session** - Session management

### Database
- **MySQL** - Normalized schema with constraints for data integrity

## Project Structure

```
Scheduling Platform/
├── backend/                    # Node.js Express API
│   ├── config/                # Database and constants
│   ├── routes/               # API endpoints
│   ├── controllers/          # Business logic
│   ├── middleware/           # Auth and error handling
│   ├── models/               # Database queries
│   ├── seeds/                # Sample data
│   ├── server.js             # Entry point
│   └── package.json
│
└── frontend/                 # React SPA
    ├── src/
    │   ├── pages/            # Page components
    │   ├── components/       # Reusable components
    │   ├── services/         # API layer
    │   ├── App.jsx          # Main app with routing
    │   └── index.css        # Global styles
    └── package.json
```

## Setup Instructions

### Prerequisites
- **Node.js** v14+ and npm
- **MySQL Server** v5.7+

### 1. Database Setup

First, ensure MySQL is running, then the backend will automatically:
- Create the database
- Create all tables
- Seed sample data

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure database connection in `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=password
   DB_NAME=scheduling_platform
   DB_PORT=3306
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

   The server will:
   - Initialize the database
   - Create tables
   - Seed sample data
   - Start listening on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the frontend directory (in a new terminal):
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure API endpoint in `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## API Documentation

### Admin Routes (Protected)
All admin routes require an active session (obtained by calling `/api/auth/session`)

- `POST /api/auth/session` - Initialize admin session
- `GET /api/auth/verify` - Verify session status
- `GET /api/event-types` - List all event types
- `POST /api/event-types` - Create event type
- `PUT /api/event-types/:id` - Update event type
- `DELETE /api/event-types/:id` - Delete event type
- `GET /api/availability` - Get availability settings
- `POST /api/availability` - Set availability
- `GET /api/bookings` - List all bookings
- `DELETE /api/bookings/:id/cancel` - Cancel booking

### Public Routes (No Auth Required)
- `GET /api/public/event-types/:slug` - Get event type details
- `GET /api/public/availability/:slug?date=YYYY-MM-DD` - Get available time slots
- `POST /api/public/bookings` - Create a booking
- `GET /api/public/bookings/:id/confirmation` - Get booking confirmation

## Sample Data

The application comes with pre-seeded sample data:

### Event Types
1. **30-min Meeting** - 30 minute quick meeting
2. **1-Hour Consultation** - 60 minute in-depth discussion
3. **Product Demo** - 45 minute product walkthrough

### Default Availability
- **Monday - Friday**: 9:00 AM - 5:00 PM
- **Saturday - Sunday**: Unavailable

### Sample Bookings
- 2 existing bookings with different event types for demonstration

## Usage Guide

### Admin Panel

1. **Login** - Click "Go to Admin" and enter the admin panel
2. **Create Event Type** - Click "New Event" to create a booking type
3. **Set Date Range** - Configure which dates the event is available
4. **Set Availability** - Configure your working hours
5. **View Bookings** - Dashboard shows all upcoming and past bookings
6. **Manage Bookings** - Cancel bookings or view details

### Public Booking

1. **Access Booking Page** - Visit `/book/[event-slug]` (e.g., `/book/30-min-meeting`)
2. **Select Date** - Pick a date from the calendar (respects date range)
3. **Select Time** - Choose from available time slots
4. **Enter Details** - Provide your name and email
5. **Confirm** - Complete the booking
6. **Confirmation** - Receive confirmation details

## Database Schema

### Users
```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  timezone VARCHAR(100),
  created_at TIMESTAMP
);
```

### Event Types
```sql
CREATE TABLE event_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  title VARCHAR(255),
  description TEXT,
  duration_minutes INT,
  slug VARCHAR(255) UNIQUE,
  date_from DATE,
  date_to DATE,
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Availability Schedules
```sql
CREATE TABLE availability_schedules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  day_of_week INT,
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMP,
  UNIQUE KEY (user_id, day_of_week),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Bookings
```sql
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_type_id INT,
  booker_name VARCHAR(255),
  booker_email VARCHAR(255),
  booked_date DATE,
  booked_time TIME,
  status ENUM('confirmed', 'cancelled'),
  created_at TIMESTAMP,
  UNIQUE KEY (event_type_id, booked_date, booked_time),
  FOREIGN KEY (event_type_id) REFERENCES event_types(id)
);
```

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions on deploying to:
- **Frontend**: Vercel
- **Backend**: Railway
- **Database**: Railway MySQL

## Troubleshooting

### Backend Issues

**Error: Cannot connect to MySQL**
- Ensure MySQL is running
- Check credentials in `.env`
- Verify database host and port

**Error: Port 5000 already in use**
- Change `PORT` in `.env`
- Or kill the process: `lsof -i :5000` then `kill -9 <PID>`

### Frontend Issues

**Error: Cannot reach API**
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in `.env`
- Check browser console for CORS errors

**Error: Components not loading**
- Clear browser cache
- Delete `node_modules` and reinstall: `npm install`
- Restart development server

## Security Notes

- Session-based authentication with httpOnly cookies
- CORS configured for localhost development
- SQL parameterized queries prevent injection
- Input validation on all API endpoints
- Database unique constraints prevent double-booking

## License

This project is created for educational purposes.

## Support

For issues or questions, please refer to the GitHub issues section.

---

**Happy Scheduling! 📅**

