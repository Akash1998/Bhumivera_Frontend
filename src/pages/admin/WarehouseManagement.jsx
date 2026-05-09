import React, { useState, useEffect } from 'react';
import { Store, ShieldPlus, Ban, Activity, Package, DollarSign, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function WarehouseManagement() {
  const [activeTab, setActiveTab] = useState('access'); // 'access' or 'sales'
  const [warehouseUsers, setWarehouseUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [salesSummary, setSalesSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form state for granting access
  const [selectedUserId, setSelectedUserId] = useState('');
  const [storeName, setStoreName] = useState('');

  const { showToast } = useToast() || {};

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, allUsersRes, salesRes] = await Promise.all([
        api.get('/warehouse/admin/users'),
        api.get('/warehouse/admin/all-users'),
        api.get('/warehouse/admin/sales-summary')
      ]);
      setWarehouseUsers(usersRes.data.users || []);
      setAllUsers(allUsersRes.data.users || []);
      setSalesSummary(salesRes.data.summary || []);
    } catch (err) {
      showToast?.('Failed to fetch warehouse matrix.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAccess = async (e) => {
    e.preventDefault();
    if (!selectedUserId || !storeName) return showToast?.('Select a user and provide a store name.', 'error');
    
    try {
      await api.post('/warehouse/admin/grant-access', { user_id: selectedUserId, store_name: storeName });
      showToast?.('Warehouse clearance granted.', 'success');
      setStoreName('');
      setSelectedUserId('');
      fetchData();
    } catch (err) {
      showToast?.('Failed to grant access.', 'error');
    }
  };

  const handleRevokeAccess = async (userId) => {
    if (!window.confirm('CRITICAL: Revoke warehouse operations for this distributor?')) return;
    try {
      await api.post('/warehouse/admin/revoke-access', { user_id: userId });
      showToast?.('Warehouse access revoked.', 'success');
      fetchData();
    } catch (err) {
      showToast?.('Revocation failed.', 'error');
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#020617] min-h-screen text-slate-300 font-sans animate-in fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-slate-800/80 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            Warehouse <span className="text-emerald-500">Command Center</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">
            Distributor Access & Global Sales Telemetry
          </p>
        </div>
        <button onClick={fetchData} className="p-3 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl hover:text-emerald-400 transition-all">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-4 border-b border-slate-800 pb-2">
        <button 
          onClick={() => setActiveTab('access')}
          className={`pb-2 px-4 font-black uppercase text-xs tracking-widest transition-all ${activeTab === 'access' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Access Control
        </button>
        <button 
          onClick={() => setActiveTab('sales')}
          className={`pb-2 px-4 font-black uppercase text-xs tracking-widest transition-all ${activeTab === 'sales' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Global Sales Analytics
        </button>
      </div>

      {/* ACCESS CONTROL TAB */}
      {activeTab === 'access' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grant Access Form */}
          <div className="lg:col-span-1 bg-slate-900/40 border border-slate-800/80 p-6 rounded-[2rem] h-fit">
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
              <ShieldPlus size={16} className="text-emerald-500"/> Grant Authorization
            </h3>
            <form onSubmit={handleGrantAccess} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Select Basic User</label>
                <select 
                  value={selectedUserId} 
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl py-3 px-4 text-white text-sm outline-none"
                >
                  <option value="">-- Select Identity --</option>
                  {allUsers.filter(u => u.has_access === 0).map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Assigned Store Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Anritvox North Hub" 
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl py-3 px-4 text-white text-sm outline-none"
                />
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-emerald-500 hover:text-slate-950 transition-all mt-4">
                Authorize Distributor
              </button>
            </form>
          </div>

          {/* Active Distributors Table */}
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/80 rounded-[2rem] overflow-hidden">
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800">
                  <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Distributor Node</th>
                  <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Store Entity</th>
                  <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Sales</th>
                  <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {warehouseUsers.filter(u => u.is_active === 1).map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/20">
                    <td className="p-5">
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5">{user.email}</p>
                    </td>
                    <td className="p-5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-emerald-400 font-bold">
                        <Store size={12}/> {user.store_name}
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="text-sm font-black text-cyan-400">{user.total_sales} Units</p>
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => handleRevokeAccess(user.user_id)}
                        className="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
                        title="Revoke Access"
                      >
                        <Ban size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SALES DASHBOARD TAB */}
      {activeTab === 'sales' && (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-[2rem] overflow-hidden">
          <div className="p-6 border-b border-slate-800/80 bg-slate-950 flex items-center justify-between">
             <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
              <Activity size={16} className="text-cyan-500"/> Itemized Movement Matrix
            </h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Product SKU</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Distributor Store</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Quantity Moved</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {salesSummary.map((item, index) => (
                <tr key={index} className="hover:bg-slate-800/20">
                  <td className="p-5">
                    <p className="text-sm font-bold text-white flex items-center gap-2"><Package size={14} className="text-slate-500"/> {item.product_name}</p>
                  </td>
                  <td className="p-5">
                    <p className="text-xs font-bold text-slate-400">{item.store_name}</p>
                  </td>
                  <td className="p-5">
                    <p className="text-sm font-black text-cyan-400">{item.total_qty}</p>
                  </td>
                  <td className="p-5">
                    <p className="text-sm font-black text-emerald-400 flex items-center">
                      ₹{parseFloat(item.total_revenue).toLocaleString()}
                    </p>
                  </td>
                </tr>
              ))}
              {salesSummary.length === 0 && (
                <tr><td colSpan="4" className="p-8 text-center text-slate-500 font-bold uppercase text-xs">No global sales data detected.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
