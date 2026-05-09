import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, RefreshCw, Store } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function WarehouseAdmin() {
  const [sales, setSales] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast() || {};

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchSafe = async (url, fallback) => {
        try { const res = await api.get(url); return res.data; } 
        catch (e) { return fallback; }
      };

      const transData = await fetchSafe('/warehouse/admin/sales', { sales: [] });
      const usersData = await fetchSafe('/warehouse/admin/users', { users: [] });

      setSales(transData.sales || []);
      setDistributors(usersData.users || []);
    } catch (err) {
      showToast?.('Matrix sync failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <div className="min-h-screen bg-[#020617] text-cyan-500 flex justify-center items-center font-black animate-pulse uppercase tracking-widest text-sm">Decrypting Global Matrix...</div>;

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-8 text-slate-300 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              Warehouse <span className="text-cyan-500">Command Center</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Live Global Sales Telemetry</p>
          </div>
          <button onClick={loadData} className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:text-cyan-400 transition-colors shadow-lg">
            <RefreshCw size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/80 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Activity className="text-purple-400 w-4 h-4" /> Live Transaction Ledger
              </h3>
            </div>
            <div className="overflow-x-auto h-[600px] custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-950/80 border-b border-slate-800 sticky top-0 backdrop-blur-md">
                  <tr>
                    <th className="p-5 text-[9px] font-black uppercase text-slate-500 tracking-widest">Timestamp</th>
                    <th className="p-5 text-[9px] font-black uppercase text-slate-500 tracking-widest">Distributor Node</th>
                    <th className="p-5 text-[9px] font-black uppercase text-slate-500 tracking-widest">Product Dispatched</th>
                    <th className="p-5 text-[9px] font-black uppercase text-slate-500 tracking-widest text-right">Financials</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {sales.length === 0 ? (
                    <tr><td colSpan="4" className="p-10 text-center text-slate-500 text-[10px] font-black uppercase tracking-widest">No data blocks found.</td></tr>
                  ) : sales.map(trx => (
                    <tr key={trx.id} className="hover:bg-cyan-500/5 transition-colors">
                      <td className="p-5">
                        <p className="text-xs font-bold text-slate-300">{new Date(trx.sold_at).toLocaleDateString()}</p>
                        <p className="text-[9px] font-mono text-slate-500 mt-0.5">{new Date(trx.sold_at).toLocaleTimeString()}</p>
                      </td>
                      <td className="p-5">
                        <p className="text-sm font-bold text-white">{trx.distributor_name || 'Unknown'}</p>
                        <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-0.5"><Store className="w-3 h-3 inline" /> {trx.store_name}</p>
                      </td>
                      <td className="p-5">
                        <p className="text-sm font-bold text-cyan-400">{trx.product_name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Quantity: <span className="text-white font-black">{trx.quantity}</span></p>
                      </td>
                      <td className="p-5 text-right">
                        <p className="text-sm font-black text-emerald-400">₹{parseFloat(trx.total_value).toLocaleString()}</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">@ ₹{parseFloat(trx.sale_price).toLocaleString()}/unit</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-[2rem] p-6 h-fit shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="text-emerald-400 w-4 h-4" /> Authorized Distributors
            </h3>
            <div className="space-y-4">
              {distributors.filter(u => u.is_active === 1).length === 0 ? (
                <p className="text-slate-500 text-[10px] text-center p-4 font-black uppercase tracking-widest">No active nodes.</p>
              ) : distributors.filter(u => u.is_active === 1).map(u => (
                <div key={u.id} className="p-5 bg-slate-950/60 border border-slate-800 rounded-[1rem] flex justify-between items-center hover:border-emerald-500/50 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-white">{u.name}</p>
                    <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-1">{u.store_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-cyan-400">{u.total_sales} Trx</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
