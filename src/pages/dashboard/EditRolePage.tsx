import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import RoleForm from "@/components/admin/RoleForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const EditRolePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleSuccess = () => {
    navigate("/dashboard/roles");
  };

  const handleCancel = () => {
    navigate("/dashboard/roles");
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-red-500">Role ID is required</p>
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
            onClick={() => navigate("/dashboard/roles")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Roles
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Role</h1>
          <p className="text-gray-600 mt-2">
            Update role information
          </p>
        </div>

        {/* Form Section */}
        <RoleForm
          roleId={parseInt(id)}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default EditRolePage;
