// src/routes/hotelsRoutes.js
const express = require('express');
const {
  getAllHotels,
  getHotelsByDestino,
  getHotelById,
} = require('../controllers/hotels.controller');

const router = express.Router();

// Public routes - no authentication needed for form selects
router.get('/', getHotelsByDestino); // Supports ?destinoId=X query param
router.get('/all', getAllHotels);
router.get('/:id', getHotelById);

module.exports = router;