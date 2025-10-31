// src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import type { Paquete } from "../types";
// Página de administración para gestionar paquetes turísticos
// Permite crear, editar, eliminar y publicar/despublicar paquetes
// Utiliza la API para interactuar con el backend y actualizar el estado local
// Muestra una tabla con las acciones disponibles para cada paquete

export default function AdminDashboard() {
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaquetes = async () => {
      try {
        const res = await api.get<{ paquetes: Paquete[] }>("/paquetes");
        setPaquetes(res.data.paquetes);
      } catch (error) {
        console.error("Error al traer paquetes:", error);
      }
    };
    fetchPaquetes();
  }, []);

  const handleEliminar = async (id: number) => {
    try {
      await api.delete(`/paquetes/${id}`);
      setPaquetes((prev) => prev.filter((p) => p.id !== id));
    } catch (error: unknown) {
      const status =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { status?: number } }).response?.status ===
          "number"
          ? (error as { response: { status: number } }).response.status
          : null;

      if (status === 409) {
        const ok = confirm(
          "El paquete tiene reservas asociadas. ¿Quieres eliminar las reservas y el paquete? Esta acción es irreversible."
        );
        if (ok) {
          try {
            await api.delete(`/paquetes/${id}?force=true`);
            setPaquetes((prev) => prev.filter((p) => p.id !== id));
          } catch (error2: unknown) {
            console.error("Error al forzar eliminación del paquete:", error2);
            alert("No se pudo forzar la eliminación.");
          }
        }
      } else {
        console.error("Error al eliminar paquete:", error);
        alert("Error al eliminar paquete.");
      }
    }
  };

  const handleTogglePublicacion = async (id: number) => {
    try {
      const res = await api.patch<{ paquete: Paquete }>(
        `/paquetes/${id}/publicar`
      );
      const nuevo = res.data.paquete;
      setPaquetes((prev) => prev.map((p) => (p.id === id ? nuevo : p)));
    } catch (error) {
      console.error("Error al cambiar publicación:", error);
    }
  };

  const handleEditar = (id: number) => {
    navigate(`/admin/dashboard/editar/${id}`);
  };

  const handleCrear = () => {
    navigate("/admin/dashboard/crear");
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin: Paquetes</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <button onClick={handleCrear} style={btn}>
          ➕ Crear nuevo paquete
        </button>
        <button
          onClick={() => navigate("/admin/dashboard/create-destino")}
          style={btn}
        >
          🗺️ Crear destino
        </button>
        <button
          onClick={() => navigate("/admin/dashboard/create-hotel")}
          style={btn}
        >
          🏨 Crear hotel
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Destino</th>
                <th>Precio</th>
                <th>Publicado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paquetes.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.destino?.nombre ?? "—"}</td>
                  <td>${p.precio}</td>
                  <td>{p.publicado ? "Sí" : "No"}</td>
                  <td>
                    <button className="btn" onClick={() => handleEditar(p.id)}>
                      Editar
                    </button>{" "}
                    <button
                      className="btn secondary"
                      onClick={() => handleTogglePublicacion(p.id)}
                    >
                      {p.publicado ? "Despublicar" : "Publicar"}
                    </button>{" "}
                    <button
                      className="btn danger"
                      onClick={() => handleEliminar(p.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const btn: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 8,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};
