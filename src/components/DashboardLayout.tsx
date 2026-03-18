import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Maximize2,
  CalendarDays,
  Timer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('dashboard_sidebar_collapsed') === '1';
  });
  const [sidebarHidden, setSidebarHidden] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('dashboard_sidebar_hidden') === '1';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [liveClock, setLiveClock] = useState(() => new Date());
  const location = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { userPermissions } = usePermissions();
  const breadcrumbs = useBreadcrumbs();

  // Filter navigation items based on user permissions
  const filteredNav = filterNavigationByPermissions(navigationItems, userPermissions);

  // Group navigation by sections for organized display
  const groupedNav = groupNavigationBySection(filteredNav, userPermissions);
  const flatNavItems = useMemo(
    () => Object.values(groupedNav).flat(),
    [groupedNav]
  );

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return flatNavItems
      .filter((item) => {
        const section = item.section || 'Other';
        return (
          item.name.toLowerCase().includes(query) ||
          item.path.toLowerCase().includes(query) ||
          section.toLowerCase().includes(query)
        );
      })
      .slice(0, 8);
  }, [flatNavItems, searchQuery]);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    localStorage.setItem('dashboard_sidebar_collapsed', sidebarCollapsed ? '1' : '0');
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('dashboard_sidebar_hidden', sidebarHidden ? '1' : '0');
  }, [sidebarHidden]);

  useEffect(() => {
    setSearchQuery('');
    setSearchFocused(false);
  }, [location.pathname]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setLiveClock(new Date());
    }, 1000);
    return () => window.clearInterval(timerId);
  }, []);

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

  const currentDateLabel = liveClock.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const currentTimeLabel = liveClock.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const roleLabel = user?.roles?.[0]?.display_name || user?.role || 'Super Admin';

  const mainContentOffsetClass = sidebarHidden
    ? 'lg:ml-0'
    : sidebarCollapsed
      ? 'lg:ml-20'
      : 'lg:ml-64';

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 h-screen border-r border-sidebar-border bg-sidebar shadow-sm transform transition-all duration-200 ease-in-out
        ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
        ${sidebarHidden ? 'lg:-translate-x-full' : 'lg:translate-x-0'}
        w-64
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center border-b border-sidebar-border ${sidebarCollapsed ? 'justify-center p-4' : 'justify-between p-4'}`}>
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/NGC-Logo-2.png" 
                alt="NGC Logo" 
                className="w-8 h-8 object-contain"
              />
              {!sidebarCollapsed && <span className="font-bold text-lg text-sidebar-foreground">Dashboard</span>}
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
                {!sidebarCollapsed && (
                  <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                    {sectionName}
                  </h3>
                )}
                {sectionItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      title={sidebarCollapsed ? item.name : undefined}
                      className={`
                        flex items-center py-3 text-sm font-medium rounded-lg transition-colors duration-200
                        ${sidebarCollapsed ? 'justify-center px-2' : 'px-4'}
                        ${isActive(item.path)
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                      {!sidebarCollapsed && item.name}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="border-t border-sidebar-border p-4">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={user?.profile?.profile_picture || undefined} 
                  alt={`${user?.first_name} ${user?.surname}`}
                />
                <AvatarFallback className="text-sm">
                  {getInitials(user?.first_name || '', user?.surname || '')}
                </AvatarFallback>
              </Avatar>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-sidebar-foreground">
                    {user?.first_name} {user?.surname}
                  </p>
                  <p className="truncate text-xs text-sidebar-foreground/60">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen ${mainContentOffsetClass}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <div className="flex items-center gap-3 px-3 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              {!sidebarHidden && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSidebarCollapsed((prev) => !prev)}
                  className="hidden lg:inline-flex"
                  title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
              )}
              <span className="hidden text-lg font-semibold text-foreground lg:inline">Dashboard</span>
            </div>

            <div className="relative hidden w-full max-w-2xl flex-1 lg:block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => window.setTimeout(() => setSearchFocused(false), 150)}
                placeholder="Search pages, tools, settings..."
                className="h-11 rounded-xl border-border bg-muted/50 pl-10 text-sm focus-visible:ring-primary/40"
              />
              {(searchFocused || searchQuery.trim().length > 0) && (
                <div className="absolute left-0 right-0 top-12 z-50 rounded-xl border border-border bg-popover shadow-lg">
                  {searchResults.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">No pages found.</div>
                  ) : (
                    <div className="max-h-72 overflow-y-auto py-1">
                      {searchResults.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={`${item.path}-search`}
                            to={item.path}
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent/10"
                            onClick={() => {
                              setSearchQuery('');
                              setSearchFocused(false);
                              setSidebarOpen(false);
                            }}
                          >
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{item.name}</span>
                            <span className="ml-auto text-xs text-muted-foreground">{item.section || 'Other'}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="ml-auto flex items-center gap-2 lg:gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-foreground lg:flex">
                <CalendarDays className="h-4 w-4" />
                <span className="text-sm font-medium leading-none">{currentDateLabel}</span>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-foreground lg:flex">
                <Timer className="h-4 w-4" />
                <span className="text-sm font-medium leading-none">{currentTimeLabel}</span>
              </div>
              <Button variant="ghost" size="icon" className="hidden lg:inline-flex">
                <Maximize2 className="h-5 w-5" />
              </Button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto rounded-full border border-border bg-muted/30 px-2 py-1.5 hover:bg-muted/60">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage 
                        src={user?.profile?.profile_picture || undefined} 
                        alt={`${user?.first_name} ${user?.surname}`}
                      />
                      <AvatarFallback className="text-sm font-semibold">
                        {getInitials(user?.first_name || '', user?.surname || '')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left sm:block">
                      <p className="text-sm font-semibold leading-tight">{roleLabel}</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </div>
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
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Breadcrumbs - Hidden on dashboard home */}
          {breadcrumbs.length > 0 && (
            <div className="border-b border-border/70 bg-card/70 px-6 py-4">
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
          className="fixed inset-0 z-40 bg-background/75 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
