// code/frontend/hooks/use-auth.ts
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { getToken, getUser } from '@/helpers/storage';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
  };
}