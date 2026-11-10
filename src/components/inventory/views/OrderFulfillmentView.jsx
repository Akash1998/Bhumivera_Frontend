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
  Eye,
  X,
} from 'lucide-react';
import { localOrderDate } from '../../../utils/inventoryOrderFilters';

export default function OrderFulfillmentView({
  orders = [],
  onUpdateOrderStatus,
  onOpenFulfillmentQr,
  onOpenWavePicklist,
  onOpenReturnQc,
  syncing,
  onRefresh,
  orderLocks = [],
  operatorName = 'Akash',
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [detailOrder, setDetailOrder] = useState(null);
  const [shippingOrder, setShippingOrder] = useState(null);
  const [shippingDetails, setShippingDetails] = useState({ courier: '', trackingNumber: '', trackingUrl: '' });

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
            {['ALL', 'DISPATCH', 'pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap capitalize transition font-bold ${
                  statusFilter === st
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                    : 'bg-[#071711] text-slate-300 hover:text-white hover:bg-emerald-950/50 border border-emerald-500/25'
                }`}
              >
                {st === 'DISPATCH' ? 'To Pack/Ship' : st === 'pending' ? 'placed' : st.replace(/_/g, ' ')}
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
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                            order.paymentMode === 'cod'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {order.paymentMode} • ₹{order.total}
                          </span>
                          {(order.lockedBy || orderLocks.find(l =>
                            l.status === 'LOCKED' &&
                            (!l.expiresAt || new Date(l.expiresAt).getTime() > Date.now()) &&
                            (l.orderKey === String(order.orderNumber).toUpperCase() || l.orderKey === String(order.id))
                          )) && !['delivered', 'cancelled', 'returned'].includes(order.status) && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-rose-500/25 text-rose-200 border border-rose-500/40">
                              In Progress: {order.lockedBy || orderLocks.find(l => l.status === 'LOCKED' && (l.orderKey === String(order.orderNumber).toUpperCase() || l.orderKey === String(order.id)))?.lockedBy}
                            </span>
                          )}
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
                            {order.trackingUrl && (
                              <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-[10px] text-sky-300 hover:text-white">
                                <ExternalLink size={11} /> Track parcel
                              </a>
                            )}
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
                              : order.status === 'out_for_delivery'
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                              : order.status === 'packed'
                              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                              : order.status === 'confirmed'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : order.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {order.status === 'pending' ? 'Placed' : order.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {['confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'].includes(order.status) && (
                            <button
                              onClick={() => onOpenFulfillmentQr(order)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-black uppercase tracking-wider transition shadow-sm"
                              title="Print the tax invoice and self-contained fulfillment QR"
                            >
                              <Printer className="w-3.5 h-3.5" /> Invoice / QR
                            </button>
                          )}

                          {order.status === 'pending' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'confirmed')}
                              className="px-2.5 py-1 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-xs font-bold transition"
                            >
                              Confirm
                            </button>
                          )}

                          {['packed', 'shipped'].includes(order.status) && (
                            <button
                              onClick={() => {
                                setShippingOrder(order);
                                setShippingDetails({
                                  courier: order.courier || '',
                                  trackingNumber: order.trackingNumber || '',
                                  trackingUrl: order.trackingUrl || '',
                                });
                              }}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition"
                            >
                              {order.status === 'packed' ? 'Add tracking & ship' : 'Edit shipment details'}
                            </button>
                          )}

                          {order.status === 'shipped' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'out_for_delivery')}
                              className="px-2.5 py-1 bg-sky-700 hover:bg-sky-600 text-white rounded-lg text-xs font-bold transition"
                            >
                              Out for delivery
                            </button>
                          )}

                          {order.status === 'out_for_delivery' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
                            >
                              Mark delivered
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setDetailOrder(order)}
                            className="rounded-lg border border-white/10 p-1.5 text-slate-300 hover:bg-white/10"
                            title="View full order details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {['shipped', 'out_for_delivery', 'delivered'].includes(order.status) && (
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

      {shippingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="shipping-details-title"
            onSubmit={async event => {
              event.preventDefault();
              const updated = await onUpdateOrderStatus(shippingOrder.id, 'shipped', shippingDetails);
              if (updated) setShippingOrder(null);
            }}
            className="w-full max-w-lg rounded-2xl border border-emerald-500/30 bg-[#0c261b] p-5 text-white shadow-2xl"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 id="shipping-details-title" className="text-lg font-black">Ship order #{shippingOrder.orderNumber}</h2>
                <p className="text-xs text-slate-400">Enter real courier details at handover. This triggers the shipment email and enables invoice PDF printing.</p>
              </div>
              <button type="button" aria-label="Close" onClick={() => setShippingOrder(null)} className="rounded-lg p-2 hover:bg-white/10"><X size={17} /></button>
            </div>
            <label className="mb-3 block text-xs text-slate-300">Courier partner
              <input required value={shippingDetails.courier} onChange={event => setShippingDetails({ ...shippingDetails, courier: event.target.value })} placeholder="e.g. Delhivery, Blue Dart" className="mt-1.5 min-h-11 w-full rounded-lg border border-white/10 bg-[#071711] px-3 text-sm text-white outline-none focus:border-emerald-400" />
            </label>
            <label className="block text-xs text-slate-300">Tracking / AWB number
              <input required value={shippingDetails.trackingNumber} onChange={event => setShippingDetails({ ...shippingDetails, trackingNumber: event.target.value })} placeholder="Enter the real courier AWB" className="mt-1.5 min-h-11 w-full rounded-lg border border-white/10 bg-[#071711] px-3 font-mono text-sm text-white outline-none focus:border-emerald-400" />
            </label>
            <label className="mt-3 block text-xs text-slate-300">Courier tracking link
              <input required type="url" inputMode="url" value={shippingDetails.trackingUrl} onChange={event => setShippingDetails({ ...shippingDetails, trackingUrl: event.target.value })} placeholder="https://courier.example/track/..." className="mt-1.5 min-h-11 w-full rounded-lg border border-white/10 bg-[#071711] px-3 text-sm text-white outline-none focus:border-emerald-400" />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setShippingOrder(null)} className="min-h-10 rounded-lg border border-white/15 px-4 text-sm font-bold">Cancel</button>
              <button type="submit" className="min-h-10 rounded-lg bg-indigo-500 px-4 text-sm font-black text-white">Save tracking &amp; mark shipped</button>
            </div>
          </form>
        </div>
      )}

      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="fulfillment-detail-title" className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-emerald-500/30 bg-[#0c261b] p-5 text-white shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-emerald-300">{detailOrder.invoiceNumber || `Order ${detailOrder.id}`}</p>
                <h2 id="fulfillment-detail-title" className="text-xl font-black">Order #{detailOrder.orderNumber}</h2>
                <p className="text-xs text-slate-400">Placed {detailOrder.createdAt ? new Date(detailOrder.createdAt).toLocaleString('en-IN') : '—'} · Updated {detailOrder.updatedAt ? new Date(detailOrder.updatedAt).toLocaleString('en-IN') : '—'}</p>
              </div>
              <button type="button" aria-label="Close details" onClick={() => setDetailOrder(null)} className="rounded-lg p-2 hover:bg-white/10"><X size={18} /></button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                <h3 className="mb-2 text-[10px] font-black uppercase tracking-wider text-emerald-300">Customer</h3>
                <strong>{detailOrder.customerName || 'Customer'}</strong>
                <p className="text-xs text-slate-300">{detailOrder.customerPhone || 'No phone'}</p>
                <p className="text-xs text-slate-400">{detailOrder.customerEmail || 'No email'}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/10 p-4 md:col-span-2">
                <h3 className="mb-2 text-[10px] font-black uppercase tracking-wider text-emerald-300">Delivery address</h3>
                <p className="text-sm">{detailOrder.fullFormattedAddress || detailOrder.shippingAddress || 'Address not available'}</p>
                {detailOrder.googleMapsUrl && <a href={detailOrder.googleMapsUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-sky-300 hover:underline"><MapPin size={13} /> Open map</a>}
              </div>
            </div>

            <div className="mb-5 rounded-xl border border-white/10 bg-black/10 p-4">
              <h3 className="mb-3 text-[10px] font-black uppercase tracking-wider text-emerald-300">Order lifecycle</h3>
              {detailOrder.status === 'cancelled' || detailOrder.status === 'returned' ? (
                <div className="rounded-lg bg-rose-400/10 p-3 text-sm font-bold capitalize">{detailOrder.status.replace(/_/g, ' ')}{detailOrder.cancelReason ? ` · ${detailOrder.cancelReason}` : ''}</div>
              ) : (
                <ol className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
                  {['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'].map((status, index) => {
                    const currentIndex = ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'].indexOf(detailOrder.status);
                    const completed = currentIndex >= index;
                    return <li key={status} className={`rounded-lg border p-3 ${completed ? 'border-emerald-400/40 bg-emerald-400/10' : 'border-white/10 bg-black/10'}`}>
                      <strong className={`block text-[10px] uppercase ${completed ? 'text-emerald-200' : 'text-slate-500'}`}>{status === 'pending' ? 'placed' : status.replace(/_/g, ' ')}</strong>
                      <span className="mt-1 block text-[10px] text-slate-400">{index === currentIndex ? 'Current status' : completed ? 'Completed' : 'Waiting'}</span>
                    </li>;
                  })}
                </ol>
              )}
              <p className="mt-3 text-xs text-slate-300">Checkpoint: {detailOrder.currentLocationCheckpoint || 'No carrier checkpoint recorded'}</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full min-w-[700px] text-left text-xs">
                <thead className="bg-black/20 text-[10px] uppercase text-emerald-300"><tr><th className="p-3">Product</th><th className="p-3">SKU / Barcode</th><th className="p-3">HSN / GST</th><th className="p-3 text-right">Qty</th><th className="p-3 text-right">Unit price</th><th className="p-3 text-right">Line total</th></tr></thead>
                <tbody className="divide-y divide-white/5">{(detailOrder.items || []).map(item => (
                  <tr key={item.id || item.orderItemId}>
                    <td className="p-3"><strong>{item.name}</strong><span className="block text-[10px] text-slate-400">Product ID: {item.productId || '—'}</span></td>
                    <td className="p-3 font-mono">{item.sku || '—'}<span className="block text-[10px] text-slate-400">{item.barcode || 'No barcode'}</span></td>
                    <td className="p-3">{item.gstHsnCode || '—'}<span className="block text-[10px] text-slate-400">{item.gstRate || 5}% GST</span></td>
                    <td className="p-3 text-right">{Number(item.quantity) || 1}</td>
                    <td className="p-3 text-right">₹{(Number(item.price) || 0).toFixed(2)}</td>
                    <td className="p-3 text-right">₹{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-black/10 p-4 text-xs leading-6">
                <p><strong>Payment:</strong> {detailOrder.paymentMode || '—'} · {detailOrder.paymentStatus || '—'}</p>
                <p><strong>Courier:</strong> {detailOrder.courier || 'Not assigned'}</p>
                <p><strong>Tracking/AWB:</strong> {detailOrder.trackingNumber || 'Not assigned yet'}</p>
                {detailOrder.trackingUrl && <p><strong>Tracking link:</strong> <a href={detailOrder.trackingUrl} target="_blank" rel="noreferrer" className="break-all text-sky-300 underline">{detailOrder.trackingUrl}</a></p>}
                <p><strong>Estimated delivery:</strong> {detailOrder.estimatedDeliveryDate || 'Not set'}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/10 p-4 text-right text-xs leading-6">
                <p>Subtotal: ₹{(Number(detailOrder.subtotal) || 0).toFixed(2)}</p>
                <p>Discount: -₹{(Number(detailOrder.discount) || 0).toFixed(2)}</p>
                <p>Shipping: ₹{(Number(detailOrder.shippingCost) || 0).toFixed(2)}</p>
                <p className="mt-1 border-t border-white/10 pt-2 text-base font-black text-emerald-200">Total: ₹{(Number(detailOrder.total) || 0).toFixed(2)}</p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
