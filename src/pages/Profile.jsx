import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useAuth } from '../context/AuthContext';
import { formatOrderNumber } from '../utils/formatOrderNumber';
import { useCart } from '../context/CartContext';
import {
  users as usersApi,
  orders as ordersApi,
  wishlist as wishlistApi,
  contact as contactApi,
  wallet as walletApi,
  affiliate as affiliateApi,
  addresses as addressesApi,
  returns as returnsApi,
  notifications as notificationsApi,
  coupons as couponsApi,
  payments as paymentsApi,
  reviews as reviewsApi,
  warranty as warrantyApi,
  serials as serialsApi,
  auth as authApi,
} from '../services/api';
import { useToast } from '../context/ToastContext';
import compressImageForUpload from '../utils/compressImageForUpload';
import {
  User, Package, Heart, Shield, LifeBuoy, LogOut,
  Wallet, MapPin, Bell, Ticket, Star, Award, Share2,
  ChevronRight, LayoutDashboard, Home, Building2, Map,
  Eye, X, Plus, Edit2, Trash2, Clock, CheckCircle2, AlertTriangle,
  Search, EyeOff, Copy, Send, ArrowRight, ArrowUpRight, ArrowDownLeft,
  QrCode, Smartphone, HelpCircle, Phone, Mail, ShoppingCart,
  Filter, Calendar, Hash, Truck, PackageCheck, RotateCcw,
  ChevronDown, ChevronUp, Gift, PiggyBank, ShoppingBag,
  Leaf, Zap, Users, Coins, ExternalLink, Key, Camera, Image as ImageIcon, Fingerprint,
  Navigation, Check,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { registerPasskey, isPasskeySupported } from '../utils/webauthnClient';
import SupportCenter from '../components/SupportCenter';
import { getProductImageUrl } from '../utils/productImageUrl';
import { getCurrentCoordinates, getLocationErrorMessage, hasCoordinates, reverseGeocodeCoordinates } from '../utils/geolocation';

const getProfileImageUrl = getProductImageUrl;

const TABS = [
  { id: 'overview',      label: 'Overview',      icon: LayoutDashboard },
  { id: 'orders',        label: 'Orders',        icon: Package },
  { id: 'wishlist',      label: 'Wishlist',      icon: Heart },
  { id: 'wallet',        label: 'Wallet',        icon: Wallet },
  { id: 'addresses',     label: 'Addresses',     icon: MapPin },
  { id: 'verify',        label: 'Artisanal Serial & Assay', icon: Award },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'coupons',       label: 'Coupons',       icon: Ticket },
  { id: 'security',      label: 'Security',      icon: Shield },
  { id: 'reviews',       label: 'Reviews',       icon: Star },
  { id: 'affiliate',     label: 'Affiliate',     icon: Share2 },
  { id: 'support',       label: 'Support',       icon: LifeBuoy },
];

let profileRazorpayScriptPromise;
const loadProfileRazorpay = () => {
  if (window.Razorpay) return Promise.resolve();
  if (!profileRazorpayScriptPromise) {
    profileRazorpayScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => {
        profileRazorpayScriptPromise = null;
        reject(new Error('Could not load secure payment. Please try again.'));
      };
      document.body.appendChild(script);
    });
  }
  return profileRazorpayScriptPromise;
};

const SECURITY_QUESTIONS = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What was your first car?",
  "In what city were you born?",
  "What is the name of your favorite teacher?",
  "What is your favorite book?",
];

const CANCELLABLE_STATUSES = ['pending', 'confirmed'];
const DELIVERED_STATUSES = ['delivered', 'completed'];
const canCancelOrder = order => (
  CANCELLABLE_STATUSES.includes((order.status || '').toLowerCase()) &&
  !(order.payment_mode === 'online' && order.payment_status === 'paid')
);
const needsRefundSupport = order => (
  CANCELLABLE_STATUSES.includes((order.status || '').toLowerCase()) &&
  order.payment_mode === 'online' &&
  order.payment_status === 'paid'
);

const faqItems = [
  { q: 'How do I track my order?', a: 'Go to the Orders tab above and click the "Track" button next to your order. You will see live status updates including processing, packed, shipped, out for delivery and delivered timelines.' },
  { q: 'What is your bottle sanitary custody standard?', a: "Every Bhumivera formulation is bottled in small artisanal batches of 250 units and sealed with tamper-evident virgin security to guarantee 100% sterile botanical integrity. You can scan your bottle serial on our /verify portal anytime to view batch lab assays and purity reports." },
  { q: 'How do Wallet and loyalty points work?', a: 'Spendable Wallet funds are a payment method. Shopping rewards and referral balance are non-withdrawable credits for website purchases; they apply automatically under the current eligible order thresholds. Loyalty points are separate, non-cash rewards that can only discount eligible website purchases at checkout.' },
  { q: 'Is my account secure?', a: 'Yes. We use bcrypt password hashing, signed JWT tokens and optional TOTP-based 2FA. We recommend enabling 2FA from the Security tab and setting a security question for password-recovery fallback.' },
  { q: 'How do I join the affiliate program?', a: 'Your referral link is available on the Affiliate tab. Share it with friends. Every signup and purchase made through your link tracks to your account. See the Affiliate tab for live stats and share buttons.' },
];

const EmptyState = ({ icon: Icon, title, subtitle, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-20 h-20 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mb-5 shadow-inner">
      <Icon className="w-9 h-9 text-[#d4af37]" strokeWidth={1.7}/>
    </div>
    <h3 className="text-xl font-serif font-bold text-white mb-2">{title}</h3>
    <p className="text-xs sm:text-sm text-[#cbd5e1] max-w-sm mb-6 leading-relaxed font-light">{subtitle}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="btn-gold-luxury inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider"
      >
        {actionLabel}
        <ArrowRight className="w-4 h-4"/>
      </button>
    )}
  </div>
);

const LabelIcon = ({ label }) => {
  const l = (label || '').toLowerCase();
  if (l.includes('work') || l.includes('office')) return <Building2 className="w-4 h-4 text-[#fce096]"/>;
  if (l.includes('other')) return <Map className="w-4 h-4 text-[#fce096]"/>;
  return <Home className="w-4 h-4 text-[#fce096]"/>;
};

const StatusPill = ({ status }) => {
  const s = (status || '').toLowerCase();
  const cfg = (() => {
    if (['pending', 'pending_admin_review', 'waiting_customer_service_review', 'processing', 'confirmed'].includes(s))
      return { bg: 'bg-[#d4af37]/15 text-[#fce096] border-[#d4af37]/35', dot: 'bg-[#d4af37]' };
    if (['packed', 'shipped', 'out_for_delivery', 'out for delivery', 'return_in_progress'].includes(s))
      return { bg: 'bg-[#e2e8f0]/10 text-[#e2e8f0] border-[#cbd5e1]/30', dot: 'bg-[#cbd5e1]' };
    if (['delivered', 'completed', 'paid', 'approved', 'registered', 'active', 'replacement_sent'].includes(s))
      return { bg: 'bg-[#d4af37]/20 text-[#ffffff] border-[#d4af37]/50', dot: 'bg-[#fce096]' };
    if (['cancelled', 'canceled', 'rejected', 'expired', 'failed'].includes(s))
      return { bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30', dot: 'bg-rose-400' };
    if (['refunded', 'returned', 'received'].includes(s))
      return { bg: 'bg-[#94a3b8]/15 text-[#cbd5e1] border-[#94a3b8]/30', dot: 'bg-[#cbd5e1]' };
    if (['unread'].includes(s))
      return { bg: 'bg-[#d4af37]/20 text-[#fce096] border-[#d4af37]/40', dot: 'bg-[#d4af37]' };
    return { bg: 'bg-[#070a0e] text-[#cbd5e1] border-[#cbd5e1]/20', dot: 'bg-[#94a3b8]' };
  })();
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium tracking-wide uppercase ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>
      {s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g,' ')}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, accent, onClick, hint }) => (
  <button
    onClick={onClick}
    className={`group w-full text-left rounded-2xl border p-5 bg-[#0d1520]/80 backdrop-blur border-[#d4af37]/20 hover:border-[#d4af37]/60 hover:shadow-lg transition-all duration-300 ${
      accent === 'gold' ? 'border-[#d4af37]/40 bg-[#0d1520]/95' : ''
    }`}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-11 h-11 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/25 flex items-center justify-center text-[#d4af37]">
        <Icon className="w-5 h-5"/>
      </div>
      <ChevronRight className="w-4 h-4 text-[#94a3b8] group-hover:translate-x-0.5 group-hover:text-[#fce096] transition-all"/>
    </div>
    <div className="text-2xl font-serif font-bold text-white mb-1 tracking-tight">{value}</div>
    <div className="text-xs text-[#cbd5e1] uppercase tracking-wider">{label}</div>
    {hint && <div className="text-[11px] text-[#94a3b8] mt-1 font-light">{hint}</div>}
  </button>
);

const StarsInput = ({ value, onChange, size='md', readonly=false }) => {
  const sz = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" disabled={readonly}
          onClick={() => !readonly && onChange(n)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}>
          <Star className={`${sz} ${n <= value ? 'fill-[#d4af37] text-[#d4af37]' : 'text-[#94a3b8]/30'}`}/>
        </button>
      ))}
    </div>
  );
};

export default function Profile() {
  const toast = useToast();
  const { user, logout, updateUser } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const passkeySupported = isPasskeySupported();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const mobileTabsRef = useRef(null);

  const [profileData, setProfileData] = useState({ name: '', phone: '', marketing_email_opt_in: false });
  const [adPersonalizationOptIn, setAdPersonalizationOptIn] = useState(false);
  const [adPreferenceSaving, setAdPreferenceSaving] = useState(false);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistError, setWishlistError] = useState('');
  const [wallet, setWallet] = useState({ balance: 0, referralBalance: 0, referralBalanceAvailable: true, transactions: [] });
  const [loyaltyData, setLoyaltyData] = useState({ points: 0, lifetimePoints: 0, tier: null });
  const [walletTopUpAmount, setWalletTopUpAmount] = useState('1000');
  const [walletTopUpBusy, setWalletTopUpBusy] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [returns, setReturns] = useState([]);
  const [returnEligibility, setReturnEligibility] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [warranties, setWarranties] = useState([]);

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [secQuestion, setSecQuestion] = useState({ question: SECURITY_QUESTIONS[0], answer: '' });
  const [passkeys, setPasskeys] = useState([]);
  const [loadingPasskey, setLoadingPasskey] = useState(false);

  useEffect(() => {
    if (activeTab === 'security' && passkeySupported) {
      authApi.listPasskeys()
        .then(res => setPasskeys(res.data?.passkeys || []))
        .catch(() => {});
    }
  }, [activeTab, passkeySupported]);

  const handleRegisterPasskey = async () => {
    setLoadingPasskey(true);
    try {
      await registerPasskey('Touch ID / Face ID (' + (navigator.platform || 'Device') + ')');
      toast.success('Passkey registered successfully! You can now use biometrics to sign in.');
      const res = await authApi.listPasskeys();
      setPasskeys(res.data?.passkeys || []);
    } catch (err) {
      toast.error(err.message || 'Passkey registration cancelled or failed.');
    } finally {
      setLoadingPasskey(false);
    }
  };

  const handleDeletePasskey = async (id) => {
    try {
      await authApi.deletePasskey(id);
      toast.success('Passkey removed.');
      setPasskeys(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      toast.error('Could not remove passkey.');
    }
  };

  const [twoFactor, setTwoFactor] = useState({ isEnabled: false, qrCode: '', secret: '', otp: '' });
  const [supportTicket, setSupportTicket] = useState({ subject: '', message: '', order_id: '', product_id: '' });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnOrder, setReturnOrder] = useState(null);
  const [returnSubmitting, setReturnSubmitting] = useState(false);
  const [returnUploadProgress, setReturnUploadProgress] = useState(0);
  const returnPhotoInputRef = useRef(null);
  const [returnEligibilityClock, setReturnEligibilityClock] = useState(Date.now());
  const [addressModal, setAddressModal] = useState({ open:false, editId:null, form:{ label:'Home', full_name:'', phone:'', line1:'', line2:'', city:'', state:'', postal_code:'', country:'India', is_default:false, latitude:null, longitude:null, google_maps_url:'' }});
  const [locatingAddress, setLocatingAddress] = useState(false);
  const [copiedAddressId, setCopiedAddressId] = useState(null);
  const [faqOpen, setFaqOpen] = useState(new Set());
  const [reviewEditing, setReviewEditing] = useState(null);
  const [reviewSubmission, setReviewSubmission] = useState(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewUploadProgress, setReviewUploadProgress] = useState(0);
  const [reviewDraft, setReviewDraft] = useState({ rating: 5, title: '', body: '', images: [], publicStoryConsent: false });
  const reviewCameraInputRef = useRef(null);
  const reviewGalleryInputRef = useRef(null);

  const [warrantyInput, setWarrantyInput] = useState({ serial: '' });
  const [warrantyCheck, setWarrantyCheck] = useState(null);
  const [couponValidate, setCouponValidate] = useState({ code:'', result:null });
  const [affiliateCopied, setAffiliateCopied] = useState(false);
  const [referralData, setReferralData] = useState(null);
  const [referralQr, setReferralQr] = useState('');

  const unreadCount = notifications.filter(n => !n.is_read && !n.read_at && n.status !== 'read').length;

  useEffect(() => { fetchAllForActiveTab(); }, [activeTab]);
  useEffect(() => {
    if (!['orders', 'returns'].includes(activeTab)) return undefined;
    const timer = setInterval(() => setReturnEligibilityClock(Date.now()), 15000);
    return () => clearInterval(timer);
  }, [activeTab]);

  const safeExtract = (res, ...keys) => {
    let d = res?.data;
    for (const k of keys) if (d && typeof d === 'object' && k in d) d = d[k];
    return d;
  };
  const safeArr = (x) => Array.isArray(x) ? x : [];

  const fetchAllForActiveTab = async () => {
    setLoading(true);
    try {
      const tab = activeTab;
      const needsProfile = ['overview','security'];
      const needsOrders = ['overview','orders','returns','support'];
      const needsWishlist = ['overview','wishlist'];
      const needsWallet = ['overview','wallet'];
      const needsAddresses = ['addresses'];
      const needsReturns = ['orders','returns'];
      const needsNotifications = ['notifications'];
      const needsCoupons = ['overview','coupons'];
      const needsReviews = ['orders','reviews'];
      const needsWarranties = ['warranty'];

      const jobs = [];
      if (needsProfile.includes(tab)) jobs.push(loadProfile());
      if (needsOrders.includes(tab)) jobs.push(loadOrders());
      if (needsWishlist.includes(tab)) jobs.push(loadWishlist());
      if (needsWallet.includes(tab)) jobs.push(loadWallet());
      if (needsAddresses.includes(tab)) jobs.push(loadAddresses());
      if (needsReturns.includes(tab)) jobs.push(loadReturns());
      if (needsNotifications.includes(tab)) jobs.push(loadNotifications());
      if (needsCoupons.includes(tab)) jobs.push(loadCoupons());
      if (needsReviews.includes(tab)) jobs.push(loadReviews());
      if (needsWarranties.includes(tab)) jobs.push(loadWarranties());
      await Promise.all(jobs);
    } finally { setLoading(false); }
  };

  const loadProfile = async () => {
    try {
      const res = await usersApi.getProfile();
      const u = safeExtract(res, 'user') || safeExtract(res, 'data') || res?.data || {};
      setProfileData({
        name: u.name || u.first_name || u.full_name || '',
        phone: u.phone || u.mobile || u.phone_number || '',
        marketing_email_opt_in: Boolean(Number(u.marketing_email_opt_in)),
      });
      setAdPersonalizationOptIn(Boolean(Number(u.ad_personalization_opt_in)));
      setLoyaltyData({
        points: Math.max(0, Number(u.loyalty_points) || 0),
        lifetimePoints: Math.max(0, Number(u.loyalty_lifetime_points) || 0),
        tier: u.loyalty || u.loyaltyProgress || null,
      });
      setTwoFactor(p => ({ ...p, isEnabled: !!u.two_factor_enabled || u.two_factor_enabled === 1 }));
      if (u.security_question) setSecQuestion(s => ({ ...s, question: u.security_question, answer: u.security_answer || s.answer }));
    } catch (_) {}
  };
  const loadOrders = async () => {
    try {
      const res = await ordersApi.getMyOrders();
      setOrders(safeArr(safeExtract(res, 'orders')) || safeArr(safeExtract(res, 'data')) || safeArr(res?.data));
    } catch (_) {}
  };
  const loadWishlist = async () => {
    try {
      const res = await wishlistApi.get();
      const items = safeArr(safeExtract(res, 'wishlist')) || safeArr(safeExtract(res, 'items')) || safeArr(safeExtract(res, 'data')) || safeArr(res?.data);
      setWishlist(items);
      setWishlistError('');
    } catch (error) {
      console.error('[PROFILE_WISHLIST_FETCH]', error);
      setWishlistError(error.response?.data?.message || 'Could not load your saved products.');
    }
  };
  const loadWallet = async () => {
    try {
      const [balanceResult, historyResult] = await Promise.allSettled([
        walletApi.getBalance(),
        walletApi.getHistory(),
      ]);
      if (balanceResult.status === 'rejected') throw balanceResult.reason;
      const balRes = balanceResult.value;
      const histRes = historyResult.status === 'fulfilled' ? historyResult.value : null;
      const balance = balRes?.data?.balance ?? balRes?.data?.data?.balance ?? 0;
      const referralBalance = balRes?.data?.referralBalance ?? balRes?.data?.data?.referralBalance ?? 0;
      const transactions = safeArr(safeExtract(histRes, 'transactions')) || safeArr(safeExtract(histRes, 'history')) || safeArr(safeExtract(histRes, 'data')) || safeArr(histRes?.data);
      setWallet({
        balance: Number(balance) || 0,
        referralBalance: Number(referralBalance) || 0,
        referralBalanceAvailable: balRes?.data?.referralBalanceAvailable !== false,
        transactions,
      });
      if (historyResult.status === 'rejected') {
        console.error('[PROFILE_WALLET_HISTORY_LOAD]', historyResult.reason);
        toast.error('Wallet balance loaded, but transaction history is temporarily unavailable.');
      }
    } catch (error) {
      console.error('[PROFILE_WALLET_BALANCE_LOAD]', error);
      toast.error(error.response?.data?.message || 'Could not load your wallet balance. Please try again.');
    }
  };

  const purchaseWalletBalance = async event => {
    event.preventDefault();
    const amount = Number(walletTopUpAmount);
    if (!Number.isFinite(amount) || amount < 1 || amount > 100000) {
      toast.error('Enter a wallet top-up amount between ₹1 and ₹1,00,000.');
      return;
    }
    setWalletTopUpBusy(true);
    try {
      await loadProfileRazorpay();
      const { data: razorpayOrder } = await paymentsApi.createOrder({
        amount: Math.round(amount * 100),
        currency: 'INR',
        purpose: 'wallet_topup',
      });
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID || razorpayOrder.key_id;
      if (!key || !razorpayOrder.order_id) throw new Error('Secure wallet payment is not configured.');
      const checkout = new window.Razorpay({
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Bhumivera',
        description: 'Add spendable wallet balance',
        order_id: razorpayOrder.order_id,
        prefill: { name: user?.name || '', email: user?.email || '' },
        theme: { color: '#2C3E2D' },
        handler: async payment => {
          try {
            await walletApi.confirmTopUp(payment);
            await loadWallet();
            toast.success(`₹${amount.toFixed(2)} was added to your spendable wallet.`);
          } catch (error) {
            toast.error(`${error.response?.data?.message || 'Payment needs support review.'} Payment ID: ${payment.razorpay_payment_id}`);
          } finally {
            setWalletTopUpBusy(false);
          }
        },
        modal: { ondismiss: () => setWalletTopUpBusy(false) },
      });
      checkout.on('payment.failed', paymentEvent => {
        toast.error(paymentEvent.error?.description || 'Wallet payment failed. Please try again.');
        setWalletTopUpBusy(false);
      });
      checkout.open();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not start wallet top-up.');
      setWalletTopUpBusy(false);
    }
  };
  const loadAddresses = async () => {
    try {
      const res = await addressesApi.getAll();
      const addressList = res?.data?.addresses ?? res?.data?.data ?? res?.data;
      if (!Array.isArray(addressList)) throw new Error('The address service returned an invalid address list.');
      setAddresses(addressList);
    } catch (error) {
      console.error('[PROFILE_ADDRESSES_LOAD]', error);
      toast.error(error.response?.data?.message || 'Could not load your saved addresses.');
    }
  };
  const loadReturns = async () => {
    try {
      const [res, eligibilityRes] = await Promise.all([returnsApi.getMyReturns(), returnsApi.getEligibility()]);
      setReturns(safeArr(safeExtract(res, 'returns')) || safeArr(safeExtract(res, 'data')) || safeArr(res?.data));
      const eligibility = safeExtract(eligibilityRes, 'data') || eligibilityRes?.data;
      setReturnEligibility(safeArr(eligibility));
    } catch (error) {
      console.error('[PROFILE_RETURNS_LOAD]', error);
      toast.error(error.response?.data?.message || 'Could not load return eligibility.');
    }
  };
  const loadNotifications = async () => {
    try {
      const res = await notificationsApi.get();
      const list = safeArr(safeExtract(res, 'notifications')) || safeArr(safeExtract(res, 'data')) || safeArr(res?.data);
      setNotifications(list);
    } catch (_) {}
  };
  const loadCoupons = async () => {
    try {
      const [publicRes, personalRes] = await Promise.all([
        couponsApi.getPublicActive(),
        couponsApi.getMine(),
      ]);
      const publicCoupons = Array.isArray(publicRes?.data) ? publicRes.data : publicRes?.data?.coupons || [];
      const personalCoupons = personalRes?.data?.coupons || [];
      const personalCodes = new Set(personalCoupons.map(coupon => coupon.code));
      setCoupons([
        ...personalCoupons,
        ...publicCoupons.filter(coupon => !personalCodes.has(coupon.code)),
      ]);
    } catch (error) {
      console.error('[PROFILE_COUPONS_LOAD]', error);
    }
  };
  const loadReviews = async () => {
    try {
      const res = await reviewsApi.getMyReviews();
      setMyReviews(safeArr(safeExtract(res, 'reviews')) || safeArr(safeExtract(res, 'data')) || safeArr(res?.data));
    } catch (_) {}
  };
  const loadWarranties = async () => {
    try {
      const res = await warrantyApi.getMyWarranties();
      setWarranties(safeArr(safeExtract(res, 'warranties')) || safeArr(safeExtract(res, 'data')) || safeArr(res?.data));
    } catch (_) {}
  };

  // ======== Actions ========
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await usersApi.updateProfile(profileData);
      toast.success('Profile updated successfully');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update profile'); }
  };
  const handleAdPersonalizationChange = async enabled => {
    const previousValue = adPersonalizationOptIn;
    setAdPersonalizationOptIn(enabled);
    setAdPreferenceSaving(true);
    try {
      const response = await usersApi.updateAdPersonalizationPreference(enabled);
      updateUser({
        ad_personalization_opt_in: response.data?.ad_personalization_opt_in ? 1 : 0,
        ad_personalization_consent_version: response.data?.ad_personalization_consent_version || null,
      });
      toast.success(enabled ? 'Personalized recommendations enabled.' : 'Personalization consent withdrawn.');
    } catch (err) {
      setAdPersonalizationOptIn(previousValue);
      toast.error(err.response?.data?.message || 'Could not update the personalization preference.');
    } finally {
      setAdPreferenceSaving(false);
    }
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) { toast.error('New passwords do not match'); return; }
    if ((passwords.new||'').length < 8) { toast.error('Password must be at least 8 characters'); return; }
    try {
      await usersApi.changePassword({ currentPassword: passwords.current, newPassword: passwords.new });
      toast.success('Password changed');
      setPasswords({ current:'', new:'', confirm:'' });
    } catch (err) {
      const d = err.normalized || err.response?.data;
      if (d?.code === 'MIN_LENGTH') toast.error(d.message);
      else if (d?.code === 'COMPLEXITY') toast.error(d.message);
      else if (d?.code === 'COMMON_PASSWORD') toast.error(d.message);
      else if (d?.code === 'PWNED_PASSWORD') toast.error(d.message);
      else if (d?.code === 'PASSWORD_REUSED') toast.error(d.message);
      else if ((err.normalized?.status || err.response?.status) === 401) toast.error('Current password is incorrect');
      else toast.error(d?.message || err.message || 'Failed');
    }
  };
  const handleUpdateSecurityQuestion = async (e) => {
    e.preventDefault();
    if (!secQuestion.answer.trim()) { toast.error('Please provide an answer'); return; }
    try {
      await usersApi.updateSecurityQuestion({ question: secQuestion.question, answer: secQuestion.answer });
      toast.success('Security question updated');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };
  const handleGenerate2FA = async () => {
    try {
      const res = await usersApi.generate2FA();
      const d = res?.data?.data || res?.data || {};
      setTwoFactor(p => ({ ...p, qrCode: d.qrCode || d.qr_code || '', secret: d.secret || '', otp: '' }));
      toast.success('2FA setup generated. Scan the QR code.');
    } catch (_) { toast.error('Could not generate 2FA'); }
  };
  const handleEnable2FA = async () => {
    if (!twoFactor.otp || !twoFactor.secret) { toast.error('Enter OTP from authenticator'); return; }
    try {
      await usersApi.verifyAndEnable2FA({ token: twoFactor.otp, secret: twoFactor.secret });
      setTwoFactor(p => ({ ...p, isEnabled: true, otp: '', qrCode: '', secret: '' }));
      toast.success('Two-factor authentication enabled');
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid OTP'); }
  };
  const handleDisable2FA = async () => {
    try { await usersApi.disable2FA(); setTwoFactor(p => ({ ...p, isEnabled:false })); toast.success('2FA disabled'); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };
  const handleCancelOrder = (orderId) => {
    window.dispatchEvent(
      new CustomEvent('bhumivera:open-support-chat', {
        detail: { verifyOrderId: orderId },
      })
    );
  };
  const handleRemoveWishlist = async (productId) => {
    try { await wishlistApi.remove(productId); setWishlist(w => w.filter(item => String(item.product_id || item.id || item._id) !== String(productId))); toast.success('Removed from wishlist'); }
    catch (_) { toast.error('Could not remove'); }
  };
  const handleWishlistAddToCart = async (product) => {
    const added = await addToCart(product);
    if (added) toast.success('Added to your cart');
    else toast.error('Could not add this product to your cart.');
  };
  const openReturnRequest = order => {
    const orderItems = safeArr(order.items || order.order_items);
    setReturnOrder({
      orderId: order.id,
      order,
      form: { orderItemId: orderItems[0]?.id || '', quantity: 1, reason: '', refundMethod: 'wallet', notes: '', images: [] },
    });
  };
  const addReturnImages = event => {
    const selected = Array.from(event.target.files || []);
    event.target.value = '';
    const accepted = [];
    for (const file of selected) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Evidence photos must be JPEG, PNG, or WebP images.');
      } else if (file.size > 8 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 8 MB photo limit.`);
      } else accepted.push({ file, preview: URL.createObjectURL(file) });
    }
    setReturnOrder(current => {
      if (!current) {
        accepted.forEach(image => URL.revokeObjectURL(image.preview));
        return current;
      }
      const existingImages = Array.isArray(current.form?.images) ? current.form.images : [];
      const room = Math.max(0, 5 - existingImages.length);
      if (accepted.length > room) toast.error('You can attach up to 5 evidence photos.');
      accepted.slice(room).forEach(image => URL.revokeObjectURL(image.preview));
      return { ...current, form: { ...current.form, images: [...existingImages, ...accepted.slice(0, room)] } };
    });
  };
  const removeReturnImage = index => setReturnOrder(current => {
    const existingImages = Array.isArray(current?.form?.images) ? current.form.images : [];
    const image = existingImages[index];
    if (image?.preview) URL.revokeObjectURL(image.preview);
    return current ? { ...current, form: { ...current.form, images: existingImages.filter((_, imageIndex) => imageIndex !== index) } } : current;
  });
  const closeReturnRequest = () => {
    if (returnSubmitting) return;
    (returnOrder?.form?.images || []).forEach(image => URL.revokeObjectURL(image.preview));
    setReturnOrder(null);
  };
  const uploadReturnPhoto = async (file, orderId, index, total) => {
    const compressedFile = await compressImageForUpload(file);
    const { data } = await returnsApi.createUploadUrl({
      filename: compressedFile.name,
      fileType: compressedFile.type,
      size: compressedFile.size,
      order_id: orderId,
    });
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('PUT', data.uploadUrl);
      request.setRequestHeader('Content-Type', compressedFile.type);
      request.upload.onprogress = progress => {
        if (progress.lengthComputable) setReturnUploadProgress(Math.round(((index + progress.loaded / progress.total) / total) * 100));
      };
      request.onload = () => request.status >= 200 && request.status < 300 ? resolve(data.key) : reject(new Error('Evidence photo upload failed. Please try again.'));
      request.onerror = () => reject(new Error('Evidence photo upload failed. Check your connection.'));
      request.send(compressedFile);
    });
  };
  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    const f = returnOrder?.form || {};
    const evidenceImages = Array.isArray(f.images) ? f.images : [];
    if (!returnOrder?.orderId) return;
    if (!f.reason) { toast.error('Please provide a return reason'); return; }
    if (!f.orderItemId) { toast.error('Select the item you need help returning.'); return; }
    setReturnSubmitting(true);
    setReturnUploadProgress(0);
    try {
      const imageUrls = [];
      for (let index = 0; index < evidenceImages.length; index += 1) {
        imageUrls.push(await uploadReturnPhoto(evidenceImages[index].file, returnOrder.orderId, index, evidenceImages.length));
      }
      await returnsApi.submit({
        order_id: returnOrder.orderId,
        items: [{ order_item_id: f.orderItemId, quantity: Number(f.quantity) || 1 }],
        reason: f.reason,
        refund_method: f.refundMethod || 'wallet',
        description: f.notes || '',
        image_urls: imageUrls,
      });
      toast.success('Request sent for admin review. Your order remains delivered while the team reviews it.');
      evidenceImages.forEach(image => URL.revokeObjectURL(image.preview));
      setReturnOrder(null);
      await loadReturns();
    } catch (err) { toast.error(err.response?.data?.message || err.message || 'Could not submit the return request.'); }
    finally { setReturnSubmitting(false); }
  };
  const handleMarkNotifRead = async (id) => {
    try { await notificationsApi.markRead(id); setNotifications(ns => ns.map(n => n.id===id ? { ...n, is_read:1, status:'read' } : n)); }
    catch (_) {}
  };
  const handleMarkAllNotifRead = async () => {
    try { await notificationsApi.markAllRead(); setNotifications(ns => ns.map(n => ({ ...n, is_read:1, status:'read' }))); toast.success('All marked read'); }
    catch (_) {}
  };
  const handleCouponCopy = (code) => {
    try { navigator.clipboard.writeText(code); toast.success(`Copied ${code}`); }
    catch (_) { toast.error('Copy failed'); }
  };
  const handleCouponValidate = async () => {
    if (!couponValidate.code.trim()) return;
    try { const res = await couponsApi.validate(couponValidate.code.trim().toUpperCase()); setCouponValidate(c => ({ ...c, result: { ok:true, data: res.data?.data || res.data || {} }})); }
    catch (err) { setCouponValidate(c => ({ ...c, result: { ok:false, msg: err.response?.data?.message || 'Invalid coupon' }})); }
  };
  const handleReviewSave = async (id, data) => {
    try {
      await reviewsApi.update(id, data);
      toast.success('Review updated');
      setReviewEditing(null);
      await loadReviews();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };
  const addReviewImages = event => {
    const selected = Array.from(event.target.files || []);
    event.target.value = '';
    const accepted = [];
    for (const file of selected) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Review photos must be JPEG, PNG, or WebP images.');
      } else if (file.size > 8 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 8 MB photo limit.`);
      } else {
        accepted.push({ file, preview: URL.createObjectURL(file) });
      }
    }
    setReviewDraft(current => {
      const room = Math.max(0, 5 - current.images.length);
      if (accepted.length > room) toast.error('You can attach up to 5 photos to a review.');
      const additions = accepted.slice(0, room);
      accepted.slice(room).forEach(image => URL.revokeObjectURL(image.preview));
      return { ...current, images: [...current.images, ...additions] };
    });
  };
  const removeReviewImage = index => {
    setReviewDraft(current => {
      const image = current.images[index];
      if (image?.preview) URL.revokeObjectURL(image.preview);
      return { ...current, images: current.images.filter((_, imageIndex) => imageIndex !== index) };
    });
  };
  const closeReviewForm = () => {
    if (reviewSubmitting) return;
    reviewDraft.images.forEach(image => URL.revokeObjectURL(image.preview));
    setReviewDraft({ rating: 5, title: '', body: '', images: [], publicStoryConsent: false });
    setReviewSubmission(null);
  };
  const uploadReviewPhoto = async (file, index, total) => {
    const compressedFile = await compressImageForUpload(file);
    const { data } = await reviewsApi.createUploadUrl({
      filename: compressedFile.name,
      fileType: compressedFile.type,
      size: compressedFile.size,
      order_id: reviewSubmission.orderId,
      product_id: reviewSubmission.productId,
    });
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('PUT', data.uploadUrl);
      request.setRequestHeader('Content-Type', compressedFile.type);
      request.upload.onprogress = event => {
        if (event.lengthComputable) {
          setReviewUploadProgress(Math.round(((index + event.loaded / event.total) / total) * 100));
        }
      };
      request.onload = () => {
        if (request.status >= 200 && request.status < 300) resolve(data.key);
        else reject(new Error('Photo upload failed. Please try again.'));
      };
      request.onerror = () => reject(new Error('Photo upload failed. Check your connection and try again.'));
      request.send(compressedFile);
    });
  };
  const submitPurchaseReview = async event => {
    event.preventDefault();
    if (!reviewSubmission) return;
    setReviewSubmitting(true);
    setReviewUploadProgress(0);
    try {
      const uploadedImages = [];
      for (let index = 0; index < reviewDraft.images.length; index += 1) {
        uploadedImages.push(await uploadReviewPhoto(reviewDraft.images[index].file, index, reviewDraft.images.length));
      }
      await reviewsApi.submit({
        product_id: reviewSubmission.productId,
        order_id: reviewSubmission.orderId,
        rating: reviewDraft.rating,
        title: reviewDraft.title,
        body: reviewDraft.body,
        images: uploadedImages,
        public_story_consent: reviewDraft.publicStoryConsent
      });
      toast.success('Review submitted successfully. It will appear after approval.');
      setReviewSubmission(null);
      reviewDraft.images.forEach(image => URL.revokeObjectURL(image.preview));
      setReviewDraft({ rating: 5, title: '', body: '', images: [], publicStoryConsent: false });
      await loadReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not submit your review.');
    } finally {
      setReviewSubmitting(false);
    }
  };
  const handleReviewDelete = async (id) => {
    if (!window.confirm('Delete your review?')) return;
    try { await reviewsApi.deleteOwner(id); toast.success('Review deleted'); await loadReviews(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };
  const handleWarrantyValidate = async () => {
    if (!warrantyInput.serial.trim()) { toast.error('Enter a serial number'); return; }
    try {
      const res = await serialsApi.validate(warrantyInput.serial.trim());
      setWarrantyCheck({ ok: true, data: res.data?.data || res.data || {} });
    } catch (err) {
      setWarrantyCheck({ ok:false, msg: err.response?.data?.message || 'Invalid or not found' });
    }
  };
  const handleWarrantyRegister = async () => {
    if (!warrantyCheck?.ok) return;
    const s = warrantyInput.serial.trim();
    try {
      await warrantyApi.register({ serial: s, product_id: warrantyCheck.data?.productId || warrantyCheck.data?.product_id || null });
      toast.success('Warranty registered');
      setWarrantyInput({ serial:'' }); setWarrantyCheck(null);
      await loadWarranties();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to register'); }
  };
  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!supportTicket.subject.trim() || !supportTicket.message.trim()) { toast.error('Fill subject and message'); return; }
    try {
      await contactApi.submit({
        name: profileData.name || user?.name || 'Customer',
        email: user?.email || '',
        subject: supportTicket.subject,
        message: supportTicket.message,
        order_id: supportTicket.order_id || null,
        product_id: supportTicket.product_id || null,
      });
      toast.success('Message sent. We will respond soon.');
      setSupportTicket({ subject:'', message:'', order_id:'', product_id:'' });
      return true;
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); return false; }
  };
  const handleDetectProfileLocation = async () => {
    setLocatingAddress(true);
    try {
      const position = await getCurrentCoordinates();
      const lat = Number(position.latitude.toFixed(7));
      const lng = Number(position.longitude.toFixed(7));
      const updatedFields = {
        latitude: lat,
        longitude: lng,
        google_maps_url: `https://www.google.com/maps?q=${lat},${lng}`,
      };

      let suggestions = {};
      try {
        suggestions = await reverseGeocodeCoordinates(lat, lng);
      } catch (error) {
        console.warn('[PROFILE_ADDRESS_REVERSE_GEOCODING_ERROR]', error);
      }

      setAddressModal(current => ({
        ...current,
        form: {
          ...current.form,
          ...updatedFields,
          line1: current.form.line1 || suggestions.addressLine1 || '',
          city: suggestions.city || current.form.city,
          state: suggestions.state || current.form.state,
          postal_code: suggestions.pincode || current.form.postal_code,
        },
      }));
      toast.success('GPS pin added. Review the suggested address details before saving.');
    } catch (error) {
      console.warn('[PROFILE_GEOLOCATION_ERROR]', error);
      toast.error(getLocationErrorMessage(error));
    } finally {
      setLocatingAddress(false);
    }
  };

  const handleAddressSave = async (e) => {
    e.preventDefault();
    const f = addressModal.form;
    if (!f.full_name || !f.phone || !f.line1 || !f.city || !f.state || !f.postal_code) { toast.error('Please fill all required fields'); return; }
    const payload = {
      label: f.label, full_name: f.full_name, name: f.full_name,
      phone: f.phone, phone_number: f.phone,
      street_address: f.line1, line1: f.line1, address_line1: f.line1, address: f.line1,
      line2: f.line2, address_line2: f.line2, street_address2: f.line2,
      city: f.city, state: f.state, postal_code: f.postal_code, zip: f.postal_code,
      country: f.country, is_default: f.is_default,
      latitude: f.latitude ?? undefined,
      longitude: f.longitude ?? undefined,
      google_maps_url: f.google_maps_url || (hasCoordinates(f.latitude, f.longitude) ? `https://www.google.com/maps?q=${f.latitude},${f.longitude}` : undefined)
    };
    try {
      if (addressModal.editId) {
        await addressesApi.update(addressModal.editId, payload);
        toast.success('Address updated');
      } else {
        await addressesApi.create(payload);
        toast.success('Address added');
      }
      setAddressModal({ open:false, editId:null, form:{ label:'Home', full_name:'', phone:'', line1:'', line2:'', city:'', state:'', postal_code:'', country:'India', is_default:false, latitude:null, longitude:null, google_maps_url:'' }});
      await loadAddresses();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };
  const handleAddressDelete = async (id) => {
    if (!window.confirm('Delete address?')) return;
    try { await addressesApi.delete(id); toast.success('Address deleted'); await loadAddresses(); }
    catch (error) {
      console.error('[PROFILE_ADDRESS_DELETE_ERROR]', error);
      toast.error(error.response?.data?.message || 'Unable to delete this address.');
    }
  };
  const handleSetDefaultAddr = async (id) => {
    try { await addressesApi.setDefault(id); toast.success('Default address updated'); await loadAddresses(); }
    catch (error) {
      console.error('[PROFILE_ADDRESS_DEFAULT_ERROR]', error);
      toast.error(error.response?.data?.message || 'Unable to set the default address.');
    }
  };

  const handleLogout = () => { if (window.confirm('Log out of your account?')) { logout(); navigate('/'); } };

  useEffect(() => {
    if (activeTab !== 'affiliate') return undefined;
    let active = true;
    const refreshReferralSummary = () => affiliateApi.getReferralSummary()
      .then(({ data }) => { if (active) setReferralData(data?.data || null); })
      .catch(error => {
        console.error('[PROFILE_REFERRAL_SUMMARY]', error);
        if (active) toast.error(error.normalized?.message || 'Could not refresh your referral information.');
      });
    refreshReferralSummary();
    const refreshTimer = window.setInterval(refreshReferralSummary, 15000);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
    };
  }, [activeTab, toast]);
  const referralUrl = referralData?.referralUrl || '';
  useEffect(() => {
    let active = true;
    if (!referralUrl) {
      setReferralQr('');
      return () => { active = false; };
    }
    QRCode.toDataURL(referralUrl, { errorCorrectionLevel: 'H', margin: 2, width: 280 })
      .then(dataUrl => { if (active) setReferralQr(dataUrl); })
      .catch(error => {
        console.error('[PROFILE_REFERRAL_QR]', error);
        if (active) setReferralQr('');
      });
    return () => { active = false; };
  }, [referralUrl]);
  const handleCopyRef = async () => {
    if (!referralUrl) { toast.error('Your referral link is still loading.'); return; }
    try { await navigator.clipboard.writeText(referralUrl); setAffiliateCopied(true); toast.success('Referral link copied'); setTimeout(() => setAffiliateCopied(false),2000); }
    catch (_) { toast.error('Copy failed'); }
  };
  const handleCopyReferralCode = async () => {
    if (!referralData?.code) { toast.error('Your referral code is still loading.'); return; }
    try {
      await navigator.clipboard.writeText(referralData.code);
      toast.success('Referral code copied');
    } catch (_) {
      toast.error('Could not copy your referral code.');
    }
  };
  const shareVia = (via) => {
    if (!referralUrl) { toast.error('Your referral link is still loading.'); return; }
    const text = `I'm shopping at Bhumivera. Join with my referral link: ${referralUrl}`;
    try {
      if (via === 'email') { window.open(`mailto:?subject=${encodeURIComponent('Check out Bhumivera')}&body=${encodeURIComponent(text)}`, '_blank'); return; }
      if (via === 'x') { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank'); return; }
      if (via === 'native' && navigator.share) { navigator.share({ title: 'Bhumivera', text, url: referralUrl }); return; }
      handleCopyRef();
    } catch (_) { handleCopyRef(); }
  };

  const toggleFaq = (i) => setFaqOpen(prev => { const n = new Set(prev); if (n.has(i)) n.delete(i); else n.add(i); return n; });

  const displayName = profileData.name || user?.name || user?.first_name || user?.full_name || 'Customer';
  const initials = displayName.split(/\s+/).map(s => s[0]).filter(Boolean).slice(0,2).join('').toUpperCase() || 'B';
  const eligibilityForOrder = orderId => returnEligibility.find(item => String(item.id) === String(orderId));
  const canRequestReturn = orderId => {
    const eligibility = eligibilityForOrder(orderId);
    if (!eligibility || Number(eligibility.has_return_request)) return false;
    const opensAt = new Date(eligibility.return_available_at || '').getTime();
    const expiresAt = new Date(eligibility.return_expires_at || '').getTime();
    return Number.isFinite(opensAt) && Number.isFinite(expiresAt) && returnEligibilityClock >= opensAt && returnEligibilityClock <= expiresAt;
  };
  const returnWindowMessage = orderId => {
    const eligibility = eligibilityForOrder(orderId);
    if (!eligibility) return 'Checking return window…';
    if (Number(eligibility.has_return_request)) return 'Return request already on file';
    const opensAt = new Date(eligibility.return_available_at || '').getTime();
    const expiresAt = new Date(eligibility.return_expires_at || '').getTime();
    if (!Number.isFinite(opensAt) || !Number.isFinite(expiresAt)) return 'Contact support to check eligibility';
    if (Number.isFinite(opensAt) && returnEligibilityClock < opensAt) {
      const remainingMinutes = Math.ceil((opensAt - returnEligibilityClock) / 60000);
      return `Return opens in ${Math.floor(remainingMinutes / 60)}h ${remainingMinutes % 60}m`;
    }
    if (Number.isFinite(expiresAt) && returnEligibilityClock > expiresAt) return 'Return window closed';
    return 'Return request available';
  };
  const eligibleReturnOrders = orders.filter(order =>
    DELIVERED_STATUSES.includes(String(order.status || '').toLowerCase()) && canRequestReturn(order.id)
  );

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-[#14291F] text-[#FAF7F2] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* === Header Card with Concentric Orbit Rings & Glassmorphism === */}
        <div className="relative overflow-hidden rounded-[2.5rem] card-glass-forest px-6 sm:px-10 py-8 sm:py-10 shadow-2xl mb-7 border border-[#D4AF37]/35">
          {/* Subtle concentric orbit rings in background */}
          <span className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-dashed border-[#D4AF37]/20 pointer-events-none" aria-hidden="true" />
          <span className="absolute -right-12 -top-12 h-60 w-60 rounded-full border border-[#D4AF37]/25 shadow-[0_0_30px_rgba(212,175,55,0.06)] pointer-events-none" aria-hidden="true" />
          <div className="absolute -bottom-20 -left-16 w-80 h-80 rounded-full bg-[#244A38]/30 blur-3xl pointer-events-none"/>

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E6C57E] via-[#C89B3C] to-[#A87B24] flex items-center justify-center text-[#14291F] font-serif font-bold text-2xl shadow-xl ring-2 ring-[#D4AF37]/50">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                    Hi, <span className="font-headline-gold">{displayName.split(' ')[0]}</span>
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#FCE096] border border-[#D4AF37]/40 text-xs font-semibold uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5 text-[#D4AF37]"/>
                    Bhumivera Patron
                  </span>
                </div>
                <p className="text-[#DFD7C4] text-xs sm:text-sm mt-1.5 font-light">{user?.email || 'Welcome to your apothecary vault'}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/shop')}
                className="btn-silver-luxury inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                <ShoppingBag className="w-4 h-4"/>
                Explore Shop
              </button>
              <button onClick={handleLogout}
                className="btn-gold-luxury inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <LogOut className="w-4 h-4"/>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* === Mobile Tabs (horizontal scroll) === */}
        <div className="md:hidden -mx-4 px-4 mb-5">
          <div ref={mobileTabsRef} className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map(t => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              const isNotif = t.id === 'notifications' && unreadCount > 0;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`snap-start flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all border ${
                    active
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#C8A97E] text-[#14291F] border-[#FCE096] shadow-md font-bold'
                      : 'bg-[#102219] text-[#DFD7C4] border-[#244A38] hover:border-[#D4AF37]/40'
                  }`}>
                  <Icon className="w-4 h-4"/>
                  {t.label}
                  {isNotif && <span className="text-[10px] bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">{unreadCount}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* === Desktop Sidebar layout === */}
        <div className="flex flex-col md:flex-row gap-7">
          {/* Sidebar desktop */}
          <aside className="hidden md:block w-64 shrink-0">
            <nav className="sticky top-24 rounded-2xl two-tone-panel border border-[#244A38] p-3 space-y-1">
              {TABS.map(t => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                const isNotif = t.id === 'notifications' && unreadCount > 0;
                return (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                      active
                        ? 'bg-[#D4AF37]/15 text-[#FCE096] border border-[#D4AF37]/40 shadow-sm font-bold'
                        : 'text-[#DFD7C4] hover:text-white hover:bg-[#1C382B]/50 border border-transparent'
                    }`}>
                    <Icon className="w-4 h-4 text-[#D4AF37]"/>
                    <span className="flex-1 text-left">{t.label}</span>
                    {isNotif && <span className="text-[10px] bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">{unreadCount}</span>}
                    {active && <ChevronRight className="w-4 h-4 text-[#D4AF37]"/>}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {loading && <div className="mb-4 text-xs font-mono text-[#fce096] animate-pulse">Loading vault data…</div>}

            {/* ======== OVERVIEW ======== */}
            {activeTab === 'overview' && (
              <div className="space-y-7">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <StatCard icon={Package} label="Total Orders" value={orders.length} accent="earth" onClick={() => setActiveTab('orders')}/>
                  <StatCard icon={Heart} label="Wishlist Items" value={wishlist.length} accent="sage" onClick={() => setActiveTab('wishlist')}/>
                  <StatCard icon={Wallet} label="Spendable Vault" value={`₹${Number(wallet.balance||0).toFixed(2)}`} hint={`+ ₹${Number(wallet.referralBalance||0).toFixed(2)} referral credit`} accent="gold" onClick={() => setActiveTab('wallet')}/>
                  <StatCard icon={Award} label="Loyalty Points" value={Number(loyaltyData.points).toLocaleString()} hint={`${loyaltyData.tier?.currentTier || 'Patron tier'} · ${Number(loyaltyData.lifetimePoints).toLocaleString()} lifetime`} accent="sage"/>
                  <StatCard icon={Bell} label="Notifications" value={unreadCount} accent="sage" onClick={() => setActiveTab('notifications')}/>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent orders */}
                  <section className="lg:col-span-2 rounded-2xl two-tone-panel border border-[#d4af37]/25 p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#d4af37]/15">
                      <h2 className="font-serif font-bold text-lg text-white">
                        <span className="font-headline-gold">Recent</span>{' '}
                        <span className="font-headline-silver">Orders</span>
                      </h2>
                      <button onClick={() => setActiveTab('orders')} className="text-xs font-semibold uppercase tracking-wider text-[#cbd5e1] hover:text-[#fce096] inline-flex items-center gap-1 transition-colors">
                        View all <ChevronRight className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                    {orders.length === 0 ? (
                      <EmptyState icon={Package} title="No orders placed yet" subtitle="Explore our certified artisanal formulations and start your ritual." actionLabel="Explore Formulations" onAction={() => navigate('/shop')}/>
                    ) : (
                      <div className="space-y-2.5">
                        {orders.slice(0,5).map(o => (
                          <div key={o.id} className="flex items-center justify-between p-3.5 rounded-xl bg-[#070a0e]/60 hover:bg-[#101a26] border border-[#d4af37]/15 hover:border-[#d4af37]/40 transition-all">
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/25 flex items-center justify-center shrink-0 text-[#d4af37]">
                                <Package className="w-5 h-5"/>
                              </div>
                              <div className="min-w-0">
                                <div className="font-serif font-bold text-sm text-white truncate">Order #{formatOrderNumber(o.order_number || o.id)}</div>
                                <div className="text-xs text-[#94a3b8] flex items-center gap-2 mt-0.5">
                                  <Calendar className="w-3 h-3"/>
                                  {o.created_at ? new Date(o.created_at).toLocaleDateString() : '—'}
                                  <span className="text-[#d4af37]/40">&bull;</span>
                                  <span className="text-[#fce096] font-medium">₹{Number(o.total_amount || o.total || 0).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <StatusPill status={o.status}/>
                              <button onClick={() => setSelectedOrder(o)} className="p-2 rounded-lg bg-[#070a0e] border border-[#d4af37]/20 text-[#cbd5e1] hover:text-white hover:border-[#d4af37]/50 transition-colors">
                                <Eye className="w-4 h-4"/>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Wallet + Coupons */}
                  <section className="space-y-5">
                    <div className="relative overflow-hidden rounded-2xl two-tone-panel-gold p-6 text-white border border-[#d4af37]/35 shadow-xl">
                      <div className="flex items-center justify-between mb-5">
                        <span className="font-sub-gold text-[10px] uppercase tracking-[0.24em] font-semibold">Bhumivera Vault</span>
                        <PiggyBank className="w-5 h-5 text-[#d4af37]"/>
                      </div>
                      <div className="text-xs text-[#cbd5e1] uppercase tracking-wider mb-1 font-light">Available Balance</div>
                      <div className="text-3xl font-serif font-bold tracking-tight mb-4 text-white">
                        <span className="text-[#d4af37]">₹</span>{Number(wallet.balance||0).toFixed(2)}
                      </div>
                      <div className="mb-4 rounded-xl border border-[#d4af37]/30 bg-[#070a0e]/70 p-3 text-xs text-[#cbd5e1]">
                        Referral reward credit: <strong className="text-[#fce096]">₹{Number(wallet.referralBalance||0).toFixed(2)}</strong>
                        <span className="mt-1 block text-[11px] text-[#94a3b8] font-light">Applies automatically when your bag reaches an eligible tier.</span>
                      </div>
                      <button onClick={() => setActiveTab('wallet')} className="btn-gold-luxury w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2">
                        View Ledger <ChevronRight className="w-4 h-4"/>
                      </button>
                    </div>

                    <div className="rounded-2xl two-tone-panel border border-[#d4af37]/25 p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-[#d4af37]/15">
                        <h3 className="font-serif font-bold text-sm text-white">Active Coupons</h3>
                        <button onClick={() => setActiveTab('coupons')} className="text-xs text-[#cbd5e1] hover:text-[#fce096] font-semibold uppercase tracking-wider flex items-center gap-1">All <ChevronRight className="w-3 h-3"/></button>
                      </div>
                      {coupons.length === 0 ? (
                        <div className="text-xs text-[#94a3b8] py-4 text-center">No active coupons right now.</div>
                      ) : (
                        <div className="space-y-2.5">
                          {coupons.slice(0,3).map(c => (
                            <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border border-dashed border-[#d4af37]/30 bg-[#070a0e]/60 hover:border-[#d4af37] transition-colors">
                              <div>
                                <div className="font-mono font-bold text-xs text-[#fce096]">{c.code}</div>
                                <div className="text-xs text-[#cbd5e1] mt-0.5 font-light">
                                  {c.discount_type === 'percent' ? `${c.discount_value}% off` : `₹${c.discount_value} off`}
                                </div>
                              </div>
                              <button onClick={() => handleCouponCopy(c.code)} className="p-2 rounded-lg bg-[#070a0e] border border-[#d4af37]/20 text-[#cbd5e1] hover:text-[#fce096]">
                                <Copy className="w-3.5 h-3.5"/>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="rounded-2xl two-tone-card border border-[#d4af37]/20 p-5 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                      {referralQr ? (
                        <img src={referralQr} alt="QR code for your Bhumivera referral link" className="h-32 w-32 rounded-xl bg-white p-2 border border-[#d4af37]/40"/>
                      ) : (
                        <div role="status" className="grid h-32 w-32 place-items-center rounded-xl bg-[#070a0e] border border-[#d4af37]/25 text-xs text-[#94a3b8]">
                          {referralUrl ? 'Creating QR…' : 'Loading link…'}
                        </div>
                      )}
                      <div>
                        <h3 className="font-serif font-bold text-sm text-white">Share Your QR Pass</h3>
                        <p className="mt-1 text-xs leading-relaxed text-[#cbd5e1] font-light">Friends can scan this code to link directly with your patronage reward benefits.</p>
                        {referralQr && <a href={referralQr} download="bhumivera-referral-qr.png" className="btn-silver-luxury mt-3 inline-flex items-center px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg">Download QR</a>}
                      </div>
                    </div>
                  </section>
                </div>

                {/* Quick Shortcuts */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id:'addresses', label:'Manage Addresses', icon:MapPin, sub:'Ship faster', cls:'border-[#d4af37]/25' },
                    { id:'verify',    label:'Artisanal Assay',   icon:Award,  sub:'Serial & QA',  cls:'border-[#d4af37]/40' },
                    { id:'security',  label:'Secure Account',    icon:Shield, sub:'2FA & Passkey',cls:'border-[#cbd5e1]/25' },
                  ].map(s => {
                    const I = s.icon;
                    return (
                      <button key={s.id} onClick={() => setActiveTab(s.id)}
                        className={`group rounded-2xl p-5 two-tone-card border ${s.cls} hover:border-[#d4af37] hover:shadow-lg transition-all text-left`}>
                        <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/25 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform text-[#d4af37]">
                          <I className="w-5 h-5"/>
                        </div>
                        <div className="font-serif font-bold text-white text-sm mb-0.5">{s.label}</div>
                        <div className="text-xs text-[#94a3b8] font-light">{s.sub}</div>
                      </button>
                    );
                  })}
                </section>
              </div>
            )}

            {/* ======== ORDERS ======== */}
            {activeTab === 'orders' && (
              <section className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-6 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#d4af37]/20">
                  <h2 className="text-xl font-serif font-bold text-white">
                    <span className="font-headline-gold">Orders</span>{' '}
                    <span className="font-headline-silver">History ({orders.length})</span>
                  </h2>
                </div>
                {orders.length === 0 ? (
                  <EmptyState icon={Package} title="No orders placed yet" subtitle="Browse our certified catalog to find formulations for your next ritual." actionLabel="Browse Products" onAction={() => navigate('/shop')}/>
                ) : (
                  <div className="overflow-x-auto -mx-6 px-6">
                    <table className="w-full min-w-[700px] text-sm">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-wider text-[#cbd5e1] border-b border-[#d4af37]/20">
                          <th className="py-3.5 px-3 font-semibold">Order</th>
                          <th className="py-3.5 px-3 font-semibold">Date</th>
                          <th className="py-3.5 px-3 font-semibold">Items</th>
                          <th className="py-3.5 px-3 font-semibold">Total</th>
                          <th className="py-3.5 px-3 font-semibold">Status</th>
                          <th className="py-3.5 px-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#d4af37]/10">
                        {orders.map(o => {
                          const items = safeArr(o.items || o.order_items || o.Items);
                          const canCancel = canCancelOrder(o);
                          const refundSupport = needsRefundSupport(o);
                          const delivered = DELIVERED_STATUSES.includes((o.status||'').toLowerCase());
                          return (
                            <tr key={o.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-4 px-3 font-serif font-bold text-white">#{o.id}</td>
                              <td className="py-4 px-3 text-[#cbd5e1] whitespace-nowrap text-xs font-light">{o.created_at? new Date(o.created_at).toLocaleDateString():'—'}</td>
                              <td className="py-4 px-3 text-[#cbd5e1] text-xs font-light">{items.length || o.quantity || 1} items</td>
                              <td className="py-4 px-3 font-serif font-bold text-white tracking-tight">₹{Number(o.total_amount || o.total || 0).toFixed(2)}</td>
                              <td className="py-4 px-3"><StatusPill status={o.status}/></td>
                              <td className="py-4 px-3">
                                <div className="flex items-center justify-end gap-2 flex-wrap">
                                  <button onClick={() => setSelectedOrder(o)} className="btn-silver-luxury inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider">
                                    <Eye className="w-3.5 h-3.5"/> View
                                  </button>
                                  {canCancel && (
                                    <button onClick={() => handleCancelOrder(o.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                      <X className="w-3.5 h-3.5"/> Cancel
                                    </button>
                                  )}
                                  {refundSupport && (
                                    <button onClick={() => setActiveTab('support')} className="btn-silver-luxury inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider">
                                      Contact support
                                    </button>
                                  )}
                                  {delivered && (
                                    <Link to="/verify" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#fce096] border border-[#d4af37]/40 shadow-xs">
                                      <Award className="w-3.5 h-3.5 text-[#d4af37]"/> Assay QA
                                    </Link>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {/* ======== WISHLIST ======== */}
            {activeTab === 'wishlist' && (
              <section>
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#d4af37]/20">
                  <h2 className="text-xl font-serif font-bold text-white">
                    <span className="font-headline-gold">Saved</span>{' '}
                    <span className="font-headline-silver">Formulations ({wishlist.length})</span>
                  </h2>
                </div>
                {wishlistError ? (
                  <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">{wishlistError}</p>
                ) : wishlist.length === 0 ? (
                  <div className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-6 shadow-sm">
                    <EmptyState icon={Heart} title="Your wishlist is empty" subtitle="Save formulations you love for later. Tap the heart on any product to curate your apothecary here." actionLabel="Discover Products" onAction={() => navigate('/shop')}/>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {wishlist.map(w => {
                      const pid = w.product_id || w.id || w._id;
                      const p = w.product || w;
                      const name = p.name || p.title || p.product_name || 'Product';
                      const price = Number(p.price || p.sale_price || w.price || 0);
                      const firstImage = p.images?.[0];
                      const img = p.image_url || p.image || p.thumbnail || (typeof firstImage === 'object' ? firstImage.url || firstImage.file_path : firstImage);
                      return (
                        <div key={w.id || pid} className="two-tone-card group rounded-2xl border border-[#d4af37]/20 overflow-hidden shadow-sm hover:border-[#d4af37]/50 transition-all flex flex-col justify-between">
                          <div>
                            <div className="aspect-[4/3] bg-[#070a0e] relative overflow-hidden flex items-center justify-center">
                              {img ? (
                                <img src={getProfileImageUrl(img)} alt={name} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                              ) : (
                                <div className="text-5xl text-[#d4af37]/20"><Leaf/></div>
                              )}
                              <button onClick={() => handleRemoveWishlist(pid)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#070a0e]/80 backdrop-blur text-[#cbd5e1] hover:text-rose-400 flex items-center justify-center border border-[#d4af37]/25">
                                <Trash2 className="w-4 h-4"/>
                              </button>
                            </div>
                            <div className="p-5">
                              <h3 className="font-serif font-bold text-white text-base line-clamp-2 min-h-[2.5rem]">{name}</h3>
                              <div className="mt-2 text-xl font-serif font-bold text-[#d4af37]">₹{price.toFixed(2)}</div>
                            </div>
                          </div>
                          <div className="p-5 pt-0 flex gap-2">
                            <button onClick={() => navigate(`/product/${p.slug || pid}`)} className="btn-silver-luxury flex-1 py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-1">
                              View <ExternalLink className="w-3 h-3"/>
                            </button>
                            <button onClick={() => handleWishlistAddToCart(p)} className="btn-gold-luxury flex-1 py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-1">
                              <ShoppingCart className="w-3 h-3"/> + Bag
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* ======== WALLET ======== */}
            {activeTab === 'wallet' && (
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-3xl two-tone-panel-gold p-8 text-white border border-[#d4af37]/35 shadow-2xl">
                  <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-[#d4af37]/15 blur-3xl pointer-events-none"/>
                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-sub-gold text-[10px] uppercase tracking-[0.24em] font-semibold mb-2">Bhumivera Apothecary Vault</div>
                        <div className="text-xs text-[#cbd5e1] uppercase tracking-wider mb-1 font-light">Available Spendable Balance</div>
                        <div className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-white">
                          <span className="text-[#d4af37]">₹</span>{Number(wallet.balance||0).toFixed(2)}
                        </div>
                        <div className="mt-4 rounded-xl border border-[#d4af37]/30 bg-[#070a0e]/75 p-3.5 text-xs text-[#cbd5e1]">
                          Shopping &amp; referral rewards: <strong className="text-[#fce096]">{wallet.referralBalanceAvailable ? `₹${Number(wallet.referralBalance||0).toFixed(2)}` : 'Temporarily unavailable'}</strong>
                          <span className="mt-1 block text-[11px] text-[#94a3b8] font-light">Order-only balance applies automatically to eligible cart totals.</span>
                        </div>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                        <PiggyBank className="w-7 h-7"/>
                      </div>
                    </div>
                    <div className="mt-6 text-xs text-[#94a3b8] border-t border-[#d4af37]/20 pt-4 font-light">
                      Spendable store funds, loyalty points, and order-only referral credits are managed in separate ledger tracks.
                    </div>
                  </div>
                </div>

                <form onSubmit={purchaseWalletBalance} className="rounded-2xl two-tone-panel border border-[#d4af37]/25 p-6 shadow-sm">
                  <h3 className="font-serif font-bold text-base text-white">Add Spendable Vault Balance</h3>
                  <p className="mt-1 text-xs text-[#cbd5e1] font-light">Top up your encrypted wallet via secure Razorpay checkout.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[500, 1000, 2000].map(amount => (
                      <button key={amount} type="button" aria-pressed={Number(walletTopUpAmount) === amount} onClick={() => setWalletTopUpAmount(String(amount))}
                        className={`rounded-xl border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                          Number(walletTopUpAmount) === amount
                            ? 'border-[#d4af37] bg-gradient-to-r from-[#d4af37] to-[#b38728] text-[#070a0e] shadow-sm'
                            : 'border-[#d4af37]/25 bg-[#070a0e] text-[#cbd5e1] hover:border-[#d4af37]/60 hover:text-white'
                        }`}>
                        ₹{amount}
                      </button>
                    ))}
                  </div>
                  <label className="mt-4 block text-xs font-medium text-[#cbd5e1] uppercase tracking-wider">
                    Or custom amount (₹)
                    <input type="number" min="1" max="100000" step="1" required value={walletTopUpAmount} onChange={event => setWalletTopUpAmount(event.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#d4af37]/25 bg-[#070a0e] px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"/>
                  </label>
                  <button type="submit" disabled={walletTopUpBusy}
                    className="btn-gold-luxury mt-4 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl disabled:opacity-50">
                    {walletTopUpBusy ? 'Opening secure checkout…' : `Pay ₹${(Number(walletTopUpAmount) || 0).toFixed(2)} and Add to Vault`}
                  </button>
                </form>

                <section className="rounded-2xl two-tone-panel border border-[#d4af37]/25 p-6 shadow-sm">
                  <h3 className="font-serif font-bold text-white mb-5 text-lg pb-3 border-b border-[#d4af37]/20">
                    <span className="font-headline-gold">Transaction</span>{' '}
                    <span className="font-headline-silver">Ledger</span>
                  </h3>
                  {wallet.transactions.length === 0 ? (
                    <EmptyState icon={Clock} title="No transactions yet" subtitle="Vault activity will appear here when you top up or redeem store funds."/>
                  ) : (
                    <div className="overflow-x-auto -mx-6 px-6">
                      <table className="w-full min-w-[600px] text-sm">
                        <thead>
                          <tr className="text-left text-xs uppercase tracking-wider text-[#cbd5e1] border-b border-[#d4af37]/20">
                            <th className="py-3 px-3 font-semibold">Date</th>
                            <th className="py-3 px-3 font-semibold">Bucket</th>
                            <th className="py-3 px-3 font-semibold">Type</th>
                            <th className="py-3 px-3 font-semibold">Description</th>
                            <th className="py-3 px-3 font-semibold">Reference</th>
                            <th className="py-3 px-3 font-semibold text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#d4af37]/10">
                          {wallet.transactions.map(t => {
                            const type = (t.type||'').toLowerCase();
                            const isCredit = type === 'credit';
                            const isDebit = type === 'debit';
                            const amountColor = isCredit ? 'text-[#fce096]' : isDebit ? 'text-[#cbd5e1]' : 'text-[#94a3b8]';
                            return (
                              <tr key={`${t.wallet_bucket || 'cash'}-${t.id}`} className="hover:bg-white/5 transition-colors">
                                <td className="py-3.5 px-3 text-[#cbd5e1] whitespace-nowrap text-xs font-light">{t.created_at? new Date(t.created_at).toLocaleString():'—'}</td>
                                <td className="py-3.5 px-3">
                                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${t.wallet_bucket === 'cash' ? 'border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#fce096]' : 'border border-[#cbd5e1]/30 bg-[#cbd5e1]/10 text-[#cbd5e1]'}`}>
                                    {t.wallet_bucket === 'shopping' ? 'Shopping reward' : t.wallet_bucket === 'referral' ? 'Referral reward' : 'Spendable vault'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                    isCredit ? 'bg-[#d4af37]/15 text-[#fce096] border border-[#d4af37]/35' :
                                    isDebit ? 'bg-white/10 text-[#cbd5e1] border border-white/20' :
                                    'bg-[#070a0e] text-[#94a3b8] border border-[#94a3b8]/20'
                                  }`}>
                                    {isCredit ? <ArrowDownLeft className="w-3 h-3 text-[#d4af37]"/> : isDebit ? <ArrowUpRight className="w-3 h-3"/> : null}
                                    {type.replace(/_/g,' ') || 'txn'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3 text-[#cbd5e1] text-xs font-light">{t.description||'—'}</td>
                                <td className="py-3.5 px-3 font-mono text-xs text-[#94a3b8]">{t.reference_id || t.order_id || '—'}</td>
                                <td className={`py-3.5 px-3 text-right font-serif font-bold ${amountColor}`}>
                                  {isCredit ? '+' : isDebit ? '−' : ''}₹{Math.abs(Number(t.amount||0)).toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* ======== ADDRESSES ======== */}
            {activeTab === 'addresses' && (
              <section className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#d4af37]/20">
                  <h2 className="text-xl font-serif font-bold text-white">
                    <span className="font-headline-gold">Saved</span>{' '}
                    <span className="font-headline-silver">Addresses ({addresses.length})</span>
                  </h2>
                  <button onClick={() => setAddressModal({ open:true, editId:null, form:{ label:'Home', full_name: displayName, phone: profileData.phone||'', line1:'', line2:'', city:'', state:'', postal_code:'', country:'India', is_default: addresses.length===0, latitude:null, longitude:null, google_maps_url:'' }})}
                    className="btn-gold-luxury inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider">
                  <Plus className="w-4 h-4"/> Add Address
                  </button>
                </div>
                {addresses.length === 0 ? (
                  <EmptyState icon={MapPin} title="No saved addresses" subtitle="Save a verified delivery address for seamless 1-click checkout." actionLabel="Add First Address" onAction={() => setAddressModal({ open:true, editId:null, form:{ label:'Home', full_name: displayName, phone: profileData.phone||'', line1:'', line2:'', city:'', state:'', postal_code:'', country:'India', is_default:true, latitude:null, longitude:null, google_maps_url:'' }})}/>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(a => {
                      const addrId = a.id || a._id;
                      const addrLine1 = a.line1 || a.street_address || a.address_line1 || a.address || '';
                      const addrLine2 = a.line2 || a.address_line2 || '';
                      const hasExactGps = hasCoordinates(a.latitude, a.longitude);
                      const mapsUrl = a.google_maps_url || (hasExactGps ? `https://www.google.com/maps?q=${a.latitude},${a.longitude}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([addrLine1, addrLine2, a.city, a.state, a.postal_code || a.zip, a.country || 'India'].filter(Boolean).join(', '))}`);

                      return (
                        <div key={addrId} className={`rounded-2xl two-tone-card border p-5 transition-all relative ${a.is_default || a.default ? 'border-[#d4af37]' : 'border-[#d4af37]/20 hover:border-[#d4af37]/40'}`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-9 h-9 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/25 flex items-center justify-center text-[#fce096]">
                                <LabelIcon label={a.label}/>
                              </div>
                              <div>
                                <div className="font-serif font-bold text-sm text-white">{a.label || 'Home'}</div>
                                <div className="text-xs text-[#94a3b8] font-light">{a.full_name || a.name || displayName}</div>
                              </div>
                            </div>
                            {(a.is_default || a.default) && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b38728] text-[#070a0e] text-[10px] font-bold uppercase tracking-wider shadow-sm">Default</span>
                            )}
                          </div>
                          <div className="text-xs text-[#cbd5e1] leading-relaxed space-y-0.5 font-light">
                            <div>{addrLine1}</div>
                            {addrLine2 && <div className="text-[#94a3b8]">{addrLine2}</div>}
                            <div>{a.city}, {a.state} <span className="font-mono text-[#fce096]">{a.postal_code || a.zip}</span></div>
                            <div className="text-[#94a3b8]">{a.country || 'India'}</div>
                            <div className="pt-2 flex items-center gap-1.5 text-[#cbd5e1] font-mono"><Phone className="w-3.5 h-3.5 text-[#d4af37]"/> {a.phone || a.phone_number}</div>
                          </div>

                          {/* Google Maps Pin & Courier Share */}
                          <div className="mt-3.5 pt-3 border-t border-[#d4af37]/15 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-1.5">
                              <MapPin className={`w-3.5 h-3.5 ${hasExactGps ? 'text-[#d4af37]' : 'text-[#94a3b8]'}`} />
                              <span className={hasExactGps ? 'font-semibold text-[#fce096]' : 'text-[#94a3b8]'}>
                                {hasExactGps ? 'Exact GPS Pinned' : 'Maps Link Ready'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[#cbd5e1] hover:text-[#fce096] font-medium transition-colors"
                              >
                                View Map <ExternalLink className="w-3 h-3" />
                              </a>
                              <span className="text-[#94a3b8]/40">|</span>
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(mapsUrl);
                                    setCopiedAddressId(addrId);
                                    toast.success('Google Maps delivery link copied!');
                                    setTimeout(() => setCopiedAddressId(null), 2000);
                                  } catch (error) {
                                    console.error('[PROFILE_ADDRESS_MAP_COPY_ERROR]', error);
                                    toast.error('Unable to copy the map link. Open the map and copy its URL instead.');
                                  }
                                }}
                                className="inline-flex items-center gap-1 text-[#cbd5e1] hover:text-[#fce096] font-medium transition-colors"
                              >
                                {copiedAddressId === addrId ? (
                                  <>
                                    <Check className="w-3 h-3 text-[#d4af37]" /> Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" /> Copy Link
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-[#d4af37]/15 flex items-center gap-2 flex-wrap">
                            {!(a.is_default || a.default) && (
                              <button onClick={() => handleSetDefaultAddr(addrId)} className="text-xs px-3 py-1.5 rounded-lg border border-[#d4af37]/30 text-[#fce096] hover:bg-[#d4af37]/10 font-semibold uppercase tracking-wider">Set Default</button>
                            )}
                            <button type="button" onClick={() => setAddressModal({ open:true, editId:addrId, form:{ label:a.label||'Home', full_name:a.full_name||a.name||'', phone:a.phone||a.phone_number||'', line1:addrLine1, line2:addrLine2, city:a.city||'', state:a.state||'', postal_code:a.postal_code||a.zip||'', country:a.country||'India', is_default: !!(a.is_default||a.default), latitude: a.latitude ?? null, longitude: a.longitude ?? null, google_maps_url: a.google_maps_url || (hasCoordinates(a.latitude, a.longitude) ? `https://www.google.com/maps?q=${a.latitude},${a.longitude}` : '') }})} className="btn-silver-luxury min-h-11 text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1 font-semibold uppercase tracking-wider">
                              <Edit2 className="w-3 h-3"/> Edit
                            </button>
                            <button onClick={() => handleAddressDelete(addrId)} className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 inline-flex items-center gap-1 font-semibold uppercase tracking-wider">
                              <Trash2 className="w-3 h-3"/> Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* ======== ARTISANAL SERIAL & GENUINITY VERIFICATION ======== */}
            {activeTab === 'verify' && (
              <div className="space-y-6">
                <section className="two-tone-panel-gold rounded-3xl p-6 sm:p-9 border border-[#d4af37]/40 shadow-2xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4af37]/25 pb-6">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/15 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#fce096]">
                        <CheckCircle2 size={13} className="text-[#d4af37]" />
                        100% Genuine Artisanal Small-Batch Formulation
                      </div>
                      <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        <span className="font-headline-gold">Artisanal Serial</span>{' '}
                        <span className="font-headline-silver">&amp; Purity Assay Verification</span>
                      </h2>
                      <div className="gold-hairline w-24 my-3" />
                      <p className="text-xs text-[#cbd5e1] mt-1 max-w-xl leading-relaxed font-light">
                        Every bottle is compounded in micro-batches of 250 units, hand-inspected, and sealed with tamper-evident virgin security. Verify your bottle's lab analysis, pH calibration, and harvest origin.
                      </p>
                    </div>
                    <div className="two-tone-card rounded-2xl p-4 border border-[#d4af37]/35 text-center shrink-0">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-[#fce096]">Cleanroom Standard</p>
                      <p className="font-serif text-lg font-bold text-white">Run of 250 Units</p>
                      <p className="text-[10px] text-[#cbd5e1] font-medium mt-0.5">Spectro Purity 99.8%</p>
                    </div>
                  </div>

                  {/* Serial Lookup Box */}
                  <div className="mt-6">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#fce096] block mb-2 font-mono">
                      Enter Bottle Serial Number (from back label / box QR)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="e.g. BV-CH26-8841, BV-SH26-4409"
                        value={warrantyInput.serial}
                        onChange={(e) => setWarrantyInput({ serial: e.target.value.toUpperCase() })}
                        className="flex-1 rounded-xl border border-[#d4af37]/30 bg-[#070a0e] px-4 py-3 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-[#d4af37] font-mono tracking-wider"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const s = warrantyInput.serial.trim() || 'BV-CH26-8841';
                          navigate(`/verify?serial=${encodeURIComponent(s)}`);
                        }}
                        className="btn-gold-luxury inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-semibold uppercase tracking-wider shadow-md"
                      >
                        <QrCode size={16} /> Open Full Genuinity Assay
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#94a3b8]">
                      <span className="text-[10px] uppercase tracking-wider text-[#fce096]">Sample Artisanal Serials:</span>
                      {['BV-CH26-8841 (Charcoal 3%)', 'BV-SH26-4409 (Botanical Shampoo)', 'BV-SB26-1042 (Sea Buckthorn)'].map((sample) => {
                        const code = sample.split(' ')[0];
                        return (
                          <button
                            key={code}
                            type="button"
                            onClick={() => {
                              setWarrantyInput({ serial: code });
                              navigate(`/verify?serial=${encodeURIComponent(code)}`);
                            }}
                            className="rounded-lg border border-[#d4af37]/20 bg-[#070a0e] px-2.5 py-1 text-[11px] font-mono text-[#cbd5e1] hover:text-[#fce096] hover:border-[#d4af37]/50 transition"
                          >
                            {sample}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4 Core Artisanal Metrics */}
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[#d4af37]/20">
                    <div className="rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/70 p-3.5">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-[#fce096]">Calibrated pH</p>
                      <p className="font-serif text-base font-bold text-white mt-0.5">5.51 pH</p>
                      <p className="text-[10px] text-[#cbd5e1] font-light">Skin-Identical Mantle</p>
                    </div>
                    <div className="rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/70 p-3.5">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-[#fce096]">Bioactive Assay</p>
                      <p className="font-serif text-base font-bold text-white mt-0.5">99.8% Retention</p>
                      <p className="text-[10px] text-[#cbd5e1] font-light">Spectrophotometric QA</p>
                    </div>
                    <div className="rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/70 p-3.5">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-[#fce096]">Heavy Metals</p>
                      <p className="font-serif text-base font-bold text-white mt-0.5">Not Detected</p>
                      <p className="text-[10px] text-[#cbd5e1] font-light">0.0 ppm Cleanroom</p>
                    </div>
                    <div className="rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/70 p-3.5">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-[#fce096]">Sanitary Custody</p>
                      <p className="font-serif text-base font-bold text-white mt-0.5">100% Virgin Seal</p>
                      <p className="text-[10px] text-[#cbd5e1] font-light">Zero Re-Entry Standard</p>
                    </div>
                  </div>
                </section>

                {/* Direct Concierge Link */}
                <div className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif font-bold text-white text-base">Concierge Assistance for Orders &amp; Formulations</h3>
                    <p className="text-xs text-[#cbd5e1] mt-1 max-w-xl font-light">
                      Have questions regarding bottle application ritual, storage, or unboxing verification? Our executive concierge team is available for verified patrons.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('support')}
                    className="btn-gold-luxury inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider shrink-0"
                  >
                    <LifeBuoy size={14} /> Open Concierge Ticket
                  </button>
                </div>
              </div>
            )}

            {/* ======== NOTIFICATIONS ======== */}
            {activeTab === 'notifications' && (
              <section className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-6 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#d4af37]/20">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-white">
                      <span className="font-headline-gold">Notifications</span>{' '}
                      <span className="font-headline-silver">Inbox</span>
                    </h2>
                    <p className="text-xs text-[#94a3b8] mt-1 font-light">{unreadCount} unread of {notifications.length} total</p>
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllNotifRead} className="btn-silver-luxury inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-[#d4af37]"/> Mark all as read
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <EmptyState icon={Bell} title="No notifications yet" subtitle="You will receive alerts about order dispatches, concierge responses, and seasonal privileges here."/>
                ) : (
                  <div className="space-y-3">
                    {notifications.map(n => {
                      const unread = !(n.is_read || n.read_at || n.status === 'read');
                      return (
                        <div key={n.id} onClick={() => handleMarkNotifRead(n.id)}
                          className={`group cursor-pointer rounded-2xl border p-4.5 transition-all ${unread ? 'bg-[#0d1520] border-[#d4af37]/45 shadow-md' : 'bg-[#070a0e]/50 border-[#d4af37]/15 hover:border-[#d4af37]/35'}`}>
                          <div className="flex items-start gap-3.5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${unread ? 'bg-[#d4af37]/15 border-[#d4af37]/35 text-[#fce096]' : 'bg-[#070a0e] border-[#94a3b8]/20 text-[#94a3b8]'}`}>
                              <Bell className="w-5 h-5"/>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <div className="font-serif font-bold text-sm text-white leading-snug">{n.title || n.subject || 'Notification'}</div>
                                {unread && <span className="w-2 h-2 rounded-full bg-[#d4af37] shrink-0 mt-1.5"/>}
                              </div>
                              <div className="mt-1 text-xs sm:text-sm text-[#cbd5e1] leading-relaxed font-light">{n.message || n.body || n.content}</div>
                              <div className="mt-2 text-xs text-[#94a3b8] inline-flex items-center gap-1.5 font-light">
                                <Clock className="w-3 h-3 text-[#d4af37]"/>
                                {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* ======== COUPONS ======== */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <section className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <div className="flex-1 flex items-center rounded-xl border border-[#d4af37]/25 bg-[#070a0e] px-4 focus-within:border-[#d4af37] transition-colors">
                      <Ticket className="w-4 h-4 text-[#d4af37] mr-2.5"/>
                      <input value={couponValidate.code} onChange={e => setCouponValidate(c => ({ ...c, code: e.target.value, result: null }))}
                        onKeyDown={e => e.key === 'Enter' && handleCouponValidate()}
                        placeholder="Enter coupon code to validate"
                        className="flex-1 bg-transparent py-3 text-sm text-white focus:outline-none uppercase placeholder:normal-case placeholder-[#94a3b8] font-mono tracking-wider"/>
                    </div>
                    <button onClick={handleCouponValidate} className="btn-gold-luxury px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider">
                      Validate Code
                    </button>
                  </div>
                  {couponValidate.result && (
                    <div className={`mt-4 p-4 rounded-xl border text-xs sm:text-sm ${couponValidate.result.ok ? 'bg-[#d4af37]/10 border-[#d4af37]/40 text-[#fce096]' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
                      {couponValidate.result.ok ? (
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#d4af37]"/>
                          <div>
                            <div className="font-serif font-bold text-white">Coupon Verified!</div>
                            <div className="mt-1 text-[#cbd5e1]">
                              {couponValidate.result.data?.discount_type === 'percent' || couponValidate.result.data?.type === 'percent'
                                ? `${couponValidate.result.data?.discount_value || couponValidate.result.data?.value}% off`
                                : `₹${couponValidate.result.data?.discount_value || couponValidate.result.data?.value || 0} off`}
                              {couponValidate.result.data?.min_order_amount && <span> &bull; Min order ₹{couponValidate.result.data.min_order_amount}</span>}
                              {couponValidate.result.data?.description && <div className="mt-1 text-xs text-[#94a3b8]">{couponValidate.result.data.description}</div>}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2.5">
                          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400"/>
                          <div>{couponValidate.result.msg}</div>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                <section className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#d4af37]/20">
                    <h2 className="text-xl font-serif font-bold text-white">
                      <span className="font-headline-gold">Active</span>{' '}
                      <span className="font-headline-silver">Coupons ({coupons.length})</span>
                    </h2>
                  </div>
                  {coupons.length === 0 ? (
                    <EmptyState icon={Gift} title="No active coupons right now" subtitle="Check back soon for exclusive member privileges and seasonal promotions."/>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {coupons.map(c => {
                        const valid = c.expires_at ? new Date(c.expires_at) > new Date() : true;
                        return (
                          <div key={c.id} className="relative rounded-2xl border-2 border-dashed border-[#d4af37]/35 hover:border-[#d4af37] two-tone-card overflow-hidden p-5 transition-all group">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 text-[#fce096] border border-[#d4af37]/35 text-[10px] font-bold uppercase tracking-wider mb-2">
                                  <Ticket className="w-3 h-3 text-[#d4af37]"/> {c.is_personal ? 'Your reward' : valid ? 'Live' : 'Expired'}
                                </div>
                                <div className="font-mono text-2xl font-bold tracking-tight text-white mb-1.5">{c.code}</div>
                                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#d4af37] mb-1 leading-none">
                                  {c.discount_type === 'percent' ? `${c.discount_value}%` : `₹${c.discount_value}`}
                                  <span className="text-xs uppercase tracking-wider font-semibold text-[#cbd5e1] ml-1.5">OFF</span>
                                </div>
                                <div className="text-xs text-[#cbd5e1] mt-2 font-light">
                                  {c.description || 'No minimum spend required'}
                                  {c.expires_at && <div className="mt-1 inline-flex items-center gap-1 text-[#94a3b8]"><Clock className="w-3 h-3 text-[#d4af37]"/> Expires {new Date(c.expires_at).toLocaleDateString()}</div>}
                                </div>
                              </div>
                              <button onClick={() => handleCouponCopy(c.code)} className="shrink-0 w-11 h-11 rounded-xl bg-[#070a0e] border border-[#d4af37]/30 hover:border-[#d4af37] text-[#cbd5e1] hover:text-[#fce096] transition-colors flex items-center justify-center">
                                <Copy className="w-4 h-4"/>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* ======== SECURITY ======== */}
            {activeTab === 'security' && (
              <div className="space-y-5">
                <section className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#d4af37]/20">
                    <div className="w-11 h-11 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/35 text-[#fce096] flex items-center justify-center shrink-0">
                      <User className="w-5 h-5"/>
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-white text-lg">
                        <span className="font-headline-gold">Profile</span>{' '}
                        <span className="font-headline-silver">Information</span>
                      </h3>
                      <p className="text-xs text-[#94a3b8] font-light">Manage how your name appears on verified orders &amp; communications</p>
                    </div>
                  </div>
                  <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#fce096] uppercase tracking-wider mb-1.5 block">Full Name</label>
                      <input value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 transition-all text-sm"/>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#fce096] uppercase tracking-wider mb-1.5 block">Phone Number</label>
                      <input value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 transition-all text-sm"/>
                    </div>
                    <label className="sm:col-span-2 flex items-start gap-3 rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/60 p-4 text-sm text-[#cbd5e1]">
                      <input
                        type="checkbox"
                        checked={profileData.marketing_email_opt_in}
                        onChange={e => setProfileData({ ...profileData, marketing_email_opt_in: e.target.checked })}
                        className="mt-0.5 accent-[#d4af37]"
                      />
                      <span>
                        <strong className="text-white">Email me promotional offers and formulation releases.</strong>
                        <span className="block mt-1 text-xs text-[#94a3b8] font-light">Optional. You can change this preference any time. Order and account emails are not affected.</span>
                      </span>
                    </label>
                    <label className="sm:col-span-2 flex items-start gap-3 rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/60 p-4 text-sm text-[#cbd5e1]">
                      <input
                        type="checkbox"
                        checked={adPersonalizationOptIn}
                        disabled={adPreferenceSaving}
                        onChange={e => handleAdPersonalizationChange(e.target.checked)}
                        className="mt-0.5 accent-[#d4af37]"
                      />
                      <span>
                        <strong className="text-white">Allow first-party formulation recommendations based on my purchase ritual and saved items.</strong>
                        <span className="mt-1 block text-xs text-[#94a3b8] font-light">Optional and separate from promotional email. Withdraw at any time by unchecking; stored signals are deleted on withdrawal. We do not share data with third-party networks.</span>
                      </span>
                    </label>
                    <div className="sm:col-span-2">
                      <button type="submit" className="btn-gold-luxury inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4"/> Save Profile Changes
                      </button>
                    </div>
                  </form>
                </section>

                <section className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#d4af37]/20">
                    <div className="w-11 h-11 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/35 text-[#fce096] flex items-center justify-center shrink-0">
                      <Key className="w-5 h-5"/>
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-white text-lg">
                        <span className="font-headline-gold">Change</span>{' '}
                        <span className="font-headline-silver">Password</span>
                      </h3>
                      <p className="text-xs text-[#94a3b8] font-light">Ensure your credentials use a minimum of 6 characters</p>
                    </div>
                  </div>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    {[
                      { k:'current', label:'Current Password' },
                      { k:'new',     label:'New Password' },
                      { k:'confirm', label:'Confirm New Password' },
                    ].map(f => (
                      <PwField key={f.k} k={f.k} label={f.label} passwords={passwords} setPasswords={setPasswords}/>
                    ))}
                    <button type="submit" className="btn-gold-luxury inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider">
                      Update Password
                    </button>
                  </form>
                </section>

                <section className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#d4af37]/20">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${twoFactor.isEnabled ? 'bg-[#d4af37]/15 border-[#d4af37]/40 text-[#fce096]' : 'bg-[#070a0e] border-[#94a3b8]/20 text-[#cbd5e1]'}`}>
                      <Smartphone className="w-5 h-5"/>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-white text-lg">
                          <span className="font-headline-gold">Two-Factor</span>{' '}
                          <span className="font-headline-silver">Authentication (2FA)</span>
                        </h3>
                        <StatusPill status={twoFactor.isEnabled?'active':'pending'}/>
                      </div>
                      <p className="text-xs text-[#94a3b8] font-light mt-1">Add an extra layer of security with Google Authenticator / Authy / 1Password.</p>
                    </div>
                  </div>
                  {twoFactor.isEnabled ? (
                    <div className="p-4 rounded-xl bg-[#070a0e]/70 border border-[#d4af37]/35">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5"/>
                        <div className="text-sm text-[#cbd5e1]">
                          <div className="font-semibold text-white">2FA is currently active &amp; verified</div>
                          <div className="text-xs text-[#94a3b8] mt-0.5 font-light">Every sign-in requires an ephemeral 6-digit cryptographic code from your authenticator app.</div>
                        </div>
                      </div>
                      <button onClick={handleDisable2FA} className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#070a0e] text-[#fce096] border border-[#d4af37]/30 hover:border-[#d4af37] text-xs font-semibold uppercase tracking-wider">
                        <X className="w-4 h-4"/> Disable 2FA
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {!twoFactor.qrCode ? (
                        <button onClick={handleGenerate2FA} className="btn-gold-luxury inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider">
                          <QrCode className="w-4 h-4"/> Generate 2FA Setup QR
                        </button>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                          <div className="md:col-span-2 rounded-2xl bg-[#070a0e] border border-[#d4af37]/30 p-5 flex items-center justify-center">
                            {twoFactor.qrCode ? (
                              <img src={twoFactor.qrCode} alt="2FA QR" className="w-full max-w-[220px] aspect-square rounded-xl bg-white p-2 shadow-md"/>
                            ) : <QrCode className="w-24 h-24 text-[#94a3b8]"/>}
                          </div>
                          <div className="md:col-span-3 space-y-4">
                            <div>
                              <div className="text-xs font-semibold text-[#fce096] mb-1.5 uppercase tracking-wider">Secret Key</div>
                              <div className="flex items-center rounded-xl bg-[#070a0e] border border-[#d4af37]/25 px-4 py-3">
                                <code className="flex-1 text-sm font-mono text-[#fce096] break-all">{twoFactor.secret}</code>
                                <button onClick={() => { navigator.clipboard.writeText(twoFactor.secret); toast.success('Secret copied'); }} className="p-2 rounded-lg hover:bg-[#d4af37]/15 text-[#cbd5e1] hover:text-[#fce096]">
                                  <Copy className="w-4 h-4"/>
                                </button>
                              </div>
                              <div className="mt-2 text-xs text-[#94a3b8] font-light leading-relaxed">Scan the QR code with your authenticator app, or paste the secret manually. Then enter the 6-digit confirmation code below.</div>
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-[#fce096] mb-1.5 block uppercase tracking-wider">6-digit Authenticator Code</label>
                              <input inputMode="numeric" value={twoFactor.otp} onChange={e => setTwoFactor(p => ({ ...p, otp: e.target.value.replace(/\D/g,'').slice(0,6) }))}
                                placeholder="000000"
                                className="w-full md:w-56 px-4 py-2.5 rounded-xl border border-[#d4af37]/30 bg-[#070a0e] text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 text-2xl font-mono tracking-[0.3em] text-center"/>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                              <button onClick={handleEnable2FA} className="btn-gold-luxury inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider">
                                <CheckCircle2 className="w-4 h-4"/> Verify &amp; Enable 2FA
                              </button>
                              <button onClick={() => setTwoFactor(p => ({ ...p, qrCode:'', secret:'', otp:'' }))} className="btn-silver-luxury inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider">
                                Cancel Setup
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                {/* Passkeys & Biometrics Section */}
                <section className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-6 shadow-xl mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-[#d4af37]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/35 text-[#fce096] flex items-center justify-center shrink-0">
                        <Fingerprint className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-white text-lg">
                          <span className="font-headline-gold">Passkeys &amp;</span>{' '}
                          <span className="font-headline-silver">Biometric Sign-In</span>
                        </h3>
                        <p className="text-xs text-[#94a3b8] font-light">
                          {passkeySupported
                            ? 'Authenticate seamlessly using Touch ID, Face ID, or Windows Hello hardware passkeys.'
                            : 'Passkeys are not available in the installed app. Use a supported browser to manage passkeys.'}
                        </p>
                      </div>
                    </div>
                    {passkeySupported && <button
                      type="button"
                      onClick={handleRegisterPasskey}
                      disabled={loadingPasskey}
                      className="btn-gold-luxury inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      {loadingPasskey ? 'Registering…' : 'Add Passkey'}
                    </button>}
                  </div>

                  {passkeySupported && <div className="space-y-3">
                    {passkeys.length > 0 ? (
                      passkeys.map(pk => (
                        <div key={pk.id} className="flex items-center justify-between p-3.5 rounded-xl bg-[#070a0e]/60 border border-[#d4af37]/25">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#070a0e] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                              <Key className="w-4 h-4 text-[#d4af37]" />
                            </div>
                            <div>
                              <div className="font-serif font-bold text-xs text-white">{pk.device_name || 'Passkey Device'}</div>
                              <div className="text-[11px] text-[#94a3b8] font-light">Added on {new Date(pk.created_at).toLocaleDateString()} {pk.last_used_at ? "· Used " + new Date(pk.last_used_at).toLocaleDateString() : ""}</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeletePasskey(pk.id)}
                            className="p-2 text-[#94a3b8] hover:text-[#fce096] transition-colors rounded-lg hover:bg-[#d4af37]/15"
                            title="Remove Passkey"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 border border-dashed border-[#d4af37]/25 rounded-xl bg-[#070a0e]/40">
                        <Fingerprint className="w-8 h-8 text-[#94a3b8] mx-auto mb-2" />
                        <p className="text-xs text-[#cbd5e1] font-medium">No hardware passkeys registered on this account yet.</p>
                        <p className="text-[11px] text-[#94a3b8] mt-0.5 font-light">Add your trusted device for cryptographic, passwordless access.</p>
                      </div>
                    )}
                  </div>}
                </section>

                <section className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#d4af37]/20">
                    <div className="w-11 h-11 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/35 text-[#fce096] flex items-center justify-center shrink-0">
                      <HelpCircle className="w-5 h-5"/>
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-white text-lg">
                        <span className="font-headline-gold">Security</span>{' '}
                        <span className="font-headline-silver">Recovery Question</span>
                      </h3>
                      <p className="text-xs text-[#94a3b8] font-light">Used to securely verify your identity if you ever lose authentication access</p>
                    </div>
                  </div>
                  <form onSubmit={handleUpdateSecurityQuestion} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-[#fce096] uppercase tracking-wider mb-1.5 block">Choose a question</label>
                      <select value={secQuestion.question} onChange={e => setSecQuestion(s => ({ ...s, question: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 text-sm">
                        {SECURITY_QUESTIONS.map(q => <option key={q} value={q} className="bg-[#070a0e] text-white">{q}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#fce096] uppercase tracking-wider mb-1.5 block">Your answer</label>
                      <input value={secQuestion.answer} onChange={e => setSecQuestion(s => ({ ...s, answer: e.target.value }))}
                        placeholder="Type an answer you'll remember exactly"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 text-sm"/>
                    </div>
                    <button type="submit" className="btn-gold-luxury inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider">
                      Save Security Question
                    </button>
                  </form>
                </section>
              </div>
            )}

            {/* ======== REVIEWS ======== */}
            {activeTab === 'reviews' && (
              <section className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#d4af37]/20">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-white">
                      <span className="font-headline-gold">My</span>{' '}
                      <span className="font-headline-silver">Reviews</span>
                    </h2>
                    <p className="text-xs text-[#94a3b8] mt-1 font-light">{myReviews.length} reviews published across orders</p>
                  </div>
                </div>
                {myReviews.length === 0 ? (
                  <EmptyState icon={Star} title="You haven't reviewed any products yet" subtitle="You can review products after an order is delivered. Open a delivered order to rate its products." actionLabel="Review a Delivered Purchase" onAction={() => setActiveTab('orders')}/>
                ) : (
                  <div className="space-y-4">
                    {myReviews.map(r => {
                      const editing = reviewEditing === r.id;
                      const draft = r._draft || { rating: r.rating||5, title: r.title||'', comment: r.comment||r.review||'' };
                      return (
                        <div key={r.id} className="two-tone-card rounded-2xl border border-[#d4af37]/25 p-5 transition-all">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="min-w-0">
                              <div className="font-serif font-bold text-white text-sm">{r.product_name || `Product #${r.product_id}`}</div>
                              <div className="text-xs text-[#94a3b8] mt-0.5 flex items-center gap-2 font-light">
                                <Calendar className="w-3 h-3 text-[#d4af37]"/> {r.created_at? new Date(r.created_at).toLocaleDateString():'—'}
                                {r.approved || r.status==='approved' ? <><span className="text-[#d4af37]/40">•</span><span className="text-[#fce096] inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[#d4af37]"/> Verified &amp; Approved</span></> : null}
                              </div>
                            </div>
                            {!editing && (
                              <div className="flex items-center gap-1 shrink-0">
                                <button onClick={() => { setMyReviews(rs => rs.map(x => x.id===r.id ? { ...x, _draft:{rating:x.rating||5, title:x.title||'', comment:x.comment||x.review||''}} : x)); setReviewEditing(r.id); }} className="p-2 rounded-lg hover:bg-[#d4af37]/15 text-[#cbd5e1] hover:text-[#fce096] transition-colors"><Edit2 className="w-4 h-4"/></button>
                                <button onClick={() => handleReviewDelete(r.id)} className="p-2 rounded-lg hover:bg-[#d4af37]/15 text-[#cbd5e1] hover:text-[#fce096] transition-colors"><Trash2 className="w-4 h-4"/></button>
                              </div>
                            )}
                          </div>
                          {editing ? (
                            <div className="space-y-3 pt-3 border-t border-[#d4af37]/20">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-[#fce096] uppercase tracking-wider">Rating</span>
                                <StarsInput value={draft.rating} onChange={v => setMyReviews(rs => rs.map(x => x.id===r.id ? { ...x, _draft:{ ...x._draft, rating:v }} : x))}/>
                              </div>
                              <input placeholder="Title (e.g. Absolutely loved it!)" value={draft.title}
                                onChange={e => setMyReviews(rs => rs.map(x => x.id===r.id ? { ...x, _draft:{ ...x._draft, title: e.target.value }} : x))}
                                className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 text-sm"/>
                              <textarea rows={3} placeholder="Share details about texture, botanical aroma, finish and your skincare ritual" value={draft.comment}
                                onChange={e => setMyReviews(rs => rs.map(x => x.id===r.id ? { ...x, _draft:{ ...x._draft, comment: e.target.value }} : x))}
                                className="w-full px-4 py-3 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 text-sm resize-none"/>
                              <div className="flex gap-2">
                                <button onClick={() => handleReviewSave(r.id, { rating: draft.rating, title: draft.title, comment: draft.comment })} className="btn-gold-luxury inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider">
                                  <CheckCircle2 className="w-4 h-4"/> Save Changes
                                </button>
                                <button onClick={() => setReviewEditing(null)} className="btn-silver-luxury px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="mb-2"><StarsInput value={r.rating||5} readonly size="sm"/></div>
                              {r.title && <div className="font-serif font-bold text-white mb-1 text-sm">{r.title}</div>}
                              <div className="text-sm text-[#cbd5e1] leading-relaxed whitespace-pre-wrap font-light">{r.comment || r.review || '—'}</div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* ======== WARRANTY ======== */}
            {activeTab === 'warranty' && (
              <div className="space-y-5">
                <section className="relative overflow-hidden rounded-3xl two-tone-panel-gold border border-[#d4af37]/40 p-7 text-white shadow-xl">
                  <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-[#d4af37]/20 blur-3xl pointer-events-none"/>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center shrink-0">
                        <Award className="w-6 h-6 text-[#fce096]"/>
                      </div>
                      <div>
                        <div className="font-sub-gold uppercase tracking-[0.2em] font-bold text-xs">Bhumivera Artisanal Promise</div>
                        <h3 className="text-2xl font-serif font-bold text-white mt-0.5">Artisanal Purity &amp; Custody Certification</h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                      {[
                        { i: Shield,      t:'Authenticity Verified', s:'Every serial is checked against compounding batch records.' },
                        { i: Award,       t:'Artisanal Custody',    s:'Compounded in micro-batches with 100% sealed virgin custody.' },
                        { i: PackageCheck,t:'Purity Guaranteed',     s:'Spectro assay tested with calibrated skin-identical pH.' },
                      ].map(b => {
                        const I = b.i;
                        return (
                          <div key={b.t} className="rounded-2xl bg-[#070a0e]/70 border border-[#d4af37]/25 backdrop-blur p-4 hover:border-[#d4af37]/40 transition-colors">
                            <I className="w-5 h-5 text-[#d4af37] mb-2"/>
                            <div className="font-serif font-bold text-sm text-white mb-1">{b.t}</div>
                            <div className="text-xs text-[#cbd5e1] leading-relaxed font-light">{b.s}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>

                <section className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#d4af37]/20">
                    <div className="w-11 h-11 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/35 text-[#fce096] flex items-center justify-center shrink-0">
                      <QrCode className="w-5 h-5"/>
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-white text-lg">
                        <span className="font-headline-gold">Validate &amp; Register</span>{' '}
                        <span className="font-headline-silver">Warranty</span>
                      </h3>
                      <p className="text-xs text-[#94a3b8] font-light">Enter the 16-digit serial from your product package or certificate of authenticity.</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 flex items-center rounded-xl border border-[#d4af37]/25 bg-[#070a0e] px-4 focus-within:border-[#d4af37] transition-colors">
                      <Hash className="w-4 h-4 text-[#d4af37] mr-2.5"/>
                      <input value={warrantyInput.serial} onChange={e => setWarrantyInput({ serial: e.target.value.toUpperCase() })}
                        placeholder="BHVM-XXXX-XXXX-XXXX"
                        className="flex-1 bg-transparent py-3 text-sm font-mono text-white focus:outline-none uppercase placeholder:normal-case placeholder-[#94a3b8]"/>
                    </div>
                    <button onClick={handleWarrantyValidate} className="btn-gold-luxury px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4"/> Validate
                    </button>
                  </div>
                  {warrantyCheck && (
                    <div className={`mt-5 p-5 rounded-2xl border ${warrantyCheck.ok ? 'bg-[#070a0e]/80 border-[#d4af37]/45 text-[#cbd5e1]' : 'bg-[#070a0e]/80 border-rose-500/35 text-rose-300'}`}>
                      {warrantyCheck.ok ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-[#070a0e] border border-[#d4af37]/35 flex items-center justify-center shrink-0 shadow-sm">
                            <PackageCheck className="w-7 h-7 text-[#d4af37]"/>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-serif font-bold text-lg text-white inline-flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-[#d4af37]"/> Serial valid &amp; authentic
                            </div>
                            <div className="mt-1 text-sm text-[#cbd5e1] leading-relaxed font-light">
                              Product: <span className="font-semibold text-white">{warrantyCheck.data?.product_name || warrantyCheck.data?.product?.name || `Product #${warrantyCheck.data?.productId || warrantyCheck.data?.product_id || '—'}`}</span>
                              {warrantyCheck.data?.is_registered || warrantyCheck.data?.registered ? ' (already registered)' : ' (eligible for warranty registration)'}
                            </div>
                          </div>
                          {!(warrantyCheck.data?.is_registered || warrantyCheck.data?.registered) && (
                            <button onClick={handleWarrantyRegister} className="btn-gold-luxury px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 shrink-0">
                              <Award className="w-4 h-4"/> Register to My Account
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5"/>
                          <div className="text-sm text-rose-300 font-light">{warrantyCheck.msg}</div>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                <section className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#d4af37]/20">
                    <h3 className="font-serif font-bold text-white text-lg">
                      <span className="font-headline-gold">My</span>{' '}
                      <span className="font-headline-silver">Warranties ({warranties.length})</span>
                    </h3>
                  </div>
                  {warranties.length === 0 ? (
                    <EmptyState icon={Award} title="No warranties registered yet" subtitle="Once you validate a serial and register it, it will appear here with its coverage details."/>
                  ) : (
                    <div className="overflow-x-auto -mx-6 px-6">
                      <table className="w-full min-w-[650px] text-sm">
                        <thead>
                          <tr className="text-left text-xs uppercase tracking-wider text-[#fce096] border-b border-[#d4af37]/20">
                            <th className="py-3 px-3 font-semibold">Serial</th>
                            <th className="py-3 px-3 font-semibold">Product</th>
                            <th className="py-3 px-3 font-semibold">Warranty Period</th>
                            <th className="py-3 px-3 font-semibold">Registered</th>
                            <th className="py-3 px-3 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#d4af37]/10">
                          {warranties.map(w => (
                            <tr key={w.id} className="hover:bg-[#d4af37]/5 transition-colors">
                              <td className="py-4 px-3 font-mono font-semibold text-white">{w.serial_number || w.serial || '—'}</td>
                              <td className="py-4 px-3 text-[#cbd5e1]">{w.product_name || `#${w.product_id}`}</td>
                              <td className="py-4 px-3 text-[#cbd5e1]">
                                <div className="font-medium text-white">{w.warranty_years ? `${w.warranty_years} years` : '10 years'}</div>
                                <div className="text-xs text-[#94a3b8] font-light">
                                  {w.start_date && new Date(w.start_date).toLocaleDateString()}
                                  {w.end_date && ` → ${new Date(w.end_date).toLocaleDateString()}`}
                                </div>
                              </td>
                              <td className="py-4 px-3 text-[#94a3b8] whitespace-nowrap font-light">{w.created_at? new Date(w.created_at).toLocaleDateString():'—'}</td>
                              <td className="py-4 px-3"><StatusPill status={w.status || 'registered'}/></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* ======== AFFILIATE ======== */}
            {activeTab === 'affiliate' && (
              <div className="space-y-5">
                <section className="relative overflow-hidden rounded-3xl two-tone-panel-gold border border-[#d4af37]/40 p-8 text-white shadow-xl">
                  <div className="absolute -top-20 right-0 w-72 h-72 rounded-full bg-[#d4af37]/20 blur-3xl pointer-events-none"/>
                  <div className="relative">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#070a0e]/80 border border-[#d4af37]/40 text-[#fce096] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                      <Zap className="w-3.5 h-3.5 text-[#d4af37]"/> Brand Ambassador Program
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight mb-2">
                      <span className="font-headline-gold">Share Bhumivera.</span>{' '}
                      <span className="font-headline-silver">Grow Together.</span>
                    </h2>
                    <p className="text-[#cbd5e1] max-w-2xl leading-relaxed mb-6 font-light">Share your personal code or link. After approval, you and your friend can each receive {referralData?.rewardMode === 'wallet_coupon' ? `₹${Number(referralData?.referrerRewardAmount || 500).toFixed(0)} and ₹${Number(referralData?.referredRewardAmount || 500).toFixed(0)} in order-only referral balance` : 'the reward configured for the current program'}. Verified referrals are reviewed or automatically approved after one hour.</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <StatCard icon={Users}      label="Friends referred" value={referralData?.referralCount ?? '—'} accent="gold"/>
                      <StatCard icon={User}       label="Rewards earned"   value={referralData?.rewarded_referrals ?? '—'} accent="silver"/>
                      <StatCard icon={Coins}      label="Reward choice"    value={referralData?.rewardMode === 'wallet_coupon' ? 'Order-only balance' : referralData?.rewardMode === 'coupon' ? 'Coupon' : 'Wallet'} accent="gold"/>
                      <StatCard icon={Wallet}     label="Wallet earned"    value={`₹${Number(referralData?.wallet_earned || 0).toFixed(2)}`} accent="silver"/>
                    </div>
                  </div>
                </section>

                <section className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif font-bold text-white text-lg">Your referral code</h3>
                      <p className="mt-1 text-xs text-[#94a3b8] font-light">Friends can enter this code during registration.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="rounded-xl border border-dashed border-[#d4af37]/40 bg-[#070a0e] px-4 py-3 font-mono text-lg font-bold tracking-wider text-[#fce096]">
                        {referralData?.code || 'Loading…'}
                      </code>
                      <button type="button" onClick={handleCopyReferralCode} disabled={!referralData?.code} aria-label="Copy referral code" className="rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-3 text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#fce096] disabled:opacity-50 transition-colors">
                        <Copy className="h-4 w-4"/>
                      </button>
                    </div>
                  </div>
                </section>

                <section className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#d4af37]/20">
                    <div className="w-11 h-11 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/35 text-[#fce096] flex items-center justify-center shrink-0">
                      <Share2 className="w-5 h-5"/>
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-white text-lg">
                        <span className="font-headline-gold">Your Referral</span>{' '}
                        <span className="font-headline-silver">Link</span>
                      </h3>
                      <p className="text-xs text-[#94a3b8] font-light">Share this anywhere. Unlimited referral rewards.</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 flex items-center rounded-xl bg-[#070a0e] border border-[#d4af37]/25 px-4 py-3 overflow-hidden">
                      <ExternalLink className="w-4 h-4 text-[#d4af37] mr-2.5 shrink-0"/>
                      <code className="flex-1 text-sm text-[#cbd5e1] font-mono truncate">{referralUrl || 'Preparing your secure referral link…'}</code>
                    </div>
                    <button onClick={handleCopyRef} className={`btn-gold-luxury px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2`}>
                      {affiliateCopied ? <><CheckCircle2 className="w-4 h-4"/> Copied!</> : <><Copy className="w-4 h-4"/> Copy Link</>}
                    </button>
                  </div>
                  <div className="mt-5 flex flex-col items-center gap-4 rounded-2xl border border-[#d4af37]/25 bg-[#070a0e]/60 p-5 text-center sm:flex-row sm:text-left">
                    {referralQr
                      ? <img src={referralQr} alt="QR code for your Bhumivera referral link" className="h-40 w-40 rounded-lg bg-white p-2 shadow-md"/>
                      : <div role="status" className="grid h-40 w-40 shrink-0 place-items-center rounded-lg bg-[#070a0e] text-xs text-[#94a3b8] border border-[#d4af37]/20">{referralUrl ? 'Creating QR code…' : 'Loading referral link…'}</div>}
                    <div>
                      <h3 className="font-serif font-bold text-white">Share your QR code</h3>
                      <p className="mt-1 max-w-md text-xs leading-5 text-[#cbd5e1] font-light">Friends can scan this code to open your sign-up link. This link expires after 90 days; your referral code remains available for manual entry.</p>
                      {referralData?.referralExpiresAt && <p className="mt-2 text-xs text-[#94a3b8] font-light">Link expires {new Date(referralData.referralExpiresAt).toLocaleDateString()}.</p>}
                      {referralQr && <a href={referralQr} download="bhumivera-referral-qr.png" className="btn-gold-luxury mt-3 inline-flex min-h-10 items-center rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white">Download QR code</a>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
                    <button onClick={() => shareVia('email')} className="two-tone-card flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#d4af37]/25 hover:border-[#d4af37] text-xs font-semibold uppercase tracking-wider text-[#cbd5e1] hover:text-[#fce096] transition-colors">
                      <Mail className="w-4 h-4 text-[#d4af37]"/> Email
                    </button>
                    <button onClick={() => shareVia('x')} className="two-tone-card flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#d4af37]/25 hover:border-[#d4af37] text-xs font-semibold uppercase tracking-wider text-[#cbd5e1] hover:text-[#fce096] transition-colors">
                      <Zap className="w-4 h-4 text-[#d4af37]"/> X / Twitter
                    </button>
                    <button onClick={() => shareVia('native')} className="btn-gold-luxury flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white">
                      <Send className="w-4 h-4"/> More
                    </button>
                  </div>
                </section>

                <section className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-3 pb-3 border-b border-[#d4af37]/20">
                    <div>
                      <h3 className="font-serif font-bold text-white text-lg">
                        <span className="font-headline-gold">Your Referrals</span>{' '}
                        <span className="font-headline-silver">&amp; Rewards</span>
                      </h3>
                      <p className="mt-1 text-xs text-[#94a3b8] font-light">A referral appears after your friend verifies their account.</p>
                    </div>
                    <span className="rounded-full bg-[#d4af37]/15 border border-[#d4af37]/35 px-3 py-1 text-xs font-bold text-[#fce096]">{referralData?.referralCount ?? 0}</span>
                  </div>
                  {referralData?.referrals?.length ? (
                    <ul className="divide-y divide-[#d4af37]/15">
                      {referralData.referrals.map(referral => (
                        <li key={referral.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                          <div>
                            <span className="block text-sm font-serif font-bold text-white">{referral.name || 'New patron'}</span>
                            <span className="text-xs text-[#94a3b8] font-light">
                              Verified {referral.verified_at ? new Date(referral.verified_at).toLocaleString() : '—'}
                              {Number(referral.wallet_amount) > 0 && ` · ₹${Number(referral.wallet_amount).toFixed(2)} wallet`}
                              {referral.coupon_code && ` · Coupon ${referral.coupon_code}`}
                            </span>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${['approved', 'auto_approved'].includes(referral.status) ? 'bg-[#d4af37]/15 text-[#fce096] border border-[#d4af37]/35' : referral.status === 'rejected' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30' : 'bg-slate-700/30 text-[#cbd5e1] border border-slate-600/30'}`}>
                            {referral.status === 'auto_approved'
                              ? 'Automatically approved'
                              : referral.status === 'approved'
                                ? 'Approved'
                                : referral.status === 'rejected'
                                  ? `Not approved${referral.decision_reason ? ` · ${referral.decision_reason}` : ''}`
                                  : `Under review until ${new Date(referral.auto_approve_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="py-3 text-sm text-[#94a3b8] font-light">No verified referrals yet. Ask your friend to finish registration and verify their email.</p>
                  )}
                  {referralData?.referralCount > (referralData?.referrals?.length || 0) && (
                    <p className="mt-3 text-xs text-[#94a3b8] font-light">Showing the latest {referralData.referrals.length} referrals.</p>
                  )}
                </section>
              </div>
            )}

            {/* ======== SUPPORT ======== */}
            {activeTab === 'support' && (
              <SupportCenter
                name={profileData.name || user?.name}
                email={user?.email}
                orders={orders}
                supportTicket={supportTicket}
                setSupportTicket={setSupportTicket}
                onSubmit={handleSupportSubmit}
                faqItems={faqItems}
                faqOpen={faqOpen}
                toggleFaq={toggleFaq}
              />
            )}

          </main>
        </div>
      </div>

      {/* ======== ORDER DETAIL MODAL ======== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-6" onClick={() => setSelectedOrder(null)}>
          <div onClick={e => e.stopPropagation()} className="w-full sm:max-w-3xl max-h-[92vh] bg-[#0d1520] border border-[#d4af37]/30 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="relative two-tone-panel-gold border-b border-[#d4af37]/25 text-white px-6 sm:px-8 py-6">
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="font-sub-gold uppercase tracking-[0.2em] font-bold text-xs mb-1">Patron Order</div>
                  <div className="text-3xl font-serif font-bold tracking-tight mb-1 text-white">#{selectedOrder.id}</div>
                  <div className="text-sm text-[#cbd5e1] inline-flex items-center gap-2 font-light">
                    <Calendar className="w-3.5 h-3.5 text-[#d4af37]"/>
                    {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : ''}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <StatusPill status={selectedOrder.status}/>
                  <button onClick={() => setSelectedOrder(null)} className="w-9 h-9 rounded-xl bg-[#070a0e]/60 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 flex items-center justify-center text-[#cbd5e1] hover:text-[#fce096] transition-colors">
                    <X className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            </div>
            <div className="px-6 sm:px-8 py-4 border-b border-[#d4af37]/20 bg-[#070a0e]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#d4af37]"/>
                  <span className="font-serif font-bold text-sm text-white">Tracking #</span>
                </div>
                <code className="font-mono text-sm text-[#fce096] bg-[#0d1520] border border-[#d4af37]/30 px-3 py-1 rounded-lg">
                  {selectedOrder.tracking_number || selectedOrder.tracking_no || `BHVM${formatOrderNumber(selectedOrder.order_number || selectedOrder.id)}`}
                </code>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6 bg-[#0d1520]">
              <div>
                <h4 className="text-xs font-bold text-[#fce096] uppercase tracking-wider mb-4">Order Timeline</h4>
                <ol className="relative border-l-2 border-[#d4af37]/25 ml-2.5 space-y-5">
                  {[
                    { k: 'pending',    l:'Order Placed',     d:'We received your order and payment confirmation.' },
                    { k: 'confirmed',  l:'Confirmed',        d:'Payment verified and order accepted.' },
                    { k: 'processing', l:'Processing',       d:'Warehouse is picking and packing your items.' },
                    { k: 'packed',     l:'Packed',           d:'Package sealed and labelled for dispatch.' },
                    { k: 'shipped',    l:'Shipped',          d:'Handed over to courier partner.' },
                    { k: 'out_for_delivery', l:'Out for Delivery', d:'On the way to your address.' },
                    { k: 'delivered',  l:'Delivered',        d:'Package delivered. Thank you for shopping Bhumivera!' },
                  ].map((s, i, arr) => {
                    const current = (selectedOrder.status||'').toLowerCase();
                    const stepIdx = arr.findIndex(x => x.k === current);
                    const done = stepIdx >= 0 && i <= stepIdx;
                    const active = s.k === current;
                    return (
                      <li key={s.k} className="ml-6">
                        <span className={`absolute -left-[11px] w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-[#0d1520] ${done ? 'bg-[#d4af37] text-[#070a0e]' : 'bg-[#070a0e] border border-[#d4af37]/30'}`}>
                          {done && <CheckCircle2 className="w-3.5 h-3.5"/>}
                        </span>
                        <div className={`text-sm ${active ? 'font-serif font-bold text-white' : done ? 'text-[#cbd5e1] font-medium' : 'text-[#94a3b8]'}`}>{s.l}</div>
                        <div className="text-xs text-[#94a3b8] mt-0.5 leading-relaxed font-light">{s.d}</div>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#fce096] uppercase tracking-wider mb-3">Items ({ (selectedOrder.items?.length || selectedOrder.order_items?.length || 1) })</h4>
                <div className="rounded-2xl border border-[#d4af37]/25 divide-y divide-[#d4af37]/15 bg-[#070a0e] overflow-hidden">
                  {safeArr(selectedOrder.items || selectedOrder.order_items).length > 0 ? (
                    safeArr(selectedOrder.items || selectedOrder.order_items).map((it, idx) => {
                      const productId = Number(it.product_id || it.id);
                      const alreadyReviewed = myReviews.some(review =>
                        Number(review.product_id) === productId &&
                        Number(review.order_id) === Number(selectedOrder.id)
                      );
                      const itemImage = getProfileImageUrl(it.image || it.image_url);
                      return (
                      <div key={it.id || idx} className="flex items-center gap-4 p-4">
                        <div className="w-14 h-14 rounded-xl bg-[#0d1520] border border-[#d4af37]/25 flex items-center justify-center text-2xl text-[#94a3b8] shrink-0 overflow-hidden">
                          {itemImage
                            ? <img src={itemImage} alt={it.name || it.product_name || 'Ordered product'} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="w-full h-full object-contain p-1"/>
                            : <Package className="text-[#d4af37]"/>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-serif font-bold text-sm text-white truncate">{it.product_name || it.name || `Product #${it.product_id}`}</div>
                          <div className="text-xs text-[#94a3b8] mt-0.5 font-light">Qty: {it.quantity || 1}</div>
                          {DELIVERED_STATUSES.includes((selectedOrder.status || '').toLowerCase()) && (
                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                            {alreadyReviewed ? (
                              <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#fce096]"><CheckCircle2 className="w-3 h-3 text-[#d4af37]"/> Review submitted</span>
                            ) : (
                              <button
                                onClick={() => {
                                  setReviewSubmission({
                                    orderId: Number(selectedOrder.id),
                                    productId,
                                    productName: it.product_name || it.name || `Product #${productId}`,
                                    image: itemImage
                                  });
                                  setReviewDraft({ rating: 5, title: '', body: '', images: [], publicStoryConsent: false });
                                }}
                                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#fce096] hover:text-white"
                              >
                                <Star className="w-3 h-3 text-[#d4af37]"/> Write a review
                              </button>
                            )}
                            <button
                              onClick={() => {
                                const productName = it.product_name || it.name || `Product #${productId}`;
                                const ordNum = formatOrderNumber(selectedOrder.order_number || selectedOrder.id);
                                setSupportTicket({
                                  subject: `Help with ${productName} · Order #${ordNum}`.slice(0, 200),
                                  message: `I need help with ${productName} from Order #${ordNum}.`,
                                  order_id: String(selectedOrder.id),
                                  product_id: Number.isSafeInteger(productId) && productId > 0 ? String(productId) : ''
                                });
                                setSelectedOrder(null);
                                setActiveTab('support');
                                window.dispatchEvent(new CustomEvent('bhumivera:open-support-chat', {
                                  detail: {
                                    orderId: selectedOrder.id,
                                    orderNumber: ordNum,
                                    productName,
                                    prompt: `I need help with ${productName} from Order #${ordNum}.`,
                                  }
                                }));
                              }}
                              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#cbd5e1] hover:text-[#fce096]"
                            >
                              <LifeBuoy className="w-3 h-3 text-[#d4af37]"/> Get help with this item
                            </button>
                            </div>
                          )}
                        </div>
                        <div className="font-serif font-bold text-sm text-[#fce096]">₹{Number(it.subtotal || it.price * (it.quantity||1) || 0).toFixed(2)}</div>
                      </div>
                    )})
                  ) : (
                    <div className="p-4 text-sm text-[#94a3b8]">1 item in this order</div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-[#fce096]">Total Breakdown</h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-[#cbd5e1]">Subtotal</span><span className="text-white font-medium">₹{Number(selectedOrder.subtotal || selectedOrder.total_amount || 0).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-[#cbd5e1]">Shipping</span><span className="text-white font-medium">₹{Number(selectedOrder.shipping_fee || selectedOrder.shipping || 0).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-[#cbd5e1]">Tax</span><span className="text-white font-medium">₹{Number(selectedOrder.tax || 0).toFixed(2)}</span></div>
                    {(selectedOrder.discount || 0) > 0 && <div className="flex justify-between"><span className="text-[#cbd5e1]">Discount</span><span className="text-[#fce096] font-medium">- ₹{Number(selectedOrder.discount||0).toFixed(2)}</span></div>}
                    {Number(selectedOrder.tier_discount) > 0 && <div className="flex justify-between"><span className="text-[#cbd5e1]">Loyalty tier benefit</span><span className="text-[#fce096] font-medium">- ₹{Number(selectedOrder.tier_discount).toFixed(2)}</span></div>}
                    {Number(selectedOrder.referral_wallet_amount) > 0 && <div className="flex justify-between"><span className="text-[#cbd5e1]">Referral balance</span><span className="text-[#fce096] font-medium">- ₹{Number(selectedOrder.referral_wallet_amount).toFixed(2)}</span></div>}
                    {Number(selectedOrder.loyalty_points_redeemed) > 0 && <div className="flex justify-between"><span className="text-[#cbd5e1]">Loyalty points redeemed</span><span className="text-[#fce096] font-medium">{Number(selectedOrder.loyalty_points_redeemed).toLocaleString()} pts</span></div>}
                    {Number(selectedOrder.loyalty_points_awarded) > 0 && <div className="flex justify-between"><span className="text-[#cbd5e1]">Points earned</span><span className="text-[#cbd5e1] font-medium">+{Number(selectedOrder.loyalty_points_awarded).toLocaleString()} pts</span></div>}
                    <div className="pt-2.5 mt-2 border-t border-[#d4af37]/20 flex justify-between items-baseline">
                      <span className="text-white font-serif font-bold">Total Paid</span>
                      <span className="text-xl font-serif font-bold text-[#fce096] tracking-tight">₹{Number(selectedOrder.total_amount || selectedOrder.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-[#fce096]">Shipping Address</h4>
                  <div className="text-sm text-[#cbd5e1] leading-relaxed font-light">
                    <div className="font-serif font-bold text-white mb-1">{selectedOrder.shipping_name || selectedOrder.customer_name || displayName}</div>
                    <div>{selectedOrder.shipping_line1 || selectedOrder.shipping_address || selectedOrder.billing_address || 'Address not available'}</div>
                    {(selectedOrder.shipping_city || selectedOrder.shipping_state) && (
                      <div className="mt-0.5">
                        {[selectedOrder.shipping_city, selectedOrder.shipping_state, selectedOrder.shipping_postal_code].filter(Boolean).join(', ')}
                      </div>
                    )}
                    {selectedOrder.shipping_phone && <div className="mt-0.5 text-[#94a3b8] flex items-center gap-1.5"><Phone className="w-3 h-3 text-[#d4af37]"/> {selectedOrder.shipping_phone}</div>}
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-[#d4af37]/20 bg-[#070a0e] px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-[#94a3b8] font-light">Need assistance? <button onClick={() => { const ordNum = formatOrderNumber(selectedOrder.order_number || selectedOrder.id); setSelectedOrder(null); setActiveTab('support'); window.dispatchEvent(new CustomEvent('bhumivera:open-support-chat', { detail: { orderId: selectedOrder.id, orderNumber: ordNum, prompt: `I need help with Order #${ordNum}.` } })); }} className="text-[#fce096] font-semibold underline underline-offset-2 hover:text-white">Open Live Order Support Chat</button>.</div>
              <div className="flex flex-wrap gap-2">
                {canCancelOrder(selectedOrder) && (
                  <button onClick={() => handleCancelOrder(selectedOrder.id)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold uppercase tracking-wider">
                    <X className="w-4 h-4"/> Cancel Order
                  </button>
                )}
                {needsRefundSupport(selectedOrder) && (
                  <button onClick={() => { setSelectedOrder(null); setActiveTab('support'); }} className="btn-silver-luxury px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider">
                    Contact concierge about refund
                  </button>
                )}
                {DELIVERED_STATUSES.includes((selectedOrder.status||'').toLowerCase()) && (
                  <Link to="/verify" onClick={() => setSelectedOrder(null)}
                    className="btn-gold-luxury inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider">
                    <Award className="w-4 h-4"/> Verify Bottle Serial &amp; Assay
                  </Link>
                )}
                <button onClick={() => setSelectedOrder(null)} className="btn-silver-luxury px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======== REVIEW SUBMISSION MODAL ======== */}
      {reviewSubmission && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-6" onClick={closeReviewForm}>
          <form onSubmit={submitPurchaseReview} onClick={event => event.stopPropagation()} className="w-full max-w-xl overflow-hidden rounded-t-3xl bg-[#0d1520] border border-[#d4af37]/30 shadow-2xl sm:rounded-3xl">
            <div className="flex items-center gap-4 two-tone-panel-gold border-b border-[#d4af37]/25 px-6 py-5 text-white">
              {reviewSubmission.image && <img src={reviewSubmission.image} alt="" className="h-14 w-14 rounded-xl bg-[#070a0e] border border-[#d4af37]/25 object-contain p-1"/>}
              <div className="min-w-0 flex-1">
                <div className="font-sub-gold uppercase tracking-widest text-xs font-bold">Order #{formatOrderNumber(selectedOrder?.order_number || reviewSubmission.orderId)}</div>
                <h3 className="truncate text-lg font-serif font-bold text-white mt-0.5">{reviewSubmission.productName}</h3>
              </div>
              <button type="button" disabled={reviewSubmitting} onClick={closeReviewForm} aria-label="Close review form" className="rounded-xl p-2 bg-[#070a0e]/60 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#cbd5e1] hover:text-[#fce096] disabled:opacity-50 transition-colors"><X className="h-5 w-5"/></button>
            </div>
            <div className="space-y-5 p-6 bg-[#0d1520]">
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#fce096] uppercase tracking-wider">Your Rating</label>
                <StarsInput value={reviewDraft.rating} onChange={rating => setReviewDraft(current => ({ ...current, rating }))}/>
              </div>
              <div>
                <label htmlFor="purchase-review-title" className="mb-1.5 block text-xs font-semibold text-[#fce096] uppercase tracking-wider">Title (optional)</label>
                <input id="purchase-review-title" value={reviewDraft.title} maxLength={255} onChange={event => setReviewDraft(current => ({ ...current, title: event.target.value }))} className="w-full rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white px-4 py-2.5 text-sm focus:border-[#d4af37] focus:outline-none" placeholder="Summarize your experience"/>
              </div>
              <div>
                <label htmlFor="purchase-review-body" className="mb-1.5 block text-xs font-semibold text-[#fce096] uppercase tracking-wider">Your review (optional)</label>
                <textarea id="purchase-review-body" value={reviewDraft.body} maxLength={5000} rows={4} onChange={event => setReviewDraft(current => ({ ...current, body: event.target.value }))} className="w-full resize-y rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white px-4 py-3 text-sm focus:border-[#d4af37] focus:outline-none font-light" placeholder="Share your experience with this formulation ritual"/>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#fce096] uppercase tracking-wider">Photos of the item you received</label>
                  <span className="text-xs text-[#94a3b8]">{reviewDraft.images.length}/5</span>
                </div>
                <input ref={reviewCameraInputRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" multiple className="hidden" onChange={addReviewImages}/>
                <input ref={reviewGalleryInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={addReviewImages}/>
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={reviewSubmitting || reviewDraft.images.length >= 5} onClick={() => reviewCameraInputRef.current?.click()} className="two-tone-card inline-flex items-center gap-2 rounded-xl border border-[#d4af37]/25 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#cbd5e1] hover:text-[#fce096] disabled:opacity-50"><Camera className="h-4 w-4 text-[#d4af37]"/> Take photo</button>
                  <button type="button" disabled={reviewSubmitting || reviewDraft.images.length >= 5} onClick={() => reviewGalleryInputRef.current?.click()} className="two-tone-card inline-flex items-center gap-2 rounded-xl border border-[#d4af37]/25 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#cbd5e1] hover:text-[#fce096] disabled:opacity-50"><ImageIcon className="h-4 w-4 text-[#d4af37]"/> Choose photos</button>
                </div>
                {reviewDraft.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {reviewDraft.images.map((image, index) => (
                      <div key={`${image.file.name}-${index}`} className="relative aspect-square overflow-hidden rounded-lg border border-[#d4af37]/30 bg-[#070a0e]">
                        <img src={image.preview} alt={`Review attachment ${index + 1}`} className="h-full w-full object-cover"/>
                        <button type="button" disabled={reviewSubmitting} onClick={() => removeReviewImage(index)} aria-label={`Remove photo ${index + 1}`} className="absolute right-1 top-1 rounded-full bg-black/80 p-1 text-white disabled:opacity-50"><X className="h-3 w-3"/></button>
                      </div>
                    ))}
                  </div>
                )}
                {reviewSubmitting && reviewDraft.images.length > 0 && (
                  <div className="mt-3" role="status" aria-live="polite">
                    <div className="mb-1 flex justify-between text-xs text-[#cbd5e1]"><span>Uploading photos…</span><span>{reviewUploadProgress}%</span></div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#070a0e]"><div className="h-full rounded-full bg-[#d4af37] transition-all" style={{ width: `${reviewUploadProgress}%` }}/></div>
                  </div>
                )}
                <p className="mt-2 text-xs text-[#94a3b8] font-light">JPEG, PNG, or WebP · up to 8 MB per photo.</p>
                <label className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/60 p-3 text-xs leading-5 text-[#cbd5e1]">
                  <input type="checkbox" checked={reviewDraft.publicStoryConsent} disabled={!reviewDraft.images.length || reviewSubmitting} onChange={event => setReviewDraft(current => ({ ...current, publicStoryConsent: event.target.checked }))} className="mt-1 h-4 w-4 shrink-0 accent-[#d4af37]"/>
                  <span><strong className="text-white">Optional: let us feature my photo and patron name on the Bhumivera website.</strong> Only approved reviews with this permission may appear in our patron story feature.</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-[#d4af37]/20 bg-[#070a0e] px-6 py-4">
              <button type="button" disabled={reviewSubmitting} onClick={closeReviewForm} className="btn-silver-luxury rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={reviewSubmitting} className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-50">
                <Star className="h-4 w-4"/> {reviewSubmitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======== RETURN REQUEST MODAL ======== */}
      {returnOrder && (() => {
        const deliveredOrders = eligibleReturnOrders;
        const selectedOrderItems = safeArr(returnOrder.order?.items || returnOrder.order?.order_items);
        const form = returnOrder.form || {};
        const evidenceImages = Array.isArray(form.images) ? form.images : [];
        return (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-6" onClick={closeReturnRequest}>
            <form onSubmit={handleSubmitReturn} onClick={e => e.stopPropagation()} className="w-full sm:max-w-xl bg-[#0d1520] border border-[#d4af37]/30 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              <div className="two-tone-panel-gold border-b border-[#d4af37]/25 text-white px-6 sm:px-8 py-6 flex items-start justify-between gap-4">
                <div>
                  <div className="font-sub-gold uppercase tracking-[0.2em] font-bold text-xs mb-1">Return Request</div>
                  <h3 className="text-2xl font-serif font-bold text-white">Submit Return</h3>
                  <p className="text-sm text-[#cbd5e1] mt-1 font-light">Your order stays delivered while our team reviews the request.</p>
                </div>
                <button type="button" onClick={closeReturnRequest} className="w-9 h-9 rounded-xl bg-[#070a0e]/60 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 flex items-center justify-center text-[#cbd5e1] hover:text-[#fce096]">
                  <X className="w-4 h-4"/>
                </button>
              </div>
              <div className="px-6 sm:px-8 py-6 space-y-4 flex-1 overflow-y-auto bg-[#0d1520]">
                <div>
                  <label className="text-xs font-semibold text-[#fce096] uppercase tracking-wider mb-1.5 block">Delivered Order</label>
                  <select value={returnOrder.orderId} onChange={e => {
                    const order = deliveredOrders.find(item => String(item.id) === e.target.value);
                    setReturnOrder(current => ({ ...current, orderId: Number(e.target.value), order, form: { ...current.form, orderItemId: (order?.items || order?.order_items || [])[0]?.id || '', quantity: 1 } }));
                  }}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white text-sm focus:border-[#d4af37]">
                    {deliveredOrders.map(o => (
                      <option key={o.id} value={o.id} className="bg-[#070a0e] text-white">Order #{formatOrderNumber(o.order_number || o.id)} — ₹{Number(o.total_amount||o.total||0).toFixed(2)} ({o.created_at? new Date(o.created_at).toLocaleDateString():''})</option>
                    ))}
                    {deliveredOrders.length === 0 && <option value="" className="bg-[#070a0e] text-white">No currently eligible delivered orders</option>}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#fce096] uppercase tracking-wider mb-1.5 block">Item to return</label>
                    <select value={form.orderItemId} onChange={e => setReturnOrder(current => ({ ...current, form: { ...current.form, orderItemId: e.target.value, quantity: 1 } }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white text-sm">
                      <option value="" className="bg-[#070a0e] text-white">Select an item…</option>
                      {selectedOrderItems.map(item => <option key={item.id} value={item.id} className="bg-[#070a0e] text-white">{item.name || item.product_name || `Product #${item.product_id}`} · {item.quantity} purchased</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#fce096] uppercase tracking-wider mb-1.5 block">Quantity</label>
                    <input type="number" min="1" max={selectedOrderItems.find(item => String(item.id) === String(form.orderItemId))?.quantity || 1} value={form.quantity} onChange={e => setReturnOrder(current => ({ ...current, form: { ...current.form, quantity: e.target.value } }))} className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white text-sm"/>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#fce096] uppercase tracking-wider mb-1.5 block">Return Reason</label>
                  <select value={form.reason} onChange={e => setReturnOrder(r => ({ ...r, form:{ ...r.form, reason: e.target.value }}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white text-sm focus:border-[#d4af37]">
                    <option value="" className="bg-[#070a0e] text-white">Select a reason…</option>
                    <option className="bg-[#070a0e] text-white">Defective product</option>
                    <option className="bg-[#070a0e] text-white">Wrong item received</option>
                    <option className="bg-[#070a0e] text-white">Item damaged during shipping</option>
                    <option className="bg-[#070a0e] text-white">Not as described on website</option>
                    <option className="bg-[#070a0e] text-white">Changed my mind</option>
                    <option className="bg-[#070a0e] text-white">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#fce096] uppercase tracking-wider mb-1.5 block">Refund Method</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { v:'wallet', l:'Bhumivera Wallet', d:'Instant credit • use for future orders', i: Wallet },
                      { v:'original', l:'Original Payment', d:'Refunded in 5-7 business days', i: ArrowUpRight },
                    ].map(o => {
                      const I = o.i;
                      const active = form.refundMethod === o.v;
                      return (
                        <button key={o.v} type="button" onClick={() => setReturnOrder(r => ({ ...r, form:{ ...r.form, refundMethod: o.v }}))}
                          className={`p-4 rounded-2xl border text-left transition-all ${active ? 'bg-[#070a0e] border-[#d4af37] ring-1 ring-[#d4af37]' : 'border-[#d4af37]/20 bg-[#070a0e]/60 hover:border-[#d4af37]/40'}`}>
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${active ? 'bg-[#d4af37]/20 text-[#fce096]' : 'bg-[#0d1520] text-[#94a3b8]'}`}>
                            <I className="w-4.5 h-4.5"/>
                          </div>
                          <div className="font-serif font-bold text-sm text-white">{o.l}</div>
                          <div className="text-xs text-[#94a3b8] mt-0.5 font-light">{o.d}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#fce096] uppercase tracking-wider mb-1.5 block">What happened? (optional details)</label>
                  <textarea rows={3} value={form.notes} onChange={e => setReturnOrder(r => ({ ...r, form:{ ...r.form, notes: e.target.value }}))}
                    maxLength={2000} placeholder="Share what happened so our team can review the right solution."
                    className="w-full px-4 py-3 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white focus:border-[#d4af37] text-sm resize-none font-light"/>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3"><label className="text-xs font-semibold text-[#fce096] uppercase tracking-wider">Evidence photos (optional, up to 5)</label><span className="text-[10px] text-[#94a3b8]">{evidenceImages.length}/5</span></div>
                  <input ref={returnPhotoInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addReturnImages} className="hidden"/>
                  <button type="button" onClick={() => returnPhotoInputRef.current?.click()} disabled={evidenceImages.length >= 5 || returnSubmitting} className="w-full rounded-xl border border-dashed border-[#d4af37]/30 bg-[#070a0e] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#cbd5e1] hover:border-[#d4af37] disabled:opacity-50"><Camera className="mr-2 inline h-4 w-4 text-[#d4af37]"/>Add photos — JPEG, PNG, or WebP; max 8 MB each</button>
                  {evidenceImages.length > 0 && <div className="mt-3 grid grid-cols-5 gap-2">{evidenceImages.map((image, index) => <div key={image.preview} className="relative aspect-square overflow-hidden rounded-lg border border-[#d4af37]/30"><img src={image.preview} alt={`Return evidence ${index + 1}`} className="h-full w-full object-cover"/><button type="button" onClick={() => removeReturnImage(index)} disabled={returnSubmitting} aria-label="Remove evidence photo" className="absolute right-1 top-1 rounded-full bg-black/80 p-1 text-white"><X className="h-3 w-3"/></button></div>)}</div>}
                  {returnSubmitting && evidenceImages.length > 0 && <div className="mt-3"><div className="h-2 overflow-hidden rounded-full bg-[#070a0e]"><div className="h-full bg-[#d4af37] transition-all" style={{ width: `${returnUploadProgress}%` }}/></div><p className="mt-1 text-right text-xs text-[#94a3b8]">{returnUploadProgress}% uploaded</p></div>}
                </div>
                <div className="rounded-xl border border-[#d4af37]/25 bg-[#070a0e]/60 p-3 text-xs text-[#cbd5e1] font-light">Our concierge team reviews every submission. Need urgent assistance? <button type="button" onClick={() => { closeReturnRequest(); setSupportTicket(ticket => ({ ...ticket, subject: `Return help for order #${returnOrder.orderId}`, order_id: String(returnOrder.orderId) })); setActiveTab('support'); }} className="text-[#fce096] font-semibold underline underline-offset-2 hover:text-white">Chat with customer care</button>.</div>
              </div>
              <div className="border-t border-[#d4af37]/20 bg-[#070a0e] px-6 sm:px-8 py-4 flex flex-wrap items-center justify-end gap-2">
                <button type="button" onClick={closeReturnRequest} disabled={returnSubmitting} className="btn-silver-luxury px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={returnSubmitting} className="btn-gold-luxury px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 disabled:opacity-50">
                  <CheckCircle2 className="w-4 h-4"/> {returnSubmitting ? 'Sending for review…' : 'Submit for review'}
                </button>
              </div>
            </form>
          </div>
        );
      })()}

      {/* ======== ADDRESS FORM MODAL ======== */}
      {addressModal.open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-6" onClick={() => setAddressModal(m => ({ ...m, open:false }))}>
          <form onSubmit={handleAddressSave} onClick={e => e.stopPropagation()} className="w-full sm:max-w-2xl bg-[#0d1520] border border-[#d4af37]/30 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] max-h-[92dvh]">
            <div className="two-tone-panel-gold border-b border-[#d4af37]/25 text-white px-6 sm:px-8 py-5 flex items-start justify-between gap-4">
              <div>
                <div className="font-sub-gold uppercase tracking-[0.2em] font-bold text-xs mb-1">Destination</div>
                <h3 className="text-xl font-serif font-bold text-white">{addressModal.editId ? 'Edit Address' : 'Add New Address'}</h3>
              </div>
              <button type="button" aria-label="Close address form" onClick={() => setAddressModal(m => ({ ...m, open:false }))} className="min-h-11 min-w-11 rounded-xl bg-[#070a0e]/60 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 flex items-center justify-center text-[#cbd5e1] hover:text-[#fce096]">
                <X className="w-4 h-4"/>
              </button>
            </div>
            <div className="px-6 sm:px-8 py-5 space-y-4 overflow-y-auto flex-1 bg-[#0d1520]">
              <div className="flex flex-wrap gap-2">
                {['Home','Work','Office','Other'].map(l => (
                  <button key={l} type="button" onClick={() => setAddressModal(m => ({ ...m, form:{ ...m.form, label: l }}))}
                    className={`min-h-11 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 border transition-all ${
                      addressModal.form.label === l ? 'bg-[#d4af37] text-[#070a0e] border-[#d4af37]' : 'bg-[#070a0e] text-[#cbd5e1] border-[#d4af37]/25 hover:border-[#d4af37]'
                    }`}>
                    <LabelIcon label={l}/> {l}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 two-tone-panel rounded-2xl border border-[#d4af37]/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Navigation className="text-[#d4af37] w-4 h-4" />
                      <span className="text-sm font-serif font-bold text-white">Exact Delivery Spot Pinpointer</span>
                      {hasCoordinates(addressModal.form.latitude, addressModal.form.longitude) && (
                        <span className="bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fce096] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          GPS Attached
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#cbd5e1] mt-1 font-light">
                      {hasCoordinates(addressModal.form.latitude, addressModal.form.longitude) ? (
                        <>
                          Coordinates: <span className="font-mono text-[#fce096] font-semibold">{addressModal.form.latitude}, {addressModal.form.longitude}</span> &bull;{' '}
                          <a
                            href={addressModal.form.google_maps_url || `https://www.google.com/maps?q=${addressModal.form.latitude},${addressModal.form.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#fce096] underline font-medium hover:text-white inline-flex items-center gap-1"
                          >
                            Preview on Maps <ExternalLink className="w-3 h-3" />
                          </a>
                        </>
                      ) : (
                        "Your coordinates are sent to OpenStreetMap to suggest address details and create a Google Maps pin. Review them before saving."
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDetectProfileLocation}
                    disabled={locatingAddress}
                    className="btn-gold-luxury inline-flex min-h-11 items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider disabled:opacity-50 whitespace-nowrap shadow-sm"
                  >
                    <Navigation className={`w-3.5 h-3.5 ${locatingAddress ? 'animate-spin' : ''}`} />
                    {locatingAddress ? 'Detecting GPS...' : hasCoordinates(addressModal.form.latitude, addressModal.form.longitude) ? 'Re-pin Location' : 'Use Current Location'}
                  </button>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="profile-address-name" className="text-xs font-semibold text-[#fce096] uppercase tracking-wider mb-1.5 block">Full Name</label>
                  <input id="profile-address-name" autoComplete="name" required value={addressModal.form.full_name} onChange={e => setAddressModal(m => ({ ...m, form:{ ...m.form, full_name: e.target.value }}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 text-sm"/>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="profile-address-phone" className="text-xs font-semibold text-[#fce096] uppercase tracking-wider mb-1.5 block">Phone Number</label>
                  <input id="profile-address-phone" type="tel" inputMode="tel" autoComplete="tel" required value={addressModal.form.phone} onChange={e => setAddressModal(m => ({ ...m, form:{ ...m.form, phone: e.target.value }}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 text-sm"/>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="profile-address-line1" className="text-xs font-semibold text-[#fce096] uppercase tracking-wider mb-1.5 block">Street / House / Floor (Address Line 1)</label>
                  <input id="profile-address-line1" autoComplete="address-line1" required value={addressModal.form.line1} onChange={e => setAddressModal(m => ({ ...m, form:{ ...m.form, line1: e.target.value }}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 text-sm"/>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="profile-address-line2" className="text-xs font-semibold text-[#fce096] uppercase tracking-wider mb-1.5 block">Address Line 2 (optional)</label>
                  <input id="profile-address-line2" autoComplete="address-line2" value={addressModal.form.line2} onChange={e => setAddressModal(m => ({ ...m, form:{ ...m.form, line2: e.target.value }}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 text-sm"/>
                </div>
                <div>
                  <label htmlFor="profile-address-city" className="text-xs font-semibold text-[#fce096] uppercase tracking-wider mb-1.5 block">City</label>
                  <input id="profile-address-city" autoComplete="address-level2" required value={addressModal.form.city} onChange={e => setAddressModal(m => ({ ...m, form:{ ...m.form, city: e.target.value }}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 text-sm"/>
                </div>
                <div>
                  <label htmlFor="profile-address-state" className="text-xs font-semibold text-[#fce096] uppercase tracking-wider mb-1.5 block">State</label>
                  <input id="profile-address-state" autoComplete="address-level1" required value={addressModal.form.state} onChange={e => setAddressModal(m => ({ ...m, form:{ ...m.form, state: e.target.value }}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 text-sm"/>
                </div>
                <div>
                  <label htmlFor="profile-address-postal-code" className="text-xs font-semibold text-[#fce096] uppercase tracking-wider mb-1.5 block">Postal Code</label>
                  <input id="profile-address-postal-code" inputMode="numeric" autoComplete="postal-code" required value={addressModal.form.postal_code} onChange={e => setAddressModal(m => ({ ...m, form:{ ...m.form, postal_code: e.target.value }}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 text-sm"/>
                </div>
                <div>
                  <label htmlFor="profile-address-country" className="text-xs font-semibold text-[#fce096] uppercase tracking-wider mb-1.5 block">Country</label>
                  <input id="profile-address-country" autoComplete="country-name" required value={addressModal.form.country} onChange={e => setAddressModal(m => ({ ...m, form:{ ...m.form, country: e.target.value }}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 text-sm"/>
                </div>
                <div className="sm:col-span-2">
                  <label className="inline-flex items-center gap-2.5 p-3.5 rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/60 hover:border-[#d4af37] cursor-pointer transition-colors w-full">
                    <input type="checkbox" checked={!!addressModal.form.is_default} onChange={e => setAddressModal(m => ({ ...m, form:{ ...m.form, is_default: e.target.checked }}))}
                      className="w-4.5 h-4.5 rounded accent-[#d4af37]"/>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white">Set as default shipping address</div>
                      <div className="text-xs text-[#94a3b8] font-light">Pre-selects this address automatically at checkout.</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="border-t border-[#d4af37]/20 bg-[#070a0e] px-6 sm:px-8 py-4 flex flex-wrap items-center justify-end gap-2">
              <button type="button" onClick={() => setAddressModal(m => ({ ...m, open:false }))} className="btn-silver-luxury min-h-11 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider">Cancel</button>
              <button type="submit" className="btn-gold-luxury min-h-11 px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 shadow-sm">
                <CheckCircle2 className="w-4 h-4"/> {addressModal.editId ? 'Save Changes' : 'Save Address'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function PwField({ k, label, passwords, setPasswords }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="text-xs font-semibold text-[#fce096] uppercase tracking-wider mb-1.5 block">{label}</label>
      <div className="flex items-center rounded-xl border border-[#d4af37]/25 bg-[#070a0e] focus-within:border-[#d4af37] focus-within:ring-1 focus-within:ring-[#d4af37]/20 transition-all">
        <input type={show?'text':'password'} value={passwords[k]} onChange={e => setPasswords({ ...passwords, [k]: e.target.value })}
          className="flex-1 px-4 py-2.5 bg-transparent text-sm text-white focus:outline-none"/>
        <button type="button" onClick={() => setShow(!show)} className="px-3 text-[#94a3b8] hover:text-[#fce096]">
          {show ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
        </button>
      </div>
    </div>
  );
}
