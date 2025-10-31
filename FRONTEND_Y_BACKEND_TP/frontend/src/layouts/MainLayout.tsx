// src/layouts/MainLayout.tsx
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
// Layout principal que incluye la barra de navegación y el pie de página
// Muestra un indicador de carga mientras se valida la sesión del usuario
// Utiliza el contexto de autenticación para determinar el estado de carga
//si no está cargando, renderiza el navbar, el outlet para las rutas hijas y el footer
 
export default function MainLayout() {
  const auth = useContext(AuthContext);
  if (!auth) return null;

  const { isLoading } = auth;

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Cargando sesión...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar /> {/*el navbar sabe el rol */}
      <main className="container" style={{ paddingTop: 16 }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}