import { ReactElement } from 'react';

export interface RouteConfig {
  name: string;
  path: string;
  icon?: any;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  module?: string;
  section?: string;
  children?: RouteConfig[];
  hideFromNav?: boolean;
}

export interface DashboardRouteConfig extends RouteConfig {
  component?: () => ReactElement;
}

// Define route permissions mapping based on API permission structure
export const ROUTE_PERMISSIONS = {
  // User Management Routes
  '/dashboard/users': {
    view: 'view_users',
    create: 'create_users',
    edit: 'edit_users',
    delete: 'delete_users'
  },
  '/dashboard/roles': {
    view: 'view_roles',
    create: 'create_roles',
    edit: 'edit_roles',
    delete: 'delete_roles'
  },

  // Content Management Routes
  '/dashboard/blog': {
    view: 'view_news'
  },
  '/dashboard/blog-management': {
    view: 'view_news',
    create: 'create_news',
    edit: 'edit_news',
    delete: 'delete_news'
  },
  '/dashboard/news': {
    view: 'view_news'
  },
  '/dashboard/music': {
    view: 'view_music'
  },
  '/dashboard/events': {
    view: 'view_events'
  },
  '/dashboard/events-management': {
    view: 'view_events',
    create: 'create_events',
    edit: 'edit_events',
    delete: 'delete_events'
  },

  // Commerce Routes
  '/dashboard/products': {
    view: 'view_products'
  },
  '/dashboard/shop': {
    view: 'view_products',
    create: 'create_products',
    edit: 'edit_products',
    delete: 'delete_products'
  },
  '/dashboard/products/categories': {
    view: 'view_products',
    create: 'create_products',
    edit: 'edit_products',
    delete: 'delete_products'
  },
  '/dashboard/donations': {
    view: 'view_donations',
    create: 'create_donations',
    edit: 'edit_donations',
    delete: 'delete_donations'
  },

  // System Routes
  '/dashboard/reports': {
    view: 'view_donations' // Reports typically require viewing donations, products, or events
  },
  '/dashboard/permissions': {
    view: 'view_permissions',
    create: 'create_permissions',
    edit: 'edit_permissions',
    delete: 'delete_permissions'
  }
} as const;

// Helper function to get permission requirements for a route
export const getRoutePermissions = (route: string): string[] => {
  const routePerms = ROUTE_PERMISSIONS[route as keyof typeof ROUTE_PERMISSIONS];
  if (!routePerms) return [];
  
  // Return all permissions for the route (typically we check for 'view' permission for access)
  return [routePerms.view].filter(Boolean);
};

// Helper function to check if user has access to a route
export const hasRouteAccess = (userPermissions: string[], route: string): boolean => {
  const requiredPermissions = getRoutePermissions(route);
  if (requiredPermissions.length === 0) return true; // No permissions required
  
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

// Module-based permission groups for easier management
export const MODULE_PERMISSIONS = {
  users: ['view_users', 'create_users', 'edit_users', 'delete_users'],
  products: ['view_products', 'create_products', 'edit_products', 'delete_products'],
  events: ['view_events', 'create_events', 'edit_events', 'delete_events'],
  news: ['view_news', 'create_news', 'edit_news', 'delete_news'],
  donations: ['view_donations', 'create_donations', 'edit_donations', 'delete_donations'],
  music: ['view_music', 'create_music', 'edit_music', 'delete_music'],
  roles: ['view_roles', 'create_roles', 'edit_roles', 'delete_roles'],
  permissions: ['view_permissions', 'create_permissions', 'edit_permissions', 'delete_permissions']
} as const;

// Function to check if user has any permission in a module
export const hasModuleAccess = (userPermissions: string[], module: keyof typeof MODULE_PERMISSIONS): boolean => {
  const modulePerms = MODULE_PERMISSIONS[module];
  return modulePerms.some(permission => userPermissions.includes(permission));
};