import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType, AuthUser } from "./AuthContext";
import type { ReactNode } from "react";
import api from "../api"; 
// Proveedor de contexto de autenticación que maneja el estado del usuario, rol y token
//sirve para envolver la aplicación y proporcionar el contexto a los componentes hijos
type Role = AuthContextType["role"];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");

  async function validarSesion() {
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);

    try {
      const res = await api.get<{ user: AuthUser }>("/auth/me");
      setUser(res.data.user);
      if (storedRole === "admin" || storedRole === "user") {
        setRole(storedRole as Role);
      }
    } catch (err) {
      console.error("Token inválido:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      setUser(null);
      setRole(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }

  validarSesion();
}, []);

  const login = (id: number, email: string, token: string, role: Role) => {
    const userData: AuthUser = { id, email };
    setUser(userData);
    setToken(token);
    setRole(role);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    localStorage.setItem("role", role ?? "");
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        login,
        logout,
        isLoading,
        setToken,
        setRole,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};