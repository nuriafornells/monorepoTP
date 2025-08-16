import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: "http://localhost:3001/api" 
});

// 🛡️ Interceptor de request: agrega token automáticamente
instance.interceptors.request.use(config => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

// 🚨 Interceptor de response: manejo global de errores con toast
instance.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      toast.error("Sesión expirada. Iniciá sesión nuevamente.");
      localStorage.removeItem("token");
      setTimeout(() => {
        window.location.href = "/login"; // adaptá si tu ruta de login es otra
      }, 3000); // espera a que el toast se muestre
    }

    if (status === 500) {
      toast.error("Error del servidor. Intentalo más tarde.");
    }

    return Promise.reject(error);
  }
);

export default instance;