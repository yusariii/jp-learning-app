// code/frontend/hooks/use-auth.ts
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { getToken, getUser, removeToken } from '@/helpers/storage';

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
      if (token) {
        const userData = await getUser();
        setUser(userData);
      }
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
    if (!user || !user.role) return false;

    if (user.role.title === "SuperAdmin") return true; 

    const permissions = user.role.permissions || [];
    return permissions.includes(requiredPermission);
  }, [user]);

  return {
    user,
    role: user?.role,
    isLoading,
    isAuthenticated: !!user,
    hasPermission,
    logout,
    refreshUser: loadUser,
  };
}