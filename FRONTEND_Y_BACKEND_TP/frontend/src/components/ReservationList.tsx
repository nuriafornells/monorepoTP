import { useTravel } from "../hooks/useTravel";

const ReservationList = () => {
  const { reservations } = useTravel();

  return (
    <div>
      <h2>Reservas hechas</h2>
      {reservations.length === 0 ? (
        <p>No hiciste ninguna reserva todavía.</p>
      ) : (
        <ul>
          {reservations.map((res) => (
            <li key={res.id} style={{ marginBottom: 12 }}>
              <strong>{res.paquete?.nombre || "Paquete desconocido"}</strong> — Fecha:{" "}
              {new Date(res.date).toLocaleDateString()} — Estado: {res.status} — Usuario:{" "}
              {res.user?.email || "Desconocido"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReservationList;