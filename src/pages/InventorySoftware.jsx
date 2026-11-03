import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import QRCode from 'qrcode';
import api from '../services/api';
import './admin/AdminTheme.css';
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

const FALLBACK_CATALOG_ITEMS = [
  {
    id: 1,
    productId: 10,
    sku: 'BV-LUX-CFW-01',
    barcode: '8908020260015',
    name: 'Bhumivera Activated Charcoal Purifying Luxury Face Wash',
    cat: 'Luxury Facial Cleansers',
    uom: '100 ML',
    qty: 249,
    physicalStock: 249,
    shopDisplayStock: 49,
    warehouseVaultStock: 200,
    safetyBufferStock: 0,
    damagedQuarantineStock: 0,
    onlineReservedQty: 0,
    costPrice: 115,
    mrp: 699,
    price: 299,
    gstHsnCode: '33049990',
    gstRate: 18,
    minStock: 20,
    reorderQty: 100,
    binCode: 'ASN-SHOP-R1-B01',
    rackLocation: 'Zone A • Rack 01 • Shelf A • Bin 01',
    batchNo: 'BV-BATCH-2026-CFW01',
    mfgDate: '2026-08-01',
    expiryDate: '2028-07-31',
    soldQty: 42,
    soldOfflineQty: 18,
    soldOnlineQty: 24,
    syncToWebsite: true,
  },
  {
    id: 2,
    productId: 11,
    sku: 'BV-LUX-SBFW-02',
    barcode: '8908020260022',
    name: 'Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash',
    cat: 'Luxury Facial Cleansers',
    uom: '100 ML',
    qty: 249,
    physicalStock: 249,
    shopDisplayStock: 49,
    warehouseVaultStock: 200,
    safetyBufferStock: 0,
    damagedQuarantineStock: 0,
    onlineReservedQty: 0,
    costPrice: 145,
    mrp: 799,
    price: 399,
    gstHsnCode: '33049990',
    gstRate: 18,
    minStock: 20,
    reorderQty: 100,
    binCode: 'ASN-SHOP-R1-B01',
    rackLocation: 'Zone A • Rack 01 • Shelf A • Bin 02',
    batchNo: 'BV-BATCH-2026-SBFW02',
    mfgDate: '2026-08-01',
    expiryDate: '2028-07-31',
    soldQty: 51,
    soldOfflineQty: 21,
    soldOnlineQty: 30,
    syncToWebsite: true,
  },
  {
    id: 3,
    productId: 12,
    sku: 'BV-LUX-SH2IN1-03',
    barcode: '8908020260039',
    name: 'Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner',
    cat: 'Luxury Hair Care',
    uom: '200 ML',
    qty: 199,
    physicalStock: 199,
    shopDisplayStock: 39,
    warehouseVaultStock: 160,
    safetyBufferStock: 0,
    damagedQuarantineStock: 0,
    onlineReservedQty: 0,
    costPrice: 165,
    mrp: 899,
    price: 449,
    gstHsnCode: '33051090',
    gstRate: 18,
    minStock: 15,
    reorderQty: 100,
    binCode: 'ASN-SHOP-R1-B02',
    rackLocation: 'Zone A • Rack 01 • Shelf B • Bin 01',
    batchNo: 'BV-BATCH-2026-SH03',
    mfgDate: '2026-08-05',
    expiryDate: '2028-08-04',
    soldQty: 64,
    soldOfflineQty: 29,
    soldOnlineQty: 35,
    syncToWebsite: true,
  },
  {
    id: 4,
    productId: 13,
    sku: 'BV-LUX-CSOAP-04',
    barcode: '8908020260046',
    name: 'Bhumivera Charcoal Deep Cleansing Bar (Handmade Ayurvedic Luxury Soap)',
    cat: 'Artisanal Ayurvedic Cleansing Bars',
    uom: '100 GM',
    qty: 299,
    physicalStock: 299,
    shopDisplayStock: 59,
    warehouseVaultStock: 240,
    safetyBufferStock: 0,
    damagedQuarantineStock: 0,
    onlineReservedQty: 0,
    costPrice: 68,
    mrp: 399,
    price: 199,
    gstHsnCode: '34011190',
    gstRate: 18,
    minStock: 25,
    reorderQty: 150,
    binCode: 'ASN-SHOP-R2-B01',
    rackLocation: 'Zone A • Rack 02 • Shelf A • Bin 01',
    batchNo: 'BV-BATCH-2026-CS04',
    mfgDate: '2026-08-10',
    expiryDate: '2028-08-09',
    soldQty: 78,
    soldOfflineQty: 38,
    soldOnlineQty: 40,
    syncToWebsite: true,
  },
  {
    id: 5,
    productId: 14,
    sku: 'BV-LUX-ASOAP-05',
    barcode: '8908020260053',
    name: 'Bhumivera Soothing Bar (Aloe Vera, Neem & Tulsi Handmade Ayurvedic Soap)',
    cat: 'Artisanal Ayurvedic Cleansing Bars',
    uom: '100 GM',
    qty: 299,
    physicalStock: 299,
    shopDisplayStock: 59,
    warehouseVaultStock: 240,
    safetyBufferStock: 0,
    damagedQuarantineStock: 0,
    onlineReservedQty: 0,
    costPrice: 65,
    mrp: 349,
    price: 199,
    gstHsnCode: '34011190',
    gstRate: 18,
    minStock: 25,
    reorderQty: 150,
    binCode: 'ASN-SHOP-R2-B01',
    rackLocation: 'Zone A • Rack 02 • Shelf A • Bin 02',
    batchNo: 'BV-BATCH-2026-AS05',
    mfgDate: '2026-08-10',
    expiryDate: '2028-08-09',
    soldQty: 71,
    soldOfflineQty: 31,
    soldOnlineQty: 40,
    syncToWebsite: true,
  },
  {
    id: 6,
    productId: 15,
    sku: 'BV-LUX-TULSI-06',
    barcode: '8908020260060',
    name: 'Bhumivera Kalpvriksh Satva Tulsi (Liquid Extract of 7 Types of Tulsi)',
    cat: 'Luxury Ayurvedic Wellness & Immunity Drops',
    uom: '30 ML',
    qty: 299,
    physicalStock: 299,
    shopDisplayStock: 59,
    warehouseVaultStock: 240,
    safetyBufferStock: 0,
    damagedQuarantineStock: 0,
    onlineReservedQty: 0,
    costPrice: 95,
    mrp: 499,
    price: 299,
    gstHsnCode: '30049011',
    gstRate: 12,
    minStock: 20,
    reorderQty: 120,
    binCode: 'ASN-SHOP-R2-B01',
    rackLocation: 'Zone A • Rack 02 • Shelf A • Bin 03',
    batchNo: 'BV-BATCH-2026-TL06',
    mfgDate: '2026-08-12',
    expiryDate: '2028-08-11',
    soldQty: 89,
    soldOfflineQty: 44,
    soldOnlineQty: 45,
    syncToWebsite: true,
  },
];

const FALLBACK_BINS = [
  {
    id: 1,
    bin_code: 'ASN-SHOP-R1-B01',
    hub_name: 'Bhumivera Flagship Hub — Asansol',
    zone_name: 'Zone A: Retail Shop Front Counter',
    rack_no: 'Rack-01',
    shelf_level: 'Shelf-A',
    bin_label: 'Facial Cleansers Display Bay',
    temperature_target: '22°C - 25°C',
    capacity_units: 400,
    occupied_units: 98,
    keeper_name: 'Rahul Sharma',
    status: 'active',
  },
  {
    id: 2,
    bin_code: 'ASN-SHOP-R1-B02',
    hub_name: 'Bhumivera Flagship Hub — Asansol',
    zone_name: 'Zone A: Retail Shop Front Counter',
    rack_no: 'Rack-01',
    shelf_level: 'Shelf-B',
    bin_label: 'Royal Hair Care & Shampoo Counter',
    temperature_target: '22°C - 25°C',
    capacity_units: 350,
    occupied_units: 39,
    keeper_name: 'Rahul Sharma',
    status: 'active',
  },
  {
    id: 3,
    bin_code: 'ASN-SHOP-R2-B01',
    hub_name: 'Bhumivera Flagship Hub — Asansol',
    zone_name: 'Zone A: Retail Shop Front Counter',
    rack_no: 'Rack-02',
    shelf_level: 'Shelf-A',
    bin_label: 'Artisanal Cleansing Bars & Tulsi Drops',
    temperature_target: '22°C - 25°C',
    capacity_units: 600,
    occupied_units: 177,
    keeper_name: 'Rahul Sharma',
    status: 'active',
  },
  {
    id: 4,
    bin_code: 'ASN-COLD-R1-B01',
    hub_name: 'Bhumivera Flagship Hub — Asansol',
    zone_name: 'Zone B: Cold-Pressed Botanical Vault (<28°C)',
    rack_no: 'Rack-C1',
    shelf_level: 'Shelf-01',
    bin_label: 'Climate-Controlled Master Reserve Vault',
    temperature_target: '18°C - 24°C',
    capacity_units: 1500,
    occupied_units: 1280,
    keeper_name: 'Vikram Rathore',
    status: 'active',
  },
  {
    id: 5,
    bin_code: 'ASN-DISPATCH-R1-B01',
    hub_name: 'Bhumivera Flagship Hub — Asansol',
    zone_name: 'Zone C: Online Order Dispatch & CCTV Weighing Bay',
    rack_no: 'Rack-D1',
    shelf_level: 'Shelf-01',
    bin_label: 'E-Commerce Pick, Pack & Scale #02 Bay',
    temperature_target: '22°C - 26°C',
    capacity_units: 500,
    occupied_units: 150,
    keeper_name: 'Vikram Rathore',
    status: 'active',
  },
  {
    id: 6,
    bin_code: 'ASN-QUAR-R1-B01',
    hub_name: 'Bhumivera Flagship Hub — Asansol',
    zone_name: 'Zone Q: Quarantine & Damaged Stock Bay',
    rack_no: 'Rack-Q1',
    shelf_level: 'Shelf-01',
    bin_label: 'RMA / Transit Damage Quarantine',
    temperature_target: 'Ambient',
    capacity_units: 200,
    occupied_units: 0,
    keeper_name: 'Nisha Gupta',
    status: 'quarantine',
  },
];

const FALLBACK_CUSTOMERS = [
  {
    id: 1,
    name: 'Walk-in Retail Shopper',
    phone: '+91 90000 00000',
    email: 'walkin@bhumivera.com',
    gstin: '',
    loc: 'Asansol Flagship Counter',
    type: 'Walk-in',
    wallet: 0,
    creditLimit: 25000,
    totalPurchases: 0,
    visitCount: 1,
  },
  {
    id: 2,
    name: 'Aura Luxury Salon & Wellness Spa',
    phone: '+91 98321 55667',
    email: 'procurement@auraspa.in',
    gstin: '19AABCA1122K1Z1',
    loc: 'City Centre, Durgapur, WB',
    type: 'Salon / Spa Partner',
    wallet: -4500,
    creditLimit: 100000,
    totalPurchases: 28500,
    visitCount: 6,
  },
  {
    id: 3,
    name: 'Royal Ayurveda & Organic Boutique',
    phone: '+91 98305 88990',
    email: 'orders@royalayurveda.in',
    gstin: '19AABCR3344M1Z8',
    loc: 'Park Street, Kolkata, WB',
    type: 'Retail Shop',
    wallet: 0,
    creditLimit: 75000,
    totalPurchases: 42000,
    visitCount: 9,
  },
];

export default function InventorySoftware() {
  // Authentication & Session State
  const [authToken, setAuthToken] = useState(
    () =>
      localStorage.getItem(LOCAL_TOKEN_KEY) ||
      localStorage.getItem('adminToken') ||
      localStorage.getItem('supportToken') ||
      ''
  );
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

  // Navigation & UI State
  const [activeView, setActiveView] = useState('dash');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [banner, setBanner] = useState(null);

  // Core Data Collections
  const [items, setItems] = useState(FALLBACK_CATALOG_ITEMS);
  const [bins, setBins] = useState(FALLBACK_BINS);
  const [customers, setCustomers] = useState(FALLBACK_CUSTOMERS);
  const [sales, setSales] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [grnEntries, setGrnEntries] = useState([]);
  const [movements, setMovements] = useState([]);
  const [logs, setLogs] = useState([]);
  const [onlineOrders, setOnlineOrders] = useState([]);
  const [cfg, setCfg] = useState({
    storeName: 'Bhumivera Organics India Private Limited',
    tagline: 'The Transparent Maison — 100% Label-Disclosed Botanical Formulations',
    address: 'G.T. Road, Gopalpur, Asansol, West Bengal - 713304, India',
    phone: '+91 98320 00000',
    email: 'billing@bhumivera.com',
    website: 'www.bhumivera.com',
    gstin: '19AAKCB2026A1Z5',
    upiId: 'bhumivera@okhdfcbank',
    taxRate: 18,
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
  const [invBinFilter, setInvBinFilter] = useState('ALL');

  // POS Billing State
  const [posCustomerSearch, setPosCustomerSearch] = useState('');
  const [selectedPosCustomer, setSelectedPosCustomer] = useState(FALLBACK_CUSTOMERS[0]);
  const [posItemSearch, setPosItemSearch] = useState('');
  const [selectedPosItemId, setSelectedPosItemId] = useState('');
  const [posItemQty, setPosItemQty] = useState(1);
  const [posItemPrice, setPosItemPrice] = useState('');
  const [posCart, setPosCart] = useState([]);
  const [posExtraCharges, setPosExtraCharges] = useState([]);
  const [extraName, setExtraName] = useState('');
  const [extraAmt, setExtraAmt] = useState('');
  const [posDiscount, setPosDiscount] = useState(0);
  const [posTaxRate, setPosTaxRate] = useState(18);
  const [posPaymentMode, setPosPaymentMode] = useState('Cash');
  const [posPaidAmount, setPosPaidAmount] = useState('');
  const [posUpiRef, setPosUpiRef] = useState('');
  const [upiQrDataUrl, setUpiQrDataUrl] = useState('');
  const [lastCompletedSale, setLastCompletedSale] = useState(null);

  // Modals State
  const [activeModal, setActiveModal] = useState(null); // 'item' | 'customer' | 'khata' | 'bin' | 'transfer' | 'grn' | 'supplier' | 'invoice-success' | 'view-sale' | 'cats' | 'settings' | 'profile' | 'label' | 'img-viewer'
  const [editingItem, setEditingItem] = useState(null);
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
  const [editingBin, setEditingBin] = useState(null);
  const [transferForm, setTransferForm] = useState({
    metaId: '',
    direction: 'VAULT_TO_SHOP',
    quantity: 10,
    newBinCode: '',
    notes: '',
  });
  const [grnForm, setGrnForm] = useState({
    supplierId: '',
    supplierName: 'Himalayan Phyto-Actives & Cold-Press Labs',
    metaId: '',
    batchNo: `BV-BATCH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    mfgDate: new Date().toISOString().split('T')[0],
    expiryDate: '2028-10-31',
    receivedQty: 50,
    rejectedQty: 0,
    unitCost: 115,
    binCode: 'ASN-COLD-R1-B01',
    invoiceRef: '',
    notes: '',
  });
  const [supplierForm, setSupplierForm] = useState({
    id: null,
    name: '',
    companyName: '',
    phone: '',
    email: '',
    gstin: '',
    city: '',
    supplyCategory: 'Botanical Extracts & Packaging',
    payableBalance: 0,
    leadTimeDays: 5,
    notes: '',
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
  const [auditCounts, setAuditCounts] = useState({});
  const [auditNote, setAuditNote] = useState('Monthly Physical Bin Stock Verification');
  const [reportDate, setReportDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [reportSearchInv, setReportSearchInv] = useState('');
  const [showProofGallery, setShowProofGallery] = useState(false);
  const [viewingSale, setViewingSale] = useState(null);
  const [viewingImageSrc, setViewingImageSrc] = useState('');
  const [labelItem, setLabelItem] = useState(null);
  const [labelQrUrl, setLabelQrUrl] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [logSubTab, setLogSubTab] = useState('movements'); // 'movements' | 'audit'
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
        const res = await api.get('/inventory-software/bootstrap', reqConfig);
        const d = res.data;
        if (d?.success) {
          if (d.viewer) {
            setViewer(d.viewer);
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(d.viewer));
            if (d.viewer.firstLogin) {
              setShowOnboardingModal(true);
            }
          }
          if (Array.isArray(d.items) && d.items.length > 0) setItems(d.items);
          if (Array.isArray(d.bins) && d.bins.length > 0) setBins(d.bins);
          if (Array.isArray(d.customers) && d.customers.length > 0) {
            setCustomers(d.customers);
            setSelectedPosCustomer(prev => d.customers.find(c => c.id === prev?.id) || d.customers[0]);
          }
          if (Array.isArray(d.sales)) setSales(d.sales);
          if (Array.isArray(d.proofs)) setProofs(d.proofs);
          if (Array.isArray(d.suppliers)) setSuppliers(d.suppliers);
          if (Array.isArray(d.grnEntries)) setGrnEntries(d.grnEntries);
          if (Array.isArray(d.movements)) setMovements(d.movements);
          if (Array.isArray(d.logs)) setLogs(d.logs);
          if (Array.isArray(d.onlineOrders)) setOnlineOrders(d.onlineOrders);
          if (d.cfg) setCfg(prev => ({ ...prev, ...d.cfg }));
          setLastSyncedAt(d.syncedAt || new Date().toISOString());

          localStorage.setItem(
            LOCAL_DB_KEY,
            JSON.stringify({
              items: d.items,
              bins: d.bins,
              customers: d.customers,
              sales: d.sales,
              proofs: d.proofs,
              suppliers: d.suppliers,
              grnEntries: d.grnEntries,
              movements: d.movements,
              logs: d.logs,
              cfg: d.cfg,
              syncedAt: new Date().toISOString(),
            })
          );
        }
      } catch (err) {
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
              if (cached.bins) setBins(cached.bins);
              if (cached.customers) setCustomers(cached.customers);
              if (cached.sales) setSales(cached.sales);
              if (cached.proofs) setProofs(cached.proofs);
              if (cached.suppliers) setSuppliers(cached.suppliers);
              if (cached.movements) setMovements(cached.movements);
              if (cached.logs) setLogs(cached.logs);
            }
          } catch {}
        }
      } finally {
        setLoading(false);
        setSyncing(false);
      }
    },
    [authToken, reqConfig]
  );

  useEffect(() => {
    if (authToken) {
      fetchBootstrapData();
    }
  }, [authToken, fetchBootstrapData]);

  // POS Cart Totals & Dynamic UPI QR Generator
  const posCalculations = useMemo(() => {
    const subTotal = posCart.reduce((sum, i) => sum + Number(i.p) * Number(i.q), 0);
    const extraTotal = posExtraCharges.reduce((sum, x) => sum + Number(x.a), 0);
    const disc = Math.max(0, Number(posDiscount) || 0);
    const taxable = Math.max(0, subTotal + extraTotal - disc);
    const taxRate = Math.max(0, Number(posTaxRate) || 0);
    const taxAmt = Math.round((taxable * taxRate) / 100);
    const billTotal = taxable + taxAmt;
    const prevBal = selectedPosCustomer ? Number(selectedPosCustomer.wallet) || 0 : 0;
    const paid = posPaidAmount === '' ? billTotal : Math.max(0, Number(posPaidAmount) || 0);
    const newBal = prevBal - billTotal + paid;
    return { subTotal, extraTotal, disc, taxable, taxRate, taxAmt, billTotal, prevBal, paid, newBal };
  }, [posCart, posExtraCharges, posDiscount, posTaxRate, selectedPosCustomer, posPaidAmount]);

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
      const matchBin = invBinFilter === 'ALL' || it.binCode === invBinFilter;
      let matchStock = true;
      if (invStockFilter === 'LOW') matchStock = it.qty <= (it.minStock || 15) && it.qty > 0;
      if (invStockFilter === 'OUT') matchStock = it.qty === 0;
      if (invStockFilter === 'QUARANTINE') matchStock = (it.damagedQuarantineStock || 0) > 0;
      return matchSearch && matchCat && matchBin && matchStock;
    });
  }, [items, invSearch, invCatFilter, invStockFilter, invBinFilter]);

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
      const res = await api.post('/inventory-software/items/save', editingItem, reqConfig);
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

  const handleAddPosCartItem = () => {
    const item =
      items.find(
        x =>
          String(x.id) === String(selectedPosItemId) ||
          x.name.toLowerCase() === posItemSearch.trim().toLowerCase() ||
          x.sku.toLowerCase() === posItemSearch.trim().toLowerCase() ||
          x.barcode === posItemSearch.trim()
      ) || null;

    if (!item) {
      showNotice('error', 'Select a valid product or scan its barcode/SKU.');
      return;
    }

    const q = Math.max(1, parseInt(posItemQty, 10) || 1);
    const p = posItemPrice !== '' ? Math.max(0, parseFloat(posItemPrice) || 0) : item.price;

    const existingInCart = posCart.find(c => c.id === item.id);
    const totalRequested = (existingInCart ? existingInCart.q : 0) + q;

    if (totalRequested > item.qty) {
      showNotice(
        'error',
        `Insufficient stock for "${item.name}"! Only ${item.qty} available on Website & Shop.`
      );
      return;
    }

    if (existingInCart) {
      setPosCart(prev => prev.map(c => (c.id === item.id ? { ...c, q: totalRequested, p } : c)));
    } else {
      setPosCart(prev => [
        ...prev,
        {
          id: item.id,
          productId: item.productId,
          sku: item.sku,
          name: item.name,
          q,
          p,
          max: item.qty,
          uom: item.uom || 'Pcs',
          gstHsnCode: item.gstHsnCode || '33049990',
        },
      ]);
    }

    setPosItemSearch('');
    setSelectedPosItemId('');
    setPosItemQty(1);
    setPosItemPrice('');
  };

  const handlePosCartQtyMod = (id, delta) => {
    setPosCart(prev =>
      prev
        .map(c => {
          if (c.id !== id) return c;
          const nextQ = c.q + delta;
          if (nextQ > c.max) {
            showNotice('error', `Max available stock is ${c.max} units.`);
            return c;
          }
          return nextQ > 0 ? { ...c, q: nextQ } : null;
        })
        .filter(Boolean)
    );
  };

  const handlePosCheckout = async () => {
    if (posCart.length === 0) {
      showNotice('error', 'Add at least one product to the POS bill.');
      return;
    }
    try {
      const payload = {
        customer: selectedPosCustomer || customers[0],
        items: posCart,
        extraCharges: posExtraCharges,
        discount: posCalculations.disc,
        taxRate: posCalculations.taxRate,
        paidAmount: posCalculations.paid,
        paymentMode: posPaymentMode,
        upiReference: posUpiRef,
      };
      const res = await api.post('/inventory-software/pos/checkout', payload, reqConfig);
      if (res.data?.success) {
        setLastCompletedSale(res.data.sale);
        setPosCart([]);
        setPosExtraCharges([]);
        setPosDiscount(0);
        setPosPaidAmount('');
        setPosUpiRef('');
        setActiveModal('invoice-success');
        showNotice('success', res.data.message);
        await fetchBootstrapData(true);
      }
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Checkout failed.');
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
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;font-weight:600;">${it.name}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:center;">${it.gstHsnCode || '33049990'}</td>
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
    w.document.write(`
      <html><head><title>Receipt ${sale.invoiceNo}</title>
      <style>
        body { font-family: monospace; font-size: 12px; width: 280px; margin: 0; padding: 10px; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .line { border-top: 1px dashed #000; margin: 8px 0; }
      </style></head><body>
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
              `<div>${i.name} x${i.q}<span style="float:right;">₹${(Number(i.p) * Number(i.q)).toFixed(0)}</span></div>`
          )
          .join('')}
        <div class="line"></div>
        <div>Subtotal: <span style="float:right;">₹${sale.subTotal}</span></div>
        <div>GST (${sale.taxRate}%): <span style="float:right;">₹${sale.tax}</span></div>
        <div class="bold" style="font-size:14px;">TOTAL: <span style="float:right;">₹${sale.billTotal}</span></div>
        <div>Paid (${sale.paymentMode}): <span style="float:right;">₹${sale.paid}</span></div>
        <div>Khata Balance: <span style="float:right;">₹${sale.newBal}</span></div>
        <div class="line"></div>
        <div class="center" style="font-size:10px;">www.bhumivera.com • Thank You!</div>
        <script>window.print();</script>
      </body></html>
    `);
    w.document.close();
  };

  const handleShareWhatsAppInvoice = sale => {
    if (!sale) return;
    const text = `Hello ${sale.cust?.name || 'Patron'} 🙏\n\nThank you for shopping at *${cfg.storeName}* ✨\n\n*Invoice #:* ${sale.invoiceNo}\n*Items:* ${(sale.items || []).map(i => `${i.name} (x${i.q})`).join(', ')}\n*Bill Total:* ₹${sale.billTotal}\n*Paid (${sale.paymentMode}):* ₹${sale.paid}\n*Khata Balance:* ₹${sale.newBal}\n\n_${cfg.tagline}_\nhttps://${cfg.website}`;
    const phone = (sale.cust?.phone || '').replace(/[^0-9]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`, '_blank');
  };

  // ==========================================================================
  // HANDLERS: STORAGE KEEPER, AUDIT, GRN, KHATA, ADJUSTMENTS & RETURNS
  // ==========================================================================

  const handleSaveBin = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/inventory-software/keeper/bins/save', editingBin, reqConfig);
      showNotice('success', res.data?.message || 'Storage bin saved.');
      setActiveModal(null);
      await fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not save bin.');
    }
  };

  const handleExecuteBinTransfer = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/inventory-software/keeper/transfer', transferForm, reqConfig);
      showNotice('success', res.data?.message || 'Bin stock transfer completed.');
      setActiveModal(null);
      await fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Transfer failed.');
    }
  };

  const handleReconcilePhysicalAudit = async () => {
    const counts = Object.entries(auditCounts)
      .filter(([, val]) => val !== '' && val !== undefined)
      .map(([metaId, val]) => ({
        metaId: Number(metaId),
        physicalCountedQty: Math.max(0, parseInt(val, 10) || 0),
      }));

    if (counts.length === 0) {
      showNotice('error', 'Enter at least one physical count in the table to reconcile.');
      return;
    }

    try {
      const res = await api.post(
        '/inventory-software/keeper/audit-reconcile',
        { counts, auditNote },
        reqConfig
      );
      showNotice('success', res.data?.message || 'Physical stock audit reconciled with live website!');
      setAuditCounts({});
      await fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Audit reconciliation failed.');
    }
  };

  const handlePostGrnInward = async e => {
    e.preventDefault();
    if (!grnForm.metaId) {
      showNotice('error', 'Select a product SKU to inward.');
      return;
    }
    try {
      const res = await api.post('/inventory-software/grn/inward', grnForm, reqConfig);
      showNotice('success', res.data?.message || 'GRN posted & website stock incremented!');
      setActiveModal(null);
      await fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Failed to inward GRN.');
    }
  };

  const handleSaveSupplier = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/inventory-software/suppliers/save', supplierForm, reqConfig);
      showNotice('success', res.data?.message || 'Supplier saved.');
      setActiveModal(null);
      await fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Failed to save supplier.');
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

  const handleUpdateOnlineOrderStatus = async (orderId, status) => {
    const trackingNumber =
      status === 'shipped'
        ? window.prompt('Enter Courier Tracking / AWB Number (optional):', `BHVM${Date.now().toString().slice(-8)}`)
        : undefined;
    try {
      const res = await api.put(
        `/inventory-software/online-orders/${orderId}/dispatch-status`,
        { status, trackingNumber: trackingNumber || undefined, courier: 'Bhumivera Priority Express' },
        reqConfig
      );
      showNotice('success', res.data?.message || `Order #${orderId} marked ${status.toUpperCase()}.`);
      await fetchBootstrapData(true);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not update online order status.');
    }
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
      'Shop Counter Stock': i.shopDisplayStock,
      'Cold Vault Stock': i.warehouseVaultStock,
      'Safety Buffer': i.safetyBufferStock,
      'Quarantine / Damaged': i.damagedQuarantineStock,
      'Cost Price (INR)': i.costPrice,
      'MRP (INR)': i.mrp,
      'Selling Price (INR)': i.price,
      'Stock Valuation (INR)': i.qty * i.price,
      'Bin Code': i.binCode,
      'Rack Coordinate': i.rackLocation,
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
              binCode: row['Bin Code'] || 'ASN-SHOP-R1-B01',
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
      bins,
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
              Omnichannel Storage Keeper, Real-Time Website Stock Sync &amp; Retail POS Terminal
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
                  Staff &amp; Keeper Terminal Sign-In
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
                  placeholder="e.g. admin, manager, cashier1, keeper1"
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
      title: '1. Omnichannel Core',
      items: [
        { id: 'dash', label: 'Executive Dashboard', icon: Activity },
        { id: 'inv', label: 'Master Inventory & Web Sync', icon: Boxes },
        { id: 'sale', label: 'Offline Shop POS Billing', icon: ShoppingCart },
      ],
    },
    {
      title: '2. Storage Keeper & Vault',
      items: [
        { id: 'keeper', label: 'Storage Keeper & Bin Map', icon: Warehouse },
        { id: 'audit', label: 'Physical Stock Audit', icon: ClipboardCheck },
        { id: 'online', label: `Website Orders (${dashMetrics.pendingOnlineDispatch})`, icon: Globe },
        { id: 'grn', label: 'Suppliers & GRN Inward', icon: Truck },
      ],
    },
    {
      title: '3. Customer & Khata',
      items: [
        { id: 'map', label: 'Customer Khata Ledger', icon: Users },
        { id: 'trans', label: 'Stock Adjustments', icon: Wrench },
        { id: 'ret', label: 'Returns & Quarantine', icon: RotateCcw },
      ],
    },
    {
      title: '4. Intelligence & Audit',
      items: [
        { id: 'rep', label: 'Time-Machine Reports', icon: FileSpreadsheet },
        { id: 'logs', label: 'Stock & Audit Ledger', icon: History },
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
            <div className="text-[10px] text-emerald-400 font-mono truncate">Inventory • Keeper • POS</div>
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

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => fetchBootstrapData()}
              className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              Sync Live Website Stock
            </button>

            <button
              type="button"
              onClick={() => setActiveView('sale')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              New POS Bill
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('profile')}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
            >
              <Fingerprint className="w-3.5 h-3.5 text-emerald-600" />
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
          {/* =================================================================
              VIEW 1: OMNICHANNEL EXECUTIVE DASHBOARD
             ================================================================= */}
          {activeView === 'dash' && (
            <div className="space-y-6">
              {/* Omnichannel Anti-Oversell Protection Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white flex flex-wrap items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                        Atomic Anti-Oversell Protection Active
                      </span>
                    </div>
                    <h3 className="text-sm font-bold mt-0.5">
                      Real-Time Offline Shop POS ↔ bhumivera.com Website Inventory Bridge
                    </h3>
                    <p className="text-xs text-slate-300">
                      Every offline shop sale in POS immediately deducts available stock on{' '}
                      <span className="text-emerald-300 font-mono">www.bhumivera.com</span> and recalculates Regimen
                      Bundles so online shoppers can never buy stock already sold in the shop.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveView('sale')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition"
                  >
                    Open Retail POS Billing →
                  </button>
                </div>
              </div>

              {/* 8 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-200 border-t-4 border-t-emerald-500 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Offline Shop POS Today</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    ₹{dashMetrics.posRevToday.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                    Online Storefront Today: ₹{dashMetrics.onlineRevToday.toLocaleString()}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 border-t-4 border-t-blue-500 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">
                    Live Stock Valuation ({dashMetrics.totalUnits} Units)
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    ₹{dashMetrics.totalRetailVal.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-blue-600 font-semibold mt-1">
                    Cost: ₹{dashMetrics.totalCostVal.toLocaleString()} • Profit: ₹
                    {dashMetrics.projectedProfit.toLocaleString()}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 border-t-4 border-t-amber-500 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Low Stock &amp; Quarantine</div>
                  <div className="text-2xl font-black text-amber-600 mt-1">
                    {dashMetrics.lowStockCount} Low / {dashMetrics.outOfStockCount} Out
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold mt-1">
                    Quarantine Bay: {dashMetrics.quarantineUnits} damaged units
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 border-t-4 border-t-rose-500 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Customer Khata Receivable</div>
                  <div className="text-2xl font-black text-rose-600 mt-1">
                    ₹{dashMetrics.khataReceivable.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold mt-1">
                    Online Orders to Dispatch: {dashMetrics.pendingOnlineDispatch}
                  </div>
                </div>
              </div>

              {/* Top Sellers & Storage Bins Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-black uppercase text-slate-800 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      Live Website &amp; Shop Stock Matrix
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveView('inv')}
                      className="text-xs font-bold text-emerald-600 hover:underline"
                    >
                      Manage All ({items.length}) →
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 uppercase text-[10px]">
                          <th className="py-2 px-3 text-left">Formulation</th>
                          <th className="py-2 px-3 text-center">Bin</th>
                          <th className="py-2 px-3 text-center">Website Live</th>
                          <th className="py-2 px-3 text-right">Sold</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {items.slice(0, 7).map(it => (
                          <tr key={it.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-bold text-slate-800">{it.name}</td>
                            <td className="py-2.5 px-3 text-center font-mono text-[11px] text-slate-500">
                              {it.binCode}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[11px] font-bold font-mono ${
                                  it.qty <= (it.minStock || 15)
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {it.qty} {it.uom}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-700">
                              {it.soldQty || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-black uppercase text-slate-800 flex items-center gap-2">
                      <Warehouse className="w-4 h-4 text-blue-600" />
                      Storage Keeper Zones &amp; Bins ({bins.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveView('keeper')}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Open Keeper Map →
                    </button>
                  </div>
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {bins.map(b => {
                      const pct = Math.min(
                        100,
                        Math.round(((Number(b.occupied_units) || 0) / Math.max(1, Number(b.capacity_units) || 500)) * 100)
                      );
                      return (
                        <div key={b.bin_code} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800">
                              <code className="text-emerald-700 font-mono mr-1.5">[{b.bin_code}]</code>
                              {b.bin_label}
                            </span>
                            <span className="text-[11px] font-mono font-semibold text-slate-600">
                              {b.temperature_target} • {pct}% Full
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                b.status === 'quarantine'
                                  ? 'bg-rose-500'
                                  : pct > 85
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>
                              {b.zone_name} ({b.rack_no} / {b.shelf_level})
                            </span>
                            <span>Keeper: {b.keeper_name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Category Quick Filter Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {(cfg.cats || []).map(cat => {
                  const totalInCat = items
                    .filter(i => i.cat === cat)
                    .reduce((sum, i) => sum + (Number(i.qty) || 0), 0);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setInvCatFilter(cat);
                        setActiveView('inv');
                      }}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 text-left transition shadow-sm"
                    >
                      <div className="text-[10px] font-bold uppercase text-slate-500 line-clamp-1">{cat}</div>
                      <div className="text-xl font-black text-slate-900 mt-1 font-mono">{totalInCat}</div>
                      <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Units in Stock →</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================================================================
              VIEW 2: MASTER INVENTORY & REAL-TIME WEBSITE STOCK SYNC
             ================================================================= */}
          {activeView === 'inv' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black uppercase text-slate-900">
                    Omnichannel Master Inventory &amp; Live Website Stock Control
                  </h3>
                  <p className="text-xs text-slate-500">
                    Every quantity change here immediately updates <code className="text-emerald-700 font-bold">bhumivera.com</code>{' '}
                    product availability and recalculates Regimen Bundles.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal('cats')}
                    className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Tag className="w-3.5 h-3.5" /> Categories
                  </button>
                  <label className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-blue-600" /> Import Excel
                    <input type="file" accept=".xlsx,.xls" onChange={handleImportInventoryExcel} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={handleExportInventoryExcel}
                    className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" /> Export (.xlsx)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem({
                        id: null,
                        name: '',
                        sku: `BV-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
                        barcode: `8908020${Math.floor(100000 + Math.random() * 900000)}`,
                        cat: cfg.cats?.[0] || 'Luxury Facial Cleansers',
                        uom: '100 ML',
                        qty: 50,
                        shopDisplayStock: 15,
                        warehouseVaultStock: 35,
                        safetyBufferStock: 0,
                        costPrice: 120,
                        mrp: 699,
                        price: 349,
                        gstHsnCode: '33049990',
                        gstRate: 18,
                        minStock: 15,
                        reorderQty: 50,
                        binCode: bins[0]?.bin_code || 'ASN-SHOP-R1-B01',
                        rackLocation: 'Zone A • Rack 01 • Shelf A',
                        batchNo: `BV-BATCH-${new Date().getFullYear()}-01`,
                        mfgDate: new Date().toISOString().split('T')[0],
                        expiryDate: '2028-08-31',
                        syncToWebsite: true,
                      });
                      setActiveModal('item');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add New Formulation / SKU
                  </button>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={invSearch}
                    onChange={e => setInvSearch(e.target.value)}
                    placeholder="Search name, SKU, barcode, or batch…"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <select
                  value={invCatFilter}
                  onChange={e => setInvCatFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold"
                >
                  <option value="ALL">All Categories</option>
                  {(cfg.cats || []).map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <select
                  value={invBinFilter}
                  onChange={e => setInvBinFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold"
                >
                  <option value="ALL">All Storage Bins</option>
                  {bins.map(b => (
                    <option key={b.bin_code} value={b.bin_code}>
                      {b.bin_code} — {b.bin_label}
                    </option>
                  ))}
                </select>
                <select
                  value={invStockFilter}
                  onChange={e => setInvStockFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold"
                >
                  <option value="ALL">All Stock Levels</option>
                  <option value="LOW">Low Stock Alerts Only</option>
                  <option value="OUT">Out of Stock (0)</option>
                  <option value="QUARANTINE">Has Damaged / Quarantine Units</option>
                </select>
              </div>

              {/* Master Inventory Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs">
                  <thead className="bg-slate-900 text-white uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-3 text-left">SKU &amp; Barcode</th>
                      <th className="py-3 px-3 text-left">Product / Formulation</th>
                      <th className="py-3 px-3 text-left">Bin &amp; Batch</th>
                      <th className="py-3 px-3 text-center">Shop / Vault Split</th>
                      <th className="py-3 px-3 text-center">Live Website Stock</th>
                      <th className="py-3 px-3 text-right">Cost / MRP / Sell</th>
                      <th className="py-3 px-3 text-center">Margin</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredInventory.map(item => {
                      const margin =
                        item.price > 0 ? Math.round(((item.price - (item.costPrice || 0)) / item.price) * 100) : 0;
                      const isLow = item.qty <= (item.minStock || 15);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-mono">
                            <div className="font-bold text-slate-900">{item.sku}</div>
                            <div className="text-[10px] text-slate-500">{item.barcode}</div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {item.name}
                              {item.syncToWebsite && (
                                <span
                                  title="Synced live with bhumivera.com"
                                  className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase"
                                >
                                  Web Live
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {item.cat} • UOM: <b>{item.uom}</b> • HSN: {item.gstHsnCode} ({item.gstRate}% GST)
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-mono font-bold text-blue-700 text-[11px]">{item.binCode}</div>
                            <div className="text-[10px] text-slate-500">
                              Batch: {item.batchNo || 'N/A'} {item.expiryDate ? `• Exp: ${item.expiryDate}` : ''}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-[11px]">
                            <span className="text-emerald-700 font-bold" title="Retail Shop Counter">
                              Shop: {item.shopDisplayStock}
                            </span>{' '}
                            /{' '}
                            <span className="text-blue-700 font-bold" title="Cold Vault Reserve">
                              Vault: {item.warehouseVaultStock}
                            </span>
                            {item.damagedQuarantineStock > 0 && (
                              <div className="text-[10px] text-rose-600 font-bold">
                                Quarantine: {item.damagedQuarantineStock}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-xl border border-slate-200">
                              <button
                                type="button"
                                onClick={() => handleQuickStockStep(item, -1)}
                                className="w-6 h-6 rounded-lg bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-300 font-bold"
                                title="Deduct 1 unit from Website & Shop"
                              >
                                -
                              </button>
                              <span
                                className={`font-mono font-black text-sm px-2 ${
                                  item.qty === 0
                                    ? 'text-rose-600'
                                    : isLow
                                    ? 'text-amber-600'
                                    : 'text-emerald-700'
                                }`}
                              >
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQuickStockStep(item, 1)}
                                className="w-6 h-6 rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 border border-slate-300 font-bold"
                                title="Add 1 unit to Website & Shop"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-mono">
                            <div className="font-bold text-slate-900">₹{item.price}</div>
                            <div className="text-[10px] text-slate-500">
                              Cost: ₹{item.costPrice} • MRP: ₹{item.mrp}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-emerald-700">{margin}%</td>
                          <td className="py-3 px-3 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenLabelGenerator(item)}
                                title="Print Barcode / QR Shelf Label"
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingItem({ ...item });
                                  setActiveModal('item');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(item)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              VIEW 3: OFFLINE SHOP POS BILLING TERMINAL (ATOMIC WEB DEDUCTION!)
             ================================================================= */}
          {activeView === 'sale' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 Cols: Customer & Product Selector */}
              <div className="lg:col-span-7 space-y-5">
                {/* Customer Selection Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase text-slate-800 flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-600" />
                      1. Select Shop Customer / Walk-In Patron
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCustomer({
                          id: null,
                          name: '',
                          phone: '',
                          email: '',
                          gstin: '',
                          loc: 'Asansol',
                          type: 'Walk-in',
                          wallet: 0,
                          creditLimit: 50000,
                        });
                        setActiveModal('customer');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold"
                    >
                      + New Customer Profile
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={selectedPosCustomer?.id || ''}
                      onChange={e => {
                        const found = customers.find(c => String(c.id) === e.target.value);
                        if (found) setSelectedPosCustomer(found);
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold text-xs"
                    >
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.phone || 'Walk-in'}) — Khata: ₹{c.wallet}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={posCustomerSearch}
                      onChange={e => {
                        setPosCustomerSearch(e.target.value);
                        const match = customers.find(
                          c =>
                            c.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                            c.phone?.includes(e.target.value)
                        );
                        if (match) setSelectedPosCustomer(match);
                      }}
                      placeholder="Quick search customer by name or phone…"
                      className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                    />
                  </div>

                  {selectedPosCustomer && (
                    <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="font-bold text-emerald-950">{selectedPosCustomer.name}</span>{' '}
                        <span className="font-mono text-emerald-700">({selectedPosCustomer.phone})</span>
                      </div>
                      <div className="font-bold">
                        Khata Balance:{' '}
                        <span className={selectedPosCustomer.wallet < 0 ? 'text-rose-600' : 'text-emerald-700'}>
                          ₹{selectedPosCustomer.wallet}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Barcode Scanner & Picker Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase text-slate-800 flex items-center gap-2">
                      <Barcode className="w-4 h-4 text-emerald-600" />
                      2. Scan Barcode or Select Formulation (Syncs Live Website Stock)
                    </label>
                    <span className="text-[11px] text-emerald-700 font-bold">
                      Real-Time Website Stock Check Enabled
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={selectedPosItemId}
                      onChange={e => {
                        setSelectedPosItemId(e.target.value);
                        const found = items.find(i => String(i.id) === e.target.value);
                        if (found) {
                          setPosItemSearch(found.name);
                          setPosItemPrice(found.price);
                        }
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold text-xs"
                    >
                      <option value="">-- Choose Product from Live Catalog --</option>
                      {items.map(it => (
                        <option key={it.id} value={it.id} disabled={it.qty <= 0}>
                          {it.name} — [Available: {it.qty} {it.uom}] • ₹{it.price}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={posItemSearch}
                      onChange={e => {
                        setPosItemSearch(e.target.value);
                        const exact = items.find(
                          i =>
                            i.barcode === e.target.value.trim() ||
                            i.sku.toLowerCase() === e.target.value.trim().toLowerCase()
                        );
                        if (exact) {
                          setSelectedPosItemId(String(exact.id));
                          setPosItemPrice(exact.price);
                        }
                      }}
                      placeholder="Scan Barcode (e.g. 8908020260039) or SKU…"
                      className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Quantity</label>
                      <input
                        type="number"
                        min={1}
                        value={posItemQty}
                        onChange={e => setPosItemQty(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Unit Rate (₹)</label>
                      <input
                        type="number"
                        min={0}
                        value={posItemPrice}
                        onChange={e => setPosItemPrice(e.target.value)}
                        placeholder="Auto"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPosCartItem}
                      className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs flex items-center justify-center gap-1.5 shadow-sm h-[42px]"
                    >
                      <Plus className="w-4 h-4" /> Add to Bill
                    </button>
                  </div>

                  {/* Quick Tap Product Buttons */}
                  <div className="pt-3 border-t border-slate-100">
                    <div className="text-[10px] font-bold uppercase text-slate-400 mb-2">
                      1-Tap Quick Add Flagship Formulations
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {items.slice(0, 6).map(it => (
                        <button
                          key={it.id}
                          type="button"
                          disabled={it.qty <= 0}
                          onClick={() => {
                            const existing = posCart.find(c => c.id === it.id);
                            const nextQ = (existing ? existing.q : 0) + 1;
                            if (nextQ > it.qty) {
                              showNotice('error', `Only ${it.qty} units available for ${it.name}!`);
                              return;
                            }
                            if (existing) {
                              setPosCart(prev => prev.map(c => (c.id === it.id ? { ...c, q: nextQ } : c)));
                            } else {
                              setPosCart(prev => [
                                ...prev,
                                {
                                  id: it.id,
                                  productId: it.productId,
                                  sku: it.sku,
                                  name: it.name,
                                  q: 1,
                                  p: it.price,
                                  max: it.qty,
                                  uom: it.uom,
                                  gstHsnCode: it.gstHsnCode,
                                },
                              ]);
                            }
                          }}
                          className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/40 text-left transition disabled:opacity-40"
                        >
                          <div className="font-bold text-slate-800 text-[11px] line-clamp-1">{it.name}</div>
                          <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                            <span className="font-bold text-emerald-700">₹{it.price}</span>
                            <span className={it.qty <= 5 ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                              Stk: {it.qty}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Extra Charges */}
                  <div className="pt-3 border-t border-dashed border-slate-200 grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-6">
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                        Extra Charge (Optional)
                      </label>
                      <input
                        type="text"
                        value={extraName}
                        onChange={e => setExtraName(e.target.value)}
                        placeholder="e.g. Luxury Gift Box, Carry Bag"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Amount (₹)</label>
                      <input
                        type="number"
                        min={0}
                        value={extraAmt}
                        onChange={e => setExtraAmt(e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!extraName.trim() || Number(extraAmt) <= 0) return;
                          setPosExtraCharges(prev => [...prev, { n: extraName.trim(), a: Number(extraAmt) }]);
                          setExtraName('');
                          setExtraAmt('');
                        }}
                        className="w-full py-2 rounded-xl bg-slate-800 text-white text-xs font-bold"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: Active POS Invoice & Checkout */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-5 border-2 border-emerald-500 shadow-xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="text-base font-black uppercase text-slate-900 flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-emerald-600" />
                        Active Shop Bill ({posCart.reduce((s, i) => s + i.q, 0)} Units)
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Deducts live stock from <code className="text-emerald-700 font-bold">bhumivera.com</code> on
                        checkout
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPosCart([]);
                        setPosExtraCharges([]);
                        setPosDiscount(0);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold"
                    >
                      Clear Cart
                    </button>
                  </div>

                  {/* Cart Table */}
                  <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-100 text-slate-600 uppercase text-[10px]">
                        <tr>
                          <th className="py-2 px-3 text-left">Item</th>
                          <th className="py-2 px-3 text-center">Qty</th>
                          <th className="py-2 px-3 text-right">Total</th>
                          <th className="py-2 px-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {posCart.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-slate-400">
                              Scan or select products to build the bill.
                            </td>
                          </tr>
                        ) : (
                          posCart.map(c => (
                            <tr key={c.id}>
                              <td className="py-2 px-3">
                                <div className="font-bold text-slate-800 line-clamp-1">{c.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  ₹{c.p} × {c.q} (Max Web Stock: {c.max})
                                </div>
                              </td>
                              <td className="py-2 px-3 text-center whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handlePosCartQtyMod(c.id, -1)}
                                  className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 font-bold"
                                >
                                  -
                                </button>
                                <span className="mx-2 font-mono font-bold">{c.q}</span>
                                <button
                                  type="button"
                                  onClick={() => handlePosCartQtyMod(c.id, 1)}
                                  className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 font-bold"
                                >
                                  +
                                </button>
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-bold">₹{c.q * c.p}</td>
                              <td className="py-2 px-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => setPosCart(prev => prev.filter(x => x.id !== c.id))}
                                  className="text-rose-500 hover:text-rose-700 font-bold"
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                        {posExtraCharges.map((x, idx) => (
                          <tr key={idx} className="bg-emerald-50/50 text-emerald-900">
                            <td className="py-2 px-3 font-semibold">+ {x.n}</td>
                            <td className="py-2 px-3 text-center">-</td>
                            <td className="py-2 px-3 text-right font-mono font-bold">₹{x.a}</td>
                            <td className="py-2 px-2 text-right">
                              <button
                                type="button"
                                onClick={() => setPosExtraCharges(prev => prev.filter((_, i) => i !== idx))}
                                className="text-rose-500"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Calculation & Payment Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Subtotal:</span>
                    <span className="font-mono font-bold text-slate-900">₹{posCalculations.subTotal}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500">Discount (₹)</label>
                      <input
                        type="number"
                        min={0}
                        value={posDiscount}
                        onChange={e => setPosDiscount(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500">GST Tax Rate</label>
                      <select
                        value={posTaxRate}
                        onChange={e => setPosTaxRate(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 font-bold"
                      >
                        <option value={0}>0% (Nil)</option>
                        <option value={5}>5% GST</option>
                        <option value={12}>12% GST</option>
                        <option value={18}>18% GST</option>
                        <option value={28}>28% GST</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm font-black text-slate-900 border-t border-dashed border-slate-300 pt-2">
                    <span>Grand Payable Bill:</span>
                    <span className="text-lg text-emerald-700 font-mono">₹{posCalculations.billTotal}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-emerald-800">Payment Mode</label>
                      <select
                        value={posPaymentMode}
                        onChange={e => setPosPaymentMode(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 font-bold"
                      >
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI / QR Scan</option>
                        <option value="Card">Card</option>
                        <option value="Khata / Credit">Khata / Credit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-emerald-800">Paid Amount (₹)</label>
                      <input
                        type="number"
                        min={0}
                        value={posPaidAmount}
                        onChange={e => setPosPaidAmount(e.target.value)}
                        placeholder={String(posCalculations.billTotal)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-400 font-mono font-bold text-right"
                      />
                    </div>
                  </div>

                  {posPaymentMode === 'UPI' && upiQrDataUrl && (
                    <div className="p-2.5 rounded-xl bg-white border border-emerald-300 flex items-center gap-3">
                      <img src={upiQrDataUrl} alt="UPI QR" className="w-20 h-20 rounded border" />
                      <div className="text-[11px] space-y-1">
                        <div className="font-bold text-emerald-900">Scan Dynamic UPI QR</div>
                        <div className="font-mono text-slate-600">{cfg.upiId}</div>
                        <div className="font-bold text-slate-900">Exact Amount: ₹{posCalculations.billTotal}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between text-xs font-bold pt-1 border-t border-slate-200">
                    <span>Customer New Khata Balance:</span>
                    <span className={posCalculations.newBal < 0 ? 'text-rose-600 font-mono' : 'text-emerald-700 font-mono'}>
                      ₹{posCalculations.newBal}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePosCheckout}
                  className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Complete Bill &amp; Deduct Live Website Stock
                </button>
              </div>
            </div>
          )}

          {/* =================================================================
              VIEW 4: STORAGE KEEPER & MULTI-BIN RACK MAP
             ================================================================= */}
          {activeView === 'keeper' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black uppercase text-slate-900">
                    10X Warehouse Storage Keeper — Multi-Zone, Rack, Shelf &amp; Bin Coordinates
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track exact physical bin locations, sub-28°C cold-vault reserves, retail counter display stock, and
                    FEFO batch expiry dates.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTransferForm({
                        metaId: items[0]?.id || '',
                        direction: 'VAULT_TO_SHOP',
                        quantity: 10,
                        newBinCode: bins[0]?.bin_code || 'ASN-SHOP-R1-B01',
                        notes: 'Replenishing retail shop counter from cold vault',
                      });
                      setActiveModal('transfer');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <ArrowLeftRight className="w-4 h-4" /> Transfer Vault ↔ Shop Counter
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBin({
                        id: null,
                        binCode: `ASN-Z1-R0${bins.length + 1}-B01`,
                        hubName: 'Bhumivera Flagship Hub — Asansol',
                        zoneName: 'Zone A: Retail Shop Front Counter',
                        rackNo: `Rack-0${bins.length + 1}`,
                        shelfLevel: 'Shelf-A',
                        binLabel: 'Botanical Storage Bay',
                        temperatureTarget: '22°C - 25°C',
                        capacityUnits: 500,
                        occupiedUnits: 0,
                        keeperName: viewer?.fullName || 'Master Keeper',
                        status: 'active',
                        notes: '',
                      });
                      setActiveModal('bin');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Create Storage Bin
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bins.map(b => {
                  const binItems = items.filter(i => i.binCode === b.bin_code);
                  const pct = Math.min(
                    100,
                    Math.round(((Number(b.occupied_units) || 0) / Math.max(1, Number(b.capacity_units) || 500)) * 100)
                  );
                  return (
                    <div
                      key={b.bin_code}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-emerald-400 font-mono font-bold text-xs">
                            {b.bin_code}
                          </span>
                          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                            🌡️ {b.temperature_target}
                          </span>
                        </div>
                        <h4 className="font-black text-slate-900 text-sm">{b.bin_label}</h4>
                        <div className="text-xs text-slate-500">
                          {b.zone_name} • <b>{b.rack_no}</b> • <b>{b.shelf_level}</b>
                        </div>
                        <div className="text-[11px] text-slate-500">Assigned Keeper: <b>{b.keeper_name}</b></div>

                        <div className="pt-2 space-y-1">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span>Bin Capacity Utilization</span>
                            <span>
                              {b.occupied_units} / {b.capacity_units} Units ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
                          </div>
                        </div>

                        {binItems.length > 0 && (
                          <div className="pt-2 border-t border-slate-100 space-y-1">
                            <div className="text-[10px] font-bold uppercase text-slate-400">
                              Stored Formulations ({binItems.length})
                            </div>
                            {binItems.map(bi => (
                              <div key={bi.id} className="flex justify-between text-xs">
                                <span className="truncate font-semibold text-slate-700">{bi.name}</span>
                                <span className="font-mono font-bold text-emerald-700 shrink-0 ml-2">
                                  {bi.qty} {bi.uom}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setInvBinFilter(b.bin_code);
                            setActiveView('inv');
                          }}
                          className="text-xs font-bold text-emerald-700 hover:underline"
                        >
                          Inspect Bin Stock →
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBin({
                              id: b.id,
                              binCode: b.bin_code,
                              hubName: b.hub_name,
                              zoneName: b.zone_name,
                              rackNo: b.rack_no,
                              shelfLevel: b.shelf_level,
                              binLabel: b.bin_label,
                              temperatureTarget: b.temperature_target,
                              capacityUnits: b.capacity_units,
                              occupiedUnits: b.occupied_units,
                              keeperName: b.keeper_name,
                              status: b.status,
                              notes: b.notes || '',
                            });
                            setActiveModal('bin');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                        >
                          Edit Bin
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================================================================
              VIEW 5: PHYSICAL STOCK AUDIT & RECONCILIATION
             ================================================================= */}
          {activeView === 'audit' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black uppercase text-slate-900">
                    Physical Stock Audit &amp; Live Website Reconciliation
                  </h3>
                  <p className="text-xs text-slate-500">
                    Count physical bottles in your shop and warehouse bins, enter the counted quantity below, and click
                    Reconcile to sync <code className="text-emerald-700 font-bold">bhumivera.com</code> immediately.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={auditNote}
                    onChange={e => setAuditNote(e.target.value)}
                    placeholder="Audit Reference Note…"
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs w-64"
                  />
                  <button
                    type="button"
                    onClick={handleReconcilePhysicalAudit}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-sm"
                  >
                    Reconcile &amp; Sync to Live Website
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs">
                  <thead className="bg-slate-900 text-white uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4 text-left">SKU</th>
                      <th className="py-3 px-4 text-left">Formulation</th>
                      <th className="py-3 px-4 text-left">Bin Location</th>
                      <th className="py-3 px-4 text-center">System / Website Qty</th>
                      <th className="py-3 px-4 text-center">Physical Counted Qty</th>
                      <th className="py-3 px-4 text-center">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {items.map(it => {
                      const entered = auditCounts[it.id];
                      const hasCount = entered !== undefined && entered !== '';
                      const diff = hasCount ? Number(entered) - Number(it.qty) : 0;
                      return (
                        <tr key={it.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono font-bold">{it.sku}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{it.name}</td>
                          <td className="py-3 px-4 font-mono text-slate-600">{it.binCode}</td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">{it.qty}</td>
                          <td className="py-3 px-4 text-center">
                            <input
                              type="number"
                              min={0}
                              value={entered ?? ''}
                              onChange={e => setAuditCounts(prev => ({ ...prev, [it.id]: e.target.value }))}
                              placeholder={String(it.qty)}
                              className="w-28 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-center font-mono font-bold"
                            />
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold">
                            {!hasCount ? (
                              <span className="text-slate-400">—</span>
                            ) : diff === 0 ? (
                              <span className="text-emerald-600">0 (Exact Match)</span>
                            ) : (
                              <span className={diff > 0 ? 'text-blue-600' : 'text-rose-600'}>
                                {diff > 0 ? `+${diff}` : diff}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              VIEW 6: LIVE ONLINE WEBSITE ORDERS & DISPATCH QUEUE
             ================================================================= */}
          {activeView === 'online' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black uppercase text-slate-900">
                    Live Online Storefront Orders &amp; Warehouse Dispatch Queue
                  </h3>
                  <p className="text-xs text-slate-500">
                    Orders placed by customers on <code className="text-emerald-700 font-bold">www.bhumivera.com</code>{' '}
                    appear here automatically for picking, weighing, and courier dispatch.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fetchBootstrapData()}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold"
                >
                  Refresh Online Queue
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs">
                  <thead className="bg-slate-900 text-white uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4 text-left">Order #</th>
                      <th className="py-3 px-4 text-left">Customer &amp; Destination</th>
                      <th className="py-3 px-4 text-left">Ordered Formulations</th>
                      <th className="py-3 px-4 text-right">Amount &amp; Mode</th>
                      <th className="py-3 px-4 text-center">Current Status</th>
                      <th className="py-3 px-4 text-right">Warehouse Dispatch Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {onlineOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-400">
                          No active online orders awaiting warehouse dispatch.
                        </td>
                      </tr>
                    ) : (
                      onlineOrders.map(ord => (
                        <tr key={ord.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono">
                            <div className="font-bold text-slate-900">#{ord.orderNumber}</div>
                            <div className="text-[10px] text-slate-500">
                              {new Date(ord.createdAt).toLocaleString()}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{ord.customerName}</div>
                            <div className="text-[11px] text-slate-500">
                              {ord.city} {ord.state} {ord.pincode} • {ord.customerPhone}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {(ord.items || []).map((it, idx) => (
                              <div key={idx} className="text-[11px] font-semibold text-slate-700">
                                • {it.name} <span className="font-mono font-bold text-emerald-700">×{it.quantity}</span>
                              </div>
                            ))}
                          </td>
                          <td className="py-3 px-4 text-right font-mono">
                            <div className="font-bold text-slate-900">₹{ord.total}</div>
                            <div className="text-[10px] uppercase text-slate-500">
                              {ord.paymentMode} ({ord.paymentStatus})
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                              {ord.status}
                            </span>
                            {ord.trackingNumber && (
                              <div className="text-[10px] font-mono text-slate-500 mt-1">AWB: {ord.trackingNumber}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              {['packed', 'shipped', 'delivered'].map(st => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleUpdateOnlineOrderStatus(ord.id, st)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                                    ord.status === st
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              VIEW 7: SUPPLIERS & GOODS RECEIPT NOTE (GRN) INWARDING
             ================================================================= */}
          {activeView === 'grn' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black uppercase text-slate-900">
                    Suppliers &amp; Goods Receipt Note (GRN) Batch Inwarding
                  </h3>
                  <p className="text-xs text-slate-500">
                    Receive newly bottled production batches or raw materials into bins and automatically increment live
                    website stock.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSupplierForm({
                        id: null,
                        name: '',
                        companyName: '',
                        phone: '',
                        email: '',
                        gstin: '',
                        city: '',
                        supplyCategory: 'Botanical Extracts & Packaging',
                        payableBalance: 0,
                        leadTimeDays: 5,
                        notes: '',
                      });
                      setActiveModal('supplier');
                    }}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold"
                  >
                    + Add Supplier
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGrnForm(prev => ({
                        ...prev,
                        metaId: items[0]?.id || '',
                        supplierName: suppliers[0]?.name || 'Himalayan Phyto-Actives & Cold-Press Labs',
                      }));
                      setActiveModal('grn');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <PackagePlus className="w-4 h-4" /> Post New GRN Stock Inward
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <h4 className="text-sm font-black uppercase text-slate-800">
                    Registered Suppliers &amp; Labs ({suppliers.length})
                  </h4>
                  <div className="space-y-2.5">
                    {suppliers.map(sup => (
                      <div key={sup.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{sup.name}</span>
                          <span className="font-mono text-xs text-emerald-700">{sup.supplier_code}</span>
                        </div>
                        <div className="text-xs text-slate-600">{sup.supply_category}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {sup.city} • Phone: {sup.phone || '-'} • GSTIN: {sup.gstin || '-'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <h4 className="text-sm font-black uppercase text-slate-800">
                    Recent Goods Receipt Notes (GRN Inward Ledger)
                  </h4>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-900 text-white uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3 text-left">GRN #</th>
                          <th className="py-2.5 px-3 text-left">Formulation &amp; Batch</th>
                          <th className="py-2.5 px-3 text-center">Accepted Qty</th>
                          <th className="py-2.5 px-3 text-left">Bin</th>
                          <th className="py-2.5 px-3 text-right">Total Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {grnEntries.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-400">
                              No GRN inward entries recorded yet. Click "Post New GRN Stock Inward" above.
                            </td>
                          </tr>
                        ) : (
                          grnEntries.map(g => (
                            <tr key={g.id}>
                              <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{g.grn_no}</td>
                              <td className="py-2.5 px-3">
                                <div className="font-bold text-slate-900">{g.product_name}</div>
                                <div className="text-[10px] text-slate-500">
                                  Batch: {g.batch_no} • Supplier: {g.supplier_name}
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-700">
                                +{g.accepted_qty}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-xs">{g.bin_code}</td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold">₹{g.total_cost}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              VIEW 8: CUSTOMER LEDGER & KHATA MANAGEMENT
             ================================================================= */}
          {activeView === 'map' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black uppercase text-slate-900">
                    Customer Directory &amp; Khata Credit Ledger
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage retail &amp; B2B salon accounts, record payments received with screenshot proof, and send
                    WhatsApp reminders.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCustomer({
                      id: null,
                      name: '',
                      phone: '',
                      email: '',
                      gstin: '',
                      loc: '',
                      type: 'Walk-in',
                      wallet: 0,
                      creditLimit: 50000,
                    });
                    setActiveModal('customer');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" /> Add Customer Profile
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs">
                  <thead className="bg-slate-900 text-white uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4 text-left">Customer / Business Name</th>
                      <th className="py-3 px-4 text-left">Phone &amp; GSTIN</th>
                      <th className="py-3 px-4 text-left">Location</th>
                      <th className="py-3 px-4 text-center">Segment</th>
                      <th className="py-3 px-4 text-right">Khata Balance (₹)</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {customers.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                        <td className="py-3 px-4 font-mono">
                          <div>{c.phone || '-'}</div>
                          {c.gstin && <div className="text-[10px] text-slate-500">GSTIN: {c.gstin}</div>}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{c.loc || '-'}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                            {c.type}
                          </span>
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-mono font-black text-sm ${
                            c.wallet < 0 ? 'text-rose-600' : 'text-emerald-700'
                          }`}
                        >
                          ₹{c.wallet}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setKhataForm({
                                  customerId: c.id,
                                  customerName: c.name,
                                  currentBal: c.wallet,
                                  type: 'RECEIVE_PAYMENT',
                                  amount: c.wallet < 0 ? String(Math.abs(c.wallet)) : '',
                                  paymentMode: 'UPI',
                                  note: '',
                                  proofBase64: null,
                                });
                                setActiveModal('khata');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold"
                            >
                              Transact Khata
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (c.wallet >= 0) {
                                  showNotice('info', `${c.name} has no outstanding Khata debt.`);
                                  return;
                                }
                                const debt = Math.abs(c.wallet);
                                const txt = `Dear ${c.name} 🙏\n\nFriendly reminder regarding your outstanding Khata balance of *₹${debt}* with *${cfg.storeName}*.\n\nPlease remit via UPI to: *${cfg.upiId}*\n\nThank you!`;
                                const ph = (c.phone || '').replace(/[^0-9]/g, '');
                                window.open(
                                  `https://api.whatsapp.com/send?phone=${ph}&text=${encodeURIComponent(txt)}`,
                                  '_blank'
                                );
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                            >
                              Remind WA
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCustomer({ ...c });
                                setActiveModal('customer');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              VIEW 9: STOCK ADJUSTMENTS & INTERNAL WRITE-OFFS
             ================================================================= */}
          {activeView === 'trans' && (
            <div className="max-w-xl mx-auto bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black uppercase text-slate-900 border-b border-slate-100 pb-3">
                Stock Adjustment / Damage Write-Off (Syncs with Website)
              </h3>
              <p className="text-xs text-slate-500">
                Record stock deductions for damaged bottles, expired batches, lab testing samples, or audit adjustments.
                Deducts immediately from <code className="text-emerald-700 font-bold">bhumivera.com</code>.
              </p>
              <form onSubmit={handleExecuteStockAdjustment} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">Select Formulation</label>
                  <select
                    value={adjustmentForm.metaId || items[0]?.id || ''}
                    onChange={e => setAdjustmentForm(prev => ({ ...prev, metaId: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                  >
                    {items.map(it => (
                      <option key={it.id} value={it.id}>
                        {it.name} (Current Live Stock: {it.qty})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase text-slate-600 mb-1">Operation</label>
                    <select
                      value={adjustmentForm.operation}
                      onChange={e => setAdjustmentForm(prev => ({ ...prev, operation: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                    >
                      <option value="subtract">Deduct Stock (-)</option>
                      <option value="add">Add Stock (+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-slate-600 mb-1">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={adjustmentForm.quantity}
                      onChange={e => setAdjustmentForm(prev => ({ ...prev, quantity: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">Reason for Adjustment</label>
                  <select
                    value={adjustmentForm.reason}
                    onChange={e => setAdjustmentForm(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold"
                  >
                    <option>Damaged in Transit / Storage (Move to Quarantine)</option>
                    <option>Expired Stock (Move to Quarantine)</option>
                    <option>Quality Control / Lab Assay Sample</option>
                    <option>Founder / Marketing PR Sample</option>
                    <option>Inventory Audit Discrepancy</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-wider"
                >
                  Execute Adjustment &amp; Sync Website Stock
                </button>
              </form>
            </div>
          )}

          {/* =================================================================
              VIEW 10: CUSTOMER RETURNS & QUARANTINE
             ================================================================= */}
          {activeView === 'ret' && (
            <div className="max-w-xl mx-auto bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black uppercase text-slate-900 border-b border-slate-100 pb-3">
                Customer Returns, Exchanges &amp; Quarantine Intake
              </h3>
              <p className="text-xs text-slate-500">
                Process returned items in <b>Restock Mode</b> (adds back to live website stock) or{' '}
                <b>Quarantine/Scrap Mode</b> (logs to damaged bay without adding to sellable website stock).
              </p>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">Customer</label>
                  <select
                    value={returnForm.customerId}
                    onChange={e => setReturnForm(prev => ({ ...prev, customerId: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                  >
                    <option value="">Walk-in / General Return</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">Returned Formulation</label>
                  <select
                    value={returnForm.metaId || items[0]?.id || ''}
                    onChange={e => setReturnForm(prev => ({ ...prev, metaId: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                  >
                    {items.map(it => (
                      <option key={it.id} value={it.id}>
                        {it.name} (Current Stock: {it.qty})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">Quantity Returned</label>
                  <input
                    type="number"
                    min={1}
                    value={returnForm.quantity}
                    onChange={e => setReturnForm(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleExecuteReturn('GOOD')}
                    className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase"
                  >
                    Restock (Unopened / Good)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExecuteReturn('BAD')}
                    className="py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black uppercase"
                  >
                    Quarantine (Damaged / Opened)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              VIEW 11: TIME-MACHINE REPORTS, INVOICES & PROOF GALLERY
             ================================================================= */}
          {activeView === 'rep' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-black uppercase text-slate-900">Time-Machine Reports</h3>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Filter by Date</label>
                  <input
                    type="date"
                    value={reportDate}
                    onChange={e => setReportDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Or Search Invoice # / Customer
                  </label>
                  <input
                    type="text"
                    value={reportSearchInv}
                    onChange={e => setReportSearchInv(e.target.value)}
                    placeholder="e.g. BV-POS-2026-00001"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                  />
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-emerald-800">Selected Period Revenue</div>
                  <div className="text-2xl font-black text-emerald-700 font-mono">
                    ₹
                    {filteredReportSales
                      .filter(s => s.status !== 'cancelled')
                      .reduce((sum, s) => sum + (Number(s.billTotal) || 0), 0)
                      .toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    {filteredReportSales.length} POS Invoices Generated
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowProofGallery(prev => !prev)}
                    className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold"
                  >
                    {showProofGallery ? 'Show Invoices Table' : `View Payment Proof Gallery (${proofs.filter(p => p.src).length})`}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSnapshotBackup}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    Save Daily Snapshot (.avbak.json)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportDate('')}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                  >
                    Show All Historical Invoices
                  </button>
                </div>
              </div>

              <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                {showProofGallery ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-black uppercase text-slate-800">Uploaded Payment Proof Gallery</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {proofs.filter(p => p.src).length === 0 ? (
                        <div className="col-span-3 py-12 text-center text-slate-400">
                          No payment proof screenshots uploaded yet.
                        </div>
                      ) : (
                        proofs
                          .filter(p => p.src)
                          .map(p => (
                            <div
                              key={p.id}
                              onClick={() => {
                                setViewingImageSrc(p.src);
                                setActiveModal('img-viewer');
                              }}
                              className="border rounded-xl overflow-hidden cursor-pointer hover:shadow-md"
                            >
                              <img src={p.src} alt="Proof" className="w-full h-36 object-cover" />
                              <div className="p-2.5 text-xs">
                                <div className="font-bold">{p.cust}</div>
                                <div className="text-emerald-700 font-mono font-bold">+₹{p.amt}</div>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-900 text-white uppercase text-[10px]">
                        <tr>
                          <th className="py-3 px-4 text-left">Invoice # &amp; Time</th>
                          <th className="py-3 px-4 text-left">Customer</th>
                          <th className="py-3 px-4 text-left">Items</th>
                          <th className="py-3 px-4 text-right">Bill Total</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredReportSales.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-10 text-center text-slate-400">
                              No POS invoices found for this filter.
                            </td>
                          </tr>
                        ) : (
                          filteredReportSales.map(s => (
                            <tr key={s.id} className="hover:bg-slate-50">
                              <td className="py-3 px-4 font-mono">
                                <div className="font-bold text-slate-900">{s.invoiceNo}</div>
                                <div className="text-[10px] text-slate-500">{new Date(s.date).toLocaleString()}</div>
                              </td>
                              <td className="py-3 px-4 font-bold">{s.cust?.name}</td>
                              <td className="py-3 px-4 text-[11px] text-slate-600">
                                {(s.items || []).map(i => `${i.name} (x${i.q})`).join(', ')}
                              </td>
                              <td className="py-3 px-4 text-right font-mono font-bold">₹{s.billTotal}</td>
                              <td className="py-3 px-4 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    s.status === 'cancelled'
                                      ? 'bg-rose-100 text-rose-700'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {s.status || 'completed'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="inline-flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setViewingSale(s);
                                      setActiveModal('view-sale');
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold"
                                  >
                                    Inspect / Print
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================================================================
              VIEW 12: UNIFIED STOCK MOVEMENT LEDGER & 512-BIT AUDIT TRAIL
             ================================================================= */}
          {activeView === 'logs' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLogSubTab('movements')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold ${
                      logSubTab === 'movements' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    1. Omnichannel Stock Movement Ledger ({movements.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogSubTab('audit')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold ${
                      logSubTab === 'audit' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    2. 512-Bit Cryptographic Operations Audit ({logs.length})
                  </button>
                </div>
              </div>

              {logSubTab === 'movements' ? (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-900 text-white uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4 text-left">Timestamp</th>
                        <th className="py-3 px-4 text-left">Type</th>
                        <th className="py-3 px-4 text-left">Product / SKU</th>
                        <th className="py-3 px-4 text-center">Before → Delta → After</th>
                        <th className="py-3 px-4 text-left">Bin / Reference</th>
                        <th className="py-3 px-4 text-left">Operator &amp; Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {movements.map(m => (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500">
                            {new Date(m.created_at).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-[10px]">
                              {m.movement_type}
                            </span>
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="font-bold text-slate-900">{m.product_name}</div>
                            <div className="text-[10px] font-mono text-slate-500">{m.sku}</div>
                          </td>
                          <td className="py-2.5 px-4 text-center font-mono font-bold">
                            <span className="text-slate-500">{m.qty_before}</span> →{' '}
                            <span className={m.qty_delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                              {m.qty_delta >= 0 ? `+${m.qty_delta}` : m.qty_delta}
                            </span>{' '}
                            → <span className="text-slate-900">{m.qty_after}</span>
                          </td>
                          <td className="py-2.5 px-4 font-mono text-[11px]">
                            <div>Bin: {m.bin_code || '-'}</div>
                            {m.reference_id && <div className="text-emerald-700">Ref: {m.reference_id}</div>}
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="font-bold text-slate-800">@{m.operator_username}</div>
                            <div className="text-[11px] text-slate-500">{m.reason}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-900 text-white uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4 text-left">Timestamp</th>
                        <th className="py-3 px-4 text-left">Operator</th>
                        <th className="py-3 px-4 text-left">Action Code</th>
                        <th className="py-3 px-4 text-left">Activity Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {logs.map(l => (
                        <tr key={l.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500">
                            {new Date(l.t).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-4 font-bold">
                            @{l.user} <span className="text-[10px] text-slate-400 uppercase">({l.role})</span>
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                              {l.act}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-700">{l.msg}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
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
          MODAL: ADD / EDIT INVENTORY ITEM
         ===================================================================== */}
      {activeModal === 'item' && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveItemModal}
            className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto text-xs"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black uppercase text-slate-900">
                {editingItem.id ? 'Edit Formulation & Sync Website Stock' : 'Add New Formulation / SKU'}
              </h3>
              <button type="button" onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">Product / Formulation Name *</label>
              <input
                type="text"
                required
                value={editingItem.name}
                onChange={e => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">SKU Code</label>
                <input
                  type="text"
                  value={editingItem.sku}
                  onChange={e => setEditingItem(prev => ({ ...prev, sku: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Barcode (EAN-13)</label>
                <input
                  type="text"
                  value={editingItem.barcode}
                  onChange={e => setEditingItem(prev => ({ ...prev, barcode: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Category</label>
                <select
                  value={editingItem.cat}
                  onChange={e => setEditingItem(prev => ({ ...prev, cat: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold"
                >
                  {(cfg.cats || []).map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div>
                <label className="block font-bold uppercase text-emerald-900 mb-1">Total Stock Qty</label>
                <input
                  type="number"
                  min={0}
                  value={editingItem.qty}
                  onChange={e => {
                    const total = Math.max(0, parseInt(e.target.value, 10) || 0);
                    const shop = Math.min(total, editingItem.shopDisplayStock || Math.ceil(total * 0.3));
                    setEditingItem(prev => ({
                      ...prev,
                      qty: total,
                      shopDisplayStock: shop,
                      warehouseVaultStock: Math.max(0, total - shop),
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-emerald-400 font-mono font-black text-sm"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-emerald-900 mb-1">Shop Counter</label>
                <input
                  type="number"
                  min={0}
                  value={editingItem.shopDisplayStock}
                  onChange={e => setEditingItem(prev => ({ ...prev, shopDisplayStock: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-emerald-900 mb-1">Cold Vault</label>
                <input
                  type="number"
                  min={0}
                  value={editingItem.warehouseVaultStock}
                  onChange={e => setEditingItem(prev => ({ ...prev, warehouseVaultStock: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-emerald-900 mb-1">Safety Buffer</label>
                <input
                  type="number"
                  min={0}
                  value={editingItem.safetyBufferStock || 0}
                  onChange={e => setEditingItem(prev => ({ ...prev, safetyBufferStock: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Unit Cost (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={editingItem.costPrice}
                  onChange={e => setEditingItem(prev => ({ ...prev, costPrice: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">MRP (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={editingItem.mrp}
                  onChange={e => setEditingItem(prev => ({ ...prev, mrp: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Selling Price (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={editingItem.price}
                  onChange={e => setEditingItem(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">GST Rate (%)</label>
                <input
                  type="number"
                  min={0}
                  value={editingItem.gstRate}
                  onChange={e => setEditingItem(prev => ({ ...prev, gstRate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Assigned Storage Bin</label>
                <select
                  value={editingItem.binCode}
                  onChange={e => setEditingItem(prev => ({ ...prev, binCode: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                >
                  {bins.map(b => (
                    <option key={b.bin_code} value={b.bin_code}>
                      {b.bin_code}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Batch Number</label>
                <input
                  type="text"
                  value={editingItem.batchNo || ''}
                  onChange={e => setEditingItem(prev => ({ ...prev, batchNo: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={editingItem.expiryDate || ''}
                  onChange={e => setEditingItem(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase"
              >
                Save &amp; Sync to Live Website
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black uppercase text-slate-900">
              Invoice {lastCompletedSale.invoiceNo} Generated!
            </h3>
            <p className="text-xs text-slate-500">
              Live website stock on <code className="text-emerald-700 font-bold">bhumivera.com</code> has been
              atomically deducted so online customers see the updated stock immediately.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left font-mono text-xs space-y-1">
              <div>
                Customer: <b>{lastCompletedSale.cust?.name}</b>
              </div>
              <div>
                Bill Total: <b className="text-emerald-700">₹{lastCompletedSale.billTotal}</b>
              </div>
              <div>
                Paid ({lastCompletedSale.paymentMode}): <b>₹{lastCompletedSale.paid}</b>
              </div>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleShareWhatsAppInvoice(lastCompletedSale)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Share Invoice on WhatsApp
              </button>
              <button
                type="button"
                onClick={() => handlePrintA4Invoice(lastCompletedSale)}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print / Save Official A4 GST Tax Invoice
              </button>
              <button
                type="button"
                onClick={() => handlePrintThermal(lastCompletedSale)}
                className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-xs"
              >
                Print 80mm Thermal POS Receipt
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 font-semibold"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs">
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
          MODAL: CUSTOMER ADD / EDIT
         ===================================================================== */}
      {activeModal === 'customer' && editingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveCustomer} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black uppercase">Customer &amp; Khata Profile</h3>
              <button type="button" onClick={() => setActiveModal(null)}>
                ✕
              </button>
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">Customer / Business Name *</label>
              <input
                type="text"
                required
                value={editingCustomer.name}
                onChange={e => setEditingCustomer(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Phone / WhatsApp *</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.phone}
                  onChange={e => setEditingCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Customer GSTIN</label>
                <input
                  type="text"
                  value={editingCustomer.gstin || ''}
                  onChange={e => setEditingCustomer(prev => ({ ...prev, gstin: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">City / Address</label>
              <input
                type="text"
                value={editingCustomer.loc || ''}
                onChange={e => setEditingCustomer(prev => ({ ...prev, loc: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Segment</label>
                <select
                  value={editingCustomer.type || 'Walk-in'}
                  onChange={e => setEditingCustomer(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                >
                  <option value="Walk-in">Walk-in</option>
                  <option value="Retail Shop">Retail Shop</option>
                  <option value="Salon / Spa Partner">Salon / Spa Partner</option>
                  <option value="Wholesale Distributor">Wholesale Distributor</option>
                  <option value="VIP Patron">VIP Patron</option>
                </select>
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Credit Limit (₹)</label>
                <input
                  type="number"
                  value={editingCustomer.creditLimit || 50000}
                  onChange={e => setEditingCustomer(prev => ({ ...prev, creditLimit: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono font-bold"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black uppercase">
                Save Customer
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-3 rounded-xl bg-slate-100 font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================================
          MODAL: KHATA TRANSACTION (ADD DEBT / RECEIVE PAYMENT + PROOF)
         ===================================================================== */}
      {activeModal === 'khata' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleExecuteKhataTx} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black uppercase">Khata Ledger Transaction — {khataForm.customerName}</h3>
              <button type="button" onClick={() => setActiveModal(null)}>
                ✕
              </button>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <div className="text-[11px] text-amber-800 font-bold">Current Khata Balance</div>
              <div className="text-2xl font-black text-amber-900 font-mono">₹{khataForm.currentBal}</div>
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">Transaction Type</label>
              <select
                value={khataForm.type}
                onChange={e => setKhataForm(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold"
              >
                <option value="RECEIVE_PAYMENT">Receive Payment (Clears Customer Debt)</option>
                <option value="ADD_DEBT">Add Credit Debt (Gave Goods on Credit)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={khataForm.amount}
                  onChange={e => setKhataForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono font-bold text-sm"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Mode</label>
                <select
                  value={khataForm.paymentMode}
                  onChange={e => setKhataForm(prev => ({ ...prev, paymentMode: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank NEFT/IMPS</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">Reference Note</label>
              <input
                type="text"
                value={khataForm.note}
                onChange={e => setKhataForm(prev => ({ ...prev, note: e.target.value }))}
                placeholder="e.g. UTR # / Cash Receipt"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
              />
            </div>
            {khataForm.type === 'RECEIVE_PAYMENT' && (
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">
                  Upload Payment Screenshot / Slip (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const r = new FileReader();
                    r.onload = ev => setKhataForm(prev => ({ ...prev, proofBase64: ev.target.result }));
                    r.readAsDataURL(f);
                  }}
                  className="w-full text-xs"
                />
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black uppercase">
                Record Transaction
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-3 rounded-xl bg-slate-100 font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================================
          MODAL: STORAGE BIN CREATE / EDIT
         ===================================================================== */}
      {activeModal === 'bin' && editingBin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveBin} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black uppercase">Storage Keeper Bin Configuration</h3>
              <button type="button" onClick={() => setActiveModal(null)}>
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Bin Code *</label>
                <input
                  type="text"
                  required
                  value={editingBin.binCode}
                  onChange={e => setEditingBin(prev => ({ ...prev, binCode: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Target Temp</label>
                <input
                  type="text"
                  value={editingBin.temperatureTarget}
                  onChange={e => setEditingBin(prev => ({ ...prev, temperatureTarget: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">Warehouse Zone *</label>
              <input
                type="text"
                required
                value={editingBin.zoneName}
                onChange={e => setEditingBin(prev => ({ ...prev, zoneName: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Rack Number</label>
                <input
                  type="text"
                  value={editingBin.rackNo}
                  onChange={e => setEditingBin(prev => ({ ...prev, rackNo: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Shelf Level</label>
                <input
                  type="text"
                  value={editingBin.shelfLevel}
                  onChange={e => setEditingBin(prev => ({ ...prev, shelfLevel: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">Bin Description / Label</label>
              <input
                type="text"
                value={editingBin.binLabel}
                onChange={e => setEditingBin(prev => ({ ...prev, binLabel: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Max Capacity (Units)</label>
                <input
                  type="number"
                  value={editingBin.capacityUnits}
                  onChange={e => setEditingBin(prev => ({ ...prev, capacityUnits: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Keeper Name</label>
                <input
                  type="text"
                  value={editingBin.keeperName}
                  onChange={e => setEditingBin(prev => ({ ...prev, keeperName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black uppercase">
                Save Storage Bin
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-3 rounded-xl bg-slate-100 font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================================
          MODAL: INTERNAL BIN / VAULT ↔ SHOP STOCK TRANSFER
         ===================================================================== */}
      {activeModal === 'transfer' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleExecuteBinTransfer}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black uppercase">Internal Vault ↔ Shop Counter Transfer</h3>
              <button type="button" onClick={() => setActiveModal(null)}>
                ✕
              </button>
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">Select Formulation</label>
              <select
                value={transferForm.metaId}
                onChange={e => setTransferForm(prev => ({ ...prev, metaId: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold"
              >
                {items.map(it => (
                  <option key={it.id} value={it.id}>
                    {it.name} (Shop: {it.shopDisplayStock} | Vault: {it.warehouseVaultStock})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Transfer Direction</label>
                <select
                  value={transferForm.direction}
                  onChange={e => setTransferForm(prev => ({ ...prev, direction: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                >
                  <option value="VAULT_TO_SHOP">Cold Vault → Shop Counter</option>
                  <option value="SHOP_TO_VAULT">Shop Counter → Cold Vault</option>
                </select>
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Quantity to Move</label>
                <input
                  type="number"
                  min={1}
                  value={transferForm.quantity}
                  onChange={e => setTransferForm(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono font-bold"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">Assign Primary Bin</label>
              <select
                value={transferForm.newBinCode}
                onChange={e => setTransferForm(prev => ({ ...prev, newBinCode: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
              >
                {bins.map(b => (
                  <option key={b.bin_code} value={b.bin_code}>
                    {b.bin_code} — {b.bin_label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-black uppercase">
                Execute Transfer
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-3 rounded-xl bg-slate-100 font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================================
          MODAL: POST GRN STOCK INWARD
         ===================================================================== */}
      {activeModal === 'grn' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handlePostGrnInward}
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black uppercase">Post Goods Receipt Note (GRN Stock Inward)</h3>
              <button type="button" onClick={() => setActiveModal(null)}>
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Supplier / Lab</label>
                <input
                  type="text"
                  required
                  value={grnForm.supplierName}
                  onChange={e => setGrnForm(prev => ({ ...prev, supplierName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Target Bin</label>
                <select
                  value={grnForm.binCode}
                  onChange={e => setGrnForm(prev => ({ ...prev, binCode: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                >
                  {bins.map(b => (
                    <option key={b.bin_code} value={b.bin_code}>
                      {b.bin_code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">Select Formulation to Inward *</label>
              <select
                value={grnForm.metaId}
                onChange={e => setGrnForm(prev => ({ ...prev, metaId: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold"
              >
                {items.map(it => (
                  <option key={it.id} value={it.id}>
                    {it.name} (Current Stock: {it.qty})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Received Qty *</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={grnForm.receivedQty}
                  onChange={e => setGrnForm(prev => ({ ...prev, receivedQty: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-400 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Damaged / Rejected</label>
                <input
                  type="number"
                  min={0}
                  value={grnForm.rejectedQty}
                  onChange={e => setGrnForm(prev => ({ ...prev, rejectedQty: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Unit Cost (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={grnForm.unitCost}
                  onChange={e => setGrnForm(prev => ({ ...prev, unitCost: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Batch Number</label>
                <input
                  type="text"
                  value={grnForm.batchNo}
                  onChange={e => setGrnForm(prev => ({ ...prev, batchNo: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Mfg Date</label>
                <input
                  type="date"
                  value={grnForm.mfgDate}
                  onChange={e => setGrnForm(prev => ({ ...prev, mfgDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={grnForm.expiryDate}
                  onChange={e => setGrnForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black uppercase">
                Inward Batch &amp; Add to Live Website Stock
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-3 rounded-xl bg-slate-100 font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================================
          MODAL: ADD SUPPLIER
         ===================================================================== */}
      {activeModal === 'supplier' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveSupplier} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black uppercase">Supplier / Lab Profile</h3>
              <button type="button" onClick={() => setActiveModal(null)}>
                ✕
              </button>
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">Supplier Name *</label>
              <input
                type="text"
                required
                value={supplierForm.name}
                onChange={e => setSupplierForm(prev => ({ ...prev, name: e.target.value, companyName: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Phone</label>
                <input
                  type="text"
                  value={supplierForm.phone}
                  onChange={e => setSupplierForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">GSTIN</label>
                <input
                  type="text"
                  value={supplierForm.gstin}
                  onChange={e => setSupplierForm(prev => ({ ...prev, gstin: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">City / State</label>
              <input
                type="text"
                value={supplierForm.city}
                onChange={e => setSupplierForm(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black uppercase">
                Save Supplier
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-3 rounded-xl bg-slate-100 font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================================
          MODAL: BARCODE / QR SHELF LABEL GENERATOR
         ===================================================================== */}
      {activeModal === 'label' && labelItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-black uppercase">Printable Shelf &amp; Bin QR Label</h3>
              <button type="button" onClick={() => setActiveModal(null)}>
                ✕
              </button>
            </div>
            <div className="p-4 border-2 border-dashed border-slate-400 rounded-xl space-y-2">
              <div className="font-black text-slate-900 text-sm uppercase">BHUMIVERA ORGANICS</div>
              <div className="font-bold text-slate-800">{labelItem.name}</div>
              {labelQrUrl && <img src={labelQrUrl} alt="QR" className="w-32 h-32 mx-auto" />}
              <div className="font-mono font-bold text-xs">
                SKU: {labelItem.sku} | Bin: {labelItem.binCode}
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
              onClick={() => window.print()}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold"
            >
              Print Shelf Label
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: STORE & BILLING SETTINGS
         ===================================================================== */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black uppercase">Store &amp; Billing Configuration</h3>
              <button type="button" onClick={() => setActiveModal(null)}>
                ✕
              </button>
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">Business / Store Name</label>
              <input
                type="text"
                value={cfg.storeName}
                onChange={e => setCfg(prev => ({ ...prev, storeName: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">Registered Address</label>
              <input
                type="text"
                value={cfg.address}
                onChange={e => setCfg(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Phone</label>
                <input
                  type="text"
                  value={cfg.phone}
                  onChange={e => setCfg(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">GSTIN</label>
                <input
                  type="text"
                  value={cfg.gstin}
                  onChange={e => setCfg(prev => ({ ...prev, gstin: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-600 mb-1">UPI ID (for Live POS QR Code)</label>
              <input
                type="text"
                value={cfg.upiId}
                onChange={e => setCfg(prev => ({ ...prev, upiId: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await api.put('/inventory-software/config', cfg, reqConfig);
                    showNotice('success', 'Store settings saved.');
                    setActiveModal(null);
                  } catch (err) {
                    showNotice('error', err.response?.data?.message || 'Could not save settings.');
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black uppercase"
              >
                Save Configuration
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-3 rounded-xl bg-slate-100 font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: MANAGE CATEGORIES
         ===================================================================== */}
      {activeModal === 'cats' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black uppercase">Product Categories</h3>
              <button type="button" onClick={() => setActiveModal(null)}>
                ✕
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                placeholder="New Category Name…"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold"
              />
              <button
                type="button"
                onClick={async () => {
                  if (!newCategoryName.trim()) return;
                  const nextCats = [...new Set([...(cfg.cats || []), newCategoryName.trim()])];
                  setCfg(prev => ({ ...prev, cats: nextCats }));
                  setNewCategoryName('');
                  await api.put('/inventory-software/config', { ...cfg, cats: nextCats }, reqConfig).catch(() => {});
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold"
              >
                Add
              </button>
            </div>
            <div className="divide-y max-h-60 overflow-y-auto">
              {(cfg.cats || []).map(c => (
                <div key={c} className="py-2 flex items-center justify-between">
                  <span className="font-semibold">{c}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      const nextCats = (cfg.cats || []).filter(x => x !== c);
                      setCfg(prev => ({ ...prev, cats: nextCats }));
                      await api.put('/inventory-software/config', { ...cfg, cats: nextCats }, reqConfig).catch(() => {});
                    }}
                    className="text-rose-500 font-bold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
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
    </div>
  );
}
