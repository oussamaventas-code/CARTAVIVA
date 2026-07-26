import { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Trash2, Loader2 } from 'lucide-react';
import type { RestaurantTable } from './types';

interface TableCardProps {
  table: RestaurantTable;
  onDelete: (table: RestaurantTable) => Promise<void>;
}

export function TableCard({ table, onDelete }: TableCardProps) {
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDownload = () => {
    const canvas = canvasWrapperRef.current?.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `qr-${table.name}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(table);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
      <div ref={canvasWrapperRef} className="rounded-lg border border-slate-100 p-3">
        <QRCodeCanvas value={table.url} size={160} level="M" marginSize={2} />
      </div>

      <div>
        <p className="font-semibold text-slate-900">{table.name}</p>
        <p className="mt-0.5 max-w-[200px] truncate text-xs text-slate-400" title={table.url}>
          {table.url}
        </p>
      </div>

      <div className="flex w-full gap-2">
        <button
          onClick={handleDownload}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Descargar
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
