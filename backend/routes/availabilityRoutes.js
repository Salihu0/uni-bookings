const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

// GET /api/availability?facility_id={id}&date={date}
router.get('/', availabilityController.checkAvailability);

module.exports = router;
