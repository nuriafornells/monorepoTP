// src/controllers/payment.controller.js
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
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

    logger.info('Creating MercadoPago preference', { 
      reservationId, 
      amount, 
      description, 
      userEmail,
      body: req.body 
    });

    if (!reservationId || !amount || !description) {
      logger.error('Missing required fields', { reservationId, amount, description });
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
        }
      ],
      back_urls: {
        success: 'http://localhost:5173/payment/success',
        failure: 'http://localhost:5173/payment/failure',
        pending: 'http://localhost:5173/payment/pending',
      },
      external_reference: reservationId.toString(),
      notification_url: 'http://localhost:3001/api/payments/webhook',
    };

    logger.info('Sending preference data to MercadoPago', { preferenceData });
    logger.info('=== TEST CARDS FOR MERCADOPAGO ===');
    logger.info('APPROVED Visa: 4509 9535 6623 3704');
    logger.info('APPROVED Mastercard: 5031 7557 3453 0604');
    logger.info('REJECTED: 4013 5406 8274 6260');
    logger.info('Try different expiry dates: 11/25, 12/26, etc.');
    logger.info('======================================');
    
    const result = await preference.create({ body: preferenceData });
    
    logger.info('MercadoPago preference created successfully', { 
      preferenceId: result.id, 
      reservationId,
      initPoint: result.init_point
    });

    res.status(200).json({
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point,
    });

  } catch (error) {
    logger.error('Error creating MercadoPago preference:', { 
      error: error?.message || error,
      stack: error?.stack,
      cause: error?.cause,
      response: error?.response?.data,
      status: error?.response?.status
    });
    
    // Return more specific error information
    res.status(500).json({ 
      error: 'Error al crear preferencia de pago',
      details: error?.message || 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Webhook para recibir notificaciones de MercadoPago
 */
const handlePaymentWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;
    
    logger.info('MercadoPago webhook received', { type, data, body: req.body });

    if (type === 'payment') {
      const paymentId = data.id;
      
      // Buscar el pago en MercadoPago
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: paymentId });
      
      logger.info('Payment info retrieved', { 
        paymentId, 
        status: paymentInfo.status,
        externalReference: paymentInfo.external_reference
      });
      
      // Si el pago fue aprobado, actualizar la reserva a "aceptada"
      if (paymentInfo.status === 'approved') {
        const reservationId = paymentInfo.external_reference;
        await updateReservationStatus(req, reservationId, 'aceptada');
        logger.info('Reservation updated to aceptada', { reservationId });
      } else if (paymentInfo.status === 'rejected') {
        const reservationId = paymentInfo.external_reference;
        await updateReservationStatus(req, reservationId, 'rechazada');
        logger.info('Reservation updated to rechazada', { reservationId });
      }
      
      logger.info('Payment webhook processed', { paymentId, status: paymentInfo.status });
    }

    res.status(200).json({ received: true });
  } catch (error) {
    logger.error('Error handling MercadoPago webhook:', { 
      error: error?.message || error,
      stack: error?.stack
    });
    res.status(500).json({ error: 'Error processing webhook' });
  }
};

/**
 * Actualizar estado de reserva
 */
const updateReservationStatus = async (req, reservationId, status) => {
  try {
    const em = req.em;
    const reservationRepo = em.getRepository('Reservation');
    
    // Actualizar el estado de la reserva
    await reservationRepo.nativeUpdate({ id: parseInt(reservationId) }, { status });
    await em.flush();
    
    logger.info('Reservation status updated successfully', { reservationId, status });
  } catch (error) {
    logger.error('Error updating reservation status:', { 
      reservationId, 
      status, 
      error: error?.message || error,
      stack: error?.stack
    });
    throw error;
  }
};

/**
 * Verificar estado de pago
 */
const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ error: 'paymentId required' });
    }

    // Use MercadoPago SDK to fetch payment info
    const paymentClient = new Payment(client);
    const paymentInfo = await paymentClient.get({ id: paymentId });

    // If we have an external_reference, update reservation status accordingly
    try {
      const status = paymentInfo.status;
      const reservationId = paymentInfo.external_reference;
      if (reservationId) {
        if (status === 'approved') {
          await updateReservationStatus(req, reservationId, 'aceptada');
        } else if (status === 'rejected') {
          await updateReservationStatus(req, reservationId, 'rechazada');
        }
      }

    } catch (err) {
      logger.error('Error auto-updating reservation from status check', { error: err?.message || err });
    }

    res.status(200).json({ status: paymentInfo.status, raw: paymentInfo });
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