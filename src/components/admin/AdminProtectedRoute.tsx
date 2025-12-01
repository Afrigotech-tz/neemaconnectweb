import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check for admin role using both legacy and new role systems
  const hasAdminAccess =
    user.role === "admin" ||
    (user.roles &&
      user.roles.some(
        (role) => role.name === "admin" || role.name === "super_admin"
      ));

  if (!hasAdminAccess) {
    // Redirect non-admin users to dashboard or home
    return <Navigate to="/dashboard" replace />;
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default AdminProtectedRoute;
