import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, ArrowLeft, Trash2, Plus, Minus, 
  ShieldCheck, Zap, ArrowRight, Truck, PackageCheck, Clock, Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Gift } from 'lucide-react';
import { newsletter as newsletterApi, products as productsApi } from '../services/api';
import toast from 'react-hot-toast';

const getImageUrl = (img) => {
  if (!img) return '/logo.webp';
  let path = typeof img === 'object' ? (img.url || img.file_path || img.path) : img;
  if (!path) return '/logo.webp';
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_R2_PUBLIC_URL || import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-22cd43cce9bc475680ad496e199706c4.r2.dev';
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

export default function Cart() {
  const { 
    cartItems = [], 
    removeFromCart, 
    updateQuantity, 
    getSubtotal, 
    shippingProgress = 0,
    freeShippingThreshold,
    rulePreview,
    rulePreviewLoading,
    addToCart
  } = useCart();
  
  const { user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const previousUnlockedRules = useRef(null);
  const [celebrationRule, setCelebrationRule] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [heldMinutes, setHeldMinutes] = useState(0);
  const [exitPromptOpen, setExitPromptOpen] = useState(false);
  const [exitEmail, setExitEmail] = useState('');
  const [exitSubmitting, setExitSubmitting] = useState(false);
  const [seasonalSeconds, setSeasonalSeconds] = useState(0);

  const cartTotal = typeof getSubtotal === 'function' ? getSubtotal() : 0;
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const amountLeftForFreeShipping = Math.max(freeShippingThreshold - cartTotal, 0);
  const enforcedMissingAmount = rulePreview?.enforcedMin !== null && rulePreview?.enforcedMin !== undefined
    ? Number(rulePreview.missingAmount) || 0
    : 0;
  const checkoutBlocked = enforcedMissingAmount > 0;
  const freeShippingUnlocked = Boolean(rulePreview?.freeShipping) || amountLeftForFreeShipping === 0;
  const savedAmount = cartItems.reduce((total, item) => {
    const product = item.product || item;
    const originalPrice = Number(product.price) || Number(item.unit_price) || 0;
    const currentPrice = Number(product.discount_price) > 0 ? Number(product.discount_price) : originalPrice;
    return total + Math.max(0, originalPrice - currentPrice) * (Number(item.quantity) || 1);
  }, 0);

  useEffect(() => {
    let active = true;
    productsApi.getAllActive({ sort: 'rating' }).then(response => {
      const data = response.data?.products || response.data?.data || response.data || [];
      const cartIds = new Set(cartItems.map(item => String(item.product_id || item.product?.id || item.product?._id || item.id)));
      if (active) setRecommendations((Array.isArray(data) ? data : []).filter(product => !cartIds.has(String(product.id || product._id))).slice(0, 4));
    }).catch(() => { if (active) setRecommendations([]); });
    return () => { active = false; };
  }, [cartItems]);

  useEffect(() => {
    const dates = cartItems.map(item => new Date(item.created_at || item.added_at || NaN).getTime()).filter(Number.isFinite);
    const heldSince = dates.length ? Math.min(...dates) : Date.now();
    const update = () => setHeldMinutes(Math.max(0, Math.floor((Date.now() - heldSince) / 60000)));
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [cartItems]);

  useEffect(() => {
    const enabled = settings?.gamification_abandoned_cart_email_enabled === '1' || settings?.gamification_abandoned_cart_email_enabled === 1;
    if (!enabled || user || cartItems.length === 0 || sessionStorage.getItem('cart-exit-capture-seen')) return undefined;
    const handleMouseLeave = event => {
      if (event.clientY <= 0) {
        sessionStorage.setItem('cart-exit-capture-seen', '1');
        setExitPromptOpen(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [settings, user, cartItems.length]);

  useEffect(() => {
    const enabled = settings?.gamification_seasonal_countdown_enabled === '1' || settings?.gamification_seasonal_countdown_enabled === 1;
    const endTime = settings?.seasonal_countdown_end_at ? new Date(settings.seasonal_countdown_end_at).getTime() : 0;
    if (!enabled || !Number.isFinite(endTime) || endTime <= Date.now()) {
      setSeasonalSeconds(0);
      return undefined;
    }
    const update = () => setSeasonalSeconds(Math.max(0, Math.ceil((endTime - Date.now()) / 1000)));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [settings]);

  const submitExitCapture = async event => {
    event.preventDefault();
    setExitSubmitting(true);
    try {
      await newsletterApi.subscribe(exitEmail, 'cart-exit-intent');
      setExitPromptOpen(false);
      toast.success('You’re on the list. Watch your inbox for updates.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save your email.');
    } finally {
      setExitSubmitting(false);
    }
  };

  useEffect(() => {
    const ids = (rulePreview?.matchedRuleIds || []).map(String);
    if (previousUnlockedRules.current === null) {
      previousUnlockedRules.current = new Set(ids);
      return undefined;
    }
    const previous = previousUnlockedRules.current;
    const newlyUnlocked = (rulePreview?.matchedRules || []).find(rule => !previous.has(String(rule.id)));
    previousUnlockedRules.current = new Set(ids);
    if (!newlyUnlocked) return undefined;
    setCelebrationRule(newlyUnlocked.badge_text || newlyUnlocked.name);
    const timer = setTimeout(() => setCelebrationRule(null), 1400);
    return () => clearTimeout(timer);
  }, [rulePreview]);

  const handleCheckout = () => {
    if (checkoutBlocked) {
      toast.error(`Add ₹${enforcedMissingAmount.toLocaleString()} more to place this order.`);
      return;
    }
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 selection:bg-[#8b5a2b] selection:text-white pt-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="bg-white p-12 rounded-[3rem] shadow-sm flex flex-col items-center text-center max-w-lg border border-[#e8dcc4] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-[#8b5a2b] opacity-20"></div>
          <div className="w-32 h-32 bg-[#faf8f5] rounded-full flex items-center justify-center mb-8 text-[#8b5a2b] border border-[#e8dcc4]">
            <ShoppingBag size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-serif text-[#1A1C18] mb-4">Your Cart is Empty</h2>
          <p className="text-stone-500 mb-10 leading-relaxed font-medium">Discover our natural botanicals and begin your skincare journey.</p>
          <Link to="/shop" className="bg-[#8b5a2b] hover:bg-[#6b4421] text-white px-10 py-5 rounded-full font-bold tracking-widest uppercase text-sm transition-all shadow-md flex items-center gap-3">
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
          {recommendations.length > 0 && <div className="mt-10 w-full text-left">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-stone-500">Popular picks</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {recommendations.slice(0, 2).map(product => <div key={product.id || product._id} className="flex min-w-0 items-center gap-3 border border-[#e8dcc4] bg-white p-3 text-left">
                <img src={getImageUrl(product.image_url || product.images?.[0])} alt={product.name} className="h-12 w-12 shrink-0 bg-[#faf8f5] object-contain p-1"/>
                <div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-[#1A1C18]">{product.name}</p><p className="mt-1 text-xs text-[#8b5a2b]">₹{Number(product.discount_price || product.price || 0).toLocaleString()}</p></div>
                <button aria-label={`Add ${product.name} to cart`} onClick={() => addToCart(product)} className="shrink-0 border border-[#e8dcc4] p-2 text-[#8b5a2b]"><Plus size={14}/></button>
              </div>)}
            </div>
          </div>}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1C18] selection:bg-[#8b5a2b] selection:text-white py-32 px-6 font-sans">
      {celebrationRule && <motion.div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-24 z-[80] flex justify-center" initial={{ opacity: 0, y: -12 }} animate={{ opacity: [0, 1, 1, 0], y: [0, 0, -8, -20] }} transition={{ duration: 1.4 }}>
        <div className="relative overflow-visible rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-bold text-emerald-800 shadow-lg">🎉 {celebrationRule} unlocked!
          {Array.from({ length: 12 }, (_, index) => <motion.span key={index} className={`absolute top-1/2 left-1/2 h-2 w-1.5 ${index % 3 === 0 ? 'bg-amber-400' : index % 3 === 1 ? 'bg-emerald-400' : 'bg-rose-400'}`} animate={{ x: Math.cos(index * Math.PI / 6) * 84, y: Math.sin(index * Math.PI / 6) * 52 + 20, rotate: 240, opacity: [1, 0] }} transition={{ duration: 0.9 }}/>) }
        </div>
      </motion.div>}
      {seasonalSeconds > 0 && <div role="status" className="fixed right-4 top-24 z-40 border border-emerald-200 bg-white/95 px-4 py-3 text-xs font-bold text-emerald-900 shadow-md">
        Seasonal offer ends in {Math.floor(seasonalSeconds / 86400)}d {String(Math.floor((seasonalSeconds % 86400) / 3600)).padStart(2, '0')}:{String(Math.floor((seasonalSeconds % 3600) / 60)).padStart(2, '0')}:{String(seasonalSeconds % 60).padStart(2, '0')}
      </div>}
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-end justify-between mb-12 border-b border-[#e8dcc4] pb-6">
          <div>
            <h1 className="text-5xl font-serif tracking-tight mb-2 text-[#2C3E2D]">Your Shopping Cart</h1>
            <p className="text-[#8b5a2b] font-bold tracking-widest text-sm uppercase">{cartCount} Items in Cart</p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-500"><Clock size={13}/>Items held for {Math.floor(heldMinutes / 60)}:{String(heldMinutes % 60).padStart(2, '0')}</p>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-2 text-stone-500 hover:text-[#8b5a2b] font-bold uppercase tracking-widest text-xs transition-colors">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {amountLeftForFreeShipping > 0 && amountLeftForFreeShipping <= 300 && <div className="mb-6 border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">Free delivery in ₹{amountLeftForFreeShipping.toLocaleString()} more.</div>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence>
              {cartItems.map(item => {
                const product = item.product || item;
                const id = item.product_id || product._id || product.id;
                const img = Array.isArray(product.images) ? product.images[0] : (product.image_url || product.image);
                const qty = item.quantity || 1;
                const price = product.discount_price || product.price || item.unit_price || 0;

                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    key={id} 
                    className="bg-white border border-[#e8dcc4] rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start group hover:border-[#8b5a2b]/30 transition-colors shadow-sm"
                  >
                    <div className="w-full sm:w-32 h-32 bg-[#faf8f5] rounded-2xl border border-[#e8dcc4] overflow-hidden shrink-0 relative flex items-center justify-center p-2">
                      <img src={getImageUrl(img)} alt={product.name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
                    </div>

                    <div className="flex-1 w-full flex flex-col h-full justify-between">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-bold uppercase tracking-tight line-clamp-2 mb-2 group-hover:text-[#8b5a2b] transition-colors">{product.name}</h3>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-stone-500 text-xs font-bold uppercase tracking-widest">SKU: {product.sku || 'N/A'}</span>
                            {Number(product.stock ?? product.quantity ?? item.stock) > 0 && Number(product.stock ?? product.quantity ?? item.stock) <= 5 ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Only {Number(product.stock ?? product.quantity ?? item.stock)} left</span>
                            ) : <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200"><PackageCheck size={12} /> In Stock</span>}
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(id)} className="p-2.5 bg-[#faf8f5] text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0">
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold text-[#1A1C18]">₹{parseFloat(price).toLocaleString()}</span>
                        </div>

                        <div className="flex items-center bg-[#faf8f5] border border-[#e8dcc4] rounded-xl p-1">
                          <button onClick={() => updateQuantity(id, qty - 1)} className="w-10 h-10 flex items-center justify-center text-stone-500 hover:text-[#8b5a2b] rounded-lg hover:bg-white transition-colors">
                            <Minus size={16} />
                          </button>
                          <span className="w-12 text-center font-bold text-lg">{qty}</span>
                          <button onClick={() => updateQuantity(id, qty + 1)} className="w-10 h-10 flex items-center justify-center text-stone-500 hover:text-[#8b5a2b] rounded-lg hover:bg-white transition-colors">
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <div className="text-right hidden sm:block">
                          <span className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-0.5">Line Total</span>
                          <span className="text-[#8b5a2b] font-bold text-xl">₹{(price * qty).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {rulePreview?.gifts?.length > 0 && <section className="space-y-3" aria-label="Unlocked cart gifts">
              {rulePreview.gifts.map(gift => <div key={`${gift.ruleId}-${gift.productId}`} className="flex items-center gap-4 border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                <Gift size={20} className="shrink-0 text-emerald-700"/>
                <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wider">FREE CART GIFT</p><p className="truncate text-sm">{gift.productName || `Product #${gift.productId}`} · Qty {gift.quantity}</p></div>
              </div>)}
            </section>}

            {recommendations.length > 0 && <section className="mt-12 space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-bold uppercase tracking-widest text-[#2C3E2D]"><Sparkles size={18} className="text-[#8b5a2b]"/>You May Also Like</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {recommendations.map(product => <article key={product.id || product._id} className="flex min-w-0 items-center gap-3 border border-[#e8dcc4] bg-white p-3">
                  <img src={getImageUrl(product.image_url || product.images?.[0])} alt={product.name} className="h-16 w-16 shrink-0 bg-[#faf8f5] object-contain p-1"/>
                  <div className="min-w-0 flex-1"><h4 className="truncate text-xs font-bold text-[#1A1C18]">{product.name}</h4><p className="mt-1 text-xs text-[#8b5a2b]">₹{Number(product.discount_price || product.price || 0).toLocaleString()}</p></div>
                  <button aria-label={`Add ${product.name} to cart`} onClick={() => addToCart(product)} className="shrink-0 border border-[#e8dcc4] p-2 text-[#8b5a2b] hover:bg-[#8b5a2b] hover:text-white"><Plus size={15}/></button>
                </article>)}
              </div>
            </section>}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white border border-[#e8dcc4] rounded-[2.5rem] p-8 sticky top-32 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-[#8b5a2b]">
                <ShieldCheck size={200} />
              </div>

              <h2 className="text-2xl font-serif tracking-tight mb-8 border-b border-[#e8dcc4] pb-6 relative z-10 text-[#2C3E2D]">Order Summary</h2>
              
              <div className="mb-8 relative z-10">
                {rulePreview?.tiers?.length > 0 && <div className="mb-6 space-y-4" aria-label="Cart rewards progress">
                  {rulePreview.tiers.map(tier => <div key={tier.id}>
                    <div className="mb-1.5 flex justify-between gap-3 text-[10px] font-bold uppercase tracking-wider"><span className="truncate text-stone-600">{tier.badge}</span><span className={tier.unlocked ? 'text-emerald-700' : 'text-[#8b5a2b]'}>{tier.unlocked ? 'Unlocked' : `Add ₹${tier.missingAmount.toLocaleString()}`}</span></div>
                    <div className="h-1.5 overflow-hidden bg-[#f3efe7]"><div className={`h-full transition-all ${tier.unlocked ? 'bg-emerald-500' : 'bg-[#8b5a2b]'}`} style={{ width: `${tier.progressPct}%` }}/></div>
                  </div>)}
                  {rulePreviewLoading && <p className="text-[10px] text-stone-400">Updating rewards…</p>}
                </div>}
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3">
                  <span className="text-stone-500">Shipping Status</span>
                  {!freeShippingUnlocked ? (
                    <span className="text-[#8b5a2b]">Add ₹{amountLeftForFreeShipping.toLocaleString()} for Free</span>
                  ) : (
                    <span className="text-green-600 flex items-center gap-1"><Truck size={14}/> Free Shipping Unlocked</span>
                  )}
                </div>
                <div className="h-2 w-full bg-[#faf8f5] rounded-full overflow-hidden border border-[#e8dcc4]">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${Math.min(100, (cartTotal / freeShippingThreshold) * 100)}%` }} transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${freeShippingUnlocked ? 'bg-green-500' : 'bg-[#8b5a2b]'}`}
                  />
                </div>
              </div>

              <div className="space-y-4 mb-8 relative z-10">
                <div className="flex justify-between text-stone-600 font-medium">
                  <span>Subtotal ({cartCount} Items)</span>
                  <span className="font-bold text-[#1A1C18]">₹{cartTotal.toLocaleString()}</span>
                </div>
                {savedAmount > 0 && <div className="flex justify-between text-sm font-semibold text-emerald-700"><span>You saved</span><span>₹{savedAmount.toLocaleString()}</span></div>}
                <div className="flex justify-between text-stone-600 font-medium pb-6 border-b border-[#e8dcc4]">
                  <span>Logistics & Handling</span>
                  {freeShippingUnlocked ? (
                    <span className="text-green-600 font-bold uppercase tracking-widest text-xs bg-green-50 px-2 py-1 rounded">Free</span>
                  ) : (
                    <span className="font-bold text-[#1A1C18]">Calculated next</span>
                  )}
                </div>
                
                <div className="flex justify-between items-end pt-2">
                  <span className="text-sm font-bold uppercase tracking-widest text-stone-500">Final Total</span>
                  <span className="text-4xl font-serif text-[#8b5a2b]">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {checkoutBlocked && <p role="status" className="relative z-10 mb-3 border-l-2 border-rose-500 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800">Add ₹{enforcedMissingAmount.toLocaleString()} more to place your order.</p>}
              <button 
                onClick={handleCheckout} 
                disabled={checkoutBlocked}
                className="w-full bg-[#8b5a2b] hover:bg-[#6b4421] text-white font-bold uppercase tracking-[0.2em] text-sm py-5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-3 relative z-10 group disabled:cursor-not-allowed disabled:bg-stone-400"
              >
                {user ? 'Proceed to Checkout' : 'Login & Checkout'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest relative z-10">
                <ShieldCheck size={14} className="text-[#8b5a2b]" /> Secure 256-Bit SSL Encrypted Link
              </div>
            </div>
          </div>

        </div>
      </div>
      {exitPromptOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setExitPromptOpen(false); }}>
        <form onSubmit={submitExitCapture} role="dialog" aria-modal="true" aria-labelledby="cart-exit-title" className="w-full max-w-md border border-[#e8dcc4] bg-white p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-[#8b5a2b]">Before you go</p><h2 id="cart-exit-title" className="mt-2 text-xl font-serif text-[#2C3E2D]">Want your cart offers by email?</h2></div><button type="button" aria-label="Close" onClick={() => setExitPromptOpen(false)} className="text-stone-500">×</button></div>
          <p className="mt-3 text-sm text-stone-500">Get a reminder and occasional offers. You can unsubscribe any time.</p>
          <input type="email" required value={exitEmail} onChange={event => setExitEmail(event.target.value)} placeholder="Email address" className="mt-5 w-full border border-stone-300 px-3 py-3 text-sm outline-none focus:border-[#8b5a2b]"/>
          <div className="mt-4 flex justify-end gap-3"><button type="button" onClick={() => setExitPromptOpen(false)} className="px-3 py-2 text-sm text-stone-500">Not now</button><button disabled={exitSubmitting} type="submit" className="bg-[#8b5a2b] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{exitSubmitting ? 'Submitting…' : 'Send me updates'}</button></div>
        </form>
      </div>}
    </div>
  );
}
