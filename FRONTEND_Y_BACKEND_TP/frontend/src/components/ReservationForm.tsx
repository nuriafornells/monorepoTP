import { useState } from "react";
import DatePicker from "react-datepicker";
import { useAuth } from "../context/AuthContext";
import axios from "../axios";

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
      setSuccess(false);

      await axios.post(
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
          },
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
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
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
      />

      <label style={{ marginTop: 12 }}>Cantidad de personas</label>
      <input
        type="number"
        min={1}
        value={cantidad}
        onChange={(e) => setCantidad(Number(e.target.value))}
        required
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Reserva creada con éxito ✅</p>}

      <button type="submit" className="btn" disabled={loading}>
        {loading ? "Reservando…" : "Confirmar reserva"}
      </button>
    </form>
  );
}