// src/components/PackageCard.tsx
import { Link } from "react-router-dom";
import type { Package } from "../types";

type Props = { item: Package };

export default function PackageCard({ item }: Props) {
  return (
    <div className="card">
      {item.imageUrl && <img src={item.imageUrl} alt={item.nombre} />}
      <div className="card-body">
        <div className="badge">{item.destino}</div>
        <h3>{item.nombre}</h3>
        <p style={{ color: "var(--muted)" }}>{item.description}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="price">USD {item.precio}</span>
          <Link className="btn" to={`/packages/${item.id}`}>Ver detalle</Link>
        </div>
      </div>
    </div>
  );
}