import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTravel } from "../hooks/useTravel";
import PackageCard from "../components/PackageCard";

export default function Packages() {
  const { packages } = useTravel();
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const term = q.toLowerCase().trim();
    const source = packages ?? [];

    return source.filter((p) => {
      const nombre = p.nombre ?? "";
      const destino = p.hotel?.destino?.nombre ?? ""; // 👈 accedemos seguro
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

      <div className="grid grid-3">
        {list.map((item) => (
          <Link
            key={item.id}
            to={`/packages/${item.id}`}
            style={{ textDecoration: "none" }}
          >
            <PackageCard item={item} />
          </Link>
        ))}
      </div>
    </>
  );
}