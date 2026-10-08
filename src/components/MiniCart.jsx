import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, ChevronDown, ChevronUp, Gift, Leaf, MapPin, Minus, Plus, ShieldCheck, ShoppingBag, Sparkles, Star, Tag, Trash2, Truck, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { addresses as addressesApi, coupons as couponsApi, orders as ordersApi, products as productsApi, wallet as walletApi } from '../services/api';
import { useToast } from '../context/ToastContext';

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

const formatPrice = value => `₹${(Number(value) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const blankAddress = { label: 'Home', fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: 'India', isDefault: false };

export default function MiniCart() {
  const {
    cartItems = [], isCartOpen, setIsCartOpen, removeFromCart, updateQuantity,
    getSubtotal, addToCart, clearCart, rulePreview, rulePreviewLoading, shippingProgress, cartAddEvent,
    freeShippingThreshold, couponStackPolicy,
  } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const toast = useToast();
  const [recommendations, setRecommendations] = useState([]);
  const [offers, setOffers] = useState([]);
  const [offersOpen, setOffersOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponBusy, setCouponBusy] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addressForm, setAddressForm] = useState(blankAddress);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [paymentMode, setPaymentMode] = useState('COD');
  const [shippingMethod, setShippingMethod] = useState('STANDARD');
  const [walletBalance, setWalletBalance] = useState(0);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [impactAmount, setImpactAmount] = useState(0);
  const [impactProject, setImpactProject] = useState('native-trees');
  const [celebrationEvent, setCelebrationEvent] = useState(null);

  const subtotal = Number(getSubtotal()) || 0;
  const discount = Math.max(0, Number(rulePreview?.totalDiscount) || 0);
  const couponDiscount = appliedCoupon
    ? couponStackPolicy === 'both' || couponStackPolicy === 'coupon_first' || discount <= 0
      ? appliedCoupon.discount
      : 0
    : 0;
  const amountToFreeShipping = Math.max(0, Number(freeShippingThreshold) - subtotal);
  const standardShippingCost = Math.max(0, Number(settings?.standard_charge ?? settings?.default_shipping_charge ?? 50) || 0);
  const expressShippingCost = Math.max(0, Number(settings?.express_charge ?? 150) || 0);
  const shippingCost = rulePreview?.freeShipping ? 0 : shippingMethod === 'EXPRESS' ? expressShippingCost : standardShippingCost;
  const finalTotal = Math.max(0, subtotal + shippingCost - discount - couponDiscount + (paymentMode === 'COD' ? impactAmount : 0));
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

  useEffect(() => {
    if (!isCartOpen || sessionStorage.getItem('mini-cart-checkout') !== '1') return;
    sessionStorage.removeItem('mini-cart-checkout');
    setCheckoutOpen(true);
  }, [isCartOpen]);

  useEffect(() => {
    if (!cartAddEvent?.id) return undefined;
    setCelebrationEvent(cartAddEvent);
    const timer = setTimeout(() => setCelebrationEvent(null), 2600);
    return () => clearTimeout(timer);
  }, [cartAddEvent]);

  useEffect(() => {
    if (!checkoutOpen || !user) return undefined;
    let active = true;
    Promise.all([
      addressesApi.getAll(),
      walletApi.getBalance().catch(error => {
        console.error('[MINI_CART_WALLET_BALANCE]', error);
        return { data: { balance: 0 } };
      }),
    ]).then(([addressResponse, walletResponse]) => {
      if (!active) return;
      const list = addressResponse.data?.addresses || addressResponse.data?.data || addressResponse.data || [];
      const savedAddresses = Array.isArray(list) ? list : [];
      setAddresses(savedAddresses);
      setSelectedAddress(current => current || String((savedAddresses.find(address => address.is_default) || savedAddresses[0])?.id || ''));
      setWalletBalance(Math.max(0, Number(walletResponse.data?.balance) || 0));
    }).catch(error => {
      console.error('[MINI_CART_CHECKOUT_DETAILS]', error);
      if (active) toast.error(error.response?.data?.message || 'Could not load checkout details. Please try again.');
    });
    return () => { active = false; };
  }, [checkoutOpen, user, toast]);

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
    if (!user) {
      setIsCartOpen(false);
      navigate('/login', { state: { from: '/checkout', reopenCart: true } });
      return;
    }
    setCheckoutOpen(true);
  };

  const saveAddress = async event => {
    event.preventDefault();
    setAddressSaving(true);
    try {
      const response = await addressesApi.create({
        ...addressForm,
        full_name: addressForm.fullName,
        line1: addressForm.addressLine1,
        street_address: addressForm.addressLine1,
        address_line1: addressForm.addressLine1,
        address_line2: addressForm.addressLine2,
        phone_number: addressForm.phone,
        postal_code: addressForm.pincode,
        is_default: addressForm.isDefault,
      });
      const saved = response.data?.addresses || response.data?.data || [];
      const savedAddresses = Array.isArray(saved) ? saved : [];
      setAddresses(savedAddresses);
      const newestAddress = savedAddresses.find(address => address.is_default) || savedAddresses[0];
      setSelectedAddress(String(newestAddress?.id || ''));
      setAddressForm(blankAddress);
      setAddressFormOpen(false);
      toast.success('Delivery address saved.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save this address.');
    } finally {
      setAddressSaving(false);
    }
  };

  const placeOrder = async event => {
    event.preventDefault();
    if (!selectedAddress) {
      toast.error('Choose or add a delivery address before placing your order.');
      return;
    }
    if (paymentMode === 'WALLET' && walletBalance < finalTotal) {
      toast.error('Your wallet balance is not enough for this order.');
      return;
    }
    setPlacingOrder(true);
    try {
      const response = await ordersApi.create({
        addressId: selectedAddress,
        paymentMode,
        deliveryType: shippingMethod.toLowerCase(),
        couponCode: appliedCoupon?.code || undefined,
        impactAmount: paymentMode === 'COD' ? impactAmount : 0,
        impactProject: paymentMode === 'COD' && impactAmount > 0 ? impactProject : undefined,
        notes: orderNotes.trim() || undefined,
      });
      const orderId = response.data?.orderId || response.data?.id;
      if (!orderId) throw new Error('Order confirmation was not returned. Please check your orders before trying again.');
      await clearCart();
      setIsCartOpen(false);
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error('[MINI_CART_PLACE_ORDER]', error);
      toast.error(error.response?.data?.message || error.message || 'We could not place your order. Please review your details and try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden" role="presentation">
      <button type="button" aria-label="Close cart" className="absolute inset-0 h-full w-full bg-[#13241b]/55 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
      <aside role="dialog" aria-modal="true" aria-labelledby="mini-cart-title" className="absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col border-l border-[#e8dcc4] bg-[#FDFBF7] text-[#1A1C18] shadow-2xl animate-in slide-in-from-right duration-300">
        <AnimatePresence>
          {celebrationEvent && <Motion.div key={celebrationEvent.id} initial={{ opacity: 0, y: -18, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12 }} className="absolute left-4 right-4 top-20 z-30 overflow-hidden rounded-2xl border border-[#c8d6ae] bg-[#f1f5e8] p-4 text-[#263d31] shadow-xl" aria-live="polite">
            <div className="absolute inset-0 pointer-events-none">
              {[0, 1, 2, 3, 4, 5].map(index => <Motion.span key={index} initial={{ opacity: 0, y: 24, x: `${index * 18}%`, rotate: -20 }} animate={{ opacity: [0, 1, 0], y: -22, rotate: 24 }} transition={{ duration: 1.3, delay: index * 0.06 }} className="absolute bottom-0"><Leaf size={13} className="text-[#758c53]"/></Motion.span>)}
            </div>
            <div className="relative flex items-start gap-3"><span className="rounded-full bg-white p-2 text-[#536b4d]"><Sparkles size={17}/></span><div><p className="text-xs font-bold uppercase tracking-widest">A thoughtful choice</p><p className="mt-1 text-xs leading-5">We’ve added {celebrationEvent.productName} to your cart. Thank you for choosing with care.</p>{rulePreview?.gifts?.length > 0 && <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-800"><Gift size={14}/>Your cart includes an admin-configured gift reward.</p>}</div></div>
          </Motion.div>}
        </AnimatePresence>
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

            {checkoutOpen && <section className="space-y-4 rounded-2xl border border-[#c9d4bd] bg-[#f5f6ef] p-4" aria-labelledby="mini-checkout-title">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#72825f]">A calm, considered finish</p><h3 id="mini-checkout-title" className="mt-1 flex items-center gap-2 font-serif text-lg text-[#263d31]"><MapPin size={17}/>Delivery &amp; payment</h3></div>
              {!user ? <button type="button" onClick={() => { setIsCartOpen(false); navigate('/login', { state: { from: '/checkout', reopenCart: true } }); }} className="w-full rounded-xl bg-[#2C3E2D] px-4 py-3 text-sm font-semibold text-white">Sign in to continue</button> : <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold text-[#35533c]">Delivery address</p><button type="button" onClick={() => setAddressFormOpen(open => !open)} className="text-xs font-semibold text-[#8b5a2b] underline underline-offset-2">{addressFormOpen ? 'Cancel' : '+ Add address'}</button></div>
                  {addresses.length > 0 ? addresses.map(address => <label key={address.id} className={`flex cursor-pointer gap-2 rounded-xl border bg-white p-3 text-xs ${String(selectedAddress) === String(address.id) ? 'border-[#536b4d] ring-1 ring-[#536b4d]/30' : 'border-[#e8dcc4]'}`}>
                    <input type="radio" name="mini-cart-address" value={address.id} checked={String(selectedAddress) === String(address.id)} onChange={() => setSelectedAddress(String(address.id))} className="mt-0.5 accent-[#35533c]"/>
                    <span className="min-w-0"><strong className="block text-[#263d31]">{address.full_name || address.fullName} · {address.label || 'Address'}</strong><span className="mt-1 block leading-5 text-stone-500">{address.address_line1 || address.street_address || address.line1}{address.address_line2 ? `, ${address.address_line2}` : ''}, {address.city}, {address.state} {address.pincode || address.postal_code}</span><span className="mt-1 block text-stone-500">{address.phone || address.phone_number}</span></span>
                  </label>) : !addressFormOpen && <p className="rounded-xl border border-dashed border-[#d5cbb9] bg-white p-3 text-xs leading-5 text-stone-600">Add a delivery address here to finish your order without leaving the cart.</p>}
                  {addressFormOpen && <form onSubmit={saveAddress} className="grid grid-cols-2 gap-2 rounded-xl border border-[#e8dcc4] bg-white p-3">
                    <label className="col-span-2 text-[10px] font-semibold text-stone-600">Full name<input required autoComplete="name" value={addressForm.fullName} onChange={event => setAddressForm(current => ({ ...current, fullName: event.target.value }))} className="mt-1 w-full rounded-lg border border-stone-200 px-2.5 py-2 text-xs"/></label>
                    <label className="col-span-2 text-[10px] font-semibold text-stone-600">Phone<input required type="tel" autoComplete="tel" value={addressForm.phone} onChange={event => setAddressForm(current => ({ ...current, phone: event.target.value }))} className="mt-1 w-full rounded-lg border border-stone-200 px-2.5 py-2 text-xs"/></label>
                    <label className="col-span-2 text-[10px] font-semibold text-stone-600">Address line 1<input required autoComplete="address-line1" value={addressForm.addressLine1} onChange={event => setAddressForm(current => ({ ...current, addressLine1: event.target.value }))} className="mt-1 w-full rounded-lg border border-stone-200 px-2.5 py-2 text-xs"/></label>
                    <label className="col-span-2 text-[10px] font-semibold text-stone-600">Address line 2 (optional)<input autoComplete="address-line2" value={addressForm.addressLine2} onChange={event => setAddressForm(current => ({ ...current, addressLine2: event.target.value }))} className="mt-1 w-full rounded-lg border border-stone-200 px-2.5 py-2 text-xs"/></label>
                    <label className="text-[10px] font-semibold text-stone-600">City<input required autoComplete="address-level2" value={addressForm.city} onChange={event => setAddressForm(current => ({ ...current, city: event.target.value }))} className="mt-1 w-full rounded-lg border border-stone-200 px-2.5 py-2 text-xs"/></label>
                    <label className="text-[10px] font-semibold text-stone-600">State<input required autoComplete="address-level1" value={addressForm.state} onChange={event => setAddressForm(current => ({ ...current, state: event.target.value }))} className="mt-1 w-full rounded-lg border border-stone-200 px-2.5 py-2 text-xs"/></label>
                    <label className="col-span-2 text-[10px] font-semibold text-stone-600">PIN code<input required inputMode="numeric" autoComplete="postal-code" value={addressForm.pincode} onChange={event => setAddressForm(current => ({ ...current, pincode: event.target.value }))} className="mt-1 w-full rounded-lg border border-stone-200 px-2.5 py-2 text-xs"/></label>
                    <button disabled={addressSaving} className="col-span-2 rounded-lg bg-[#35533c] px-3 py-2.5 text-xs font-bold text-white disabled:opacity-50">{addressSaving ? 'Saving address…' : 'Save delivery address'}</button>
                  </form>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[['STANDARD', 'Standard', shippingCost === 0 ? 'Free' : formatPrice(standardShippingCost)], ['EXPRESS', 'Express', rulePreview?.freeShipping ? 'Free' : formatPrice(expressShippingCost)]].map(([value, label, cost]) => <button type="button" key={value} onClick={() => setShippingMethod(value)} aria-pressed={shippingMethod === value} className={`rounded-xl border bg-white p-3 text-left ${shippingMethod === value ? 'border-[#536b4d] ring-1 ring-[#536b4d]/30' : 'border-[#e8dcc4]'}`}><span className="block text-xs font-semibold text-[#263d31]">{label}</span><span className="mt-1 block text-[10px] text-stone-500">{cost}</span></button>)}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-[#35533c]">Payment method</p>
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#e8dcc4] bg-white p-3 text-xs"><input type="radio" name="mini-cart-payment" checked={paymentMode === 'COD'} onChange={() => setPaymentMode('COD')} className="accent-[#35533c]"/>Cash on delivery</label>
                  <label className="flex cursor-pointer items-center justify-between gap-2 rounded-xl border border-[#e8dcc4] bg-white p-3 text-xs"><span className="flex items-center gap-2"><input type="radio" name="mini-cart-payment" checked={paymentMode === 'WALLET'} onChange={() => { setPaymentMode('WALLET'); setImpactAmount(0); }} className="accent-[#35533c]"/>Bhumivera wallet</span><span className="text-stone-500">Balance {formatPrice(walletBalance)}</span></label>
                </div>

                {paymentMode === 'COD' && <div className="rounded-xl border border-[#d7dfce] bg-white p-3">
                  <p className="flex items-center gap-2 text-xs font-semibold text-[#35533c]"><Leaf size={15}/>An optional pledge, with a clear record</p>
                  <p className="mt-1 text-[10px] leading-4 text-stone-500">Your purchase alone is not counted as an environmental contribution. If you choose to pledge, it is recorded after delivery and cash reconciliation; see the public ledger for verified updates.</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">{[0, 50, 100, 250].map(amount => <button key={amount} type="button" aria-pressed={impactAmount === amount} onClick={() => setImpactAmount(amount)} className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold ${impactAmount === amount ? 'border-[#35533c] bg-[#35533c] text-white' : 'border-[#e8dcc4] text-[#35533c]'}`}>{amount ? formatPrice(amount) : 'No pledge'}</button>)}</div>
                  {impactAmount > 0 && <select aria-label="Choose pledge focus" value={impactProject} onChange={event => setImpactProject(event.target.value)} className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-xs"><option value="native-trees">Native tree restoration</option><option value="river-care">River care</option><option value="community-care">Community care</option></select>}
                  {impactAmount > 0 && <Link to="/impact" onClick={() => setIsCartOpen(false)} className="mt-2 inline-block text-[10px] font-semibold text-[#536b4d] underline">Read the impact ledger</Link>}
                </div>}
                <label className="block text-[10px] font-semibold text-stone-600">Delivery note (optional)<textarea rows={2} value={orderNotes} onChange={event => setOrderNotes(event.target.value)} className="mt-1 w-full resize-none rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs" placeholder="Anything the delivery team should know?"/></label>
              </>}
            </section>}

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
            {checkoutOpen && <div className="flex justify-between text-stone-600"><span>{shippingMethod === 'EXPRESS' ? 'Express delivery' : 'Standard delivery'}</span><span>{shippingCost ? formatPrice(shippingCost) : 'Free'}</span></div>}
            {checkoutOpen && impactAmount > 0 && paymentMode === 'COD' && <div className="flex justify-between text-[#536b4d]"><span>Optional nature pledge</span><span>{formatPrice(impactAmount)}</span></div>}
            <div className="flex justify-between border-t border-[#f0e8da] pt-2 text-sm font-bold text-[#2C3E2D]"><span>{checkoutOpen ? 'Order total' : 'Estimated total*'}</span><span>{formatPrice(checkoutOpen ? finalTotal : Math.max(0, subtotal - discount - couponDiscount))}</span></div>
          </div>
          {checkoutOpen
            ? <form onSubmit={placeOrder}>
              <button type="submit" disabled={placingOrder || !user || (paymentMode === 'WALLET' && walletBalance < finalTotal)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C3E2D] px-4 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-md transition hover:bg-[#1b2c20] disabled:cursor-not-allowed disabled:opacity-50">
                {placingOrder ? 'Preparing your order…' : <>{paymentMode === 'COD' ? 'Place order · cash on delivery' : 'Place wallet order'} <ArrowRight size={16}/></>}
              </button>
              <button type="button" onClick={() => setCheckoutOpen(false)} className="mt-2 w-full py-2 text-xs font-semibold text-stone-500 hover:text-[#2C3E2D]">Back to cart</button>
              {paymentMode === 'WALLET' && walletBalance < finalTotal && <p className="mt-1 text-center text-[10px] text-rose-700">Add funds to your wallet or choose cash on delivery.</p>}
              <p className="mt-1 text-center text-[9px] leading-4 text-stone-500">Your selected address, delivery, payment and pledge are confirmed before placing this order.</p>
            </form>
            : <button type="button" onClick={continueToCheckout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#8b5a2b] px-4 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-md transition hover:bg-[#6b4421]">Continue to checkout <ArrowRight size={16}/></button>}
          {!checkoutOpen && <p className="mt-2 text-center text-[9px] text-stone-400">Shipping and final discounts are confirmed at checkout.</p>}
        </footer>}
      </aside>
    </div>
  );
}
