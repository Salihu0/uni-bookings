const facilityModel = require("../models/facilityModel");

// GET /facilities
const getFacilities = async (req, res) => {
  try {
    const facilities = await facilityModel.getAllFacilities();
    res.status(200).json(facilities);
  } catch (error) {
    console.error('Get facilities error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /facilities/:id
const getFacilityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Facility ID is required" });
    }

    const facility = await facilityModel.getFacilityById(id);

    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    res.status(200).json(facility);
  } catch (error) {
    console.error('Get facility by ID error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /facilities
const createFacility = async (req, res) => {
  try {
    const { name, location, capacity, description, amenities } = req.body;
    if (!name || !location || !capacity) {
      return res.status(400).json({ message: "Name, location, and capacity are required" });
    }

    const facility = await facilityModel.createFacility(name, location, capacity, description);
    res.status(201).json(facility);
  } catch (error) {
    console.error('Create facility error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /facilities/:id
const updateFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, capacity, description, amenities } = req.body;
    if (!id || !name || !location || !capacity) {
      return res.status(400).json({ message: "ID, name, location, and capacity are required" });
    }

    const facility = await facilityModel.updateFacility(id, name, location, capacity, description);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }
    res.status(200).json(facility);
  } catch (error) {
    console.error('Update facility error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /facilities/:id
const deleteFacility = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Facility ID is required" });
    }

    const facility = await facilityModel.deleteFacility(id);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }
    res.status(200).json({ message: "Facility deleted", facility });
  } catch (error) {
    console.error('Delete facility error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
};
