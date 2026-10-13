import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  ShoppingBag, Truck, Package, CheckCircle, XCircle, AlertCircle, 
  Search, Filter, Download, RefreshCw, Eye, IndianRupee, 
  MapPin, User, CreditCard, ArrowRight, Printer, Activity,
  Clock, ShieldCheck, Mail, Phone, FileText, ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const STATUS_MAP = {
  'pending': { label: 'Pending', color: 'amber', icon: Clock },
  'confirmed': { label: 'Confirmed', color: 'blue', icon: CheckCircle },
  'packed': { label: 'Packed', color: 'cyan', icon: Package },
  'shipped': { label: 'Shipped / In Transit', color: 'purple', icon: Truck },
  'delivered': { label: 'Delivered', color: 'emerald', icon: CheckCircle },
  'cancelled': { label: 'Cancelled', color: 'rose', icon: XCircle },
  'returned': { label: 'Returned', color: 'slate', icon: AlertCircle },
  'archived': { label: 'Archived', color: 'slate', icon: Package }
};

const STATUS_BADGE = {
  amber: 'bg-amber-100 text-amber-800', blue: 'bg-blue-100 text-blue-800',
  cyan: 'bg-cyan-100 text-cyan-800', purple: 'bg-purple-100 text-purple-800',
  emerald: 'bg-emerald-100 text-emerald-800', rose: 'bg-rose-100 text-rose-800',
  slate: 'bg-slate-700/50 text-slate-200'
};
const STATUS_RANK = { pending: 0, confirmed: 1, packed: 2, shipped: 3, delivered: 4, cancelled: 5, returned: 5, archived: 6 };

// FIX: Dynamic 10-digit padding for professional Order IDs
const formatId = (id) => String(id).padStart(10, '0');

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [summary, setSummary] = useState({ totalOrders: 0, grossRevenue: 0, actionRequired: 0, inTransit: 0, completed: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 0 });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [reconcilingPayments, setReconcilingPayments] = useState(false);
  const [paymentReconciliation, setPaymentReconciliation] = useState(null);
  const [paymentReconciliationError, setPaymentReconciliationError] = useState('');
  
  // Tracking Form States
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('');
  const [trackingStatus, setTrackingStatus] = useState('shipped');
  const [shippingLabels, setShippingLabels] = useState([]);
  const [labelForm, setLabelForm] = useState({ provider: 'shiprocket', weight: '1', length: '20', width: '15', height: '10' });

  const { showToast } = useToast() || {};

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      setLoadError('');
      try {
        const res = await api.get('/orders/all', { params: {
          page: currentPage,
          limit: pagination.limit,
          search: searchTerm.trim() || undefined,
          status: statusFilter === 'all' ? undefined : statusFilter
        } });
        if (!active) return;
        setOrders(res.data?.orders || []);
        setPaymentReconciliation(null);
        setPaymentReconciliationError('');
        setSummary(res.data?.summary || { totalOrders: 0, grossRevenue: 0, actionRequired: 0, inTransit: 0, completed: 0 });
        setPagination(current => ({ ...current, ...(res.data?.pagination || {}) }));
      } catch (err) {
        if (active) setLoadError(err.normalized?.message || err.response?.data?.message || 'Failed to load orders.');
      } finally {
        if (active) setLoading(false);
      }
    }, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [searchTerm, statusFilter, currentPage, pagination.limit, refreshKey]);

  const getImageUrl = (img) => {
    if (!img) return '/logo.webp';
    let path = typeof img === 'object' ? (img.file_path || img.url || img.path) : img;
    if (!path) return '/logo.webp';
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-22cd43cce9bc475680ad496e199706c4.r2.dev';
    return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (['cancelled', 'returned'].includes(newStatus) && !window.confirm(`Mark this order as ${newStatus}? Inventory will be restocked.`)) return;
    setIsUpdating(true);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      showToast?.(`Order marked as ${newStatus}`, 'success');
      
      setOrders(current => current.map(o => (o.id === orderId) ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
        setTrackingStatus(newStatus);
      }
      setRefreshKey(key => key + 1);
    } catch (err) {
      showToast?.(err.normalized?.message || err.response?.data?.message || 'Failed to update status.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const reconcileVisiblePayments = async () => {
    const orderIds = orders
      .filter(order => order.payment_mode === 'online')
      .slice(0, 25)
      .map(order => order.id);
    if (!orderIds.length || reconcilingPayments) return;
    setReconcilingPayments(true);
    setPaymentReconciliationError('');
    try {
      const response = await api.get('/orders/admin/reconciliation/payments', {
        params: { order_ids: orderIds.join(',') },
      });
      setPaymentReconciliation(response.data?.rows || []);
    } catch (err) {
      setPaymentReconciliationError(err.normalized?.message || err.response?.data?.message || 'Could not check the selected payments against Razorpay.');
    } finally {
      setReconcilingPayments(false);
    }
  };

  // FIX: Allowing admins to dictate the exact status when updating tracking
  const handleUpdateTracking = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      const orderId = selectedOrder.id;
      await api.put(`/orders/${orderId}/status`, { 
        status: trackingStatus, 
        trackingNumber: trackingNumber, 
        courier: courierName 
      });
      
      showToast?.('Order pipeline & tracking updated.', 'success');
      setRefreshKey(key => key + 1);
      setSelectedOrder({ 
        ...selectedOrder, 
        tracking_number: trackingNumber, 
        courier: courierName, 
        status: trackingStatus 
      });
    } catch (err) {
      showToast?.(err.normalized?.message || err.response?.data?.message || 'Failed to save tracking information.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const loadShippingLabels = async orderId => {
    try {
      const response = await api.get('/shipping/labels', { params: { order_id: orderId } });
      setShippingLabels(response.data || []);
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Could not load shipping labels.', 'error');
    }
  };

  const handleCreateShippingLabel = async event => {
    event.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      const response = await api.post('/shipping/labels', {
        order_id: selectedOrder.id,
        provider: labelForm.provider,
        direction: 'forward',
        weight: Number(labelForm.weight),
        length: Number(labelForm.length),
        width: Number(labelForm.width),
        height: Number(labelForm.height),
      });
      setShippingLabels(current => [response.data, ...current]);
      if (response.data.tracking_number) {
        setTrackingNumber(response.data.tracking_number);
        setCourierName(response.data.service_name || labelForm.provider);
      }
      showToast?.('Carrier shipment booked and label details saved.', 'success');
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Could not book carrier shipment.', 'error');
      await loadShippingLabels(selectedOrder.id);
    } finally {
      setIsUpdating(false);
    }
  };

  const downloadShippingLabel = async label => {
    try {
      const response = await api.get(`/shipping/labels/${label.id}/file`, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Bhumivera_${label.direction}_label_${label.id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Could not download the shipping label.', 'error');
    }
  };

  const exportToExcel = async () => {
    setExporting(true);
    try {
      const params = { limit: 200, search: searchTerm.trim() || undefined, status: statusFilter === 'all' ? undefined : statusFilter };
      const firstPage = await api.get('/orders/all', { params: { ...params, page: 1 } });
      const allOrders = [...(firstPage.data?.orders || [])];
      const totalPages = Number(firstPage.data?.pagination?.totalPages || 1);
      for (let page = 2; page <= totalPages; page += 1) {
        const response = await api.get('/orders/all', { params: { ...params, page } });
        allOrders.push(...(response.data?.orders || []));
      }
      const worksheetData = allOrders.map(o => ({
        'Order ID': formatId(o.id), 'Date': new Date(o.created_at).toLocaleString(),
        'Customer': o.user_name || o.address_snapshot?.full_name || 'Guest', 'Email': o.user_email || 'N/A',
        'Total (₹)': Number(o.total || 0), 'Payment Method': o.payment_mode || 'COD',
        'Cause Pledge (₹)': Number(o.impact_amount || 0), 'Cause Project': o.impact_project || 'N/A',
        'Payment Status': o.payment_status || 'pending', 'Status': o.status,
        'Courier': o.courier || 'N/A', 'Tracking ID': o.tracking_number || 'N/A'
      }));
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
      XLSX.writeFile(workbook, `Orders_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (err) {
      showToast?.(err.normalized?.message || 'Failed to export orders.', 'error');
    } finally {
      setExporting(false);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Loading Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-slate-100 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-3">
            Order Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            View, track, and update all customer orders.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={reconcileVisiblePayments} disabled={reconcilingPayments || !orders.some(order => order.payment_mode === 'online')} title="Read-only check for up to 25 online orders on this page" className="flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 font-semibold text-cyan-100 transition hover:bg-cyan-400/20 disabled:opacity-50">
            <ShieldCheck size={16} /> {reconcilingPayments ? 'Checking payments…' : 'Check online orders'}
          </button>
          <button onClick={() => setRefreshKey(key => key + 1)} aria-label="Refresh orders" title="Refresh orders" className="rounded-xl border border-white/10 bg-white/5 p-3 text-slate-200 backdrop-blur-xl transition hover:bg-white/10 disabled:opacity-50" disabled={loading}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={exportToExcel} disabled={exporting} className="flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-[#071a12] transition hover:bg-emerald-300 disabled:opacity-60">
            <Download size={16} /> {exporting ? 'Preparing export…' : 'Export filtered orders'}
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="admin-glass-panel flex items-center gap-4 rounded-2xl p-5">
          <div className="rounded-xl bg-emerald-400/10 p-3.5 text-emerald-300"><IndianRupee size={22} /></div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Gross revenue</p>
            <h4 className="text-xl font-bold text-white">₹{Number(summary.grossRevenue || 0).toLocaleString()}</h4>
          </div>
        </div>
        <div className="admin-glass-panel flex items-center gap-4 rounded-2xl p-5">
          <div className="rounded-xl bg-amber-400/10 p-3.5 text-amber-300"><Clock size={22} /></div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Action required</p>
            <h4 className="text-xl font-bold text-white">{Number(summary.actionRequired || 0).toLocaleString()}</h4>
          </div>
        </div>
        <div className="admin-glass-panel flex items-center gap-4 rounded-2xl p-5">
          <div className="rounded-xl bg-purple-400/10 p-3.5 text-purple-300"><Truck size={22} /></div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">In transit</p>
            <h4 className="text-xl font-bold text-white">{Number(summary.inTransit || 0).toLocaleString()}</h4>
          </div>
        </div>
        <div className="admin-glass-panel flex items-center gap-4 rounded-2xl p-5">
          <div className="rounded-xl bg-blue-400/10 p-3.5 text-blue-300"><CheckCircle size={22} /></div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Completed</p>
            <h4 className="text-xl font-bold text-white">{Number(summary.completed || 0).toLocaleString()}</h4>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="admin-glass-panel flex flex-col gap-3 rounded-2xl p-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" placeholder="Search by Order ID, Name, or Email..." 
            value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="admin-glass-control w-full rounded-xl py-3 pl-11 pr-4 font-medium"
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          <select 
            value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="admin-glass-control w-full appearance-none rounded-xl py-3 pl-11 pr-4 font-medium"
          >
            <option value="all">All Orders</option>
            {Object.entries(STATUS_MAP).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          Rows
          <select value={pagination.limit} onChange={event => { setCurrentPage(1); setPagination(current => ({ ...current, limit: Number(event.target.value) })); }} className="admin-glass-control rounded-xl px-3 py-3">
            {[25, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
      </div>

      {loadError && <div role="alert" className="flex items-center justify-between gap-4 rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100"><span>{loadError}</span><button onClick={() => setRefreshKey(key => key + 1)} className="font-bold underline">Retry</button></div>}
      {paymentReconciliationError && <div role="alert" className="rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{paymentReconciliationError}</div>}
      {paymentReconciliation && <section className="admin-glass-panel space-y-3 rounded-2xl p-4" aria-label="Payment reconciliation results">
        <div>
          <h2 className="text-sm font-bold text-white">Read-only payment comparison</h2>
          <p className="mt-1 text-xs text-slate-400">Compares the selected page with Razorpay. This check never changes order or payment records.</p>
        </div>
        <div className="max-h-72 overflow-auto">
          <table className="w-full text-left text-xs">
            <thead><tr className="border-b border-white/10 text-slate-400"><th className="p-2">Order</th><th className="p-2">Local payment</th><th className="p-2">Razorpay</th><th className="p-2">Result</th></tr></thead>
            <tbody>{paymentReconciliation.map(row => (
              <tr key={row.orderId} className="border-b border-white/5">
                <td className="p-2 font-mono">#{row.orderId}</td>
                <td className="p-2">{row.localStatus || '—'}</td>
                <td className="p-2">{row.providerStatus || row.providerErrorCode || '—'}</td>
                <td className={`p-2 font-semibold ${row.outcome === 'matched' ? 'text-emerald-300' : 'text-amber-200'}`}>{String(row.outcome).replaceAll('_', ' ')}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>}

      {/* Table */}
      <div className="admin-glass-panel overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.035]">
                <th className="p-5 text-xs font-bold text-slate-500 uppercase">Order ID</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase">Customer</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase">Date</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase">Total</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    {loading ? 'Loading orders…' : 'No orders match these filters.'}
                  </td>
                </tr>
              ) : orders.map(order => {
                const status = STATUS_MAP[order.status] || STATUS_MAP['pending'];
                return (
                  <tr key={order.id} className="transition-colors hover:bg-white/[0.035]">
                    <td className="p-5 font-bold font-mono text-slate-100">#{formatId(order.id)}</td>
                    <td className="p-5">
                      <p className="font-semibold text-slate-100">{order.address_snapshot?.full_name || order.user_name || 'Guest'}</p>
                      <p className="text-xs text-slate-500">{order.user_email || 'No email'}</p>
                    </td>
                    <td className="p-5 text-sm text-slate-300">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="p-5 font-bold text-emerald-300">₹{parseFloat(order.total || 0).toLocaleString()}</td>
                    <td className="p-5">
                      <div className="flex flex-col items-start gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${STATUS_BADGE[status.color]}`}>
                          {status.label}
                        </span>
                        <select aria-label={`Update order ${formatId(order.id)} status`} value={order.status} onChange={event => handleUpdateStatus(order.id, event.target.value)} disabled={isUpdating} className="admin-glass-control max-w-full rounded-md px-2 py-1 text-xs disabled:opacity-50">
                          {Object.entries(STATUS_MAP).filter(([key]) => STATUS_RANK[key] >= STATUS_RANK[order.status]).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setTrackingNumber(order.tracking_number || '');
                          setCourierName(order.courier || '');
                          setTrackingStatus(order.status || 'shipped');
                          setShippingLabels([]);
                          loadShippingLabels(order.id);
                        }}
                        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-200"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {pagination.total === 0 ? 'No orders' : `Showing ${(currentPage - 1) * pagination.limit + 1}–${Math.min(currentPage * pagination.limit, pagination.total)} of ${Number(pagination.total).toLocaleString()} orders`}
            {loading && <span className="ml-2 text-emerald-700">Updating…</span>}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(page => Math.max(1, page - 1))} disabled={currentPage <= 1 || loading} aria-label="Previous page" className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 disabled:opacity-40"><ChevronLeft size={18}/></button>
            <span className="min-w-24 text-center text-sm font-semibold text-slate-300">Page {currentPage} of {Math.max(1, pagination.totalPages)}</span>
            <button onClick={() => setCurrentPage(page => Math.min(pagination.totalPages, page + 1))} disabled={currentPage >= pagination.totalPages || loading} aria-label="Next page" className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 disabled:opacity-40"><ChevronRight size={18}/></button>
          </div>
        </div>
      </div>

      {/* ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020b08]/80 backdrop-blur-sm overflow-y-auto">
          <div className="admin-glass-panel my-auto relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.035] p-5 md:p-6">
              <div>
                <h2 className="text-xl font-semibold text-white font-mono tracking-tight">
                  Order #{formatId(selectedOrder.id)}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition-colors hover:bg-white/10">
                  <Printer size={20} />
                </button>
                <button onClick={() => setSelectedOrder(null)} className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition-colors hover:bg-rose-400/10 hover:text-rose-300">
                  <XCircle size={20} />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto p-5 md:p-6 lg:grid-cols-2">
                
                {/* Left Side: Items & Money */}
                <div className="space-y-6">
                  {/* Items */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                    <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white"><ShoppingBag size={18}/> Ordered items</h3>
                    <div className="space-y-4">
                      {selectedOrder.items?.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 border-b border-white/10 py-4 last:border-0 last:pb-0">
                          <img src={getImageUrl(item.image)} alt="product" className="h-16 w-16 rounded-lg border border-white/10 bg-white/5 object-contain p-1" />
                          <div className="flex-1">
                            <p className="font-semibold text-slate-100">{item.name}</p>
                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-emerald-300">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financials */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                    <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white"><FileText size={18}/> Payment summary</h3>
                    <div className="space-y-3 text-sm font-medium">
                      <div className="flex justify-between text-slate-300"><span>Subtotal</span><span>₹{Number(selectedOrder.subtotal || 0).toLocaleString()}</span></div>
                      <div className="flex justify-between text-slate-300"><span>Shipping</span><span>₹{Number(selectedOrder.shipping_cost || 0).toLocaleString()}</span></div>
                      {Number(selectedOrder.impact_amount) > 0 && <div className="flex justify-between gap-3 text-emerald-200"><span>Cause pledge · {selectedOrder.impact_project?.replaceAll('-', ' ') || 'Impact fund'}</span><span>₹{Number(selectedOrder.impact_amount).toLocaleString()}</span></div>}
                      {Number(selectedOrder.discount) > 0 && <div className="flex justify-between text-emerald-300"><span>Discount</span><span>- ₹{Number(selectedOrder.discount).toLocaleString()}</span></div>}
                      {Number(selectedOrder.tier_discount) > 0 && <div className="flex justify-between text-emerald-300"><span>Loyalty tier benefit</span><span>- ₹{Number(selectedOrder.tier_discount).toLocaleString()}</span></div>}
                      {Number(selectedOrder.referral_wallet_amount) > 0 && <div className="flex justify-between text-emerald-300"><span>Referral balance</span><span>- ₹{Number(selectedOrder.referral_wallet_amount).toLocaleString()}</span></div>}
                      {Number(selectedOrder.loyalty_points_redeemed) > 0 && <div className="flex justify-between text-emerald-300"><span>Loyalty points redeemed</span><span>{Number(selectedOrder.loyalty_points_redeemed).toLocaleString()} pts</span></div>}
                      {Number(selectedOrder.loyalty_points_awarded) > 0 && <div className="flex justify-between text-slate-400"><span>Points after confirmation</span><span>+{Number(selectedOrder.loyalty_points_awarded).toLocaleString()} pts</span></div>}
                      <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-lg font-bold text-white">
                        <span>Total Paid</span>
                        <span className="text-emerald-300">₹{parseFloat(selectedOrder.total || 0).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                      Payment Mode: {selectedOrder.payment_mode || 'COD'}
                    </div>
                  </div>
                </div>

                {/* Right Side: Shipping & Tracking */}
                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                    <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white"><User size={18}/> Customer details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold text-slate-200">Name:</span> {selectedOrder.address_snapshot?.full_name || selectedOrder.user_name}</p>
                      <p><span className="font-semibold text-slate-200">Email:</span> {selectedOrder.user_email || 'N/A'}</p>
                      <p><span className="font-semibold text-slate-200">Phone:</span> {selectedOrder.address_snapshot?.phone || 'N/A'}</p>
                    </div>
                    <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.035] p-4 text-sm text-slate-300">
                      <span className="mb-1 block font-semibold text-slate-100"><MapPin size={14} className="inline mr-1"/> Shipping address:</span>
                      {selectedOrder.address_snapshot ? (
                        <>
                          {selectedOrder.address_snapshot.line1}, {selectedOrder.address_snapshot.line2}<br/>
                          {selectedOrder.address_snapshot.city}, {selectedOrder.address_snapshot.state} - {selectedOrder.address_snapshot.pincode}
                        </>
                      ) : 'Address not found.'}
                    </div>
                  </div>

                  {/* FIX: Form now allows selecting ANY status + tracking details */}
                  <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.035] p-5 backdrop-blur-xl">
                    <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white"><Truck size={18}/> Dispatch & tracking</h3>
                    <form onSubmit={handleUpdateTracking} className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-200">Update status</label>
                        <select 
                          value={trackingStatus} 
                          onChange={e => setTrackingStatus(e.target.value)}
                          className="admin-glass-control w-full rounded-lg p-3 text-sm"
                        >
                          {Object.entries(STATUS_MAP).map(([key, { label }]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-200">Tracking number (optional)</label>
                        <input 
                          type="text" placeholder="e.g. AWB Number"
                          value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)}
                          className="admin-glass-control w-full rounded-lg p-3 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-200">Courier partner (optional)</label>
                        <input 
                          type="text" placeholder="e.g. BlueDart, FedEx"
                          value={courierName} onChange={e => setCourierName(e.target.value)}
                          className="admin-glass-control w-full rounded-lg p-3 text-sm"
                        />
                      </div>
                      <button 
                        type="submit" disabled={isUpdating}
                        className="w-full rounded-lg bg-emerald-400 py-3 font-semibold text-[#071a12] transition-colors hover:bg-emerald-300"
                      >
                        {isUpdating ? 'Saving Pipeline...' : 'Apply Tracking & Status'}
                      </button>
                    </form>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                    <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-white"><Package size={18} /> Carrier label</h3>
                    <p className="mb-4 text-xs text-slate-400">Booking a label does not mark the order as shipped. Update status after carrier handover.</p>
                    {['confirmed', 'packed'].includes(selectedOrder.status) && (
                      <form onSubmit={handleCreateShippingLabel} className="grid grid-cols-2 gap-3">
                        <label className="col-span-2 text-xs text-slate-400">Carrier
                          <select value={labelForm.provider} onChange={event => setLabelForm(current => ({ ...current, provider: event.target.value }))} className="admin-glass-control mt-1 w-full rounded-lg p-2 text-sm">
                            <option value="shiprocket">Shiprocket</option>
                            <option value="delhivery">Delhivery</option>
                          </select>
                        </label>
                        {[
                          ['weight', 'Weight (kg)'], ['length', 'Length (cm)'],
                          ['width', 'Width (cm)'], ['height', 'Height (cm)'],
                        ].map(([key, label]) => <label key={key} className="text-xs text-slate-400">{label}
                          <input required type="number" min="0.01" step="0.01" value={labelForm[key]} onChange={event => setLabelForm(current => ({ ...current, [key]: event.target.value }))} className="admin-glass-control mt-1 w-full rounded-lg p-2 text-sm" />
                        </label>)}
                        <button disabled={isUpdating} className="col-span-2 rounded-lg bg-emerald-400 py-2.5 text-sm font-bold text-[#071a12] disabled:opacity-50">{isUpdating ? 'Booking…' : 'Book shipment & create label'}</button>
                      </form>
                    )}
                    {!['confirmed', 'packed'].includes(selectedOrder.status) && <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-100">Set the order to confirmed or packed before booking a forward shipment.</p>}
                    <div className="mt-4 space-y-2">
                      {shippingLabels.map(label => <div key={label.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.025] p-3 text-xs">
                        <div><span className="font-bold capitalize text-white">{label.provider}</span><span className={`ml-2 ${label.status === 'booked' ? 'text-emerald-300' : label.status === 'failed' ? 'text-rose-300' : 'text-amber-200'}`}>{label.status}</span>
                          {label.tracking_number && <p className="mt-1 text-slate-400">AWB: {label.tracking_number}</p>}
                          {label.error_message && <p className="mt-1 text-rose-300">{label.error_message}</p>}
                        </div>
                        {label.status === 'booked' && <button type="button" onClick={() => downloadShippingLabel(label)} className="rounded border border-emerald-500/40 px-3 py-1.5 font-semibold text-emerald-200">Download PDF</button>}
                      </div>)}
                      {!shippingLabels.length && <p className="text-xs text-slate-500">No carrier label booked for this order.</p>}
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
