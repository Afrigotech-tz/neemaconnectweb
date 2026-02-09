
import { hasRouteAccess, hasModuleAccess, MODULE_PERMISSIONS } from '@/config/routePermissions';
import { useRBAC } from './useRBAC';

export const usePermissions = () => {
  const { userPermissions, hasPermission, hasAnyPermission, hasAllPermissions, hasRole, loading } = useRBAC();

  // Get user permissions as string array for easier checking
  const userPermissionNames = userPermissions.map(perm => perm.name);

  // Check if user can access a specific route
  const canAccessRoute = (route: string): boolean => {
    return hasRouteAccess(userPermissionNames, route);
  };

  // Check if user can access any route in a module
  const canAccessModule = (module: keyof typeof MODULE_PERMISSIONS): boolean => {
    return hasModuleAccess(userPermissionNames, module);
  };

  // Check if user has permission to perform specific actions
  const canView = (resource: string): boolean => {
    return hasPermission(`view_${resource}`);
  };

  const canCreate = (resource: string): boolean => {
    return hasPermission(`create_${resource}`);
  };

  const canEdit = (resource: string): boolean => {
    return hasPermission(`edit_${resource}`);
  };

  const canDelete = (resource: string): boolean => {
    return hasPermission(`delete_${resource}`);
  };

  // Check for admin-level access
  const isAdmin = (): boolean => {
    return hasRole('admin') || hasRole('super_admin');
  };

  const isSuperAdmin = (): boolean => {
    return hasRole('super_admin');
  };

  // Check if user has full CRUD access to a resource
  const hasFullAccess = (resource: string): boolean => {
    return hasAllPermissions([
      `view_${resource}`,
      `create_${resource}`,
      `edit_${resource}`,
      `delete_${resource}`
    ]);
  };

  // Check if user has any access to a resource
  const hasAnyAccess = (resource: string): boolean => {
    return hasAnyPermission([
      `view_${resource}`,
      `create_${resource}`,
      `edit_${resource}`,
      `delete_${resource}`
    ]);
  };

  return {
    userPermissions: userPermissionNames,
    canAccessRoute,
    canAccessModule,
    canView,
    canCreate,
    canEdit,
    canDelete,
    isAdmin,
    isSuperAdmin,
    hasFullAccess,
    hasAnyAccess,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    loading
  };
};