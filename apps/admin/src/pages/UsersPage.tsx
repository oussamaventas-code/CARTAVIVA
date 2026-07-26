import { useState } from 'react';
import { Plus, Edit2, Trash2, Users as UsersIcon } from 'lucide-react';
import { UserForm, type UserFormValues } from '../components/users/UserForm';
import { ROLE_BADGE_CLASSES, ROLE_LABELS } from '../components/users/types';
import type { TeamMember } from '../components/users/types';

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function UsersPage() {
  const [users, setUsers] = useState<TeamMember[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<TeamMember | null>(null);

  const openNewForm = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const openEditForm = (user: TeamMember) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleSave = (values: UserFormValues) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...values } : u))
      );
    } else {
      setUsers((prev) => [
        ...prev,
        { id: crypto.randomUUID(), isActive: true, ...values },
      ]);
    }
    setFormOpen(false);
    setEditingUser(null);
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const toggleActive = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
          <p className="mt-1 text-slate-500">
            Gestiona quién tiene acceso al panel de tu restaurante y con qué rol.
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Invitar usuario
        </button>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <UsersIcon className="h-6 w-6 text-slate-400" />
          </div>
          <div>
            <p className="font-medium text-slate-800">Todavía no hay usuarios invitados</p>
            <p className="mt-1 text-sm text-slate-500">Invita a tu equipo para que gestionen la carta contigo.</p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Usuario</th>
                <th className="px-5 py-3">Rol</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">
                        {initials(user.name)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ROLE_BADGE_CLASSES[user.role]}`}>
                      {ROLE_LABELS[user.role]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleActive(user.id)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                        user.isActive
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditForm(user)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <UserForm
          initialUser={editingUser}
          onClose={() => {
            setFormOpen(false);
            setEditingUser(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
