import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePermissions } from '@/hooks/usePermissions';
import PermissionGuard from '@/components/PermissionGuard';

// Example component showing different ways to use permissions
const PermissionExamples: React.FC = () => {
  const { 
    canView, 
    canCreate, 
    canEdit, 
    canDelete, 
    isAdmin, 
    isSuperAdmin,
    hasPermission 
  } = usePermissions();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Permission Examples</h1>
      
      {/* Example 1: Using permission hooks directly */}
      <Card>
        <CardHeader>
          <CardTitle>User Management Actions</CardTitle>
          <CardDescription>
            Buttons that show/hide based on specific permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-x-2">
          {canView('users') && (
            <Button variant="outline">View Users</Button>
          )}
          {canCreate('users') && (
            <Button variant="default">Add User</Button>
          )}
          {canEdit('users') && (
            <Button variant="secondary">Edit User</Button>
          )}
          {canDelete('users') && (
            <Button variant="destructive">Delete User</Button>
          )}
        </CardContent>
      </Card>

      {/* Example 2: Using PermissionGuard component */}
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>
            Content sections protected by PermissionGuard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PermissionGuard requiredPermissions={['view_products']}>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p>✅ You can view products</p>
            </div>
          </PermissionGuard>
          
          <PermissionGuard 
            requiredPermissions={['create_products']}
            fallback={
              <div className="p-4 bg-gray-50 rounded-lg">
                <p>❌ You don't have permission to create products</p>
              </div>
            }
          >
            <div className="p-4 bg-green-50 rounded-lg">
              <p>✅ You can create products</p>
              <Button className="mt-2">Create New Product</Button>
            </div>
          </PermissionGuard>
        </CardContent>
      </Card>

      {/* Example 3: Role-based content */}
      <Card>
        <CardHeader>
          <CardTitle>Role-Based Content</CardTitle>
          <CardDescription>
            Different content for different roles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSuperAdmin() && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <p>🔐 Super Admin Content: You have full system access</p>
            </div>
          )}
          
          {isAdmin() && !isSuperAdmin() && (
            <div className="p-4 bg-orange-50 rounded-lg">
              <p>🔧 Admin Content: You have administrative access</p>
            </div>
          )}
          
          {!isAdmin() && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p>👤 User Content: Standard user view</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Example 4: Module-based permissions */}
      <Card>
        <CardHeader>
          <CardTitle>News & Events Management</CardTitle>
          <CardDescription>
            Actions grouped by module permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <PermissionGuard module="news">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">News Management</h4>
                <div className="space-x-2">
                  {hasPermission('view_news') && <Button size="sm" variant="outline">View</Button>}
                  {hasPermission('create_news') && <Button size="sm">Create</Button>}
                  {hasPermission('edit_news') && <Button size="sm" variant="secondary">Edit</Button>}
                  {hasPermission('delete_news') && <Button size="sm" variant="destructive">Delete</Button>}
                </div>
              </div>
            </PermissionGuard>

            <PermissionGuard module="events">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Events Management</h4>
                <div className="space-x-2">
                  {hasPermission('view_events') && <Button size="sm" variant="outline">View</Button>}
                  {hasPermission('create_events') && <Button size="sm">Create</Button>}
                  {hasPermission('edit_events') && <Button size="sm" variant="secondary">Edit</Button>}
                  {hasPermission('delete_events') && <Button size="sm" variant="destructive">Delete</Button>}
                </div>
              </div>
            </PermissionGuard>
          </div>
        </CardContent>
      </Card>

      {/* Example 5: Complex permission combinations */}
      <Card>
        <CardHeader>
          <CardTitle>Complex Permission Logic</CardTitle>
          <CardDescription>
            Using multiple permissions with different logic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PermissionGuard 
            requiredPermissions={['edit_users', 'edit_roles']} 
            requireAll={true}
            fallback={<p className="text-gray-500">You need both user and role edit permissions</p>}
          >
            <div className="p-4 bg-green-50 rounded-lg">
              <p>✅ You can manage both users and roles</p>
            </div>
          </PermissionGuard>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionExamples;