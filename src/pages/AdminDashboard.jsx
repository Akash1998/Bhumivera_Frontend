import React, { useEffect, useRef, useState, Suspense, Component, lazy } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Activity, Award, Bell, Boxes, ChartNoAxesCombined, ChevronDown, Compass, ExternalLink, FileText,
  Gamepad2, Gift, Headphones, Leaf, LogOut, Mail, MessageSquare, Package, Settings2,
  ShieldCheck, ShoppingBag, SlidersHorizontal, Sparkles, Star, Tags, Truck, Users, Wallet, Warehouse, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { COMPLETE_SITE_NAVIGATION_DIRECTORY } from '../utils/aiCopilotBus';

// DYNAMIC LAZY IMPORTS to isolate rendering logic
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
const ReferralEngine = lazy(() => import('./admin/AffiliateManagement.jsx'));
const SupportManagement = lazy(() => import('./admin/SupportManagement.jsx'));
const ContactManagement = lazy(() => import('./admin/ContactManagement.jsx'));
const EWarrantyManagement = lazy(() => import('./admin/EWarrantyManagement.jsx'));
const SupportAgentManagement = lazy(() => import('./admin/SupportAgentManagement.jsx'));
const LoyaltyTierForge = lazy(() => import('./admin/LoyaltyTierForge.jsx'));
const LoyaltyMembers = lazy(() => import('./admin/LoyaltyMembers.jsx'));
const PersonalizationCenter = lazy(() => import('./admin/PersonalizationCenter.jsx'));
const LifecycleOffers = lazy(() => import('./admin/LifecycleOffers.jsx'));

const GROWTH_TABS = [
  'flash-sales',
  'coupons',
  'loyalty',
  'loyalty-matrix',
  'min-cart-value',
  'cart-rules',
  'gamification',
  'ab-experiments',
];

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('Dashboard Module Error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-slate-950/50 backdrop-blur-md rounded-2xl border border-rose-500/20">
          <h2 className="text-xl font-bold text-rose-400 mb-2 tracking-wide">Workspace Module Interruption</h2>
          <p className="text-slate-400 mb-6 max-w-md text-sm font-mono">
            {this.state.error?.message || 'Module execution halted.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-black uppercase tracking-widest rounded-xl transition-all duration-300"
          >
            Reload Module
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const TAB_COMPONENTS = {
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
  ...Object.fromEntries(GROWTH_TABS.map(id => [id, GrowthOffersHub])),
  'loyalty-tiers': LoyaltyTierForge,
  'loyalty-members': LoyaltyMembers,
  personalization: PersonalizationCenter,
  'lifecycle-offers': LifecycleOffers,
  affiliate: ReferralEngine,
  'referral-engine': ReferralEngine,
  'growth-offers': GrowthOffersHub,
  'wallet-management': WalletManagement,
  impact: ImpactManagement,
  support: SupportManagement,
  contacts: ContactManagement,
  ewarranty: EWarrantyManagement,
  'support-agents': SupportAgentManagement,
};

const TAB_ICONS = {
  overview: Activity,
  analytics: ChartNoAxesCombined,
  notifications: Bell,
  orders: ShoppingBag,
  shipping: Truck,
  impact: Leaf,
  products: Package,
  categories: Boxes,
  inventory: Tags,
  warehouse: Warehouse,
  loyalty: Award,
  affiliate: Users,
  coupons: Gift,
  'flash-sales': Zap,
  reviews: Star,
  'min-cart-value': SlidersHorizontal,
  'cart-rules': SlidersHorizontal,
  gamification: Gamepad2,
  'lifecycle-offers': Mail,
  personalization: Sparkles,
  'loyalty-tiers': Award,
  'loyalty-members': Users,
  'loyalty-matrix': Award,
  'growth-offers': Gift,
  'wallet-management': Wallet,
  returns: Truck,
  settings: Settings2,
  tax: Tags,
  gst: FileText,
  users: Users,
  support: Headphones,
  contacts: MessageSquare,
  ewarranty: ShieldCheck,
  'support-agents': Users,
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { tab } = useParams();
  const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
  const [showSiteLinksModal, setShowSiteLinksModal] = useState(false);
  const [siteLinksFilter, setSiteLinksFilter] = useState('');
  const accountMenuRef = useRef(null);
  const activeTab = tab || 'overview';
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [navSearch, setNavSearch] = useState('');

  useEffect(() => {
    if (!isAccountMenuOpen) return undefined;
    const closeOnOutsideClick = event => {
      if (!accountMenuRef.current?.contains(event.target)) setAccountMenuOpen(false);
    };
    const closeOnEscape = event => {
      if (event.key === 'Escape') setAccountMenuOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isAccountMenuOpen]);

  const openAdminSection = section => {
    setAccountMenuOpen(false);
    navigate(`/admin/dashboard/${section}`);
  };

  const signOut = () => {
    setAccountMenuOpen(false);
    logout('admin');
    navigate('/admin/login');
  };

  // Luxury E-Commerce Nomenclature Overhaul (Static System Health, Pause Modules, and raw Logs removed from standard sidebar)
  const menuSections = [
    {
      title: 'Workspace',
      items: [
        { id: 'overview', label: 'Dashboard' },
        { id: 'analytics', label: 'Analytics' },
        { id: 'notifications', label: 'Notifications' },
      ],
    },
    {
      title: 'Client Experience',
      items: [
        { id: 'users', label: 'Client Directory' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'returns', label: 'Returns' },
        { id: 'support', label: 'Bhumivera Client Concierge' },
        { id: 'contacts', label: 'Contact & Inquiries' },
        { id: 'ewarranty', label: 'E-Warranty Registry' },
        { id: 'support-agents', label: 'Support Staff Roster' },
      ],
    },
    {
      title: 'Store Operations',
      items: [
        { id: 'orders', label: 'Orders' },
        { id: 'products', label: 'Products' },
        { id: 'categories', label: 'Categories' },
        { id: 'inventory', label: 'Inventory' },
        { id: 'warehouse', label: 'Warehouse' },
        { id: 'shipping', label: 'Shipping' },
        { id: 'tax', label: 'Taxes' },
        { id: 'gst', label: 'Financial Ledger & GST Compliance' },
      ],
    },
    {
      title: 'Privilege & Bespoke Curation',
      items: [
        { id: 'growth-offers', label: 'Promotions & Offers' },
        { id: 'loyalty-tiers', label: 'Clientele Privilege & Tiers' },
        { id: 'loyalty-members', label: 'Privilege Members' },
        { id: 'personalization', label: 'Bespoke Client Curation' },
        { id: 'lifecycle-offers', label: 'Lifecycle Automations' },
      ],
    },
    {
      title: 'Ambassador Relations',
      items: [{ id: 'referral-engine', label: 'Brand Ambassador Program' }],
    },
    {
      title: 'Maison Governance',
      items: [
        { id: 'impact', label: 'Earth Impact' },
        { id: 'wallet-management', label: 'Client Wallets' },
        { id: 'settings', label: 'Settings' },
      ],
    },
  ];

  const quickTabs = [
    'overview',
    'orders',
    'gst',
    'products',
    'users',
    'support',
    'growth-offers',
    'loyalty-tiers',
    'personalization',
  ];
  const allMenuItems = menuSections.flatMap(section => section.items);
  const quickItems = quickTabs.map(id => allMenuItems.find(item => item.id === id)).filter(Boolean);
  const normalizedSearch = navSearch.trim().toLowerCase();
  const visibleSections = menuSections
    .filter(section => section.items.length)
    .map(section => ({
      ...section,
      items: section.items.filter(item => item.label.toLowerCase().includes(normalizedSearch)),
    }))
    .filter(section => section.items.length);
  const activeLabel =
    allMenuItems.find(item => item.id === activeTab)?.label ||
    (['affiliate', 'referral-engine'].includes(activeTab)
      ? 'Brand Ambassador Program'
      : ['loyalty-matrix', 'loyalty-tiers'].includes(activeTab)
      ? 'Clientele Privilege & Tiers'
      : GROWTH_TABS.includes(activeTab)
      ? 'Promotions & Offers'
      : 'Dashboard');
  const ActiveComponent = TAB_COMPONENTS[activeTab] || DashboardOverview;

  const filteredDirectoryLinks = COMPLETE_SITE_NAVIGATION_DIRECTORY.filter(item => {
    const q = siteLinksFilter.trim().toLowerCase();
    if (!q) return true;
    return (
      item.label.toLowerCase().includes(q) ||
      item.path.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <style>{`
        .sidebar-scroll::-webkit-scrollbar,
        .content-scroll::-webkit-scrollbar { width: 8px; }
        .sidebar-scroll::-webkit-scrollbar-track,
        .content-scroll::-webkit-scrollbar-track { background: #071a12; }
        .sidebar-scroll::-webkit-scrollbar-thumb,
        .content-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(212, 175, 55, 0.48);
          border-radius: 4px;
        }
        .admin-shell {
          background:
            radial-gradient(ellipse at 76% 4%, rgba(34, 197, 94, 0.14), transparent 40%),
            radial-gradient(ellipse at 18% 82%, rgba(212, 175, 55, 0.08), transparent 42%),
            linear-gradient(135deg, #071a12 0%, #0b2419 52%, #0a1c16 100%);
          isolation: isolate;
        }
        .admin-shell::before {
          content: "";
          position: fixed;
          inset: -18%;
          z-index: -1;
          pointer-events: none;
          background:
            radial-gradient(ellipse at 42% 35%, rgba(16, 185, 129, 0.08), transparent 34%),
            radial-gradient(ellipse at 82% 72%, rgba(212, 175, 55, 0.05), transparent 30%);
          filter: blur(38px);
          animation: admin-glass-flow 24s ease-in-out infinite alternate;
        }
        .admin-shell ::selection { background: rgba(212, 175, 55, 0.25); }
        @keyframes admin-glass-flow {
          from { transform: translate3d(-2%, -1%, 0) scale(0.98); }
          to { transform: translate3d(2%, 1%, 0) scale(1.04); }
        }
      `}</style>

      <div className="admin-shell flex h-screen overflow-hidden text-[#f7f5ee] selection:bg-amber-500/30">
        <div
          className={`${
            isSidebarOpen ? 'w-64' : 'w-[4.5rem]'
          } transition-[width] duration-300 sidebar-scroll flex-shrink-0 bg-[#071a12] border-r border-[#d4af37]/15 flex flex-col overflow-y-auto relative z-20`}
        >
          <div className="flex items-center gap-3 px-4 py-4 border-b border-[#d4af37]/15 sticky top-0 bg-[#071a12] z-10">
            <div className="w-10 h-10 bg-[#d4af37] rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-[#0b2419] font-black text-sm tracking-tighter">BV</span>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isSidebarOpen ? 'w-40 opacity-100' : 'w-0 opacity-0'
              }`}
            >
              <span className="text-white font-black tracking-[0.12em] text-sm block">Bhumivera</span>
              <span className="text-[#d4af37] font-semibold text-[9px] uppercase tracking-widest block">
                Maison Executive Suite
              </span>
            </div>
          </div>

          {isSidebarOpen && (
            <label className="mx-3 mt-3 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-400 focus-within:border-[#d4af37]/50">
              <ChartNoAxesCombined size={15} aria-hidden="true" />
              <input
                value={navSearch}
                onChange={event => setNavSearch(event.target.value)}
                placeholder="Find a section"
                aria-label="Find an admin section"
                className="w-full min-w-0 bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
              />
              {navSearch && (
                <button
                  type="button"
                  onClick={() => setNavSearch('')}
                  className="text-[10px] text-slate-400 hover:text-white"
                  aria-label="Clear section search"
                >
                  Clear
                </button>
              )}
            </label>
          )}

          <nav aria-label="Admin sections" className="flex-1 py-4 px-2 space-y-4">
            {visibleSections.length ? (
              visibleSections.map(section => (
                <div key={section.title} className="space-y-0.5">
                  {isSidebarOpen && (
                    <p className="px-3 pb-1 text-[9px] font-bold text-slate-500 uppercase tracking-[0.16em]">
                      {section.title}
                    </p>
                  )}
                  {section.items.map(item => {
                    const isActive = activeTab === item.id;
                    const Icon = TAB_ICONS[item.id] || Activity;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        title={!isSidebarOpen ? item.label : undefined}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => navigate(`/admin/dashboard/${item.id}`)}
                        className={`w-full min-h-9 flex items-center px-3 py-2 rounded-lg transition-colors border ${
                          isActive
                            ? 'bg-[#d4af37]/15 border-[#d4af37]/30 text-[#f3d77b]'
                            : 'border-transparent text-slate-300 hover:bg-white/5 hover:text-white'
                        } ${!isSidebarOpen ? 'justify-center' : 'gap-2.5'}`}
                      >
                        <Icon
                          size={17}
                          strokeWidth={isActive ? 2.3 : 1.8}
                          className="flex-shrink-0"
                          aria-hidden="true"
                        />
                        {isSidebarOpen && <span className="truncate text-xs font-medium">{item.label}</span>}
                      </button>
                    );
                  })}
                </div>
              ))
            ) : (
              <p className="px-3 py-4 text-xs text-slate-500">No matching section.</p>
            )}
          </nav>

          {/* Direct Portal Links in Sidebar */}
          {isSidebarOpen && (
            <div className="px-3 py-2 border-t border-[#d4af37]/15 space-y-1 text-[11px]">
              <p className="px-2 pb-1 text-[9px] font-bold text-[#d4af37] uppercase tracking-widest">
                Maison Portals
              </p>
              <Link
                to="/superadmin/controlcentre"
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[#f3d77b] bg-[#d4af37]/10 hover:bg-[#d4af37]/20 font-semibold"
              >
                <span>SuperAdmin Control Centre</span>
                <ExternalLink size={12} />
              </Link>
              <Link
                to="/superadminsupport"
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-purple-200 hover:bg-purple-500/15"
              >
                <span>SuperAdmin Support</span>
                <ExternalLink size={12} />
              </Link>
              <Link
                to="/support"
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-emerald-200 hover:bg-emerald-500/15"
              >
                <span>Customer Support Desk</span>
                <ExternalLink size={12} />
              </Link>
              <Link
                to="/"
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-amber-200 hover:bg-amber-500/15"
              >
                <span>Main Storefront</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          )}

          <div className="p-3 border-t border-[#d4af37]/15 bg-[#071a12] sticky bottom-0 z-10">
            <button
              type="button"
              onClick={signOut}
              className={`w-full min-h-9 flex items-center py-2 rounded-lg transition-colors border border-transparent text-slate-400 hover:bg-rose-500/10 hover:text-rose-300 ${
                !isSidebarOpen ? 'justify-center px-0' : 'px-3 gap-2.5'
              }`}
            >
              <svg
                className="flex-shrink-0"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              {isSidebarOpen && <span className="text-xs font-semibold">Sign out</span>}
            </button>
          </div>
        </div>

        <div className="min-w-0 flex-1 flex flex-col overflow-hidden relative">
          <header className="relative z-10 border-b border-[#d4af37]/15 bg-[#0b2419]">
            <div className="flex min-h-[4.25rem] items-center justify-between gap-4 px-4 py-3 md:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(!isSidebarOpen)}
                  aria-label={isSidebarOpen ? 'Collapse navigation' : 'Expand navigation'}
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-[#d4af37]/50 hover:text-white"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </button>
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#d4af37]">
                    Bhumivera Maison Executive Suite
                  </p>
                  <h1 className="truncate text-lg font-semibold text-white md:text-xl">{activeLabel}</h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSiteLinksModal(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 px-3 py-1.5 text-xs font-semibold text-[#f3d77b] hover:bg-[#d4af37]/20"
                >
                  <Compass size={14} />
                  Maison Route Registry
                </button>

                <Link
                  to="/superadmin/controlcentre"
                  className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/15 px-3 py-1.5 text-xs font-semibold text-[#f3d77b] hover:bg-[#d4af37]/25"
                >
                  Control Centre
                  <ExternalLink size={12} />
                </Link>

                <div className="relative border-l border-white/10 pl-3 md:pl-5" ref={accountMenuRef}>
                  <button
                    type="button"
                    aria-expanded={isAccountMenuOpen}
                    aria-controls="admin-account-menu"
                    aria-label="Open admin account menu"
                    onClick={() => setAccountMenuOpen(open => !open)}
                    className="flex min-h-10 items-center gap-2 rounded-xl px-1.5 text-left transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37] md:gap-3"
                  >
                    <span className="hidden max-w-40 text-right sm:block">
                      <span className="block truncate text-xs font-semibold text-white">
                        {user?.name || user?.email || 'Administrator'}
                      </span>
                      <span className="block text-[10px] capitalize text-slate-400">{user?.role || 'admin'}</span>
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 text-sm font-bold text-[#f3d77b]">
                      {(user?.name || user?.email || 'A')[0].toUpperCase()}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  {isAccountMenuOpen && (
                    <div
                      id="admin-account-menu"
                      role="group"
                      aria-label="Admin account actions"
                      className="absolute right-0 top-full z-30 mt-2 w-72 overflow-hidden rounded-xl border border-[#d4af37]/25 bg-[#071a12] p-2 shadow-2xl shadow-black/50"
                    >
                      <div className="border-b border-white/10 px-3 py-3">
                        <p className="truncate text-sm font-semibold text-white">
                          {user?.name || user?.email || 'Administrator'}
                        </p>
                        {user?.name && <p className="truncate text-xs text-slate-400">{user?.email}</p>}
                        <span className="mt-2 inline-flex rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10 px-2 py-0.5 text-[10px] font-semibold capitalize text-[#f3d77b]">
                          {user?.role || 'admin'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => openAdminSection('settings')}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
                      >
                        <ShieldCheck size={16} className="text-emerald-300" aria-hidden="true" />
                        <span>
                          <span className="block font-medium">Security &amp; account</span>
                          <span className="block text-[11px] text-slate-500">2FA, passkeys, password</span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openAdminSection('gst')}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
                      >
                        <FileText size={16} className="text-[#d4af37]" aria-hidden="true" />
                        Financial Ledger &amp; GST Compliance
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          navigate('/superadmin/controlcentre');
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
                      >
                        <Activity size={16} className="text-cyan-300" aria-hidden="true" />
                        SuperAdmin Control Centre
                      </button>
                      <button
                        type="button"
                        onClick={() => openAdminSection('orders')}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
                      >
                        <ShoppingBag size={16} className="text-slate-300" aria-hidden="true" />
                        Orders &amp; fulfillment
                      </button>
                      <button
                        type="button"
                        onClick={signOut}
                        className="mt-1 flex w-full items-center gap-3 rounded-lg border-t border-white/10 px-3 py-2.5 text-left text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10"
                      >
                        <LogOut size={16} aria-hidden="true" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <nav aria-label="Frequently used admin sections" className="flex gap-1 overflow-x-auto px-4 pb-3 md:px-6">
              {quickItems.map(item => {
                const isActive = activeTab === item.id;
                const Icon = TAB_ICONS[item.id] || Activity;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => navigate(`/admin/dashboard/${item.id}`)}
                    className={`inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[11px] font-medium transition ${
                      isActive
                        ? 'border-[#d4af37]/40 bg-[#d4af37] text-[#0b2419]'
                        : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-[#d4af37]/40 hover:text-white'
                    }`}
                  >
                    <Icon size={13} aria-hidden="true" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </header>

          <main className="content-scroll min-h-0 flex-1 overflow-auto p-3 md:p-5">
            <ErrorBoundary key={activeTab}>
              <Suspense
                fallback={
                  <div className="flex min-h-[40vh] items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#d4af37]/20 border-t-[#d4af37]" />
                      <span className="text-[#d4af37] text-xs font-medium">Loading {activeLabel}…</span>
                    </div>
                  </div>
                }
              >
                <ActiveComponent key={activeTab} />
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
      </div>

      {/* Complete Site & Admin Links Modal */}
      {showSiteLinksModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl rounded-3xl border border-[#d4af37]/35 bg-[#071a12] p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">
                  Complete Platform Link Registry
                </p>
                <h2 className="text-lg font-bold text-white">
                  All Storefront, Account, Support, Policy &amp; Executive Links ({filteredDirectoryLinks.length})
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={siteLinksFilter}
                  onChange={e => setSiteLinksFilter(e.target.value)}
                  placeholder="Filter links…"
                  className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowSiteLinksModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white font-bold"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 overflow-y-auto pr-1">
              {filteredDirectoryLinks.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowSiteLinksModal(false)}
                  className="p-3 rounded-xl bg-white/[0.03] hover:bg-[#d4af37]/15 border border-white/10 hover:border-[#d4af37]/40 transition text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase text-[#d4af37] font-bold">{item.category}</span>
                    <ExternalLink size={12} className="text-slate-400" />
                  </div>
                  <div className="font-bold text-white">{item.label}</div>
                  <code className="text-[11px] text-emerald-300 block">{item.path}</code>
                  <p className="text-[11px] text-slate-400">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
