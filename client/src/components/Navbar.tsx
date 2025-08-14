// src/components/Navbar.tsx
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header style={{ background: "white", borderBottom: "1px solid #e5e7eb" }}>
      <nav className="container" style={{ display: "flex", alignItems: "center", gap: 16, height: 60 }}>
        <Link to="/" style={{ fontWeight: 800, color: "var(--primary)" }}>
          Viajes Nuri
        </Link>
        <div style={{ display: "flex", gap: 16, marginLeft: "auto" }}>
          <NavLink to="/packages">Paquetes</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </div>
      </nav>
    </header>
  );
}