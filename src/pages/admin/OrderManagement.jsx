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
  slate: 'bg-slate-100 text-slate-700'
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
  
  // Tracking Form States
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('');
  const [trackingStatus, setTrackingStatus] = useState('shipped');

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
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-screen text-slate-800 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Order Management
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            View, track, and update all customer orders.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setRefreshKey(key => key + 1)} aria-label="Refresh orders" title="Refresh orders" className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50" disabled={loading}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={exportToExcel} disabled={exporting} className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-md disabled:opacity-60">
            <Download size={16} /> {exporting ? 'Preparing export…' : 'Export filtered orders'}
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600"><IndianRupee size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Gross Revenue</p>
            <h4 className="text-2xl font-black text-slate-900">₹{Number(summary.grossRevenue || 0).toLocaleString()}</h4>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-4 rounded-xl bg-amber-50 text-amber-600"><Clock size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Action Required</p>
            <h4 className="text-2xl font-black text-slate-900">{Number(summary.actionRequired || 0).toLocaleString()}</h4>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-4 rounded-xl bg-purple-50 text-purple-600"><Truck size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">In Transit</p>
            <h4 className="text-2xl font-black text-slate-900">{Number(summary.inTransit || 0).toLocaleString()}</h4>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-4 rounded-xl bg-blue-50 text-blue-600"><CheckCircle size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Completed</p>
            <h4 className="text-2xl font-black text-slate-900">{Number(summary.completed || 0).toLocaleString()}</h4>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" placeholder="Search by Order ID, Name, or Email..." 
            value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 font-medium outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          <select 
            value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 font-medium outline-none focus:border-emerald-500 appearance-none cursor-pointer"
          >
            <option value="all">All Orders</option>
            {Object.entries(STATUS_MAP).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          Rows
          <select value={pagination.limit} onChange={event => { setCurrentPage(1); setPagination(current => ({ ...current, limit: Number(event.target.value) })); }} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-emerald-500">
            {[25, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
      </div>

      {loadError && <div role="alert" className="flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"><span>{loadError}</span><button onClick={() => setRefreshKey(key => key + 1)} className="font-bold underline">Retry</button></div>}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-5 text-xs font-bold text-slate-500 uppercase">Order ID</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase">Customer</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase">Date</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase">Total</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    {loading ? 'Loading orders…' : 'No orders match these filters.'}
                  </td>
                </tr>
              ) : orders.map(order => {
                const status = STATUS_MAP[order.status] || STATUS_MAP['pending'];
                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-5 font-bold text-slate-900 font-mono">#{formatId(order.id)}</td>
                    <td className="p-5">
                      <p className="font-bold text-slate-800">{order.address_snapshot?.full_name || order.user_name || 'Guest'}</p>
                      <p className="text-xs text-slate-500">{order.user_email || 'No email'}</p>
                    </td>
                    <td className="p-5 text-sm text-slate-600">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="p-5 font-bold text-emerald-600">₹{parseFloat(order.total || 0).toLocaleString()}</td>
                    <td className="p-5">
                      <div className="flex flex-col items-start gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${STATUS_BADGE[status.color]}`}>
                          {status.label}
                        </span>
                        <select aria-label={`Update order ${formatId(order.id)} status`} value={order.status} onChange={event => handleUpdateStatus(order.id, event.target.value)} disabled={isUpdating} className="max-w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 disabled:opacity-50">
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
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 rounded-lg text-sm font-bold transition-colors shadow-sm"
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
        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {pagination.total === 0 ? 'No orders' : `Showing ${(currentPage - 1) * pagination.limit + 1}–${Math.min(currentPage * pagination.limit, pagination.total)} of ${Number(pagination.total).toLocaleString()} orders`}
            {loading && <span className="ml-2 text-emerald-700">Updating…</span>}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(page => Math.max(1, page - 1))} disabled={currentPage <= 1 || loading} aria-label="Previous page" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"><ChevronLeft size={18}/></button>
            <span className="min-w-24 text-center text-sm font-semibold text-slate-700">Page {currentPage} of {Math.max(1, pagination.totalPages)}</span>
            <button onClick={() => setCurrentPage(page => Math.min(pagination.totalPages, page + 1))} disabled={currentPage >= pagination.totalPages || loading} aria-label="Next page" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"><ChevronRight size={18}/></button>
          </div>
        </div>
      </div>

      {/* ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl my-auto relative flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
                  Order #{formatId(selectedOrder.id)}
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors shadow-sm">
                  <Printer size={20} />
                </button>
                <button onClick={() => setSelectedOrder(null)} className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shadow-sm">
                  <XCircle size={20} />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Side: Items & Money */}
                <div className="space-y-6">
                  {/* Items */}
                  <div className="border border-slate-200 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><ShoppingBag size={18}/> Ordered Items</h3>
                    <div className="space-y-4">
                      {selectedOrder.items?.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0 last:pb-0">
                          <img src={getImageUrl(item.image)} alt="product" className="w-16 h-16 object-contain rounded-lg border border-slate-100 p-1" />
                          <div className="flex-1">
                            <p className="font-bold text-slate-800">{item.name}</p>
                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-emerald-600">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financials */}
                  <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><FileText size={18}/> Payment Summary</h3>
                    <div className="space-y-3 text-sm font-medium">
                      <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>₹{Number(selectedOrder.subtotal || 0).toLocaleString()}</span></div>
                      <div className="flex justify-between text-slate-600"><span>Shipping</span><span>₹{Number(selectedOrder.shipping_cost || 0).toLocaleString()}</span></div>
                      {Number(selectedOrder.discount) > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>- ₹{Number(selectedOrder.discount).toLocaleString()}</span></div>}
                      <div className="pt-3 mt-3 border-t border-slate-200 flex justify-between text-lg font-extrabold text-slate-900">
                        <span>Total Paid</span>
                        <span className="text-emerald-600">₹{parseFloat(selectedOrder.total || 0).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-4 inline-flex px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                      Payment Mode: {selectedOrder.payment_mode || 'COD'}
                    </div>
                  </div>
                </div>

                {/* Right Side: Shipping & Tracking */}
                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="border border-slate-200 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><User size={18}/> Customer Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-bold text-slate-700">Name:</span> {selectedOrder.address_snapshot?.full_name || selectedOrder.user_name}</p>
                      <p><span className="font-bold text-slate-700">Email:</span> {selectedOrder.user_email || 'N/A'}</p>
                      <p><span className="font-bold text-slate-700">Phone:</span> {selectedOrder.address_snapshot?.phone || 'N/A'}</p>
                    </div>
                    <div className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-600">
                      <span className="font-bold text-slate-800 block mb-1"><MapPin size={14} className="inline mr-1"/> Shipping Address:</span>
                      {selectedOrder.address_snapshot ? (
                        <>
                          {selectedOrder.address_snapshot.line1}, {selectedOrder.address_snapshot.line2}<br/>
                          {selectedOrder.address_snapshot.city}, {selectedOrder.address_snapshot.state} - {selectedOrder.address_snapshot.pincode}
                        </>
                      ) : 'Address not found.'}
                    </div>
                  </div>

                  {/* FIX: Form now allows selecting ANY status + tracking details */}
                  <div className="border border-slate-200 rounded-2xl p-6 bg-blue-50/50">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Truck size={18}/> Dispatch & Tracking</h3>
                    <form onSubmit={handleUpdateTracking} className="space-y-4">
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-1">Update Status</label>
                        <select 
                          value={trackingStatus} 
                          onChange={e => setTrackingStatus(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none transition-colors"
                        >
                          {Object.entries(STATUS_MAP).map(([key, { label }]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-1">Tracking Number (Optional)</label>
                        <input 
                          type="text" placeholder="e.g. AWB Number"
                          value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none transition-colors" 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-1">Courier Partner (Optional)</label>
                        <input 
                          type="text" placeholder="e.g. BlueDart, FedEx"
                          value={courierName} onChange={e => setCourierName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none transition-colors" 
                        />
                      </div>
                      <button 
                        type="submit" disabled={isUpdating}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        {isUpdating ? 'Saving Pipeline...' : 'Apply Tracking & Status'}
                      </button>
                    </form>
                  </div>
                </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
