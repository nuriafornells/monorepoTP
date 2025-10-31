// src/pages/Home.tsx
import { useContext } from "react";
import { TravelContext } from "../context/TravelContext";
import PackageCard from "../components/PackageCard";
import { Link } from "react-router-dom";
// Página de inicio que muestra paquetes turísticos destacados
// Utiliza el contexto de viaje para obtener los paquetes disponibles
// Filtra y muestra los paquetes publicados en una cuadrícula
export default function Home() {
  const context = useContext(TravelContext);

  if (!context) return <p>Error de contexto ❌</p>;

  const { packages } = context;
  const featured = packages.filter(p => p.publicado).slice(0, 3);

  return (
    <div className="page-container">
      <section style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1>¿Dónde querés viajar?</h1>
        <p style={{ color: "var(--muted)" }}>¡Reservá ya!</p>
        <Link className="btn" to="/packages">Ver todos los paquetes</Link>
      </section>

      <section>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Destacados</h2>
        <div className="packages-grid">
          {featured.map(item => (
            <PackageCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
