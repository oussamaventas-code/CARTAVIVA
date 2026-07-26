import { Bell, Search } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200">
      <div className="flex items-center gap-2 text-slate-500 w-1/3">
        <Search className="w-5 h-5" />
        <input 
          type="text" 
          placeholder="Buscar platos, categorías..." 
          className="bg-transparent border-none focus:outline-none text-sm w-full"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
