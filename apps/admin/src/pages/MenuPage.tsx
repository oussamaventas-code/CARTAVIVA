import { useEffect, useMemo, useState } from 'react';
import { Loader2, UploadCloud, Plus } from 'lucide-react';
import { CategoryList } from '../components/menu/CategoryList';
import { DishList } from '../components/menu/DishList';
import { ImportMenuModal } from '../components/menu/ImportMenuModal';
import type { Category, Dish } from '../components/menu/types';
import type { DishFormValues } from '../components/menu/DishForm';
import {
  fetchCategories,
  fetchDishes,
  createDish,
  updateDish,
  deleteDish,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from '../lib/menuApi';
import { getErrorMessage } from '../lib/errors';

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);

  const loadData = async () => {
    const [categoriesData, dishesData] = await Promise.all([fetchCategories(), fetchDishes()]);
    setCategories(categoriesData);
    setDishes(dishesData);
    setSelectedCategoryId((prev) => prev ?? categoriesData[0]?.id ?? null);
  };

  useEffect(() => {
    (async () => {
      try {
        await loadData();
      } catch (err) {
        setLoadError(getErrorMessage(err, 'No se pudo cargar la carta.'));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const counts = useMemo(() => {
    return dishes.reduce<Record<string, number>>((acc, dish) => {
      acc[dish.categoryId] = (acc[dish.categoryId] ?? 0) + 1;
      return acc;
    }, {});
  }, [dishes]);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) ?? null;
  const dishesForCategory = useMemo(
    () => dishes.filter((d) => d.categoryId === selectedCategoryId),
    [dishes, selectedCategoryId]
  );

  const handleAdd = async (categoryId: string, values: DishFormValues) => {
    if (!values.videoFile) return;
    const dish = await createDish({
      categoryId,
      name: values.name,
      price: values.price,
      videoFile: values.videoFile,
    });
    setDishes((prev) => [...prev, dish]);
  };

  const handleUpdate = async (dish: Dish, values: DishFormValues) => {
    const updated = await updateDish({
      id: dish.id,
      categoryId: dish.categoryId,
      name: values.name,
      price: values.price,
      videoFile: values.videoFile,
      currentVideoUrl: dish.videoUrl,
    });
    setDishes((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleDelete = async (id: string) => {
    await deleteDish(id);
    setDishes((prev) => prev.filter((d) => d.id !== id));
  };

  const runCategoryAction = async (action: () => Promise<void>) => {
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo actualizar la categoría.'));
    }
  };

  const handleCreateCategory = (name: string) =>
    runCategoryAction(async () => {
      const category = await createCategory(name);
      setCategories((prev) => [...prev, category]);
      setSelectedCategoryId(category.id);
      setCreatingCategory(false);
    });

  const handleRenameCategory = (id: string, name: string) =>
    runCategoryAction(async () => {
      const updated = await updateCategory(id, name);
      setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    });

  const handleDeleteCategory = (id: string) =>
    runCategoryAction(async () => {
      await deleteCategory(id);
      setCategories((prev) => {
        const remaining = prev.filter((c) => c.id !== id);
        setSelectedCategoryId((current) =>
          current === id ? remaining[0]?.id ?? null : current
        );
        return remaining;
      });
      setDishes((prev) => prev.filter((d) => d.categoryId !== id));
    });

  const handleReorderCategories = (orderedIds: string[]) =>
    runCategoryAction(async () => {
      setCategories((prev) => {
        const byId = new Map(prev.map((c) => [c.id, c]));
        return orderedIds
          .map((id) => byId.get(id))
          .filter((c): c is Category => c !== undefined);
      });
      await reorderCategories(orderedIds);
    });

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-8 text-sm text-red-600">
        {loadError}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Carta</h1>
          <p className="text-slate-500 mt-1">Organiza las categorías y platos de tu menú.</p>
        </div>
        <button
          onClick={() => setImportOpen(true)}
          className="flex w-full flex-shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto"
        >
          <UploadCloud className="h-4 w-4" />
          Importar carta antigua
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Panel Izquierdo: Categorías */}
        <div className="space-y-4 lg:col-span-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Categorías</h2>
            <button
              onClick={() => setCreatingCategory(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Nueva
            </button>
          </div>
          <CategoryList
            categories={categories}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
            counts={counts}
            onRename={handleRenameCategory}
            onDelete={handleDeleteCategory}
            onReorder={handleReorderCategories}
            creating={creatingCategory}
            onCreate={handleCreateCategory}
            onCancelCreate={() => setCreatingCategory(false)}
          />
        </div>

        {/* Panel Derecho: Platos de la categoría seleccionada */}
        <div className="min-h-[400px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-8 lg:min-h-[500px]">
          {selectedCategory ? (
            <DishList
              categoryId={selectedCategory.id}
              categoryName={selectedCategory.name}
              dishes={dishesForCategory}
              onAdd={handleAdd}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-center text-slate-500">
              Selecciona una categoría para ver sus platos.
            </div>
          )}
        </div>
      </div>

      {importOpen && (
        <ImportMenuModal
          onClose={() => setImportOpen(false)}
          onImported={loadData}
        />
      )}
    </div>
  );
}
