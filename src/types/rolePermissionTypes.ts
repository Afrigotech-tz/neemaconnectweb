export interface Role {
  id: number;
  name: string;
  display_name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  display_name: string;
  description: string;
  module: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateRoleData {
  name: string;
  description: string;
  is_active?: boolean;
}

export type UpdateRoleData = Partial<CreateRoleData>;

export interface AssignPermissionData {
  role_id: number;
  permission_id: number;
}

export interface RolePermissionsData {
  role_id: number;
  permission_ids: number[];
}