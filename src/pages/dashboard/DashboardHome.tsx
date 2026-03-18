import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Heart,
  Loader2,
  Music,
  Package,
  RefreshCw,
  Settings,
  Shield,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  dashboardService,
  DashboardStats,
  RecentActivity,
  UserDashboardStats,
} from "@/services/dashboardService/dashboardService";
import { formatTZS, formatTZShort } from "@/lib/currency";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from "recharts";

interface DashboardCardItem {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}

interface ManagementSection {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  items: Array<{ name: string; href: string; description: string }>;
}

const EMPTY_ADMIN_STATS: DashboardStats = {
  users: { total: 0, active: 0, newThisMonth: 0 },
  orders: {
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
  },
  products: { total: 0, active: 0, outOfStock: 0, lowStock: 0 },
  blogs: { total: 0, active: 0 },
  events: { total: 0, upcoming: 0, past: 0 },
  donations: { total: 0, totalAmount: 0, thisMonth: 0, thisMonthAmount: 0 },
};

const EMPTY_USER_STATS: UserDashboardStats = {
  orders: { total: 0, pending: 0, completed: 0, totalSpent: 0 },
  donations: { total: 0, totalAmount: 0 },
  recentOrders: [],
};

const ORDER_STATUS_COLORS = ["#0284c7", "#16a34a", "#f59e0b", "#dc2626"];

const adminChartConfig = {
  total: { label: "Total", color: "#0ea5e9" },
  amount: { label: "Amount", color: "#0f766e" },
  score: { label: "Score", color: "#f97316" },
};

const userChartConfig = {
  value: { label: "Value", color: "#0ea5e9" },
  amount: { label: "Amount", color: "#0f766e" },
};

const getPercentage = (value: number, total: number): number => {
  if (!total || total <= 0) return 0;
  return Math.round((value / total) * 100);
};

const getUserIdAsNumber = (rawId: unknown): number | undefined => {
  if (typeof rawId === "number" && Number.isFinite(rawId)) return rawId;
  if (typeof rawId === "string") {
    const parsed = Number.parseInt(rawId, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

const getActivityIcon = (icon: string) => {
  switch (icon) {
    case "shopping-cart":
      return ShoppingCart;
    case "user":
      return Users;
    case "calendar":
      return Calendar;
    case "heart":
      return Heart;
    default:
      return Activity;
  }
};

const getStatusPill = (status: string) => {
  const normalized = status.toLowerCase();

  if (normalized === "completed" || normalized === "delivered" || normalized === "paid") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (normalized === "pending" || normalized === "processing" || normalized === "shipped") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  return "bg-rose-50 text-rose-700 border-rose-200";
};

const formatStatusLabel = (status: string) => {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const DashboardHome = () => {
  const { user } = useAuth();

  const isSuperAdmin = useMemo(
    () => user?.roles?.some((role) => role.name === "super_admin") || false,
    [user?.roles]
  );
  const isAdmin = useMemo(
    () => user?.roles?.some((role) => role.name === "admin") || user?.role === "admin",
    [user?.role, user?.roles]
  );
  const hasAdminAccess = isSuperAdmin || isAdmin;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminStats, setAdminStats] = useState<DashboardStats | null>(null);
  const [userStats, setUserStats] = useState<UserDashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);

  const loadDashboard = useCallback(
    async (showInitialLoader: boolean) => {
      if (showInitialLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError(null);

      try {
        if (hasAdminAccess) {
          const [statsData, activitiesData] = await Promise.all([
            dashboardService.getAdminStats(),
            dashboardService.getRecentActivities(8),
          ]);
          setAdminStats(statsData);
          setActivities(activitiesData);
          setUserStats(null);
          return;
        }

        const statsData = await dashboardService.getUserStats(getUserIdAsNumber(user?.id));
        setUserStats(statsData);
        setAdminStats(null);
        setActivities([]);
      } catch (loadError) {
        console.error("Failed to load dashboard:", loadError);
        setError("Failed to load dashboard data. Please refresh and try again.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [hasAdminAccess, user?.id]
  );

  useEffect(() => {
    void loadDashboard(true);
  }, [loadDashboard]);

  const effectiveAdminStats = adminStats ?? EMPTY_ADMIN_STATS;
  const effectiveUserStats = userStats ?? EMPTY_USER_STATS;

  const adminTopCards = useMemo<DashboardCardItem[]>(
    () => [
      {
        title: "Users",
        value: effectiveAdminStats.users.total.toLocaleString(),
        description: `${effectiveAdminStats.users.active.toLocaleString()} active, ${effectiveAdminStats.users.newThisMonth.toLocaleString()} new this month`,
        icon: Users,
        tone: "from-sky-500 to-cyan-500",
      },
      {
        title: "Orders",
        value: effectiveAdminStats.orders.total.toLocaleString(),
        description: `${effectiveAdminStats.orders.pending} pending and ${effectiveAdminStats.orders.completed} completed`,
        icon: ShoppingCart,
        tone: "from-amber-500 to-orange-500",
      },
      {
        title: "Revenue",
        value: formatTZShort(effectiveAdminStats.orders.totalRevenue),
        description: "Completed order revenue",
        icon: DollarSign,
        tone: "from-emerald-500 to-teal-500",
      },
      {
        title: "Donations",
        value: formatTZShort(effectiveAdminStats.donations.totalAmount),
        description: `${effectiveAdminStats.donations.total.toLocaleString()} total donations`,
        icon: Heart,
        tone: "from-rose-500 to-red-500",
      },
      {
        title: "Products",
        value: effectiveAdminStats.products.total.toLocaleString(),
        description: `${effectiveAdminStats.products.outOfStock} out of stock, ${effectiveAdminStats.products.lowStock} low stock`,
        icon: Package,
        tone: "from-indigo-500 to-sky-500",
      },
      {
        title: "Events",
        value: effectiveAdminStats.events.total.toLocaleString(),
        description: `${effectiveAdminStats.events.upcoming.toLocaleString()} upcoming events`,
        icon: Calendar,
        tone: "from-violet-500 to-indigo-500",
      },
    ],
    [effectiveAdminStats]
  );

  const userTopCards = useMemo<DashboardCardItem[]>(
    () => [
      {
        title: "My Orders",
        value: effectiveUserStats.orders.total.toLocaleString(),
        description: "Total orders placed",
        icon: ShoppingCart,
        tone: "from-sky-500 to-cyan-500",
      },
      {
        title: "Pending Orders",
        value: effectiveUserStats.orders.pending.toLocaleString(),
        description: "Orders waiting for processing",
        icon: Loader2,
        tone: "from-amber-500 to-orange-500",
      },
      {
        title: "Completed Orders",
        value: effectiveUserStats.orders.completed.toLocaleString(),
        description: "Successfully completed orders",
        icon: CheckCircle2,
        tone: "from-emerald-500 to-teal-500",
      },
      {
        title: "Total Spent",
        value: formatTZShort(effectiveUserStats.orders.totalSpent),
        description: "Your lifetime spending",
        icon: DollarSign,
        tone: "from-indigo-500 to-sky-500",
      },
      {
        title: "My Donations",
        value: effectiveUserStats.donations.total.toLocaleString(),
        description: "Contributions you have made",
        icon: Heart,
        tone: "from-rose-500 to-red-500",
      },
      {
        title: "Donation Amount",
        value: formatTZShort(effectiveUserStats.donations.totalAmount),
        description: "Total amount donated",
        icon: TrendingUp,
        tone: "from-teal-500 to-cyan-500",
      },
    ],
    [effectiveUserStats]
  );

  const moduleVolumeData = useMemo(
    () => [
      { module: "Users", total: effectiveAdminStats.users.total },
      { module: "Orders", total: effectiveAdminStats.orders.total },
      { module: "Products", total: effectiveAdminStats.products.total },
      { module: "Blogs", total: effectiveAdminStats.blogs.total },
      { module: "Events", total: effectiveAdminStats.events.total },
      { module: "Donations", total: effectiveAdminStats.donations.total },
    ],
    [effectiveAdminStats]
  );

  const orderStatusData = useMemo(
    () => [
      { label: "Pending", value: effectiveAdminStats.orders.pending },
      { label: "Processing", value: effectiveAdminStats.orders.processing },
      { label: "Completed", value: effectiveAdminStats.orders.completed },
      { label: "Cancelled", value: effectiveAdminStats.orders.cancelled },
    ],
    [effectiveAdminStats]
  );

  const commerceValueData = useMemo(
    () => [
      { channel: "Order Revenue", amount: effectiveAdminStats.orders.totalRevenue },
      { channel: "Total Donations", amount: effectiveAdminStats.donations.totalAmount },
      { channel: "Month Donations", amount: effectiveAdminStats.donations.thisMonthAmount },
    ],
    [effectiveAdminStats]
  );

  const operationalHealthData = useMemo(
    () => [
      {
        metric: "Users Active",
        score: getPercentage(effectiveAdminStats.users.active, effectiveAdminStats.users.total),
      },
      {
        metric: "Products Active",
        score: getPercentage(effectiveAdminStats.products.active, effectiveAdminStats.products.total),
      },
      {
        metric: "Upcoming Events",
        score: getPercentage(effectiveAdminStats.events.upcoming, effectiveAdminStats.events.total),
      },
      {
        metric: "Active Blogs",
        score: getPercentage(effectiveAdminStats.blogs.active, effectiveAdminStats.blogs.total),
      },
      {
        metric: "Order Completion",
        score: getPercentage(effectiveAdminStats.orders.completed, effectiveAdminStats.orders.total),
      },
    ],
    [effectiveAdminStats]
  );

  const userOrderStatusData = useMemo(() => {
    const other = Math.max(
      effectiveUserStats.orders.total -
        effectiveUserStats.orders.pending -
        effectiveUserStats.orders.completed,
      0
    );

    return [
      { label: "Pending", value: effectiveUserStats.orders.pending },
      { label: "Completed", value: effectiveUserStats.orders.completed },
      { label: "Other", value: other },
    ];
  }, [effectiveUserStats]);

  const userSpendingData = useMemo(
    () =>
      [...effectiveUserStats.recentOrders]
        .reverse()
        .map((order) => ({
          label: `#${order.id}`,
          amount: order.total,
        })),
    [effectiveUserStats.recentOrders]
  );

  const userEngagementData = useMemo(
    () => [
      { label: "Orders", value: effectiveUserStats.orders.total },
      { label: "Donations", value: effectiveUserStats.donations.total },
    ],
    [effectiveUserStats]
  );

  const adminSections = useMemo<ManagementSection[]>(() => {
    const sharedSections: ManagementSection[] = [
      {
        title: "Content Management",
        description: "Publish and maintain content across channels",
        icon: BookOpen,
        accent: "from-green-500 to-emerald-500",
        items: [
          { name: "Blog", href: "/dashboard/blog-management", description: "Manage blog posts" },
          { name: "Music", href: "/dashboard/music", description: "Update music catalog" },
          { name: "Events", href: "/dashboard/events-management", description: "Plan and edit events" },
          { name: "Contact", href: "/dashboard/contact-management", description: "Handle user messages" },
        ],
      },
      {
        title: "Commerce Operations",
        description: "Track products, orders, payments, and donations",
        icon: ShoppingCart,
        accent: "from-orange-500 to-red-500",
        items: [
          { name: "Shop", href: "/dashboard/shop", description: "Manage products" },
          { name: "Orders", href: "/dashboard/orders-management", description: "Monitor all orders" },
          { name: "Payments", href: "/dashboard/payments", description: "Review payment flow" },
          { name: "Donations", href: "/dashboard/donations", description: "Manage donation records" },
        ],
      },
      {
        title: "Platform Settings",
        description: "Control reports, settings, and partnerships",
        icon: Settings,
        accent: "from-slate-700 to-slate-500",
        items: [
          { name: "Reports", href: "/dashboard/reports", description: "Generate analytics reports" },
          { name: "Settings", href: "/dashboard/settings", description: "Configure system behavior" },
          { name: "Partnership", href: "/dashboard/partnership", description: "Manage partner programs" },
          { name: "Tickets", href: "/dashboard/tickets-management", description: "Manage event ticketing" },
        ],
      },
    ];

    if (!isSuperAdmin) {
      return sharedSections;
    }

    return [
      {
        title: "User & Access",
        description: "Manage users, roles, permissions, and departments",
        icon: Shield,
        accent: "from-sky-500 to-indigo-500",
        items: [
          { name: "Users", href: "/dashboard/users", description: "Manage accounts" },
          { name: "Roles", href: "/dashboard/roles", description: "Configure roles and permissions" },
          { name: "Departments", href: "/dashboard/departments", description: "Manage departments" },
          { name: "Profile", href: "/dashboard/profile", description: "Review your profile" },
        ],
      },
      ...sharedSections,
    ];
  }, [isSuperAdmin]);

  const userQuickActions = useMemo(
    () => [
      { name: "My Orders", href: "/dashboard/orders", icon: ShoppingCart },
      { name: "My Addresses", href: "/dashboard/addresses", icon: Users },
      { name: "Donations", href: "/dashboard/donations", icon: Heart },
      { name: "Tickets", href: "/dashboard/tickets-management", icon: Calendar },
      { name: "Profile", href: "/dashboard/profile", icon: Settings },
    ],
    []
  );

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Loading live dashboard metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-900 to-emerald-700 p-6 text-white shadow-xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.2),transparent_35%)]" />
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {hasAdminAccess ? "Operations Dashboard" : "My Dashboard"}
            </h1>
            <p className="max-w-2xl text-sm text-white/90 sm:text-base">
              Welcome back, {user?.first_name}. This board shows real-time metrics from orders,
              donations, products, events, and activity logs.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {isSuperAdmin && (
                <Badge className="bg-rose-500 text-white hover:bg-rose-500">Super Admin</Badge>
              )}
              {isAdmin && !isSuperAdmin && (
                <Badge className="bg-cyan-500 text-white hover:bg-cyan-500">Admin</Badge>
              )}
              {!hasAdminAccess && (
                <Badge className="bg-emerald-500 text-white hover:bg-emerald-500">User</Badge>
              )}
              <Badge className="bg-white/20 text-white hover:bg-white/20">Live Data</Badge>
            </div>
          </div>

          <Button
            onClick={() => void loadDashboard(false)}
            disabled={refreshing}
            variant="secondary"
            className="gap-2 bg-white/15 text-white hover:bg-white/25"
          >
            {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </section>

      {error && (
        <Card className="border-rose-200 bg-rose-50">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-rose-700">{error}</p>
            <Button variant="outline" onClick={() => void loadDashboard(true)}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {(hasAdminAccess ? adminTopCards : userTopCards).map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="overflow-hidden border-0 shadow-md">
              <CardContent className="relative p-0">
                <div className={`h-1.5 bg-gradient-to-r ${card.tone}`} />
                <div className="p-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                      <p className="mt-1 text-2xl font-bold text-foreground">{card.value}</p>
                    </div>
                    <div className="rounded-xl bg-muted p-2.5">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {hasAdminAccess ? (
        <>
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Module Volume</CardTitle>
                <CardDescription>Records per platform module</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={adminChartConfig} className="h-[300px] w-full aspect-auto">
                  <BarChart data={moduleVolumeData} margin={{ left: 8, right: 8, top: 10 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="module" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="total" radius={[8, 8, 2, 2]} fill="var(--color-total)" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
                <CardDescription>Current mix of order lifecycle states</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={userChartConfig} className="h-[300px] w-full aspect-auto">
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Pie data={orderStatusData} dataKey="value" nameKey="label" outerRadius={95} innerRadius={45}>
                      {orderStatusData.map((entry, index) => (
                        <Cell key={entry.label} fill={ORDER_STATUS_COLORS[index % ORDER_STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {orderStatusData.map((item, index) => (
                    <div key={item.label} className="flex items-center justify-between rounded-md border px-2 py-1 text-xs">
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: ORDER_STATUS_COLORS[index % ORDER_STATUS_COLORS.length] }}
                        />
                        {item.label}
                      </span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Commerce Value Comparison</CardTitle>
                <CardDescription>Orders and donations value overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={adminChartConfig} className="h-[300px] w-full aspect-auto">
                  <AreaChart data={commerceValueData} margin={{ left: 8, right: 8, top: 10 }}>
                    <defs>
                      <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-amount)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-amount)" stopOpacity={0.08} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="channel" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          formatter={(value) => (
                            <div className="flex w-full items-center justify-between gap-3">
                              <span className="text-muted-foreground">Amount</span>
                              <span className="font-medium">{formatTZS(Number(value) || 0)}</span>
                            </div>
                          )}
                        />
                      }
                    />
                    <Area type="monotone" dataKey="amount" stroke="var(--color-amount)" fill="url(#valueGradient)" strokeWidth={2.5} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Operational Health Radar</CardTitle>
                <CardDescription>Percentage-based health indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={adminChartConfig} className="h-[300px] w-full aspect-auto">
                  <RadarChart data={operationalHealthData} outerRadius={105}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Radar
                      dataKey="score"
                      stroke="var(--color-score)"
                      fill="var(--color-score)"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Recent Platform Activity
                </CardTitle>
                <CardDescription>Latest events across core modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities.length === 0 && (
                    <p className="text-sm text-muted-foreground">No recent activities available.</p>
                  )}

                  {activities.map((activity, index) => {
                    const Icon = getActivityIcon(activity.icon);
                    return (
                      <div key={`${activity.type}-${activity.id}-${index}`} className="flex items-start gap-3 rounded-xl border p-3">
                        <div className="rounded-lg bg-muted p-2">
                          <Icon className="h-4 w-4 text-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                        </div>
                        <span className="whitespace-nowrap text-xs text-muted-foreground">{activity.timestamp}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Quick System Snapshot</CardTitle>
                <CardDescription>Immediate operational indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm text-muted-foreground">Pending Orders</span>
                  <Badge variant="secondary">{effectiveAdminStats.orders.pending}</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm text-muted-foreground">Low/Out Stock Products</span>
                  <Badge variant="secondary">
                    {effectiveAdminStats.products.lowStock + effectiveAdminStats.products.outOfStock}
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm text-muted-foreground">Upcoming Events</span>
                  <Badge variant="secondary">{effectiveAdminStats.events.upcoming}</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm text-muted-foreground">This Month Donations</span>
                  <Badge variant="secondary">{formatTZShort(effectiveAdminStats.donations.thisMonthAmount)}</Badge>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {adminSections.map((section) => {
              const Icon = section.icon;
              return (
                <Card key={section.title} className="overflow-hidden shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <span className={`h-8 w-1 rounded-full bg-gradient-to-b ${section.accent}`} />
                          {section.title}
                        </CardTitle>
                        <CardDescription className="mt-1">{section.description}</CardDescription>
                      </div>
                      <div className={`rounded-xl bg-gradient-to-br p-2 ${section.accent}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {section.items.map((item) => (
                      <Button key={item.href} asChild variant="ghost" className="h-auto w-full justify-start border px-3 py-3">
                        <Link to={item.href} className="flex w-full items-center justify-between gap-3">
                          <div className="text-left">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </section>
        </>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Recent Order Spending</CardTitle>
                <CardDescription>Spending trend from your latest orders</CardDescription>
              </CardHeader>
              <CardContent>
                {userSpendingData.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No order history available yet.</p>
                ) : (
                  <ChartContainer config={userChartConfig} className="h-[300px] w-full aspect-auto">
                    <AreaChart data={userSpendingData} margin={{ left: 8, right: 8, top: 10 }}>
                      <defs>
                        <linearGradient id="userSpendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-amount)" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="var(--color-amount)" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} />
                      <YAxis allowDecimals={false} />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            formatter={(value) => (
                              <div className="flex w-full items-center justify-between gap-3">
                                <span className="text-muted-foreground">Order Amount</span>
                                <span className="font-medium">{formatTZS(Number(value) || 0)}</span>
                              </div>
                            )}
                          />
                        }
                      />
                      <Area type="monotone" dataKey="amount" stroke="var(--color-amount)" fill="url(#userSpendGradient)" strokeWidth={2.5} />
                    </AreaChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>My Order Status Mix</CardTitle>
                <CardDescription>Distribution of your order statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={userChartConfig} className="h-[300px] w-full aspect-auto">
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Pie data={userOrderStatusData} dataKey="value" nameKey="label" outerRadius={95} innerRadius={45}>
                      {userOrderStatusData.map((item, index) => (
                        <Cell key={item.label} fill={ORDER_STATUS_COLORS[index % ORDER_STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {userOrderStatusData.map((item, index) => (
                    <div key={item.label} className="flex items-center justify-between rounded-md border px-2 py-1 text-xs">
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: ORDER_STATUS_COLORS[index % ORDER_STATUS_COLORS.length] }}
                        />
                        {item.label}
                      </span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Orders vs Donations</CardTitle>
                <CardDescription>Your overall platform engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={userChartConfig} className="h-[300px] w-full aspect-auto">
                  <BarChart data={userEngagementData} margin={{ left: 8, right: 8, top: 10 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="var(--color-value)" radius={[8, 8, 2, 2]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest order updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {effectiveUserStats.recentOrders.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No recent orders found.</p>
                  ) : (
                    effectiveUserStats.recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between rounded-xl border p-3">
                        <div>
                          <p className="text-sm font-medium">Order #{order.id}</p>
                          <p className="text-xs text-muted-foreground">{formatTZS(order.total)}</p>
                        </div>
                        <Badge variant="outline" className={getStatusPill(order.status)}>
                          {formatStatusLabel(order.status)}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Jump to common account tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {userQuickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Button key={action.href} asChild variant="outline" className="justify-start gap-2">
                        <Link to={action.href}>
                          <Icon className="h-4 w-4" />
                          {action.name}
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>
        </>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">API & System</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm">Status</span>
            <Badge className="bg-emerald-500 text-white hover:bg-emerald-500">Online</Badge>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Orders</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm">Open</span>
            <Badge variant="secondary">{hasAdminAccess ? effectiveAdminStats.orders.pending : effectiveUserStats.orders.pending}</Badge>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Donations</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm">Total</span>
            <Badge variant="secondary">
              {hasAdminAccess ? formatTZShort(effectiveAdminStats.donations.totalAmount) : formatTZShort(effectiveUserStats.donations.totalAmount)}
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Payments</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm">Access</span>
            <Button asChild variant="ghost" size="sm" className="h-7 px-2">
              <Link to="/dashboard/payments" className="gap-1">
                Open
                <CreditCard className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5">
          <BarChart3 className="h-3.5 w-3.5" />
          Live analytics enabled
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5">
          <Music className="h-3.5 w-3.5" />
          Media modules connected
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5">
          <Package className="h-3.5 w-3.5" />
          Commerce modules connected
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;
