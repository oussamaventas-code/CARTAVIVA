import { Bell, Search, Menu, X } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function Header({ onToggleSidebar, sidebarOpen }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="-ml-1 rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
          aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="hidden min-w-0 items-center gap-2 text-slate-500 sm:flex sm:w-1/2 lg:w-1/3">
          <Search className="h-5 w-5 flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar platos, categorías..."
            className="w-full border-none bg-transparent text-sm focus:outline-none"
          />
        </div>

        <span className="truncate text-lg font-bold tracking-wider text-slate-900 lg:hidden">
          Carta<span className="text-blue-600">Viva</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
        </button>
      </div>
    </header>
  );
}
