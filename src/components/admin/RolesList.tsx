import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { roleService } from '@/services/roleService';
import { Role, CreateRoleData, UpdateRoleData } from '@/types/rolePermissionTypes';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';

const RolesList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', is_active: true });
  const { toast } = useToast();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await roleService.getRoles();
      if (response.success) {
        setRoles(response.data || []);
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to fetch roles.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch roles. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Role name is required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const roleData: CreateRoleData = {
        name: formData.name,
        description: formData.description,
        is_active: formData.is_active,
      };

      const response = await roleService.createRole(roleData);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Role created successfully.',
        });
        setIsCreateDialogOpen(false);
        setFormData({ name: '', description: '', is_active: true });
        fetchRoles();
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to create role.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to create role. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedRole || !formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Role name is required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const roleData: UpdateRoleData = {
        name: formData.name,
        description: formData.description,
        is_active: formData.is_active,
      };

      const response = await roleService.updateRole(selectedRole.id, roleData);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Role updated successfully.',
        });
        setIsEditDialogOpen(false);
        setSelectedRole(null);
        setFormData({ name: '', description: '', is_active: true });
        fetchRoles();
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to update role.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update role. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;

    try {
      const response = await roleService.deleteRole(selectedRole.id);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Role deleted successfully.',
        });
        setIsDeleteDialogOpen(false);
        setSelectedRole(null);
        fetchRoles();
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to delete role.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete role. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      is_active: role.is_active,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', is_active: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roles Management</h1>
          <p className="text-gray-600 mt-2">
            Manage user roles and their permissions
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Role
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Roles List
          </CardTitle>
          <CardDescription>
            View and manage all user roles in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {roles.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first role.</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description || 'No description'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {role.permissions?.length || 0} permissions
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={role.is_active ? 'default' : 'secondary'}>
                        {role.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(role)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(role)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Role Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Add a new role with specific permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter role name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter role description"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRole}>
                Create Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          setSelectedRole(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update role information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Role Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter role name"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter role description"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="edit-is_active">Active</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRole}>
                Update Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Role Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the role "{selectedRole?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRole}>
              Delete Role
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RolesList;
