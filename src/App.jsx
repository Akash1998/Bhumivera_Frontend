import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';

// Core UI Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MiniCart from './components/MiniCart';
import NotificationCenter from './components/NotificationCenter';
import QuickViewModal from './components/QuickViewModal';
import SkeletonLoader from './components/SkeletonLoader';

// Storefront & Customer Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import AddressBook from './pages/AddressBook';
import Wishlist from './pages/Wishlist';
import Compare from './pages/Compare';
import Login from './pages/Login';
import Register from './pages/Register';

// Informational & Policy Pages
import About from './pages/About';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import Returns from './pages/Returns';
import ReturnsCentre from './pages/ReturnsCentre';
import PurchaseProtection from './pages/PurchaseProtection';
import EWarranty from './pages/EWarranty';
import FitmentEngine from './pages/FitmentEngine';
import ProvenanceEngine from './pages/ProvenanceEngine';
import SomaticRegistry from './pages/SomaticRegistry';
import SpinRegistration from './pages/SpinRegistration';
import FlashSales from './pages/FlashSales';
import Affiliate from './pages/Affiliate';
import BhumiveraScience from './pages/BhumiveraScience';
import MPGEBusinessLanding from './pages/MPGEBusinessLanding';

// Warehouse Pages
import Warehouse from './pages/Warehouse';
import WarehouseManagement from './pages/WarehouseManagement';
import WarehouseAdminLogin from './pages/WarehouseAdminLogin';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SkeletonLoader count={3} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <SettingsProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <ToastProvider>
                  <div className="flex flex-col min-h-screen bg-white text-gray-900 antialiased selection:bg-emerald-500 selection:text-white">
                    <Navbar />
                    <MiniCart />
                    <NotificationCenter />
                    <QuickViewModal />

                    <main className="flex-grow">
                      <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                          {/* Storefront Routes */}
                          <Route path="/" element={<Home />} />
                          <Route path="/shop" element={<Shop />} />
                          <Route path="/product/:id" element={<ProductDetail />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/order-success" element={<OrderSuccess />} />
                          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                          <Route path="/track-order" element={<OrderTracking />} />
                          <Route path="/order-tracking" element={<OrderTracking />} />
                          <Route path="/wishlist" element={<Wishlist />} />
                          <Route path="/compare" element={<Compare />} />

                          {/* Customer Account & Authentication */}
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/account" element={<Profile />} />
                          <Route path="/addresses" element={<AddressBook />} />
                          <Route path="/address-book" element={<AddressBook />} />

                          {/* Brand, Engine & Legal Pages */}
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/legal" element={<Legal />} />
                          <Route path="/terms" element={<Legal />} />
                          <Route path="/privacy" element={<Legal />} />
                          <Route path="/returns" element={<Returns />} />
                          <Route path="/returns-centre" element={<ReturnsCentre />} />
                          <Route path="/purchase-protection" element={<PurchaseProtection />} />
                          <Route path="/warranty" element={<EWarranty />} />
                          <Route path="/e-warranty" element={<EWarranty />} />
                          <Route path="/fitment" element={<FitmentEngine />} />
                          <Route path="/fitment-engine" element={<FitmentEngine />} />
                          <Route path="/provenance" element={<ProvenanceEngine />} />
                          <Route path="/somatic-registry" element={<SomaticRegistry />} />
                          <Route path="/spin" element={<SpinRegistration />} />
                          <Route path="/spin-registration" element={<SpinRegistration />} />
                          <Route path="/flash-sales" element={<FlashSales />} />
                          <Route path="/affiliate" element={<Affiliate />} />
                          <Route path="/science" element={<BhumiveraScience />} />
                          <Route path="/bhumivera-science" element={<BhumiveraScience />} />
                          <Route path="/business" element={<MPGEBusinessLanding />} />
                          <Route path="/mpge-business" element={<MPGEBusinessLanding />} />

                          {/* Warehouse Operations */}
                          <Route path="/warehouse" element={<Warehouse />} />
                          <Route path="/warehouse/management" element={<WarehouseManagement />} />
                          <Route path="/warehouse-management" element={<WarehouseManagement />} />
                          <Route path="/warehouse/login" element={<WarehouseAdminLogin />} />
                          <Route path="/warehouse-login" element={<WarehouseAdminLogin />} />

                          {/* Dedicated Admin Portal Routes */}
                          <Route path="/admin/login" element={<AdminLogin />} />
                          <Route path="/admin-login" element={<AdminLogin />} />
                          <Route path="/admin" element={<AdminDashboard />} />
                          <Route path="/admin/dashboard" element={<AdminDashboard />} />
                          <Route path="/admin/*" element={<AdminDashboard />} />

                          {/* Fallback Redirection */}
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </Suspense>
                    </main>

                    <Footer />
                  </div>
                </ToastProvider>
              </CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </SettingsProvider>
    </Router>
  );
}
