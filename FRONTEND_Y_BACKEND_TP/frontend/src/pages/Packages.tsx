import { useMemo, useState } from "react";
import { useTravel } from "../hooks/useTravel";
import PackageCard from "../components/PackageCard";
// Página que muestra todos los paquetes turísticos disponibles
// estaba duplicado con package list de components. ya lo borre

export default function Packages() {
  const { packages } = useTravel();
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const term = q.toLowerCase().trim();
    const source = packages ?? [];

    return source.filter((p) => {
      const nombre = p.nombre ?? "";
      const destino = p.destino?.nombre ?? "";
      return (
        p.publicado &&
        (nombre.toLowerCase().includes(term) ||
          destino.toLowerCase().includes(term))
      );
    });
  }, [q, packages]);

  return (
    <>
      <h1>Paquetes</h1>
      <input
        placeholder="Buscar por destino o nombre…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          margin: "8px 0 16px",
        }}
      />

      {/* 👇 usamos la clase global responsiva */}
      <div className="packages-grid">
        {list.map((item) => (
          <PackageCard key={item.id} item={item} />
        ))}
        {list.length === 0 && <p>No hay paquetes disponibles</p>}
      </div>
    </>
  );
}