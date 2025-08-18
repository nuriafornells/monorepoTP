import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // 👈 asegurate que el path sea correcto
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider> {/* 🛡️ envuelve todo el árbol */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);