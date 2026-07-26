import { useEffect, useRef, useState } from 'react';
import { X, UploadCloud, Film, Loader2 } from 'lucide-react';
import type { Dish } from './types';

const MAX_VIDEO_MB = 100;

export interface DishFormValues {
  name: string;
  price: number;
  videoFile: File | null;
}

interface DishFormProps {
  initialDish: Dish | null;
  saving: boolean;
  onClose: () => void;
  onSave: (values: DishFormValues) => void;
}

export function DishForm({ initialDish, saving, onClose, onSave }: DishFormProps) {
  const [name, setName] = useState(initialDish?.name ?? '');
  const [price, setPrice] = useState(initialDish ? String(initialDish.price) : '');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialDish?.videoUrl ?? '');
  const [error, setError] = useState<string | null>(null);
  const createdUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (createdUrlRef.current) URL.revokeObjectURL(createdUrlRef.current);
    };
  }, []);

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError('El archivo debe ser un video.');
      return;
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setError(`El video no puede superar los ${MAX_VIDEO_MB} MB.`);
      return;
    }

    if (createdUrlRef.current) URL.revokeObjectURL(createdUrlRef.current);
    const url = URL.createObjectURL(file);
    createdUrlRef.current = url;
    setVideoFile(file);
    setPreviewUrl(url);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('El plato necesita un nombre.');
      return;
    }
    const parsedPrice = Number(price.replace(',', '.'));
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Indica un precio válido.');
      return;
    }
    if (!previewUrl) {
      setError('Sube un video para el plato.');
      return;
    }

    onSave({ name: name.trim(), price: parsedPrice, videoFile });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h3 className="text-lg font-semibold text-slate-900">
            {initialDish ? 'Editar plato' : 'Nuevo plato'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label className="text-sm font-medium text-slate-700">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Risotto de setas"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Precio (€)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ej. 13.90"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Video del plato</label>

            {previewUrl ? (
              <div className="relative mt-2 overflow-hidden rounded-lg bg-slate-900">
                <video
                  key={previewUrl}
                  src={previewUrl}
                  className="aspect-square w-full object-cover"
                  muted
                  loop
                  autoPlay
                  playsInline
                />
                <label className="absolute bottom-2 right-2 flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white">
                  <UploadCloud className="h-3.5 w-3.5" />
                  Cambiar
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            ) : (
              <label className="mt-2 flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-500">
                <Film className="h-8 w-8" />
                <span className="text-sm font-medium">Subir video (MP4, máx. {MAX_VIDEO_MB} MB)</span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                />
              </label>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Guardar plato
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
