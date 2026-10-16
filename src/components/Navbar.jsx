import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion as Motion } from 'framer-motion';
import { 
  ShoppingCart, User, Search, Menu, X, Sparkles, Heart,
  ChevronDown, Package, Gift, GitCompareArrows, ArrowRight,
  MapPin, Activity, Droplets, Leaf, Mic, FlaskConical, Compass, Download,
  HeartHandshake, Truck, CircleUserRound, BadgePercent
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { search } from '../services/api';
import { useVoiceSearch } from '../hooks/useVoiceSearch';
import { getProductImageUrl } from '../utils/productImageUrl';

export default function Navbar() {
  const { user } = useAuth();
  const { cartItems, setIsCartOpen } = useCart();
  const cartCount = cartItems.reduce((count, item) => count + (Number(item.quantity) || 1), 0);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isListening, startListening } = useVoiceSearch((text) => {
    setSearchQuery(text);
    navigate(`/shop?q=${encodeURIComponent(text)}`);
  });
  const [suggestions, setSuggestions] = useState([]);
  const [isAiPowered, setIsAiPowered] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showIosInstallHelp, setShowIosInstallHelp] = useState(false);
  const searchTimeout = useRef(null);
  const [isGarageActive, setGarageActive] = useState(false);
  const [garageData, setGarageData] = useState(null);
  const navigate = useNavigate(); 
  const location = useLocation();
  const searchDropdownRef = useRef(null);
  const isIosDevice = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  useEffect(() => {
    const handleInstallAvailable = event => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const handleInstalled = () => {
      setInstallPrompt(null);
      setShowIosInstallHelp(false);
    };
    window.addEventListener('beforeinstallprompt', handleInstallAvailable);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallAvailable);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!installPrompt) {
      setShowIosInstallHelp(value => !value);
      return;
    }
    try {
      await installPrompt.prompt();
      await installPrompt.userChoice;
    } catch (error) {
      console.error('[PWA_INSTALL_PROMPT_ERROR]', error);
    } finally {
      setInstallPrompt(null);
    }
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    const closeOnEscape = event => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
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
            <img
              src="/logo.webp"
              alt=""
              width="44"
              height="44"
              fetchPriority="high"
              decoding="async"
              className="h-11 w-11 object-contain transition-transform group-hover:scale-105"
            />
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
                className="w-full rounded-full border border-[#dedfd4] bg-white py-3.5 pl-12 pr-28 text-sm text-[#14251c] shadow-sm outline-none transition-all placeholder:text-[#526b4d]/60 focus:border-[#526b4d]"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[#526b4d]">
                <button
                  type="button"
                  onClick={startListening}
                  title="Voice Search"
                  aria-label="Voice Search"
                  className={`p-1 rounded-full hover:bg-stone-100 transition ${isListening ? 'text-red-500 animate-pulse' : 'text-[#526b4d]'}`}
                >
                  <Mic size={16} />
                </button>
              </div>
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
                          <img src={getProductImageUrl(s.image_url || s.images || s.image) || '/logo.webp'} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="mr-4 h-12 w-12 rounded-full border border-[#dedfd4] bg-white object-cover p-1" alt={s.name} />
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
      <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {isMenuOpen && <Motion.div
          id="mobile-navigation"
          key="mobile-navigation"
          className="mobile-menu-overlay fixed inset-x-0 bottom-0 top-[68px] z-[110] md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Motion.button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-[#14251c]/45 backdrop-blur-[3px]"
          />
          <Motion.div
            initial={{ opacity: 0, y: -22, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
            className="mobile-menu-panel relative max-h-full overflow-y-auto border-b border-[#dedfd4] bg-[#f4f1e9] px-5 pb-8 pt-5 shadow-2xl"
          >
            <div className="mobile-menu-intro mb-5 flex items-center justify-between overflow-hidden rounded-2xl border border-[#dce1d5] px-4 py-3.5">
              <div className="relative z-10">
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#526b4d]">A more thoughtful ritual</p>
                <p className="mt-1 font-serif text-lg text-[#14251c]">Find your kind of care.</p>
              </div>
              <Motion.span
                aria-hidden="true"
                animate={{ y: [0, -4, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#dce1d5] bg-[#fbfaf5] text-[#526b4d] shadow-sm"
              >
                <Leaf size={20} strokeWidth={1.6}/>
                <Sparkles size={11} className="absolute -right-0.5 -top-0.5 text-[#b39a58]"/>
              </Motion.span>
              <span className="mobile-menu-glow" aria-hidden="true"/>
            </div>
            <form onSubmit={executeFullSearch} role="search" className="mobile-menu-search relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#526b4d]" />
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search products and ingredients"
                aria-label="Search products and ingredients"
                className="min-h-12 w-full rounded-full border border-[#dedfd4] bg-[#fbfaf5] py-3 pl-11 pr-4 text-sm text-[#14251c] outline-none placeholder:text-[#82907c] transition focus:border-[#526b4d] focus:ring-4 focus:ring-[#526b4d]/10"
              />
            </form>
            <div className="mb-3 mt-6 flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#74806e]">Explore Bhumivera</p>
              <span className="text-[9px] font-medium text-[#82907c]">Thoughtfully made, every day</span>
            </div>
            <Motion.div
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } } }}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-2.5"
            >
              {[
                { to: '/shop', label: 'Shop all', detail: 'All products', icon: Compass, tone: 'forest' },
                { to: '/flash-sales', label: 'Offers', detail: 'Fresh offers', icon: BadgePercent, tone: 'gold' },
                { to: '/science', label: 'Our science', detail: 'Plant science', icon: FlaskConical, tone: 'leaf' },
                { to: '/about', label: 'Our story', detail: 'Our roots', icon: Leaf, tone: 'paper' },
                { to: '/impact', label: 'Our impact', detail: 'Giving back', icon: HeartHandshake, tone: 'paper' },
                { to: '/contact', label: 'Help & support', detail: 'We’re here', icon: MapPin, tone: 'paper' },
              ].map(({ to, label, detail, icon: Icon, tone }) => (
                <Motion.div
                  key={to}
                  variants={{ hidden: { opacity: 0, y: 12, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1 } }}
                  transition={{ type: 'spring', stiffness: 340, damping: 25 }}
                >
                  <Link to={to} onClick={() => setMenuOpen(false)} className={`mobile-menu-tile mobile-menu-tile-${tone} group flex min-h-[86px] items-center gap-2.5 rounded-2xl border px-3 py-3 transition`}>
                    <span className="mobile-menu-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">{React.createElement(Icon, { size: 18, strokeWidth: 1.7 })}</span>
                    <span className="min-w-0 flex-1"><span className="block text-[12px] font-semibold">{label}</span><span className="mt-0.5 block truncate text-[8px] opacity-65">{detail}</span></span>
                    <ArrowRight size={12} className="mobile-menu-arrow shrink-0 opacity-45 transition duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"/>
                  </Link>
                </Motion.div>
              ))}
            </Motion.div>
            <div className="mb-3 mt-7 flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#74806e]">Your account</p>
              <span className="text-[9px] font-medium text-[#82907c]">Orders, saved care &amp; more</span>
            </div>
            <Motion.div
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.045, delayChildren: 0.12 } } }}
              initial="hidden"
              animate="visible"
              className="mobile-menu-account overflow-hidden rounded-2xl border border-[#dedfd4] bg-[#fbfaf5]"
            >
              {[
                ...(user ? [{ to: '/profile', label: 'My account', icon: CircleUserRound }] : [
                  { to: '/login', label: 'Sign in', icon: User },
                  { to: '/register', label: 'Create an account', icon: Gift },
                ]),
                { to: '/order-tracking', label: 'Track an order', icon: Truck },
                { to: '/wishlist', label: 'Wishlist', icon: Heart },
                { to: '/compare', label: 'Compare products', icon: GitCompareArrows },
                { to: '/returns-centre', label: 'Returns & exchanges', icon: Package },
              ].map(({ to, label, icon: Icon }) => (
                <Motion.div
                  key={to}
                  variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <Link to={to} onClick={() => setMenuOpen(false)} className="mobile-menu-account-link group flex min-h-[54px] items-center gap-3 px-3.5 py-2.5 text-[13px] font-medium text-[#26382c] transition">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0f2e9] text-[#526b4d] transition group-hover:bg-[#14251c] group-hover:text-[#f4f1e9]">{React.createElement(Icon, { size: 16, strokeWidth: 1.7 })}</span>
                    <span className="flex-1">{label}</span>
                    <ChevronDown size={15} className="-rotate-90 text-[#82907c] transition group-hover:translate-x-0.5 group-hover:text-[#14251c]" />
                  </Link>
                </Motion.div>
              ))}
            </Motion.div>
            {!isStandalone && (installPrompt || isIosDevice) && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleInstallApp}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#526b4d]/30 bg-[#eaf0e4] px-4 py-3 text-sm font-semibold text-[#14251c] transition-colors hover:bg-[#dfe8d8]"
                >
                  <Download size={17} />
                  {isIosDevice ? 'Add Bhumivera to Home Screen' : 'Install Bhumivera'}
                </button>
                {showIosInstallHelp && isIosDevice && (
                  <p className="mt-2 rounded-xl bg-white/70 px-4 py-3 text-xs leading-5 text-[#526b4d]" role="status">
                    In Safari, tap Share, choose “Add to Home Screen”, then tap “Add”.
                  </p>
                )}
              </div>
            )}
            <p className="mt-4 text-center text-[9px] font-medium tracking-wide text-[#82907c]">Made with care · rooted in nature</p>
          </Motion.div>
        </Motion.div>}
      </AnimatePresence>
      </MotionConfig>
    </>
  );
}
