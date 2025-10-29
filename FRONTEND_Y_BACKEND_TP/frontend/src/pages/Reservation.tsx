// src/pages/Reservation.tsx
import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useTravel } from '../hooks/useTravel';
import { AuthContext } from '../context/AuthContext';
import type { Paquete } from '../types';

export default function Reservation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { packages } = useTravel();
  const { user } = useContext(AuthContext)!;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [notes, setNotes] = useState('');

  const pkg: Paquete | undefined = packages?.find(p => p.id === Number(id));
  if (!pkg) return (
    <div className="page-container" style={{ textAlign: "center" }}>
      <p>Paquete no encontrado ❌</p>
      <button className="btn" onClick={() => navigate('/packages')}>Volver</button>
    </div>
  );

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
      await api.post('/reservations', payload);
      alert('Reserva enviada correctamente ✅');
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
    <div className="page-container" style={{ maxWidth: 500, margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Reservar: {pkg.nombre}</h2>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nombre completo" required />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo electrónico" required />
        <input type="number" value={passengers} onChange={e => setPassengers(Number(e.target.value))} min={1} />
        <input type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} required />
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notas adicionales" />
        <button type="submit" className="btn">Enviar reserva</button>
      </form>
    </div>
  );
}
