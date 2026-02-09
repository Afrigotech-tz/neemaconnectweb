import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "@/services/productService";
import { CreateProductData, ProductCategory } from "@/types/productTypes";
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
import { Loader2, Package, Upload, X, Image as ImageIcon } from "lucide-react";

interface ProductFormProps {
  productId?: number; // For edit mode
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  productId,
  onSuccess,
  onCancel,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    description: "",
    category_id: 0,
    base_price: 0,
    sku: "",
    stock_quantity: 0,
    is_active: true,
    weight: undefined,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateProductData, string>>
  >({});

  useEffect(() => {
    loadCategories();
    if (productId) {
      loadProduct(productId);
    }
  }, [productId]);

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

  const loadProduct = async (id: number) => {
    try {
      setLoading(true);
      const response = await productService.getProduct(id);
      if (response.success && response.data) {
        const product = response.data;
        setFormData({
          name: product.name,
          description: product.description,
          category_id: product.category_id,
          base_price: parseFloat(product.base_price),
          sku: product.sku,
          stock_quantity: product.stock_quantity,
          is_active: product.is_active,
          weight: product.weight || undefined,
        });

        // Load existing images if any
        if (product.images && Array.isArray(product.images)) {
          setImagePreviews(product.images);
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load product",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Limit to 5 images
    if (imageFiles.length + files.length > 5) {
      toast({
        title: "Too many images",
        description: "You can only upload up to 5 images",
        variant: "destructive",
      });
      return;
    }

    // Create previews
    const newPreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImageFiles([...imageFiles, ...files]);
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateProductData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category_id || formData.category_id === 0) {
      newErrors.category_id = "Category is required";
    }

    if (!formData.base_price || formData.base_price <= 0) {
      newErrors.base_price = "Base price must be greater than 0";
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    }

    if (formData.stock_quantity === undefined || formData.stock_quantity < 0) {
      newErrors.stock_quantity = "Stock quantity must be 0 or greater";
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
      // Create FormData for multipart/form-data submission
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category_id", formData.category_id.toString());
      formDataToSend.append("base_price", formData.base_price.toString());
      formDataToSend.append("sku", formData.sku);
      formDataToSend.append("stock_quantity", formData.stock_quantity.toString());
      formDataToSend.append("is_active", formData.is_active ? "1" : "0");

      if (formData.weight) {
        formDataToSend.append("weight", formData.weight.toString());
      }

      // Append images
      imageFiles.forEach((file, index) => {
        formDataToSend.append(`images[${index}]`, file);
      });

      const response = productId
        ? await productService.updateProduct(productId, formDataToSend)
        : await productService.createProduct(formDataToSend);

      if (response.success) {
        toast({
          title: "Success",
          description: productId ? "Product updated successfully" : "Product created successfully",
        });

        // Reset form
        setFormData({
          name: "",
          description: "",
          category_id: 0,
          base_price: 0,
          sku: "",
          stock_quantity: 0,
          is_active: true,
          weight: undefined,
        });
        setImageFiles([]);
        setImagePreviews([]);
        setErrors({});

        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/dashboard/shop");
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create product",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateProductData,
    value: string | number | boolean
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
            <Package className="h-5 w-5" />
            {productId ? "Edit Product" : "Create New Product"}
          </CardTitle>
          <CardDescription>
            Fill in the details below to {productId ? "update" : "create"} a product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* SKU */}
              <div className="space-y-2">
                <Label htmlFor="sku">
                  SKU <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="e.g., PROD-001"
                  className={errors.sku ? "border-red-500" : ""}
                />
                {errors.sku && (
                  <p className="text-sm text-red-500">{errors.sku}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category_id?.toString() || ""}
                onValueChange={(value) =>
                  handleInputChange("category_id", parseInt(value))
                }
                disabled={loadingCategories}
              >
                <SelectTrigger className={errors.category_id ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-sm text-red-500">{errors.category_id}</p>
              )}
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing & Inventory</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Base Price */}
              <div className="space-y-2">
                <Label htmlFor="base_price">
                  Base Price <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="base_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.base_price || ""}
                  onChange={(e) =>
                    handleInputChange("base_price", parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                  className={errors.base_price ? "border-red-500" : ""}
                />
                {errors.base_price && (
                  <p className="text-sm text-red-500">{errors.base_price}</p>
                )}
              </div>

              {/* Stock Quantity */}
              <div className="space-y-2">
                <Label htmlFor="stock_quantity">
                  Stock Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  min="0"
                  value={formData.stock_quantity || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "stock_quantity",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="0"
                  className={errors.stock_quantity ? "border-red-500" : ""}
                />
                {errors.stock_quantity && (
                  <p className="text-sm text-red-500">{errors.stock_quantity}</p>
                )}
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.weight || ""}
                  onChange={(e) =>
                    handleInputChange("weight", parseFloat(e.target.value) || undefined)
                  }
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Images</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="images"
                  className="cursor-pointer flex items-center gap-2"
                >
                  <Button type="button" variant="outline" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Images
                    </span>
                  </Button>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </Label>
                <span className="text-sm text-muted-foreground">
                  Maximum 5 images
                </span>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {imagePreviews.length === 0 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No images uploaded yet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Status</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active" className="flex flex-col space-y-1">
                <span>Active Status</span>
                <span className="text-sm text-muted-foreground font-normal">
                  Make this product visible in the store
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
                  {productId ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 mr-2" />
                  {productId ? "Update Product" : "Create Product"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default ProductForm;
