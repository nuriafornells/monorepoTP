// src/pages/Reservation.tsx
import { useParams } from "react-router-dom";
import { useState } from "react";
import { PACKAGES } from "../data/packages";

export default function Reservation() {
  const { slug } = useParams();
  const pkg = PACKAGES.find(p => p.slug === slug && p.published);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [travelDate, setTravelDate] = useState("");
  const [notes, setNotes] = useState("");

  if (!pkg) return <p>Paquete no disponible.</p>;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert(`Reserva enviada:
- Paquete: ${pkg!.title}
- Nombre: ${fullName}
- Email: ${email}
- Pasajeros: ${passengers}
- Fecha: ${travelDate}
- Notas: ${notes || "-"}
(Esto es un mock. Luego lo enviaremos al backend.)`);
    setFullName(""); setEmail(""); setPassengers(1); setTravelDate(""); setNotes("");
  }

  return (
    <>
      <h1>Reservar: {pkg.title}</h1>
      <form onSubmit={onSubmit} className="card" style={{ padding: 16 }}>
        <label>Nombre completo</label>
        <input required value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} />

        <label style={{ marginTop: 10 }}>Email</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />

        <label style={{ marginTop: 10 }}>Pasajeros</label>
        <input type="number" min={1} required value={passengers} onChange={e => setPassengers(Number(e.target.value))} style={inputStyle} />

        <label style={{ marginTop: 10 }}>Fecha de viaje</label>
        <input type="date" required value={travelDate} onChange={e => setTravelDate(e.target.value)} style={inputStyle} />

        <label style={{ marginTop: 10 }}>Notas</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} style={{ ...inputStyle, height: 100 }} />

        <button className="btn" type="submit" style={{ marginTop: 12 }}>Enviar reserva</button>
      </form>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "1px solid #e5e7eb"
};