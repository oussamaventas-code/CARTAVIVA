import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2, Check, X } from 'lucide-react';
import type { Category } from './types';

interface SortableCategoryItemProps {
  category: Category;
  count: number;
  selected: boolean;
  onSelect: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}

function SortableCategoryItem({
  category,
  count,
  selected,
  onSelect,
  onRename,
  onDelete,
}: SortableCategoryItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: category.id,
  });
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(category.name);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const commitRename = () => {
    const name = draftName.trim();
    if (name && name !== category.name) onRename(name);
    setEditing(false);
  };

  const cancelRename = () => {
    setDraftName(category.name);
    setEditing(false);
  };

  const handleDelete = () => {
    const message =
      count > 0
        ? `Se eliminará "${category.name}" y sus ${count} platos (con sus videos). Esta acción no se puede deshacer.`
        : `Se eliminará la categoría "${category.name}".`;
    if (window.confirm(message)) onDelete();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => !editing && onSelect()}
      className={`flex items-center justify-between p-4 mb-2 rounded-lg border shadow-sm cursor-pointer transition-colors ${
        selected ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          className="cursor-grab p-1 text-slate-400 transition-colors hover:text-slate-600"
          onClick={(e) => e.stopPropagation()}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        {editing ? (
          <input
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename();
              if (e.key === 'Escape') cancelRename();
            }}
            className="min-w-0 flex-1 rounded border border-blue-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        ) : (
          <>
            <span className="truncate font-medium text-slate-800">{category.name}</span>
            <span className="flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {count} platos
            </span>
          </>
        )}
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        {editing ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                commitRename();
              }}
              className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-50"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                cancelRename();
              }}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDraftName(category.name);
                setEditing(true);
              }}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

interface CategoryListProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  counts: Record<string, number>;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
  creating: boolean;
  onCreate: (name: string) => void;
  onCancelCreate: () => void;
}

export function CategoryList({
  categories: categoriesProp,
  selectedId,
  onSelect,
  counts,
  onRename,
  onDelete,
  onReorder,
  creating,
  onCreate,
  onCancelCreate,
}: CategoryListProps) {
  const [categories, setCategories] = useState(categoriesProp);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    setCategories(categoriesProp);
  }, [categoriesProp]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        onReorder(reordered.map((c) => c.id));
        return reordered;
      });
    }
  };

  const commitCreate = () => {
    const name = newName.trim();
    if (name) onCreate(name);
    setNewName('');
  };

  const cancelCreate = () => {
    setNewName('');
    onCancelCreate();
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="w-full max-w-md">
        <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {categories.map((category) => (
            <SortableCategoryItem
              key={category.id}
              category={category}
              count={counts[category.id] ?? 0}
              selected={category.id === selectedId}
              onSelect={() => onSelect(category.id)}
              onRename={(name) => onRename(category.id, name)}
              onDelete={() => onDelete(category.id)}
            />
          ))}
        </SortableContext>

        {creating && (
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 p-4">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ej. Tapas"
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitCreate();
                if (e.key === 'Escape') cancelCreate();
              }}
              className="min-w-0 flex-1 rounded border border-blue-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={commitCreate}
              className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-100"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={cancelCreate}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </DndContext>
  );
}
