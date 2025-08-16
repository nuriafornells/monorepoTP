/* eslint-disable react-refresh/only-export-components */

import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type Role = "admin" | "user" | null;

export interface AuthContextType {
  user: string | null;
  role: Role;
  token: string | null;
  login: (email: string) => void;
  logout: () => void;
  isLoading: boolean;
  setToken: (token: string | null) => void;
  setRole: (role: Role) => void;
  setUser: (user: string | null) => void; // ✅ agregado para consistencia
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");

    if (storedUser) setUser(storedUser);
    if (storedRole === "admin" || storedRole === "user") setRole(storedRole as Role);
    if (storedToken) setToken(storedToken);

    setIsLoading(false);
  }, []);

  const login = (email: string) => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    setUser(email);
    if (storedRole === "admin" || storedRole === "user") setRole(storedRole as Role);
    if (storedToken) setToken(storedToken);
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
        setUser, // ✅ agregado
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};