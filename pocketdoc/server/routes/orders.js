const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// User routes (protected)
router.get('/', authenticateToken, orderController.getUserOrders);
router.get('/recent', authenticateToken, orderController.getRecentOrders);
router.post('/', authenticateToken, orderController.createOrder);
router.get('/:id', authenticateToken, orderController.getOrderById);

// Admin routes (protected)
router.get('/admin/all', authenticateToken, isAdmin, orderController.getAllOrders);
router.put('/admin/:id/status', authenticateToken, isAdmin, orderController.updateOrderStatus);

module.exports = router;
