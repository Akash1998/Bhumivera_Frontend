import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Activity,
  Users,
  ShoppingBag,
  Package,
  Boxes,
  Tags,
  Warehouse,
  Truck,
  FileText,
  RotateCcw,
  Award,
  Sparkles,
  Gift,
  Headphones,
  Server,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  ExternalLink,
  X,
  Pause,
  Play,
  Plus,
  Trash2,
  Eye,
  Edit3,
  Sliders,
  Terminal,
  Cpu,
  Database,
  Globe,
  LogOut,
  Clock,
  PhoneCall,
  Mail,
  Wallet,
  Leaf,
  Star,
  Bell,
  ChartNoAxesCombined,
  Settings2,
} from 'lucide-react';

// Single-Master Architecture: Lazy-load existing platform workspaces without duplicate codebases
const DashboardOverview = lazy(() => import('./admin/DashboardOverview'));
const ProductManagement = lazy(() => import('./admin/ProductManagement'));
const CategoryManagement = lazy(() => import('./admin/CategoryManagement'));
const OrderManagement = lazy(() => import('./admin/OrderManagement'));
const UserManagement = lazy(() => import('./admin/UserManagement'));
const AnalyticsManagement = lazy(() => import('./admin/AnalyticsManagement'));
const InventoryManagement = lazy(() => import('./admin/InventoryManagement'));
const ReviewManagement = lazy(() => import('./admin/ReviewManagement'));
const ReturnManagement = lazy(() => import('./admin/ReturnManagement'));
const NotificationManagement = lazy(() => import('./admin/NotificationManagement'));
const TaxManagement = lazy(() => import('./admin/TaxManagement'));
const GSTAccounting = lazy(() => import('./admin/GSTAccounting'));
const WarehouseManagement = lazy(() => import('./admin/WarehouseManagement'));
const ShippingManagement = lazy(() => import('./admin/ShippingManagement'));
const AdminSettings = lazy(() => import('./admin/AdminSettings.jsx'));
const ImpactManagement = lazy(() => import('./admin/ImpactManagement.jsx'));
const GrowthOffersHub = lazy(() => import('./admin/GrowthOffersHub.jsx'));
const WalletManagement = lazy(() => import('./admin/WalletManagement.jsx'));
const AffiliateManagement = lazy(() => import('./admin/AffiliateManagement.jsx'));
const CouponManagement = lazy(() => import('./admin/CouponManagement.jsx'));
const SupportManagement = lazy(() => import('./admin/SupportManagement.jsx'));
const ContactManagement = lazy(() => import('./admin/ContactManagement.jsx'));
const EWarrantyManagement = lazy(() => import('./admin/EWarrantyManagement.jsx'));
const SupportAgentManagement = lazy(() => import('./admin/SupportAgentManagement.jsx'));
const LoyaltyTierForge = lazy(() => import('./admin/LoyaltyTierForge.jsx'));
const LoyaltyMembers = lazy(() => import('./admin/LoyaltyMembers.jsx'));
const PersonalizationCenter = lazy(() => import('./admin/PersonalizationCenter.jsx'));
const LifecycleOffers = lazy(() => import('./admin/LifecycleOffers.jsx'));

const WORKSPACE_COMPONENT_MAP = {
  overview: DashboardOverview,
  products: ProductManagement,
  categories: CategoryManagement,
  inventory: InventoryManagement,
  orders: OrderManagement,
  returns: ReturnManagement,
  users: UserManagement,
  reviews: ReviewManagement,
  analytics: AnalyticsManagement,
  notifications: NotificationManagement,
  tax: TaxManagement,
  gst: GSTAccounting,
  shipping: ShippingManagement,
  warehouse: WarehouseManagement,
  settings: AdminSettings,
  'growth-offers': GrowthOffersHub,
  'flash-sales': GrowthOffersHub,
  coupons: CouponManagement,
  'loyalty-tiers': LoyaltyTierForge,
  'loyalty-matrix': LoyaltyTierForge,
  'loyalty-members': LoyaltyMembers,
  personalization: PersonalizationCenter,
  'lifecycle-offers': LifecycleOffers,
  'referral-engine': AffiliateManagement,
  'wallet-management': WalletManagement,
  impact: ImpactManagement,
  support: SupportManagement,
  contacts: ContactManagement,
  ewarranty: EWarrantyManagement,
  'support-agents': SupportAgentManagement,
  'cart-rules': GrowthOffersHub,
  'min-cart-value': GrowthOffersHub,
  gamification: GrowthOffersHub,
  'ab-experiments': GrowthOffersHub,
};

const CONTROL_CENTRE_SECTION_MAP = {
  'orders.superadmin_cancellation': { key: 'section:order_cancellation', section: 'order_cancellation', label: 'Order Cancellation & Refund Ledger' },
  'governance.staff_rbac_matrix': { key: 'section:rbac_matrix', section: 'rbac_matrix', label: 'Staff RBAC Matrix' },
  'governance.module_pause_switchboard': { key: 'section:telemetry', section: 'telemetry', label: 'Real-Time Telemetry & Health' },
  'governance.realtime_api_telemetry': { key: 'section:telemetry', section: 'telemetry', label: 'Real-Time Telemetry & Health' },
  'governance.infrastructure_logs': { key: 'section:telemetry', section: 'telemetry', label: 'Real-Time Telemetry & Health' },
  'governance.security_vault_config': { key: 'section:vault_settings', section: 'vault_settings', label: 'Security Vault & Audit Log' },
  'concierge.escalation_tickets': { key: 'section:escalations', section: 'escalations', label: 'Verified Escalations' },
};

const WORKSPACE_LABEL_MAP = {
  overview: 'Overview',
  products: 'Products',
  categories: 'Categories',
  inventory: 'Inventory',
  orders: 'Orders',
  returns: 'Returns',
  users: 'Client Directory',
  reviews: 'Reviews',
  analytics: 'Analytics',
  notifications: 'Notifications',
  tax: 'Tax',
  gst: 'GST Accounting',
  shipping: 'Shipping',
  warehouse: 'Warehouse',
  settings: 'Settings',
  'growth-offers': 'Growth Offers',
  coupons: 'Coupons',
  'loyalty-tiers': 'Loyalty Tiers',
  'loyalty-members': 'Loyalty Members',
  personalization: 'Personalization',
  'lifecycle-offers': 'Lifecycle Offers',
  'referral-engine': 'Referral Program',
  'wallet-management': 'Wallet Management',
  impact: 'Impact',
  contacts: 'Contact Management',
  ewarranty: 'E-Warranty',
  'support-agents': 'Support Agents',
};

function getModuleWorkspaceTarget(module) {
  const controlCentreSection = CONTROL_CENTRE_SECTION_MAP[module.key];
  if (controlCentreSection) return { ...controlCentreSection, type: 'section' };

  if (module.portal === 'support' || module.portal === 'superadminsupport') return null;

  const component = WORKSPACE_COMPONENT_MAP[module.adminTab];
  if (!component) return null;

  const componentTab = Object.entries(WORKSPACE_COMPONENT_MAP)
    .find(([, WorkspaceComponent]) => WorkspaceComponent === component)?.[0] || module.adminTab;
  return {
    key: `component:${componentTab}`,
    type: 'component',
    component,
    tab: componentTab,
    label: WORKSPACE_LABEL_MAP[componentTab] || componentTab,
  };
}

const CATEGORY_ICON_MAP = {
  'Main Storefront': Globe,
  Orders: ShoppingBag,
  Products: Package,
  Categories: Boxes,
  Inventory: Tags,
  Warehouse: Warehouse,
  Shipping: Truck,
  'Financial Ledger & GST Compliance': FileText,
  'Returns & Refunds': RotateCcw,
  'Clientele Privilege & Tiers': Award,
  'Bespoke Client Curation': Sparkles,
  'Brand Ambassador Program': Users,
  'Bhumivera Client Concierge': Headphones,
  'Client Directory & Security': ShieldCheck,
};

const ACCESS_LEVEL_OPTIONS = [
  { value: 'hidden', label: 'Hidden', badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30', desc: 'Invisible in UI & blocked at API' },
  { value: 'read', label: 'Read-Only', badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30', desc: 'Can view data, cannot edit/create/delete' },
  { value: 'write', label: 'Write / Edit', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30', desc: 'Can create and update records' },
  { value: 'full', label: 'Full Control', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', desc: 'Can create, edit, pause, and delete' },
];

const SUPERADMIN_AUTHORIZED_EMAIL = 'adminbhumivera27@gmail.com';
const SA_TOKEN_STORAGE_KEY = 'bv_superadmin_controlcentre_token';
const SA_CSRF_STORAGE_KEY = 'bv_superadmin_csrf_token';

export default function SuperAdminControlCentre() {
  const navigate = useNavigate();

  // Authentication & Security Vault State
  const [saToken, setSaToken] = useState(() => sessionStorage.getItem(SA_TOKEN_STORAGE_KEY) || '');
  const [csrfToken, setCsrfToken] = useState(() => sessionStorage.getItem(SA_CSRF_STORAGE_KEY) || '');
  const [vaultStatus, setVaultStatus] = useState({
    loading: true,
    isOnboarded: true,
    locked: false,
    secondsRemaining: 0,
    authorizedEmail: SUPERADMIN_AUTHORIZED_EMAIL,
  });

  // Challenge & Login / Onboarding Form State (Zero hardcoded secrets, zero OTP display)
  const [authEmail, setAuthEmail] = useState(SUPERADMIN_AUTHORIZED_EMAIL);
  const [challengeState, setChallengeState] = useState({
    challengeId: '',
    expiresInSeconds: 0,
    securityQuestion: null,
    dispatched: false,
  });
  const [otpInput, setOtpInput] = useState('');
  const [primaryPasswordInput, setPrimaryPasswordInput] = useState('');
  const [secondaryPasswordInput, setSecondaryPasswordInput] = useState('');
  const [securityAnswerInput, setSecurityAnswerInput] = useState('');
  const [actionPasscodeInput, setActionPasscodeInput] = useState('');

  // First-Time Onboarding Wizard State
  const [onboardingQuestions, setOnboardingQuestions] = useState([
    { question: 'What is the name of the botanical estate where Bhumivera was conceived?', answer: '' },
    { question: 'What was the founding year and city of your primary family enterprise?', answer: '' },
    { question: 'What is the private vault passphrase shared only with the legal trustee?', answer: '' },
  ]);

  const [authBusy, setAuthBusy] = useState(false);
  const [authFeedback, setAuthFeedback] = useState({ type: '', message: '' });

  // Master Control Centre Data State
  const [overview, setOverview] = useState(null);
  const [telemetryData, setTelemetryData] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [bannerNotice, setBannerNotice] = useState(null);

  // Navigation & Card-Grid Filter State
  const [activeTopSection, setActiveTopSection] = useState('card_grid'); // 'card_grid' | 'rbac_matrix' | 'order_cancellation' | 'telemetry' | 'escalations' | 'vault_settings'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPortalFilter, setSelectedPortalFilter] = useState('ALL');
  const [moduleSearch, setModuleSearch] = useState('');

  // Modal / Drawer Module Execution & Unsaved Changes (Dirty-State) Protection
  const [activeWorkspaceModal, setActiveWorkspaceModal] = useState(null);
  const [isWorkspaceDirty, setIsWorkspaceDirty] = useState(false);
  const [unsavedConfirmModal, setUnsavedConfirmModal] = useState(false);
  const [pendingWorkspaceSaveCallback, setPendingWorkspaceSaveCallback] = useState(null);

  // Step-Up 6-Digit Master Action Passcode Prompt Modal State
  const [stepUpModal, setStepUpModal] = useState({
    open: false,
    title: '',
    description: '',
    passcode: '',
    busy: false,
    error: '',
    onConfirm: null,
  });

  // Granular RBAC Staff Management State
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [rbacCategoryFilter, setRbacCategoryFilter] = useState('ALL');
  const [rbacSearch, setRbacSearch] = useState('');
  const [pendingMatrixEdits, setPendingMatrixEdits] = useState({});
  const [showNewStaffForm, setShowNewStaffForm] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    primaryPortal: 'admin',
    roleTitle: 'Executive Operations Specialist',
    department: 'Maison Operations',
    defaultAccessLevel: 'read',
  });

  // SuperAdmin Exclusive Order Cancellation & Atomic Refund State
  const [cancelOrderForm, setCancelOrderForm] = useState({
    orderId: '',
    reason: 'Cancelled by SuperAdmin via Master Control Centre',
    refundDestinationPreference: 'auto', // 'auto' | 'wallet_instant' | 'original_gateway'
  });

  // Vault Credential Rotation State
  const [vaultRotationForm, setVaultRotationForm] = useState({
    newPrimaryPassword: '',
    newSecondaryVaultPassword: '',
    newActionPasscode: '',
  });

  const showToastNotice = useCallback((type, message) => {
    setBannerNotice({ type, message });
    setTimeout(() => {
      setBannerNotice(prev => (prev?.message === message ? null : prev));
    }, 6000);
  }, []);

  const authHeaders = useMemo(
    () => ({
      headers: {
        ...(saToken ? { Authorization: `Bearer ${saToken}` } : {}),
        ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      },
      notify: false,
    }),
    [saToken, csrfToken]
  );

  // Countdown timer for 5-minute OTP expiry
  useEffect(() => {
    if (challengeState.expiresInSeconds <= 0) return undefined;
    const timer = window.setInterval(() => {
      setChallengeState(prev => ({
        ...prev,
        expiresInSeconds: Math.max(0, prev.expiresInSeconds - 1),
      }));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [challengeState.expiresInSeconds]);

  // Load Vault Status on Mount
  const loadVaultStatus = useCallback(async () => {
    try {
      const res = await api.get('/superadmin/controlcentre/vault/status', { notify: false });
      setVaultStatus({
        loading: false,
        isOnboarded: Boolean(res.data?.isOnboarded),
        locked: Boolean(res.data?.locked),
        secondsRemaining: Number(res.data?.secondsRemaining || 0),
        authorizedEmail: res.data?.authorizedEmail || SUPERADMIN_AUTHORIZED_EMAIL,
      });
    } catch {
      setVaultStatus(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    void loadVaultStatus();
  }, [loadVaultStatus]);

  // Fetch Master Control Centre Overview & Live Telemetry
  const fetchControlCentreData = useCallback(async () => {
    if (!saToken) return;
    setLoadingOverview(true);
    try {
      const [overviewRes, telemetryRes] = await Promise.all([
        api.get('/superadmin/controlcentre/overview', authHeaders),
        api.get('/superadmin/controlcentre/telemetry', authHeaders).catch(() => ({ data: null })),
      ]);
      setOverview(overviewRes.data);
      if (telemetryRes?.data) {
        setTelemetryData(telemetryRes.data);
      }
      if (!selectedStaffId && overviewRes.data?.staffAccounts?.length > 0) {
        setSelectedStaffId(overviewRes.data.staffAccounts[0].id);
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        sessionStorage.removeItem(SA_TOKEN_STORAGE_KEY);
        sessionStorage.removeItem(SA_CSRF_STORAGE_KEY);
        setSaToken('');
        setCsrfToken('');
        setAuthFeedback({
          type: 'error',
          message: err.response?.data?.message || 'SuperAdmin Control Centre session expired. Please re-authenticate.',
        });
      } else {
        showToastNotice('error', err.response?.data?.message || 'Could not synchronize Control Centre data.');
      }
    } finally {
      setLoadingOverview(false);
    }
  }, [saToken, authHeaders, selectedStaffId, showToastNotice]);

  useEffect(() => {
    if (saToken) {
      void fetchControlCentreData();
    }
  }, [saToken, fetchControlCentreData]);

  // Browser beforeunload & Escape key guard when workspace has unsaved changes
  useEffect(() => {
    const handleBeforeUnload = event => {
      if (!isWorkspaceDirty) return undefined;
      event.preventDefault();
      event.returnValue = 'You have unsaved changes.';
      return event.returnValue;
    };

    const handleKeyDown = event => {
      if (event.key === 'Escape' && activeWorkspaceModal) {
        event.preventDefault();
        if (isWorkspaceDirty) {
          setUnsavedConfirmModal(true);
        } else {
          setActiveWorkspaceModal(null);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isWorkspaceDirty, activeWorkspaceModal]);

  // Request 5-Minute Live Email OTP Challenge
  const handleRequestOtpChallenge = async e => {
    e?.preventDefault();
    setAuthBusy(true);
    setAuthFeedback({ type: '', message: '' });

    try {
      const purpose = vaultStatus.isOnboarded ? 'multi_factor_login' : 'onboarding';
      const res = await api.post(
        '/superadmin/controlcentre/vault/request-otp',
        { email: authEmail.trim().toLowerCase(), purpose },
        { notify: false }
      );
      setChallengeState({
        challengeId: res.data.challengeId,
        expiresInSeconds: Number(res.data.expiresInSeconds || 300),
        securityQuestion: res.data.securityQuestion || null,
        dispatched: true,
      });
      setVaultStatus(prev => ({ ...prev, isOnboarded: Boolean(res.data.isOnboarded) }));
      setAuthFeedback({
        type: 'success',
        message: res.data.message || `6-digit verification code sent to ${SUPERADMIN_AUTHORIZED_EMAIL}.`,
      });
    } catch (err) {
      setAuthFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to dispatch SuperAdmin Email OTP.',
      });
    } finally {
      setAuthBusy(false);
    }
  };

  // First-Time Security Vault Setup Wizard Submission
  const handleCompleteOnboardingSetup = async e => {
    e.preventDefault();
    setAuthBusy(true);
    setAuthFeedback({ type: '', message: '' });

    try {
      const res = await api.post(
        '/superadmin/controlcentre/vault/onboarding-setup',
        {
          challengeId: challengeState.challengeId,
          email: authEmail.trim().toLowerCase(),
          otp: otpInput.trim(),
          primaryPassword: primaryPasswordInput,
          secondaryVaultPassword: secondaryPasswordInput,
          securityQuestions: onboardingQuestions,
          actionPasscode: actionPasscodeInput.trim(),
        },
        { notify: false }
      );

      const tok = res.data.token;
      const csrf = res.data.csrfToken || '';
      sessionStorage.setItem(SA_TOKEN_STORAGE_KEY, tok);
      sessionStorage.setItem(SA_CSRF_STORAGE_KEY, csrf);
      localStorage.setItem('adminToken', tok);
      localStorage.setItem('supportToken', tok);
      setSaToken(tok);
      setCsrfToken(csrf);
      setOtpInput('');
      setPrimaryPasswordInput('');
      setSecondaryPasswordInput('');
      setActionPasscodeInput('');
    } catch (err) {
      setAuthFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Security Vault initialization failed.',
      });
    } finally {
      setAuthBusy(false);
    }
  };

  // Standard Multi-Factor Login Submission
  const handleMultiFactorLogin = async e => {
    e.preventDefault();
    setAuthBusy(true);
    setAuthFeedback({ type: '', message: '' });

    try {
      const res = await api.post(
        '/superadmin/controlcentre/vault/verify-login',
        {
          challengeId: challengeState.challengeId,
          email: authEmail.trim().toLowerCase(),
          otp: otpInput.trim(),
          primaryPassword: primaryPasswordInput,
          secondaryVaultPassword: secondaryPasswordInput,
          securityAnswer: securityAnswerInput,
          actionPasscode: actionPasscodeInput.trim(),
        },
        { notify: false }
      );

      const tok = res.data.token;
      const csrf = res.data.csrfToken || '';
      sessionStorage.setItem(SA_TOKEN_STORAGE_KEY, tok);
      sessionStorage.setItem(SA_CSRF_STORAGE_KEY, csrf);
      localStorage.setItem('adminToken', tok);
      localStorage.setItem('supportToken', tok);
      setSaToken(tok);
      setCsrfToken(csrf);
      setOtpInput('');
      setPrimaryPasswordInput('');
      setSecondaryPasswordInput('');
      setSecurityAnswerInput('');
      setActionPasscodeInput('');
    } catch (err) {
      setAuthFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Multi-factor verification failed.',
      });
    } finally {
      setAuthBusy(false);
    }
  };

  // Helper to prompt for the 6-Digit Master Action Passcode before executing any sensitive/destructive action
  const promptStepUpPasscode = ({ title, description, onConfirm }) => {
    setStepUpModal({
      open: true,
      title,
      description,
      passcode: '',
      busy: false,
      error: '',
      onConfirm,
    });
  };

  const executeStepUpConfirmedAction = async e => {
    e.preventDefault();
    const code = stepUpModal.passcode.trim();
    if (!/^\d{6}$/.test(code)) {
      setStepUpModal(prev => ({ ...prev, error: 'Enter your 6-digit numeric Master Action Passcode.' }));
      return;
    }

    setStepUpModal(prev => ({ ...prev, busy: true, error: '' }));
    try {
      await stepUpModal.onConfirm(code);
      setStepUpModal({
        open: false,
        title: '',
        description: '',
        passcode: '',
        busy: false,
        error: '',
        onConfirm: null,
      });
    } catch (err) {
      setStepUpModal(prev => ({
        ...prev,
        busy: false,
        error: err.response?.data?.message || err.message || 'Verification or action failed.',
      }));
    }
  };

  // Workspace Modal Close with Unsaved Changes (Dirty-State) Guard
  const requestCloseWorkspaceModal = () => {
    if (isWorkspaceDirty) {
      setUnsavedConfirmModal(true);
      return;
    }
    setActiveWorkspaceModal(null);
    setIsWorkspaceDirty(false);
  };

  const handleSaveBeforeClosingWorkspace = async () => {
    try {
      if (typeof pendingWorkspaceSaveCallback === 'function') {
        await pendingWorkspaceSaveCallback();
      } else if (activeWorkspaceModal?.containerRef?.current) {
        const submitBtn = activeWorkspaceModal.containerRef.current.querySelector(
          'button[type="submit"], button[data-workspace-save="true"]'
        );
        if (submitBtn) submitBtn.click();
      }
      setUnsavedConfirmModal(false);
      setIsWorkspaceDirty(false);
      setActiveWorkspaceModal(null);
      showToastNotice('success', 'Changes saved before closing module.');
    } catch {
      setUnsavedConfirmModal(false);
    }
  };

  const handleDiscardAndCloseWorkspace = () => {
    setUnsavedConfirmModal(false);
    setIsWorkspaceDirty(false);
    setPendingMatrixEdits({});
    setActiveWorkspaceModal(null);
  };

  // Module Pause / Resume with Step-Up Passcode
  const handleToggleModulePause = mod => {
    const pauseKey = mod.pauseKey || mod.id;
    if (!pauseKey) {
      showToastNotice('info', `'${mod.title}' is an always-on core governance module.`);
      return;
    }
    const nextEnabled = !mod.enabled;
    promptStepUpPasscode({
      title: `${nextEnabled ? 'Resume' : 'Pause'} Module: ${mod.title}`,
      description: `Enter your 6-Digit Master Action Passcode to ${
        nextEnabled ? 'restore live traffic to' : 'temporarily pause API traffic for'
      } '${mod.title}'.`,
      onConfirm: async passcode => {
        await api.patch(
          `/superadmin/controlcentre/modules/${pauseKey}/pause`,
          { enabled: nextEnabled, actionPasscode: passcode },
          {
            ...authHeaders,
            headers: { ...authHeaders.headers, 'X-SuperAdmin-Action-Passcode': passcode },
          }
        );
        await fetchControlCentreData();
        showToastNotice('success', `Module '${mod.title}' ${nextEnabled ? 'resumed' : 'paused'}.`);
      },
    });
  };

  // Save Staff RBAC Permission Matrix Changes with Step-Up Passcode
  const selectedStaff = useMemo(
    () => (overview?.staffAccounts || []).find(s => s.id === Number(selectedStaffId)) || null,
    [overview?.staffAccounts, selectedStaffId]
  );

  const handleSaveStaffMatrix = () => {
    if (!selectedStaff) return;
    promptStepUpPasscode({
      title: `Update Permission Matrix · ${selectedStaff.fullName}`,
      description: `Authorize dynamic RBAC permission updates across ${
        Object.keys(pendingMatrixEdits).length
      } modified module(s) for ${selectedStaff.email}.`,
      onConfirm: async passcode => {
        await api.patch(
          `/superadmin/controlcentre/staff/${selectedStaff.id}`,
          {
            permissions: pendingMatrixEdits,
            actionPasscode: passcode,
          },
          {
            ...authHeaders,
            headers: { ...authHeaders.headers, 'X-SuperAdmin-Action-Passcode': passcode },
          }
        );
        setPendingMatrixEdits({});
        setIsWorkspaceDirty(false);
        await fetchControlCentreData();
        showToastNotice('success', `Updated dynamic permission matrix for ${selectedStaff.fullName}.`);
      },
    });
  };

  const handleBulkSetCategoryAccess = (categoryName, accessLevel) => {
    if (!selectedStaff) return;
    promptStepUpPasscode({
      title: `Bulk Set '${categoryName}' to ${accessLevel.toUpperCase()}`,
      description: `Apply '${accessLevel.toUpperCase()}' access across all modules in '${categoryName}' for ${selectedStaff.fullName}.`,
      onConfirm: async passcode => {
        await api.patch(
          `/superadmin/controlcentre/staff/${selectedStaff.id}`,
          {
            bulkCategory: categoryName,
            bulkAccessLevel: accessLevel,
            actionPasscode: passcode,
          },
          {
            ...authHeaders,
            headers: { ...authHeaders.headers, 'X-SuperAdmin-Action-Passcode': passcode },
          }
        );
        setPendingMatrixEdits({});
        setIsWorkspaceDirty(false);
        await fetchControlCentreData();
        showToastNotice('success', `Updated ${categoryName} permissions for ${selectedStaff.fullName}.`);
      },
    });
  };

  const handleCreateStaffAccount = e => {
    e.preventDefault();
    promptStepUpPasscode({
      title: `Create Staff Login · ${newStaffForm.fullName || newStaffForm.username}`,
      description: `Authorize creation of a new staff login (${newStaffForm.email}) for portal '${newStaffForm.primaryPortal}'.`,
      onConfirm: async passcode => {
        const res = await api.post(
          '/superadmin/controlcentre/staff',
          { ...newStaffForm, actionPasscode: passcode },
          {
            ...authHeaders,
            headers: { ...authHeaders.headers, 'X-SuperAdmin-Action-Passcode': passcode },
          }
        );
        setShowNewStaffForm(false);
        setNewStaffForm({
          username: '',
          email: '',
          fullName: '',
          password: '',
          primaryPortal: 'admin',
          roleTitle: 'Executive Operations Specialist',
          department: 'Maison Operations',
          defaultAccessLevel: 'read',
        });
        setSelectedStaffId(res.data?.staffId || selectedStaffId);
        await fetchControlCentreData();
        showToastNotice('success', res.data?.message || 'Created new staff account.');
      },
    });
  };

  const handleDeleteStaffAccount = staff => {
    promptStepUpPasscode({
      title: `Delete Staff Login · ${staff.fullName}`,
      description: `Permanently revoke and delete staff account '${staff.email}'. This action cannot be undone.`,
      onConfirm: async passcode => {
        await api.delete(`/superadmin/controlcentre/staff/${staff.id}`, {
          ...authHeaders,
          headers: { ...authHeaders.headers, 'X-SuperAdmin-Action-Passcode': passcode },
          data: { actionPasscode: passcode },
        });
        await fetchControlCentreData();
        showToastNotice('success', `Deleted staff account ${staff.email}.`);
      },
    });
  };

  // SuperAdmin Exclusive Order Cancellation & Atomic Refund Execution
  const handleExecuteOrderCancellation = e => {
    e.preventDefault();
    if (!cancelOrderForm.orderId.trim()) return;
    promptStepUpPasscode({
      title: `Cancel Order #${cancelOrderForm.orderId.trim()} & Trigger Atomic Refund`,
      description: `Authorize SuperAdmin order cancellation and atomic Wallet / Gateway refund ledger restoration for Order #${cancelOrderForm.orderId.trim()}.`,
      onConfirm: async passcode => {
        const res = await api.post(
          `/superadmin/controlcentre/orders/${encodeURIComponent(cancelOrderForm.orderId.trim())}/cancel`,
          {
            reason: cancelOrderForm.reason,
            refundDestinationPreference: cancelOrderForm.refundDestinationPreference,
            actionPasscode: passcode,
          },
          {
            ...authHeaders,
            headers: { ...authHeaders.headers, 'X-SuperAdmin-Action-Passcode': passcode },
          }
        );
        setCancelOrderForm(prev => ({ ...prev, orderId: '' }));
        await fetchControlCentreData();
        showToastNotice('success', res.data?.message || 'Order cancelled and refund ledger updated.');
      },
    });
  };

  // Rotate Security Vault Credentials
  const handleRotateVaultCredentials = e => {
    e.preventDefault();
    promptStepUpPasscode({
      title: 'Rotate SuperAdmin Security Vault Credentials',
      description: 'Enter your current 6-Digit Master Action Passcode to re-encrypt and rotate your Security Vault credentials.',
      onConfirm: async passcode => {
        const res = await api.put(
          '/superadmin/controlcentre/vault/rotate-credentials',
          {
            ...vaultRotationForm,
            actionPasscode: passcode,
          },
          {
            ...authHeaders,
            headers: { ...authHeaders.headers, 'X-SuperAdmin-Action-Passcode': passcode },
          }
        );
        setVaultRotationForm({
          newPrimaryPassword: '',
          newSecondaryVaultPassword: '',
          newActionPasscode: '',
        });
        setIsWorkspaceDirty(false);
        showToastNotice('success', res.data?.message || 'Vault credentials rotated.');
      },
    });
  };

  const handleSignOutControlCentre = async () => {
    try {
      await api.post('/superadmin/controlcentre/vault/logout', {}, authHeaders);
    } catch {}
    sessionStorage.removeItem(SA_TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(SA_CSRF_STORAGE_KEY);
    setSaToken('');
    setCsrfToken('');
    setOverview(null);
  };

  // Filtered platform module catalog for the card-grid dashboard
  const modulesCatalog = overview?.modulesCatalog || [];
  const moduleCategories = useMemo(
    () => ['ALL', ...Array.from(new Set(modulesCatalog.map(m => m.category)))],
    [modulesCatalog]
  );

  const filteredModules = useMemo(() => {
    const q = moduleSearch.trim().toLowerCase();
    return modulesCatalog.filter(mod => {
      if (selectedCategory !== 'ALL' && mod.category !== selectedCategory) return false;
      if (selectedPortalFilter !== 'ALL' && mod.portal !== selectedPortalFilter) return false;
      if (!q) return true;
      return (
        mod.title.toLowerCase().includes(q) ||
        mod.key.toLowerCase().includes(q) ||
        mod.category.toLowerCase().includes(q) ||
        mod.portal.toLowerCase().includes(q)
      );
    });
  }, [modulesCatalog, selectedCategory, selectedPortalFilter, moduleSearch]);
  const workspaceGroups = useMemo(() => {
    const groups = new Map();
    filteredModules.forEach(module => {
      const target = getModuleWorkspaceTarget(module);
      const groupKey = target?.key || `unavailable:${module.portal}:${module.adminTab || 'unassigned'}`;
      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          key: groupKey,
          target,
          modules: [],
        });
      }
      groups.get(groupKey).modules.push(module);
    });
    return Array.from(groups.values());
  }, [filteredModules]);

  // ═══════════════════════════════════════════════════════════════════════════
  // UNAUTHENTICATED VIEW: FORTRESS MULTI-FACTOR LOGIN OR FIRST-TIME ONBOARDING
  // (Zero client-side OTP leaks, zero auto-fill buttons, zero hardcoded secrets)
  // ═══════════════════════════════════════════════════════════════════════════
  if (!saToken) {
    const otpMins = Math.floor(challengeState.expiresInSeconds / 60);
    const otpSecs = challengeState.expiresInSeconds % 60;

    return (
      <div className="min-h-screen bg-[#05110c] text-[#f4f1e9] flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl rounded-3xl border border-[#d4af37]/35 bg-[#091d15] p-6 sm:p-10 shadow-[0_32px_90px_rgba(0,0,0,0.65)] space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#d4af37]">
                  bhumivera.com/superadmin/controlcentre
                </p>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-0.5">
                  Bhumivera Master Control Centre
                </h1>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {vaultStatus.isOnboarded ? 'Multi-Factor Vault' : 'First-Time Vault Setup'}
            </span>
          </div>

          {authFeedback.message && (
            <div
              role="alert"
              className={`rounded-2xl border p-4 text-xs leading-relaxed ${
                authFeedback.type === 'error'
                  ? 'bg-rose-500/15 border-rose-500/35 text-rose-200'
                  : 'bg-emerald-500/15 border-emerald-500/35 text-emerald-200'
              }`}
            >
              {authFeedback.message}
            </div>
          )}

          {/* Step 1: Request Live Email OTP for adminbhumivera27@gmail.com */}
          {!challengeState.dispatched ? (
            <form onSubmit={handleRequestOtpChallenge} className="space-y-5">
              <p className="text-xs text-stone-300 leading-relaxed">
                {vaultStatus.isOnboarded
                  ? 'Authenticate with your Authorized SuperAdmin Email to receive a time-bound 6-digit verification code (5-minute expiry, max 3 attempts) and load your rotating Security Question challenge.'
                  : 'Initial Vault Setup detected for adminbhumivera27@gmail.com. Request a live Email OTP to unlock the mandatory Security Vault Setup Wizard.'}
              </p>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d4af37] mb-2">
                  Authorized SuperAdmin Principal Email
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="adminbhumivera27@gmail.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={authBusy}
                className="w-full rounded-xl bg-[#d4af37] py-3.5 text-xs font-black uppercase tracking-[0.18em] text-[#071510] hover:bg-[#e5c558] transition disabled:opacity-50"
              >
                {authBusy
                  ? 'Dispatching Encrypted OTP Challenge…'
                  : vaultStatus.isOnboarded
                  ? 'Dispatch 5-Minute Email OTP & Load Security Challenge'
                  : 'Send Live Onboarding OTP to Authorized Email'}
              </button>
            </form>
          ) : !vaultStatus.isOnboarded ? (
            /* Mandatory First-Time Security Vault Setup Wizard */
            <form onSubmit={handleCompleteOnboardingSetup} className="space-y-5">
              <div className="rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-4 text-xs text-[#f3d77b]">
                <div className="flex items-center justify-between">
                  <strong>Mandatory Security Vault Setup Wizard</strong>
                  <span className="font-mono">
                    OTP Window: {otpMins}:{String(otpSecs).padStart(2, '0')}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-stone-200">
                  Configure your dual passwords, 3 rotating security questions, and 6-digit Master Action Passcode. All secrets are salted and hashed with PBKDF2-HMAC-SHA512 + Scrypt and encrypted with AES-256-GCM.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d4af37] mb-1.5">
                    6-Digit Email OTP (Sent to Inbox)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={otpInput}
                    onChange={e => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="••••••"
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-center font-mono text-base tracking-[0.3em] text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d4af37] mb-1.5">
                    6-Digit Master Action Passcode
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={actionPasscodeInput}
                    onChange={e => setActionPasscodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-Digit Step-Up PIN"
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-center font-mono text-base tracking-[0.3em] text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    Primary Master Password (Password 1)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={10}
                    value={primaryPasswordInput}
                    onChange={e => setPrimaryPasswordInput(e.target.value)}
                    placeholder="Min 10 characters"
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    Secondary Vault Password (Password 2)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={10}
                    value={secondaryPasswordInput}
                    onChange={e => setSecondaryPasswordInput(e.target.value)}
                    placeholder="Distinct from Password 1"
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-white/10">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#d4af37]">
                  3 Custom Security Questions &amp; Answers (1 Rotated Per Login)
                </p>
                {onboardingQuestions.map((qItem, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      required
                      value={qItem.question}
                      onChange={e => {
                        const val = e.target.value;
                        setOnboardingQuestions(prev =>
                          prev.map((item, i) => (i === idx ? { ...item, question: val } : item))
                        );
                      }}
                      placeholder={`Security Question #${idx + 1}`}
                      className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#d4af37] outline-none"
                    />
                    <input
                      type="password"
                      required
                      value={qItem.answer}
                      onChange={e => {
                        const val = e.target.value;
                        setOnboardingQuestions(prev =>
                          prev.map((item, i) => (i === idx ? { ...item, answer: val } : item))
                        );
                      }}
                      placeholder={`Answer #${idx + 1}`}
                      className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#d4af37] outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setChallengeState({ challengeId: '', expiresInSeconds: 0, securityQuestion: null, dispatched: false })}
                  className="text-xs text-stone-400 hover:text-white"
                >
                  ← Request New OTP
                </button>
                <button
                  type="submit"
                  disabled={authBusy}
                  className="rounded-xl bg-[#d4af37] px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#071510] hover:bg-[#e5c558] disabled:opacity-50"
                >
                  {authBusy ? 'Sealing Security Vault…' : 'Seal Security Vault & Enter Control Centre'}
                </button>
              </div>
            </form>
          ) : (
            /* Standard Multi-Factor SuperAdmin Login Flow */
            <form onSubmit={handleMultiFactorLogin} className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-2.5 text-xs">
                <span className="text-stone-300">
                  Principal: <strong className="text-white">{SUPERADMIN_AUTHORIZED_EMAIL}</strong>
                </span>
                <span className="font-mono text-[#d4af37]">
                  OTP TTL: {otpMins}:{String(otpSecs).padStart(2, '0')} (Max 3 Attempts)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d4af37] mb-1.5">
                    1. 6-Digit Email OTP
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={otpInput}
                    onChange={e => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="••••••"
                    autoComplete="one-time-code"
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-center font-mono text-base tracking-[0.3em] text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d4af37] mb-1.5">
                    2. 6-Digit Master Action Passcode
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={actionPasscodeInput}
                    onChange={e => setActionPasscodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="••••••"
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-center font-mono text-base tracking-[0.3em] text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    3. Primary Master Password
                  </label>
                  <input
                    type="password"
                    required
                    value={primaryPasswordInput}
                    onChange={e => setPrimaryPasswordInput(e.target.value)}
                    placeholder="Enter Primary Master Password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    4. Secondary Vault Password
                  </label>
                  <input
                    type="password"
                    required
                    value={secondaryPasswordInput}
                    onChange={e => setSecondaryPasswordInput(e.target.value)}
                    placeholder="Enter Secondary Vault Password"
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d4af37] mb-1.5">
                  5. Rotating Security Question #{challengeState.securityQuestion?.questionNumber || 1}:{' '}
                  <span className="text-white font-normal normal-case">
                    {challengeState.securityQuestion?.prompt || 'Verify your configured security answer'}
                  </span>
                </label>
                <input
                  type="password"
                  required
                  value={securityAnswerInput}
                  onChange={e => setSecurityAnswerInput(e.target.value)}
                  placeholder="Enter exact security answer"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleRequestOtpChallenge()}
                  disabled={authBusy}
                  className="text-xs text-stone-400 hover:text-white"
                >
                  ↻ Dispatch Fresh OTP &amp; Rotate Question
                </button>
                <button
                  type="submit"
                  disabled={authBusy || otpInput.length !== 6 || actionPasscodeInput.length !== 6}
                  className="rounded-xl bg-[#d4af37] px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#071510] hover:bg-[#e5c558] disabled:opacity-50"
                >
                  {authBusy ? 'Verifying All 5 Factors…' : 'Verify Multi-Factor Vault & Unlock'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTHENTICATED SUPREME CONTROL CENTRE (`/superadmin/controlcentre`)
  // ═══════════════════════════════════════════════════════════════════════════
  const kpis = overview?.kpis || {};
  const portals = overview?.portals || [];
  const staffAccounts = overview?.staffAccounts || [];
  const refundLedger = overview?.refundLedger || [];
  const escalationTickets = overview?.escalationTickets || [];
  const auditLogs = overview?.auditLogs || [];

  const ActiveModalComponent = activeWorkspaceModal
    ? getModuleWorkspaceTarget(activeWorkspaceModal)?.component
    : null;

  return (
    <div className="min-h-screen bg-[#05110c] text-[#f4f1e9] flex flex-col font-sans">
      {/* Top Executive Orchestration Header */}
      <header className="sticky top-0 z-30 border-b border-[#d4af37]/25 bg-[#071710]/95 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="mx-auto max-w-[1600px] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#d4af37] text-[#071510] font-black text-sm flex items-center justify-center shadow-lg">
              BV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#d4af37]">
                  Supreme Executive Command
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {SUPERADMIN_AUTHORIZED_EMAIL}
                </span>
              </div>
              <h1 className="font-serif text-lg sm:text-xl font-bold text-white">
                Bhumivera Master Control Centre
              </h1>
            </div>
          </div>

          {/* Primary Navigation Pills */}
          <nav aria-label="Control Centre Workspaces" className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'card_grid', label: `All Modules (${kpis.totalModules ?? modulesCatalog.length})`, icon: Boxes },
              { id: 'rbac_matrix', label: `Staff RBAC Matrix (${staffAccounts.length})`, icon: Users },
              { id: 'order_cancellation', label: 'Order Cancellation & Refund Ledger', icon: RotateCcw },
              { id: 'escalations', label: `Verified Escalations (${kpis.openEscalations || 0})`, icon: PhoneCall },
              { id: 'telemetry', label: 'Real-Time Telemetry & Health', icon: Activity },
              { id: 'vault_settings', label: 'Security Vault & Audit Log', icon: Lock },
            ].map(tab => {
              const Icon = tab.icon;
              const active = activeTopSection === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTopSection(tab.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition border ${
                    active
                      ? 'bg-[#d4af37] text-[#071510] border-[#d4af37]'
                      : 'bg-white/[0.04] text-stone-300 border-white/10 hover:border-[#d4af37]/40 hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchControlCentreData()}
              disabled={loadingOverview}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
            >
              <RefreshCw size={14} className={loadingOverview ? 'animate-spin' : ''} />
              Sync
            </button>
            <button
              type="button"
              onClick={handleSignOutControlCentre}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/20"
            >
              <LogOut size={14} />
              Lock Vault
            </button>
          </div>
        </div>
      </header>

      {bannerNotice && (
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-8 pt-4">
          <div
            role="status"
            className={`rounded-2xl border px-4 py-3 text-xs font-medium flex items-center justify-between ${
              bannerNotice.type === 'error'
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
            }`}
          >
            <span>{bannerNotice.message}</span>
            <button type="button" onClick={() => setBannerNotice(null)} className="text-xs opacity-75">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <main className="mx-auto max-w-[1600px] w-full flex-1 px-4 sm:px-8 py-6 space-y-6">
        {/* 5-Portal Single-Master Orchestration Strip */}
        <section aria-label="Unified Portals Orchestration" className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {portals.map(portal => (
            <div
              key={portal.id}
              className="rounded-2xl border border-[#d4af37]/25 bg-[#091d15] p-4 flex flex-col justify-between gap-3 hover:border-[#d4af37]/60 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
                    Portal · {portal.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {portal.status}
                  </span>
                </div>
                <h2 className="font-serif text-base font-bold text-white mt-1">{portal.name}</h2>
                <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">{portal.description}</p>
              </div>
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPortalFilter(prev => (prev === portal.id ? 'ALL' : portal.id));
                    setActiveTopSection('card_grid');
                  }}
                  className="text-[#f3d77b] font-semibold hover:underline"
                >
                  Filter Cards
                </button>
                <Link
                  to={portal.internalPath}
                  className="inline-flex items-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white"
                >
                  Launch <ExternalLink size={11} />
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* ── VIEW 1: SINGLE-PAGE CARD-GRID DASHBOARD ───────────────────── */}
        {activeTopSection === 'card_grid' && (
          <section className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-[#091d15] p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Platform Workspaces ({workspaceGroups.length}) · Registered Capabilities ({filteredModules.length} of {modulesCatalog.length})
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Capabilities that use the same existing screen are grouped together. Each workspace button opens a real screen; capabilities without an integrated screen are listed without a fake destination.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative w-full sm:w-72">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={moduleSearch}
                    onChange={e => setModuleSearch(e.target.value)}
                    placeholder="Search modules, routes, or domains…"
                    className="w-full rounded-xl border border-white/15 bg-black/40 pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
                  />
                </div>
                {selectedPortalFilter !== 'ALL' && (
                  <button
                    type="button"
                    onClick={() => setSelectedPortalFilter('ALL')}
                    className="rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 px-3 py-2 text-xs font-semibold text-[#f3d77b]"
                  >
                    Portal: {selectedPortalFilter} ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {moduleCategories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? 'bg-[#d4af37] text-[#071510] border-[#d4af37]'
                      : 'bg-[#091d15] text-stone-300 border-white/10 hover:border-[#d4af37]/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Group capabilities by the real workspace that manages them. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {workspaceGroups.map(group => {
                const representative = group.modules[0];
                const Icon = CATEGORY_ICON_MAP[representative.category] || Server;
                return (
                  <article
                    key={group.key}
                    className="rounded-2xl border border-white/10 bg-[#091d15] p-4 flex flex-col gap-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#d4af37]">
                          <Icon size={13} />
                          {representative.portal} workspace
                        </span>
                        <span className="rounded-full border border-white/15 px-2 py-0.5 text-[9px] font-bold uppercase text-stone-300">
                          {group.modules.length} {group.modules.length === 1 ? 'capability' : 'capabilities'}
                        </span>
                      </div>
                      <h3 className="font-serif text-base font-bold text-white mt-2">
                        {group.target?.label || 'Workspace not integrated'}
                      </h3>
                      <p className="text-[11px] text-stone-400 mt-1">
                        {group.target
                          ? 'Shared existing workspace for the capabilities listed below.'
                          : `No ${representative.portal} workspace is integrated into this Control Centre yet.`}
                      </p>
                    </div>

                    <ul className="max-h-64 space-y-2 overflow-y-auto border-y border-white/10 py-2">
                      {group.modules.map(module => (
                        <li key={module.key} className="flex items-start justify-between gap-2 text-[11px]">
                          <span className="min-w-0">
                            <span className="block text-stone-200">{module.title}</span>
                            <span className="block truncate font-mono text-[9px] text-stone-500">{module.key}</span>
                          </span>
                          {module.pauseKey && (
                            <button
                              type="button"
                              onClick={() => handleToggleModulePause(module)}
                              title={module.enabled ? `Pause ${module.title}` : `Resume ${module.title}`}
                              aria-label={module.enabled ? `Pause ${module.title}` : `Resume ${module.title}`}
                              className={`shrink-0 rounded-lg border p-1.5 ${
                                module.enabled
                                  ? 'border-amber-500/30 text-amber-200 hover:bg-amber-500/15'
                                  : 'border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/15'
                              }`}
                            >
                              {module.enabled ? <Pause size={12} /> : <Play size={12} />}
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>

                    {group.target && (
                      <button
                        type="button"
                        onClick={() => {
                          if (group.target.type === 'section') {
                            setActiveTopSection(group.target.section);
                          } else {
                            setIsWorkspaceDirty(false);
                            setActiveWorkspaceModal(representative);
                          }
                        }}
                        className="w-full rounded-xl border border-[#d4af37]/35 bg-[#d4af37]/15 px-3 py-2 text-xs font-bold text-[#f3d77b] hover:bg-[#d4af37] hover:text-[#071510]"
                      >
                        Open {group.target.label}
                      </button>
                    )}
                    {!group.target && (
                      <p className="text-[10px] text-stone-500">
                        This entry remains in the capability and access-control registry; no destination is wired.
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ── VIEW 2: GRANULAR RBAC & PLATFORM MODULE PERMISSION MATRIX ─── */}
        {activeTopSection === 'rbac_matrix' && (
          <section className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-[#091d15] p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Granular Role-Based Access Control (RBAC) &amp; Dynamic Per-User Permission Matrix
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Manage {staffAccounts.length} staff logins across Admin, Warehouse, and Support. Toggle any registered platform function between Hidden, Read-Only, Write / Edit, and Full Control.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowNewStaffForm(prev => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#d4af37] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-[#071510]"
                >
                  <Plus size={14} /> Create Staff Login
                </button>
                {Object.keys(pendingMatrixEdits).length > 0 && (
                  <button
                    type="button"
                    onClick={handleSaveStaffMatrix}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-[#071510]"
                  >
                    <CheckCircle2 size={14} /> Save {Object.keys(pendingMatrixEdits).length} Permission Change(s)
                  </button>
                )}
              </div>
            </div>

            {showNewStaffForm && (
              <form
                onSubmit={handleCreateStaffAccount}
                className="rounded-2xl border border-[#d4af37]/40 bg-[#0b2319] p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#f3d77b]">Create New Staff Account (Admin / Warehouse / Support)</h3>
                  <button type="button" onClick={() => setShowNewStaffForm(false)} className="text-xs text-stone-400">
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <input
                    type="text"
                    required
                    value={newStaffForm.fullName}
                    onChange={e => setNewStaffForm(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Full Name (e.g. Rohan Mehta)"
                    className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    required
                    value={newStaffForm.username}
                    onChange={e => setNewStaffForm(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Username (e.g. warehouse_04)"
                    className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white"
                  />
                  <input
                    type="email"
                    required
                    value={newStaffForm.email}
                    onChange={e => setNewStaffForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Staff Email"
                    className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white"
                  />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newStaffForm.password}
                    onChange={e => setNewStaffForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Initial Password (min 8 chars)"
                    className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white"
                  />
                  <select
                    value={newStaffForm.primaryPortal}
                    onChange={e => setNewStaffForm(prev => ({ ...prev, primaryPortal: e.target.value }))}
                    className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white"
                  >
                    <option value="admin">Maison Executive Suite (/admin)</option>
                    <option value="warehouse">Warehouse Portal (/warehouse)</option>
                    <option value="support">Customer Support Desk (/support)</option>
                    <option value="superadminsupport">SuperAdmin Support (/superadminsupport)</option>
                  </select>
                  <input
                    type="text"
                    value={newStaffForm.roleTitle}
                    onChange={e => setNewStaffForm(prev => ({ ...prev, roleTitle: e.target.value }))}
                    placeholder="Role Title"
                    className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    value={newStaffForm.department}
                    onChange={e => setNewStaffForm(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="Department"
                    className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white"
                  />
                  <select
                    value={newStaffForm.defaultAccessLevel}
                    onChange={e => setNewStaffForm(prev => ({ ...prev, defaultAccessLevel: e.target.value }))}
                    className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white"
                  >
                    <option value="hidden">Default: Hidden</option>
                    <option value="read">Default: Read-Only</option>
                    <option value="write">Default: Write / Edit</option>
                    <option value="full">Default: Full Control</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-[#d4af37] px-5 py-2.5 text-xs font-black uppercase text-[#071510]"
                >
                  Authorize with 6-Digit Passcode &amp; Create Staff Account
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">
              {/* Staff Roster Column */}
              <div className="rounded-2xl border border-white/10 bg-[#091d15] p-3.5 space-y-2 max-h-[75vh] overflow-y-auto">
                <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
                  Staff Roster ({staffAccounts.length} Accounts)
                </p>
                {staffAccounts.map(staff => {
                  const isSelected = staff.id === Number(selectedStaffId);
                  return (
                    <div
                      key={staff.id}
                      onClick={() => {
                        setSelectedStaffId(staff.id);
                        setPendingMatrixEdits({});
                      }}
                      className={`cursor-pointer rounded-xl border p-3 transition ${
                        isSelected
                          ? 'bg-[#d4af37]/15 border-[#d4af37]'
                          : 'bg-black/20 border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-white truncate">{staff.fullName}</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-white/10 text-[#f3d77b]">
                          {staff.primaryPortal}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 truncate mt-0.5">{staff.email}</p>
                      <div className="flex items-center justify-between mt-2 text-[10px] text-stone-400">
                        <span>{staff.roleTitle}</span>
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleDeleteStaffAccount(staff);
                          }}
                          className="text-rose-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic platform module permission matrix editor */}
              {selectedStaff && (
                <div className="rounded-2xl border border-white/10 bg-[#091d15] p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
                        Editing Platform Module Permission Matrix
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        {selectedStaff.fullName} ({selectedStaff.email})
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {ACCESS_LEVEL_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleBulkSetCategoryAccess(rbacCategoryFilter, opt.value)}
                          className={`rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase ${opt.badge}`}
                        >
                          Set {rbacCategoryFilter === 'ALL' ? 'All' : rbacCategoryFilter} → {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {moduleCategories.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setRbacCategoryFilter(cat)}
                          className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold ${
                            rbacCategoryFilter === cat
                              ? 'bg-[#d4af37] text-[#071510] border-[#d4af37]'
                              : 'border-white/10 text-stone-300'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={rbacSearch}
                      onChange={e => setRbacSearch(e.target.value)}
                      placeholder="Filter modules…"
                      className="rounded-xl border border-white/15 bg-black/40 px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="max-h-[55vh] overflow-y-auto divide-y divide-white/10 pr-1">
                    {modulesCatalog
                      .filter(
                        m =>
                          (rbacCategoryFilter === 'ALL' || m.category === rbacCategoryFilter) &&
                          (!rbacSearch.trim() ||
                            m.title.toLowerCase().includes(rbacSearch.toLowerCase()) ||
                            m.key.toLowerCase().includes(rbacSearch.toLowerCase()))
                      )
                      .map(mod => {
                        const currentLevel =
                          pendingMatrixEdits[mod.key] ||
                          selectedStaff.permissions?.[mod.key] ||
                          'read';
                        const isSuperAdminExclusive = mod.key === 'orders.superadmin_cancellation';

                        return (
                          <div
                            key={mod.key}
                            className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <div className="font-semibold text-white">{mod.title}</div>
                              <div className="text-[10px] text-stone-400 font-mono">
                                {mod.key} · {mod.category}
                              </div>
                            </div>
                            {isSuperAdminExclusive ? (
                              <span className="px-3 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-[10px] font-bold text-rose-300">
                                Locked · SuperAdmin Exclusive
                              </span>
                            ) : (
                              <div className="inline-flex rounded-xl border border-white/10 bg-black/40 p-1 gap-1">
                                {ACCESS_LEVEL_OPTIONS.map(opt => {
                                  const active = currentLevel === opt.value;
                                  return (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => {
                                        setIsWorkspaceDirty(true);
                                        setPendingMatrixEdits(prev => ({
                                          ...prev,
                                          [mod.key]: opt.value,
                                        }));
                                      }}
                                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                                        active
                                          ? 'bg-[#d4af37] text-[#071510]'
                                          : 'text-stone-400 hover:text-white'
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── VIEW 3: SUPERADMIN EXCLUSIVE ORDER CANCELLATION & ATOMIC REFUND LEDGER ── */}
        {activeTopSection === 'order_cancellation' && (
          <section className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
            <form
              onSubmit={handleExecuteOrderCancellation}
              className="rounded-2xl border border-[#d4af37]/35 bg-[#091d15] p-6 space-y-4 h-fit"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
                  SuperAdmin Exclusive Authority
                </span>
                <h2 className="text-lg font-bold text-white mt-1">
                  Execute Order Cancellation &amp; Atomic Refund
                </h2>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  Customer, Bot, and L1/L2/L3 Support order cancellations are strictly disabled. Cancelling an order here triggers an atomic MySQL transaction that restores inventory, reverses coupon quota, and immediately credits Bhumivera Wallet or initiates the Gateway Refund ledger.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Order ID or 9-Digit Order Number
                </label>
                <input
                  type="text"
                  required
                  value={cancelOrderForm.orderId}
                  onChange={e => setCancelOrderForm(prev => ({ ...prev, orderId: e.target.value }))}
                  placeholder="e.g. BHVM815899599 or 20"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Refund Settlement Routing
                </label>
                <select
                  value={cancelOrderForm.refundDestinationPreference}
                  onChange={e =>
                    setCancelOrderForm(prev => ({
                      ...prev,
                      refundDestinationPreference: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#d4af37]"
                >
                  <option value="auto">Automatic (Wallet → Instant Wallet Credit · UPI/Gateway → Gateway Refund)</option>
                  <option value="wallet_instant">Instant Spendable Bhumivera Wallet Credit (Immediate Balance Restoration)</option>
                  <option value="original_gateway">Original Payment Gateway / UPI Refund Webhook</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Audit Reason
                </label>
                <textarea
                  rows={3}
                  required
                  value={cancelOrderForm.reason}
                  onChange={e => setCancelOrderForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#d4af37]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-rose-500 hover:bg-rose-400 py-3 text-xs font-black uppercase tracking-wider text-[#071510] transition"
              >
                Verify 6-Digit Passcode &amp; Cancel Order
              </button>
            </form>

            {/* Atomic Refund & Wallet Restoration Ledger Table */}
            <div className="rounded-2xl border border-white/10 bg-[#091d15] p-6 space-y-4 overflow-hidden">
              <div>
                <h3 className="text-base font-bold text-white">
                  Automated Refund &amp; Wallet Restoration Audit Ledger ({refundLedger.length})
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Cryptographically signed record of every wallet balance restoration and gateway refund initiated upon order cancellation.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-xs border-collapse">
                  <thead className="border-b border-white/10 text-[10px] uppercase tracking-wider text-stone-400">
                    <tr>
                      <th className="py-3 pr-3">Ledger Ref</th>
                      <th className="py-3 px-3">Order</th>
                      <th className="py-3 px-3">Client</th>
                      <th className="py-3 px-3">Payment Source</th>
                      <th className="py-3 px-3">Wallet Credited</th>
                      <th className="py-3 px-3">Gateway Refund</th>
                      <th className="py-3 px-3">Wallet Before → After</th>
                      <th className="py-3 pl-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {refundLedger.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-stone-500">
                          No cancellation refund ledger entries recorded yet.
                        </td>
                      </tr>
                    ) : (
                      refundLedger.map(row => (
                        <tr key={row.id}>
                          <td className="py-3 pr-3 font-mono text-[#f3d77b]">{row.ledger_reference}</td>
                          <td className="py-3 px-3 font-mono font-bold text-white">#{row.order_number}</td>
                          <td className="py-3 px-3">{row.customer_name || row.customer_email || `User #${row.user_id}`}</td>
                          <td className="py-3 px-3 uppercase">{row.source_payment_mode}</td>
                          <td className="py-3 px-3 font-bold text-emerald-300">
                            ₹{Number(row.wallet_credited_amount || 0).toFixed(2)}
                          </td>
                          <td className="py-3 px-3 font-bold text-cyan-300">
                            ₹{Number(row.gateway_refund_amount || 0).toFixed(2)}
                          </td>
                          <td className="py-3 px-3 font-mono">
                            ₹{Number(row.wallet_balance_before || 0).toFixed(2)} → ₹{Number(row.wallet_balance_after || 0).toFixed(2)}
                          </td>
                          <td className="py-3 pl-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              {row.refund_destination} · {row.gateway_status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ── VIEW 4: VERIFIED 12-HOUR CUSTOMER ESCALATION TICKETS ────────── */}
        {activeTopSection === 'escalations' && (
          <section className="rounded-2xl border border-white/10 bg-[#091d15] p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                Verified Customer Escalation Queue ({escalationTickets.length})
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Generated exclusively after Step 1 (Order ID + Registered Email/Phone verification) and Step 2 (Email vs Direct Phone Call + Callback Slot selection).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-xs border-collapse">
                <thead className="border-b border-white/10 text-[10px] uppercase tracking-wider text-stone-400">
                  <tr>
                    <th className="py-3 pr-3">Ticket Ref</th>
                    <th className="py-3 px-3">Verified Order</th>
                    <th className="py-3 px-3">Client</th>
                    <th className="py-3 px-3">Preference</th>
                    <th className="py-3 px-3">Callback Phone / Slot</th>
                    <th className="py-3 px-3">Query Details</th>
                    <th className="py-3 pl-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {escalationTickets.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-stone-500">
                        No verified customer escalations in queue.
                      </td>
                    </tr>
                  ) : (
                    escalationTickets.map(ticket => (
                      <tr key={ticket.id}>
                        <td className="py-3 pr-3 font-mono text-[#f3d77b]">{ticket.ticket_reference}</td>
                        <td className="py-3 px-3 font-mono font-bold text-white">#{ticket.order_number}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-white">{ticket.customer_name || 'Verified Client'}</div>
                          <div className="text-[11px] text-stone-400">{ticket.verified_email}</div>
                        </td>
                        <td className="py-3 px-3 uppercase font-bold text-emerald-300">
                          {ticket.contact_preference === 'phone_call' ? 'Direct Phone Call' : 'Email Update'}
                        </td>
                        <td className="py-3 px-3">
                          {ticket.contact_preference === 'phone_call' ? (
                            <span>
                              <strong>+91 {ticket.callback_phone}</strong> · {ticket.callback_time_slot}
                            </span>
                          ) : (
                            <span className="text-stone-400">{ticket.verified_email}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 max-w-xs truncate">{ticket.query_details}</td>
                        <td className="py-3 pl-3">
                          <select
                            value={ticket.status}
                            onChange={async e => {
                              await api.patch(
                                `/superadmin/controlcentre/escalations/${ticket.id}`,
                                { status: e.target.value },
                                authHeaders
                              );
                              await fetchControlCentreData();
                            }}
                            className="rounded-lg border border-white/15 bg-black/40 px-2.5 py-1 text-xs text-white"
                          >
                            <option value="open">Open</option>
                            <option value="assigned">Assigned</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── VIEW 5: REAL-TIME TELEMETRY & INFRASTRUCTURE HEALTH MONITOR ─── */}
        {activeTopSection === 'telemetry' && (
          <section className="space-y-6">
            {/* Infrastructure KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-white/10 bg-[#091d15] p-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
                  API Endpoint Health (15m)
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <strong className="text-2xl font-bold text-emerald-300">
                    {telemetryData?.apiHealth?.status2xxCount ?? overview?.telemetry?.requestMetrics?.status2xxCount ?? 0}
                  </strong>
                  <span className="text-xs text-stone-400">200 OK</span>
                  <span className="text-xs text-rose-300 ml-auto">
                    {telemetryData?.apiHealth?.status5xxCount ?? overview?.telemetry?.requestMetrics?.serverErrorCount ?? 0} 5xx
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#091d15] p-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
                  Average Route Latency
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <strong className="text-2xl font-bold text-white">
                    {telemetryData?.apiHealth?.avgLatencyMs ?? overview?.telemetry?.requestMetrics?.averageLatencyMs ?? 0} ms
                  </strong>
                  <span className="text-xs text-stone-400">Rolling window</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#091d15] p-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
                  Railway &amp; MySQL Pool
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <strong className="text-lg font-bold text-emerald-300 capitalize">
                    {telemetryData?.infrastructure?.mysqlPool?.status || 'Healthy'}
                  </strong>
                  <span className="text-xs text-stone-400">
                    Uptime: {Math.floor((overview?.telemetry?.process?.uptimeSeconds || 0) / 60)}m
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#091d15] p-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
                  Frontend (F12) Crash Telemetry
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <strong className="text-2xl font-bold text-amber-300">
                    {(overview?.telemetry?.clientErrors || []).length}
                  </strong>
                  <span className="text-xs text-emerald-300">window.onerror Active</span>
                </div>
              </div>
            </div>

            {/* Per-Route Latency & HTTP Status Table */}
            <div className="rounded-2xl border border-white/10 bg-[#091d15] p-6 space-y-4">
              <h3 className="text-base font-bold text-white">
                Live API Route Health &amp; Latency Matrix (200 OK vs 4xx/5xx)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-left text-xs border-collapse">
                  <thead className="border-b border-white/10 text-[10px] uppercase tracking-wider text-stone-400">
                    <tr>
                      <th className="py-2.5 pr-3">Method &amp; Route</th>
                      <th className="py-2.5 px-3">Total Calls</th>
                      <th className="py-2.5 px-3">2xx OK</th>
                      <th className="py-2.5 px-3">4xx Client</th>
                      <th className="py-2.5 px-3">5xx Server</th>
                      <th className="py-2.5 px-3">Avg Latency</th>
                      <th className="py-2.5 pl-3">Max Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {(overview?.telemetry?.requestMetrics?.routeHealthTable || []).map(r => (
                      <tr key={`${r.method}-${r.route}`}>
                        <td className="py-2.5 pr-3 font-mono text-white">
                          <span className="text-[#d4af37] font-bold mr-2">{r.method}</span>
                          {r.route}
                        </td>
                        <td className="py-2.5 px-3">{r.totalRequests}</td>
                        <td className="py-2.5 px-3 text-emerald-300 font-semibold">{r.status2xx}</td>
                        <td className="py-2.5 px-3 text-amber-300">{r.status4xx}</td>
                        <td className="py-2.5 px-3 text-rose-400 font-bold">{r.status5xx}</td>
                        <td className="py-2.5 px-3 font-mono">{r.avgLatencyMs} ms</td>
                        <td className="py-2.5 pl-3 font-mono text-stone-400">{r.maxLatencyMs} ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Frontend (F12) Runtime Crash Reports */}
            <div className="rounded-2xl border border-white/10 bg-[#091d15] p-6 space-y-4">
              <h3 className="text-base font-bold text-white">
                Frontend (F12) Runtime Crash &amp; Unhandled Rejection Telemetry
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-left text-xs border-collapse">
                  <thead className="border-b border-white/10 text-[10px] uppercase tracking-wider text-stone-400">
                    <tr>
                      <th className="py-2.5 pr-3">Timestamp</th>
                      <th className="py-2.5 px-3">Page Route</th>
                      <th className="py-2.5 px-3">Error Message</th>
                      <th className="py-2.5 pl-3">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {(overview?.telemetry?.clientErrors || []).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-stone-500">
                          Zero frontend runtime crashes reported in the current window.
                        </td>
                      </tr>
                    ) : (
                      (overview?.telemetry?.clientErrors || []).slice(0, 25).map(err => (
                        <tr key={err.id}>
                          <td className="py-2.5 pr-3 text-stone-400">
                            {new Date(err.created_at).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[#f3d77b]">{err.page_url || '/'}</td>
                          <td className="py-2.5 px-3 text-rose-200">{err.message}</td>
                          <td className="py-2.5 pl-3 font-mono text-stone-400">{err.source || 'window.onerror'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ── VIEW 6: SECURITY VAULT ROTATION & CHAINED SHA-512 AUDIT LOG ── */}
        {activeTopSection === 'vault_settings' && (
          <section className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
            <form
              onSubmit={handleRotateVaultCredentials}
              onChange={() => setIsWorkspaceDirty(true)}
              className="rounded-2xl border border-[#d4af37]/35 bg-[#091d15] p-6 space-y-4 h-fit"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
                  Cryptographic Vault Governance
                </span>
                <h2 className="text-lg font-bold text-white mt-1">
                  Rotate Security Vault Credentials
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Rotate your Primary Master Password, Secondary Vault Password, or 6-Digit Master Action Passcode.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  New Primary Master Password (Optional)
                </label>
                <input
                  type="password"
                  minLength={10}
                  value={vaultRotationForm.newPrimaryPassword}
                  onChange={e =>
                    setVaultRotationForm(prev => ({ ...prev, newPrimaryPassword: e.target.value }))
                  }
                  placeholder="Leave blank to keep current"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  New Secondary Vault Password (Optional)
                </label>
                <input
                  type="password"
                  minLength={10}
                  value={vaultRotationForm.newSecondaryVaultPassword}
                  onChange={e =>
                    setVaultRotationForm(prev => ({
                      ...prev,
                      newSecondaryVaultPassword: e.target.value,
                    }))
                  }
                  placeholder="Leave blank to keep current"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  New 6-Digit Master Action Passcode (Optional)
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={vaultRotationForm.newActionPasscode}
                  onChange={e =>
                    setVaultRotationForm(prev => ({
                      ...prev,
                      newActionPasscode: e.target.value.replace(/\D/g, '').slice(0, 6),
                    }))
                  }
                  placeholder="Leave blank to keep current"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white font-mono tracking-widest"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#d4af37] py-3 text-xs font-black uppercase tracking-wider text-[#071510]"
              >
                Verify Current Passcode &amp; Rotate Secrets
              </button>
            </form>

            {/* Chained SHA-512 Vault Audit Trail */}
            <div className="rounded-2xl border border-white/10 bg-[#091d15] p-6 space-y-4 overflow-hidden">
              <h3 className="text-base font-bold text-white">
                Chained SHA-512 SuperAdmin Security Audit Trail ({auditLogs.length})
              </h3>
              <div className="overflow-x-auto max-h-[60vh]">
                <table className="w-full min-w-[780px] text-left text-xs border-collapse">
                  <thead className="border-b border-white/10 text-[10px] uppercase tracking-wider text-stone-400">
                    <tr>
                      <th className="py-2.5 pr-3">Time</th>
                      <th className="py-2.5 px-3">Action Code</th>
                      <th className="py-2.5 px-3">Target</th>
                      <th className="py-2.5 pl-3">SHA-512 Chain Digest</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {auditLogs.map(log => (
                      <tr key={log.id}>
                        <td className="py-2.5 pr-3 text-stone-400">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#f3d77b]">
                          {log.action_code}
                        </td>
                        <td className="py-2.5 px-3 text-white">{log.target_entity || '—'}</td>
                        <td className="py-2.5 pl-3 font-mono text-[10px] text-emerald-300">
                          {String(log.signature_sha512 || '').slice(0, 28)}…
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════
          FULL-SCREEN MODULE WORKSPACE MODAL WITH DIRTY-STATE PROTECTION
         ═══════════════════════════════════════════════════════════════════════ */}
      {activeWorkspaceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6">
          <div className="w-full h-full max-w-[1550px] max-h-[94vh] rounded-3xl border border-[#d4af37]/40 bg-[#071a12] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-[#0b2419]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
                    {activeWorkspaceModal.category} · {activeWorkspaceModal.key}
                  </span>
                  {isWorkspaceDirty && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Unsaved Modifications
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-lg font-bold text-white mt-0.5">
                  {activeWorkspaceModal.title}
                </h2>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsWorkspaceDirty(true)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-stone-300 hover:text-white"
                >
                  Mark Draft Dirty
                </button>
                <button
                  type="button"
                  onClick={requestCloseWorkspaceModal}
                  aria-label="Close module workspace"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 hover:bg-rose-500/20 px-3.5 py-2 text-xs font-bold text-white"
                >
                  <X size={15} /> Close Workspace
                </button>
              </div>
            </div>

            <div
              onChangeCapture={() => setIsWorkspaceDirty(true)}
              onInputCapture={() => setIsWorkspaceDirty(true)}
              className="flex-1 overflow-y-auto p-4 sm:p-6"
            >
              <Suspense
                fallback={
                  <div className="flex min-h-[40vh] items-center justify-center text-sm text-[#d4af37]">
                    Loading {activeWorkspaceModal.title}…
                  </div>
                }
              >
                {ActiveModalComponent && <ActiveModalComponent />}
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          STRICT UNSAVED CHANGES (DIRTY-STATE) CONFIRMATION MODAL
         ═══════════════════════════════════════════════════════════════════════ */}
      {unsavedConfirmModal && (
        <div className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="unsaved-changes-title"
            className="w-full max-w-md rounded-3xl border border-amber-400/40 bg-[#091d15] p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3 text-amber-300">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 id="unsaved-changes-title" className="font-serif text-lg font-bold text-white">
                Unsaved Modifications Detected
              </h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              You have unsaved changes. Would you like to Save before closing, Discard changes, or Cancel?
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleSaveBeforeClosingWorkspace}
                className="flex-1 rounded-xl bg-emerald-400 py-2.5 px-3 text-xs font-black uppercase text-[#071510]"
              >
                Save before closing
              </button>
              <button
                type="button"
                onClick={handleDiscardAndCloseWorkspace}
                className="flex-1 rounded-xl bg-rose-500/20 border border-rose-500/40 py-2.5 px-3 text-xs font-bold text-rose-200 hover:bg-rose-500/30"
              >
                Discard changes
              </button>
              <button
                type="button"
                onClick={() => setUnsavedConfirmModal(false)}
                className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2.5 px-3 text-xs font-semibold text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          STEP-UP 6-DIGIT MASTER ACTION PASSCODE VERIFICATION MODAL
         ═══════════════════════════════════════════════════════════════════════ */}
      {stepUpModal.open && (
        <div className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={executeStepUpConfirmedAction}
            className="w-full max-w-md rounded-3xl border border-[#d4af37]/50 bg-[#091d15] p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-[#d4af37]">
                <KeyRound className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Step-Up Cryptographic Verification
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStepUpModal(prev => ({ ...prev, open: false }))}
                className="text-xs text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <h3 className="font-serif text-lg font-bold text-white">{stepUpModal.title}</h3>
            <p className="text-xs text-stone-300 leading-relaxed">{stepUpModal.description}</p>

            {stepUpModal.error && (
              <div className="rounded-xl bg-rose-500/15 border border-rose-500/35 p-3 text-xs text-rose-200">
                {stepUpModal.error}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d4af37] mb-1.5">
                6-Digit Master Action Passcode
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                autoFocus
                required
                value={stepUpModal.passcode}
                onChange={e =>
                  setStepUpModal(prev => ({
                    ...prev,
                    passcode: e.target.value.replace(/\D/g, '').slice(0, 6),
                  }))
                }
                placeholder="••••••"
                className="w-full rounded-xl border border-white/20 bg-black/50 px-4 py-3 text-center font-mono text-lg tracking-[0.35em] text-white focus:border-[#d4af37] outline-none"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setStepUpModal(prev => ({ ...prev, open: false }))}
                className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-semibold text-stone-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={stepUpModal.busy || stepUpModal.passcode.length !== 6}
                className="flex-1 rounded-xl bg-[#d4af37] py-2.5 text-xs font-black uppercase tracking-wider text-[#071510] disabled:opacity-50"
              >
                {stepUpModal.busy ? 'Verifying…' : 'Verify & Execute'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
