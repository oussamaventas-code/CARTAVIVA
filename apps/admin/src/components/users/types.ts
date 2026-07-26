export type UserRole = 'admin' | 'manager' | 'employee' | 'readonly';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  manager: 'Gestor',
  employee: 'Empleado',
  readonly: 'Solo lectura',
};

export const ROLE_BADGE_CLASSES: Record<UserRole, string> = {
  admin: 'bg-blue-50 text-blue-700',
  manager: 'bg-purple-50 text-purple-700',
  employee: 'bg-green-50 text-green-700',
  readonly: 'bg-slate-100 text-slate-600',
};
