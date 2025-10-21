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
