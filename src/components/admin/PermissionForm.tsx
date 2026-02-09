import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { permissionService } from "@/services/permissionService";
import { CreatePermissionData } from "@/types/rolePermissionTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield } from "lucide-react";

interface PermissionFormProps {
  permissionId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PermissionForm: React.FC<PermissionFormProps> = ({
  permissionId,
  onSuccess,
  onCancel,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<CreatePermissionData>({
    name: "",
    display_name: "",
    description: "",
    module: "",
    is_active: true,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreatePermissionData, string>>
  >({});

  useEffect(() => {
    if (permissionId) {
      loadPermission(permissionId);
    }
  }, [permissionId]);

  const loadPermission = async (id: number) => {
    try {
      setLoading(true);
      const response = await permissionService.getPermission(id);
      if (response.success && response.data) {
        const permission = response.data;
        setFormData({
          name: permission.name,
          display_name: permission.display_name,
          description: permission.description,
          module: permission.module,
          is_active: permission.is_active,
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load permission",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load permission",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreatePermissionData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Permission name is required";
    } else if (!/^[a-z_]+$/.test(formData.name)) {
      newErrors.name = "Permission name should be lowercase with underscores only (e.g., view_users)";
    }

    if (!formData.display_name.trim()) {
      newErrors.display_name = "Display name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.module.trim()) {
      newErrors.module = "Module is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = permissionId
        ? await permissionService.updatePermission(permissionId, formData)
        : await permissionService.createPermission(formData);

      if (response.success) {
        toast({
          title: "Success",
          description: permissionId
            ? "Permission updated successfully"
            : "Permission created successfully",
        });

        // Reset form
        if (!permissionId) {
          setFormData({
            name: "",
            display_name: "",
            description: "",
            module: "",
            is_active: true,
          });
        }
        setErrors({});

        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/dashboard/permissions");
        }
      } else {
        toast({
          title: "Error",
          description:
            response.message ||
            `Failed to ${permissionId ? "update" : "create"} permission`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${permissionId ? "update" : "create"} permission`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof CreatePermissionData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {permissionId ? "Edit Permission" : "Create New Permission"}
          </CardTitle>
          <CardDescription>
            Fill in the details below to {permissionId ? "update" : "create"} a
            system permission
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Permission Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Permission Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value.toLowerCase())}
              placeholder="e.g., view_users, create_products"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Use lowercase with underscores (snake_case)
            </p>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="display_name">
              Display Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => handleInputChange("display_name", e.target.value)}
              placeholder="e.g., View Users, Create Products"
              className={errors.display_name ? "border-red-500" : ""}
            />
            {errors.display_name && (
              <p className="text-sm text-red-500">{errors.display_name}</p>
            )}
          </div>

          {/* Module */}
          <div className="space-y-2">
            <Label htmlFor="module">
              Module <span className="text-red-500">*</span>
            </Label>
            <Input
              id="module"
              value={formData.module}
              onChange={(e) => handleInputChange("module", e.target.value)}
              placeholder="e.g., Users, Products, Events"
              className={errors.module ? "border-red-500" : ""}
            />
            {errors.module && (
              <p className="text-sm text-red-500">{errors.module}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Group related permissions by module
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what this permission allows..."
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between">
            <Label htmlFor="is_active" className="flex flex-col space-y-1">
              <span>Active Status</span>
              <span className="text-sm text-muted-foreground font-normal">
                Enable or disable this permission
              </span>
            </Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                handleInputChange("is_active", checked)
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {permissionId ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  {permissionId ? "Update Permission" : "Create Permission"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default PermissionForm;
