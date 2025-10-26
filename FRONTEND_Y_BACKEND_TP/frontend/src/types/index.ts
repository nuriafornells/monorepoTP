export interface Reservation {
  id: number;
  fechaReserva: string;
  cantidadPersonas: number;
  status: string;
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
  hotel: {
    id: number;
    nombre: string;
    ubicacion: string;
    categoria: string;
    destino: { id: number; nombre: string };
  };
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
  categoria?: string;
  destino: Destino;
};