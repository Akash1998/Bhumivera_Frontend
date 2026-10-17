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
    location.pathname.startsWith('/support') ||
    location.pathname.startsWith('/superadminsupport') ||
    location.pathname === '/warehouseadmin' ||
    location.pathname === '/earn-from-home' ||
    location.pathname === '/mpgebusiness'
  ) {
    return null;
  }

  return (
    <nav className="mobile-bottom-nav md:hidden" aria-label="Mobile Navigation">
      <NavLink
        to="/"
        onClick={() => haptics.impactLight()}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all ${
            isActive ? 'text-[#d4af37] font-bold scale-105' : 'text-[#94a3b8] hover:text-[#e2e8f0]'
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
            isActive ? 'text-[#d4af37] font-bold scale-105' : 'text-[#94a3b8] hover:text-[#e2e8f0]'
          }`
        }
      >
        <Compass className="h-5 w-5" />
        <span>Shop</span>
      </NavLink>

      <NavLink
        to="/verify"
        onClick={() => haptics.impactLight()}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all ${
            isActive ? 'text-[#d4af37] font-bold scale-105' : 'text-[#94a3b8] hover:text-[#e2e8f0]'
          }`
        }
      >
        <ShieldCheck className="h-5 w-5" />
        <span>Verify</span>
      </NavLink>

      <button
        onClick={() => {
          haptics.impactLight();
          setIsCartOpen(true);
        }}
        className="relative flex flex-col items-center justify-center gap-1 text-[10px] font-medium text-[#94a3b8] hover:text-[#e2e8f0] transition-colors"
        aria-label={`Open shopping cart, ${cartCount} items`}
      >
        <div className="relative">
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -right-2.5 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#d4af37] text-[9px] font-black text-[#0c1712] shadow-[0_0_8px_rgba(212,175,55,0.6)]">
              {cartCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>

      <NavLink
        to={user ? "/profile" : "/login"}
        onClick={() => haptics.impactLight()}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all ${
            isActive ? 'text-[#d4af37] font-bold scale-105' : 'text-[#94a3b8] hover:text-[#e2e8f0]'
          }`
        }
      >
        <User className="h-5 w-5" />
        <span>{user ? 'Account' : 'Sign In'}</span>
      </NavLink>
    </nav>
  );
}
