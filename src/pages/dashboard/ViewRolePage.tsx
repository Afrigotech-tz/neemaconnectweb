import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { roleService } from "@/services/roleService";
import { permissionService } from "@/services/permissionService";
import { Role, Permission } from "@/types/rolePermissionTypes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Edit,
  Loader2,
  Shield,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const ViewRolePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [role, setRole] = useState<Role | null>(null);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadRoleAndPermissions(parseInt(id));
    }
  }, [id]);

  const loadRoleAndPermissions = async (roleId: number) => {
    try {
      setLoading(true);

      // Load role details
      const roleResponse = await roleService.getRole(roleId);
      if (roleResponse.success && roleResponse.data) {
        setRole(roleResponse.data);

        // Extract permission IDs from role
        const rolePermissionIds = roleResponse.data.permissions?.map(p => p.id) || [];
        setSelectedPermissions(rolePermissionIds);
      } else {
        toast({
          title: "Error",
          description: roleResponse.message || "Failed to load role",
          variant: "destructive",
        });
      }

      // Load all permissions
      const permissionsResponse = await permissionService.getPermissions();
      if (permissionsResponse.success && permissionsResponse.data) {
        setAllPermissions(Array.isArray(permissionsResponse.data) ? permissionsResponse.data : []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load role and permissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permissionId: number, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
    }
  };

  const handleSavePermissions = async () => {
    if (!role) return;

    setSaving(true);
    try {
      const response = await roleService.addPermissionsToRole(role.id, {
        role_id: role.id,
        permission_ids: selectedPermissions,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Permissions updated successfully",
        });

        // Reload role data
        loadRoleAndPermissions(role.id);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update permissions",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update permissions",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Group permissions by module
  const groupedPermissions = allPermissions.reduce((acc, permission) => {
    const module = permission.module || 'Other';
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-red-500">Role not found</p>
        </div>
      </div>
    );
  }

  const selectedCount = selectedPermissions.length;
  const totalCount = allPermissions.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/roles")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Roles
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {role.display_name}
              </h1>
              <p className="text-gray-600 mt-2">Configure role permissions</p>
            </div>
            <Button
              variant="outline"
              asChild
            >
              <Link to={`/dashboard/roles/edit/${role.id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Role
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Role Information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p className="text-lg font-semibold">{role.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Display Name
                </p>
                <p className="text-lg font-semibold">{role.display_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge variant={role.is_active ? "default" : "secondary"}>
                  {role.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Description
                </p>
                <p className="text-base">{role.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Permissions Assigned
                </p>
                <p className="text-2xl font-bold text-primary">
                  {selectedCount} / {totalCount}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Permission Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Manage Permissions</CardTitle>
                    <CardDescription>
                      Select permissions for this role
                    </CardDescription>
                  </div>
                  <Button onClick={handleSavePermissions} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(groupedPermissions).map(([module, permissions]) => (
                    <div key={module} className="space-y-3">
                      <h3 className="font-semibold text-lg border-b pb-2">
                        {module}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {permissions.map((permission) => {
                          const isSelected = selectedPermissions.includes(permission.id);
                          return (
                            <div
                              key={permission.id}
                              className={`flex items-start space-x-3 p-3 rounded-lg border ${
                                isSelected ? 'bg-primary/5 border-primary/20' : 'border-gray-200'
                              }`}
                            >
                              <Checkbox
                                id={`permission-${permission.id}`}
                                checked={isSelected}
                                onCheckedChange={(checked) =>
                                  handlePermissionToggle(permission.id, checked as boolean)
                                }
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={`permission-${permission.id}`}
                                  className="cursor-pointer flex items-center gap-2"
                                >
                                  {isSelected ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-gray-400" />
                                  )}
                                  <span className="font-medium">
                                    {permission.display_name}
                                  </span>
                                </Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {permission.description}
                                </p>
                                <code className="text-xs bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">
                                  {permission.name}
                                </code>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRolePage;

