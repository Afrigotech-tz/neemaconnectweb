import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "@/services/productService";
import { CreateCategoryData, ProductCategory } from "@/types/productTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Folder } from "lucide-react";

interface CategoryFormProps {
  categoryId?: number; // For edit mode
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  categoryId,
  onSuccess,
  onCancel,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [formData, setFormData] = useState<CreateCategoryData>({
    name: "",
    description: "",
    parent_id: null,
    is_active: true,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateCategoryData, string>>
  >({});

  useEffect(() => {
    loadCategories();
    if (categoryId) {
      loadCategory(categoryId);
    }
  }, [categoryId]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await productService.getCategories();
      if (response.success && response.data) {
        setCategories(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadCategory = async (id: number) => {
    try {
      setLoading(true);
      const response = await productService.getCategory(id);
      if (response.success && response.data) {
        const category = response.data;
        setFormData({
          name: category.name,
          description: category.description,
          parent_id: category.parent_id,
          is_active: category.is_active,
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load category",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load category",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateCategoryData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
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
      const response = categoryId
        ? await productService.updateCategory(categoryId, formData)
        : await productService.createCategory(formData);

      if (response.success) {
        toast({
          title: "Success",
          description: categoryId ? "Category updated successfully" : "Category created successfully",
        });

        // Reset form
        setFormData({
          name: "",
          description: "",
          parent_id: null,
          is_active: true,
        });
        setErrors({});

        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/dashboard/products/categories");
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create category",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateCategoryData,
    value: string | number | boolean | null
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
            <Folder className="h-5 w-5" />
            {categoryId ? "Edit Category" : "Create New Category"}
          </CardTitle>
          <CardDescription>
            Fill in the details below to {categoryId ? "update" : "create"} a
            product category
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Category Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter category name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
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
              placeholder="Enter category description"
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Parent Category */}
          <div className="space-y-2">
            <Label htmlFor="parent_id">Parent Category (Optional)</Label>
            <Select
              value={formData.parent_id?.toString() || "none"}
              onValueChange={(value) =>
                handleInputChange(
                  "parent_id",
                  value === "none" ? null : parseInt(value)
                )
              }
              disabled={loadingCategories}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Parent (Top Level)</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Leave empty to create a top-level category
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between">
            <Label htmlFor="is_active" className="flex flex-col space-y-1">
              <span>Active Status</span>
              <span className="text-sm text-muted-foreground font-normal">
                Make this category visible in the store
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
            <Button type="submit" disabled={loading || loadingCategories}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {categoryId ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Folder className="h-4 w-4 mr-2" />
                  {categoryId ? "Update Category" : "Create Category"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default CategoryForm;
