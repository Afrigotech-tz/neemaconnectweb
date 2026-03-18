import { Permission } from './rolePermissionTypes';
import { User } from '@/services/authService/authService';

export interface Department {
  id: number;
  name: string;
  description?: string | null;
  is_active?: boolean;
  permissions?: Permission[];
  users?: User[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateDepartmentData {
  name: string;
  description?: string;
  is_active?: boolean;
  permission_ids?: number[];
}

export interface UpdateDepartmentData {
  name: string;
  description?: string;
  is_active?: boolean;
  permission_ids?: number[];
}

export interface AssignDepartmentPermissionData {
  permission_id: number | number[];
}

export interface AssignDepartmentUserData {
  user_id: number | number[];
}

export interface UpdateDepartmentPermissionsData {
  permission_ids: number[];
}
