import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../hooks/useAuth";

type Reservation = {
  id: number;
  fechaInicio: string | null;
  fechaFin: string | null;
  paquete: {
    nombre: string;
    destino: {
      id: number;
      nombre: string;
      createdAt: string;
      updatedAt: string;
    } | null;
  };
  status: "pendiente" | "aceptada" | "rechazada";
};

// 🔧 Función para formatear fechas
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
      } catch (err) {
        console.error("Error al cargar reservas:", err);
        alert("No se pudieron cargar tus reservas.");
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) fetchReservas();
  }, [user]);

  if (loading) return <p>Cargando tus reservas…</p>;

  return (
    <div className="card">
      <h2>Mis reservas</h2>
      {reservas.length === 0 ? (
        <p>No tenés reservas registradas.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={{ textAlign: "left", padding: 12 }}>Paquete</th>
              <th style={{ textAlign: "left", padding: 12 }}>Destino</th>
              <th style={{ textAlign: "left", padding: 12 }}>Inicio</th>
              <th style={{ textAlign: "left", padding: 12 }}>Fin</th>
              <th style={{ textAlign: "left", padding: 12 }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((r) => (
              <tr key={r.id}>
                <td style={{ padding: 12 }}>{r.paquete.nombre}</td>
                <td style={{ padding: 12 }}>{r.paquete.destino?.nombre ?? "-"}</td>
                <td style={{ padding: 12 }}>{formatDate(r.fechaInicio)}</td>
                <td style={{ padding: 12 }}>{formatDate(r.fechaFin)}</td>
                <td style={{ padding: 12 }}>
                  {r.status === "pendiente" && "⏳ Pendiente"}
                  {r.status === "aceptada" && "✅ Aceptada"}
                  {r.status === "rechazada" && "❌ Rechazada"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}