// src/hooks/useReservations.ts
import { useEffect, useState } from 'react';
import type { Reservation } from '../types';
import axios from '../axios';

export function useReservations(token: string | null) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchReservations = async () => {
      try {
        const res = await axios.get<{ reservas?: Reservation[] } | Reservation[]>('/reservations');
        const payload = res.data;
        const lista = Array.isArray(payload) ? payload : payload.reservas ?? [];
        setReservations(lista);
      } catch (err) {
        console.error('Error al obtener reservas', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [token]);

  return { reservations, loading };
}