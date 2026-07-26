import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { name: 'Características', href: '#caracteristicas' },
  { name: 'Cómo funciona', href: '#como-funciona' },
  { name: 'Precios', href: '#precios' },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <span className="text-xl font-bold tracking-wider text-slate-900">
          Carta<span className="text-blue-500">Viva</span>
        </span>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#precios"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Iniciar sesión
          </a>
          <a
            href="#precios"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Probar gratis
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-slate-900 md:hidden"
          aria-label="Abrir menú"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#precios"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white"
          >
            Probar gratis
          </a>
        </nav>
      )}
    </header>
  );
}
