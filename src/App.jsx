import React, { lazy, Suspense, useMemo, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { CompareProvider } from "./context/CompareContext.jsx";
import "./index.css";

const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        window.location.reload();
        // Return a dummy component while the browser reloads
        return { default: () => <PageLoader /> };
      }
      throw error;
    }
  });

// Existing Pages using lazyWithRetry
const MPGEBusinessLanding = lazyWithRetry(() => import("./pages/MPGEBusinessLanding.jsx"));
const Home = lazyWithRetry(() => import("./pages/Home.jsx"));
const Warehouse = lazyWithRetry(() => import("./pages/Warehouse.jsx"));
const WarehouseAdmin = lazyWithRetry(() => import("./pages/admin/WarehouseAdmin.jsx"));
const WarehouseManagement = lazyWithRetry(() => import("./pages/admin/WarehouseManagement.jsx"));
const WarehouseAdminLogin = lazyWithRetry(() => import("./pages/WarehouseAdminLogin.jsx"));
const Shop = lazyWithRetry(() => import("./pages/Shop.jsx"));
const ProductDetail = lazyWithRetry(() => import("./pages/ProductDetail.jsx"));
const Genuine_test = lazyWithRetry(() => import("./pages/EWarranty.jsx")); 
const Contact = lazyWithRetry(() => import("./pages/Contact.jsx"));
const Cart = lazyWithRetry(() => import("./pages/Cart.jsx"));
const Checkout = lazyWithRetry(() => import("./pages/Checkout.jsx"));
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
const Affiliate = lazyWithRetry(() => import("./pages/Affiliate.jsx"));
const About = lazyWithRetry(() => import("./pages/About.jsx"));
const Legal = lazyWithRetry(() => import("./pages/Legal.jsx"));
const FitmentEngine = lazyWithRetry(() => import("./pages/FitmentEngine.jsx")); 

// NEW: Bhumivera Specific Pages using lazyWithRetry
const BhumiveraScience = lazyWithRetry(() => import("./pages/BhumiveraScience.jsx"));
const PurchaseProtection = lazyWithRetry(() => import("./pages/PurchaseProtection.jsx"));
const ReturnsCentre = lazyWithRetry(() => import("./pages/ReturnsCentre.jsx"));

const PageLoader = () => (
  <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#0B2419] rounded-full animate-spin"></div>
  </div>
);

// --- Scroll Auto-Reset Utility ---
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly snaps to the top when navigating to a new page
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// --- Auth Route Wrappers ---

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth() || {};
  const t = localStorage.getItem('token');
  
  if (loading) return <PageLoader />;
  if (!user && !t) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth() || {};
  const t = localStorage.getItem('token');
  
  // Memoize admin check for performance
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

// --- Layout Engine ---

function AppContent() {
  const location = useLocation();
  
  // Determine if we are in a dashboard/admin environment
  const isManagementView = useMemo(() => {
    const path = location.pathname;
    return path.startsWith("/admin") || path.startsWith("/warehouse") || path === "/warehouseadmin";
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hide standard UI components on Admin/Warehouse routes */}
      {!isManagementView && <Navbar />}
      
      <main id="main-content" className="flex-1 w-full flex flex-col">
        {/* Forces window to top on every route change */}
        <ScrollToTop /> 
        
        <Suspense fallback={<PageLoader />}>
          <Routes>

            <Route path="/mpgebusiness" element={<MPGEBusinessLanding />} />
            <Route path="/earn-from-home" element={<MPGEBusinessLanding />} />
            
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/legal" element={<Legal />} />
            
            {/* Bhumivera Brand Routes */}
            <Route path="/science" element={<BhumiveraScience />} />
            <Route path="/purchase-protection" element={<PurchaseProtection />} />
            <Route path="/returns-centre" element={<ReturnsCentre />} />

            {/* Tools & Tracking */}
            <Route path="/fitment-engine" element={<FitmentEngine />} />
            <Route path="/Genuine_test" element={<Genuine_test />} />
            <Route path="/warranty" element={<Genuine_test />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/compare" element={<Compare />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected User Routes */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
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

            {/* Global Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {!isManagementView && <Footer />}
    </div>
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
