// src/App.tsx

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import TravelProvider from "./context/TravelProvider";
import MainLayout from "./layouts/MainLayout";
import PrivateRoute from "./routes/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
// import AdminLogin from "./pages/AdminLogin"; // eliminado
import Packages from "./pages/Packages";
import PackageDetail from "./pages/PackageDetail";
import Reservation from "./pages/Reservation";
import AdminDashboard from "./pages/AdminDashboard";
import EditPackage from "./pages/EditPackage";
import Unauthorized from "./pages/Unauthorized";
import "react-datepicker/dist/react-datepicker.css";
import AdminReservations from "./pages/AdminReservations";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  // { path: "/admin", element: <AdminLogin /> }, // eliminado: usar Login real
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        element: <PrivateRoute />,
        children: [
          { path: "packages", element: <Packages /> },
          { path: "packages/:id", element: <PackageDetail /> },
          { path: "reserve/:id", element: <Reservation /> },
        ],
      },
      {
        path: "admin/dashboard",
        element: <PrivateRoute requiredRole="admin" />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "editar/:id", element: <EditPackage mode="edit" /> },
          { path: "crear", element: <EditPackage mode="create" /> },
          { path: "reservas", element: <AdminReservations /> },
        ],
      },
      { path: "unauthorized", element: <Unauthorized /> },
    ],
  },
]);

export default function App() {
  return (
    <TravelProvider>
      <RouterProvider router={router} />
    </TravelProvider>
  );
}