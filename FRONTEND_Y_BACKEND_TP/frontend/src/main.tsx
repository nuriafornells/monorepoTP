// src/main.tsx
// Punto de entrada principal de la aplicación React
// Renderiza el componente App dentro del AuthProvider para manejar la autenticación globalmente
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from './context/AuthProvider'; 
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider> {/* envuelve todo el árbol */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);