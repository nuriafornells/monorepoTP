// src/api.ts
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor de request → agrega token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers = config.headers ?? {};
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de response → maneja errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      toast.error("Sesión expirada. Inicia sesión nuevamente.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      // 👇 NO redirigimos acá, dejamos que PrivateRoute lo maneje
    }

    if (status === 500) {
      toast.error("Error del servidor. Intentalo más tarde.");
    }

    return Promise.reject(error);
  }
);

export default api;