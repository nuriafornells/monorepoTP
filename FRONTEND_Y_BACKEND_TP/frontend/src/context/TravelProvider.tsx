import React, { useState, useEffect } from "react";
import { TravelContext } from "./TravelContext";
import type { Paquete } from "../types";
import type { Reservation as ReservationType } from "./TravelContext";
import api from "../api";

type PaquetesResponse = { paquetes: Paquete[] };
type ReservasResponse = { reservas: ReservationType[] };

/** Type guard sin usar any */
function isAxiosLikeError(
  value: unknown
): value is { isAxiosError?: true; response?: { status?: number } } {
  if (typeof value !== "object" || value === null) return false;
  if (!("isAxiosError" in value)) return false;
  const maybe = value as { isAxiosError?: unknown };
  return maybe.isAxiosError === true;
}

const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<Paquete[]>([]);
  const [reservations, setReservations] = useState<ReservationType[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // ✅ ruta correcta: /paquetes/published
        const res = await api.get<PaquetesResponse>("/paquetes/published");
        setPackages(res.data.paquetes ?? []);
      } catch (err) {
        console.error("Error al traer paquetes publicados:", err);
      }
    };

    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setReservations([]);
          return;
        }

        const res = await api.get<ReservasResponse>("/reservations");
        setReservations(res.data.reservas ?? []);
      } catch (err: unknown) {
        if (isAxiosLikeError(err) && err.response?.status === 401) {
          console.warn("No autorizado para obtener reservas. Se requiere login.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("role");
          setReservations([]);
          return;
        }
        console.error("Error al traer reservas:", err);
      }
    };

    fetchPackages();
    fetchReservations();
  }, []);

  return (
    <TravelContext.Provider
      value={{ packages, setPackages, reservations, setReservations }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export default TravelProvider;