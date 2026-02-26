import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileText,
  DollarSign,
  Activity,
  ShoppingCart,
  Heart,
  Package,
  Calendar,
  Settings,
  Shield,
  Database,
  Globe,
  BarChart3,
  Handshake,
  BookOpen,
  Music,
  Zap,
  Loader2,
  Gift,
  Wallet,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { dashboardService, DashboardStats, RecentActivity } from "@/services/dashboardService";
import { formatTZS, formatTZShort } from "@/lib/currency";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is superadmin for enhanced features
  const isSuperAdmin =
    user?.roles?.some((role) => role.name === "super_admin") ||
    user?.role === "admin";

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsData, activitiesData] = await Promise.all([
          dashboardService.getAdminStats(),
          dashboardService.getRecentActivities(10),
        ]);
        setStats(statsData);
        setActivities(activitiesData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Get activity icon based on type
  const getActivityIcon = (icon: string) => {
    const icons: Record<string, React.ReactNode> = {
      'shopping-cart': <ShoppingCart className="h-4 w-4" />,
      'user': <Users className="h-4 w-4" />,
      'calendar': <Calendar className="h-4 w-4" />,
      'file-text': <FileText className="h-4 w-4" />,
      'heart': <Heart className="h-4 w-4" />,
    };
    return icons[icon] || <Activity className="h-4 w-4" />;
  };

  // Get activity color classes
  const getActivityColor = (color: string) => {
    const colors: Record<string, string> = {
      purple: "bg-purple-50 text-purple-500",
      blue: "bg-blue-50 text-blue-500",
      green: "bg-green-50 text-green-500",
      red: "bg-red-50 text-red-500",
      orange: "bg-orange-50 text-orange-500",
    };
    return colors[color] || "bg-gray-50 text-gray-500";
  };

  // Stats cards configuration
  const getStatsConfig = () => {
    if (!stats) return [];
    
    return [
      {
        title: "Total Users",
        value: stats.users.total.toLocaleString(),
        icon: Users,
        description: "Registered platform users",
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50",
        iconBg: "bg-blue-500",
      },
      {
        title: "Total Orders",
        value: stats.orders.total.toLocaleString(),
        icon: ShoppingCart,
        description: `${stats.orders.pending} pending, ${stats.orders.processing} processing`,
        color: "from-purple-500 to-purple-600",
        bgColor: "bg-purple-50",
        iconBg: "bg-purple-500",
      },
      {
        title: "Total Revenue",
        value: formatTZShort(stats.orders.totalRevenue),
        icon: DollarSign,
        description: "From completed orders",
        color: "from-green-500 to-green-600",
        bgColor: "bg-green-50",
        iconBg: "bg-green-500",
      },
      {
        title: "Products",
        value: stats.products.total.toLocaleString(),
        icon: Package,
        description: `${stats.products.active} active listings`,
        color: "from-orange-500 to-orange-600",
        bgColor: "bg-orange-50",
        iconBg: "bg-orange-500",
      },
      {
        title: "Blog Posts",
        value: stats.blogs.total.toLocaleString(),
        icon: FileText,
        description: `${stats.blogs.active} published`,
        color: "from-cyan-500 to-cyan-600",
        bgColor: "bg-cyan-50",
        iconBg: "bg-cyan-500",
      },
      {
        title: "Events",
        value: stats.events.total.toLocaleString(),
        icon: Calendar,
        description: `${stats.events.upcoming} upcoming`,
        color: "from-pink-500 to-pink-600",
        bgColor: "bg-pink-50",
        iconBg: "bg-pink-500",
      },
      {
        title: "Donations",
        value: formatTZShort(stats.donations.totalAmount),
        icon: Heart,
        description: `${stats.donations.total} total donations`,
        color: "from-red-500 to-red-600",
        bgColor: "bg-red-50",
        iconBg: "bg-red-500",
      },
      {
        title: "System Health",
        value: "99.2%",
        icon: Activity,
        description: "Overall system uptime",
        color: "from-emerald-500 to-emerald-600",
        bgColor: "bg-emerald-50",
        iconBg: "bg-emerald-500",
      },
    ];
  };

  // Management sections
  const managementSections = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      items: [
        { name: "Users", href: "/admin/users", description: "Manage user accounts" },
        { name: "Roles & Permissions", href: "/admin/roles", description: "Configure user roles" },
      ],
    },
    {
      title: "Content Management",
      description: "Manage all content across the platform",
      icon: BookOpen,
      color: "from-green-500 to-green-600",
      items: [
        { name: "Blog Posts", href: "/admin/blog", description: "Manage blog content" },
        { name: "Music Library", href: "/admin/music", description: "Manage music tracks" },
        { name: "Events", href: "/admin/events", description: "Manage events calendar" },
      ],
    },
    {
      title: "Commerce Management",
      description: "Manage shop, products, and transactions",
      icon: ShoppingCart,
      color: "from-purple-500 to-purple-600",
      items: [
        { name: "Shop Management", href: "/admin/shop", description: "Manage shop products" },
        { name: "Product Categories", href: "/admin/products/categories", description: "Organize categories" },
        { name: "Orders", href: "/admin/orders", description: "Manage customer orders" },
        { name: "Donations", href: "/admin/donations", description: "Track donations" },
      ],
    },
    {
      title: "System Management",
      description: "System settings, reports, and maintenance",
      icon: Settings,
      color: "from-orange-500 to-orange-600",
      items: [
        { name: "System Settings", href: "/admin/system-settings", description: "Configure system" },
        { name: "Reports & Analytics", href: "/admin/reports", description: "View detailed reports" },
        { name: "Partnerships", href: "/admin/partnerships", description: "Manage partnerships" },
      ],
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statsConfig = getStatsConfig();

  return (
    <div className="space-y-8" data-theme="neemadmin">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-orange-500 to-secondary p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold drop-shadow-lg">
              {isSuperAdmin ? "SuperAdmin Dashboard" : "Admin Dashboard"}
            </h1>
            <p className="mt-2 text-white/90 text-lg">
              Welcome back, {user?.first_name}! Here's your platform overview.
            </p>
          </div>
          {isSuperAdmin && (
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">SuperAdmin Access</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.iconBg} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h2 className="text-sm font-medium text-base-content/60 mb-1">{stat.title}</h2>
                <p className="text-3xl font-bold text-base-content">{stat.value}</p>
                <p className="text-xs text-base-content/50 mt-2">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {managementSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div 
              key={index} 
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${section.color}`}></div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-base-content">{section.title}</h2>
                    <p className="text-sm text-base-content/60">{section.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      to={item.href}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-base-100 border border-transparent hover:border-base-200 transition-all duration-200 group/item"
                    >
                      <div>
                        <p className="font-medium text-base-content group-hover/item:text-primary transition-colors">{item.name}</p>
                        <p className="text-xs text-base-content/50">{item.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-base-content/30 group-hover/item:text-primary group-hover/item:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Quick Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary to-orange-500"></div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activity
              </h2>
            </div>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.slice(0, 6).map((activity, index) => (
                  <div
                    key={`${activity.type}-${activity.id}-${index}`}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-base-50 transition-colors"
                  >
                    <div className={`p-2.5 rounded-xl ${getActivityColor(activity.color)}`}>
                      {getActivityIcon(activity.icon)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-base-content">{activity.title}</p>
                      <p className="text-sm text-base-content/50">{activity.description}</p>
                    </div>
                    <span className="text-xs text-base-content/40 whitespace-nowrap">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick System Status */}
        <div className="space-y-6">
          {/* System Status Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <div className="p-6">
              <h2 className="text-lg font-bold text-base-content flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-info" />
                System Status
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-base-content/70">API Status</span>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="badge badge-success badge-sm">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-base-content/70">Database</span>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="badge badge-success badge-sm">Healthy</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-base-content/70">Storage</span>
                  <span className="badge badge-warning badge-sm">78% Used</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-base-content/70">Memory</span>
                  <span className="badge badge-info badge-sm">45% Used</span>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Overview */}
          <div className="bg-gradient-to-br from-primary to-orange-500 rounded-2xl shadow-lg p-6 text-white">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5" />
              Today's Overview
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">{stats?.users.newThisMonth || 0}</p>
                <p className="text-xs text-white/80">New Users</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">{stats?.orders.pending || 0}</p>
                <p className="text-xs text-white/80">Pending Orders</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">{formatTZS(stats?.orders.totalRevenue || 0)}</p>
                <p className="text-xs text-white/80">Revenue</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">{stats?.events.upcoming || 0}</p>
                <p className="text-xs text-white/80">Upcoming Events</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

