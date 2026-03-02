const pool = require('../config/db');

// Get all bookings
const getAllBookings = async () => {
  try {
    const result = await pool.query('SELECT * FROM bookings ORDER BY date DESC');
    return result.rows.map(row => ({
      ...row,
      id: row.id.toString()
    }));
  } catch (err) {
    throw err;
  }
};

// Get booking by ID
const getBookingById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return {
      ...result.rows[0],
      id: result.rows[0].id.toString()
    };
  } catch (err) {
    throw err;
  }
};

// Get bookings by facility
const getBookingsByFacility = async (facility_id) => {
  try {
    const result = await pool.query('SELECT * FROM bookings WHERE facility_id = $1 ORDER BY date DESC', [facility_id]);
    return result.rows.map(row => ({
      ...row,
      id: row.id.toString()
    }));
  } catch (err) {
    throw err;
  }
};

// Get bookings by facility and date
const getBookingsByFacilityAndDate = async (facility_id, date) => {
  try {
    const result = await pool.query('SELECT * FROM bookings WHERE facility_id = $1 AND date = $2 ORDER BY start_time', [facility_id, date]);
    return result.rows.map(row => ({
      ...row,
      id: row.id.toString()
    }));
  } catch (err) {
    throw err;
  }
};

// Create booking
const createBooking = async (facility_id, user_id, date, start_time, end_time, notes) => {
  try {
    const result = await pool.query(
      'INSERT INTO bookings (facility_id, user_id, date, start_time, end_time, notes, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [facility_id, user_id, date, start_time, end_time, notes, 'confirmed']
    );
    return {
      ...result.rows[0],
      id: result.rows[0].id.toString()
    };
  } catch (err) {
    throw err;
  }
};

// Update booking
const updateBooking = async (id, facility_id, user_id, date, start_time, end_time, notes, status) => {
  try {
    const result = await pool.query(
      'UPDATE bookings SET facility_id = $1, user_id = $2, date = $3, start_time = $4, end_time = $5, notes = $6, status = $7 WHERE id = $8 RETURNING *',
      [facility_id, user_id, date, start_time, end_time, notes, status, id]
    );
    if (result.rows.length === 0) return null;
    return {
      ...result.rows[0],
      id: result.rows[0].id.toString()
    };
  } catch (err) {
    throw err;
  }
};

// Cancel booking
const cancelBooking = async (id) => {
  try {
    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      ['cancelled', id]
    );
    if (result.rows.length === 0) return null;
    return {
      ...result.rows[0],
      id: result.rows[0].id.toString()
    };
  } catch (err) {
    throw err;
  }
};

// Delete booking
const deleteBooking = async (id) => {
  try {
    const result = await pool.query('DELETE FROM bookings WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return null;
    return {
      ...result.rows[0],
      id: result.rows[0].id.toString()
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  getBookingsByFacility,
  getBookingsByFacilityAndDate,
  createBooking,
  updateBooking,
  cancelBooking,
  deleteBooking,
};


