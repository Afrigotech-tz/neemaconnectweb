import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import PermissionForm from "@/components/admin/PermissionForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const EditPermissionPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleSuccess = () => {
    navigate("/dashboard/permissions");
  };

  const handleCancel = () => {
    navigate("/dashboard/permissions");
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-red-500">Permission ID is required</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Permission</h1>
          <p className="text-gray-600 mt-2">
            Update permission information
          </p>
        </div>

        {/* Form Section */}
        <PermissionForm
          permissionId={parseInt(id)}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default EditPermissionPage;
