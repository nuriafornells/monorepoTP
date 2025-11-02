import { Link } from "react-router-dom";
import type { Paquete } from "../types";
// Componente para mostrar la información básica de un paquete turístico

type Props = { item: Paquete };

export default function PackageCard({ item }: Props) {
  return (
    <div className="card">
      {item.fotoURL && (
        <img
          src={item.fotoURL}
          alt={item.nombre}
          style={{
            width: "100%",
            height: "160px", //  más equilibrado para cards de 350px
            objectFit: "cover",
            borderRadius: "8px 8px 0 0",
          }}
        />
      )}


      <div className="card-body" style={{ padding: "1em" }}>
        <div
          className="badge"
          style={{
            backgroundColor: "#e0f2fe",
            color: "#0369a1",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "0.85em",
            marginBottom: "0.5em",
            display: "inline-block",
          }}
        >
          {item.destino?.nombre ?? "Destino no disponible"}
        </div>

        <h3 style={{ margin: "0.5em 0" }}>{item.nombre}</h3>

        {item.descripcion && (
          <p style={{ color: "#6b7280", fontSize: "0.9em" }}>
            {item.descripcion}
          </p>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "1em",
          }}
        >
          <span
            className="price"
            style={{ fontWeight: "bold", fontSize: "1em", color: "#111" }}
          >
            USD {item.precio}
          </span>
          <Link to={`/packages/${item.id}`} className="btn">
            Ver detalle
          </Link>
        </div>
      </div>
    </div>
  );
} // Card con imagen, destino, nombre, descripción corta, precio y botón de detalle