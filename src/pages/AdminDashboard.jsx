import React, { useState, Suspense, Component, lazy } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Activity, Award, Bell, Boxes, ChartNoAxesCombined, FlaskConical,
  Gamepad2, Gift, Leaf, LifeBuoy, Mail, Package, ScrollText, Settings2,
  ShoppingBag, SlidersHorizontal, Star, Tags, Truck, Users, Warehouse, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// DYNAMIC LAZY IMPORTS to isolate rendering logic
const DashboardOverview = lazy(() => import('./admin/DashboardOverview'));
const ProductManagement = lazy(() => import('./admin/ProductManagement'));
const CategoryManagement = lazy(() => import('./admin/CategoryManagement'));
const OrderManagement = lazy(() => import('./admin/OrderManagement'));
const UserManagement = lazy(() => import('./admin/UserManagement'));
const AnalyticsManagement = lazy(() => import('./admin/AnalyticsManagement'));
const InventoryManagement = lazy(() => import('./admin/InventoryManagement'));
const CouponManagement = lazy(() => import('./admin/CouponManagement'));
const ReviewManagement = lazy(() => import('./admin/ReviewManagement'));
const ContactManagement = lazy(() => import('./admin/ContactManagement'));
const ReturnManagement = lazy(() => import('./admin/ReturnManagement'));
const SupportManagement = lazy(() => import('./admin/SupportManagement'));
const FlashSalesManagement = lazy(() => import('./admin/FlashSalesManagement'));
const LoyaltyManagement = lazy(() => import('./admin/LoyaltyManagement'));
const AffiliateManagement = lazy(() => import('./admin/AffiliateManagement'));
const NotificationManagement = lazy(() => import('./admin/NotificationManagement'));
const TaxManagement = lazy(() => import('./admin/TaxManagement'));
const SystemLogs = lazy(() => import('./admin/SystemLogs'));
const WarehouseManagement = lazy(() => import('./admin/WarehouseManagement'));
const ShippingManagement = lazy(() => import('./admin/ShippingManagement')); 
const AdminSettings = lazy(() => import('./admin/AdminSettings.jsx'));
const MinCartValueCenter = lazy(() => import('./admin/MinCartValueCenter.jsx'));
const CartRulesEngine = lazy(() => import('./admin/CartRulesEngine.jsx'));
const GamificationStudio = lazy(() => import('./admin/GamificationStudio.jsx'));
const LifecycleOffers = lazy(() => import('./admin/LifecycleOffers.jsx'));
const PersonalizationCenter = lazy(() => import('./admin/PersonalizationCenter.jsx'));
const ABExperimentLab = lazy(() => import('./admin/ABExperimentLab.jsx'));
const LoyaltyTierForge = lazy(() => import('./admin/LoyaltyTierForge.jsx'));
const ImpactManagement = lazy(() => import('./admin/ImpactManagement.jsx'));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("Dashboard Module Error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-slate-950/50 backdrop-blur-md rounded-2xl border border-rose-500/20">
          <h2 className="text-xl font-bold text-rose-400 mb-2 tracking-wide">Kernel Panic in Module</h2>
          <p className="text-slate-400 mb-6 max-w-md text-sm font-mono">{this.state.error?.message || 'Module execution halted.'}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-black uppercase tracking-widest rounded-xl transition-all duration-300"
          >
            Reboot Module
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ComingSoon = ({ name }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
    <h2 className="text-2xl font-black text-white mb-2 tracking-tight">{name}</h2>
    <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Awaiting Deployment</p>
  </div>
);

const TAB_COMPONENTS = {
  overview: DashboardOverview, products: ProductManagement, categories: CategoryManagement,
  inventory: InventoryManagement, orders: OrderManagement, returns: ReturnManagement,
  'flash-sales': FlashSalesManagement, coupons: CouponManagement, users: UserManagement,
  support: SupportManagement, reviews: ReviewManagement, loyalty: LoyaltyManagement,
  affiliate: AffiliateManagement, 
  analytics: AnalyticsManagement,
  contact: ContactManagement,
  notifications: NotificationManagement,
  tax: TaxManagement, shipping: ShippingManagement, logs: SystemLogs,
  warehouse: WarehouseManagement, settings: AdminSettings,
  'min-cart-value': MinCartValueCenter,
  'cart-rules': CartRulesEngine,
  gamification: GamificationStudio,
  'lifecycle-offers': LifecycleOffers,
  personalization: PersonalizationCenter,
  'ab-experiments': ABExperimentLab,
  'loyalty-tiers': LoyaltyTierForge,
  impact: ImpactManagement,
};

const TAB_ICONS = {
  overview: Activity, analytics: ChartNoAxesCombined, notifications: Bell, logs: ScrollText,
  orders: ShoppingBag, shipping: Truck, impact: Leaf, products: Package, categories: Boxes,
  inventory: Tags, warehouse: Warehouse, loyalty: Award, affiliate: Users, coupons: Gift,
  'flash-sales': Zap, reviews: Star, 'min-cart-value': SlidersHorizontal, 'cart-rules': SlidersHorizontal,
  gamification: Gamepad2, 'lifecycle-offers': Mail, personalization: Users,
  'ab-experiments': FlaskConical, 'loyalty-tiers': Award, support: LifeBuoy,
  returns: Truck, contact: Mail, settings: Settings2, tax: Tags, users: Users
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { tab } = useParams();
  const activeTab = tab || 'overview';
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [navSearch, setNavSearch] = useState('');

  const menuSections = [
    {
      title: 'Workspace', items: [
        { id: 'overview', label: 'Dashboard' }, { id: 'analytics', label: 'Analytics' },
        { id: 'notifications', label: 'Notifications' }
      ]
    },
    {
      title: 'Customer experience', items: [
        { id: 'reviews', label: 'Reviews' }, { id: 'support', label: 'Support inbox' },
        { id: 'users', label: 'Customers' }, { id: 'contact', label: 'Messages' },
        { id: 'returns', label: 'Returns' }
      ]
    },
    {
      title: 'Store operations', items: [
        { id: 'orders', label: 'Orders' }, { id: 'products', label: 'Products' },
        { id: 'categories', label: 'Categories' }, { id: 'inventory', label: 'Inventory' },
        { id: 'warehouse', label: 'Warehouse' }, { id: 'shipping', label: 'Shipping' },
        { id: 'tax', label: 'Taxes' }
      ]
    },
    {
      title: 'Growth & offers', items: [
        { id: 'loyalty', label: 'Loyalty' }, { id: 'affiliate', label: 'Affiliates' },
        { id: 'coupons', label: 'Coupons' }, { id: 'flash-sales', label: 'Flash Sales' },
        { id: 'min-cart-value', label: 'Cart minimums' }, { id: 'cart-rules', label: 'Cart rules' },
        { id: 'gamification', label: 'Gamification' }, { id: 'lifecycle-offers', label: 'Lifecycle offers' },
        { id: 'personalization', label: 'Personalization' }, { id: 'ab-experiments', label: 'A/B experiments' },
        { id: 'loyalty-tiers', label: 'Loyalty tiers' }
      ]
    },
    {
      title: 'Platform', items: [
        { id: 'impact', label: 'Earth impact' }, { id: 'logs', label: 'System logs' },
        { id: 'settings', label: 'Settings' }
      ]
    },
  ];

  const quickTabs = ['overview', 'orders', 'products', 'users', 'reviews', 'support', 'coupons'];
  const allMenuItems = menuSections.flatMap(section => section.items);
  const quickItems = quickTabs.map(id => allMenuItems.find(item => item.id === id)).filter(Boolean);
  const normalizedSearch = navSearch.trim().toLowerCase();
  const visibleSections = menuSections
    .filter(section => section.items.length)
    .map(section => ({
      ...section,
      items: section.items.filter(item => item.label.toLowerCase().includes(normalizedSearch))
    }))
    .filter(section => section.items.length);
  const activeLabel = allMenuItems.find(item => item.id === activeTab)?.label || 'Dashboard';
  const ActiveComponent = TAB_COMPONENTS[activeTab] || DashboardOverview;

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
        <div className={`${isSidebarOpen ? 'w-64' : 'w-[4.5rem]'} transition-[width] duration-300 sidebar-scroll flex-shrink-0 bg-[#071a12] border-r border-[#d4af37]/15 flex flex-col overflow-y-auto relative z-20`}>
          <div className="flex items-center gap-3 px-4 py-4 border-b border-[#d4af37]/15 sticky top-0 bg-[#071a12] z-10">
            <div className="w-10 h-10 bg-[#d4af37] rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-[#0b2419] font-black text-sm tracking-tighter">BV</span>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-36 opacity-100' : 'w-0 opacity-0'}`}>
              <span className="text-white font-black tracking-[0.12em] text-sm block">Bhumivera</span>
              <span className="text-[#d4af37] font-semibold text-[10px] uppercase tracking-widest block">Admin workspace</span>
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
              {navSearch && <button type="button" onClick={() => setNavSearch('')} className="text-[10px] text-slate-400 hover:text-white" aria-label="Clear section search">Clear</button>}
            </label>
          )}

          <nav aria-label="Admin sections" className="flex-1 py-4 px-2 space-y-4">
            {visibleSections.length ? visibleSections.map(section => (
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
                      <Icon size={17} strokeWidth={isActive ? 2.3 : 1.8} className="flex-shrink-0" aria-hidden="true" />
                      {isSidebarOpen && <span className="truncate text-xs font-medium">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            )) : (
              <p className="px-3 py-4 text-xs text-slate-500">No matching section.</p>
            )}
          </nav>

          <div className="p-3 border-t border-[#d4af37]/15 bg-[#071a12] sticky bottom-0 z-10">
            <button
              type="button"
              onClick={() => { logout('admin'); navigate('/admin/login'); }}
              className={`w-full min-h-9 flex items-center py-2 rounded-lg transition-colors border border-transparent text-slate-400 hover:bg-rose-500/10 hover:text-rose-300 ${!isSidebarOpen ? 'justify-center px-0' : 'px-3 gap-2.5'}`}
            >
              <svg className="flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </button>
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#d4af37]">Bhumivera admin</p>
                  <h1 className="truncate text-lg font-semibold text-white md:text-xl">{activeLabel}</h1>
                </div>
              </div>
              <div className="flex items-center gap-2 border-l border-white/10 pl-3 md:gap-3 md:pl-5">
                <div className="hidden text-right sm:block">
                  <p className="max-w-40 truncate text-xs font-semibold text-white">{user?.name || user?.email || 'Administrator'}</p>
                  <p className="text-[10px] capitalize text-slate-400">{user?.role || 'admin'}</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 text-sm font-bold text-[#f3d77b]" aria-hidden="true">
                  {(user?.name || user?.email || 'A')[0].toUpperCase()}
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
                    <Icon size={13} aria-hidden="true" />{item.label}
                  </button>
                );
              })}
            </nav>
          </header>

          <main className="content-scroll min-h-0 flex-1 overflow-auto p-3 md:p-5">
            <ErrorBoundary key={activeTab}>
              <Suspense fallback={
                <div className="flex min-h-[40vh] items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#d4af37]/20 border-t-[#d4af37]" />
                    <span className="text-[#d4af37] text-xs font-medium">Loading {activeLabel}…</span>
                  </div>
                </div>
              }>
                <ActiveComponent key={activeTab} />
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </>
  );
}
