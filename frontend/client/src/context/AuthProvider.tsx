import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./AuthContext";
import type { ReactNode } from "react";

type Role = AuthContextType["role"];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");

    if (storedUser) setUser(storedUser);
    if (storedRole === "admin" || storedRole === "user") setRole(storedRole as Role);
    if (storedToken) setToken(storedToken);

    setIsLoading(false);
  }, []);

  // ✅ Versión corregida: guarda token y rol como string
  const login = (email: string, token: string, role: Role) => {
    setUser(email);
    setToken(token);
    setRole(role);

    localStorage.setItem("user", email);
    localStorage.setItem("token", token);
    localStorage.setItem("role", role ?? ""); // ✅ evita error de tipo
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
        login, // ✅ ahora con tres argumentos
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