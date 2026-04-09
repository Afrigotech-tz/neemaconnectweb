import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { navigationItems } from '@/config/navigationConfig';
import { LucideIcon } from 'lucide-react';

export interface Breadcrumb {
  label: string;
  path: string;
  isCurrentPage: boolean;
  icon?: LucideIcon;
}

// Route name mappings for better breadcrumb labels
const routeNameMap: Record<string, string> = {
  dashboard: 'Dashboard',
  users: 'User Management',
  roles: 'Roles & Permissions',
  departments: 'Departments',
  blog: 'Blog',
  'blog-management': 'Blog Management',
  music: 'Music',
  news: 'News',
  gallery: 'Gallery',
  events: 'Events',
  'events-management': 'Events Management',
  'tickets-management': 'Tickets Management',
  shop: 'Shop',
  products: 'Products',
  categories: 'Categories',
  donations: 'Donations',
  payments: 'Payments',
  reports: 'Reports',
  partnership: 'Partnership',
  'slider-management': 'Sliders Management',
  settings: 'Settings',
  profile: 'Profile',
};

export const useBreadcrumbs = () => {
  const location = useLocation();

  const breadcrumbs = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const crumbs: Breadcrumb[] = [];

    // Always start with Home/Dashboard
    const dashboardNavItem = navigationItems.find((item) => item.path === '/dashboard');
    crumbs.push({
      label: 'Dashboard',
      path: '/dashboard',
      isCurrentPage: location.pathname === '/dashboard',
      icon: dashboardNavItem?.icon,
    });

    // If we're on the dashboard home, return empty array to hide breadcrumbs
    if (location.pathname === '/dashboard') {
      return [];
    }

    // Build breadcrumbs from path segments
    let currentPath = '/dashboard';
    pathSegments.forEach((segment, index) => {
      // Skip 'dashboard' as we already added it
      if (segment === 'dashboard') return;

      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Try to find a better label and icon from navigation items
      const navItem = navigationItems.find((item) => item.path === currentPath);
      const label = navItem?.name || routeNameMap[segment] || segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      crumbs.push({
        label,
        path: currentPath,
        isCurrentPage: isLast,
        icon: navItem?.icon,
      });
    });

    return crumbs;
  }, [location.pathname]);

  return breadcrumbs;
};
