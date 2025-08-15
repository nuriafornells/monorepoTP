// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer style={{ marginTop: 40, padding: "1rem 0", borderTop: "1px solid #e5e7eb" }}>
      <div className="container" style={{ color: "var(--muted)", fontSize: 14 }}>
        © {new Date().getFullYear()} Viajes Nuri — Todos los derechos reservados.
      </div>
    </footer>
  );
}