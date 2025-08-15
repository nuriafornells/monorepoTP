import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PrivateRouteProps {
  requiredRole?: "admin" | "user";
}

const PrivateRoute = ({ requiredRole }: PrivateRouteProps) => {
  const { user, role, isLoading } = useAuth();

  if (isLoading) return null; // ⏳ o un spinner si querés

  if (!user) return <Navigate to="/login" />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default PrivateRoute;