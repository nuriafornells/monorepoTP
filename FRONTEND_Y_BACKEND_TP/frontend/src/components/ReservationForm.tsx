import { useState } from "react";
import DatePicker from "react-datepicker";
import { useAuth } from "../context/AuthContext";
import api from "../api";
// Formulario para reservar un paquete turístico específico
// Recibe el ID del paquete como prop
// Utiliza un selector de rango de fechas y un campo para la cantidad de personas
// Envía la reserva al backend autenticado con el token del usuario
// Muestra mensajes de éxito o error según la respuesta del servidor

type Props = {
  packageId: number;
};

export default function ReservationForm({ packageId }: Props) {
  const { user, token } = useAuth();
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
// Estados para manejar el formulario de reserva

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      setError("Debes iniciar sesión para reservar.");
      return;
    }
    if (!range[0] || !range[1]) {
      setError("Selecciona un rango de fechas válido.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.post(
        "/reservations",
        {
          packageId,
          userId: user.id,
          fechaInicio: range[0],
          fechaFin: range[1],
          cantidadPersonas: cantidad,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }, // Envío del token en el header para autenticación
        }
      );

      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  };// Manejar envío del formulario de reserva

  return (
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

      <label>Fechas</label>
      <DatePicker
        selectsRange
        startDate={range[0]}
        endDate={range[1]}
        onChange={(update) => setRange(update)}
        isClearable
        dateFormat="yyyy-MM-dd"
        placeholderText="Selecciona rango de fechas"
        className="input-field"
      />

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
  );
}
// Componente funcional de React que maneja el formulario de reserva de un paquete turístico
