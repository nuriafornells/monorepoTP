import { createContext } from "react";


export type TravelDataType = {
  id: number;
  destination: string;
  price: number;
};

export type TravelContextType = {
  packages: Package[];
  setPackages: React.Dispatch<React.SetStateAction<Package[]>>;
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
};

export type Package = {
  id: number;
  title: string;
  description: string;
  priceUSD: number;
  imageUrl: string;
  published: boolean;
};

export type Reservation = {
  id: number;
  packageId: number;
  name: string;
  email: string;
  date: string;
};
export const TravelContext = createContext<TravelContextType | undefined>(undefined);