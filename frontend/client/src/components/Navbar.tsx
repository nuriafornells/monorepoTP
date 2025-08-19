// src/components/Navbar.tsx
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, role, token, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) return null;

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
        style={{ display: "flex", alignItems: "center", gap: 16, height: 60 }}
      >
        <Link to="/" style={{ fontWeight: 800, color: "var(--primary)" }}>
          Viajes Nuri
        </Link>

        <div style={{ display: "flex", gap: 16, marginLeft: "auto", alignItems: "center" }}>
          {(role === "user" || role === "admin") && (
            <NavLink to="/packages">Paquetes</NavLink>
          )}

          {role === "admin" && (
            <NavLink to="/admin/dashboard">Dashboard</NavLink>
          )}

          {user && token ? (
            <>
              <span style={{ fontSize: 14, color: "#555" }}>
                👤 <strong>{user.email}</strong> <em>({role})</em>
              </span>
              <button className="btn danger" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <NavLink to="/login">🔐 Login</NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}