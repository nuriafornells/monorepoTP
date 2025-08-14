// src/pages/Packages.tsx
import { useMemo, useState } from "react";
import { PACKAGES } from "../data/packages";
import PackageCard from "../components/PackageCard";

export default function Packages() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const term = q.toLowerCase().trim();
    return PACKAGES.filter(p =>
      p.published &&
      (p.title.toLowerCase().includes(term) ||
       p.destination.toLowerCase().includes(term))
    );
  }, [q]);

  return (
    <>
      <h1>Paquetes</h1>
      <input
        placeholder="Buscar por destino o título…"
        value={q}
        onChange={e => setQ(e.target.value)}
        style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e5e7eb", margin: "8px 0 16px" }}
      />
      <div className="grid grid-3">
        {list.map(item => <PackageCard key={item.id} item={item} />)}
      </div>
    </>
  );
}