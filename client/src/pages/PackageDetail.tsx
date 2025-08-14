// src/pages/PackageDetail.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { PACKAGES } from "../data/packages";

export default function PackageDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const item = PACKAGES.find(p => p.slug === slug);

  if (!item || !item.published) {
    return (
      <div>
        <p>No encontramos este paquete.</p>
        <button className="btn" onClick={() => navigate("/packages")}>Volver</button>
      </div>
    );
  }

  return (
    <div className="card">
      <img src={item.imageUrl} alt={item.title} />
      <div className="card-body">
        <div className="badge">{item.destination}</div>
        <h1>{item.title}</h1>
        <p style={{ color: "var(--muted)" }}>{item.description}</p>
        <p><strong>Duración:</strong> {item.days} días / {item.nights} noches</p>
        <p className="price">USD {item.priceUSD}</p>
        <Link className="btn" to={`/reserve/${item.slug}`}>Reservar</Link>
      </div>
    </div>
  );
}