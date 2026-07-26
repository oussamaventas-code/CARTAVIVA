import { UtensilsCrossed } from 'lucide-react';
import type { MenuDish } from '../lib/menuData';

export function DishCard({ dish }: { dish: MenuDish }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {dish.videoUrl ? (
        <video
          src={dish.videoUrl}
          className="aspect-square w-full bg-slate-900 object-cover"
          muted
          loop
          autoPlay
          playsInline
        />
      ) : (
        <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400">
          <UtensilsCrossed className="h-8 w-8" />
        </div>
      )}
      <div className="flex items-center justify-between p-4">
        <p className="font-medium text-slate-900">{dish.name}</p>
        <p className="font-semibold text-blue-600">{dish.price.toFixed(2)} €</p>
      </div>
    </div>
  );
}
