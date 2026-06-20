const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { verifyToken } = require('../middleware/authMiddleware'); // Menggunakan gembok JWT token yang sudah ada

// Endpoint dilindungi token login
router.get('/profile', verifyToken, UserController.getProfile);
router.put('/profile', verifyToken, UserController.updateProfile);

module.exports = router;