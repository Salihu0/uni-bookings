const express = require("express");
const router = express.Router();
const facilityController = require("../controllers/facilityController");


// GET /facilities
router.get("/", facilityController.getFacilities);

// GET /facilities/:id
router.get("/:id", facilityController.getFacilityById);

// POST /facilities
router.post("/", facilityController.createFacility);

// PUT /facilities/:id
router.put("/:id", facilityController.updateFacility);

// DELETE /facilities/:id
router.delete("/:id", facilityController.deleteFacility);

module.exports = router;
