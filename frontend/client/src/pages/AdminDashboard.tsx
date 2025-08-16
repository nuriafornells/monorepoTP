import { useEffect, useState } from "react";
import axios from "../../axios"; // ajustá el path si estás en otra carpeta

interface Paquete {
  id: number;
  nombre: string;
  destino: string;
  precio: number;
  publicado: boolean;
}

export default function AdminDashboard() {
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);

  useEffect(() => {
    const fetchPaquetes = async () => {
      try {
        const res = await axios.get<Paquete[]>("/paquetes");
        console.log("Estado paquetes:", paquetes);
        setPaquetes(res.data);
        console.log("Paquetes recibidos:", res.data);
      } catch (error) {
        console.error("Error al traer paquetes:", error);
      }
    };

    fetchPaquetes();
  }, []);

  const handleEliminar = async (id: number) => {
    try {
      await axios.delete(`/paquetes/${id}`);
      setPaquetes(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar paquete:", error);
    }
  };

  const handleTogglePublicacion = async (id: number) => {
    try {
      const res = await axios.patch<Paquete>(`/paquetes/${id}/publicar`);
      const actualizado: Paquete = res.data;
      setPaquetes(prev =>
        prev.map(p => p.id === id ? actualizado : p)
      );
    } catch (error) {
      console.error("Error al cambiar publicación:", error);
    }
  };

  const handleEditar = (id: number) => {
    console.log("Editar paquete", id);
    // Podés redirigir a /editar/:id o abrir un modal
  };

  return (
    <>
      <h1>Admin: Paquetes</h1>
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
            {paquetes.map(p => (
              <tr key={p.id}>
                <td style={td}>{p.id}</td>
                <td style={td}>{p.nombre}</td>
                <td style={td}>{p.destino}</td>
                <td style={td}>${p.precio}</td>
                <td style={td}>{p.publicado ? "Sí" : "No"}</td>
                <td style={td}>
                  <button className="btn" onClick={() => handleEditar(p.id)}>Editar</button>{" "}
                  <button className="btn secondary" onClick={() => handleTogglePublicacion(p.id)}>
                    {p.publicado ? "Despublicar" : "Publicar"}
                  </button>{" "}
                  <button className="btn danger" onClick={() => handleEliminar(p.id)}>Eliminar</button>
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
const td: React.CSSProperties = { padding: 12, borderTop: "1px solid #e5e7eb" };