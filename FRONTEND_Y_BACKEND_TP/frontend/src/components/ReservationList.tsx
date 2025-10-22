import { useAuth } from "../context/AuthContext";
import { useReservations } from "../hooks/useReservations";
import type { Reservation } from "../types/index";

export default function ReservationList() {
  const { token } = useAuth();
  const { reservations, loading } = useReservations(token);

  if (loading) return <p>Cargando reservas...</p>;

  return (
    <div>
      <h2>Mis Reservas</h2>
      {reservations.length === 0 && <p>No tenés reservas aún.</p>}
      <ul>
        {reservations.map((r: Reservation) => (
          <li key={r.id}>
            <strong>{r.paquete.nombre}</strong>{" "}
            - {r.paquete.hotel.destino.nombre}
            <br />
            Hotel: {r.paquete.hotel.nombre} ({r.paquete.hotel.ubicacion})
            <br />
            Fecha: {new Date(r.fechaReserva).toLocaleDateString()}
            <br />
            Personas: {r.cantidadPersonas}
            <br />
            Estado: {r.status}
          </li>
        ))}
      </ul>
    </div>
  );
}