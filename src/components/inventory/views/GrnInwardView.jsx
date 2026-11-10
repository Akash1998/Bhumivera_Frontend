import React, { useState } from 'react';
import {
  PackagePlus,
  Search,
  Plus,
  Truck,
  Calendar,
  FileText,
  UserCheck,
} from 'lucide-react';

export default function GrnInwardView({
  grnEntries = [],
  suppliers = [],
  onOpenNewGrn,
  onOpenNewSupplier,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGrn = grnEntries.filter(g => {
    const q = searchTerm.trim().toLowerCase();
    return (
      !q ||
      g.grnNo?.toLowerCase().includes(q) ||
      g.grn_number?.toLowerCase().includes(q) ||
      g.supplierName?.toLowerCase().includes(q) ||
      g.supplier_name?.toLowerCase().includes(q) ||
      g.invoiceNo?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-150 w-full max-w-full overflow-x-hidden">
      {/* Controls Bar */}
      <div className="bg-[#0c261b] p-4 rounded-2xl border border-emerald-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative min-w-[220px] max-w-md flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search GRN #, Supplier Lab, Invoice #..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#071711] text-white border border-emerald-500/40 rounded-xl focus:border-emerald-400 focus:outline-none font-medium placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenNewSupplier}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" /> Add Supplier
          </button>
          <button
            onClick={onOpenNewGrn}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-emerald-950/50"
          >
            <PackagePlus className="w-4 h-4" /> Post GRN Inward
          </button>
        </div>
      </div>

      {/* GRN Entries Table */}
      <div className="bg-[#0c261b] rounded-2xl border border-emerald-500/30 shadow-xl overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-[#071711] text-emerald-300 uppercase font-bold text-[10px] tracking-wider border-b border-emerald-500/30">
              <tr>
                <th className="px-4 py-3">GRN # &amp; Date</th>
                <th className="px-4 py-3">Supplier / Formulation Lab</th>
                <th className="px-4 py-3">Manufacturer Invoice #</th>
                <th className="px-4 py-3 text-center">Received Units</th>
                <th className="px-4 py-3 text-right">Inward Value</th>
                <th className="px-4 py-3 text-right">Receiver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/15">
              {filteredGrn.length > 0 ? (
                filteredGrn.map((grn, idx) => (
                  <tr key={idx} className="hover:bg-emerald-950/30 transition">
                    <td className="px-4 py-3 font-mono font-bold text-white">
                      {grn.grnNo || grn.grn_number || `GRN-${idx + 1}`}
                      <div className="text-[10px] font-sans font-normal text-slate-300">
                        {grn.createdAt || grn.created_at ? new Date(grn.createdAt || grn.created_at).toLocaleDateString() : 'Recent'}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-200">
                      {grn.supplierName || grn.supplier_name || 'Ayurvedic Formulations Lab'}
                    </td>

                    <td className="px-4 py-3 font-mono text-emerald-300">
                      {grn.invoiceNo || grn.supplier_invoice_number || 'INV-MGP/26-27'}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-black font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {grn.totalQuantity || grn.total_units_received || 0} units
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-black text-white text-sm">
                      ₹{(Number(grn.totalAmount || grn.total_invoice_amount) || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="px-4 py-3 text-right text-slate-300 font-mono text-[11px]">
                      @{grn.receivedBy || grn.created_by || 'keeper'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-300">
                    <PackagePlus className="w-8 h-8 mx-auto text-emerald-400/60 mb-2" />
                    No Goods Receipt Notes (GRN) inwarded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
