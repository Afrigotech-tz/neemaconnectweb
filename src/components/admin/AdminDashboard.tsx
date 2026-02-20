import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Box,
  BookOpen,
  Music,
  Newspaper,
  Image,
  Calendar,
  Heart,
  Package,
  ShoppingCart,
  Handshake,
  CreditCard,
  BarChart3,
  Settings,
  Shield,
  Database,
  Activity,
  Globe,
  Mail,
  FileText,
  DollarSign,
  Zap,
  Target,
  Award,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  // Check if user is superadmin for enhanced features
  const isSuperAdmin =
    user?.roles?.some((role) => role.name === "super_admin") ||
    user?.role === "admin";

  // Comprehensive stats for admin/superadmin
  const stats = [
    {
      title: "Total Users",
      value: "1,247",
      icon: Users,
      description: "Registered platform users",
      trend: "+12% from last month",
      trendPositive: true,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-500",
    },
    {
      title: "Active Content",
      value: "892",
      icon: FileText,
      description: "Published content items",
      trend: "+8% from last month",
      trendPositive: true,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconBg: "bg-green-500",
    },
    {
      title: "Revenue",
      value: "$24,580",
      icon: DollarSign,
      description: "Total revenue this month",
      trend: "+15% from last month",
      trendPositive: true,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-500",
    },
    {
      title: "System Health",
      value: "99.2%",
      icon: Activity,
      description: "Overall system uptime",
      trend: "+0.1% from last month",
      trendPositive: true,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-500",
    },
  ];

  // Management sections organized by category
  const managementSections = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      items: [
        { name: "Users", href: "/users", description: "Manage user accounts" },
        { name: "Roles & Permissions", href: "/roles", description: "Configure user roles" },
        { name: "User Analytics", href: "/user-analytics", description: "User behavior insights" },
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
        { name: "News Articles", href: "/admin/news", description: "Manage news content" },
        { name: "Gallery", href: "/admin/gallery", description: "Manage image gallery" },
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
        { name: "Payments", href: "/admin/payments", description: "Payment processing" },
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
        { name: "Email Templates", href: "/admin/email-templates", description: "Manage templates" },
      ],
    },
  ];

  // Recent activities
  const recentActivities = [
    { type: "user", title: "New user registered", description: "John Doe joined the platform", time: "2 hours ago", icon: Users, color: "text-blue-500", bgColor: "bg-blue-50" },
    { type: "content", title: "Blog post published", description: '"Easter Celebration 2024" was published', time: "4 hours ago", icon: BookOpen, color: "text-green-500", bgColor: "bg-green-50" },
    { type: "commerce", title: "New order received", description: "Order #1247 for $89.99", time: "6 hours ago", icon: ShoppingCart, color: "text-purple-500", bgColor: "bg-purple-50" },
    { type: "system", title: "System backup completed", description: "Daily backup finished successfully", time: "8 hours ago", icon: Database, color: "text-orange-500", bgColor: "bg-orange-50" },
    { type: "donation", title: "Donation received", description: "$250 donation from anonymous donor", time: "1 day ago", icon: Heart, color: "text-red-500", bgColor: "bg-red-50" },
  ];

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
        {stats.map((stat, index) => {
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
                  <div className={`flex items-center gap-1 text-sm font-medium ${stat.trendPositive ? "text-green-500" : "text-red-500"}`}>
                    {stat.trendPositive ? <TrendingUp className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {stat.trend.split(' ')[0]}
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
              <Button variant="ghost" size="sm" className="btn btn-ghost btn-sm text-primary">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-base-50 transition-colors"
                  >
                    <div className={`p-2.5 rounded-xl ${activity.bgColor}`}>
                      <Icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-base-content">{activity.title}</p>
                      <p className="text-sm text-base-content/50">{activity.description}</p>
                    </div>
                    <span className="text-xs text-base-content/40 whitespace-nowrap">{activity.time}</span>
                  </div>
                );
              })}
            </div>
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

          {/* Quick Stats Card */}
          <div className="bg-gradient-to-br from-primary to-orange-500 rounded-2xl shadow-lg p-6 text-white">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5" />
              Today's Overview
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">1,247</p>
                <p className="text-xs text-white/80">Visitors</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">23</p>
                <p className="text-xs text-white/80">New Signups</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">$2,450</p>
                <p className="text-xs text-white/80">Revenue</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">156</p>
                <p className="text-xs text-white/80">Active Users</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

