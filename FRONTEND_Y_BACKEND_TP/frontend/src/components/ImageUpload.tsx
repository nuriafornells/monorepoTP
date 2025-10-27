// React component for file upload
import React, { useState } from 'react';
import axios from '../axios';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onImageUploaded(response.data.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: '15px' }}>
      <label>Imagen del paquete:</label>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        style={{ display: 'block', margin: '5px 0' }}
      />
      
      {uploading && <p>Subiendo imagen...</p>}
      
      {preview && (
        <div style={{ marginTop: '10px' }}>
          <p>Vista previa:</p>
          <img 
            src={preview} 
            alt="Vista previa" 
            style={{ 
              width: '200px', 
              height: '120px', 
              objectFit: 'cover', 
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;