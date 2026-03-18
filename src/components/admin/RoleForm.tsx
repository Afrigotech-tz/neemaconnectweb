import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { roleService } from '@/services/roleService/roleService';
import { CreateRoleData, UpdateRoleData } from '@/types/rolePermissionTypes';
import { Loader2, Save, X } from 'lucide-react';

interface RoleFormProps {
  roleId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ roleId, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!roleId;

  useEffect(() => {
    if (roleId) {
      loadRole(roleId);
    }
  }, [roleId]);

  const loadRole = async (id: number) => {
    try {
      setLoading(true);
      const response = await roleService.getRole(id);
      if (response.success && response.data) {
        const role = response.data;
        setFormData({
          name: role.name,
          display_name: role.display_name,
          description: role.description || '',
          is_active: role.is_active,
        });
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to load role',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error loading role:', error);
      toast({
        title: 'Error',
        description: 'Failed to load role. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    } else if (!/^[a-z_]+$/.test(formData.name)) {
      newErrors.name = 'Role name should be lowercase with underscores only';
    }

    if (!formData.display_name.trim()) {
      newErrors.display_name = 'Display name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const roleData: CreateRoleData | UpdateRoleData = {
        name: formData.name,
        display_name: formData.display_name,
        description: formData.description,
        is_active: formData.is_active,
      };

      let response;
      if (isEditMode && roleId) {
        response = await roleService.updateRole(roleId, roleData);
      } else {
        response = await roleService.createRole(roleData as CreateRoleData);
      }

      if (response.success) {
        toast({
          title: 'Success',
          description: isEditMode ? 'Role updated successfully' : 'Role created successfully',
        });
        onSuccess();
      } else {
        toast({
          title: 'Error',
          description: response.message || `Failed to ${isEditMode ? 'update' : 'create'} role`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} role:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'create'} role. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Role' : 'Create New Role'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Role Name */}
            <div>
              <Label htmlFor="name">
                Role Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., content_editor"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              <p className="text-sm text-muted-foreground mt-1">
                Use lowercase letters and underscores only
              </p>
            </div>

            {/* Display Name */}
            <div>
              <Label htmlFor="display_name">
                Display Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="e.g., Content Editor"
                className={errors.display_name ? 'border-red-500' : ''}
              />
              {errors.display_name && (
                <p className="text-sm text-red-500 mt-1">{errors.display_name}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Human-readable name for the role
              </p>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this role is for"
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Is Active */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked as boolean })
                }
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active
              </Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Update Role' : 'Create Role'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RoleForm;
