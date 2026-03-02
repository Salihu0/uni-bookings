const facilityRoutes = require("./routes/facilityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const express = require('express');
const cors = require('cors');
require('dotenv').config();



const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL || 'https://uni-bookings-dp1p.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Explicitly handle preflight requests
app.options('*', cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/availability', availabilityRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
  });
});

// Database initialization endpoint (for setup)
app.post('/api/init-db', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const pool = require('./config/db');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create facilities table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS facilities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        capacity INTEGER NOT NULL,
        description TEXT,
        amenities TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create bookings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        facility_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Insert admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await pool.query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, ['admin@university.edu', adminPassword, 'Admin', 'User', 'admin']);

    // Insert sample facilities
    const facilities = [
      {
        name: 'Main Library Study Room',
        location: 'Building A, Floor 2',
        capacity: 6,
        description: 'Quiet study room with whiteboard and projector',
        amenities: ['WiFi', 'Whiteboard', 'Projector', 'Power Outlets']
      },
      {
        name: 'Computer Lab 101',
        location: 'Tech Building, Floor 1',
        capacity: 20,
        description: 'Computer lab with 20 workstations',
        amenities: ['Computers', 'WiFi', 'Printing', 'Scanner']
      },
      {
        name: 'Conference Room B',
        location: 'Business Building, Floor 3',
        capacity: 12,
        description: 'Professional meeting room with video conferencing',
        amenities: ['Video Conference', 'WiFi', 'Whiteboard', 'Coffee Machine']
      },
      {
        name: 'Music Practice Room',
        location: 'Arts Building, Basement',
        capacity: 4,
        description: 'Sound-proofed room for music practice',
        amenities: ['Piano', 'Music Stand', 'Sound System', 'Mirror']
      },
      {
        name: 'Science Lab 205',
        location: 'Science Building, Floor 2',
        capacity: 15,
        description: 'Fully equipped science laboratory',
        amenities: ['Lab Equipment', 'Safety Gear', 'WiFi', 'Projector']
      }
    ];

    for (const facility of facilities) {
      await pool.query(`
        INSERT INTO facilities (name, location, capacity, description, amenities)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `, [facility.name, facility.location, facility.capacity, facility.description, facility.amenities]);
    }

    res.status(200).json({
      status: 'success',
      message: 'Database initialized successfully',
      data: {
        adminUser: 'admin@university.edu / admin123',
        facilitiesCount: facilities.length
      }
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database initialization failed',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});


module.exports = app;
