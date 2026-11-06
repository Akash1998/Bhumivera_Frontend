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
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order #, Customer, Phone, AWB, SKU..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['ALL', 'DISPATCH', 'pending', 'packed', 'shipped', 'delivered', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition ${
                  statusFilter === st
                    ? 'bg-white text-indigo-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
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
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {selectedOrderIds.length > 0 && (
            <button
              onClick={handleLaunchWave}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-sm transition animate-in zoom-in-95"
            >
              <Layers className="w-4 h-4" /> Wave Picklist ({selectedOrderIds.length})
            </button>
          )}
          <button
            onClick={onRefresh}
            disabled={syncing}
            className="p-2 text-slate-500 hover:text-indigo-600 border border-slate-300 rounded-xl hover:bg-slate-50 transition"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedOrderIds.length > 0 && selectedOrderIds.length === filteredOrders.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3">Order # & Date</th>
                <th className="px-4 py-3">Customer & Location</th>
                <th className="px-4 py-3">Line Items & FEFO Guidance</th>
                <th className="px-4 py-3">Carrier / AWB</th>
                <th className="px-4 py-3 text-center">Lifecycle Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const isSelected = selectedOrderIds.includes(order.id);

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isSelected ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOrder(order.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      {/* Order Number & Timestamp */}
                      <td className="px-4 py-3">
                        <div className="font-mono font-bold text-slate-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(order.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </div>
                        <div className="mt-1">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            order.paymentMode === 'cod'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {order.paymentMode} • ₹{order.total}
                          </span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{order.customerName}</div>
                        <div className="text-[10px] text-slate-500">{order.customerPhone}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{order.city || 'Asansol'}, {order.state || 'WB'} {order.pincode ? `(${order.pincode})` : ''}</span>
                        </div>
                      </td>

                      {/* Line Items & FEFO guidance */}
                      <td className="px-4 py-3">
                        <div className="space-y-1 max-w-sm">
                          {order.items?.map((it, iIdx) => (
                            <div key={iIdx} className="text-[11px] text-slate-700 flex items-center justify-between bg-slate-50 px-2 py-1 rounded">
                              <span className="font-medium truncate mr-2">{it.name}</span>
                              <span className="font-mono font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">
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
                            <div className="font-bold text-indigo-700 font-mono text-[11px]">
                              {order.trackingNumber}
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium capitalize">
                              {order.courier || 'Express'}
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
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'shipped'
                              ? 'bg-indigo-100 text-indigo-800'
                              : order.status === 'packed'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'confirmed'
                              ? 'bg-cyan-100 text-cyan-800'
                              : order.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
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
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                              title="Scan-to-Verify & Box Order"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" /> Scan & Pack
                            </button>
                          )}

                          {['packed', 'shipped', 'delivered'].includes(order.status) && (
                            <button
                              onClick={() => onOpenThermalLabel(order)}
                              className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                              title="Print 4×6″ Thermal Courier Label"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          )}

                          {order.status === 'packed' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'shipped')}
                              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition"
                            >
                              Handover (Ship)
                            </button>
                          )}

                          {order.status === 'shipped' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                            >
                              Mark Delivered
                            </button>
                          )}

                          {order.status === 'rto_delivered' && (
                            <button
                              onClick={() => onOpenReturnQc(order)}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition"
                            >
                              <RotateCcw className="w-3 h-3" /> QC Inspection
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No orders matching selected criteria.
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
