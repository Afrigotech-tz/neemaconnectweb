import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { profileService } from '@/services/profileService';
import { roleService } from '@/services/roleService';

const SettingsPage = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    const response = await roleService.getRoles();
    if (response.success) {
      setRoles(response.data);
    } else {
      toast.toast({ title: 'Error', description: 'Failed to fetch roles', variant: 'destructive' });
    }
  };

  const fetchPermissions = async () => {
    const response = await roleService.getPermissions();
    if (response.success) {
      setPermissions(response.data);
    } else {
      toast.toast({ title: 'Error', description: 'Failed to fetch permissions', variant: 'destructive' });
    }
  };

  const togglePermission = (permId) => {
    setNewRolePermissions((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  const handleAddRoleSubmit = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      toast.toast({ title: 'Validation Error', description: 'Role name is required', variant: 'destructive' });
      return;
    }
    const response = await roleService.createRole({ name: newRoleName, description: 'Role created from dashboard' });
    if (response.success) {
      toast.toast({ title: 'Success', description: 'Role added successfully' });
      setShowAddRole(false);
      setNewRoleName('');
      setNewRolePermissions([]);
      fetchRoles();
    } else {
      toast.toast({ title: 'Error', description: 'Failed to add role', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-2">Configure your account and system preferences</p>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account preferences and security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email updates and notifications</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive text message notifications</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Control your privacy and data sharing preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Profile Visibility</Label>
              <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Activity Sharing</Label>
              <p className="text-sm text-muted-foreground">Share your activity with the community</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Data Collection</Label>
              <p className="text-sm text-muted-foreground">Allow us to collect anonymous usage data</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* System Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>System Preferences</CardTitle>
          <CardDescription>Configure system-wide settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Switch to dark theme</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Language</Label>
              <p className="text-sm text-muted-foreground">English (Default)</p>
            </div>
            <Button variant="outline" size="sm">
              Change
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Timezone</Label>
              <p className="text-sm text-muted-foreground">UTC+00:00 (Default)</p>
            </div>
            <Button variant="outline" size="sm">
              Change
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Roles and Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Roles and Permissions</CardTitle>
          <CardDescription>Manage user roles and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Roles</h3>
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setShowAddRole(true)}>
              <Plus className="h-4 w-4" />
              Add Role
            </Button>
          </div>
          {roles.length === 0 ? (
            <p className="text-sm text-muted-foreground">No roles found.</p>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {roles.map((role) => (
                <li key={role.id} className="flex justify-between items-center border p-2 rounded">
                  <span>{role.name}</span>
                  <Badge variant="secondary">{role.permissions.length} Permissions</Badge>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Permissions</h3>
            {permissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No permissions found.</p>
            ) : (
              <ul className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {permissions.map((perm) => (
                  <li key={perm.id} className="border p-2 rounded">
                    {perm.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Role Dialog */}
      <Dialog open={showAddRole} onOpenChange={setShowAddRole}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>Enter the name and select permissions for the new role.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRoleSubmit} className="space-y-4">
            <Input
              placeholder="Role Name"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              required
            />
            <div className="max-h-40 overflow-y-auto border rounded p-2">
              {permissions.map((perm) => (
                <label key={perm.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newRolePermissions.includes(perm.id)}
                    onChange={() => togglePermission(perm.id)}
                  />
                  <span>{perm.name}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowAddRole(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Role</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default SettingsPage;
