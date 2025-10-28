// src/context/AuthContext.tsx
import { createContext, useContext } from 'react';

export type Role = 'admin' | 'user' | null;

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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return ctx;
}