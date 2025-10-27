import { useParams, Link } from "react-router-dom";
import { useTravel } from "../hooks/useTravel";
import type { Paquete } from "../types";
import ReservationForm from "../components/ReservationForm";

export default function PackageDetail() {
  const { id } = useParams<{ id: string }>();
  const { packages } = useTravel();

  const paquete: Paquete | undefined = packages?.find(
    (p) => p.id === Number(id)
  );

  if (!paquete) {
    return <p>Paquete no encontrado.</p>;
  }

  return (
    <div className="package-detail">
      {paquete.fotoURL && (
        <img
          src={paquete.fotoURL}
          alt={paquete.nombre}
          style={{ 
            width: "100%", 
            height: "300px",
            objectFit: "cover",
            borderRadius: 8, 
            marginBottom: 16 
          }}
        />
      )}

      <h1>{paquete.nombre}</h1>

      <div className="badge">
        {paquete.destino?.nombre ?? "Destino no disponible"}
      </div>

      <p style={{ color: "var(--muted)" }}>
        {paquete.descripcion ?? "Sin descripción"}
      </p>

      <ul>
        <li>
          <strong>Duración:</strong> {paquete.duracion} días
        </li>
        <li>
          <strong>Hotel:</strong> {paquete.hotel?.nombre} (
          {paquete.hotel?.ubicacion})
        </li>
        <li>
          <strong>Categoría:</strong> {paquete.hotel?.categoria}
        </li>
        <li>
          <strong>Destino:</strong> {paquete.destino?.nombre}
        </li>
      </ul>

      <h2 style={{ marginTop: 16 }}>Precio: USD {paquete.precio}</h2>

      {/* Formulario de reserva */}
      <ReservationForm packageId={paquete.id} />

      <div style={{ marginTop: 24 }}>
        <Link className="btn" to="/packages">
          ← Volver a paquetes
        </Link>
      </div>
    </div>
  );
}