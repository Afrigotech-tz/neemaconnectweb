import React from "react";
import { useNavigate } from "react-router-dom";
import AddUserForm from "@/components/admin/AddUserForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AddUserPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Navigate back to users list after successful creation
    navigate("/dashboard/users");
  };

  const handleCancel = () => {
    // Navigate back to users list
    navigate("/dashboard/users");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/users")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            Add a new user to the system
          </p>
        </div>

        {/* Form Section */}
        <AddUserForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default AddUserPage;
