import React, { lazy, Suspense, useMemo, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import MiniCart from "./components/MiniCart.jsx";
import { CartProvider, useCart } from "./context/CartContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { CompareProvider } from "./context/CompareContext.jsx";
import "./index.css";

const CHUNK_RELOAD_KEY = 'page-chunk-reload-attempted';

const reloadLatestBuild = () => {
  window.sessionStorage.setItem(CHUNK_RELOAD_KEY, 'true');
  const latestUrl = new URL(window.location.href);
  latestUrl.searchParams.set('_refresh', Date.now().toString());
  window.location.replace(latestUrl.toString());
};

function ModuleLoadError({ error }) {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  useEffect(() => {
    const updateConnection = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);
    return () => {
      window.removeEventListener('online', updateConnection);
      window.removeEventListener('offline', updateConnection);
    };
  }, []);

  useEffect(() => {
    console.error('[PAGE_MODULE_LOAD]', error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center bg-[#f4f2eb] px-6 text-center text-[#1c2922]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#607552]">Bhumivera</p>
      <h1 className="mt-4 max-w-xl font-serif text-3xl md:text-4xl">A fresh connection is needed</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-stone-600">
        {isOnline
          ? 'This page could not be loaded. Refresh to get the latest version and try again.'
          : 'This page could not be loaded while you are offline. Reconnect to the internet, then try again.'}
      </p>
      <button
        type="button"
        onClick={reloadLatestBuild}
        className="mt-7 bg-[#1c2922] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#35533c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#607552]"
      >
        {isOnline ? 'Refresh page' : 'Try again'}
      </button>
    </section>
  );
}

const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    try {
      const component = await componentImport();
      window.sessionStorage.removeItem(CHUNK_RELOAD_KEY);
      const currentUrl = new URL(window.location.href);
      if (currentUrl.searchParams.has('_refresh')) {
        currentUrl.searchParams.delete('_refresh');
        window.history.replaceState(null, '', currentUrl.toString());
      }
      return component;
    } catch (error) {
      const alreadyRetried = window.sessionStorage.getItem(CHUNK_RELOAD_KEY) === 'true';
      if (!alreadyRetried && navigator.onLine) {
        reloadLatestBuild();
        return { default: () => <PageLoader /> };
      }
      return { default: () => <ModuleLoadError error={error} /> };
    }
  });

// Existing Pages
const Home = lazyWithRetry(() => import("./pages/PremiumHome.jsx"));
const Warehouse = lazyWithRetry(() => import("./pages/Warehouse.jsx"));
const WarehouseAdmin = lazyWithRetry(() => import("./pages/admin/WarehouseAdmin.jsx"));
const WarehouseManagement = lazyWithRetry(() => import("./pages/admin/WarehouseManagement.jsx"));
const WarehouseAdminLogin = lazyWithRetry(() => import("./pages/WarehouseAdminLogin.jsx"));
const Shop = lazyWithRetry(() => import("./pages/Shop.jsx"));
const ProductDetail = lazyWithRetry(() => import("./pages/ProductDetail.jsx"));
const Contact = lazyWithRetry(() => import("./pages/Contact.jsx"));
const OrderSuccess = lazyWithRetry(() => import("./pages/OrderSuccess.jsx"));
const Login = lazyWithRetry(() => import("./pages/Login.jsx"));
const Register = lazyWithRetry(() => import("./pages/Register.jsx"));
const Profile = lazyWithRetry(() => import("./pages/Profile.jsx"));
const AdminLogin = lazyWithRetry(() => import("./pages/AdminLogin.jsx"));
const AdminDashboard = lazyWithRetry(() => import("./pages/AdminDashboard.jsx"));
const Wishlist = lazyWithRetry(() => import("./pages/Wishlist.jsx"));
const OrderTracking = lazyWithRetry(() => import("./pages/OrderTracking.jsx"));
const Compare = lazyWithRetry(() => import("./pages/Compare.jsx"));
const AddressBook = lazyWithRetry(() => import("./pages/AddressBook.jsx"));
const Returns = lazyWithRetry(() => import("./pages/Returns.jsx"));
const PurchaseProtection = lazyWithRetry(() => import("./pages/PurchaseProtection.jsx"));
const Affiliate = lazyWithRetry(() => import("./pages/Affiliate.jsx"));
const About = lazyWithRetry(() => import("./pages/About.jsx"));
const Impact = lazyWithRetry(() => import("./pages/Impact.jsx"));
const Legal = lazyWithRetry(() => import("./pages/Legal.jsx"));

// NEW: Bhumivera Specific Pages using lazyWithRetry
const BhumiveraScience = lazyWithRetry(() => import("./pages/BhumiveraScience.jsx"));
const ReturnsCentre = lazyWithRetry(() => import("./pages/ReturnsCentre.jsx"));

// NEW: MPGEBusiness Landing Route
const MPGEBusinessLanding = lazyWithRetry(() => import("./pages/MPGEBusinessLanding.jsx"));

// NEW: Orphan pages routeability
const FlashSales = lazyWithRetry(() => import("./pages/FlashSales.jsx"));
const SomaticRegistry = lazyWithRetry(() => import("./pages/SomaticRegistry.jsx"));
const ProvenanceEngine = lazyWithRetry(() => import("./pages/ProvenanceEngine.jsx"));
const SpinRegistration = lazyWithRetry(() => import("./pages/SpinRegistration.jsx"));

// NEW: Premium password reset pages
const ForgotPassword = lazyWithRetry(() => import("./pages/ForgotPassword.jsx"));
const ResetPassword = lazyWithRetry(() => import("./pages/ResetPassword.jsx"));
const AdminForgotPassword = lazyWithRetry(() => import("./pages/admin/AdminForgotPassword.jsx"));

const PageLoader = () => (
  <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#0B2419] rounded-full animate-spin"></div>
  </div>
);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function ProtectedRoute({ children }) {
  const { loading } = useAuth() || {};
  const t = localStorage.getItem('token');
  
  if (loading) return <PageLoader />;
  if (!t) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth() || {};
  const t = localStorage.getItem('adminToken') || localStorage.getItem('token');

  const isAdmin = useMemo(() => {
    return user?.role === 'admin' || user?.role === 'superadmin';
  }, [user]);

  if (loading) return <PageLoader />;
  if (!t || !isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}

function WarehouseRoute({ children }) {
  const { loading } = useAuth() || {};
  const t = localStorage.getItem('token') || localStorage.getItem('warehouseToken');
  
  if (loading) return <PageLoader />;
  if (!t) return <Navigate to="/warehouseadmin" replace />;
  return children;
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsCartOpen } = useCart();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shouldOpenCheckout = params.has('cartCheckout');
    if (!shouldOpenCheckout && !params.has('openCart')) return;
    if (shouldOpenCheckout) sessionStorage.setItem('mini-cart-checkout', '1');
    setIsCartOpen(true);
    navigate(location.pathname, { replace: true });
  }, [location.pathname, location.search, navigate, setIsCartOpen]);
  
  const isManagementView = useMemo(() => {
    const path = location.pathname;
    return (
      path.startsWith("/admin") || 
      path.startsWith("/warehouse") || 
      path === "/warehouseadmin" || 
      path === "/earn-from-home" || 
      path === "/mpgebusiness"
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {!isManagementView && <Navbar />}
      
      <main id="main-content" className="flex-1 w-full flex flex-col">
        <ScrollToTop /> 
        
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/legal" element={<Legal />} />
            
            {/* Bhumivera Brand Routes */}
            <Route path="/science" element={<BhumiveraScience />} />
            <Route path="/purchase-protection" element={<PurchaseProtection />} />
            <Route path="/returns-centre" element={<ReturnsCentre />} />

            {/* Campaign Inbound Routes */}
            <Route path="/earn-from-home" element={<MPGEBusinessLanding />} />
            <Route path="/mpgebusiness" element={<MPGEBusinessLanding />} />

            {/* Tools & Tracking */}
            <Route path="/warranty" element={<Navigate to="/returns" replace />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/compare" element={<Compare />} />

            {/* Orphan pages reachability */}
            <Route path="/flash-sales" element={<FlashSales />} />
            <Route path="/somatic-registry" element={<SomaticRegistry />} />
            <Route path="/provenance-engine" element={<ProvenanceEngine />} />
            <Route path="/spin-registration" element={<Navigate to="/returns" replace />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Public Auth Password Reset Routes */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />

            {/* Protected User Routes */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/cart" element={<Navigate to="/?openCart=1" replace />} />
            <Route path="/checkout" element={<Navigate to="/?cartCheckout=1" replace />} />
            <Route path="/order-success/:orderId?" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/address-book" element={<ProtectedRoute><AddressBook /></ProtectedRoute>} />
            <Route path="/returns" element={<ProtectedRoute><Returns /></ProtectedRoute>} />
            <Route path="/affiliate" element={<ProtectedRoute><Affiliate /></ProtectedRoute>} />

            {/* Warehouse System */}
            <Route path="/warehouse" element={<WarehouseRoute><Warehouse /></WarehouseRoute>} />
            <Route path="/warehouse/admin" element={<WarehouseRoute><WarehouseAdmin /></WarehouseRoute>} />
            <Route path="/warehouse/management" element={<WarehouseRoute><WarehouseManagement /></WarehouseRoute>} />
            <Route path="/warehouseadmin" element={<WarehouseAdminLogin />} />
            
            {/* Admin System */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/dashboard/:tab" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            {/* Backward-compat redirects (old bookmarks) */}
            <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />

            {/* Global Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {!isManagementView && <Footer />}
      {!isManagementView && <MiniCart />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <AppContent />
              </CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
