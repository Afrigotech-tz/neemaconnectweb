import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import { grantTestAdminAccess } from "@/utils/createTestAdmin";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // In development mode, grant admin access to any logged-in user for testing
  const isDevelopment = process.env.NODE_ENV === "development";
  let effectiveUser = user;

  if (isDevelopment) {
    // Grant admin access to current user for testing purposes
    effectiveUser = grantTestAdminAccess(user);
    console.log(
      "🔧 Development Mode: Granting admin access for testing",
      effectiveUser
    );
  }

  // Check for admin role using both legacy and new role systems
  const hasAdminAccess =
    effectiveUser.role === "admin" ||
    (effectiveUser.roles &&
      effectiveUser.roles.some(
        (role) => role.name === "admin" || role.name === "super_admin"
      ));

  if (!hasAdminAccess) {
    // Redirect non-admin users to dashboard or home
    return <Navigate to="/dashboard" replace />;
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default AdminProtectedRoute;
