import { useAuth } from './useAuth';
import { useRBAC } from './useRBAC';


export const usePermissions = () => {
  const { userPermissions, hasPermission, hasAnyPermission, hasAllPermissions } = useRBAC();
  
  return {
    permissions: userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    can: hasPermission,
    canAny: hasAnyPermission,
    canAll: hasAllPermissions
  };
};

export const useRoles = () => {
  const { userRoles, hasRole, hasAnyRole, hasAllRoles } = useRBAC();
  
  return {
    roles: userRoles,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    is: hasRole,
    isAny: hasAnyRole,
    isAll: hasAllRoles
  };
};

export const useAuth_RBAC = () => {
  const { user } = useAuth();
  const rbac = useRBAC();
  
  const isAdmin = () => rbac.hasRole('admin');
  const isSuperAdmin = () => rbac.hasRole('super_admin');
  const isUser = () => rbac.hasRole('user');
  const isModerator = () => rbac.hasRole('moderator');
  
  const canManageUsers = () => rbac.hasPermission('manage', 'users');
  const canViewUsers = () => rbac.hasPermission('view', 'users');
  const canCreateUsers = () => rbac.hasPermission('create', 'users');
  const canUpdateUsers = () => rbac.hasPermission('update', 'users');
  const canDeleteUsers = () => rbac.hasPermission('delete', 'users');
  
  const canManageRoles = () => rbac.hasPermission('manage', 'roles');
  const canViewRoles = () => rbac.hasPermission('view', 'roles');
  const canCreateRoles = () => rbac.hasPermission('create', 'roles');
  const canUpdateRoles = () => rbac.hasPermission('update', 'roles');
  const canDeleteRoles = () => rbac.hasPermission('delete', 'roles');
  
  const canManageProducts = () => rbac.hasPermission('manage', 'products');
  const canViewProducts = () => rbac.hasPermission('view', 'products');
  const canCreateProducts = () => rbac.hasPermission('create', 'products');
  const canUpdateProducts = () => rbac.hasPermission('update', 'products');
  const canDeleteProducts = () => rbac.hasPermission('delete', 'products');
  
  const canManageNews = () => rbac.hasPermission('manage', 'news');
  const canViewNews = () => rbac.hasPermission('view', 'news');
  const canCreateNews = () => rbac.hasPermission('create', 'news');
  const canUpdateNews = () => rbac.hasPermission('update', 'news');
  const canDeleteNews = () => rbac.hasPermission('delete', 'news');
  
  const canManageMusic = () => rbac.hasPermission('manage', 'music');
  const canViewMusic = () => rbac.hasPermission('view', 'music');
  const canCreateMusic = () => rbac.hasPermission('create', 'music');
  const canUpdateMusic = () => rbac.hasPermission('update', 'music');
  const canDeleteMusic = () => rbac.hasPermission('delete', 'music');
  
  return {
    user,
    ...rbac,
    isAdmin,
    isSuperAdmin,
    isUser,
    isModerator,
    canManageUsers,
    canViewUsers,
    canCreateUsers,
    canUpdateUsers,
    canDeleteUsers,
    canManageRoles,
    canViewRoles,
    canCreateRoles,
    canUpdateRoles,
    canDeleteRoles,
    canManageProducts,
    canViewProducts,
    canCreateProducts,
    canUpdateProducts,
    canDeleteProducts,
    canManageNews,
    canViewNews,
    canCreateNews,
    canUpdateNews,
    canDeleteNews,
    canManageMusic,
    canViewMusic,
    canCreateMusic,
    canUpdateMusic,
    canDeleteMusic
  };
};

interface AuthorizeProps {
  roles?: string | string[];
  permissions?: string | string[];
  resource?: string;
  requireAll?: boolean;
}

export const useAuthorize = ({ roles, permissions, resource, requireAll = false }: AuthorizeProps = {}) => {
  const { hasRole, hasAnyRole, hasAllRoles, hasPermission, hasAnyPermission, hasAllPermissions, loading } = useRBAC();
  const { user } = useAuth();
  
  if (loading || !user) {
    return { authorized: false, loading };
  }
  
  let roleCheck = true;
  let permissionCheck = true;
  
  if (roles) {
    const roleNames = Array.isArray(roles) ? roles : [roles];
    roleCheck = requireAll ? hasAllRoles(roleNames) : hasAnyRole(roleNames);
  }
  
  if (permissions) {
    const permissionNames = Array.isArray(permissions) ? permissions : [permissions];
    permissionCheck = requireAll 
      ? hasAllPermissions(permissionNames, resource) 
      : hasAnyPermission(permissionNames, resource);
  }
  
  const authorized = roleCheck && permissionCheck;
  
  return { authorized, loading };
};