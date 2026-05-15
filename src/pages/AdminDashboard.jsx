import React, { useState, Suspense, Component, lazy } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
const BannerManagement = lazy(() => import('./admin/BannerManagement'));
const ContactManagement = lazy(() => import('./admin/ContactManagement'));
const ReturnManagement = lazy(() => import('./admin/ReturnManagement'));
const AdminSettings = lazy(() => import('./admin/AdminSettings'));
const SupportManagement = lazy(() => import('./admin/SupportManagement'));
const FlashSalesManagement = lazy(() => import('./admin/FlashSalesManagement'));
const LoyaltyManagement = lazy(() => import('./admin/LoyaltyManagement'));
const AffiliateManagement = lazy(() => import('./admin/AffiliateManagement'));
const WalletManagement = lazy(() => import('./admin/WalletManagement'));
const NotificationManagement = lazy(() => import('./admin/NotificationManagement'));
const ShippingManagement = lazy(() => import('./admin/ShippingManagement'));
const TaxManagement = lazy(() => import('./admin/TaxManagement'));
const SystemLogs = lazy(() => import('./admin/SystemLogs'));
const CMSManagement = lazy(() => import('./admin/CMSManagement'));
const EmailTemplates = lazy(() => import('./admin/EmailTemplates'));
const FitmentMatrix = lazy(() => import('./admin/FitmentMatrix'));
const WarehouseManagement = lazy(() => import('./admin/WarehouseManagement'));
const EWarrantyManagement = lazy(() => import('./admin/EWarrantyManagement')); 

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
  Genuine_test: EWarrantyManagement, 
  analytics: AnalyticsManagement,
  banners: BannerManagement, contact: ContactManagement, settings: AdminSettings,
  wallet: WalletManagement, notifications: NotificationManagement, shipping: ShippingManagement,
  tax: TaxManagement, logs: SystemLogs, cms: CMSManagement, email: EmailTemplates,
  fitment: FitmentMatrix, warehouse: WarehouseManagement, mobile: () => <ComingSoon name="OTP Gateway" />,
  seo: () => <ComingSoon name="Search Engine Matrix" />, database: () => <ComingSoon name="Database Cluster" />,
  api: () => <ComingSoon name="API Webhooks" />, security: () => <ComingSoon name="WAF Security" />,
  backups: () => <ComingSoon name="Disaster Recovery" />, translations: () => <ComingSoon name="Global i18n" />,
  ads: () => <ComingSoon name="Ad Network" />, reports: () => <ComingSoon name="Financial Ledger" />,
  performance: () => <ComingSoon name="Telemetry" />, terminal: () => <ComingSoon name="Root Terminal" />,
};

// Safe Generic Icon to bypass Lucide-React `.reduce()` compiler crashes
const SafeIcon = ({ active }) => (
  <svg 
    className={`flex-shrink-0 transition-colors duration-300 ${active ? 'text-emerald-400' : 'text-slate-500'}`} 
    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="3" x2="9" y2="21"></line>
  </svg>
);

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { tab } = useParams();
  const activeTab = tab || 'overview';
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Removed direct Lucide references to prevent `.reduce` crash
  const menuSections = [
    {
      title: 'Command', items: [
        { id: 'overview', label: 'Dashboard' }, { id: 'analytics', label: 'Intelligence' },
        { id: 'notifications', label: 'Alerts' }, { id: 'logs', label: 'Telemetry' }
      ]
    },
    {
      title: 'Commerce', items: [
        { id: 'orders', label: 'Fulfillment' }, { id: 'wallet', label: 'Vault' },
        { id: 'tax', label: 'Taxation' }, { id: 'reports', label: 'Ledger' }
      ]
    },
    {
      title: 'Matrix', items: [
        { id: 'products', label: 'Registry' }, { id: 'categories', label: 'Taxonomy' },
        { id: 'fitment', label: 'Compatibility' }, { id: 'inventory', label: 'Stock' },
        { id: 'warehouse', label: 'Warehouse' }
      ]
    },
    {
      title: 'Growth', items: [
        { id: 'loyalty', label: 'Loyalty' }, { id: 'affiliate', label: 'Syndicate' },
        { id: 'coupons', label: 'Logic Gates' }, { id: 'flash-sales', label: 'Temporal Sales' },
        { id: 'reviews', label: 'Feedback' }
      ]
    },
    {
      title: 'Interface', items: [
        { id: 'cms', label: 'Frontend access' }, { id: 'banners', label: 'Visuals' },
        { id: 'seo', label: 'SEO Protocol' }, { id: 'email', label: 'SMTP Routes' }
      ]
    },
    {
      title: 'Relations', items: [
        { id: 'support', label: 'Helpdesk' }, { id: 'returns', label: 'Reversal' },
        { id: 'contact', label: 'Comms' }, { id: 'Genuine_test', label: 'Shield' }
      ]
    },
    {
      title: 'Core', items: [
        { id: 'mobile', label: 'Gateway' }, { id: 'security', label: 'WAF' },
        { id: 'database', label: 'Cluster' }, { id: 'api', label: 'Webhooks' },
        { id: 'shipping', label: 'Logistics' }, { id: 'settings', label: 'Variables' }
      ]
    }
  ];

  const ActiveComponent = TAB_COMPONENTS[activeTab] || DashboardOverview;

  return (
    <>
      <style>{`
        .sidebar-scroll::-webkit-scrollbar,
        .content-scroll::-webkit-scrollbar { width: 8px; }
        .sidebar-scroll::-webkit-scrollbar-track,
        .content-scroll::-webkit-scrollbar-track { background: #0a0b10; }
        .sidebar-scroll::-webkit-scrollbar-thumb,
        .content-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(16, 185, 129, 0.4);
          border-radius: 4px;
        }
      `}</style>

      <div className="flex h-screen bg-[#050810] overflow-hidden selection:bg-emerald-500/30">
        <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-500 sidebar-scroll flex-shrink-0 bg-slate-950/80 backdrop-blur-2xl border-r border-slate-800/50 flex flex-col overflow-y-auto relative z-20`}>
          <div className="flex items-center gap-4 px-5 py-6 border-b border-slate-800/50 sticky top-0 bg-slate-950/90 z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-slate-950 font-black text-sm tracking-tighter">AV</span>
            </div>
            <div className={`overflow-hidden transition-all duration-500 ${isSidebarOpen ? 'w-32 opacity-100' : 'w-0 opacity-0'}`}>
              <span className="text-white font-black tracking-[0.15em] text-sm block">Bhumivera</span>
              <span className="text-emerald-500 font-mono text-[9px] uppercase tracking-widest block">Root Access</span>
            </div>
          </div>

          <div className="flex-1 py-6 px-3 space-y-6">
            {menuSections.map((section, idx) => (
              <div key={idx} className="space-y-1 relative group">
                <div className={`overflow-hidden transition-all duration-500 ${isSidebarOpen ? 'h-6 opacity-100' : 'h-0 opacity-0'}`}>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-3">{section.title}</p>
                </div>
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(`/admin/dashboard/${item.id}`)}
                      className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-300 border border-transparent ${
                        isActive ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]' : 'hover:bg-slate-800/40'
                      } ${!isSidebarOpen && 'justify-center'}`}
                    >
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />}
                      <SafeIcon active={isActive} />
                      <div className={`overflow-hidden transition-all duration-500 whitespace-nowrap ${isSidebarOpen ? 'w-full ml-3 opacity-100' : 'w-0 ml-0 opacity-0'}`}>
                        <span className={`text-sm font-semibold tracking-wide flex justify-start ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {item.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-800/50 bg-slate-950/90 sticky bottom-0 z-10">
            <button
              onClick={() => { logout(); navigate('/admin-login'); }}
              className={`w-full flex items-center py-3 rounded-xl transition-all duration-300 hover:bg-rose-500/10 border border-transparent text-slate-500 hover:text-rose-400 ${!isSidebarOpen ? 'justify-center px-0' : 'px-4 gap-3'}`}
            >
              <svg className="flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <div className={`overflow-hidden transition-all duration-500 ${isSidebarOpen ? 'w-full ml-3 opacity-100' : 'w-0 ml-0 opacity-0'}`}>
                <span className="text-sm font-bold flex justify-start tracking-wide">Disconnect</span>
              </div>
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-800/50 bg-slate-950/40 backdrop-blur-xl relative z-10">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-400 transition-all shadow-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
              <div className="flex items-center gap-3">
                <h1 className="text-xl text-white font-black uppercase tracking-widest">{activeTab.replace(/-/g, ' ')}</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400 uppercase border border-slate-700">Module</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-800/80">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-white uppercase tracking-wider">{user?.name || 'SYSADMIN'}</p>
                <p className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Clearance: Level 0</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-white font-black text-sm">
                {user?.name?.[0] || 'A'}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6 relative z-10 content-scroll">
            <ErrorBoundary key={activeTab}>
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    <span className="text-emerald-500 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Initializing Subroutine...</span>
                  </div>
                </div>
              }>
                <ActiveComponent key={activeTab} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </>
  );
}
