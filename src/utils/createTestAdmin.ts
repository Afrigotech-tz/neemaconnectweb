// Development utility to create test admin user
// This should only be used in development environment

export const createTestAdminUser = () => {
  const testAdmin = {
    id: 'test-admin-001',
    first_name: 'Super',
    surname: 'Admin',
    email: 'admin@neema.test',
    phone: '255743871360',
    role: 'admin',
    roles: [
      { id: 1, name: 'super_admin', description: 'Super Administrator' },
      { id: 2, name: 'admin', description: 'Administrator' }
    ],
    profile: {
      profile_picture: null
    }
  };

  // Store in localStorage for development testing
  localStorage.setItem('test_admin_user', JSON.stringify(testAdmin));
  localStorage.setItem('auth_token', 'test-admin-token');
  
  return testAdmin;
};

export const isTestAdminUser = (user: any) => {
  return user?.id === 'test-admin-001' || user?.phone === '255743871360';
};

// Development helper to grant admin access to current user
export const grantTestAdminAccess = (currentUser: any) => {
  if (!currentUser) return null;
  
  return {
    ...currentUser,
    role: 'admin',
    roles: [
      { id: 1, name: 'super_admin', description: 'Super Administrator' },
      { id: 2, name: 'admin', description: 'Administrator' }
    ]
  };
};
