import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PrivateRouteProps {
  requiredRole?: "admin" | "user";
}

const PrivateRoute = ({ requiredRole }: PrivateRouteProps) => {
  const { user, role, token, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Cargando sesión...</div>; // ver de poner spinner

  // Evita redirección infinita si ya estás en login que pasaba antes
  if ((!user || !token) && location.pathname !== "/login") {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default PrivateRoute;