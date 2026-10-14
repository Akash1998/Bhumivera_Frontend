import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, ChevronDown, ChevronUp, Gift, Heart, Leaf, MapPin, Minus, Plus, ShieldCheck, ShoppingBag, Sparkles, Star, Tag, Trash2, Truck, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useWishlist } from '../context/WishlistContext';
import { addresses as addressesApi, coupons as couponsApi, orders as ordersApi, payments as paymentsApi, products as productsApi, wallet as walletApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { COUPON_CREDIT_CAP, COUPON_CREDIT_PERCENT, COUPON_CREDIT_VALID_DAYS, estimateCouponCredit } from '../utils/couponCredit';

let razorpayScriptPromise;
const loadRazorpayScript = () => {
  if (window.Razorpay) return Promise.resolve();
  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => {
        razorpayScriptPromise = null;
        reject(new Error('Could not load Razorpay Checkout. Check your connection and try again.'));
      };
      document.body.appendChild(script);
    });
  }
  return razorpayScriptPromise;
};

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
const calculateReferralReward = (balance, orderSubtotal, eligibleSubtotal, tiers) => {
  const toCents = value => Math.round(Math.max(0, Number(value) || 0) * 100);
  const orderCents = toCents(orderSubtotal);
  const tier = (Array.isArray(tiers) ? tiers : [])
    .filter(item => orderCents >= toCents(item.min_order_amount))
    .sort((first, second) => toCents(second.min_order_amount) - toCents(first.min_order_amount))[0];
  return tier ? Math.min(toCents(balance), toCents(eligibleSubtotal), toCents(tier.referral_amount)) / 100 : 0;
};
const calculateTierDiscount = (subtotal, priorDiscounts, tier, enabled) => {
  if (!enabled || !tier) return 0;
  const toCents = value => Math.round(Math.max(0, Number(value) || 0) * 100);
  const merchandiseCents = toCents(subtotal);
  const remainingCents = Math.max(0, merchandiseCents - toCents(priorDiscounts));
  const percent = Math.max(0, Math.min(100, Number(tier.tier_discount_percent) || 0));
  return Math.min(remainingCents, Math.floor(merchandiseCents * percent / 100)) / 100;
};
const calculatePointsRedemption = (loyalty, eligibleSubtotal) => {
  const toCents = value => Math.round(Math.max(0, Number(value) || 0) * 100);
  const balance = Math.floor(Math.max(0, Number(loyalty?.pointsBalance) || 0));
  const pointsPerRupee = Math.max(1, Math.trunc(Number(loyalty?.redemptionPointsPerRupee) || 1));
  const minimum = Math.max(0, Math.trunc(Number(loyalty?.minimumRedemptionPoints) || 0));
  if (!loyalty?.enabled || balance < minimum) return { points: 0, discount: 0 };
  const eligibleCents = toCents(eligibleSubtotal);
  const maximumDiscountCents = Math.floor(eligibleCents * Math.max(0, Math.min(100, Number(loyalty?.maxRedemptionPercent) || 0)) / 100);
  const points = Math.min(balance, Math.floor(maximumDiscountCents * pointsPerRupee / 100));
  if (points < minimum) return { points: 0, discount: 0 };
  return { points, discount: Math.min(maximumDiscountCents, Math.floor(points * 100 / pointsPerRupee)) / 100 };
};
export default function MiniCart() {
  const {
    cartItems = [], isCartOpen, setIsCartOpen, removeFromCart, updateQuantity,
    getSubtotal, addToCart, clearCart, rulePreview, rulePreviewLoading, cartAddEvent,
    freeShippingThreshold, couponStackPolicy, referralReward, loyalty,
  } = useCart();
  const { user } = useAuth();
  const userId = user?.id;
  const { settings } = useSettings();
  const { wishlist, isWishlisted, toggleWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const toast = useToast();
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsLoaded, setRecommendationsLoaded] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState('');
  const [recommendationsRetry, setRecommendationsRetry] = useState(0);
  const [recommendationsOpen, setRecommendationsOpen] = useState(false);
  const [offers, setOffers] = useState([]);
  const [offersOpen, setOffersOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponBusy, setCouponBusy] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const checkoutOpen = checkoutStep > 0;
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addressForm, setAddressForm] = useState(blankAddress);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [paymentMode, setPaymentMode] = useState('online');
  const [shippingMethod, setShippingMethod] = useState('STANDARD');
  const [walletBalance, setWalletBalance] = useState(null);
  const [walletBalanceError, setWalletBalanceError] = useState('');
  const [codEligibility, setCodEligibility] = useState({
    eligible: false,
    deliveredOrderCount: 0,
    requiredDeliveredOrders: 2,
    available: false,
  });
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [celebrationEvent, setCelebrationEvent] = useState(null);
  const [savedListOpen, setSavedListOpen] = useState(false);
  const [busyCartItems, setBusyCartItems] = useState(() => new Set());
  const [busySavedItem, setBusySavedItem] = useState(null);
  const cartCount = cartItems.reduce((count, item) => count + (Number(item.quantity) || 1), 0);

  const subtotal = Number(getSubtotal()) || 0;
  const ruleDiscount = Math.max(0, Number(rulePreview?.totalDiscount) || 0);
  const discount = appliedCoupon && couponStackPolicy === 'coupon_first' ? 0 : ruleDiscount;
  const couponDiscount = appliedCoupon
    ? couponStackPolicy === 'both' || couponStackPolicy === 'coupon_first' || discount <= 0
      ? appliedCoupon.discount
      : 0
    : 0;
  const tierDiscount = calculateTierDiscount(subtotal, discount + couponDiscount, loyalty?.currentTier, loyalty?.enabled);
  const referralWalletAmount = calculateReferralReward(
    referralReward?.balance,
    subtotal,
    Math.max(0, subtotal - discount - couponDiscount - tierDiscount),
    referralReward?.tiers
  );
  const pointsRedemption = calculatePointsRedemption(
    loyalty,
    Math.max(0, subtotal - discount - couponDiscount - tierDiscount - referralWalletAmount)
  );
  const [redeemLoyaltyPoints, setRedeemLoyaltyPoints] = useState(true);
  const loyaltyPointsToRedeem = redeemLoyaltyPoints ? pointsRedemption.points : 0;
  const loyaltyDiscount = redeemLoyaltyPoints ? pointsRedemption.discount : 0;
  const loyaltyFreeShipping = Boolean(loyalty?.enabled && Number(loyalty?.currentTier?.free_shipping) === 1);
  const amountToFreeShipping = rulePreview?.freeShipping || loyaltyFreeShipping ? 0 : Math.max(0, Number(freeShippingThreshold) - subtotal);
  const standardShippingCost = Math.max(0, Number(settings?.standard_charge ?? settings?.default_shipping_charge ?? 50) || 0);
  const expressShippingCost = Math.max(0, Number(settings?.express_charge ?? 150) || 0);
  const shippingCost = rulePreview?.freeShipping || loyaltyFreeShipping ? 0 : shippingMethod === 'EXPRESS' ? expressShippingCost : standardShippingCost;
  const finalTotal = Math.max(0, subtotal + shippingCost - discount - couponDiscount - tierDiscount - referralWalletAmount - loyaltyDiscount);
  const couponCreditEligibleSubtotal = Math.max(
    0,
    subtotal - discount - couponDiscount - tierDiscount - referralWalletAmount - loyaltyDiscount,
  );
  const couponCreditEstimate = estimateCouponCredit(couponCreditEligibleSubtotal);
  const appliedSavings = discount + couponDiscount + tierDiscount + referralWalletAmount + loyaltyDiscount;
  const recommendationsToShow = useMemo(() => {
    const cartIds = new Set(cartItems.map(item => String(item.product_id || item.product?.id || item.id)));
    return recommendations.filter(product => !cartIds.has(String(product.id || product._id))).slice(0, 4);
  }, [cartItems, recommendations]);
  const offersToShow = useMemo(() => offers
    .map(offer => {
      const isReferralReward = offer.reward_type === 'referral_wallet';
      const minimum = Number(offer.min_order_amount ?? offer.min_order_value) || 0;
      const value = Number(offer.discount_value ?? offer.value) || 0;
      let estimatedSaving = 0;
      if (subtotal >= minimum) {
        if (isReferralReward) {
          const perOrderLimit = Number(offer.wallet_per_order_limit) || value;
          const availableBalance = walletBalance === null ? perOrderLimit : walletBalance;
          estimatedSaving = Math.min(availableBalance, perOrderLimit, Math.max(0, subtotal - discount));
        } else {
          const type = offer.discount_type || offer.type;
          estimatedSaving = type === 'percentage'
            ? subtotal * value / 100
            : value;
          if (Number(offer.max_discount) > 0) estimatedSaving = Math.min(estimatedSaving, Number(offer.max_discount));
          estimatedSaving = Math.min(estimatedSaving, subtotal);
          if (discount > 0 && !isReferralReward && !offer.is_personal &&
              couponStackPolicy !== 'both' && couponStackPolicy !== 'coupon_first') {
            estimatedSaving = 0;
          }
        }
      }
      return { ...offer, estimatedSaving };
    })
    .sort((first, second) => second.estimatedSaving - first.estimatedSaving), [
    offers, subtotal, discount, walletBalance, couponStackPolicy,
  ]);
  const upcomingCartReward = (rulePreview?.tiers || [])
    .filter(tier => !tier.unlocked && Number(tier.missingAmount) > 0)
    .sort((first, second) => Number(first.missingAmount) - Number(second.missingAmount))[0];
  const unlockedCartReward = (rulePreview?.tiers || []).find(tier => tier.unlocked);
  const selectedAddressDetails = addresses.find(address => String(address.id) === String(selectedAddress));

  useEffect(() => {
    if (!isCartOpen || checkoutOpen || !recommendationsOpen || cartItems.length === 0 || recommendationsLoaded) return undefined;
    let active = true;
    setRecommendationsLoading(true);
    setRecommendationsError('');
    productsApi.getAllActive({ sort: 'rating' })
      .then(response => {
        const data = response.data?.products || response.data?.data || response.data;
        if (active) {
          setRecommendations(Array.isArray(data) ? data : []);
          setRecommendationsLoaded(true);
          setRecommendationsLoading(false);
        }
      })
      .catch(error => {
        console.error('[MINI_CART_RECOMMENDATIONS]', error);
        if (active) {
          setRecommendationsError('Recommendations could not be loaded. Please try again.');
          setRecommendationsLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [isCartOpen, checkoutOpen, recommendationsOpen, cartItems.length, recommendationsLoaded, recommendationsRetry]);

  useEffect(() => {
    if (!isCartOpen || (!offersOpen && checkoutStep !== 1)) return undefined;
    let active = true;
    Promise.allSettled([
      couponsApi.getPublicActive(),
      userId ? couponsApi.getMine() : Promise.resolve({ data: { coupons: [] } }),
    ])
      .then(([publicResult, personalResult]) => {
        const publicData = publicResult.status === 'fulfilled' ? publicResult.value.data : [];
        const publicOffers = Array.isArray(publicData?.data) ? publicData.data : publicData;
        const personalData = personalResult.status === 'fulfilled' ? personalResult.value.data : {};
        const personalOffers = Array.isArray(personalData?.coupons)
          ? personalData.coupons.filter(offer => offer.reward_type !== 'referral_wallet')
          : [];
        const personalCodes = new Set(personalOffers.map(offer => String(offer.code || '').toUpperCase()));
        const availablePublicOffers = Array.isArray(publicOffers)
          ? publicOffers.filter(offer => !personalCodes.has(String(offer.code || '').toUpperCase()))
          : [];
        if (active) {
          setOffers([
            ...personalOffers.map(offer => ({ ...offer, is_personal: true })),
            ...availablePublicOffers,
          ]);
          if (publicResult.status === 'rejected') {
            console.error('[MINI_CART_PUBLIC_OFFERS]', publicResult.reason);
          }
          if (personalResult.status === 'rejected') {
            console.error('[MINI_CART_PERSONAL_OFFERS]', personalResult.reason);
          }
        }
      })
      .catch(error => console.error('[MINI_CART_OFFERS]', error));
    return () => { active = false; };
  }, [isCartOpen, checkoutStep, offersOpen, userId]);

  useEffect(() => {
    if (!isCartOpen) return undefined;
    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const onKeyDown = event => {
      if (event.key === 'Escape') setIsCartOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  useEffect(() => {
    const closeCartOnNativeBack = event => {
      if (!isCartOpen || event.detail.handled) return;
      event.detail.handled = true;
      setIsCartOpen(false);
    };
    window.addEventListener('bhumivera:native-back', closeCartOnNativeBack);
    return () => window.removeEventListener('bhumivera:native-back', closeCartOnNativeBack);
  }, [isCartOpen, setIsCartOpen]);

  useEffect(() => {
    if (!isCartOpen || sessionStorage.getItem('mini-cart-checkout') !== '1') return;
    sessionStorage.removeItem('mini-cart-checkout');
    setCheckoutStep(1);
    const pendingCoupon = sessionStorage.getItem('mini-cart-coupon');
    if (pendingCoupon) {
      setCouponCode(pendingCoupon);
      sessionStorage.removeItem('mini-cart-coupon');
      let active = true;
      setCouponBusy(true);
      couponsApi.validate(pendingCoupon, subtotal)
        .then(response => {
          if (!active) return;
          const data = response.data?.data || response.data || {};
          if (data.rewardType === 'referral_wallet') {
            setAppliedCoupon(null);
            setCouponMessage('Referral credit is applied automatically when your order meets an eligible tier.');
          } else {
            setAppliedCoupon({ code: pendingCoupon, discount: Number(data.discount) || 0 });
            setCouponMessage(`Coupon applied — saving ${formatPrice(data.discount)}.`);
          }
        })
        .catch(error => {
          if (!active) return;
          setAppliedCoupon(null);
          setCouponMessage(error.response?.data?.message || 'This coupon could not be applied.');
        })
        .finally(() => {
          if (active) setCouponBusy(false);
        });
      return () => { active = false; };
    }
  }, [isCartOpen, subtotal]);

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
        return { walletBalanceError: error.response?.data?.message || 'Wallet balance could not be loaded.' };
      }),
      ordersApi.getCodEligibility().then(response => response.data).catch(error => {
        console.error('[MINI_CART_COD_ELIGIBILITY]', error);
        return null;
      }),
    ]).then(([addressResponse, walletResponse, eligibility]) => {
      if (!active) return;
      const list = addressResponse.data?.addresses || addressResponse.data?.data || addressResponse.data || [];
      const savedAddresses = Array.isArray(list) ? list : [];
      setAddresses(savedAddresses);
      setSelectedAddress(current => current || String((savedAddresses.find(address => address.is_default) || savedAddresses[0])?.id || ''));
      if (walletResponse.walletBalanceError) {
        setWalletBalance(null);
        setWalletBalanceError(walletResponse.walletBalanceError);
      } else {
        const balance = Number(walletResponse.data?.balance ?? walletResponse.data?.data?.balance);
        if (!Number.isFinite(balance) || balance < 0) {
          setWalletBalance(null);
          setWalletBalanceError('Wallet balance could not be loaded. Please try again.');
        } else {
          setWalletBalance(balance);
          setWalletBalanceError('');
        }
      }
      setCodEligibility(eligibility
        ? { ...eligibility, available: true }
        : { eligible: false, deliveredOrderCount: 0, requiredDeliveredOrders: 2, available: false });
    }).catch(error => {
      console.error('[MINI_CART_CHECKOUT_DETAILS]', error);
      if (active) toast.error(error.response?.data?.message || 'Could not load checkout details. Please try again.');
    });
    return () => { active = false; };
  }, [checkoutOpen, user, toast]);

  if (!isCartOpen) return null;

  const applyCouponCode = async rawCode => {
    const code = String(rawCode || '').trim().toUpperCase();
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
      if (data.rewardType === 'referral_wallet') {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponMessage('Referral credit is applied automatically when your order meets an eligible tier.');
        return;
      }
      const appliedDiscount = Number(data.discount) || 0;
      setAppliedCoupon({
        code,
        discount: appliedDiscount,
        rewardType: data.rewardType || 'standard',
      });
      const couponStacks = couponStackPolicy === 'both' || couponStackPolicy === 'coupon_first' || discount <= 0;
      setCouponMessage(couponStacks
        ? `Coupon applied — saving ${formatPrice(appliedDiscount)}.`
        : 'Coupon is valid, but cart rewards take priority under the current stacking policy.');
    } catch (error) {
      setAppliedCoupon(null);
      setCouponMessage(error.response?.data?.message || 'This coupon could not be applied.');
    } finally {
      setCouponBusy(false);
    }
  };

  const validateCoupon = async event => {
    event.preventDefault();
    await applyCouponCode(couponCode);
  };

  const continueToCheckout = () => {
    if (!user) {
      setIsCartOpen(false);
      navigate('/login', { state: { from: '/checkout', reopenCart: true } });
      return;
    }
    setCheckoutStep(1);
  };

  const continueToPayment = () => {
    if (!selectedAddress) {
      toast.error('Choose or add a delivery address before continuing.');
      return;
    }
    setCheckoutStep(2);
  };

  const withBusyCartItem = async (productId, operation) => {
    const id = String(productId);
    setBusyCartItems(current => new Set(current).add(id));
    try {
      await operation();
    } finally {
      setBusyCartItems(current => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  };

  const removeCartItem = productId => withBusyCartItem(productId, async () => {
    if (await removeFromCart(productId, { notify: false })) toast.success('Item removed from your cart.');
  });

  const changeCartQuantity = (productId, quantity) => withBusyCartItem(productId, async () => {
    if (await updateQuantity(productId, Math.max(1, quantity), { notify: false })) {
      toast.success('Cart quantity updated.');
    }
  });

  const saveForLater = async item => {
    const product = item.product || item;
    const productId = item.product_id || product.id || product._id;
    if (productId === undefined || productId === null) {
      toast.error('This item cannot be saved right now.');
      return;
    }
    await withBusyCartItem(productId, async () => {
      if (!isWishlisted(productId) && !await toggleWishlist(product, { notify: false })) return;
      if (!await removeFromCart(productId, { notify: false })) return;
      toast.success('Saved for later and removed from your cart.');
    });
  };

  const moveSavedItemToCart = async savedItem => {
    const product = savedItem.product || savedItem;
    const productId = savedItem.product_id || product.id || product._id;
    if (productId === undefined || productId === null) {
      toast.error('This saved item is no longer available.');
      return;
    }
    setBusySavedItem(String(productId));
    try {
      if (!await addToCart(product)) return;
      if (!await removeFromWishlist(productId, { notify: false })) return;
      setSavedListOpen(false);
    } catch (error) {
      console.error('[MINI_CART_RESTORE_WISHLIST_ITEM]', error);
      toast.error('Could not move this item to your cart.');
    } finally {
      setBusySavedItem(null);
    }
  };

  const removeSavedItem = async productId => {
    setBusySavedItem(String(productId));
    try {
      await removeFromWishlist(productId);
    } finally {
      setBusySavedItem(null);
    }
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
    if (paymentMode === 'COD' && !codEligibility.eligible) {
      toast.error('Cash on delivery is available after 2 orders have been successfully delivered.');
      return;
    }
    if (!selectedAddress) {
      toast.error('Choose or add a delivery address before placing your order.');
      return;
    }
    if (paymentMode === 'WALLET' && walletBalance === null) {
      toast.error(walletBalanceError || 'Wallet balance is unavailable. Please reopen checkout and try again.');
      return;
    }
    if (paymentMode === 'WALLET' && walletBalance < finalTotal) {
      toast.error('Your wallet balance is not enough for this order.');
      return;
    }
    setPlacingOrder(true);
    let paymentModalOpened = false;
    try {
      const checkoutDetails = {
        addressId: selectedAddress,
        deliveryType: shippingMethod.toLowerCase(),
        couponCode: appliedCoupon?.code || undefined,
        notes: orderNotes.trim() || undefined,
        termsAccepted: true,
        loyaltyPointsToRedeem,
      };
      if (paymentMode === 'online') {
        await loadRazorpayScript();
        const { data: razorpayOrder } = await paymentsApi.createOrder({ amount: Math.round(finalTotal * 100), currency: 'INR' });
        const key = import.meta.env.VITE_RAZORPAY_KEY_ID || razorpayOrder.key_id;
        if (!key || !razorpayOrder.order_id) throw new Error('Razorpay checkout is not configured correctly.');
        const checkout = new window.Razorpay({
          key,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'Bhumivera',
          description: 'Secure checkout',
          order_id: razorpayOrder.order_id,
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
          },
          theme: { color: '#2C3E2D' },
          handler: async payment => {
            try {
              await paymentsApi.verifyPayment(payment);
              const response = await ordersApi.create({
                ...checkoutDetails,
                paymentMode: 'online',
                ...payment,
              }, { notify: false });
              const orderId = response.data?.orderId || response.data?.id;
              if (!orderId) throw new Error('Payment was verified, but order confirmation was not returned. Contact support with your payment ID.');
              await clearCart();
              setIsCartOpen(false);
              navigate(`/order-success/${orderId}`);
            } catch (error) {
              console.error('[MINI_CART_RAZORPAY_ORDER]', error);
              const message = error.response?.data?.message || error.message || 'Payment could not be confirmed.';
              toast.error(`${message} Payment ID: ${payment.razorpay_payment_id}. Contact support if you were charged.`);
            } finally {
              setPlacingOrder(false);
            }
          },
          modal: {
            ondismiss: () => {
              setPlacingOrder(false);
              toast.error('Payment was cancelled. Your cart is unchanged.');
            },
          },
        });
        checkout.on('payment.failed', event => {
          const message = event.error?.description || event.error?.reason || 'Payment failed. Please try again.';
          toast.error(message);
          setPlacingOrder(false);
        });
        checkout.open();
        paymentModalOpened = true;
        return;
      }

      const response = await ordersApi.create({ ...checkoutDetails, paymentMode });
      const orderId = response.data?.orderId || response.data?.id;
      if (!orderId) throw new Error('Order confirmation was not returned. Please check your orders before trying again.');
      await clearCart();
      setIsCartOpen(false);
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error('[MINI_CART_PLACE_ORDER]', error);
      toast.error(error.response?.data?.message || error.message || 'We could not place your order. Please review your details and try again.');
    } finally {
      if (!paymentModalOpened) setPlacingOrder(false);
    }
  };

  return (
    <div className="mini-cart-overlay fixed inset-0 z-[200] overflow-hidden" role="presentation">
      <button type="button" aria-label="Close cart" className="mini-cart-backdrop absolute inset-0 h-full w-full bg-[#14251c]/55" onClick={() => setIsCartOpen(false)} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="mini-cart-title"
        className="mini-cart-panel absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col border-l border-[#dedfd4] bg-[#f4f1e9] text-[#14251c] shadow-2xl"
      >
        <AnimatePresence>
          {celebrationEvent && <Motion.div key={celebrationEvent.id} initial={{ opacity: 0, y: -18, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12 }} className="absolute left-4 right-4 top-20 z-30 overflow-hidden rounded-2xl border border-[#c8d6ae] bg-[#f1f5e8] p-4 text-[#263d31] shadow-xl" aria-live="polite">
            <div className="absolute inset-0 pointer-events-none">
              {[0, 1, 2, 3, 4, 5].map(index => <Motion.span key={index} initial={{ opacity: 0, y: 24, x: `${index * 18}%`, rotate: -20 }} animate={{ opacity: [0, 1, 0], y: -22, rotate: 24 }} transition={{ duration: 1.3, delay: index * 0.06 }} className="absolute bottom-0"><Leaf size={13} className="text-[#758c53]"/></Motion.span>)}
            </div>
            <div className="relative flex items-start gap-3"><span className="rounded-full bg-white p-2 text-[#536b4d]"><Sparkles size={17}/></span><div><p className="text-xs font-bold uppercase tracking-widest">A thoughtful choice</p><p className="mt-1 text-xs leading-5">We’ve added {celebrationEvent.productName} to your cart. Thank you for choosing with care.</p>{rulePreview?.gifts?.length > 0 && <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-800"><Gift size={14}/>Your cart includes an admin-configured gift reward.</p>}</div></div>
          </Motion.div>}
        </AnimatePresence>
        <header className="mini-cart-header relative flex items-center justify-between border-b border-[#dedfd4] px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#14251c] text-[#e2d6b8] shadow-lg shadow-[#14251c]/15"><ShoppingBag size={19}/></span>
            <div><h2 id="mini-cart-title" className="font-serif text-xl text-[#14251c]">Your cart <span className="font-sans text-sm font-medium text-[#687466]">({cartCount} {cartCount === 1 ? 'item' : 'items'})</span></h2><p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#526b4d]">A little care, on its way</p></div>
          </div>
          <button type="button" aria-label="Close cart" onClick={() => setIsCartOpen(false)} className="rounded-full border border-[#dedfd4] bg-white/80 p-2.5 text-[#526b4d] shadow-sm transition hover:-rotate-90 hover:bg-[#14251c] hover:text-white"><X size={18}/></button>
        </header>

        <div className="mini-cart-scroll flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-7">
          {cartItems.length === 0 && <div className="mini-cart-empty relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-[#dedfd4] bg-[#fbfaf5] px-8 text-center shadow-sm">
            <span className="mini-cart-orbit mini-cart-orbit-one" aria-hidden="true"/>
            <span className="mini-cart-orbit mini-cart-orbit-two" aria-hidden="true"/>
            <span className="mini-cart-empty-icon relative flex h-20 w-20 items-center justify-center rounded-full border border-[#d7dfce] bg-white text-[#526b4d] shadow-[0_12px_36px_rgba(20,37,28,0.1)]"><ShoppingBag size={31} strokeWidth={1.4}/><Sparkles size={15} className="absolute -right-1 top-1 text-[#b39a58]"/></span>
            <p className="relative mt-6 text-[9px] font-bold uppercase tracking-[0.24em] text-[#526b4d]">Your next ritual starts here</p>
            <p className="relative mt-2 font-serif text-2xl text-[#14251c]">Your cart is taking a breath</p>
            <p className="relative mt-2 max-w-[250px] text-sm leading-6 text-[#687466]">Discover thoughtfully made essentials, chosen to feel good every day.</p>
            <button type="button" onClick={() => setIsCartOpen(false)} className="relative mt-7 inline-flex items-center gap-2 rounded-full bg-[#14251c] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-[#14251c]/15 transition duration-300 hover:-translate-y-0.5 hover:bg-[#294434]">Explore the collection <ArrowRight size={14}/></button>
          </div>}
          {cartItems.length > 0 && <>
            {!checkoutOpen && <section className="mini-cart-benefits rounded-2xl border border-[#dfe3d8] bg-[#fffefa] px-4 py-3" aria-label="Cart rewards and delivery">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#526b4d]">Your cart benefits</span>
                {rulePreview?.membershipTier && <span className="rounded-full bg-[#f4f1e9] px-2.5 py-1 text-[10px] font-semibold text-[#765d17]">{rulePreview.membershipTier} member</span>}
              </div>
              <div className="mt-2 flex items-start gap-2 text-xs leading-5 text-[#526b4d]">
                {rulePreview?.gifts?.length > 0
                  ? <><Gift size={14} className="mt-0.5 shrink-0 text-[#8b5a2b]"/><span>{rulePreview.gifts[0].productName ? `${rulePreview.gifts[0].productName} unlocked` : 'A free gift is unlocked'}{rulePreview.gifts.length > 1 ? ` and ${rulePreview.gifts.length - 1} more` : ''}</span></>
                  : upcomingCartReward
                    ? <><Gift size={14} className="mt-0.5 shrink-0 text-[#8b5a2b]"/><span>Add {formatPrice(upcomingCartReward.missingAmount)} to unlock {upcomingCartReward.badge || upcomingCartReward.name}</span></>
                    : unlockedCartReward
                      ? <><Gift size={14} className="mt-0.5 shrink-0 text-[#8b5a2b]"/><span>{unlockedCartReward.badge || unlockedCartReward.name} reward unlocked</span></>
                      : <><ShieldCheck size={14} className="mt-0.5 shrink-0"/><span>Rewards are applied automatically when your cart qualifies.</span></>}
              </div>
              <div className="mt-2 flex items-center gap-2 border-t border-[#edf0e9] pt-2 text-xs text-[#526b4d]">
                <Truck size={14} className="shrink-0"/>
                <span>{amountToFreeShipping > 0 ? `Add ${formatPrice(amountToFreeShipping)} for free delivery` : 'Free delivery unlocked'}</span>
                {rulePreviewLoading && <span className="ml-auto text-[10px] text-stone-400">Updating…</span>}
              </div>
            </section>}
            {!checkoutOpen && cartItems.map(item => {
              const product = item.product || item;
              const id = item.product_id || product.id || product._id;
              const image = product.image_url || item.image_url || item.image || product.image || product.images?.[0];
              const price = Number(product.discount_price || item.unit_price || product.price) || 0;
              const itemBusy = busyCartItems.has(String(id));
              const saved = isWishlisted(id);
              return <article key={id} className={`mini-cart-item flex gap-3 rounded-2xl border border-[#e1e3d9] bg-[#fffefa] p-3.5 transition-opacity ${itemBusy ? 'opacity-60' : ''}`}>
                <div className="mini-cart-product-image flex h-[82px] w-[82px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e5e7de] bg-[#f0f2e9]"><img src={getImageUrl(image)} alt={product.name || 'Cart product'} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="h-full w-full object-contain p-2 transition-transform duration-500 hover:scale-110"/></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2"><h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[#2C3E2D]">{product.name || 'Bhumivera product'}</h3><button type="button" aria-label={`Remove ${product.name || 'product'}`} disabled={itemBusy} onClick={() => removeCartItem(id)} className="shrink-0 rounded-lg p-1.5 text-stone-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-wait"><Trash2 size={15}/></button></div>
                  {product.sku && <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-stone-400">SKU: {product.sku}</p>}
                  {Number(product.review_count) > 0 && Number(product.rating) > 0 && <button type="button" onClick={() => { setIsCartOpen(false); navigate(`/product/${product.slug || id}#product-reviews`); }} className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[#765d17] hover:underline">
                    <Star size={11} fill="currentColor"/> {Number(product.rating).toFixed(1)} <span className="text-stone-500">({Number(product.review_count)} reviews)</span>
                  </button>}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="mini-cart-quantity flex items-center rounded-full border border-[#dfe3d8] bg-[#f5f6f0]">
                      <button type="button" aria-label="Decrease quantity" disabled={itemBusy || Number(item.quantity || 1) <= 1} onClick={() => changeCartQuantity(id, Number(item.quantity || 1) - 1)} className="rounded-full p-1.5 text-[#526b4d] transition hover:bg-[#14251c] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"><Minus size={12}/></button>
                      <span className="min-w-7 text-center text-xs font-bold text-[#14251c]">{item.quantity || 1}</span>
                      <button type="button" aria-label="Increase quantity" disabled={itemBusy} onClick={() => changeCartQuantity(id, Number(item.quantity || 1) + 1)} className="rounded-full p-1.5 text-[#526b4d] transition hover:bg-[#14251c] hover:text-white disabled:cursor-wait disabled:opacity-40"><Plus size={12}/></button>
                    </div>
                    <span className="text-sm font-bold text-[#14251c]">{formatPrice(price * (Number(item.quantity) || 1))}</span>
                  </div>
                  <button type="button" disabled={itemBusy} onClick={() => saveForLater(item)} className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold text-stone-500 transition hover:text-[#8b5a2b] disabled:cursor-wait">
                    <Heart size={13} fill={saved ? 'currentColor' : 'none'} className={saved ? 'text-[#8b5a2b]' : ''}/>
                    {saved ? 'Saved · remove from cart' : 'Save for later'}
                  </button>
                </div>
              </article>;
            })}

            {!checkoutOpen && <div className="grid grid-cols-2 gap-2 rounded-xl border border-[#e8dcc4] bg-[#fffdf8] p-3 text-[10px] font-semibold text-[#35533c]">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#8b5a2b]"/>Secure checkout</span>
              <span className="flex items-center gap-1.5"><BadgeCheck size={14} className="text-[#8b5a2b]"/>Customer-approved reviews</span>
            </div>}

            {checkoutOpen && <section className="mini-cart-checkout space-y-4 rounded-2xl border border-[#d9dfd2] bg-[#f8f8f2] p-4" aria-labelledby="mini-checkout-title">
              <nav aria-label="Checkout progress" className="grid grid-cols-2 gap-2">
                {['Delivery', 'Payment'].map((label, index) => {
                  const step = index + 1;
                  const active = checkoutStep === step;
                  const complete = checkoutStep > step;
                  return <button type="button" key={label} disabled={step > checkoutStep} onClick={() => setCheckoutStep(step)} aria-current={active ? 'step' : undefined} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold ${active ? 'bg-[#14251c] text-white' : complete ? 'bg-[#e8eee3] text-[#35533c]' : 'bg-white text-stone-400'}`}>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-[10px]">{complete ? '✓' : step}</span>{label}
                  </button>;
                })}
              </nav>
              <div className="flex items-center justify-between gap-3 border-b border-[#e5e7de] pb-3">
                <div><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#526b4d]">Step {checkoutStep} of 2</p><h3 id="mini-checkout-title" className="mt-1 flex items-center gap-2 font-serif text-lg text-[#14251c]">{checkoutStep === 1 ? <><MapPin size={17}/>Delivery details</> : <><ShieldCheck size={17}/>Payment &amp; review</>}</h3></div>
                <button type="button" onClick={() => setCheckoutStep(0)} className="rounded-full border border-[#dfe3d8] bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#526b4d] transition hover:border-[#14251c] hover:bg-[#14251c] hover:text-white">Edit cart</button>
              </div>
              <p className="text-[11px] text-stone-500">{cartCount} {cartCount === 1 ? 'item' : 'items'} <span aria-hidden="true">·</span> Order total {formatPrice(finalTotal)}</p>
              {!user ? <button type="button" onClick={() => { setIsCartOpen(false); navigate('/login', { state: { from: '/checkout', reopenCart: true } }); }} className="w-full rounded-xl bg-[#2C3E2D] px-4 py-3 text-sm font-semibold text-white">Sign in to continue</button> : <>
                {checkoutStep === 1 && <>
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
                <section className="space-y-3" aria-labelledby="checkout-benefits-title">
                  <div>
                    <h4 id="checkout-benefits-title" className="text-sm font-semibold text-[#263d31]">Offers and rewards</h4>
                    <p className="mt-1 text-[10px] leading-4 text-stone-500">Clear totals now, and a real coupon reward after eligible payment.</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    <article className="rounded-xl border border-[#d9e4cf] bg-[#f3f7ed] p-3">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[#526b4d]">Estimated coupon credit</p>
                      <p className="mt-1 text-lg font-bold text-[#14251c]">{formatPrice(couponCreditEstimate)}</p>
                      <p className="mt-1 text-[10px] leading-4 text-stone-600">
                        {COUPON_CREDIT_PERCENT}% of eligible merchandise, capped at {formatPrice(COUPON_CREDIT_CAP)}. {paymentMode === 'COD' ? 'Issued after successful COD delivery.' : 'Issued after payment is confirmed.'}
                      </p>
                      <p className="mt-2 text-[9px] leading-4 text-stone-500">
                        Personal, non-withdrawable coupon; valid {COUPON_CREDIT_VALID_DAYS} days. Excludes shipping, taxes, gifts and applied discounts or credits. Refunds reverse the proportional reward; any used portion offsets future rewards.
                      </p>
                    </article>
                    <article className="rounded-xl border border-[#e8dcc4] bg-white p-3">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[#526b4d]">Savings applied to this order</p>
                      <p className="mt-1 text-lg font-bold text-emerald-700">{formatPrice(appliedSavings)}</p>
                      <p className="mt-1 text-[10px] leading-4 text-stone-600">Already reflected in the order total. No future reward is counted as a current saving.</p>
                    </article>
                    <article className="rounded-xl border border-[#e8dcc4] bg-white p-3">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[#526b4d]">Delivery and cart rewards</p>
                      <p className="mt-1 text-sm font-semibold text-[#14251c]">{shippingCost === 0 ? 'Free delivery selected' : `${shippingMethod === 'EXPRESS' ? 'Express' : 'Standard'} delivery`}</p>
                      <p className="mt-1 text-[10px] leading-4 text-stone-600">
                        {rulePreview?.gifts?.length
                          ? `${rulePreview.gifts.length} cart reward${rulePreview.gifts.length === 1 ? '' : 's'} currently unlocked.`
                          : amountToFreeShipping > 0
                            ? `Add ${formatPrice(amountToFreeShipping)} for free standard delivery.`
                            : 'Your cart rewards are checked again before payment.'}
                      </p>
                    </article>
                  </div>
                  <div className="rounded-xl border border-[#e8dcc4] bg-white p-3">
                    <p className="mb-2 text-xs font-semibold text-[#35533c]">Available coupons</p>
                    <form onSubmit={validateCoupon} className="flex gap-2">
                      <input value={couponCode} onChange={event => setCouponCode(event.target.value)} aria-label="Coupon code" placeholder="Enter coupon code" className="min-w-0 flex-1 rounded-xl border border-dashed border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-[#8b5a2b]"/>
                      <button disabled={couponBusy || !couponCode.trim()} className="rounded-xl bg-[#2C3E2D] px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{couponBusy ? 'Checking…' : 'Apply'}</button>
                    </form>
                    {couponMessage && <p role="status" className={`mt-2 text-xs ${appliedCoupon && couponDiscount > 0 ? 'text-emerald-700' : appliedCoupon ? 'text-amber-700' : 'text-rose-700'}`}>{couponMessage}</p>}
                    {offersToShow.length > 0
                      ? <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {offersToShow.map(offer => (
                          <button
                            type="button"
                            key={offer.code}
                            disabled={couponBusy}
                            onClick={() => {
                              setCouponCode(offer.code);
                              void applyCouponCode(offer.code);
                            }}
                            className="flex min-w-0 items-start justify-between gap-2 rounded-lg bg-[#faf8f5] px-3 py-2 text-left text-xs hover:bg-[#f5f1e8] disabled:opacity-60"
                          >
                            <span className="min-w-0">
                              <strong className="block truncate font-mono text-[#2C3E2D]">{offer.code}</strong>
                              <span className="mt-1 block text-stone-600">
                                {offer.reward_type === 'coupon_credit'
                                  ? `${formatPrice(offer.discount_value)} coupon credit`
                                  : offer.reward_type === 'referral_wallet'
                                    ? `Referral credit up to ${formatPrice(offer.wallet_per_order_limit || offer.discount_value)}`
                                    : offer.discount_type === 'percentage'
                                      ? `${offer.discount_value}% off`
                                      : `${formatPrice(offer.discount_value)} off`}
                              </span>
                              {offer.expires_at && <span className="mt-1 block text-[9px] text-stone-500">Expires {new Date(offer.expires_at).toLocaleDateString()}</span>}
                            </span>
                            <span className="shrink-0 text-[9px] font-bold uppercase tracking-wide text-[#8b5a2b]">Apply</span>
                          </button>
                        ))}
                      </div>
                      : <p className="mt-2 text-[10px] text-stone-500">{user ? 'No additional coupons are available right now.' : 'Sign in to see personal coupons and rewards.'}</p>}
                  </div>
                </section>
                </>}
                {checkoutStep === 2 && <>
                <div className="flex items-start justify-between gap-3 rounded-xl border border-[#e1e3d9] bg-white p-3 text-xs">
                  <div className="min-w-0"><p className="font-semibold text-[#35533c]">{selectedAddressDetails?.full_name || selectedAddressDetails?.fullName || 'Delivery address'} · {selectedAddressDetails?.label || 'Address'}</p><p className="mt-1 truncate text-stone-500">{selectedAddressDetails ? `${selectedAddressDetails.address_line1 || selectedAddressDetails.street_address || selectedAddressDetails.line1}, ${selectedAddressDetails.city}, ${selectedAddressDetails.state} ${selectedAddressDetails.pincode || selectedAddressDetails.postal_code}` : 'Address selected'}</p><p className="mt-1 text-stone-500">{shippingMethod === 'EXPRESS' ? 'Express delivery' : 'Standard delivery'} · {shippingCost ? formatPrice(shippingCost) : 'Free'}</p></div>
                  <button type="button" onClick={() => setCheckoutStep(1)} className="shrink-0 font-semibold text-[#8b5a2b] underline underline-offset-2">Edit</button>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-[#35533c]">Payment method</p>
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#e8dcc4] bg-white p-3 text-xs"><input type="radio" name="mini-cart-payment" checked={paymentMode === 'online'} onChange={() => setPaymentMode('online')} className="accent-[#35533c]"/>Pay securely with Razorpay <span className="ml-auto text-[9px] font-bold uppercase tracking-wide text-emerald-700">Recommended</span></label>
                  <label className="flex cursor-pointer items-center justify-between gap-2 rounded-xl border border-[#e8dcc4] bg-white p-3 text-xs"><span className="flex items-center gap-2"><input type="radio" name="mini-cart-payment" checked={paymentMode === 'WALLET'} onChange={() => setPaymentMode('WALLET')} className="accent-[#35533c]"/>Bhumivera wallet</span><span className="text-stone-500">{walletBalance === null ? 'Balance unavailable' : `Balance ${formatPrice(walletBalance)}`}</span></label>
                  {walletBalanceError && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-[10px] text-rose-700">{walletBalanceError}</p>}
                  <label className={`flex items-center gap-2 rounded-xl border bg-white p-3 text-xs ${codEligibility.eligible ? 'cursor-pointer border-[#e8dcc4]' : 'cursor-not-allowed border-[#e8dcc4] opacity-70'}`}><input type="radio" name="mini-cart-payment" checked={paymentMode === 'COD'} disabled={!codEligibility.eligible} onChange={() => setPaymentMode('COD')} className="accent-[#35533c]"/>Cash on delivery</label>
                  <p role="status" className="rounded-lg bg-[#f7f3ea] px-3 py-2 text-[10px] leading-4 text-stone-600">
                    {!codEligibility.available
                      ? 'Cash on delivery eligibility could not be checked. Please use Razorpay or Wallet, or try again shortly.'
                      : codEligibility.eligible
                        ? 'Cash on delivery is available because you have 2 successfully delivered orders.'
                        : `Cash on delivery unlocks after 2 orders are successfully delivered. You have ${codEligibility.deliveredOrderCount} delivered order${codEligibility.deliveredOrderCount === 1 ? '' : 's'} so far. You can still place your order with Razorpay or Wallet.`}
                  </p>
                </div>

                <label className="block text-[10px] font-semibold text-stone-600">Delivery note (optional)<textarea rows={2} value={orderNotes} onChange={event => setOrderNotes(event.target.value)} className="mt-1 w-full resize-none rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs" placeholder="Anything the delivery team should know?"/></label>
                </>}
              </>}
            </section>}

            {!checkoutOpen && <section className="overflow-hidden rounded-2xl border border-[#e8dcc4] bg-white">
              <button type="button" onClick={() => setOffersOpen(open => !open)} aria-expanded={offersOpen} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
                <span className="flex items-center gap-2"><span className="rounded-lg bg-[#f5f1e8] p-2 text-[#8b5a2b]"><Tag size={15}/></span><span><span className="block text-sm font-semibold text-[#2C3E2D]">Coupons &amp; offers</span><span className="block text-[10px] text-stone-500">{offersToShow.length ? `${offersToShow.length} available offers — best savings first` : 'Enter a coupon code'}</span></span></span>
                {offersOpen ? <ChevronUp size={16} className="text-stone-500"/> : <ChevronDown size={16} className="text-stone-500"/>}
              </button>
              {offersOpen && <div className="border-t border-[#f0e8da] p-3">
                {Number(referralReward?.balance) > 0 && <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs leading-5 text-emerald-800">Referral balance {formatPrice(referralReward.balance)}{referralWalletAmount > 0 ? ` · ${formatPrice(referralWalletAmount)} automatically applied` : ' · applied automatically when an order tier is reached'}</p>}
                {loyalty?.enabled && <p className="mb-3 rounded-lg border border-[#dce7c5] bg-[#f4f7ed] px-3 py-2 text-xs leading-5 text-[#35533c]">{loyalty.currentTier?.name || 'Loyalty member'} · {Number(loyalty.lifetimePoints || 0).toLocaleString()} lifetime tier points · {Number(loyalty.pointsBalance || 0).toLocaleString()} points available to redeem{loyalty.nextTier ? ` · ${Number(loyalty.nextTier.min_points) - Number(loyalty.lifetimePoints || 0)} to ${loyalty.nextTier.name}` : ''}</p>}
                <form onSubmit={validateCoupon} className="flex gap-2">
                  <input value={couponCode} onChange={event => setCouponCode(event.target.value)} aria-label="Coupon code" placeholder="Enter coupon code" className="min-w-0 flex-1 rounded-xl border border-dashed border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-[#8b5a2b]"/>
                  <button disabled={couponBusy || !couponCode.trim()} className="rounded-xl bg-[#2C3E2D] px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{couponBusy ? 'Checking…' : 'Apply'}</button>
                </form>
                {couponMessage && <p role="status" className={`mt-2 text-xs ${appliedCoupon && couponDiscount > 0 ? 'text-emerald-700' : appliedCoupon ? 'text-amber-700' : 'text-rose-700'}`}>{couponMessage}</p>}
                {offersToShow.length > 0 && <div className="mt-3 space-y-2">
                {offersToShow.map((offer, index) => {
                  const minimum = Number(offer.min_order_amount ?? offer.min_order_value) || 0;
                  const amountNeeded = Math.max(0, minimum - subtotal);
                  const isReferralReward = offer.reward_type === 'referral_wallet';
                  return (
                    <button
                      type="button"
                      key={offer.code}
                      disabled={couponBusy}
                      onClick={() => {
                        setCouponCode(offer.code);
                        void applyCouponCode(offer.code);
                      }}
                      className="flex w-full items-center justify-between gap-3 rounded-lg bg-[#faf8f5] px-3 py-2 text-left text-xs hover:bg-[#f5f1e8] disabled:opacity-60"
                    >
                      <span className="min-w-0">
                        <strong className="font-mono text-[#2C3E2D]">{offer.code}</strong>
                        <span className="ml-2 text-stone-500">
                          {isReferralReward
                            ? `Use referral balance up to ${formatPrice(offer.wallet_per_order_limit || offer.discount_value)} per order`
                            : offer.discount_type === 'percentage' || offer.type === 'percentage'
                              ? `${offer.discount_value ?? offer.value}% off`
                              : `${formatPrice(offer.discount_value ?? offer.value)} off`}
                        </span>
                        <span className="mt-1 block text-[10px] text-stone-500">
                          {amountNeeded > 0
                            ? `Add ${formatPrice(amountNeeded)} to meet the minimum order.`
                            : offer.estimatedSaving > 0
                              ? `Estimated saving ${formatPrice(offer.estimatedSaving)}${isReferralReward ? ' (uses your remaining referral balance)' : ''}`
                              : 'Not eligible with the current cart discounts.'}
                        </span>
                      </span>
                      <span className="shrink-0 text-right text-[9px] font-bold uppercase tracking-wider text-[#8b5a2b]">
                        {index === 0 && offer.estimatedSaving > 0 ? 'Best saving' : offer.is_personal ? 'Your reward' : 'Apply'}
                      </span>
                    </button>
                  );
                })}
                </div>}
              </div>}
            </section>}

            {!checkoutOpen && <section className="overflow-hidden rounded-2xl border border-[#e1e3d9] bg-[#fffefa]">
              <button type="button" aria-expanded={recommendationsOpen} onClick={() => setRecommendationsOpen(open => !open)} className="flex w-full items-center justify-between px-4 py-3 text-left">
                <span><span className="block text-xs font-bold uppercase tracking-wider text-[#2C3E2D]">A little more to love</span><span className="mt-0.5 block text-[10px] text-stone-500">Thoughtful picks for your routine</span></span>
                {recommendationsOpen ? <ChevronUp size={16} className="text-[#526b4d]"/> : <ChevronDown size={16} className="text-[#526b4d]"/>}
              </button>
              {recommendationsOpen && <div className="space-y-2 border-t border-[#e5e7de] p-3">
                {recommendationsLoading && <p className="text-xs text-stone-500">Finding a few good fits…</p>}
                {recommendationsError && <div className="flex items-center justify-between gap-3 text-xs text-rose-700"><p role="alert">{recommendationsError}</p><button type="button" onClick={() => setRecommendationsRetry(retry => retry + 1)} className="shrink-0 font-semibold underline underline-offset-2">Retry</button></div>}
                {!recommendationsLoading && !recommendationsError && recommendationsToShow.length === 0 && <p className="text-xs text-stone-500">We’ll have more thoughtful picks for you soon.</p>}
                <div className="grid grid-cols-2 gap-2">
                  {recommendationsToShow.slice(0, 2).map(product => <article key={product.id || product._id} className="flex min-w-0 items-center gap-2 rounded-xl border border-[#e8dcc4] bg-white p-2">
                    <img src={getImageUrl(product.image_url || product.images?.[0] || product.image)} alt={product.name} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="h-12 w-12 shrink-0 rounded-lg bg-[#faf8f5] object-contain p-1"/>
                    <div className="min-w-0 flex-1"><p className="line-clamp-2 text-[10px] font-semibold leading-tight text-[#2C3E2D]">{product.name}</p><p className="mt-1 text-[10px] font-bold text-[#8b5a2b]">{formatPrice(product.discount_price || product.price)}</p></div>
                    <button type="button" aria-label={`Add ${product.name} to cart`} onClick={() => addToCart(product)} className="shrink-0 rounded-lg border border-[#e8dcc4] p-1.5 text-[#8b5a2b] hover:bg-[#8b5a2b] hover:text-white"><Plus size={14}/></button>
                  </article>)}
                </div>
              </div>}
            </section>}
          </>}

          {!checkoutOpen && wishlist.length > 0 && <section className="overflow-hidden rounded-2xl border border-[#e8dcc4] bg-white" aria-label="Saved for later items">
            <h3 id="saved-items-title" className="sr-only">Saved for later</h3>
            <button type="button" aria-expanded={savedListOpen} aria-controls="mini-cart-saved-items" onClick={() => setSavedListOpen(open => !open)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
              <span className="flex items-center gap-2 text-sm font-semibold text-[#2C3E2D]"><Heart size={16} className="text-[#8b5a2b]"/>Saved for later <span className="rounded-full bg-[#f5f0e8] px-2 py-0.5 text-[10px] text-stone-600">{wishlist.length}</span></span>
              {savedListOpen ? <ChevronUp size={16} className="text-stone-500"/> : <ChevronDown size={16} className="text-stone-500"/>}
            </button>
            {savedListOpen && <div id="mini-cart-saved-items" className="max-h-64 space-y-2 overflow-y-auto border-t border-[#f0e8da] p-3">
              {wishlist.map(savedItem => {
                const product = savedItem.product || savedItem;
                const id = savedItem.product_id || product.id || product._id;
                const savedBusy = busySavedItem === String(id);
                return <article key={id} className="flex items-center gap-2 rounded-xl bg-[#faf8f5] p-2">
                  <img src={getImageUrl(product.image_url || product.images?.[0] || product.image)} alt={product.name || 'Saved product'} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="h-11 w-11 shrink-0 rounded-lg bg-white object-contain p-1"/>
                  <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-[#2C3E2D]">{product.name || 'Saved product'}</p><p className="mt-1 text-[10px] font-bold text-[#8b5a2b]">{formatPrice(product.discount_price || product.price)}</p></div>
                  <button type="button" disabled={busySavedItem !== null} onClick={() => moveSavedItemToCart(savedItem)} className="rounded-lg bg-[#2C3E2D] px-2.5 py-2 text-[10px] font-semibold text-white transition hover:bg-[#1b2c20] disabled:cursor-wait disabled:opacity-50">{savedBusy ? 'Moving…' : 'Add'}</button>
                  <button type="button" disabled={busySavedItem !== null} aria-label={`Remove ${product.name || 'saved product'} from wishlist`} onClick={() => removeSavedItem(id)} className="rounded-lg p-2 text-stone-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-wait"><Trash2 size={14}/></button>
                </article>;
              })}
            </div>}
          </section>}
        </div>

        {cartItems.length > 0 && <footer className="mini-cart-footer border-t border-[#dedfd4] bg-[#fbfaf5] px-5 py-4 shadow-[0_-10px_30px_rgba(20,37,28,0.08)] sm:px-7">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-stone-600"><span>Subtotal</span><strong className="text-[#1A1C18]">{formatPrice(subtotal)}</strong></div>
            {discount + couponDiscount + tierDiscount + referralWalletAmount + loyaltyDiscount > 0 && <div className="flex justify-between font-semibold text-emerald-700"><span>Savings applied</span><span>−{formatPrice(discount + couponDiscount + tierDiscount + referralWalletAmount + loyaltyDiscount)}</span></div>}
            {loyalty?.enabled && Number(loyalty?.pointsBalance) >= Number(loyalty?.minimumRedemptionPoints) && pointsRedemption.points > 0 && <label className="flex items-center justify-between gap-3 font-semibold text-emerald-700"><span className="flex items-center gap-2"><input type="checkbox" checked={redeemLoyaltyPoints} onChange={event => setRedeemLoyaltyPoints(event.target.checked)} className="accent-[#35533c]"/>Use {(redeemLoyaltyPoints ? loyaltyPointsToRedeem : pointsRedemption.points).toLocaleString()} loyalty points</span><span>{loyaltyDiscount > 0 ? `−${formatPrice(loyaltyDiscount)}` : 'Not applied'}</span></label>}
            {checkoutOpen && <div className="flex justify-between text-stone-600"><span>{shippingMethod === 'EXPRESS' ? 'Express delivery' : 'Standard delivery'}</span><span>{shippingCost ? formatPrice(shippingCost) : 'Free'}</span></div>}
            <div className="flex justify-between border-t border-[#e5e7de] pt-2 text-sm font-bold text-[#14251c]"><span>{checkoutOpen ? 'Order total' : 'Estimated total*'}</span><span>{formatPrice(checkoutOpen ? finalTotal : Math.max(0, subtotal - discount - couponDiscount - tierDiscount - referralWalletAmount - loyaltyDiscount))}</span></div>
          </div>
          {!checkoutOpen
            ? <button type="button" onClick={continueToCheckout} className="mini-cart-primary-action mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14251c] px-4 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-[#14251c]/15 transition">Continue to checkout <ArrowRight size={16}/></button>
            : checkoutStep === 1
              ? <button type="button" onClick={continueToPayment} className="mini-cart-primary-action mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14251c] px-4 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-[#14251c]/15 transition">Continue to payment <ArrowRight size={16}/></button>
              : <form onSubmit={placeOrder}>
              <div className="mb-2 flex items-center justify-between">
                <button type="button" onClick={() => setCheckoutStep(1)} className="text-[10px] font-semibold text-[#526b4d] underline underline-offset-2">Back to delivery</button>
              </div>
              <button type={user ? 'submit' : 'button'} onClick={!user ? continueToCheckout : undefined} disabled={placingOrder || (user && paymentMode === 'WALLET' && (walletBalance === null || walletBalance < finalTotal))} className="mini-cart-primary-action flex w-full items-center justify-center gap-2 rounded-xl bg-[#14251c] px-4 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-[#14251c]/15 transition disabled:cursor-not-allowed disabled:opacity-50">
                {placingOrder ? 'Preparing your order…' : !user ? <>Sign in to continue <ArrowRight size={16}/></> : <>{paymentMode === 'COD' ? 'Place order · cash on delivery' : paymentMode === 'online' ? 'Pay securely with Razorpay' : 'Place wallet order'} <ArrowRight size={16}/></>}
              </button>
              {paymentMode === 'WALLET' && walletBalance !== null && walletBalance < finalTotal && <p className="mt-1 text-center text-[10px] text-rose-700">Add funds to your wallet or choose Razorpay.</p>}
              <p className="mt-3 text-center text-[10px] leading-4 text-[#687466]">By placing your order, you agree to our <Link to="/legal?section=terms" target="_blank" rel="noreferrer" className="font-semibold text-[#294434] underline underline-offset-2">Conditions of Sale</Link> and acknowledge the <Link to="/legal?section=privacy" target="_blank" rel="noreferrer" className="font-semibold text-[#294434] underline underline-offset-2">Privacy Notice</Link>.</p>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[9px] font-medium text-[#687466]"><ShieldCheck size={12} className="text-[#526b4d]"/>{paymentMode === 'online' ? 'Payment details are handled securely by Razorpay.' : 'Your order total is shown clearly before confirmation.'}</p>
            </form>}
          {!checkoutOpen && <p className="mt-2 text-center text-[9px] text-stone-400">Shipping and final discounts are confirmed at checkout.</p>}
        </footer>}
      </aside>
    </div>
  );
}
