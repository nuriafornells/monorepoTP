/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";

export type Role = "admin" | "user" | null;

export interface AuthUser {
  id: number;
  email: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  role: Role;
  token: string | null;
  isLoading: boolean;
  login: (id: number, email: string, token: string, role: Role) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  setRole: (role: Role) => void;
  setToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [token, setToken] = useState<string | null>(null);

  const loadAuthFromStorage = () => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        console.warn("No se pudo parsear el usuario");
      }
    }

    if (storedRole === "admin" || storedRole === "user") {
      setRole(storedRole as Role);
    }

    if (storedToken) {
      setToken(storedToken);
    }
  };

  useEffect(() => {
    loadAuthFromStorage();
    setIsLoading(false);
  }, []);

  const login = (id: number, email: string, token: string, role: Role) => {
    const userData = { id, email };
    setUser(userData);
    setToken(token);
    setRole(role);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    localStorage.setItem("role", role as string);
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

// 👇 Hook para consumir el contexto en cualquier componente
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return ctx;
}