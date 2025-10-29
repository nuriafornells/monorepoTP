// src/pages/Reservation.tsx
import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axios';
import { useTravel } from '../hooks/useTravel';
import { AuthContext } from '../context/AuthContext';
import type { Paquete } from '../types';

export default function Reservation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { packages } = useTravel();
  const { user } = useContext(AuthContext)!;

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [passengers, setPassengers] = useState<number>(1);
  const [travelDate, setTravelDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const pkg: Paquete | undefined = packages?.find((p) => p.id === Number(id));

  if (!pkg) {
    return (
      <div>
        <p>Paquete no encontrado ❌</p>
        <button className="btn" onClick={() => navigate('/packages')}>Volver</button>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pkg || !user?.id || !travelDate) {
      alert('Faltan datos para enviar la reserva ❌');
      return;
    }

    const payload = {
      packageId: pkg.id,
      date: travelDate,
      userId: user.id,
      cantidadPersonas: passengers,
      notas: notes || null,
    };

    try {
      await axios.post('/reservations', payload);
      alert('Reserva enviada correctamente ✅ En espera nuestra confirmación.');
      setFullName('');
      setEmail('');
      setPassengers(1);
      setTravelDate('');
      setNotes('');
      navigate('/packages');
    } catch (error) {
      console.error('Error al enviar reserva:', error);
      alert('Hubo un problema al enviar la reserva ❌');
    }
  }

  return (
    <div>
      <h2>Reservar: {pkg.nombre}</h2>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nombre completo"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
        />
        <input
          type="number"
          value={passengers}
          onChange={(e) => setPassengers(Number(e.target.value))}
          min={1}
        />
        <input
          type="date"
          value={travelDate}
          onChange={(e) => setTravelDate(e.target.value)}
          required
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas adicionales"
        />
        <button type="submit" className="btn">Enviar reserva</button>
      </form>
    </div>
  );
}