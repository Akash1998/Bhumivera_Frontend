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
        <svg viewBox="0 0 64 64" className="h-[56px] w-[56px]" aria-hidden="true">
          <defs>
            <radialGradient id="gSea" cx="34%" cy="28%" r="85%">
              <stop offset="0" stopColor="#2f6b52" />
              <stop offset=".55" stopColor="#123a2b" />
              <stop offset="1" stopColor="#06150e" />
            </radialGradient>
            <linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff2c2" />
              <stop offset=".45" stopColor="#d4af37" />
              <stop offset="1" stopColor="#8a6a14" />
            </linearGradient>
            <linearGradient id="gSilver" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset=".5" stopColor="#c9d1d6" />
              <stop offset="1" stopColor="#7d8890" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="29" fill="url(#gSea)" stroke="url(#gGold)" strokeWidth="2" />
          <ellipse cx="32" cy="32" rx="12" ry="27" fill="none" stroke="url(#gSilver)" strokeWidth=".7" opacity=".55" />
          <ellipse cx="32" cy="32" rx="27" ry="10" fill="none" stroke="url(#gSilver)" strokeWidth=".7" opacity=".45" />
          <path d="M32 5v54M5 32h54" stroke="url(#gSilver)" strokeWidth=".5" opacity=".35" />
          <path d="M32 52V33" stroke="url(#gGold)" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 44l-8-6M32 40l8-7M32 36l-5-5" stroke="url(#gGold)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <g fill="url(#gSilver)">
            <circle cx="32" cy="22" r="9" />
            <circle cx="23.5" cy="28" r="6" />
            <circle cx="40.5" cy="28" r="6" />
          </g>
          <g fill="url(#gGold)" opacity=".9">
            <circle cx="29" cy="20" r="1.6" />
            <circle cx="35" cy="24" r="1.4" />
            <circle cx="24" cy="29" r="1.3" />
            <circle cx="40" cy="29" r="1.3" />
            <circle cx="32" cy="15" r="1.2" />
          </g>
          <path d="M9 24a26 26 0 0 1 14-15" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".35" />
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
