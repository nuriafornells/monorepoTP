// src/routes/payment.routes.js
const express = require('express');
const paymentCtrl = require('../controllers/payment.controller');
const { verifyToken } = require('../middlewares/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validaciones para crear preferencia de pago
const createPreferenceValidation = [
  body('reservationId')
    .isInt({ min: 1 })
    .withMessage('reservationId debe ser un número entero válido'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('amount debe ser un número mayor a 0'),
  body('description')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('description debe tener entre 5 y 200 caracteres'),
  body('userEmail')
    .optional()
    .isEmail()
    .withMessage('userEmail debe ser un email válido'),
];

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Datos de entrada inválidos',
      details: errors.array()
    });
  }
  next();
};

// Crear preferencia de pago (requiere autenticación)
router.post(
  '/create-preference',
  verifyToken,
  createPreferenceValidation,
  handleValidationErrors,
  paymentCtrl.createPaymentPreference
);

// Webhook de MercadoPago (sin autenticación)
router.post('/webhook', paymentCtrl.handlePaymentWebhook);

// Verificar estado de pago (requiere autenticación)
router.get('/status/:paymentId', verifyToken, paymentCtrl.getPaymentStatus);

module.exports = router;