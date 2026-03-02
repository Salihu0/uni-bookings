const pool = require('../config/db');

const initializeDatabase = async () => {
  try {
    console.log('Starting database initialization...');

    // Create facilities table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS facilities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        capacity INTEGER NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Facilities table created');

    // Create bookings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        facility_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        booking_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        purpose VARCHAR(255),
        status VARCHAR(50) DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Bookings table created');

    console.log('✓ Database initialization completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('✗ Database initialization failed:', err.message);
    process.exit(1);
  }
};

initializeDatabase();
