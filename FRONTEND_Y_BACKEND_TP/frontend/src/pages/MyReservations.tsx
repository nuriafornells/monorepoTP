import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../hooks/useAuth";

type Reservation = {
  id: number;
  fechaInicio: string | null;
  fechaFin: string | null;
  paquete: {
    nombre: string;
    destino: { id: number; nombre: string } | null;
  };
  status: "pendiente" | "aceptada" | "rechazada";
};

function formatDate(dateString?: string | null) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  return d.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function MyReservations() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReservas() {
      try {
        const res = await api.get<{ reservas: Reservation[] }>(
          `/reservations/user/${user?.id}`
        );
        setReservas(res.data.reservas);
      } catch {
        alert("No se pudieron cargar tus reservas.");
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) fetchReservas();
  }, [user]);

  if (loading) return <p>Cargando tus reservas…</p>;

  return (
    <div className="page-container">
      <div className="card">
        <h2>Mis reservas</h2>
        {reservas.length === 0 ? (
          <p>No tenés reservas registradas.</p>
        ) : (
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Paquete</th>
                  <th>Destino</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((r) => (
                  <tr key={r.id}>
                    <td>{r.paquete.nombre}</td>
                    <td>{r.paquete.destino?.nombre ?? "-"}</td>
                    <td>{formatDate(r.fechaInicio)}</td>
                    <td>{formatDate(r.fechaFin)}</td>
                    <td>
                      {r.status === "pendiente" && "⏳ Pendiente"}
                      {r.status === "aceptada" && "✅ Aceptada"}
                      {r.status === "rechazada" && "❌ Rechazada"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
