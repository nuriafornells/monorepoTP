// src/components/ReservationForm.tsx
import { useState } from "react";
import { useTravel } from "../hooks/useTravel";

const ReservationForm = () => {
  const { reservations, setReservations, packages } = useTravel();
  const [form, setForm] = useState({
    packageId: packages[0]?.id || 1,
    name: "",
    email: "",
    date: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReservation = {
      id: reservations.length + 1,
      ...form,
    };
    setReservations([...reservations, newReservation]);
    setForm({ ...form, name: "", email: "", date: "" });
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
            {pkg.title}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Nombre"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="date"
        value={form.date}
        onChange={e => setForm({ ...form, date: e.target.value })}
      />
      <button type="submit">Reservar</button>
    </form>
  );
};

export default ReservationForm;