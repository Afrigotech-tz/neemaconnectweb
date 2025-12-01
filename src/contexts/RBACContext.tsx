import{ createContext } from 'react';
import { Role, Permission } from '../types/rolePermissionTypes';


export interface RBACContextType {
  userRoles: Role[];
  userPermissions: Permission[];
  allRoles: Role[];
  allPermissions: Permission[];
  loading: boolean;
  hasRole: (roleName: string) => boolean;
  hasPermission: (permission: string, module?: string) => boolean;
  hasAnyRole: (roleNames: string[]) => boolean;
  hasAnyPermission: (permissions: string[], module?: string) => boolean;
  hasAllRoles: (roleNames: string[]) => boolean;
  hasAllPermissions: (permissions: string[], module?: string) => boolean;
  refreshRoles: () => Promise<void>;
  refreshPermissions: () => Promise<void>;
}

export const RBACContext = createContext<RBACContextType | undefined>(undefined);



