import { createContext } from 'react';
import type { Paquete, Reservation as ReservationType } from '../types';

export type Reservation = ReservationType;

export type TravelContextType = {
  packages: Paquete[];
  setPackages: React.Dispatch<React.SetStateAction<Paquete[]>>;
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
};

export const TravelContext = createContext<TravelContextType | undefined>(undefined);