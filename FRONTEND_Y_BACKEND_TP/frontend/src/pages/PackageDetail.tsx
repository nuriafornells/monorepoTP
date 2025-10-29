// src/pages/PackageDetail.tsx
import { useParams, Link } from "react-router-dom";
import { useTravel } from "../hooks/useTravel";
import type { Paquete } from "../types";
import ReservationForm from "../components/ReservationForm";

export default function PackageDetail() {
  const { id } = useParams<{ id: string }>();
  const { packages } = useTravel();

  const paquete: Paquete | undefined = packages?.find(p => p.id === Number(id));
  if (!paquete) return <p>Paquete no encontrado.</p>;

  return (
    <div className="page-container" style={{ maxWidth: 700, margin: "0 auto" }}>
      {/* Imagen del paquete */}
      {paquete.fotoURL && (
        <img
          src={paquete.fotoURL}
          alt={paquete.nombre}
          style={{
            width: "100%",
            height: "350px",
            objectFit: "cover",
            borderRadius: 8,
            marginBottom: 16,
          }}
        />
      )}

      {/* Nombre y destino */}
      <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>{paquete.nombre}</h1>
      <div className="badge" style={{ fontSize: "1rem", marginBottom: 12 }}>
        {paquete.destino?.nombre ?? "Destino no disponible"}
      </div>

      {/* Descripción */}
      <p style={{ color: "var(--muted)", fontSize: "1rem", marginBottom: 16 }}>
        {paquete.descripcion ?? "Sin descripción"}
      </p>

      {/* Detalles del paquete */}
      <ul style={{ fontSize: "1.1rem", lineHeight: 1.6, marginBottom: 16 }}>
        <li><strong>Duración:</strong> {paquete.duracion} días</li>
        <li><strong>Hotel:</strong> {paquete.hotel?.nombre} ({paquete.hotel?.ubicacion})</li>
        <li><strong>Categoría:</strong> {paquete.hotel?.categoria}</li>
        <li><strong>Destino:</strong> {paquete.destino?.nombre}</li>
      </ul>

      {/* Precio */}
      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 24 }}>
        Precio: USD {paquete.precio}
      </h2>

      {/* Formulario de reserva */}
      <div
        className="card"
        style={{
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <ReservationForm packageId={paquete.id} />
      </div>

      {/* Botón volver */}
      <div style={{ marginTop: 24, textAlign: "center" }}>
        <Link className="btn" to="/packages">← Volver a paquetes</Link>
      </div>
    </div>
  );
}
