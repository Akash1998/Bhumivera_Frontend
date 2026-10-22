import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, User, ShoppingBag } from 'lucide-react';
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
    location.pathname.startsWith('/support') ||
    location.pathname.startsWith('/superadminsupport') ||
    location.pathname === '/warehouseadmin'
  ) {
    return null;
  }

  return (
    <nav className="mobile-bottom-nav md:hidden border-t border-[#244A38]/60 bg-[#14291F]" aria-label="Mobile Navigation">
      <NavLink
        to="/"
        onClick={() => haptics.impactLight()}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all ${
            isActive ? 'text-[#D4AF37] font-bold scale-105' : 'text-[#9BB0A5] hover:text-[#FAF7F2]'
          }`
        }
      >
        <Home className="h-5 w-5" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/shop"
        onClick={() => haptics.impactLight()}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all ${
            isActive ? 'text-[#D4AF37] font-bold scale-105' : 'text-[#9BB0A5] hover:text-[#FAF7F2]'
          }`
        }
      >
        <Compass className="h-5 w-5" />
        <span>Shop</span>
      </NavLink>

      <NavLink
        to="/lab"
        onClick={() => haptics.impactLight()}
        aria-label="Earth and stewardship"
        className="relative -mt-9 flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full border-2 border-[#D4AF37] bg-[#0f2a1d] shadow-[0_6px_18px_rgba(0,0,0,0.55)] transition-transform active:scale-95"
      >
        <svg viewBox="0 0 64 64" className="h-[52px] w-[52px]" aria-hidden="true">
          <defs>
            <radialGradient id="earthSea" cx="35%" cy="30%" r="80%">
              <stop offset="0" stopColor="#4fb6d8" />
              <stop offset="1" stopColor="#14577a" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#earthSea)" />
          <path d="M10 26c6-8 14-8 18-4s-2 8-8 9-8 6-10-5zM38 40c6-4 14-2 16 4-4 8-12 10-18 8s-2-8 2-12z" fill="#3f9b52" opacity=".9" />
          <path d="M32 54V34" stroke="#5b3a1e" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M32 40l-7-5M32 37l7-5" stroke="#5b3a1e" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="32" cy="24" r="10" fill="#2fbf5b" />
          <circle cx="24" cy="30" r="6.5" fill="#25a24c" />
          <circle cx="40" cy="30" r="6.5" fill="#25a24c" />
          <circle cx="29" cy="21" r="3" fill="#7be08f" opacity=".8" />
          <circle cx="32" cy="32" r="28" fill="none" stroke="#e6c57e" strokeWidth="1.5" />
        </svg>
      </NavLink>

      <button
        type="button"
        onClick={() => {
          haptics.impactLight();
          setIsCartOpen(true);
        }}
        className="relative flex flex-col items-center justify-center gap-1 text-[10px] font-medium text-[#9BB0A5] hover:text-[#FAF7F2] transition-colors"
        aria-label={`Open shopping cart, ${cartCount} items`}
      >
        <div className="relative">
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -right-2.5 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37] text-[9px] font-black text-[#14291F] shadow-[0_0_8px_rgba(212,175,55,0.6)]">
              {cartCount}
            </span>
          )}
        </div>
        <span>Bag</span>
      </button>

      <NavLink
        to={user ? "/profile" : "/login"}
        onClick={() => haptics.impactLight()}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all ${
            isActive ? 'text-[#D4AF37] font-bold scale-105' : 'text-[#9BB0A5] hover:text-[#FAF7F2]'
          }`
        }
      >
        <User className="h-5 w-5" />
        <span>{user ? 'Account' : 'Sign In'}</span>
      </NavLink>
    </nav>
  );
}
