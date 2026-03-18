import { useCallback, useEffect } from 'react';
import { useUserManagement as useUserManagementContext } from '../contexts/UserManagementContext';
import { useToast } from './use-toast';
import { UserSearchParams, CreateUserData, UpdateUserData } from '../services/userService';

export const useUserManagement = () => {
  const context = useUserManagementContext();
  const { toast } = useToast();

  const {
    state,
    fetchUsers: contextFetchUsers,
    createUser: contextCreateUser,
    updateUser: contextUpdateUser,
    deleteUser: contextDeleteUser,
    getUserById,
    assignRoleToUser: contextAssignRole,
    removeRoleFromUser: contextRemoveRole,
    getUserRoles,
    searchUsers: contextSearchUsers,
    setFilters,
    clearFilters,
    setSelectedUser,
    setCurrentPage: contextSetCurrentPage,
    setUsersPerPage,
    setLoading,
    setError,
    bulkDeleteUsers: contextBulkDelete,
    bulkAssignRole,
    bulkRemoveRole,
  } = context;

  // Enhanced fetch users with toast notifications
  const fetchUsers = useCallback(async (params?: UserSearchParams, showToast = false) => {
    try {
      await contextFetchUsers(params);
      if (showToast) {
        toast({
          title: 'Success',
          description: 'Users loaded successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    }
  }, [contextFetchUsers, toast]);

  // Enhanced create user with validation and toast
  const createUser = useCallback(async (userData: CreateUserData) => {
    try {
      const success = await contextCreateUser(userData);
      if (success) {
        toast({
          title: 'Success',
          description: 'User created successfully',
        });
        await fetchUsers();
        return true;
      }
      return false;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create user',
        variant: 'destructive',
      });
      return false;
    }
  }, [contextCreateUser, fetchUsers, toast]);

  // Enhanced update user with toast notifications
  const updateUser = useCallback(async (userId: string, userData: UpdateUserData) => {
    try {
      const success = await contextUpdateUser(userId, userData);
      if (success) {
        toast({
          title: 'Success',
          description: 'User updated successfully',
        });
        return true;
      }
      return false;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      });
      return false;
    }
  }, [contextUpdateUser, toast]);

  // Enhanced delete user with confirmation and toast
  const deleteUser = useCallback(async (userId: string) => {
    try {
      const success = await contextDeleteUser(userId);
      if (success) {
        toast({
          title: 'Success',
          description: 'User deleted successfully',
        });
        return true;
      }
      return false;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
      return false;
    }
  }, [contextDeleteUser, toast]);

  // Enhanced role assignment with toast
  const assignRoleToUser = useCallback(async (userId: string, roleId: number) => {
    try {
      const success = await contextAssignRole(userId, roleId);
      if (success) {
        toast({
          title: 'Success',
          description: 'Role assigned successfully',
        });
        return true;
      }
      return false;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign role',
        variant: 'destructive',
      });
      return false;
    }
  }, [contextAssignRole, toast]);

  // Enhanced role removal with toast
  const removeRoleFromUser = useCallback(async (userId: string, roleId: number) => {
    try {
      const success = await contextRemoveRole(userId, roleId);
      if (success) {
        toast({
          title: 'Success',
          description: 'Role removed successfully',
        });
        return true;
      }
      return false;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove role',
        variant: 'destructive',
      });
      return false;
    }
  }, [contextRemoveRole, toast]);

  // Enhanced search with debouncing
  const searchUsers = useCallback(async (params: UserSearchParams) => {
    try {
      await contextSearchUsers(params);
      toast({
        title: 'Search Complete',
        description: `Found ${state.pagination.totalUsers} users`,
      });
    } catch (error) {
      toast({
        title: 'Search Failed',
        description: 'Failed to search users',
        variant: 'destructive',
      });
    }
  }, [contextSearchUsers, state.pagination.totalUsers, toast]);

  // Enhanced pagination with auto-fetch
  const setCurrentPage = useCallback(async (page: number) => {
    contextSetCurrentPage(page);
    await fetchUsers({ 
      page, 
      limit: state.pagination.usersPerPage,
      q: state.filters.search,
      status: state.filters.status !== 'all' ? state.filters.status : undefined,
      role: state.filters.role !== 'all' ? state.filters.role : undefined,
    });
  }, [contextSetCurrentPage, fetchUsers, state.pagination.usersPerPage, state.filters]);

  // Enhanced bulk operations
  const bulkDeleteUsers = useCallback(async (userIds: string[]) => {
    try {
      const success = await contextBulkDelete(userIds);
      if (success) {
        toast({
          title: 'Success',
          description: `Successfully deleted ${userIds.length} users`,
        });
        await fetchUsers();
        return true;
      }
      return false;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete users',
        variant: 'destructive',
      });
      return false;
    }
  }, [contextBulkDelete, fetchUsers, toast]);

  // Bulk suspend/activate users
  const bulkSuspendUsers = useCallback(async (userIds: string[], suspend: boolean = true) => {
    try {
      const updatePromises = userIds.map(id => 
        updateUser(id, {
          status: suspend ? 'inactive' : 'active',
        })
      );
      await Promise.all(updatePromises);
      
      toast({
        title: 'Success',
        description: `Successfully ${suspend ? 'suspended' : 'activated'} ${userIds.length} users`,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${suspend ? 'suspend' : 'activate'} users`,
        variant: 'destructive',
      });
      return false;
    }
  }, [updateUser, toast]);

  // Filter management
  const applyFilters = useCallback(async (filters: Partial<typeof state.filters>) => {
    setFilters(filters);
    await fetchUsers({
      page: 1,
      limit: state.pagination.usersPerPage,
      q: filters.search || state.filters.search,
      status: (filters.status || state.filters.status) !== 'all' ? (filters.status || state.filters.status) : undefined,
      role: (filters.role || state.filters.role) !== 'all' ? (filters.role || state.filters.role) : undefined,
    });
  }, [setFilters, fetchUsers, state]);

  const resetFiltersAndFetch = useCallback(async () => {
    clearFilters();
    await fetchUsers({ page: 1, limit: state.pagination.usersPerPage });
  }, [clearFilters, fetchUsers, state.pagination.usersPerPage]);

  // Auto-fetch on component mount
  useEffect(() => {
    if (state.users?.length === 0 && !state.loading) {
      fetchUsers();
    }
  }, [state.users?.length, state.loading, fetchUsers]);

  // Computed values
  const filteredUsers = state.users || [];
  const hasUsers = (state.users?.length || 0) > 0;
  const hasSelection = state.selectedUser !== null;
  const isFirstPage = state.pagination.currentPage === 1;
  const isLastPage = state.pagination.currentPage >= state.pagination.totalPages;

  // Statistics
  const userStats = {
    total: state.pagination.totalUsers,
    active: (state.users || []).filter(u => u.status === 'active').length,
    inactive: (state.users || []).filter(u => u.status !== 'active').length,
    admins: (state.users || []).filter(u => 
      u.roles?.some(r => r.name === 'admin' || r.name === 'super_admin')
    ).length,
  };

  return {
    // State
    users: state.users || [],
    selectedUser: state.selectedUser,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,
    
    // Computed
    filteredUsers,
    hasUsers,
    hasSelection,
    isFirstPage,
    isLastPage,
    userStats,
    
    // Actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    assignRoleToUser,
    removeRoleFromUser,
    getUserRoles,
    searchUsers,
    
    // Filter and pagination
    setFilters: applyFilters,
    clearFilters: resetFiltersAndFetch,
    setSelectedUser,
    setCurrentPage,
    setUsersPerPage,
    setLoading,
    setError,
    
    // Bulk operations
    bulkDeleteUsers,
    bulkSuspendUsers,
    bulkAssignRole,
    bulkRemoveRole,
  };
};

// Specialized hook for user details/profile management
export const useUserDetails = (_userId?: string) => {
  const { getUserById, updateUser, getUserRoles } = useUserManagement();
  const { toast } = useToast();

  const fetchUserDetails = useCallback(async (id: string) => {
    try {
      const user = await getUserById(id);
      return user;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch user details',
        variant: 'destructive',
      });
      return null;
    }
  }, [getUserById, toast]);

  const updateUserProfile = useCallback(async (id: string, data: UpdateUserData) => {
    try {
      const success = await updateUser(id, data);
      if (success) {
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        });
      }
      return success;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
      return false;
    }
  }, [updateUser, toast]);

  const fetchUserRoles = useCallback(async (id: string) => {
    try {
      return await getUserRoles(id);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch user roles',
        variant: 'destructive',
      });
      return [];
    }
  }, [getUserRoles, toast]);

  return {
    fetchUserDetails,
    updateUserProfile,
    fetchUserRoles,
  };
};
