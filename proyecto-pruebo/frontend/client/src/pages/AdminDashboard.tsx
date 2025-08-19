// src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";
import type { Package } from "../types";

export default function AdminDashboard() {
  const [paquetes, setPaquetes] = useState<Package[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaquetes = async () => {
      try {
        const res = await axios.get<{ paquetes: Package[] }>("/paquetes");
        setPaquetes(res.data.paquetes);
      } catch (error) {
        console.error("Error al traer paquetes:", error);
      }
    };
    fetchPaquetes();
  }, []);

  const handleEliminar = async (id: number) => {
    try {
      await axios.delete(`/paquetes/${id}`);
      setPaquetes((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar paquete:", error);
    }
  };

  const handleTogglePublicacion = async (id: number) => {
    try {
      const res = await axios.patch<Package>(`/paquetes/${id}/publicar`);
      setPaquetes((prev) =>
        prev.map((p) => (p.id === id ? res.data : p))
      );
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
    <>
      <h1>Admin: Paquetes</h1>

      <button
        onClick={handleCrear}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          background: "#2563eb",
          color: "#fff",
          border: "none",
          marginBottom: 20,
        }}
      >
        ➕ Crear nuevo paquete
      </button>

      <div className="card" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={th}>ID</th>
              <th style={th}>Nombre</th>
              <th style={th}>Destino</th>
              <th style={th}>Precio</th>
              <th style={th}>Publicado</th>
              <th style={th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paquetes.map((p) => (
              <tr key={p.id}>
                <td style={td}>{p.id}</td>
                <td style={td}>{p.nombre}</td>
                <td style={td}>{p.destino}</td>
                <td style={td}>${p.precio}</td>
                <td style={td}>{p.publicado ? "Sí" : "No"}</td>
                <td style={td}>
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
    </>
  );
}

const th: React.CSSProperties = { textAlign: "left", padding: 12 };
const td: React.CSSProperties = {
  padding: 12,
  borderTop: "1px solid #e5e7eb",
};