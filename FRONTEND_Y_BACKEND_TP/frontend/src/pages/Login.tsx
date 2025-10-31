// src/pages/Login.tsx
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import api from "../api";
import { useAuth } from "../hooks/useAuth";
// Página de inicio de sesión para usuarios y administradores
// Permite iniciar sesión enviando credenciales al backend
// Redirige según el rol del usuario (admin o user) tras el login exitoso

type Role = "admin" | "user";

interface LoginResponse {
  token: string;
  role: Role;
  id: number;
} // Función de tipo para verificar errores de Axios

function isAxiosErrorManual(error: unknown): error is {
  response?: { data?: { error?: string } };
  message: string;
} {
  return typeof error === "object" && error !== null && "message" in error;
} 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate(); 
 
// Función para obtener la ruta de redirección según el rol
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

      login(id, email, token, role);
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
    <form
      onSubmit={handleSubmit}
      className="card"
      style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}
    >
      <h2>🔐 Iniciar sesión</h2>

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

      <button type="submit" className="btn" style={{ marginTop: 16 }}>
        Ingresar
      </button>

      <p style={{ marginTop: 12, fontSize: 14 }}>
        ¿No tenés cuenta? <Link to="/signup">Crear cuenta</Link>
      </p>
    </form>
  );
};

export default Login;