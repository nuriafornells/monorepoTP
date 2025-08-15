// src/layouts/MainLayout.tsx
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";

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
      <Navbar /> {/* ✅ Ahora el navbar sabe el rol */}
      <main className="container" style={{ paddingTop: 16 }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}