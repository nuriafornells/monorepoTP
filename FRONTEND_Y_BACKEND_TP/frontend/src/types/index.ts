// src/types/index.ts
export type Package = {
  id: number;
  title: string;
  slug: string; // para la URL
  destination: string;
  description: string;
  priceUSD: number;
  days: number;
  nights: number;
  published: boolean;
  imageUrl: string;
};

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
