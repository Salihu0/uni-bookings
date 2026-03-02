const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const initializeDatabase = async () => {
  try {
    console.log('Starting database initialization...');

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
    console.log('✓ Users table created');

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
    console.log('✓ Facilities table created');

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
    console.log('✓ Bookings table created');

    // Insert sample admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await pool.query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, ['admin@university.edu', adminPassword, 'Admin', 'User', 'admin']);
    console.log('✓ Admin user created (admin@university.edu / admin123)');

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
    console.log('✓ Sample facilities created');

    console.log('✓ Database initialization completed successfully');
    console.log('📝 Login credentials:');
    console.log('   Email: admin@university.edu');
    console.log('   Password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('✗ Database initialization failed:', err.message);
    process.exit(1);
  }
};

initializeDatabase();
