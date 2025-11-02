// src/pages/EditPackage.tsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import type { Paquete, Destino, Hotel } from "../types";
import ImageUpload, { type ImageUploadHandle } from "../components/ImageUpload";

type Props = { mode?: "edit" | "create" };

type FormState = {
  id?: number;
  nombre: string;
  descripcion?: string;
  destinoId: number | null;
  hotelId: number | null;
  precio: number | null;
  duracion: number | null;
  publicado?: boolean;
  fotoURL?: string;
};

export default function EditPackage({ mode = "edit" }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState | null>(null);
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [imageList, setImageList] = useState<string[]>([]);
  const [imageMode, setImageMode] = useState<"select" | "upload">("select");
  const [loadingImages, setLoadingImages] = useState(false);

  // ref al componente ImageUpload (exponer doUpload y hasPending)
  const uploadRef = useRef<ImageUploadHandle | null>(null);
  const [pendingNewImage, setPendingNewImage] = useState(false);

  // Cargar destinos
  useEffect(() => {
    api
      .get<{ destinos: Destino[] }>("/destinos")
      .then((res) => setDestinos(res.data.destinos))
      .catch((e) => console.error("Error al cargar destinos:", e));
  }, []);

  // Cargar hoteles según destino
  useEffect(() => {
    const load = async () => {
      try {
        if (!form?.destinoId) {
          const res = await api.get<{ hoteles: Hotel[] }>("/destinos/hoteles");
          setHoteles(res.data.hoteles);
          return;
        }
        const res = await api.get<{ hoteles: Hotel[] }>(`/destinos/hoteles?destinoId=${form.destinoId}`);
        setHoteles(res.data.hoteles);
      } catch (e) {
        console.error("Error al cargar hoteles:", e);
      }
    };
    load();
  }, [form?.destinoId]);

  // Cargar lista de imágenes (filenames)
  const loadImageList = async () => {
    setLoadingImages(true);
    try {
      const res = await api.get<{ images: string[] }>("/images");
      setImageList(res.data.images);
    } catch (err) {
      console.error("Error al cargar imágenes:", err);
      setImageList([]);
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    loadImageList();
  }, []);

  // Cargar paquete en modo edición
  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchPackage = async () => {
        try {
          const res = await api.get<{ paquete: Paquete }>(`/paquetes/${id}`);
          const p = res.data.paquete;
          setForm({
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion ?? "",
            destinoId: p.destino?.id ?? null,
            hotelId: p.hotel?.id ?? null,
            precio: p.precio ?? null,
            duracion: p.duracion ?? null,
            publicado: p.publicado,
            fotoURL: p.fotoURL ? p.fotoURL.replace("http://localhost:3001/images/", "") : "",
          });
        } catch (error) {
          console.error("Error al traer paquete:", error);
        }
      };
      fetchPackage();
    } else if (mode === "create") {
      setForm({
        nombre: "",
        descripcion: "",
        destinoId: null,
        hotelId: null,
        precio: null,
        duracion: null,
        publicado: false,
        fotoURL: "",
      });
    }
  }, [id, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!form) return;
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        name === "precio" || name === "duracion"
          ? value === ""
            ? null
            : Number(value)
          : name === "hotelId" || name === "destinoId"
          ? value === ""
            ? null
            : Number(value)
          : value,
    });
  };

  const handlePendingChange = (hasPending: boolean) => {
    setPendingNewImage(hasPending);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!form) return;

      let finalFotoFilename = form.fotoURL;

      // Si hay imagen nueva pendiente, subirla antes de guardar el paquete
      if (pendingNewImage && uploadRef.current?.doUpload) {
        const res = await uploadRef.current.doUpload();
        if (res) {
          finalFotoFilename = res.filename;
          // recargar lista para mantener sincronía en la UI
          await loadImageList();
        }
      }

      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        destinoId: form.destinoId,
        hotelId: form.hotelId,
        precio: form.precio,
        duracion: form.duracion,
        fotoURL: finalFotoFilename,
        publicado: form.publicado,
      };

      if (mode === "edit" && form.id) {
        await api.put(`/paquetes/${form.id}`, payload);
      } else {
        await api.post("/paquetes", payload);
      }

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error al guardar paquete:", error);
      alert("Error al guardar paquete");
    }
  };

  if (!form) return <p>Cargando formulario ...</p>;

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2>{mode === "edit" ? "Editar paquete" : "Crear nuevo paquete"}</h2>

      <label>Nombre</label>
      <input name="nombre" value={form.nombre} onChange={handleChange} required />

      <label>Descripción</label>
      <textarea name="descripcion" value={form.descripcion ?? ""} onChange={handleChange} rows={3} placeholder="Descripción del paquete ..." />

      <label>Destino</label>
      <select name="destinoId" value={form.destinoId ?? ""} onChange={handleChange} required>
        <option value="">Seleccionar destino ...</option>
        {destinos.map((d) => (
          <option key={d.id} value={d.id}>
            {d.nombre}
          </option>
        ))}
      </select>

      <label>Hotel</label>
      <select name="hotelId" value={form.hotelId ?? ""} onChange={handleChange} required>
        <option value="">Seleccionar hotel ...</option>
        {hoteles.map((h) => (
          <option key={h.id} value={h.id}>
            {h.nombre} ({h.ubicacion})
          </option>
        ))}
      </select>

      <label>Duración (días)</label>
      <input name="duracion" type="number" value={form.duracion ?? ""} onChange={handleChange} required />

      <label>Precio (USD)</label>
      <input name="precio" type="number" value={form.precio ?? ""} onChange={handleChange} required />

      <hr style={{ margin: "1rem 0" }} />

      <label style={{ display: "block", marginBottom: 6 }}>Imagen del paquete</label>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="radio" name="imageMode" value="select" checked={imageMode === "select"} onChange={() => setImageMode("select")} />
          Seleccionar imagen existente
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="radio" name="imageMode" value="upload" checked={imageMode === "upload"} onChange={() => setImageMode("upload")} />
          Agregar nueva imagen
        </label>
        <div style={{ marginLeft: "auto", color: "#666", fontSize: 13 }}>
          {imageMode === "select" ? "Elige una imagen de la lista" : "Subí una imagen nueva y poné un nombre"}
        </div>
      </div>

      {imageMode === "upload" ? (
        <div style={{ marginBottom: 12 }}>
          <ImageUpload ref={uploadRef} currentImage={form.fotoURL ?? ""} onCancel={() => { setImageMode("select"); setPendingNewImage(false); }} onPendingChange={handlePendingChange} />
          <div style={{ fontSize: 13, color: "#666" }}>La imagen se subirá cuando confirmes Guardar paquete</div>
        </div>
      ) : (
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Seleccionar imagen existente</label>
          {loadingImages ? (
            <div>Cargando imágenes...</div>
          ) : (
            <>
              <select name="fotoURL" value={form.fotoURL ?? ""} onChange={handleChange} style={{ width: "100%", padding: 8, borderRadius: 6 }}>
                <option value="">-- Sin imagen --</option>
                {imageList.map((img) => (
                  <option key={img} value={img}>
                    {img}
                  </option>
                ))}
              </select>
              <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>
                Si subiste una imagen nueva, seleccioná "Agregar nueva imagen" y luego confirmar Guardar para que quede disponible.
              </div>
            </>
          )}
        </div>
      )}

      {form.fotoURL && (
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <p>Vista previa:</p>
          <img src={`http://localhost:3001/images/${form.fotoURL}`} alt="Vista previa" style={{ width: 300, height: 170, objectFit: "cover", borderRadius: 6 }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <p style={{ fontSize: 12, color: "#666", marginTop: 6 }}>URL: http://localhost:3001/images/{form.fotoURL}</p>
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        <button className="btn" type="submit">
          {mode === "edit" ? "Guardar cambios" : "Crear paquete"}
        </button>
      </div>
    </form>
  );
}