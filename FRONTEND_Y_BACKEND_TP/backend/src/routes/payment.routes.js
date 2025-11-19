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

// Test endpoint - just redirect to success page
router.get('/test-success/:reservationId', (req, res) => {
  const { reservationId } = req.params;
  res.redirect(`http://localhost:5173/payment/success?payment_id=test_${reservationId}&status=approved&external_reference=${reservationId}`);
});

// Manual test endpoint - simulate payment success with DB update
router.get('/simulate-success/:reservationId', async (req, res) => {
  try {
    const { reservationId } = req.params;
    
    console.log('Simulating success for reservation:', reservationId);
    
    // Check if we have access to the ORM
    if (!req.em) {
      console.error('No ORM access in simulate-success route');
      return res.status(500).json({ error: 'ORM not available' });
    }
    
    // Update reservation to 'aceptada'
    const em = req.em;
    const reservationRepo = em.getRepository('Reservation');
    await reservationRepo.nativeUpdate({ id: parseInt(reservationId) }, { status: 'aceptada' });
    await em.flush();
    
    console.log('Reservation updated successfully');
    
    // Redirect to success page
    res.redirect(`http://localhost:5173/payment/success?payment_id=sim_${reservationId}&status=approved&external_reference=${reservationId}`);
  } catch (error) {
    console.error('Error in simulate-success:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;