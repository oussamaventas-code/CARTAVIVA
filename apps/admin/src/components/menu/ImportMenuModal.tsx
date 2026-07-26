import { useState } from 'react';
import { X, UploadCloud, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getErrorMessage } from '../../lib/errors';
import { runOcr, parseMenuText } from '../../lib/menuOcr';
import { bulkImportMenu, type ImportSummary } from '../../lib/menuApi';

type Stage = 'idle' | 'reading' | 'saving' | 'done' | 'error';

interface ImportMenuModalProps {
  onClose: () => void;
  onImported: () => void;
}

export function ImportMenuModal({ onClose, onImported }: ImportMenuModalProps) {
  const [stage, setStage] = useState<Stage>('idle');
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Sube una foto (JPG o PNG) de la carta.');
      setStage('error');
      return;
    }

    setError(null);
    setStage('reading');
    setProgress(0);

    try {
      const text = await runOcr(file, setProgress);
      const parsed = parseMenuText(text);

      if (parsed.length === 0) {
        setError('No se detectaron platos con precio en la foto. Prueba con una imagen más nítida.');
        setStage('error');
        return;
      }

      setStage('saving');
      const result = await bulkImportMenu(parsed);
      setSummary(result);
      setStage('done');
      onImported();
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo procesar la foto.'));
      setStage('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Importar carta antigua</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {stage === 'idle' && (
            <>
              <p className="mb-4 text-sm text-slate-500">
                Sube una foto de tu carta actual y detectamos automáticamente las categorías, los
                platos y sus precios. Funciona mejor con fotos nítidas y bien iluminadas.
              </p>
              <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-500">
                <UploadCloud className="h-8 w-8" />
                <span className="text-sm font-medium">Subir foto de la carta</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </>
          )}

          {stage === 'reading' && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium text-slate-700">Leyendo la carta...</p>
              <div className="h-1.5 w-full rounded-full bg-slate-100">
                <div
                  className="h-1.5 rounded-full bg-blue-600 transition-all"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            </div>
          )}

          {stage === 'saving' && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium text-slate-700">Guardando categorías y platos...</p>
            </div>
          )}

          {stage === 'error' && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
              <p className="text-sm text-slate-700">{error}</p>
              <button
                onClick={() => setStage('idle')}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Probar de nuevo
              </button>
            </div>
          )}

          {stage === 'done' && summary && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
                <p className="text-sm font-medium text-slate-700">
                  Se importaron {summary.dishesCreated} platos en {summary.categories.length} categorías.
                </p>
              </div>
              <ul className="max-h-48 space-y-1 overflow-y-auto rounded-lg bg-slate-50 p-3 text-sm">
                {summary.categories.map((c) => (
                  <li key={c.name} className="flex justify-between text-slate-600">
                    <span>{c.name}</span>
                    <span className="text-slate-400">{c.dishCount} platos</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-slate-400">
                Revisa los precios y añade el video de cada plato desde "Mi Carta" — la IA no siempre acierta al 100%.
              </p>
              <button
                onClick={onClose}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
