import { userService } from './userService';
import { orderService } from './orderService';
import { productService } from './productService';
import { blogService } from './blogService';
import { eventService } from './eventService';
import api from './api';
import { donationService } from './donationService';

// Types for dashboard stats
export interface DashboardStats {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
  };
  products: {
    total: number;
    active: number;
    outOfStock: number;
    lowStock: number;
  };
  blogs: {
    total: number;
    active: number;
  };
  events: {
    total: number;
    upcoming: number;
    past: number;
  };
  donations: {
    total: number;
    totalAmount: number;
    thisMonth: number;
    thisMonthAmount: number;
  };
}

export interface UserDashboardStats {
  orders: {
    total: number;
    pending: number;
    completed: number;
    totalSpent: number;
  };
  donations: {
    total: number;
    totalAmount: number;
  };
  recentOrders: Array<{
    id: number;
    status: string;
    total: number;
    created_at: string;
  }>;
}

export interface RecentActivity {
  id: number;
  type: 'order' | 'donation' | 'user' | 'blog' | 'event' | 'product';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

// API Response type
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const toNumber = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const safeDate = (value: unknown): Date | null => {
  if (typeof value !== 'string' || value.length === 0) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const extractList = (payload: unknown): any[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    const data = payload as Record<string, unknown>;
    if (Array.isArray(data.data)) {
      return data.data;
    }
  }

  return [];
};

// Format date for activity
const formatActivityDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-TZ');
};

export const dashboardService = {
  /**
   * Get comprehensive admin dashboard stats
   */
  async getAdminStats(): Promise<DashboardStats> {
    // Default stats in case API fails
    const defaultStats: DashboardStats = {
      users: { total: 0, active: 0, newThisMonth: 0 },
      orders: { total: 0, pending: 0, processing: 0, completed: 0, cancelled: 0, totalRevenue: 0 },
      products: { total: 0, active: 0, outOfStock: 0, lowStock: 0 },
      blogs: { total: 0, active: 0 },
      events: { total: 0, upcoming: 0, past: 0 },
      donations: { total: 0, totalAmount: 0, thisMonth: 0, thisMonthAmount: 0 },
    };

    try {
      // Fetch data in parallel
      const [
        usersResponse,
        ordersResponse,
        productsResponse,
        blogsResponse,
        eventsResponse,
        donationsResponse,
      ] = await Promise.allSettled([
        userService.getAllUsers({ page: 1 }),
        orderService.getOrders({}),
        productService.getProducts(),
        blogService.getBlogs(),
        eventService.getEvents(),
        donationService.getStatistics(),
      ]);

      // Process users
      if (usersResponse.status === 'fulfilled' && usersResponse.value.success) {
        const data = usersResponse.value.data;
        const users = extractList(data);
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        defaultStats.users.total = toNumber((data as any)?.total) || users.length;
        defaultStats.users.active = users.filter((user: any) => user?.status === 'active').length;
        defaultStats.users.newThisMonth = users.filter((user: any) => {
          const createdAt = safeDate(user?.created_at);
          return createdAt ? createdAt >= monthStart : false;
        }).length;

        if (defaultStats.users.active === 0 && defaultStats.users.total > 0) {
          defaultStats.users.active = defaultStats.users.total;
        }
      }

      // Process orders
      if (ordersResponse.status === 'fulfilled' && ordersResponse.value.success) {
        const data = ordersResponse.value.data;
        const orders = extractList(data);
        defaultStats.orders.total = toNumber((data as any)?.total) || orders.length;

        orders.forEach((order: any) => {
          const status = String(order?.status || '').toLowerCase();
          const total = toNumber(order?.total_amount ?? order?.total);

          if (status === 'pending') {
            defaultStats.orders.pending += 1;
          } else if (status === 'processing' || status === 'shipped') {
            defaultStats.orders.processing += 1;
          } else if (status === 'completed' || status === 'delivered' || status === 'paid') {
            defaultStats.orders.completed += 1;
          } else if (status === 'cancelled' || status === 'refunded' || status === 'failed') {
            defaultStats.orders.cancelled += 1;
          }

          if (status === 'completed' || status === 'delivered' || status === 'paid') {
            defaultStats.orders.totalRevenue += total;
          }
        });

        // Try to get order status summary if available
        try {
          const statusSummary = await api.get('/reports/orders/status-summary');
          if (statusSummary.data?.success) {
            const summary = statusSummary.data.data || {};
            defaultStats.orders.pending = toNumber(summary.pending);
            defaultStats.orders.processing = toNumber(summary.processing);
            defaultStats.orders.completed = toNumber(summary.completed);
            defaultStats.orders.cancelled = toNumber(summary.cancelled) + toNumber(summary.refunded);
          }
        } catch {
          // Status summary not available
        }
      }

      // Process products
      if (productsResponse.status === 'fulfilled' && productsResponse.value.success) {
        const data = productsResponse.value.data;
        const products = extractList(data);
        defaultStats.products.total = toNumber((data as any)?.total) || products.length;
        defaultStats.products.active = products.filter((product: any) => Boolean(product?.is_active)).length;
        defaultStats.products.outOfStock = products.filter((product: any) => toNumber(product?.stock_quantity) <= 0).length;
        defaultStats.products.lowStock = products.filter((product: any) => {
          const stock = toNumber(product?.stock_quantity);
          return stock > 0 && stock <= 5;
        }).length;

        if (defaultStats.products.active === 0 && defaultStats.products.total > 0) {
          defaultStats.products.active = defaultStats.products.total;
        }
      }

      // Process blogs
      if (blogsResponse.status === 'fulfilled' && blogsResponse.value.success) {
        const data = blogsResponse.value.data;
        const blogs = extractList(data);
        defaultStats.blogs.total = toNumber((data as any)?.total) || blogs.length;
        defaultStats.blogs.active = blogs.filter((blog: any) => Boolean(blog?.is_active)).length;
      }

      // Process events
      if (eventsResponse.status === 'fulfilled' && eventsResponse.value.success) {
        const data = eventsResponse.value.data;
        const events = extractList(data);
        const now = new Date();
        defaultStats.events.total = toNumber((data as any)?.total) || events.length;
        defaultStats.events.upcoming = events.filter((event: any) => {
          const eventDate = safeDate(event?.date);
          return eventDate ? eventDate >= now : event?.status === 'upcoming';
        }).length;
        defaultStats.events.past = Math.max(defaultStats.events.total - defaultStats.events.upcoming, 0);
      }

      // Process donations
      if (donationsResponse.status === 'fulfilled' && donationsResponse.value.success && donationsResponse.value.data) {
        const data = donationsResponse.value.data as Record<string, number>;
        if (data) {
          defaultStats.donations.total =
            data.total_donations || data.total || data.count || 0;
          defaultStats.donations.totalAmount =
            data.total_amount || data.totalAmount || data.amount || 0;
          defaultStats.donations.thisMonth =
            data.this_month_donations || data.thisMonth || 0;
          defaultStats.donations.thisMonthAmount =
            data.this_month_amount || data.thisMonthAmount || 0;
        }
      }

      return defaultStats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return defaultStats;
    }
  },

  /**
   * Get user-specific dashboard stats
   */
  async getUserStats(userId?: number): Promise<UserDashboardStats> {
    const defaultStats: UserDashboardStats = {
      orders: { total: 0, pending: 0, completed: 0, totalSpent: 0 },
      donations: { total: 0, totalAmount: 0 },
      recentOrders: [],
    };

    try {
      // Fetch user's orders
      const ordersResponse = await orderService.getUserOrders(1);
      if (ordersResponse.success && ordersResponse.data) {
        const orders = ordersResponse.data.data || [];
        defaultStats.orders.total = ordersResponse.data.total || orders.length;
        defaultStats.orders.pending = orders.filter((o: any) => o.status === 'pending').length;
        defaultStats.orders.completed = orders.filter((o: any) => o.status === 'completed').length;
        defaultStats.orders.totalSpent = orders.reduce((sum: number, order: any) => 
          sum + (parseFloat(order.total_amount || order.total) || 0), 0);
        defaultStats.recentOrders = orders.slice(0, 5).map((order: any) => ({
          id: order.id,
          status: order.status,
          total: parseFloat(order.total_amount || order.total) || 0,
          created_at: order.created_at,
        }));
      }

      // Fetch user's donations if userId provided
      if (userId) {
        try {
          const donationsResponse = await donationService.getDonationsByUser(userId, 1);
          if (donationsResponse.success && donationsResponse.data) {
            const data = donationsResponse.data as any;
            const donationList = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
            defaultStats.donations.total = data?.total || donationList.length || 0;
            defaultStats.donations.totalAmount = donationList.reduce(
              (sum: number, donation: any) => sum + (Number(donation.amount) || 0),
              0
            );
          }
        } catch {
          // Donations not available
        }
      }

      return defaultStats;
    } catch (error) {
      console.error('Error fetching user dashboard stats:', error);
      return defaultStats;
    }
  },

  /**
   * Get recent activities for admin dashboard
   */
  async getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
    const activities: RecentActivity[] = [];

    try {
      // Fetch recent orders
      const ordersResponse = await orderService.getOrders({});
      if (ordersResponse.success && ordersResponse.data) {
        const orders = ordersResponse.data.data || [];
        orders.slice(0, 5).forEach((order: any) => {
          activities.push({
            id: order.id,
            type: 'order',
            title: 'New Order',
            description: `Order #${order.id} - ${order.status}`,
            timestamp: order.created_at,
            icon: 'shopping-cart',
            color: 'purple',
          });
        });
      }

      // Fetch recent users
      const usersResponse = await userService.getAllUsers({ page: 1 });
      if (usersResponse.success && usersResponse.data) {
        const users = usersResponse.data.data || [];
        users.slice(0, 5).forEach((user: any) => {
          activities.push({
            id: user.id,
            type: 'user',
            title: 'New User',
            description: `${user.first_name} ${user.surname} registered`,
            timestamp: user.created_at,
            icon: 'user',
            color: 'blue',
          });
        });
      }

      // Fetch recent events
      const eventsResponse = await eventService.getEvents();
      if (eventsResponse.success && eventsResponse.data) {
        const events = eventsResponse.data.data || [];
        events.slice(0, 5).forEach((event: any) => {
          activities.push({
            id: event.id,
            type: 'event',
            title: 'Event Update',
            description: event.title || 'Event details updated',
            timestamp: event.updated_at || event.created_at,
            icon: 'calendar',
            color: 'green',
          });
        });
      }

      // Sort by timestamp (newest first)
      activities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return activities.slice(0, limit).map(activity => ({
        ...activity,
        timestamp: formatActivityDate(activity.timestamp),
      }));
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return activities;
    }
  },
};

export default dashboardService;
