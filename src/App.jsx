import React, { lazy, Suspense, useMemo } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { CompareProvider } from "./context/CompareContext.jsx";
import "./index.css";

// Existing Pages
const Home = lazy(() => import("./pages/Home.jsx"));
const Warehouse = lazy(() => import("./pages/Warehouse.jsx"));
const WarehouseAdmin = lazy(() => import("./pages/admin/WarehouseAdmin.jsx"));
const WarehouseManagement = lazy(() => import("./pages/admin/WarehouseManagement.jsx"));
const WarehouseAdminLogin = lazy(() => import("./pages/WarehouseAdminLogin.jsx"));
const Shop = lazy(() => import("./pages/Shop.jsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.jsx"));
const Genuine_test = lazy(() => import("./pages/EWarranty.jsx")); 
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.jsx"));
const OrderTracking = lazy(() => import("./pages/OrderTracking.jsx"));
const Compare = lazy(() => import("./pages/Compare.jsx"));
const AddressBook = lazy(() => import("./pages/AddressBook.jsx"));
const Returns = lazy(() => import("./pages/Returns.jsx"));
const Affiliate = lazy(() => import("./pages/Affiliate.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Legal = lazy(() => import("./pages/Legal.jsx"));
const FitmentEngine = lazy(() => import("./pages/FitmentEngine.jsx")); 

// NEW: Bhumivera Specific Pages
const BhumiveraScience = lazy(() => import("./pages/BhumiveraScience.jsx"));
const PurchaseProtection = lazy(() => import("./pages/PurchaseProtection.jsx"));
const ReturnsCentre = lazy(() => import("./pages/ReturnsCentre.jsx"));

const PageLoader = () => (
  <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#0B2419] rounded-full animate-spin"></div>
  </div>
);

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
        <Suspense fallback={<PageLoader />}>
          <Routes>
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
