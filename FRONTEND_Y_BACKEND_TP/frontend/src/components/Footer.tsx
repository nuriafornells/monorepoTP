import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();

  //Ocultar footer en rutas específicas
  const hiddenRoutes = ["/login", "/admin"];
  if (hiddenRoutes.includes(location.pathname)) return null;

  return (
    <footer style={{ marginTop: 40, padding: "1rem 0", borderTop: "1px solid #e5e7eb" }}>
      <div className="container" style={{ color: "var(--muted)", fontSize: 14 }}>
        © {new Date().getFullYear()} Viajes.
      </div>
    </footer>
  );
}
