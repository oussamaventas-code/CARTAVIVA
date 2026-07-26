import { useState } from 'react';
import { Plus, Edit2, Trash2, VideoOff } from 'lucide-react';
import type { Dish } from './types';
import { getErrorMessage } from '../../lib/errors';
import { DishForm, type DishFormValues } from './DishForm';

interface DishListProps {
  categoryId: string;
  categoryName: string;
  dishes: Dish[];
  onAdd: (categoryId: string, values: DishFormValues) => Promise<void>;
  onUpdate: (dish: Dish, values: DishFormValues) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function DishList({ categoryId, categoryName, dishes, onAdd, onUpdate, onDelete }: DishListProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openNewForm = () => {
    setEditingDish(null);
    setFormOpen(true);
  };

  const openEditForm = (dish: Dish) => {
    setEditingDish(dish);
    setFormOpen(true);
  };

  const handleSave = async (values: DishFormValues) => {
    setSaving(true);
    setError(null);
    try {
      if (editingDish) {
        await onUpdate(editingDish, values);
      } else {
        await onAdd(categoryId, values);
      }
      setFormOpen(false);
      setEditingDish(null);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar el plato.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await onDelete(id);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo eliminar el plato.'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">{categoryName}</h2>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Añadir plato
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {dishes.length === 0 ? (
        <button
          onClick={openNewForm}
          className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 py-16 text-center hover:border-blue-300"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <Plus className="h-6 w-6 text-slate-400" />
          </div>
          <div>
            <p className="font-medium text-slate-800">Todavía no hay platos aquí</p>
            <p className="mt-1 text-sm text-slate-500">Añade el primer plato de {categoryName} con su video.</p>
          </div>
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {dishes.map((dish) => (
            <div key={dish.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
              {dish.videoUrl ? (
                <video
                  src={dish.videoUrl}
                  className="aspect-square w-full object-cover"
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              ) : (
                <div className="flex aspect-square w-full flex-col items-center justify-center gap-1 bg-slate-800 text-slate-500">
                  <VideoOff className="h-6 w-6" />
                  <span className="text-xs">Sin video</span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="truncate text-sm font-semibold text-white">{dish.name}</p>
                <p className="text-xs text-slate-300">{dish.price.toFixed(2)} €</p>
              </div>
              <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => openEditForm(dish)}
                  className="rounded-lg bg-white/90 p-1.5 text-slate-700 hover:bg-white"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(dish.id)}
                  disabled={deletingId === dish.id}
                  className="rounded-lg bg-white/90 p-1.5 text-red-600 hover:bg-white disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <DishForm
          initialDish={editingDish}
          saving={saving}
          onClose={() => {
            setFormOpen(false);
            setEditingDish(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
