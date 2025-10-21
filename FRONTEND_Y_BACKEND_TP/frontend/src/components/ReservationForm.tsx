import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTravel } from "../hooks/useTravel";

const ReservationForm = () => {
  const { packages, reservations, setReservations } = useTravel();
  const auth = useContext(AuthContext); // 👈 ahora lo guardamos como 'auth'

  const [form, setForm] = useState({
    packageId: packages[0]?.id || 1,
    date: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!auth || !auth.user || !auth.token) {
      setError("Usuario no válido o no logueado");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          packageId: form.packageId,
          date: form.date,
          userId: auth.user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del backend:", errorData);
        setError(errorData.message || "Error en la reserva");
        return;
      }

      const created = await response.json();
      setReservations([...reservations, created]);
      setForm({ ...form, date: "" });
    } catch (err) {
      console.error("Error en la reserva:", err);
      setError("Error en la reserva");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reservar paquete</h2>

      <select
        value={form.packageId}
        onChange={(e) =>
          setForm({ ...form, packageId: Number(e.target.value) })
        }
      >
        {packages.map((pkg) => (
          <option key={pkg.id} value={pkg.id}>
            {pkg.nombre}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      <button type="submit">Reservar</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default ReservationForm;