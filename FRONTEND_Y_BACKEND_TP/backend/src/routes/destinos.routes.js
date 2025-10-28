const express = require('express');
const { getDestinos, getHoteles } = require('../controllers/destinos.controller');

const router = express.Router();

// Public endpoints for destinos and hoteles
router.get('/destinos', getDestinos);
router.get('/hoteles', getHoteles);

module.exports = router;