// src/components/Navbar.tsx
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, role, token, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) return null;

  // Ocultar navbar en login y admin login
  const hiddenRoutes = ["/login", "/admin"];
  if (hiddenRoutes.includes(location.pathname)) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header style={{ background: "white", borderBottom: "1px solid #e5e7eb" }}>
      <nav
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          height: 60,
        }}
      >
        <Link
          to="/"
          style={{ fontWeight: 800, color: "var(--primary)" }}
        >
          VIAJES EXPRESS
        </Link>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginLeft: "auto",
            alignItems: "center",
          }}
        >
          {(role === "user" || role === "admin") && (
            <NavLink to="/packages">PAQUETES</NavLink>
          )}

          {role === "admin" && (
            <>
              <NavLink to="/admin/dashboard">Administrador de paquetes</NavLink>
              <NavLink to="/admin/dashboard/reservas">Reservas</NavLink>
              <NavLink to="/admin/dashboard/users">Usuarios</NavLink> {/* ✅ NUEVO */}
            </>
          )}

          {role === "user" && (
              <NavLink to="/mis-reservas">Mis reservas</NavLink>
          )}

          {user && token ? (
            <>
              <span style={{ fontSize: 14, color: "#555" }}>
                <strong>{user.email}</strong> <em>({role})</em>
              </span>
              <button className="btn danger" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Iniciar Sesión</NavLink>
              <NavLink to="/signup" style={{ marginLeft: 12 }}>
                Registrarse
              </NavLink> {/* ✅ NUEVO */}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}