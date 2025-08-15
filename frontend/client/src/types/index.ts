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
  id?: number;
  packageId: number;
  fullName: string;
  email: string;
  phone?: string;
  passengers: number;
  travelDate: string; // ISO yyyy-mm-dd
  notes?: string;
};