export interface Reservation {
  id: number;
  fechaReserva?: string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  cantidadPersonas: number;
  status: string; // 'pendiente', 'aceptada', 'rechazada'
  paquete: Paquete;
  user: { id: number; email: string };
}

export interface Paquete {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  duracion: number;
  publicado: boolean;
  destino?: { id: number; nombre: string } | null;
  hotel: Hotel;
  fotoURL?: string;
}

export type Destino = {
  id: number;
  nombre: string;
};

export type Hotel = {
  id: number;
  nombre: string;
  ubicacion: string;
  destino?: Destino | null;
};

export type User = {
  id: number;
  name?: string | null;
  email: string;
  role: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};
