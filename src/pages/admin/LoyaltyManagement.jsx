import React, { useState, useEffect, useCallback } from "react";
import { loyalty } from "../../services/api";
import {
  Award, Settings, Users, Gift, Loader2, Search, Edit3, Save, RefreshCw, X
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

export default function LoyaltyManagement() {
  const [members, setMembers] = useState([]);
  const [systemConfig, setSystemConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [editingMember, setEditingMember] = useState(null);
  const [adjustPointsDelta, setAdjustPointsDelta] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjusting, setAdjusting] = useState(false);
  const { showToast } = useToast() || {};

  const loadLoyaltyData = useCallback(async () => {
    setLoading(true);
    try {
      const [membersRes, configRes] = await Promise.all([
        loyalty.getMembers(),
        loyalty.getSystemConfig().catch(() => ({ data: {} }))
      ]);
      
      const usersData = membersRes.data?.data || membersRes.data;
      setMembers(Array.isArray(usersData) ? usersData : []);
      
      setSystemConfig(configRes.data?.loyalty || {
        enabled: true,
        pointsPerDollar: 1,
        redemptionValue: 0.01,
        maxRedemptionPercent: 45,
        tierThresholds: { gold: 1000, platinum: 5000 }
      });
    } catch (err) {
      console.error("Loyalty initialization error:", err);
      showToast?.("Failed to synchronize loyalty matrix", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadLoyaltyData();
  }, [loadLoyaltyData]);

  const handleConfigUpdate = async () => {
    setSaving(true);
    try {
      await loyalty.updateSystemConfig({ loyalty: systemConfig });
      showToast?.("Loyalty matrix updated securely", "success");
    } catch (err) {
      showToast?.("Failed to update matrix", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAdjustPoints = async (e) => {
    e.preventDefault();
    if (!editingMember || !adjustPointsDelta) return;
    setAdjusting(true);
    try {
      await loyalty.adjustPoints({
        userId: editingMember.id,
        points: Number(adjustPointsDelta),
        reason: adjustReason || "Admin manual adjustment"
      });
      showToast?.(`Updated points for ${editingMember.name}`, "success");
      setEditingMember(null);
      setAdjustPointsDelta("");
      setAdjustReason("");
      loadLoyaltyData();
    } catch (err) {
      showToast?.(err.response?.data?.message || "Failed to adjust member points", "error");
    } finally {
      setAdjusting(false);
    }
  };

  const getMemberTier = (pts) => {
    if (pts >= (systemConfig?.tierThresholds?.platinum || 5000)) return 'Platinum';
    if (pts >= (systemConfig?.tierThresholds?.gold || 1000)) return 'Gold';
    return 'Silver';
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.email?.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (tierFilter !== "all") {
      return getMemberTier(m.loyalty_points || 0).toLowerCase() === tierFilter.toLowerCase();
    }
    return true;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-cyan-400" size={32} />
      <span className="ml-3 text-gray-400 font-mono text-sm">Synchronizing Loyalty Matrix...</span>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Award className="text-cyan-400" size={32} /> Loyalty <span className="text-cyan-400">Matrix</span>
          </h1>
          <p className="text-gray-500 font-bold text-xs mt-1 uppercase tracking-widest">Rewards & Tier System Control</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadLoyaltyData}
            className="p-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl border border-white/10 transition-all"
            title="Refresh Members & Rules"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={handleConfigUpdate}
            disabled={saving}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Deploy Config
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <button
          onClick={() => setTierFilter("all")}
          className={`bg-emerald-500/5 border rounded-2xl p-6 flex items-center gap-4 text-left transition-all ${tierFilter === 'all' ? 'border-emerald-500/40' : 'border-emerald-500/10 hover:border-emerald-500/30'}`}
        >
          <Users size={32} className="text-emerald-400" />
          <div>
            <div className="text-3xl font-black text-emerald-400">{members.length}</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Enrolled Members</div>
          </div>
        </button>
        <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-6 flex items-center gap-4">
          <Gift size={32} className="text-cyan-400" />
          <div>
            <div className="text-3xl font-black text-cyan-400">
               {members.reduce((acc, curr) => acc + (curr.loyalty_points || 0), 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Total Points Circulating</div>
          </div>
        </div>
        <button
          onClick={() => setSystemConfig(prev => ({ ...prev, enabled: !prev?.enabled }))}
          className="bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 rounded-2xl p-6 flex items-center gap-4 text-left transition-all"
        >
          <Settings size={32} className="text-purple-400" />
          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Matrix Status (Click to Toggle)</span>
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${systemConfig?.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {systemConfig?.enabled ? 'Active' : 'Offline'}
              </span>
            </div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-[#10241f]/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex flex-wrap justify-between items-center gap-3 bg-white/5">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white uppercase tracking-wide">Member Roster</h2>
              {['all', 'Silver', 'Gold', 'Platinum'].map(t => (
                <button
                  key={t}
                  onClick={() => setTierFilter(t)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${tierFilter === t ? 'bg-cyan-500 text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search entities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-white focus:ring-1 focus:ring-cyan-500 outline-none w-48"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Identity</th>
                  <th className="px-6 py-4">Current Points</th>
                  <th className="px-6 py-4">Est. Tier</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredMembers.map((m, i) => {
                  const pts = m.loyalty_points || 0;
                  const tier = getMemberTier(pts);
                  
                  return (
                    <tr key={m.id || i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-300">{m.name}</div>
                        <div className="text-xs text-gray-600">{m.email}</div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-cyan-400">{pts.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-black uppercase rounded ${
                          tier === 'Platinum' ? 'bg-purple-500/20 text-purple-400' :
                          tier === 'Gold' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setEditingMember(m);
                            setAdjustPointsDelta("");
                            setAdjustReason("");
                          }}
                          className="p-2 text-gray-400 hover:text-cyan-400 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                          title="Adjust Member Points"
                        >
                          <Edit3 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#10241f]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-fit">
          <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-6">Engine Rules</h2>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Accumulation Rate</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={systemConfig?.pointsPerDollar || 1}
                  onChange={e => setSystemConfig({...systemConfig, pointsPerDollar: Number(e.target.value)})}
                  className="w-24 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 text-center"
                />
                <span className="text-xs text-gray-400 font-bold">Points per ₹1 spent</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Redemption Value</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.01"
                  value={systemConfig?.redemptionValue || 0.01}
                  onChange={e => setSystemConfig({...systemConfig, redemptionValue: Number(e.target.value)})}
                  className="w-24 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 text-center"
                />
                <span className="text-xs text-gray-400 font-bold">Value (₹) per 1 Point</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 block">Tier Thresholds</label>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase">Gold Tier</span>
                  <input
                    type="number"
                    value={systemConfig?.tierThresholds?.gold || 1000}
                    onChange={e => setSystemConfig({
                      ...systemConfig, 
                      tierThresholds: { ...systemConfig.tierThresholds, gold: Number(e.target.value) }
                    })}
                    className="w-24 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-1 text-amber-400 font-mono text-sm text-right outline-none"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 uppercase">Platinum Tier</span>
                  <input
                    type="number"
                    value={systemConfig?.tierThresholds?.platinum || 5000}
                    onChange={e => setSystemConfig({
                      ...systemConfig, 
                      tierThresholds: { ...systemConfig.tierThresholds, platinum: Number(e.target.value) }
                    })}
                    className="w-24 bg-purple-500/10 border border-purple-500/20 rounded-xl px-3 py-1 text-purple-400 font-mono text-sm text-right outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADJUST MEMBER POINTS MODAL */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleAdjustPoints} className="bg-[#10241f] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Adjust Loyalty Points</h3>
                <p className="text-xs text-cyan-400 font-bold">{editingMember.name} ({editingMember.email})</p>
              </div>
              <button type="button" onClick={() => setEditingMember(null)} className="p-2 text-gray-400 hover:text-white rounded-xl bg-white/5">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">Current Balance</span>
                <span className="text-lg font-mono font-black text-cyan-400">{(editingMember.loyalty_points || 0).toLocaleString()} pts</span>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Points Delta (Use + to credit, - to deduct)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 250 or -100"
                  value={adjustPointsDelta}
                  onChange={(e) => setAdjustPointsDelta(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-white font-mono text-sm outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Audit Reason</label>
                <input
                  type="text"
                  placeholder="Bonus reward / Order adjustment"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-cyan-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditingMember(null)} className="px-4 py-2.5 rounded-xl bg-white/5 text-gray-300 text-xs font-bold uppercase">
                Cancel
              </button>
              <button type="submit" disabled={adjusting} className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black uppercase tracking-widest">
                {adjusting ? "Updating..." : "Apply Adjustment"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
