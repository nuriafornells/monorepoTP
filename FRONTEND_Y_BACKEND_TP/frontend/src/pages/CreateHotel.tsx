// src/pages/CreateHotel.tsx
import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import type { Destino } from "../types";

export default function CreateHotel() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [destinoId, setDestinoId] = useState<number | null>(null);
  const [destinos, setDestinos] = useState<Destino[]>([]);

  useEffect(() => {
    api.get<{ destinos: Destino[] }>("/destinos")
      .then((res) => setDestinos(res.data.destinos))
      .catch((err) => console.error("Error al cargar destinos:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/destinos/hoteles", { nombre, ubicacion, destinoId });
      alert("Hotel creado con éxito");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Error al crear hotel:", err);
      alert("No se pudo crear el hotel");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Crear nuevo hotel</h2>
      <label>Nombre del hotel</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />

      <label>Ubicación</label>
      <input value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} required />

      <label>Destino</label>
      <select value={destinoId ?? ""} onChange={(e) => setDestinoId(Number(e.target.value))} required>
        <option value="">Seleccionar destino…</option>
        {destinos.map((d) => (
          <option key={d.id} value={d.id}>{d.nombre}</option>
        ))}
      </select>

      <button className="btn" type="submit">Crear hotel</button>
    </form>
  );
}