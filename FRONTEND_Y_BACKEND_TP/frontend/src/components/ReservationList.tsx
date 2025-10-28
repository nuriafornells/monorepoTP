import React, { useContext } from 'react';
import { TravelContext } from '../context/TravelContext';
import type { Reservation } from '../types';

// helper seguro para fechas
function formatMaybeDate(date?: string | null): string {
  if (!date) return '-';
  const d = new Date(date);
  return isNaN(d.getTime()) ? '-' : d.toLocaleDateString();
}

const ReservationList: React.FC = () => {
  const travelCtx = useContext(TravelContext);
  if (!travelCtx) return <p>Error de contexto</p>;
  const { reservations } = travelCtx;

  return (
    <div>
      <h2>Reservas</h2>
      {reservations.length === 0 ? (
        <p>No hay reservas registradas.</p>
      ) : (
        <ul>
          {reservations.map((r: Reservation) => {
            const destinoNombre = r.paquete?.hotel?.destino?.nombre ?? 'Destino no disponible';
            const hotelNombre = r.paquete?.hotel?.nombre ?? 'Hotel no disponible';
            const fechaReserva = formatMaybeDate((r as any).fechaReserva ?? (r as any).date ?? null);
            const fechaInicio = formatMaybeDate((r as any).fechaInicio ?? null);
            const fechaFin = formatMaybeDate((r as any).fechaFin ?? null);
            const fechaDisplay =
              fechaInicio !== '-' && fechaFin !== '-' ? `${fechaInicio} - ${fechaFin}` : fechaReserva;

            return (
              <li key={r.id}>
                <strong>{r.paquete.nombre}</strong> - {destinoNombre}
                <br />
                Hotel: {hotelNombre} ({r.paquete.hotel.ubicacion})
                <br />
                Fecha: {fechaDisplay}
                <br />
                Personas: {r.cantidadPersonas}
                <br />
                Estado: {(r as any).status ?? 'pendiente'}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ReservationList;