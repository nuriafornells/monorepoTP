// src/routes/reservations.routes.js
const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');
const { reservationCreateRules, handleValidation } = require('../middlewares/validators');
const reservationsCtrl = require('../controllers/reservationController');

const router = express.Router();

// Crear reserva: token requerido; si no es admin, userId será forzado al token en el controller
router.post('/', verifyToken, reservationCreateRules, handleValidation, reservationsCtrl.createReservation);

// Obtener reservas: admin ve todas, user solo las suyas
router.get('/', verifyToken, reservationsCtrl.getReservations);

// Actualizar estado: solo admin
router.patch('/:id/status', verifyToken, verifyAdmin, reservationsCtrl.updateReservationStatus);

// Obtener reservas por usuario
router.get('/user/:id', verifyToken, reservationsCtrl.getReservationsByUser);

module.exports = router;