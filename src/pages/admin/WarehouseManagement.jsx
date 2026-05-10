import React, { useState, useEffect, useMemo } from 'react';
import { Store, ShieldPlus, Trash2, RefreshCw, Search, Power, UserPlus } from 'lucide-react';
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
    } catch (err) { 
      showToast?.('Failed to sync users.', 'error'); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleGrantAccess = async (e) => {
    e.preventDefault();
    if (!selectedUserId || !storeName) return showToast?.('Select a user and store name.', 'error');
    try {
      await api.post('/warehouse/admin/grant-access', { user_id: selectedUserId, store_name: storeName });
      showToast?.('Access granted.', 'success');
      setStoreName(''); setSelectedUserId(''); fetchData();
    } catch (err) { showToast?.('Failed to grant access.', 'error'); }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await api.patch(`/warehouse/admin/user-status/${userId}`, { is_active: currentStatus === 1 ? 0 : 1 });
      showToast?.(`User ${currentStatus === 1 ? 'suspended' : 'activated'}.`, 'success'); 
      fetchData();
    } catch (err) { showToast?.('Operation failed.', 'error'); }
  };

  const handleRevokeAccess = async (userId) => {
    if (!window.confirm('Delete this user from the warehouse system?')) return;
    try {
      await api.post('/warehouse/admin/revoke-access', { user_id: userId });
      showToast?.('Access revoked.', 'success'); fetchData();
    } catch (err) { showToast?.('Revocation failed.', 'error'); }
  };

  const filteredUsers = useMemo(() => warehouseUsers.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ), [warehouseUsers, searchQuery]);

  return (
    <div className="p-6 bg-[#020617] min-h-screen text-slate-300">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Warehouse <span className="text-emerald-500">Access Portal</span></h1>
        <button onClick={fetchData} className="p-2 bg-slate-900 rounded-lg hover:text-emerald-400">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
            <h2 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-4 flex items-center gap-2"><UserPlus size={16}/> Grant Access</h2>
            <form onSubmit={handleGrantAccess} className="space-y-4">
              <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm outline-none">
                <option value="">Select a Registered User</option>
                {allUsers.filter(u => !u.has_access).map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
              </select>
              <input type="text" placeholder="Assigned Store Name" value={storeName} onChange={e => setStoreName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm outline-none" />
              <button type="submit" className="w-full py-3 bg-emerald-500/10 border border-emerald-500 text-emerald-400 rounded-xl font-bold uppercase text-[10px] hover:bg-emerald-500 hover:text-black transition-all">Authorize Node</button>
            </form>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-3xl flex items-center gap-3">
            <Search size={18} className="text-slate-500" />
            <input type="text" placeholder="SEARCH DISTRIBUTOR..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-xs font-bold uppercase w-full" />
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-black uppercase text-slate-500">
              <tr>
                <th className="p-4">Distributor</th>
                <th className="p-4">Store</th>
                <th className="p-4 text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-800/20">
                  <td className="p-4">
                    <p className={`font-bold ${user.is_active ? 'text-white' : 'text-slate-600'}`}>{user.name}</p>
                    <p className="text-[10px] font-mono text-slate-500">{user.email}</p>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded bg-slate-950 border border-slate-800 ${user.is_active ? 'text-emerald-400' : 'text-slate-600'}`}>
                      {user.store_name}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => handleStatusToggle(user.user_id, user.is_active)} className={`p-2 rounded-lg border transition-all ${user.is_active ? 'border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black' : 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-black'}`}>
                      <Power size={14} />
                    </button>
                    <button onClick={() => handleRevokeAccess(user.user_id)} className="p-2 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
