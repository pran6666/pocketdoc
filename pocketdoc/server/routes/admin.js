const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin privileges
router.use(authenticateToken, isAdmin);

// Medicine management
router.get('/medicines', adminController.getAllMedicines);
router.post('/medicines', adminController.addMedicine);
router.put('/medicines/:id', adminController.updateMedicine);
router.delete('/medicines/:id', adminController.deleteMedicine);

// Symptom management
router.get('/symptoms', adminController.getAllSymptoms);
router.post('/symptoms', adminController.addSymptom);
router.put('/symptoms/:id', adminController.updateSymptom);
router.delete('/symptoms/:id', adminController.deleteSymptom);

// User management
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);

// Order management
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// Dashboard statistics
router.get('/stats', adminController.getDashboardStats);

module.exports = router;
