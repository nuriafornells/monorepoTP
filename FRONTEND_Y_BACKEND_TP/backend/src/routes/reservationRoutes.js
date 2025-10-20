// src/routes/reservationRoutes.js
const express = require('express');
const { body, param, query } = require('express-validator');
const {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation
} = require('../controllers/reservationController');
const verifyToken = require('../middlewares/verifyToken');
const validate = require('../middlewares/validate');

const router = express.Router();

// Todas protegidas
router.use(verifyToken);

// Crear reserva
router.post(
  '/',
  [
    body('packageId').isInt({ gt: 0 }).withMessage('packageId debe ser número>0'),
    body('userId').isInt({ gt: 0 }).withMessage('userId debe ser número>0'),
    body('date').isISO8601().withMessage('date debe ser YYYY-MM-DD'),
    validate
  ],
  createReservation
);

// Listar reservas (opcional userId y status)
router.get(
  '/',
  [
    query('userId').optional().isInt({ gt: 0 }).withMessage('userId inválido'),
    query('status')
      .optional()
      .isIn(['pending', 'confirmed', 'cancelled'])
      .withMessage('status inválido'),
    validate
  ],
  getReservations
);

// Detalle de reserva
router.get(
  '/:id',
  [
    param('id').isInt({ gt: 0 }).withMessage('id debe ser número>0'),
    validate
  ],
  getReservationById
);

// Actualizar estado
router.patch(
  '/:id',
  [
    param('id').isInt({ gt: 0 }).withMessage('id debe ser número>0'),
    body('status')
      .isIn(['pending', 'confirmed', 'cancelled'])
      .withMessage('status debe ser pending, confirmed o cancelled'),
    validate
  ],
  updateReservation
);

// Cancelar reserva
router.delete(
  '/:id',
  [
    param('id').isInt({ gt: 0 }).withMessage('id debe ser número>0'),
    validate
  ],
  deleteReservation
);

module.exports = router;
