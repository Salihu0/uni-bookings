const pool = require("../config/db");
const bookingModel = require("../models/bookingModel");

// GET /bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.getAllBookings();
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /bookings/:id
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Booking ID is required" });
    }
    const booking = await bookingModel.getBookingById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /bookings
const createBooking = async (req, res) => {
  try {
    const { facility_id, date, start_time, end_time, notes } = req.body;
    const user_id = req.user.userId; // Get user ID from authenticated token

    // Basic validation
    if (!facility_id || !date || !start_time || !end_time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (start_time >= end_time) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    // Check for booking conflict
    const conflictCheck = await pool.query(
      `SELECT * FROM bookings
       WHERE facility_id = $1
       AND date = $2
       AND (
         (start_time < $4 AND end_time > $3)
       )`,
      [facility_id, date, start_time, end_time]
    );

    if (conflictCheck.rows.length > 0) {
      return res.status(409).json({ message: "Time slot already booked" });
    }

    // Create the booking
    const booking = await bookingModel.createBooking(facility_id, user_id, date, start_time, end_time, notes || '');
    
    res.status(201).json(booking);

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /bookings/:id
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const result = await pool.query(
      `UPDATE bookings
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /bookings/:id
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM bookings
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking cancelled successfully" });

  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET /bookings/facility/:facility_id
const getBookingsByFacility = async (req, res) => {
  try {
    const { facility_id } = req.params;
    if (!facility_id) {
      return res.status(400).json({ message: "Facility ID is required" });
    }
    const bookings = await bookingModel.getBookingsByFacility(facility_id);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Get bookings by facility error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Booking ID is required" });
    }
    const booking = await bookingModel.cancelBooking(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  cancelBooking,
  getBookingsByFacility,
};
