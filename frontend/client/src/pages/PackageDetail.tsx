// src/pages/PackageDetail.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../axios";
import type { Package } from "../types";

export default function PackageDetail() {
  // Extraemos `id` en vez de `slug`
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Package | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      if (!id) return setItem(null);

      try {
        const res = await axios.get<{ paquete: Package }>(`/paquetes/${id}`);
        setItem(res.data.paquete);
      } catch {
        setItem(null);
      }
    };
    fetchPackage();
  }, [id]);

  // Solo mostramos detalle si existe y está publicado
  if (!item) {
    return (
      <div>
        <p>No encontramos este paquete.</p>
        <button className="btn" onClick={() => navigate("/packages")}>
          Volver
        </button>
      </div>
    );
  }

  if (!item.publicado) {
    return (
      <div>
        <p>No encontramos este paquete.</p>
        <button className="btn" onClick={() => navigate("/packages")}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      {item.imageUrl && <img src={item.imageUrl} alt={item.nombre} />}
      <div className="card-body">
        <div className="badge">{item.destino}</div>
        <h1>{item.nombre}</h1>
        <p style={{ color: "var(--muted)" }}>{item.description}</p>
        <p>
          <strong>Duración:</strong> {item.duracion} días
        </p>
        <p className="price">USD {item.precio}</p>
        <Link className="btn" to={`/reserve/${item.id}`}>
          Reservar
        </Link>
      </div>
    </div>
  );
}