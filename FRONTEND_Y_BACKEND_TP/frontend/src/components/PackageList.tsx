import { useEffect, useState } from "react";
import api from "../api";
import PackageCard from "./PackageCard";
import type { Paquete } from "../types";

const PackageList = () => {
  const [packages, setPackages] = useState<Paquete[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Consumimos solo los publicados desde el backend
        const res = await api.get<{ paquetes: Paquete[] }>("/paquetes/publicos");
        setPackages(res.data.paquetes);
      } catch (error) {
        console.error("Error al traer paquetes publicados:", error);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="card">
      <h2>Paquetes disponibles</h2>
      {/*  usamos la clase global definida en index.css */}
      <div className="packages-grid">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} item={pkg} />
        ))}
        {packages.length === 0 && <p>No hay paquetes disponibles</p>}
      </div>
    </div>
  );
};
// Componente funcional de React que muestra una lista de paquetes turísticos disponibles
export default PackageList;