import { useAuth } from "./useAuth";
import { useRBAC } from "./useRBAC";

interface UseRoleGuardProps {
  roles: string | string[];
  requireAll?: boolean;
}

export const useRoleGuard = ({ roles, requireAll = false }: UseRoleGuardProps) => {
  const { user } = useAuth();
  const { hasAnyRole, hasAllRoles, loading } = useRBAC();

  if (loading || !user) {
    return { hasAccess: false, loading };
  }

  const roleNames = Array.isArray(roles) ? roles : [roles];
  const hasAccess = requireAll ? hasAllRoles(roleNames) : hasAnyRole(roleNames);

  return { hasAccess, loading };
};