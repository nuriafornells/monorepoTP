import { useEffect, useState } from "react";
import type { Reservation } from "../types/index";

export function useReservations(token: string | null) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchReservations = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/reservations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = (await res.json()) as Reservation[]; // 👈 forzamos el tipo correcto
        setReservations(data);
      } catch (err) {
        console.error("Error al obtener reservas", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [token]);

  return { reservations, loading };
}