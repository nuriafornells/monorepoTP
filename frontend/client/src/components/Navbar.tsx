import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, role, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return null;

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
          {role === "user" && <NavLink to="/packages">Paquetes</NavLink>}
          {role === "admin" && <NavLink to="/admin">Admin</NavLink>}

          {user ? (
            <>
              <span style={{ fontSize: 14 }}>👤 {user} ({role})</span>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <NavLink to="/login">🔐 Login</NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}