import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orders as ordersApi } from '../services/api';
import { Package, CheckCircle2, Truck, ShoppingBag, PartyPopper, Settings, ArrowRight, Loader2, AlertCircle, LogIn } from 'lucide-react';

const STATUS_STEPS = [
  { key: 'placed', label: 'Order Placed', icon: ShoppingBag, description: 'Your order has been placed successfully.' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2, description: 'Seller has confirmed your order.' },
  { key: 'processing', label: 'Processing', icon: Settings, description: 'Your order is being prepared.' },
  { key: 'shipped', label: 'Shipped', icon: Truck, description: 'Your order is on its way.' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Package, description: 'Your order is out for delivery.' },
  { key: 'delivered', label: 'Delivered', icon: PartyPopper, description: 'Your order has been delivered.' },
];

const STATUS_MAP = {
  pending: 0, placed: 0, confirmed: 1, processing: 2,
  shipped: 3, out_for_delivery: 4, delivered: 5,
};

function getStepIndex(status) {
  const s = (status || 'pending').toLowerCase().replace(/ /g, '_');
  return STATUS_MAP[s] ?? 0;
}

function StatusPill({ status, currentStep }) {
  const cfg = (() => {
    if (currentStep >= 5) return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (currentStep >= 3) return { bg: 'bg-sky-50 text-sky-700 border-sky-200' };
    return { bg: 'bg-amber-50 text-amber-800 border-amber-200' };
  })();
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${cfg.bg}`}>
      {status || 'Pending'}
    </span>
  );
}

export default function OrderTracking() {
  const { orderId } = useParams();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await ordersApi.getMyOrders();
        setOrders(res.data?.data || res.data || []);
      } catch (e) {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    if (token) load();
  }, [token]);

  const order = orderId ? orders.find(o => String(o.id || o._id) === String(orderId)) : null;
  const displayOrders = order ? [order] : orders;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 text-[#0B2419] animate-spin" />
          <p className="text-sm text-[#8B9D83]">Loading your orders…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-rose-600" />
          </div>
          <p className="text-xl mb-4 text-[#0B2419] font-semibold">{error}</p>
          <Link to="/profile" className="inline-flex items-center gap-2 text-[#0B2419] font-semibold border-b border-[#D4AF37] pb-0.5 hover:opacity-80">
            Go to Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white border border-[#8B9D83]/20 rounded-3xl p-8 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#0B2419]/8 flex items-center justify-center">
            <LogIn className="w-8 h-8 text-[#0B2419]" />
          </div>
          <p className="text-xl mb-2 text-[#0B2419] font-semibold">Please sign in</p>
          <p className="text-sm text-[#8B9D83] mb-6">Log in to track your orders and view purchase history.</p>
          <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2419] text-[#FDFBF7] font-semibold hover:bg-[#2C3E2D] transition-colors shadow-sm">
            <LogIn className="w-4 h-4" /> Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0B2419] mb-2 tracking-tight">Track Orders</h1>
          <p className="text-[#8B9D83]">Real-time status of your Bhumivera purchases</p>
        </div>

        {displayOrders.length === 0 ? (
          <div className="bg-white border border-[#8B9D83]/20 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#FDFBF7] border border-[#8B9D83]/20 flex items-center justify-center">
              <Package className="w-10 h-10 text-[#8B9D83]" />
            </div>
            <h3 className="text-xl font-semibold text-[#0B2419] mb-2">No orders yet</h3>
            <p className="text-[#8B9D83] mb-6">Start shopping to see your orders here. Every product comes with a 10-year warranty.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2419] text-[#FDFBF7] font-semibold hover:bg-[#2C3E2D] transition-colors shadow-sm">
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {displayOrders.map((ord) => {
              const currentStep = getStepIndex(ord.status);
              const orderKey = ord.id || ord._id;
              const items = ord.items || ord.order_items || [];
              const total = ord.total_amount || ord.total || 0;
              const createdAt = ord.created_at || ord.createdAt || ord.date;
              const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              }) : 'N/A';

              return (
                <div key={orderKey} className="bg-white rounded-3xl overflow-hidden border border-[#8B9D83]/20 shadow-sm hover:shadow-md transition-shadow">
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-[#FDFBF7] to-[#FFF8E7] px-6 sm:px-8 py-5 flex flex-wrap gap-4 justify-between items-center border-b border-[#8B9D83]/10">
                    <div>
                      <p className="text-xs text-[#8B9D83] uppercase tracking-wider font-semibold">Order ID</p>
                      <p className="text-[#0B2419] font-mono font-semibold text-lg">#{String(orderKey).slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#8B9D83] uppercase tracking-wider font-semibold">Placed On</p>
                      <p className="text-[#0B2419] font-medium">{formattedDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#8B9D83] uppercase tracking-wider font-semibold">Total</p>
                      <p className="text-[#8a6a12] font-bold text-lg">₹{Number(total).toLocaleString()}</p>
                    </div>
                    <div>
                      <StatusPill status={ord.status} currentStep={currentStep} />
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  <div className="px-6 sm:px-8 py-8 sm:py-10">
                    <div className="relative">
                      {/* Progress Bar */}
                      <div className="absolute top-6 left-6 right-6 h-0.5 bg-[#8B9D83]/20 rounded-full">
                        <div
                          className="h-full bg-gradient-to-r from-[#0B2419] to-[#D4AF37] rounded-full transition-all duration-700"
                          style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                        />
                      </div>

                      {/* Steps */}
                      <div className="relative flex justify-between">
                        {STATUS_STEPS.map((step, idx) => {
                          const done = idx <= currentStep;
                          const active = idx === currentStep;
                          const Icon = step.icon;
                          return (
                            <div key={step.key} className="flex flex-col items-center" style={{ width: `${100 / STATUS_STEPS.length}%` }}>
                              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300 shadow-sm ${
                                done
                                  ? active
                                    ? 'bg-[#0B2419] text-[#D4AF37] ring-4 ring-[#D4AF37]/30 scale-110'
                                    : 'bg-[#2C3E2D] text-white'
                                  : 'bg-white text-[#8B9D83] border-2 border-[#8B9D83]/30'
                              }`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <p className={`text-xs mt-3 text-center font-semibold leading-tight ${
                                done ? 'text-[#0B2419]' : 'text-stone-400'
                              }`}>{step.label}</p>
                              {active && (
                                <p className="text-xs text-[#8B9D83] text-center mt-1 max-w-[80px] leading-snug">{step.description}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  {items.length > 0 && (
                    <div className="px-6 sm:px-8 pb-8">
                      <h4 className="text-sm font-semibold text-[#8B9D83] uppercase tracking-wider mb-4 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" /> Items in this order
                      </h4>
                      <div className="space-y-2">
                        {items.slice(0, 3).map((item, i) => (
                          <div key={i} className="flex items-center gap-4 bg-[#FDFBF7] border border-[#8B9D83]/10 rounded-2xl p-3 hover:border-[#D4AF37]/40 transition-colors">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-lg border border-[#8B9D83]/10 shrink-0">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                              ) : <Package className="w-5 h-5 text-[#8B9D83]" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[#0B2419] text-sm font-medium truncate">{item.name || item.product_name || 'Product'}</p>
                              <p className="text-[#8B9D83] text-xs">Qty: {item.quantity || 1}</p>
                            </div>
                            <p className="text-[#8a6a12] text-sm font-semibold whitespace-nowrap">₹{Number(item.price || item.unit_price || 0).toLocaleString()}</p>
                          </div>
                        ))}
                        {items.length > 3 && (
                          <p className="text-[#8B9D83] text-sm text-center pt-2">+{items.length - 3} more items</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
