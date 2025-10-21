// src/context/TravelContext.tsx
import { createContext } from "react";
import type { Package } from "../types";

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
  packages: Package[];
  setPackages: React.Dispatch<React.SetStateAction<Package[]>>;
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
};

// solo exportamos el contexto, sin componentes
export const TravelContext = createContext<TravelContextType | undefined>(undefined);