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

import EventsManagement from "./components/admin/EventsManagement";
import DonationsManagement from "./components/admin/DonationsManagement";
import ReportsManagement from "./components/admin/ReportsManagement";


import AddUserPage from "./pages/dashboard/AddUserPage";
import AddProductPage from "./pages/dashboard/AddProductPage";
import AddCategoryPage from "./pages/dashboard/AddCategoryPage";
import EditProductPage from "./pages/dashboard/EditProductPage";
import ViewProductPage from "./pages/dashboard/ViewProductPage";
import EditCategoryPage from "./pages/dashboard/EditCategoryPage";
import ViewCategoryPage from "./pages/dashboard/ViewCategoryPage";
import AddPermissionPage from "./pages/dashboard/AddPermissionPage";
import EditPermissionPage from "./pages/dashboard/EditPermissionPage";
import ViewRolePage from "./pages/dashboard/ViewRolePage";
import EditRolePage from "./pages/dashboard/EditRolePage";
import PermissionsList from "./components/admin/PermissionsList";


// Enhanced Chat Components
import EnhancedChat from "./components/enhanced-chat/EnhancedChat";
import ChatHistory from "./components/enhanced-chat/ChatHistory";
import ChatSettings from "./components/enhanced-chat/ChatSettings";

// Import i18n configuration
import './i18n';
import { AuthProvider } from "./Providers/auth.provider";

// Import CMS Providers
import { BlogProvider } from "./contexts/BlogContext";
import { ContactProvider } from "./contexts/ContactContext";
import { SliderProvider } from "./contexts/SliderContext";
import { AboutProvider } from "./contexts/AboutContext";

// Import CMS Pages
import BlogManagementPage from "./pages/dashboard/BlogManagementPage";
import AddBlogPage from "./pages/dashboard/AddBlogPage";
import EditBlogPage from "./pages/dashboard/EditBlogPage";
import ContactManagementPage from "./pages/dashboard/ContactManagementPage";
import SliderManagementPage from "./pages/dashboard/SliderManagementPage";
import AddSliderPage from "./pages/dashboard/AddSliderPage";
import EditSliderPage from "./pages/dashboard/EditSliderPage";
import AboutManagementPage from "./pages/dashboard/AboutManagementPage";

// Import E-Commerce Providers
import { ShopProvider } from "./contexts/ShopContext";
import { CartProvider } from "./contexts/CartContext";
import { OrderProvider } from "./contexts/OrderContext";
import { AddressProvider } from "./contexts/AddressContext";

// Import E-Commerce Pages
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderHistoryPage from "./pages/dashboard/OrderHistoryPage";
import OrderDetailPage from "./pages/dashboard/OrderDetailPage";
import AddressManagementPage from "./pages/dashboard/AddressManagementPage";
import OrdersManagementPage from "./pages/dashboard/OrdersManagementPage";
import OrderDetailAdminPage from "./pages/dashboard/OrderDetailAdminPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RBACProvider>
        <UserManagementProvider>
          <BlogProvider>
            <ContactProvider>
              <SliderProvider>
                <AboutProvider>
                <ShopProvider>
                <CartProvider>
                <OrderProvider>
                <AddressProvider>
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
                <Route path="shop/:id" element={<ProductDetail />} />
                <Route path="cart" element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                } />
                <Route path="checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
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

                {/* Enhanced Chat Routes */}
                <Route path="chat" element={<EnhancedChat />} />
                <Route path="chat/history" element={<ChatHistory />} />
                <Route path="chat/settings" element={<ChatSettings />} />

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
                  path="users/add"
                  element={
                    <PermissionBasedRoute requiredRoles={['super_admin']}>
                      <AddUserPage />
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
                  path="roles/view/:id"
                  element={
                    <PermissionBasedRoute requiredRoles={['super_admin']}>
                      <ViewRolePage />
                    </PermissionBasedRoute>
                  }
                />
                <Route
                  path="roles/edit/:id"
                  element={
                    <PermissionBasedRoute requiredRoles={['super_admin']}>
                      <EditRolePage />
                    </PermissionBasedRoute>
                  }
                />
                <Route
                  path="permissions"
                  element={
                    <PermissionBasedRoute requiredRoles={['super_admin']}>
                      <PermissionsList />
                    </PermissionBasedRoute>
                  }
                />
                <Route
                  path="permissions/create"
                  element={
                    <PermissionBasedRoute requiredRoles={['super_admin']}>
                      <AddPermissionPage />
                    </PermissionBasedRoute>
                  }
                />
                <Route
                  path="permissions/edit/:id"
                  element={
                    <PermissionBasedRoute requiredRoles={['super_admin']}>
                      <EditPermissionPage />
                    </PermissionBasedRoute>
                  }
                />
              
                <Route
                  path="shop"
                  element={
                    <PermissionBasedRoute  requiredRoles={['super_admin']}>
                      <AdminShop />
                    </PermissionBasedRoute>
                  }
                />
                 <Route
                  path="shop/create"
                  element={
                    <PermissionBasedRoute  requiredRoles={['super_admin']}>
                      <AddProductPage />
                    </PermissionBasedRoute>
                  }
                />
                <Route
                  path="shop/edit/:id"
                  element={
                    <PermissionBasedRoute  requiredRoles={['super_admin']}>
                      <EditProductPage />
                    </PermissionBasedRoute>
                  }
                />
                <Route
                  path="shop/view/:id"
                  element={
                    <PermissionBasedRoute  requiredRoles={['super_admin']}>
                      <ViewProductPage />
                    </PermissionBasedRoute>
                  }
                />
               
                <Route
                  path="products/categories"
                  element={
                    <PermissionBasedRoute  requiredRoles={['super_admin']}>
                      <ProductCategoriesList />
                    </PermissionBasedRoute>
                  }
                />
                  <Route
                  path="products/categories/create"
                  element={
                    <PermissionBasedRoute  requiredRoles={['super_admin']}>
                      <AddCategoryPage />
                    </PermissionBasedRoute>
                  }
                />
                <Route
                  path="products/categories/edit/:id"
                  element={
                    <PermissionBasedRoute  requiredRoles={['super_admin']}>
                      <EditCategoryPage />
                    </PermissionBasedRoute>
                  }
                />
                <Route
                  path="products/categories/view/:id"
                  element={
                    <PermissionBasedRoute  requiredRoles={['super_admin']}>
                      <ViewCategoryPage />
                    </PermissionBasedRoute>
                  }
                />
              
                <Route
                  path="blog-management"
                  element={
                    <PermissionBasedRoute  requiredRoles={['super_admin']}>
                      <BlogManagementPage />
                    </PermissionBasedRoute>
                  }
                />
                <Route
                  path="blog-management/add"
                  element={
                    <PermissionBasedRoute  requiredRoles={['super_admin']}>
                      <AddBlogPage />
                    </PermissionBasedRoute>
                  }
                />
                <Route
                  path="blog-management/edit/:id"
                  element={
                    <PermissionBasedRoute  requiredRoles={['super_admin']}>
                      <EditBlogPage />
                    </PermissionBasedRoute>
                  }
                />
                <Route
                  path="contact-management"
                  element={<ContactManagementPage />}
                />
                <Route
                  path="about-management"
                  element={
                    <PermissionBasedRoute requiredRoles={['super_admin']}>
                      <AboutManagementPage />
                    </PermissionBasedRoute>
                  }
                />
                <Route
                  path="slider-management"
                  element={
                    <PermissionBasedRoute  requiredRoles={['super_admin']}>
                      <SliderManagementPage />
                    </PermissionBasedRoute>
                  }
                />
                <Route
                  path="slider-management/add"
                  element={
                    <PermissionBasedRoute  requiredRoles={['super_admin']}>
                      <AddSliderPage />
                    </PermissionBasedRoute>
                  }
                />
                <Route
                  path="slider-management/edit/:id"
                  element={
                    <PermissionBasedRoute  requiredRoles={['super_admin']}>
                      <EditSliderPage />
                    </PermissionBasedRoute>
                  }
                />
                <Route
                  path="events-management"
                  element={
                    <PermissionBasedRoute  requiredRoles={['super_admin']}>
                      <EventsManagement />
                    </PermissionBasedRoute>
                  }
                />
                <Route
                  path="donations"
                  element={
                    <PermissionBasedRoute  requiredRoles={['super_admin']}>
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

                {/* E-Commerce Routes */}
                <Route path="orders" element={<OrderHistoryPage />} />
                <Route path="orders/:id" element={<OrderDetailPage />} />
                <Route path="addresses" element={<AddressManagementPage />} />
                <Route
                  path="orders-management"
                  element={
                    <PermissionBasedRoute requiredRoles={['super_admin']}>
                      <OrdersManagementPage />
                    </PermissionBasedRoute>
                  }
                />
                <Route
                  path="orders-management/:id"
                  element={
                    <PermissionBasedRoute requiredRoles={['super_admin']}>
                      <OrderDetailAdminPage />
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
                </AddressProvider>
                </OrderProvider>
                </CartProvider>
                </ShopProvider>
                </AboutProvider>
              </SliderProvider>
            </ContactProvider>
          </BlogProvider>
        </UserManagementProvider>
      </RBACProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
