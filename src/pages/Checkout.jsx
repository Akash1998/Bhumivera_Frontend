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
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BASE_URL, orders, addresses, wallet, coupons as couponApi } from '../services/api';
import { haptics } from '../utils/haptics';
import { getProductImageUrl } from '../utils/productImageUrl';

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
  const freeShippingFromCoupon =
    appliedCoupon?.rewardType === 'free_shipping' || Boolean(rulePreview?.freeShipping);

  const shippingCost =
    deliveryType === 'express'
      ? subtotal >= 799
        ? 150
        : 250
      : freeShippingFromCoupon || subtotal >= 500
      ? 0
      : 50;

  const pointsBalance = Number(loyalty?.pointsBalance || 0);
  const pointsPerRupee = Math.max(1, Number(loyalty?.redemptionPointsPerRupee || 10));
  const maxRedemptionPct = Number(loyalty?.maxRedemptionPercent || 45);
  const minRedeemPts = Number(loyalty?.minimumRedemptionPoints || 100);
  const eligibleAfterDiscount = Math.max(0, subtotal - totalDiscount);
  const maxPointsByCap = Math.floor(((eligibleAfterDiscount * maxRedemptionPct) / 100) * pointsPerRupee);
  const redeemablePoints =
    loyalty?.enabled && pointsBalance >= minRedeemPts ? Math.min(pointsBalance, maxPointsByCap) : 0;
  const loyaltyDiscount = redeemLoyalty ? Math.floor(redeemablePoints / pointsPerRupee) : 0;

  const total = Math.max(0, subtotal - totalDiscount - loyaltyDiscount + shippingCost);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/shop');
      return;
    }

    const fetchInitialData = async () => {
      try {
        const [addrRes, walletRes, pubCouponsRes, myCouponsRes] = await Promise.all([
          addresses.get(),
          wallet.getBalance().catch(() => ({ data: { balance: 0 } })),
          couponApi.getPublicActive().catch(() => ({ data: { coupons: [] } })),
          couponApi.getMine().catch(() => ({ data: { coupons: [] } })),
        ]);
        const list = addrRes.data?.addresses || addrRes.data?.data || [];
        setUserAddresses(list);
        if (list.length > 0) {
          const defaultAddr = list.find((a) => a.is_default) || list[0];
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
    <div className="min-h-screen bg-[#070a0e] text-[#e2e8f0] py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <span className="font-royal text-[10px] font-bold uppercase tracking-[0.26em] text-[#d4af37] block mb-2">Bhumivera Botanical Dispatch</span>
          <h1 className="font-serif text-3xl font-bold md:text-5xl">
            <span className="font-headline-gold">Secure</span> <span className="font-headline-silver">Checkout</span>
          </h1>
          <div className="gold-hairline my-3 w-48" />
          <p className="text-xs text-[#cbd5e1] uppercase tracking-wider">Artisanal Small-Batch Custody · Direct Lab Dispatch</p>
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
            <div className="two-tone-panel rounded-2xl p-6 sm:p-8 border border-white/15 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d4af37] text-xs font-black text-[#070a0e]">1</span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">Shipping Address &amp; Delivery</h2>
                </div>
                {step === 2 && (
                  <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-[#d4af37] underline tracking-wider uppercase">
                    Edit
                  </button>
                )}
              </div>

              {step === 1 ? (
                <div className="mt-6 space-y-5">
                  {userAddresses.length === 0 ? (
                    <div className="rounded-xl border border-white/15 bg-[#0a1017] p-6 text-center">
                      <p className="text-sm text-[#cbd5e1]">No saved addresses found.</p>
                      <button
                        type="button"
                        onClick={() => navigate('/address-book')}
                        className="mt-4 rounded-xl btn-gold-luxury px-5 py-2.5 text-xs font-bold"
                      >
                        Add New Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {userAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`cursor-pointer rounded-xl border p-4 transition-all ${
                            selectedAddressId === addr.id
                              ? 'border-[#d4af37] bg-[#0a1017] ring-1 ring-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.18)]'
                              : 'border-white/15 bg-[#0d1520] hover:border-white/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-bold text-sm text-white">{addr.full_name}</span>
                            {addr.is_default ? (
                              <span className="rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 px-2 py-0.5 text-[9px] font-bold text-[#faeec7] uppercase tracking-wider">Default</span>
                            ) : null}
                          </div>
                          <p className="mt-2 text-xs text-[#cbd5e1] leading-relaxed">
                            {addr.street_address || addr.line1}, {addr.city}, {addr.state} - {addr.postal_code || addr.pincode}
                          </p>
                          <p className="mt-1 text-xs text-[#94a3b8]">Phone: {addr.phone_number || addr.phone}</p>
                          {(addr.latitude && addr.longitude) || addr.google_maps_url ? (
                            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#d4af37]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#faeec7] border border-[#d4af37]/30">
                              <MapPin className="h-3 w-3 text-[#d4af37]" /> GPS Verified Location
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Delivery Method Selector */}
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d4af37] mb-3">Delivery Speed &amp; Handling</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('standard')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          deliveryType === 'standard'
                            ? 'border-[#d4af37] bg-[#0a1017] ring-1 ring-[#d4af37]'
                            : 'border-white/15 bg-[#0d1520] hover:border-white/30'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-white">Standard Botanical Dispatch</span>
                          <span className="text-[#faeec7] font-serif">
                            {freeShippingFromCoupon || subtotal >= 500 ? 'FREE' : '₹50'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#94a3b8] mt-1.5 leading-relaxed">4–6 business days (Complimentary on ₹500+)</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryType('express')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          deliveryType === 'express'
                            ? 'border-[#d4af37] bg-[#0a1017] ring-1 ring-[#d4af37]'
                            : 'border-white/15 bg-[#0d1520] hover:border-white/30'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-white">Priority Express Air</span>
                          <span className="text-[#d4af37] font-serif">₹{subtotal >= 799 ? 150 : 250}</span>
                        </div>
                        <p className="text-[11px] text-[#94a3b8] mt-1.5 leading-relaxed">Expedited 2–3 business day courier priority</p>
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
                <div className="mt-3 text-xs text-[#cbd5e1]">
                  <strong className="text-white">{userAddresses.find((a) => a.id === selectedAddressId)?.full_name}</strong> •{' '}
                  {userAddresses.find((a) => a.id === selectedAddressId)?.city} ({userAddresses.find((a) => a.id === selectedAddressId)?.postal_code || 'Verified'}) •{' '}
                  <span className="uppercase font-semibold text-[#d4af37]">{deliveryType} Delivery</span>
                </div>
              )}
            </div>

            {/* Step 2: Payment */}
            <div className="two-tone-panel rounded-2xl p-6 sm:p-8 border border-white/15 shadow-xl">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d4af37] text-xs font-black text-[#070a0e]">2</span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">Payment Method</h2>
              </div>

              {step === 2 && (
                <div className="mt-6 space-y-4">
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/15 bg-[#0a1017] p-4 transition hover:border-[#d4af37]/60">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMode === 'online'}
                        onChange={() => setPaymentMode('online')}
                        className="accent-[#d4af37]"
                      />
                      <div>
                        <span className="font-semibold text-sm text-white">UPI, Cards, NetBanking (Razorpay)</span>
                        <p className="text-xs text-[#94a3b8]">Instant confirmation with GPay, PhonePe, Paytm, or Credit/Debit Cards</p>
                      </div>
                    </div>
                    <CreditCard className="h-5 w-5 text-[#d4af37]" />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/15 bg-[#0a1017] p-4 transition hover:border-[#d4af37]/60">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMode === 'WALLET'}
                        onChange={() => setPaymentMode('WALLET')}
                        disabled={walletBalance < total}
                        className="accent-[#d4af37]"
                      />
                      <div>
                        <span className="font-semibold text-sm text-white">Bhumivera Wallet</span>
                        <p className="text-xs text-[#94a3b8]">
                          Available Balance: <strong className="text-[#faeec7]">₹{walletBalance.toFixed(2)}</strong> {walletBalance < total ? '(Insufficient funds)' : ''}
                        </p>
                      </div>
                    </div>
                    <Wallet className="h-5 w-5 text-[#d4af37]" />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/15 bg-[#0a1017] p-4 transition hover:border-[#d4af37]/60">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMode === 'COD'}
                        onChange={() => setPaymentMode('COD')}
                        className="accent-[#d4af37]"
                      />
                      <div>
                        <span className="font-semibold text-sm text-white">Cash on Delivery (COD)</span>
                        <p className="text-xs text-[#94a3b8]">Pay cash or scan courier QR at doorstep</p>
                      </div>
                    </div>
                    <Truck className="h-5 w-5 text-[#d4af37]" />
                  </label>

                  <p className="mt-4 text-center text-xs leading-5 text-[#94a3b8]">
                    By placing your order, you agree to our{' '}
                    <Link to="/legal?section=terms" target="_blank" rel="noreferrer" className="font-semibold text-white underline underline-offset-2">Conditions of Sale</Link>
                    {' '}and acknowledge the{' '}
                    <Link to="/legal?section=privacy" target="_blank" rel="noreferrer" className="font-semibold text-white underline underline-offset-2">Privacy Notice</Link>.
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
            <div className="two-tone-panel-gold rounded-2xl p-6 border border-[#d4af37]/35 shadow-xl">
              <h3 className="font-serif text-xl font-bold text-white mb-2">Order Summary</h3>
              <div className="gold-hairline mb-4" />
              <div className="divide-y divide-white/10">
                {cartItems.map((item) => (
                  <div key={item.id || item.product_id} className="flex items-center justify-between py-2.5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={getProductImageUrl(item.image || item.image_url || item.images) || '/logo.webp'}
                        alt={item.name}
                        className="h-10 w-10 rounded-lg object-cover border border-white/15 bg-[#070a0e]"
                      />
                      <div>
                        <p className="font-serif font-bold text-white line-clamp-1">{item.name}</p>
                        <p className="text-[#94a3b8]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-[#d4af37]">
                      ₹{((Number(item.discount_price || item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tamper-Proof Coupon Box */}
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                  <Ticket className="h-3.5 w-3.5 text-[#d4af37]" /> Apply Promo / Voucher
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl bg-[#0a1017] border border-[#d4af37]/40 px-3.5 py-2.5 text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#faeec7]">{appliedCoupon.code}</span>
                      <p className="text-[11px] text-[#d4af37]">
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
                      className="flex-1 rounded-xl border border-white/15 bg-[#070a0e] px-3 py-2 text-xs font-mono uppercase text-white focus:border-[#d4af37] focus:outline-none"
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

                {couponMessage && <p className="text-[11px] font-medium text-[#faeec7]">{couponMessage}</p>}

                {/* Available Eligible Coupons Picker */}
                {!appliedCoupon && availableCoupons.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
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
                                ? 'border-white/15 hover:border-[#d4af37] bg-[#070a0e]'
                                : 'border-white/10 opacity-50 cursor-not-allowed bg-black/30'
                            }`}
                          >
                            <div>
                              <span className="font-mono font-bold text-[#d4af37]">{c.code}</span>
                              <span className="block text-[10px] text-[#cbd5e1]">
                                {c.reward_type === 'free_shipping'
                                  ? 'Free Shipping'
                                  : c.discount_type === 'percentage'
                                  ? `${c.discount_value}% OFF`
                                  : `₹${c.discount_value} OFF`}{' '}
                                {minOrd > 0 ? `(Min ₹${minOrd})` : ''}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-[#faeec7]">
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
                <div className="mt-3 pt-3 border-t border-white/10">
                  <label className="flex items-center justify-between cursor-pointer text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-[#cbd5e1]">
                      <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
                      Redeem {redeemablePoints} Points (-₹{Math.floor(redeemablePoints / pointsPerRupee)})
                    </span>
                    <input
                      type="checkbox"
                      checked={redeemLoyalty}
                      onChange={(e) => setRedeemLoyalty(e.target.checked)}
                      className="rounded accent-[#d4af37]"
                    />
                  </label>
                </div>
              )}

              {/* Totals Breakdown */}
              <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-xs text-[#cbd5e1]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                {ruleDiscount > 0 && (
                  <div className="flex justify-between text-[#d4af37]">
                    <span>Cart Tier Discount</span>
                    <span>-₹{ruleDiscount.toFixed(2)}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#d4af37] font-medium">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span>-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                {loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-[#faeec7] font-medium">
                    <span>Loyalty Redemption</span>
                    <span>-₹{loyaltyDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping ({deliveryType})</span>
                  <span>
                    {shippingCost === 0 ? (
                      <strong className="text-[#faeec7]">FREE</strong>
                    ) : (
                      `₹${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-t border-white/15 pt-2 text-sm font-bold text-white">
                  <span>Total Payable</span>
                  <span className="font-serif text-lg text-[#d4af37]">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#070a0e] border border-white/10 p-3 text-center text-[11px] text-[#cbd5e1]">
                <ShieldCheck className="h-4 w-4 text-[#d4af37]" /> 256-Bit Encrypted &amp; Serial Verified Lab Delivery
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
