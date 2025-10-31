const express = require('express');
const {
  getDestinos,
  getHoteles,
  createDestino,
  createHotel,
} = require('../controllers/destinos.controller');

const router = express.Router();

// Endpoints para destinos
router.get('/', getDestinos);        // GET /api/destinos
router.post('/', createDestino);     // POST /api/destinos

// Endpoints para hoteles
router.get('/hoteles', getHoteles);  // GET /api/destinos/hoteles
router.post('/hoteles', createHotel);// POST /api/destinos/hoteles

module.exports = router;
// Router para manejar rutas relacionadas con destinos y hoteles