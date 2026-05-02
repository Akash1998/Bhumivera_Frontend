import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, Download, MoreVertical, Truck, Package, 
  CheckCircle, Clock, XCircle, ChevronRight, X, DollarSign, Calendar
} from 'lucide-react';
import api from '../../services/api';

const STATUS_CONFIG = {
  pending: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: Clock },
  confirmed: { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: CheckCircle },
  packed: { color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20', icon: Package },
  shipped: { color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', icon: Truck },
  delivered: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: CheckCircle },
  cancelled: { color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20', icon: XCircle },
  returned: { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', icon: RefreshCw }
};

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Form State for the Side Panel
  const [updateForm, setUpdateForm] = useState({ status: '', tracking_number: '', courier: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await api.get('/admin/orders/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const openPanel = async (order) => {
    setUpdateForm({
      status: order.status || 'pending',
      tracking_number: order.tracking_number || '',
      courier: order.courier || ''
    });
    
    try {
      const res = await api.get(`/admin/orders/${order.id}`);
      setSelectedOrder(res.data);
    } catch (err) {
      setSelectedOrder(order); 
    }
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.put(`/admin/orders/${selectedOrder.id}/status`, updateForm);
      await fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.id?.toString().includes(search) || o.user_email?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const metrics = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      revenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (Number(o.total) || 0), 0),
      shipped: orders.filter(o => o.status === 'shipped' || o.status === 'delivered').length
    };
  }, [orders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative h-full flex flex-col">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
        {[
          { label: 'Total Orders', value: metrics.total, icon: Package, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Pending Fulfillment', value: metrics.pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Gross Revenue', value: `₹${metrics.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Shipped/Delivered', value: metrics.shipped, icon: Truck, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((m, i) => (
          <div key={i} className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-5 rounded-2xl flex items-center gap-4">
            <div className={`p-3 rounded-xl ${m.bg} ${m.color}`}>
              <m.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">{m.label}</p>
              <h3 className="text-2xl font-black text-white">{m.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-4 rounded-2xl flex-shrink-0">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" placeholder="Search ID or Email..." 
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <select 
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-8 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
            </select>
          </div>
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors border border-slate-700 hover:border-slate-600 w-full sm:w-auto justify-center"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Data Grid */}
      <div className="flex-1 bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-2xl overflow-hidden flex flex-col min-h-0">
        <div className="overflow-auto flex-1 content-scroll">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950/80 backdrop-blur-xl sticky top-0 z-10 border-b border-slate-800/50">
              <tr>
                <th className="p-4 text-xs font-mono text-slate-500 uppercase tracking-widest">Order ID</th>
                <th className="p-4 text-xs font-mono text-slate-500 uppercase tracking-widest">Customer</th>
                <th className="p-4 text-xs font-mono text-slate-500 uppercase tracking-widest">Date</th>
                <th className="p-4 text-xs font-mono text-slate-500 uppercase tracking-widest">Total</th>
                <th className="p-4 text-xs font-mono text-slate-500 uppercase tracking-widest">Status</th>
                <th className="p-4 text-xs font-mono text-slate-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredOrders.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500 font-mono">No orders found matching criteria.</td></tr>
              ) : (
                filteredOrders.map(order => {
                  const conf = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const StatusIcon = conf.icon;
                  return (
                    <tr key={order.id} className="hover:bg-slate-800/20 transition-colors group cursor-pointer" onClick={() => openPanel(order)}>
                      <td className="p-4">
                        <span className="font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded text-xs border border-cyan-500/20">
                          #{order.id}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-bold text-white">{order.user_email?.split('@')[0] || 'Guest'}</p>
                        <p className="text-xs text-slate-500">{order.user_email}</p>
                      </td>
                      <td className="p-4 text-sm text-slate-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm font-bold text-white">
                        ₹{Number(order.total).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${conf.bg} ${conf.color} ${conf.border}`}>
                          <StatusIcon size={12} />
                          {order.status.toUpperCase()}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Logistics Panel */}
      {selectedOrder && (
        <div className="absolute inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]">
            
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  Order <span className="text-cyan-400">#{selectedOrder.id}</span>
                </h2>
                <p className="text-xs font-mono text-slate-500 mt-1 flex items-center gap-1">
                  <Calendar size={12} /> {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 content-scroll">
              {/* Customer Info */}
              <section>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Customer Profile</h3>
                <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl">
                  <p className="text-sm text-white font-bold">{selectedOrder.user_email}</p>
                  <p className="text-sm text-slate-400 mt-1">Total Value: <span className="text-emerald-400 font-mono font-bold">₹{Number(selectedOrder.total).toLocaleString()}</span></p>
                </div>
              </section>

              {/* Logistics Form */}
              <section>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Logistics Control</h3>
                <form id="updateOrderForm" onSubmit={handleUpdateOrder} className="space-y-4">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">Order Status</label>
                    <select 
                      value={updateForm.status} onChange={(e) => setUpdateForm({...updateForm, status: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer appearance-none"
                    >
                      {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">Courier Service</label>
                    <input 
                      type="text" placeholder="e.g., Delhivery, BlueDart"
                      value={updateForm.courier} onChange={(e) => setUpdateForm({...updateForm, courier: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">Tracking Number</label>
                    <input 
                      type="text" placeholder="AWB Number"
                      value={updateForm.tracking_number} onChange={(e) => setUpdateForm({...updateForm, tracking_number: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                    />
                  </div>
                </form>
              </section>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-950/50">
              <button 
                type="submit" form="updateOrderForm" disabled={updating}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] disabled:opacity-50"
              >
                {updating ? 'Syncing Matrix...' : 'Update Logistics'}
              </button>
            </div>

          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
