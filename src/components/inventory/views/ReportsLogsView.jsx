import React, { useState } from 'react';
import {
  FileSpreadsheet,
  History,
  ShieldCheck,
  Search,
  Download,
  Calendar,
} from 'lucide-react';

export default function ReportsLogsView({
  movements = [],
  logs = [],
  items = [],
}) {
  const [activeTab, setActiveTab] = useState('movements');
  const [searchTerm, setSearchTerm] = useState('');
  const [exporting, setExporting] = useState(false);

  // Lazy Export to Excel
  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const XLSX = await import('xlsx');
      const wsData = items.map(i => ({
        SKU: i.sku,
        Barcode: i.barcode,
        Name: i.name,
        Category: i.cat,
        PhysicalStock: i.qty || i.physicalStock || 0,
        ShopStock: i.shopDisplayStock || 0,
        VaultStock: i.warehouseVaultStock || 0,
        BinCode: i.binCode || '',
        RackLocation: i.rackLocation || '',
        CostPrice: i.costPrice || 0,
        MRP: i.mrp || 0,
        SellingPrice: i.price || 0,
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'Inventory_Master');
      XLSX.writeFile(wb, `Bhumivera_Stock_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      alert('Failed to export to Excel: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const filteredMovements = movements.filter(m => {
    const q = searchTerm.trim().toLowerCase();
    return (
      !q ||
      m.sku?.toLowerCase().includes(q) ||
      m.type?.toLowerCase().includes(q) ||
      m.reason?.toLowerCase().includes(q)
    );
  });

  const filteredLogs = logs.filter(l => {
    const q = searchTerm.trim().toLowerCase();
    return (
      !q ||
      l.user?.toLowerCase().includes(q) ||
      l.action?.toLowerCase().includes(q) ||
      l.msg?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('movements')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                activeTab === 'movements'
                  ? 'bg-white text-indigo-700 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stock Movements ({movements.length})
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                activeTab === 'logs'
                  ? 'bg-white text-indigo-700 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Audit Trail ({logs.length})
            </button>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl font-medium"
            />
          </div>
        </div>

        <button
          onClick={handleExportExcel}
          disabled={exporting}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50 shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" />
          {exporting ? 'Exporting...' : 'Export Master Excel'}
        </button>
      </div>

      {/* Movements Table */}
      {activeTab === 'movements' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Movement Type</th>
                  <th className="px-4 py-3 text-center">Quantity Delta</th>
                  <th className="px-4 py-3">Reason / Details</th>
                  <th className="px-4 py-3 text-right">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMovements.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-400">
                      {m.date || m.created_at ? new Date(m.date || m.created_at).toLocaleString() : 'Recent'}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-800">{m.sku}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                        {m.type || m.movement_type || 'ADJUST'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold">
                      <span className={Number(m.qty || m.delta) > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {Number(m.qty || m.delta) > 0 ? `+${m.qty || m.delta}` : m.qty || m.delta}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-sm truncate">{m.reason || 'Manual inventory update'}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-500 text-[10px]">@{m.user || m.operator || 'system'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Logs Table */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Operator</th>
                  <th className="px-4 py-3">Action Code</th>
                  <th className="px-4 py-3">Event Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((l, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-400">
                      {l.time || l.created_at ? new Date(l.time || l.created_at).toLocaleString() : 'Recent'}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-indigo-700">@{l.user || 'system'}</td>
                    <td className="px-4 py-3">
                      <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono">
                        {l.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 max-w-md truncate">{l.msg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
