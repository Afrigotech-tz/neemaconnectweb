import { useAuth } from "./useAuth";
import { useRBAC } from "./useRBAC";

interface UsePermissionGuardProps {
  permissions: string | string[];
  resource?: string;
  requireAll?: boolean;
}

export const usePermissionGuard = ({ 
  permissions, 
  resource, 
  requireAll = false 
}: UsePermissionGuardProps) => {
  const { user } = useAuth();
  const { hasAnyPermission, hasAllPermissions, loading } = useRBAC();

  if (loading || !user) {
    return { hasAccess: false, loading };
  }

  const permissionNames = Array.isArray(permissions) ? permissions : [permissions];
  const hasAccess = requireAll 
    ? hasAllPermissions(permissionNames, resource) 
    : hasAnyPermission(permissionNames, resource);

  return { hasAccess, loading };
};