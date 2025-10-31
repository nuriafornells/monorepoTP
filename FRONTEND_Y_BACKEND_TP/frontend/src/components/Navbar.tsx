// src/components/Navbar.tsx
// Barra de navegación que adapta sus enlaces según el rol del usuario (invitado, usuario, admin)
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, role, token, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) return null;

  // Ocultar navbar 
  const hiddenRoutes = ["/login", "/admin"];
  if (hiddenRoutes.includes(location.pathname)) return null;

 
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <Link to="/" className="navbar-logo">
          VIAJES EXPRESS
        </Link>

        <div className="navbar-links">
          {(role === "user" || role === "admin") && (
            <NavLink to="/packages">Paquetes</NavLink>
          )}

          {role === "admin" && (
            <>
              <NavLink to="/admin/dashboard">Administrador de paquetes</NavLink>
              <NavLink to="/admin/dashboard/reservas">Reservas</NavLink>
              <NavLink to="/admin/dashboard/users">Usuarios</NavLink>
            </>
          )} 
          

          {role === "user" && <NavLink to="/mis-reservas">Mis reservas</NavLink>}

          {user && token ? (
            <>
              <span className="navbar-user">
                <strong>{user.email}</strong> <em>({role})</em>
              </span>
              <button className="btn danger" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Iniciar Sesión</NavLink>
              <NavLink to="/signup">Registrarse</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
