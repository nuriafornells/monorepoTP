// src/App.tsx
import PrivateRoute from './routes/PrivateRoute';
import Login from './pages/Login';
import TravelProvider from "./context/TravelProvider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Packages from "./pages/Packages";
import PackageDetail from "./pages/PackageDetail";
import Reservation from "./pages/Reservation";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider } from './context/AuthProvider';


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },

      // ✅ Ruta pública
      { path: "login", element: <Login /> },

      // 🔐 Rutas protegidas
      {
        element: <PrivateRoute />,
        children: [
          { path: "packages", element: <Packages /> },
          { path: "packages/:slug", element: <PackageDetail /> },
          { path: "reserve/:slug", element: <Reservation /> }
        ]
      },

      { path: "admin", element: <AdminLogin /> },
      { path: "admin/dashboard", element: <AdminDashboard /> }
    ]
  }
]);

export default function App() {
  return (
    <AuthProvider>
      <TravelProvider>
        <RouterProvider router={router} />
      </TravelProvider>
    </AuthProvider>
  );

}