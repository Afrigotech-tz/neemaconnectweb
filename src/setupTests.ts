import '@testing-library/jest-dom';

// Mock the useToast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock the roleService
jest.mock('@/services/roleService', () => ({
  roleService: {
    getRoles: jest.fn().mockResolvedValue({
      success: true,
      data: [
        {
          id: 1,
          name: 'admin',
          display_name: 'Administrator',
          description: 'System administrator with full access',
          is_active: true,
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
          permissions: []
        },
        {
          id: 2,
          name: 'user',
          display_name: 'Regular User',
          description: 'Standard user with limited access',
          is_active: true,
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
          permissions: []
        }
      ]
    }),
    getRole: jest.fn().mockResolvedValue({
      success: true,
      data: {
        id: 1,
        name: 'admin',
        display_name: 'Administrator',
        description: 'System administrator with full access',
        is_active: true,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
        permissions: []
      }
    }),
    createRole: jest.fn().mockResolvedValue({ success: true }),
    updateRole: jest.fn().mockResolvedValue({ success: true }),
    deleteRole: jest.fn().mockResolvedValue({ success: true }),
    getPermissions: jest.fn().mockResolvedValue({
      success: true,
      data: [
        {
          id: 1,
          name: 'users.create',
          display_name: 'Create Users',
          module: 'users',
          description: 'Create new user accounts'
        },
        {
          id: 2,
          name: 'users.read',
          display_name: 'View Users',
          module: 'users',
          description: 'View user accounts'
        }
      ]
    }),
    updateRolePermissions: jest.fn().mockResolvedValue({ success: true })
  }
}));

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn().mockImplementation(({ queryFn }) => ({
    data: queryFn(),
    isLoading: false,
    error: null,
  })),
  useMutation: jest.fn().mockImplementation(() => ({
    mutate: jest.fn(),
    isLoading: false,
    error: null,
  })),
}));
