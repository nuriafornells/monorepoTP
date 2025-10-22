import { Link } from "react-router-dom";
import type { Paquete } from "../types";

type Props = { item: Paquete };

export default function PackageCard({ item }: Props) {
  return (
    <div className="card">
      {/* Imagen opcional */}
      {item.imageUrl && <img src={item.imageUrl} alt={item.nombre} />}

      <div className="card-body">
        {/* Destino seguro */}
        <div className="badge">
          {item.hotel?.destino?.nombre ?? "Destino no disponible"}
        </div>

        <h3>{item.nombre}</h3>

        {/* Descripción opcional */}
        {item.descripcion && (
          <p style={{ color: "var(--muted)" }}>{item.descripcion}</p>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span className="price">USD {item.precio}</span>
          <Link className="btn" to={`/packages/${item.id}`}>
            Ver detalle
          </Link>
        </div>
      </div>
    </div>
  );
}