import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  BASE_URL,
  users as usersApi,
  orders as ordersApi,
  wishlist as wishlistApi,
  contact as contactApi,
  wallet as walletApi,
  addresses as addressesApi,
  returns as returnsApi,
  notifications as notificationsApi,
  coupons as couponsApi,
  reviews as reviewsApi,
  warranty as warrantyApi,
  serials as serialsApi,
} from '../services/api';
import { useToast } from '../context/ToastContext';
import compressImageForUpload from '../utils/compressImageForUpload';
import {
  User, Package, Heart, Shield, LifeBuoy, LogOut,
  Wallet, MapPin, Bell, Ticket, Star, Award, Share2,
  ChevronRight, LayoutDashboard, Home, Building2, Map,
  Eye, X, Plus, Edit2, Trash2, Clock, CheckCircle2, AlertTriangle,
  Search, EyeOff, Copy, Send, ArrowRight, ArrowUpRight, ArrowDownLeft,
  QrCode, Smartphone, HelpCircle, MessageSquare, Phone, Mail, ShoppingCart,
  Filter, Calendar, Hash, Truck, PackageCheck, RotateCcw,
  ChevronDown, ChevronUp, Gift, PiggyBank, ShoppingBag,
  Leaf, Zap, Users, Coins, ExternalLink, Key, Camera, Image as ImageIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SupportCenter from '../components/SupportCenter';

const getProfileImageUrl = image => {
  let value = image;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      value = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      // Keep plain image URLs and object-storage keys as-is.
    }
  }
  const path = typeof value === 'object' && value !== null
    ? value.url || value.file_path || value.path
    : value;
  if (typeof path !== 'string' || !path.trim()) return null;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  if (path.startsWith('uploads/')) return `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\/+/, '')}`;
  const imageBase = import.meta.env.VITE_R2_PUBLIC_URL ||
    import.meta.env.VITE_IMAGE_BASE_URL ||
    'https://pub-70fdb5d94df347c4bed417c28b066c02.r2.dev/bhumivera';
  return `${imageBase.replace(/\/$/, '')}/${path.replace(/^\/+/, '')}`;
};

const TABS = [
  { id: 'overview',      label: 'Overview',      icon: LayoutDashboard },
  { id: 'orders',        label: 'Orders',        icon: Package },
  { id: 'wishlist',      label: 'Wishlist',      icon: Heart },
  { id: 'wallet',        label: 'Wallet',        icon: Wallet },
  { id: 'addresses',     label: 'Addresses',     icon: MapPin },
  { id: 'returns',       label: 'Returns',       icon: RotateCcw },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'coupons',       label: 'Coupons',       icon: Ticket },
  { id: 'security',      label: 'Security',      icon: Shield },
  { id: 'reviews',       label: 'Reviews',       icon: Star },
  { id: 'affiliate',     label: 'Affiliate',     icon: Share2 },
  { id: 'support',       label: 'Support',       icon: LifeBuoy },
];

const SECURITY_QUESTIONS = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What was your first car?",
  "In what city were you born?",
  "What is the name of your favorite teacher?",
  "What is your favorite book?",
];

const CANCELLABLE_STATUSES = ['pending', 'confirmed', 'processing', 'packed'];
const DELIVERED_STATUSES = ['delivered', 'completed'];

const faqItems = [
  { q: 'How do I track my order?', a: 'Go to the Orders tab above and click the "Track" button next to your order. You will see live status updates including processing, packed, shipped, out for delivery and delivered timelines.' },
  { q: 'What is your return policy?', a: "Return requests open 30 minutes after verified delivery and follow the store's configured return window. Choose the order and item, add photos if helpful, and submit it for review. The order is not marked returned unless the team accepts the request." },
  { q: 'How does the wallet work?', a: 'Your wallet holds store credits and loyalty rewards. Available balances are applied during checkout. No demo add-funds capability is available at this time.' },
  { q: 'Is my account secure?', a: 'Yes. We use bcrypt password hashing, signed JWT tokens and optional TOTP-based 2FA. We recommend enabling 2FA from the Security tab and setting a security question for password-recovery fallback.' },
  { q: 'How do I join the affiliate program?', a: 'Your referral link is available on the Affiliate tab. Share it with friends. Every signup and purchase made through your link tracks to your account. See the Affiliate tab for live stats and share buttons.' },
];

const EmptyState = ({ icon: Icon, title, subtitle, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center mb-5 shadow-inner">
      <Icon className="w-9 h-9 text-[#8B9D83]" strokeWidth={1.7}/>
    </div>
    <h3 className="text-lg font-semibold text-[#0B2419] mb-1.5">{title}</h3>
    <p className="text-sm text-stone-500 max-w-sm mb-6 leading-relaxed">{subtitle}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B2419] text-[#FDFBF7] text-sm font-medium hover:bg-[#1e4031] transition-colors shadow-sm"
      >
        {actionLabel}
        <ArrowRight className="w-4 h-4"/>
      </button>
    )}
  </div>
);

const LabelIcon = ({ label }) => {
  const l = (label || '').toLowerCase();
  if (l.includes('work') || l.includes('office')) return <Building2 className="w-4 h-4"/>;
  if (l.includes('other')) return <Map className="w-4 h-4"/>;
  return <Home className="w-4 h-4"/>;
};

const StatusPill = ({ status }) => {
  const s = (status || '').toLowerCase();
  const cfg = (() => {
    if (['pending', 'pending_admin_review', 'waiting_customer_service_review', 'processing', 'confirmed'].includes(s)) return { bg: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' };
    if (['packed', 'shipped', 'out_for_delivery', 'out for delivery', 'return_in_progress'].includes(s)) return { bg: 'bg-sky-50 text-sky-800 border-sky-200', dot: 'bg-sky-500' };
    if (['delivered', 'completed', 'paid', 'approved', 'registered', 'active', 'replacement_sent'].includes(s)) return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' };
    if (['cancelled', 'canceled', 'rejected', 'expired', 'failed'].includes(s)) return { bg: 'bg-rose-50 text-rose-800 border-rose-200', dot: 'bg-rose-500' };
    if (['refunded', 'returned', 'received'].includes(s)) return { bg: 'bg-violet-50 text-violet-800 border-violet-200', dot: 'bg-violet-500' };
    if (['unread'].includes(s)) return { bg: 'bg-[#0B2419]/5 text-[#0B2419] border-[#0B2419]/20', dot: 'bg-[#D4AF37]' };
    return { bg: 'bg-stone-100 text-stone-700 border-stone-200', dot: 'bg-stone-400' };
  })();
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>
      {s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g,' ')}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, accent, onClick, hint }) => (
  <button
    onClick={onClick}
    className={`group w-full text-left rounded-2xl border p-5 bg-white hover:shadow-md transition-all duration-300 ${
      accent === 'gold' ? 'border-[#D4AF37]/40 hover:border-[#D4AF37]/80'
      : accent === 'sage' ? 'border-[#8B9D83]/40 hover:border-[#8B9D83]/80'
      : accent === 'earth' ? 'border-[#0B2419]/15 hover:border-[#0B2419]/40'
      : 'border-stone-200 hover:border-stone-400'
    }`}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
        accent === 'gold' ? 'bg-[#D4AF37]/10 text-[#8a6a12]'
        : accent === 'sage' ? 'bg-[#8B9D83]/15 text-[#3f503c]'
        : accent === 'earth' ? 'bg-[#0B2419]/8 text-[#0B2419]'
        : 'bg-stone-100 text-stone-700'
      }`}>
        <Icon className="w-5 h-5"/>
      </div>
      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 group-hover:text-stone-600 transition-all"/>
    </div>
    <div className="text-2xl font-semibold text-[#0B2419] mb-1 tracking-tight">{value}</div>
    <div className="text-xs text-stone-500">{label}</div>
    {hint && <div className="text-[11px] text-stone-400 mt-1">{hint}</div>}
  </button>
);

const StarsInput = ({ value, onChange, size='md', readonly=false }) => {
  const sz = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" disabled={readonly}
          onClick={() => !readonly && onChange(n)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}>
          <Star className={`${sz} ${n <= value ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-stone-300'}`}/>
        </button>
      ))}
    </div>
  );
};

export default function Profile() {
  const toast = useToast();
  const { user, logout } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const mobileTabsRef = useRef(null);

  const [profileData, setProfileData] = useState({ name: '', phone: '', marketing_email_opt_in: false });
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistError, setWishlistError] = useState('');
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [addresses, setAddresses] = useState([]);
  const [returns, setReturns] = useState([]);
  const [returnEligibility, setReturnEligibility] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [warranties, setWarranties] = useState([]);

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [secQuestion, setSecQuestion] = useState({ question: SECURITY_QUESTIONS[0], answer: '' });
  const [twoFactor, setTwoFactor] = useState({ isEnabled: false, qrCode: '', secret: '', otp: '' });
  const [supportTicket, setSupportTicket] = useState({ subject: '', message: '', order_id: '', product_id: '' });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnOrder, setReturnOrder] = useState(null);
  const [returnSubmitting, setReturnSubmitting] = useState(false);
  const [returnUploadProgress, setReturnUploadProgress] = useState(0);
  const returnPhotoInputRef = useRef(null);
  const [returnEligibilityClock, setReturnEligibilityClock] = useState(Date.now());
  const [addressModal, setAddressModal] = useState({ open:false, editId:null, form:{ label:'Home', full_name:'', phone:'', line1:'', line2:'', city:'', state:'', postal_code:'', country:'India', is_default:false }});
  const [faqOpen, setFaqOpen] = useState(new Set());
  const [reviewEditing, setReviewEditing] = useState(null);
  const [reviewSubmission, setReviewSubmission] = useState(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewUploadProgress, setReviewUploadProgress] = useState(0);
  const [reviewDraft, setReviewDraft] = useState({ rating: 5, title: '', body: '', images: [] });
  const reviewCameraInputRef = useRef(null);
  const reviewGalleryInputRef = useRef(null);

  const [warrantyInput, setWarrantyInput] = useState({ serial: '' });
  const [warrantyCheck, setWarrantyCheck] = useState(null);
  const [couponValidate, setCouponValidate] = useState({ code:'', result:null });
  const [affiliateCopied, setAffiliateCopied] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read && !n.read_at && n.status !== 'read').length;
  const userId = user?.id || user?.userId || (() => { try { const u = JSON.parse(localStorage.getItem('user')||'{}'); return u.id||u.userId; } catch (_) { return null; }})();

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
      const [balRes, histRes] = await Promise.all([walletApi.getBalance(), walletApi.getHistory()]);
      const balance = balRes?.data?.balance ?? balRes?.data?.data?.balance ?? 0;
      const transactions = safeArr(safeExtract(histRes, 'transactions')) || safeArr(safeExtract(histRes, 'history')) || safeArr(safeExtract(histRes, 'data')) || safeArr(histRes?.data);
      setWallet({ balance: Number(balance)||0, transactions });
    } catch (_) {}
  };
  const loadAddresses = async () => {
    try {
      const res = await addressesApi.getAll();
      const a = safeArr(safeExtract(res, 'addresses')) || safeArr(safeExtract(res, 'data')) || safeArr(res?.data);
      setAddresses(a);
    } catch (_) {}
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
      const res = await couponsApi.getPublicActive();
      setCoupons(safeArr(safeExtract(res, 'coupons')) || safeArr(safeExtract(res, 'data')) || safeArr(res?.data));
    } catch (_) {}
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
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) { toast.error('New passwords do not match'); return; }
    if ((passwords.new||'').length < 12) { toast.error('Password must be at least 12 characters'); return; }
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
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;
    try { await ordersApi.cancel(orderId); toast.success('Order cancelled'); await loadOrders(); if (selectedOrder?.id === orderId) setSelectedOrder(null); }
    catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel'); }
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
    setReviewDraft({ rating: 5, title: '', body: '', images: [] });
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
        images: uploadedImages
      });
      toast.success('Review submitted successfully. It will appear after approval.');
      setReviewSubmission(null);
      reviewDraft.images.forEach(image => URL.revokeObjectURL(image.preview));
      setReviewDraft({ rating: 5, title: '', body: '', images: [] });
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
    };
    try {
      if (addressModal.editId) {
        await addressesApi.update(addressModal.editId, payload);
        toast.success('Address updated');
      } else {
        await addressesApi.create(payload);
        toast.success('Address added');
      }
      setAddressModal({ open:false, editId:null, form:{ label:'Home', full_name:'', phone:'', line1:'', line2:'', city:'', state:'', postal_code:'', country:'India', is_default:false }});
      await loadAddresses();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };
  const handleAddressDelete = async (id) => {
    if (!window.confirm('Delete address?')) return;
    try { await addressesApi.delete(id); toast.success('Address deleted'); await loadAddresses(); }
    catch (_) { toast.error('Failed'); }
  };
  const handleSetDefaultAddr = async (id) => {
    try { await addressesApi.setDefault(id); toast.success('Default address updated'); await loadAddresses(); }
    catch (_) { toast.error('Failed to set default address'); }
  };

  const handleLogout = () => { if (window.confirm('Log out of your account?')) { logout(); navigate('/'); } };

  const referralUrl = `${window.location.origin}/register?ref=BHUMI${userId || 'REFER'}`;
  const handleCopyRef = async () => {
    try { await navigator.clipboard.writeText(referralUrl); setAffiliateCopied(true); toast.success('Referral link copied'); setTimeout(() => setAffiliateCopied(false),2000); }
    catch (_) { toast.error('Copy failed'); }
  };
  const shareVia = (via) => {
    const text = `I'm shopping at Bhumivera. Use my link to sign up & earn rewards: ${referralUrl}`;
    try {
      if (via === 'wa') { window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank'); return; }
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
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* === Header Card === */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B2419] via-[#16382a] to-[#2C3E2D] px-6 sm:px-10 py-8 sm:py-10 shadow-xl mb-7">
          <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-[#D4AF37]/10 blur-3xl"/>
          <div className="absolute -bottom-20 -left-16 w-80 h-80 rounded-full bg-[#8B9D83]/20 blur-3xl"/>
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8a6a12] flex items-center justify-center text-[#0B2419] font-bold text-2xl shadow-lg ring-4 ring-white/10">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#FDFBF7] tracking-tight">Hi, {displayName.split(' ')[0]}</h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-semibold">
                    <Award className="w-3.5 h-3.5"/>
                    Bhumivera Member
                  </span>
                </div>
                <p className="text-[#8B9D83] text-sm mt-1.5">{user?.email || 'Welcome to your account dashboard'}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/shop')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur text-white border border-white/15 hover:bg-white/20 transition-all text-sm font-medium">
                <ShoppingBag className="w-4 h-4"/>
                Continue Shopping
              </button>
              <button onClick={handleLogout}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-[#0B2419] hover:bg-[#e4c255] transition-all text-sm font-semibold shadow-md">
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
                  className={`snap-start flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium transition-all border ${
                    active
                      ? 'bg-[#0B2419] text-[#FDFBF7] border-[#0B2419] shadow-md'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
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
            <nav className="sticky top-6 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm space-y-1">
              {TABS.map(t => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                const isNotif = t.id === 'notifications' && unreadCount > 0;
                return (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-[#0B2419] text-[#FDFBF7] shadow-sm'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}>
                    <Icon className="w-4.5 h-4.5"/>
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
            {loading && <div className="mb-4 text-sm text-stone-500 animate-pulse">Loading…</div>}

            {/* ======== OVERVIEW ======== */}
            {activeTab === 'overview' && (
              <div className="space-y-7">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={Package} label="Total Orders" value={orders.length} accent="earth" onClick={() => setActiveTab('orders')}/>
                  <StatCard icon={Heart} label="Wishlist Items" value={wishlist.length} accent="sage" onClick={() => setActiveTab('wishlist')}/>
                  <StatCard icon={Wallet} label="Wallet Balance" value={`₹${Number(wallet.balance||0).toFixed(2)}`} accent="gold" onClick={() => setActiveTab('wallet')}/>
                  <StatCard icon={Bell} label="Unread Notifications" value={unreadCount} accent="sage" onClick={() => setActiveTab('notifications')}/>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Recent orders */}
                  <section className="lg:col-span-2 rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold text-[#0B2419] text-lg">Recent Orders</h2>
                      <button onClick={() => setActiveTab('orders')} className="text-sm text-[#0B2419] hover:text-[#D4AF37] inline-flex items-center gap-1 font-medium">
                        View all <ChevronRight className="w-4 h-4"/>
                      </button>
                    </div>
                    {orders.length === 0 ? (
                      <EmptyState icon={Package} title="No orders yet" subtitle="Explore our catalog and place your first order." actionLabel="Shop Now" onAction={() => navigate('/shop')}/>
                    ) : (
                      <div className="space-y-2.5">
                        {orders.slice(0,5).map(o => (
                          <div key={o.id} className="flex items-center justify-between p-3.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-100 transition-all">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-11 h-11 rounded-xl bg-[#8B9D83]/15 flex items-center justify-center shrink-0"><Package className="w-5 h-5 text-[#3f503c]"/></div>
                              <div className="min-w-0">
                                <div className="font-medium text-sm text-[#0B2419] truncate">Order #{o.id}</div>
                                <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                                  <Calendar className="w-3 h-3"/>
                                  {o.created_at ? new Date(o.created_at).toLocaleDateString() : '—'}
                                  <span className="text-stone-300">•</span>
                                  <span>₹{Number(o.total_amount || o.total || 0).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <StatusPill status={o.status}/>
                              <button onClick={() => setSelectedOrder(o)} className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-[#0B2419]">
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
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2C3E2D] via-[#0B2419] to-[#0B2419] p-5 text-white shadow-lg">
                      <div className="absolute -top-12 -right-10 w-40 h-40 rounded-full bg-[#D4AF37]/20 blur-2xl"/>
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xs uppercase tracking-[0.2em] text-[#8B9D83] font-semibold">Bhumivera Wallet</span>
                        <PiggyBank className="w-5 h-5 text-[#D4AF37]"/>
                      </div>
                      <div className="text-sm text-stone-300 mb-1.5">Available Balance</div>
                      <div className="text-3xl font-bold tracking-tight mb-4">₹{Number(wallet.balance||0).toFixed(2)}</div>
                      <button onClick={() => setActiveTab('wallet')} className="w-full py-2.5 rounded-xl bg-[#0B2419] text-[#FDFBF7] text-sm font-semibold hover:bg-[#2C3E2D] transition-colors flex items-center justify-center gap-2">
                        View Ledger <ChevronRight className="w-4 h-4"/>
                      </button>
                    </div>

                    <div className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-3.5">
                        <h3 className="font-semibold text-[#0B2419]">Active Coupons</h3>
                        <button onClick={() => setActiveTab('coupons')} className="text-xs text-[#0B2419] hover:text-[#D4AF37] font-medium flex items-center gap-1">All <ChevronRight className="w-3.5 h-3.5"/></button>
                      </div>
                      {coupons.length === 0 ? (
                        <div className="text-sm text-stone-500 py-4 text-center">No active coupons right now.</div>
                      ) : (
                        <div className="space-y-2.5">
                          {coupons.slice(0,3).map(c => (
                            <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border border-dashed border-stone-300 hover:border-[#D4AF37] transition-colors">
                              <div>
                                <div className="font-mono font-bold text-sm text-[#0B2419]">{c.code}</div>
                                <div className="text-xs text-stone-500 mt-0.5">
                                  {c.discount_type === 'percent' ? `${c.discount_value}% off` : `₹${c.discount_value} off`}
                                </div>
                              </div>
                              <button onClick={() => handleCouponCopy(c.code)} className="p-2 rounded-lg hover:bg-[#D4AF37]/10 text-stone-500 hover:text-[#8a6a12]">
                                <Copy className="w-4 h-4"/>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                {/* Quick Shortcuts */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id:'addresses', label:'Manage Addresses', icon:MapPin, sub:'Ship faster', cls:'border-[#8B9D83]/40' },
                    { id:'returns',   label:'Track Returns',   icon:RotateCcw, sub:'RMA status', cls:'border-sky-200' },
                    { id:'security',  label:'Secure Account',  icon:Shield,    sub:'2FA & password', cls:'border-rose-200' },
                  ].map(s => {
                    const I = s.icon;
                    return (
                      <button key={s.id} onClick={() => setActiveTab(s.id)}
                        className={`group rounded-2xl p-5 bg-white border ${s.cls} hover:shadow-md transition-all text-left`}>
                        <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                          <I className="w-5 h-5 text-[#0B2419]"/>
                        </div>
                        <div className="font-semibold text-[#0B2419] text-sm mb-0.5">{s.label}</div>
                        <div className="text-xs text-stone-500">{s.sub}</div>
                      </button>
                    );
                  })}
                </section>
              </div>
            )}

            {/* ======== ORDERS ======== */}
            {activeTab === 'orders' && (
              <section className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <h2 className="text-lg font-semibold text-[#0B2419]">Orders ({orders.length})</h2>
                </div>
                {orders.length === 0 ? (
                  <EmptyState icon={Package} title="No orders placed yet" subtitle="Browse the catalog to find products for your next order." actionLabel="Browse Products" onAction={() => navigate('/shop')}/>
                ) : (
                  <div className="overflow-x-auto -mx-5 px-5">
                    <table className="w-full min-w-[700px] text-sm">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-wider text-stone-500 border-b border-stone-100">
                          <th className="py-3 px-3 font-semibold">Order</th>
                          <th className="py-3 px-3 font-semibold">Date</th>
                          <th className="py-3 px-3 font-semibold">Items</th>
                          <th className="py-3 px-3 font-semibold">Total</th>
                          <th className="py-3 px-3 font-semibold">Status</th>
                          <th className="py-3 px-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50">
                        {orders.map(o => {
                          const items = safeArr(o.items || o.order_items || o.Items);
                          const canCancel = CANCELLABLE_STATUSES.includes((o.status||'').toLowerCase());
                          const delivered = DELIVERED_STATUSES.includes((o.status||'').toLowerCase());
                          const canReturn = delivered && canRequestReturn(o.id);
                          return (
                            <tr key={o.id} className="hover:bg-stone-50/60">
                              <td className="py-4 px-3 font-medium text-[#0B2419]">#{o.id}</td>
                              <td className="py-4 px-3 text-stone-600 whitespace-nowrap">{o.created_at? new Date(o.created_at).toLocaleDateString():'—'}</td>
                              <td className="py-4 px-3 text-stone-600">{items.length || o.quantity || 1} items</td>
                              <td className="py-4 px-3 font-semibold text-[#0B2419]">₹{Number(o.total_amount || o.total || 0).toFixed(2)}</td>
                              <td className="py-4 px-3"><StatusPill status={o.status}/></td>
                              <td className="py-4 px-3">
                                <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                  <button onClick={() => setSelectedOrder(o)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700">
                                    <Eye className="w-3.5 h-3.5"/> View
                                  </button>
                                  {canCancel && (
                                    <button onClick={() => handleCancelOrder(o.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100">
                                      <X className="w-3.5 h-3.5"/> Cancel
                                    </button>
                                  )}
                                  {canReturn && (
                                    <button onClick={() => openReturnRequest(o)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-100">
                                      <RotateCcw className="w-3.5 h-3.5"/> Return
                                    </button>
                                  )}
                                  {delivered && !canReturn && <span className="max-w-32 text-right text-[10px] text-stone-500">{returnWindowMessage(o.id)}</span>}
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
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-[#0B2419]">Wishlist ({wishlist.length})</h2>
                </div>
                {wishlistError ? (
                  <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{wishlistError}</p>
                ) : wishlist.length === 0 ? (
                  <div className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
                    <EmptyState icon={Heart} title="Your wishlist is empty" subtitle="Save the products you love for later. Shop and tap the heart icon to add items here." actionLabel="Discover Products" onAction={() => navigate('/shop')}/>
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
                        <div key={w.id || pid} className="group rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                          <div className="aspect-[4/3] bg-stone-50 relative overflow-hidden flex items-center justify-center">
                            {img ? (
                              <img src={getProfileImageUrl(img)} alt={name} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                            ) : (
                              <div className="text-5xl text-stone-200"><Leaf/></div>
                            )}
                            <button onClick={() => handleRemoveWishlist(pid)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur text-rose-500 flex items-center justify-center border border-stone-200 hover:bg-rose-50">
                              <Trash2 className="w-4 h-4"/>
                            </button>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-[#0B2419] line-clamp-2 min-h-[2.5rem]">{name}</h3>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="text-lg font-bold text-[#0B2419]">₹{price.toFixed(2)}</div>
                              <div className="flex gap-2">
                                <button onClick={() => navigate(`/product/${p.slug || pid}`)} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors inline-flex items-center gap-1">
                                  View <ExternalLink className="w-3 h-3"/>
                                </button>
                                <button onClick={() => handleWishlistAddToCart(p)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#0B2419] text-[#FDFBF7] hover:bg-[#1e4031] transition-colors inline-flex items-center gap-1">
                                  <ShoppingCart className="w-3 h-3"/> Buy
                                </button>
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

            {/* ======== WALLET ======== */}
            {activeTab === 'wallet' && (
              <div className="space-y-5">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2C3E2D] via-[#0B2419] to-[#06130d] p-8 text-white shadow-xl">
                  <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-[#D4AF37]/20 blur-3xl"/>
                  <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[#8B9D83]/20 blur-3xl"/>
                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-[0.22em] text-[#8B9D83] font-semibold mb-2">Bhumivera Wallet</div>
                        <div className="text-sm text-stone-300 mb-1.5">Available Balance</div>
                        <div className="text-4xl sm:text-5xl font-bold tracking-tight">₹{Number(wallet.balance||0).toFixed(2)}</div>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
                        <PiggyBank className="w-7 h-7 text-[#D4AF37]"/>
                      </div>
                    </div>
                    <div className="mt-6 text-xs text-stone-400 border-t border-white/10 pt-5">
                      Store credits and loyalty rewards are applied during checkout when available.
                    </div>
                  </div>
                </div>

                <section className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
                  <h3 className="font-semibold text-[#0B2419] mb-4 text-lg">Transaction History</h3>
                  {wallet.transactions.length === 0 ? (
                    <EmptyState icon={Clock} title="No transactions yet" subtitle="Wallet activity will appear here when you receive or use store credit."/>
                  ) : (
                    <div className="overflow-x-auto -mx-5 px-5">
                      <table className="w-full min-w-[600px] text-sm">
                        <thead>
                          <tr className="text-left text-xs uppercase tracking-wider text-stone-500 border-b border-stone-100">
                            <th className="py-3 px-3 font-semibold">Date</th>
                            <th className="py-3 px-3 font-semibold">Type</th>
                            <th className="py-3 px-3 font-semibold">Description</th>
                            <th className="py-3 px-3 font-semibold">Reference</th>
                            <th className="py-3 px-3 font-semibold text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                          {wallet.transactions.map(t => {
                            const type = (t.type||'').toLowerCase();
                            const positive = type.includes('credit') || type.includes('add') || type.includes('refund') || t.amount > 0;
                            return (
                              <tr key={t.id} className="hover:bg-stone-50/60">
                                <td className="py-3.5 px-3 text-stone-600 whitespace-nowrap">{t.created_at? new Date(t.created_at).toLocaleString():'—'}</td>
                                <td className="py-3.5 px-3">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${positive?'bg-emerald-50 text-emerald-700 border border-emerald-100':'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                    {positive ? <ArrowDownLeft className="w-3 h-3"/> : <ArrowUpRight className="w-3 h-3"/>}
                                    {(t.type||'txn').replace(/_/g,' ')}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3 text-stone-700">{t.description||'—'}</td>
                                <td className="py-3.5 px-3 font-mono text-xs text-stone-500">{t.reference_id || t.order_id || '—'}</td>
                                <td className={`py-3.5 px-3 text-right font-semibold ${positive?'text-emerald-700':'text-rose-700'}`}>
                                  {positive?'+':'-'}₹{Math.abs(Number(t.amount||0)).toFixed(2)}
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
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-[#0B2419]">Saved Addresses ({addresses.length})</h2>
                  <button onClick={() => setAddressModal({ open:true, editId:null, form:{ label:'Home', full_name: displayName, phone: profileData.phone||'', line1:'', line2:'', city:'', state:'', postal_code:'', country:'India', is_default: addresses.length===0 }})}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B2419] text-[#FDFBF7] text-sm font-medium hover:bg-[#1e4031] transition-colors shadow-sm">
                    <Plus className="w-4 h-4"/> Add Address
                  </button>
                </div>
                {addresses.length === 0 ? (
                  <div className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
                    <EmptyState icon={MapPin} title="No saved addresses" subtitle="Save a delivery address to breeze through checkout. You can manage multiple addresses (Home, Work, etc.)" actionLabel="Add First Address" onAction={() => setAddressModal({ open:true, editId:null, form:{ label:'Home', full_name: displayName, phone: profileData.phone||'', line1:'', line2:'', city:'', state:'', postal_code:'', country:'India', is_default:true }})}/>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(a => (
                      <div key={a.id} className={`rounded-2xl bg-white border p-5 shadow-sm hover:shadow-md transition-all ${a.is_default || a.default ? 'border-[#D4AF37]/60' : 'border-stone-200'}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${a.is_default || a.default ? 'bg-[#D4AF37]/15 text-[#8a6a12]' : 'bg-stone-100 text-stone-500'}`}>
                              <LabelIcon label={a.label}/>
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-[#0B2419]">{a.label || 'Home'}</div>
                              <div className="text-xs text-stone-500">{a.full_name || a.name || displayName}</div>
                            </div>
                          </div>
                          {(a.is_default || a.default) && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D4AF37]/15 text-[#8a6a12] border border-[#D4AF37]/40 text-[10px] font-bold uppercase tracking-wide">Default</span>
                          )}
                        </div>
                        <div className="text-sm text-stone-700 leading-relaxed space-y-0.5">
                          <div>{a.line1 || a.street_address || a.address_line1 || a.address}</div>
                          {(a.line2 || a.address_line2) && <div className="text-stone-500">{a.line2 || a.address_line2}</div>}
                          <div>{a.city}, {a.state} {a.postal_code || a.zip}</div>
                          <div className="text-stone-500">{a.country || 'India'}</div>
                          <div className="pt-1.5 flex items-center gap-1.5 text-stone-600"><Phone className="w-3.5 h-3.5"/> {a.phone || a.phone_number}</div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 flex-wrap">
                          {!(a.is_default || a.default) && (
                            <button onClick={() => handleSetDefaultAddr(a.id)} className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:border-[#D4AF37] hover:text-[#8a6a12] font-medium">Set Default</button>
                          )}
                          <button onClick={() => setAddressModal({ open:true, editId:a.id, form:{ label:a.label||'Home', full_name:a.full_name||a.name||'', phone:a.phone||a.phone_number||'', line1:a.line1||a.street_address||a.address_line1||a.address||'', line2:a.line2||a.address_line2||'', city:a.city||'', state:a.state||'', postal_code:a.postal_code||a.zip||'', country:a.country||'India', is_default: !!(a.is_default||a.default) }})} className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 inline-flex items-center gap-1 font-medium">
                            <Edit2 className="w-3 h-3"/> Edit
                          </button>
                          <button onClick={() => handleAddressDelete(a.id)} className="text-xs px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 inline-flex items-center gap-1 font-medium">
                            <Trash2 className="w-3 h-3"/> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ======== RETURNS ======== */}
            {activeTab === 'returns' && (
              <div className="space-y-5">
                <section className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div>
                      <h2 className="text-lg font-semibold text-[#0B2419]">Returns & RMAs</h2>
                      <p className="text-xs text-stone-500 mt-1">Return requests open 30 minutes after delivery and remain available for the admin-configured {returnEligibility[0]?.return_window_days || 7}-day window.</p>
                    </div>
                    {eligibleReturnOrders.length > 0 && (
                      <button onClick={() => openReturnRequest(eligibleReturnOrders[0])} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B2419] text-[#FDFBF7] text-sm font-medium hover:bg-[#1e4031] shadow-sm">
                        <RotateCcw className="w-4 h-4"/> New Return Request
                      </button>
                    )}
                  </div>
                  {orders.some(order => {
                    const eligibility = eligibilityForOrder(order.id);
                    return DELIVERED_STATUSES.includes(String(order.status || '').toLowerCase()) &&
                      eligibility && !Number(eligibility.has_return_request) &&
                      new Date(eligibility.return_available_at || '').getTime() > returnEligibilityClock;
                  }) && <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">A return option appears 30 minutes after verified delivery. Check the Orders tab for each order's opening time. Your delivery window follows the current store policy.</p>}
                  {returns.length === 0 ? (
                    <EmptyState icon={RotateCcw} title="No returns filed yet" subtitle="When eligible, submit an item-level request with optional photos. Our team reviews it before it can move into return progress."/>
                  ) : (
                    <div className="overflow-x-auto -mx-5 px-5">
                      <table className="w-full min-w-[700px] text-sm">
                        <thead>
                          <tr className="text-left text-xs uppercase tracking-wider text-stone-500 border-b border-stone-100">
                            <th className="py-3 px-3 font-semibold">RMA #</th>
                            <th className="py-3 px-3 font-semibold">Order</th>
                            <th className="py-3 px-3 font-semibold">Reason</th>
                            <th className="py-3 px-3 font-semibold">Refund</th>
                            <th className="py-3 px-3 font-semibold">Status</th>
                            <th className="py-3 px-3 font-semibold">Filed</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                          {returns.map(r => (
                            <tr key={r.id} className="hover:bg-stone-50/60">
                              <td className="py-4 px-3 font-mono text-[#0B2419] font-semibold">#{r.rma_number || r.id}</td>
                              <td className="py-4 px-3 text-stone-700">#{r.order_id || '—'}</td>
                              <td className="py-4 px-3 text-stone-600 max-w-[220px] truncate">{r.reason || '—'}</td>
                              <td className="py-4 px-3 text-stone-700">{r.refund_method === 'original' || r.refund_method === 'source' ? 'Original Payment' : 'Wallet Credit'}</td>
                              <td className="py-4 px-3"><StatusPill status={r.status}/></td>
                              <td className="py-4 px-3 text-stone-500 whitespace-nowrap">{r.created_at? new Date(r.created_at).toLocaleDateString():'—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* ======== NOTIFICATIONS ======== */}
            {activeTab === 'notifications' && (
              <section className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div>
                    <h2 className="text-lg font-semibold text-[#0B2419]">Notifications</h2>
                    <p className="text-xs text-stone-500 mt-1">{unreadCount} unread of {notifications.length} total</p>
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllNotifRead} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 text-sm font-medium text-stone-700 hover:border-[#8B9D83] hover:text-[#3f503c]">
                      <CheckCircle2 className="w-4 h-4"/> Mark all as read
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <EmptyState icon={Bell} title="No notifications yet" subtitle="We'll notify you about order updates, support replies, and offers here."/>
                ) : (
                  <div className="space-y-2">
                    {notifications.map(n => {
                      const unread = !(n.is_read || n.read_at || n.status === 'read');
                      return (
                        <div key={n.id} onClick={() => handleMarkNotifRead(n.id)}
                          className={`group cursor-pointer rounded-2xl border p-4 transition-all hover:shadow-sm ${unread ? 'bg-[#FFF8E7]/60 border-[#D4AF37]/40' : 'bg-white border-stone-100 hover:border-stone-200'}`}>
                          <div className="flex items-start gap-3.5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${unread ? 'bg-[#D4AF37]/15 text-[#8a6a12]' : 'bg-stone-100 text-stone-500'}`}>
                              <Bell className="w-5 h-5"/>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <div className="font-medium text-sm text-[#0B2419] leading-snug">{n.title || n.subject || 'Notification'}</div>
                                {unread && <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 mt-1.5"/>}
                              </div>
                              <div className="mt-1 text-sm text-stone-600 leading-relaxed">{n.message || n.body || n.content}</div>
                              <div className="mt-2 text-xs text-stone-400 inline-flex items-center gap-1.5">
                                <Clock className="w-3 h-3"/>
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
              <div className="space-y-5">
                <section className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <div className="flex-1 flex items-center rounded-xl border border-stone-200 bg-stone-50 px-4 focus-within:border-[#D4AF37] focus-within:bg-white transition-colors">
                      <Ticket className="w-4 h-4 text-stone-400 mr-2.5"/>
                      <input value={couponValidate.code} onChange={e => setCouponValidate(c => ({ ...c, code: e.target.value, result: null }))}
                        onKeyDown={e => e.key === 'Enter' && handleCouponValidate()}
                        placeholder="Enter coupon code to validate"
                        className="flex-1 bg-transparent py-3 text-sm focus:outline-none uppercase placeholder:normal-case"/>
                    </div>
                    <button onClick={handleCouponValidate} className="px-6 py-3 rounded-xl bg-[#0B2419] text-[#FDFBF7] text-sm font-medium hover:bg-[#1e4031] transition-colors">
                      Validate
                    </button>
                  </div>
                  {couponValidate.result && (
                    <div className={`mt-4 p-4 rounded-xl border text-sm ${couponValidate.result.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                      {couponValidate.result.ok ? (
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5"/>
                          <div>
                            <div className="font-semibold">Coupon valid!</div>
                            <div className="mt-1 text-emerald-700">
                              {couponValidate.result.data?.discount_type === 'percent' || couponValidate.result.data?.type === 'percent'
                                ? `${couponValidate.result.data?.discount_value || couponValidate.result.data?.value}% off`
                                : `₹${couponValidate.result.data?.discount_value || couponValidate.result.data?.value || 0} off`}
                              {couponValidate.result.data?.min_order_amount && <span> • Min order ₹{couponValidate.result.data.min_order_amount}</span>}
                              {couponValidate.result.data?.description && <div className="mt-1 text-xs">{couponValidate.result.data.description}</div>}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2.5">
                          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5"/>
                          <div>{couponValidate.result.msg}</div>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                <section className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-[#0B2419]">Active Coupons ({coupons.length})</h2>
                  </div>
                  {coupons.length === 0 ? (
                    <EmptyState icon={Gift} title="No active coupons right now" subtitle="Check back soon for exclusive Bhumivera member-only coupons and seasonal sales."/>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {coupons.map(c => {
                        const valid = c.expires_at ? new Date(c.expires_at) > new Date() : true;
                        return (
                          <div key={c.id} className="relative rounded-2xl border-2 border-dashed border-stone-300 hover:border-[#D4AF37] bg-gradient-to-br from-white to-amber-50/40 overflow-hidden p-5 transition-all group">
                            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FDFBF7] border-r-2 border-dashed border-stone-300 group-hover:border-[#D4AF37]"/>
                            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FDFBF7] border-l-2 border-dashed border-stone-300 group-hover:border-[#D4AF37]"/>
                            <div className="flex items-start justify-between gap-4 pl-2">
                              <div className="min-w-0">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D4AF37]/15 text-[#8a6a12] text-[10px] font-bold uppercase tracking-wider mb-2">
                                  <Ticket className="w-3 h-3"/> {valid ? 'Live' : 'Expired'}
                                </div>
                                <div className="font-mono text-2xl font-extrabold tracking-tight text-[#0B2419] mb-2">{c.code}</div>
                                <div className="text-2xl sm:text-3xl font-bold text-[#8a6a12] mb-1 leading-none">
                                  {c.discount_type === 'percent' ? `${c.discount_value}%` : `₹${c.discount_value}`}
                                  <span className="text-sm font-semibold text-stone-500 ml-1.5">OFF</span>
                                </div>
                                <div className="text-xs text-stone-500 mt-2">
                                  {c.description || 'No minimum spend required'}
                                  {c.expires_at && <div className="mt-1 inline-flex items-center gap-1"><Clock className="w-3 h-3"/> Expires {new Date(c.expires_at).toLocaleDateString()}</div>}
                                </div>
                              </div>
                              <button onClick={() => handleCouponCopy(c.code)} className="shrink-0 w-11 h-11 rounded-xl bg-white border border-stone-200 hover:bg-[#0B2419] hover:text-[#FDFBF7] hover:border-[#0B2419] transition-colors flex items-center justify-center">
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
                <section className="rounded-2xl bg-white border border-stone-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#0B2419]/8 text-[#0B2419] flex items-center justify-center"><User className="w-5 h-5"/></div>
                    <div><h3 className="font-semibold text-[#0B2419] text-lg">Profile Information</h3><p className="text-xs text-stone-500">Manage how your name appears on orders & emails</p></div>
                  </div>
                  <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Full Name</label>
                      <input value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#0B2419] focus:ring-4 focus:ring-[#0B2419]/5 transition-all text-sm"/>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Phone Number</label>
                      <input value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#0B2419] focus:ring-4 focus:ring-[#0B2419]/5 transition-all text-sm"/>
                    </div>
                    <label className="sm:col-span-2 flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
                      <input
                        type="checkbox"
                        checked={profileData.marketing_email_opt_in}
                        onChange={e => setProfileData({ ...profileData, marketing_email_opt_in: e.target.checked })}
                        className="mt-0.5 accent-[#0B2419]"
                      />
                      <span>
                        Email me promotional offers and product updates.
                        <span className="block mt-1 text-xs text-stone-500">Optional. You can change this preference any time. Order and account emails are not affected.</span>
                      </span>
                    </label>
                    <div className="sm:col-span-2">
                      <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B2419] text-[#FDFBF7] text-sm font-medium hover:bg-[#1e4031] transition-colors">
                        <CheckCircle2 className="w-4 h-4"/> Save Changes
                      </button>
                    </div>
                  </form>
                </section>

                <section className="rounded-2xl bg-white border border-stone-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><Key className="w-5 h-5"/></div>
                    <div><h3 className="font-semibold text-[#0B2419] text-lg">Change Password</h3><p className="text-xs text-stone-500">Use a strong password that's at least 6 characters</p></div>
                  </div>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    {[
                      { k:'current', label:'Current Password' },
                      { k:'new',     label:'New Password' },
                      { k:'confirm', label:'Confirm New Password' },
                    ].map(f => (
                      <PwField key={f.k} k={f.k} label={f.label} passwords={passwords} setPasswords={setPasswords}/>
                    ))}
                    <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B2419] text-[#FDFBF7] text-sm font-medium hover:bg-[#1e4031] transition-colors">
                      Update Password
                    </button>
                  </form>
                </section>

                <section className="rounded-2xl bg-white border border-stone-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${twoFactor.isEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      <Smartphone className="w-5 h-5"/>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#0B2419] text-lg">Two-Factor Authentication (2FA)</h3>
                        <StatusPill status={twoFactor.isEnabled?'active':'pending'}/>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">Add an extra layer of security with Google Authenticator / Authy / 1Password.</p>
                    </div>
                  </div>
                  {twoFactor.isEnabled ? (
                    <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"/>
                        <div className="text-sm text-emerald-800">
                          <div className="font-semibold">2FA is currently enabled</div>
                          <div className="text-emerald-700 mt-0.5">Every login will require a 6-digit code from your authenticator app.</div>
                        </div>
                      </div>
                      <button onClick={handleDisable2FA} className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 text-sm font-medium">
                        <X className="w-4 h-4"/> Disable 2FA
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {!twoFactor.qrCode ? (
                        <button onClick={handleGenerate2FA} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0B2419] to-[#2C3E2D] text-[#FDFBF7] text-sm font-medium hover:shadow-md transition-all">
                          <QrCode className="w-4 h-4"/> Generate 2FA Setup QR
                        </button>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                          <div className="md:col-span-2 rounded-2xl bg-stone-50 border border-stone-200 p-5 flex items-center justify-center">
                            {twoFactor.qrCode ? (
                              <img src={twoFactor.qrCode} alt="2FA QR" className="w-full max-w-[220px] aspect-square rounded-xl bg-white p-2 shadow-md"/>
                            ) : <QrCode className="w-24 h-24 text-stone-300"/>}
                          </div>
                          <div className="md:col-span-3 space-y-4">
                            <div>
                              <div className="text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">Secret Key</div>
                              <div className="flex items-center rounded-xl bg-stone-50 border border-stone-200 px-4 py-3">
                                <code className="flex-1 text-sm font-mono text-[#0B2419] break-all">{twoFactor.secret}</code>
                                <button onClick={() => { navigator.clipboard.writeText(twoFactor.secret); toast.success('Secret copied'); }} className="p-2 rounded-lg hover:bg-stone-200 text-stone-500">
                                  <Copy className="w-4 h-4"/>
                                </button>
                              </div>
                              <div className="mt-2 text-xs text-stone-500 leading-relaxed">Scan the QR with your authenticator app, or paste the secret manually. Then enter the 6-digit code below to confirm and enable.</div>
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-stone-600 mb-1.5 block">6-digit code from app</label>
                              <input inputMode="numeric" value={twoFactor.otp} onChange={e => setTwoFactor(p => ({ ...p, otp: e.target.value.replace(/\D/g,'').slice(0,6) }))}
                                placeholder="000000"
                                className="w-full md:w-56 px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#0B2419] focus:ring-4 focus:ring-[#0B2419]/5 text-2xl font-mono tracking-[0.3em] text-center"/>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                              <button onClick={handleEnable2FA} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D4AF37] text-[#0B2419] hover:bg-[#e4c255] transition-colors text-sm font-semibold">
                                <CheckCircle2 className="w-4 h-4"/> Verify & Enable 2FA
                              </button>
                              <button onClick={() => setTwoFactor(p => ({ ...p, qrCode:'', secret:'', otp:'' }))} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm font-medium">
                                Cancel Setup
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                <section className="rounded-2xl bg-white border border-stone-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center"><HelpCircle className="w-5 h-5"/></div>
                    <div><h3 className="font-semibold text-[#0B2419] text-lg">Security Question</h3><p className="text-xs text-stone-500">Used to recover your account if you forget your password</p></div>
                  </div>
                  <form onSubmit={handleUpdateSecurityQuestion} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Choose a question</label>
                      <select value={secQuestion.question} onChange={e => setSecQuestion(s => ({ ...s, question: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#0B2419] focus:ring-4 focus:ring-[#0B2419]/5 bg-white text-sm">
                        {SECURITY_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Your answer</label>
                      <input value={secQuestion.answer} onChange={e => setSecQuestion(s => ({ ...s, answer: e.target.value }))}
                        placeholder="Type an answer you'll remember exactly"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#0B2419] focus:ring-4 focus:ring-[#0B2419]/5 text-sm"/>
                    </div>
                    <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B2419] text-[#FDFBF7] text-sm font-medium hover:bg-[#1e4031] transition-colors">
                      Save Security Question
                    </button>
                  </form>
                </section>
              </div>
            )}

            {/* ======== REVIEWS ======== */}
            {activeTab === 'reviews' && (
              <section className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-semibold text-[#0B2419]">My Reviews</h2>
                    <p className="text-xs text-stone-500 mt-1">{myReviews.length} reviews written</p>
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
                        <div key={r.id} className="rounded-2xl border border-stone-200 p-5 hover:shadow-sm transition-all">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="min-w-0">
                              <div className="font-semibold text-[#0B2419] text-sm">{r.product_name || `Product #${r.product_id}`}</div>
                              <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-2">
                                <Calendar className="w-3 h-3"/> {r.created_at? new Date(r.created_at).toLocaleDateString():'—'}
                                {r.approved || r.status==='approved' ? <><span className="text-stone-300">•</span><span className="text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Approved</span></> : null}
                              </div>
                            </div>
                            {!editing && (
                              <div className="flex items-center gap-1 shrink-0">
                                <button onClick={() => { setMyReviews(rs => rs.map(x => x.id===r.id ? { ...x, _draft:{rating:x.rating||5, title:x.title||'', comment:x.comment||x.review||''}} : x)); setReviewEditing(r.id); }} className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-[#0B2419]"><Edit2 className="w-4 h-4"/></button>
                                <button onClick={() => handleReviewDelete(r.id)} className="p-2 rounded-lg hover:bg-rose-50 text-stone-500 hover:text-rose-600"><Trash2 className="w-4 h-4"/></button>
                              </div>
                            )}
                          </div>
                          {editing ? (
                            <div className="space-y-3 pt-2 border-t border-stone-100">
                              <div className="flex items-center gap-3 pt-3">
                                <span className="text-xs font-semibold text-stone-600">Rating</span>
                                <StarsInput value={draft.rating} onChange={v => setMyReviews(rs => rs.map(x => x.id===r.id ? { ...x, _draft:{ ...x._draft, rating:v }} : x))}/>
                              </div>
                              <input placeholder="Title (e.g. Absolutely loved it!)" value={draft.title}
                                onChange={e => setMyReviews(rs => rs.map(x => x.id===r.id ? { ...x, _draft:{ ...x._draft, title: e.target.value }} : x))}
                                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#0B2419] focus:ring-4 focus:ring-[#0B2419]/5 text-sm"/>
                              <textarea rows={3} placeholder="Share details about build quality, fit, finish and your experience" value={draft.comment}
                                onChange={e => setMyReviews(rs => rs.map(x => x.id===r.id ? { ...x, _draft:{ ...x._draft, comment: e.target.value }} : x))}
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#0B2419] focus:ring-4 focus:ring-[#0B2419]/5 text-sm resize-none"/>
                              <div className="flex gap-2">
                                <button onClick={() => handleReviewSave(r.id, { rating: draft.rating, title: draft.title, comment: draft.comment })} className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#0B2419] text-[#FDFBF7] text-sm font-medium">
                                  <CheckCircle2 className="w-4 h-4"/> Save Changes
                                </button>
                                <button onClick={() => setReviewEditing(null)} className="px-5 py-2 rounded-lg border border-stone-200 text-stone-700 text-sm hover:bg-stone-50">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="mb-2"><StarsInput value={r.rating||5} readonly size="sm"/></div>
                              {r.title && <div className="font-semibold text-[#0B2419] mb-1 text-sm">{r.title}</div>}
                              <div className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">{r.comment || r.review || '—'}</div>
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
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B2419] via-[#16382a] to-[#2C3E2D] p-7 text-white shadow-xl">
                  <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-[#D4AF37]/15 blur-3xl"/>
                  <div className="absolute -bottom-16 -left-10 w-60 h-60 rounded-full bg-[#8B9D83]/25 blur-3xl"/>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center"><Award className="w-6 h-6 text-[#D4AF37]"/></div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-[#8B9D83] font-bold">Bhumivera Promise</div>
                        <h3 className="text-2xl font-bold">10-Year Warranty on Every Product</h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                      {[
                        { i: Shield,      t:'Authenticity Verified', s:'Every serial is checked against manufacturer records.' },
                        { i: RotateCcw,   t:'Hassle-Free Claims',   s:'Fast replacement or wallet credit on valid claims.' },
                        { i: PackageCheck,t:'Full Coverage',         s:'10 years on defects in materials & workmanship.' },
                      ].map(b => {
                        const I = b.i;
                        return (
                          <div key={b.t} className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-4 hover:bg-white/10 transition-colors">
                            <I className="w-5 h-5 text-[#D4AF37] mb-2"/>
                            <div className="font-semibold text-sm mb-1">{b.t}</div>
                            <div className="text-xs text-stone-300 leading-relaxed">{b.s}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl bg-white border border-stone-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/15 text-[#8a6a12] flex items-center justify-center"><QrCode className="w-5 h-5"/></div>
                    <div><h3 className="font-semibold text-[#0B2419] text-lg">Validate & Register Warranty</h3><p className="text-xs text-stone-500">Enter the 16-digit serial from your product package or certificate.</p></div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 flex items-center rounded-xl border border-stone-200 bg-stone-50 px-4 focus-within:border-[#D4AF37] focus-within:bg-white transition-colors">
                      <Hash className="w-4 h-4 text-stone-400 mr-2.5"/>
                      <input value={warrantyInput.serial} onChange={e => setWarrantyInput({ serial: e.target.value.toUpperCase() })}
                        placeholder="BHVM-XXXX-XXXX-XXXX"
                        className="flex-1 bg-transparent py-3 text-sm font-mono focus:outline-none uppercase"/>
                    </div>
                    <button onClick={handleWarrantyValidate} className="px-6 py-3 rounded-xl bg-[#0B2419] text-[#FDFBF7] text-sm font-medium hover:bg-[#1e4031] transition-colors inline-flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4"/> Validate
                    </button>
                  </div>
                  {warrantyCheck && (
                    <div className={`mt-5 p-5 rounded-2xl border ${warrantyCheck.ok ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'}`}>
                      {warrantyCheck.ok ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center shrink-0 shadow-sm"><PackageCheck className="w-7 h-7 text-emerald-600"/></div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-lg text-emerald-800 inline-flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> Serial valid & authentic</div>
                            <div className="mt-1 text-sm text-emerald-700 leading-relaxed">
                              Product: <span className="font-semibold">{warrantyCheck.data?.product_name || warrantyCheck.data?.product?.name || `Product #${warrantyCheck.data?.productId || warrantyCheck.data?.product_id || '—'}`}</span>
                              {warrantyCheck.data?.is_registered || warrantyCheck.data?.registered ? ' (already registered)' : ' (eligible for warranty registration)'}
                            </div>
                          </div>
                          {!(warrantyCheck.data?.is_registered || warrantyCheck.data?.registered) && (
                            <button onClick={handleWarrantyRegister} className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-[#0B2419] font-semibold hover:bg-[#e4c255] transition-colors inline-flex items-center gap-2 shrink-0 shadow-sm">
                              <Award className="w-4 h-4"/> Register to My Account
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5"/>
                          <div className="text-sm text-rose-800">{warrantyCheck.msg}</div>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                <section className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold text-[#0B2419] text-lg">My Warranties ({warranties.length})</h3>
                  </div>
                  {warranties.length === 0 ? (
                    <EmptyState icon={Award} title="No warranties registered yet" subtitle="Once you validate a serial and register it, it will appear here with its 10-year coverage details."/>
                  ) : (
                    <div className="overflow-x-auto -mx-5 px-5">
                      <table className="w-full min-w-[650px] text-sm">
                        <thead>
                          <tr className="text-left text-xs uppercase tracking-wider text-stone-500 border-b border-stone-100">
                            <th className="py-3 px-3 font-semibold">Serial</th>
                            <th className="py-3 px-3 font-semibold">Product</th>
                            <th className="py-3 px-3 font-semibold">Warranty Period</th>
                            <th className="py-3 px-3 font-semibold">Registered</th>
                            <th className="py-3 px-3 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                          {warranties.map(w => (
                            <tr key={w.id} className="hover:bg-stone-50/60">
                              <td className="py-4 px-3 font-mono font-semibold text-[#0B2419]">{w.serial_number || w.serial || '—'}</td>
                              <td className="py-4 px-3 text-stone-700">{w.product_name || `#${w.product_id}`}</td>
                              <td className="py-4 px-3 text-stone-600">
                                <div className="font-medium">{w.warranty_years ? `${w.warranty_years} years` : '10 years'}</div>
                                <div className="text-xs text-stone-400">
                                  {w.start_date && new Date(w.start_date).toLocaleDateString()}
                                  {w.end_date && ` → ${new Date(w.end_date).toLocaleDateString()}`}
                                </div>
                              </td>
                              <td className="py-4 px-3 text-stone-500 whitespace-nowrap">{w.created_at? new Date(w.created_at).toLocaleDateString():'—'}</td>
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
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8B9D83]/30 via-[#D4AF37]/20 to-[#0B2419]/10 border border-[#8B9D83]/30 p-8">
                  <div className="absolute -top-20 right-0 w-72 h-72 rounded-full bg-[#D4AF37]/20 blur-3xl"/>
                  <div className="relative">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur border border-white text-[#3f503c] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                      <Zap className="w-3.5 h-3.5"/> Refer & Earn
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2419] tracking-tight leading-tight mb-2">Share Bhumivera. Grow together.</h2>
                    <p className="text-stone-600 max-w-2xl leading-relaxed mb-6">Every friend that signs up and shops through your link unlocks commissions and perks for you. Rewards are credited directly to your wallet.</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <StatCard icon={Users}      label="Total Clicks"      value="—" accent="sage"/>
                      <StatCard icon={User}       label="Referrals"        value="—" accent="earth"/>
                      <StatCard icon={Coins}      label="Commission Rate"  value="10%" accent="gold"/>
                      <StatCard icon={Wallet}     label="Total Earnings"   value="₹0.00" accent="earth"/>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl bg-white border border-stone-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#0B2419]/8 text-[#0B2419] flex items-center justify-center"><Share2 className="w-5 h-5"/></div>
                    <div><h3 className="font-semibold text-[#0B2419] text-lg">Your Referral Link</h3><p className="text-xs text-stone-500">Share this anywhere. No limits.</p></div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 flex items-center rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 overflow-hidden">
                      <ExternalLink className="w-4 h-4 text-stone-400 mr-2.5 shrink-0"/>
                      <code className="flex-1 text-sm text-[#0B2419] font-mono truncate">{referralUrl}</code>
                    </div>
                    <button onClick={handleCopyRef} className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 ${affiliateCopied ? 'bg-emerald-500 text-white' : 'bg-[#0B2419] text-[#FDFBF7] hover:bg-[#1e4031]'}`}>
                      {affiliateCopied ? <><CheckCircle2 className="w-4 h-4"/> Copied!</> : <><Copy className="w-4 h-4"/> Copy Link</>}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                    <button onClick={() => shareVia('wa')} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors text-sm font-medium text-stone-700">
                      <MessageSquare className="w-4 h-4 text-emerald-500"/> WhatsApp
                    </button>
                    <button onClick={() => shareVia('email')} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-stone-200 hover:border-rose-300 hover:bg-rose-50/50 transition-colors text-sm font-medium text-stone-700">
                      <Mail className="w-4 h-4 text-rose-500"/> Email
                    </button>
                    <button onClick={() => shareVia('x')} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-stone-200 hover:border-black hover:bg-black hover:text-white transition-colors text-sm font-medium text-stone-700">
                      <Zap className="w-4 h-4"/> X / Twitter
                    </button>
                    <button onClick={() => shareVia('native')} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#e4c255] transition-colors text-sm font-semibold text-[#0B2419] shadow-sm">
                      <Send className="w-4 h-4"/> More
                    </button>
                  </div>
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-6" onClick={() => setSelectedOrder(null)}>
          <div onClick={e => e.stopPropagation()} className="w-full sm:max-w-3xl max-h-[92vh] bg-[#FDFBF7] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="relative bg-gradient-to-br from-[#0B2419] to-[#2C3E2D] text-white px-6 sm:px-8 py-6">
              <div className="absolute -top-20 -right-10 w-56 h-56 rounded-full bg-[#D4AF37]/15 blur-3xl"/>
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[#8B9D83] font-semibold mb-1">Order</div>
                  <div className="text-3xl font-bold tracking-tight mb-1">#{selectedOrder.id}</div>
                  <div className="text-sm text-stone-300 inline-flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5"/>
                    {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : ''}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <StatusPill status={selectedOrder.status}/>
                  <button onClick={() => setSelectedOrder(null)} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center">
                    <X className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            </div>
            <div className="px-6 sm:px-8 py-4 border-b border-stone-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#8B9D83]"/>
                  <span className="font-semibold text-sm text-[#0B2419]">Tracking #</span>
                </div>
                <code className="font-mono text-sm text-stone-600 bg-stone-50 border border-stone-200 px-3 py-1 rounded-lg">
                  {selectedOrder.tracking_number || selectedOrder.tracking_no || `BHVM${selectedOrder.id.toString().padStart(8,'0')}`}
                </code>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-[#0B2419] uppercase tracking-wider mb-4 text-stone-500">Order Timeline</h4>
                <ol className="relative border-l-2 border-stone-200 ml-2.5 space-y-5">
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
                        <span className={`absolute -left-[11px] w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-[#FDFBF7] ${done ? 'bg-[#0B2419]' : 'bg-stone-200'}`}>
                          {done && <CheckCircle2 className="w-3 h-3 text-[#D4AF37]"/>}
                        </span>
                        <div className={`text-sm ${active ? 'font-bold text-[#0B2419]' : done ? 'text-stone-700 font-medium' : 'text-stone-400'}`}>{s.l}</div>
                        <div className="text-xs text-stone-500 mt-0.5 leading-relaxed">{s.d}</div>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0B2419] uppercase tracking-wider mb-3 text-stone-500">Items ({ (selectedOrder.items?.length || selectedOrder.order_items?.length || 1) })</h4>
                <div className="rounded-2xl border border-stone-200 divide-y divide-stone-100 bg-white overflow-hidden">
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
                        <div className="w-14 h-14 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-2xl text-stone-300 shrink-0 overflow-hidden">
                          {itemImage
                            ? <img src={itemImage} alt={it.name || it.product_name || 'Ordered product'} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="w-full h-full object-contain p-1"/>
                            : <Package/>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-[#0B2419] truncate">{it.product_name || it.name || `Product #${it.product_id}`}</div>
                          <div className="text-xs text-stone-500 mt-0.5">Qty: {it.quantity || 1}</div>
                          {DELIVERED_STATUSES.includes((selectedOrder.status || '').toLowerCase()) && (
                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                            {alreadyReviewed ? (
                              <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-700"><CheckCircle2 className="w-3 h-3"/> Review submitted</span>
                            ) : (
                              <button
                                onClick={() => {
                                  setReviewSubmission({
                                    orderId: Number(selectedOrder.id),
                                    productId,
                                    productName: it.product_name || it.name || `Product #${productId}`,
                                    image: itemImage
                                  });
                                  setReviewDraft({ rating: 5, title: '', body: '', images: [] });
                                }}
                                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#8a6a12] hover:text-[#0B2419]"
                              >
                                <Star className="w-3 h-3"/> Write a review
                              </button>
                            )}
                            <button
                              onClick={() => {
                                const productName = it.product_name || it.name || `Product #${productId}`;
                                setSupportTicket({
                                  subject: `Help with ${productName} · Order #${selectedOrder.id}`.slice(0, 200),
                                  message: `I need help with ${productName} from order #${selectedOrder.id}.\n\n`,
                                  order_id: String(selectedOrder.id),
                                  product_id: Number.isSafeInteger(productId) && productId > 0 ? String(productId) : ''
                                });
                                setSelectedOrder(null);
                                setActiveTab('support');
                              }}
                              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#0B5B78] hover:text-[#0B2419]"
                            >
                              <LifeBuoy className="w-3 h-3"/> Get help with this item
                            </button>
                            </div>
                          )}
                        </div>
                        <div className="font-semibold text-sm text-[#0B2419]">₹{Number(it.subtotal || it.price * (it.quantity||1) || 0).toFixed(2)}</div>
                      </div>
                    )})
                  ) : (
                    <div className="p-4 text-sm text-stone-600">1 item in this order</div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="rounded-2xl border border-stone-200 p-5 bg-white">
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-3 text-stone-500">Total</h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-stone-600">Subtotal</span><span className="text-[#0B2419] font-medium">₹{Number(selectedOrder.subtotal || selectedOrder.total_amount || 0).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-stone-600">Shipping</span><span className="text-[#0B2419] font-medium">₹{Number(selectedOrder.shipping_fee || selectedOrder.shipping || 0).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-stone-600">Tax</span><span className="text-[#0B2419] font-medium">₹{Number(selectedOrder.tax || 0).toFixed(2)}</span></div>
                    {(selectedOrder.discount || 0) > 0 && <div className="flex justify-between"><span className="text-stone-600">Discount</span><span className="text-emerald-700 font-medium">- ₹{Number(selectedOrder.discount||0).toFixed(2)}</span></div>}
                    <div className="pt-2.5 mt-2 border-t border-stone-100 flex justify-between items-baseline">
                      <span className="text-stone-700 font-semibold">Total Paid</span>
                      <span className="text-xl font-bold text-[#0B2419] tracking-tight">₹{Number(selectedOrder.total_amount || selectedOrder.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-stone-200 p-5 bg-white">
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-3 text-stone-500">Shipping Address</h4>
                  <div className="text-sm text-stone-700 leading-relaxed">
                    <div className="font-semibold text-[#0B2419] mb-1">{selectedOrder.shipping_name || selectedOrder.customer_name || displayName}</div>
                    <div>{selectedOrder.shipping_line1 || selectedOrder.shipping_address || selectedOrder.billing_address || 'Address not available'}</div>
                    {(selectedOrder.shipping_city || selectedOrder.shipping_state) && (
                      <div className="mt-0.5">
                        {[selectedOrder.shipping_city, selectedOrder.shipping_state, selectedOrder.shipping_postal_code].filter(Boolean).join(', ')}
                      </div>
                    )}
                    {selectedOrder.shipping_phone && <div className="mt-0.5 text-stone-500 flex items-center gap-1.5"><Phone className="w-3 h-3"/> {selectedOrder.shipping_phone}</div>}
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-stone-200 bg-white px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-stone-500">Need help? Visit the <button onClick={() => { setSelectedOrder(null); setActiveTab('support'); }} className="text-[#0B2419] font-semibold underline underline-offset-2">Support tab</button>.</div>
              <div className="flex flex-wrap gap-2">
                {CANCELLABLE_STATUSES.includes((selectedOrder.status||'').toLowerCase()) && (
                  <button onClick={() => handleCancelOrder(selectedOrder.id)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 text-sm font-medium">
                    <X className="w-4 h-4"/> Cancel Order
                  </button>
                )}
                {DELIVERED_STATUSES.includes((selectedOrder.status||'').toLowerCase()) && canRequestReturn(selectedOrder.id) && (
                  <button onClick={() => { openReturnRequest(selectedOrder); setSelectedOrder(null); }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-100 text-sm font-medium">
                    <RotateCcw className="w-4 h-4"/> Request Return
                  </button>
                )}
                <button onClick={() => setSelectedOrder(null)} className="px-5 py-2 rounded-xl bg-[#0B2419] text-[#FDFBF7] text-sm font-medium hover:bg-[#1e4031]">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {reviewSubmission && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={closeReviewForm}>
          <form onSubmit={submitPurchaseReview} onClick={event => event.stopPropagation()} className="w-full max-w-xl overflow-hidden rounded-t-3xl bg-[#FDFBF7] shadow-2xl sm:rounded-3xl">
            <div className="flex items-center gap-4 bg-gradient-to-br from-[#0B2419] to-[#2C3E2D] px-6 py-5 text-white">
              {reviewSubmission.image && <img src={reviewSubmission.image} alt="" className="h-14 w-14 rounded-xl bg-white object-contain p-1"/>}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">Order #{reviewSubmission.orderId}</div>
                <h3 className="truncate text-lg font-bold">{reviewSubmission.productName}</h3>
              </div>
              <button type="button" disabled={reviewSubmitting} onClick={closeReviewForm} aria-label="Close review form" className="rounded-lg p-2 hover:bg-white/10 disabled:opacity-50"><X className="h-5 w-5"/></button>
            </div>
            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#0B2419]">Your rating</label>
                <StarsInput value={reviewDraft.rating} onChange={rating => setReviewDraft(current => ({ ...current, rating }))}/>
              </div>
              <div>
                <label htmlFor="purchase-review-title" className="mb-1.5 block text-xs font-semibold text-stone-600">Title (optional)</label>
                <input id="purchase-review-title" value={reviewDraft.title} maxLength={255} onChange={event => setReviewDraft(current => ({ ...current, title: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-[#0B2419] focus:outline-none" placeholder="Summarize your experience"/>
              </div>
              <div>
                <label htmlFor="purchase-review-body" className="mb-1.5 block text-xs font-semibold text-stone-600">Your review (optional)</label>
                <textarea id="purchase-review-body" value={reviewDraft.body} maxLength={5000} rows={4} onChange={event => setReviewDraft(current => ({ ...current, body: event.target.value }))} className="w-full resize-y rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-[#0B2419] focus:outline-none" placeholder="Share your experience with this product"/>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-[#0B2419]">Photos of the item you received</label>
                  <span className="text-xs text-stone-500">{reviewDraft.images.length}/5</span>
                </div>
                <input ref={reviewCameraInputRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" multiple className="hidden" onChange={addReviewImages}/>
                <input ref={reviewGalleryInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={addReviewImages}/>
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={reviewSubmitting || reviewDraft.images.length >= 5} onClick={() => reviewCameraInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"><Camera className="h-4 w-4"/> Take photo</button>
                  <button type="button" disabled={reviewSubmitting || reviewDraft.images.length >= 5} onClick={() => reviewGalleryInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"><ImageIcon className="h-4 w-4"/> Choose photos</button>
                </div>
                {reviewDraft.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {reviewDraft.images.map((image, index) => (
                      <div key={`${image.file.name}-${index}`} className="relative aspect-square overflow-hidden rounded-lg border border-stone-200 bg-white">
                        <img src={image.preview} alt={`Review attachment ${index + 1}`} className="h-full w-full object-cover"/>
                        <button type="button" disabled={reviewSubmitting} onClick={() => removeReviewImage(index)} aria-label={`Remove photo ${index + 1}`} className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white disabled:opacity-50"><X className="h-3 w-3"/></button>
                      </div>
                    ))}
                  </div>
                )}
                {reviewSubmitting && reviewDraft.images.length > 0 && (
                  <div className="mt-3" role="status" aria-live="polite">
                    <div className="mb-1 flex justify-between text-xs text-stone-600"><span>Uploading photos…</span><span>{reviewUploadProgress}%</span></div>
                    <div className="h-2 overflow-hidden rounded-full bg-stone-200"><div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${reviewUploadProgress}%` }}/></div>
                  </div>
                )}
                <p className="mt-2 text-xs text-stone-500">JPEG, PNG, or WebP · up to 8 MB per photo.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-stone-200 bg-white px-6 py-4">
              <button type="button" disabled={reviewSubmitting} onClick={closeReviewForm} className="rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={reviewSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-[#0B2419] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1e4031] disabled:opacity-50">
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
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-6" onClick={closeReturnRequest}>
            <form onSubmit={handleSubmitReturn} onClick={e => e.stopPropagation()} className="w-full sm:max-w-xl bg-[#FDFBF7] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              <div className="bg-gradient-to-br from-sky-600 to-sky-800 text-white px-6 sm:px-8 py-6 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-sky-200 font-semibold mb-1">Return Request</div>
                  <h3 className="text-2xl font-bold">Submit Return</h3>
                  <p className="text-sm text-sky-100 mt-1">Your order stays delivered while our team reviews the request.</p>
                </div>
                <button type="button" onClick={closeReturnRequest} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center">
                  <X className="w-4 h-4"/>
                </button>
              </div>
              <div className="px-6 sm:px-8 py-6 space-y-4 flex-1 overflow-y-auto">
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Delivered Order</label>
                  <select value={returnOrder.orderId} onChange={e => {
                    const order = deliveredOrders.find(item => String(item.id) === e.target.value);
                    setReturnOrder(current => ({ ...current, orderId: Number(e.target.value), order, form: { ...current.form, orderItemId: (order?.items || order?.order_items || [])[0]?.id || '', quantity: 1 } }));
                  }}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-sky-600 focus:ring-4 focus:ring-sky-100 bg-white text-sm">
                    {deliveredOrders.map(o => (
                      <option key={o.id} value={o.id}>Order #{o.id} — ₹{Number(o.total_amount||o.total||0).toFixed(2)} ({o.created_at? new Date(o.created_at).toLocaleDateString():''})</option>
                    ))}
                    {deliveredOrders.length === 0 && <option value="">No currently eligible delivered orders</option>}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Item to return</label>
                    <select value={form.orderItemId} onChange={e => setReturnOrder(current => ({ ...current, form: { ...current.form, orderItemId: e.target.value, quantity: 1 } }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm">
                      <option value="">Select an item…</option>
                      {selectedOrderItems.map(item => <option key={item.id} value={item.id}>{item.name || item.product_name || `Product #${item.product_id}`} · {item.quantity} purchased</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Quantity</label>
                    <input type="number" min="1" max={selectedOrderItems.find(item => String(item.id) === String(form.orderItemId))?.quantity || 1} value={form.quantity} onChange={e => setReturnOrder(current => ({ ...current, form: { ...current.form, quantity: e.target.value } }))} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm"/>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Return Reason</label>
                  <select value={form.reason} onChange={e => setReturnOrder(r => ({ ...r, form:{ ...r.form, reason: e.target.value }}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-sky-600 focus:ring-4 focus:ring-sky-100 bg-white text-sm">
                    <option value="">Select a reason…</option>
                    <option>Defective product</option>
                    <option>Wrong item received</option>
                    <option>Item damaged during shipping</option>
                    <option>Not as described on website</option>
                    <option>Fit / size issue</option>
                    <option>Changed my mind</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Refund Method</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { v:'wallet', l:'Bhumivera Wallet', d:'Instant credit • use for future orders', i: Wallet, c:'border-[#D4AF37]/60 bg-[#FFF8E7]/40' },
                      { v:'original', l:'Original Payment', d:'Refunded in 5-7 business days', i: ArrowUpRight, c:'border-sky-200 bg-sky-50/60' },
                    ].map(o => {
                      const I = o.i;
                      const active = form.refundMethod === o.v;
                      return (
                        <button key={o.v} type="button" onClick={() => setReturnOrder(r => ({ ...r, form:{ ...r.form, refundMethod: o.v }}))}
                          className={`p-4 rounded-2xl border text-left transition-all ${active ? `${o.c} ring-2 ring-[#0B2419]/10` : 'border-stone-200 bg-white hover:border-stone-300'}`}>
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${active ? 'bg-white border border-stone-200' : 'bg-stone-100'}`}>
                            <I className={`w-4.5 h-4.5 ${active ? o.v==='wallet'?'text-[#8a6a12]':'text-sky-600' : 'text-stone-500'}`}/>
                          </div>
                          <div className="font-semibold text-sm text-[#0B2419]">{o.l}</div>
                          <div className="text-xs text-stone-500 mt-0.5">{o.d}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1.5 block">What happened? (optional details)</label>
                  <textarea rows={3} value={form.notes} onChange={e => setReturnOrder(r => ({ ...r, form:{ ...r.form, notes: e.target.value }}))}
                    maxLength={2000} placeholder="Share what happened so our team can review the right solution."
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sky-600 focus:ring-4 focus:ring-sky-100 text-sm resize-none"/>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3"><label className="text-xs font-semibold text-stone-600">Evidence photos (optional, up to 5)</label><span className="text-[10px] text-stone-400">{evidenceImages.length}/5</span></div>
                  <input ref={returnPhotoInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addReturnImages} className="hidden"/>
                  <button type="button" onClick={() => returnPhotoInputRef.current?.click()} disabled={evidenceImages.length >= 5 || returnSubmitting} className="w-full rounded-xl border border-dashed border-stone-300 bg-white px-4 py-3 text-left text-sm text-stone-600 hover:border-sky-500 disabled:opacity-50"><Camera className="mr-2 inline h-4 w-4"/>Add photos — JPEG, PNG, or WebP; max 8 MB each</button>
                  {evidenceImages.length > 0 && <div className="mt-3 grid grid-cols-5 gap-2">{evidenceImages.map((image, index) => <div key={image.preview} className="relative aspect-square overflow-hidden rounded-lg border border-stone-200"><img src={image.preview} alt={`Return evidence ${index + 1}`} className="h-full w-full object-cover"/><button type="button" onClick={() => removeReturnImage(index)} disabled={returnSubmitting} aria-label="Remove evidence photo" className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"><X className="h-3 w-3"/></button></div>)}</div>}
                  {returnSubmitting && evidenceImages.length > 0 && <div className="mt-3"><div className="h-2 overflow-hidden rounded-full bg-stone-200"><div className="h-full bg-sky-600 transition-all" style={{ width: `${returnUploadProgress}%` }}/></div><p className="mt-1 text-right text-xs text-stone-500">{returnUploadProgress}% uploaded</p></div>}
                </div>
                <div className="rounded-xl border border-sky-100 bg-sky-50 p-3 text-xs text-sky-900">Our team checks the order and the details you provide. Acceptance is required before a return can move into progress. Need help now? <button type="button" onClick={() => { closeReturnRequest(); setSupportTicket(ticket => ({ ...ticket, subject: `Return help for order #${returnOrder.orderId}`, order_id: String(returnOrder.orderId) })); setActiveTab('support'); }} className="font-semibold underline underline-offset-2">Chat with customer care</button>.</div>
              </div>
              <div className="border-t border-stone-200 bg-white px-6 sm:px-8 py-4 flex flex-wrap items-center justify-end gap-2">
                <button type="button" onClick={closeReturnRequest} disabled={returnSubmitting} className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm font-medium disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={returnSubmitting} className="px-6 py-2.5 rounded-xl bg-[#0B2419] text-[#FDFBF7] text-sm font-semibold hover:bg-[#1e4031] inline-flex items-center gap-2 disabled:opacity-50">
                  <CheckCircle2 className="w-4 h-4"/> {returnSubmitting ? 'Sending for review…' : 'Submit for review'}
                </button>
              </div>
            </form>
          </div>
        );
      })()}

      {/* ======== ADDRESS FORM MODAL ======== */}
      {addressModal.open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-6" onClick={() => setAddressModal(m => ({ ...m, open:false }))}>
          <form onSubmit={handleAddressSave} onClick={e => e.stopPropagation()} className="w-full sm:max-w-2xl bg-[#FDFBF7] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-gradient-to-br from-[#0B2419] to-[#2C3E2D] text-white px-6 sm:px-8 py-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#8B9D83] font-semibold mb-1">Address</div>
                <h3 className="text-xl font-bold">{addressModal.editId ? 'Edit Address' : 'Add New Address'}</h3>
              </div>
              <button type="button" onClick={() => setAddressModal(m => ({ ...m, open:false }))} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center">
                <X className="w-4 h-4"/>
              </button>
            </div>
            <div className="px-6 sm:px-8 py-5 space-y-4 overflow-y-auto flex-1">
              <div className="flex flex-wrap gap-2">
                {['Home','Work','Office','Other'].map(l => (
                  <button key={l} type="button" onClick={() => setAddressModal(m => ({ ...m, form:{ ...m.form, label: l }}))}
                    className={`px-4 py-2 rounded-full text-xs font-medium inline-flex items-center gap-1.5 border transition-all ${
                      addressModal.form.label === l ? 'bg-[#0B2419] text-white border-[#0B2419]' : 'bg-white text-stone-700 border-stone-200 hover:border-[#8B9D83]'
                    }`}>
                    <LabelIcon label={l}/> {l}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Full Name</label>
                  <input required value={addressModal.form.full_name} onChange={e => setAddressModal(m => ({ ...m, form:{ ...m.form, full_name: e.target.value }}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#0B2419] focus:ring-4 focus:ring-[#0B2419]/5 text-sm"/>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Phone Number</label>
                  <input required value={addressModal.form.phone} onChange={e => setAddressModal(m => ({ ...m, form:{ ...m.form, phone: e.target.value }}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#0B2419] focus:ring-4 focus:ring-[#0B2419]/5 text-sm"/>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Street / House / Floor (Address Line 1)</label>
                  <input required value={addressModal.form.line1} onChange={e => setAddressModal(m => ({ ...m, form:{ ...m.form, line1: e.target.value }}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#0B2419] focus:ring-4 focus:ring-[#0B2419]/5 text-sm"/>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Address Line 2 (optional)</label>
                  <input value={addressModal.form.line2} onChange={e => setAddressModal(m => ({ ...m, form:{ ...m.form, line2: e.target.value }}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#0B2419] focus:ring-4 focus:ring-[#0B2419]/5 text-sm"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1.5 block">City</label>
                  <input required value={addressModal.form.city} onChange={e => setAddressModal(m => ({ ...m, form:{ ...m.form, city: e.target.value }}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#0B2419] focus:ring-4 focus:ring-[#0B2419]/5 text-sm"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1.5 block">State</label>
                  <input required value={addressModal.form.state} onChange={e => setAddressModal(m => ({ ...m, form:{ ...m.form, state: e.target.value }}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#0B2419] focus:ring-4 focus:ring-[#0B2419]/5 text-sm"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Postal Code</label>
                  <input required value={addressModal.form.postal_code} onChange={e => setAddressModal(m => ({ ...m, form:{ ...m.form, postal_code: e.target.value }}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#0B2419] focus:ring-4 focus:ring-[#0B2419]/5 text-sm"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Country</label>
                  <input required value={addressModal.form.country} onChange={e => setAddressModal(m => ({ ...m, form:{ ...m.form, country: e.target.value }}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#0B2419] focus:ring-4 focus:ring-[#0B2419]/5 text-sm"/>
                </div>
                <div className="sm:col-span-2">
                  <label className="inline-flex items-center gap-2.5 p-3.5 rounded-xl border border-stone-200 hover:border-[#D4AF37] hover:bg-[#FFF8E7]/40 cursor-pointer transition-colors w-full">
                    <input type="checkbox" checked={!!addressModal.form.is_default} onChange={e => setAddressModal(m => ({ ...m, form:{ ...m.form, is_default: e.target.checked }}))}
                      className="w-4.5 h-4.5 rounded accent-[#0B2419]"/>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#0B2419]">Set as default shipping address</div>
                      <div className="text-xs text-stone-500">Pre-selects this address at checkout.</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="border-t border-stone-200 bg-white px-6 sm:px-8 py-4 flex flex-wrap items-center justify-end gap-2">
              <button type="button" onClick={() => setAddressModal(m => ({ ...m, open:false }))} className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm font-medium">Cancel</button>
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-[#0B2419] text-sm font-semibold hover:bg-[#e4c255] inline-flex items-center gap-2 shadow-sm">
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
      <label className="text-xs font-semibold text-stone-600 mb-1.5 block">{label}</label>
      <div className="flex items-center rounded-xl border border-stone-200 focus-within:border-[#0B2419] focus-within:ring-4 focus-within:ring-[#0B2419]/5 transition-all">
        <input type={show?'text':'password'} value={passwords[k]} onChange={e => setPasswords({ ...passwords, [k]: e.target.value })}
          className="flex-1 px-4 py-2.5 bg-transparent text-sm focus:outline-none"/>
        <button type="button" onClick={() => setShow(!show)} className="px-3 text-stone-400 hover:text-stone-700">
          {show ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
        </button>
      </div>
    </div>
  );
}
