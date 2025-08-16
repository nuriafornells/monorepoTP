import { useNavigate } from 'react-router-dom';
import { useState, useContext } from "react";
import api from "../api"; // Cliente axios configurado
import axios from "axios"; // Para detectar errores HTTP
import { AuthContext } from "../context/AuthContext"; // 👈 nuevo

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = useContext(AuthContext); // 👈 nuevo

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });

      // 🔍 Logs para debugging
      console.log("✅ Login exitoso:", res);
      console.log("📦 res.data:", res.data);

      const { token, role } = res.data;

      // Guardar en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", email);

      // Actualizar contexto 👇
      auth?.setToken(token);
      auth?.setRole(role);
      auth?.setUser(email);

      // Redirigir según rol
      const isAdmin = role === "admin";
      console.log("🔁 Redirigiendo a:", isAdmin ? "/admin/dashboard" : "/packages");
      navigate(isAdmin ? "/admin/dashboard" : "/packages");
    } catch (err: unknown) {
      // 🔍 Log completo del error
      console.error("❌ Error en login:", err);

      if (axios.isAxiosError(err)) {
        alert("Error: " + (err.response?.data?.error || err.message));
      } else {
        alert("Error inesperado al iniciar sesión");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>🔐 Iniciar sesión</h2>
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Ingresar</button>
    </form>
  );
};

export default Login;