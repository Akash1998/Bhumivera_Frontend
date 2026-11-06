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
        HSNCode: i.gstHsnCode || '30049011',
        GSTRate: `${i.gstRate || 5}%`,
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
      m.productName?.toLowerCase().includes(q) ||
      m.type?.toLowerCase().includes(q) ||
      m.movement_type?.toLowerCase().includes(q) ||
      m.reason?.toLowerCase().includes(q)
    );
  });

  const filteredLogs = logs.filter(l => {
    const q = searchTerm.trim().toLowerCase();
    return (
      !q ||
      l.user?.toLowerCase().includes(q) ||
      l.action?.toLowerCase().includes(q) ||
      l.act?.toLowerCase().includes(q) ||
      l.msg?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-150 w-full max-w-full overflow-x-hidden">
      {/* Top Header */}
      <div className="bg-[#0c261b] p-4 rounded-2xl border border-emerald-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          <div className="flex bg-[#071711] border border-emerald-500/30 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('movements')}
              className={`px-3.5 py-1.5 rounded-lg transition font-bold ${
                activeTab === 'movements'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Stock Movements ({movements.length})
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3.5 py-1.5 rounded-lg transition font-bold ${
                activeTab === 'logs'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Audit Trail ({logs.length})
            </button>
          </div>

          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search history & audit..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#071711] text-white border border-emerald-500/40 rounded-xl focus:border-emerald-400 focus:outline-none placeholder-slate-400 font-medium"
            />
          </div>
        </div>

        <button
          onClick={handleExportExcel}
          disabled={exporting}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-emerald-950/50 disabled:opacity-50 shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" />
          {exporting ? 'Exporting...' : 'Export Master Excel (with HSN)'}
        </button>
      </div>

      {/* Movements Table */}
      {activeTab === 'movements' && (
        <div className="bg-[#0c261b] rounded-2xl border border-emerald-500/30 shadow-xl overflow-hidden w-full max-w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-[#071711] text-emerald-300 uppercase font-bold text-[10px] tracking-wider border-b border-emerald-500/30">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Movement Type</th>
                  <th className="px-4 py-3 text-center">Quantity Delta</th>
                  <th className="px-4 py-3">Reason / Details</th>
                  <th className="px-4 py-3 text-right">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/15">
                {filteredMovements.map((m, idx) => (
                  <tr key={idx} className="hover:bg-emerald-950/30 transition">
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-300">
                      {m.date || m.created_at ? new Date(m.date || m.created_at).toLocaleString() : 'Recent'}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-300">{m.sku}</td>
                    <td className="px-4 py-3 font-semibold text-white">
                      <span className="bg-[#071711] border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-slate-200">
                        {m.type || m.movement_type || 'ADJUST'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-black text-sm">
                      <span className={Number(m.qty || m.delta) > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {Number(m.qty || m.delta) > 0 ? `+${m.qty || m.delta}` : m.qty || m.delta}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 max-w-xs truncate">{m.reason || m.notes || 'Warehouse Operation'}</td>
                    <td className="px-4 py-3 text-right text-slate-400 font-mono text-[11px]">
                      @{m.user || m.operator || 'admin'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Trail Table */}
      {activeTab === 'logs' && (
        <div className="bg-[#0c261b] rounded-2xl border border-emerald-500/30 shadow-xl overflow-hidden w-full max-w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-[#071711] text-emerald-300 uppercase font-bold text-[10px] tracking-wider border-b border-emerald-500/30">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Actor &amp; Role</th>
                  <th className="px-4 py-3">Action Code</th>
                  <th className="px-4 py-3">Event Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/15">
                {filteredLogs.map((l, idx) => (
                  <tr key={idx} className="hover:bg-emerald-950/30 transition">
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-300">
                      {l.t ? new Date(l.t).toLocaleString() : 'Recent'}
                    </td>
                    <td className="px-4 py-3 font-mono text-emerald-300 font-bold">
                      @{l.user} ({l.role || 'Staff'})
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-[#071711] border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-white">
                        {l.act || l.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-200">{l.msg || l.details}</td>
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
