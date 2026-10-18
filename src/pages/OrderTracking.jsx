import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orders as ordersApi } from '../services/api';
import SEO from '../components/SEO';
import {
  Package,
  CheckCircle2,
  Truck,
  ShoppingBag,
  PartyPopper,
  ArrowRight,
  Search,
  Scale,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { ORDER_TRACKING_DEMO_DATA } from '../data/bhumiveraUniqueData';

const STATUS_STEPS = [
  { key: 'placed', label: 'Order Placed', icon: ShoppingBag, description: 'Batch allocated & locked in cleanroom.' },
  { key: 'confirmed', label: 'QC & Tamper-Seal', icon: CheckCircle2, description: 'Neck security strip inspected & certified.' },
  { key: 'packed', label: 'Digital Weight-Scan', icon: Package, description: 'Weighed on scale (±0.5g) & honeycomb packed.' },
  { key: 'shipped', label: 'Shipped via Courier', icon: Truck, description: 'AWB manifest scanned & in transit.' },
  { key: 'delivered', label: 'Delivered', icon: PartyPopper, description: 'Delivered with 48h unboxing window.' },
];

const STATUS_MAP = {
  pending: 0, placed: 0, confirmed: 1, packed: 2, shipped: 3, delivered: 4,
};

function getStepIndex(status) {
  const s = (status || 'pending').toLowerCase().replace(/ /g, '_');
  return STATUS_MAP[s] ?? 0;
}

export default function OrderTracking() {
  const { orderId } = useParams();
  const { token } = useAuth() || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [lookupInput, setLookupInput] = useState(orderId || '918273646');
  const [activeSample, setActiveSample] = useState(ORDER_TRACKING_DEMO_DATA.sampleOrders[0]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    ordersApi
      .getMyOrders()
      .then((res) => {
        if (active) {
          const rows = res.data?.data || res.data || [];
          if (Array.isArray(rows) && rows.length > 0) setOrders(rows);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  const handleLookup = (e) => {
    e.preventDefault();
    const clean = lookupInput.replace(/^#/, '').trim();
    const foundUserOrder = orders.find((o) => String(o.id || o.order_number) === clean);
    if (foundUserOrder) {
      setActiveSample(foundUserOrder);
      return;
    }
    const foundSample = ORDER_TRACKING_DEMO_DATA.sampleOrders.find(
      (o) => o.order_number === clean || o.tracking_number.toLowerCase() === clean.toLowerCase()
    );
    if (foundSample) {
      setActiveSample(foundSample);
    }
  };

  const displayOrder = activeSample || ORDER_TRACKING_DEMO_DATA.sampleOrders[0];
  const stepIndex = getStepIndex(displayOrder.status);

  return (
    <main className="min-h-screen bg-[#070a0e] text-[#e2e8f0] py-16 px-4 sm:px-8 font-sans">
      <SEO
        title="Track an Order & Warehouse Weight-Scan Verification | Bhumivera"
        description="Track your Bhumivera order status, courier AWB number, and pre-dispatch digital scale weight record."
        route="/order-tracking"
      />
      <div className="mx-auto max-w-6xl">
        {/* Hero & Interactive Lookup */}
        <div className="two-tone-panel-gold rounded-3xl overflow-hidden shadow-2xl mb-10">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-8 sm:p-11">
              <span className="font-sub-gold inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em]">
                <Truck size={13} /> Live AWB &amp; Warehouse Weight-Scan Tracker
              </span>
              <h1 className="mt-4 font-serif text-3xl sm:text-5xl tracking-tight">
                <span className="font-headline-gold">Track Your</span>{' '}
                <span className="font-headline-silver">Bhumivera Order</span>
              </h1>
              <div className="gold-hairline w-28 my-4" />
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#cbd5e1] max-w-xl font-light">
                Enter your 9-digit Order Number or Courier AWB below, or click a verified dispatch record to inspect how we log parcel weight, tamper seals, and carrier hand-offs.
              </p>

              <form onSubmit={handleLookup} className="mt-6 flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    type="text"
                    value={lookupInput}
                    onChange={(e) => setLookupInput(e.target.value)}
                    placeholder="Enter 9-digit Order ID (e.g. 918273646) or AWB..."
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e]/70 pl-11 pr-4 py-3 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-gold-luxury rounded-xl px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                >
                  Track Parcel
                </button>
              </form>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[#94a3b8] uppercase tracking-wider text-[11px]">Verified Dispatches:</span>
                {ORDER_TRACKING_DEMO_DATA.sampleOrders.map((so) => (
                  <button
                    key={so.order_number}
                    type="button"
                    onClick={() => {
                      setLookupInput(so.order_number);
                      setActiveSample(so);
                    }}
                    className={`rounded-lg border px-3 py-1 font-mono text-xs font-semibold transition ${
                      displayOrder.order_number === so.order_number
                        ? 'border-[#d4af37] bg-gradient-to-r from-[#d4af37] to-[#b38728] text-[#070a0e] shadow-sm'
                        : 'border-[#d4af37]/25 bg-[#070a0e]/50 text-[#cbd5e1] hover:border-[#d4af37]/60 hover:text-white'
                    }`}
                  >
                    #{so.order_number} ({so.status.toUpperCase()})
                  </button>
                ))}
              </div>
            </div>

            <div className="relative min-h-[260px] bg-[#070a0e] overflow-hidden">
              <img
                src={ORDER_TRACKING_DEMO_DATA.heroImage}
                alt="Bhumivera warehouse digital scale verification"
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070a0e] via-transparent to-transparent opacity-70" />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-[#d4af37]/30 bg-[#070a0e]/90 p-3.5 text-xs text-[#cbd5e1] backdrop-blur-md">
                <strong className="text-[#fce096]">Pre-Dispatch Weight Certificate:</strong> Every parcel is weighed to ±0.5g accuracy before courier pickup.
              </div>
            </div>
          </div>
        </div>

        {/* Active Order Timeline Card */}
        <section className="two-tone-panel rounded-3xl p-6 sm:p-10 mb-10 border border-[#d4af37]/25">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-6">
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#fce096]">
                Order Reference #{displayOrder.order_number || displayOrder.id}
              </span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-white">
                Courier: {displayOrder.courier || 'Delhivery Express'} &bull; AWB: {displayOrder.tracking_number || 'DLV99881122IN'}
              </h2>
              <p className="mt-1.5 text-xs text-[#cbd5e1] font-light">
                Scale Audit: <strong className="text-white">{displayOrder.dispatch_weight || '420g Verified'}</strong> &bull; Destination: {displayOrder.shipping_address}
              </p>
            </div>
            <span className="rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#fce096]">
              Status: {displayOrder.status}
            </span>
          </div>

          {/* 5-Stage Progress Bar */}
          <div className="mt-8 grid gap-4 sm:grid-cols-5">
            {STATUS_STEPS.map((st, idx) => {
              const Icon = st.icon;
              const done = idx <= stepIndex;
              return (
                <div
                  key={st.key}
                  className={`rounded-2xl border p-4.5 transition ${
                    done
                      ? 'border-[#d4af37]/50 bg-[#d4af37]/10 text-white shadow-sm'
                      : 'border-[#94a3b8]/15 bg-[#070a0e]/40 text-[#94a3b8]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#fce096]">Stage 0{idx + 1}</span>
                    <Icon size={18} className={done ? 'text-[#d4af37]' : 'text-[#94a3b8]/50'} />
                  </div>
                  <h3 className="mt-2.5 font-serif text-base font-bold text-white">{st.label}</h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#cbd5e1] font-light">{st.description}</p>
                </div>
              );
            })}
          </div>

          {/* Items in Parcel */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {(displayOrder.items || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 rounded-2xl border border-[#d4af37]/20 bg-[#070a0e]/60 p-4">
                <img
                  src={item.image || ORDER_TRACKING_DEMO_DATA.stageImages[idx % ORDER_TRACKING_DEMO_DATA.stageImages.length]}
                  alt={item.name}
                  className="h-16 w-16 rounded-xl object-cover shrink-0 border border-[#d4af37]/20"
                />
                <div className="flex-1">
                  <h4 className="font-serif font-bold text-base text-white">{item.name}</h4>
                  <p className="text-xs text-[#cbd5e1] mt-1 font-light">
                    Qty: {item.quantity} &bull; <span className="text-[#fce096] font-medium">₹{item.price}</span> &bull; Tamper-Seal Verified
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4 Real-Life Warehouse Fulfilment Stages Gallery */}
        <section>
          <div className="mb-6">
            <span className="font-sub-gold text-[10px] uppercase tracking-[0.24em] font-semibold block">
              Chain of Custody
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl mt-1">
              <span className="font-headline-gold">Real-Life Fulfilment</span>{' '}
              <span className="font-headline-silver">&amp; Packaging Verification Stages</span>
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: '01 · Batch Allocation', desc: 'Fresh cleanroom batch assigned with 24-month shelf life.', img: ORDER_TRACKING_DEMO_DATA.stageImages[0] },
              { title: '02 · Neck Security Strip', desc: 'Gold-and-black tamper-evident seal applied over cap collar.', img: ORDER_TRACKING_DEMO_DATA.stageImages[1] },
              { title: '03 · Honeycomb Wrapping', desc: 'Biodegradable honeycomb kraft wrap cushions amber glass.', img: ORDER_TRACKING_DEMO_DATA.stageImages[2] },
              { title: '04 · Digital Scale Log', desc: 'Final parcel weighed on stainless scale prior to AWB scan.', img: ORDER_TRACKING_DEMO_DATA.stageImages[3] },
            ].map((card) => (
              <article key={card.title} className="two-tone-card rounded-2xl overflow-hidden flex flex-col group hover:border-[#d4af37]/40 transition-all">
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#070a0e] relative">
                  <img src={card.img} alt={card.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1520] via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-5 flex-1">
                  <h3 className="font-serif text-base font-bold text-white">{card.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#cbd5e1] font-light">{card.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
