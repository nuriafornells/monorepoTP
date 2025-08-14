import { useState, useEffect  } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./AuthContext";
import type { ReactNode } from "react";

type Role = AuthContextType["role"];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);
  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  const storedRole = localStorage.getItem("role");
  if (storedUser) setUser(storedUser);
  if (storedRole === "admin" || storedRole === "user") setRole(storedRole as Role);
}, []);

  const login = (email: string) => {
  setUser(email);
  const assignedRole = email.includes("admin") ? "admin" : "user";
  setRole(assignedRole);
  localStorage.setItem("user", email);
  localStorage.setItem("role", assignedRole);
};

  const logout = () => {
  setUser(null);
  setRole(null);
  localStorage.removeItem("user");
  localStorage.removeItem("role");
};
  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};