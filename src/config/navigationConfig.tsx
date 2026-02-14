import {
  Home,
  Settings,
  BookOpen,
  Music,
  Newspaper,
  Image,
  Users,
  User,
  Package,
  ShoppingCart,
  Handshake,
  CreditCard,
  BarChart3,
  Calendar,
  Heart,
  Shield,
  Box,
  Mail,
  ImageIcon,
  Info,
  ClipboardList,
  MapPin
} from 'lucide-react';
import { RouteConfig } from './routePermissions';

// Unified Dashboard Navigation - Access controlled by RBAC permissions
export const navigationItems: RouteConfig[] = [
  // Dashboard Home
  {
    name: 'Home',
    path: '/dashboard',
    icon: Home,
    section: 'Dashboard'
  },

  // User Management
  {
    name: 'User Management',
    path: '/dashboard/users',
    icon: Users,
    section: 'User Management',
    requiredPermissions: ['view_users']
  },
  {
    name: 'Roles & Permissions',
    path: '/dashboard/roles',
    icon: Shield,
    section: 'User Management',
    requiredPermissions: ['view_roles']
  },

  // Content Management
  {
    name: 'Blog Management',
    path: '/dashboard/blog-management',
    icon: BookOpen,
    section: 'Content',
    requiredPermissions: ['view_news']
  },
  {
    name: 'Music',
    path: '/dashboard/music',
    icon: Music,
    section: 'Content',
    requiredPermissions: ['view_music']
  },
  {
    name: 'News',
    path: '/dashboard/news',
    icon: Newspaper,
    section: 'Content',
    requiredPermissions: ['view_news']
  },
  {
    name: 'Gallery',
    path: '/dashboard/gallery',
    icon: Image,
    section: 'Content'
  },
  {
    name: 'Events',
    path: '/dashboard/events',
    icon: Calendar,
    section: 'Content',
    requiredPermissions: ['view_events']
  },
  {
    name: 'Events Management',
    path: '/dashboard/events-management',
    icon: Calendar,
    section: 'Content',
    requiredPermissions: ['view_events', 'edit_events']
  },
  {
    name: 'Contact Management',
    path: '/dashboard/contact-management',
    icon: Mail,
    section: 'Content',
    requiredPermissions: ['view_news']
  },
  {
    name: 'Slider Management',
    path: '/dashboard/slider-management',
    icon: ImageIcon,
    section: 'Content',
    requiredPermissions: ['view_news']
  },
  {
    name: 'About Us',
    path: '/dashboard/about-management',
    icon: Info,
    section: 'Content',
    requiredPermissions: ['view_news']
  },

  // Commerce
  {
    name: 'Shop',
    path: '/dashboard/shop',
    icon: ShoppingCart,
    section: 'Commerce',
    requiredPermissions: ['view_products']
  },
  {
    name: 'Product Categories',
    path: '/dashboard/products/categories',
    icon: Package,
    section: 'Commerce',
    requiredPermissions: ['view_products']
  },
  {
    name: 'Donations',
    path: '/dashboard/donations',
    icon: Heart,
    section: 'Commerce',
    requiredPermissions: ['view_donations']
  },
  {
    name: 'Orders Management',
    path: '/dashboard/orders-management',
    icon: ClipboardList,
    section: 'Commerce',
    requiredPermissions: ['view_products']
  },
  {
    name: 'Payments',
    path: '/dashboard/payments',
    icon: CreditCard,
    section: 'Commerce'
  },

  // System & Settings
  {
    name: 'Reports',
    path: '/dashboard/reports',
    icon: BarChart3,
    section: 'System',
    requiredPermissions: ['view_donations', 'view_products', 'view_events']
  },
  {
    name: 'Partnership',
    path: '/dashboard/partnership',
    icon: Handshake,
    section: 'System'
  },
  {
    name: 'My Orders',
    path: '/dashboard/orders',
    icon: ClipboardList,
    section: 'Settings'
  },
  {
    name: 'My Addresses',
    path: '/dashboard/addresses',
    icon: MapPin,
    section: 'Settings'
  },
  {
    name: 'Settings',
    path: '/dashboard/settings',
    icon: Settings,
    section: 'Settings'
  },
  {
    name: 'Profile',
    path: '/dashboard/profile',
    icon: User,
    section: 'Settings',
    hideFromNav: true // Hidden from nav, accessible directly
  },
];

// Deprecated - kept for backwards compatibility, use navigationItems instead
export const userNavigationItems: RouteConfig[] = navigationItems;
export const adminNavigationItems: RouteConfig[] = navigationItems;

// Function to filter navigation items based on user permissions
export const filterNavigationByPermissions = (
  navigationItems: RouteConfig[],
  userPermissions: string[]
): RouteConfig[] => {
  return navigationItems.filter(item => {
    // Hide items marked as hideFromNav
    if (item.hideFromNav) {
      return false;
    }

    // If no permissions are required, show the item
    if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
      return true;
    }

    // Check if user has ALL of the required permissions
    return item.requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );
  });
};

// Function to group admin navigation items by section
export const groupNavigationBySection = (
  navigationItems: RouteConfig[],
  userPermissions: string[]
): Record<string, RouteConfig[]> => {
  const filteredItems = filterNavigationByPermissions(navigationItems, userPermissions);
  
  return filteredItems.reduce((acc, item) => {
    const section = item.section || 'Other';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {} as Record<string, RouteConfig[]>);
};