// src/pages/AdminLogin.tsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 🔐 Simulación de login real
     if (user === "admin@viajes.com" && pass === "admin123") {
      const token = "admin-token-123";
      const role = "admin";

      localStorage.setItem("role", role);
      localStorage.setItem("token", token);

      login(user, token, role); // ✅ ahora con los tres argumentos
      navigate("/admin/dashboard");
  }   else {
       alert("Credenciales incorrectas");
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h1>Admin: Iniciar sesión</h1>
      <form onSubmit={onSubmit} className="card" style={{ padding: 16 }}>
        <label>Usuario</label>
        <input
          value={user}
          onChange={e => setUser(e.target.value)}
          style={inputStyle}
        />
        <label style={{ marginTop: 10 }}>Contraseña</label>
        <input
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          style={inputStyle}
        />
        <button className="btn" type="submit" style={{ marginTop: 12 }}>
          Entrar
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "1px solid #e5e7eb"
};