import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import RoleForm from "@/components/admin/RoleForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Edit, Plus } from "lucide-react";

const EditRolePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const handleSuccess = () => {
    navigate("/dashboard/roles");
  };

  const handleCancel = () => {
    navigate("/dashboard/roles");
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center" data-theme="neemadmin">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10 mb-4">
            <Shield className="h-8 w-8 text-error" />
          </div>
          <h2 className="text-xl font-bold text-base-content">Role ID is required</h2>
          <p className="text-base-content/60 mt-2">Please provide a valid role ID</p>
          <Button onClick={() => navigate("/dashboard/roles")} className="btn btn-primary mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Roles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-theme="neemadmin">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-orange-500 to-secondary p-6 text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative z-10">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/roles")}
            className="btn btn-ghost text-white hover:bg-white/20 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Roles
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              {isEditMode ? (
                <Edit className="h-8 w-8" />
              ) : (
                <Plus className="h-8 w-8" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{isEditMode ? 'Edit Role' : 'Create New Role'}</h1>
              <p className="text-white/80 mt-1">
                {isEditMode ? 'Update role information and permissions' : 'Add a new role with specific permissions'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <RoleForm
            roleId={parseInt(id)}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Role Tips */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <div className="p-6">
              <h3 className="font-bold text-base-content flex items-center gap-2 mb-4">
                <Edit className="h-5 w-5 text-primary" />
                Role Tips
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-base-200 rounded-xl">
                  <p className="font-medium text-sm text-base-content">Role Name</p>
                  <p className="text-xs text-base-content/60 mt-1">
                    Use lowercase letters and underscores. Example: content_editor
                  </p>
                </div>
                <div className="p-3 bg-base-200 rounded-xl">
                  <p className="font-medium text-sm text-base-content">Display Name</p>
                  <p className="text-xs text-base-content/60 mt-1">
                    This is what users will see. Example: Content Editor
                  </p>
                </div>
                <div className="p-3 bg-base-200 rounded-xl">
                  <p className="font-medium text-sm text-base-content">Active Status</p>
                  <p className="text-xs text-base-content/60 mt-1">
                    Inactive roles cannot be assigned to users
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-gradient-to-br from-primary to-orange-500 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5" />
              Quick Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-2 bg-white/10 rounded-lg">
                <span className="text-white/80">Mode</span>
                <span className="font-medium">{isEditMode ? 'Edit' : 'Create'}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/10 rounded-lg">
                <span className="text-white/80">Permissions</span>
                <span className="font-medium">Configure after save</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <div className="p-6">
              <h3 className="font-bold text-base-content mb-4">Need Help?</h3>
              <p className="text-sm text-base-content/60 mb-4">
                Learn more about managing roles and permissions
              </p>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="btn btn-outline w-full justify-start"
                  onClick={() => navigate("/dashboard/roles")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  View All Roles
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRolePage;

