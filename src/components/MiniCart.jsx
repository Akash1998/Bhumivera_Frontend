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
import { getProductImageUrl } from '../utils/productImageUrl';
import {
  estimateShoppingWalletReward,
  NEW_CUSTOMER_BONUS_PERCENT,
  SHOPPING_WALLET_REWARD_CAP,
  SHOPPING_WALLET_REWARD_PERCENT,
} from '../utils/shoppingWalletReward';
import { calculateDeliveryCosts, PREMIUM_DELIVERY_SURCHARGE, PREMIUM_DELIVERY_THRESHOLD } from '../utils/shippingOptions';

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

const getImageUrl = image => getProductImageUrl(image) || '/logo.webp';

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
  const [offersOpen, setOffersOpen] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponBusy, setCouponBusy] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [summaryExpanded, setSummaryExpanded] = useState(true);
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
    isNewCustomer: false,
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
  const couponFreeShipping = appliedCoupon?.rewardType === 'free_shipping';
  const amountToFreeShipping = rulePreview?.freeShipping || loyaltyFreeShipping || couponFreeShipping ? 0 : Math.max(0, Number(freeShippingThreshold) - subtotal);
  const { standardCost: standardDeliveryCost, premiumCost: premiumDeliveryCost } = calculateDeliveryCosts({
    subtotal,
    standardCharge: settings?.standard_charge ?? settings?.default_shipping_charge ?? 50,
    premiumCharge: settings?.express_charge ?? 150,
    freeShippingThreshold,
    freeShipping: Boolean(rulePreview?.freeShipping || loyaltyFreeShipping || couponFreeShipping),
  });
  const shippingCost = shippingMethod === 'PREMIUM' ? premiumDeliveryCost : standardDeliveryCost;
  const totalSavings = discount + couponDiscount + tierDiscount + referralWalletAmount + loyaltyDiscount;
  const estimatedTotal = Math.max(0, subtotal - totalSavings);
  const finalTotal = Math.max(0, subtotal + shippingCost - totalSavings);
  const shoppingWalletRewardEligibleSubtotal = Math.max(
    0,
    subtotal - discount - couponDiscount - tierDiscount - referralWalletAmount - loyaltyDiscount,
  );
  const isNewCustomer = Boolean(codEligibility.available && codEligibility.isNewCustomer);
  const shoppingWalletRewardEstimate = estimateShoppingWalletReward(
    shoppingWalletRewardEligibleSubtotal,
    isNewCustomer,
  );
  const baseShoppingWalletRewardEstimate = Math.min(
    SHOPPING_WALLET_REWARD_CAP,
    Math.round(shoppingWalletRewardEligibleSubtotal * SHOPPING_WALLET_REWARD_PERCENT) / 100,
  );
  const firstOrderRewardBonusEstimate = Math.max(
    0,
    Math.round((shoppingWalletRewardEstimate - baseShoppingWalletRewardEstimate) * 100) / 100,
  );
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
          const availableBalance = referralReward?.balance === null ? perOrderLimit : Number(referralReward?.balance) || 0;
          estimatedSaving = Math.min(availableBalance, perOrderLimit, Math.max(0, subtotal - discount));
        } else if (offer.reward_type === 'free_shipping') {
          estimatedSaving = shippingCost;
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
    offers, subtotal, discount, referralReward?.balance, couponStackPolicy, shippingCost,
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
        : { eligible: false, deliveredOrderCount: 0, requiredDeliveredOrders: 2, isNewCustomer: false, available: false });
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
      setCouponMessage(data.rewardType === 'free_shipping'
        ? 'Free-shipping reward applied to this order.'
        : couponStacks
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
        deliveryType: shippingMethod === 'PREMIUM' ? 'express' : 'standard',
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
          theme: { color: '#14291F' },
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
      <button type="button" aria-label="Close cart" className="mini-cart-backdrop absolute inset-0 h-full w-full bg-black/80 backdrop-blur-md" onClick={() => setIsCartOpen(false)} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="mini-cart-title"
        className="mini-cart-panel absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col border-l border-[#D4AF37]/20 bg-[#102219]/95 backdrop-blur-2xl text-[#FAF7F2] shadow-2xl"
      >
        <AnimatePresence>
          {celebrationEvent && <Motion.div key={celebrationEvent.id} initial={{ opacity: 0, y: -18, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12 }} className="absolute left-4 right-4 top-20 z-30 overflow-hidden rounded-2xl border border-[#D4AF37]/40 bg-[#1C382B]/90 backdrop-blur-xl p-4 text-[#FAF7F2] shadow-2xl" aria-live="polite">
            <div className="absolute inset-0 pointer-events-none">
              {[0, 1, 2, 3, 4, 5].map(index => <Motion.span key={index} initial={{ opacity: 0, y: 24, x: `${index * 18}%`, rotate: -20 }} animate={{ opacity: [0, 1, 0], y: -22, rotate: 24 }} transition={{ duration: 1.3, delay: index * 0.06 }} className="absolute bottom-0"><Sparkles size={13} className="text-[#D4AF37]"/></Motion.span>)}
            </div>
            <div className="relative flex items-start gap-3"><span className="rounded-full bg-white/10 p-2 text-[#D4AF37] border border-[#D4AF37]/30"><Sparkles size={17}/></span><div><p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Considered Selection</p><p className="mt-1 text-xs leading-5 text-[#DFD7C4]">We’ve added <strong className="text-white">{celebrationEvent.productName}</strong> to your bag.</p>{rulePreview?.gifts?.length > 0 && <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#FCE096]"><Gift size={14} className="text-[#D4AF37]"/>Your bag includes an unlocked gift formulation.</p>}</div></div>
          </Motion.div>}
        </AnimatePresence>

        <header className="mini-cart-header relative flex items-center justify-between border-b border-[#D4AF37]/20 px-5 py-5 sm:px-7 bg-[#14291F]/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#14291F] text-[#D4AF37] border border-[#D4AF37]/30 shadow-lg"><ShoppingBag size={19}/></span>
            <div>
              <h2 id="mini-cart-title" className="font-serif text-xl sm:text-2xl font-bold">
                <span className="font-headline-gold">Your</span> <span className="font-headline-silver">Bag</span> <span className="font-sans text-xs font-medium text-[#9BB0A5]">({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
              </h2>
              <div className="gold-hairline my-1 w-32" />
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Considered Botanical Care</p>
            </div>
          </div>
          <button type="button" aria-label="Close cart" onClick={() => setIsCartOpen(false)} className="rounded-full border border-[#D4AF37]/30 bg-[#14291F]/80 p-2.5 text-[#DFD7C4] shadow-sm transition hover:rotate-90 hover:border-[#D4AF37] hover:text-[#D4AF37]"><X size={18}/></button>
        </header>

        <div className="mini-cart-scroll min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-7 bg-[#0D1C14]/80">
          {cartItems.length === 0 && (
            <div className="mini-cart-empty relative flex min-h-[440px] flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-[#D4AF37]/25 bg-[#102219]/80 backdrop-blur-2xl px-6 py-12 text-center shadow-2xl">
              {/* Outer Dashed Golden Orbit Ring */}
              <span className="mini-cart-orbit mini-cart-orbit-two" aria-hidden="true" />
              {/* Inner Solid Golden Ring with Aura */}
              <span className="mini-cart-orbit mini-cart-orbit-one" aria-hidden="true" />
              {/* Center Circular Emblem with Sparkle */}
              <div className="mini-cart-empty-icon relative flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#13231B] text-[#D4AF37] shadow-[0_12px_36px_rgba(0,0,0,0.65)] ring-1 ring-[#D4AF37]/20">
                <ShoppingBag size={30} strokeWidth={1.5} className="text-[#E6C57E]" />
                <Sparkles size={16} className="absolute -top-1 -right-1 text-[#E6C57E] fill-[#E6C57E]/20" />
              </div>
              <p className="relative mt-8 text-[10px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
                Your Next Daily Ritual
              </p>
              <h3 className="relative mt-2 font-serif text-3xl sm:text-[34px] font-bold tracking-tight">
                <span className="text-[#D4AF37]">Your Bag</span> <span className="text-[#FAF7F2]">Is Empty</span>
              </h3>
              <p className="relative mt-3 max-w-[280px] text-xs leading-relaxed text-[#9BB0A5]">
                Discover Himalayan sea buckthorn and certified pH 5.5 apothecary rituals.
              </p>
              <button
                type="button"
                onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
                className="relative mt-8 inline-flex items-center justify-center gap-2.5 rounded-full btn-gold-luxury px-8 py-3.5 text-xs font-bold uppercase tracking-[0.18em]"
              >
                <span>Explore Collections</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}

          {cartItems.length > 0 && <>
            {!checkoutOpen && <section className="two-tone-panel-gold rounded-2xl p-4 border border-[#244A38]" aria-label="Cart rewards and delivery">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D4AF37]">Maison Rewards &amp; Dispatch</span>
                {rulePreview?.membershipTier && <span className="rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#FCE096]">{rulePreview.membershipTier} Member</span>}
              </div>
              <div className="mt-2.5 flex items-start gap-2 text-xs leading-5 text-[#DFD7C4]">
                {rulePreview?.gifts?.length > 0
                  ? <><Gift size={14} className="mt-0.5 shrink-0 text-[#D4AF37]"/><span><strong className="text-white">{rulePreview.gifts[0].productName || 'Complimentary Gift'}</strong> unlocked</span></>
                  : upcomingCartReward
                    ? <><Gift size={14} className="mt-0.5 shrink-0 text-[#D4AF37]"/><span>Add <strong className="text-[#FCE096]">{formatPrice(upcomingCartReward.missingAmount)}</strong> to unlock {upcomingCartReward.badge || upcomingCartReward.name}</span></>
                    : unlockedCartReward
                      ? <><Gift size={14} className="mt-0.5 shrink-0 text-[#D4AF37]"/><span>{unlockedCartReward.badge || unlockedCartReward.name} reward unlocked</span></>
                      : <><ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#D4AF37]"/><span>Rewards and complimentary gifts apply automatically.</span></>}
              </div>
              <div className="mt-2.5 flex items-center gap-2 border-t border-[#244A38] pt-2.5 text-xs text-[#DFD7C4]">
                <Truck size={14} className="shrink-0 text-[#D4AF37]"/>
                <span>{amountToFreeShipping > 0 ? <>Add <strong className="text-[#FCE096]">{formatPrice(amountToFreeShipping)}</strong> for free delivery</> : <strong className="text-white">Complimentary Delivery Unlocked</strong>}</span>
                {rulePreviewLoading && <span className="ml-auto text-[10px] text-[#9BB0A5]">Updating…</span>}
              </div>
            </section>}

            {!checkoutOpen && cartItems.map(item => {
              const product = item.product || item;
              const id = item.product_id || product.id || product._id;
              const image = product.image_url || item.image_url || item.image || product.image || product.images?.[0];
              const price = Number(product.discount_price || item.unit_price || product.price) || 0;
              const itemBusy = busyCartItems.has(String(id));
              const saved = isWishlisted(id);
              return <article key={id} className={`two-tone-card flex gap-3 rounded-2xl p-4 transition-all border border-[#244A38] ${itemBusy ? 'opacity-60' : ''}`}>
                <div className="flex h-[84px] w-[84px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#244A38] bg-[#102219]"><img src={getImageUrl(image)} alt={product.name || 'Cart product'} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="h-full w-full object-contain p-1.5 transition-transform duration-500 hover:scale-110"/></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-sm font-serif font-bold leading-snug text-white hover:text-[#D4AF37] transition-colors">{product.name || 'Bhumivera product'}</h3>
                    <button type="button" aria-label={`Remove ${product.name || 'product'}`} disabled={itemBusy} onClick={() => removeCartItem(id)} className="shrink-0 rounded-lg p-1.5 text-[#9BB0A5] transition hover:bg-rose-500/10 hover:text-rose-400 disabled:cursor-wait"><Trash2 size={15}/></button>
                  </div>
                  {product.sku && <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-[#9BB0A5]">LOT: {product.sku}</p>}
                  {Number(product.review_count) > 0 && Number(product.rating) > 0 && <button type="button" onClick={() => { setIsCartOpen(false); navigate(`/product/${product.slug || id}#product-reviews`); }} className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[#FCE096] hover:underline">
                    <Star size={11} fill="currentColor" className="text-[#D4AF37]"/> {Number(product.rating).toFixed(1)} <span className="text-[#9BB0A5]">({Number(product.review_count)} reviews)</span>
                  </button>}
                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center rounded-full border border-[#244A38] bg-[#102219] p-0.5">
                      <button type="button" aria-label="Decrease quantity" disabled={itemBusy || Number(item.quantity || 1) <= 1} onClick={() => changeCartQuantity(id, Number(item.quantity || 1) - 1)} className="rounded-full p-1.5 text-[#DFD7C4] transition hover:bg-[#1C382B] hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-30"><Minus size={12}/></button>
                      <span className="min-w-7 text-center text-xs font-bold text-white">{item.quantity || 1}</span>
                      <button type="button" aria-label="Increase quantity" disabled={itemBusy} onClick={() => changeCartQuantity(id, Number(item.quantity || 1) + 1)} className="rounded-full p-1.5 text-[#DFD7C4] transition hover:bg-[#1C382B] hover:text-[#D4AF37] disabled:cursor-wait disabled:opacity-30"><Plus size={12}/></button>
                    </div>
                    <span className="font-serif text-base font-bold text-[#D4AF37]">{formatPrice(price * (Number(item.quantity) || 1))}</span>
                  </div>
                  <button type="button" disabled={itemBusy} onClick={() => saveForLater(item)} className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#9BB0A5] transition hover:text-[#D4AF37] disabled:cursor-wait">
                    <Heart size={13} fill={saved ? 'currentColor' : 'none'} className={saved ? 'text-[#D4AF37]' : ''}/>
                    {saved ? 'Saved · in wishlist' : 'Save for later'}
                  </button>
                </div>
              </article>;
            })}

            {!checkoutOpen && <div className="grid grid-cols-2 gap-2 rounded-xl border border-[#244A38] bg-[#102219] p-3 text-[10px] font-semibold text-[#DFD7C4]">
              <span className="flex items-center gap-1.5 text-[#cbd5e1]"><ShieldCheck size={14} className="text-[#d4af37]"/>Artisanal Tamper-Proof</span>
              <span className="flex items-center gap-1.5 text-[#cbd5e1]"><BadgeCheck size={14} className="text-[#d4af37]"/>Lab Verified pH 5.5</span>
            </div>}

            {checkoutOpen && <section className="two-tone-panel rounded-2xl p-4 border border-[#244A38]" aria-label="Checkout details">
              <div className="space-y-4">
              <nav aria-label="Checkout progress" className="grid grid-cols-2 gap-2">
                {['Delivery', 'Payment'].map((label, index) => {
                  const step = index + 1;
                  const active = checkoutStep === step;
                  const complete = checkoutStep > step;
                  return <button type="button" key={label} disabled={step > checkoutStep} onClick={() => setCheckoutStep(step)} aria-current={active ? 'step' : undefined} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold ${active ? 'bg-gradient-to-r from-[#FCE096] to-[#D4AF37] text-[#14291F]' : complete ? 'bg-white/10 text-white' : 'bg-[#102219] text-[#9BB0A5]'}`}>
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${active ? 'bg-[#14291F] text-[#D4AF37]' : 'bg-white/20'}`}>{complete ? '✓' : step}</span>{label}
                  </button>;
                })}
              </nav>
              <div className="flex items-center justify-between gap-3 border-b border-[#244A38] pb-3">
                <div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Step {checkoutStep} of 2</p><h3 id="mini-checkout-title" className="mt-1 flex items-center gap-2 font-serif text-lg text-white font-bold">{checkoutStep === 1 ? <><MapPin size={17} className="text-[#D4AF37]"/>Delivery Details</> : <><ShieldCheck size={17} className="text-[#D4AF37]"/>Payment &amp; Review</>}</h3></div>
                <button type="button" onClick={() => setCheckoutStep(0)} className="rounded-full border border-[#244A38] bg-[#102219] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#DFD7C4] transition hover:border-[#D4AF37] hover:text-[#D4AF37]">Edit Bag</button>
              </div>
              <p className="text-[11px] text-[#9BB0A5]">{cartCount} {cartCount === 1 ? 'item' : 'items'} <span aria-hidden="true">·</span> Total <strong className="text-white">{formatPrice(finalTotal)}</strong></p>
              {!user ? <button type="button" onClick={() => { setIsCartOpen(false); navigate('/login', { state: { from: '/checkout', reopenCart: true } }); }} className="w-full rounded-xl btn-gold-luxury px-4 py-3 text-sm font-bold">Sign in to continue</button> : <>
                {checkoutStep === 1 && <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold text-white">Delivery address</p><button type="button" onClick={() => setAddressFormOpen(open => !open)} className="text-xs font-semibold text-[#D4AF37] underline underline-offset-2">{addressFormOpen ? 'Cancel' : '+ Add Address'}</button></div>
                  {addresses.length > 0 ? addresses.map(address => <label key={address.id} className={`flex cursor-pointer gap-2 rounded-xl border bg-[#102219] p-3 text-xs ${String(selectedAddress) === String(address.id) ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]' : 'border-[#244A38]'}`}>
                    <input type="radio" name="mini-cart-address" value={address.id} checked={String(selectedAddress) === String(address.id)} onChange={() => setSelectedAddress(String(address.id))} className="mt-0.5 accent-[#D4AF37]"/>
                    <span className="min-w-0"><strong className="block text-white">{address.full_name || address.fullName} · {address.label || 'Address'}</strong><span className="mt-1 block leading-5 text-[#9BB0A5]">{address.address_line1 || address.street_address || address.line1}{address.address_line2 ? `, ${address.address_line2}` : ''}, {address.city}, {address.state} {address.pincode || address.postal_code}</span><span className="mt-1 block text-[#9BB0A5]">{address.phone || address.phone_number}</span></span>
                  </label>) : !addressFormOpen && <p className="rounded-xl border border-dashed border-[#244A38] bg-[#102219] p-3 text-xs leading-5 text-[#9BB0A5]">Add a delivery address here to finish your order without leaving the bag.</p>}
                  {addressFormOpen && <form onSubmit={saveAddress} className="grid grid-cols-2 gap-2 rounded-xl border border-[#244A38] bg-[#102219] p-3">
                    <label className="col-span-2 text-[10px] font-semibold text-[#DFD7C4]">Full name<input required autoComplete="name" value={addressForm.fullName} onChange={event => setAddressForm(current => ({ ...current, fullName: event.target.value }))} className="mt-1 w-full rounded-lg border border-[#244A38] bg-[#14291F] text-white px-2.5 py-2 text-xs focus:border-[#D4AF37]"/></label>
                    <label className="col-span-2 text-[10px] font-semibold text-[#DFD7C4]">Phone<input required type="tel" autoComplete="tel" value={addressForm.phone} onChange={event => setAddressForm(current => ({ ...current, phone: event.target.value }))} className="mt-1 w-full rounded-lg border border-[#244A38] bg-[#14291F] text-white px-2.5 py-2 text-xs focus:border-[#D4AF37]"/></label>
                    <label className="col-span-2 text-[10px] font-semibold text-[#DFD7C4]">Address line 1<input required autoComplete="address-line1" value={addressForm.addressLine1} onChange={event => setAddressForm(current => ({ ...current, addressLine1: event.target.value }))} className="mt-1 w-full rounded-lg border border-[#244A38] bg-[#14291F] text-white px-2.5 py-2 text-xs focus:border-[#D4AF37]"/></label>
                    <label className="col-span-2 text-[10px] font-semibold text-[#DFD7C4]">Address line 2 (optional)<input autoComplete="address-line2" value={addressForm.addressLine2} onChange={event => setAddressForm(current => ({ ...current, addressLine2: event.target.value }))} className="mt-1 w-full rounded-lg border border-[#244A38] bg-[#14291F] text-white px-2.5 py-2 text-xs focus:border-[#D4AF37]"/></label>
                    <label className="text-[10px] font-semibold text-[#DFD7C4]">City<input required autoComplete="address-level2" value={addressForm.city} onChange={event => setAddressForm(current => ({ ...current, city: event.target.value }))} className="mt-1 w-full rounded-lg border border-[#244A38] bg-[#14291F] text-white px-2.5 py-2 text-xs focus:border-[#D4AF37]"/></label>
                    <label className="text-[10px] font-semibold text-[#DFD7C4]">State<input required autoComplete="address-level1" value={addressForm.state} onChange={event => setAddressForm(current => ({ ...current, state: event.target.value }))} className="mt-1 w-full rounded-lg border border-[#244A38] bg-[#14291F] text-white px-2.5 py-2 text-xs focus:border-[#D4AF37]"/></label>
                    <label className="col-span-2 text-[10px] font-semibold text-[#DFD7C4]">PIN code<input required inputMode="numeric" autoComplete="postal-code" value={addressForm.pincode} onChange={event => setAddressForm(current => ({ ...current, pincode: event.target.value }))} className="mt-1 w-full rounded-lg border border-[#244A38] bg-[#14291F] text-white px-2.5 py-2 text-xs focus:border-[#D4AF37]"/></label>
                    <button disabled={addressSaving} className="col-span-2 rounded-lg btn-gold-luxury px-3 py-2.5 text-xs font-bold disabled:opacity-50">{addressSaving ? 'Saving address…' : 'Save Delivery Address'}</button>
                  </form>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setShippingMethod('STANDARD')} aria-pressed={shippingMethod === 'STANDARD'} className={`rounded-xl border bg-[#102219] p-3 text-left ${shippingMethod === 'STANDARD' ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]' : 'border-[#244A38]'}`}>
                    <span className="block text-xs font-semibold text-white">Standard Dispatch</span>
                    <span className="mt-1 block text-[10px] text-[#9BB0A5]">5–7 days · {standardDeliveryCost ? formatPrice(standardDeliveryCost) : 'Free'}</span>
                  </button>
                  {(subtotal >= PREMIUM_DELIVERY_THRESHOLD || shippingMethod === 'PREMIUM') && <button type="button" onClick={() => setShippingMethod('PREMIUM')} aria-pressed={shippingMethod === 'PREMIUM'} className={`rounded-xl border bg-[#102219] p-3 text-left ${shippingMethod === 'PREMIUM' ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]' : 'border-[#244A38]'}`}>
                    <span className="block text-xs font-semibold text-white">Priority Express</span>
                    <span className="mt-1 block text-[10px] text-[#9BB0A5]">2–4 days · {premiumDeliveryCost ? formatPrice(premiumDeliveryCost) : 'Free'}</span>
                  </button>}
                </div>
                {subtotal < PREMIUM_DELIVERY_THRESHOLD && shippingMethod === 'STANDARD' && <button type="button" onClick={() => setShippingMethod('PREMIUM')} className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#D4AF37] underline underline-offset-2">
                  Upgrade to Priority Express for {formatPrice(PREMIUM_DELIVERY_SURCHARGE)} extra <ArrowRight size={12}/>
                </button>}
                </>}
                {checkoutStep === 2 && <>
                <div className="flex items-start justify-between gap-3 rounded-xl border border-[#244A38] bg-[#102219] p-3 text-xs">
                  <div className="min-w-0"><p className="font-semibold text-white">{selectedAddressDetails?.full_name || selectedAddressDetails?.fullName || 'Delivery address'} · {selectedAddressDetails?.label || 'Address'}</p><p className="mt-1 truncate text-[#9BB0A5]">{selectedAddressDetails ? `${selectedAddressDetails.address_line1 || selectedAddressDetails.street_address || selectedAddressDetails.line1}, ${selectedAddressDetails.city}, ${selectedAddressDetails.state} ${selectedAddressDetails.pincode || selectedAddressDetails.postal_code}` : 'Address selected'}</p><p className="mt-1 text-[#D4AF37]">{shippingMethod === 'PREMIUM' ? 'Priority Express · 2–4 days' : 'Standard Delivery · 5–7 days'} · {shippingCost ? formatPrice(shippingCost) : 'Free'}</p></div>
                  <button type="button" onClick={() => setCheckoutStep(1)} className="shrink-0 font-semibold text-[#D4AF37] underline underline-offset-2">Edit</button>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-white">Payment Method</p>
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#244A38] bg-[#102219] p-3 text-xs text-white"><input type="radio" name="mini-cart-payment" checked={paymentMode === 'online'} onChange={() => setPaymentMode('online')} className="accent-[#D4AF37]"/>Pay securely with Razorpay <span className="ml-auto text-[9px] font-bold uppercase tracking-wide text-[#D4AF37]">Recommended</span></label>
                  <label className="flex cursor-pointer items-center justify-between gap-2 rounded-xl border border-[#244A38] bg-[#102219] p-3 text-xs text-white"><span className="flex items-center gap-2"><input type="radio" name="mini-cart-payment" checked={paymentMode === 'WALLET'} onChange={() => setPaymentMode('WALLET')} className="accent-[#D4AF37]"/>Bhumivera Wallet</span><span className="text-[#9BB0A5]">{walletBalance === null ? 'Balance unavailable' : `Balance ${formatPrice(walletBalance)}`}</span></label>
                  {walletBalanceError && <p role="alert" className="rounded-lg bg-rose-950/50 border border-rose-500/30 px-3 py-2 text-[10px] text-rose-300">{walletBalanceError}</p>}
                  <label className={`flex items-center gap-2 rounded-xl border bg-[#102219] p-3 text-xs text-white ${codEligibility.eligible ? 'cursor-pointer border-[#244A38]' : 'cursor-not-allowed border-[#244A38]/50 opacity-60'}`}><input type="radio" name="mini-cart-payment" checked={paymentMode === 'COD'} disabled={!codEligibility.eligible} onChange={() => setPaymentMode('COD')} className="accent-[#D4AF37]"/>Cash on Delivery (COD)</label>
                  <p role="status" className="rounded-lg bg-[#14291F] border border-[#244A38] px-3 py-2 text-[10px] leading-4 text-[#9BB0A5]">
                    {!codEligibility.available
                      ? 'Cash on delivery eligibility could not be verified. Please use Razorpay or Wallet.'
                      : codEligibility.eligible
                        ? 'Cash on delivery is available for your account.'
                        : `Cash on delivery unlocks after 2 orders are successfully delivered (${codEligibility.deliveredOrderCount} delivered so far). Please choose Razorpay.`}
                  </p>
                </div>

                <label className="block text-[10px] font-semibold text-[#DFD7C4]">Delivery note (optional)<textarea rows={2} value={orderNotes} onChange={event => setOrderNotes(event.target.value)} className="mt-1 w-full resize-none rounded-lg border border-[#244A38] bg-[#14291F] text-white px-3 py-2 text-xs focus:border-[#D4AF37]" placeholder="Any dispatch directions for our courier?"/></label>
                </>}
              </>}
              </div>
            </section>}

            {!checkoutOpen && <section className="overflow-hidden rounded-2xl border border-[#244A38] bg-[#1C382B]">
              <button type="button" onClick={() => setOffersOpen(open => !open)} aria-expanded={offersOpen} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
                <span className="flex items-center gap-2"><span className="rounded-lg bg-[#14291F] p-2 text-[#D4AF37] border border-[#244A38]"><Tag size={15}/></span><span><span className="block text-sm font-serif font-bold text-white">Coupons &amp; Offers</span><span className="block text-[10px] text-[#9BB0A5]">{offersToShow.length ? `${offersToShow.length} available offers` : 'Enter a promo code'}</span></span></span>
                {offersOpen ? <ChevronUp size={16} className="text-[#9BB0A5]"/> : <ChevronDown size={16} className="text-[#9BB0A5]"/>}
              </button>
              {offersOpen && <div className="border-t border-[#244A38] p-3 bg-[#102219]">
                {Number(referralReward?.balance) > 0 && <p className="mb-3 rounded-lg border border-[#D4AF37]/30 bg-[#1E3E2F] px-3 py-2 text-xs leading-5 text-[#FCE096]">Shopping wallet balance {formatPrice(referralReward.balance)}{referralWalletAmount > 0 ? ` · ${formatPrice(referralWalletAmount)} applied` : ''}</p>}
                {loyalty?.enabled && <p className="mb-3 rounded-lg border border-[#244A38] bg-[#1E3E2F] px-3 py-2 text-xs leading-5 text-[#DFD7C4]">{loyalty.currentTier?.name || 'Loyalty Member'} · {Number(loyalty.pointsBalance || 0).toLocaleString()} points available</p>}
                <form onSubmit={validateCoupon} className="flex gap-2">
                  <input value={couponCode} onChange={event => setCouponCode(event.target.value)} aria-label="Coupon code" placeholder="Enter coupon code" className="min-w-0 flex-1 rounded-xl border border-dashed border-[#244A38] bg-[#14291F] text-white px-3 py-2.5 text-xs outline-none focus:border-[#D4AF37]"/>
                  <button disabled={couponBusy || !couponCode.trim()} className="rounded-xl btn-gold-luxury px-4 py-2 text-xs font-bold disabled:opacity-50">{couponBusy ? 'Checking…' : 'Apply'}</button>
                </form>
                {couponMessage && <p role="status" className={`mt-2 text-xs ${appliedCoupon && couponDiscount > 0 ? 'text-[#D4AF37]' : appliedCoupon ? 'text-[#FCE096]' : 'text-rose-400'}`}>{couponMessage}</p>}
                {offersToShow.length > 0 && <div className="mt-3 space-y-2">
                {offersToShow.map((offer, index) => {
                  const minimum = Number(offer.min_order_amount ?? offer.min_order_value) || 0;
                  const amountNeeded = Math.max(0, minimum - subtotal);
                  const isReferralReward = offer.reward_type === 'referral_wallet';
                  const isFreeShipping = offer.reward_type === 'free_shipping';
                  return (
                    <button
                      type="button"
                      key={offer.code}
                      disabled={couponBusy}
                      onClick={() => {
                        setCouponCode(offer.code);
                        void applyCouponCode(offer.code);
                      }}
                      className="flex w-full items-center justify-between gap-3 rounded-lg bg-[#14291F] border border-[#244A38] px-3 py-2 text-left text-xs hover:border-[#D4AF37]/50 disabled:opacity-60"
                    >
                      <span className="min-w-0">
                        <strong className="font-mono text-[#D4AF37]">{offer.code}</strong>
                        <span className="ml-2 text-[#DFD7C4]">
                          {isReferralReward
                            ? `Use shopping reward up to ${formatPrice(offer.wallet_per_order_limit || offer.discount_value)}`
                            : isFreeShipping
                              ? 'Free shipping'
                            : `${offer.discount_value ?? offer.value}% off`}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-[#9BB0A5]">
                          {amountNeeded > 0
                            ? `Add ${formatPrice(amountNeeded)} to qualify.`
                            : offer.estimatedSaving > 0
                              ? `Estimated saving ${formatPrice(offer.estimatedSaving)}`
                              : 'Tap to apply'}
                        </span>
                      </span>
                      <span className="shrink-0 text-right text-[9px] font-bold uppercase tracking-wider text-[#D4AF37]">
                        {index === 0 && offer.estimatedSaving > 0 ? 'Best Saving' : 'Apply'}
                      </span>
                    </button>
                  );
                })}
                </div>}
              </div>}
            </section>}

            {!checkoutOpen && <section className="overflow-hidden rounded-2xl border border-[#244A38] bg-[#1C382B]">
              <button type="button" aria-expanded={recommendationsOpen} onClick={() => setRecommendationsOpen(open => !open)} className="flex w-full items-center justify-between px-4 py-3 text-left">
                <span><span className="block text-xs font-serif font-bold uppercase tracking-wider text-white">Considered Pairings</span><span className="mt-0.5 block text-[10px] text-[#9BB0A5]">Curated for complete routine balance</span></span>
                {recommendationsOpen ? <ChevronUp size={16} className="text-[#9BB0A5]"/> : <ChevronDown size={16} className="text-[#9BB0A5]"/>}
              </button>
              {recommendationsOpen && <div className="space-y-2 border-t border-[#244A38] p-3 bg-[#102219]">
                <div className="grid grid-cols-2 gap-2">
                  {recommendationsToShow.slice(0, 2).map(product => <article key={product.id || product._id} className="flex min-w-0 items-center gap-2 rounded-xl border border-[#244A38] bg-[#14291F] p-2">
                    <img src={getImageUrl(product.image_url || product.images || product.image)} alt={product.name} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="h-12 w-12 shrink-0 rounded-lg bg-black/40 object-contain p-1"/>
                    <div className="min-w-0 flex-1"><p className="line-clamp-2 text-[10px] font-semibold leading-tight text-white">{product.name}</p><p className="mt-1 text-[10px] font-bold text-[#D4AF37]">{formatPrice(product.discount_price || product.price)}</p></div>
                    <button type="button" aria-label={`Add ${product.name} to bag`} onClick={() => addToCart(product)} className="shrink-0 rounded-lg border border-[#D4AF37]/40 p-1.5 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#14291F]"><Plus size={14}/></button>
                  </article>)}
                </div>
              </div>}
            </section>}
          </>}

          {!checkoutOpen && wishlist.length > 0 && <section className="overflow-hidden rounded-2xl border border-[#244A38] bg-[#1C382B]" aria-label="Saved for later items">
            <button type="button" aria-expanded={savedListOpen} aria-controls="mini-cart-saved-items" onClick={() => setSavedListOpen(open => !open)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
              <span className="flex items-center gap-2 text-sm font-serif font-bold text-white"><Heart size={16} className="text-[#D4AF37]"/>Saved for Later <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-[#DFD7C4]">{wishlist.length}</span></span>
              {savedListOpen ? <ChevronUp size={16} className="text-[#9BB0A5]"/> : <ChevronDown size={16} className="text-[#9BB0A5]"/>}
            </button>
            {savedListOpen && <div id="mini-cart-saved-items" className="max-h-64 space-y-2 overflow-y-auto border-t border-[#244A38] p-3 bg-[#102219]">
              {wishlist.map(savedItem => {
                const product = savedItem.product || savedItem;
                const id = savedItem.product_id || product.id || product._id;
                const savedBusy = busySavedItem === String(id);
                return <article key={id} className="flex items-center gap-2 rounded-xl bg-[#14291F] border border-[#244A38] p-2">
                  <img src={getImageUrl(product.image_url || product.images || product.image)} alt={product.name || 'Saved product'} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="h-11 w-11 shrink-0 rounded-lg bg-black object-contain p-1"/>
                  <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-white">{product.name || 'Saved product'}</p><p className="mt-1 text-[10px] font-bold text-[#D4AF37]">{formatPrice(product.discount_price || product.price)}</p></div>
                  <button type="button" disabled={busySavedItem !== null} onClick={() => moveSavedItemToCart(savedItem)} className="rounded-lg btn-gold-luxury px-3 py-1.5 text-[10px] font-bold disabled:opacity-50">{savedBusy ? 'Moving…' : 'Add'}</button>
                  <button type="button" disabled={busySavedItem !== null} aria-label={`Remove ${product.name || 'saved product'} from wishlist`} onClick={() => removeSavedItem(id)} className="rounded-lg p-2 text-[#9BB0A5] transition hover:text-rose-400 disabled:cursor-wait"><Trash2 size={14}/></button>
                </article>;
              })}
            </div>}
          </section>}
        </div>

        {cartItems.length > 0 && <footer className={`mini-cart-footer shrink-0 border-t border-[#D4AF37]/20 bg-[#102219]/90 backdrop-blur-xl px-5 py-4 shadow-2xl sm:px-7 ${checkoutOpen ? `flex flex-col ${summaryExpanded ? 'h-[min(52vh,460px)]' : ''}` : ''}`}>
          <div className={checkoutOpen && summaryExpanded ? 'flex min-h-0 flex-1 flex-col text-xs' : 'space-y-2 text-xs'}>
            <div className="flex items-center justify-between text-[#DFD7C4]">
              <span className="flex items-center gap-2">
                <span>Subtotal</span>
                {checkoutOpen && <button
                  type="button"
                  aria-label={summaryExpanded ? 'Hide order summary details' : 'Show order summary details'}
                  aria-expanded={summaryExpanded}
                  aria-controls="mini-cart-summary-details"
                  onClick={() => setSummaryExpanded(open => !open)}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/5 text-[#DFD7C4] shadow-sm transition hover:text-[#D4AF37]"
                >
                  {summaryExpanded ? <ChevronDown size={14}/> : <ChevronUp size={14}/>}
                </button>}
              </span>
              <strong className="text-white font-serif font-bold text-sm">{formatPrice(subtotal)}</strong>
            </div>
            <div
              id="mini-cart-summary-details"
              className={`${checkoutOpen && summaryExpanded ? 'min-h-0 flex-1 overflow-y-auto pr-1' : ''} ${checkoutOpen && !summaryExpanded ? 'hidden' : 'space-y-2'}`}
            >
            {discount > 0 && <div className="flex justify-between text-[#D4AF37]"><span>Cart Offers</span><span>−{formatPrice(discount)}</span></div>}
            {couponDiscount > 0 && <div className="flex justify-between gap-3 font-bold text-[#D4AF37]"><span className="min-w-0 truncate">Coupon{appliedCoupon?.code ? ` · ${appliedCoupon.code}` : ''}</span><span className="shrink-0">−{formatPrice(couponDiscount)}</span></div>}
            {tierDiscount > 0 && <div className="flex justify-between text-[#D4AF37]"><span>Membership Tier</span><span>−{formatPrice(tierDiscount)}</span></div>}
            {referralWalletAmount > 0 && <div className="flex justify-between font-semibold text-[#D4AF37]"><span>Shopping Wallet</span><span>−{formatPrice(referralWalletAmount)}</span></div>}
            {loyalty?.enabled && Number(loyalty?.pointsBalance) >= Number(loyalty?.minimumRedemptionPoints) && pointsRedemption.points > 0 && <label className="flex items-center justify-between gap-3 font-semibold text-[#FCE096]"><span className="flex items-center gap-2"><input type="checkbox" checked={redeemLoyaltyPoints} onChange={event => setRedeemLoyaltyPoints(event.target.checked)} className="accent-[#D4AF37]"/>Use {(redeemLoyaltyPoints ? loyaltyPointsToRedeem : pointsRedemption.points).toLocaleString()} loyalty points</span><span>{loyaltyDiscount > 0 ? `−${formatPrice(loyaltyDiscount)}` : 'Not applied'}</span></label>}
            {totalSavings > 0 && <div className="flex items-center justify-between rounded-lg bg-[#1E3E2F] border border-[#D4AF37]/30 px-3 py-2 text-sm font-bold text-[#D4AF37]"><span>Total Savings Applied</span><span className="text-base font-black">−{formatPrice(totalSavings)}</span></div>}
            {checkoutOpen && <div className="flex justify-between text-[#DFD7C4]"><span>{shippingMethod === 'PREMIUM' ? 'Priority Express · 2–4 days' : 'Standard Delivery · 5–7 days'}</span><span>{shippingCost ? formatPrice(shippingCost) : 'Free'}</span></div>}
            </div>
            <div className={`flex justify-between border-t border-white/10 pt-2 text-sm font-extrabold text-white ${checkoutOpen ? 'mt-2 shrink-0' : ''}`}><span>{checkoutOpen ? 'Final Order Total' : 'Estimated Total'}</span><span className="font-serif text-lg font-bold text-[#D4AF37]">{checkoutOpen ? formatPrice(finalTotal) : formatPrice(estimatedTotal)}</span></div>
          </div>
          {!checkoutOpen
            ? <button type="button" onClick={continueToCheckout} className="btn-gold-luxury mt-3.5 flex w-full shrink-0 items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-bold uppercase tracking-[0.16em]">Proceed to Checkout <ArrowRight size={16}/></button>
            : checkoutStep === 1
              ? <button type="button" onClick={continueToPayment} className="btn-gold-luxury mt-3.5 flex w-full shrink-0 items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-bold uppercase tracking-[0.16em]">Continue to Payment <ArrowRight size={16}/></button>
              : <form onSubmit={placeOrder}>
              <div className="mb-2 flex items-center justify-between">
                <button type="button" onClick={() => setCheckoutStep(1)} className="text-[10px] font-semibold text-[#D4AF37] underline underline-offset-2">← Back to delivery</button>
              </div>
              <button type={user ? 'submit' : 'button'} onClick={!user ? continueToCheckout : undefined} disabled={placingOrder || (user && paymentMode === 'WALLET' && (walletBalance === null || walletBalance < finalTotal))} className="btn-gold-luxury flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-bold uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-50">
                {placingOrder ? 'Processing Order…' : !user ? <>Sign In to Continue <ArrowRight size={16}/></> : <>{paymentMode === 'COD' ? 'Place Order · Cash on Delivery' : paymentMode === 'online' ? 'Pay Securely with Razorpay' : 'Place Wallet Order'} <ArrowRight size={16}/></>}
              </button>
              {paymentMode === 'WALLET' && walletBalance !== null && walletBalance < finalTotal && <p className="mt-1 text-center text-[10px] text-rose-400">Add funds to your wallet or choose Razorpay.</p>}
              <p className="mt-3 text-center text-[10px] leading-4 text-[#9BB0A5]">By placing your order, you agree to our <Link to="/legal/conditions-of-use" target="_blank" rel="noreferrer" className="font-semibold text-white underline underline-offset-2">Conditions of Sale</Link> and <Link to="/legal/privacy-dpdp" target="_blank" rel="noreferrer" className="font-semibold text-white underline underline-offset-2">Privacy Notice</Link>.</p>
            </form>}
        </footer>}
      </aside>
    </div>
  );
}
