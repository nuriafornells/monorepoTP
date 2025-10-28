// src/context/TravelContext.tsx
import { createContext } from "react";
import type { Paquete } from "../types";

export type Reservation = {
  id: number;
  date: string;
  status: string;
  user: {
    id: number;
    email: string;
  };
  paquete: {
    id: number;
    nombre: string;
  };
};

export type TravelContextType = {
  packages: Paquete[];
  setPackages: React.Dispatch<React.SetStateAction<Paquete[]>>;
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
};

// solo exportamos el contexto, sin componentes
export const TravelContext = createContext<TravelContextType | undefined>(undefined);
import { useContext } from 'react';

export const useTravel = (): TravelContextType => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel debe usarse dentro de TravelProvider');
  }
  return context;
};