// src/components/PackageCard.tsx
import { Link } from "react-router-dom";
import type { Package } from "../types";

type Props = { item: Package };

export default function PackageCard({ item }: Props) {
  return (
    <div className="card">
      <img src={item.imageUrl} alt={item.title} />
      <div className="card-body">
        <div className="badge">{item.destination}</div>
        <h3>{item.title}</h3>
        <p style={{ color: "var(--muted)" }}>{item.description}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="price">USD {item.priceUSD}</span>
          <Link className="btn" to={`/packages/${item.slug}`}>Ver detalle</Link>
        </div>
      </div>
    </div>
  );
}