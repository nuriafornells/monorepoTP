// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: 16 }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}