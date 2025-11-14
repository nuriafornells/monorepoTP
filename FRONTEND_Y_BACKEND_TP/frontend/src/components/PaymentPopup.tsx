import React, { useState } from 'react';
import './PaymentPopup.css';

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: {
    id: number;
    paquete: {
      nombre: string;
      precio: number;
    };
  };
  cantidadPersonas: number;
  onPaymentMethodSelect: (method: 'mercadopago' | 'presencial') => void;
}

const PaymentPopup: React.FC<PaymentPopupProps> = ({
  isOpen,
  onClose,
  reservation,
  cantidadPersonas,
  onPaymentMethodSelect,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const totalAmount = reservation.paquete.precio * cantidadPersonas;

  if (!isOpen) return null;

  const handleMercadoPagoPayment = async () => {
    setIsLoading(true);
    try {
      await onPaymentMethodSelect('mercadopago');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresencialPayment = () => {
    onPaymentMethodSelect('presencial');
    onClose();
  };

  return (
    <div className="payment-popup-overlay">
      <div className="payment-popup">
        <div className="payment-popup-header">
          <h2>Seleccionar método de pago</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="payment-popup-body">
          <div className="reservation-info">
            <h3>{reservation.paquete.nombre}</h3>
            <div className="price-breakdown">
              <p>Precio por persona: <strong>USD {reservation.paquete.precio}</strong></p>
              <p>Cantidad de personas: <strong>{cantidadPersonas}</strong></p>
              <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
              <p className="amount">Total a pagar: <strong>USD {totalAmount}</strong></p>
            </div>
          </div>

          <div className="payment-methods">
            <button
              className="payment-method-btn mercadopago-btn"
              onClick={handleMercadoPagoPayment}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner">Procesando...</div>
              ) : (
                <>
                  <img 
                    src="/mercadopago-logo.png" 
                    alt="MercadoPago" 
                    className="payment-logo"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div>
                    <h4>Pagar con MercadoPago</h4>
                    <p>Pago online seguro con tarjeta de crédito, débito o otros métodos</p>
                  </div>
                </>
              )}
            </button>

            <button
              className="payment-method-btn presencial-btn"
              onClick={handlePresencialPayment}
              disabled={isLoading}
            >
              <div className="payment-icon">🏢</div>
              <div>
                <h4>Pago Presencial</h4>
                <p>Pagar en nuestras oficinas. Tu reserva quedará pendiente de confirmación.</p>
              </div>
            </button>
          </div>
        </div>

        <div className="payment-popup-footer">
          <p className="security-note">
            🔒 Todos los pagos son procesados de forma segura
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;