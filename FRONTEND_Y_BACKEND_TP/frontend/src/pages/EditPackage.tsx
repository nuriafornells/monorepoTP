import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../api';
import type { Paquete, Destino, Hotel } from '../types';
// Página para crear o editar un paquete turístico
// En modo edición, carga los datos del paquete existente
// Permite seleccionar destino, hotel, duración, precio y foto
// Envía los datos al backend para crear o actualizar el paquete
// Muestra una vista previa de la imagen seleccionada

type Props = { mode?: 'edit' | 'create' };

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

export default function EditPackage({ mode = 'edit' }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState | null>(null);
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [imageList, setImageList] = useState<string[]>([]);

  // Cargar destinos
  useEffect(() => {
    api.get<{ destinos: Destino[] }>('/destinos')
      .then(res => setDestinos(res.data.destinos))
      .catch(e => console.error('Error al cargar destinos:', e));
  }, []);

  // Cargar hoteles según destino
  useEffect(() => {
    const load = async () => {
      try {
        if (!form?.destinoId) {
          const res = await api.get<{ hoteles: Hotel[] }>('/destinos/hoteles');
          setHoteles(res.data.hoteles);
          return;
        }
        const res = await api.get<{ hoteles: Hotel[] }>(`/destinos/hoteles?destinoId=${form.destinoId}`);
        setHoteles(res.data.hoteles);
      } catch (e) {
        console.error('Error al cargar hoteles:', e);
      }
    };
    load();
  }, [form?.destinoId]);

  // Cargar imágenes disponibles
  useEffect(() => {
    api.get<{ images: string[] }>('/images')
      .then(res => setImageList(res.data.images))
      .catch(err => console.error('Error al cargar imágenes:', err));
  }, []);

  // Cargar paquete en modo edición
  useEffect(() => {
    if (mode === 'edit' && id) {
      const fetchPackage = async () => {
        try {
          const res = await api.get<{ paquete: Paquete }>(`/paquetes/${id}`);
          const p = res.data.paquete;
          setForm({
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion ?? '',
            destinoId: p.destino?.id ?? null,
            hotelId: p.hotel?.id ?? null,
            precio: p.precio ?? null,
            duracion: p.duracion ?? null,
            publicado: p.publicado,
            fotoURL: p.fotoURL ? p.fotoURL.replace('http://localhost:3001/images/', '') : '',
          });
        } catch (error) {
          console.error('Error al traer paquete:', error);
        }
      };
      fetchPackage();
    } else if (mode === 'create') {
      setForm({
        nombre: '',
        descripcion: '',
        destinoId: null,
        hotelId: null,
        precio: null,
        duracion: null,
        publicado: false,
        fotoURL: '',
      });
    }
  }, [id, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!form) return;
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        name === 'precio' || name === 'duracion'
          ? value === '' ? null : Number(value)
          : name === 'hotelId' || name === 'destinoId'
          ? value === '' ? null : Number(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!form) return;

      if (mode === 'edit') {
        await api.put(`/paquetes/${form.id}`, {
          nombre: form.nombre,
          descripcion: form.descripcion,
          destinoId: form.destinoId,
          hotelId: form.hotelId,
          precio: form.precio,
          duracion: form.duracion,
          fotoURL: form.fotoURL,
        });
      } else {
        await api.post('/paquetes', {
          nombre: form.nombre,
          descripcion: form.descripcion,
          destinoId: form.destinoId,
          hotelId: form.hotelId,
          precio: form.precio,
          duracion: form.duracion,
          publicado: false,
          fotoURL: form.fotoURL,
        });
      }

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error al guardar paquete:', error);
      alert('Error al guardar paquete');
    }
  };

  if (!form) return <p>Cargando formulario…</p>;

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>{mode === 'edit' ? 'Editar paquete' : 'Crear nuevo paquete'}</h2>

      <label>Nombre</label>
      <input name="nombre" value={form.nombre} onChange={handleChange} required />

      <label>Descripción</label>
      <textarea 
        name="descripcion" 
        value={form.descripcion ?? ''} 
        onChange={handleChange} 
        rows={3}
        placeholder="Descripción del paquete..."
      />

      <label>Destino</label>
      <select name="destinoId" value={form.destinoId ?? ''} onChange={handleChange} required>
        <option value="">Seleccionar destino…</option>
        {destinos.map((d) => (
          <option key={d.id} value={d.id}>{d.nombre}</option>
        ))}
      </select>

      <label>Hotel</label>
      <select name="hotelId" value={form.hotelId ?? ''} onChange={handleChange} required>
        <option value="">Seleccionar hotel…</option>
        {hoteles.map((h) => (
          <option key={h.id} value={h.id}>{h.nombre} ({h.ubicacion})</option>
        ))}
      </select>

      <label>Duración (días)</label>
      <input name="duracion" type="number" value={form.duracion ?? ''} onChange={handleChange} required />

      <label>Precio (USD)</label>
      <input name="precio" type="number" value={form.precio ?? ''} onChange={handleChange} required />

      <label>Foto</label>
      <select name="fotoURL" value={form.fotoURL ?? ''} onChange={handleChange}>
        <option value="">Seleccionar imagen...</option>
        {imageList.map(img => <option key={img} value={img}>{img}</option>)}
      </select>

      {form.fotoURL && (
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <p>Vista previa:</p>
          <img
            src={`http://localhost:3001/images/${form.fotoURL}`}
            alt="Vista previa"
            style={{ width: 200, height: 120, objectFit: 'cover', borderRadius: 4 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <p style={{ fontSize: 12, color: '#666', marginTop: 5 }}>
            URL: http://localhost:3001/images/{form.fotoURL}
          </p>
        </div>
      )}

      <button className="btn" type="submit">
        {mode === 'edit' ? 'Guardar cambios' : 'Crear paquete'}
      </button>
    </form>
  );
}