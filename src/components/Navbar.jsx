import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, User, Search, Menu, X, Car, 
  ChevronDown, Package, Zap, Gift, ShieldCheck, 
  MapPin, Sparkles, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { search } from '../services/api'; //[cite: 12]

export default function Navbar() {
  const { user, logout } = useAuth(); //[cite: 12]
  const { cartItems } = useCart(); //[cite: 12]
  
  // Mobile Menu State
  const [isMenuOpen, setMenuOpen] = useState(false);
  
  // AI Search Engine State[cite: 12]
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isAiPowered, setIsAiPowered] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchTimeout = useRef(null);
  
  // Garage/Fitment State[cite: 12]
  const [isGarageActive, setGarageActive] = useState(false);
  const [garageData, setGarageData] = useState(null);
  
  const navigate = useNavigate(); //[cite: 12]
  const searchDropdownRef = useRef(null);

  // Synchronize Garage Data from LocalStorage[cite: 12]
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

  // Handle click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Advanced Predictive AI Search ---
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchDropdown(true);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (query.length > 2) {
      setIsSearching(true);
      
      // Debounce API call by 400ms to prevent rate limiting[cite: 12]
      searchTimeout.current = setTimeout(async () => {
        try {
          // Trigger the AI semantic search endpoint from your API
          const res = await search.query(query, 5); //[cite: 12]
          if (res.data?.success || res.data) {
            setSuggestions(res.data?.data || res.data);
            setIsAiPowered(res.data?.isAiPowered || true); // Assuming new API defaults to AI[cite: 12]
          }
        } catch (error) {
          console.error("AI Search Engine Failure:", error);
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
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Pre-defined Quick Categories for Desktop Navigation
  const quickLinks = [
    { label: 'Audio', path: '/shop?category=audio' },
    { label: 'Lighting', path: '/shop?category=lighting' },
    { label: 'Android Players', path: '/shop?category=players' },
    { label: 'Flash Sale', path: '/flash-sales', icon: Zap },
  ];

  return (
    <>
      {/* Top Utility Bar (Trust Signals & Micro-Nav) */}
      <div className="bg-[#050505] text-slate-400 py-1.5 px-6 text-[9px] font-black uppercase tracking-widest hidden md:block border-b border-slate-900">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 hover:text-emerald-500 transition-colors cursor-pointer"><ShieldCheck size={12} className="text-emerald-500" /> 100% Secure Checkout</span>
            <span className="flex items-center gap-2 hover:text-emerald-500 transition-colors cursor-pointer"><MapPin size={12} className="text-emerald-500" /> Track Order</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/ewarranty" className="hover:text-emerald-500 transition-colors">E-Warranty</Link>
            <Link to="/contact" className="hover:text-emerald-500 transition-colors">Support Matrix</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-emerald-500 flex items-center gap-1.5"><Activity size={12}/> Admin Terminal</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Ribbon */}
      <nav className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-900 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          
          {/* Mobile Menu Toggle */}
          <button onClick={() => setMenuOpen(!isMenuOpen)} className="md:hidden text-slate-400 hover:text-white transition-colors">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-slate-950 text-xl group-hover:rotate-[15deg] transition-transform shadow-[0_0_15px_rgba(16,185,129,0.4)]">A</div>
            <span className="text-2xl font-black tracking-tighter italic uppercase text-white hidden sm:block">Bhumivera</span>
          </Link>

          {/* AI-POWERED SEARCH ENGINE */}
          <div className="hidden md:flex flex-1 max-w-2xl relative" ref={searchDropdownRef}>
            <form onSubmit={executeFullSearch} className="w-full relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => { if(searchQuery.length > 2) setShowSearchDropdown(true); }}
                placeholder="Query hardware (e.g., 'brightest H4 bulb for night driving')..."
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-6 py-3.5 text-xs font-mono text-white focus:border-emerald-500/50 focus:bg-slate-900 transition-all outline-none placeholder:text-slate-600 shadow-inner"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-emerald-400 transition-colors opacity-0 group-focus-within:opacity-100">
                Execute
              </button>
            </form>

            {/* PREDICTIVE AI DROPDOWN */}
            {showSearchDropdown && (searchQuery.length > 2) && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                 
                 {/* Semantic AI Indicator */}
                 <div className="bg-emerald-500/5 px-5 py-3 border-b border-emerald-500/10 flex items-center justify-between">
                   <div className="flex items-center text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em]">
                     <Sparkles size={14} className="mr-2 animate-pulse" />
                     {isAiPowered ? 'Semantic AI Results' : 'Standard Search'}
                   </div>
                   {isSearching && <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>}
                 </div>

                 <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                   {suggestions.length === 0 && !isSearching ? (
                     <div className="p-8 text-center text-slate-500 font-mono text-xs uppercase tracking-widest">
                       No hardware found matching criteria.
                     </div>
                   ) : (
                     suggestions.map(s => (
                       <Link 
                         key={s.id || s._id} 
                         to={`/product/${s.slug || s.id || s._id}`} 
                         onClick={() => setShowSearchDropdown(false)}
                         className="flex items-center p-4 hover:bg-slate-800/80 transition-colors border-b border-slate-800/50 last:border-none group"
                       >
                          <img 
                            src={s.images?.[0] || s.image_url || '/logo.webp'} 
                            className="w-12 h-12 rounded-xl object-contain bg-slate-950 border border-slate-800 p-1 mr-4 group-hover:border-emerald-500/30 transition-colors" 
                            alt={s.name} 
                            onError={(e) => { e.target.src = '/logo.webp'; }}
                          />
                          <div className="flex-1">
                             <div className="text-sm font-black uppercase text-white group-hover:text-emerald-400 transition-colors truncate">{s.name}</div>
                             <div className="text-xs font-mono font-bold text-emerald-500 mt-1">₹{s.discount_price || s.price}</div>
                          </div>
                          <ChevronDown size={16} className="-rotate-90 text-slate-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                       </Link>
                     ))
                   )}
                 </div>
                 
                 {/* Footer Action */}
                 {suggestions.length > 0 && (
                   <div 
                     onClick={executeFullSearch}
                     className="bg-slate-950 p-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-400 hover:bg-slate-900 cursor-pointer transition-colors border-t border-slate-800"
                   >
                     View All Results for "{searchQuery}"
                   </div>
                 )}
              </div>
            )}
          </div>

          {/* ACTIONS & USER HUB */}
          <div className="flex items-center space-x-4 sm:space-x-6 shrink-0">
            
            {/* FITMENT ENGINE (MY GARAGE) */}
            <Link to="/fitment-engine" className={`hidden xl:flex items-center space-x-3 px-5 py-2.5 rounded-2xl border transition-all shadow-sm ${
              isGarageActive 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-emerald-500/50 hover:text-white'
            }`}>
              <Car size={20} className={isGarageActive ? 'animate-pulse' : ''} />
              <div className="text-left">
                <div className="text-[8px] font-black uppercase tracking-widest leading-none text-slate-500">{isGarageActive ? 'Active Garage' : 'Fitment Scan'}</div>
                <div className="text-[11px] font-black uppercase tracking-tighter truncate max-w-[100px]">{isGarageActive ? garageData.model : 'Select Vehicle'}</div>
              </div>
            </Link>

            {/* USER / AUTH */}
            {user ? (
              <Link to="/profile" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 group-hover:border-emerald-500 transition-colors relative">
                   <User size={18} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                   <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950"></span>
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Welcome</div>
                  <div className="text-xs font-black text-white truncate max-w-[100px]">{user.name?.split(' ')[0]}</div>
                </div>
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:flex px-6 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-white hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-500 transition-all">
                Login
              </Link>
            )}

            {/* CART */}
            <Link to="/cart" className="relative p-2.5 text-slate-400 bg-slate-900 border border-slate-800 rounded-xl hover:text-emerald-400 hover:border-emerald-500/50 transition-all group">
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
              {cartItems?.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Secondary Navigation Ribbon (Desktop) */}
        <div className="hidden md:flex border-t border-slate-900 bg-slate-950/50">
          <div className="max-w-7xl mx-auto px-6 w-full flex items-center gap-8">
            <button className="flex items-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-emerald-400 transition-colors">
              <Menu size={16} /> All Hardware
            </button>
            <div className="flex items-center gap-8 flex-1">
              {quickLinks.map((link, i) => (
                <Link key={i} to={link.path} className={`flex items-center gap-1.5 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${link.icon ? 'text-amber-500 hover:text-amber-400' : 'text-slate-400 hover:text-white'}`}>
                  {link.icon && <link.icon size={14} />} {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE SEARCH OVERLAY (Visible only on mobile when menu is not open) */}
      <div className="md:hidden p-4 bg-slate-950 border-b border-slate-900">
         <form onSubmit={executeFullSearch} className="relative">
           <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
           <input 
             type="text" 
             value={searchQuery}
             onChange={handleSearch}
             placeholder="Query hardware..."
             className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs font-mono text-white outline-none focus:border-emerald-500/50"
           />
         </form>
         {/* Simple dropdown for mobile */}
         {showSearchDropdown && suggestions.length > 0 && (
           <div className="mt-2 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl max-h-[50vh] overflow-y-auto">
             {suggestions.slice(0,4).map(s => (
               <Link key={s.id || s._id} to={`/product/${s.slug || s.id || s._id}`} className="flex items-center p-3 border-b border-slate-800/50">
                 <img src={getImageUrl(s.images?.[0])} className="w-10 h-10 object-contain mr-3 bg-slate-950 p-1 rounded" alt=""/>
                 <div className="flex-1 truncate">
                   <div className="text-[10px] font-black uppercase text-white truncate">{s.name}</div>
                   <div className="text-[10px] font-mono text-emerald-500">₹{s.discount_price || s.price}</div>
                 </div>
               </Link>
             ))}
           </div>
         )}
      </div>
    </>
  );
}

// Ensure the helper function exists inside the component file if not imported
const getImageUrl = (img) => {
  if (!img) return '/logo.webp';
  let path = typeof img === 'object' ? (img.file_path || img.url || img.path) : img;
  if (!path) return '/logo.webp';
  if (path.startsWith('http')) return path;
  
  const baseUrl = import.meta.env.VITE_R2_PUBLIC_URL || import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-22cd43cce9bc475680ad496e199706c4.r2.dev';
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};
