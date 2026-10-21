import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  ShieldCheck,
  RefreshCw,
  Store,
  Download,
  Search,
  Package,
  TrendingUp,
  Users,
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function WarehouseAdmin() {
  const [sales, setSales] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [storeFilter, setStoreFilter] = useState('all');
  const { showToast } = useToast() || {};

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchSafe = async (url, fallback) => {
        try {
          const res = await api.get(url);
          return res.data;
        } catch {
          return fallback;
        }
      };

      const transData = await fetchSafe('/warehouse/admin/sales', { sales: [] });
      const usersData = await fetchSafe('/warehouse/admin/users', { users: [] });

      setSales(transData.sales || []);
      setDistributors(usersData.users || []);
    } catch {
      showToast?.('Matrix sync failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const storesList = useMemo(
    () => Array.from(new Set(sales.map(s => s.store_name).filter(Boolean))),
    [sales]
  );

  const filteredSales = useMemo(() => {
    return sales.filter(trx => {
      if (storeFilter !== 'all' && trx.store_name !== storeFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      return (
        String(trx.distributor_name || '').toLowerCase().includes(q) ||
        String(trx.store_name || '').toLowerCase().includes(q) ||
        String(trx.product_name || '').toLowerCase().includes(q)
      );
    });
  }, [sales, storeFilter, searchQuery]);

  const kpis = useMemo(() => {
    let totalGross = 0;
    let totalUnits = 0;
    filteredSales.forEach(s => {
      totalGross += Number(s.total_value || 0);
      totalUnits += Number(s.quantity || 0);
    });
    return {
      txCount: filteredSales.length,
      totalUnits,
      totalGross,
      activeDistributors: distributors.filter(u => u.is_active === 1).length,
    };
  }, [filteredSales, distributors]);

  const handleExportWarehouseCsv = () => {
    const headers = [
      'Transaction ID',
      'Sold Date',
      'Sold Time',
      'Distributor Name',
      'Store / Hub Name',
      'Product Dispatched',
      'Quantity Dispatched',
      'Unit Sale Price (INR)',
      'Est. GST (5%)',
      'Total Transaction Value (INR)',
    ];
    const escapeCell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = filteredSales.map(trx => {
      const totalVal = Number(trx.total_value || 0);
      const estTax = Number((totalVal - totalVal / 1.05).toFixed(2));
      return [
        trx.id,
        new Date(trx.sold_at).toLocaleDateString(),
        new Date(trx.sold_at).toLocaleTimeString(),
        trx.distributor_name || 'Unknown',
        trx.store_name || 'Primary Hub',
        trx.product_name || '',
        trx.quantity || 0,
        Number(trx.sale_price || 0).toFixed(2),
        estTax.toFixed(2),
        totalVal.toFixed(2),
      ]
        .map(escapeCell)
        .join(',');
    });
    const csv = `\uFEFF${headers.map(escapeCell).join(',')}\n${rows.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bhumivera-warehouse-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#081b15]/90 backdrop-blur-xl text-cyan-500 flex justify-center items-center font-black animate-pulse uppercase tracking-widest text-sm">
        Decrypting Global Matrix...
      </div>
    );

  return (
    <div className="space-y-6 text-slate-300 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              Warehouse <span className="text-cyan-500">Command Center</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Live Global B2B &amp; Hub Dispatch Telemetry (10-Column Expanded Ledger)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportWarehouseCsv}
              className="px-4 py-2.5 bg-emerald-500/15 border border-emerald-400/30 rounded-xl text-xs font-bold text-emerald-200 hover:bg-emerald-500/25 flex items-center gap-2"
            >
              <Download size={15} />
              Export 10-Col Dispatch CSV
            </button>
            <button
              onClick={loadData}
              className="p-3 bg-[#10241f]/85 backdrop-blur-xl border border-slate-800 rounded-xl hover:text-cyan-400 transition-colors shadow-lg"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* 4-Card Warehouse Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-[#10241f]/60 p-4">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Activity size={13} className="text-cyan-400" /> Dispatch Transactions
            </span>
            <strong className="text-2xl font-black text-white">{kpis.txCount}</strong>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-[#10241f]/60 p-4">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Package size={13} className="text-emerald-400" /> Total Units Dispatched
            </span>
            <strong className="text-2xl font-black text-emerald-300">{kpis.totalUnits}</strong>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-[#10241f]/60 p-4">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <TrendingUp size={13} className="text-[#d4af37]" /> Gross Dispatch Value
            </span>
            <strong className="text-2xl font-black text-[#d4af37]">
              ₹{kpis.totalGross.toLocaleString('en-IN')}
            </strong>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-[#10241f]/60 p-4">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Users size={13} className="text-purple-400" /> Active Distributors
            </span>
            <strong className="text-2xl font-black text-purple-300">{kpis.activeDistributors}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#10241f]/45 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 bg-[#081b15]/55 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Activity className="text-purple-400 w-4 h-4" /> Live Transaction Ledger
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search distributor or product…"
                    className="rounded-xl border border-slate-700 bg-black/40 pl-8 pr-3 py-1.5 text-xs text-white"
                  />
                </div>
                <select
                  value={storeFilter}
                  onChange={e => setStoreFilter(e.target.value)}
                  className="rounded-xl border border-slate-700 bg-black/40 px-3 py-1.5 text-xs text-white"
                >
                  <option value="all">All Stores / Hubs</option>
                  {storesList.map(st => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto h-[600px] custom-scrollbar">
              <table className="w-full min-w-[780px] text-left border-collapse">
                <thead className="bg-[#081b15]/80 border-b border-slate-800 sticky top-0 backdrop-blur-md">
                  <tr>
                    <th className="p-4 text-[9px] font-black uppercase text-slate-500 tracking-widest">Tx ID</th>
                    <th className="p-4 text-[9px] font-black uppercase text-slate-500 tracking-widest">Timestamp</th>
                    <th className="p-4 text-[9px] font-black uppercase text-slate-500 tracking-widest">
                      Distributor &amp; Store
                    </th>
                    <th className="p-4 text-[9px] font-black uppercase text-slate-500 tracking-widest">
                      Product Dispatched
                    </th>
                    <th className="p-4 text-[9px] font-black uppercase text-slate-500 tracking-widest text-right">
                      Qty
                    </th>
                    <th className="p-4 text-[9px] font-black uppercase text-slate-500 tracking-widest text-right">
                      Unit Rate
                    </th>
                    <th className="p-4 text-[9px] font-black uppercase text-slate-500 tracking-widest text-right">
                      Total Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredSales.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="p-10 text-center text-slate-500 text-[10px] font-black uppercase tracking-widest"
                      >
                        No data blocks found.
                      </td>
                    </tr>
                  ) : (
                    filteredSales.map(trx => (
                      <tr key={trx.id} className="hover:bg-cyan-500/5 transition-colors">
                        <td className="p-4 font-mono text-xs text-slate-400">#{trx.id}</td>
                        <td className="p-4">
                          <p className="text-xs font-bold text-slate-300">
                            {new Date(trx.sold_at).toLocaleDateString()}
                          </p>
                          <p className="text-[9px] font-mono text-slate-500 mt-0.5">
                            {new Date(trx.sold_at).toLocaleTimeString()}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-bold text-white">{trx.distributor_name || 'Unknown'}</p>
                          <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-0.5">
                            <Store className="w-3 h-3 inline" /> {trx.store_name}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-bold text-cyan-400">{trx.product_name}</p>
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-white">{trx.quantity}</td>
                        <td className="p-4 text-right font-mono text-xs text-slate-400">
                          ₹{parseFloat(trx.sale_price || 0).toLocaleString()}
                        </td>
                        <td className="p-4 text-right">
                          <p className="text-sm font-black text-emerald-400">
                            ₹{parseFloat(trx.total_value || 0).toLocaleString()}
                          </p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#10241f]/45 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] p-6 h-fit shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="text-emerald-400 w-4 h-4" /> Authorized Distributors
            </h3>
            <div className="space-y-4">
              {distributors.filter(u => u.is_active === 1).length === 0 ? (
                <p className="text-slate-500 text-[10px] text-center p-4 font-black uppercase tracking-widest">
                  No active access.
                </p>
              ) : (
                distributors
                  .filter(u => u.is_active === 1)
                  .map(u => (
                    <div
                      key={u.id}
                      className="p-5 bg-[#081b15]/65 backdrop-blur-xl border border-slate-800 rounded-[1rem] flex justify-between items-center hover:border-emerald-500/50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-bold text-white">{u.name}</p>
                        <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-1">
                          {u.store_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-cyan-400">{u.total_sales} Trx</p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
