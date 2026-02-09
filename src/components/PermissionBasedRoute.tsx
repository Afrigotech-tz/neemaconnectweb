import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import PermissionGuard from './PermissionGuard';
import { MODULE_PERMISSIONS } from '@/config/routePermissions';

interface PermissionBasedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  requireAll?: boolean;
  redirectTo?: string;
  route?: string;
  module?: keyof typeof MODULE_PERMISSIONS;
}

const PermissionBasedRoute: React.FC<PermissionBasedRouteProps> = ({
  children,
  requiredPermissions,
  requiredRoles,
  requireAll = false,
  redirectTo = '/dashboard',
  route,
  module
}) => {
  const { user,loading: authLoading } = useAuth();
  const location = useLocation();


  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Use PermissionGuard to check permissions and show appropriate fallback
  return (
    <PermissionGuard
      requiredPermissions={requiredPermissions}
      requiredRoles={requiredRoles}
      requireAll={requireAll}
      route={route}
      module={module}
      fallback={<Navigate to={redirectTo} replace />}
    >
      {children}
    </PermissionGuard>
  );
};

export default PermissionBasedRoute;