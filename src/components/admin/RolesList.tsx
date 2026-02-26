import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { roleService } from '@/services/roleService';
import { Role, CreateRoleData, UpdateRoleData } from '@/types/rolePermissionTypes';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Settings, 
  Search,
  RefreshCw,
  Users,
  ShieldCheck,
  ShieldAlert,
  MoreHorizontal,
  Eye,
  ToggleLeft,
  ToggleRight,
  X,
  Check
} from 'lucide-react';

const RolesList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({ name: '', display_name: '', description: '', is_active: true });
  const { toast } = useToast();

  // Stats
  const stats = {
    total: roles.length,
    active: roles.filter(r => r.is_active).length,
    inactive: roles.filter(r => !r.is_active).length,
    permissions: roles.reduce((acc, r) => acc + (r.permissions?.length || 0), 0)
  };

  // Filter roles
  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      role.display_name?.toLowerCase().includes(searchInput.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchInput.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && role.is_active) ||
      (statusFilter === 'inactive' && !role.is_active);
    return matchesSearch && matchesStatus;
  });

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
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch roles. Please try again.',
        variant: 'destructive'
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
        variant: 'destructive'
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
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to create role. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedRole || !formData.name.trim() || !formData.display_name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Role name and display name are required.',
        variant: 'destructive'
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
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update role. Please try again.',
        variant: 'destructive'
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
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete role. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const toggleRoleStatus = async (role: Role) => {
    try {
      const roleData: UpdateRoleData = {
        name: role.name,
        display_name: role.display_name,
        description: role.description,
        is_active: !role.is_active,
      };
      const response = await roleService.updateRole(role.id, roleData);
      if (response.success) {
        toast({
          title: 'Success',
          description: `Role ${role.is_active ? 'deactivated' : 'activated'} successfully.`,
        });
        fetchRoles();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update role status.',
        variant: 'destructive'
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
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-orange-500 to-secondary p-6 text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Roles Management</h1>
              <p className="text-white/80">Manage user roles and their permissions</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchRoles} className="btn btn-outline bg-white/20 border-white/30 text-white hover:bg-white/30">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)} className="btn btn-secondary gap-2 shadow-lg">
              <Plus className="h-4 w-4" />
              Create Role
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
              <Shield className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-base-content mt-4">{stats.total}</p>
          <p className="text-sm text-base-content/60">Total Roles</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
              <ShieldCheck className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600 mt-4">{stats.active}</p>
          <p className="text-sm text-base-content/60">Active Roles</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
              <ShieldAlert className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600 mt-4">{stats.inactive}</p>
          <p className="text-sm text-base-content/60">Inactive Roles</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-600 mt-4">{stats.permissions}</p>
          <p className="text-sm text-base-content/60">Total Permissions</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/50" />
              <input
                type="text"
                placeholder="Search roles by name, display name or description..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input input-bordered w-full pl-10 h-12"
              />
            </div>
            <select 
              className="select select-bordered h-12 min-w-[150px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Roles Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="bg-base-100">
                <th className="font-bold">Role</th>
                <th className="font-bold">Description</th>
                <th className="font-bold">Permissions</th>
                <th className="font-bold">Status</th>
                <th className="text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => (
                <tr key={role.id} className="hover transition-colors">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-gradient-to-br from-primary to-orange-500 text-white rounded-full w-12">
                          <span className="text-lg">{role.name.charAt(0).toUpperCase()}</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-base-content">{role.display_name || role.name}</div>
                        <div className="text-sm text-base-content/60">{role.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-base-content/70 max-w-xs truncate block">
                      {role.description || 'No description'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-outline badge-lg">{role.permissions?.length || 0} permissions</span>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleRoleStatus(role)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        role.is_active 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {role.is_active ? (
                        <>
                          <ToggleRight className="h-4 w-4" />
                          Active
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-4 w-4" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/dashboard/roles/view/${role.id}`}
                        className="btn btn-ghost btn-xs"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(role)} className="btn btn-ghost btn-xs">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openDeleteModal(role)} className="btn btn-ghost btn-xs text-error">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRoles.length === 0 && (
          <div className="text-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-base-200 rounded-full">
                <Shield className="h-12 w-12 text-base-content/40" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-base-content">No roles found</h3>
                <p className="text-sm text-base-content/60 max-w-sm">
                  {searchInput || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'Get started by creating your first role.'}
                </p>
              </div>
              {!searchInput && statusFilter === 'all' && (
                <Button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Role
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Role Modal */}
      <dialog className={`modal ${isCreateModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl">Create New Role</h3>
            <button 
              onClick={() => { setIsCreateModalOpen(false); resetForm(); }} 
              className="btn btn-ghost btn-sm btn-circle"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-base-content/60 mb-6">Add a new role with specific permissions</p>
          
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Role Name *</span>
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
                <span className="label-text font-medium">Display Name *</span>
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
                <span className="label-text font-medium">Description</span>
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
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Active</span>
              </label>
            </div>
          </div>
          
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateRole}>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>close</button>
        </form>
      </dialog>

      {/* Edit Role Modal */}
      <dialog className={`modal ${isEditModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl">Edit Role</h3>
            <button 
              onClick={() => { setIsEditModalOpen(false); setSelectedRole(null); resetForm(); }} 
              className="btn btn-ghost btn-sm btn-circle"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-base-content/60 mb-6">Update role information</p>
          
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Role Name *</span>
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
                <span className="label-text font-medium">Display Name *</span>
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
                <span className="label-text font-medium">Description</span>
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
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Active</span>
              </label>
            </div>
          </div>
          
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => { setIsEditModalOpen(false); setSelectedRole(null); resetForm(); }}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleUpdateRole}>
              <Check className="h-4 w-4 mr-2" />
              Update Role
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => { setIsEditModalOpen(false); setSelectedRole(null); resetForm(); }}>close</button>
        </form>
      </dialog>

      {/* Delete Role Modal */}
      <dialog className={`modal ${isDeleteModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl text-error">Delete Role</h3>
            <button 
              onClick={() => setIsDeleteModalOpen(false)} 
              className="btn btn-ghost btn-sm btn-circle"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="py-6">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-error/10 rounded-full">
                <Trash2 className="h-12 w-12 text-error" />
              </div>
            </div>
            <p className="text-center text-base-content/80">
              Are you sure you want to delete the role <span className="font-bold">"{selectedRole?.name}"</span>?
            </p>
            <p className="text-center text-sm text-base-content/60 mt-2">
              This action cannot be undone. Users with this role may lose access.
            </p>
          </div>
          <div className="modal-action justify-center">
            <button className="btn btn-ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-error" onClick={handleDeleteRole}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Role
            </button>
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

