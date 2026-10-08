import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BadgeCheck, ChevronDown, ChevronUp, Gift, Minus, Plus, ShieldCheck, ShoppingBag, Star, Tag, Trash2, Truck, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { coupons as couponsApi, products as productsApi } from '../services/api';

const getImageUrl = image => {
  let value = image;
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      // Plain image keys are expected for cart records.
    }
  }
  if (Array.isArray(value)) value = value.find(item => item?.type !== 'video' && item?.media_type !== 'video') || value[0];
  value = value && typeof value === 'object' ? value.url || value.file_path || value.path : value;
  if (typeof value !== 'string' || !value.trim()) return '/logo.webp';
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  const baseUrl = import.meta.env.VITE_R2_PUBLIC_URL || import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-70fdb5d94df347c4bed417c28b066c02.r2.dev/bhumivera';
  return `${baseUrl.replace(/\/$/, '')}/${value.replace(/^\/+/, '')}`;
};

const formatPrice = value => `₹${(Number(value) || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function MiniCart() {
  const {
    cartItems = [], isCartOpen, setIsCartOpen, removeFromCart, updateQuantity,
    getSubtotal, addToCart, rulePreview, rulePreviewLoading, shippingProgress,
    freeShippingThreshold, couponStackPolicy,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [offers, setOffers] = useState([]);
  const [offersOpen, setOffersOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponBusy, setCouponBusy] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = Number(getSubtotal()) || 0;
  const discount = Math.max(0, Number(rulePreview?.totalDiscount) || 0);
  const couponDiscount = appliedCoupon
    ? couponStackPolicy === 'both' || couponStackPolicy === 'coupon_first' || discount <= 0
      ? appliedCoupon.discount
      : 0
    : 0;
  const amountToFreeShipping = Math.max(0, Number(freeShippingThreshold) - subtotal);
  const recommendationsToShow = useMemo(() => {
    const cartIds = new Set(cartItems.map(item => String(item.product_id || item.product?.id || item.id)));
    return recommendations.filter(product => !cartIds.has(String(product.id || product._id))).slice(0, 4);
  }, [cartItems, recommendations]);

  useEffect(() => {
    if (!isCartOpen) return undefined;
    let active = true;
    productsApi.getAllActive({ sort: 'rating' })
      .then(response => {
        const data = response.data?.products || response.data?.data || response.data;
        if (active) setRecommendations(Array.isArray(data) ? data : []);
      })
      .catch(error => console.error('[MINI_CART_RECOMMENDATIONS]', error));
    couponsApi.getPublicActive()
      .then(response => {
        const data = response.data?.data || response.data;
        if (active) setOffers(Array.isArray(data) ? data : []);
      })
      .catch(error => console.error('[MINI_CART_OFFERS]', error));
    return () => { active = false; };
  }, [isCartOpen]);

  useEffect(() => {
    if (!isCartOpen) return undefined;
    const onKeyDown = event => {
      if (event.key === 'Escape') setIsCartOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const validateCoupon = async event => {
    event.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    if (!user) {
      setCouponMessage('Sign in to apply a coupon to your order.');
      return;
    }
    setCouponBusy(true);
    setCouponMessage('');
    try {
      const response = await couponsApi.validate(code, subtotal);
      const data = response.data?.data || response.data || {};
      setAppliedCoupon({ code, discount: Number(data.discount) || 0 });
      setCouponMessage(`Coupon applied — saving ${formatPrice(data.discount)}.`);
    } catch (error) {
      setAppliedCoupon(null);
      setCouponMessage(error.response?.data?.message || 'This coupon could not be applied.');
    } finally {
      setCouponBusy(false);
    }
  };

  const continueToCheckout = () => {
    setIsCartOpen(false);
    if (!user) navigate('/login', { state: { from: '/checkout' } });
    else navigate('/checkout', { state: { couponCode: appliedCoupon?.code || '' } });
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden" role="presentation">
      <button type="button" aria-label="Close cart" className="absolute inset-0 h-full w-full bg-[#13241b]/55 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
      <aside role="dialog" aria-modal="true" aria-labelledby="mini-cart-title" className="absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col border-l border-[#e8dcc4] bg-[#FDFBF7] text-[#1A1C18] shadow-2xl animate-in slide-in-from-right duration-300">
        <header className="flex items-center justify-between border-b border-[#e8dcc4] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8b5a2b]/10 text-[#8b5a2b]"><ShoppingBag size={19}/></span>
            <div><h2 id="mini-cart-title" className="font-serif text-xl text-[#2C3E2D]">Your Cart <span className="font-sans text-sm text-stone-500">({cartItems.length} items)</span></h2><p className="text-[10px] font-bold uppercase tracking-widest text-[#8b5a2b]">Thoughtfully chosen for you</p></div>
          </div>
          <button type="button" aria-label="Close cart" onClick={() => setIsCartOpen(false)} className="rounded-full p-2 text-stone-500 transition hover:bg-white hover:text-[#2C3E2D]"><X size={20}/></button>
        </header>

        {cartItems.length > 0 && <div className="border-b border-[#e8dcc4] bg-white px-5 py-4 sm:px-6">
          {rulePreview?.membershipTier && <p className="mb-3 border border-[#D4AF37]/35 bg-[#FFF8E7] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#765d17]">{rulePreview.membershipTier} member benefits</p>}
          {rulePreview?.tiers?.length > 0 && <div className="mb-3 space-y-2.5">
            {rulePreview.tiers.slice(0, 3).map(tier => <div key={tier.id}>
              <div className="mb-1 flex justify-between gap-3 text-[10px] font-bold uppercase tracking-wider"><span className="truncate text-stone-600">{tier.badge || tier.name}</span><span className={tier.unlocked ? 'text-emerald-700' : 'text-[#8b5a2b]'}>{tier.unlocked ? 'Unlocked' : `Add ${formatPrice(tier.missingAmount)}`}</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#f3efe7]"><div className={`h-full transition-all ${tier.unlocked ? 'bg-emerald-500' : 'bg-[#8b5a2b]'}`} style={{ width: `${Math.min(100, Math.max(0, Number(tier.progressPct) || 0))}%` }}/></div>
            </div>)}
          </div>}
          {rulePreview?.gifts?.length > 0 && <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800"><Gift size={15}/>{rulePreview.gifts[0].productName ? `${rulePreview.gifts[0].productName} unlocked` : 'A free gift is unlocked'}{rulePreview.gifts.length > 1 ? ` + ${rulePreview.gifts.length - 1} more` : ''}</div>}
          {rulePreviewLoading && <p className="mt-2 text-[10px] text-stone-400">Refreshing your rewards…</p>}
          <div className="mt-3 flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-stone-500"><Truck size={13}/>{amountToFreeShipping > 0 ? `Add ${formatPrice(amountToFreeShipping)} for free delivery` : 'Free delivery unlocked'}</span>
            <span className={amountToFreeShipping > 0 ? 'text-[#8b5a2b]' : 'text-emerald-700'}>{Math.round(Math.max(0, Math.min(100, Number(shippingProgress) || 0)))}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#f3efe7]"><div className={`h-full transition-all ${amountToFreeShipping > 0 ? 'bg-[#8b5a2b]' : 'bg-emerald-500'}`} style={{ width: `${Math.max(0, Math.min(100, Number(shippingProgress) || 0))}%` }}/></div>
        </div>}

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 sm:px-6">
          {cartItems.length === 0 ? <div className="flex h-full flex-col items-center justify-center text-center">
            <ShoppingBag size={42} className="text-[#8b5a2b]/40"/>
            <p className="mt-4 font-serif text-xl text-[#2C3E2D]">Your cart is waiting</p>
            <p className="mt-1 text-sm text-stone-500">Explore botanicals and add something you love.</p>
            <button type="button" onClick={() => setIsCartOpen(false)} className="mt-5 rounded-xl bg-[#8b5a2b] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white">Continue shopping</button>
          </div> : <>
            {cartItems.map(item => {
              const product = item.product || item;
              const id = item.product_id || product.id || product._id;
              const image = product.image_url || item.image_url || item.image || product.image || product.images?.[0];
              const price = Number(product.discount_price || item.unit_price || product.price) || 0;
              return <article key={id} className="flex gap-3 rounded-2xl border border-[#e8dcc4] bg-white p-3">
                <img src={getImageUrl(image)} alt={product.name || 'Cart product'} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="h-[76px] w-[76px] shrink-0 rounded-xl border border-[#f0e8da] bg-[#faf8f5] object-contain p-1"/>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2"><h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[#2C3E2D]">{product.name || 'Bhumivera product'}</h3><button type="button" aria-label={`Remove ${product.name || 'product'}`} onClick={() => removeFromCart(id)} className="shrink-0 rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15}/></button></div>
                  {product.sku && <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-stone-400">SKU: {product.sku}</p>}
                  {Number(product.review_count) > 0 && Number(product.rating) > 0 && <button type="button" onClick={() => { setIsCartOpen(false); navigate(`/product/${product.slug || id}#product-reviews`); }} className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[#765d17] hover:underline">
                    <Star size={11} fill="currentColor"/> {Number(product.rating).toFixed(1)} <span className="text-stone-500">({Number(product.review_count)} reviews)</span>
                  </button>}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center rounded-lg border border-[#e8dcc4] bg-[#faf8f5]">
                      <button type="button" aria-label="Decrease quantity" onClick={() => updateQuantity(id, Math.max(1, Number(item.quantity || 1) - 1))} className="p-1.5 text-stone-600 hover:text-[#8b5a2b]"><Minus size={13}/></button>
                      <span className="min-w-7 text-center text-xs font-bold">{item.quantity || 1}</span>
                      <button type="button" aria-label="Increase quantity" onClick={() => updateQuantity(id, Number(item.quantity || 1) + 1)} className="p-1.5 text-stone-600 hover:text-[#8b5a2b]"><Plus size={13}/></button>
                    </div>
                    <span className="text-sm font-bold text-[#8b5a2b]">{formatPrice(price * (Number(item.quantity) || 1))}</span>
                  </div>
                </div>
              </article>;
            })}

            <div className="grid grid-cols-2 gap-2 rounded-xl border border-[#e8dcc4] bg-[#fffdf8] p-3 text-[10px] font-semibold text-[#35533c]">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#8b5a2b]"/>Secure checkout</span>
              <span className="flex items-center gap-1.5"><BadgeCheck size={14} className="text-[#8b5a2b]"/>Customer-approved reviews</span>
            </div>

            <section className="overflow-hidden rounded-2xl border border-[#e8dcc4] bg-white">
              <button type="button" onClick={() => setOffersOpen(open => !open)} aria-expanded={offersOpen} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
                <span className="flex items-center gap-2"><span className="rounded-lg bg-[#f5f1e8] p-2 text-[#8b5a2b]"><Tag size={15}/></span><span><span className="block text-sm font-semibold text-[#2C3E2D]">Coupons &amp; offers</span><span className="block text-[10px] text-stone-500">{offers.length ? `${offers.length} public offers available` : 'Enter a coupon code'}</span></span></span>
                {offersOpen ? <ChevronUp size={16} className="text-stone-500"/> : <ChevronDown size={16} className="text-stone-500"/>}
              </button>
              {offersOpen && <div className="border-t border-[#f0e8da] p-3">
                <form onSubmit={validateCoupon} className="flex gap-2">
                  <input value={couponCode} onChange={event => setCouponCode(event.target.value)} aria-label="Coupon code" placeholder="Enter coupon code" className="min-w-0 flex-1 rounded-xl border border-dashed border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-[#8b5a2b]"/>
                  <button disabled={couponBusy || !couponCode.trim()} className="rounded-xl bg-[#2C3E2D] px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{couponBusy ? 'Checking…' : 'Apply'}</button>
                </form>
                {couponMessage && <p role="status" className={`mt-2 text-xs ${appliedCoupon ? 'text-emerald-700' : 'text-rose-700'}`}>{couponMessage}</p>}
                {offers.length > 0 && <div className="mt-3 space-y-2">
                  {offers.slice(0, 4).map(offer => <button type="button" key={offer.code} onClick={() => { setCouponCode(offer.code); setCouponMessage('Enter this code above and apply it to check eligibility.'); }} className="flex w-full items-center justify-between gap-2 rounded-lg bg-[#faf8f5] px-3 py-2 text-left text-xs hover:bg-[#f5f1e8]"><span><strong className="font-mono text-[#2C3E2D]">{offer.code}</strong><span className="ml-2 text-stone-500">{offer.discount_type === 'percentage' || offer.type === 'percentage' ? `${offer.discount_value ?? offer.value}% off` : `${formatPrice(offer.discount_value ?? offer.value)} off`}</span></span><span className="text-[9px] font-bold uppercase tracking-wider text-[#8b5a2b]">Use</span></button>)}
                </div>}
              </div>}
            </section>

            {recommendationsToShow.length > 0 && <section>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2C3E2D]">Recommended for you</h3>
              <div className="grid grid-cols-2 gap-2">
                {recommendationsToShow.slice(0, 2).map(product => <article key={product.id || product._id} className="flex min-w-0 items-center gap-2 rounded-xl border border-[#e8dcc4] bg-white p-2">
                  <img src={getImageUrl(product.image_url || product.images?.[0] || product.image)} alt={product.name} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="h-12 w-12 shrink-0 rounded-lg bg-[#faf8f5] object-contain p-1"/>
                  <div className="min-w-0 flex-1"><p className="line-clamp-2 text-[10px] font-semibold leading-tight text-[#2C3E2D]">{product.name}</p><p className="mt-1 text-[10px] font-bold text-[#8b5a2b]">{formatPrice(product.discount_price || product.price)}</p></div>
                  <button type="button" aria-label={`Add ${product.name} to cart`} onClick={() => addToCart(product)} className="shrink-0 rounded-lg border border-[#e8dcc4] p-1.5 text-[#8b5a2b] hover:bg-[#8b5a2b] hover:text-white"><Plus size={14}/></button>
                </article>)}
              </div>
            </section>}
          </>}
        </div>

        {cartItems.length > 0 && <footer className="border-t border-[#e8dcc4] bg-white px-5 py-4 shadow-[0_-8px_24px_rgba(44,62,45,0.05)] sm:px-6">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-stone-600"><span>Subtotal</span><strong className="text-[#1A1C18]">{formatPrice(subtotal)}</strong></div>
            {discount > 0 && <div className="flex justify-between font-semibold text-emerald-700"><span>Cart rewards</span><span>−{formatPrice(discount)}</span></div>}
            {appliedCoupon?.discount > 0 && <div className="flex justify-between font-semibold text-emerald-700"><span>Coupon ({appliedCoupon.code})</span><span>{couponDiscount > 0 ? `−${formatPrice(couponDiscount)}` : 'Not stacked with cart rewards'}</span></div>}
            <div className="flex justify-between border-t border-[#f0e8da] pt-2 text-sm font-bold text-[#2C3E2D]"><span>Estimated total*</span><span>{formatPrice(Math.max(0, subtotal - discount - couponDiscount))}</span></div>
          </div>
          <button type="button" onClick={continueToCheckout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#8b5a2b] px-4 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-md transition hover:bg-[#6b4421]">Continue to checkout <ArrowRight size={16}/></button>
          <p className="mt-2 text-center text-[9px] text-stone-400">Shipping and final discounts are confirmed at checkout.</p>
        </footer>}
      </aside>
    </div>
  );
}
