import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orders as ordersApi } from '../services/api';
import SEO from '../components/SEO';
import {
  Package,
  CheckCircle2,
  Truck,
  ShoppingBag,
  PartyPopper,
  Search,
} from 'lucide-react';
import { ORDER_TRACKING_DATA } from '../data/bhumiveraUniqueData';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: ShoppingBag, description: 'Your order has been received.' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2, description: 'Your order has been confirmed.' },
  { key: 'packed', label: 'Packed', icon: Package, description: 'Your parcel is prepared for dispatch.' },
  { key: 'shipped', label: 'Shipped', icon: Truck, description: 'Your parcel has been handed to the courier.' },
  { key: 'delivered', label: 'Delivered', icon: PartyPopper, description: 'Your parcel has been marked delivered.' },
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
  const [lookupInput, setLookupInput] = useState(orderId || '');
  const [emailInput, setEmailInput] = useState('');
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setLookupInput(orderId || '');
    setActiveOrder(null);
    setErrorMessage('');
  }, [orderId]);

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setActiveOrder(null);
    setErrorMessage('');
    try {
      const response = await ordersApi.trackOrder(lookupInput.trim(), emailInput.trim());
      setActiveOrder(response.data?.order || null);
      if (!response.data?.order) {
        setErrorMessage('We could not find an order matching those details. Check your order number and checkout email.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Order tracking is temporarily unavailable. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  const displayOrder = activeOrder;
  const stepIndex = getStepIndex(displayOrder?.status);
  const statusLabel = displayOrder?.status?.replace(/_/g, ' ');

  return (
    <main className="min-h-screen bg-[#070a0e] text-[#e2e8f0] py-16 px-4 sm:px-8 font-sans">
      <SEO
        title="Track Your Order | Bhumivera"
        description="Look up your Bhumivera order status and courier tracking details using your order number and checkout email."
        route="/order-tracking"
      />
      <div className="mx-auto max-w-6xl">
        {/* Hero & Interactive Lookup */}
        <div className="two-tone-panel-gold rounded-3xl overflow-hidden shadow-2xl mb-10">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-8 sm:p-11">
              <span className="font-sub-gold inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em]">
                <Truck size={13} /> Order Status &amp; Courier Details
              </span>
              <h1 className="mt-4 font-serif text-3xl sm:text-5xl tracking-tight">
                <span className="font-headline-gold">Track Your</span>{' '}
                <span className="font-headline-silver">Bhumivera Order</span>
              </h1>
              <div className="gold-hairline w-28 my-4" />
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#cbd5e1] max-w-xl font-light">
                Look up your order with the order number and the email address used at checkout. Your status and courier details are retrieved from your order record.
              </p>

              <form onSubmit={handleLookup} className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="relative min-w-0">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    type="text"
                    value={lookupInput}
                    onChange={(e) => setLookupInput(e.target.value)}
                    required
                    aria-label="Order number"
                    placeholder="Order number"
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e]/70 pl-11 pr-4 py-3 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                  />
                </div>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  aria-label="Checkout email address"
                  placeholder="Email used at checkout"
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e]/70 px-4 py-3 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold-luxury rounded-xl px-6 py-3 text-xs font-semibold uppercase tracking-wider disabled:cursor-wait disabled:opacity-60 sm:col-span-2 sm:justify-self-start"
                >
                  {loading ? 'Looking up order…' : 'Track Order'}
                </button>
              </form>

              {errorMessage && (
                <p role="alert" className="mt-4 text-sm text-rose-300">{errorMessage}</p>
              )}
              <div className="mt-5 rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/45 p-4 text-xs leading-6 text-[#cbd5e1]">
                <strong className="text-[#fce096]">Where to find your details:</strong>{' '}
                Your order number is in your order confirmation email or under <Link to="/profile" className="underline underline-offset-2 hover:text-white">My Orders</Link>. The courier AWB / tracking number is shared in the dispatch confirmation after your order ships.
              </div>
            </div>

            <div className="relative min-h-[260px] bg-[#070a0e] overflow-hidden">
              <img
                src={ORDER_TRACKING_DATA.heroImage}
                alt="Bhumivera parcel being weighed before dispatch"
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070a0e] via-transparent to-transparent opacity-70" />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-[#d4af37]/30 bg-[#070a0e]/90 p-3.5 text-xs text-[#cbd5e1] backdrop-blur-md">
                <strong className="text-[#fce096]">Courier tracking:</strong> Use the AWB number from your dispatch confirmation on the courier’s tracking page for movement scans.
              </div>
            </div>
          </div>
        </div>

        {/* Active Order Timeline Card */}
        {displayOrder && <section className="two-tone-panel rounded-3xl p-6 sm:p-10 mb-10 border border-[#d4af37]/25">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-6">
            <div className="min-w-0 flex-1">
              <span className="break-all font-mono text-xs font-semibold uppercase tracking-widest text-[#fce096]">
                Order Reference #{displayOrder.order_number || displayOrder.id}
              </span>
              <h2 className="mt-1 max-w-full break-words font-serif text-xl leading-tight sm:text-2xl font-bold capitalize text-white [overflow-wrap:anywhere]">
                {displayOrder.courier || 'Courier details pending'}
              </h2>
              <p className="mt-1.5 break-words text-xs text-[#cbd5e1] font-light [overflow-wrap:anywhere]">
                AWB / tracking number: <strong className="break-all text-white">{displayOrder.tracking_number || 'Will appear here after dispatch.'}</strong>
              </p>
            </div>
            <span className="max-w-full break-words rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#fce096] [overflow-wrap:anywhere]">
              Status: {statusLabel}
            </span>
          </div>
          <p className="mt-4 text-xs leading-6 text-[#94a3b8]">
            Status reflects the latest update recorded for this order. Courier movement scans are provided by the carrier once an AWB has been issued.
          </p>

          {/* 5-Stage Progress Bar */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {STATUS_STEPS.map((st, idx) => {
              const Icon = st.icon;
              const done = idx <= stepIndex;
              return (
                <div
                  key={st.key}
                  className={`min-w-0 rounded-2xl border p-4 transition ${
                    done
                      ? 'border-[#d4af37]/50 bg-[#d4af37]/10 text-white shadow-sm'
                      : 'border-[#94a3b8]/15 bg-[#070a0e]/40 text-[#94a3b8]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#fce096]">Stage 0{idx + 1}</span>
                    <Icon size={18} className={done ? 'text-[#d4af37]' : 'text-[#94a3b8]/50'} />
                  </div>
                  <h3 className="mt-2.5 break-words font-serif text-base leading-snug font-bold text-white [overflow-wrap:anywhere]">{st.label}</h3>
                  <p className="mt-1 break-words text-[11px] leading-relaxed text-[#cbd5e1] font-light [overflow-wrap:anywhere]">{st.description}</p>
                </div>
              );
            })}
          </div>

        </section>}

        {/* 4 Real-Life Warehouse Fulfilment Stages Gallery */}
        <section>
          <div className="mb-6">
            <span className="font-sub-gold text-[10px] uppercase tracking-[0.24em] font-semibold block">
              Fulfilment &amp; Packaging
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl mt-1">
              <span className="font-headline-gold">How Your Order</span>{' '}
              <span className="font-headline-silver">Is Prepared</span>
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: '01 · Order & Batch', desc: 'Products are gathered and prepared for the customer order.', img: ORDER_TRACKING_DATA.stageImages[0] },
              { title: '02 · Tamper Seal', desc: 'A tamper-evident neck seal protects the product packaging.', img: ORDER_TRACKING_DATA.stageImages[1] },
              { title: '03 · Parcel Weighing', desc: 'The packed parcel is weighed before the courier label is prepared.', img: ORDER_TRACKING_DATA.stageImages[2] },
              { title: '04 · Bubble-Wrap Protection', desc: 'Bubble wrap cushions products inside the parcel for transit.', img: ORDER_TRACKING_DATA.stageImages[3] },
            ].map((card) => (
              <article key={card.title} className="two-tone-card min-w-0 rounded-2xl overflow-hidden flex flex-col group hover:border-[#d4af37]/40 transition-all">
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#070a0e] relative">
                  <img src={card.img} alt={card.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1520] via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-5 flex-1">
                  <h3 className="break-words font-serif text-base leading-snug font-bold text-white [overflow-wrap:anywhere]">{card.title}</h3>
                  <p className="mt-1 break-words text-xs leading-relaxed text-[#cbd5e1] font-light [overflow-wrap:anywhere]">{card.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
