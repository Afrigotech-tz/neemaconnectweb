import React, { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth';
import { useRBAC } from '@/hooks/useRBAC';

interface RoleGuardProps {
  children: ReactNode;
  roles: string | string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  roles,
  requireAll = false,
  fallback = null,
  redirectTo
}) => {
  const { user } = useAuth();
  const { hasRole, hasAnyRole, hasAllRoles, loading } = useRBAC();

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

  const roleNames = Array.isArray(roles) ? roles : [roles];
  
  let hasAccess = false;
  
  if (requireAll) {
    hasAccess = hasAllRoles(roleNames);
  } else {
    hasAccess = hasAnyRole(roleNames);
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



