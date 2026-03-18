import React, { useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { Role, Permission } from "../types/rolePermissionTypes";

import { roleService } from "../services/roleService/roleService";
import { permissionService } from "../services/permissionService/permissionService";
import { RBACContext, RBACContextType } from "@/contexts/RBACContext";

interface RBACProviderProps {
  children: ReactNode;
}

export const RBACProvider: React.FC<RBACProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const extractPermissionsFromRoles = (roles: Role[]): Permission[] => {
    const permissions: Permission[] = [];
    const permissionIds = new Set<number>();

    roles.forEach((role) => {
      role.permissions?.forEach((permission) => {
        if (!permissionIds.has(permission.id)) {
          permissions.push(permission);
          permissionIds.add(permission.id);
        }
      });
    });

    return permissions;
  };

  const loadUserRolesAndPermissions = useCallback(async () => {
    if (!user) {
      setUserRoles([]);
      setUserPermissions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const roles = user.roles || [];
      setUserRoles(roles);

      // Extract permissions from roles
      const rolePermissions = extractPermissionsFromRoles(roles);

      // If user data includes direct permissions array (from login response), use those
      // This handles the case where the API returns permissions directly in the user object
      const directPermissions: string[] = user.permissions || [];
      const directPermissionObjects = directPermissions.map(
        (permissionName) => ({
          id: 0, // Temporary ID for direct permissions
          name: permissionName,
          display_name: permissionName,
          description: "",
          module: permissionName.split("_").slice(1).join("_"), // Extract module from permission name
          is_active: true,
          created_at: "",
          updated_at: "",
        })
      );

      // Combine role permissions and direct permissions
      const allPermissions = [...rolePermissions, ...directPermissionObjects];

      // Remove duplicates based on permission name
      const uniquePermissions = allPermissions.filter(
        (permission, index, self) =>
          index === self.findIndex((p) => p.name === permission.name)
      );

      setUserPermissions(uniquePermissions);
    } catch (error) {
      console.error("Error loading user roles and permissions:", error);
      setUserRoles([]);
      setUserPermissions([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadAllRoles = useCallback(async () => {
    try {
      const response = await roleService.getRoles();
      if (response.success && response.data) {
        setAllRoles(response.data);
      }
    } catch (error) {
      console.error("Error loading all roles:", error);
    }
  }, []);

  const loadAllPermissions = useCallback(async () => {
    try {
      const response = await permissionService.getPermissions();
      if (response.success && response.data) {
        setAllPermissions(response.data);
      }
    } catch (error) {
      console.error("Error loading all permissions:", error);
    }
  }, []);

  useEffect(() => {
    loadUserRolesAndPermissions();

    // Only load all roles and permissions when user first logs in
    if (user && !allRoles.length && !allPermissions.length) {
      loadAllRoles();
      loadAllPermissions();
    }
  }, [
    user,
    allRoles.length,
    allPermissions.length,
    loadUserRolesAndPermissions,
    loadAllRoles,
    loadAllPermissions,
  ]);

  const hasRole = (roleName: string): boolean => {
    return userRoles.some(
      (role) => role.name.toLowerCase() === roleName.toLowerCase()
    );
  };

  const hasPermission = (permission: string, module?: string): boolean => {
    return userPermissions.some((perm) => {
      const permissionMatch =
        perm.name.toLowerCase() === permission.toLowerCase();
      const moduleMatch = module
        ? perm.module.toLowerCase() === module.toLowerCase()
        : true;
      return permissionMatch && moduleMatch;
    });
  };

  const hasAnyRole = (roleNames: string[]): boolean => {
    return roleNames.some((roleName) => hasRole(roleName));
  };

  const hasAnyPermission = (
    permissions: string[],
    module?: string
  ): boolean => {
    return permissions.some((permission) => hasPermission(permission, module));
  };

  const hasAllRoles = (roleNames: string[]): boolean => {
    return roleNames.every((roleName) => hasRole(roleName));
  };

  const hasAllPermissions = (
    permissions: string[],
    module?: string
  ): boolean => {
    return permissions.every((permission) => hasPermission(permission, module));
  };

  const refreshRoles = async (): Promise<void> => {
    await loadAllRoles();
    await loadUserRolesAndPermissions();
  };

  const refreshPermissions = async (): Promise<void> => {
    await loadAllPermissions();
    await loadUserRolesAndPermissions();
  };

  const value: RBACContextType = {
    userRoles,
    userPermissions,
    allRoles,
    allPermissions,
    loading,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    hasAllRoles,
    hasAllPermissions,
    refreshRoles,
    refreshPermissions,
  };

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
};
