// src/components/ImageUpload.tsx
//TODAVIA NO SE USA
// Componente para subir y previsualizar imágenes
// Utiliza la API de subida de imágenes del backend. Recibe una función onImageUploaded para notificar al padre cuando la imagen se ha subido exitosamente
// y una URL de imagen actual para previsualización inicial si existe.
import React, { useState } from 'react';
import api from '../api';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
} // URL de la imagen actual, si existe

type UploadResponse = {
  message: string;
  filename: string;
  url: string;
}; // URL completa de la imagen subida

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage ?? null);
// Estado para la vista previa de la imagen
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
// Mostrar vista previa inmediatamente
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post<UploadResponse>('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        baseURL: 'http://localhost:3001', // upload route is served outside /api
      });
      // Notificar al padre con la URL de la imagen subida
      // http://localhost:3001/images/filename
      onImageUploaded(response.data.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };
// Manejar selección de archivo y subirlo al backend
  return (
    <div style={{ marginBottom: 15 }}>
      <label>Imagen del paquete:</label>
      <input type="file" accept="image/*" onChange={handleFileSelect} disabled={uploading} style={{ display: 'block', margin: '5px 0' }} />
      {uploading && <p>Subiendo imagen...</p>}
      {preview && (
        <div style={{ marginTop: 10 }}>
          <p>Vista previa:</p>
          <img src={preview} alt="Vista previa" style={{ width: 200, height: 120, objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }} />
        </div>
      )}
    </div>
  );
}; // Componente funcional de React con props tipadas

export default ImageUpload;