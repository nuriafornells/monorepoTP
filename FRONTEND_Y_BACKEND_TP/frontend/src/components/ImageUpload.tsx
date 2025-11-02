// src/components/ImageUpload.tsx
import React, { useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import api from '../api';

export type UploadResult = { filename: string; url: string } | null;

export type ImageUploadHandle = {
  doUpload: () => Promise<UploadResult>;
  hasPending: () => boolean;
};

interface ImageUploadProps {
  currentImage?: string;
  onCancel?: () => void;
  onPendingChange?: (hasPending: boolean) => void;
}

const ImageUpload = forwardRef<ImageUploadHandle, ImageUploadProps>(({ currentImage, onCancel, onPendingChange }, ref) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(() => {
    if (!currentImage) return null;
    return currentImage.startsWith('http') ? currentImage : `http://localhost:3001/images/${currentImage}`;
  });
  const [desiredName, setDesiredName] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    onPendingChange?.(!!file);
  }, [file, onPendingChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (!f) {
      setPreview(currentImage ? (currentImage.startsWith('http') ? currentImage : `http://localhost:3001/images/${currentImage}`) : null);
      setDesiredName('');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
    const nameNoExt = f.name.replace(/\.[^/.]+$/, '');
    setDesiredName(nameNoExt);
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(currentImage ? (currentImage!.startsWith('http') ? currentImage! : `http://localhost:3001/images/${currentImage}`) : null);
    setDesiredName('');
    onCancel?.();
    onPendingChange?.(false);
  };

  const doUpload = useCallback(async (): Promise<UploadResult> => {
    if (!file) return null;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      if (desiredName && desiredName.trim() !== '') formData.append('desiredName', desiredName.trim());
      const res = await api.post<{ filename: string; url: string }>('/upload', formData, {
        baseURL: 'http://localhost:3001',
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFile(null);
      setDesiredName('');
      setPreview(res.data.url);
      onPendingChange?.(false);
      return { filename: res.data.filename, url: res.data.url };
    } catch (err) {
      console.error('Upload failed:', err);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [file, desiredName, onPendingChange]);

  useImperativeHandle(ref, () => ({
    doUpload,
    hasPending: () => !!file,
  }), [doUpload, file]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <input
            type="text"
            placeholder="Nombre de archivo (sin extensión), opcional"
            value={desiredName}
            onChange={(e) => setDesiredName(e.target.value)}
            style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #d1d5db' }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn secondary" onClick={handleRemove}>
              Cancelar
            </button>
            {/* QUITAMOS el botón Subir ahora para que la subida se realice solo en submit */}
          </div>
        </div>
      </div>

      {uploading && <p>Subiendo...</p>}

      {preview && (
        <div style={{ marginTop: 10 }}>
          <p>Vista previa:</p>
          <img src={preview} alt="Vista previa" style={{ width: 220, height: 140, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }} />
        </div>
      )}
    </div>
  );
});

export default ImageUpload;