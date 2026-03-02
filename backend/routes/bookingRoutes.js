const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authenticateToken, requireUserOrAdmin } = require("../middleware/auth");

// GET /bookings
router.get("/", authenticateToken, requireUserOrAdmin, bookingController.getBookings);

// GET /bookings/:id
router.get("/:id", authenticateToken, requireUserOrAdmin, bookingController.getBookingById);

// POST /bookings
router.post("/", authenticateToken, requireUserOrAdmin, bookingController.createBooking);

// PUT /bookings/:id
router.put("/:id", authenticateToken, requireUserOrAdmin, bookingController.updateBooking);

// PATCH /bookings/:id/cancel
router.patch("/:id/cancel", authenticateToken, requireUserOrAdmin, bookingController.cancelBooking);

// DELETE /bookings/:id
router.delete("/:id", authenticateToken, requireUserOrAdmin, bookingController.deleteBooking);


// GET /bookings/facility/:facility_id
router.get("/facility/:facility_id", authenticateToken, requireUserOrAdmin, bookingController.getBookingsByFacility);

module.exports = router;
