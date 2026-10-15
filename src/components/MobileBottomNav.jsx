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

    </>
  );
}
