import React from "react";
import { useNavigate } from "react-router-dom";
import PermissionForm from "@/components/admin/PermissionForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AddPermissionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/dashboard/permissions");
  };

  const handleCancel = () => {
    navigate("/dashboard/permissions");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/permissions")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Permissions
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Permission Management
          </h1>
          <p className="text-gray-600 mt-2">
            Add a new permission to the system
          </p>
        </div>

        {/* Form Section */}
        <PermissionForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default AddPermissionPage;
