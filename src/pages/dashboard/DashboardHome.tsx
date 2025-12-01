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
import { useAuth } from "@/hooks/useAuth";
import {
  User,
  Calendar,
  Music,
  Image,
  BookOpen,
  Box,
  Users,
  Package,
  Settings,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Newspaper,
  Heart,
  ShoppingCart,
  Handshake,
  CreditCard,
  BarChart3,
  Shield,
  Database,
  Activity,
  Globe,
  Mail,
  FileText,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";

interface StatItem {
  title: string;
  value: string;
  icon: any;
  description: string;
  color: string;
  trend?: string;
  trendPositive?: boolean;
}

const DashboardHome = () => {
  const { user } = useAuth();

  const isSuperAdmin = user?.roles?.some((role) => role.name === "super_admin");
  const isAdmin =
    user?.roles?.some((role) => role.name === "admin") ||
    user?.role === "admin";
  const hasAdminAccess = isSuperAdmin || isAdmin;

  const userStats: StatItem[] = [
    {
      title: "Profile Views",
      value: "1,234",
      description: "Total profile views this month",
      icon: User,
      color: "text-blue-600",
    },
    {
      title: "Upcoming Events",
      value: "5",
      description: "Events you're attending",
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: "Music Tracks",
      value: "24",
      description: "Your favorite songs",
      icon: Music,
      color: "text-purple-600",
    },
    {
      title: "Gallery Items",
      value: "48",
      description: "Photos in your gallery",
      icon: Image,
      color: "text-orange-600",
    },
  ];

  // Enhanced stats for superadmin
  const superAdminStats: StatItem[] = [
    {
      title: "Total Users",
      value: "10,000",
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

  // Basic admin stats for regular admin users
  const adminStats: StatItem[] = [
    {
      title: "Total Users",
      value: "1,234",
      icon: Users,
      description: "Registered users on platform",
      color: "text-blue-600",
    },
    {
      title: "Active Users",
      value: "987",
      icon: User,
      description: "Users active this month",
      color: "text-green-600",
    },
    {
      title: "Products",
      value: "156",
      icon: Package,
      description: "Products in catalog",
      color: "text-purple-600",
    },
    {
      title: "Content Items",
      value: "342",
      icon: FileText,
      description: "Published content items",
      color: "text-orange-600",
    },
  ];

  const stats = isSuperAdmin
    ? superAdminStats
    : isAdmin
    ? adminStats
    : userStats;

  // Management sections for superadmin
  const managementSections = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      color: "bg-blue-500",
      items: [
        {
          name: "Users",
          href: "/dashboard/users",
          description: "Manage user accounts",
        },
        {
          name: "Roles & Permissions",
          href: "/dashboard/roles",
          description: "Configure user roles",
        },
        {
          name: "User Analytics",
          href: "/dashboard/user-analytics",
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
          name: "Blog Management",
          href: "/dashboard/blog-management",
          description: "Manage blog content",
        },
        {
          name: "Music Library",
          href: "/dashboard/music",
          description: "Manage music tracks",
        },
        {
          name: "News Articles",
          href: "/dashboard/news",
          description: "Manage news content",
        },
        {
          name: "Gallery",
          href: "/dashboard/gallery",
          description: "Manage image gallery",
        },
        {
          name: "Events Management",
          href: "/dashboard/events-management",
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
          href: "/dashboard/shop",
          description: "Manage shop products",
        },
        {
          name: "Product Categories",
          href: "/dashboard/products/categories",
          description: "Organize product categories",
        },
        {
          name: "Orders",
          href: "/dashboard/orders",
          description: "Manage customer orders",
        },
        {
          name: "Donations",
          href: "/dashboard/donations",
          description: "Track donations",
        },
        {
          name: "Payments",
          href: "/dashboard/payments",
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
          href: "/dashboard/settings",
          description: "Configure system",
        },
        {
          name: "Reports & Analytics",
          href: "/dashboard/reports",
          description: "View detailed reports",
        },
        {
          name: "Partnerships",
          href: "/dashboard/partnership",
          description: "Manage partnerships",
        },
        {
          name: "Email Templates",
          href: "/dashboard/email-templates",
          description: "Manage email templates",
        },
        {
          name: "Backup & Security",
          href: "/dashboard/security",
          description: "System security",
        },
      ],
    },
  ];

  // Basic admin sections for regular admin users
  const adminSections = [
    {
      title: "User Management",
      description: "Manage users and basic permissions",
      icon: Users,
      color: "bg-blue-500",
      items: [
        {
          name: "Users",
          href: "/dashboard/users",
          description: "Manage user accounts",
        },
        {
          name: "User Details",
          href: "/dashboard/user-details",
          description: "View user information",
        },
      ],
    },
    {
      title: "Content Management",
      description: "Manage content across the platform",
      icon: BookOpen,
      color: "bg-green-500",
      items: [
        {
          name: "Blog Management",
          href: "/dashboard/blog-management",
          description: "Manage blog posts",
        },
        {
          name: "Music Library",
          href: "/dashboard/music",
          description: "Manage music content",
        },
        {
          name: "News Articles",
          href: "/dashboard/news",
          description: "Manage news articles",
        },
      ],
    },
    {
      title: "Shop Management",
      description: "Manage products and orders",
      icon: Box,
      color: "bg-purple-500",
      items: [
        {
          name: "Product Categories",
          href: "/dashboard/products/categories",
          description: "Manage categories",
        },
        {
          name: "Products",
          href: "/dashboard/products",
          description: "Manage products",
        },
        {
          name: "Orders",
          href: "/dashboard/orders",
          description: "View and manage orders",
        },
      ],
    },
  ];

  const quickActions = isSuperAdmin
    ? [
        {
          title: "User Management",
          icon: Users,
          href: "/dashboard/users",
          color: "bg-blue-500",
        },
        {
          title: "Shop Management",
          icon: Box,
          href: "/dashboard/shop",
          color: "bg-green-500",
        },
        {
          title: "Product Categories",
          icon: Package,
          href: "/dashboard/products/categories",
          color: "bg-purple-500",
        },
        {
          title: "System Settings",
          icon: Settings,
          href: "/dashboard/settings",
          color: "bg-orange-500",
        },
      ]
    : isAdmin
    ? [
        {
          title: "User Management",
          icon: Users,
          href: "/dashboard/users",
          color: "bg-blue-500",
        },
        {
          title: "Product Categories",
          icon: Package,
          href: "/dashboard/products/categories",
          color: "bg-purple-500",
        },
        {
          title: "Content Management",
          icon: BookOpen,
          href: "/dashboard/blog-management",
          color: "bg-green-500",
        },
        {
          title: "Orders",
          icon: ShoppingCart,
          href: "/dashboard/orders",
          color: "bg-orange-500",
        },
      ]
    : [
        {
          title: "Write Blog Post",
          icon: BookOpen,
          href: "/dashboard/blog",
          color: "bg-blue-500",
        },
        {
          title: "Upload Music",
          icon: Music,
          href: "/dashboard/music",
          color: "bg-purple-500",
        },
        {
          title: "Add to Gallery",
          icon: Image,
          href: "/dashboard/gallery",
          color: "bg-orange-500",
        },
        {
          title: "Edit Profile",
          icon: User,
          href: "/dashboard/profile",
          color: "bg-green-500",
        },
      ];

  // Recent activities for superadmin
  const recentActivities = [
    {
      title: "New user registered",
      description: "John Doe joined the platform",
      time: "2 hours ago",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Blog post published",
      description: '"Easter Celebration 2024" was published',
      time: "4 hours ago",
      icon: BookOpen,
      color: "text-green-500",
    },
    {
      title: "New order received",
      description: "Order #1247 for $89.99",
      time: "6 hours ago",
      icon: ShoppingCart,
      color: "text-purple-500",
    },
    {
      title: "System backup completed",
      description: "Daily backup finished successfully",
      time: "8 hours ago",
      icon: Database,
      color: "text-orange-500",
    },
    {
      title: "Donation received",
      description: "$250 donation from anonymous donor",
      time: "1 day ago",
      icon: Heart,
      color: "text-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold text-gray-900 truncate">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            {isSuperAdmin
              ? "Complete control center for Neema Gospel Choir platform."
              : isAdmin
              ? "Here's the overview of your admin dashboard."
              : "Here's what's happening with your account today."}
          </p>
        </div>
        {isSuperAdmin && (
          <div className="flex-shrink-0">
            <Badge variant="destructive" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              SuperAdmin Access
            </Badge>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                {isSuperAdmin && stat.trend && (
                  <div className="flex items-center pt-1">
                    <TrendingUp
                      className={`h-3 w-3 mr-1 ${
                        stat.trendPositive ? "text-green-500" : "text-red-500"
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        stat.trendPositive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stat.trend}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isSuperAdmin && (
        <>
          {/* Management Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {managementSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-200"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon
                        className={`h-5 w-5 ${section.color.replace(
                          "bg-",
                          "text-"
                        )}`}
                      />
                      {section.title}
                    </CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <Button
                          key={itemIndex}
                          asChild
                          variant="ghost"
                          className="w-full justify-start hover:bg-gray-50 transition-colors"
                        >
                          <Link
                            to={item.href}
                            className="flex items-center justify-between"
                          >
                            <span>{item.name}</span>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* System Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Status</span>
                  <Badge variant="default" className="bg-green-500">
                    Healthy
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">Uptime</span>
                  <Badge variant="secondary">99.9%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Used</span>
                  <Badge variant="secondary">78% Used</Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">Available</span>
                  <Badge variant="secondary">22% Free</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-500" />
                  Communications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Email Queue</span>
                  <Badge variant="secondary">24 Pending</Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">Notifications</span>
                  <Badge variant="secondary">12 Unread</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Today's Visitors</span>
                  <Badge variant="secondary">1,247</Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">New Signups</span>
                  <Badge variant="secondary">23</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {isAdmin && !isSuperAdmin && (
        <>
          {/* Basic Admin Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {adminSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-200"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon
                        className={`h-5 w-5 ${section.color.replace(
                          "bg-",
                          "text-"
                        )}`}
                      />
                      {section.title}
                    </CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <Button
                          key={itemIndex}
                          asChild
                          variant="ghost"
                          className="w-full justify-start hover:bg-gray-50 transition-colors"
                        >
                          <Link
                            to={item.href}
                            className="flex items-center justify-between"
                          >
                            <span>{item.name}</span>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Quickly access frequently used features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  asChild
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Link to={action.href} className="flex items-center gap-2">
                    <Icon
                      className={`h-4 w-4 ${
                        action.color ? action.color.replace("bg-", "text-") : ""
                      }`}
                    />
                    {action.title}
                  </Link>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

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
            {isSuperAdmin ? (
              <>
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 sm:gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className={`p-2 rounded-full bg-gray-100 flex-shrink-0`}
                      >
                        <Icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0 hidden sm:block">
                        {activity.time}
                      </span>
                    </div>
                  );
                })}
              </>
            ) : isAdmin ? (
              <>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      New user registered
                    </p>
                    <p className="text-sm text-muted-foreground">
                      John Doe joined the platform - 2 hours ago
                    </p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      Product category updated
                    </p>
                    <p className="text-sm text-muted-foreground">
                      "Music" category modified - 1 day ago
                    </p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Order processed</p>
                    <p className="text-sm text-muted-foreground">
                      Order #1247 completed - 3 hours ago
                    </p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Updated profile picture
                    </p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Added new blog post</p>
                    <p className="text-sm text-muted-foreground">1 day ago</p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Uploaded music track</p>
                    <p className="text-sm text-muted-foreground">3 days ago</p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </>
            )}
          </div>
          {isSuperAdmin && (
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full">
                View All Activities
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
