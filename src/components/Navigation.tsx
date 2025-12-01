import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
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

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isAdmin, isSuperAdmin } = usePermissions();

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "ABOUT US", path: "/about" },
    { name: "EVENTS", path: "/events" },
    { name: "PARTNER", path: "/partner" },
    { name: "BLOG", path: "/blog" },
    { name: "SHOP", path: "/shop" },
    { name: "DONATION", path: "/donation" },
    { name: "TICKETS", path: "/tickets" },
    { name: "CONTACT", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */} 
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/NGC-Logo-2.png" 
                alt="NGC Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
              {/* <span className="font-bold text-lg sm:text-xl text-foreground">Neema Gospel Choir</span> */}
            </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary relative ${
                  isActive(item.path) 
                    ? "text-primary" 
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-primary rounded-full" />
                )}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>

          {/* User Menu / Login Register Buttons */}
          <div className="hidden md:flex items-center space-x-3">
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="text-sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="text-sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? "text-primary bg-primary/5 border-l-4 border-primary"
                      : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t pt-3 mt-3 space-y-2">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button variant="outline" className="w-full flex items-center gap-2">
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
                      className="block px-3 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link
                      to="/register"
                      className="block px-3 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button className="w-full">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
