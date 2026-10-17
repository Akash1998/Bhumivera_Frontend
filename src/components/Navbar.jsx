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
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Navbar() {
  const { user } = useAuth();
  const { t, currentLang } = useLanguage();
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
            <Link to="/impact" className="flex items-center gap-2 transition-colors hover:text-white"><Droplets size={14} className="text-[#c8d6aa]" /> {t('nav_impact', 'Our impact')}</Link>
            <Link to="/order-tracking" className="flex items-center gap-2 transition-colors hover:text-white"><MapPin size={14} className="text-[#d4af37]" /> {t('nav_track_order', 'Track Order')}</Link>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-[#d4af37] transition-colors">{t('nav_support', 'Boutique Support')}</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-[#d4af37] flex items-center gap-1.5"><Activity size={14}/> Admin Terminal</Link>
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
                placeholder={t('search_placeholder', 'Search skincare, hair care, ingredients...')}
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
                {t('search_action', 'Discover')}
              </button>
            </form>

            {showSearchDropdown && (searchQuery.length > 2) && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl border border-[#e8dcc4] shadow-2xl overflow-hidden z-50">
                 <div className="flex items-center justify-between border-b border-[#dedfd4] bg-[#f4f1e9] px-5 py-3">
                   <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#526b4d]">
                     <Sparkles size={14} className="mr-2 animate-pulse" />
                     {isAiPowered ? 'Semantic Formulation Results' : 'Standard Search'}
                   </div>
                   {isSearching && <div className="w-4 h-4 border-2 border-[#e8dcc4] border-t-[#d4af37] rounded-full animate-spin"></div>}
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
            <Link to="/science" aria-label="Botanical Science" className="hidden xl:flex items-center space-x-3 rounded-full border border-[#dedfd4] bg-white px-5 py-2.5 shadow-sm transition-all hover:border-[#d4af37] hover:bg-[#0c1712] hover:text-[#d4af37] group">
              <Sparkles size={16} className="text-[#d4af37]" />
              <div className="text-left">
                <div className="text-[8px] font-bold uppercase tracking-widest leading-none text-[#526b4d] group-hover:text-[#d4af37]">{t('nav_science', 'Botanical Science')}</div>
                <div className="text-[11px] font-serif font-bold uppercase tracking-widest text-[#14251c] group-hover:text-white truncate max-w-[120px]">{t('discover_science', 'pH 5.5 Assays')}</div>
              </div>
            </Link>

            <LanguageSelector className="hidden sm:inline-flex" />

            {user ? (
              <Link to="/profile" aria-label="Profile" className="flex items-center gap-3 group">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#dedfd4] bg-white shadow-sm group-hover:border-[#526b4d]">
                   <User size={18} className="text-[#526b4d]" />
                   <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#526b4d]"></span>
                </div>
              </Link>
            ) : (
              <Link to="/login" className="hidden rounded-full bg-[#14251c] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-[#354c3b] sm:flex">{t('nav_signin', 'Sign In')}</Link>
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
      {/* REAL LUXURY MOBILE SIDEBAR DRAWER (SLIDES IN FROM LEFT) */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[250] md:hidden">
            {/* Backdrop Overlay */}
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-out Sidebar Panel */}
            <Motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="relative z-10 flex h-full w-[85vw] max-w-[340px] flex-col overflow-hidden border-r border-[#d4af37]/30 bg-[#0c1712] text-white shadow-[10px_0_40px_rgba(0,0,0,0.8)]"
            >
              {/* 1. Sidebar Header */}
              <div className="flex items-center justify-between border-b border-[#d4af37]/20 bg-[#070f0b] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4af37]/50 bg-[#13221b]">
                    <img src="/logo.webp" alt="Bhumivera" className="h-8 w-8 object-contain" />
                  </div>
                  <div>
                    <span className="block font-bold tracking-[0.16em] text-[#d4af37] text-base">BHUMIVERA</span>
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-[#94a3b8]">Botanical Maison</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
                  aria-label="Close sidebar"
                >
                  <X size={18} />
                </button>
              </div>

              {/* 2. Quick Search */}
              <div className="border-b border-white/10 p-3.5 bg-[#09130e]">
                <form onSubmit={executeFullSearch} className="relative">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d4af37]" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search botanical rituals..."
                    className="w-full rounded-full border border-[#d4af37]/30 bg-[#070f0b] py-2 pl-9 pr-8 text-xs text-white placeholder:text-[#94a3b8] outline-none focus:border-[#d4af37]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                    >
                      <X size={13} />
                    </button>
                  )}
                </form>
              </div>

              {/* 3. Scrollable Sidebar Navigation Body */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                {/* Storefront Nav Links */}
                <div className="space-y-1">
                  {[
                    { to: '/shop', label: 'Shop All Formulations', icon: Compass, badge: 'Catalog' },
                    { to: '/verify', label: 'Verify Bottle Serial', icon: ShieldCheck, badge: 'Live Assay', highlight: true },
                    { to: '/compare', label: 'Compare Formulations', icon: GitCompareArrows },
                    { to: '/science', label: 'Botanical Science & pH 5.5', icon: FlaskConical },
                    { to: '/about', label: 'Our Story & Heritage', icon: Leaf },
                    { to: '/order-tracking', label: 'Track An Order', icon: Truck },
                    { to: '/wishlist', label: 'Saved Wishlist', icon: Heart },
                  ].map(item => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${
                        item.highlight
                          ? 'bg-[#d4af37]/15 border border-[#d4af37]/50 text-[#d4af37]'
                          : 'text-[#cbd5e1] hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={16} className={item.highlight ? 'text-[#d4af37]' : 'text-[#94a3b8]'} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          item.highlight ? 'bg-[#d4af37] text-[#0c1712] font-black' : 'bg-white/10 text-[#94a3b8]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>

                {/* Account / Authentication */}
                <div className="border-t border-white/10 pt-3">
                  <Link
                    to={user ? "/profile" : "/login"}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                  >
                    <CircleUserRound size={17} className="text-[#d4af37]" />
                    <span className="truncate">
                      {user ? `My Account (${user.name || user.email?.split('@')[0]})` : 'Sign In / Register'}
                    </span>
                  </Link>
                </div>

                {/* 4. INLINE LANGUAGE SELECTOR (FIXES: LANGUAGE SETTING GOING DOWN SCREEN!) */}
                <div className="border-t border-white/10 pt-3 pb-2">
                  <LanguageSelector variant="inline" />
                </div>

                {/* PWA Install Button */}
                {!isStandalone && (installPrompt || isIosDevice) && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleInstallApp}
                      className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-2 text-xs font-bold text-[#d4af37] hover:bg-[#d4af37]/20 transition-colors"
                    >
                      <Download size={15} />
                      {isIosDevice ? 'Add App to Home Screen' : 'Install Bhumivera App'}
                    </button>
                    {showIosInstallHelp && isIosDevice && (
                      <p className="mt-1 text-[11px] text-[#94a3b8]">
                        In Safari, tap Share, then tap “Add to Home Screen”.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 5. Sidebar Bottom: Prominent Developer Branding */}
              <div className="border-t border-[#d4af37]/25 bg-[#070f0b] p-3.5 text-center">
                <p className="text-[9px] uppercase tracking-[0.25em] text-[#94a3b8]">
                  Architectural Engineering &amp; Design
                </p>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1 text-[11px] font-bold text-[#d4af37]">
                  <Sparkles size={11} />
                  Developed By Akash Prasad
                </div>
              </div>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
