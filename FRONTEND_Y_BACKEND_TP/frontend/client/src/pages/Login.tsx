// src/pages/Login.tsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";
import { useAuth } from "../hooks/useAuth";

type Role = "admin" | "user";

interface LoginResponse {
  token: string;
  role: Role;
  id: number; 
}

function isAxiosErrorManual(error: unknown): error is {
  response?: { data?: { error?: string } };
  message: string;
} {
  return typeof error === "object" && error !== null && "message" in error;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // usamos login del contexto
  const navigate = useNavigate();

  const getRedirectPath = (role: Role) =>
    role === "admin" ? "/admin/dashboard" : "/packages";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      const { token, role, id } = res.data;

      login(id, email, token, role); // ahora con el id incluido

      navigate(getRedirectPath(role));
    } catch (err: unknown) {
      console.error("❌ Error en login:", err);

      if (isAxiosErrorManual(err)) {
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
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Ingresar</button>
    </form>
  );
};

export default Login;