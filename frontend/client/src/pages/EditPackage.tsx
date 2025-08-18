// src/pages/EditPackage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../axios";
import type { Package } from "../types";

type Props = {
  mode?: "edit" | "create";
};

// ✅ Tipo local que permite "" en campos numéricos
type FormState = {
  id?: number;
  nombre: string;
  destino: string;
  precio: number | "";
  duracion: number | "";
  publicado?: boolean;
};

export default function EditPackage({ mode = "edit" }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState | null>(null);

  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchPackage = async () => {
        try {
          const res = await axios.get<{ paquete: Package }>(`/paquetes/${id}`);
          setForm(res.data.paquete);
        } catch (error) {
          console.error("Error al traer paquete:", error);
        }
      };
      fetchPackage();
    } else if (mode === "create") {
      setForm({
        nombre: "",
        destino: "",
        precio: "",
        duracion: "",
        publicado: false,
      });
    }
  }, [id, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        name === "precio" || name === "duracion"
          ? value === "" ? "" : Number(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "edit") {
        await axios.put(`/paquetes/${form!.id}`, {
          nombre: form!.nombre,
          destino: form!.destino,
          precio: form!.precio,
          duracion: form!.duracion,
        });
      } else {
        await axios.post("/paquetes", {
          nombre: form!.nombre,
          destino: form!.destino,
          precio: Number(form!.precio),
          duracion: Number(form!.duracion),
          publicado: false,
        });
      }
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error al guardar paquete:", error);
    }
  };

  if (!form) return <p>Cargando formulario…</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="card"
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <h2>{mode === "edit" ? "Editar paquete" : "Crear nuevo paquete"}</h2>
      <label>Nombre</label>
      <input name="nombre" value={form.nombre} onChange={handleChange} required />
      <label>Destino</label>
      <input name="destino" value={form.destino} onChange={handleChange} required />
      <label>Duración (días)</label>
      <input
        name="duracion"
        type="number"
        value={form.duracion}
        onChange={handleChange}
        required
      />
      <label>Precio (USD)</label>
      <input
        name="precio"
        type="number"
        value={form.precio}
        onChange={handleChange}
        required
      />
      <button className="btn" type="submit">
        {mode === "edit" ? "Guardar cambios" : "Crear paquete"}
      </button>
    </form>
  );
}