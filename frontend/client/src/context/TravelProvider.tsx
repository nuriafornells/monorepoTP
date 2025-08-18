// src/context/TravelProvider.tsx
import React, { useState, useEffect } from "react";
import { TravelContext } from "./TravelContext";
import type { Package } from "../types";
import type { Reservation } from "./TravelContext";
import axios from "../../axios";

const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get<{ paquetes: Package[] }>("/paquetes");
        if (Array.isArray(res.data.paquetes)) {
          setPackages(res.data.paquetes);
        } else {
          console.warn("Formato inesperado en paquetes:", res.data);
        }
      } catch (error) {
        console.error("Error al traer paquetes:", error);
      }
    };

    const fetchReservations = async () => {
      try {
        const res = await axios.get<{ reservas: Reservation[] }>("/reservas");
        if (Array.isArray(res.data.reservas)) {
          setReservations(res.data.reservas);
        } else {
          console.warn("Formato inesperado en reservas:", res.data);
        }
      } catch (error) {
        console.error("Error al traer reservas:", error);
      }
    };

    fetchPackages();
    fetchReservations();
  }, []);

  return (
    <TravelContext.Provider
      value={{
        packages,
        setPackages,
        reservations,
        setReservations,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export default TravelProvider;