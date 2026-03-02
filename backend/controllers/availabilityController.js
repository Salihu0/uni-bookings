const bookingModel = require("../models/bookingModel");
const facilityModel = require("../models/facilityModel");

// GET /availability?facility_id={id}&date={date}
const checkAvailability = async (req, res) => {
  try {
    const { facility_id, date } = req.query;

    if (!facility_id || !date) {
      return res.status(400).json({ 
        message: "Facility ID and date are required" 
      });
    }

    // Get facility details
    const facility = await facilityModel.getFacilityById(facility_id);
    if (!facility) {
      return res.status(404).json({ 
        message: "Facility not found" 
      });
    }

    // Get all bookings for the facility on the specified date
    const bookings = await bookingModel.getBookingsByFacilityAndDate(facility_id, date);

    // Generate time slots (30-minute intervals from 8:00 AM to 10:00 PM)
    const timeSlots = [];
    const startTime = 8 * 60; // 8:00 AM in minutes
    const endTime = 22 * 60; // 10:00 PM in minutes

    for (let time = startTime; time < endTime; time += 30) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      // Check if this slot is booked
      const isBooked = bookings.some(booking => {
        const bookingStart = parseInt(booking.start_time.split(':')[0]) * 60 + parseInt(booking.start_time.split(':')[1]);
        const bookingEnd = parseInt(booking.end_time.split(':')[0]) * 60 + parseInt(booking.end_time.split(':')[1]);
        return time >= bookingStart && time < bookingEnd;
      });

      timeSlots.push({
        time: timeString,
        available: !isBooked,
        booking: isBooked ? bookings.find(b => {
          const bookingStart = parseInt(b.start_time.split(':')[0]) * 60 + parseInt(b.start_time.split(':')[1]);
          const bookingEnd = parseInt(b.end_time.split(':')[0]) * 60 + parseInt(b.end_time.split(':')[1]);
          return time >= bookingStart && time < bookingEnd;
        }) : null
      });
    }

    res.status(200).json({
      facility,
      date,
      time_slots: timeSlots,
      total_slots: timeSlots.length,
      available_slots: timeSlots.filter(slot => slot.available).length
    });

  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  checkAvailability,
};
