import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PaymentFailure() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    
    console.log('Payment failed:', { paymentId, status });
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
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '500px'
      }}>
        <h1 style={{ color: '#721c24', marginBottom: '1rem' }}>
          Pago Rechazado ❌
        </h1>
        <p style={{ color: '#721c24', marginBottom: '1rem' }}>
          Tu pago no pudo ser procesado.
        </p>
        <p style={{ color: '#721c24', marginBottom: '2rem' }}>
          Por favor, verifica tus datos de pago e intenta nuevamente.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Intentar nuevamente
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