import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowRight, Check, Gift, Leaf, LoaderCircle, PackageCheck, Sparkles } from 'lucide-react';
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
  const [spinRewards, setSpinRewards] = useState([]);
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
      setSpinRewards(Array.isArray(data.rewards) ? data.rewards : []);
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
      const segmentCount = spinRewards.length;
      if (!segmentCount || !Number.isInteger(Number(data.rewardIndex)) ||
          Number(data.rewardIndex) < 0 || Number(data.rewardIndex) >= segmentCount) {
        throw new Error('The configured reward wheel could not be matched to the issued reward. Please refresh and try again.');
      }
      const segmentAngle = 360 / segmentCount;
      const rewardCenterAngle = Number(data.rewardIndex) * segmentAngle + segmentAngle / 2;
      setSpinRotation(rotation => {
        const currentAngle = ((rotation % 360) + 360) % 360;
        const targetAngle = (360 - rewardCenterAngle + 360) % 360;
        const alignment = (targetAngle - currentAngle + 360) % 360;
        return rotation + 5 * 360 + alignment;
      });
      await new Promise(resolve => window.setTimeout(resolve, 4200));
      setSpinClaim({ reward: data.reward, couponCode: data.couponCode, rewardType: data.rewardType, pointsAwarded: data.pointsAwarded });
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
    <main className="min-h-[85svh] bg-[#070a0e] px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-[#e2e8f0] font-sans">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-start gap-5 border-b border-[#d4af37]/20 pb-8">
          <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d4af37] via-[#fce096] to-[#b38728] text-[#070a0e] shadow-lg shadow-[#d4af37]/20">
            <Check size={24} strokeWidth={2.5} />
          </span>
          <div>
            <p className="font-sub-gold text-xs font-semibold uppercase tracking-[0.26em]">
              Order Confirmed &amp; In Cleanroom Queue
            </p>
            <h1 className="mt-2 font-serif text-3xl sm:text-5xl tracking-tight">
              <span className="font-headline-gold">Thank You</span>{' '}
              <span className="font-headline-silver">for Choosing Pure Botanical Care</span>
            </h1>
            <div className="gold-hairline w-28 my-3" />
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#cbd5e1] font-light">
              Your formulation is being precision-allocated. Complete order verification and delivery milestones have been registered to your profile.
            </p>
          </div>
        </div>

        {!spinDismissed && spinStatus !== 'loading' && spinStatus !== 'disabled' && (
          <section className="mt-8 two-tone-panel-gold rounded-2xl p-6 sm:p-8 shadow-2xl" aria-live="polite">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/35 text-[#d4af37]">
                  <Gift size={20} />
                </span>
                <div>
                  <p className="font-sub-gold text-xs font-semibold uppercase tracking-[0.2em]">
                    Artisanal Appreciation
                  </p>
                  <h2 className="mt-1 font-serif text-2xl text-white">
                    {spinClaim ? 'Your reward is ready' : 'Your order unlocked a reward spin'}
                  </h2>
                  <p className="mt-1 max-w-xl text-xs sm:text-sm leading-relaxed text-[#cbd5e1] font-light">
                    Spin once to reveal an exclusive reward, complimentary priority shipping, or tier credits for your next ritual.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSpinDismissed(true)}
                className="w-8 h-8 rounded-full border border-[#cbd5e1]/20 bg-white/5 text-[#cbd5e1] hover:bg-white/10 flex items-center justify-center text-sm transition-colors"
                aria-label="Close reward spin"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            {!spinClaim && (
              <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
                <div className="flex flex-col items-center gap-4">
                <div className="relative h-48 w-48 shrink-0 rounded-full border-[6px] border-[#d4af37]/40 shadow-2xl">
                  <Motion.div
                    className="h-full w-full rounded-full"
                    style={{
                      background: `conic-gradient(${spinRewards.map((reward, index) => {
                        const segmentAngle = 360 / Math.max(spinRewards.length, 1);
                        const start = index * segmentAngle;
                        const end = (index + 1) * segmentAngle - 1;
                        const colors = ['#d4af37', '#101a26', '#fce096', '#0d1520', '#cbd5e1', '#070a0e'];
                        return `${colors[index % colors.length]} ${start}deg ${end}deg`;
                      }).join(', ')})`
                    }}
                    animate={{ rotate: spinRotation }}
                    transition={{ duration: 4, ease: 'easeOut' }}
                  />
                  <span className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#070a0e] text-[#d4af37] shadow-md">
                    <Sparkles size={18} />
                  </span>
                  <span className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 border-x-[9px] border-t-[14px] border-x-transparent border-t-[#d4af37] drop-shadow-md" aria-hidden="true" />
                </div>
                {spinRewards.length > 0 && (
                  <div className="w-full max-w-[22rem]">
                    <p className="mb-2 text-center font-sub-gold text-[10px] font-semibold uppercase tracking-[0.2em]">Possible rewards</p>
                    <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                      {spinRewards.map((reward, index) => (
                        <li key={`${reward.label}-${index}`} className="flex min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-[#070a0e]/50 px-2.5 py-2 text-[11px]">
                          <span className="flex min-w-0 items-center gap-2 text-[#fce096]">
                            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: ['#d4af37', '#101a26', '#fce096', '#0d1520', '#cbd5e1', '#070a0e'][index % 6] }} />
                            <span className="truncate">{reward.label}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                </div>
                <div className="max-w-sm text-center sm:text-left">
                  <button
                    type="button"
                    onClick={spinForReward}
                    disabled={spinning || spinStatus !== 'available' || spinRewards.length === 0}
                    className="btn-gold-luxury inline-flex min-h-12 items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl shadow-lg disabled:cursor-wait disabled:opacity-70"
                  >
                    {spinning ? (
                      <>
                        <LoaderCircle size={17} className="animate-spin text-[#070a0e]" />
                        Spinning…
                      </>
                    ) : (
                      <>
                        Spin for My Reward <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                  {spinError && <p role="alert" className="mt-3 text-xs text-rose-400 font-medium">{spinError}</p>}
                </div>
              </div>
            )}

            {spinClaim && (
              <div className="mt-6 rounded-xl border border-[#d4af37]/35 bg-[#070a0e]/80 p-5 text-white">
                <p className="text-sm font-serif font-bold text-[#fce096] uppercase tracking-wide">
                  You won: {spinClaim.reward}
                </p>
                {spinClaim.rewardType === 'points' ? (
                  <p className="mt-1.5 text-xs text-[#cbd5e1] font-light">
                    {spinClaim.pointsAwarded} loyalty points have been credited to your member balance.
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-[#cbd5e1] font-light">
                    Your personal reward voucher code:{' '}
                    <code className="rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fce096] px-2 py-0.5 font-mono font-bold">
                      {spinClaim.couponCode}
                    </code>
                  </p>
                )}
                <p className="mt-2 text-[11px] text-[#94a3b8]">
                  {spinClaim.rewardType === 'points'
                    ? 'Your updated loyalty credits are active now in your profile dashboard.'
                    : 'Find your spin voucher automatically linked during your next checkout.'}
                </p>
              </div>
            )}
          </section>
        )}

        <section className="two-tone-card rounded-2xl p-6 sm:p-8 my-8 border border-[#d4af37]/20 grid gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="font-sub-gold text-[10px] font-semibold uppercase tracking-[0.24em]">
              Order Reference
            </p>
            <p className="mt-1.5 font-mono text-2xl text-white font-bold">
              #{formatOrderNumber(order?.order_number || order?.id || orderId)}
            </p>
            {order?.payment_mode && (
              <p className="mt-2 text-xs text-[#cbd5e1] font-light">
                Payment Method: <span className="text-white font-medium">{order.payment_mode === 'COD' ? 'Cash on Delivery' : order.payment_mode}</span>
              </p>
            )}
            {loading && <p className="mt-2 text-xs text-[#94a3b8] animate-pulse">Retrieving order confirmation details…</p>}
          </div>
          <div className="md:border-l md:border-[#d4af37]/20 md:pl-8 flex flex-col justify-center">
            <p className="font-sub-gold text-[10px] font-semibold uppercase tracking-[0.24em]">
              Total Payable
            </p>
            <p className="mt-1 font-serif text-3xl font-bold text-white">
              {order ? `₹${Number(order.total || 0).toLocaleString('en-IN')}` : '—'}
            </p>
          </div>
        </section>

        {contribution > 0 && (
          <section className="two-tone-panel rounded-2xl p-6 my-6 border border-[#d4af37]/20" aria-live="polite">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <Leaf size={20} className="mt-1 shrink-0 text-[#d4af37]" />
                <div>
                  <p className="font-sub-gold text-[10px] font-semibold uppercase tracking-[0.2em]">
                    Artisanal Impact Contribution
                  </p>
                  <h2 className="mt-1 font-serif text-xl text-white">
                    ₹{contribution.toLocaleString('en-IN')} &bull; {projectNames[order.impact_project] || 'Restoration Initiative'}
                  </h2>
                  <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-[#cbd5e1] font-light">
                    Direct pledge registered towards sustainable botanical stewardship.
                  </p>
                </div>
              </div>
              <span className="w-fit border border-[#d4af37]/40 bg-[#d4af37]/10 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#fce096]">
                <PackageCheck size={14} className="mr-1.5 inline" />
                {order.impact_status || 'pledged'}
              </span>
            </div>
            <Link to="/impact" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#cbd5e1] hover:text-[#fce096] transition-colors underline underline-offset-4">
              View Public Impact Ledger <ArrowRight size={13} />
            </Link>
          </section>
        )}

        <div className="flex flex-wrap gap-4 pt-6">
          <Link
            to="/profile"
            className="btn-gold-luxury inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider"
          >
            View Your Orders <ArrowRight size={15} />
          </Link>
          <Link
            to="/shop"
            className="btn-silver-luxury px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider"
          >
            Continue Exploring Formulations
          </Link>
        </div>
      </div>
    </main>
  );
}
