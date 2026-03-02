const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// POST /auth/register
router.post('/register', userController.register);

// POST /auth/login
router.post('/login', userController.login);

// GET /auth/profile (protected)
router.get('/profile', authenticateToken, userController.getProfile);

// GET /auth/users (admin only)
router.get('/users', authenticateToken, requireAdmin, userController.getAllUsers);

// PUT /auth/users/:id/role (admin only)
router.put('/users/:id/role', authenticateToken, requireAdmin, userController.updateUserRole);

// DELETE /auth/users/:id (admin only)
router.delete('/users/:id', authenticateToken, requireAdmin, userController.deleteUser);

module.exports = router;
