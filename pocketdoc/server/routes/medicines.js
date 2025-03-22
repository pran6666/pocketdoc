const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

router.post('/search', medicineController.searchBySymptoms);

module.exports = router;
