import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { roleService } from '@/services/roleService';
import { Role, CreateRoleData, UpdateRoleData } from '@/types/rolePermissionTypes';
import { Plus, Edit, Trash2, Shield, Settings } from 'lucide-react';

const RolesList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', display_name: '', description: '', is_active: true });
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
        });
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch roles. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    if (!formData.name.trim() || !formData.display_name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Role name and display name are required.',
      });
      return;
    }

    try {
      const roleData: CreateRoleData = {
        name: formData.name,
        display_name: formData.display_name,
        description: formData.description,
        is_active: formData.is_active,
      };

      const response = await roleService.createRole(roleData);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Role created successfully.',
        });
        setIsCreateModalOpen(false);
        setFormData({ name: '', display_name: '', description: '', is_active: true });
        fetchRoles();
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to create role.',
        });
      }
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to create role. Please try again.',
      });
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedRole || !formData.name.trim() || !formData.display_name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Role name and display name are required.',
      });
      return;
    }

    try {
      const roleData: UpdateRoleData = {
        name: formData.name,
        display_name: formData.display_name,
        description: formData.description,
        is_active: formData.is_active,
      };

      const response = await roleService.updateRole(selectedRole.id, roleData);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Role updated successfully.',
        });
        setIsEditModalOpen(false);
        setSelectedRole(null);
        setFormData({ name: '', display_name: '', description: '', is_active: true });
        fetchRoles();
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to update role.',
        });
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update role. Please try again.',
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
        setIsDeleteModalOpen(false);
        setSelectedRole(null);
        fetchRoles();
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to delete role.',
        });
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete role. Please try again.',
      });
    }
  };

  const openEditModal = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      display_name: role.display_name,
      description: role.description || '',
      is_active: role.is_active,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', display_name: '', description: '', is_active: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" data-theme="neemadmin">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-theme="neemadmin">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Roles Management</h1>
          <p className="text-base-content/60 mt-2">
            Manage user roles and their permissions
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2 text-xl text-base-content">
            <Shield className="h-5 w-5" />
            Roles List
          </h2>
          <p className="text-base-content/60">View and manage all user roles in the system</p>
          
          {roles.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-base-content/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-base-content mb-2">No roles found</h3>
              <p className="text-base-content/60 mb-4">Get started by creating your first role.</p>
              <Button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Permissions</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.id} className="hover">
                      <td className="font-medium">{role.name}</td>
                      <td>{role.description || 'No description'}</td>
                      <td>
                        <span className="badge badge-ghost">
                          {role.permissions?.length || 0} permissions
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${role.is_active ? 'badge-success' : 'badge-warning'}`}>
                          {role.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/dashboard/roles/view/${role.id}`}
                            className="btn btn-ghost btn-xs"
                          >
                            <Settings className="h-4 w-4" />
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(role)}
                            className="btn btn-ghost btn-xs"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteModal(role)}
                            className="btn btn-ghost btn-xs text-error"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Role Modal */}
      <dialog className={`modal ${isCreateModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create New Role</h3>
          <p className="text-sm text-base-content/60 py-2">Add a new role with specific permissions</p>
          <div className="space-y-4 py-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Role Name</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., content_editor"
                className="input input-bordered"
              />
              <label className="label">
                <span className="label-text-alt">Use lowercase letters and underscores only</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Display Name</span>
              </label>
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="e.g., Content Editor"
                className="input input-bordered"
              />
              <label className="label">
                <span className="label-text-alt">Human-readable name for the role</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter role description"
                className="textarea textarea-bordered"
                rows={3}
              />
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Active</span>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="toggle toggle-primary"
                />
              </label>
            </div>
          </div>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreateRole}>Create Role</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>close</button>
        </form>
      </dialog>

      {/* Edit Role Modal */}
      <dialog className={`modal ${isEditModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Role</h3>
          <p className="text-sm text-base-content/60 py-2">Update role information</p>
          <div className="space-y-4 py-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Role Name</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., content_editor"
                className="input input-bordered"
              />
              <label className="label">
                <span className="label-text-alt">Use lowercase letters and underscores only</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Display Name</span>
              </label>
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="e.g., Content Editor"
                className="input input-bordered"
              />
              <label className="label">
                <span className="label-text-alt">Human-readable name for the role</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter role description"
                className="textarea textarea-bordered"
                rows={3}
              />
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Active</span>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="toggle toggle-primary"
                />
              </label>
            </div>
          </div>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => { setIsEditModalOpen(false); setSelectedRole(null); resetForm(); }}>Cancel</button>
            <button className="btn btn-primary" onClick={handleUpdateRole}>Update Role</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => { setIsEditModalOpen(false); setSelectedRole(null); resetForm(); }}>close</button>
        </form>
      </dialog>

      {/* Delete Role Modal */}
      <dialog className={`modal ${isDeleteModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Role</h3>
          <p className="py-4">
            Are you sure you want to delete the role "{selectedRole?.name}"? This action cannot be undone.
          </p>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
            <button className="btn btn-error" onClick={handleDeleteRole}>Delete Role</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsDeleteModalOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default RolesList;

