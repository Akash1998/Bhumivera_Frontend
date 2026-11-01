import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CheckCircle2,
  MapPin,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Truck,
  Wallet,
  Ticket,
  Sparkles,
  X,
  Plus,
  Navigation,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BASE_URL, orders, addresses, wallet, coupons as couponApi } from '../services/api';
import { haptics } from '../utils/haptics';
import { getProductImageUrl } from '../utils/productImageUrl';
import { calculateReferralWalletRedemption, calculateTierDiscount } from '../utils/walletRedemption';
import { getCurrentCoordinates, reverseGeocodeCoordinates } from '../utils/geolocation';

export default function Checkout() {
  const {
    cartItems,
    clearCart,
    couponCode: cartCouponCode,
    couponDiscount: cartCouponDiscount,
    couponRewardType: cartCouponRewardType,
    loyalty,
    rulePreview,
    referralReward,
    applyCoupon: applyCartCoupon,
    removeCoupon: removeCartCoupon,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment & Review
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [deliveryType, setDeliveryType] = useState('standard');
  const [paymentMode, setPaymentMode] = useState('online');
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Quick Address Bottom Sheet / Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    full_name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    is_default: true,
    latitude: null,
    longitude: null,
    google_maps_url: '',
  });

  // Coupon & Loyalty state on Checkout
  const [promoInput, setPromoInput] = useState(cartCouponCode || '');
  const [appliedCoupon, setAppliedCoupon] = useState(
    cartCouponCode
      ? {
          code: cartCouponCode,
          discount: Number(cartCouponDiscount || 0),
          rewardType: cartCouponRewardType || 'standard',
        }
      : null
  );
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');
  const [redeemLoyalty, setRedeemLoyalty] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number(item.discount_price || item.price) || 0;
    return acc + price * (Number(item.quantity) || 1);
  }, 0);

  const ruleDiscount = Number(rulePreview?.totalDiscount || 0);
  const couponDiscount = Number(appliedCoupon?.discount || 0);
  const totalDiscount = Math.min(subtotal, ruleDiscount + couponDiscount);
  const tierDiscount = calculateTierDiscount(
    subtotal,
    totalDiscount,
    loyalty?.currentTier,
    Boolean(loyalty?.enabled),
  );
  const referralWalletAmount = calculateReferralWalletRedemption(
    referralReward?.balance,
    subtotal,
    Math.max(0, subtotal - totalDiscount - tierDiscount),
    referralReward?.tiers,
    referralReward?.welcomeBonusBalance,
  );
  const freeShippingFromCoupon =
    appliedCoupon?.rewardType === 'free_shipping' || Boolean(rulePreview?.freeShipping);

  const shippingCost =
    deliveryType === 'express'
      ? subtotal >= 799
        ? 150
        : 250
      : freeShippingFromCoupon || subtotal >= 599
      ? 0
      : 50;

  const pointsBalance = Number(loyalty?.pointsBalance || 0);
  const pointsPerRupee = Math.max(1, Number(loyalty?.redemptionPointsPerRupee || 10));
  const maxRedemptionPct = Number(loyalty?.maxRedemptionPercent || 10);
  const minRedeemPts = Number(loyalty?.minimumRedemptionPoints || 100);
  const eligibleAfterDiscount = Math.max(0, subtotal - totalDiscount - tierDiscount - referralWalletAmount);
  const maxPointsByCap = Math.floor(((eligibleAfterDiscount * maxRedemptionPct) / 100) * pointsPerRupee);
  const redeemablePoints =
    loyalty?.enabled && pointsBalance >= minRedeemPts ? Math.min(pointsBalance, maxPointsByCap) : 0;
  const loyaltyDiscount = redeemLoyalty ? Math.floor(redeemablePoints / pointsPerRupee) : 0;

  const total = Math.max(0, subtotal - totalDiscount - tierDiscount - referralWalletAmount - loyaltyDiscount + shippingCost);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/shop');
      return;
    }

    const fetchInitialData = async () => {
      try {
        const [addrRes, walletRes, pubCouponsRes, myCouponsRes] = await Promise.all([
          addresses.get().catch(() => ({ data: { addresses: [] } })),
          wallet.getBalance().catch(() => ({ data: { balance: 0 } })),
          couponApi.getPublicActive().catch(() => ({ data: { coupons: [] } })),
          couponApi.getMine().catch(() => ({ data: { coupons: [] } })),
        ]);
        const serverList = addrRes.data?.addresses || addrRes.data?.data || [];
        let guestList = [];
        try {
          guestList = JSON.parse(localStorage.getItem('bhumivera_guest_addresses') || '[]');
        } catch (e) {
          console.warn('[GUEST_ADDRESS_PARSE_WARN]', e);
        }
        const mergedAddresses = [...serverList];
        for (const ga of guestList) {
          if (!mergedAddresses.some(sa => String(sa.id) === String(ga.id))) {
            mergedAddresses.push(ga);
          }
        }
        setUserAddresses(mergedAddresses);
        if (mergedAddresses.length > 0) {
          const defaultAddr = mergedAddresses.find((a) => a.is_default) || mergedAddresses[0];
          setSelectedAddressId(defaultAddr.id);
        }
        setWalletBalance(Number(walletRes.data?.balance || 0));

        const mergedCoupons = [
          ...(myCouponsRes.data?.coupons || []),
          ...(pubCouponsRes.data?.coupons || []),
        ];
        const uniqueByCode = [];
        const seen = new Set();
        for (const c of mergedCoupons) {
          if (c?.code && !seen.has(c.code)) {
            seen.add(c.code);
            uniqueByCode.push(c);
          }
        }
        setAvailableCoupons(uniqueByCode);
      } catch (err) {
        console.error('[CHECKOUT_INIT_ERROR]', err);
      }
    };

    fetchInitialData();
  }, [cartItems, navigate]);

  const handleDetectAddressGps = async () => {
    setDetectingGps(true);
    try {
      const position = await getCurrentCoordinates();
      const lat = Number(position.latitude.toFixed(7));
      const lng = Number(position.longitude.toFixed(7));
      const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      let geocoded = {};
      try {
        geocoded = await reverseGeocodeCoordinates(lat, lng);
      } catch (e) {
        console.warn('[GEOCODE_WARN]', e);
      }
      setAddressForm(prev => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        google_maps_url: mapsUrl,
        line1: prev.line1 || geocoded.addressLine1 || '',
        city: prev.city || geocoded.city || '',
        state: prev.state || geocoded.state || '',
        postal_code: prev.postal_code || geocoded.pincode || '',
      }));
    } catch (e) {
      console.warn('[GPS_DETECT_ERROR]', e);
    } finally {
      setDetectingGps(false);
    }
  };

  const handleQuickSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.full_name || !addressForm.phone || !addressForm.line1 || !addressForm.city || !addressForm.state || !addressForm.postal_code) {
      setError('Please fill in all required address fields.');
      return;
    }
    setSavingAddress(true);
    setError(null);

    const generatedId = Date.now();
    const newAddress = {
      id: generatedId,
      label: addressForm.label,
      full_name: addressForm.full_name,
      name: addressForm.full_name,
      phone_number: addressForm.phone,
      phone: addressForm.phone,
      street_address: addressForm.line1,
      line1: addressForm.line1,
      address_line1: addressForm.line1,
      line2: addressForm.line2,
      city: addressForm.city,
      state: addressForm.state,
      postal_code: addressForm.postal_code,
      pincode: addressForm.postal_code,
      country: addressForm.country || 'India',
      is_default: !!addressForm.is_default,
      latitude: addressForm.latitude,
      longitude: addressForm.longitude,
      google_maps_url: addressForm.google_maps_url,
    };

    try {
      if (user) {
        const res = await addresses.create(newAddress);
        const serverSaved = res.data?.addresses || res.data?.data;
        if (Array.isArray(serverSaved) && serverSaved.length > 0) {
          setUserAddresses(serverSaved);
          const matched = serverSaved.find(s => s.street_address === newAddress.street_address) || serverSaved[0];
          setSelectedAddressId(matched.id);
          setShowAddressModal(false);
          setSavingAddress(false);
          haptics.impactLight();
          return;
        }
      }
    } catch (saveErr) {
      console.warn('[CHECKOUT_ADDRESS_API_SAVE_WARN]', saveErr);
    }

    // Always ensure local storage persistence fallback
    try {
      const saved = JSON.parse(localStorage.getItem('bhumivera_guest_addresses') || '[]');
      const updated = [newAddress, ...saved];
      localStorage.setItem('bhumivera_guest_addresses', JSON.stringify(updated));
    } catch (e) {
      console.warn('[GUEST_ADDRESS_SAVE_WARN]', e);
    }

    setUserAddresses(prev => [newAddress, ...prev]);
    setSelectedAddressId(newAddress.id);
    setShowAddressModal(false);
    setSavingAddress(false);
    haptics.impactLight();
  };

  const handleApplyCouponCode = async (codeToApply = promoInput) => {
    const clean = String(codeToApply || '').trim().toUpperCase();
    if (!clean) return;
    setApplyingCoupon(true);
    setError(null);
    setCouponMessage('');
    try {
      const res = await couponApi.validate(clean, subtotal, { paymentMode, items: cartItems });
      const payload = res.data?.data || res.data;
      const discountAmt = Number(payload?.discountAmount ?? payload?.discount ?? 0);
      const rewardType = payload?.coupon?.reward_type || (payload?.freeShipping ? 'free_shipping' : 'standard');
      setPromoInput(clean);
      setAppliedCoupon({
        code: clean,
        discount: discountAmt,
        rewardType,
      });
      if (typeof applyCartCoupon === 'function') {
        await applyCartCoupon(clean).catch(() => {});
      }
      setCouponMessage(
        rewardType === 'free_shipping'
          ? `Coupon ${clean} applied — Free Shipping unlocked!`
          : `Coupon ${clean} applied — You saved ₹${discountAmt.toFixed(2)}!`
      );
      haptics.notificationSuccess();
    } catch (err) {
      setAppliedCoupon(null);
      setError(err.response?.data?.message || 'Invalid or already redeemed coupon code.');
      haptics.notificationError();
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setPromoInput('');
    setCouponMessage('');
    if (typeof removeCartCoupon === 'function') {
      removeCartCoupon();
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please choose or enter a delivery address.');
      setStep(1);
      return;
    }
    setLoading(true);
    setError(null);
    haptics.impactMedium();

    const baseOrderPayload = {
      addressId: selectedAddressId,
      deliveryType,
      paymentMode,
      couponCode: appliedCoupon?.code || undefined,
      loyaltyPointsToRedeem: redeemLoyalty ? redeemablePoints : 0,
      termsAccepted: true,
    };

    try {
      if (paymentMode === 'online') {
        const { data: rzOrder } = await axios.post(
          `${BASE_URL}/api/create-order`,
          { amount: Math.round(total * 100), purpose: 'checkout' },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );

        const options = {
          key: rzOrder.key_id,
          amount: rzOrder.amount,
          currency: 'INR',
          name: 'Bhumivera',
          description: 'Botanical Order Checkout',
          order_id: rzOrder.order_id,
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: user?.phone || '',
          },
          theme: { color: '#0b2419' },
          handler: async (response) => {
            try {
              const orderPayload = {
                ...baseOrderPayload,
                paymentMode: 'online',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              };
              const { data: placed } = await orders.place(orderPayload);
              await clearCart();
              haptics.notificationSuccess();
              navigate(`/order-success/${placed.orderId}`);
            } catch (placeErr) {
              setError(placeErr.response?.data?.message || 'Payment verified but order creation failed.');
            }
          },
        };

        if (typeof window !== 'undefined' && window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
            const rzp = new window.Razorpay(options);
            rzp.open();
          };
          document.body.appendChild(script);
        }
      } else {
        const { data: placed } = await orders.place(baseOrderPayload);
        await clearCart();
        haptics.notificationSuccess();
        navigate(`/order-success/${placed.orderId}`);
      }
    } catch (err) {
      console.error('[CHECKOUT_ERROR]', err);
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
      haptics.notificationError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#14291F] text-[#FAF7F2] py-12 px-4 sm:px-6 font-sans">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <span className="font-royal text-[10px] font-bold uppercase tracking-[0.26em] text-[#D4AF37] block mb-2">Bhumivera Botanical Dispatch</span>
          <h1 className="font-serif text-3xl font-bold md:text-5xl">
            <span className="font-headline-gold">Secure</span> <span className="font-headline-silver">Checkout</span>
          </h1>
          <div className="gold-hairline my-3 w-48" />
          <p className="text-xs text-[#DFD7C4] uppercase tracking-wider">Artisanal Small-Batch Custody · Direct Lab Dispatch</p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-rose-950/60 border border-rose-500/40 p-3.5 text-sm text-rose-200 flex items-center justify-between">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} className="text-rose-300 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Main Steps */}
          <div className="space-y-6 lg:col-span-2">
            {/* Step 1: Address & Delivery Speed */}
            <div className="two-tone-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/25 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#244A38] pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37] text-xs font-black text-[#14291F]">1</span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">Shipping Address &amp; Delivery</h2>
                </div>
                {step === 2 && (
                  <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-[#D4AF37] underline tracking-wider uppercase">
                    Edit
                  </button>
                )}
              </div>

              {step === 1 ? (
                <div className="mt-6 space-y-5">
                  {userAddresses.length === 0 ? (
                    <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#102219]/90 backdrop-blur-md p-6 sm:p-8 text-center shadow-xl">
                      <div className="w-12 h-12 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-3 text-[#D4AF37]">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-serif font-bold text-white mb-1">No Delivery Address Found</h3>
                      <p className="text-xs text-[#DFD7C4] mb-5 max-w-sm mx-auto">Add your delivery location to unlock 1-click lab dispatch and live stock reservation.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setAddressForm(f => ({ ...f, full_name: user?.name || '', phone: user?.phone || '' }));
                          setShowAddressModal(true);
                        }}
                        className="btn-gold-luxury px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
                      >
                        <Plus className="w-4 h-4" /> Add Delivery Address
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#DFD7C4]">Deliver to Address:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setAddressForm(f => ({ ...f, full_name: user?.name || '', phone: user?.phone || '' }));
                            setShowAddressModal(true);
                          }}
                          className="text-xs text-[#D4AF37] hover:text-[#FCE096] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors p-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add New Address
                        </button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {userAddresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`cursor-pointer rounded-2xl border p-4 transition-all relative ${
                              selectedAddressId === addr.id
                                ? 'border-[#D4AF37] bg-[#14231C]/90 ring-1 ring-[#D4AF37] shadow-[0_0_24px_rgba(200,155,60,0.22)]'
                                : 'border-[#D4AF37]/20 bg-[#1C382B]/60 backdrop-blur-md hover:border-[#D4AF37]/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-serif font-bold text-sm text-white">{addr.full_name}</span>
                              {addr.is_default ? (
                                <span className="rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 px-2 py-0.5 text-[9px] font-bold text-[#FCE096] uppercase tracking-wider">Default</span>
                              ) : null}
                            </div>
                            <p className="mt-2 text-xs text-[#DFD7C4] leading-relaxed">
                              {addr.street_address || addr.line1}, {addr.city}, {addr.state} - {addr.postal_code || addr.pincode}
                            </p>
                            <p className="mt-1 text-xs text-[#9BB0A5]">Phone: {addr.phone_number || addr.phone}</p>
                            {(addr.latitude && addr.longitude) || addr.google_maps_url ? (
                              <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#FCE096] border border-[#D4AF37]/30">
                                <MapPin className="h-3 w-3 text-[#D4AF37]" /> GPS Verified Location
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Delivery Method Selector */}
                  <div className="pt-3 border-t border-[#244A38]">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4AF37] mb-3">Delivery Speed &amp; Handling</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('standard')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          deliveryType === 'standard'
                            ? 'border-[#D4AF37] bg-[#102219] ring-1 ring-[#D4AF37]'
                            : 'border-[#244A38] bg-[#1C382B] hover:border-[#D4AF37]/40'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-white">Standard Botanical Dispatch</span>
                          <span className="text-[#FCE096] font-serif">
                            {freeShippingFromCoupon || subtotal >= 599 ? 'FREE' : '₹50'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#9BB0A5] mt-1.5 leading-relaxed">4–6 business days (Complimentary on ₹599+)</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryType('express')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          deliveryType === 'express'
                            ? 'border-[#D4AF37] bg-[#102219] ring-1 ring-[#D4AF37]'
                            : 'border-[#244A38] bg-[#1C382B] hover:border-[#D4AF37]/40'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-white">Priority Express Air</span>
                          <span className="text-[#D4AF37] font-serif">₹{subtotal >= 799 ? 150 : 250}</span>
                        </div>
                        <p className="text-[11px] text-[#9BB0A5] mt-1.5 leading-relaxed">Expedited 2–3 business day courier priority</p>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!selectedAddressId}
                    onClick={() => setStep(2)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl btn-gold-luxury py-3.5 text-xs font-bold uppercase tracking-widest disabled:opacity-40"
                  >
                    Continue to Payment <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-3 text-xs text-[#DFD7C4]">
                  <strong className="text-white">{userAddresses.find((a) => a.id === selectedAddressId)?.full_name}</strong> •{' '}
                  {userAddresses.find((a) => a.id === selectedAddressId)?.city} ({userAddresses.find((a) => a.id === selectedAddressId)?.postal_code || 'Verified'}) •{' '}
                  <span className="uppercase font-semibold text-[#D4AF37]">{deliveryType} Delivery</span>
                </div>
              )}
            </div>

            {/* Step 2: Payment */}
            <div className="two-tone-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/25 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-[#244A38] pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37] text-xs font-black text-[#14291F]">2</span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">Payment Method</h2>
              </div>

              {step === 2 && (
                <div className="mt-6 space-y-4">
                  <label className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    paymentMode === 'online'
                      ? 'border-[#D4AF37] bg-[#14231C]/90 ring-1 ring-[#D4AF37] shadow-[0_0_24px_rgba(200,155,60,0.2)]'
                      : 'border-[#D4AF37]/20 bg-[#102219]/70 backdrop-blur-md hover:border-[#D4AF37]/50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMode === 'online'}
                        onChange={() => setPaymentMode('online')}
                        className="accent-[#D4AF37]"
                      />
                      <div>
                        <span className="font-semibold text-sm text-white">UPI, Cards, NetBanking (Razorpay)</span>
                        <p className="text-xs text-[#9BB0A5]">Instant confirmation with GPay, PhonePe, Paytm, or Credit/Debit Cards</p>
                      </div>
                    </div>
                    <CreditCard className="h-5 w-5 text-[#D4AF37]" />
                  </label>

                  <label className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    paymentMode === 'WALLET'
                      ? 'border-[#D4AF37] bg-[#14231C]/90 ring-1 ring-[#D4AF37] shadow-[0_0_24px_rgba(200,155,60,0.2)]'
                      : 'border-[#D4AF37]/20 bg-[#102219]/70 backdrop-blur-md hover:border-[#D4AF37]/50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMode === 'WALLET'}
                        onChange={() => setPaymentMode('WALLET')}
                        disabled={walletBalance < total}
                        className="accent-[#D4AF37]"
                      />
                      <div>
                        <span className="font-semibold text-sm text-white">Bhumivera Wallet</span>
                        <p className="text-xs text-[#9BB0A5]">
                          Available Balance: <strong className="text-[#FCE096]">₹{walletBalance.toFixed(2)}</strong> {walletBalance < total ? '(Insufficient funds)' : ''}
                        </p>
                      </div>
                    </div>
                    <Wallet className="h-5 w-5 text-[#D4AF37]" />
                  </label>

                  <label className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    paymentMode === 'COD'
                      ? 'border-[#D4AF37] bg-[#14231C]/90 ring-1 ring-[#D4AF37] shadow-[0_0_24px_rgba(200,155,60,0.2)]'
                      : 'border-[#D4AF37]/20 bg-[#102219]/70 backdrop-blur-md hover:border-[#D4AF37]/50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMode === 'COD'}
                        onChange={() => setPaymentMode('COD')}
                        className="accent-[#D4AF37]"
                      />
                      <div>
                        <span className="font-semibold text-sm text-white">Cash on Delivery (COD)</span>
                        <p className="text-xs text-[#9BB0A5]">Pay cash or scan courier QR at doorstep</p>
                      </div>
                    </div>
                    <Truck className="h-5 w-5 text-[#D4AF37]" />
                  </label>

                  <p className="mt-4 text-center text-xs leading-5 text-[#9BB0A5]">
                    By placing your order, you agree to our{' '}
                    <Link to="/legal/conditions-of-use" target="_blank" rel="noreferrer" className="font-semibold text-white underline underline-offset-2">Conditions of Sale</Link>
                    {' '}and acknowledge the{' '}
                    <Link to="/legal/privacy-dpdp" target="_blank" rel="noreferrer" className="font-semibold text-white underline underline-offset-2">Privacy Notice</Link>.
                  </p>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handlePlaceOrder}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl btn-gold-luxury py-4 text-xs font-bold uppercase tracking-widest disabled:opacity-50"
                  >
                    {loading ? 'Processing Order...' : `Place Order (₹${total.toFixed(2)})`}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary & Tamper-Proof Coupon Sidebar */}
          <div className="space-y-4">
            <div className="two-tone-panel-gold rounded-3xl p-6 border border-[#D4AF37]/30 shadow-2xl">
              <h3 className="font-serif text-xl font-bold text-white mb-2">Order Summary</h3>
              <div className="gold-hairline mb-4" />
              <div className="divide-y divide-[#244A38]">
                {cartItems.map((item) => (
                  <div key={item.id || item.product_id} className="flex items-center justify-between py-2.5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={getProductImageUrl(item.image || item.image_url || item.images) || '/logo.webp'}
                        alt={item.name}
                        className="h-10 w-10 rounded-lg object-cover border border-[#244A38] bg-[#102219]"
                      />
                      <div>
                        <p className="font-serif font-bold text-white line-clamp-1">{item.name}</p>
                        <p className="text-[#9BB0A5]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-[#D4AF37]">
                      ₹{((Number(item.discount_price || item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tamper-Proof Coupon Box */}
              <div className="mt-4 pt-4 border-t border-[#244A38] space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                  <Ticket className="h-3.5 w-3.5 text-[#D4AF37]" /> Apply Promo / Voucher
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl bg-[#102219] border border-[#D4AF37]/40 px-3.5 py-2.5 text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#FCE096]">{appliedCoupon.code}</span>
                      <p className="text-[11px] text-[#D4AF37]">
                        {appliedCoupon.rewardType === 'free_shipping'
                          ? 'Free Shipping Applied'
                          : `Saved ₹${appliedCoupon.discount.toFixed(2)}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs font-bold text-rose-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="ENTER CODE"
                      className="flex-1 rounded-xl border border-[#244A38] bg-[#14291F] px-3 py-2 text-xs font-mono uppercase text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={applyingCoupon || !promoInput.trim()}
                      onClick={() => handleApplyCouponCode(promoInput)}
                      className="rounded-xl btn-gold-luxury px-4 py-2 text-xs font-bold disabled:opacity-50"
                    >
                      {applyingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                )}

                {couponMessage && <p className="text-[11px] font-medium text-[#FCE096]">{couponMessage}</p>}

                {/* Available Eligible Coupons Picker */}
                {!appliedCoupon && availableCoupons.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9BB0A5]">
                      Available Offers for You:
                    </p>
                    <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                      {availableCoupons.slice(0, 4).map((c) => {
                        const minOrd = Number(c.minimum_order_amount || c.min_order_value || 0);
                        const eligible = subtotal >= minOrd;
                        return (
                          <button
                            key={c.code}
                            type="button"
                            disabled={!eligible}
                            onClick={() => handleApplyCouponCode(c.code)}
                            className={`w-full text-left p-2 rounded-lg border text-[11px] transition flex items-center justify-between ${
                              eligible
                                ? 'border-[#244A38] hover:border-[#D4AF37] bg-[#14291F]'
                                : 'border-[#244A38]/40 opacity-50 cursor-not-allowed bg-[#102219]'
                            }`}
                          >
                            <div>
                              <span className="font-mono font-bold text-[#D4AF37]">{c.code}</span>
                              <span className="block text-[10px] text-[#DFD7C4]">
                                {c.reward_type === 'free_shipping'
                                  ? 'Free Shipping'
                                  : c.discount_type === 'percentage'
                                  ? `${c.discount_value}% OFF`
                                  : `₹${c.discount_value} OFF`}{' '}
                                {minOrd > 0 ? `(Min ₹${minOrd})` : ''}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-[#FCE096]">
                              {eligible ? 'Tap to Apply' : `Add ₹${Math.ceil(minOrd - subtotal)}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Loyalty Points Redemption Toggle */}
              {redeemablePoints > 0 && (
                <div className="mt-3 pt-3 border-t border-[#244A38]">
                  <label className="flex items-center justify-between cursor-pointer text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-[#DFD7C4]">
                      <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                      Redeem {redeemablePoints} Points (-₹{Math.floor(redeemablePoints / pointsPerRupee)})
                    </span>
                    <input
                      type="checkbox"
                      checked={redeemLoyalty}
                      onChange={(e) => setRedeemLoyalty(e.target.checked)}
                      className="rounded accent-[#D4AF37]"
                    />
                  </label>
                </div>
              )}

              {/* Totals Breakdown */}
              <div className="mt-4 space-y-2 border-t border-[#244A38] pt-4 text-xs text-[#DFD7C4]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                {ruleDiscount > 0 && (
                  <div className="flex justify-between text-[#D4AF37]">
                    <span>Cart Tier Discount</span>
                    <span>-₹{ruleDiscount.toFixed(2)}</span>
                  </div>
                )}
                {tierDiscount > 0 && (
                  <div className="flex justify-between text-[#D4AF37]">
                    <span>Loyalty Tier Discount</span>
                    <span>-₹{tierDiscount.toFixed(2)}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#D4AF37] font-medium">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span>-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                {referralWalletAmount > 0 && (
                  <div className="flex justify-between text-[#FCE096] font-medium">
                    <span>Shopping Wallet Credit</span>
                    <span>-₹{referralWalletAmount.toFixed(2)}</span>
                  </div>
                )}
                {loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-[#FCE096] font-medium">
                    <span>Loyalty Redemption</span>
                    <span>-₹{loyaltyDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping ({deliveryType})</span>
                  <span>
                    {shippingCost === 0 ? (
                      <strong className="text-[#FCE096]">FREE</strong>
                    ) : (
                      `₹${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#244A38] pt-2 text-sm font-bold text-white">
                  <span>Total Payable</span>
                  <span className="font-serif text-lg text-[#D4AF37]">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#102219] border border-[#244A38] p-3 text-center text-[11px] text-[#DFD7C4]">
                <ShieldCheck className="h-4 w-4 text-[#D4AF37]" /> 256-Bit Encrypted &amp; Serial Verified Lab Delivery
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK INLINE ADDRESS BOTTOM SHEET / MODAL */}
      {showAddressModal && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4"
          onClick={() => setShowAddressModal(false)}
        >
          <div 
            onClick={e => e.stopPropagation()} 
            className="w-full sm:max-w-xl bg-[#14291F] border border-[#D4AF37]/35 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90dvh] overflow-hidden animate-in slide-in-from-bottom duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#244A38] bg-[#102219]">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-serif font-bold text-base sm:text-lg text-white">Add Delivery Address</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAddressModal(false)} 
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#9BB0A5] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleQuickSaveAddress} className="p-5 overflow-y-auto space-y-4">
              {/* Type pills */}
              <div className="flex gap-2">
                {['Home', 'Work', 'Other'].map(lbl => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setAddressForm(f => ({ ...f, label: lbl }))}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all ${
                      addressForm.label === lbl
                        ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#FCE096]'
                        : 'border-[#244A38] bg-[#102219] text-[#9BB0A5]'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              {/* GPS Auto-detect banner */}
              <div className="rounded-xl border border-[#D4AF37]/30 bg-[#102219] p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" /> GPS Precise Pinpoint
                  </p>
                  <p className="text-[11px] text-[#9BB0A5] truncate mt-0.5">
                    {addressForm.latitude ? 'GPS Location Attached' : 'Auto-fill current address details via GPS'}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={detectingGps}
                  onClick={handleDetectAddressGps}
                  className="btn-silver-luxury px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0"
                >
                  {detectingGps ? 'Locating...' : addressForm.latitude ? 'Re-detect' : 'Use GPS'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#9BB0A5] block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.full_name}
                    onChange={e => setAddressForm(f => ({ ...f, full_name: e.target.value }))}
                    placeholder="Recipient name"
                    className="w-full rounded-xl border border-[#244A38] bg-[#0E1A14] px-3.5 py-2.5 text-xs text-white placeholder-[#9BB0A5]/60 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#9BB0A5] block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={e => setAddressForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-[#244A38] bg-[#0E1A14] px-3.5 py-2.5 text-xs text-white placeholder-[#9BB0A5]/60 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#9BB0A5] block mb-1">Street Address / House / Flat *</label>
                <input
                  type="text"
                  required
                  value={addressForm.line1}
                  onChange={e => setAddressForm(f => ({ ...f, line1: e.target.value }))}
                  placeholder="Flat No, Wing, Apartment, Street name"
                  className="w-full rounded-xl border border-[#244A38] bg-[#0E1A14] px-3.5 py-2.5 text-xs text-white placeholder-[#9BB0A5]/60 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#9BB0A5] block mb-1">Landmark / Area (Optional)</label>
                <input
                  type="text"
                  value={addressForm.line2}
                  onChange={e => setAddressForm(f => ({ ...f, line2: e.target.value }))}
                  placeholder="Near landmark, sector, or colony"
                  className="w-full rounded-xl border border-[#244A38] bg-[#0E1A14] px-3.5 py-2.5 text-xs text-white placeholder-[#9BB0A5]/60 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#9BB0A5] block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={e => setAddressForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="City"
                    className="w-full rounded-xl border border-[#244A38] bg-[#0E1A14] px-3.5 py-2.5 text-xs text-white placeholder-[#9BB0A5]/60 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#9BB0A5] block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={e => setAddressForm(f => ({ ...f, state: e.target.value }))}
                    placeholder="State"
                    className="w-full rounded-xl border border-[#244A38] bg-[#0E1A14] px-3.5 py-2.5 text-xs text-white placeholder-[#9BB0A5]/60 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#9BB0A5] block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    value={addressForm.postal_code}
                    onChange={e => setAddressForm(f => ({ ...f, postal_code: e.target.value }))}
                    placeholder="713301"
                    className="w-full rounded-xl border border-[#244A38] bg-[#0E1A14] px-3.5 py-2.5 text-xs text-white placeholder-[#9BB0A5]/60 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="btn-gold-luxury w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 active:scale-95 transition-transform"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {savingAddress ? 'Saving Delivery Address...' : 'Deliver to this Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
