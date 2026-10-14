import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowRight, Check, Gift, Leaf, LoaderCircle, PackageCheck } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { gamification as gamificationApi, orders as ordersApi } from '../services/api';
import { formatOrderNumber } from '../utils/formatOrderNumber';

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
  const [spinStatus, setSpinStatus] = useState('loading');
  const [spinError, setSpinError] = useState('');
  const [spinClaim, setSpinClaim] = useState(null);
  const [spinRotation, setSpinRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [spinDismissed, setSpinDismissed] = useState(false);

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

  const loadSpinStatus = useCallback(async () => {
    if (!orderId) return;
    setSpinStatus('loading');
    setSpinError('');
    try {
      const { data } = await gamificationApi.getOrderSpin(orderId);
      setSpinClaim(data.claim || null);
      setSpinStatus(data.enabled && data.eligible ? (data.claim ? 'claimed' : 'available') : 'disabled');
    } catch (error) {
      console.error('[ORDER_SUCCESS_SPIN_STATUS]', error);
      setSpinError(error.response?.data?.message || 'Could not check spin reward availability.');
      setSpinStatus('error');
    }
  }, [orderId]);

  useEffect(() => {
    void loadSpinStatus();
  }, [loadSpinStatus]);

  const spinForReward = async () => {
    if (spinning || spinStatus !== 'available') return;
    setSpinning(true);
    setSpinError('');
    try {
      const { data } = await gamificationApi.claimOrderSpin(orderId);
      setSpinRotation(rotation => rotation + 1800 + (Number(data.rewardIndex) % 6) * 60);
      await new Promise(resolve => window.setTimeout(resolve, 4200));
      setSpinClaim({ reward: data.reward, couponCode: data.couponCode });
      setSpinStatus('claimed');
    } catch (error) {
      console.error('[ORDER_SUCCESS_SPIN_CLAIM]', error);
      setSpinError(error.response?.data?.message || 'Your reward could not be issued. Please try again.');
    } finally {
      setSpinning(false);
    }
  };

  const contribution = Number(order?.impact_amount || 0);

  return (
    <main className="min-h-[80svh] bg-[#f3f1e8] px-5 py-16 text-[#1a261e] md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-start gap-5 border-b border-[#263d31]/20 pb-8">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#233c2f] text-[#dce6c5]"><Check size={23}/></span>
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#536b4d]">Order received</p><h1 className="mt-2 font-serif text-4xl md:text-5xl">Thank you for choosing with care.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">Your order is being prepared. The full order and payment details are available in your account.</p></div>
        </div>

        {!spinDismissed && spinStatus !== 'loading' && spinStatus !== 'disabled' && <section className="mt-8 rounded-2xl border border-[#cbd8bd] bg-[#fbfaf5] p-5 shadow-sm sm:p-7" aria-live="polite">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8efdf] text-[#35533c]"><Gift size={20}/></span>
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#526b4d]">A little thank-you</p><h2 className="mt-1 font-serif text-2xl text-[#14251c]">{spinClaim ? 'Your reward is ready' : 'Your order comes with a reward spin'}</h2><p className="mt-1 max-w-xl text-sm leading-5 text-stone-600">Spin once to reveal a personal coupon for a future Bhumivera order.</p></div>
            </div>
            <button type="button" onClick={() => setSpinDismissed(true)} className="rounded-full border border-[#d9dfd2] bg-white p-2 text-[#526b4d] hover:bg-[#f3f7ed]" aria-label="Close reward spin"><span aria-hidden="true">×</span></button>
          </div>
          {!spinClaim && <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
            <div className="relative h-40 w-40 shrink-0 rounded-full border-[6px] border-[#14251c] shadow-lg">
              <Motion.div
                className="h-full w-full rounded-full"
                style={{ background: 'conic-gradient(#d9e5c8 0deg 58deg,#526b4d 60deg 118deg,#e5d7b8 120deg 178deg,#82956e 180deg 238deg,#f0e9d9 240deg 298deg,#294434 300deg 358deg,#d9e5c8 360deg)' }}
                animate={{ rotate: spinRotation }}
                transition={{ duration: 4, ease: 'easeOut' }}
              />
              <span className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#14251c] bg-[#fbfaf5] text-[#526b4d]"><Gift size={18}/></span>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 border-x-[9px] border-b-[14px] border-x-transparent border-b-[#8b5a2b]" aria-hidden="true"/>
            </div>
            <div className="max-w-sm text-center sm:text-left">
              <button type="button" onClick={spinForReward} disabled={spinning} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#14251c] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#294434] disabled:cursor-wait disabled:opacity-70">
                {spinning ? <><LoaderCircle size={17} className="animate-spin"/>Spinning…</> : <>Spin for my reward <ArrowRight size={16}/></>}
              </button>
              {spinError && <p role="alert" className="mt-3 text-sm text-rose-700">{spinError}</p>}
            </div>
          </div>}
          {spinClaim && <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
            <p className="text-sm font-extrabold">You won: {spinClaim.reward}</p>
            <p className="mt-1 text-sm">Your personal coupon code is <code className="rounded bg-white px-2 py-1 font-mono font-bold">{spinClaim.couponCode}</code></p>
            <p className="mt-2 text-xs text-emerald-800">Use it on a future order before it expires. This reward is account-specific.</p>
          </div>}
        </section>}

        <section className="grid gap-10 py-9 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-stone-500">Order reference</p>
            <p className="mt-2 font-mono text-2xl">#{formatOrderNumber(order?.order_number || order?.id || orderId)}</p>
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
