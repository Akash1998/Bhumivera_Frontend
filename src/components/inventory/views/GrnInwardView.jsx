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
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative min-w-[220px] max-w-md flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search GRN #, Supplier, Invoice #..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewSupplier}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition shrink-0"
          >
            <UserCheck className="w-4 h-4" /> Add Supplier
          </button>
          <button
            onClick={onOpenNewGrn}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm shrink-0"
          >
            <PackagePlus className="w-4 h-4" /> Post GRN Inward
          </button>
        </div>
      </div>

      {/* GRN Entries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">GRN # & Date</th>
                <th className="px-4 py-3">Supplier Name</th>
                <th className="px-4 py-3">Supplier Invoice #</th>
                <th className="px-4 py-3 text-center">Received Units</th>
                <th className="px-4 py-3 text-right">Inward Value</th>
                <th className="px-4 py-3 text-right">Receiver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGrn.length > 0 ? (
                filteredGrn.map((grn, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {grn.grnNo || grn.grn_number || `GRN-${idx + 1}`}
                      <div className="text-[10px] font-sans font-normal text-slate-400">
                        {grn.createdAt || grn.created_at ? new Date(grn.createdAt || grn.created_at).toLocaleDateString() : 'Recent'}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {grn.supplierName || grn.supplier_name || 'Herbal Manufacturer'}
                    </td>

                    <td className="px-4 py-3 font-mono text-slate-600">
                      {grn.invoiceNo || grn.supplier_invoice_number || 'INV-MGP/26-27'}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {grn.totalQuantity || grn.total_units_received || 0} units
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      ₹{(Number(grn.totalAmount || grn.total_invoice_amount) || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="px-4 py-3 text-right text-slate-500 font-mono text-[11px]">
                      @{grn.receivedBy || grn.created_by || 'keeper'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    <PackagePlus className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No Goods Received Notes (GRN) logged yet.
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
