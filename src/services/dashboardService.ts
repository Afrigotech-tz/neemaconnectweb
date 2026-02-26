import { userService } from './userService';
import { orderService } from './orderService';
import { productService } from './productService';
import { blogService } from './blogService';
import { eventService } from './eventService';
import api from './api';

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

// Helper to safely extract count from paginated response
const getCount = (response: ApiResponse<any>): number => {
  if (!response.success || !response.data) return 0;
  // Handle paginated response
  if (response.data.data && Array.isArray(response.data.data)) {
    return response.data.total || response.data.data.length;
  }
  // Handle array response
  if (Array.isArray(response.data)) {
    return response.data.length;
  }
  // Handle count in data
  if (typeof response.data === 'object' && 'total' in response.data) {
    return response.data.total as number;
  }
  return 0;
};

// Helper to extract data from response
const getData = <T>(response: ApiResponse<T>): T | null => {
  return response.success && response.data ? response.data : null;
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
        api.get('/donations').catch(() => ({ data: { success: false } })),
      ]);

      // Process users
      if (usersResponse.status === 'fulfilled' && usersResponse.value.success) {
        const data = usersResponse.value.data;
        defaultStats.users.total = data?.total || 0;
        defaultStats.users.active = data?.total || 0; // Assuming most are active
      }

      // Process orders
      if (ordersResponse.status === 'fulfilled' && ordersResponse.value.success) {
        const data = ordersResponse.value.data;
        defaultStats.orders.total = data?.total || 0;
        // Try to get order status summary if available
        try {
          const statusSummary = await api.get('/reports/orders/status-summary');
          if (statusSummary.data?.success) {
            const summary = statusSummary.data.data || {};
            defaultStats.orders.pending = summary.pending || 0;
            defaultStats.orders.processing = summary.processing || 0;
            defaultStats.orders.completed = summary.completed || 0;
            defaultStats.orders.cancelled = summary.cancelled || 0;
          }
        } catch {
          // Status summary not available
        }
      }

      // Process products
      if (productsResponse.status === 'fulfilled' && productsResponse.value.success) {
        const data = productsResponse.value.data;
        defaultStats.products.total = data?.total || 0;
        defaultStats.products.active = data?.total || 0;
      }

      // Process blogs
      if (blogsResponse.status === 'fulfilled' && blogsResponse.value.success) {
        const data = blogsResponse.value.data;
        // Handle both paginated and non-paginated responses
        if (data?.data && Array.isArray(data.data)) {
          defaultStats.blogs.total = data.total || data.data.length;
          defaultStats.blogs.active = data.data.filter((b: any) => b.is_active).length;
        } else if (Array.isArray(data)) {
          defaultStats.blogs.total = data.length;
          defaultStats.blogs.active = data.filter((b: any) => b.is_active).length;
        }
      }

      // Process events
      if (eventsResponse.status === 'fulfilled' && eventsResponse.value.success) {
        const data = eventsResponse.value.data;
        // Handle both paginated and non-paginated responses
        if (data?.data && Array.isArray(data.data)) {
          defaultStats.events.total = data.total || data.data.length;
          defaultStats.events.upcoming = data.data.filter((e: any) => new Date(e.date) >= new Date()).length;
        } else if (Array.isArray(data)) {
          defaultStats.events.total = data.length;
          defaultStats.events.upcoming = data.filter((e: any) => new Date(e.date) >= new Date()).length;
        }
      }

      // Process donations
      if (donationsResponse.status === 'fulfilled' && donationsResponse.value.data?.success) {
        const data = donationsResponse.value.data.data;
        if (data) {
          defaultStats.donations.total = data.total || data.count || 0;
          defaultStats.donations.totalAmount = data.totalAmount || data.amount || 0;
          defaultStats.donations.thisMonth = data.thisMonth || 0;
          defaultStats.donations.thisMonthAmount = data.thisMonthAmount || 0;
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
          const donationsResponse = await api.get(`/donations/user/${userId}`);
          if (donationsResponse.data?.success) {
            const data = donationsResponse.data.data;
            defaultStats.donations.total = data?.total || 0;
            defaultStats.donations.totalAmount = data?.totalAmount || 0;
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

