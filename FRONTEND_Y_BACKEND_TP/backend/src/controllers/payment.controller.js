// src/controllers/payment.controller.js
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { logger } = require('../middlewares/logger');

// Configurar MercadoPago - necesitarás agregar tu ACCESS_TOKEN en .env
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-YOUR-ACCESS-TOKEN',
  options: { timeout: 5000 }
});

/**
 * Crear preferencia de pago para MercadoPago
 */
const createPaymentPreference = async (req, res) => {
  try {
    const { reservationId, amount, description, userEmail } = req.body;

    if (!reservationId || !amount || !description) {
      return res.status(400).json({ 
        error: 'reservationId, amount y description son requeridos' 
      });
    }

    const preference = new Preference(client);

    const preferenceData = {
      items: [
        {
          title: description,
          unit_price: Number(amount),
          quantity: 1,
          currency_id: 'USD', // Cambiar según tu moneda
        }
      ],
      payer: {
        email: userEmail || 'test@test.com',
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success`,
        failure: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failure`,
        pending: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/pending`,
      },
      auto_return: 'approved',
      external_reference: reservationId.toString(),
      notification_url: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/payments/webhook`,
    };

    const result = await preference.create({ body: preferenceData });
    
    logger.info('MercadoPago preference created', { 
      preferenceId: result.id, 
      reservationId 
    });

    res.status(200).json({
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point,
    });

  } catch (error) {
    logger.error('Error creating MercadoPago preference:', { 
      error: error?.message || error,
      stack: error?.stack 
    });
    res.status(500).json({ error: 'Error al crear preferencia de pago' });
  }
};

/**
 * Webhook para recibir notificaciones de MercadoPago
 */
const handlePaymentWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;
    
    logger.info('MercadoPago webhook received', { type, data });

    if (type === 'payment') {
      const paymentId = data.id;
      
      // Buscar el pago en MercadoPago
      // const { Payment } = require('mercadopago');
      // const payment = new Payment(client);
      // const paymentInfo = await payment.get({ id: paymentId });
      
      // Si el pago fue aprobado, actualizar la reserva a "aceptada"
      // if (paymentInfo.status === 'approved') {
      //   const reservationId = paymentInfo.external_reference;
      //   await updateReservationStatus(reservationId, 'aceptada');
      // }
      
      logger.info('Payment webhook processed', { paymentId });
    }

    res.status(200).json({ received: true });
  } catch (error) {
    logger.error('Error handling MercadoPago webhook:', { 
      error: error?.message || error 
    });
    res.status(500).json({ error: 'Error processing webhook' });
  }
};

/**
 * Actualizar estado de reserva
 */
const updateReservationStatus = async (reservationId, status) => {
  try {
    // Obtener el EntityManager desde el contexto de la request
    // Esta función sería llamada desde el webhook
    // const repo = req.em.getRepository('Reservation');
    // await repo.nativeUpdate({ id: reservationId }, { status });
    
    logger.info('Reservation status updated', { reservationId, status });
  } catch (error) {
    logger.error('Error updating reservation status:', { 
      reservationId, 
      status, 
      error: error?.message || error 
    });
  }
};

/**
 * Verificar estado de pago
 */
const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // Aquí implementarías la lógica para verificar el estado del pago
    // const payment = await mercadopago.payment.findById(paymentId);
    
    res.status(200).json({ 
      status: 'pending', // approved, rejected, pending
      message: 'Payment status check not implemented yet'
    });
  } catch (error) {
    logger.error('Error checking payment status:', { 
      error: error?.message || error 
    });
    res.status(500).json({ error: 'Error al verificar estado del pago' });
  }
};

module.exports = {
  createPaymentPreference,
  handlePaymentWebhook,
  getPaymentStatus,
};