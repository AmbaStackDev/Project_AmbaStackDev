const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/checkout', verifyToken, OrderController.checkout);

// Rute Admin
router.get('/admin/all', verifyToken, isAdmin, OrderController.getAllAdminOrders);
router.put('/admin/:order_id/status', verifyToken, isAdmin, OrderController.updateOrderStatus);

// Rute Pembeli
router.get('/my-orders', verifyToken, OrderController.getUserOrders);
router.put('/:order_id/status', verifyToken, OrderController.updateUserOrderStatus);

// Rute Rating & Ulasan (BARU)
router.post('/rating', verifyToken, OrderController.submitRating);
router.get('/ratings/all', verifyToken, OrderController.getAllRatings);

module.exports = router;