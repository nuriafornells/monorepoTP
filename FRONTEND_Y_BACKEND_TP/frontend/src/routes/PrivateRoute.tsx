import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
// Componente de ruta privada que protege rutas según autenticación y rol
// Redirige a login si no está autenticado
// Redirige a página de no autorizado si el rol no coincide
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
  } //vuelve a login si no está autenticado

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  } // si el rol no coincide, va a no autorizado

  return <Outlet />;
};

export default PrivateRoute;