import React, { useState, useMemo } from 'react';
import {
  Truck,
  CheckCircle2,
  Search,
  Layers,
  FileText,
  Package,
  Calendar,
  ExternalLink,
} from 'lucide-react';

const isShipmentReady = order =>
  ['shipped', 'out_for_delivery', 'delivered'].includes(String(order.status || '').toLowerCase()) &&
  Boolean(order.trackingNumber && order.trackingUrl && order.courier);

export default function ShippingLabelsView({
  orders = [],
  onOpenManifest,
  onBookCarrierLabel,
  carrierBookForm,
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

  const eligibleOrders = useMemo(() => labelOrders.filter(isShipmentReady), [labelOrders]);
  const selectedEligibleIds = selectedOrderIds.filter(id => eligibleOrders.some(order => order.id === id));

  const toggleSelect = (id) => {
    setSelectedOrderIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedEligibleIds.length === eligibleOrders.length && eligibleOrders.length > 0) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(eligibleOrders.map(o => o.id));
    }
  };

  const handleCreateManifest = () => {
    if (selectedEligibleIds.length === 0) return;
    onOpenManifest(selectedEligibleIds, carrierFilter === 'ALL' ? 'Delhivery & Shiprocket' : carrierFilter);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150 w-full max-w-full overflow-x-hidden">
      {/* Top Controls */}
      <div className="bg-[#0c261b] p-4 rounded-2xl border border-emerald-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          <div className="relative min-w-[220px] max-w-md flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by Order #, Recipient, AWB, Pincode..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#071711] text-white border border-emerald-500/40 rounded-xl focus:border-emerald-400 focus:outline-none font-medium placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full scrollbar-thin">
            {['ALL', 'delhivery', 'shiprocket'].map((c) => (
              <button
                key={c}
                onClick={() => setCarrierFilter(c)}
                className={`px-3 py-1.5 rounded-xl text-xs uppercase font-bold transition ${
                  carrierFilter === c
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                    : 'bg-[#071711] text-slate-300 hover:text-white hover:bg-emerald-950/50 border border-emerald-500/25'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {selectedEligibleIds.length > 0 && (
            <>
              <button
                onClick={handleCreateManifest}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black uppercase bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-xl shadow-sm transition"
              >
                <FileText className="w-4 h-4 text-emerald-400" /> Generate Manifest ({selectedEligibleIds.length})
              </button>
            </>
          )}
        </div>
      </div>

      {/* Shipping Labels Table */}
      <div className="bg-[#0c261b] rounded-2xl border border-emerald-500/30 shadow-xl overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead className="bg-[#071711] text-emerald-300 uppercase font-bold text-[10px] tracking-wider border-b border-emerald-500/30">
              <tr>
                <th className="px-4 py-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={eligibleOrders.length > 0 && selectedEligibleIds.length === eligibleOrders.length}
                    disabled={eligibleOrders.length === 0}
                    onChange={handleSelectAll}
                    className="rounded border-emerald-500/50 text-emerald-600 focus:ring-emerald-500 bg-[#071711] w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3">Order Number</th>
                <th className="px-4 py-3">Recipient &amp; Destination</th>
                <th className="px-4 py-3">Carrier &amp; Tracking</th>
                <th className="px-4 py-3 text-center">Carrier Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/15">
              {labelOrders.length > 0 ? (
                labelOrders.map((order) => {
                  const isSelected = selectedEligibleIds.includes(order.id);
                  const hasLabel = (order.shippingLabels || []).some(label => label.status === 'booked' && label.label_url);
                  const shipmentReady = isShipmentReady(order);

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-emerald-950/30 transition ${
                        isSelected ? 'bg-emerald-950/50' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(order.id)}
                          disabled={!shipmentReady}
                          className="rounded border-emerald-500/50 text-emerald-600 focus:ring-emerald-500 bg-[#071711] w-4 h-4 cursor-pointer"
                        />
                      </td>

                      <td className="px-4 py-3 font-mono font-bold text-white">
                        {order.orderNumber}
                        <div className="text-[10px] text-slate-300 font-sans">
                          {order.items?.length || 1} SKU(s) • ₹{order.total} • HSN: 30049011
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{order.customerName}</div>
                        <div className="text-[10px] text-slate-300">{order.city}, {order.state} ({order.pincode})</div>
                      </td>

                      <td className="px-4 py-3 font-mono">
                        {order.trackingNumber ? (
                          <div>
                            <span className="font-bold text-emerald-300 text-xs">{order.trackingNumber}</span>
                            <div className="text-[10px] text-slate-400 capitalize">{order.courier || 'Express'}</div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No AWB assigned</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {hasLabel ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Label ready
                          </span>
                        ) : (
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            shipmentReady
                              ? 'bg-sky-500/20 text-sky-200 border-sky-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}>
                            {shipmentReady ? 'Shipment details saved' : 'Awaiting shipment'}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {hasLabel ? (
                          <a href={order.shippingLabels.find(label => label.status === 'booked' && label.label_url)?.label_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 hover:text-white">
                            <ExternalLink size={12} /> Open shipping document
                          </a>
                        ) : shipmentReady ? (
                          <button
                            type="button"
                            onClick={() => onBookCarrierLabel(order.id, {
                              provider: carrierFilter === 'ALL' ? 'shiprocket' : carrierFilter.toLowerCase(),
                              ...carrierBookForm,
                            })}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-black text-white hover:bg-emerald-500"
                          >
                            Generate shipping PDF
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">Add shipment tracking first</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-300">
                    <Truck className="w-8 h-8 mx-auto text-emerald-400/60 mb-2" />
                    No orders matching shipping label criteria.
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
