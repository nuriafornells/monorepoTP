// src/pages/Reservation.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../axios";
import { useTravel } from "../hooks/useTravel";
import type { Package } from "../types";

export default function Reservation() {
  // 1. Hooks siempre al inicio
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { packages } = useTravel();

  // 2. Estados declarados sin condiciones
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [passengers, setPassengers] = useState<number>(1);
  const [travelDate, setTravelDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // 3. Buscamos el paquete usando `id`
  const pkg: Package | undefined = packages?.find(
    (p) => p.id === Number(id)
  );

  // 4. Early return si no existe: aquí sí usamos `navigate`
  if (!pkg) {
    return (
      <div>
        <p>Paquete no encontrado ❌</p>
        <button className="btn" onClick={() => navigate("/packages")}>
          Volver
        </button>
      </div>
    );
  }

  // 5. Función de envío con guard interno para TS
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TS ve este guard antes de usar `pkg`
    if (!pkg) return;

    try {
      await axios.post("/reservas", {
        packageId: pkg.id,
        name: fullName,
        email,
        passengers,
        date: travelDate,
        notes,
      });

      alert("Reserva enviada correctamente ✅");
      setFullName("");
      setEmail("");
      setPassengers(1);
      setTravelDate("");
      setNotes("");
    } catch (error) {
      console.error("Error al enviar reserva:", error);
      alert("Hubo un problema al enviar la reserva ❌");
    }
  }

  // 6. Render final
  return (
    <div>
      <h2>Reservar: {pkg.nombre}</h2>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nombre completo"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          required
        />
        <input
          type="number"
          value={passengers}
          onChange={(e) => setPassengers(Number(e.target.value))}
          min={1}
          required
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
        <button type="submit">Enviar reserva</button>
      </form>
    </div>
  );
}