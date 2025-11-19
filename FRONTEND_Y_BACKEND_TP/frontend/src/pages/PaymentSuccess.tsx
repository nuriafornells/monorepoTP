import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Opcional: Aquí podrías hacer una llamada al backend para confirmar el pago
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const merchantOrderId = searchParams.get('merchant_order_id');

    console.log('Payment success:', { paymentId, status, merchantOrderId });

    // If MercadoPago returned a payment_id, call backend to confirm and update reservation
    if (paymentId) {
      (async () => {
        try {
          const resp = await api.get(`/payments/status/${paymentId}`);
          console.log('Payment status response', resp.data);
        } catch (err) {
          console.error('Error verifying payment status', err);
        }
      })();
    }

    // Redirigir a mis reservas después de 3 segundos
    const timer = setTimeout(() => {
      navigate('/mis-reservas');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate, searchParams]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '50vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '500px'
      }}>
        <h1 style={{ color: '#155724', marginBottom: '1rem' }}>
          ¡Pago Exitoso! ✅
        </h1>
        <p style={{ color: '#155724', marginBottom: '1rem' }}>
          Tu pago ha sido procesado correctamente.
        </p>
        <p style={{ color: '#155724', marginBottom: '2rem' }}>
          La reserva ha sido confirmada y pronto recibirás un email de confirmación.
        </p>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
          Serás redirigido a tus reservas en unos segundos...
        </p>

      </div>
    </div>
  );
}