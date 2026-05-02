import React, { useState, Suspense, Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogOut, LayoutDashboard, Package, Grid, Users, Settings, ShoppingBag, Menu, X,
  ShieldCheck, RefreshCw, Tag, Archive, Star, Activity, Mail, Terminal, Bell, Search,
  Zap, Gift, Share2, Headphones, BarChart3, Wrench, Wallet, Smartphone,
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
import WalletManagement from './admin/WalletManagement';
import NotificationManagement from './admin/NotificationManagement';
import ShippingManagement from './admin/ShippingManagement';
import TaxManagement from './admin/TaxManagement';
import SystemLogs from './admin/SystemLogs';
import CMSManagement from './admin/CMSManagement';
import EmailTemplates from './admin/EmailTemplates';
import FitmentMatrix from './admin/FitmentMatrix';

// ErrorBoundary to prevent white screen on module crash
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[AdminDashboard ErrorBoundary]', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
          <AlertCircle size={48} className="text-rose-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Module Load Error</h2>
          <p className="text-slate-400 mb-4 max-w-md">{this.state.error?.message || 'A module failed to render.'}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition-all"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Minimal placeholder for truly unbuilt modules
const ComingSoon = ({ name }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
      <Settings size={28} className="text-emerald-400" />
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">{name}</h2>
    <p className="text-slate-400">This module is under active development and will be available soon.</p>
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
  wallet: WalletManagement,
  notifications: NotificationManagement,
  shipping: ShippingManagement,
  tax: TaxManagement,
  logs: SystemLogs,
  cms: CMSManagement,
  email: EmailTemplates,
  fitment: FitmentMatrix,
  mobile: () => <ComingSoon name="OTP Gateway" />,
  seo: () => <ComingSoon name="SEO / Search Optimization" />,
  database: () => <ComingSoon name="DB Cluster" />,
  api: () => <ComingSoon name="Webhooks / API Manager" />,
  security: () => <ComingSoon name="Security / WAF" />,
  backups: () => <ComingSoon name="Backup Manager" />,
  translations: () => <ComingSoon name="Translations" />,
  ads: () => <ComingSoon name="Ads Manager" />,
  reports: () => <ComingSoon name="Financial Reports" />,
  performance: () => <ComingSoon name="Performance Monitor" />,
  terminal: () => <ComingSoon name="Admin Terminal" />,
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
      title: 'Customer Care',
      items: [
        { id: 'support', label: 'Support Matrix', icon: Headphones },
        { id: 'returns', label: 'Returns & Refunds', icon: RefreshCw },
        { id: 'contact', label: 'Contact Inbox', icon: MessageSquare },
        { id: 'ewarranty', label: 'E-Warranty', icon: ShieldCheck },
      ]
    },
    {
      title: 'Infrastructure',
      items: [
        { id: 'mobile', label: 'OTP Gateway', icon: Smartphone },
        { id: 'security', label: 'Security/WAF', icon: Shield },
        { id: 'database', label: 'DB Cluster', icon: Database },
        { id: 'api', label: 'Webhooks/API', icon: Cpu },
        { id: 'shipping', label: 'Shipping Config', icon: Truck },
        { id: 'settings', label: 'Core Config', icon: Settings },
      ]
    }
  ];

  const ActiveComponent = TAB_COMPONENTS[activeTab] || DashboardOverview;

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-black font-black text-sm">AV</span>
          </div>
          {isSidebarOpen && <span className="text-white font-black tracking-wider text-sm">ANRITVOX</span>}
        </div>

        {/* Nav */}
        <div className="flex-1 py-4 px-2 space-y-1">
          {menuSections.map((section, idx) => (
            <div key={idx} className="mb-2">
              {isSidebarOpen && (
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 pb-1 pt-2">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/admin/dashboard/${item.id}`)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mb-0.5 ${
                    activeTab === item.id
                      ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon size={18} className="flex-shrink-0" />
                  {isSidebarOpen && <span className="text-sm">{item.label}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Logout */}
        <div className="p-2 border-t border-slate-800">
          <button
            onClick={() => { logout(); navigate('/admin/login'); }}
            className="w-full flex items-center gap-3 px-3 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {isSidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-all"
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h1 className="text-white font-bold capitalize">
              {activeTab.replace(/-/g, ' ')}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20">
              SYSTEM ONLINE
            </span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-black text-sm">
                {user?.name?.[0] || 'A'}
              </div>
              {isSidebarOpen && (
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-white">{user?.name || 'ADMIN'}</p>
                  <p className="text-xs text-slate-500">ROOT_ACCESS</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Module Content */}
        <div className="flex-1 overflow-auto bg-slate-950" style={{ minWidth: 0, minHeight: 0 }}>
          <ErrorBoundary key={activeTab}>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              <ActiveComponent key={activeTab} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
