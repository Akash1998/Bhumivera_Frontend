import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, User, Search, Menu, X, Sparkles, 
  ChevronDown, Package, Zap, Gift, ShieldCheck, 
  MapPin, Activity, Droplets
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { search } from '../services/api';

export default function Navbar() {
  const { user, logout } = useAuth(); 
  const { cartItems } = useCart(); 
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
  const searchDropdownRef = useRef(null);

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
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickLinks = [
    { label: 'Multani Mitti', path: '/shop?category=multani-mitti' },
    { label: 'Aloe Vera', path: '/shop?category=aloe-vera' },
    { label: 'Natural Soaps', path: '/shop?category=soaps' },
    { label: 'Exclusive Offers', path: '/flash-sales', icon: Zap },
  ];

  return (
    <>
      <div className="bg-[#1a1a1a] text-[#e8dcc4] py-2 px-6 text-[10px] font-bold uppercase tracking-widest hidden md:block border-b border-[#8b5a2b]/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 transition-colors cursor-pointer"><ShieldCheck size={14} className="text-[#8b5a2b]" /> 100% Secure Checkout</span>
            <span className="flex items-center gap-2 transition-colors cursor-pointer"><MapPin size={14} className="text-[#8b5a2b]" /> Track Order</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-[#8b5a2b] transition-colors">Boutique Support</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-[#8b5a2b] flex items-center gap-1.5"><Activity size={14}/> Admin Terminal</Link>
            )}
          </div>
        </div>
      </div>

      <nav className="bg-[#faf8f5]/95 backdrop-blur-xl border-b border-[#e8dcc4] sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          
          <button 
            onClick={() => setMenuOpen(!isMenuOpen)} 
            className="md:hidden text-[#2c2c2c] hover:text-[#8b5a2b] transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" className="flex items-center space-x-3 group shrink-0" aria-label="Bhumivera Home">
            <div className="w-10 h-10 bg-[#8b5a2b] rounded-full flex items-center justify-center font-serif text-[#faf8f5] text-xl group-hover:scale-105 transition-transform shadow-md">B</div>
            <span className="text-2xl font-serif tracking-widest uppercase text-[#1a1a1a] hidden sm:block">Bhumivera</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-2xl relative" ref={searchDropdownRef}>
            <form onSubmit={executeFullSearch} className="w-full relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b5a2b]/60 group-focus-within:text-[#8b5a2b] transition-colors">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => { if(searchQuery.length > 2) setShowSearchDropdown(true); }}
                placeholder="Search natural skincare..."
                aria-label="Search skincare products"
                className="w-full bg-white border border-[#e8dcc4] rounded-full pl-12 pr-6 py-3.5 text-sm text-[#2c2c2c] focus:border-[#8b5a2b] transition-all outline-none placeholder:text-[#8b5a2b]/50 shadow-sm"
              />
              <button type="submit" aria-label="Search" className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#8b5a2b] text-white text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-full hover:bg-[#6b4421] transition-colors opacity-0 group-focus-within:opacity-100">
                Discover
              </button>
            </form>

            {showSearchDropdown && (searchQuery.length > 2) && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl border border-[#e8dcc4] shadow-2xl overflow-hidden z-50">
                 <div className="bg-[#f4eedc]/50 px-5 py-3 border-b border-[#e8dcc4] flex items-center justify-between">
                   <div className="flex items-center text-[10px] font-bold uppercase text-[#8b5a2b] tracking-[0.2em]">
                     <Sparkles size={14} className="mr-2 animate-pulse" />
                     {isAiPowered ? 'Semantic Formulation Results' : 'Standard Search'}
                   </div>
                   {isSearching && <div className="w-4 h-4 border-2 border-[#e8dcc4] border-t-[#8b5a2b] rounded-full animate-spin"></div>}
                 </div>
                 <div className="max-h-[60vh] overflow-y-auto">
                   {suggestions.length === 0 && !isSearching ? (
                     <div className="p-8 text-center text-[#8b5a2b]/70 font-serif text-sm uppercase tracking-widest">No botanical matches found.</div>
                   ) : (
                     suggestions.map(s => (
                       <Link key={s.id || s._id} to={`/product/${s.slug || s.id || s._id}`} onClick={() => setShowSearchDropdown(false)} className="flex items-center p-4 hover:bg-[#faf8f5] transition-colors border-b border-[#e8dcc4]/50 last:border-none group">
                          <img src={s.images?.[0] || s.image_url || '/logo.webp'} className="w-12 h-12 rounded-full object-cover bg-white border border-[#e8dcc4] p-1 mr-4" alt={s.name} />
                          <div className="flex-1">
                             <div className="text-sm font-bold uppercase text-[#2c2c2c] group-hover:text-[#8b5a2b] truncate">{s.name}</div>
                             <div className="text-xs font-serif text-[#8b5a2b] mt-1">₹{s.discount_price || s.price}</div>
                          </div>
                          <ChevronDown size={16} className="-rotate-90 text-[#8b5a2b]/50" />
                       </Link>
                     ))
                   )}
                 </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6 shrink-0">
            <Link to="/fitment-engine" aria-label="Skin Assessment" className={`hidden xl:flex items-center space-x-3 px-5 py-2.5 rounded-full border transition-all shadow-sm ${isGarageActive ? 'bg-[#8b5a2b] border-[#8b5a2b] text-white' : 'bg-white border-[#e8dcc4] text-[#8b5a2b]'}`}>
              <Sparkles size={18} className={isGarageActive ? 'animate-pulse' : ''} />
              <div className="text-left">
                <div className="text-[8px] font-bold uppercase tracking-widest leading-none opacity-80">{isGarageActive ? 'Active Regimen' : 'Skin Assessment'}</div>
                <div className="text-[11px] font-bold uppercase tracking-widest truncate max-w-[100px]">{isGarageActive ? garageData.model : 'Find Your Match'}</div>
              </div>
            </Link>

            {user ? (
              <Link to="/profile" aria-label="Profile" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-[#e8dcc4] group-hover:border-[#8b5a2b] relative shadow-sm">
                   <User size={18} className="text-[#8b5a2b]" />
                   <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#8b5a2b] rounded-full border-2 border-white"></span>
                </div>
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:flex px-6 py-2.5 bg-[#1a1a1a] rounded-full text-xs font-bold uppercase tracking-widest text-white transition-all shadow-sm">Sign In</Link>
            )}

            <Link to="/cart" aria-label="Cart" className="relative p-2.5 text-[#8b5a2b] bg-white border border-[#e8dcc4] rounded-full hover:border-[#8b5a2b] transition-all group shadow-sm">
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
              {cartItems?.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#8b5a2b] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">{cartItems.length}</span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
