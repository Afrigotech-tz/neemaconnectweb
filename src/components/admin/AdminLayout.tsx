import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
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
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState<string[]>(["User Management", "Content Management", "Commerce", "System"]);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the admin panel.",
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
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
    <div className="drawer lg:drawer-open min-h-screen" data-theme="neemadmin">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" checked={isSidebarOpen} onChange={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="drawer-content flex flex-col" style={{ background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)' }}>
        {/* Mobile Header */}
        <div className="navbar bg-gradient-to-r from-primary to-primary/80 lg:hidden sticky top-0 z-40 text-white shadow-lg">
          <div className="flex-none">
            <label htmlFor="admin-drawer" className="btn btn-square btn-ghost text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div className="flex-1">
            <a className="btn btn-ghost text-xl font-bold text-white">Admin Panel</a>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-50">
        <label htmlFor="admin-drawer" className="drawer-overlay" onClick={() => setIsSidebarOpen(false)}></label>
        <aside className="bg-gradient-to-b from-base-100 to-base-200 w-72 min-h-screen flex flex-col border-r border-base-300 shadow-2xl">
          {/* Logo */}
          <div className="h-20 flex items-center justify-center px-4 border-b border-base-300 bg-gradient-to-r from-primary to-orange-600">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">NeemaAdmin</h1>
              <p className="text-xs text-white/80">Management Console</p>
            </div>
            <label htmlFor="admin-drawer" className="btn btn-sm btn-circle btn-ghost absolute right-4 lg:hidden">
              <X className="h-5 w-5 text-white" />
            </label>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Dashboard Link */}
            <div className="mb-4">
              <Link
                to="/admin"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive("/admin")
                    ? "bg-gradient-to-r from-primary to-orange-500 text-white shadow-lg shadow-primary/30 transform scale-105"
                    : "hover:bg-base-200 text-base-content hover:translate-x-1"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <div className={`p-2 rounded-lg ${isActive("/admin") ? "bg-white/20" : "bg-base-200"}`}>
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <span className="font-semibold">Dashboard</span>
                {isActive("/admin") && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            </div>

            {/* Navigation Sections */}
            {["User Management", "Content Management", "Commerce", "System"].map(
              (sectionName) => {
                const sectionItems = navigationItems.filter(
                  (item) => item.section === sectionName
                );
                if (sectionItems.length === 0) return null;

                const isExpanded = expandedSections.includes(sectionName);

                return (
                  <div key={sectionName} className="collapse collapse-arrow bg-base-100 rounded-xl border border-base-200 shadow-sm">
                    <input 
                      type="checkbox" 
                      checked={isExpanded} 
                      onChange={() => toggleSection(sectionName)}
                    />
                    <div className="collapse-title font-semibold text-sm uppercase tracking-wider text-base-content/70 px-4 py-3">
                      {sectionName}
                    </div>
                    <div className="collapse-content">
                      <div className="space-y-1 px-2">
                        {sectionItems.map((item) => {
                          const Icon = item.icon;
                          const active = isActive(item.href);
                          return (
                            <Link
                              key={item.name}
                              to={item.href}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                                active
                                  ? "bg-gradient-to-r from-primary/10 to-orange-500/10 text-primary border-l-4 border-primary font-medium"
                                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
                              }`}
                              onClick={() => setIsSidebarOpen(false)}
                            >
                              <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
                              <span className="text-sm">{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }
            )}

            {/* Logout */}
            <div className="mt-6 pt-4 border-t border-base-300">
              <button
                className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-error/10 text-error transition-colors duration-200"
                onClick={handleLogout}
              >
                <div className="p-2 rounded-lg bg-error/10">
                  <LogOut className="h-5 w-5" />
                </div>
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-base-300">
            <div className="bg-gradient-to-r from-base-200 to-base-100 rounded-xl p-4 text-center">
              <p className="text-xs text-base-content/50">© 2024 NeemaConnect</p>
              <p className="text-xs text-base-content/40">Version 1.0.0</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminLayout;

