import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./AuthContext";
import type { ReactNode } from "react";

type Role = AuthContextType["role"];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [token, setToken] = useState<string | null>(null); // ✅ agregado
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

  const login = (email: string) => {
     const storedToken = localStorage.getItem("token");
     const storedRole = localStorage.getItem("role");

     setUser(email);
     localStorage.setItem("user", email); // ✅ persistencia real

     if (storedRole === "admin" || storedRole === "user") setRole(storedRole as Role);
     if (storedToken) setToken(storedToken);
    };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null); // ✅ limpiar token
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