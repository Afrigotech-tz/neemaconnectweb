import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import PermissionGuard from './PermissionGuard';

interface PermissionBasedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  requireAll?: boolean;
  redirectTo?: string;
  route?: string;
  module?: string;
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
  const { user } = useAuth();
  const location = useLocation();

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