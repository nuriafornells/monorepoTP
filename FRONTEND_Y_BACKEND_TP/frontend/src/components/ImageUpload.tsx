// src/components/ImageUpload.tsx
import React, { useState } from 'react';
import api from '../api';

interface ImageUploadProps {
  onImageUploaded: (filename: string) => void; // ahora devolvemos filename
  currentImage?: string; // puede ser filename (ej: 'abc.jpg') o url
}

type UploadResponse = {
  message: string;
  filename: string;
  url: string;
};

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage ? (currentImage.startsWith('http') ? currentImage : `http://localhost:3001/images/${currentImage}`) : null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      // POST directo al endpoint de subida del backend
      const response = await api.post<UploadResponse>('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        baseURL: 'http://localhost:3001', // upload route está fuera de /api
      });
      // Notificar al padre con el filename (coincide con la lista de /api/images)
      onImageUploaded(response.data.filename);
      // actualizar preview a la url pública del archivo subido
      setPreview(response.data.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

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
};

export default ImageUpload;