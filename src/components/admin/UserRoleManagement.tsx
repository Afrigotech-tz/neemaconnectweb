import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { userService, UserWithRoles } from "@/services/userService";
import { roleService } from "@/services/roleService";
import { Role } from "@/types/rolePermissionTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserCheck, UserX, Shield, ShieldCheck } from "lucide-react";

interface UserRoleManagementProps {
  user: UserWithRoles;
  onRoleUpdate: () => void;
}

const UserRoleManagement: React.FC<UserRoleManagementProps> = ({
  user,
  onRoleUpdate,
}) => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  useEffect(() => {
    fetchAvailableRoles();
  }, []);

  const fetchAvailableRoles = async () => {
    try {
      const response = await roleService.getRoles();
      if (response.success && response.data) {
        setAvailableRoles(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedRoleId) return;

    setLoading(true);
    try {
      const response = await userService.assignRoleToUser(user.id, {
        role_id: parseInt(selectedRoleId, 10),
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Role assigned successfully",
        });
        onRoleUpdate();
        setDialogOpen(false);
        setSelectedRoleId("");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to assign role",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRole = async (roleId: number) => {
    setLoading(true);
    try {
      const response = await userService.removeRoleFromUser(user.id, roleId);

      if (response.success) {
        toast({
          title: "Success",
          description: "Role removed successfully",
        });
        onRoleUpdate();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to remove role",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isSuperAdmin = currentUser?.roles?.some(
    (role) => role.name === "super_admin"
  );
  const canManageRoles = isSuperAdmin;

  if (!canManageRoles) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Current Roles */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="p-1 bg-blue-100 rounded">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              Current Roles
            </CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Assign New Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Assign Role to User
                  </DialogTitle>
                  <DialogDescription>
                    Assign a role to{" "}
                    <span className="font-medium">
                      {user.first_name} {user.surname}
                    </span>
                    . This will grant them the permissions associated with the
                    selected role.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Role</label>
                    <Select
                      value={selectedRoleId}
                      onValueChange={setSelectedRoleId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a role..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles
                          .filter(
                            (role) =>
                              !user.roles?.some(
                                (userRole) => userRole.id === role.id
                              )
                          )
                          .map((role) => (
                            <SelectItem
                              key={role.id}
                              value={role.id.toString()}
                            >
                              <div className="flex items-center gap-2">
                                {role.name === "super_admin" ? (
                                  <ShieldCheck className="h-4 w-4" />
                                ) : (
                                  <Shield className="h-4 w-4" />
                                )}
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {role.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {role.description}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAssignRole}
                    disabled={!selectedRoleId || loading}
                  >
                    {loading ? "Assigning..." : "Assign Role"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {user.roles && user.roles.length > 0 ? (
            <div className="space-y-3">
              {user.roles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        role.name === "super_admin"
                          ? "bg-red-100"
                          : "bg-blue-100"
                      }`}
                    >
                      {role.name === "super_admin" ? (
                        <ShieldCheck
                          className={`h-4 w-4 ${
                            role.name === "super_admin"
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}
                        />
                      ) : (
                        <Shield
                          className={`h-4 w-4 ${
                            role.name === "super_admin"
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}
                        />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            role.name === "super_admin"
                              ? "destructive"
                              : "outline"
                          }
                          className="px-2 py-1"
                        >
                          {role.name}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {role.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveRole(role.id)}
                    disabled={loading}
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-3">
                <Shield className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                No roles assigned to this user
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Click "Assign New Role" to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Summary */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-1 bg-green-100 rounded">
              <svg
                className="h-4 w-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            Role Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Super Admin</span>
                </div>
                <Badge
                  variant={
                    user.roles?.some((role) => role.name === "super_admin")
                      ? "destructive"
                      : "outline"
                  }
                >
                  {user.roles?.some((role) => role.name === "super_admin")
                    ? "Yes"
                    : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Admin</span>
                </div>
                <Badge
                  variant={
                    user.roles?.some((role) => role.name === "admin")
                      ? "default"
                      : "outline"
                  }
                >
                  {user.roles?.some((role) => role.name === "admin")
                    ? "Yes"
                    : "No"}
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">User</span>
                </div>
                <Badge
                  variant={
                    user.roles?.some((role) => role.name === "user")
                      ? "default"
                      : "outline"
                  }
                >
                  {user.roles?.some((role) => role.name === "user")
                    ? "Yes"
                    : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span className="text-sm font-medium">View Only</span>
                </div>
                <Badge
                  variant={
                    user.roles?.some((role) => role.name === "view")
                      ? "default"
                      : "outline"
                  }
                >
                  {user.roles?.some((role) => role.name === "view")
                    ? "Yes"
                    : "No"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions Overview */}
      {user.roles && user.roles.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="p-1 bg-purple-100 rounded">
                <svg
                  className="h-4 w-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              Permissions Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.roles.map((role) => (
                <div
                  key={role.id}
                  className="border-l-4 border-blue-200 pl-4 py-2"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={
                        role.name === "super_admin" ? "destructive" : "outline"
                      }
                      className="px-2 py-1"
                    >
                      {role.name}
                    </Badge>
                  </div>
                  {role.permissions && role.permissions.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 5).map((permission, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs px-2 py-0.5"
                        >
                          {permission.name}
                        </Badge>
                      ))}
                      {role.permissions.length > 5 && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-0.5"
                        >
                          +{role.permissions.length - 5} more
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No specific permissions defined
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserRoleManagement;
