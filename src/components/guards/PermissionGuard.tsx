import React, { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRBAC } from '@/hooks/useRBAC';

interface PermissionGuardProps {
  children: ReactNode;
  permissions: string | string[];
  resource?: string;
  requireAll?: boolean;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permissions,
  resource,
  requireAll = false,
  fallback = null,
  redirectTo
}) => {
  const { user } = useAuth();
  const {  hasAnyPermission, hasAllPermissions, loading } = useRBAC();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    if (redirectTo) {
      window.location.href = redirectTo;
      return null;
    }
    return <>{fallback}</>;
  }

  const permissionNames = Array.isArray(permissions) ? permissions : [permissions];
  
  let hasAccess = false;
  
  if (requireAll) {
    hasAccess = hasAllPermissions(permissionNames, resource);
  } else {
    hasAccess = hasAnyPermission(permissionNames, resource);
  }

  if (!hasAccess) {
    if (redirectTo) {
      window.location.href = redirectTo;
      return null;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

