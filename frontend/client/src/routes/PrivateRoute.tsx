import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PrivateRouteProps {
  requiredRole?: "admin" | "user";
}

const PrivateRoute = ({ requiredRole }: PrivateRouteProps) => {
  const { user, role, token, isLoading } = useAuth();

  if (isLoading) return <div>Cargando sesión...</div>; // ver dsp si spinner 

  if (!user || !token) return <Navigate to="/login" />; // 🔐 sesión inválida
  if (requiredRole && role !== requiredRole) return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default PrivateRoute;