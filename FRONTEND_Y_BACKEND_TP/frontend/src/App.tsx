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
import CreateDestino from "./pages/CreateDestino"; // ✅ nuevo
import CreateHotel from "./pages/CreateHotel";     // ✅ nuevo
import CreateClient from "./pages/CreateClient";
import UsersAdmin from "./pages/UsersAdmin";
import MyReservations from "./pages/MyReservations"; // ✅ nuevo
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import PaymentPending from "./pages/PaymentPending";
// Archivo principal de la aplicación que configura las rutas
// Utiliza un enrutador de navegador con rutas públicas y privadas
// Las rutas privadas están protegidas por el componente PrivateRoute 

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "signup", element: <CreateClient /> }, //  registro de cliente
      {
        element: <PrivateRoute />,
        children: [
          { path: "packages", element: <Packages /> },
          { path: "packages/:id", element: <PackageDetail /> },
          { path: "reserve/:id", element: <Reservation /> },
          { path: "mis-reservas", element: <MyReservations /> }, //  ahora acá
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
          { path: "create-destino", element: <CreateDestino /> },
          { path: "create-hotel", element: <CreateHotel /> },
          { path: "users", element: <UsersAdmin /> },
        ],
      },
      { path: "unauthorized", element: <Unauthorized /> },
      { path: "payment/success", element: <PaymentSuccess /> },
      { path: "payment/failure", element: <PaymentFailure /> },
      { path: "payment/pending", element: <PaymentPending /> },
    ],
  },
]); 

export default function App() {
  return (
    <TravelProvider>
      <RouterProvider router={router} />
    </TravelProvider>
  ); // TravelProvider envuelve la app para contexto global. esto permite compartir datos de viajes
}