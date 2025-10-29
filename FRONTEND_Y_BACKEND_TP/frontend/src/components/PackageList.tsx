import { useEffect, useState } from "react";
import api from "../api";
import PackageCard from "./PackageCard";
import type {Paquete} from "../types";

const PackageList = () => {
  const [packages, setPackages] = useState<Paquete[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        //Consumimos solo los publicados desde el backend
        const res = await api.get<{ paquetes: Paquete[] }>("/paquetes/publicos");
        setPackages(res.data.paquetes);
      } catch (error) {
        console.error("Error al traer paquetes publicados:", error);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div>
      <h2>Paquetes disponibles</h2>
      <div className="grid grid-3">
        {packages.map(pkg => (
          <PackageCard key={pkg.id} item={pkg} />
        ))}
      </div>
    </div>
  );
};

export default PackageList;