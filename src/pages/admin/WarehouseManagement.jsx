import React, { useState, useEffect, useMemo } from 'react';
import { Store, Trash2, RefreshCw, Search, Power, UserPlus, Download, ShieldCheck, Users } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function WarehouseManagement() {
  const [warehouseUsers, setWarehouseUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [storeName, setStoreName] = useState('');
  const { showToast } = useToast() || {};

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wRes, aRes] = await Promise.all([
        api.get('/warehouse/admin/users').catch(() => ({ data: { users: [] } })),
        api.get('/warehouse/admin/all-users').catch(() => ({ data: { users: [] } })),
      ]);
      setWarehouseUsers(wRes.data.users || []);
      setAllUsers(aRes.data.users || []);
    } catch {
      showToast?.('Failed to sync users.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAccess = async e => {
    e.preventDefault();
    if (!selectedUserId || !storeName) return showToast?.('Select a user and store name.', 'error');
    try {
      await api.post('/warehouse/admin/grant-access', { user_id: selectedUserId, store_name: storeName });
      showToast?.('Access granted.', 'success');
      setStoreName('');
      setSelectedUserId('');
      fetchData();
    } catch {
      showToast?.('Failed to grant access.', 'error');
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await api.patch(`/warehouse/admin/user-status/${userId}`, { is_active: currentStatus === 1 ? 0 : 1 });
      showToast?.(`User ${currentStatus === 1 ? 'suspended' : 'activated'}.`, 'success');
      fetchData();
    } catch {
      showToast?.('Operation failed.', 'error');
    }
  };

  const handleRevokeAccess = async userId => {
    if (!window.confirm('Delete this user from the warehouse system?')) return;
    try {
      await api.post('/warehouse/admin/revoke-access', { user_id: userId });
      showToast?.('Access revoked.', 'success');
      fetchData();
    } catch {
      showToast?.('Revocation failed.', 'error');
    }
  };

  const filteredUsers = useMemo(
    () =>
      warehouseUsers.filter(u => {
        if (statusFilter === 'active' && Number(u.is_active) !== 1) return false;
        if (statusFilter === 'suspended' && Number(u.is_active) === 1) return false;
        const q = searchQuery.toLowerCase();
        return (
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.store_name?.toLowerCase().includes(q)
        );
      }),
    [warehouseUsers, searchQuery, statusFilter]
  );

  const handleExportCsv = () => {
    const headers = [
      'Distributor ID',
      'User ID',
      'Full Name',
      'Email Address',
      'Assigned Store / Hub',
      'Total Dispatches',
      'Access Status',
    ];
    const escapeCell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = filteredUsers.map(u =>
      [
        u.id,
        u.user_id,
        u.name,
        u.email,
        u.store_name,
        u.total_sales || 0,
        Number(u.is_active) === 1 ? 'Active' : 'Suspended',
      ]
        .map(escapeCell)
        .join(',')
    );
    const csv = `\uFEFF${headers.map(escapeCell).join(',')}\n${rows.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bhumivera-warehouse-distributors-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="text-slate-300 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            Warehouse <span className="text-emerald-500">Access Portal &amp; Hub Roster</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authorize regional warehouse operators, inspect dispatch counts, and export hub credentials.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-emerald-500/15 border border-emerald-400/30 rounded-xl text-xs font-bold text-emerald-200 hover:bg-emerald-500/25 flex items-center gap-1.5"
          >
            <Download size={14} /> Export Roster CSV
          </button>
          <button
            onClick={fetchData}
            className="p-2 bg-[#10241f]/85 backdrop-blur-xl rounded-lg hover:text-emerald-400"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 3-Card Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-[#10241f]/45 p-4">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Users size={14} className="text-emerald-400" /> Total Provisioned Operators
          </span>
          <strong className="text-2xl font-black text-white mt-1 block">{warehouseUsers.length}</strong>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#10241f]/45 p-4">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-cyan-400" /> Active Operators
          </span>
          <strong className="text-2xl font-black text-emerald-300 mt-1 block">
            {warehouseUsers.filter(u => Number(u.is_active) === 1).length}
          </strong>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#10241f]/45 p-4">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Store size={14} className="text-[#d4af37]" /> Eligible Registered Users
          </span>
          <strong className="text-2xl font-black text-[#d4af37] mt-1 block">
            {allUsers.filter(u => !u.has_access).length}
          </strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-[#10241f]/45 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl">
            <h2 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-4 flex items-center gap-2">
              <UserPlus size={16} /> Grant Access
            </h2>
            <form onSubmit={handleGrantAccess} className="space-y-4">
              <select
                value={selectedUserId}
                onChange={e => setSelectedUserId(e.target.value)}
                className="w-full bg-[#081b15]/90 backdrop-blur-xl border border-slate-800 rounded-xl p-3 text-sm outline-none text-white"
              >
                <option value="">Select a Registered User</option>
                {allUsers
                  .filter(u => !u.has_access)
                  .map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
              </select>
              <input
                type="text"
                placeholder="Assigned Store Name"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                className="w-full bg-[#081b15]/90 backdrop-blur-xl border border-slate-800 rounded-xl p-3 text-sm outline-none text-white"
              />
              <button
                type="submit"
                className="w-full py-3 bg-emerald-500/10 border border-emerald-500 text-emerald-400 rounded-xl font-bold uppercase text-[10px] hover:bg-emerald-500 hover:text-black transition-all"
              >
                Authorize access
              </button>
            </form>
          </div>

          <div className="bg-[#10241f]/45 backdrop-blur-xl border border-slate-800 p-4 rounded-3xl space-y-3">
            <div className="flex items-center gap-3">
              <Search size={18} className="text-slate-500" />
              <input
                type="text"
                placeholder="SEARCH DISTRIBUTOR OR HUB..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-bold uppercase w-full text-white"
              />
            </div>
            <div className="flex gap-1.5 text-[10px]">
              {['all', 'active', 'suspended'].map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg uppercase font-bold border ${
                    statusFilter === st
                      ? 'bg-emerald-400 text-black border-emerald-400'
                      : 'border-slate-700 text-slate-400'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#10241f]/45 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead className="bg-[#081b15]/90 backdrop-blur-xl border-b border-slate-800 text-[10px] font-black uppercase text-slate-500">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Distributor</th>
                  <th className="p-4">Assigned Store / Hub</th>
                  <th className="p-4 text-right">Dispatches</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/20">
                    <td className="p-4 font-mono text-xs text-slate-500">#{user.user_id || user.id}</td>
                    <td className="p-4">
                      <p className={`font-bold ${user.is_active ? 'text-white' : 'text-slate-600'}`}>{user.name}</p>
                      <p className="text-[10px] font-mono text-slate-500">{user.email}</p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-black px-2 py-1 rounded bg-[#081b15]/90 backdrop-blur-xl border border-slate-800 ${
                          user.is_active ? 'text-emerald-400' : 'text-slate-600'
                        }`}
                      >
                        {user.store_name}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono text-xs text-cyan-300">{user.total_sales || 0}</td>
                    <td className="p-4 text-xs">
                      <span className={user.is_active ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                        {user.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-4 flex justify-end gap-2">
                      <button
                        onClick={() => handleStatusToggle(user.user_id, user.is_active)}
                        className={`p-2 rounded-lg border transition-all ${
                          user.is_active
                            ? 'border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black'
                            : 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-black'
                        }`}
                      >
                        <Power size={14} />
                      </button>
                      <button
                        onClick={() => handleRevokeAccess(user.user_id)}
                        className="p-2 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg"
                      >
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
    </div>
  );
}
