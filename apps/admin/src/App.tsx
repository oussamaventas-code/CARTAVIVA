import { Routes, Route, Navigate } from 'react-router';
import AdminLayout from './components/layout/AdminLayout';
import SettingsPage from './pages/SettingsPage';
import MenuPage from './pages/MenuPage';
import QrCodesPage from './pages/QrCodesPage';
import UsersPage from './pages/UsersPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="qrcodes" element={<QrCodesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
