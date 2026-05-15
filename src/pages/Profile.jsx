import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  users as usersApi, 
  orders as ordersApi, 
  wishlist as wishlistApi, 
  contact as contactApi 
} from '../services/api';
import { 
  User, Package, Heart, Shield, LifeBuoy, LogOut, 
  Key, Smartphone, AlertTriangle, CheckCircle2, 
  Trash2, Clock, ShoppingBag, Search, Filter, 
  TrendingUp, ShieldCheck, ChevronRight, Activity,
  Mail, Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Core Data State
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  
  // Security & Support State
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [secQuestion, setSecQuestion] = useState({ question: "What is your mother's maiden name?", answer: '' });
  const [twoFactor, setTwoFactor] = useState({ isEnabled: false, qrCode: '', secret: '', otp: '' });
  const [supportTicket, setSupportTicket] = useState({ subject: '', message: '' });

  // Advanced Frontend Features State
  const [orderFilter, setOrderFilter] = useState('all');
  const [wishlistSearch, setWishlistSearch] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard' || activeTab === 'security') {
        const res = await usersApi.getProfile();
        setProfileData({ name: res.data.name || '', phone: res.data.phone || '' });
        setTwoFactor(prev => ({ ...prev, isEnabled: res.data.two_factor_enabled === 1 }));
      }
      if (activeTab === 'dashboard' || activeTab === 'orders') {
        const res = await ordersApi.getMyOrders();
        setOrders(res.data);
      }
      if (activeTab === 'dashboard' || activeTab === 'wishlist') {
        const res = await wishlistApi.get();
        setWishlist(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // --- API HANDLERS (Untouched Logic) ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await usersApi.updateProfile(profileData);
      showMessage('success', 'Profile identity synchronized successfully.');
    } catch (err) { showMessage('error', 'Failed to synchronize profile.'); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await usersApi.changePassword({ currentPassword: passwords.current, newPassword: passwords.new });
      showMessage('success', 'Security key rotated successfully.');
      setPasswords({ current: '', new: '' });
    } catch (err) { showMessage('error', err.response?.data?.message || 'Key rotation failed.'); }
  };

  const handleUpdateSecurityQuestion = async (e) => {
    e.preventDefault();
    try {
      await usersApi.updateSecurityQuestion({ question: secQuestion.question, answer: secQuestion.answer });
      showMessage('success', 'Recovery matrix updated.');
      setSecQuestion(prev => ({ ...prev, answer: '' }));
    } catch (err) { showMessage('error', 'Failed to update recovery matrix.'); }
  };

  const setup2FA = async () => {
    try {
      const res = await usersApi.generate2FA();
      setTwoFactor(prev => ({ ...prev, qrCode: res.data.qrCode, secret: res.data.secret }));
    } catch (err) { showMessage('error', 'Authentication generation failed.'); }
  };

  const verifyAndEnable2FA = async () => {
    try {
      await usersApi.verifyAndEnable2FA({ token: twoFactor.otp, secret: twoFactor.secret });
      showMessage('success', 'MFA Protocol locked and enabled.');
      setTwoFactor({ isEnabled: true, qrCode: '', secret: '', otp: '' });
    } catch (err) { showMessage('error', 'Invalid token synchronization.'); }
  };

  const disable2FA = async () => {
    if (!window.confirm("WARNING: Disabling MFA significantly reduces account security. Proceed?")) return;
    try {
      await usersApi.disable2FA();
      showMessage('success', 'MFA Protocol disabled.');
      setTwoFactor({ isEnabled: false, qrCode: '', secret: '', otp: '' });
    } catch (err) { showMessage('error', 'Failed to disable MFA.'); }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to abort this requisition?")) return;
    try {
      await ordersApi.updateStatus(orderId, 'cancelled');
      showMessage('success', 'Requisition aborted successfully.');
      fetchDashboardData();
    } catch (err) { showMessage('error', 'Abort failed. Requisition may already be en route.'); }
  };

  const removeFromWishlist = async (id) => {
    try {
      await wishlistApi.remove(id);
      fetchDashboardData();
    } catch (err) { showMessage('error', 'Failed to remove asset.'); }
  };

  const submitSupportTicket = async (e) => {
    e.preventDefault();
    try {
      await contactApi.submit({ name: profileData.name, email: user?.email, subject: supportTicket.subject, message: supportTicket.message });
      showMessage('success', 'Transmission sent. Our team will contact you shortly.');
      setSupportTicket({ subject: '', message: '' });
    } catch (err) { showMessage('error', 'Transmission failed.'); }
  };

  // --- ADVANCED FRONTEND CALCULATIONS ---
  const filteredOrders = orders.filter(o => orderFilter === 'all' ? true : o.status === orderFilter);
  const filteredWishlist = wishlist.filter(item => item.name.toLowerCase().includes(wishlistSearch.toLowerCase()));
  
  const calculateSecurityScore = () => {
    let score = 25; // Base score
    if (profileData.phone) score += 25;
    if (twoFactor.isEnabled) score += 50;
    return score;
  };

  const securityScore = calculateSecurityScore();

  // --- UI COMPONENTS ---
  const TabButton = ({ icon, label, id, badge }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl transition-all duration-300 font-medium text-sm group
      ${activeTab === id 
        ? 'bg-gradient-to-r from-emerald-500/20 to-transparent border-l-2 border-emerald-500 text-emerald-400' 
        : 'text-slate-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
    >
      <div className="flex items-center gap-3">
        <span className={`${activeTab === id ? 'text-emerald-400' : 'text-slate-500 group-hover:text-emerald-500 transition-colors'}`}>
          {icon}
        </span>
        {label}
      </div>
      {badge !== undefined && (
        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${activeTab === id ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-300'}`}>
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-16 px-4 sm:px-6 font-sans selection:bg-emerald-500/30">
      
      {/* Background Glow Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500 tracking-tight">
              Command Center
            </h1>
            <p className="text-slate-400 mt-2 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500"/> Authenticated as {user?.email}
            </p>
          </div>
          {message.text && (
            <div className={`animate-fade-in-down px-5 py-3 rounded-xl flex items-center gap-3 border backdrop-blur-md ${
              message.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              {message.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
              <span className="text-sm font-semibold">{message.text}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Premium Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-xl sticky top-28 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              
              <div className="flex flex-col items-center mb-8 relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center mb-4 shadow-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-emerald-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <User size={40} className="text-emerald-500 relative z-10" />
                </div>
                <h3 className="text-white font-bold text-lg tracking-wide">{profileData.name || 'Operative'}</h3>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold mt-2 uppercase tracking-wider">
                  {user?.role || 'Customer'}
                </span>
              </div>
              
              <div className="space-y-1">
                <TabButton icon={<Activity size={18} />} label="Overview" id="dashboard" />
                <TabButton icon={<Package size={18} />} label="Requisitions" id="orders" badge={orders.length} />
                <TabButton icon={<Heart size={18} />} label="Saved Assets" id="wishlist" badge={wishlist.length} />
                <TabButton icon={<Shield size={18} />} label="Security Matrix" id="security" />
                <TabButton icon={<LifeBuoy size={18} />} label="Comms & Support" id="support" />
              </div>
              
              <div className="pt-6 mt-6 border-t border-white/10">
                <button onClick={logout} className="w-full flex items-center justify-center gap-3 px-4 py-3 text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/20 rounded-xl transition-all font-bold text-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <LogOut size={18} /> Terminate Session
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-h-[700px]">
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-2xl h-full relative overflow-hidden">
              
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-wide">System Overview</h2>
                      <p className="text-slate-400 text-sm mt-1">Real-time telemetry for your account.</p>
                    </div>
                  </div>

                  {/* Premium Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-gradient-to-br from-slate-900 to-[#0a0a0a] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                      <Package className="text-emerald-500 mb-4" size={28} />
                      <h3 className="text-4xl font-black text-white">{orders?.length || 0}</h3>
                      <p className="text-sm text-slate-400 font-medium tracking-wide uppercase mt-1">Active Orders</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-slate-900 to-[#0a0a0a] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-red-500/30 transition-colors">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all"></div>
                      <Heart className="text-red-500 mb-4" size={28} />
                      <h3 className="text-4xl font-black text-white">{wishlist?.length || 0}</h3>
                      <p className="text-sm text-slate-400 font-medium tracking-wide uppercase mt-1">Saved Items</p>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-[#0a0a0a] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                      <Shield className={securityScore === 100 ? "text-emerald-500 mb-4" : "text-amber-500 mb-4"} size={28} />
                      <div className="flex items-end gap-2">
                        <h3 className="text-4xl font-black text-white">{securityScore}%</h3>
                      </div>
                      <p className="text-sm text-slate-400 font-medium tracking-wide uppercase mt-1">Security Rating</p>
                      {/* Mini Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 ${securityScore === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${securityScore}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <form onSubmit={handleUpdateProfile} className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-500/10 rounded-lg"><User className="text-blue-400" size={20}/></div>
                      <h3 className="text-xl font-bold text-white">Identity Configuration</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Designation / Name</label>
                        <div className="relative">
                          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full bg-[#0a0a0a] border border-slate-800 text-white text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="Enter full name" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Comms / Phone</label>
                        <div className="relative">
                          <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-[#0a0a0a] border border-slate-800 text-white text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="+1 (555) 000-0000" />
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 flex justify-end">
                      <button type="submit" disabled={loading} className="bg-white text-black px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-2">
                        Sync Data <ChevronRight size={18} />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-wide">Requisition Logs</h2>
                      <p className="text-slate-400 text-sm mt-1">Track and manage your asset acquisitions.</p>
                    </div>
                    
                    {/* Advanced Filtering UI */}
                    <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/5 backdrop-blur-md">
                      {['all', 'pending', 'delivered', 'cancelled'].map(status => (
                        <button 
                          key={status}
                          onClick={() => setOrderFilter(status)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${orderFilter === status ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 rounded-2xl border border-white/5 border-dashed">
                      <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                        <Search className="text-slate-600" size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-white">No Requisitions Found</h3>
                      <p className="text-slate-500 text-sm max-w-sm text-center mt-2">Your query returned zero results. Adjust your filters or acquire new assets.</p>
                      <button onClick={() => navigate('/shop')} className="mt-6 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500 hover:text-black px-6 py-2.5 rounded-xl font-bold transition-all">Browse Catalog</button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map(order => (
                        <div key={order.id} className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-6 hover:border-white/10 transition-colors group">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl mt-1 ${
                              order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500' : 
                              order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                            }`}>
                              <Package size={24} />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-white font-black text-lg">ORD-{order.id.toString().padStart(5, '0')}</span>
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                  order.status === 'delivered' ? 'bg-emerald-500 text-black' : 
                                  order.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-blue-500 text-black'
                                }`}>{order.status}</span>
                              </div>
                              <p className="text-sm text-slate-400 flex items-center gap-2 mb-2"><Clock size={14}/> Initiated {new Date(order.created_at).toLocaleDateString()}</p>
                              <p className="text-xl text-white font-bold tracking-tight">${parseFloat(order.total).toFixed(2)}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-3 md:border-l md:border-slate-800 md:pl-6">
                            {order.status === 'pending' && (
                              <button onClick={() => cancelOrder(order.id)} className="px-5 py-2.5 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-sm font-bold transition-all">
                                Abort
                              </button>
                            )}
                            <button className="px-5 py-2.5 bg-white text-black hover:bg-slate-200 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                              Details <ChevronRight size={16}/>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-wide">Saved Assets</h2>
                      <p className="text-slate-400 text-sm mt-1">Inventory reserved for future acquisition.</p>
                    </div>
                    {wishlist.length > 0 && (
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                          type="text" 
                          placeholder="Search wishlist..." 
                          value={wishlistSearch}
                          onChange={(e) => setWishlistSearch(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    )}
                  </div>

                  {filteredWishlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 rounded-2xl border border-white/5 border-dashed">
                      <Heart className="text-slate-600 mb-4" size={48} />
                      <h3 className="text-lg font-bold text-white">Registry Empty</h3>
                      <p className="text-slate-500 text-sm max-w-sm text-center mt-2">No assets currently match your parameters.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredWishlist.map(item => (
                        <div key={item.product_id} className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 flex flex-col relative group overflow-hidden">
                          <button onClick={() => removeFromWishlist(item.product_id)} className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-full text-slate-400 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 border border-white/10 hover:border-red-500/30">
                            <Trash2 size={16} />
                          </button>
                          
                          <div className="w-full h-48 bg-white/5 rounded-xl mb-4 p-2 relative overflow-hidden flex items-center justify-center">
                            <img src={item.image || '/placeholder.jpg'} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-screen group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          
                          <h4 className="text-white text-sm font-bold line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">{item.name}</h4>
                          
                          <div className="mt-auto pt-4 flex justify-between items-end">
                            <div>
                               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Market Value</p>
                               <span className="text-white font-black text-lg">${item.discount_price || item.price}</span>
                            </div>
                            <button onClick={() => navigate(`/product/${item.product_id}`)} className="bg-emerald-500 text-black px-4 py-2 rounded-xl font-bold text-xs hover:bg-emerald-400 transition-colors">
                              Acquire
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-8 animate-fade-in max-w-3xl">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">Security Matrix</h2>
                    <p className="text-slate-400 text-sm mt-1">Configure your cryptographic and access protocols.</p>
                  </div>

                  {/* 2FA Premium Panel */}
                  <div className="bg-gradient-to-br from-slate-900 to-[#0a0a0a] p-8 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
                    
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                          <Smartphone size={24} className={twoFactor.isEnabled ? "text-emerald-500" : "text-amber-500"}/> 
                          Multi-Factor Authentication
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">Requires an external authenticator token for node access.</p>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${twoFactor.isEnabled ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                        {twoFactor.isEnabled ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      {twoFactor.isEnabled ? (
                        <div className="flex flex-col sm:flex-row items-center justify-between bg-[#050505] border border-slate-800 p-5 rounded-xl gap-4">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                               <ShieldCheck className="text-emerald-500" size={24} />
                            </div>
                            <div>
                              <p className="text-white font-bold text-sm">Protocol Enforced</p>
                              <p className="text-slate-500 text-xs">Your node is cryptographically secured.</p>
                            </div>
                          </div>
                          <button onClick={disable2FA} className="w-full sm:w-auto text-xs bg-transparent border border-red-500/30 text-red-400 px-6 py-2.5 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all">Deactivate</button>
                        </div>
                      ) : (
                        <>
                          {!twoFactor.qrCode ? (
                            <button onClick={setup2FA} className="bg-emerald-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-emerald-400 text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">Initialize Protocol</button>
                          ) : (
                            <div className="bg-[#050505] p-6 border border-slate-800 rounded-xl">
                              <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="flex-1 space-y-4">
                                  <div className="space-y-1">
                                    <p className="text-xs text-emerald-500 font-bold uppercase">Step 1</p>
                                    <p className="text-sm text-slate-300">Scan the visual matrix utilizing Authy or Google Authenticator.</p>
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-xs text-emerald-500 font-bold uppercase">Step 2</p>
                                    <p className="text-sm text-slate-300">Input the synchronized 6-digit cryptographic token.</p>
                                    <div className="flex gap-3 pt-2">
                                      <input type="text" maxLength="6" placeholder="000000" value={twoFactor.otp} onChange={e => setTwoFactor({...twoFactor, otp: e.target.value})} className="w-40 bg-slate-900 border border-slate-700 text-white text-center text-2xl tracking-[0.25em] font-black rounded-xl px-2 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                                      <button onClick={verifyAndEnable2FA} className="flex-1 bg-emerald-500 text-black rounded-xl font-bold hover:bg-emerald-400 transition-colors">Verify</button>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded-2xl">
                                  <img src={twoFactor.qrCode} alt="QR Matrix" className="w-40 h-40" />
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Grid for Password & Recovery */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Password Change */}
                    <form onSubmit={handleChangePassword} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 space-y-5">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2"><Key size={20} className="text-blue-500"/> Key Rotation</h3>
                      <div className="space-y-4">
                        <input type="password" required placeholder="Current Key" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="w-full bg-[#0a0a0a] border border-slate-800 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" />
                        <input type="password" required placeholder="New Key" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full bg-[#0a0a0a] border border-slate-800 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" />
                      </div>
                      <button type="submit" className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-slate-200 text-sm transition-colors">Apply Rotation</button>
                    </form>

                    {/* Security Question */}
                    <form onSubmit={handleUpdateSecurityQuestion} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 space-y-5">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2"><Shield size={20} className="text-purple-500"/> Recovery Backup</h3>
                      <div className="space-y-4">
                        <input type="text" disabled value="What is your mother's maiden name?" className="w-full bg-slate-900/50 border border-slate-800/50 text-slate-500 text-sm rounded-xl px-4 py-3 cursor-not-allowed" />
                        <input type="password" required placeholder="Secret Response" value={secQuestion.answer} onChange={e => setSecQuestion({...secQuestion, answer: e.target.value})} className="w-full bg-[#0a0a0a] border border-slate-800 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" />
                      </div>
                      <button type="submit" className="w-full border border-purple-500/30 text-purple-400 hover:bg-purple-500 hover:text-white py-3 rounded-xl font-bold text-sm transition-all">Store Backup</button>
                    </form>
                  </div>
                </div>
              )}

              {/* Support Tab */}
              {activeTab === 'support' && (
                <div className="space-y-8 animate-fade-in max-w-2xl">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">Comms Line</h2>
                    <p className="text-slate-400 text-sm mt-1">Direct encrypted transmission to Bhumivera Support Command.</p>
                  </div>
                  
                  <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5">
                    <form onSubmit={submitSupportTicket} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transmission Subject</label>
                        <div className="relative">
                          <AlertTriangle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input type="text" required placeholder="e.g. Anomaly in Requisition #1234" value={supportTicket.subject} onChange={e => setSupportTicket({...supportTicket, subject: e.target.value})} className="w-full bg-[#0a0a0a] border border-slate-800 text-white text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-emerald-500 transition-all" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message Payload</label>
                        <div className="relative">
                          <Mail size={18} className="absolute left-4 top-4 text-slate-500" />
                          <textarea required rows="6" placeholder="Provide detailed coordinates and parameters of your issue..." value={supportTicket.message} onChange={e => setSupportTicket({...supportTicket, message: e.target.value})} className="w-full bg-[#0a0a0a] border border-slate-800 text-white text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-emerald-500 resize-none transition-all"></textarea>
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-emerald-500 text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        Initialize Transmission
                      </button>
                    </form>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-widest mt-8">
                    <ShieldCheck size={14} /> End-to-End Encrypted Comms
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
