import React, { useState, useEffect } from 'react';
import { Store, ShieldPlus, Ban, Activity, Package, RefreshCw, List, TrendingUp, MonitorSmartphone, XCircle } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function WarehouseManagement() {
  const [activeTab, setActiveTab] = useState('access'); // 'access', 'summary', 'transactions', 'trends'
  const [warehouseUsers, setWarehouseUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [salesSummary, setSalesSummary] = useState([]);
  const [liveTransactions, setLiveTransactions] = useState([]);
  const [dailyTrends, setDailyTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // App State Inspector Modal
  const [inspectedState, setInspectedState] = useState(null);

  // Form state
  const [selectedUserId, setSelectedUserId] = useState('');
  const [storeName, setStoreName] = useState('');

  const { showToast } = useToast() || {};

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchSafe = async (url, fallback) => {
        try { 
          const res = await api.get(url); 
          return res.data; 
        } catch (e) { 
          console.error(`Failed to fetch ${url}`, e); 
          return fallback; 
        }
      };

      const usersData = await fetchSafe('/warehouse/admin/users', { users: [] });
      const allUsersData = await fetchSafe('/warehouse/admin/all-users', { users: [] });
      const summaryData = await fetchSafe('/warehouse/admin/sales-summary', { summary: [] });
      const transData = await fetchSafe('/warehouse/admin/sales', { sales: [] });
      const trendsData = await fetchSafe('/warehouse/admin/sales-daily', { daily: [] });

      setWarehouseUsers(usersData.users || []);
      setAllUsers(allUsersData.users || []);
      setSalesSummary(summaryData.summary || []);
      setLiveTransactions(transData.sales || []);
      setDailyTrends(trendsData.daily || []);
    } catch (err) {
      showToast?.('System Error updating matrices.', 'error');
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
      setStoreName(''); setSelectedUserId(''); fetchData();
    } catch (err) { showToast?.('Failed to grant access.', 'error'); }
  };

  const handleRevokeAccess = async (userId) => {
    if (!window.confirm('CRITICAL: Revoke warehouse operations for this distributor?')) return;
    try {
      await api.post('/warehouse/admin/revoke-access', { user_id: userId });
      showToast?.('Warehouse access revoked.', 'success'); fetchData();
    } catch (err) { showToast?.('Revocation failed.', 'error'); }
  };

  const handleInspectState = async (userId, userName) => {
    try {
      const res = await api.get(`/warehouse/admin/user-state/${userId}`);
      if (res.data.state) {
        setInspectedState({ name: userName, state: res.data.state, updated: res.data.updated_at });
      } else {
        showToast?.('No synced state found for this device yet.', 'warning');
      }
    } catch (err) { showToast?.('Failed to fetch device state.', 'error'); }
  };

  const TabButton = ({ id, icon: Icon, label, colorClass }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`pb-3 px-4 font-black uppercase text-xs tracking-widest transition-all flex items-center gap-2 ${activeTab === id ? `${colorClass} border-b-2 border-current` : 'text-slate-500 hover:text-slate-300'}`}
    >
      <Icon size={14} /> {label}
    </button>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#020617] min-h-screen text-slate-300 font-sans animate-in fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-slate-800/80 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            Warehouse <span className="text-emerald-500">Command Center</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">
            Global Sync, Access Control & Telemetry
          </p>
        </div>
        <button onClick={fetchData} className="p-3 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl hover:text-emerald-400 transition-all">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-px">
        <TabButton id="access" icon={ShieldPlus} label="Access Control" colorClass="text-emerald-400" />
        <TabButton id="summary" icon={Activity} label="Product Summary" colorClass="text-cyan-400" />
        <TabButton id="transactions" icon={List} label="Live Ledger" colorClass="text-purple-400" />
        <TabButton id="trends" icon={TrendingUp} label="Daily Trends" colorClass="text-amber-400" />
      </div>

      {/* 1. ACCESS CONTROL TAB */}
      {activeTab === 'access' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="lg:col-span-1 bg-slate-900/40 border border-slate-800/80 p-6 rounded-[2rem] h-fit">
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
              <ShieldPlus size={16} className="text-emerald-500"/> Grant Authorization
            </h3>
            <form onSubmit={handleGrantAccess} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Select Basic User</label>
                <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl py-3 px-4 text-white text-sm outline-none">
                  <option value="">-- Select Identity --</option>
                  {allUsers.filter(u => u.has_access === 0).map(u => (<option key={u.id} value={u.id}>{u.name} ({u.email})</option>))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Assigned Store Name</label>
                <input type="text" placeholder="e.g., North Hub" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl py-3 px-4 text-white text-sm outline-none" />
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-emerald-500 hover:text-slate-950 transition-all mt-4">
                Authorize Distributor
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/80 rounded-[2rem] overflow-hidden">
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800">
                  <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Distributor Node</th>
                  <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Store Entity</th>
                  <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Logs</th>
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
                    <td className="p-5"><p className="text-sm font-black text-cyan-400">{user.total_sales} Trx</p></td>
                    <td className="p-5 text-right flex justify-end gap-2">
                      <button onClick={() => handleInspectState(user.user_id, user.name)} className="px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 transition-all" title="Inspect Device Sync State">
                        <MonitorSmartphone size={12} /> Sync State
                      </button>
                      <button onClick={() => handleRevokeAccess(user.user_id)} className="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all" title="Revoke Access">
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

      {/* 2. SUMMARY TAB */}
      {activeTab === 'summary' && (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-[2rem] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Product SKU</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Store Source</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Qty Moved</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Gross Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {salesSummary.map((item, index) => (
                <tr key={index} className="hover:bg-slate-800/20">
                  <td className="p-5"><p className="text-sm font-bold text-white flex items-center gap-2"><Package size={14} className="text-slate-500"/> {item.product_name}</p></td>
                  <td className="p-5"><p className="text-xs font-bold text-slate-400">{item.store_name}</p></td>
                  <td className="p-5"><p className="text-sm font-black text-cyan-400">{item.total_qty}</p></td>
                  <td className="p-5"><p className="text-sm font-black text-emerald-400">₹{parseFloat(item.total_revenue).toLocaleString()}</p></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. LIVE LEDGER TAB */}
      {activeTab === 'transactions' && (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-[2rem] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Timestamp</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Distributor & Store</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Item Logged</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Financials</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {liveTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-800/20">
                  <td className="p-5">
                    <p className="text-xs font-bold text-slate-300">{new Date(trx.sold_at).toLocaleDateString()}</p>
                    <p className="text-[10px] text-slate-500">{new Date(trx.sold_at).toLocaleTimeString()}</p>
                  </td>
                  <td className="p-5">
                    <p className="text-sm font-bold text-white">{trx.distributor_name}</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">{trx.store_name}</p>
                  </td>
                  <td className="p-5">
                    <p className="text-sm font-bold text-cyan-400">{trx.product_name}</p>
                    <p className="text-[10px] text-slate-500">Qty: {trx.quantity}</p>
                  </td>
                  <td className="p-5 text-right">
                    <p className="text-sm font-black text-emerald-400">₹{parseFloat(trx.total_value).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500">@ ₹{parseFloat(trx.sale_price).toLocaleString()} /ea</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. DAILY TRENDS TAB */}
      {activeTab === 'trends' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-bottom-4 duration-300">
          {dailyTrends.length === 0 ? (
            <p className="text-slate-500 font-bold text-sm p-4 col-span-full">No daily tracking data generated yet.</p>
          ) : dailyTrends.map((day, i) => (
            <div key={i} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-[2rem]">
              <p className="text-xs font-black uppercase text-slate-500 tracking-widest mb-4">
                {new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Units Moved</p>
                  <p className="text-3xl font-black text-cyan-400">{day.total_qty}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Total Revenue</p>
                  <p className="text-xl font-black text-emerald-400">₹{parseFloat(day.total_revenue).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INSPECTOR MODAL */}
      {inspectedState && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-[#0a0c10] border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-cyan-500/5">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <MonitorSmartphone size={18} className="text-cyan-500"/> Device State: {inspectedState.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Last synced: {new Date(inspectedState.updated).toLocaleString()}</p>
              </div>
              <button onClick={() => setInspectedState(null)} className="text-slate-500 hover:text-rose-500 transition-colors"><XCircle size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-950">
              <pre className="text-[11px] font-mono text-emerald-400 whitespace-pre-wrap break-all">
                {JSON.stringify(inspectedState.state, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
