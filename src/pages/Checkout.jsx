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
    <div className="min-h-screen bg-[#f4f2eb] px-4 py-8 text-[#1c2922] md:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-serif text-3xl font-bold md:text-4xl">Secure Checkout</h1>
        <p className="mt-1 text-sm text-stone-600">Complete your order with zero-waste packaging</p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-100 p-3.5 text-sm text-red-800 flex items-center justify-between">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          {/* Main Steps */}
          <div className="space-y-6 lg:col-span-2">
            {/* Step 1: Address & Delivery Speed */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0b2419] text-xs font-bold text-white">1</span>
                  <h2 className="font-serif text-xl font-semibold">Shipping Address & Delivery</h2>
                </div>
                {step === 2 && (
                  <button type="button" onClick={() => setStep(1)} className="text-xs font-semibold text-[#607552] underline">
                    Edit
                  </button>
                )}
              </div>

              {step === 1 ? (
                <div className="mt-4 space-y-4">
                  {userAddresses.length === 0 ? (
                    <div className="rounded-xl border border-stone-200 p-4 text-center">
                      <p className="text-sm text-stone-600">No saved addresses found.</p>
                      <button
                        type="button"
                        onClick={() => navigate('/address-book')}
                        className="mt-3 rounded-lg bg-[#0b2419] px-4 py-2 text-xs font-semibold text-white"
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
                          className={`cursor-pointer rounded-xl border p-4 transition ${
                            selectedAddressId === addr.id
                              ? 'border-[#0b2419] bg-[#f9f8f5] ring-2 ring-[#0b2419]'
                              : 'border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">{addr.full_name}</span>
                            {addr.is_default ? (
                              <span className="rounded bg-stone-200 px-1.5 py-0.5 text-[10px] text-stone-700">Default</span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-xs text-stone-600">
                            {addr.street_address || addr.line1}, {addr.city}, {addr.state} - {addr.postal_code || addr.pincode}
                          </p>
                          <p className="mt-1 text-xs text-stone-500">Phone: {addr.phone_number || addr.phone}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Delivery Method Selector */}
                  <div className="pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Delivery Speed</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('standard')}
                        className={`p-3.5 rounded-xl border text-left transition ${
                          deliveryType === 'standard'
                            ? 'border-[#0b2419] bg-[#f9f8f5] ring-1 ring-[#0b2419]'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span>Standard Botanical Dispatch</span>
                          <span className="text-emerald-700">
                            {freeShippingFromCoupon || subtotal >= 500 ? 'FREE' : '₹50'}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1">4–6 days (Free on orders ₹500+)</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryType('express')}
                        className={`p-3.5 rounded-xl border text-left transition ${
                          deliveryType === 'express'
                            ? 'border-[#0b2419] bg-[#f9f8f5] ring-1 ring-[#0b2419]'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span>Priority Express Air</span>
                          <span>₹{subtotal >= 799 ? 150 : 250}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1">Expedited 2–3 business day delivery</p>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!selectedAddressId}
                    onClick={() => setStep(2)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b2419] py-3 text-sm font-semibold uppercase tracking-wider text-white hover:bg-[#153e2c] disabled:opacity-50"
                  >
                    Continue to Payment <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-3 text-xs text-stone-600">
                  {userAddresses.find((a) => a.id === selectedAddressId)?.full_name} •{' '}
                  {userAddresses.find((a) => a.id === selectedAddressId)?.city} (Pincode:{' '}
                  {userAddresses.find((a) => a.id === selectedAddressId)?.postal_code || 'Verified'}) •{' '}
                  <span className="uppercase font-semibold">{deliveryType} Delivery</span>
                </div>
              )}
            </div>

            {/* Step 2: Payment */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0b2419] text-xs font-bold text-white">2</span>
                <h2 className="font-serif text-xl font-semibold">Payment Method</h2>
              </div>

              {step === 2 && (
                <div className="mt-4 space-y-3">
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-200 p-4 transition hover:bg-stone-50">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMode === 'online'}
                        onChange={() => setPaymentMode('online')}
                        className="text-[#0b2419] focus:ring-[#0b2419]"
                      />
                      <div>
                        <span className="font-semibold text-sm">UPI, Cards, NetBanking (Razorpay)</span>
                        <p className="text-xs text-stone-500">Instant verification with GPay, PhonePe, Paytm or Cards</p>
                      </div>
                    </div>
                    <CreditCard className="h-5 w-5 text-stone-400" />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-200 p-4 transition hover:bg-stone-50">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMode === 'WALLET'}
                        onChange={() => setPaymentMode('WALLET')}
                        disabled={walletBalance < total}
                        className="text-[#0b2419] focus:ring-[#0b2419]"
                      />
                      <div>
                        <span className="font-semibold text-sm">Bhumivera Eco-Wallet</span>
                        <p className="text-xs text-stone-500">
                          Balance: ₹{walletBalance.toFixed(2)} {walletBalance < total ? '(Insufficient funds)' : ''}
                        </p>
                      </div>
                    </div>
                    <Wallet className="h-5 w-5 text-stone-400" />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-200 p-4 transition hover:bg-stone-50">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMode === 'COD'}
                        onChange={() => setPaymentMode('COD')}
                        className="text-[#0b2419] focus:ring-[#0b2419]"
                      />
                      <div>
                        <span className="font-semibold text-sm">Cash on Delivery (COD)</span>
                        <p className="text-xs text-stone-500">Pay cash or scan QR at delivery</p>
                      </div>
                    </div>
                    <Truck className="h-5 w-5 text-stone-400" />
                  </label>

                  <p className="mt-4 text-center text-xs leading-5 text-stone-600">
                    By placing your order, you agree to our{' '}
                    <Link to="/legal?section=terms" target="_blank" rel="noreferrer" className="font-semibold text-[#35533c] underline underline-offset-2">Conditions of Sale</Link>
                    {' '}and acknowledge the{' '}
                    <Link to="/legal?section=privacy" target="_blank" rel="noreferrer" className="font-semibold text-[#35533c] underline underline-offset-2">Privacy Notice</Link>.
                  </p>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handlePlaceOrder}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b2419] py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-md hover:bg-[#153e2c] disabled:opacity-50"
                  >
                    {loading ? 'Processing Order...' : `Place Order (₹${total.toFixed(2)})`}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary & Tamper-Proof Coupon Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="font-serif text-lg font-semibold">Order Summary</h3>
              <div className="mt-4 divide-y divide-stone-100">
                {cartItems.map((item) => (
                  <div key={item.id || item.product_id} className="flex items-center justify-between py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.image || item.images?.[0] || '/placeholder.png'}
                        alt={item.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-stone-800 line-clamp-1">{item.name}</p>
                        <p className="text-stone-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold">
                      ₹{((Number(item.discount_price || item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tamper-Proof Coupon Box */}
              <div className="mt-4 pt-4 border-t border-stone-200 space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                  <Ticket className="h-3.5 w-3.5 text-[#0b2419]" /> Apply Promo / Coupon Code
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-xs">
                    <div>
                      <span className="font-mono font-bold text-emerald-900">{appliedCoupon.code}</span>
                      <p className="text-[11px] text-emerald-700">
                        {appliedCoupon.rewardType === 'free_shipping'
                          ? 'Free Shipping Applied'
                          : `Saved ₹${appliedCoupon.discount.toFixed(2)}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs font-bold text-rose-600 hover:underline"
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
                      placeholder="Enter code (e.g. BOTANICAL15)"
                      className="flex-1 rounded-xl border border-stone-300 px-3 py-2 text-xs font-mono uppercase focus:border-[#0b2419] focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={applyingCoupon || !promoInput.trim()}
                      onClick={() => handleApplyCouponCode(promoInput)}
                      className="rounded-xl bg-[#0b2419] px-4 py-2 text-xs font-semibold text-white hover:bg-[#153e2c] disabled:opacity-50"
                    >
                      {applyingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                )}

                {couponMessage && <p className="text-[11px] font-medium text-emerald-700">{couponMessage}</p>}

                {/* Available Eligible Coupons Picker */}
                {!appliedCoupon && availableCoupons.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
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
                                ? 'border-stone-200 hover:border-[#0b2419] bg-stone-50/70'
                                : 'border-stone-100 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div>
                              <span className="font-mono font-bold text-[#0b2419]">{c.code}</span>
                              <span className="block text-[10px] text-stone-500">
                                {c.reward_type === 'free_shipping'
                                  ? 'Free Shipping'
                                  : c.discount_type === 'percentage'
                                  ? `${c.discount_value}% OFF`
                                  : `₹${c.discount_value} OFF`}{' '}
                                {minOrd > 0 ? `(Min ₹${minOrd})` : ''}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-[#35533c]">
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
                <div className="mt-3 pt-3 border-t border-stone-100">
                  <label className="flex items-center justify-between cursor-pointer text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-stone-700">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                      Redeem {redeemablePoints} Loyalty Pts (-₹{Math.floor(redeemablePoints / pointsPerRupee)})
                    </span>
                    <input
                      type="checkbox"
                      checked={redeemLoyalty}
                      onChange={(e) => setRedeemLoyalty(e.target.checked)}
                      className="rounded border-stone-300 text-[#0b2419] focus:ring-[#0b2419]"
                    />
                  </label>
                </div>
              )}

              {/* Totals Breakdown */}
              <div className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {ruleDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Cart Tier Offer</span>
                    <span>-₹{ruleDiscount.toFixed(2)}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span>-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                {loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-amber-700 font-medium">
                    <span>Loyalty Points Discount</span>
                    <span>-₹{loyaltyDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping ({deliveryType})</span>
                  <span>
                    {shippingCost === 0 ? (
                      <strong className="text-emerald-700">FREE</strong>
                    ) : (
                      `₹${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-t border-stone-100 pt-2 text-sm font-bold text-stone-900">
                  <span>Total Payable</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-stone-50 p-3 text-center text-[11px] text-stone-500">
                <ShieldCheck className="h-4 w-4 text-[#607552]" /> 100% Encrypted &amp; Direct-from-Lab Delivery
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
