const express = require('express');
const router = express.Router();
const symptomController = require('../controllers/symptomController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', symptomController.getAllSymptoms);
router.get('/common', symptomController.getCommonSymptoms);
router.post('/search', symptomController.searchBySymptoms);

// Admin routes (protected)
router.post('/', authenticateToken, isAdmin, symptomController.addSymptom);
router.put('/:id', authenticateToken, isAdmin, symptomController.updateSymptom);
router.delete('/:id', authenticateToken, isAdmin, symptomController.deleteSymptom);

module.exports = router;
