import React, { useState, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogOut, LayoutDashboard, Package, Grid, Users, Settings,
  ShoppingBag, Menu, X, ShieldCheck, RefreshCw, Tag,
  Archive, Star, Activity, Mail, Terminal, Bell, Search,
  Zap, Gift, Share2, Headphones, BarChart3, Wrench
} from 'lucide-react';

import DashboardOverview from './admin/DashboardOverview';
import ProductManagement from './admin/ProductManagement';
import CategoryManagement from './admin/CategoryManagement';
import OrderManagement from './admin/OrderManagement';
import UserManagement from './admin/UserManagement';
import EWarrantyManagement from './admin/EWarrantyManagement';
import AnalyticsManagement from './admin/AnalyticsManagement';
import InventoryManagement from './admin/InventoryManagement';
import CouponManagement from './admin/CouponManagement';
import ReviewManagement from './admin/ReviewManagement';
import BannerManagement from './admin/BannerManagement';
import ContactManagement from './admin/ContactManagement';
import ReturnManagement from './admin/ReturnManagement';
import AdminSettings from './admin/AdminSettings';
import SupportManagement from './admin/SupportManagement';
import FlashSalesManagement from './admin/FlashSalesManagement';
import LoyaltyManagement from './admin/LoyaltyManagement';
import AffiliateManagement from './admin/AffiliateManagement';

const TAB_COMPONENTS = {
  overview: DashboardOverview,
  products: ProductManagement,
  categories: CategoryManagement,
  inventory: InventoryManagement,
  orders: OrderManagement,
  returns: ReturnManagement,
  'flash-sales': FlashSalesManagement,
  coupons: CouponManagement,
  users: UserManagement,
  support: SupportManagement,
  reviews: ReviewManagement,
  loyalty: LoyaltyManagement,
  affiliate: AffiliateManagement,
  ewarranty: EWarrantyManagement,
  analytics: AnalyticsManagement,
  banners: BannerManagement,
  contact: ContactManagement,
  settings: AdminSettings,
  // Placeholders for the upcoming 50-feature expansion
  fitment: () => <div className="p-8 text-emerald-500 font-mono">Fitment Matrix Module Offline</div>,
  errors: () => <div className="p-8 text-emerald-500 font-mono">CORS/MIME Log Module Offline</div>,
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { tab } = useParams();
  const activeTab = tab || 'overview';
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menuSections = [
    {
      title: 'Command Center',
      items: [
        { id: 'overview', label: 'Telemetry Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Financial Data Science', icon: BarChart3 },
      ]
    },
    {
      title: 'Inventory & Catalog',
      items: [
        { id: 'products', label: 'Hardware Registry', icon: Package },
        { id: 'inventory', label: 'Stock Levels', icon: Archive },
        { id: 'categories', label: 'Taxonomy', icon: Grid },
        { id: 'fitment', label: 'Vehicle Fitment Matrix', icon: Wrench },
      ]
    },
    {
      title: 'Global Logistics',
      items: [
        { id: 'orders', label: 'Fulfillment Pipeline', icon: ShoppingBag },
        { id: 'returns', label: 'RMA / Exchanges', icon: RefreshCw },
        { id: 'ewarranty', label: 'E-Warranty Vault', icon: ShieldCheck },
      ]
    },
    {
      title: 'Marketing Engine',
      items: [
        { id: 'flash-sales', label: 'Flash Scheduler', icon: Zap },
        { id: 'coupons', label: 'Incentive Logic', icon: Tag },
        { id: 'affiliate', label: 'Social Affiliates', icon: Share2 },
        { id: 'banners', label: 'Dynamic Banners', icon: Activity },
      ]
    },
    {
      title: 'Client Relations',
      items: [
        { id: 'users', label: 'Client Accounts', icon: Users },
        { id: 'support', label: 'Support Tickets', icon: Headphones },
        { id: 'reviews', label: 'Sentiments / Reviews', icon: Star },
        { id: 'loyalty', label: 'Loyalty Config', icon: Gift },
        { id: 'contact', label: 'Contact Inbox', icon: Mail },
      ]
    },
    {
      title: 'System Operations',
      items: [
        { id: 'errors', label: 'Deployment Logs', icon: Terminal },
        { id: 'settings', label: 'Core Configuration', icon: Settings },
      ]
    }
  ];

  const ActiveComponent = TAB_COMPONENTS[activeTab] || DashboardOverview;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 overflow-hidden font-sans">
      <aside className={`${
        isSidebarOpen ? 'w-72' : 'w-16'
      } bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out z-30`}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800 flex-shrink-0">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-slate-900 text-sm flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]">A</div>
          {isSidebarOpen && <span className="text-sm font-black text-white uppercase tracking-widest">Anritvox Admin</span>}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-6">
              {isSidebarOpen && (
                <div className="px-5 py-2 text-[10px] font-black text-emerald-500/70 uppercase tracking-[0.2em]">
                  {section.title}
                </div>
              )}
              {section.items.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => navigate(`/admin/dashboard/${id}`)}
                    className={`w-full flex items-center gap-3 px-5 py-2.5 transition-all border-r-2 ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500'
                        : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    {isSidebarOpen && <span className="text-sm font-semibold truncate">{label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 flex-shrink-0 bg-slate-900">
          <button
            onClick={() => { logout(); navigate('/admin/login'); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {isSidebarOpen && <span className="text-sm font-bold">Terminate Session</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-lg text-emerald-500 transition-all shadow-sm"
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="hidden md:flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 focus-within:border-emerald-500/50 transition-colors">
              <Search size={16} className="text-slate-500" />
              <input placeholder="Query database..." className="bg-transparent outline-none text-sm w-64 text-slate-300 placeholder-slate-600 font-mono" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer hover:text-emerald-400 transition-colors">
              <Bell size={18} className="text-slate-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-black text-white tracking-wide">{user?.name || 'SYSADMIN'}</div>
                <div className="text-[10px] text-emerald-500 tracking-widest uppercase">Root Access</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-emerald-400 shadow-inner">
                {user?.name?.[0]?.toUpperCase() || 'S'}
              </div>
            </div>
          </div>
        </header>

        <div className="px-6 py-2 bg-slate-900/50 border-b border-slate-800/50 flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest shadow-sm z-10">
          <Terminal size={12} className="text-emerald-500" /> / anritvox / sys / {activeTab}
        </div>

        <section className="flex-1 overflow-y-auto bg-slate-950 relative">
          <Suspense fallback={
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/50 backdrop-blur-sm z-50">
              <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
              <div className="text-emerald-500 font-mono text-xs uppercase tracking-widest animate-pulse">Compiling Module...</div>
            </div>
          }>
            <ActiveComponent />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
