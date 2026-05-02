import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, Search, Filter, Download, Truck, CheckCircle, 
  Clock, XCircle, AlertCircle, Package, ArrowRight, X 
} from 'lucide-react';
import { adminManagement } from '../../services/api';

const STATUS_COLORS = {
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  packed: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  shipped: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  cancelled: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  returned: 'bg-slate-500/10 text-slate-500 border-slate-500/20'
};

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dispatch Modal State
  const [dispatchModal, setDispatchModal] = useState({ isOpen: false, order: null });
  const [dispatchData, setDispatchData] = useState({ courier: '', tracking_number: '' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminManagement.getAllOrders();
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (newStatus === 'shipped') {
      const order = orders.find(o => o.id === orderId);
      setDispatchModal({ isOpen: true, order });
      return;
    }

    try {
      setUpdating(true);
      await adminManagement.updateOrderStatus(orderId, { status: newStatus });
      await fetchOrders();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDispatchSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await adminManagement.updateOrderStatus(dispatchModal.order.id, {
        status: 'shipped',
        courier: dispatchData.courier,
        tracking_number: dispatchData.tracking_number
      });
      setDispatchModal({ isOpen: false, order: null });
      setDispatchData({ courier: '', tracking_number: '' });
      await fetchOrders();
    } catch (err) {
      console.error("Dispatch failed:", err);
    } finally {
      setUpdating(false);
    }
  };

  const exportCSV = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/api/admin/orders/export/csv`;
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toString().includes(search) || 
        order.user_email?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const metrics = useMemo(() => {
    return {
      pending: orders.filter(o => o.status === 'pending').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      totalRevenue: orders.reduce((acc, curr) => curr.status !== 'cancelled' ? acc + Number(curr.total || 0) : acc, 0)
    };
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* KPI Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/50 p-5 rounded-2xl flex items-center gap-4 shadow-lg">
          <div className="p-3 bg-amber-500/10 rounded-xl"><Clock className="text-amber-500" size={24} /></div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Pending Fulfillment</p>
            <p className="text-2xl font-black text-white">{metrics.pending}</p>
          </div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/50 p-5 rounded-2xl flex items-center gap-4 shadow-lg">
          <div className="p-3 bg-cyan-500/10 rounded-xl"><Truck className="text-cyan-500" size={24} /></div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">In Transit</p>
            <p className="text-2xl font-black text-white">{metrics.shipped}</p>
          </div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/50 p-5 rounded-2xl flex items-center gap-4 shadow-lg">
          <div className="p-3 bg-emerald-500/10 rounded-xl"><CheckCircle className="text-emerald-500" size={24} /></div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Delivered</p>
            <p className="text-2xl font-black text-white">{metrics.delivered}</p>
          </div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/50 p-5 rounded-2xl flex items-center gap-4 shadow-lg">
          <div className="p-3 bg-emerald-500/10 rounded-xl"><ShoppingBag className="text-emerald-500" size={24} /></div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Gross Revenue</p>
            <p className="text-2xl font-black text-white font-mono">₹{metrics.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 backdrop-blur-md border border-slate-800/50 p-4 rounded-2xl">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search ID or Email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-sm text-white rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-sm text-white rounded-xl pl-10 pr-8 py-2 focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {Object.keys(STATUS_COLORS).map(status => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all w-full md:w-auto justify-center">
          <Download size={16} /> Export Data
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/50 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Logistics</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-12 text-slate-500 animate-pulse">Syncing Fulfillment Pipeline...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-12 text-slate-500">No orders found matching criteria.</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-white">#{order.id}</td>
                    <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{order.user_email}</td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">₹{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {order.tracking_number ? (
                        <div className="text-[10px] font-mono">
                          <span className="text-slate-500 block">VIA {order.courier?.toUpperCase()}</span>
                          <span className="text-cyan-400">{order.tracking_number}</span>
                        </div>
                      ) : <span className="text-slate-600 text-[10px] uppercase">Pending Dispatch</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        disabled={updating}
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-50"
                      >
                        {Object.keys(STATUS_COLORS).map(s => (
                          <option key={s} value={s}>{s.toUpperCase()}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Modal */}
      {dispatchModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Package className="text-cyan-500" /> Dispatch Order #{dispatchModal.order?.id}
              </h2>
              <button onClick={() => setDispatchModal({ isOpen: false, order: null })} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Courier Service</label>
                <input 
                  type="text" required
                  placeholder="e.g., Delhivery, BlueDart, FedEx"
                  value={dispatchData.courier}
                  onChange={e => setDispatchData({...dispatchData, courier: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tracking Number</label>
                <input 
                  type="text" required
                  placeholder="Enter tracking ID"
                  value={dispatchData.tracking_number}
                  onChange={e => setDispatchData({...dispatchData, tracking_number: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setDispatchModal({ isOpen: false, order: null })}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={updating}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updating ? 'Processing...' : <><Truck size={18} /> Confirm Dispatch</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
