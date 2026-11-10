import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, User, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { haptics } from '../utils/haptics';

export default function MobileBottomNav() {
  const { cartItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const location = useLocation();

  const cartCount = cartItems.reduce((acc, i) => acc + (Number(i.quantity) || 1), 0);

  // Hide on admin, warehouse, and support management routes
  if (
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/warehouse') ||
    location.pathname.startsWith('/inventorysoftware') ||
    location.pathname.startsWith('/inventorymanagement') ||
    location.pathname.startsWith('/support') ||
    location.pathname.startsWith('/superadminsupport') ||
    location.pathname === '/warehouseadmin'
  ) {
    return null;
  }

  return (
    <nav 
      className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#D4AF37]/25 bg-[#14291F]/95 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.65)]" 
      aria-label="Mobile Navigation"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)' }}
    >
      <div className="flex items-center justify-around w-full h-[58px] px-2 max-w-lg mx-auto">
        {/* 1. Home */}
        <NavLink
          to="/"
          onClick={() => haptics.impactLight()}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium tracking-tight transition-all duration-150 active:scale-90 ${
              isActive ? 'text-[#D4AF37] font-bold' : 'text-[#9BB0A5] hover:text-[#FAF7F2]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-[#D4AF37]/15' : ''}`}>
                <Home className={`h-5 w-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="mt-0.5 leading-none">Home</span>
            </>
          )}
        </NavLink>

        {/* 2. Shop */}
        <NavLink
          to="/shop"
          onClick={() => haptics.impactLight()}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium tracking-tight transition-all duration-150 active:scale-90 ${
              isActive ? 'text-[#D4AF37] font-bold' : 'text-[#9BB0A5] hover:text-[#FAF7F2]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-[#D4AF37]/15' : ''}`}>
                <Compass className={`h-5 w-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="mt-0.5 leading-none">Shop</span>
            </>
          )}
        </NavLink>

        {/* 3. Center Elevated Action: Verify & Scan */}
        <NavLink
          to="/verify"
          onClick={() => haptics.impactMedium()}
          aria-label="Scan Box QR & Verify Serial"
          className={({ isActive }) =>
            `relative -top-3 flex flex-col items-center justify-center shrink-0 transition-transform active:scale-90 focus:outline-none`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 border-[#D4AF37] bg-gradient-to-br from-[#1C382B] via-[#14291F] to-[#0A1610] shadow-[0_6px_20px_rgba(212,175,55,0.4)] ${
                isActive ? 'ring-2 ring-[#FCE096]' : ''
              }`}>
                <ShieldCheck className="h-6 w-6 text-[#FCE096]" />
              </div>
              <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-[#FCE096] leading-none">
                Verify
              </span>
            </>
          )}
        </NavLink>

        {/* 4. Bag / Cart */}
        <button
          type="button"
          onClick={() => {
            haptics.impactLight();
            setIsCartOpen(true);
          }}
          className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium tracking-tight text-[#9BB0A5] hover:text-[#FAF7F2] transition-all duration-150 active:scale-90"
          aria-label={`Open shopping cart, ${cartCount} items`}
        >
          <div className="relative p-1">
            <ShoppingBag className="h-5 w-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#D4AF37] text-[9px] font-black text-[#14291F] shadow-[0_0_8px_rgba(212,175,55,0.7)] animate-in zoom-in-75">
                {cartCount}
              </span>
            )}
          </div>
          <span className="mt-0.5 leading-none">Bag</span>
        </button>

        {/* 5. Account */}
        <NavLink
          to={user ? "/profile" : "/login"}
          onClick={() => haptics.impactLight()}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium tracking-tight transition-all duration-150 active:scale-90 ${
              isActive ? 'text-[#D4AF37] font-bold' : 'text-[#9BB0A5] hover:text-[#FAF7F2]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-[#D4AF37]/15' : ''}`}>
                <User className={`h-5 w-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="mt-0.5 leading-none">{user ? 'Account' : 'Sign In'}</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
