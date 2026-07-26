import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-[var(--restaurant-surface-elevated)] overflow-hidden text-[var(--restaurant-text-primary)] font-[family-name:var(--restaurant-font-body)]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
