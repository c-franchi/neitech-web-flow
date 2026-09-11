import React, { useRef, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange, label }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Selecione um arquivo de imagem válido.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 10MB.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storageRef = ref(storage, `site_images/${Date.now()}_${safeName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onChange(url);
    } catch (err) {
      setError('Erro ao fazer upload da imagem.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-2">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      {value && (
        <div className="relative inline-block mb-2">
          <img src={value} alt="Preview" className="max-h-32 rounded border" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow"
            title="Remover imagem"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs font-medium transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Upload size={14} />
          )}
          {uploading ? 'Enviando...' : value ? 'Trocar imagem' : 'Enviar imagem'}
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
      </div>
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  );
};

export default ImageUploader;
