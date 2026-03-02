const pool = require('../config/db');

// Get all facilities
const getAllFacilities = async () => {
  try {
    const result = await pool.query('SELECT * FROM facilities');
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// Get facility by ID
const getFacilityById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM facilities WHERE id = $1', [id]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Create facility
const createFacility = async (name, location, capacity, description) => {
  try {
    const result = await pool.query(
      'INSERT INTO facilities (name, location, capacity, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, location, capacity, description]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Update facility
const updateFacility = async (id, name, location, capacity, description) => {
  try {
    const result = await pool.query(
      'UPDATE facilities SET name = $1, location = $2, capacity = $3, description = $4 WHERE id = $5 RETURNING *',
      [name, location, capacity, description, id]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Delete facility
const deleteFacility = async (id) => {
  try {
    const result = await pool.query('DELETE FROM facilities WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
};
