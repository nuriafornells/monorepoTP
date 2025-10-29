// src/pages/CreateClient.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function CreateClient() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/auth/register", { email, password });
      alert("✅ Usuario creado con éxito. Ahora podés iniciar sesión.");
      navigate("/login");
    } catch (err: unknown) {
      console.error("❌ Error en registro:", err);
      alert("No se pudo crear el usuario. Verifica si el email ya existe.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card"
      style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}
    >
      <h2>📝 Crear cuenta</h2>

      <label>Email</label>
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label style={{ marginTop: 12 }}>Contraseña</label>
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="btn"
        style={{ marginTop: 16 }}
        disabled={loading}
      >
        {loading ? "Creando..." : "Registrarse"}
      </button>

      <p style={{ marginTop: 12, fontSize: 14 }}>
        ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </form>
  );
}