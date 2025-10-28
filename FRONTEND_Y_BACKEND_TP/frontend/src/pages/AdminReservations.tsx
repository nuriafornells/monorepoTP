import { useEffect, useState } from "react";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";

type Reserva = {
  id: number;
  paquete: {
    nombre: string;
    destino: { nombre: string };
    hotel: { nombre: string };
  };
  user: { email: string };
  fechaInicio?: string;
  fechaFin?: string;
  fechaReserva?: string;
  cantidadPersonas: number;
  status: string; // 👈 usar status en vez de estado
};

export default function AdminReservations() {
  const { role, token } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filtro, setFiltro] = useState("todas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await axios.get<{ reservas: Reserva[] }>("/reservations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservas(res.data.reservas);
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

  const actualizarEstado = async (id: number, nuevoEstado: string) => {
    try {
      const res = await axios.patch<{ reserva: Reserva }>(
        `/reservations/${id}/status`,
        { status: nuevoEstado }
      );
      const actualizada = res.data.reserva;
      setReservas((prev) => prev.map((r) => (r.id === id ? actualizada : r)));
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("No se pudo actualizar el estado.");
    }
  };

  if (role !== "admin") {
    return <p>Acceso denegado: solo para administradores.</p>;
  }

  const reservasFiltradas =
    filtro === "todas" ? reservas : reservas.filter((r) => r.status === filtro);

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
          <option value="aceptada">Aceptada</option>
          <option value="rechazada">Rechazada</option>
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.paquete?.nombre}</td>
                <td>{r.paquete?.destino?.nombre ?? "—"}</td>
                <td>{r.user?.email}</td>
                <td>
                  {r.fechaInicio && r.fechaFin
                    ? `${r.fechaInicio.slice(0, 10)} → ${r.fechaFin.slice(0, 10)}`
                    : r.fechaReserva?.slice(0, 10) ?? "—"}
                </td>
                <td>{r.cantidadPersonas}</td>
                <td>{r.status}</td>
                <td>
                  {r.status === "pendiente" && (
                    <>
                      <button
                        className="btn"
                        onClick={() => actualizarEstado(r.id, "aceptada")}
                      >
                        ✅ Aceptar
                      </button>{" "}
                      <button
                        className="btn danger"
                        onClick={() => actualizarEstado(r.id, "rechazada")}
                      >
                        ❌ Rechazar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}