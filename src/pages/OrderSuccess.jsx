import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowRight, Check, Leaf, PackageCheck } from 'lucide-react';
import { orders as ordersApi } from '../services/api';

const projectNames = {
  'native-trees': 'Native tree restoration',
  'river-care': 'River care',
  'community-care': 'Community care',
};

export default function OrderSuccess() {
  const { state } = useLocation();
  const { orderId: paramOrderId } = useParams();
  const orderId = state?.orderId || paramOrderId;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderId));

  useEffect(() => {
    if (!orderId) return undefined;
    let active = true;
    ordersApi.getById(orderId).then(response => {
      if (active) setOrder(response.data?.order || response.data);
    }).catch(() => {
      if (active) setOrder(null);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [orderId]);

  const contribution = Number(order?.impact_amount || 0);

  return (
    <main className="min-h-[80svh] bg-[#f3f1e8] px-5 py-16 text-[#1a261e] md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-start gap-5 border-b border-[#263d31]/20 pb-8">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#233c2f] text-[#dce6c5]"><Check size={23}/></span>
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#536b4d]">Order received</p><h1 className="mt-2 font-serif text-4xl md:text-5xl">Thank you for choosing with care.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">Your order is being prepared. The full order and payment details are available in your account.</p></div>
        </div>

        <section className="grid gap-10 py-9 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-stone-500">Order reference</p>
            <p className="mt-2 font-mono text-2xl">#{orderId || '—'}</p>
            {order?.payment_mode && <p className="mt-3 text-sm text-stone-600">Payment: {order.payment_mode === 'COD' ? 'Cash on delivery' : order.payment_mode}</p>}
            {loading && <p className="mt-3 text-xs text-stone-500">Loading saved order details…</p>}
          </div>
          <div className="min-w-48 border-l border-[#263d31]/20 pl-6">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-500">Order total</p>
            <p className="mt-2 font-serif text-3xl">{order ? `₹${Number(order.total || 0).toLocaleString('en-IN')}` : '—'}</p>
          </div>
        </section>

        {contribution > 0 && <section className="border-y border-[#536b4d]/25 py-6" aria-live="polite">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3"><Leaf size={20} className="mt-1 shrink-0 text-[#536b4d]"/><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#536b4d]">Cause contribution</p><h2 className="mt-1 font-serif text-2xl">₹{contribution.toLocaleString('en-IN')} · {projectNames[order.impact_project] || 'Selected focus'}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">This was added to the cash due on delivery. It remains a pledge until collection is reconciled; it is not yet counted as a donation.</p></div></div>
            <span className={`w-fit border px-3 py-2 text-xs font-semibold uppercase tracking-widest ${order.impact_status === 'collected' ? 'border-emerald-800/30 text-emerald-900' : 'border-amber-800/30 text-amber-900'}`}><PackageCheck size={14} className="mr-2 inline"/>{order.impact_status || 'pledged'}</span>
          </div>
          <Link to="/impact" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#35533c] underline underline-offset-4">View the public impact ledger <ArrowRight size={15}/></Link>
        </section>}

        <div className="flex flex-wrap gap-3 pt-8">
          <Link to="/profile" className="inline-flex items-center gap-2 bg-[#233c2f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#35533c]">View your orders <ArrowRight size={16}/></Link>
          <Link to="/shop" className="border border-[#263d31]/30 px-5 py-3 text-sm font-semibold text-[#233c2f] hover:bg-white">Continue exploring</Link>
        </div>
      </div>
    </main>
  );
}
