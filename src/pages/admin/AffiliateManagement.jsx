import React, { useState, useEffect } from 'react';
import { affiliate as affiliateApi } from '../../services/api';
import { Share2, DollarSign, Users, TrendingUp, CheckCircle, XCircle, RefreshCw, Eye } from 'lucide-react';

export default function AffiliateManagement() {
  const [partners, setPartners] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [config, setConfig] = useState({ commission_percent: 10, min_payout: 500 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [partnersRes, withdrawalsRes, configRes] = await Promise.all([affiliateApi.getAllPartners(), affiliateApi.getAllWithdrawals(), affiliateApi.getConfig()]);
      setPartners(partnersRes.data?.partners || partnersRes.data || []);
      setWithdrawals(withdrawalsRes.data?.withdrawals || withdrawalsRes.data || []);
      setConfig(configRes.data?.config || configRes.data || { commission_percent: 10, min_payout: 500 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updatePartnerStatus = async (id, status) => {
    try {
      await affiliateApi.updatePartnerStatus(id, status);
      fetchAll();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const approveWithdrawal = async (id) => {
    try {
      await affiliateApi.approveWithdrawal(id);
      fetchAll();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const saveConfig = async () => {
    try {
      await affiliateApi.updateConfig(config);
      alert('Config saved!');
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-5 text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Affiliate network</h2>
          <p className="mt-1 text-sm text-slate-400">Manage partners, commissions, and payout requests.</p>
        </div>
        <button onClick={fetchAll} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 backdrop-blur-xl transition hover:bg-white/10">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="admin-glass-panel rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{partners.length}</div>
          <div className="mt-1 text-xs font-semibold uppercase text-slate-400">Partners</div>
        </div>
        <div className="admin-glass-panel rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-300">{partners.filter(p => p.status === 'active').length}</div>
          <div className="mt-1 text-xs font-semibold uppercase text-slate-400">Active</div>
        </div>
        <div className="admin-glass-panel rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-300">{withdrawals.filter(w => w.status === 'pending').length}</div>
          <div className="mt-1 text-xs font-semibold uppercase text-slate-400">Pending payouts</div>
        </div>
        <div className="admin-glass-panel rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-sky-300">{config.commission_percent}%</div>
          <div className="mt-1 text-xs font-semibold uppercase text-slate-400">Commission</div>
        </div>
      </div>

      {/* Config */}
      <div className="admin-glass-panel rounded-2xl p-5">
        <h3 className="mb-4 text-base font-semibold text-white">Commission settings</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-slate-400">Commission percentage</label>
            <input type="number" value={config.commission_percent} onChange={e => setConfig({...config, commission_percent: parseFloat(e.target.value)})} className="admin-glass-control w-full rounded-xl px-4 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Minimum payout (₹)</label>
            <input type="number" value={config.min_payout} onChange={e => setConfig({...config, min_payout: parseFloat(e.target.value)})} className="admin-glass-control w-full rounded-xl px-4 py-2 text-sm" />
          </div>
        </div>
        <button onClick={saveConfig} className="mt-4 rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-[#071a12] transition hover:bg-emerald-300">Save config</button>
      </div>

      {/* Partners */}
      <div className="admin-glass-panel rounded-2xl p-5">
        <h3 className="mb-4 text-base font-semibold text-white">Affiliate partners</h3>
        {loading ? <div className="text-center py-8 text-slate-400">Loading...</div> : partners.length === 0 ? <div className="text-center py-8 text-slate-400">No partners yet</div> : (
          <div className="space-y-3">
            {partners.map(p => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.035] p-4 backdrop-blur-lg">
                <div className="flex-1">
                  <div className="font-semibold text-slate-100">{p.name || p.user_name || 'Partner #' + p.id}</div>
                  <div className="text-xs text-slate-400">{p.email || p.user_email} • Code: {p.affiliate_code}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Total Earned: ₹{p.total_earnings || 0} • Pending: ₹{p.pending_amount || 0}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.status === 'active' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-rose-400/10 text-rose-300'}`}>
                    {p.status || 'pending'}
                  </span>
                  {p.status === 'active' ? (
                    <button onClick={() => updatePartnerStatus(p.id, 'suspended')} className="rounded-lg p-2 transition hover:bg-white/10" title="Suspend">
                      <XCircle size={16} className="text-rose-500" />
                    </button>
                  ) : (
                    <button onClick={() => updatePartnerStatus(p.id, 'active')} className="rounded-lg p-2 transition hover:bg-white/10" title="Activate">
                      <CheckCircle size={16} className="text-emerald-500" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdrawals */}
      <div className="admin-glass-panel rounded-2xl p-5">
        <h3 className="mb-4 text-base font-semibold text-white">Withdrawal requests</h3>
        {loading ? <div className="text-center py-8 text-slate-400">Loading...</div> : withdrawals.length === 0 ? <div className="text-center py-8 text-slate-400">No requests</div> : (
          <div className="space-y-3">
            {withdrawals.map(w => (
              <div key={w.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.035] p-4 backdrop-blur-lg">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-100">{w.partner_name || 'Partner #' + w.partner_id}</div>
                  <div className="text-xs text-slate-400">Requested: {new Date(w.created_at).toLocaleDateString('en-IN')}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-semibold text-emerald-300">₹{w.amount}</div>
                    <div className={`text-xs font-semibold ${w.status === 'approved' ? 'text-emerald-300' : w.status === 'pending' ? 'text-amber-300' : 'text-slate-400'}`}>
                      {w.status}
                    </div>
                  </div>
                  {w.status === 'pending' && (
                    <button onClick={() => approveWithdrawal(w.id)} className="rounded-xl bg-emerald-400 px-3 py-2 text-xs font-semibold text-[#071a12] transition hover:bg-emerald-300">
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
