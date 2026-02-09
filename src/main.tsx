import { createRoot } from 'react-dom/client'
import './index.css'

// Import i18n configuration before rendering
import './i18n';

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RBACProvider } from "@/Providers/rbac.provider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserManagementProvider } from "@/contexts/UserManagementContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Partner from "./pages/Partner";
import Blog from "./pages/Blog";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import Donation from "./pages/Donation";
import Tickets from "./pages/Tickets";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./components/VerifyOTP";
import ProtectedRoute from "./components/ProtectedRoute";
import PermissionBasedRoute from "./components/PermissionBasedRoute";

// Dashboard Components
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import BlogPage from "./pages/dashboard/BlogPage";
import MusicPage from "./pages/dashboard/MusicPage";
import NewsPage from "./pages/dashboard/NewsPage";
import GalleryPage from "./pages/dashboard/GalleryPage";
import EventsPage from "./pages/dashboard/EventsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";

import ProductCategoriesList from "./components/admin/ProductCategoriesList";
import AdminShop from "./components/admin/AdminShop";
import UsersList from "./components/admin/UsersList";
import RolesList from "./components/admin/RolesList";

import BlogManagement from "./components/admin/BlogManagement";
import EventsManagement from "./components/admin/EventsManagement";
import DonationsManagement from "./components/admin/DonationsManagement";
import ReportsManagement from "./components/admin/ReportsManagement";
import { AuthProvider } from "./Providers/auth.provider";

const queryClient = new QueryClient();

const AppWrapper = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RBACProvider>
        <UserManagementProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="events" element={<Events />} />
                    <Route path="partner" element={<Partner />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="shop" element={<Shop />} />
                    <Route path="donation" element={<Donation />} />
                    <Route path="tickets" element={<Tickets />} />
                    <Route path="contact" element={<Contact />} />
                  </Route>
                  
                  {/* Dashboard Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<DashboardHome />} />
                    <Route 
                      path="blog" 
                      element={
                        <PermissionBasedRoute requiredPermissions={['view_news']}>
                          <BlogPage />
                        </PermissionBasedRoute>
                      } 
                    />
                    <Route 
                      path="music" 
                      element={
                        <PermissionBasedRoute requiredPermissions={['view_music']}>
                          <MusicPage />
                        </PermissionBasedRoute>
                      } 
                    />
                    <Route 
                      path="news" 
                      element={
                        <PermissionBasedRoute requiredPermissions={['view_news']}>
                          <NewsPage />
                        </PermissionBasedRoute>
                      } 
                    />
                    <Route path="gallery" element={<GalleryPage />} />
                    <Route 
                      path="events" 
                      element={
                        <PermissionBasedRoute requiredPermissions={['view_events']}>
                          <EventsPage />
                        </PermissionBasedRoute>
                      } 
                    />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="settings" element={<SettingsPage />} />


                    {/* Management Routes - Access controlled by RBAC permissions */}
                    <Route
                      path="users"
                      element={
                        <PermissionBasedRoute requiredRoles={['super_admin']}>
                          <UsersList />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="roles"
                      element={
                        <PermissionBasedRoute requiredRoles={['super_admin']}>
                          <RolesList />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="shop"
                      element={
                        <PermissionBasedRoute requiredRoles={['super_admin']}>
                          <AdminShop />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="products/categories"
                      element={
                        <PermissionBasedRoute requiredRoles={['super_admin']}>
                          <ProductCategoriesList />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="blog-management"
                      element={
                        <PermissionBasedRoute requiredRoles={['super_admin']}>
                          <BlogManagement />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="events-management"
                      element={
                        <PermissionBasedRoute requiredRoles={['super_admin']}>
                          <EventsManagement />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="donations"
                      element={
                        <PermissionBasedRoute requiredRoles={['super_admin']}>
                          <DonationsManagement />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="reports"
                      element={
                        <PermissionBasedRoute requiredPermissions={['view_donations', 'view_products', 'view_events']}>
                          <ReportsManagement />
                        </PermissionBasedRoute>
                      }
                    />
                  </Route>

                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/verify-otp" element={<VerifyOTP />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </LanguageProvider>
        </UserManagementProvider>
      </RBACProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<AppWrapper />);

