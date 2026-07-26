import { ThemeEditor } from '../components/settings/ThemeEditor';
import { RestaurantSettings } from '../components/settings/RestaurantSettings';

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
        <p className="text-slate-500 mt-1">Gestiona las preferencias y la apariencia de tu restaurante.</p>
      </div>

      <RestaurantSettings />

      {/* Aquí irían otras configuraciones como Idiomas, Horarios, etc. */}

      <ThemeEditor />
    </div>
  );
}
