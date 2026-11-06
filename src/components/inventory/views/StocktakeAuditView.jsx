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
      i.binCode?.toLowerCase().includes(q)
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

    if (!window.confirm(`Reconcile stock balances for ${auditEntries.length} SKU(s)? This will adjust physical inventory.`)) {
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
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 flex items-center gap-1">
              <ClipboardCheck className="w-3.5 h-3.5" /> Blind Cycle Count & Stocktake Audit
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-1">
            Physical Warehouse Stock Verification & Variance Resolution
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter SKUs for audit..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>
          <button
            onClick={handleCommitAudit}
            disabled={loading || Object.keys(countedQuantities).length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50 shrink-0"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Commit Reconciliation'}
          </button>
        </div>
      </div>

      {/* Stocktake Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">SKU & Barcode</th>
                <th className="px-4 py-3">Bin Location</th>
                <th className="px-4 py-3 text-center">System Ledger Stock</th>
                <th className="px-4 py-3 text-center">Physical Count (Audited)</th>
                <th className="px-4 py-3 text-center">Discrepancy (Variance)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const sysStock = Number(item.qty ?? item.physicalStock) || 0;
                const counted = countedQuantities[item.sku];
                const hasCount = counted !== undefined && counted !== '';
                const variance = hasCount ? Number(counted) - sysStock : null;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-semibold text-slate-900">{item.name}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{item.sku}</td>
                    <td className="px-4 py-3 font-mono text-slate-700">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{item.binCode || 'ASN-DEFAULT'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-slate-800">
                      {sysStock}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        value={counted ?? ''}
                        onChange={(e) => handleCountChange(item.sku, e.target.value)}
                        placeholder="Count..."
                        className="w-24 text-center font-mono font-bold px-2 py-1 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold">
                      {variance === null ? (
                        <span className="text-slate-300">—</span>
                      ) : variance === 0 ? (
                        <span className="text-emerald-600">0 (Exact)</span>
                      ) : variance > 0 ? (
                        <span className="text-indigo-600">+{variance} (Surplus)</span>
                      ) : (
                        <span className="text-rose-600">{variance} (Shortage)</span>
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
