import React, { useState } from 'react';
import { UserWithRoles } from '@/services/userService/userService';
import { Role } from '@/types/rolePermissionTypes';
import { Button } from "@/components/ui/button";
import {
  Search,
  MoreHorizontal,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  ShieldCheck,
  Eye,
  Download,
  RefreshCw,
  Users,
  UserPlus,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';
import { useUserManagement } from '@/hooks/useUserManagement';
import UserDetailsDialog from './UserDetailsDialog';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import RadioPagination from '@/components/ui/radio-pagination';

const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const {
    users,
    selectedUser,
    loading,
    pagination,
    filters,
    userStats,
    filteredUsers,
    fetchUsers,
    deleteUser,
    setFilters,
    clearFilters,
    setSelectedUser,
    setCurrentPage,
    bulkDeleteUsers,
    bulkSuspendUsers,
  } = useUserManagement();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);
  const [statusFilter, setStatusFilter] = useState(filters.status);
  const [roleFilter, setRoleFilter] = useState(filters.role);

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleSuspendUser = async () => {
    if (!selectedUser) return;
    const suspend = selectedUser.status === 'active';
    try {
      await bulkSuspendUsers([selectedUser.id], suspend);
    } finally {
      setSuspendDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleBulkAction = async (action: 'suspend' | 'activate' | 'delete') => {
    if (selectedUsers.length === 0) return;
    setBulkActionLoading(true);
    try {
      switch (action) {
        case 'suspend':
          await bulkSuspendUsers(selectedUsers, true);
          break;
        case 'activate':
          await bulkSuspendUsers(selectedUsers, false);
          break;
        case 'delete':
          await bulkDeleteUsers(selectedUsers);
          break;
      }
      setSelectedUsers([]);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSearch = () => {
    setFilters({ search: searchInput });
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className={`badge badge-lg ${status === 'active' ? 'badge-success' : 'badge-warning'} px-3`}>
        {status}
      </span>
    );
  };

  const getRoleBadge = (roles: Role[]) => {
    if (!roles || roles.length === 0) {
      return <span className="badge badge-ghost text-xs">No Role</span>;
    }
    
    const visibleRoles = roles.slice(0, 2);
    const remainingCount = roles.length - 2;
    
    return (
      <div className="flex flex-wrap gap-1">
        {visibleRoles.map(role => (
          <span 
            key={role.id} 
            className={`badge badge-md ${role.name === 'super_admin' ? 'badge-error' : 'badge-info'}`}
          >
            {role.name}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="badge badge-ghost badge-md">
            +{remainingCount}
          </span>
        )}
      </div>
    );
  };

  const getInitials = (firstName: string, surname: string) => {
    return `${firstName?.charAt(0) || ''}${surname?.charAt(0) || ''}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOC04LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-white/80">Manage users, roles, and permissions</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => fetchUsers()} className="btn btn-outline bg-white/20 border-white/30 text-white hover:bg-white/30">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => navigate('/dashboard/users/add')} className="btn btn-secondary gap-2 shadow-lg">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-base-content mt-4">{userStats.total}</p>
          <p className="text-sm text-base-content/60">Total Users</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
              <UserCheck className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600 mt-4">{userStats.active}</p>
          <p className="text-sm text-base-content/60">Active Users</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
              <UserX className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600 mt-4">{userStats.inactive}</p>
          <p className="text-sm text-base-content/60">Inactive Users</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
              <Shield className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-600 mt-4">{userStats.admins}</p>
          <p className="text-sm text-base-content/60">Admins</p>
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
                placeholder="Search users by name, email, or phone..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="input input-bordered w-full pl-10 h-12"
              />
            </div>
            <Button onClick={handleSearch} className="btn btn-primary h-12 px-6">
              Search
            </Button>
          </div>
          <div className="flex gap-2">
            <select 
              className="select select-bordered h-12 min-w-[150px]"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setFilters({ status: e.target.value });
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
            <select 
              className="select select-bordered h-12 min-w-[150px]"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setFilters({ role: e.target.value });
              }}
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <Button variant="outline" className="btn btn-outline h-12">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 p-4 bg-primary/10 rounded-xl border border-primary/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="font-medium text-base-content">
              {selectedUsers.length} user(s) selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('activate')} className="btn btn-outline btn-sm">
                <UserCheck className="h-4 w-4 mr-1" />
                Activate
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('suspend')} className="btn btn-outline btn-sm">
                <UserX className="h-4 w-4 mr-1" />
                Suspend
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')} className="btn btn-error btn-sm">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="bg-base-100">
                <th className="w-12">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="font-bold">User</th>
                <th className="font-bold">Email</th>
                <th className="font-bold">Roles</th>
                <th className="font-bold">Status</th>
                <th className="font-bold">Created</th>
                <th className="text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover transition-colors">
                  <th>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                    />
                  </th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-gradient-to-br from-primary to-orange-500 text-white rounded-full w-12">
                          <span className="text-lg">{getInitials(user.first_name, user.surname)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-base-content">
                          {user.first_name} {user.surname}
                        </div>
                        <div className="text-sm text-base-content/60 flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phone_number}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-base-content/70">
                      <Mail className="h-4 w-4" />
                      <span className="max-w-48 truncate">{user.email}</span>
                    </div>
                  </td>
                  <td>{getRoleBadge(user.roles)}</td>
                  <td>{getStatusBadge(user.status)}</td>
                  <td>
                    <div className="flex items-center gap-2 text-base-content/60">
                      <Calendar className="h-4 w-4" />
                      {formatDate(user.created_at)}
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="btn btn-ghost btn-xs" onClick={() => { setSelectedUser(user); setUserDetailsOpen(true); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <div className="dropdown dropdown-end">
                        <Button variant="ghost" size="sm" className="btn btn-ghost btn-xs">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-100 rounded-box w-56 border border-base-200">
                          <li><a onClick={() => { setSelectedUser(user); setUserDetailsOpen(true); }}><Eye className="h-4 w-4" /> View Details</a></li>
                          <li><a onClick={() => { setSelectedUser(user); setSuspendDialogOpen(true); }}>{user.status === 'active' ? <><UserX className="h-4 w-4" /> Suspend</> : <><UserCheck className="h-4 w-4" /> Activate</>}</a></li>
                          <li className="border-t border-base-200 mt-2 pt-2"><a onClick={() => { setSelectedUser(user); setDeleteDialogOpen(true); }} className="text-error"><Trash2 className="h-4 w-4" /> Delete</a></li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-base-200 rounded-full">
                <Users className="h-12 w-12 text-base-content/40" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-base-content">No users found</h3>
                <p className="text-sm text-base-content/60 max-w-sm">
                  {filters.search || filters.status !== 'all' || filters.role !== 'all' ? 'Try adjusting your search or filter criteria.' : 'No users have been registered yet.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-base-content/60">
            Showing{" "}
            {pagination.totalUsers > 0
              ? (pagination.currentPage - 1) * pagination.usersPerPage + 1
              : 0}
            -
            {Math.min(
              pagination.currentPage * pagination.usersPerPage,
              pagination.totalUsers
            )}{" "}
            of {pagination.totalUsers} users
          </p>
          <RadioPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(page) => void setCurrentPage(page)}
          />
        </div>
      )}

      {/* User Details Dialog */}
      <UserDetailsDialog
        user={selectedUser}
        open={userDetailsOpen}
        onOpenChange={setUserDetailsOpen}
        onUserUpdate={fetchUsers}
      />

      {/* Delete Confirmation Modal */}
      <dialog className={`modal ${deleteDialogOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure?</h3>
          <p className="py-4">This action cannot be undone. This will permanently delete the user account for {selectedUser?.first_name} {selectedUser?.surname}.</p>
          <div className="modal-action">
            <button className="btn" onClick={() => setDeleteDialogOpen(false)}>Cancel</button>
            <button className="btn btn-error" onClick={handleDeleteUser}>Delete</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setDeleteDialogOpen(false)}>close</button></form>
      </dialog>

      {/* Suspend/Activate Confirmation Modal */}
      <dialog className={`modal ${suspendDialogOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">{selectedUser?.status === 'active' ? 'Suspend User' : 'Activate User'}</h3>
          <p className="py-4">Are you sure you want to {selectedUser?.status === 'active' ? 'suspend' : 'activate'} the user {selectedUser?.first_name} {selectedUser?.surname}?</p>
          <div className="modal-action">
            <button className="btn" onClick={() => setSuspendDialogOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSuspendUser}>{selectedUser?.status === 'active' ? 'Suspend' : 'Activate'}</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setSuspendDialogOpen(false)}>close</button></form>
      </dialog>
    </div>
  );
};

export default UsersList;
