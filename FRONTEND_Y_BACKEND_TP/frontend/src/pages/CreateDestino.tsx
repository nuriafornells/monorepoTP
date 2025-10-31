// src/pages/CreateDestino.tsx
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
// Página para crear un nuevo destino turístico enviando los datos al backend


export default function CreateDestino() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/destinos", { nombre });
      alert("Destino creado con éxito");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Error al crear destino:", err);
      alert("No se pudo crear el destino");
    } 
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Crear nuevo destino</h2>
      <label>Nombre del destino</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <button className="btn" type="submit">Crear destino</button>
    </form>
  );
} 