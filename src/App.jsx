import React, { lazy, Suspense, useMemo, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import Navbar from "./components/Navbar.jsx";
import MobileBottomNav from "./components/MobileBottomNav.jsx";
import { useNativeBackButton } from "./hooks/useNativeBackButton.js";
import { initPushNotifications } from "./utils/pushNotifications.js";
import Footer from "./components/Footer.jsx";
import MiniCart from "./components/MiniCart.jsx";
import { CartProvider, useCart } from "./context/CartContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { CompareProvider } from "./context/CompareContext.jsx";
import { ArrowLeft } from "lucide-react";
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
const CheckoutPage = lazyWithRetry(() => import("./pages/Checkout.jsx"));

const PageLoader = () => (
  <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#0B2419] rounded-full animate-spin"></div>
  </div>
);

function NetworkStatus() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [savedCatalogAt, setSavedCatalogAt] = React.useState(null);

  useEffect(() => {
    const updateConnection = () => setIsOnline(navigator.onLine);
    const showSavedCatalog = event => setSavedCatalogAt(event.detail?.savedAt || Date.now());
    const showFreshCatalog = () => setSavedCatalogAt(null);
    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);
    window.addEventListener('bhumivera:offline-catalog', showSavedCatalog);
    window.addEventListener('bhumivera:online-catalog', showFreshCatalog);
    return () => {
      window.removeEventListener('online', updateConnection);
      window.removeEventListener('offline', updateConnection);
      window.removeEventListener('bhumivera:offline-catalog', showSavedCatalog);
      window.removeEventListener('bhumivera:online-catalog', showFreshCatalog);
    };
  }, []);

  if (isOnline && !savedCatalogAt) return null;
  return (
    <div className="connection-status" role="status" aria-live="polite">
      {isOnline
        ? `Connection interrupted. Showing saved product details from ${new Date(savedCatalogAt).toLocaleString()}; prices and availability may have changed.`
        : 'You are offline. Saved product details may be out of date; live stock, account actions, and checkout need a connection.'}
    </div>
  );
}

function OnlineCheckout({ children }) {
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

  if (isOnline) return children;
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center text-[#14251c]">
      <h1 className="font-serif text-3xl">Reconnect to continue checkout</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-stone-600">
        Your cart has not been submitted. Reconnect so we can load its current contents and confirm prices, stock, and payment details.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-6 min-h-11 rounded-full bg-[#14251c] px-5 py-3 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </section>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function RouteBackControl({ pathname }) {
  const navigate = useNavigate();
  const isAdminDashboard = pathname.startsWith('/admin') &&
    pathname !== '/admin/login' && pathname !== '/admin/forgot-password';

  if (pathname === '/' || isAdminDashboard) return null;

  const fallbackPath = pathname.startsWith('/product/')
    ? '/shop'
    : pathname.startsWith('/warehouse/')
      ? '/warehouse'
      : '/';

  return (
    <div className="route-backbar">
      <button
        type="button"
        onClick={() => {
          if (window.history.state?.idx > 0) navigate(-1);
          else navigate(fallbackPath, { replace: true });
        }}
        className="route-back-button"
        aria-label="Go back"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        <span>Back</span>
      </button>
    </div>
  );
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

function WebOnlyManagement({ children }) {
  return Capacitor.isNativePlatform() ? <Navigate to="/" replace /> : children;
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsCartOpen } = useCart();
  const [pwaUpdateWorker, setPwaUpdateWorker] = React.useState(null);

  useEffect(() => {
    const showUpdateNotice = event => setPwaUpdateWorker(event.detail?.worker || null);
    window.addEventListener('bhumivera:pwa-update-ready', showUpdateNotice);
    if (window.__bhumiveraWaitingWorker) {
      setPwaUpdateWorker(window.__bhumiveraWaitingWorker);
    }
    return () => window.removeEventListener('bhumivera:pwa-update-ready', showUpdateNotice);
  }, []);

  useEffect(() => {
    const handleDeepLink = event => {
      const target = event.detail?.target;
      if (typeof target === 'string' && target.startsWith('/') && !target.startsWith('//')) {
        navigate(target);
        window.__bhumiveraPendingDeepLink = null;
      }
    };
    window.addEventListener('bhumivera:deep-link', handleDeepLink);
    if (window.__bhumiveraPendingDeepLink) {
      handleDeepLink({ detail: { target: window.__bhumiveraPendingDeepLink } });
    }
    return () => window.removeEventListener('bhumivera:deep-link', handleDeepLink);
  }, [navigate]);

  // Native mobile Android back button handling
  useNativeBackButton();

  // Native push notifications registration
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      initPushNotifications(token);
    }
  }, []);

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
    <div className={`flex min-h-screen flex-col ${isManagementView ? 'management-shell' : 'site-shell'}`}>
      {pwaUpdateWorker && <div role="status" className="fixed inset-x-3 top-3 z-[300] mx-auto flex max-w-lg items-center justify-between gap-3 rounded-xl border border-[#c8d6ae] bg-[#fbfaf5] px-4 py-3 text-sm text-[#14251c] shadow-xl">
        <span>A Bhumivera update is ready.</span>
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('bhumivera:pwa-apply-update', {
              detail: { worker: pwaUpdateWorker },
            }));
            setPwaUpdateWorker(null);
          }}
          className="shrink-0 rounded-lg bg-[#14251c] px-3 py-2 text-xs font-bold text-white"
        >
          Update now
        </button>
      </div>}
      {!isManagementView && <Navbar />}
      {!isManagementView && <NetworkStatus />}
      
      <main id="main-content" className="flex-1 w-full flex flex-col">
        <ScrollToTop /> 
        <RouteBackControl pathname={location.pathname} />
        
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
            <Route path="/admin/forgot-password" element={<WebOnlyManagement><AdminForgotPassword /></WebOnlyManagement>} />

            {/* Protected User Routes */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/cart" element={<Navigate to="/?openCart=1" replace />} />
            <Route path="/checkout" element={<ProtectedRoute><OnlineCheckout><CheckoutPage /></OnlineCheckout></ProtectedRoute>} />
            <Route path="/order-success/:orderId?" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/address-book" element={<ProtectedRoute><AddressBook /></ProtectedRoute>} />
            <Route path="/returns" element={<ProtectedRoute><Returns /></ProtectedRoute>} />
            <Route path="/affiliate" element={<ProtectedRoute><Affiliate /></ProtectedRoute>} />

            {/* Warehouse System */}
            <Route path="/warehouse" element={<WebOnlyManagement><WarehouseRoute><Warehouse /></WarehouseRoute></WebOnlyManagement>} />
            <Route path="/warehouse/admin" element={<WebOnlyManagement><WarehouseRoute><WarehouseAdmin /></WarehouseRoute></WebOnlyManagement>} />
            <Route path="/warehouse/management" element={<WebOnlyManagement><WarehouseRoute><WarehouseManagement /></WarehouseRoute></WebOnlyManagement>} />
            <Route path="/warehouseadmin" element={<WebOnlyManagement><WarehouseAdminLogin /></WebOnlyManagement>} />
            
            {/* Admin System */}
            <Route path="/admin/login" element={<WebOnlyManagement><AdminLogin /></WebOnlyManagement>} />
            <Route path="/admin" element={<WebOnlyManagement><AdminRoute><AdminDashboard /></AdminRoute></WebOnlyManagement>} />
            <Route path="/admin/dashboard/:tab" element={<WebOnlyManagement><AdminRoute><AdminDashboard /></AdminRoute></WebOnlyManagement>} />
            <Route path="/admin/*" element={<WebOnlyManagement><AdminRoute><AdminDashboard /></AdminRoute></WebOnlyManagement>} />

            {/* Backward-compat redirects (old bookmarks) */}
            <Route path="/admin-login" element={<WebOnlyManagement><Navigate to="/admin/login" replace /></WebOnlyManagement>} />

            {/* Global Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
            <MobileBottomNav />
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
