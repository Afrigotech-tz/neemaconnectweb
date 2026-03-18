import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Loader2, Plus, Trash2, UserPlus, ShieldPlus, CheckCircle2, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { departmentService } from '@/services/departmentService';
import { Department } from '@/types/departmentTypes';
import { permissionService } from '@/services/permissionService';
import { Permission } from '@/types/rolePermissionTypes';
import { userService, UserWithRoles } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';

const DepartmentsPage: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedPermissionId, setSelectedPermissionId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [permissionSetInput, setPermissionSetInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    is_active: true,
  });

  const selectedDepartment = useMemo(
    () => departments.find((item) => String(item.id) === selectedDepartmentId) || null,
    [departments, selectedDepartmentId]
  );
  const activeDepartmentsCount = useMemo(
    () => departments.filter((item) => item.is_active).length,
    [departments]
  );
  const totalAssignmentsCount = useMemo(
    () =>
      departments.reduce((total, item) => total + (item.users?.length || 0), 0),
    [departments]
  );

  const normalizeArrayData = <T,>(payload: unknown): T[] => {
    if (Array.isArray(payload)) return payload as T[];
    if (!payload || typeof payload !== 'object') return [];

    const data = (payload as { data?: unknown }).data;
    if (Array.isArray(data)) return data as T[];
    if (data && typeof data === 'object' && Array.isArray((data as { data?: unknown }).data)) {
      return (data as { data: T[] }).data;
    }

    return [];
  };

  useEffect(() => {
    if (selectedDepartment?.permissions) {
      setPermissionSetInput(selectedDepartment.permissions.map((item) => item.id).join(','));
    } else {
      setPermissionSetInput('');
    }
  }, [selectedDepartmentId, selectedDepartment?.permissions]);

  const loadPageData = async () => {
    setLoading(true);
    const [departmentsResponse, permissionsResponse, usersResponse] = await Promise.all([
      departmentService.getDepartments(),
      permissionService.getPermissions(),
      userService.getAllUsers({ page: 1, limit: 100 }),
    ]);

    const nextDepartments = departmentsResponse.success
      ? normalizeArrayData<Department>(departmentsResponse.data)
      : [];
    const nextPermissions = permissionsResponse.success
      ? normalizeArrayData<Permission>(permissionsResponse.data)
      : [];
    const nextUsers = usersResponse.success
      ? normalizeArrayData<UserWithRoles>(usersResponse.data)
      : [];

    setDepartments(nextDepartments);
    setPermissions(nextPermissions);
    setUsers(nextUsers);

    setSelectedDepartmentId((current) => {
      if (current && nextDepartments.some((item) => String(item.id) === current)) {
        return current;
      }
      return nextDepartments.length > 0 ? String(nextDepartments[0].id) : '';
    });

    if (!departmentsResponse.success || !permissionsResponse.success || !usersResponse.success) {
      const firstError =
        departmentsResponse.message ||
        permissionsResponse.message ||
        usersResponse.message ||
        'Failed to load some departments data.';
      toast({
        title: 'Partial load',
        description: firstError,
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const handleCreateDepartment = async () => {
    if (!newDepartment.name.trim()) {
      toast({
        title: 'Name required',
        description: 'Department name is required.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const response = await departmentService.createDepartment({
        name: newDepartment.name.trim(),
        description: newDepartment.description.trim() || undefined,
        is_active: newDepartment.is_active,
      });

      if (response.success) {
        toast({
          title: 'Department created',
          description: response.message || 'Department created successfully.',
        });
        setNewDepartment({ name: '', description: '', is_active: true });
        await loadPageData();
      } else {
        toast({
          title: 'Create failed',
          description: response.message || 'Failed to create department.',
          variant: 'destructive',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDepartment = async (departmentId: number) => {
    const confirmed = window.confirm('Delete this department?');
    if (!confirmed) return;

    const response = await departmentService.deleteDepartment(departmentId);
    if (response.success) {
      toast({
        title: 'Department deleted',
        description: response.message || 'Department deleted successfully.',
      });
      await loadPageData();
    } else {
      toast({
        title: 'Delete failed',
        description: response.message || 'Failed to delete department.',
        variant: 'destructive',
      });
    }
  };

  const handleAssignPermission = async () => {
    if (!selectedDepartment || !selectedPermissionId) return;
    const response = await departmentService.assignPermission(selectedDepartment.id, {
      permission_id: Number(selectedPermissionId),
    });
    if (response.success) {
      toast({ title: 'Permission assigned', description: response.message || 'Permission assigned successfully.' });
      await loadPageData();
    } else {
      toast({ title: 'Assign failed', description: response.message || 'Failed to assign permission.', variant: 'destructive' });
    }
  };

  const handleRemovePermission = async () => {
    if (!selectedDepartment || !selectedPermissionId) return;
    const response = await departmentService.removePermission(selectedDepartment.id, {
      permission_id: Number(selectedPermissionId),
    });
    if (response.success) {
      toast({ title: 'Permission removed', description: response.message || 'Permission removed successfully.' });
      await loadPageData();
    } else {
      toast({ title: 'Remove failed', description: response.message || 'Failed to remove permission.', variant: 'destructive' });
    }
  };

  const handleAssignUser = async () => {
    if (!selectedDepartment || !selectedUserId) return;
    const userId = Number(selectedUserId);
    if (!Number.isFinite(userId) || userId <= 0) {
      toast({ title: 'Invalid user', description: 'Please select a valid user.', variant: 'destructive' });
      return;
    }

    const response = await departmentService.assignUser(selectedDepartment.id, {
      user_id: userId,
    });
    if (response.success) {
      toast({ title: 'User assigned', description: response.message || 'User assigned successfully.' });
      await loadPageData();
    } else {
      toast({ title: 'Assign failed', description: response.message || 'Failed to assign user.', variant: 'destructive' });
    }
  };

  const handleRemoveUser = async () => {
    if (!selectedDepartment || !selectedUserId) return;
    const userId = Number(selectedUserId);
    if (!Number.isFinite(userId) || userId <= 0) {
      toast({ title: 'Invalid user', description: 'Please select a valid user.', variant: 'destructive' });
      return;
    }

    const response = await departmentService.removeUser(selectedDepartment.id, {
      user_id: userId,
    });
    if (response.success) {
      toast({ title: 'User removed', description: response.message || 'User removed successfully.' });
      await loadPageData();
    } else {
      toast({ title: 'Remove failed', description: response.message || 'Failed to remove user.', variant: 'destructive' });
    }
  };

  const handleUpdatePermissionsSet = async () => {
    if (!selectedDepartment) return;

    const permissionIds = permissionSetInput
      .split(',')
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isFinite(value) && value > 0);

    const response = await departmentService.updatePermissions(selectedDepartment.id, {
      permission_ids: permissionIds,
    });
    if (response.success) {
      toast({ title: 'Permissions updated', description: response.message || 'Department permissions updated successfully.' });
      await loadPageData();
    } else {
      toast({ title: 'Update failed', description: response.message || 'Failed to update permissions.', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-900 via-zinc-800 to-slate-700 p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building2 className="h-7 w-7" />
          Departments
        </h1>
        <p className="text-white/80 mt-2">
          Organize teams, permissions, and user assignments from one advanced control center.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Departments</p>
          <p className="text-2xl font-bold mt-1">{departments.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Active
          </p>
          <p className="text-2xl font-bold mt-1">{activeDepartmentsCount}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Total User Assignments
          </p>
          <p className="text-2xl font-bold mt-1">{totalAssignmentsCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Departments List
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {departments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No departments created yet.</p>
            ) : (
              departments.map((department) => (
                <div key={department.id} className="p-4 border rounded-lg flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{department.name}</p>
                      <Badge variant={department.is_active ? 'default' : 'secondary'}>
                        {department.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{department.description || 'No description'}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Permissions: {department.permissions?.length || 0} | Users: {department.users?.length || 0}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={selectedDepartmentId === String(department.id) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDepartmentId(String(department.id))}
                    >
                      Select
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteDepartment(department.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Department
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="department-name">Name</Label>
              <Input
                id="department-name"
                value={newDepartment.name}
                onChange={(event) => setNewDepartment((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="e.g. Worship Team"
              />
            </div>
            <div>
              <Label htmlFor="department-description">Description</Label>
              <Input
                id="department-description"
                value={newDepartment.description}
                onChange={(event) => setNewDepartment((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Department description"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="department-active">Active</Label>
              <Switch
                id="department-active"
                checked={newDepartment.is_active}
                onCheckedChange={(checked) => setNewDepartment((prev) => ({ ...prev, is_active: checked }))}
              />
            </div>
            <Button className="w-full" onClick={handleCreateDepartment} disabled={saving}>
              {saving ? 'Creating...' : 'Create Department'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Assignments</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <ShieldPlus className="h-4 w-4" />
              Assign Permission
            </Label>
            <Select value={selectedPermissionId} onValueChange={setSelectedPermissionId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose permission" />
              </SelectTrigger>
              <SelectContent>
                {permissions.map((permission) => (
                  <SelectItem key={permission.id} value={String(permission.id)}>
                    {permission.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button onClick={handleAssignPermission} disabled={!selectedDepartment || !selectedPermissionId}>
                Assign
              </Button>
              <Button
                variant="outline"
                onClick={handleRemovePermission}
                disabled={!selectedDepartment || !selectedPermissionId}
              >
                Remove
              </Button>
            </div>

            <Label htmlFor="permission-set" className="text-xs text-muted-foreground">
              Update permission set (comma-separated IDs)
            </Label>
            <Input
              id="permission-set"
              value={permissionSetInput}
              onChange={(event) => setPermissionSetInput(event.target.value)}
              placeholder="1,2,3"
            />
            <Button variant="secondary" onClick={handleUpdatePermissionsSet} disabled={!selectedDepartment}>
              Apply Permission Set
            </Button>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Assign User
            </Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((currentUser) => (
                  <SelectItem key={currentUser.id} value={String(currentUser.id)}>
                    {currentUser.first_name} {currentUser.surname} ({currentUser.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button onClick={handleAssignUser} disabled={!selectedDepartment || !selectedUserId}>
                Assign
              </Button>
              <Button variant="outline" onClick={handleRemoveUser} disabled={!selectedDepartment || !selectedUserId}>
                Remove
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentsPage;
