import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PrivateRouteProps {
  requiredRole?: "admin" | "user";
}

const PrivateRoute = ({ requiredRole }: PrivateRouteProps) => {
  const { user, role, token, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Cargando sesión...</div>; // spinner opcional
  }

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;