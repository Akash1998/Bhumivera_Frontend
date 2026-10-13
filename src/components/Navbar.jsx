import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, User, Search, Menu, X, Sparkles, Heart,
  ChevronDown, Package, Gift, GitCompareArrows,
  MapPin, Activity, Droplets, Leaf
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { search } from '../services/api';

export default function Navbar() {
  const { user } = useAuth();
  const { cartItems, setIsCartOpen } = useCart();
  const cartCount = cartItems.reduce((count, item) => count + (Number(item.quantity) || 1), 0);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isAiPowered, setIsAiPowered] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchTimeout = useRef(null);
  const [isGarageActive, setGarageActive] = useState(false);
  const [garageData, setGarageData] = useState(null);
  const navigate = useNavigate(); 
  const location = useLocation();
  const searchDropdownRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = event => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const checkGarage = () => {
      const stored = localStorage.getItem('Bhumivera_garage');
      if (stored) {
        setGarageData(JSON.parse(stored));
        setGarageActive(true);
      }
    };
    checkGarage();
    window.addEventListener('storage', checkGarage);
    return () => window.removeEventListener('storage', checkGarage);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchDropdown(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (query.length > 2) {
      setIsSearching(true);
      searchTimeout.current = setTimeout(async () => {
        try {
          const res = await search.query(query, 5); 
          if (res.data?.success || res.data) {
            setSuggestions(res.data?.data || res.data);
            setIsAiPowered(res.data?.isAiPowered || true); 
          }
        } catch (error) {
          console.error("AI Search Failure:", error);
          setSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      }, 400); 
    } else {
      setSuggestions([]);
      setIsAiPowered(false);
    }
  };

  const executeFullSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      setMenuOpen(false);
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <div className="bg-[#14251c] text-[#e8dcc4] py-2 px-6 text-[10px] font-bold uppercase tracking-widest hidden md:block border-b border-[#c4aa67]/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/impact" className="flex items-center gap-2 transition-colors hover:text-white"><Droplets size={14} className="text-[#c8d6aa]" /> Our impact</Link>
            <Link to="/order-tracking" className="flex items-center gap-2 transition-colors hover:text-white"><MapPin size={14} className="text-[#8b5a2b]" /> Track Order</Link>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-[#8b5a2b] transition-colors">Boutique Support</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-[#8b5a2b] flex items-center gap-1.5"><Activity size={14}/> Admin Terminal</Link>
            )}
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-[100] border-b border-[#dedfd4] bg-[#fbfaf5]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:px-6 sm:py-4 lg:gap-8">
          
          <button 
            onClick={() => setMenuOpen(!isMenuOpen)} 
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#14251c] transition-colors hover:bg-[#14251c]/5 hover:text-[#526b4d] md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" className="flex items-center space-x-3 group shrink-0" aria-label="Bhumivera Home">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#14251c] font-serif text-xl text-[#e0d4a6] shadow-sm transition-transform group-hover:scale-105">B</div>
            <span className="hidden font-serif text-2xl uppercase tracking-[0.16em] text-[#14251c] sm:block">Bhumivera</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-2xl relative" ref={searchDropdownRef}>
            <form onSubmit={executeFullSearch} className="w-full relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#526b4d]/60 transition-colors group-focus-within:text-[#526b4d]">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => { if(searchQuery.length > 2) setShowSearchDropdown(true); }}
                placeholder="Search skincare, hair care, ingredients..."
                aria-label="Search skincare products"
                className="w-full rounded-full border border-[#dedfd4] bg-white py-3.5 pl-12 pr-6 text-sm text-[#14251c] shadow-sm outline-none transition-all placeholder:text-[#526b4d]/60 focus:border-[#526b4d]"
              />
              <button type="submit" aria-label="Search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#14251c] px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-white opacity-0 transition-colors group-focus-within:opacity-100 hover:bg-[#354c3b]">
                Discover
              </button>
            </form>

            {showSearchDropdown && (searchQuery.length > 2) && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl border border-[#e8dcc4] shadow-2xl overflow-hidden z-50">
                 <div className="flex items-center justify-between border-b border-[#dedfd4] bg-[#f4f1e9] px-5 py-3">
                   <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#526b4d]">
                     <Sparkles size={14} className="mr-2 animate-pulse" />
                     {isAiPowered ? 'Semantic Formulation Results' : 'Standard Search'}
                   </div>
                   {isSearching && <div className="w-4 h-4 border-2 border-[#e8dcc4] border-t-[#8b5a2b] rounded-full animate-spin"></div>}
                 </div>
                 <div className="max-h-[60vh] overflow-y-auto">
                   {suggestions.length === 0 && !isSearching ? (
                     <div className="p-8 text-center font-serif text-sm uppercase tracking-widest text-[#526b4d]/70">No botanical matches found.</div>
                   ) : (
                     suggestions.map(s => (
                       <Link key={s.id || s._id} to={`/product/${s.slug || s.id || s._id}`} onClick={() => setShowSearchDropdown(false)} className="group flex items-center border-b border-[#dedfd4]/70 p-4 transition-colors hover:bg-[#f4f1e9] last:border-none">
                          <img src={s.images?.[0] || s.image_url || '/logo.webp'} className="mr-4 h-12 w-12 rounded-full border border-[#dedfd4] bg-white object-cover p-1" alt={s.name} />
                          <div className="flex-1">
                             <div className="truncate text-sm font-bold uppercase text-[#14251c] group-hover:text-[#526b4d]">{s.name}</div>
                             <div className="mt-1 font-serif text-xs text-[#526b4d]">₹{s.discount_price || s.price}</div>
                          </div>
                          <ChevronDown size={16} className="-rotate-90 text-[#526b4d]/50" />
                       </Link>
                     ))
                   )}
                 </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6 shrink-0">
            <Link to="/science" aria-label="Skin Assessment" className={`hidden xl:flex items-center space-x-3 rounded-full border px-5 py-2.5 shadow-sm transition-all ${isGarageActive ? 'border-[#14251c] bg-[#14251c] text-white' : 'border-[#dedfd4] bg-white text-[#526b4d]'}`}>
              <Sparkles size={18} className={isGarageActive ? 'animate-pulse' : ''} />
              <div className="text-left">
                <div className="text-[8px] font-bold uppercase tracking-widest leading-none opacity-80">{isGarageActive ? 'Active Regimen' : 'Botanical Science'}</div>
                <div className="text-[11px] font-bold uppercase tracking-widest truncate max-w-[100px]">{isGarageActive ? garageData.model : 'Discover the Science'}</div>
              </div>
            </Link>

            {user ? (
              <Link to="/profile" aria-label="Profile" className="flex items-center gap-3 group">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#dedfd4] bg-white shadow-sm group-hover:border-[#526b4d]">
                   <User size={18} className="text-[#526b4d]" />
                   <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#526b4d]"></span>
                </div>
              </Link>
            ) : (
              <Link to="/login" className="hidden rounded-full bg-[#14251c] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-[#354c3b] sm:flex">Sign In</Link>
            )}

            <button type="button" onClick={() => setIsCartOpen(true)} aria-label={`Open cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`} className="group relative rounded-full border border-[#dedfd4] bg-white p-2.5 text-[#526b4d] shadow-sm transition-all hover:border-[#526b4d]">
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#14251c] text-[10px] font-bold text-white shadow-sm">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </nav>
      <div className="fixed inset-x-0 bottom-0 top-[68px] z-[110] md:hidden" id="mobile-navigation" hidden={!isMenuOpen}>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-[#14251c]/35 backdrop-blur-[2px]"
          />
          <div className="relative max-h-full overflow-y-auto border-b border-[#dedfd4] bg-[#fbfaf5] px-5 pb-8 pt-5 shadow-xl">
            <form onSubmit={executeFullSearch} role="search" className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#526b4d]" />
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search products and ingredients"
                aria-label="Search products and ingredients"
                className="min-h-12 w-full rounded-full border border-[#dedfd4] bg-white py-3 pl-11 pr-4 text-sm text-[#14251c] outline-none placeholder:text-[#526b4d]/60 focus:border-[#526b4d]"
              />
            </form>
            <p className="mb-3 mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#74806e]">Explore Bhumivera</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { to: '/shop', label: 'Shop all', icon: Package },
                { to: '/shop?category=Skincare', label: 'Skin care', icon: Droplets },
                { to: '/shop?category=Hair%20Care', label: 'Hair care', icon: Sparkles },
                { to: '/flash-sales', label: 'Offers', icon: Gift },
                { to: '/science', label: 'Our science', icon: Sparkles },
                { to: '/about', label: 'Our story', icon: Leaf },
                { to: '/impact', label: 'Our impact', icon: Droplets },
                { to: '/contact', label: 'Help & support', icon: MapPin },
              ].map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center gap-3 rounded-xl border border-[#dedfd4] bg-white px-3 py-3 text-sm font-semibold text-[#14251c] transition-colors hover:border-[#526b4d]/50 hover:bg-[#f4f1e9]">
                  {React.createElement(Icon, { size: 17, className: 'shrink-0 text-[#526b4d]' })}
                  {label}
                </Link>
              ))}
            </div>
            <p className="mb-3 mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-[#74806e]">Your account</p>
            <div className="divide-y divide-[#dedfd4] border-y border-[#dedfd4]">
              {[
                ...(user ? [{ to: '/profile', label: 'My account', icon: User }] : [
                  { to: '/login', label: 'Sign in', icon: User },
                  { to: '/register', label: 'Create an account', icon: Gift },
                ]),
                { to: '/order-tracking', label: 'Track an order', icon: MapPin },
                { to: '/wishlist', label: 'Wishlist', icon: Heart },
                { to: '/compare', label: 'Compare products', icon: GitCompareArrows },
                { to: '/returns-centre', label: 'Returns & exchanges', icon: Package },
              ].map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center gap-3 py-3 text-sm font-medium text-[#26382c] transition-colors hover:text-[#526b4d]">
                  {React.createElement(Icon, { size: 17, className: 'text-[#526b4d]' })}
                  {label}
                  <ChevronDown size={15} className="-rotate-90 ml-auto text-[#82907c]" />
                </Link>
              ))}
            </div>
          </div>
      </div>
    </>
  );
}
