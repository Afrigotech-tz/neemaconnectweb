import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      color: "text-blue-600",
    },
    {
      title: "Active Content",
      value: "892",
      icon: FileText,
      description: "Published content items",
      trend: "+8% from last month",
      trendPositive: true,
      color: "text-green-600",
    },
    {
      title: "Revenue",
      value: "$24,580",
      icon: DollarSign,
      description: "Total revenue this month",
      trend: "+15% from last month",
      trendPositive: true,
      color: "text-purple-600",
    },
    {
      title: "System Health",
      value: "99.2%",
      icon: Activity,
      description: "Overall system uptime",
      trend: "+0.1% from last month",
      trendPositive: true,
      color: "text-orange-600",
    },
  ];

  // Management sections organized by category
  const managementSections = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      color: "bg-blue-500",
      items: [
        {
          name: "Users",
          href: "/users",
          description: "Manage user accounts",
        },
        {
          name: "Roles & Permissions",
          href: "/roles",
          description: "Configure user roles",
        },
        {
          name: "User Analytics",
          href: "/user-analytics",
          description: "User behavior insights",
        },
      ],
    },
    {
      title: "Content Management",
      description: "Manage all content across the platform",
      icon: BookOpen,
      color: "bg-green-500",
      items: [
        {
          name: "Blog Posts",
          href: "/admin/blog",
          description: "Manage blog content",
        },
        {
          name: "Music Library",
          href: "/admin/music",
          description: "Manage music tracks",
        },
        {
          name: "News Articles",
          href: "/admin/news",
          description: "Manage news content",
        },
        {
          name: "Gallery",
          href: "/admin/gallery",
          description: "Manage image gallery",
        },
        {
          name: "Events",
          href: "/admin/events",
          description: "Manage events calendar",
        },
      ],
    },
    {
      title: "Commerce Management",
      description: "Manage shop, products, and transactions",
      icon: ShoppingCart,
      color: "bg-purple-500",
      items: [
        {
          name: "Shop Management",
          href: "/admin/shop",
          description: "Manage shop products",
        },
        {
          name: "Product Categories",
          href: "/admin/products/categories",
          description: "Organize product categories",
        },
        {
          name: "Orders",
          href: "/admin/orders",
          description: "Manage customer orders",
        },
        {
          name: "Donations",
          href: "/admin/donations",
          description: "Track donations",
        },
        {
          name: "Payments",
          href: "/admin/payments",
          description: "Payment processing",
        },
      ],
    },
    {
      title: "System Management",
      description: "System settings, reports, and maintenance",
      icon: Settings,
      color: "bg-orange-500",
      items: [
        {
          name: "System Settings",
          href: "/admin/system-settings",
          description: "Configure system",
        },
        {
          name: "Reports & Analytics",
          href: "/admin/reports",
          description: "View detailed reports",
        },
        {
          name: "Partnerships",
          href: "/admin/partnerships",
          description: "Manage partnerships",
        },
        {
          name: "Email Templates",
          href: "/admin/email-templates",
          description: "Manage email templates",
        },
        {
          name: "Backup & Security",
          href: "/admin/security",
          description: "System security",
        },
      ],
    },
  ];

  // Recent activities
  const recentActivities = [
    {
      type: "user",
      title: "New user registered",
      description: "John Doe joined the platform",
      time: "2 hours ago",
      icon: Users,
      color: "text-blue-500",
    },
    {
      type: "content",
      title: "Blog post published",
      description: '"Easter Celebration 2024" was published',
      time: "4 hours ago",
      icon: BookOpen,
      color: "text-green-500",
    },
    {
      type: "commerce",
      title: "New order received",
      description: "Order #1247 for $89.99",
      time: "6 hours ago",
      icon: ShoppingCart,
      color: "text-purple-500",
    },
    {
      type: "system",
      title: "System backup completed",
      description: "Daily backup finished successfully",
      time: "8 hours ago",
      icon: Database,
      color: "text-orange-500",
    },
    {
      type: "donation",
      title: "Donation received",
      description: "$250 donation from anonymous donor",
      time: "1 day ago",
      icon: Heart,
      color: "text-red-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isSuperAdmin ? "SuperAdmin Dashboard" : "Admin Dashboard"}
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.first_name}! Complete control center for Neema
            Gospel Choir platform.
          </p>
        </div>
        {isSuperAdmin && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            SuperAdmin Access
          </Badge>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mb-2">
                  {stat.description}
                </p>
                <div
                  className={`flex items-center text-xs ${
                    stat.trendPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trendPositive ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertCircle className="h-3 w-3 mr-1" />
                  )}
                  {stat.trend}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {managementSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${section.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50  transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link
                          to={item.href}
                          className="flex items-center gap-1"
                        >
                          Manage
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent System Activity
          </CardTitle>
          <CardDescription>
            Latest activities across all platform modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-full bg-gray-100`}>
                    <Icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full">
              View All Activities
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">API Status</span>
                <Badge variant="default" className="bg-green-500">
                  Online
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Database</span>
                <Badge variant="default" className="bg-green-500">
                  Healthy
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Storage</span>
                <Badge variant="secondary">78% Used</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 text-purple-500" />
              Communications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Email Queue</span>
                <Badge variant="secondary">24 Pending</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Notifications</span>
                <Badge variant="secondary">12 Unread</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Messages</span>
                <Badge variant="secondary">5 New</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Today's Visitors</span>
                <Badge variant="secondary">1,247</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">New Signups</span>
                <Badge variant="secondary">23</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Sessions</span>
                <Badge variant="secondary">156</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper function for conditional classes
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default AdminDashboard;
