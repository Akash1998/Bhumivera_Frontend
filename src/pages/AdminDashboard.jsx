import React, { useState, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, LayoutDashboard, Package, Grid, Users, Settings, ShoppingBag, Menu, X, 
  ShieldCheck, RefreshCw, Tag, Archive, Star, Activity, Mail, Terminal, Bell, 
  Search, Zap, Gift, Share2, Headphones, BarChart3, Wrench, Wallet, Smartphone, 
  Globe, Shield, Database, Cpu, HardDrive, Layers, Box, Truck, CreditCard, 
  FileText, MessageSquare, AlertCircle, TrendingUp, Clock, Monitor
} from 'lucide-react';

// Modules
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

const Placeholder = ({ name }) => (
  <div className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800 backdrop-blur-xl">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
        <Cpu size={24} />
      </div>
      <div>
        <h2 className="text-2xl font-black text-white">{name} Module</h2>
        <p className="text-slate-500 text-sm">System status: Initializing core logic...</p>
      </div>
    </div>
    <div className="space-y-4 font-mono text-xs text-slate-400">
      <p className="animate-pulse">Loading dependencies...</p>
     <p className="text-emerald-500/50">&gt; establishing secure connection to service.anritvox.com</p>
      <p className="text-emerald-500/50">&gt; fetching real-time telemetry data</p>
      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 w-1/3 animate-ping" />
      </div>
    </div>
  </div>
);

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
  wallet: () => <Placeholder name="Wallet Management" />,
  mobile: () => <Placeholder name="OTP & SMS Config" />,
  seo: () => <Placeholder name="SEO & Meta Engine" />,
  shipping: () => <Placeholder name="Shipping Zones" />,
  tax: () => <Placeholder name="Taxation Logic" />,
  notifications: () => <Placeholder name="Global Alerts" />,
  logs: () => <Placeholder name="System Logs" />,
  database: () => <Placeholder name="DB Maintenance" />,
  api: () => <Placeholder name="API Keys & Webhooks" />,
  security: () => <Placeholder name="Firewall & Security" />,
  backups: () => <Placeholder name="Snapshot Vault" />,
  cms: () => <Placeholder name="Page Builder" />,
  translations: () => <Placeholder name="i18n Localization" />,
  email: () => <Placeholder name="SMTP Templates" />,
  ads: () => <Placeholder name="Campaign Manager" />,
  reports: () => <Placeholder name="Export Engine" />,
  fitment: () => <Placeholder name="Vehicle Matrix" />,
  performance: () => <Placeholder name="Speed Optimization" />,
  terminal: () => <Placeholder name="Remote CLI" />,
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { tab } = useParams();
  const activeTab = tab || 'overview';
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menuSections = [
    {
      title: 'Control Center',
      items: [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Intelligence', icon: BarChart3 },
        { id: 'notifications', label: 'Global Alerts', icon: Bell },
        { id: 'logs', label: 'Real-time Logs', icon: Terminal },
      ]
    },
    {
      title: 'Sales & Finance',
      items: [
        { id: 'orders', label: 'Fulfillment', icon: ShoppingBag },
        { id: 'wallet', label: 'Wallet Vault', icon: Wallet },
        { id: 'tax', label: 'Tax Registry', icon: CreditCard },
        { id: 'reports', label: 'Financial Reports', icon: FileText },
      ]
    },
    {
      title: 'Catalog Engine',
      items: [
        { id: 'products', label: 'Inventory', icon: Package },
        { id: 'categories', label: 'Taxonomy', icon: Grid },
        { id: 'fitment', label: 'Vehicle Matrix', icon: Wrench },
        { id: 'inventory', label: 'Stock Audit', icon: Archive },
      ]
    },
    {
      title: 'Marketing & CRM',
      items: [
        { id: 'loyalty', label: 'Loyalty Points', icon: Gift },
        { id: 'affiliate', label: 'Social Partners', icon: Share2 },
        { id: 'coupons', label: 'Discount Logic', icon: Tag },
        { id: 'flash-sales', label: 'Flash Engine', icon: Zap },
        { id: 'reviews', label: 'User Feedback', icon: Star },
      ]
    },
    {
      title: 'Channels & UI',
      items: [
        { id: 'cms', label: 'Page Builder', icon: Monitor },
        { id: 'banners', label: 'Ad Graphics', icon: Activity },
        { id: 'seo', label: 'Search Optimization', icon: Search },
        { id: 'email', label: 'SMTP Templates', icon: Mail },
      ]
    },
    {
      title: 'Infrastructure',
      items: [
        { id: 'mobile', label: 'OTP Gateway', icon: Smartphone },
        { id: 'security', label: 'Security/WAF', icon: Shield },
        { id: 'database', label: 'DB Cluster', icon: Database },
        { id: 'api', label: 'Webhooks/API', icon: Cpu },
        { id: 'settings', label: 'Core Config', icon: Settings },
      ]
    }
  ];

  const ActiveComponent = TAB_COMPONENTS[activeTab] || DashboardOverview;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-50`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Cpu className="text-slate-950" size={20} />
          </div>
          {isSidebarOpen && <span className="text-white font-black tracking-tighter text-xl">ANRITVOX</span>}
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4">
          {menuSections.map((section, idx) => (
            <div key={idx} className="mb-6">
              {isSidebarOpen && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">{section.title}</p>}
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/admin/dashboard/${item.id}`)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all mb-1 ${
                    activeTab === item.id 
                    ? 'bg-emerald-500/10 text-emerald-400 font-bold' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  {isSidebarOpen && <span className="text-sm">{item.label}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => { logout(); navigate('/admin/login'); }} className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all">
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-bold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-950 relative">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-all">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="h-4 w-[1px] bg-slate-800 mx-2" />
            <h1 className="text-sm font-medium text-white flex items-center gap-2 capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 font-mono tracking-widest">SYSTEM ONLINE</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-none">{user?.name || 'ADMIN'}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">ROOT_ACCESS</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
                {user?.name?.[0] || 'A'}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <Suspense fallback={<div className="flex items-center justify-center h-full"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
            <ActiveComponent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
