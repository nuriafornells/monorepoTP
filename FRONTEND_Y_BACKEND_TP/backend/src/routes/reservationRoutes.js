// src/routes/reservationsRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middlewares/auth');
const { reservationCreateRules, handleValidation } = require('../middlewares/validators');
const reservationsCtrl = require('../controllers/reservationController');
const { sanitizeFields } = require('../middlewares/sanitizers');

// Crear reserva: token requerido; si no es admin, userId será forzado al token en el controller
router.post(
  '/',
  verifyToken,
  reservationCreateRules,
  handleValidation,
  sanitizeFields(['fechaInicio', 'fechaFin']),
  reservationsCtrl.createReservation
);

// Obtener reservas: admin ve todas, user solo las suyas
router.get('/', verifyToken, reservationsCtrl.getReservations);

// Actualizar estado: solo admin
router.patch('/:id/status', verifyToken, verifyAdmin, reservationsCtrl.updateReservationStatus);

// Obtener reservas por usuario
router.get('/user/:id', verifyToken, reservationsCtrl.getReservationsByUser);

module.exports = router;