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
  Trash2, Clock, Search, ChevronRight, LayoutDashboard,
  Mail, Phone, Settings
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

  // Filter State
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
        // Fallback-friendly extraction
        const userData = res.data?.data || res.data?.user || res.data || {};
        const safeName = userData.name || userData.first_name || '';
        const safePhone = userData.phone || '';
        setProfileData({ name: safeName, phone: safePhone });
        setTwoFactor(prev => ({ ...prev, isEnabled: userData.two_factor_enabled === 1 }));
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await usersApi.updateProfile(profileData);
      showMessage('success', 'Profile updated successfully.');
      // CRITICAL FIX: Refresh dashboard data so local UI aligns with database state.
      await fetchDashboardData(); 
    } catch (err) { 
      showMessage('error', 'Failed to update profile.'); 
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await usersApi.changePassword({ currentPassword: passwords.current, newPassword: passwords.new });
      showMessage('success', 'Password changed successfully.');
      setPasswords({ current: '', new: '' });
    } catch (err) { showMessage('error', err.response?.data?.message || 'Update failed.'); }
  };

  const handleUpdateSecurityQuestion = async (e) => {
    e.preventDefault();
    try {
      await usersApi.updateSecurityQuestion({ question: secQuestion.question, answer: secQuestion.answer });
      showMessage('success', 'Security question updated.');
      setSecQuestion(prev => ({ ...prev, answer: '' }));
    } catch (err) { showMessage('error', 'Failed to update security question.'); }
  };

  const setup2FA = async () => {
    try {
      const res = await usersApi.generate2FA();
      setTwoFactor(prev => ({ ...prev, qrCode: res.data.qrCode, secret: res.data.secret }));
    } catch (err) { showMessage('error', 'Could not generate setup code.'); }
  };

  const verifyAndEnable2FA = async () => {
    try {
      await usersApi.verifyAndEnable2FA({ token: twoFactor.otp, secret: twoFactor.secret });
      showMessage('success', 'Two-factor authentication enabled.');
      setTwoFactor({ isEnabled: true, qrCode: '', secret: '', otp: '' });
    } catch (err) { showMessage('error', 'Invalid verification code.'); }
  };

  const disable2FA = async () => {
    if (!window.confirm("Are you sure? This makes your account less secure.")) return;
    try {
      await usersApi.disable2FA();
      showMessage('success', 'Two-factor authentication disabled.');
      setTwoFactor({ isEnabled: false, qrCode: '', secret: '', otp: '' });
    } catch (err) { showMessage('error', 'Failed to disable.'); }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await ordersApi.updateStatus(orderId, 'cancelled');
      showMessage('success', 'Order cancelled.');
      fetchDashboardData();
    } catch (err) { showMessage('error', 'Cancellation failed.'); }
  };

  const removeFromWishlist = async (id) => {
    try {
      await wishlistApi.remove(id);
      fetchDashboardData();
    } catch (err) { showMessage('error', 'Failed to remove item.'); }
  };

  const submitSupportTicket = async (e) => {
    e.preventDefault();
    try {
      await contactApi.submit({ name: profileData.name, email: user?.email, subject: supportTicket.subject, message: supportTicket.message });
      showMessage('success', 'Message sent. We will get back to you soon.');
      setSupportTicket({ subject: '', message: '' });
    } catch (err) { showMessage('error', 'Message failed to send.'); }
  };

  const filteredOrders = orders.filter(o => orderFilter === 'all' ? true : o.status === orderFilter);
  const filteredWishlist = wishlist.filter(item => item.name.toLowerCase().includes(wishlistSearch.toLowerCase()));

  const TabButton = ({ icon, label, id, badge }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium
      ${activeTab === id 
        ? 'bg-[#E8E0D5] text-[#1A1A1A]' 
        : 'text-stone-500 hover:bg-[#F5F1EB] hover:text-[#1A1A1A]'}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>
      {badge > 0 && (
        <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-200 text-stone-700 font-bold">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 px-4 text-[#1A1A1A]">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-200 pb-8">
          <div>
            <h1 className="text-3xl font-serif text-[#2C3E2D]">My Account</h1>
            <p className="text-stone-500 text-sm mt-1">Manage your profile, orders, and security settings.</p>
          </div>
          {message.text && (
            <div className={`px-4 py-2 rounded-md flex items-center gap-2 border text-sm animate-fade-in ${
              message.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-green-50 border-green-100 text-green-700'
            }`}>
              {message.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
              {message.text}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="space-y-1">
              <TabButton icon={<LayoutDashboard size={18} />} label="Overview" id="dashboard" />
              <TabButton icon={<Package size={18} />} label="My Orders" id="orders" badge={orders.length} />
              <TabButton icon={<Heart size={18} />} label="Wishlist" id="wishlist" badge={wishlist.length} />
              <TabButton icon={<Settings size={18} />} label="Security Settings" id="security" />
              <TabButton icon={<LifeBuoy size={18} />} label="Help & Support" id="support" />
              
              <div className="mt-8 pt-6 border-t border-stone-200">
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-red-600 transition-colors text-sm font-medium">
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            
            {/* Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <div className="space-y-10 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm">
                    <Package className="text-[#8B9D83] mb-3" size={24} />
                    <h3 className="text-2xl font-bold">{orders.length}</h3>
                    <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mt-1">Total Orders</p>
                  </div>
                  <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm">
                    <Heart className="text-[#D4A373] mb-3" size={24} />
                    <h3 className="text-2xl font-bold">{wishlist.length}</h3>
                    <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mt-1">Saved Items</p>
                  </div>
                  <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm">
                    <Shield className="text-[#8B9D83] mb-3" size={24} />
                    <h3 className="text-2xl font-bold">{twoFactor.isEnabled ? 'High' : 'Basic'}</h3>
                    <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mt-1">Account Safety</p>
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
                  <h3 className="text-lg font-serif mb-6 flex items-center gap-2">
                    <User size={20} className="text-[#8B9D83]" /> Profile Details
                  </h3>
                  <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-500 uppercase">Full Name</label>
                      <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full bg-[#F9F7F5] border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#8B9D83]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-500 uppercase">Phone Number</label>
                      <input type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-[#F9F7F5] border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#8B9D83]" />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <button type="submit" className="bg-[#2C3E2D] text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-[#3D553F] transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-serif">Order History</h2>
                  <select onChange={(e) => setOrderFilter(e.target.value)} className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs font-bold">
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-xl border border-stone-200">
                    <p className="text-stone-400 italic">No orders found.</p>
                  </div>
                ) : (
                  filteredOrders.map(order => (
                    <div key={order.id} className="bg-white border border-stone-200 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold">#ORD-{order.id}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                            order.status === 'cancelled' ? 'bg-stone-100 text-stone-500' : 'bg-stone-200 text-stone-700'
                          }`}>{order.status}</span>
                        </div>
                        <p className="text-xs text-stone-400 flex items-center gap-1"><Clock size={12}/> {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                        <span className="font-bold text-[#2C3E2D]">${parseFloat(order.total).toFixed(2)}</span>
                        <div className="flex gap-2">
                          {order.status === 'pending' && (
                            <button onClick={() => cancelOrder(order.id)} className="text-xs font-bold text-red-500 hover:underline">Cancel</button>
                          )}
                          <button className="bg-stone-100 px-4 py-2 rounded-lg text-xs font-bold hover:bg-stone-200 transition-colors">View Details</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8 animate-fade-in">
                <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-serif flex items-center gap-2">
                        <Smartphone size={20} className="text-[#8B9D83]" /> 2-Step Verification
                      </h3>
                      <p className="text-xs text-stone-500 mt-1">Add an extra layer of security to your account.</p>
                    </div>
                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${twoFactor.isEnabled ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-400'}`}>
                      {twoFactor.isEnabled ? 'Active' : 'Not Setup'}
                    </span>
                  </div>

                  {twoFactor.isEnabled ? (
                    <button onClick={disable2FA} className="text-red-500 text-sm font-bold hover:underline">Disable 2-Step Verification</button>
                  ) : (
                    <div>
                      {!twoFactor.qrCode ? (
                        <button onClick={setup2FA} className="bg-[#2C3E2D] text-white px-6 py-3 rounded-lg text-sm font-bold">Start Setup</button>
                      ) : (
                        <div className="flex flex-col md:flex-row gap-8 items-center border-t border-stone-100 pt-6">
                          <div className="bg-white p-2 border border-stone-200 rounded-lg">
                            <img src={twoFactor.qrCode} alt="Setup QR" className="w-32 h-32" />
                          </div>
                          <div className="flex-1 space-y-4">
                            <p className="text-sm text-stone-600">Scan this code with your Authenticator app, then enter the 6-digit code below.</p>
                            <div className="flex gap-2">
                              <input type="text" maxLength="6" placeholder="000000" value={twoFactor.otp} onChange={e => setTwoFactor({...twoFactor, otp: e.target.value})} className="w-32 bg-stone-50 border border-stone-200 rounded-lg px-4 py-2 text-center font-bold tracking-widest" />
                              <button onClick={verifyAndEnable2FA} className="bg-[#2C3E2D] text-white px-6 py-2 rounded-lg text-sm font-bold">Verify</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <form onSubmit={handleChangePassword} className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm space-y-4">
                    <h3 className="text-md font-serif flex items-center gap-2"><Key size={18} /> Change Password</h3>
                    <input type="password" required placeholder="Current Password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none" />
                    <input type="password" required placeholder="New Password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none" />
                    <button type="submit" className="w-full bg-stone-100 py-2 rounded-lg text-xs font-bold hover:bg-stone-200">Update Password</button>
                  </form>

                  <form onSubmit={handleUpdateSecurityQuestion} className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm space-y-4">
                    <h3 className="text-md font-serif flex items-center gap-2"><Shield size={18} /> Recovery Question</h3>
                    <p className="text-[10px] text-stone-400 italic">Question: What is your mother's maiden name?</p>
                    <input type="password" required placeholder="Your Answer" value={secQuestion.answer} onChange={e => setSecQuestion({...secQuestion, answer: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none" />
                    <button type="submit" className="w-full bg-stone-100 py-2 rounded-lg text-xs font-bold hover:bg-stone-200">Update Security Question</button>
                  </form>
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-xl font-serif">Saved Items</h2>
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
                      <input type="text" placeholder="Search saved items..." value={wishlistSearch} onChange={(e) => setWishlistSearch(e.target.value)} className="bg-white border border-stone-200 rounded-full pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-[#8B9D83] w-48 md:w-64" />
                   </div>
                </div>

                {filteredWishlist.length === 0 ? (
                  <div className="text-center py-20 bg-stone-50 border border-dashed border-stone-200 rounded-xl">
                    <Heart className="mx-auto text-stone-200 mb-2" size={32} />
                    <p className="text-stone-400 italic">No items in your wishlist.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWishlist.map(item => (
                      <div key={item.product_id} className="bg-white border border-stone-200 rounded-xl p-4 relative group">
                        <button onClick={() => removeFromWishlist(item.product_id)} className="absolute top-2 right-2 text-stone-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                        <div className="aspect-square bg-stone-50 rounded-lg mb-4 flex items-center justify-center p-4">
                          <img src={item.image} alt={item.name} className="max-h-full object-contain mix-blend-multiply" />
                        </div>
                        <h4 className="text-sm font-medium line-clamp-2 min-h-[40px] mb-2">{item.name}</h4>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#2C3E2D]">${item.price}</span>
                          <button onClick={() => navigate(`/product/${item.product_id}`)} className="text-xs font-bold bg-[#E8E0D5] px-3 py-1.5 rounded-md hover:bg-[#DED2C4] transition-colors">View Product</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Support Tab */}
            {activeTab === 'support' && (
              <div className="animate-fade-in max-w-2xl">
                <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
                  <h2 className="text-xl font-serif mb-2">Help & Support</h2>
                  <p className="text-stone-500 text-sm mb-8">Have a question? Send us a message and our team will get back to you within 24 hours.</p>
                  
                  <form onSubmit={submitSupportTicket} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-500 uppercase">Subject</label>
                      <input type="text" required placeholder="What do you need help with?" value={supportTicket.subject} onChange={e => setSupportTicket({...supportTicket, subject: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#8B9D83]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-500 uppercase">Message</label>
                      <textarea required rows="5" placeholder="Detailed description of your issue..." value={supportTicket.message} onChange={e => setSupportTicket({...supportTicket, message: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#8B9D83] resize-none"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-[#2C3E2D] text-white py-4 rounded-lg text-sm font-bold hover:bg-[#3D553F] transition-colors">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
