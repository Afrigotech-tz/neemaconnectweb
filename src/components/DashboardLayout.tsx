import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import {
  navigationItems,
  filterNavigationByPermissions,
  groupNavigationBySection
} from '@/config/navigationConfig';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { userPermissions } = usePermissions();
  const breadcrumbs = useBreadcrumbs();

  // Filter navigation items based on user permissions
  const filteredNav = filterNavigationByPermissions(navigationItems, userPermissions);

  // Group navigation by sections for organized display
  const groupedNav = groupNavigationBySection(filteredNav, userPermissions);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out of your account.',
    });
  };

  const getInitials = (firstName: string, surname: string) => {
    return `${firstName?.[0] || ''}${surname?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out h-screen
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/NGC-Logo-2.png" 
                alt="NGC Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-lg">Dashboard</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {/* Grouped Navigation Items by Section */}
            {Object.entries(groupedNav).map(([sectionName, sectionItems], index) => (
              <div key={sectionName} className={`space-y-1 ${index > 0 ? 'mt-6' : ''}`}>
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {sectionName}
                </h3>
                {sectionItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`
                        flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                        ${isActive(item.path)
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={user?.profile?.profile_picture || undefined} 
                  alt={`${user?.first_name} ${user?.surname}`}
                />
                <AvatarFallback className="text-sm">
                  {getInitials(user?.first_name || '', user?.surname || '')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.first_name} {user?.surname}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex-1 lg:flex-none"></div>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={user?.profile?.profile_picture || undefined} 
                      alt={`${user?.first_name} ${user?.surname}`}
                    />
                    <AvatarFallback className="text-sm">
                      {getInitials(user?.first_name || '', user?.surname || '')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.first_name} {user?.surname}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings" className="cursor-pointer flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Breadcrumbs - Hidden on dashboard home */}
          {breadcrumbs.length > 0 && (
            <div className="px-6 py-4 bg-white border-b">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => {
                    const Icon = crumb.icon;
                    return (
                      <div key={crumb.path} className="contents">
                        <BreadcrumbItem>
                          {crumb.isCurrentPage ? (
                            <BreadcrumbPage className="flex items-center gap-2">
                              {Icon && <Icon className="h-4 w-4" />}
                              {crumb.label}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link to={crumb.path} className="flex items-center gap-2">
                                {Icon && <Icon className="h-4 w-4" />}
                                {crumb.label}
                              </Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                      </div>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          )}

          {/* Content Area */}
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
