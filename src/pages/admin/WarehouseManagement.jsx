import React, { useState, useEffect, useMemo } from 'react';
import { Store, ShieldPlus, Ban, RefreshCw, Search, Power, UserPlus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
export default function WarehouseManagement() {
  const [warehouseUsers, setWarehouseUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [storeName, setStoreName] = useState('');
  const { showToast } = useToast() || {};
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const [wRes, aRes] = await Promise.all([
        api.get('/warehouse/admin/users').catch(() => ({ data: { users: [] } })),
        api.get('/warehouse/admin/all-users').catch(() => ({ data: { users: [] } }))
      ]);
      setWarehouseUsers(wRes.data.users || []);
      setAllUsers(aRes.data.users || []);
    } catch (err) { showToast?.('Failed to sync user matrices.', 'error'); } finally { setLoading(false); }
  };
  const handleGrantAccess = async (e) => {
    e.preventDefault();
    if (!selectedUserId || !storeName) return showToast?.('Identity and Store required.', 'error');
    try {
      await api.post('/warehouse/admin/grant-access', { user_id: selectedUserId, store_name: storeName });
      showToast?.('Warehouse authorization granted.', 'success');
      setStoreName(''); setSelectedUserId(''); fetchData();
    } catch (err) { showToast?.('Grant operation failed.', 'error'); }
  };
  const handleRevokeAccess = async (userId) => {
    if (!window.confirm('PERMANENT: Remove this user from warehouse operations?')) return;
    try {
      await api.post('/warehouse/admin/revoke-access', { user_id: userId });
      showToast?.('Access successfully purged.', 'success'); fetchData();
    } catch (err) { showToast?.('Revocation failed.', 'error'); }
  };
  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await api.patch(`/warehouse/admin/user-status/${userId}`, { is_active: currentStatus === 1 ? 0 : 1 });
      showToast?.(`User ${currentStatus === 1 ? 'suspended' : 'activated'}.`, 'success'); fetchData();
    } catch (err) { showToast?.('Status update failed.', 'error'); }
  };
  const filteredWarehouse = useMemo(() => warehouseUsers.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ), [warehouseUsers, searchQuery]);
  const grantableUsers = useMemo(() => allUsers.filter(u => u.has_access === 0), [allUsers]);
  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#020617] min-h-screen text-slate-300 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-slate-800/80 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">Warehouse <span className="text-emerald-500">Access Portal</span></h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Permission Management & Identity Control</p>
        </div>
        <button onClick={fetchData} className="p-3 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl hover:text-emerald-400 transition-all">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-[2rem]">
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2"><UserPlus size={16} className="text-emerald-500"/> New Authorization</h3>
            <form onSubmit={handleGrantAccess} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">User Registry</label>
                <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl py-3 px-4 text-white text-sm outline-none appearance-none">
                  <option value="">-- Select Identity --</option>
                  {grantableUsers.map(u => (<option key={u.id} value={u.id}>{u.name} ({u.email})</option>))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Assigned Store Entity</label>
                <input type="text" placeholder="e.g., Central Hub" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl py-3 px-4 text-white text-sm outline-none" />
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-emerald-500 hover:text-slate-950 transition-all">Authorize Node</button>
            </form>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-[2rem] flex items-center gap-3">
            <Search size={18} className="text-slate-500 ml-2" />
            <input type="text" placeholder="SEARCH BY NAME OR EMAIL..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest w-full text-white" />
          </div>
        </div>
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/80 rounded-[2rem] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800">
                <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Authorized Distributor</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Store Branch</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredWarehouse.map(user => (
                <tr key={user.id} className="hover:bg-slate-800/20 group">
                  <td className="p-5">
                    <p className={`text-sm font-bold ${user.is_active ? 'text-white' : 'text-slate-600'}`}>{user.name}</p>
                    <p className="text-[10px] font-mono text-slate-500">{user.email}</p>
                  </td>
                  <td className="p-5">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-bold ${user.is_active ? 'text-emerald-400' : 'text-slate-600'}`}>
                      <Store size={12}/> {user.store_name}
                    </div>
                  </td>
                  <td className="p-5 text-right flex justify-end gap-2">
                    <button onClick={() => handleStatusToggle(user.user_id, user.is_active)} className={`p-2 rounded-lg border transition-all ${user.is_active ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-slate-900' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-slate-900'}`} title={user.is_active ? 'Suspend' : 'Start'}>
                      <Power size={14} />
                    </button>
                    <button onClick={() => handleRevokeAccess(user.user_id)} className="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredWarehouse.length === 0 && (<tr><td colSpan="3" className="p-10 text-center text-xs font-black text-slate-600 tracking-widest">NO MATCHING AUTHORIZATIONS FOUND</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
