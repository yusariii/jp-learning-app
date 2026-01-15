// code/frontend/hooks/use-auth.ts
import { useEffect, useState, useCallback } from 'react';
import { getToken, getUser, removeToken, saveUser } from '@/helpers/storage';
import { getRolePermissions } from '@/api/admin/role-permissions';
import { getAdmin } from '@/api/admin/admins';

type PermissionMatrix = Record<string, Record<string, boolean>>;

function normalizeRole(rawUser: any): any {
  if (!rawUser) return null;
  // Support multiple shapes:
  // - admin login stores { id, email, role: RoleDoc }
  // - other flows might store { ..., roleId: RoleDoc | string }
  const role = rawUser.role ?? rawUser.roleId ?? rawUser.role_id;
  return role ?? null;
}

function setRoleOnUser(rawUser: any, nextRole: any): any {
  if (!rawUser) return rawUser;
  if (rawUser.role != null) return { ...rawUser, role: nextRole };
  if (rawUser.roleId != null) return { ...rawUser, roleId: nextRole };
  if (rawUser.role_id != null) return { ...rawUser, role_id: nextRole };
  return { ...rawUser, role: nextRole };
}

function isSuperAdmin(role: any): boolean {
  const title = role?.title ?? role?.name;
  return typeof title === 'string' && title.trim().toLowerCase() === 'superadmin';
}

function hasPermissionInRole(role: any, requiredPermission: string): boolean {
  if (!role || !requiredPermission) return false;
  if (isSuperAdmin(role)) return true;

  const permissions = role.permissions;

  // Case 1: permissions is string[]
  if (Array.isArray(permissions)) {
    return permissions.includes(requiredPermission);
  }

  // Case 2: permissions is a matrix object: { word: { view:true, ... }, ... }
  if (permissions && typeof permissions === 'object') {
    const [feature, action] = String(requiredPermission).split('.');
    if (!feature || !action) return false;
    const matrix = permissions as PermissionMatrix;
    return !!matrix?.[feature]?.[action];
  }

  return false;
}

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load user from storage on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await getToken();
      if (!token) {
        setUser(null);
        return;
      }

      const userData = await getUser();
      if (!userData) {
        setUser(null);
        return;
      }

      // Refresh role assignment & permissions so updates in DB reflect without logout/login.
      // 1) If admin's roleId changed, fetch latest admin doc.
      // 2) Fetch current role permissions matrix.
      let nextUser = userData;
      try {
        const looksLikeAdmin = !!(userData?.email && (userData?.role != null || userData?.roleId != null || userData?.role_id != null));
        const adminId = userData?._id ?? userData?.id;
        if (looksLikeAdmin && adminId) {
          const adminDoc = await getAdmin(String(adminId));
          const latestRole = (adminDoc as any)?.roleId ?? null;
          if (latestRole) {
            nextUser = setRoleOnUser(nextUser, latestRole);
          }
        }

        const role = normalizeRole(nextUser);
        const roleId = typeof role === 'string' ? role : (role?._id ?? role?.id);
        if (roleId) {
          const res = await getRolePermissions(String(roleId));
          const roleObj = typeof role === 'string' ? { _id: String(roleId) } : (role ?? { _id: String(roleId) });
          const nextRole = { ...roleObj, permissions: res.permissions };
          nextUser = setRoleOnUser(nextUser, nextRole);
        }
      } catch {
        // ignore refresh errors; use cached user
      }

      setUser(nextUser);
      await saveUser(nextUser);
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await removeToken();
      setUser(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };
  
  const hasPermission = useCallback((requiredPermission: string) => {
    const role = normalizeRole(user);
    return hasPermissionInRole(role, requiredPermission);
  }, [user]);

  return {
    user,
    role: normalizeRole(user),
    isLoading,
    isAuthenticated: !!user,
    hasPermission,
    logout,
    refreshUser: loadUser,
  };
}