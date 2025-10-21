import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api"; // tu instancia de axios
import type { Package } from "../types";

export default function PackageDetail() {
  const { id } = useParams();
  const [paquete, setPaquete] = useState<Package | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get<{ paquete: Package }>(`/paquetes/${id}`);
        setPaquete(res.data.paquete);
      } catch (err) {
        console.error("Error al obtener detalle:", err);
        setError("No se pudo cargar el paquete");
      }
    };
    fetchDetail();
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!paquete) return <p>Cargando...</p>;

  return (
    <div className="card">
      <h2>{paquete.nombre}</h2>
      <p><strong>Destino:</strong> {paquete.destino}</p>
      <p><strong>Duración:</strong> {paquete.duracion} días</p>
      <p><strong>Precio:</strong> USD {paquete.precio}</p>
      <p><strong>Publicado:</strong> {paquete.publicado ? "Sí" : "No"}</p>
    </div>
  );
}