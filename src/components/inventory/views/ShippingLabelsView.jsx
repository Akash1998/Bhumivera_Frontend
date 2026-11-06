import React, { useState, useMemo } from 'react';
import {
  Printer,
  Truck,
  CheckCircle2,
  Search,
  Layers,
  FileText,
  Package,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export default function ShippingLabelsView({
  orders = [],
  onOpenThermalLabel,
  onOpenManifest,
  onMarkLabelsPrinted,
  onBookCarrierLabel,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [carrierFilter, setCarrierFilter] = useState('ALL');

  // Filter orders that need labels or already have labels
  const labelOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return orders.filter(o => {
      const matchCarrier = carrierFilter === 'ALL' || o.courier?.toLowerCase() === carrierFilter.toLowerCase();
      const matchQ =
        !q ||
        o.orderNumber?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.trackingNumber?.toLowerCase().includes(q) ||
        o.pincode?.includes(q);
      return matchCarrier && matchQ;
    });
  }, [orders, searchTerm, carrierFilter]);

  const toggleSelect = (id) => {
    setSelectedOrderIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrderIds.length === labelOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(labelOrders.map(o => o.id));
    }
  };

  const handleBulkPrint = () => {
    if (selectedOrderIds.length === 0) return;
    window.print();
    if (onMarkLabelsPrinted) {
      onMarkLabelsPrinted(selectedOrderIds);
    }
  };

  const handleCreateManifest = () => {
    if (selectedOrderIds.length === 0) return;
    onOpenManifest(selectedOrderIds, carrierFilter === 'ALL' ? 'Delhivery & Shiprocket' : carrierFilter);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[220px] max-w-md flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by Order #, Recipient, AWB, Pincode..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['ALL', 'delhivery', 'shiprocket'].map((c) => (
              <button
                key={c}
                onClick={() => setCarrierFilter(c)}
                className={`px-3 py-1.5 rounded-lg uppercase transition ${
                  carrierFilter === c
                    ? 'bg-white text-indigo-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex items-center gap-2">
          {selectedOrderIds.length > 0 && (
            <>
              <button
                onClick={handleBulkPrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition"
              >
                <Printer className="w-4 h-4" /> Bulk Print 4×6″ ({selectedOrderIds.length})
              </button>
              <button
                onClick={handleCreateManifest}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-slate-900 hover:bg-black text-white rounded-xl shadow-sm transition"
              >
                <FileText className="w-4 h-4" /> Generate Manifest ({selectedOrderIds.length})
              </button>
            </>
          )}
        </div>
      </div>

      {/* Shipping Labels Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedOrderIds.length > 0 && selectedOrderIds.length === labelOrders.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3">Order Number</th>
                <th className="px-4 py-3">Recipient & Address</th>
                <th className="px-4 py-3">Carrier & Tracking</th>
                <th className="px-4 py-3 text-center">Label Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {labelOrders.length > 0 ? (
                labelOrders.map((order) => {
                  const isSelected = selectedOrderIds.includes(order.id);
                  const hasLabel = Boolean(order.trackingNumber);

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isSelected ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(order.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {order.orderNumber}
                        <div className="text-[10px] text-slate-400 font-sans font-normal">
                          {order.items?.length || 1} SKU(s) • ₹{order.total}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{order.customerName}</div>
                        <div className="text-[11px] text-slate-500">
                          {order.city}, {order.state} - {order.pincode}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {hasLabel ? (
                          <div>
                            <div className="font-mono font-bold text-indigo-700">{order.trackingNumber}</div>
                            <div className="text-[10px] text-slate-500 uppercase">{order.courier || 'Express'}</div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Ready to Book
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {order.labelPrintedAt ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Printed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            Pending Print
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenThermalLabel(order)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                          >
                            <Printer className="w-3.5 h-3.5" /> 4×6″ Label
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    <Truck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No orders awaiting shipping labels.
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
