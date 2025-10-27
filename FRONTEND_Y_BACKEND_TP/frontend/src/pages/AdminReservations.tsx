import { useEffect, useState } from "react";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";

type Reserva = {
  id: number;
  paquete: {
    nombre: string;
    destino: { nombre: string };
    hotel: {
      nombre: string;
    };
  };
  user: {
    email: string;
  };
  fechaInicio?: string;
  fechaFin?: string;
  fechaReserva?: string;
  cantidadPersonas: number;
  estado: string;
};

export default function AdminReservations() {
  const { role, token } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filtro, setFiltro] = useState("todas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await axios.get("/reservations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data as Reserva[] | { reservas: Reserva[] };
        setReservas(Array.isArray(data) ? data : data.reservas);
      } catch (err) {
        console.error("Error al traer reservas:", err);
      } finally {
        setLoading(false);
      }
    };

    if (role === "admin") {
      fetchReservas();
    }
  }, [role, token]);

  if (role !== "admin") {
    return <p>Acceso denegado: solo para administradores.</p>;
  }

  const reservasFiltradas =
    filtro === "todas"
      ? reservas
      : reservas.filter((r) => r.estado === filtro);

  return (
    <div className="container">
      <h1>Reservas registradas</h1>

      <div style={{ marginBottom: 16 }}>
        <label>Filtrar por estado: </label>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          <option value="todas">Todas</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>

      {loading ? (
        <p>Cargando reservas…</p>
      ) : reservasFiltradas.length === 0 ? (
        <p>No hay reservas para mostrar.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Paquete</th>
              <th>Destino</th>
              <th>Usuario</th>
              <th>Fechas</th>
              <th>Personas</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.paquete?.nombre}</td>
                <td>{r.paquete?.destino?.nombre}</td>
                <td>{r.user?.email}</td>
                <td>
                  {r.fechaInicio && r.fechaFin
                    ? `${r.fechaInicio.slice(0, 10)} → ${r.fechaFin.slice(0, 10)}`
                    : r.fechaReserva?.slice(0, 10) ?? "—"}
                </td>
                <td>{r.cantidadPersonas}</td>
                <td>{r.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}