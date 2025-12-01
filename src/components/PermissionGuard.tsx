import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldX } from 'lucide-react';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  requireAll?: boolean; // Whether user needs ALL permissions/roles (default: false - needs ANY)
  fallback?: React.ReactNode;
  route?: string; // Route to check access for
  module?: string; // Module to check access for
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  requireAll = false,
  fallback,
  route,
  module
}) => {
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions, 
    hasRole, 
    canAccessRoute,
    canAccessModule 
  } = usePermissions();

  // Check route access if route is provided
  if (route && !canAccessRoute(route)) {
    return fallback || (
      <Alert className="m-4">
        <ShieldX className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this page.
        </AlertDescription>
      </Alert>
    );
  }

  // Check module access if module is provided
  if (module && !canAccessModule(module as any)) {
    return fallback || (
      <Alert className="m-4">
        <ShieldX className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this module.
        </AlertDescription>
      </Alert>
    );
  }

  // Check permissions
  let hasRequiredPermissions = true;
  if (requiredPermissions.length > 0) {
    if (requireAll) {
      hasRequiredPermissions = hasAllPermissions(requiredPermissions);
    } else {
      hasRequiredPermissions = hasAnyPermission(requiredPermissions);
    }
  }

  // Check roles
  let hasRequiredRoles = true;
  if (requiredRoles.length > 0) {
    if (requireAll) {
      hasRequiredRoles = requiredRoles.every(role => hasRole(role));
    } else {
      hasRequiredRoles = requiredRoles.some(role => hasRole(role));
    }
  }

  // If user doesn't have required permissions or roles, show fallback
  if (!hasRequiredPermissions || !hasRequiredRoles) {
    return fallback || (
      <Alert className="m-4">
        <ShieldX className="h-4 w-4" />
        <AlertDescription>
          You don't have the required permissions to access this content.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;