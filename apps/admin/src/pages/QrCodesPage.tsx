import { useEffect, useState } from 'react';
import { Plus, QrCode, Loader2 } from 'lucide-react';
import { TableCard } from '../components/qr/TableCard';
import type { RestaurantTable } from '../components/qr/types';
import { fetchTables, createTable, deleteTable } from '../lib/qrApi';
import { getErrorMessage } from '../lib/errors';

export default function QrCodesPage() {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setTables(await fetchTables());
      } catch (err) {
        setError(getErrorMessage(err, 'No se pudieron cargar las mesas.'));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;

    setSaving(true);
    setError(null);
    try {
      const table = await createTable(name);
      setTables((prev) => [...prev, table]);
      setNewName('');
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo crear la mesa.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (table: RestaurantTable) => {
    try {
      await deleteTable(table);
      setTables((prev) => prev.filter((t) => t.id !== table.id));
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo eliminar la mesa.'));
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Códigos QR</h1>
        <p className="mt-1 text-slate-500">
          Genera un código QR por mesa y descárgalo listo para imprimir.
        </p>
        <p className="mt-1 text-xs text-slate-400">
          El enlace es un ejemplo — apuntará a la carta real de tu restaurante en cuanto esté publicada.
        </p>
      </div>

      <form onSubmit={handleAdd} className="flex gap-3">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Ej. Mesa 5"
          className="w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Añadir mesa
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : tables.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <QrCode className="h-6 w-6 text-slate-400" />
          </div>
          <div>
            <p className="font-medium text-slate-800">Todavía no hay mesas</p>
            <p className="mt-1 text-sm text-slate-500">Añade tu primera mesa para generar su código QR.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {tables.map((table) => (
            <TableCard key={table.id} table={table} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
