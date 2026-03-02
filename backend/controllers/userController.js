const pool = require("../config/db");
const bookingModel = require("../models/bookingModel");
const userModel = require("../models/userModel");

// Register user
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const { user, token } = await userModel.registerUser(email, password, firstName, lastName, role);

    res.status(201).json({
      message: "User registered successfully",
      user,
      token
    });
  } catch (error) {
    console.error('Register error:', error.message);
    
    if (error.message === 'User already exists') {
      return res.status(409).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const { user, token } = await userModel.loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      user,
      token
    });
  } catch (error) {
    console.error('Login error:', error.message);
    
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await userModel.getUserById(userId);
    
    res.status(200).json({
      message: "Profile retrieved successfully",
      user
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role, created_at FROM users ORDER BY created_at DESC'
    );
    
    const users = result.rows.map(row => ({
      ...row,
      id: row.id.toString()
    }));
    
    res.status(200).json({
      message: "Users retrieved successfully",
      users
    });
  } catch (error) {
    console.error('Get all users error:', error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user role (admin only)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, first_name, last_name, role',
      [role, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({
      message: "User role updated successfully",
      user: {
        ...result.rows[0],
        id: result.rows[0].id.toString()
      }
    });
  } catch (error) {
    console.error('Update user role error:', error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user has bookings
    const bookingCheck = await pool.query('SELECT COUNT(*) as count FROM bookings WHERE user_id = $1', [id]);
    
    if (parseInt(bookingCheck.rows[0].count) > 0) {
      return res.status(400).json({ message: "Cannot delete user with existing bookings" });
    }
    
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
