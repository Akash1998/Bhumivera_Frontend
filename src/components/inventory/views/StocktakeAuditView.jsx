import React, { useState } from 'react';
import {
  ClipboardCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  MapPin,
  Save,
} from 'lucide-react';

export default function StocktakeAuditView({
  items = [],
  onReconcileAudit,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [countedQuantities, setCountedQuantities] = useState({});
  const [auditNotes, setAuditNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredItems = items.filter(i => {
    const q = searchTerm.trim().toLowerCase();
    return (
      !q ||
      i.name?.toLowerCase().includes(q) ||
      i.sku?.toLowerCase().includes(q) ||
      i.binCode?.toLowerCase().includes(q) ||
      i.gstHsnCode?.includes(q)
    );
  });

  const handleCountChange = (sku, val) => {
    setCountedQuantities(prev => ({
      ...prev,
      [sku]: val === '' ? '' : Math.max(0, parseInt(val, 10) || 0),
    }));
  };

  const handleCommitAudit = async () => {
    const auditEntries = Object.entries(countedQuantities)
      .filter(([_, count]) => count !== '')
      .map(([sku, physicalCount]) => {
        const item = items.find(i => i.sku === sku);
        const systemStock = Number(item?.qty || item?.physicalStock) || 0;
        return {
          productId: item?.productId,
          metaId: item?.id,
          sku,
          systemStock,
          physicalStock: Number(physicalCount),
          variance: Number(physicalCount) - systemStock,
        };
      });

    if (auditEntries.length === 0) {
      alert('Please enter at least one counted quantity to reconcile.');
      return;
    }

    if (!window.confirm(`Reconcile stock balances for ${auditEntries.length} formulation(s)? This will update live website inventory.`)) {
      return;
    }

    setLoading(true);
    try {
      await onReconcileAudit({ auditEntries, notes: auditNotes });
      setCountedQuantities({});
      setAuditNotes('');
      alert('Stock audit reconciliation successfully recorded!');
    } catch (err) {
      alert(err.message || 'Audit reconciliation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150 w-full max-w-full overflow-x-hidden">
      {/* Top Banner */}
      <div className="bg-[#0c261b] p-5 rounded-2xl border border-emerald-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <ClipboardCheck className="w-3.5 h-3.5" /> Blind Cycle Count &amp; Stocktake Audit
            </span>
          </div>
          <h3 className="text-base font-black text-white mt-1 uppercase tracking-wide">
            Physical Warehouse Stock Verification &amp; Variance Resolution
          </h3>
          <p className="text-xs text-slate-300 mt-0.5 font-medium">
            Synchronizes physical shelf counts directly with products.quantity on bhumivera.com.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter SKUs for audit..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#071711] text-white border border-emerald-500/40 rounded-xl focus:border-emerald-400 focus:outline-none font-medium placeholder-slate-400"
            />
          </div>
          <button
            onClick={handleCommitAudit}
            disabled={loading || Object.keys(countedQuantities).length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-emerald-950/50 disabled:opacity-50 shrink-0"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Commit Reconciliation'}
          </button>
        </div>
      </div>

      {/* Stocktake Table */}
      <div className="bg-[#0c261b] rounded-2xl border border-emerald-500/30 shadow-xl overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[800px]">
            <thead className="bg-[#071711] text-emerald-300 uppercase font-bold text-[10px] tracking-wider border-b border-emerald-500/30">
              <tr>
                <th className="px-4 py-3">Product Formulation</th>
                <th className="px-4 py-3">SKU &amp; HSN</th>
                <th className="px-4 py-3">Bin Location</th>
                <th className="px-4 py-3 text-center">System Ledger Stock</th>
                <th className="px-4 py-3 text-center">Physical Count (Audited)</th>
                <th className="px-4 py-3 text-center">Discrepancy (Variance)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/15">
              {filteredItems.map((item) => {
                const sysStock = Number(item.qty ?? item.physicalStock) || 0;
                const counted = countedQuantities[item.sku];
                const hasCount = counted !== undefined && counted !== '';
                const variance = hasCount ? Number(counted) - sysStock : null;

                return (
                  <tr key={item.id} className="hover:bg-emerald-950/30 transition">
                    <td className="px-4 py-3 font-bold text-white">{item.name}</td>
                    <td className="px-4 py-3 font-mono">
                      <div className="text-emerald-300 font-bold">{item.sku}</div>
                      <div className="text-[10px] text-slate-400">HSN: {item.gstHsnCode || '30049011'}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-200">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{item.binCode || 'ASN-DEFAULT'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-black text-white text-sm">
                      {sysStock}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        value={counted ?? ''}
                        onChange={(e) => handleCountChange(item.sku, e.target.value)}
                        placeholder="Count..."
                        className="w-24 text-center font-mono font-black px-2 py-1 bg-[#071711] text-emerald-300 border border-emerald-500/40 rounded-lg text-xs focus:border-emerald-400 focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold">
                      {variance === null ? (
                        <span className="text-slate-400">—</span>
                      ) : variance === 0 ? (
                        <span className="text-emerald-400 font-black">0 (Exact)</span>
                      ) : variance > 0 ? (
                        <span className="text-teal-300 font-black">+{variance} (Surplus)</span>
                      ) : (
                        <span className="text-rose-400 font-black">{variance} (Shortage)</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
