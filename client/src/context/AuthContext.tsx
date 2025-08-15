/* eslint-disable react-refresh/only-export-components */

import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type Role = "admin" | "user" | null;

export interface AuthContextType {
  user: string | null;
  role: Role;
  login: (email: string) => void;
  logout: () => void;
  isLoading: boolean; // 🆕

}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);

  // 🧠 Leer usuario guardado al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    if (storedUser) setUser(storedUser);
    if (storedRole === "admin" || storedRole === "user") setRole(storedRole as Role);
    setIsLoading(false); // ✅ Fin de carga

  }, []);

  // 🔐 Login: guardar en estado y localStorage
  const login = (email: string) => {
    setUser(email);
    const assignedRole: Role = email === "admin@admin.com" ? "admin" : "user";
    setRole(assignedRole);
    localStorage.setItem("user", email);
    localStorage.setItem("role", assignedRole);
  };

  // 🚪 Logout: limpiar todo
  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};