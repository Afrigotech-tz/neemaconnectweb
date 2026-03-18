import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  Search,
  MoreHorizontal,
} from 'lucide-react';
import { permissionService } from '@/services/permissionService/permissionService';
import { Permission } from '@/types/rolePermissionTypes';
import { useToast } from '@/hooks/use-toast';

const PermissionsList: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      const response = await permissionService.getPermissions();
      if (response.success && response.data) {
        setPermissions(Array.isArray(response.data) ? response.data : []);
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to load permissions',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load permissions',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePermission = async (permissionId: number, permissionName: string) => {
    if (!confirm(`Are you sure you want to delete the permission "${permissionName}"?`)) {
      return;
    }

    try {
      const response = await permissionService.deletePermission(permissionId);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Permission deleted successfully',
        });
        loadPermissions();
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to delete permission',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete permission',
      });
    }
  };

  const filteredPermissions = Array.isArray(permissions)
    ? permissions.filter(permission =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.module.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Group permissions by module
  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    const module = permission.module || 'Other';
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Permissions</h1>
          <p className="text-base-content/60 mt-2">
            Manage system permissions and access controls
          </p>
        </div>
        <Link to="/dashboard/permissions/create" className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Permission
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/50" />
              <input
                type="text"
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Permissions by Module */}
      {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
        <div key={module} className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2 text-xl text-base-content">
              <Shield className="h-5 w-5" />
              {module} ({modulePermissions.length})
            </h2>
            <p className="text-base-content/60">Permissions for the {module.toLowerCase()} module</p>
            <div className="divider"></div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Permission</th>
                    <th>Display Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {modulePermissions.map((permission) => (
                    <tr key={permission.id} className="hover">
                      <td>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-base-content/50" />
                          <code className="text-sm bg-base-200 px-2 py-1 rounded">
                            {permission.name}
                          </code>
                        </div>
                      </td>
                      <td>{permission.display_name}</td>
                      <td className="max-w-xs truncate">{permission.description}</td>
                      <td>
                        <span className={`badge ${permission.is_active ? 'badge-success' : 'badge-warning'}`}>
                          {permission.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="dropdown dropdown-end">
                          <Button variant="ghost" size="sm" className="btn btn-ghost btn-xs">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-48 border border-base-300">
                            <li>
                              <Link to={`/dashboard/permissions/edit/${permission.id}`}>
                                <Edit className="h-4 w-4" />
                                Edit
                              </Link>
                            </li>
                            <li className="border-t border-base-300 mt-2 pt-2">
                              <a 
                                onClick={() => handleDeletePermission(permission.id, permission.name)}
                                className="text-error"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}

      {filteredPermissions.length === 0 && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body text-center py-8">
            <p className="text-base-content/60">
              {searchTerm ? 'No permissions found matching your search' : 'No permissions found'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionsList;

