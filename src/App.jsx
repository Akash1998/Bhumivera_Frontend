import React, { lazy, Suspense, useMemo, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import Navbar from "./components/Navbar.jsx";
import MobileBottomNav from "./components/MobileBottomNav.jsx";
import { useNativeBackButton } from "./hooks/useNativeBackButton.js";
import { initPushNotifications } from "./utils/pushNotifications.js";
import Footer from "./components/Footer.jsx";
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
    <section className="flex min-h-[60vh] flex-col items-center justify-center bg-[#070a0e] px-6 text-center text-[#e2e8f0]">
      <p className="font-sub-gold uppercase tracking-[0.26em] text-xs font-bold">Bhumivera Luxury Botanical</p>
      <h1 className="mt-4 max-w-xl font-serif text-3xl md:text-4xl font-bold">
        <span className="font-headline-gold">A Fresh Connection</span>{' '}
        <span className="font-headline-silver">Is Required</span>
      </h1>
      <div className="gold-hairline w-24 mx-auto my-3" />
      <p className="mt-2 max-w-md text-sm leading-6 text-[#cbd5e1] font-light">
        {isOnline
          ? 'This formulation experience could not be loaded. Refresh to load the latest release and resume.'
          : 'This formulation experience could not be loaded while offline. Reconnect to resume.'}
      </p>
      <button
        type="button"
        onClick={reloadLatestBuild}
        className="btn-gold-luxury mt-7 px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white"
      >
        {isOnline ? 'Refresh Experience' : 'Retry Connection'}
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

const MiniCart = lazyWithRetry(() => import("./components/MiniCart.jsx"));
const SupportAssistant = lazyWithRetry(() => import("./components/SupportAssistant.jsx"));
const VisualGuideModal = lazyWithRetry(() => import("./components/VisualGuideModal.jsx"));

// Storefront & Portal Pages
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
const PurchaseProtection = lazyWithRetry(() => import("./pages/PurchaseProtection.jsx"));
const Affiliate = lazyWithRetry(() => import("./pages/Affiliate.jsx"));
const About = lazyWithRetry(() => import("./pages/About.jsx"));
const Impact = lazyWithRetry(() => import("./pages/Impact.jsx"));
const ImpactProjectDetail = lazyWithRetry(() => import("./pages/ImpactProjectDetail.jsx"));
const Community = lazyWithRetry(() => import("./pages/Community.jsx"));
const Legal = lazyWithRetry(() => import("./pages/Legal.jsx"));
const BhumiveraScience = lazyWithRetry(() => import("./pages/BhumiveraScience.jsx"));
const MPGEBusinessLanding = lazyWithRetry(() => import("./pages/MPGEBusinessLanding.jsx"));
const FlashSales = lazyWithRetry(() => import("./pages/FlashSales.jsx"));
const SomaticRegistry = lazyWithRetry(() => import("./pages/SomaticRegistry.jsx"));
const ProvenanceEngine = lazyWithRetry(() => import("./pages/ProvenanceEngine.jsx"));
const SpinRegistration = lazyWithRetry(() => import("./pages/SpinRegistration.jsx"));
const ForgotPassword = lazyWithRetry(() => import("./pages/ForgotPassword.jsx"));
const ResetPassword = lazyWithRetry(() => import("./pages/ResetPassword.jsx"));
const SupportPortal = lazyWithRetry(() => import("./pages/SupportPortal.jsx"));
const SuperAdminSupport = lazyWithRetry(() => import("./pages/SuperAdminSupport.jsx"));
const AdminForgotPassword = lazyWithRetry(() => import("./pages/admin/AdminForgotPassword.jsx"));
const CheckoutPage = lazyWithRetry(() => import("./pages/Checkout.jsx"));
const ProductVerification = lazyWithRetry(() => import("./pages/ProductVerification.jsx"));
const SellOnBhumivera = lazyWithRetry(() => import("./pages/SellOnBhumivera.jsx"));

const PageLoader = () => (
  <div className="premium-page-loader" role="status" aria-live="polite" aria-label="Loading Bhumivera">
    <div className="premium-loader-mark" aria-hidden="true">
      <span className="premium-loader-orbit" />
      <span className="premium-loader-core">B</span>
    </div>
    <span className="premium-loader-wordmark">BHUMIVERA</span>
    <span className="premium-loader-caption">Preparing your experience</span>
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
  const { token, user } = useAuth();
  const [pwaUpdateWorker, setPwaUpdateWorker] = React.useState(null);
  const [visualGuideState, setVisualGuideState] = React.useState({ isOpen: false, tab: 'password' });

  useEffect(() => {
    const handleOpenGuide = event => {
      const tab = event.detail?.tab || 'password';
      setVisualGuideState({ isOpen: true, tab });
    };
    window.addEventListener('bhumivera:open-visual-guide', handleOpenGuide);
    return () => window.removeEventListener('bhumivera:open-visual-guide', handleOpenGuide);
  }, []);

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

  useNativeBackButton();

  useEffect(() => {
    const customerToken = localStorage.getItem('token');
    if (customerToken && token === customerToken && !['admin', 'superadmin', 'warehouse_admin'].includes(user?.role)) {
      initPushNotifications(token).catch(error => {
        console.error('[PUSH_NOTIFICATIONS_INITIALIZATION_ERROR]', error);
      });
    }
  }, [token, user?.role]);

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
      path.startsWith("/support") ||
      path.startsWith("/superadminsupport") ||
      path === "/warehouseadmin"
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
      
      <main id="main-content" className="flex-1 w-full flex flex-col overflow-x-hidden">
        <ScrollToTop /> 
        
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Storefront & Collection Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/products" element={<Shop />} />
            <Route path="/collections" element={<Shop />} />
            <Route path="/category/:slug" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/impact/:imageId" element={<ImpactProjectDetail />} />
            <Route path="/impact/project/:projectId" element={<ImpactProjectDetail />} />
            <Route path="/community" element={<Community />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/legal/:sectionSlug" element={<Legal />} />
            
            {/* Bhumivera Brand & Partner Routes */}
            <Route path="/science" element={<BhumiveraScience />} />
            <Route path="/purchase-protection" element={<PurchaseProtection />} />
            <Route path="/returns-centre" element={<Navigate to="/verify" replace />} />
            <Route path="/returns" element={<Navigate to="/verify" replace />} />
            <Route path="/sell-on-bhumivera" element={<SellOnBhumivera />} />

            {/* Campaign Inbound Routes (Clean Redirects for Obsolete Links) */}
            <Route path="/earn-from-home" element={<Navigate to="/contact" replace />} />
            <Route path="/mpgebusiness" element={<Navigate to="/contact" replace />} />

            {/* Product verification */}
            <Route path="/verify" element={<ProductVerification />} />
            <Route path="/genuinity" element={<ProductVerification />} />
            <Route path="/ewarranty" element={<ProductVerification />} />
            <Route path="/verify-product" element={<ProductVerification />} />
            <Route path="/warranty" element={<ProductVerification />} />

            {/* Tools & Tracking */}
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
            <Route path="/compare" element={<Compare />} />

            {/* Special Pages */}
            <Route path="/flash-sales" element={<FlashSales />} />
            <Route path="/somatic-registry" element={<SomaticRegistry />} />
            <Route path="/provenance-engine" element={<ProvenanceEngine />} />
            <Route path="/provenance" element={<ProvenanceEngine />} />
            <Route path="/addresses" element={<AddressBook />} />
            <Route path="/support-center" element={<Contact />} />
            <Route path="/spin-registration" element={<Navigate to="/register" replace />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin/forgot-password" element={<WebOnlyManagement><AdminForgotPassword /></WebOnlyManagement>} />

            {/* Support Portals */}
            <Route path="/support/*" element={<WebOnlyManagement><SupportPortal /></WebOnlyManagement>} />
            <Route path="/superadminsupport" element={<WebOnlyManagement><SuperAdminSupport /></WebOnlyManagement>} />
            <Route path="/superadminsupport/*" element={<WebOnlyManagement><SuperAdminSupport /></WebOnlyManagement>} />
            <Route path="/superadmin/controlcentre/*" element={<Navigate to="/" replace />} />
            <Route path="/superadmin/controlcentre" element={<Navigate to="/" replace />} />

            {/* User & Storefront Interactive Routes (No forced /login redirect on browse!) */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Navigate to="/?openCart=1" replace />} />
            <Route path="/checkout" element={<OnlineCheckout><CheckoutPage /></OnlineCheckout>} />
            <Route path="/order-success/:orderId?" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/address-book" element={<AddressBook />} />
            <Route path="/affiliate" element={<Affiliate />} />

            {/* Warehouse System */}
            <Route path="/warehouse" element={<WebOnlyManagement><WarehouseRoute><Warehouse /></WarehouseRoute></WebOnlyManagement>} />
            <Route path="/warehouse/admin" element={<WebOnlyManagement><WarehouseRoute><WarehouseAdmin /></WarehouseRoute></WebOnlyManagement>} />
            <Route path="/warehouse/management" element={<WebOnlyManagement><WarehouseRoute><WarehouseManagement /></WarehouseRoute></WebOnlyManagement>} />
            <Route path="/warehouseadmin" element={<WebOnlyManagement><WarehouseAdminLogin /></WebOnlyManagement>} />
            
            {/* Executive Admin System */}
            <Route path="/admin/login" element={<WebOnlyManagement><AdminLogin /></WebOnlyManagement>} />
            <Route path="/admin" element={<WebOnlyManagement><AdminRoute><AdminDashboard /></AdminRoute></WebOnlyManagement>} />
            <Route path="/admin/dashboard" element={<WebOnlyManagement><AdminRoute><AdminDashboard /></AdminRoute></WebOnlyManagement>} />
            <Route path="/admin/dashboard/support" element={<Navigate to="/support" replace />} />
            <Route path="/admin/dashboard/contact" element={<Navigate to="/support" replace />} />
            <Route path="/admin/dashboard/:tab" element={<WebOnlyManagement><AdminRoute><AdminDashboard /></AdminRoute></WebOnlyManagement>} />
            <Route path="/admin/*" element={<WebOnlyManagement><AdminRoute><AdminDashboard /></AdminRoute></WebOnlyManagement>} />

            {/* Backward-compat redirects */}
            <Route path="/admin-login" element={<WebOnlyManagement><Navigate to="/admin/login" replace /></WebOnlyManagement>} />

            {/* Global Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
            <MobileBottomNav />
        </Suspense>
      </main>

      {!isManagementView && <Footer />}
      {!isManagementView && (
        <Suspense fallback={null}>
          <MiniCart />
        </Suspense>
      )}
      {!isManagementView && (
        <Suspense fallback={null}>
          <SupportAssistant />
        </Suspense>
      )}
      <Suspense fallback={null}>
        {visualGuideState.isOpen && (
          <VisualGuideModal
            isOpen={visualGuideState.isOpen}
            initialTab={visualGuideState.tab}
            onClose={() => setVisualGuideState(prev => ({ ...prev, isOpen: false }))}
          />
        )}
      </Suspense>
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
