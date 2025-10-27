import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios";
import type { Paquete, Destino, Hotel } from "../types";

type Props = {
  mode?: "edit" | "create";
};

type FormState = {
  id?: number;
  nombre: string;
  destinoId: number | "";
  hotelId: number | "";
  precio: number | "";
  duracion: number | "";
  publicado?: boolean;
  fotoURL?: string;
};

export default function EditPackage({ mode = "edit" }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState | null>(null);
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [hoteles, setHoteles] = useState<Hotel[]>([]);;

  // Cargar destinos al montar
  useEffect(() => {
    axios.get<{ destinos: Destino[] }>("/destinos").then((res) => {
      setDestinos(res.data.destinos);
    });
  }, []);

  // Cargar todos los hoteles
  useEffect(() => {
    axios
      .get<{ hoteles: Hotel[] }>('/hoteles')
      .then((res) => {
        setHoteles(res.data.hoteles);
      });
  }, []);

  // Cargar paquete si estamos en modo edición
  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchPackage = async () => {
        try {
          const res = await axios.get<{ paquete: Paquete }>(`/paquetes/${id}`);
          const p = res.data.paquete;
          setForm({
            id: p.id,
            nombre: p.nombre,
            destinoId: p.destino?.id ?? "",
            hotelId: p.hotel?.id ?? "",
            precio: p.precio,
            duracion: p.duracion,
            publicado: p.publicado,
            fotoURL: p.fotoURL ?? "",
          });
        } catch (error) {
          console.error("Error al traer paquete:", error);
        }
      };
      fetchPackage();
    } else if (mode === "create") {
      setForm({
        nombre: "",
        destinoId: "",
        hotelId: "",
        precio: "",
        duracion: "",
        publicado: false,
        fotoURL: "",
      });
    }
  }, [id, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!form) return;
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        name === "precio" || name === "duracion"
          ? value === "" ? "" : Number(value)
          : name === "hotelId" || name === "destinoId"
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
          destinoId: form!.destinoId,
          hotelId: form!.hotelId,
          precio: form!.precio,
          duracion: form!.duracion,
          fotoURL: form!.fotoURL,
        });
      } else {
        await axios.post("/paquetes", {
          nombre: form!.nombre,
          destinoId: Number(form!.destinoId),
          hotelId: form!.hotelId,
          precio: Number(form!.precio),
          duracion: Number(form!.duracion),
          publicado: false,
          fotoURL: form!.fotoURL,
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
      <select
        name="destinoId"
        value={form.destinoId}
        onChange={handleChange}
        required
      >
        <option value="">Seleccionar destino…</option>
        {destinos.map((d) => (
          <option key={d.id} value={d.id}>
            {d.nombre}
          </option>
        ))}
      </select>

      <label>Hotel</label>
      <select
        name="hotelId"
        value={form.hotelId}
        onChange={handleChange}
        required
      >
        <option value="">Seleccionar hotel…</option>
        {hoteles.map((h) => (
          <option key={h.id} value={h.id}>
            {h.nombre} ({h.ubicacion})
          </option>
        ))}
      </select>

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

      <label>Foto (nombre del archivo)</label>
      <input
        name="fotoURL"
        type="text"
        value={form.fotoURL}
        onChange={handleChange}
        placeholder="ejemplo: italy.jpg"
      />
      <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '2px' }}>
        Ingresa solo el nombre del archivo. Ejemplo: italy.jpg, paris.png, etc.
      </small>

      {form.fotoURL && (
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <p>Vista previa:</p>
          <img 
            src={form.fotoURL.startsWith('http') ? form.fotoURL : `http://localhost:3001/images/${form.fotoURL}`}
            alt="Vista previa" 
            style={{ 
              width: '200px', 
              height: '120px', 
              objectFit: 'cover', 
              borderRadius: '4px' 
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            URL: {form.fotoURL.startsWith('http') ? form.fotoURL : `http://localhost:3001/images/${form.fotoURL}`}
          </p>
        </div>
      )}

      <button className="btn" type="submit">
        {mode === "edit" ? "Guardar cambios" : "Crear paquete"}
      </button>
    </form>
  );
}