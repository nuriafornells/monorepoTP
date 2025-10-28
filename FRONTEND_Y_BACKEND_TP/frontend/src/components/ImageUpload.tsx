// src/components/ImageUpload.tsx
import React, { useState } from 'react';
import axios from '../axios';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
}

type UploadResponse = {
  message: string;
  filename: string;
  url: string;
};

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage ?? null);

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
      const response = await axios.post<UploadResponse>('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        baseURL: 'http://localhost:3001', // upload route is served outside /api
      });
      // response.data.url should be like http://localhost:3001/images/filename
      onImageUploaded(response.data.url);
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