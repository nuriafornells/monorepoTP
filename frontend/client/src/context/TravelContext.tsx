// src/context/TravelContext.tsx
import { createContext } from "react";
import type { Package } from "../types";

export type Reservation = {
  id: number;
  packageId: number;
  name: string;
  email: string;
  date: string;
};

export type TravelContextType = {
  packages: Package[];
  setPackages: React.Dispatch<React.SetStateAction<Package[]>>;
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
};

// Solo exportamos el contexto, sin componentes
export const TravelContext = createContext<TravelContextType | undefined>(undefined);