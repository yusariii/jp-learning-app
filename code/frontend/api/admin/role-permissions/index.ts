import { get, put, ADMIN_SYSTEM_BASE } from '@/helpers/http';

export type Action = 'view'|'create'|'update'|'delete';
export type FeatureKey =
  | 'word' | 'grammar' | 'reading' | 'listening' | 'lesson' | 'test' | 'admin' | 'role';

export type PermissionMatrix = Record<FeatureKey, Partial<Record<Action, boolean>>>;

const baseURL = ADMIN_SYSTEM_BASE;

export const getRolePermissions = (roleId: string) =>
  get<{ roleId: string; permissions: PermissionMatrix }>(`roles/${encodeURIComponent(roleId)}/permissions`, { baseURL });

export const updateRolePermissions = (roleId: string, permissions: PermissionMatrix) =>
  put<{ roleId: string; permissions: PermissionMatrix }>(`roles/${encodeURIComponent(roleId)}/permissions`, { permissions }, { baseURL });