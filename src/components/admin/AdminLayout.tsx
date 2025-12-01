import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
  Box,
  Shield,
  BookOpen,
  Music,
  Newspaper,
  Image,
  Calendar,
  Package,
  ShoppingCart,
  Heart,
  CreditCard,
  BarChart3,
  Handshake,
  Settings,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the admin panel.",
    });
  };

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    // User Management Section
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      section: "User Management",
    },
    {
      name: "Roles & Permissions",
      href: "/admin/roles",
      icon: Shield,
      section: "User Management",
    },
    // Content Management Section
    {
      name: "Blog Management",
      href: "/admin/blog",
      icon: BookOpen,
      section: "Content Management",
    },
    {
      name: "Music Library",
      href: "/admin/music",
      icon: Music,
      section: "Content Management",
    },
    {
      name: "News Management",
      href: "/admin/news",
      icon: Newspaper,
      section: "Content Management",
    },
    {
      name: "Gallery",
      href: "/admin/gallery",
      icon: Image,
      section: "Content Management",
    },
    {
      name: "Events",
      href: "/admin/events",
      icon: Calendar,
      section: "Content Management",
    },
    // Commerce Management Section
    {
      name: "Shop",
      href: "/admin/shop",
      icon: Box,
      section: "Commerce",
    },
    {
      name: "Product Categories",
      href: "/admin/products/categories",
      icon: Package,
      section: "Commerce",
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      section: "Commerce",
    },
    {
      name: "Donations",
      href: "/admin/donations",
      icon: Heart,
      section: "Commerce",
    },
    {
      name: "Payments",
      href: "/admin/payments",
      icon: CreditCard,
      section: "Commerce",
    },
    // System Management Section
    {
      name: "Reports",
      href: "/admin/reports",
      icon: BarChart3,
      section: "System",
    },
    {
      name: "Partnerships",
      href: "/admin/partnerships",
      icon: Handshake,
      section: "System",
    },
    {
      name: "System Settings",
      href: "/admin/system-settings",
      icon: Settings,
      section: "System",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:z-auto flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-8 px-4 flex-1 overflow-y-auto">
          {/* Dashboard Link */}
          <div className="mb-6">
            <Link
              to="/admin"
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive("/admin")
                  ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
              onClick={() => setIsSidebarOpen(false)}
            >
              <LayoutDashboard className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="truncate">SuperAdmin Dashboard</span>
            </Link>
          </div>

          {/* Navigation Sections */}
          {["User Management", "Content Management", "Commerce", "System"].map(
            (sectionName) => {
              const sectionItems = navigationItems.filter(
                (item) => item.section === sectionName
              );
              if (sectionItems.length === 0) return null;

              return (
                <div key={sectionName} className="mb-6">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {sectionName}
                  </h3>
                  <div className="space-y-1">
                    {sectionItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={cn(
                            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                            isActive(item.href)
                              ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          )}
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="truncate">Logout</span>
            </Button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Mobile header */}
        <header className="bg-white border-b border-gray-200 lg:hidden sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
            <div className="w-9" /> {/* Spacer for balance */}
          </div>
        </header>

        {/* Page content */}
        <main className="pt-0 pb-4">
          <div className="px-4 sm:px-6 lg:px-8 max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
