import { Routes, Route } from 'react-router';
import { UtensilsCrossed } from 'lucide-react';
import MenuView from './pages/MenuView';

function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white p-8 text-center">
      <UtensilsCrossed className="h-10 w-10 text-slate-300" />
      <p className="font-medium text-slate-700">Escanea el código QR de tu mesa</p>
      <p className="text-sm text-slate-400">para ver la carta del restaurante.</p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/r/:restaurantSlug" element={<MenuView />} />
      <Route path="/r/:restaurantSlug/:tableSlug" element={<MenuView />} />
    </Routes>
  );
}

export default App;
