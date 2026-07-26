import { useState } from 'react';
import { useTheme } from '@carta/hooks';
import type { ThemeConfig } from '@carta/hooks';

export function ThemeEditor() {
  const [theme, setTheme] = useState<ThemeConfig>({
    colors: {
      brand50: '#f0f9ff',
      brand500: '#0ea5e9',
      brand900: '#0c4a6e',
      surface: '#ffffff',
      surfaceElevated: '#f8fafc',
      textPrimary: '#0f172a',
      textSecondary: '#64748b'
    },
    typography: {
      display: 'Inter',
      body: 'Inter'
    },
    borders: {
      cardRadius: '1rem',
      buttonRadius: '0.75rem'
    }
  });

  useTheme(theme);

  const handleColorChange = (key: keyof ThemeConfig['colors'], value: string) => {
    setTheme(prev => ({
      ...prev,
      colors: { ...prev.colors, [key]: value }
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold mb-6">Editor de Tema</h2>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Editor de colores */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-700">Colores Principales</h3>
          <div className="space-y-3">
            {Object.entries(theme.colors).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm text-slate-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof ThemeConfig['colors'], e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="text-xs text-slate-500 font-mono w-16 uppercase">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex items-center justify-center">
          <div className="w-full max-w-sm space-y-4">
            <h3 className="text-sm font-medium text-slate-500 mb-4 text-center">Vista Previa</h3>
            
            {/* Componentes usando las variables CSS del tema */}
            <div className="bg-[var(--restaurant-surface)] rounded-[var(--restaurant-radius-card)] p-4 shadow-sm border border-slate-100">
              <h4 className="text-[var(--restaurant-text-primary)] font-[family-name:var(--restaurant-font-display)] font-semibold text-lg mb-2">
                Hamburguesa Wagyu
              </h4>
              <p className="text-[var(--restaurant-text-secondary)] font-[family-name:var(--restaurant-font-body)] text-sm mb-4">
                Doble carne wagyu 200g, queso cheddar madurado, bacon crujiente y nuestra salsa secreta.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[var(--restaurant-text-primary)] font-semibold">14.50 €</span>
                <button 
                  className="bg-[var(--restaurant-brand-500)] text-white px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ borderRadius: 'var(--restaurant-radius-button)' }}
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors">
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
