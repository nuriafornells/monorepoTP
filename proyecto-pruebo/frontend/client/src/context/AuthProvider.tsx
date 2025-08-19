import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType, AuthUser } from "./AuthContext";
import type { ReactNode } from "react";

type Role = AuthContextType["role"];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    setIsLoading(false);
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