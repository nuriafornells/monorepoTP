import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PaymentPending() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    
    console.log('Payment pending:', { paymentId, status });
  }, [searchParams]);

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
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '500px'
      }}>
        <h1 style={{ color: '#856404', marginBottom: '1rem' }}>
          Pago Pendiente ⏳
        </h1>
        <p style={{ color: '#856404', marginBottom: '1rem' }}>
          Tu pago está siendo procesado.
        </p>
        <p style={{ color: '#856404', marginBottom: '2rem' }}>
          Te notificaremos cuando se confirme el pago de tu reserva.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            onClick={() => navigate('/my-reservations')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ffc107',
              color: '#212529',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Ver mis reservas
          </button>
          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}