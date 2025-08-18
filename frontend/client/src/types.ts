export type Package = {
  id: number;
  nombre: string;
  destino: string;
  precio: number;
  duracion: number;
  publicado: boolean; 
  imageUrl?: string;
  description?: string;
  slug?: string;
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