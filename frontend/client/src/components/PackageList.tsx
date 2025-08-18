// src/components/PackageList.tsx
import { useEffect, useState } from "react";
import axios from "../../axios";
import PackageCard from "./PackageCard";
import type { Package } from "../types";

const PackageList = () => {
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get<Package[]>("/paquetes"); // ✅ Tipado explícito
        setPackages(res.data); // ✅ Ya no es 'unknown'
      } catch (error) {
        console.error("Error al traer paquetes:", error);
      }
    };
    fetchPackages();
  }, []);

  const publishedPackages = packages.filter(pkg => pkg.publicado); // ✅ Asegurate que el campo se llame así en el tipo

  return (
    <div>
      <h2>Paquetes disponibles</h2>
      <div className="grid grid-3">
        {publishedPackages.map(pkg => (
          <PackageCard key={pkg.id} item={pkg} />
        ))}
      </div>
    </div>
  );
};

export default PackageList;