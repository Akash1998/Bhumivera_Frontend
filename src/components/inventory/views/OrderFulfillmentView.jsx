import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Truck,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Package,
  Layers,
  MapPin,
  ExternalLink,
  RotateCcw,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { localOrderDate } from '../../../utils/inventoryOrderFilters';

export default function OrderFulfillmentView({
  orders = [],
  onUpdateOrderStatus,
  onOpenPackingVerify,
  onOpenThermalLabel,
  onOpenWavePicklist,
  onOpenReturnQc,
  syncing,
  onRefresh,
  onOpenPackageFinder,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return orders.filter(o => {
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'DISPATCH'
          ? ['pending', 'confirmed', 'packed'].includes(o.status)
          : o.status === statusFilter);

      const matchesDate = !dateFilter || localOrderDate(o.createdAt) === dateFilter;

      const matchesQuery =
        !term ||
        [
          o.orderNumber,
          o.id,
          o.customerName,
          o.customerPhone,
          o.city,
          o.state,
          o.pincode,
          o.trackingNumber,
          o.courier,
          ...(o.items || []).map(i => i.name),
        ].some(val => String(val ?? '').toLowerCase().includes(term));

      return matchesStatus && matchesDate && matchesQuery;
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const toggleSelectOrder = (id) => {
    setSelectedOrderIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    }
  };

  const handleLaunchWave = () => {
    if (selectedOrderIds.length === 0) return;
    onOpenWavePicklist(selectedOrderIds);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150 w-full max-w-full overflow-x-hidden">
      {/* Top Controls Bar */}
      <div className="bg-[#0c261b] p-4 rounded-2xl border border-emerald-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order #, Customer, Phone, AWB, SKU..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#071711] text-white border border-emerald-500/40 rounded-xl focus:border-emerald-400 focus:outline-none font-medium placeholder-slate-400"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full scrollbar-thin">
            {['ALL', 'DISPATCH', 'pending', 'packed', 'shipped', 'delivered', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap capitalize transition font-bold ${
                  statusFilter === st
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                    : 'bg-[#071711] text-slate-300 hover:text-white hover:bg-emerald-950/50 border border-emerald-500/25'
                }`}
              >
                {st === 'DISPATCH' ? 'To Pack/Ship' : st}
              </button>
            ))}
          </div>

          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#071711] text-white border border-emerald-500/40 rounded-xl font-medium focus:border-emerald-400 focus:outline-none"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-emerald-300 hover:text-white underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenPackageFinder && (
            <button
              onClick={onOpenPackageFinder}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-teal-200 bg-teal-950/60 hover:bg-teal-900 border border-teal-500/50 rounded-xl transition shadow"
              title="Search lost or misplaced packages by parcel barcode"
            >
              <Package className="w-4 h-4 text-teal-300" />
              Package Finder
            </button>
          )}

          {selectedOrderIds.length > 0 && (
            <button
              onClick={handleLaunchWave}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl shadow-lg transition animate-in zoom-in-95"
            >
              <Layers className="w-4 h-4" /> Wave Picklist ({selectedOrderIds.length})
            </button>
          )}
          <button
            onClick={onRefresh}
            disabled={syncing}
            className="p-2 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl hover:bg-emerald-950/40 transition"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0c261b] rounded-2xl border border-emerald-500/30 shadow-xl overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead className="bg-[#071711] text-emerald-300 uppercase font-bold text-[10px] tracking-wider border-b border-emerald-500/30">
              <tr>
                <th className="px-4 py-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredOrders.length > 0 &&
                      selectedOrderIds.length === filteredOrders.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-emerald-500/50 text-emerald-600 focus:ring-emerald-500 bg-[#071711] w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3">Order # &amp; Date</th>
                <th className="px-4 py-3">Customer &amp; Address</th>
                <th className="px-4 py-3">Line Items &amp; HSN</th>
                <th className="px-4 py-3">Carrier &amp; Tracking</th>
                <th className="px-4 py-3 text-center">Dispatch Status</th>
                <th className="px-4 py-3 text-right">Fulfillment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/15">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const isSelected = selectedOrderIds.includes(order.id);

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-emerald-950/30 transition ${
                        isSelected ? 'bg-emerald-950/50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOrder(order.id)}
                          className="rounded border-emerald-500/50 text-emerald-600 focus:ring-emerald-500 bg-[#071711] w-4 h-4 cursor-pointer"
                        />
                      </td>

                      {/* Order Number & Timestamp */}
                      <td className="px-4 py-3">
                        <div className="font-mono font-black text-sm text-white tracking-wide">
                          {order.orderNumber}
                        </div>
                        <div className="text-[10px] text-slate-300 mt-0.5">
                          {new Date(order.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </div>
                        <div className="mt-1">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                            order.paymentMode === 'cod'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {order.paymentMode} • ₹{order.total}
                          </span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{order.customerName}</div>
                        <div className="text-[10px] text-slate-300 font-mono">{order.customerPhone}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{order.city || 'Asansol'}, {order.state || 'WB'} {order.pincode ? `(${order.pincode})` : ''}</span>
                        </div>
                      </td>

                      {/* Line Items & FEFO guidance */}
                      <td className="px-4 py-3">
                        <div className="space-y-1.5 max-w-sm">
                          {order.items?.map((it, iIdx) => (
                            <div key={iIdx} className="text-[11px] text-slate-200 flex items-center justify-between bg-[#071711] px-2.5 py-1 rounded-lg border border-emerald-500/20">
                              <div className="flex-1 mr-2 min-w-0">
                                <span className="font-medium truncate block text-white">{it.name}</span>
                                <span className="text-[9px] font-mono text-emerald-400 font-bold">HSN: {it.gstHsnCode || '30049011'}</span>
                              </div>
                              <span className="font-mono font-bold text-white bg-[#0c261b] px-1.5 py-0.5 rounded border border-emerald-500/30 shrink-0">
                                ×{it.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Carrier & AWB */}
                      <td className="px-4 py-3">
                        {order.trackingNumber ? (
                          <div>
                            <div className="font-bold text-emerald-300 font-mono text-[11px]">
                              {order.trackingNumber}
                            </div>
                            <div className="text-[10px] text-slate-300 font-medium capitalize">
                              {order.courier || 'Express Handover'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No AWB assigned yet</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            order.status === 'delivered'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : order.status === 'shipped'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                              : order.status === 'packed'
                              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                              : order.status === 'confirmed'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : order.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => onOpenPackingVerify(order)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-black uppercase tracking-wider transition shadow-sm"
                              title="Scan-to-Verify & Box Order"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" /> Scan &amp; Pack
                            </button>
                          )}

                          {['packed', 'shipped', 'delivered'].includes(order.status) && (
                            <button
                              onClick={() => onOpenThermalLabel(order)}
                              className="p-1.5 text-slate-300 hover:text-white hover:bg-emerald-800/40 rounded-lg transition"
                              title="Print 4×6″ Thermal Courier Label"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          )}

                          {order.status === 'packed' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'shipped')}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition"
                            >
                              Handover (Ship)
                            </button>
                          )}

                          {order.status === 'shipped' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
                            >
                              Mark Delivered
                            </button>
                          )}

                          {['shipped', 'delivered'].includes(order.status) && (
                            <button
                              onClick={() => onOpenReturnQc(order)}
                              className="p-1.5 text-slate-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition"
                              title="Initiate RTO Return & QC Grading"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-300">
                    <Truck className="w-8 h-8 mx-auto text-emerald-400/60 mb-2" />
                    No orders matching search filter.
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
