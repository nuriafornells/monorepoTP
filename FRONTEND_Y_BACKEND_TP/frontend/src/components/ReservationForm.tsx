import { useState } from "react";
import DatePicker from "react-datepicker";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import PaymentPopup from "./PaymentPopup";
// Formulario para reservar un paquete turístico específico
// Recibe el ID del paquete como prop
// Utiliza un selector de rango de fechas y un campo para la cantidad de personas
// Envía la reserva al backend autenticado con el token del usuario
// Muestra mensajes de éxito o error según la respuesta del servidor

type Props = {
  packageId: number;
  packageInfo: {
    nombre: string;
    precio: number;
    duracion: number;
  };
};

export default function ReservationForm({ packageId, packageInfo }: Props) {
  const { user, token } = useAuth();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [reservationData, setReservationData] = useState<any>(null);

  // Calculate end date based on start date + package duration
  const endDate = startDate ? new Date(startDate.getTime() + (packageInfo.duracion - 1) * 24 * 60 * 60 * 1000) : null;
// Estados para manejar el formulario de reserva

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      setError("Debes iniciar sesión para reservar.");
      return;
    }
    if (!startDate) {
      setError("Selecciona una fecha de inicio válida.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Crear la reserva primero con estado 'pendiente'
      const reservationResponse = await api.post(
        "/reservations",
        {
          packageId,
          userId: user.id,
          fechaInicio: startDate,
          fechaFin: endDate,
          cantidadPersonas: cantidad,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createdReservation = reservationResponse.data.reservation || reservationResponse.data;
      setReservationData(createdReservation);
      
      // Mostrar popup de pago
      setShowPaymentPopup(true);
    } catch (error) {
      console.error('Error creating reservation:', error);
      setError('Error al crear la reserva. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };// Manejar envío del formulario de reserva

  const handlePaymentMethodSelect = async (method: 'mercadopago' | 'presencial') => {
    if (!reservationData || !user) return;

    try {
      setError(null);

      if (method === 'mercadopago') {
        // Calcular total: precio * cantidad de personas
        const totalAmount = packageInfo.precio * cantidad;
        
        // Crear preferencia de pago en MercadoPago
        const paymentResponse = await api.post('/payments/create-preference', {
          reservationId: reservationData.id,
          amount: totalAmount,
          description: `Reserva: ${packageInfo.nombre} - ${cantidad} persona(s)`,
          userEmail: user?.email
        });

        // Abrir ventana de MercadoPago
        window.open(paymentResponse.data.initPoint, '_blank');
      } else {
        // Para pago presencial, mantener el estado en 'pendiente'
        console.log('Pago presencial seleccionado - reserva queda pendiente');
      }
      
      setSuccess(true);
      setShowPaymentPopup(false);
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Error al procesar el pago. Inténtalo de nuevo.');
    }
  };

  return (
    <>
      <PaymentPopup
        isOpen={showPaymentPopup}
        onClose={() => setShowPaymentPopup(false)}
        reservation={{
          id: 0, // Temporary ID since reservation isn't created yet
          paquete: {
            nombre: packageInfo.nombre,
            precio: packageInfo.precio
          }
        }}
        cantidadPersonas={cantidad}
        onPaymentMethodSelect={handlePaymentMethodSelect}
      />
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: 24,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <h3>Reservar este paquete</h3>

      <label>Fecha de inicio</label>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        isClearable
        dateFormat="yyyy-MM-dd"
        placeholderText="Selecciona fecha de inicio"
        className="input-field"
        minDate={new Date()} // Prevent selecting past dates
      />
      
      {startDate && endDate && (
        <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
          <strong>Fecha de fin:</strong> {endDate.toLocaleDateString('es-AR')}
        </div>
      )}

      <label>Cantidad de personas</label>
      <input
        type="number"
        min={1}
        value={cantidad}
        onChange={(e) => setCantidad(Number(e.target.value))}
        required
        className="input-field"
      />
      

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
        <p style={{ color: "green" }}>
          Reserva creada con éxito ✅ - En espera de confirmación.
        </p>
      )} 

      {/* Solo mostrar el botón si aún no se envió */}
      {!success && (
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Reservando…" : "Confirmar reserva"}
        </button>
      )}
    </form>
    </>
  );
}
// Componente funcional de React que maneja el formulario de reserva de un paquete turístico
