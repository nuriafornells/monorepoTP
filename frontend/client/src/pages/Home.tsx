// src/pages/Home.tsx
import { useContext } from "react";
import { TravelContext } from "../context/TravelContext";
import PackageCard from "../components/PackageCard";
import { Link } from "react-router-dom";

export default function Home() {
  const context = useContext(TravelContext);

  if (!context) return <p>Error de contexto ❌</p>;

  const { packages } = context;

  const featured = packages
    .filter(p => p.publicado)
    .slice(0, 3);

  return (
    <>
      <section style={{ padding: "2rem 0" }}>
        <h1 style={{ marginBottom: 8 }}>Descubrí tu próximo destino</h1>
        <p style={{ color: "var(--muted)" }}>
          Paquetes curados para que viajes fácil. Reservá en minutos.
        </p>
        <div style={{ marginTop: 12 }}>
          <Link className="btn" to="/packages">Ver todos los paquetes</Link>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Destacados</h2>
        <div className="grid grid-3" style={{ marginTop: 12 }}>
          {featured.map(item => (
            <PackageCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </>
  );
}