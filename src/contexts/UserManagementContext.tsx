import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User } from '../services/authService/authService';
import { Role } from '../types/rolePermissionTypes';
import { 
  userService, 
  UserWithRoles, 
  UserListResponse, 
  CreateUserData, 
  UpdateUserData, 
  UserSearchParams 
} from '../services/userService/userService';

export interface UserManagementState {
  users: UserWithRoles[];
  selectedUser: UserWithRoles | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    usersPerPage: number;
  };
  filters: {
    search: string;
    status: string;
    role: string;
  };
}

type UserManagementAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USERS'; payload: UserListResponse }
  | { type: 'SET_SELECTED_USER'; payload: UserWithRoles | null }
  | { type: 'ADD_USER'; payload: UserWithRoles }
  | { type: 'UPDATE_USER'; payload: UserWithRoles }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_PAGINATION'; payload: Partial<UserManagementState['pagination']> }
  | { type: 'SET_FILTERS'; payload: Partial<UserManagementState['filters']> }
  | { type: 'RESET_STATE' };

const initialState: UserManagementState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    usersPerPage: 10,
  },
  filters: {
    search: '',
    status: 'all',
    role: 'all',
  },
};

function userManagementReducer(
  state: UserManagementState,
  action: UserManagementAction
): UserManagementState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload.data as UserWithRoles[],
        pagination: {
          ...state.pagination,
          totalUsers: action.payload.total,
          totalPages: action.payload.last_page,
          currentPage: action.payload.current_page,
          usersPerPage: action.payload.per_page,
        },
        loading: false,
        error: null,
      };
    
    case 'SET_SELECTED_USER':
      return { ...state, selectedUser: action.payload };
    
    case 'ADD_USER':
      return {
        ...state,
        users: [action.payload, ...(state.users || [])],
        pagination: {
          ...state.pagination,
          totalUsers: state.pagination.totalUsers + 1,
        },
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        users: (state.users || []).map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
        selectedUser: state.selectedUser?.id === action.payload.id ? action.payload : state.selectedUser,
      };
    
    case 'DELETE_USER':
      return {
        ...state,
        users: (state.users || []).filter(user => user.id !== action.payload),
        selectedUser: state.selectedUser?.id === action.payload ? null : state.selectedUser,
        pagination: {
          ...state.pagination,
          totalUsers: state.pagination.totalUsers - 1,
        },
      };
    
    case 'SET_PAGINATION':
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };
    
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

export interface UserManagementContextType {
  state: UserManagementState;
  
  // User CRUD operations
  fetchUsers: (params?: UserSearchParams) => Promise<void>;
  createUser: (userData: CreateUserData) => Promise<boolean>;
  updateUser: (userId: string, userData: UpdateUserData) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  getUserById: (userId: string) => Promise<UserWithRoles | null>;
  
  // Role management
  assignRoleToUser: (userId: string, roleId: number) => Promise<boolean>;
  removeRoleFromUser: (userId: string, roleId: number) => Promise<boolean>;
  getUserRoles: (userId: string) => Promise<Role[]>;
  
  // Search and filtering
  searchUsers: (params: UserSearchParams) => Promise<void>;
  setFilters: (filters: Partial<UserManagementState['filters']>) => void;
  clearFilters: () => void;
  
  // UI state management
  setSelectedUser: (user: UserWithRoles | null) => void;
  setCurrentPage: (page: number) => void;
  setUsersPerPage: (count: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Bulk operations
  bulkDeleteUsers: (userIds: string[]) => Promise<boolean>;
  bulkAssignRole: (userIds: string[], roleId: number) => Promise<boolean>;
  bulkRemoveRole: (userIds: string[], roleId: number) => Promise<boolean>;
}

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

export interface UserManagementProviderProps {
  children: ReactNode;
}

export const UserManagementProvider: React.FC<UserManagementProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userManagementReducer, initialState);

  const fetchUsers = async (params?: UserSearchParams) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const searchParams = {
        page: state.pagination.currentPage,
        limit: state.pagination.usersPerPage,
        ...params,
      };
      
      const response = await userService.getAllUsers(searchParams);
      if (response.success && response.data) {
        dispatch({ type: 'SET_USERS', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to fetch users' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch users' });
    }
  };

  const createUser = async (userData: CreateUserData): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await userService.createUser(userData);
      if (response.success && response.data) {
        dispatch({ type: 'ADD_USER', payload: response.data as UserWithRoles });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to create user' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create user' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateUser = async (userId: string, userData: UpdateUserData): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await userService.updateUser(userId, userData);
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_USER', payload: response.data as UserWithRoles });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to update user' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update user' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await userService.deleteUser(userId);
      if (response.success) {
        dispatch({ type: 'DELETE_USER', payload: userId });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to delete user' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete user' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getUserById = async (userId: string): Promise<UserWithRoles | null> => {
    try {
      const response = await userService.getUserById(userId);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const assignRoleToUser = async (userId: string, roleId: number): Promise<boolean> => {
    try {
      const response = await userService.assignRoleToUser(userId, { role_id: roleId });
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_USER', payload: response.data });
        return true;
      }
      dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to assign role' });
      return false;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to assign role' });
      return false;
    }
  };

  const removeRoleFromUser = async (userId: string, roleId: number): Promise<boolean> => {
    try {
      const response = await userService.removeRoleFromUser(userId, roleId);
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_USER', payload: response.data });
        return true;
      }
      dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to remove role' });
      return false;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove role' });
      return false;
    }
  };

  const getUserRoles = async (userId: string): Promise<Role[]> => {
    try {
      const response = await userService.getUserRoles(userId);
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      return [];
    }
  };

  const searchUsers = async (params: UserSearchParams) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await userService.searchUsers(params);
      if (response.success && response.data) {
        dispatch({ type: 'SET_USERS', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Search failed' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Search failed' });
    }
  };

  const setFilters = (filters: Partial<UserManagementState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearFilters = () => {
    dispatch({ 
      type: 'SET_FILTERS', 
      payload: { search: '', status: 'all', role: 'all' } 
    });
  };

  const setSelectedUser = (user: UserWithRoles | null) => {
    dispatch({ type: 'SET_SELECTED_USER', payload: user });
  };

  const setCurrentPage = (page: number) => {
    dispatch({ type: 'SET_PAGINATION', payload: { currentPage: page } });
  };

  const setUsersPerPage = (count: number) => {
    dispatch({ type: 'SET_PAGINATION', payload: { usersPerPage: count } });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const bulkDeleteUsers = async (userIds: string[]): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const deletePromises = userIds.map(id => userService.deleteUser(id));
      const results = await Promise.allSettled(deletePromises);
      
      const successfulDeletes = results
        .map((result, index) => ({ result, id: userIds[index] }))
        .filter(({ result }) => result.status === 'fulfilled' && result.value.success)
        .map(({ id }) => id);

      successfulDeletes.forEach(id => {
        dispatch({ type: 'DELETE_USER', payload: id });
      });

      return successfulDeletes.length > 0;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Bulk delete failed' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const bulkAssignRole = async (userIds: string[], roleId: number): Promise<boolean> => {
    try {
      const assignPromises = userIds.map(id => 
        userService.assignRoleToUser(id, { role_id: roleId })
      );
      const results = await Promise.allSettled(assignPromises);
      
      const successfulAssigns = results.filter(
        result => result.status === 'fulfilled' && result.value.success
      );

      return successfulAssigns.length > 0;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Bulk role assignment failed' });
      return false;
    }
  };

  const bulkRemoveRole = async (userIds: string[], roleId: number): Promise<boolean> => {
    try {
      const removePromises = userIds.map(id => 
        userService.removeRoleFromUser(id, roleId)
      );
      const results = await Promise.allSettled(removePromises);
      
      const successfulRemovals = results.filter(
        result => result.status === 'fulfilled' && result.value.success
      );

      return successfulRemovals.length > 0;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Bulk role removal failed' });
      return false;
    }
  };

  const contextValue: UserManagementContextType = {
    state,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    assignRoleToUser,
    removeRoleFromUser,
    getUserRoles,
    searchUsers,
    setFilters,
    clearFilters,
    setSelectedUser,
    setCurrentPage,
    setUsersPerPage,
    setLoading,
    setError,
    bulkDeleteUsers,
    bulkAssignRole,
    bulkRemoveRole,
  };

  return (
    <UserManagementContext.Provider value={contextValue}>
      {children}
    </UserManagementContext.Provider>
  );
};

export const useUserManagement = (): UserManagementContextType => {
  const context = useContext(UserManagementContext);
  if (!context) {
    throw new Error('useUserManagement must be used within a UserManagementProvider');
  }
  return context;
};

