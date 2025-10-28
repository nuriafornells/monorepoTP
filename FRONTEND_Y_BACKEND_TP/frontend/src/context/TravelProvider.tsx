import React, { useState, useEffect } from 'react';
import { TravelContext } from './TravelContext';
import type { Paquete } from '../types';
import type { Reservation } from './TravelContext';
import axios from '../axios';

type PaquetesResponse = Paquete[] | { paquetes: Paquete[] };
type ReservasResponse = Reservation[] | { reservas: Reservation[] };

const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<Paquete[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get<PaquetesResponse>('/paquetes/publicos');
        const payload = res.data;
        const lista = Array.isArray(payload) ? payload : payload.paquetes ?? [];
        setPackages(lista);
      } catch (error) {
        console.error('Error al traer paquetes publicados :', error);
      }
    };

    const fetchReservations = async () => {
      try {
        const res = await axios.get<ReservasResponse>('/reservations');
        const payload = res.data;
        const lista = Array.isArray(payload) ? payload : payload.reservas ?? [];
        setReservations(lista);
      } catch (error) {
        console.error('Error al traer reservas: ', error);
      }
    };

    fetchPackages();
    fetchReservations();
  }, []);

  return (
    <TravelContext.Provider value={{ packages, setPackages, reservations, setReservations }}>
      {children}
    </TravelContext.Provider>
  );
};

export default TravelProvider;