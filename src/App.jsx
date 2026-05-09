import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { CompareProvider } from "./context/CompareContext.jsx";
import "./index.css";

// Lazy load pages
const Home = lazy(() => import("./pages/Home.jsx"));
const Warehouse = lazy(() => import("./pages/Warehouse.jsx"));
// Warehouse portal - strictly for /warehouse routes only
const WarehouseAdmin = lazy(() => import("./pages/admin/WarehouseAdmin.jsx"));
const WarehouseManagement = lazy(() => import("./pages/admin/WarehouseManagement.jsx"));
const Shop = lazy(() => import("./pages/Shop.jsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.jsx"));
const EWarranty = lazy(() => import("./pages/EWarranty.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));
// Admin dashboard - strictly for /admin routes only (superadmin)
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.jsx"));
const OrderTracking = lazy(() => import("./pages/OrderTracking.jsx"));
const Compare = lazy(() => import("./pages/Compare.jsx"));
const AddressBook = lazy(() => import("./pages/AddressBook.jsx"));
const Returns = lazy(() => import("./pages/Returns.jsx"));
const Affiliate = lazy(() => import("./pages/Affiliate.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Legal = lazy(() => import("./pages/Legal.jsx"));

const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
  </div>
);

// Base auth check (any logged-in user)
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth() || { user: null, loading: false };
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" />;
  return children;
}

// ── STRICT: Superadmin-only portal (anritvox.com/admin) ─────────────────────────────────────────────
function AdminRoute({ children }) {
  const { user, loading } = useAuth() || { user: null, loading: false };
  if (loading) return <PageLoader />;
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin'))
    return <Navigate to="/admin-login" />;
  return children;
}

// ── STRICT: Warehouse staff + superadmin only (anritvox.com/warehouse) ─────────────────────
function WarehouseRoute({ children }) {
  const { user, loading } = useAuth() || { user: null, loading: false };
  if (loading) return <PageLoader />;
  if (!user || (user.role !== 'warehouse_admin' && user.role !== 'superadmin' && user.role !== 'admin'))
    return <Navigate to="/login" />;
  return children;
}

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const isWarehousePath = location.pathname.startsWith("/warehouse");

  return (
    <>
      {!isAdminPath && !isWarehousePath && <Navbar />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/ewarranty" element={<EWarranty />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/compare" element={<Compare />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Feature Routes (Protected - any logged-in user) */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/address-book" element={<ProtectedRoute><AddressBook /></ProtectedRoute>} />
          <Route path="/returns" element={<ProtectedRoute><Returns /></ProtectedRoute>} />
          <Route path="/affiliate" element={<ProtectedRoute><Affiliate /></ProtectedRoute>} />

          {/* ── WAREHOUSE PORTAL ── Strictly /warehouse/* - warehouse_admin OR superadmin ONLY */}
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/warehouse/admin" element={<WarehouseRoute><WarehouseAdmin /></WarehouseRoute>} />
          <Route path="/warehouse/management" element={<WarehouseRoute><WarehouseManagement /></WarehouseRoute>} />

          {/* ── ADMIN PORTAL ── Strictly /admin/* - superadmin ONLY, NO warehouse components here */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/dashboard/:tab" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* Catch-all (Must be at the very bottom) */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
      {!isAdminPath && !isWarehousePath && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              <ToastProvider>
                <AppContent />
              </ToastProvider>
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
