require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const initializeDatabase = require('./config/initDb');
const seedDatabase = require('./seeds/seed');

// Routes
const authRoutes = require('./routes/auth');
const eventTypesRoutes = require('./routes/eventTypes');
const availabilityRoutes = require('./routes/availability');
const bookingsRoutes = require('./routes/bookings');
const publicRoutes = require('./routes/public');

// Middleware
const errorHandler = require('./middleware/errorHandler');

// ✅ CREATE APP FIRST
const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 8080;

// ✅ SIMPLE & SAFE CORS (no config headache)
app.use(cors({
  origin: "https://scheduling-platform2-ctix.vercel.app",
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,          // REQUIRED
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'none'       // REQUIRED
    }
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/event-types', eventTypesRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/public', publicRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use(errorHandler);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    console.log('🔧 Initializing database...');
    await initializeDatabase();

    console.log('🌱 Seeding database...');
    await seedDatabase();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();