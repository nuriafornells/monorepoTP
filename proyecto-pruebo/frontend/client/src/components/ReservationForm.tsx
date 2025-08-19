// src/components/ReservationForm.tsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTravel } from "../hooks/useTravel";

const ReservationForm = () => {
  const { packages, reservations, setReservations } = useTravel();
  const { user, token } = useContext(AuthContext)!; // el ! asume que no es null
  const [form, setForm] = useState({
    packageId: packages[0]?.id || 1,
    date: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          packageId: form.packageId,
          date: form.date,
          userId: user, // si user es el email, el backend debe aceptarlo
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del backend:", errorData);
        setError(errorData.message || "error en la reserva");
        return;
      }

      const created = await response.json();
      setReservations([...reservations, created]);
      setForm({ ...form, date: "" });
    } catch (err) {
      console.error("Error en la reserva:", err);
      setError("error en la reserva");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reservar paquete</h2>
      <select
        value={form.packageId}
        onChange={e => setForm({ ...form, packageId: Number(e.target.value) })}
      >
        {packages.map(pkg => (
          <option key={pkg.id} value={pkg.id}>
            {pkg.nombre}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={form.date}
        onChange={e => setForm({ ...form, date: e.target.value })}
      />
      <button type="submit">Reservar</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default ReservationForm;