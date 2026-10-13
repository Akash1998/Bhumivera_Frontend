import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Sparkles, Heart, User, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import VisualSearchModal from './VisualSearchModal';
import { haptics } from '../utils/haptics';

export default function MobileBottomNav() {
  const { cartItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const [visualModalOpen, setVisualModalOpen] = useState(false);
  const location = useLocation();

  const cartCount = cartItems.reduce((acc, i) => acc + (Number(i.quantity) || 1), 0);

  useEffect(() => {
    const closeVisualSearch = event => {
      if (!visualModalOpen || event.detail.handled) return;
      event.detail.handled = true;
      setVisualModalOpen(false);
    };
    window.addEventListener('bhumivera:native-back', closeVisualSearch);
    return () => window.removeEventListener('bhumivera:native-back', closeVisualSearch);
  }, [visualModalOpen]);

  // Hide on admin and warehouse routes
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/warehouse')) {
    return null;
  }

  return (
    <>
      <nav className="mobile-bottom-nav md:hidden">
        <NavLink
          to="/"
          onClick={() => haptics.impactLight()}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition ${
              isActive ? 'text-[#0b2419]' : 'text-stone-500 hover:text-stone-800'
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
            `flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition ${
              isActive ? 'text-[#0b2419]' : 'text-stone-500 hover:text-stone-800'
            }`
          }
        >
          <Compass className="h-5 w-5" />
          <span>Shop</span>
        </NavLink>

        <button
          onClick={() => {
            haptics.impactMedium();
            setVisualModalOpen(true);
          }}
          className="flex -translate-y-2 flex-col items-center justify-center gap-1 text-[10px] font-medium text-emerald-800"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0b2419] text-white shadow-lg">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-semibold text-[#0b2419]">AI Lens</span>
        </button>

        <button
          onClick={() => {
            haptics.impactLight();
            setIsCartOpen(true);
          }}
          className="relative flex flex-col items-center justify-center gap-1 text-[10px] font-medium text-stone-500"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#8b5a2b] text-[9px] font-bold text-white">
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
            `flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition ${
              isActive ? 'text-[#0b2419]' : 'text-stone-500 hover:text-stone-800'
            }`
          }
        >
          <User className="h-5 w-5" />
          <span>{user ? 'Account' : 'Sign In'}</span>
        </NavLink>
      </nav>

      <VisualSearchModal isOpen={visualModalOpen} onClose={() => setVisualModalOpen(false)} />
    </>
  );
}
