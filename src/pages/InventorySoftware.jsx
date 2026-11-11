import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import api from '../services/api';
import { filterLifecycleOrders, localOrderDate, matchesOrderStatus } from '../utils/inventoryOrderFilters';
import './admin/AdminTheme.css';

import DashboardView from '../components/inventory/views/DashboardView';
import OrderFulfillmentView from '../components/inventory/views/OrderFulfillmentView';
import PosTerminalView from '../components/inventory/views/ManualPosTerminalView';
import CatalogStockView from '../components/inventory/views/CatalogStockView';
import ShippingLabelsView from '../components/inventory/views/ShippingLabelsView';
import RtoReturnsView from '../components/inventory/views/RtoReturnsView';
import ReportsLogsView from '../components/inventory/views/ReportsLogsView';
import WorkroomView from '../components/inventory/views/WorkroomView';

import WavePicklistModal from '../components/inventory/modals/WavePicklistModal';
import ManifestPrintModal from '../components/inventory/modals/ManifestPrintModal';
import FulfillmentOrderQrModal from '../components/inventory/modals/FulfillmentOrderQrModal';
import ReturnQcModal from '../components/inventory/modals/ReturnQcModal';
import BatchBarcodeGeneratorModal from '../components/inventory/modals/BatchBarcodeGeneratorModal';
import {
  Activity,
  AlertTriangle,
  ArrowLeftRight,
  ArrowUpRight,
  Award,
  Barcode,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Copy,
  CreditCard,
  Download,
  Edit3,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Fingerprint,
  Globe,
  HardDrive,
  History,
  KeyRound,
  Layers,
  Lock,
  LogOut,
  MapPin,
  Package,
  PackageCheck,
  PackagePlus,
  Plus,
  Printer,
  QrCode,
  Receipt,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Send,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sliders,
  Sparkles,
  Store,
  Tag,
  Trash2,
  TrendingDown,
  TrendingUp,
  Truck,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
  Warehouse,
  Wrench,
  X,
  Zap,
} from 'lucide-react';

const LOCAL_DB_KEY = 'BV_INVENTORY_DB_V10X';
const LOCAL_TOKEN_KEY = 'BV_INV_SOFTWARE_TOKEN';
const LOCAL_USER_KEY = 'BV_INV_SOFTWARE_USER';
const LOCAL_POS_SESSION_KEY = 'BV_POS_SESSION_CODE';

const createPosRequestId = () =>
  globalThis.crypto?.randomUUID?.() || `pos-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const FALLBACK_CATALOG_ITEMS = [];
const FALLBACK_CUSTOMERS = [];

export default function InventorySoftware() {
  // Authentication & Session State
  const [authToken, setAuthToken] = useState(
    () =>
      localStorage.getItem(LOCAL_TOKEN_KEY) ||
      localStorage.getItem('adminToken') ||
      localStorage.getItem('supportToken') ||
      ''
  );
  const [operatorName, setOperatorName] = useState(() => {
    try {
      const savedOp = localStorage.getItem('BV_INV_OPERATOR_NAME');
      if (savedOp) return savedOp;
      const u = JSON.parse(localStorage.getItem(LOCAL_USER_KEY) || 'null');
      return u?.fullName?.split('(')[0]?.trim() || u?.username || 'Akash';
    } catch {
      return 'Akash';
    }
  });
  const [posSessionCode, setPosSessionCode] = useState(() => {
    try {
      const savedOp = localStorage.getItem('BV_INV_OPERATOR_NAME') || 'AKASH';
      const cleanOp = savedOp.toUpperCase().replace(/[^A-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'AKASH';
      return `STAFF-${cleanOp}`.slice(0, 64);
    } catch {
      return 'STAFF-AKASH';
    }
  });
  const handleChangeOperatorName = (newName) => {
    const clean = String(newName || '').trim() || 'Akash';
    setOperatorName(clean);
    try {
      localStorage.setItem('BV_INV_OPERATOR_NAME', clean);
    } catch {}
    const slug = clean.toUpperCase().replace(/[^A-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'STAFF';
    const nextSession = `STAFF-${slug}`.slice(0, 64);
    setPosSessionCode(nextSession);
    try {
      sessionStorage.setItem(LOCAL_POS_SESSION_KEY, nextSession);
    } catch {}
  };
  const [viewer, setViewer] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loginForm, setLoginForm] = useState({ username: '', password: '', totpCode: '' });
  const [requires2FA, setRequires2FA] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // First-Login Security Onboarding Modal
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [onboardingNewPass, setOnboardingNewPass] = useState('');
  const [totpSetupData, setTotpSetupData] = useState(null);
  const [totpQrDataUrl, setTotpQrDataUrl] = useState('');
  const [totpVerifyCode, setTotpVerifyCode] = useState('');

  // WMS Upgrades State
  const [activeWavePicklist, setActiveWavePicklist] = useState(null);
  const [activeManifest, setActiveManifest] = useState(null);
  const [fulfillmentQrOrder, setFulfillmentQrOrder] = useState(null);
  const [returnQcOrder, setReturnQcOrder] = useState(null);
  const [velocityData, setVelocityData] = useState(null);

  // Navigation and UI state for the simplified inventory workflow.
  const [activeView, setActiveView] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const requested = params.get('view');
      const allowed = ['dash', 'online', 'labels', 'ret', 'inv', 'sale', 'workroom', 'backup', 'trans', 'rep', 'logs'];
      if (requested && allowed.includes(requested)) return requested;
      if (requested === 'shipping') return 'labels';
    } catch {}
    return 'dash';
  });
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [orderSyncError, setOrderSyncError] = useState('');
  const [banner, setBanner] = useState(null);

  // Core Data Collections (Single Main Inventory synced across Online & Offline)
  const [items, setItems] = useState(FALLBACK_CATALOG_ITEMS);
  const [customers, setCustomers] = useState(FALLBACK_CUSTOMERS);
  const [sales, setSales] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [movements, setMovements] = useState([]);
  const [logs, setLogs] = useState([]);
  const [onlineOrders, setOnlineOrders] = useState([]);
  const [dailyBackups, setDailyBackups] = useState([]);
  const [shippingZones, setShippingZones] = useState([]);
  const [carriers, setCarriers] = useState([]);

  // Order lifecycle, shipping, returns, and daily backup state
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [orderDateFilter, setOrderDateFilter] = useState('');
  const [editingOrder, setEditingOrder] = useState(null);
  const [selectedLabelOrderIds, setSelectedLabelOrderIds] = useState([]);
  const [carrierBookForm, setCarrierBookForm] = useState({
    provider: 'shiprocket',
    weight: '0.5',
    length: '20',
    width: '15',
    height: '10',
  });
  const [rtoSearch, setRtoSearch] = useState('');
  const [rtoReason, setRtoReason] = useState('Customer Unavailable / Door Locked — Courier Return to Origin (RTO)');
  // Order locks are displayed in fulfillment; retail billing remains manual and independent.
  const [orderLocks, setOrderLocks] = useState([]);
  const [batchQrProduct, setBatchQrProduct] = useState(null);
  const [batchQrBatch, setBatchQrBatch] = useState('');
  const [backupBusy, setBackupBusy] = useState(false);
  const [posCustomerForm, setPosCustomerForm] = useState({
    name: 'Walk-in Retail Shopper',
    phone: '',
    address: '',
    gstin: '',
  });
  const [cfg, setCfg] = useState({
    storeName: 'Bhumivera Organics India Private Limited',
    tagline: 'The Transparent Maison — 100% Label-Disclosed Botanical Formulations',
    address: 'G.T. Road, Gopalpur, Asansol, West Bengal - 713304, India',
    phone: '+91 98320 00000',
    email: 'billing@bhumivera.com',
    website: 'www.bhumivera.com',
    gstin: '19AAKCB2026A1Z5',
    upiId: 'bhumivera@okhdfcbank',
    taxRate: 0,
    autoSyncWebsite: true,
    posHoldReservation: true,
    cats: [
      'Luxury Facial Cleansers',
      'Luxury Hair Care',
      'Artisanal Ayurvedic Cleansing Bars',
      'Luxury Ayurvedic Wellness & Immunity Drops',
      'Maison Regimen Bundles',
      'Botanical Raw Materials',
      'Luxury Glass & Packaging',
    ],
    hid: [],
  });

  // Inventory Filters
  const [invSearch, setInvSearch] = useState('');
  const [invCatFilter, setInvCatFilter] = useState('ALL');
  const [invStockFilter, setInvStockFilter] = useState('ALL');

  // POS Billing State
  const [posCart, setPosCart] = useState([]);
  const [posCheckoutKey, setPosCheckoutKey] = useState(() => {
    try {
      return sessionStorage.getItem('BV_POS_CHECKOUT_KEY') || createPosRequestId();
    } catch {
      return createPosRequestId();
    }
  });
  const [posCheckoutBusy, setPosCheckoutBusy] = useState(false);
  const [posDiscount, setPosDiscount] = useState(0);
  const [posTaxRate, setPosTaxRate] = useState(18);
  const [posPaymentMode, setPosPaymentMode] = useState('Cash');
  const [posPaidAmount, setPosPaidAmount] = useState('');
  const [upiQrDataUrl, setUpiQrDataUrl] = useState('');
  const [lastCompletedSale, setLastCompletedSale] = useState(null);

  // Modals State
  const [activeModal, setActiveModal] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  useEffect(() => {
    if (!activeModal) return undefined;
    const backdropClosable = ['view-sale', 'label', 'img-viewer', 'invoice-success'];
    const onKeyDown = event => {
      if (event.key === 'Escape') setActiveModal(null);
    };
    const onBackdropClick = event => {
      const target = event.target;
      if (
        backdropClosable.includes(activeModal) &&
        target?.classList?.contains('fixed') &&
        target.classList.contains('inset-0')
      ) {
        setActiveModal(null);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onBackdropClick);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onBackdropClick);
    };
  }, [activeModal]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [khataForm, setKhataForm] = useState({
    customerId: null,
    customerName: '',
    currentBal: 0,
    type: 'RECEIVE_PAYMENT',
    amount: '',
    paymentMode: 'UPI',
    note: '',
    proofBase64: null,
  });
  const [adjustmentForm, setAdjustmentForm] = useState({
    metaId: '',
    operation: 'subtract',
    quantity: 1,
    reason: 'Damaged in Transit / Storage',
  });
  const [returnForm, setReturnForm] = useState({
    customerId: '',
    metaId: '',
    quantity: 1,
    mode: 'GOOD',
    creditCustomerKhata: false,
    refundAmount: 0,
    reason: 'Customer Exchange / Return',
  });
  const [reportDate, setReportDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [reportSearchInv, setReportSearchInv] = useState('');
  const [showProofGallery, setShowProofGallery] = useState(false);
  const [viewingSale, setViewingSale] = useState(null);
  const [viewingImageSrc, setViewingImageSrc] = useState('');
  const [labelItem, setLabelItem] = useState(null);
  const [labelQrUrl, setLabelQrUrl] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [profilePassForm, setProfilePassForm] = useState({ currentPassword: '', newPassword: '' });

  const showNotice = useCallback((type, message) => {
    setBanner({ type, message });
    setTimeout(() => {
      setBanner(prev => (prev?.message === message ? null : prev));
    }, 5500);
  }, []);

  const reqConfig = useMemo(
    () => ({
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      notify: false,
    }),
    [authToken]
  );

  // Sync with Backend & LocalStorage Cache
  const fetchBootstrapData = useCallback(
    async (silent = false) => {
      if (!authToken) return;
      if (!silent) setLoading(true);
      setSyncing(true);
      try {
        const res = await api.get(
          '/inventory-software/bootstrap',
          reqConfig
        );
        const d = res.data;
        if (!d?.success) throw new Error(d?.message || 'Inventory sync returned an unsuccessful response.');
        if (d?.success) {
          if (d.viewer) {
            setViewer(d.viewer);
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(d.viewer));
            if (d.viewer.firstLogin) {
              setShowOnboardingModal(true);
            }
          }
          if (Array.isArray(d.items)) setItems(d.items);
          if (Array.isArray(d.customers)) {
            setCustomers(d.customers);
          }
          if (Array.isArray(d.sales)) setSales(d.sales);
          if (Array.isArray(d.proofs)) setProofs(d.proofs);
          if (Array.isArray(d.movements)) setMovements(d.movements);
          if (Array.isArray(d.logs)) setLogs(d.logs);
          if (Array.isArray(d.onlineOrders)) setOnlineOrders(d.onlineOrders);
          if (Array.isArray(d.orderLocks)) setOrderLocks(d.orderLocks);
          if (Array.isArray(d.dailyBackups)) setDailyBackups(d.dailyBackups);
          if (Array.isArray(d.shippingZones)) setShippingZones(d.shippingZones);
          if (Array.isArray(d.carriers)) setCarriers(d.carriers);
          if (d.cfg) {
            setCfg(prev => ({ ...prev, ...d.cfg }));
            const configuredTaxRate = Number(d.cfg.taxRate);
            setPosTaxRate(Number.isFinite(configuredTaxRate) ? configuredTaxRate : 18);
          }
          setLastSyncedAt(d.syncedAt || new Date().toISOString());
          api.get('/inventory-software/stock/forecast', reqConfig)
            .then(fRes => {
              if (fRes.data?.success) setVelocityData(fRes.data);
            })
            .catch(() => {});
          setOrderSyncError('');

          localStorage.setItem(
            LOCAL_DB_KEY,
            JSON.stringify({
              items: d.items,
              customers: d.customers,
              sales: d.sales,
              proofs: d.proofs,
              movements: d.movements,
              logs: d.logs,
              cfg: d.cfg,
              syncedAt: new Date().toISOString(),
            })
          );
          return d;
        }
        return null;
      } catch (err) {
        setOrderSyncError(err.response?.data?.message || err.message || 'Could not refresh inventory data.');
        if (err.response?.status === 401 || err.response?.status === 403) {
          setAuthToken('');
          localStorage.removeItem(LOCAL_TOKEN_KEY);
          setLoginError(err.response?.data?.message || 'Session expired. Please sign in.');
        } else {
          // Load from local cache if offline
          try {
            const cached = JSON.parse(localStorage.getItem(LOCAL_DB_KEY) || 'null');
            if (cached?.items) {
              setItems(cached.items);
              if (cached.customers) setCustomers(cached.customers);
              if (cached.sales) setSales(cached.sales);
              if (cached.proofs) setProofs(cached.proofs);
              if (cached.movements) setMovements(cached.movements);
              if (cached.logs) setLogs(cached.logs);
            }
          } catch {}
          showNotice('error', err.response?.data?.message || err.message || 'Could not refresh inventory data.');
        }
        return null;
      } finally {
        setLoading(false);
        setSyncing(false);
      }
    },
    [authToken, reqConfig, showNotice]
  );

  useEffect(() => {
    if (authToken) {
      fetchBootstrapData();
    }
  }, [authToken, fetchBootstrapData]);

  // Disabled automatic background /bootstrap SQL polling when idle to prevent unnecessary SQL & RAM usage.
  // POS Cart Totals & Dynamic UPI QR Generator
  const posCalculations = useMemo(() => {
    const subTotal = posCart.reduce((sum, i) => sum + Number(i.p) * Number(i.q), 0);
    const disc = Math.max(0, Number(posDiscount) || 0);
    const taxable = Math.max(0, subTotal - disc);
    const taxRate = Math.max(0, Number(posTaxRate) || 0);
    const taxAmt = Math.round((taxable * taxRate) / 100);
    const billTotal = taxable + taxAmt;
    const phone = posCustomerForm.phone.trim();
    const matchedCustomer = phone && phone !== '-'
      ? customers.find(customer => String(customer.phone).trim() === phone)
      : null;
    const prevBal = Number(matchedCustomer?.wallet) || 0;
    const paid = posPaidAmount === ''
      ? posPaymentMode === 'Khata / Credit' ? 0 : billTotal
      : Math.max(0, Number(posPaidAmount) || 0);
    const newBal = prevBal - billTotal + paid;
    return { subTotal, disc, taxable, taxRate, taxAmt, billTotal, prevBal, paid, newBal };
  }, [posCart, posDiscount, posTaxRate, customers, posCustomerForm, posPaidAmount, posPaymentMode]);

  useEffect(() => {
    if (posPaymentMode === 'UPI' && posCalculations.billTotal > 0) {
      const upiUri = `upi://pay?pa=${encodeURIComponent(cfg.upiId || 'bhumivera@okhdfcbank')}&pn=${encodeURIComponent(
        cfg.storeName || 'Bhumivera'
      )}&am=${posCalculations.billTotal}&cu=INR&tn=${encodeURIComponent('Bhumivera POS Bill')}`;
      QRCode.toDataURL(upiUri, { width: 180, margin: 1 })
        .then(url => setUpiQrDataUrl(url))
        .catch(() => setUpiQrDataUrl(''));
    } else {
      setUpiQrDataUrl('');
    }
  }, [posPaymentMode, posCalculations.billTotal, cfg.upiId, cfg.storeName]);

  useEffect(() => {
    try {
      sessionStorage.setItem('BV_POS_CHECKOUT_KEY', posCheckoutKey);
    } catch {
      // Session storage is optional; the in-memory idempotency key still protects this page session.
    }
  }, [posCheckoutKey]);

  // Dashboard Metrics
  const dashMetrics = useMemo(() => {
    const todayStr = new Date().toLocaleDateString();
    const posRevToday = sales
      .filter(s => s.status !== 'cancelled' && new Date(s.date).toLocaleDateString() === todayStr)
      .reduce((sum, s) => sum + (Number(s.billTotal) || 0), 0);
    const onlineRevToday = onlineOrders
      .filter(o => new Date(o.createdAt).toLocaleDateString() === todayStr)
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    const nonBundleItems = items.filter(i => !i.isBundle);
    const totalRetailVal = nonBundleItems.reduce((sum, i) => sum + (Number(i.qty) || 0) * (Number(i.price) || 0), 0);
    const totalCostVal = nonBundleItems.reduce((sum, i) => sum + (Number(i.qty) || 0) * (Number(i.costPrice) || 0), 0);
    const totalUnits = nonBundleItems.reduce((sum, i) => sum + (Number(i.qty) || 0), 0);
    const lowStockCount = items.filter(i => Number(i.qty) <= (Number(i.minStock) || 15)).length;
    const outOfStockCount = items.filter(i => Number(i.qty) === 0).length;
    const quarantineUnits = items.reduce((sum, i) => sum + (Number(i.damagedQuarantineStock) || 0), 0);
    const khataReceivable = customers.reduce(
      (sum, c) => sum + (Number(c.wallet) < 0 ? Math.abs(Number(c.wallet)) : 0),
      0
    );
    const pendingOnlineDispatch = onlineOrders.filter(o => ['pending', 'confirmed', 'packed'].includes(o.status)).length;

    return {
      posRevToday,
      onlineRevToday,
      totalRetailVal,
      totalCostVal,
      projectedProfit: Math.max(0, totalRetailVal - totalCostVal),
      totalUnits,
      lowStockCount,
      outOfStockCount,
      quarantineUnits,
      khataReceivable,
      pendingOnlineDispatch,
      pendingDispatch: onlineOrders.filter(o => ['pending', 'confirmed'].includes(o.status)).length,
      packedCount: onlineOrders.filter(o => o.status === 'packed').length,
    };
  }, [items, sales, onlineOrders, customers]);

  // Filtered Inventory List
  const filteredInventory = useMemo(() => {
    const q = invSearch.trim().toLowerCase();
    return items.filter(it => {
      const matchSearch =
        !q ||
        it.name?.toLowerCase().includes(q) ||
        it.sku?.toLowerCase().includes(q) ||
        it.barcode?.toLowerCase().includes(q) ||
        it.batchNo?.toLowerCase().includes(q);
      const matchCat = invCatFilter === 'ALL' || it.cat === invCatFilter;
      let matchStock = true;
      if (invStockFilter === 'LOW') matchStock = it.qty <= (it.minStock || 15) && it.qty > 0;
      if (invStockFilter === 'OUT') matchStock = it.qty === 0;
      if (invStockFilter === 'QUARANTINE') matchStock = (it.damagedQuarantineStock || 0) > 0;
      return matchSearch && matchCat && matchStock;
    });
  }, [items, invSearch, invCatFilter, invStockFilter]);

  // Filtered Reports
  const filteredReportSales = useMemo(() => {
    return sales.filter(s => {
      if (reportSearchInv.trim()) {
        const term = reportSearchInv.trim().toLowerCase();
        return (
          s.invoiceNo?.toLowerCase().includes(term) ||
          String(s.id).includes(term) ||
          s.cust?.name?.toLowerCase().includes(term)
        );
      }
      if (!reportDate) return true;
      const dStr = new Date(s.date).toISOString().split('T')[0];
      return dStr === reportDate;
    });
  }, [sales, reportDate, reportSearchInv]);

  // Filtered Online Orders for Full Order Lifecycle & Shipping Labels
  const filteredOnlineOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();
    return onlineOrders.filter(o => {
      const matchStatus = matchesOrderStatus(o, orderStatusFilter);
      const matchQuery =
        !q ||
        String(o.orderNumber || '').toLowerCase().includes(q) ||
        String(o.id).includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.customerPhone?.toLowerCase().includes(q) ||
        o.city?.toLowerCase().includes(q) ||
        o.state?.toLowerCase().includes(q) ||
        o.pincode?.toLowerCase().includes(q) ||
        o.trackingNumber?.toLowerCase().includes(q) ||
        o.courier?.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [onlineOrders, orderSearch, orderStatusFilter]);

  const lifecycleOrders = useMemo(
    () => filterLifecycleOrders(onlineOrders, { status: orderStatusFilter, date: orderDateFilter, query: orderSearch }),
    [onlineOrders, orderStatusFilter, orderDateFilter, orderSearch]
  );
  const todayOrderDate = localOrderDate(new Date());

  // Filtered Undelivered / RTO Eligible Orders
  const rtoCandidateOrders = useMemo(() => {
    const q = rtoSearch.trim().toLowerCase();
    return onlineOrders.filter(o => {
      const isCandidate = ['shipped', 'packed', 'confirmed', 'returned'].includes(o.status);
      if (!isCandidate) return false;
      if (!q) return true;
      return (
        String(o.orderNumber || '').toLowerCase().includes(q) ||
        String(o.id).includes(q) ||
        o.trackingNumber?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.city?.toLowerCase().includes(q)
      );
    });
  }, [onlineOrders, rtoSearch]);

  const handleOpenBatchQrModal = (prod = null, batch = '') => {
    setBatchQrProduct(prod);
    setBatchQrBatch(batch);
    setActiveModal('batch-qr');
  };

  // ==========================================================================
  // HANDLERS: AUTHENTICATION & SECURITY ONBOARDING
  // ==========================================================================

  const handleLoginSubmit = async e => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await api.post(
        '/inventory-software/auth/login',
        {
          username: loginForm.username.trim(),
          password: loginForm.password,
          totpCode: requires2FA ? loginForm.totpCode.trim() : undefined,
        },
        { notify: false }
      );
      if (res.data?.requires2FA) {
        setRequires2FA(true);
        showNotice('info', 'Enter the 6-digit code from your 2FA Authenticator app.');
        return;
      }
      if (res.data?.token) {
        localStorage.setItem(LOCAL_TOKEN_KEY, res.data.token);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(res.data.user));
        setViewer(res.data.user);
        setAuthToken(res.data.token);
        setRequires2FA(false);
        if (res.data.firstLogin) {
          setShowOnboardingModal(true);
        }
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Invalid Account ID or Password.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setLoginError('');
    setLoginLoading(true);
    try {
      if (window.PublicKeyCredential && navigator.credentials) {
        try {
          const challenge = crypto.getRandomValues(new Uint8Array(32));
          await navigator.credentials.get({
            publicKey: {
              challenge,
              timeout: 45000,
              userVerification: 'preferred',
            },
          });
        } catch (webauthnErr) {
          if (webauthnErr.name === 'NotAllowedError') {
            throw new Error('Biometric Passkey verification cancelled.');
          }
        }
      }
      const res = await api.post(
        '/inventory-software/auth/passkey-login',
        { username: loginForm.username.trim() || localStorage.getItem('BV_LAST_INV_USER') || 'admin' },
        { notify: false }
      );
      if (res.data?.token) {
        localStorage.setItem(LOCAL_TOKEN_KEY, res.data.token);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(res.data.user));
        setViewer(res.data.user);
        setAuthToken(res.data.token);
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || err.message || 'Passkey sign-in failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleEnrollPasskey = async () => {
    const deviceName = window.prompt(
      'Enter a name for this Biometric Passkey device (e.g. Shop Counter PC, MacBook TouchID, Android Scanner):',
      'Shop Counter Biometric Key'
    );
    if (!deviceName) return;
    try {
      let credentialId = 'PK-' + Math.random().toString(36).substring(2, 12).toUpperCase();
      if (window.PublicKeyCredential && navigator.credentials && viewer) {
        try {
          const challenge = crypto.getRandomValues(new Uint8Array(32));
          const userIdBytes = new TextEncoder().encode(String(viewer.username || 'admin'));
          const cred = await navigator.credentials.create({
            publicKey: {
              challenge,
              rp: { name: 'Bhumivera Inventory Suite', id: window.location.hostname || 'bhumivera.com' },
              user: {
                id: userIdBytes,
                name: viewer.username,
                displayName: viewer.fullName || viewer.username,
              },
              pubKeyCredParams: [
                { type: 'public-key', alg: -7 },
                { type: 'public-key', alg: -257 },
              ],
              authenticatorSelection: { userVerification: 'preferred' },
              timeout: 45000,
            },
          });
          if (cred?.id) credentialId = cred.id;
        } catch (e) {
          if (e.name === 'NotAllowedError') return;
        }
      }
      const res = await api.post(
        '/inventory-software/auth/enroll-passkey',
        { deviceName, credentialId },
        reqConfig
      );
      if (res.data?.success) {
        localStorage.setItem('BV_LAST_INV_USER', viewer?.username || 'admin');
        showNotice('success', `Biometric Passkey "${deviceName}" enrolled!`);
        fetchBootstrapData(true);
      }
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not enroll Passkey.');
    }
  };

  const handleStart2FASetup = async () => {
    try {
      const res = await api.post('/inventory-software/auth/2fa/setup', {}, reqConfig);
      if (res.data?.secret) {
        setTotpSetupData(res.data);
        const qrUrl = await QRCode.toDataURL(res.data.otpauthUrl, { width: 180, margin: 1 });
        setTotpQrDataUrl(qrUrl);
      }
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not initialize 2FA setup.');
    }
  };

  const handleConfirm2FAEnable = async () => {
    if (!totpSetupData || !totpVerifyCode.trim()) return;
    try {
      const res = await api.post(
        '/inventory-software/auth/2fa/enable',
        { secret: totpSetupData.secret, code: totpVerifyCode.trim() },
        reqConfig
      );
      showNotice('success', res.data?.message || '2FA Authenticator enabled!');
      setTotpSetupData(null);
      setTotpVerifyCode('');
      fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Invalid 6-digit verification code.');
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      await api.post(
        '/inventory-software/auth/complete-onboarding',
        { newPassword: onboardingNewPass.trim() || undefined },
        reqConfig
      );
      setShowOnboardingModal(false);
      setOnboardingNewPass('');
      showNotice('success', 'Security onboarding completed!');
      fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Failed to complete onboarding.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_TOKEN_KEY);
    localStorage.removeItem(LOCAL_USER_KEY);
    setAuthToken('');
    setViewer(null);
  };

  // ==========================================================================
  // HANDLERS: INVENTORY, STOCK SYNC & POS BILLING
  // ==========================================================================

  const handleQuickStockStep = async (item, delta) => {
    const operation = delta >= 0 ? 'add' : 'subtract';
    const quantity = Math.abs(delta);
    try {
      const res = await api.post(
        '/inventory-software/stock/adjust',
        {
          metaId: item.id,
          productId: item.productId,
          sku: item.sku,
          operation,
          quantity,
          movementType: 'STOCK_ADJUSTMENT',
          reason: `Quick Inline ${delta >= 0 ? '+' : ''}${delta} Stock Sync`,
        },
        reqConfig
      );
      showNotice('success', res.data?.message || 'Live website stock updated!');
      await fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Failed to adjust stock.');
    }
  };

  const handleSaveItemModal = async e => {
    e.preventDefault();
    if (!editingItem?.name) return;
    try {
      const itemPayload = Object.fromEntries(
        Object.entries(editingItem).filter(([key]) => !['binCode', 'shopDisplayStock', 'warehouseVaultStock'].includes(key))
      );
      const res = await api.post('/inventory-software/items/save', itemPayload, reqConfig);
      showNotice('success', res.data?.message || 'Item saved and synced to live website.');
      setActiveModal(null);
      setEditingItem(null);
      await fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Failed to save item.');
    }
  };

  const handleDeleteItem = async item => {
    if (!window.confirm(`Remove "${item.name}" from inventory tracker?`)) return;
    try {
      await api.delete(`/inventory-software/items/${item.id}`, reqConfig);
      showNotice('success', `Removed "${item.name}".`);
      await fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not delete item.');
    }
  };

  const handleManualPosScan = async code => {
    try {
      const { data } = await api.post('/inventory-software/scanner/lookup', { code }, reqConfig);
      const item = data?.item;
      if (!item) {
        showNotice('error', 'This QR or barcode is not registered to an inventory product.');
        return;
      }
      if (item.serialNumber && item.serialStatus !== 'available') {
        showNotice('error', `Item ${item.serialNumber} is ${item.serialStatus || 'unavailable'} and cannot be billed.`);
        return;
      }
      if (item.serialNumber && posCart.some(cartItem => cartItem.serialNumbers?.includes(item.serialNumber))) {
        showNotice('error', `Item ${item.serialNumber} is already in this bill.`);
        return;
      }
      setPosCart(previous => {
        const index = previous.findIndex(cartItem => cartItem.sku === item.sku);
        const serialNumbers = item.serialNumber ? [item.serialNumber] : [];
        if (index >= 0) {
          const next = [...previous];
          next[index] = {
            ...next[index],
            q: Number(next[index].q) + 1,
            serialNumbers: [...(next[index].serialNumbers || []), ...serialNumbers],
          };
          return next;
        }
        return [...previous, {
          id: item.metaId,
          productId: item.productId,
          sku: item.sku,
          name: item.name,
          q: 1,
          p: Number(item.price) || 0,
          uom: item.uom || 'Pcs',
          gstHsnCode: item.gstHsnCode || '30049011',
          gstRate: Number(item.gstRate) || 5,
          serialNumbers,
        }];
      });
      showNotice('success', `Added ${item.name}${item.serialNumber ? ` · item ${item.serialNumber}` : ''} to the POS bill.`);
    } catch (error) {
      showNotice('error', error.response?.data?.message || 'Could not resolve the scanned product code.');
    }
  };

  const handlePosCheckout = async () => {
    if (posCheckoutBusy) return;
    if (posCart.length === 0) {
      showNotice('error', 'Add at least one product to the POS bill.');
      return;
    }
    setPosCheckoutBusy(true);
    try {
      const payload = {
        customer: {
          name: posCustomerForm.name?.trim() || 'Walk-in Retail Shopper',
          phone: posCustomerForm.phone?.trim() || '-',
          address: posCustomerForm.address?.trim() || '',
          gstin: posCustomerForm.gstin?.trim() || '',
        },
        items: posCart,
        extraCharges: [],
        discount: posCalculations.disc,
        taxRate: posCalculations.taxRate,
        paidAmount: posCalculations.paid,
        paymentMode: posPaymentMode,
        upiReference: '',
        sessionCode: posSessionCode,
        operatorUsername: viewer?.username || operatorName.toLowerCase(),
        operatorName,
      };
      const res = await api.post(
        '/inventory-software/pos/checkout',
        payload,
        {
          ...reqConfig,
          headers: { ...reqConfig.headers, 'Idempotency-Key': posCheckoutKey },
        }
      );
      if (res.data?.success) {
        setLastCompletedSale(res.data.sale);
        setPosCart([]);
        setPosDiscount(0);
        setPosPaidAmount('');
        setPosCheckoutKey(createPosRequestId());
        setActiveModal('invoice-success');
        showNotice('success', res.data.message);
        await fetchBootstrapData(true);
      }
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;
      showNotice(
        'error',
        !err.response || status >= 500 || status === 429
          ? `${message || 'Connection problem.'} Your cart remains open. Retry Complete Bill; the idempotency key prevents duplicate invoices.`
          : message || 'Checkout failed.'
      );
      if (err.response?.data?.code === 'TAX_RATE_MISMATCH') await fetchBootstrapData(true);
    } finally {
      setPosCheckoutBusy(false);
    }
  };

  const handleCancelInvoiceAndRestock = async saleId => {
    if (!window.confirm('Cancel this POS Invoice and automatically restock items back to bhumivera.com?')) return;
    try {
      const res = await api.post(`/inventory-software/pos/${saleId}/cancel`, {}, reqConfig);
      showNotice('success', res.data?.message || 'Invoice cancelled & items restocked to live website.');
      setActiveModal(null);
      await fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not cancel invoice.');
    }
  };

  // ==========================================================================
  // PRINTABLE A4 GST TAX INVOICE & 80MM THERMAL RECEIPT
  // ==========================================================================

  const handlePrintA4Invoice = sale => {
    if (!sale) return;
    const w = window.open('', '_blank', 'width=900,height=800');
    if (!w) return;
    const itemsRows = (sale.items || [])
      .map(
        (it, idx) => `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;">${idx + 1}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;font-family:monospace;">${it.sku || '-'}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;font-weight:600;">${it.name}${it.serialNumbers?.length ? `<div style="font-size:10px;color:#475569;">Item code: ${it.serialNumbers.join(', ')}</div>` : ''}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:center;">${it.gstHsnCode || '30049011'}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:600;">${it.q} ${it.uom || 'Pcs'}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right;">₹${Number(it.p).toFixed(2)}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700;">₹${(Number(it.p) * Number(it.q)).toFixed(2)}</td>
        </tr>`
      )
      .join('');

    w.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tax Invoice ${sale.invoiceNo}</title>
        <style>
          body { font-family: 'Inter', -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 32px; font-size: 13px; }
          .header { display: flex; justify-content: space-between; border-bottom: 3px solid #10b981; padding-bottom: 18px; margin-bottom: 24px; }
          .brand { font-size: 24px; font-weight: 800; color: #047857; letter-spacing: 0.5px; }
          .tagline { font-size: 11px; color: #b45309; font-style: italic; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th { background: #0f172a; color: #fff; text-align: left; padding: 10px; font-size: 11px; text-transform: uppercase; }
          .summary-box { width: 320px; margin-left: auto; margin-top: 20px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 6px; }
          .total-row { display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; color: #047857; border-top: 2px solid #cbd5e1; padding-top: 8px; margin-top: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">${cfg.storeName}</div>
            <div class="tagline">${cfg.tagline}</div>
            <div style="margin-top:6px;color:#475569;">${cfg.address}</div>
            <div style="color:#475569;">Phone: ${cfg.phone} | Email: ${cfg.email}</div>
            <div style="font-weight:700;margin-top:4px;">GSTIN: ${cfg.gstin}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:20px;font-weight:800;color:#0f172a;">TAX INVOICE</div>
            <div style="font-weight:700;color:#047857;margin-top:4px;">Invoice #: ${sale.invoiceNo}</div>
            <div style="color:#64748b;margin-top:2px;">Date: ${new Date(sale.date).toLocaleString()}</div>
            <div style="color:#64748b;">Payment Mode: <b>${sale.paymentMode}</b></div>
            <div style="color:#64748b;">Operator: @${sale.cashier || 'admin'}</div>
          </div>
        </div>
        <div style="background:#f1f5f9;padding:12px 16px;border-radius:8px;">
          <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;">Billed To Customer</div>
          <div style="font-size:15px;font-weight:700;margin-top:2px;">${sale.cust?.name || 'Walk-in Retail Shopper'}</div>
          <div>Phone: ${sale.cust?.phone || '-'} ${sale.cust?.gstin ? `| Customer GSTIN: <b>${sale.cust.gstin}</b>` : ''}</div>
            ${sale.cust?.address ? `<div>Address: ${sale.cust.address}</div>` : ''}
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>SKU</th>
              <th>Item Description</th>
              <th style="text-align:center;">HSN</th>
              <th style="text-align:center;">Qty</th>
              <th style="text-align:right;">Rate</th>
              <th style="text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsRows}</tbody>
        </table>
        <div class="summary-box">
          <div class="row"><span>Item Subtotal:</span><b>₹${Number(sale.subTotal || sale.total).toFixed(2)}</b></div>
          ${sale.extraTotal ? `<div class="row"><span>Extra Charges:</span><b>₹${Number(sale.extraTotal).toFixed(2)}</b></div>` : ''}
          ${sale.discount ? `<div class="row"><span>Discount:</span><b>-₹${Number(sale.discount).toFixed(2)}</b></div>` : ''}
          <div class="row"><span>GST (${sale.taxRate || 0}%):</span><b>₹${Number(sale.tax || 0).toFixed(2)}</b></div>
          <div class="total-row"><span>Grand Payable Total:</span><span>₹${Number(sale.billTotal).toFixed(2)}</span></div>
          <div class="row" style="margin-top:8px;"><span>Amount Received (${sale.paymentMode}):</span><b>₹${Number(sale.paid).toFixed(2)}</b></div>
          <div class="row"><span>Running Khata Balance:</span><b>₹${Number(sale.newBal).toFixed(2)}</b></div>
        </div>
        <div style="margin-top:40px;text-align:center;color:#64748b;font-size:11px;border-top:1px solid #e2e8f0;padding-top:12px;">
          Thank you for shopping at ${cfg.storeName}! Live inventory synced with ${cfg.website}.
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `);
    w.document.close();
  };

  const handlePrintThermal = sale => {
    if (!sale) return;
    const w = window.open('', '_blank', 'width=350,height=600');
    if (!w) return;
    const logoUrl = `${window.location.origin}/logo.webp`;
    w.document.write(`
      <html><head><title>Receipt ${sale.invoiceNo}</title>
      <style>
        body { font-family: monospace; font-size: 12px; width: 280px; margin: 0; padding: 10px; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .line { border-top: 1px dashed #000; margin: 8px 0; }
        .logo { display: block; width: 64px; height: 64px; object-fit: contain; margin: 0 auto 4px; filter: grayscale(1) contrast(2) brightness(.65); }
      </style></head><body>
        <img class="logo" src="${logoUrl}" alt="Bhumivera logo" />
        <div class="center bold" style="font-size:15px;">BHUMIVERA ORGANICS</div>
        <div class="center" style="font-size:10px;">${cfg.address}</div>
        <div class="center" style="font-size:10px;">GSTIN: ${cfg.gstin}</div>
        <div class="line"></div>
        <div>Inv #: <b>${sale.invoiceNo}</b></div>
        <div>Date: ${new Date(sale.date).toLocaleString()}</div>
        <div>Customer: ${sale.cust?.name || 'Walk-in'}</div>
        <div class="line"></div>
        ${(sale.items || [])
          .map(
            i =>
              `<div><b>${i.name}</b> x${i.q}<span style="float:right;">₹${(Number(i.p) * Number(i.q)).toFixed(0)}</span></div>
              <div style="font-size:9px;color:#555;margin-bottom:3px;">HSN: ${i.gstHsnCode || '30049011'} | Rate: ₹${Number(i.p).toFixed(2)} | GST: ${i.gstRate || 5}%${i.serialNumbers?.length ? ` | Item code: ${i.serialNumbers.join(', ')}` : ''}</div>`
          )
          .join('')}
        <div class="line"></div>
        <div>Subtotal: <span style="float:right;">₹${sale.subTotal}</span></div>
        ${sale.extraTotal ? `<div>Extra charges: <span style="float:right;">₹${sale.extraTotal}</span></div>` : ''}
        ${sale.discount ? `<div>Discount: <span style="float:right;">-₹${sale.discount}</span></div>` : ''}
        <div>GST (${sale.taxRate}%): <span style="float:right;">₹${sale.tax}</span></div>
        <div class="bold" style="font-size:14px;">TOTAL: <span style="float:right;">₹${sale.billTotal}</span></div>
        <div>Paid (${sale.paymentMode}): <span style="float:right;">₹${sale.paid}</span></div>
        <div>Khata Balance: <span style="float:right;">₹${sale.newBal}</span></div>
        <div class="line"></div>
        <div class="center" style="font-size:10px;">www.bhumivera.com • Thank You!</div>
        <script>window.onload = () => window.print();</script>
      </body></html>
    `);
    w.document.close();
  };

  const handlePrintShelfLabel = () => {
    if (!labelItem || !labelQrUrl) return;
    const w = window.open('', '_blank', 'width=420,height=600');
    if (!w) return;
    const escapeHtml = value =>
      String(value ?? '').replace(/[&<>"']/g, character => {
        const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
        return entities[character];
      });
    const logoUrl = `${window.location.origin}/logo.webp`;
    w.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Shelf Label - ${escapeHtml(labelItem.sku)}</title>
          <style>
            @page { margin: 2mm; }
            * { box-sizing: border-box; }
            body { width: 50mm; margin: 0 auto; padding: 2mm; font-family: Arial, sans-serif; color: #000; text-align: center; }
            .logo { display: block; width: 16mm; height: 16mm; object-fit: contain; margin: 0 auto 1mm; filter: grayscale(1) contrast(2) brightness(.65); }
            .brand { font-size: 9pt; font-weight: 800; }
            .name { margin-top: 1mm; font-size: 8pt; font-weight: 700; }
            .qr { display: block; width: 27mm; height: 27mm; margin: 1.5mm auto; image-rendering: pixelated; }
            .details { font-size: 7pt; font-weight: 700; overflow-wrap: anywhere; }
            .price { margin-top: 1mm; font-size: 9pt; font-weight: 800; }
            @media screen { body { margin: 16px auto; } }
          </style>
        </head>
        <body>
          <img class="logo" src="${logoUrl}" alt="Bhumivera logo" />
          <div class="brand">BHUMIVERA ORGANICS</div>
          <div class="name">${escapeHtml(labelItem.name)}</div>
          <img class="qr" src="${labelQrUrl}" alt="Product QR code" />
          <div class="details">SKU: ${escapeHtml(labelItem.sku)}</div>
          <div class="details">Barcode: ${escapeHtml(labelItem.barcode)} | HSN: ${escapeHtml(labelItem.gstHsnCode || '30049011')}</div>
          <div class="details">Batch: ${escapeHtml(labelItem.batchNo || 'N/A')} | Exp: ${escapeHtml(labelItem.expiryDate || 'N/A')}</div>
          <div class="price">MRP: ₹${escapeHtml(labelItem.mrp)} (Offer: ₹${escapeHtml(labelItem.price)})</div>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    w.document.close();
  };

  const handleShareWhatsAppInvoice = sale => {
    if (!sale) return;
    const text = `Hello ${sale.cust?.name || 'Patron'} 🙏\n\nThank you for shopping at *${cfg.storeName}* ✨\n\n*Invoice #:* ${sale.invoiceNo}\n*Address:* ${sale.cust?.address || '-'}\n*Items:* ${(sale.items || []).map(i => `${i.name} (x${i.q})`).join(', ')}\n*Bill Total:* ₹${sale.billTotal}\n*Paid (${sale.paymentMode}):* ₹${sale.paid}\n*Khata Balance:* ₹${sale.newBal}\n\n_${cfg.tagline}_\nhttps://${cfg.website}`;
    const phone = (sale.cust?.phone || '').replace(/[^0-9]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`, '_blank');
  };

  // ==========================================================================
  // HANDLERS: KHATA, ADJUSTMENTS & RETURNS
  // ==========================================================================

  const [savingSettings, setSavingSettings] = useState(false);
  const handleSaveStoreSettings = async e => {
    if (e) e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await api.put(
        '/inventory-software/config',
        {
          storeName: cfg.storeName,
          tagline: cfg.tagline,
          address: cfg.address,
          phone: cfg.phone,
          email: cfg.email,
          website: cfg.website,
          gstin: cfg.gstin,
          upiId: cfg.upiId,
          taxRate: Number(cfg.taxRate) || 0,
          autoSyncWebsite: Boolean(cfg.autoSyncWebsite),
          posHoldReservation: Boolean(cfg.posHoldReservation),
          cats: cfg.cats,
          hid: cfg.hid,
          logo: cfg.logo,
        },
        reqConfig
      );
      if (res.data?.success) {
        showNotice('success', 'Store & Sync Settings saved successfully. Website sync is active.');
        setActiveModal(null);
        await fetchBootstrapData(true);
      } else {
        showNotice('error', res.data?.message || 'Could not save store settings.');
      }
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Failed to update store settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveCustomer = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/inventory-software/customers/save', editingCustomer, reqConfig);
      showNotice('success', res.data?.message || 'Customer profile saved.');
      setActiveModal(null);
      await fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not save customer.');
    }
  };

  const handleExecuteKhataTx = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/inventory-software/khata/transact', khataForm, reqConfig);
      showNotice('success', res.data?.message || 'Khata transaction recorded.');
      setActiveModal(null);
      await fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Khata transaction failed.');
    }
  };

  const handleExecuteStockAdjustment = async e => {
    e.preventDefault();
    const targetId = adjustmentForm.metaId || items[0]?.id;
    if (!targetId) return;
    try {
      const res = await api.post(
        '/inventory-software/stock/adjust',
        {
          metaId: targetId,
          operation: adjustmentForm.operation,
          quantity: Number(adjustmentForm.quantity) || 1,
          reason: adjustmentForm.reason,
          movementType:
            adjustmentForm.reason.toLowerCase().includes('damaged') ||
            adjustmentForm.reason.toLowerCase().includes('expired')
              ? 'DAMAGE_QUARANTINE'
              : 'STOCK_ADJUSTMENT',
          quarantineDelta:
            adjustmentForm.operation === 'subtract' &&
            (adjustmentForm.reason.toLowerCase().includes('damaged') ||
              adjustmentForm.reason.toLowerCase().includes('expired'))
              ? Number(adjustmentForm.quantity) || 1
              : 0,
        },
        reqConfig
      );
      showNotice('success', res.data?.message || 'Stock adjustment recorded & website updated!');
      await fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Stock adjustment failed.');
    }
  };

  const handleExecuteReturn = async mode => {
    const targetMetaId = returnForm.metaId || items[0]?.id;
    if (!targetMetaId) return;
    try {
      const res = await api.post(
        '/inventory-software/returns/process',
        {
          ...returnForm,
          metaId: targetMetaId,
          mode,
        },
        reqConfig
      );
      showNotice('success', res.data?.message || 'Return processed.');
      await fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Return processing failed.');
    }
  };

  const handleUpdateOnlineOrderStatus = async (orderId, status, extra = {}) => {
    let trackingNumber = extra.trackingNumber;
    let courier = extra.courier;
    let trackingUrl = extra.trackingUrl;
    if (status === 'shipped' && (!String(trackingNumber || '').trim() || !String(courier || '').trim() || !String(trackingUrl || '').trim())) {
      showNotice('error', 'Enter the courier, real tracking/AWB number, and tracking link at shipment handover. Packing does not need shipping details.');
      return false;
    }
    if (status === 'shipped') {
      try {
        const parsedTrackingUrl = new URL(String(trackingUrl).trim());
        if (!['http:', 'https:'].includes(parsedTrackingUrl.protocol)) throw new Error('unsupported protocol');
      } catch {
        showNotice('error', 'Enter a valid courier tracking link starting with https://.');
        return false;
      }
    }
    try {
      const res = await api.put(
        `/inventory-software/online-orders/${orderId}/dispatch-status`,
        {
          status,
          trackingNumber,
          courier: courier || undefined,
          trackingUrl: trackingUrl || undefined,
          estimatedDeliveryDate: extra.estimatedDeliveryDate,
          currentLocationCheckpoint: extra.currentLocationCheckpoint,
        },
        reqConfig
      );
      if (res.data?.emailSent === false && res.data?.emailError) {
        showNotice('error', `${res.data.message || 'Order status updated.'} Customer email was not sent: ${res.data.emailError}`);
      } else if (res.data?.warnings?.length) {
        showNotice('error', `${res.data.message || 'Order status updated.'} ${res.data.warnings.join(' ')}`);
      } else {
        showNotice('success', res.data?.message || `Order #${orderId} marked ${status.toUpperCase()}.`);
      }
      const refreshedData = await fetchBootstrapData(true);
      if (status === 'shipped') {
        const savedOrder = refreshedData?.onlineOrders?.find(order => String(order.id) === String(orderId)) ||
          onlineOrders.find(order => String(order.id) === String(orderId));
        if (savedOrder) {
          setFulfillmentQrOrder({
            ...savedOrder,
            status: 'shipped',
            courier: courier || savedOrder.courier,
            trackingNumber: trackingNumber || savedOrder.trackingNumber,
            trackingUrl: trackingUrl || savedOrder.trackingUrl,
          });
        } else {
          showNotice('error', `Shipment saved for order #${orderId}, but its invoice details could not be loaded. Refresh orders and open Invoice / QR.`);
        }
      }
      return true;
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      const failureStage = err.response?.data?.stage;
      showNotice('error', `${backendMessage || 'Could not update online order status.'}${failureStage ? ` (Stage: ${failureStage})` : ''}`);
      return false;
    }
  };

  const handleSaveOrderDetailsModal = async e => {
    e.preventDefault();
    if (!editingOrder) return;
    try {
      const res = await api.put(
        `/inventory-software/online-orders/${editingOrder.id}/edit`,
        {
          courier: editingOrder.courier,
          trackingNumber: editingOrder.trackingNumber,
          estimatedDeliveryDate: editingOrder.estimatedDeliveryDate,
          currentLocationCheckpoint: editingOrder.currentLocationCheckpoint,
          notes: editingOrder.notes,
          recipientName: editingOrder.customerName,
          recipientPhone: editingOrder.customerPhone,
          recipientAltPhone: editingOrder.customerAltPhone,
          line1: editingOrder.line1,
          line2: editingOrder.line2,
          landmark: editingOrder.landmark,
          city: editingOrder.city,
          state: editingOrder.state,
          pincode: editingOrder.pincode,
        },
        reqConfig
      );
      showNotice('success', res.data?.message || 'Order lifecycle & shipping label details updated!');
      setActiveModal(null);
      setEditingOrder(null);
      await fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Failed to update order details.');
    }
  };

  const handleBookCarrierLabel = async orderId => {
    try {
      const res = await api.post(
        `/inventory-software/online-orders/${orderId}/book-carrier-label`,
        carrierBookForm,
        reqConfig
      );
      showNotice('success', res.data?.message || 'Carrier shipment booked and AWB assigned!');
      await fetchBootstrapData(true);
      if (editingOrder && editingOrder.id === orderId && res.data?.label) {
        setEditingOrder(prev => ({
          ...prev,
          trackingNumber: res.data.label.tracking_number || prev.trackingNumber,
          courier: res.data.label.service_name || prev.courier,
        }));
      }
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not book carrier label.');
    }
  };

  const handlePrintOnlineOrderGstInvoice = ord => {
    if (!ord) return;
    const mappedSale = {
      invoiceNo: `BV/WEB/${new Date(ord.createdAt).getFullYear()}/${ord.orderNumber}`,
      date: ord.createdAt,
      paymentMode: `${ord.paymentMode} (${ord.paymentStatus})`,
      cashier: 'bhumivera.com',
      cust: {
        name: `${ord.customerName} (${ord.city || ''} ${ord.state || ''} - ${ord.pincode || ''})`,
        phone: ord.customerPhone || '-',
        gstin: '',
      },
      items: (ord.items || []).map(i => ({
        sku: i.sku,
        name: i.name,
        gstHsnCode: i.gstHsnCode || '30049011',
        q: i.quantity,
        uom: 'Pcs',
        p: i.price,
      })),
      subTotal: ord.subtotal || ord.total,
      extraTotal: ord.shippingCost || 0,
      discount: (Number(ord.discount) || 0) + (Number(ord.tierDiscount) || 0),
      taxRate: 5,
      tax: Math.round(((Number(ord.total) || 0) * 5) / 105),
      billTotal: ord.total,
      paid: ord.paymentStatus === 'paid' ? ord.total : 0,
      newBal: 0,
    };
    handlePrintA4Invoice(mappedSale);
  };

  const handleProcessRtoOrder = async (orderId, mode = 'RESTOCK') => {
    const confirmMsg =
      mode === 'RESTOCK'
        ? 'Confirm that this Undelivered (RTO) parcel returned intact? All items will be automatically restocked into live Website & Shop inventory.'
        : 'Confirm that this Undelivered (RTO) parcel was damaged in transit? Units will be moved to Quarantine Bay without adding to sellable stock.';
    if (!window.confirm(confirmMsg)) return;
    try {
      const res = await api.post(
        '/inventory-software/returns/rto-process',
        { orderId, mode, rtoReason },
        reqConfig
      );
      showNotice('success', res.data?.message || 'Undelivered RTO return processed!');
      await fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Failed to process RTO return.');
    }
  };

  const handleCreateDailySqlBackup = async (downloadFormat = null) => {
    setBackupBusy(true);
    try {
      const res = await api.post(
        '/inventory-software/backup/create',
        { triggerType: 'MANUAL', includePayload: Boolean(downloadFormat) },
        reqConfig
      );
      if (res.data?.snapshotObj) {
        try {
          localStorage.setItem('BV_DAILY_EMERGENCY_SQL_BACKUP', JSON.stringify(res.data.snapshotObj));
        } catch {}
      }
      if (downloadFormat === 'sql' && res.data?.sqlDump) {
        const blob = new Blob([res.data.sqlDump], { type: 'application/sql;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${res.data.backup?.backup_code || 'BhumiVera_SQL_Backup'}.sql`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } else if (downloadFormat === 'json' && res.data?.snapshotObj) {
        const blob = new Blob([JSON.stringify(res.data.snapshotObj, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${res.data.backup?.backup_code || 'BhumiVera_Snapshot'}.avbak.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
      showNotice('success', res.data?.message || 'Daily SQL & Snapshot backup created and synced with Railway & Vercel!');
      await fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Backup creation failed.');
    } finally {
      setBackupBusy(false);
    }
  };

  const handleDownloadVaultBackup = async (backupId, backupCode, format = 'sql') => {
    try {
      const res = await api.get(`/inventory-software/backup/download/${backupId}`, {
        ...reqConfig,
        params: { format },
        responseType: 'blob',
      });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = format === 'json' ? `${backupCode}.avbak.json` : `${backupCode}.sql`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      showNotice('error', 'Could not download backup file.');
    }
  };

  const handleRestoreFromVault = async backup => {
    if (
      !window.confirm(
        `Restore Full Database Backup "${backup.backup_code}" (${backup.backup_date})? This will restore all ${backup.rows_count} records across ${backup.tables_count} MySQL tables on Railway and sync Vercel immediately.`
      )
    )
      return;
    setBackupBusy(true);
    try {
      const res = await api.post(
        '/inventory-software/backup/restore',
        { backupId: backup.id },
        reqConfig
      );
      showNotice('success', res.data?.message || 'Database restored and synced!');
      await fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Database restore failed.');
    } finally {
      setBackupBusy(false);
    }
  };

  const handleUploadRestoreBackupFile = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (
      !window.confirm(
        `Restore Railway MySQL database from "${file.name}"? All products, stock, orders, users, and settings in the backup will be restored.`
      )
    )
      return;
    const reader = new FileReader();
    reader.onload = async ev => {
      setBackupBusy(true);
      try {
        const content = String(ev.target.result || '');
        const isSql = file.name.toLowerCase().endsWith('.sql') || content.trim().startsWith('--') || content.includes('CREATE TABLE');
        const payload = isSql ? { sqlDump: content } : { snapshotObj: JSON.parse(content) };
        const res = await api.post('/inventory-software/backup/restore', payload, reqConfig);
        showNotice('success', res.data?.message || 'Database restored from file and synced with Vercel & Railway!');
        await fetchBootstrapData(true);
      } catch (err) {
        showNotice('error', err.response?.data?.message || 'Failed to restore backup file: ' + err.message);
      } finally {
        setBackupBusy(false);
      }
    };
    reader.readAsText(file);
  };

  const handleExportOnlineOrdersExcel = () => {
    const rows = lifecycleOrders.map(o => ({
      'Order #': o.orderNumber,
      'Order Date': new Date(o.createdAt).toLocaleString(),
      'Customer Name': o.customerName,
      'Customer Phone': o.customerPhone,
      'Shipping Address': o.fullFormattedAddress,
      City: o.city,
      State: o.state,
      Pincode: o.pincode,
      'Ordered Items': (o.items || []).map(i => `${i.name} (x${i.quantity})`).join('; '),
      'Total (INR)': o.total,
      'Payment Mode': o.paymentMode,
      'Payment Status': o.paymentStatus,
      'Order Status': o.status,
      'Courier Partner': o.courier || '-',
      'Tracking AWB': o.trackingNumber || '-',
      'Estimated Delivery Date': o.estimatedDeliveryDate || '-',
      'Live Location Checkpoint': o.currentLocationCheckpoint || '-',
      'RTO Status': o.rtoRestockMode || 'NONE',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Online_Orders_Lifecycle');
    XLSX.writeFile(wb, `BhumiVera_Orders_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // ==========================================================================
  // EXCEL IMPORT / EXPORT & SNAPSHOT BACKUP (.avbak)
  // ==========================================================================

  const handleExportInventoryExcel = () => {
    const rows = items.map(i => ({
      SKU: i.sku,
      Barcode: i.barcode,
      'Item Name': i.name,
      Category: i.cat,
      UOM: i.uom,
      'Live Website Stock': i.qty,
      'Reserved Online': i.onlineReservedQty,
      'Cost Price (INR)': i.costPrice,
      'MRP (INR)': i.mrp,
      'Selling Price (INR)': i.price,
      'Stock Valuation (INR)': i.qty * i.price,
      'Batch Number': i.batchNo,
      'Expiry Date': i.expiryDate,
      'Sold Offline': i.soldOfflineQty,
      'Sold Online': i.soldOnlineQty,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Omnichannel_Inventory');
    XLSX.writeFile(wb, `BhumiVera_Inventory_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleImportInventoryExcel = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async ev => {
      try {
        const data = new Uint8Array(ev.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        let importedCount = 0;
        for (const row of json) {
          const name = row['Item Name'] || row.Name || row.name;
          if (!name) continue;
          await api.post(
            '/inventory-software/items/save',
            {
              name,
              sku: row.SKU || row.sku || '',
              barcode: row.Barcode || row.barcode || '',
              cat: row.Category || 'Botanical Formulations',
              qty: Number(row['Live Website Stock'] ?? row['Current Stock'] ?? row.Qty ?? 0),
              costPrice: Number(row['Cost Price (INR)'] ?? row['Cost Price'] ?? 0),
              mrp: Number(row['MRP (INR)'] ?? row.MRP ?? 0),
              price: Number(row['Selling Price (INR)'] ?? row['Unit Price'] ?? row.Price ?? 0),
              syncToWebsite: true,
            },
            reqConfig
          );
          importedCount++;
        }
        showNotice('success', `Imported and synced ${importedCount} items to live website!`);
        await fetchBootstrapData(true);
      } catch (err) {
        showNotice('error', 'Failed to import Excel file: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSaveSnapshotBackup = () => {
    const payload = {
      version: '10X-OMNICHANNEL-2.0',
      exportedAt: new Date().toISOString(),
      store: cfg,
      items,
      customers,
      sales,
      movements,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BhumiVera_InventorySnapshot_${new Date().toISOString().slice(0, 10)}.avbak.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showNotice('success', 'Saved encrypted daily snapshot (.avbak.json).');
  };

  const handleOpenLabelGenerator = async item => {
    setLabelItem(item);
    try {
      const verifyUrl = `https://www.bhumivera.com/product/${item.slug || item.sku}`;
      const qr = await QRCode.toDataURL(verifyUrl, { width: 160, margin: 1 });
      setLabelQrUrl(qr);
    } catch {
      setLabelQrUrl('');
    }
    setActiveModal('label');
  };

  // ==========================================================================
  // VIEW: LOGIN PORTAL (bhumivera.com/inventorysoftware)
  // ==========================================================================
  if (!authToken) {
    return (
      <div className="admin-theme inventory-shell min-h-screen bg-[#071a12] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-900 border-2 border-[#d4af37]/50 p-2 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
              <img
                src="/assets/bhumivera-luxury-crest-logo.webp"
                onError={e => {
                  e.currentTarget.style.display = 'none';
                }}
                alt="Bhumivera"
                className="w-full h-full object-contain rounded-xl"
              />
              <Warehouse className="w-9 h-9 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-black tracking-wider uppercase text-white">
              BhumiVera <span className="text-emerald-400">10X Inventory &amp; POS</span>
            </h1>
            <p className="text-xs text-slate-400">
              Inventory Management, Live Website Stock &amp; Retail POS
            </p>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
              www.bhumivera.com/inventorysoftware
            </div>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-7 shadow-2xl space-y-5">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Staff Sign-In
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Sign in with your Account ID provisioned at <code className="text-amber-300">/superadminsupport</code>
                </p>
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Account ID / Username
                </label>
                <input
                  type="text"
                  required
                  value={loginForm.username}
                  onChange={e => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="e.g. admin, manager, cashier1"
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {requires2FA && (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                  <label className="block font-bold uppercase tracking-wider text-emerald-300">
                    6-Digit 2FA Authenticator Code (TOTP)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={loginForm.totpCode}
                    onChange={e => setLoginForm(prev => ({ ...prev, totpCode: e.target.value }))}
                    placeholder="000000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-emerald-500 text-center font-mono text-base tracking-[0.3em] text-white"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black uppercase tracking-wider text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {loginLoading ? 'Authenticating…' : requires2FA ? 'Verify 2FA & Launch Suite' : 'Sign In to Inventory Suite'}
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800" />
              <span className="flex-shrink mx-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                Or Passwordless Biometrics
              </span>
              <div className="flex-grow border-t border-slate-800" />
            </div>

            <button
              type="button"
              onClick={handlePasskeyLogin}
              className="w-full py-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-emerald-300 font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <Fingerprint className="w-4 h-4 text-emerald-400" />
              Sign In with Biometric Passkey (FIDO2)
            </button>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <Link to="/superadminsupport" className="text-amber-300 hover:underline flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Manage Staff IDs (/superadminsupport)
              </Link>
              <Link to="/admin" className="hover:text-white">
                → Executive Admin
              </Link>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-400 text-center space-y-1">
            <div className="font-bold text-slate-300">Default Master Credentials (or create new IDs in /superadminsupport):</div>
            <div>
              ID: <code className="text-emerald-400 font-mono">admin</code> | Pass:{' '}
              <code className="text-emerald-400 font-mono">Admin@123</code> &bull; ID:{' '}
              <code className="text-amber-300 font-mono">manager</code> | Pass:{' '}
              <code className="text-amber-300 font-mono">Manager@123</code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // MAIN 10X INVENTORY & POS WORKSPACE
  // ==========================================================================
  const navGroups = [
    {
      title: '1. Orders & Dispatch',
      items: [
        { id: 'dash', label: 'Inventory Overview', icon: Activity },
        { id: 'online', label: `Fulfillment (${dashMetrics.pendingDispatch || dashMetrics.pendingOnlineDispatch || 0})`, icon: Globe },
        { id: 'labels', label: 'Carrier Labels & Manifests', icon: Printer },
        { id: 'ret', label: 'RTO & Return QC', icon: RotateCcw },
      ],
    },
    {
      title: '2. Stock & Retail Billing',
      items: [
        { id: 'inv', label: 'Master Inventory', icon: Boxes },
        { id: 'sale', label: 'Retail POS Terminal', icon: ShoppingCart },
      ],
    },
    {
      title: '3. PWA Workroom',
      items: [
        { id: 'workroom', label: 'PWA Staff & Live Activity', icon: Users },
      ],
    },
    {
      title: '4. Reports & Ledger',
      items: [
        { id: 'rep', label: 'Movement Ledger & Excel', icon: FileSpreadsheet },
        { id: 'logs', label: 'Staff Audit Trail', icon: History },
      ],
    },
  ];

  return (
    <div className="admin-theme inventory-shell h-screen w-full overflow-hidden flex bg-slate-100 text-slate-900 font-sans text-[13px]">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-[#071a12] text-slate-300 flex flex-col border-r border-slate-800 shrink-0 select-none">
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black">
            BV
          </div>
          <div className="min-w-0">
            <div className="font-black text-white tracking-wider text-sm uppercase truncate">BHUMIVERA 10X</div>
            <div className="text-[10px] text-emerald-400 font-mono truncate">Inventory • Fulfillment • POS</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
          {navGroups.map(group => (
            <div key={group.title} className="space-y-1">
              <div className="px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                {group.title}
              </div>
              {group.items.map(nav => {
                const Icon = nav.icon;
                const active = activeView === nav.id;
                return (
                  <button
                    key={nav.id}
                    type="button"
                    onClick={() => setActiveView(nav.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      active
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm'
                        : 'text-slate-400 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{nav.label}</span>
                  </button>
                );
              })}
            </div>
          ))}

          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <div className="px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              Administration
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('settings')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800/70 hover:text-white"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Store &amp; Sync Settings</span>
            </button>
            <Link
              to="/superadminsupport"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 hover:bg-amber-500/15"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Staff IDs (/superadminsupport)</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/admin"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800/70 hover:text-white"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Website Admin (/admin)</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setActiveModal('profile')}
            className="flex items-center gap-2.5 min-w-0 text-left hover:bg-slate-800/60 p-1.5 rounded-xl flex-1"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0">
              {(viewer?.fullName || viewer?.username || 'A')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{viewer?.fullName || viewer?.username || 'Admin'}</div>
              <div className="text-[10px] text-emerald-400 font-mono uppercase truncate">
                @{viewer?.username || 'admin'} • {viewer?.role || 'admin'}
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-400"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-base font-black uppercase tracking-wide text-slate-900 flex items-center gap-2">
                {navGroups.flatMap(g => g.items).find(i => i.id === activeView)?.label || 'Executive Dashboard'}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live 2-Way Sync with bhumivera.com
                </span>
                <span>&bull;</span>
                <span className="font-mono">
                  Hub: {viewer?.assignedHub || 'Bhumivera Flagship Hub — Asansol'}
                </span>
                {lastSyncedAt && (
                  <>
                    <span>&bull;</span>
                    <span>Synced {new Date(lastSyncedAt).toLocaleTimeString()}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleOpenBatchQrModal()}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-600 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              title="Generate & Print Batch Barcodes / QR Stickers"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              Batch QR Studio
            </button>

            <button
              type="button"
              onClick={() => fetchBootstrapData()}
              className="px-3 py-2 rounded-xl bg-[#0c261b] hover:bg-[#133827] text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              Sync Live Website Stock
            </button>

            <button
              type="button"
              onClick={() => setActiveView('sale')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md transition"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              New POS Bill
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('profile')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
              Passkey &amp; 2FA
            </button>
          </div>
        </header>

        {/* NOTIFICATION BANNER */}
        {banner && (
          <div
            className={`px-6 py-2.5 text-xs font-bold flex items-center justify-between border-b ${
              banner.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-emerald-50 text-emerald-900 border-emerald-200'
            }`}
          >
            <span className="flex items-center gap-2">
              {banner.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              {banner.message}
            </span>
            <button type="button" onClick={() => setBanner(null)} className="text-slate-500 hover:text-slate-800">
              ✕
            </button>
          </div>
        )}

        {/* CONTENT SCROLL AREA */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeView === 'dash' && (
            <DashboardView
              dashMetrics={dashMetrics}
              velocityData={velocityData}
              setActiveView={setActiveView}
              onOpenWavePicklist={(orderIds) => {
                api.post('/inventory-software/fulfillment/wave-picklist', { orderIds }, reqConfig)
                  .then(r => setActiveWavePicklist(r.data?.picklist))
                  .catch(err => showNotice('error', err.response?.data?.message || 'Wave picklist failed.'));
              }}
            />
          )}

          {activeView === 'online' && (
            <OrderFulfillmentView
              orders={onlineOrders}
              orderLocks={orderLocks}
              operatorName={operatorName}
              onUpdateOrderStatus={handleUpdateOnlineOrderStatus}
              onOpenFulfillmentQr={order => setFulfillmentQrOrder(order)}
              onOpenWavePicklist={(orderIds) => {
                api.post('/inventory-software/fulfillment/wave-picklist', { orderIds }, reqConfig)
                  .then(r => setActiveWavePicklist(r.data?.picklist))
                  .catch(err => showNotice('error', err.response?.data?.message || 'Wave picklist failed.'));
              }}
              onOpenReturnQc={(order) => setReturnQcOrder(order)}
              syncing={syncing}
              onRefresh={() => fetchBootstrapData(true)}
            />
          )}

          {activeView === 'sale' && (
            <PosTerminalView
              items={items}
              posCart={posCart}
              setPosCart={setPosCart}
              onCheckout={handlePosCheckout}
              onScanCode={handleManualPosScan}
              checkoutLoading={posCheckoutBusy}
              upiQrDataUrl={upiQrDataUrl}
              posPaymentMode={posPaymentMode}
              setPosPaymentMode={setPosPaymentMode}
              posPaidAmount={posPaidAmount}
              setPosPaidAmount={setPosPaidAmount}
              posCustomerForm={posCustomerForm}
              setPosCustomerForm={setPosCustomerForm}
              posDiscount={posDiscount}
              setPosDiscount={setPosDiscount}
              posTaxRate={cfg.taxRate ?? 5}
              operatorName={operatorName}
            />
          )}

          {activeView === 'inv' && (
            <CatalogStockView
              items={items}
              velocityData={velocityData}
              onGenerateBatchQr={(item) => handleOpenBatchQrModal(item)}
              onEditItem={(item) => {
                setEditingItem(item || {
                  name: '',
                  sku: '',
                  barcode: '',
                  cat: 'Luxury Facial Cleansers',
                  uom: 'Pcs',
                  qty: 0,
                  costPrice: 0,
                  mrp: 0,
                  price: 0,
                  gstHsnCode: '30049011',
                  gstRate: 5,
                  minStock: 15,
                });
                setActiveModal('item');
              }}
              onAdjustStock={(item) => {
                setAdjustmentForm({
                  metaId: item.id,
                  operation: 'add',
                  quantity: 10,
                  reason: 'Stock replenishment inward',
                });
                setActiveModal('adjust');
              }}
              onPrintBarcode={handleOpenLabelGenerator}
            />
          )}

          {activeView === 'labels' && (
            <ShippingLabelsView
              orders={onlineOrders}
              onOpenManifest={(orderIds, courier) => {
                api.post('/inventory-software/fulfillment/manifest', { orderIds, courier }, reqConfig)
                  .then(r => setActiveManifest(r.data?.manifest))
                  .catch(err => showNotice('error', err.response?.data?.message || 'Manifest failed.'));
              }}
              carrierBookForm={carrierBookForm}
              onBookCarrierLabel={async (orderId, form) => {
                try {
                  const res = await api.post(`/inventory-software/online-orders/${orderId}/book-carrier-label`, form, reqConfig);
                  showNotice('success', res.data?.message || 'Label booked.');
                  await fetchBootstrapData(true);
                } catch (err) {
                  showNotice('error', err.response?.data?.message || 'Booking failed.');
                }
              }}
            />
          )}

          {activeView === 'ret' && (
            <RtoReturnsView
              orders={onlineOrders}
              onOpenReturnQc={(order) => setReturnQcOrder(order)}
              onRefresh={() => fetchBootstrapData(true)}
            />
          )}

          {activeView === 'workroom' && (
            <WorkroomView authToken={authToken} viewer={viewer} />
          )}

          {(activeView === 'rep' || activeView === 'logs' || activeView === 'trans') && (
            <ReportsLogsView
              movements={movements}
              logs={logs}
              items={items}
            />
          )}
        </main>
      </div>

      {/* =====================================================================
          MODAL: FIRST-TIME LOGIN SECURITY ONBOARDING WIZARD
         ===================================================================== */}
      {showOnboardingModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 text-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="text-base font-black uppercase">First-Time Security Onboarding</h3>
                  <p className="text-[11px] text-slate-400">
                    Welcome @{viewer?.username}! Enroll your Biometric Passkey &amp; 2FA Authenticator.
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setShowOnboardingModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-emerald-400">Step 1: Set Your Personal Password (Optional)</div>
                <input
                  type="password"
                  value={onboardingNewPass}
                  onChange={e => setOnboardingNewPass(e.target.value)}
                  placeholder="Enter new personal password (min 6 chars)…"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-blue-400">Step 2: Register Biometric Passkey (FIDO2)</div>
                  <div className="text-[11px] text-slate-400">Enable 1-click TouchID / FaceID / Windows Hello login</div>
                </div>
                <button
                  type="button"
                  onClick={handleEnrollPasskey}
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  + Enroll Passkey
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-amber-400">Step 3: 2FA Authenticator App (TOTP)</div>
                    <div className="text-[11px] text-slate-400">Google Authenticator / Microsoft Authenticator</div>
                  </div>
                  {!totpSetupData && (
                    <button
                      type="button"
                      onClick={handleStart2FASetup}
                      className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                    >
                      Generate 2FA QR
                    </button>
                  )}
                </div>

                {totpSetupData && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-3">
                    <div className="flex items-center gap-4">
                      {totpQrDataUrl && <img src={totpQrDataUrl} alt="2FA QR" className="w-28 h-28 rounded bg-white p-1" />}
                      <div className="space-y-1 text-[11px]">
                        <div className="text-slate-400">Scan QR or enter secret key manually:</div>
                        <code className="block p-1.5 rounded bg-black text-emerald-400 font-mono break-all">
                          {totpSetupData.secret}
                        </code>
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            maxLength={6}
                            value={totpVerifyCode}
                            onChange={e => setTotpVerifyCode(e.target.value)}
                            placeholder="6-digit code"
                            className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono w-28"
                          />
                          <button
                            type="button"
                            onClick={handleConfirm2FAEnable}
                            className="px-3 py-1.5 rounded bg-emerald-500 text-slate-950 font-bold"
                          >
                            Verify
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCompleteOnboarding}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase text-xs"
              >
                Save &amp; Enter Inventory Suite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: STORE & SYNC SETTINGS (WEBSITE 2-WAY SYNC, GSTIN, HSN, UPI)
         ===================================================================== */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveStoreSettings}
            className="bg-[#0c261b] text-white border border-emerald-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto text-xs"
          >
            <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase text-white tracking-wide">
                    Store Profile &amp; Synchronization Command
                  </h3>
                  <p className="text-[11px] text-emerald-300/80 font-medium">
                    Omnichannel 2-way live sync with bhumivera.com, GSTIN, HSN codes &amp; UPI terminal
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-300 hover:text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition"
              >
                ✕
              </button>
            </div>

            {/* Section 1: Store Identity */}
            <div className="space-y-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-emerald-500/20 pb-1">
                <span>1. Legal Store Identity &amp; Location</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">
                    Store Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={cfg.storeName || ''}
                    onChange={e => setCfg(prev => ({ ...prev, storeName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#071711] text-white border border-emerald-500/40 font-bold focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={cfg.tagline || ''}
                    onChange={e => setCfg(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#071711] text-white border border-emerald-500/40 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">
                  Physical Hub / Warehouse Address *
                </label>
                <input
                  type="text"
                  required
                  value={cfg.address || ''}
                  onChange={e => setCfg(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#071711] text-white border border-emerald-500/40 font-medium focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">
                    Store Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={cfg.phone || ''}
                    onChange={e => setCfg(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#071711] text-white border border-emerald-500/40 font-mono focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">
                    Concierge / Billing Email
                  </label>
                  <input
                    type="email"
                    value={cfg.email || ''}
                    onChange={e => setCfg(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#071711] text-white border border-emerald-500/40 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">
                    Official Website Domain
                  </label>
                  <input
                    type="text"
                    value={cfg.website || ''}
                    onChange={e => setCfg(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#071711] text-white border border-emerald-500/40 font-mono focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Taxation & HSN */}
            <div className="space-y-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-emerald-500/20 pb-1">
                <span>2. GSTIN, Default HSN &amp; Tax Structure</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">
                    GSTIN Identification *
                  </label>
                  <input
                    type="text"
                    required
                    value={cfg.gstin || ''}
                    onChange={e => setCfg(prev => ({ ...prev, gstin: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#071711] text-white border border-emerald-500/40 font-mono font-bold focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">
                    Default GST Tax Rate (%)
                  </label>
                  <select
                    value={cfg.taxRate ?? 5}
                    onChange={e => setCfg(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#071711] text-white border border-emerald-500/40 font-bold focus:border-emerald-400 focus:outline-none"
                  >
                    <option value={0}>0% (Tax Exempt)</option>
                    <option value={5}>5% (Ayurvedic &amp; Botanical Medicaments)</option>
                    <option value={12}>12% (Standard Ayurvedic)</option>
                    <option value={18}>18% (Luxury Cosmetics &amp; Soaps)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">
                    Primary HSN Code
                  </label>
                  <input
                    type="text"
                    defaultValue="30049011"
                    disabled
                    className="w-full px-3 py-2 rounded-xl bg-[#071711]/60 text-emerald-300 border border-emerald-500/30 font-mono font-bold cursor-not-allowed"
                    title="HSN 30049011: Ayurvedic Medicaments & Formulations"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Retail POS UPI Payment Gateway */}
            <div className="space-y-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-emerald-500/20 pb-1">
                <span>3. POS Terminal &amp; Merchant UPI Gateway</span>
              </div>
              <div>
                <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">
                  Merchant UPI VPA ID (For Instant Dynamic QR Code at POS Checkout) *
                </label>
                <input
                  type="text"
                  required
                  value={cfg.upiId || ''}
                  onChange={e => setCfg(prev => ({ ...prev, upiId: e.target.value }))}
                  placeholder="e.g. bhumivera@okhdfcbank"
                  className="w-full px-3 py-2 rounded-xl bg-[#071711] text-white border border-emerald-500/40 font-mono font-bold focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Section 4: Live Website 2-Way Sync & Strategy */}
            <div className="space-y-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-emerald-500/20 pb-1">
                <span>4. Omnichannel Live Stock Automation &amp; Allocation</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-[#071711] border border-emerald-500/30 cursor-pointer hover:border-emerald-400 transition">
                  <input
                    type="checkbox"
                    checked={Boolean(cfg.autoSyncWebsite)}
                    onChange={e => setCfg(prev => ({ ...prev, autoSyncWebsite: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-[#0c261b] border-emerald-500/50"
                  />
                  <div>
                    <div className="font-bold text-white text-xs">2-Way Live Sync with Website</div>
                    <div className="text-[10px] text-slate-300">
                      Keep bhumivera.com stock in sync with inventory changes and POS sales
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-[#071711] border border-emerald-500/30 cursor-pointer hover:border-emerald-400 transition">
                  <input
                    type="checkbox"
                    checked={Boolean(cfg.posHoldReservation)}
                    onChange={e => setCfg(prev => ({ ...prev, posHoldReservation: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-[#0c261b] border-emerald-500/50"
                  />
                  <div>
                    <div className="font-bold text-white text-xs">POS Hold Stock Reservation</div>
                    <div className="text-[10px] text-slate-300">
                      Prevent overselling by holding items while POS cart is active
                    </div>
                  </div>
                </label>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-300 uppercase">Batch Allocation Strategy:</span>
                  <p className="text-[10px] text-slate-300">
                    Strict FIFO / FEFO (First-In, First-Out &amp; First-Expired, First-Out) enforced automatically.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[11px] font-black">
                  FEFO ACTIVE
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-emerald-500/30">
              <button
                type="submit"
                disabled={savingSettings}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black uppercase tracking-wider text-xs shadow-lg shadow-emerald-950/50 transition disabled:opacity-50"
              >
                {savingSettings ? 'Saving & Syncing...' : 'Save Settings & Sync Live Website'}
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-6 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 border border-slate-600 font-bold text-xs transition shadow-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================================
          MODAL: ADD / EDIT INVENTORY ITEM
         ===================================================================== */}
      {activeModal === 'item' && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveItemModal}
            className="bg-[#0c261b] text-white border border-emerald-500/40 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto text-xs"
          >
            <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
              <h3 className="text-base font-black uppercase text-white tracking-wide">
                {editingItem.id ? 'Edit Formulation & Sync Website Stock' : 'Add New Formulation / SKU'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-300 hover:text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">
                Product / Formulation Name *
              </label>
              <input
                type="text"
                required
                value={editingItem.name}
                onChange={e => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-[#071711] text-white border border-emerald-500/40 font-bold focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">SKU Code</label>
                <input
                  type="text"
                  value={editingItem.sku}
                  onChange={e => setEditingItem(prev => ({ ...prev, sku: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#071711] text-white border border-emerald-500/40 font-mono focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">Barcode (EAN-13)</label>
                <input
                  type="text"
                  value={editingItem.barcode}
                  onChange={e => setEditingItem(prev => ({ ...prev, barcode: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#071711] text-white border border-emerald-500/40 font-mono focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">Category</label>
                <select
                  value={editingItem.cat}
                  onChange={e => setEditingItem(prev => ({ ...prev, cat: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#071711] text-white border border-emerald-500/40 font-semibold focus:border-emerald-400 focus:outline-none"
                >
                  {(cfg.cats || []).map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#071711] border border-emerald-500/30">
              <div>
                <label className="block font-bold uppercase text-emerald-400 text-[11px] mb-1">Total Stock Qty</label>
                <input
                  type="number"
                  min={0}
                  value={editingItem.qty}
                  onChange={e => {
                    const total = Math.max(0, parseInt(e.target.value, 10) || 0);
                    setEditingItem(prev => ({ ...prev, qty: total }));
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-[#0c261b] text-emerald-300 border border-emerald-500/40 font-mono font-black text-sm"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-emerald-400 text-[11px] mb-1">Safety Buffer</label>
                <input
                  type="number"
                  min={0}
                  value={editingItem.safetyBufferStock || 0}
                  onChange={e => setEditingItem(prev => ({ ...prev, safetyBufferStock: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-[#0c261b] text-white border border-emerald-500/40 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              <div>
                <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">Unit Cost (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={editingItem.costPrice}
                  onChange={e => setEditingItem(prev => ({ ...prev, costPrice: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#071711] text-white border border-emerald-500/40 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">MRP (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={editingItem.mrp}
                  onChange={e => setEditingItem(prev => ({ ...prev, mrp: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#071711] text-white border border-emerald-500/40 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">Sale Price (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={editingItem.price}
                  onChange={e => setEditingItem(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#071711] text-white border border-emerald-500/40 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">GST Rate (%)</label>
                <input
                  type="number"
                  min={0}
                  value={editingItem.gstRate}
                  onChange={e => setEditingItem(prev => ({ ...prev, gstRate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#071711] text-white border border-emerald-500/40 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">HSN Code</label>
                <input
                  type="text"
                  value={editingItem.gstHsnCode || '30049011'}
                  onChange={e => setEditingItem(prev => ({ ...prev, gstHsnCode: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#071711] text-emerald-300 border border-emerald-500/40 font-mono font-bold"
                  placeholder="30049011"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">Batch Number</label>
                <input
                  type="text"
                  value={editingItem.batchNo || ''}
                  onChange={e => setEditingItem(prev => ({ ...prev, batchNo: e.target.value }))}
                  placeholder="Stock received"
                  className="w-full px-3 py-2 rounded-xl bg-[#071711] text-white border border-emerald-500/40 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-emerald-300 text-[11px] mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={editingItem.expiryDate || ''}
                  onChange={e => setEditingItem(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#071711] text-white border border-emerald-500/40 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-emerald-500/30">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black uppercase tracking-wider text-xs shadow-lg shadow-emerald-950/50 transition"
              >
                Save &amp; Sync to Live Website
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-6 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 border border-slate-600 font-bold text-xs transition shadow-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================================
          MODAL: INVOICE SUCCESS & PRINT / WHATSAPP SHARE
         ===================================================================== */}
      {activeModal === 'invoice-success' && lastCompletedSale && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c261b] text-white border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black uppercase text-white tracking-wide">
              Invoice {lastCompletedSale.invoiceNo} Generated!
            </h3>
            <p className="text-xs text-slate-300">
              Live website stock on <code className="text-emerald-400 font-bold font-mono">bhumivera.com</code> has been
              atomically deducted so online patrons see updated stock immediately.
            </p>
            <div className="p-3.5 rounded-xl bg-[#071711] border border-emerald-500/30 text-left font-mono text-xs space-y-1.5">
              <div className="text-slate-300">Customer: <b className="text-white">{lastCompletedSale.cust?.name || 'Walk-in Retail Patron'}</b></div>
              <div className="text-slate-300">Bill Total: <b className="text-emerald-400 font-bold">₹{lastCompletedSale.billTotal}</b></div>
              <div className="text-slate-300">Paid ({lastCompletedSale.paymentMode}): <b className="text-white">₹{lastCompletedSale.paid}</b></div>
            </div>
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleShareWhatsAppInvoice(lastCompletedSale)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition"
              >
                <Send className="w-4 h-4" /> Share Official Invoice on WhatsApp
              </button>
              <button
                type="button"
                onClick={() => handlePrintA4Invoice(lastCompletedSale)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Printer className="w-4 h-4" /> Print / Save Official A4 GST Tax Invoice (with HSN)
              </button>
              <button
                type="button"
                onClick={() => handlePrintThermal(lastCompletedSale)}
                className="w-full py-2.5 rounded-xl bg-[#071711] hover:bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <Receipt className="w-4 h-4" /> Print 80mm Thermal POS Receipt
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-600 text-xs font-bold transition shadow-sm"
              >
                Close &amp; Start Next Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: VIEW / CANCEL EXISTING INVOICE
         ===================================================================== */}
      {activeModal === 'view-sale' && viewingSale && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="pos-invoice-modal bg-[#0c261b] text-white border border-emerald-500/40 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl text-sm max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black uppercase">Invoice #{viewingSale.invoiceNo}</h3>
              <button type="button" onClick={() => setActiveModal(null)}>
                ✕
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border space-y-1">
              <div>
                <b>Customer:</b> {viewingSale.cust?.name} ({viewingSale.cust?.phone})
              </div>
              <div>
                <b>Date:</b> {new Date(viewingSale.date).toLocaleString()}
              </div>
              <div>
                <b>Status:</b> <span className="uppercase font-bold">{viewingSale.status || 'completed'}</span>
              </div>
            </div>
            <table className="w-full border">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2 text-center">Qty</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(viewingSale.items || []).map((i, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-bold">{i.name}</td>
                    <td className="p-2 text-center font-mono">{i.q}</td>
                    <td className="p-2 text-right font-mono font-bold">₹{Number(i.p) * Number(i.q)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between font-black text-sm pt-2 border-t">
              <span>Grand Total:</span>
              <span className="text-emerald-700">₹{viewingSale.billTotal}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => handlePrintA4Invoice(viewingSale)}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold"
              >
                Print A4 Invoice
              </button>
              <button
                type="button"
                onClick={() => handlePrintThermal(viewingSale)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold"
              >
                Print 80mm Receipt
              </button>
              {viewingSale.status !== 'cancelled' && (
                <button
                  type="button"
                  onClick={() => handleCancelInvoiceAndRestock(viewingSale.id)}
                  className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200"
                >
                  Void Invoice &amp; Restock Items to Website
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      

      

      {/* =====================================================================
          MODAL: BARCODE / QR SHELF LABEL GENERATOR
         ===================================================================== */}
      {activeModal === 'label' && labelItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-black uppercase">Printable Product QR Label</h3>
              <button type="button" onClick={() => setActiveModal(null)}>
                ✕
              </button>
            </div>
            <div className="p-4 border-2 border-dashed border-slate-400 rounded-xl space-y-2">
              <img
                src="/logo.webp"
                alt="Bhumivera logo"
                className="w-16 h-16 object-contain mx-auto grayscale contrast-200"
              />
              <div className="font-black text-slate-900 text-sm uppercase">BHUMIVERA ORGANICS</div>
              <div className="font-bold text-slate-800">{labelItem.name}</div>
              {labelQrUrl && <img src={labelQrUrl} alt="QR" className="w-32 h-32 mx-auto" />}
              <div className="font-mono font-bold text-xs">
                SKU: {labelItem.sku}
              </div>
              <div className="font-mono text-[11px] text-slate-600">
                Barcode: {labelItem.barcode} • Batch: {labelItem.batchNo || 'N/A'}
              </div>
              <div className="font-black text-base text-emerald-700">
                MRP: ₹{labelItem.mrp} (Offer: ₹{labelItem.price})
              </div>
            </div>
            <button
              type="button"
              onClick={handlePrintShelfLabel}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold"
            >
              Print Shelf Label
            </button>
          </div>
        </div>
      )}

      

      

      {/* =====================================================================
          MODAL: USER PROFILE, BIOMETRIC PASSKEYS & 2FA AUTHENTICATOR
         ===================================================================== */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black uppercase flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Staff Profile &amp; Security Center
              </h3>
              <button type="button" onClick={() => setActiveModal(null)}>
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 text-sm">{viewer?.fullName || viewer?.username}</div>
                <div className="font-mono text-slate-500">
                  @{viewer?.username} • {viewer?.assignedHub}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                {viewer?.role || 'admin'}
              </span>
            </div>

            {/* Passkeys */}
            <div className="p-4 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4 text-emerald-600" /> Biometric Passkeys (FIDO2)
                </div>
                <button
                  type="button"
                  onClick={handleEnrollPasskey}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold"
                >
                  + Register Device
                </button>
              </div>
              {(viewer?.passkeys || []).length === 0 ? (
                <p className="text-slate-400">No biometric passkey registered yet.</p>
              ) : (
                (viewer?.passkeys || []).map(pk => (
                  <div key={pk.id} className="flex items-center justify-between py-1.5 border-t border-slate-100">
                    <span className="font-semibold text-slate-700">{pk.name}</span>
                    <button
                      type="button"
                      onClick={async () => {
                        await api.delete(`/inventory-software/auth/passkey/${pk.id}`, reqConfig);
                        fetchBootstrapData(true);
                      }}
                      className="text-rose-600 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* 2FA Authenticator */}
            <div className="p-4 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-blue-600" /> 2FA Authenticator (TOTP)
                </div>
                {viewer?.totpEnabled ? (
                  <button
                    type="button"
                    onClick={async () => {
                      await api.post('/inventory-software/auth/2fa/disable', {}, reqConfig);
                      showNotice('info', '2FA disabled.');
                      fetchBootstrapData(true);
                    }}
                    className="px-3 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold"
                  >
                    Disable 2FA
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStart2FASetup}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold"
                  >
                    + Setup 2FA App
                  </button>
                )}
              </div>

              {totpSetupData && (
                <div className="p-3 rounded-xl bg-slate-50 border space-y-2">
                  <div className="flex items-center gap-3">
                    {totpQrDataUrl && <img src={totpQrDataUrl} alt="2FA QR" className="w-24 h-24 rounded border bg-white p-1" />}
                    <div className="space-y-1">
                      <div className="text-[11px] text-slate-500">Secret Key:</div>
                      <code className="block p-1 rounded bg-slate-200 font-mono text-[11px] break-all">
                        {totpSetupData.secret}
                      </code>
                      <div className="flex gap-1.5 pt-1">
                        <input
                          type="text"
                          maxLength={6}
                          value={totpVerifyCode}
                          onChange={e => setTotpVerifyCode(e.target.value)}
                          placeholder="6-digit code"
                          className="px-2 py-1 rounded border font-mono w-24"
                        />
                        <button
                          type="button"
                          onClick={handleConfirm2FAEnable}
                          className="px-3 py-1 rounded bg-emerald-600 text-white font-bold"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Change Password */}
            <div className="p-4 rounded-xl border border-slate-200 space-y-2.5">
              <div className="font-bold text-slate-900">Change Password</div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="password"
                  value={profilePassForm.currentPassword}
                  onChange={e => setProfilePassForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Current Password"
                  className="px-3 py-2 rounded-lg bg-slate-50 border"
                />
                <input
                  type="password"
                  value={profilePassForm.newPassword}
                  onChange={e => setProfilePassForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="New Password"
                  className="px-3 py-2 rounded-lg bg-slate-50 border"
                />
              </div>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await api.post('/inventory-software/auth/change-password', profilePassForm, reqConfig);
                    showNotice('success', res.data?.message || 'Password updated.');
                    setProfilePassForm({ currentPassword: '', newPassword: '' });
                  } catch (err) {
                    showNotice('error', err.response?.data?.message || 'Failed to change password.');
                  }
                }}
                className="w-full py-2 rounded-lg bg-slate-900 text-white font-bold"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: IMAGE LIGHTBOX VIEWER
         ===================================================================== */}
      {activeModal === 'img-viewer' && viewingImageSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <img src={viewingImageSrc} alt="Payment Proof" className="max-w-[90%] max-h-[88vh] rounded-2xl border-4 border-white shadow-2xl" />
        </div>
      )}

      {/* =====================================================================
          MODAL: FULL ONLINE ORDER LIFECYCLE, TRACKING, DELIVERY DATE & LABEL EDITOR
         ===================================================================== */}
      {activeModal === 'order-detail' && editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c261b] text-white border border-emerald-500/40 rounded-2xl max-w-4xl w-full p-6 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto text-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
              <div>
                <h3 className="text-base font-black uppercase text-slate-900">
                  Order #{editingOrder.orderNumber} — Fulfillment &amp; Tracking
                </h3>
                <p className="text-[11px] text-slate-500">
                  Placed on {new Date(editingOrder.createdAt).toLocaleString()} • Payment: {editingOrder.paymentMode} ({editingOrder.paymentStatus})
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrintOnlineOrderGstInvoice(editingOrder)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold"
                >
                  Print GST Invoice
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    setEditingOrder(null);
                  }}
                  className="text-slate-400 hover:text-slate-700 text-base font-bold px-2"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveOrderDetailsModal} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-6 space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="font-black uppercase text-emerald-950">
                    1. Shipment, Tracking ID, Delivery Date &amp; Live Location
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold uppercase text-slate-600 mb-1">Current lifecycle status</label>
                      <div className="w-full rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 font-bold capitalize">{String(editingOrder.status || '').replace(/_/g, ' ')}</div>
                      <p className="mt-1 text-[10px] text-slate-500">Use fulfillment actions to change status and trigger the correct validation/email.</p>
                    </div>
                    <div>
                      <label className="block font-bold uppercase text-slate-600 mb-1">
                        Estimated Delivery Date (Auto)
                      </label>
                      <input
                        type="date"
                        value={editingOrder.estimatedDeliveryDate || ''}
                        onChange={e => setEditingOrder(prev => ({ ...prev, estimatedDeliveryDate: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold uppercase text-slate-600 mb-1">Courier Partner</label>
                      <input
                        type="text"
                        value={editingOrder.courier || ''}
                        onChange={e => setEditingOrder(prev => ({ ...prev, courier: e.target.value }))}
                        placeholder="e.g. Delhivery, Shiprocket, BlueDart"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase text-slate-600 mb-1">Tracking ID / AWB Number</label>
                      <input
                        type="text"
                        value={editingOrder.trackingNumber || ''}
                        onChange={e => setEditingOrder(prev => ({ ...prev, trackingNumber: e.target.value }))}
                        placeholder="e.g. BHVM202688991"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-600 mb-1">
                      Where the Product Is Right Now (Live Shipment Checkpoint)
                    </label>
                    <input
                      type="text"
                      value={editingOrder.currentLocationCheckpoint || ''}
                      onChange={e =>
                        setEditingOrder(prev => ({ ...prev, currentLocationCheckpoint: e.target.value }))
                      }
                      placeholder="e.g. Dispatched from Asansol Hub → Reached Delhi Gateway Hub"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-semibold"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="font-black uppercase text-slate-800">
                    Direct Carrier API Booking (Shiprocket / Delhivery)
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    <select
                      value={carrierBookForm.provider}
                      onChange={e => setCarrierBookForm(prev => ({ ...prev, provider: e.target.value }))}
                      className="col-span-2 px-2.5 py-1.5 rounded-lg bg-white border font-bold"
                    >
                      <option value="shiprocket">Shiprocket</option>
                      <option value="delhivery">Delhivery</option>
                    </select>
                    <input
                      type="number"
                      step="0.1"
                      value={carrierBookForm.weight}
                      onChange={e => setCarrierBookForm(prev => ({ ...prev, weight: e.target.value }))}
                      placeholder="Kg"
                      title="Weight (Kg)"
                      className="px-2 py-1.5 rounded-lg bg-white border font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleBookCarrierLabel(editingOrder.id)}
                      className="col-span-2 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      Book Carrier AWB
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-black uppercase text-slate-800">
                    Ordered Formulations &amp; Main Inventory Stock Check
                  </div>
                  {(editingOrder.items || []).map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1.5 border-b last:border-0">
                      <div>
                        <div className="font-bold text-slate-900">
                          {it.name} <span className="text-emerald-700 font-mono">×{it.quantity}</span>
                        </div>
                        <div className="font-mono text-[10px] text-slate-500">
                          SKU: {it.sku} • Main Stock: <b>{it.inStockQty} units</b>
                        </div>
                      </div>
                      <div className="font-mono font-bold">₹{it.price * it.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="font-black uppercase text-slate-900">
                    2. Customer Shipping Label Address (Auto-Fetched from Checkout)
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold uppercase text-slate-600 mb-1">Recipient Full Name *</label>
                      <input
                        type="text"
                        required
                        value={editingOrder.customerName || ''}
                        onChange={e => setEditingOrder(prev => ({ ...prev, customerName: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase text-slate-600 mb-1">Recipient Phone *</label>
                      <input
                        type="text"
                        required
                        value={editingOrder.customerPhone || ''}
                        onChange={e => setEditingOrder(prev => ({ ...prev, customerPhone: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-600 mb-1">Address Line 1 (House / Flat / Street)</label>
                    <input
                      type="text"
                      value={editingOrder.line1 || ''}
                      onChange={e => setEditingOrder(prev => ({ ...prev, line1: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold uppercase text-slate-600 mb-1">Address Line 2 / Area</label>
                      <input
                        type="text"
                        value={editingOrder.line2 || ''}
                        onChange={e => setEditingOrder(prev => ({ ...prev, line2: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase text-slate-600 mb-1">Landmark</label>
                      <input
                        type="text"
                        value={editingOrder.landmark || ''}
                        onChange={e => setEditingOrder(prev => ({ ...prev, landmark: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold uppercase text-slate-600 mb-1">City (e.g. Delhi)</label>
                      <input
                        type="text"
                        value={editingOrder.city || ''}
                        onChange={e => setEditingOrder(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase text-slate-600 mb-1">State</label>
                      <input
                        type="text"
                        value={editingOrder.state || ''}
                        onChange={e => setEditingOrder(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase text-slate-600 mb-1">Pincode</label>
                      <input
                        type="text"
                        value={editingOrder.pincode || ''}
                        onChange={e => setEditingOrder(prev => ({ ...prev, pincode: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-600 mb-1">Dispatch / Courier Notes</label>
                    <input
                      type="text"
                      value={editingOrder.notes || ''}
                      onChange={e => setEditingOrder(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Special delivery instructions…"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase"
                  >
                    Save Order Lifecycle, Tracking &amp; Address
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal(null);
                      setEditingOrder(null);
                    }}
                    className="px-5 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 border border-slate-600 font-bold text-xs transition shadow-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          NEW WMS MODALS: WAVE PICKING, MANIFEST, VERIFY PACK, RETURN QC, THERMAL
         ===================================================================== */}
      {activeWavePicklist && (
        <WavePicklistModal
          picklist={activeWavePicklist}
          onClose={() => setActiveWavePicklist(null)}
        />
      )}

      {activeManifest && (
        <ManifestPrintModal
          manifest={activeManifest}
          onClose={() => setActiveManifest(null)}
        />
      )}

      {fulfillmentQrOrder && (
        <FulfillmentOrderQrModal order={fulfillmentQrOrder} storeConfig={cfg} onClose={() => setFulfillmentQrOrder(null)} />
      )}

      {returnQcOrder && (
        <ReturnQcModal
          order={returnQcOrder}
          onClose={() => setReturnQcOrder(null)}
          onQcComplete={async (orderId, grade) => {
            showNotice('success', `Order #${orderId} return QC recorded as ${grade}.`);
            await fetchBootstrapData(true);
          }}
          reqConfig={reqConfig}
        />
      )}

      {activeModal === 'batch-qr' && (
        <BatchBarcodeGeneratorModal
          isOpen={true}
          onClose={() => {
            setActiveModal(null);
            setBatchQrProduct(null);
            setBatchQrBatch('');
          }}
          catalog={items}
          initialProduct={batchQrProduct}
          initialBatch={batchQrBatch}
        />
      )}

    </div>
  );
}
