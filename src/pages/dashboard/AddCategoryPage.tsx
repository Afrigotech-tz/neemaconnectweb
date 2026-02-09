import React from "react";
import { useNavigate } from "react-router-dom";
import CategoryForm from "@/components/admin/CategoryForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AddCategoryPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Navigate back to categories list after successful creation
    navigate("/dashboard/products/categories");
  };

  const handleCancel = () => {
    // Navigate back to categories list
    navigate("/dashboard/products/categories");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/products/categories")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Category Management
          </h1>
          <p className="text-gray-600 mt-2">
            Add a new product category to organize your store
          </p>
        </div>

        {/* Form Section */}
        <CategoryForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default AddCategoryPage;
