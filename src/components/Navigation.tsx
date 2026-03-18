import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Search, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import CartBadge from "@/components/shop/CartBadge";

interface NavigationProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onLoginClick, onRegisterClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isAdmin, isSuperAdmin } = usePermissions();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Updated: Enhanced navigation items with dropdowns
  const navigationItems = [
    { name: "Home", path: "/", submenu: null },
    { 
      name: "About", 
      path: "/about",
      submenu: [
        { name: "Our Story", path: "/about#story" },
        { name: "Leadership", path: "/leadership" },
        { name: "Mission", path: "/about#mission" },
      ]
    },
    { 
      name: "Events", 
      path: "/events",
      submenu: [
        { name: "Upcoming Events", path: "/events" },
        { name: "Past Events", path: "/events#past" },
        { name: "Tickets", path: "/tickets" },
      ]
    },
    { name: "Partner", path: "/partner", submenu: null },
    { name: "Blog", path: "/blog", submenu: null },
    { 
      name: "Shop", 
      path: "/shop",
      submenu: [
        { name: "All Products", path: "/shop" },
        { name: "Merchandise", path: "/shop?category=merch" },
        { name: "Music", path: "/shop?category=music" },
      ]
    },
    { name: "Donation", path: "/donation", submenu: null },
    { name: "Contact", path: "/contact", submenu: null },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Updated: Enhanced NavItem component with improved animations and styling
  const NavItem = ({ item }: { item: typeof navigationItems[0] }) => {
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

    return (
      <div 
        className="relative group"
        onMouseEnter={() => item.submenu && setIsSubmenuOpen(true)}
        onMouseLeave={() => item.submenu && setIsSubmenuOpen(false)}
      >
        <Link
          to={item.path}
          className={`px-4 py-2 text-sm font-medium transition-colors duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-600 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full ${
            isActive(item.path)
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          {item.name}
        </Link>
        {item.submenu && isSubmenuOpen && (
          <div className="absolute left-0 mt-2 w-48 rounded-lg py-2 z-50 backdrop-blur-md bg-transparent border border-white/20 transform transition-all duration-300 ease-in-out">
            {item.submenu.map((subItem, index) => (
              <Link
                key={index}
                to={subItem.path}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {subItem.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You can integrate with next-themes or your existing dark mode system
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-transparent shadow-none transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
            <Link to="/" className="flex items-center space-x-2">
              <img
                className="h-10 w-auto rounded-lg shadow-md"
                src="/lovable-uploads/NGC-Logo-2.png"
                alt="Logo"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110">
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              
              {user && <CartBadge />}
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={user.profile?.profile_picture || undefined} 
                          alt={`${user.first_name} ${user.surname}`}
                        />
                        <AvatarFallback className="text-xs">
                          {user.first_name?.[0]}{user.surname?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.first_name} {user.surname}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {(isAdmin || isSuperAdmin) && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm bg-transparent border border-current/30 hover:bg-white/10 dark:hover:bg-white/10"
                  >
                    Login
                  </Button>
                </Link>
              )}
              {!user && (
                <Link to="/register">
                  <Button 
                    size="sm" 
                    className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Register
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-1">
            {user && <CartBadge />}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 focus:outline-none transition-colors duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-transparent backdrop-blur-md rounded-b-2xl"
          >
            <div className="px-4 pt-3 pb-4 space-y-2">
              {navigationItems.map((item, index) => (
                <div key={index}>
                  <Link
                    to={item.path}
                    className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-200 dark:hover:bg-gray-800 transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && item.submenu.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.path}
                      className="block px-8 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              ))}
              
              <div className="border-t pt-4 mt-4 space-y-2">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button variant="ghost" className="w-full flex items-center gap-2 bg-transparent border border-current/30 hover:bg-white/10 dark:hover:bg-white/10">
                        <User className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      className="w-full flex items-center gap-2"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button variant="ghost" className="w-full bg-transparent border border-current/30 hover:bg-white/10 dark:hover:bg-white/10">
                        Login
                      </Button>
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
