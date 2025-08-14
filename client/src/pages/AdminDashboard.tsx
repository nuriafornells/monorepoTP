// src/pages/AdminDashboard.tsx
import { PACKAGES } from "../data/packages";

export default function AdminDashboard() {
  return (
    <>
      <h1>Admin: Paquetes</h1>
      <div className="card" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={th}>ID</th>
              <th style={th}>Título</th>
              <th style={th}>Destino</th>
              <th style={th}>Precio USD</th>
              <th style={th}>Publicado</th>
              <th style={th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {PACKAGES.map(p => (
              <tr key={p.id}>
                <td style={td}>{p.id}</td>
                <td style={td}>{p.title}</td>
                <td style={td}>{p.destination}</td>
                <td style={td}>${p.priceUSD}</td>
                <td style={td}>{p.published ? "Sí" : "No"}</td>
                <td style={td}>
                  <button className="btn" disabled>Editar</button>{" "}
                  <button className="btn secondary" disabled>Publicar/Despublicar</button>{" "}
                  <button className="btn danger" disabled>Eliminar</button>
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