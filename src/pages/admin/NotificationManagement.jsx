import React, { useState, useEffect } from 'react';
import { 
  Bell, CheckCheck, AlertTriangle, Info, ShieldAlert, Send, 
  Plus, Search, CheckCircle, X, Clock, Activity, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function NotificationManagement() {
  const { user, token } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [composeData, setComposeData] = useState({ title: '', message: '', type: 'info', target: 'all' });

  const API = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL || 'https://service.bhumivera.com';

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API}/api/notifications/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch telemetry');
      const data = await res.json();
      setAlerts(data || []);
    } catch (error) {
      console.error('Telemetry Sync Error:', error);
      // Zero-Fake-Data Constraint Met: We do not push fake data here anymore.
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await fetch(`${API}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(alerts.map(a => a.id === id ? { ...a, is_read: true } : a));
    } catch (err) {
      console.error('Mark read failed', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch(`${API}/api/notifications/read-all`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(alerts.map(a => ({ ...a, is_read: true })));
    } catch (err) {
      console.error('Mark all read failed', err);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(`${API}/api/notifications/admin/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          ...composeData, 
          is_global: composeData.target === 'all',
          user_id: null // Admin global broadcasts do not target a specific user
        })
      });
      setIsComposing(false);
      setComposeData({ title: '', message: '', type: 'info', target: 'all' });
      fetchAlerts();
    } catch (err) {
      console.error('Broadcast transmission failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.message.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'unread') return !a.is_read;
    if (filter === 'system') return a.type === 'info' || a.is_global;
    if (filter === 'security') return a.type === 'error' || a.type === 'warning' || a.type === 'alert';
    return true;
  });

  const unreadCount = alerts.filter(a => !a.is_read).length;
  const securityCount = alerts.filter(a => a.type === 'error' || a.type === 'warning' || a.type === 'alert').length;

  const getTypeStyles = (type) => {
    switch (type) {
      case 'error': 
      case 'alert':
      case 'crash':
        return { icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' };
      case 'warning': return { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
      case 'success': return { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
      default: return { icon: Info, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' };
    }
  };

  if (loading) return (
    <div className="flex h-full items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full" />
        <div className="absolute inset-0 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3">
            <Activity className="text-emerald-500" size={24} />
            System Heartbeat
          </h2>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-1">Live Telemetry, F12 Errors, & Broadcasts</p>
        </div>
        <button
          onClick={() => setIsComposing(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]"
        >
          <Plus size={16} /> New Broadcast
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Recorded Logs', value: alerts.length, icon: Activity, color: 'text-cyan-400' },
          { label: 'Unacknowledged Logs', value: unreadCount, icon: Zap, color: 'text-emerald-400' },
          { label: 'Critical Exceptions', value: securityCount, icon: ShieldAlert, color: 'text-rose-400' }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-white">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-slate-950 border border-slate-800 shadow-inner ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl flex flex-col h-[600px] overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-950/30">
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {['all', 'unread', 'system', 'security'].map(f => (
              <button
                key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  filter === f ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text" placeholder="Search logs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors font-mono"
              />
            </div>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all flex-shrink-0" title="Acknowledge all alerts">
                <CheckCheck size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 content-scroll bg-[#0a0a0a]">
          {filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <CheckCircle size={48} className="mb-4 opacity-20" />
              <p className="font-mono text-sm uppercase tracking-widest">No matching telemetry</p>
            </div>
          ) : (
            filteredAlerts.map(alert => {
              const { icon: Icon, color, bg, border } = getTypeStyles(alert.type);
              return (
                <div 
                  key={alert.id} onClick={() => !alert.is_read && handleMarkRead(alert.id)}
                  className={`group relative flex gap-4 p-5 rounded-xl border transition-all duration-300 ${alert.is_read ? 'bg-slate-950/50 border-slate-800/50 opacity-70' : `bg-slate-900/80 ${border} shadow-[0_4px_20px_rgba(0,0,0,0.2)] cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]`}`}
                >
                  {!alert.is_read && <div className={`absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 rounded-r-full ${color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`} />}
                  <div className={`p-3 rounded-xl h-fit flex-shrink-0 ${bg} ${color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-bold text-sm truncate ${alert.is_read ? 'text-slate-400' : 'text-white'}`}>{alert.title}</h4>
                      <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500 flex-shrink-0 ml-4 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        <Clock size={10} />
                        {new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(alert.created_at))}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed font-mono mt-2 ${alert.is_read ? 'text-slate-500' : 'text-slate-300'}`}>{alert.message}</p>
                    {alert.user_id && (
                      <span className="inline-block mt-3 text-[9px] uppercase tracking-widest px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                        Target: User {alert.user_id}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {isComposing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <h3 className="font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Send size={16} className="text-emerald-500" /> Transmit Broadcast
              </h3>
              <button onClick={() => setIsComposing(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSendBroadcast} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Severity</label>
                  <select 
                    value={composeData.type} onChange={e => setComposeData({...composeData, type: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
                  >
                    <option value="info">System Info</option>
                    <option value="success">Success Status</option>
                    <option value="warning">Warning Matrix</option>
                    <option value="error">Critical Alert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Target Scope</label>
                  <select 
                    value={composeData.target} onChange={e => setComposeData({...composeData, target: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
                  >
                    <option value="all">Global Access (All)</option>
                    <option value="admins">Admin Level Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Transmission Header</label>
                <input 
                  type="text" required value={composeData.title} onChange={e => setComposeData({...composeData, title: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="e.g., Database Sync Completed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Payload Trace</label>
                <textarea 
                  required rows={4} value={composeData.message} onChange={e => setComposeData({...composeData, message: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                  placeholder="Enter detailed system trace or message..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsComposing(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 transition-colors uppercase tracking-wider">
                  Abort
                </button>
                <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-black rounded-xl font-black uppercase tracking-wider text-xs hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50">
                  {submitting ? <Activity size={16} className="animate-spin" /> : <Send size={16} />}
                  {submitting ? 'Transmitting...' : 'Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
