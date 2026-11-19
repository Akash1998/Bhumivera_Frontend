import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowRight, Check, Gift, Leaf, LoaderCircle, PackageCheck, Sparkles } from 'lucide-react';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { gamification as gamificationApi, orders as ordersApi } from '../services/api';
import { formatOrderNumber } from '../utils/formatOrderNumber';

const projectNames = {
  'native-trees': 'Native tree restoration',
  'river-care': 'River care',
  'community-care': 'Community care',
};
const spinWheelColors = ['#eac75c', '#102019', '#f8e6a2', '#25372c', '#fff4d1', '#7d6020', '#d2e0d1', '#14222b'];
const spinWheelLabelColors = ['#182018', '#fff', '#182018', '#fff', '#182018', '#fff', '#182018', '#fff'];
const celebrationColors = ['#f8e6a2', '#eac75c', '#f6f0dc', '#8fc6a2', '#d2e0d1', '#fff'];
const celebrationPieces = Array.from({ length: 42 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  color: celebrationColors[(index * 3) % celebrationColors.length],
  drift: ((index * 17) % 260) - 130,
  rotation: ((index * 43) % 720) - 360,
  delay: (index % 9) * 0.035,
  size: 5 + (index % 6),
}));

function buildSpinRewardSegments(rewards) {
  const totalWeight = rewards.reduce((total, reward) => total + (Number(reward.chance) || 0), 0);
  if (totalWeight <= 0) return [];

  let accumulatedWeight = 0;
  return rewards.map((reward, index) => {
    const weight = Number(reward.chance) || 0;
    const startAngle = accumulatedWeight / totalWeight * 360;
    accumulatedWeight += weight;
    const endAngle = accumulatedWeight / totalWeight * 360;
    return {
      index,
      label: reward.label || reward.name || `Reward ${index + 1}`,
      wheelLabel: String(reward.label || reward.name || `Reward ${index + 1}`).length > 17
        ? `${String(reward.label || reward.name).slice(0, 16).trimEnd()}…`
        : reward.label || reward.name || `Reward ${index + 1}`,
      weight,
      color: spinWheelColors[index % spinWheelColors.length],
      textColor: spinWheelLabelColors[index % spinWheelLabelColors.length],
      startAngle,
      endAngle,
      centerAngle: (startAngle + endAngle) / 2,
    };
  });
}

export default function OrderSuccess() {
  const reduceMotion = useReducedMotion();
  const spinDuration = reduceMotion ? 350 : 5600;
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
  const [showSpinCelebration, setShowSpinCelebration] = useState(false);
  const spinRewardSegments = useMemo(() => buildSpinRewardSegments(spinRewards), [spinRewards]);

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
      const rewards = Array.isArray(data.rewards) ? data.rewards : [];
      setSpinClaim(data.claim || null);
      setSpinRewards(rewards);
      const claimedIndex = Number(data.claim?.rewardIndex);
      const claimedSegment = buildSpinRewardSegments(rewards)[claimedIndex];
      if (claimedSegment && claimedSegment.weight > 0) {
        setSpinRotation((360 - claimedSegment.centerAngle + 360) % 360);
      }
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

  useEffect(() => {
    if (!showSpinCelebration) return undefined;
    const timeout = window.setTimeout(() => setShowSpinCelebration(false), 5200);
    return () => window.clearTimeout(timeout);
  }, [showSpinCelebration]);

  const spinForReward = async () => {
    if (spinning || spinStatus !== 'available') return;
    setSpinning(true);
    setSpinError('');
    try {
      const { data } = await gamificationApi.claimOrderSpin(orderId);
      const segmentCount = spinRewards.length;
      const rewardSegment = spinRewardSegments[Number(data.rewardIndex)];
      if (!segmentCount || !Number.isInteger(Number(data.rewardIndex)) ||
          Number(data.rewardIndex) < 0 || Number(data.rewardIndex) >= segmentCount ||
          !rewardSegment || rewardSegment.weight <= 0) {
        throw new Error('The configured reward wheel could not be matched to the issued reward. Please refresh and try again.');
      }
      setSpinRotation(rotation => {
        const currentAngle = ((rotation % 360) + 360) % 360;
        const targetAngle = (360 - rewardSegment.centerAngle + 360) % 360;
        const alignment = (targetAngle - currentAngle + 360) % 360;
        return rotation + (reduceMotion ? 360 : 7 * 360) + alignment;
      });
      await new Promise(resolve => window.setTimeout(resolve, spinDuration));
      setSpinClaim({
        reward: data.reward,
        couponCode: data.couponCode,
        rewardType: data.rewardType,
        pointsAwarded: data.pointsAwarded,
        rewardDescription: data.rewardDescription,
        termsAndConditions: data.termsAndConditions,
        minimumOrderAmount: data.minimumOrderAmount,
      });
      setSpinStatus('claimed');
      setShowSpinCelebration(!reduceMotion);
    } catch (error) {
      console.error('[ORDER_SUCCESS_SPIN_CLAIM]', error);
      setSpinError(error.response?.data?.message || 'Your reward could not be issued. Please try again.');
    } finally {
      setSpinning(false);
    }
  };

  const contribution = Number(order?.impact_amount || 0);

  return (
    <main className="min-h-[85svh] bg-[#070a0e] px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-16 font-sans text-[#e2e8f0]">
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
          <section
            className="relative isolate mt-8 overflow-hidden rounded-[28px] border border-[#eac75c]/30 bg-[radial-gradient(ellipse_at_18%_0%,rgba(234,199,92,0.16),transparent_44%),linear-gradient(135deg,#17211b_0%,#0b1110_54%,#080d11_100%)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-8 lg:p-10"
            aria-live="polite"
            aria-label="Order reward wheel"
          >
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#d4af37]/[0.07] blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 left-1/4 h-64 w-64 rounded-full bg-emerald-500/[0.05] blur-3xl" />

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#eac75c]/40 bg-gradient-to-br from-[#eac75c]/25 to-[#d4af37]/5 text-[#f8e6a2] shadow-[0_0_30px_rgba(234,199,92,0.14)]">
                  <Gift size={22} />
                </span>
                <div>
                  <p className="font-sub-gold text-[10px] font-bold uppercase tracking-[0.28em] text-[#eac75c]">
                    A little something, just for you
                  </p>
                  <h2 className="mt-1 font-serif text-2xl leading-tight text-white sm:text-3xl">
                    {spinClaim ? 'Your reward is ready' : 'A reward is waiting'}
                  </h2>
                  <p className="mt-2 max-w-xl text-xs leading-relaxed text-[#cbd5e1] sm:text-sm">
                    {spinClaim
                      ? 'Your order earned a little extra. Here’s what you unlocked.'
                      : 'Give the wheel one spin and reveal your order thank-you reward.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSpinDismissed(true)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/20 text-[#cbd5e1] transition hover:border-[#eac75c]/40 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f8e6a2]"
                aria-label="Close reward spin"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="relative mt-8 grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(270px,0.95fr)] lg:gap-10">
              <div className="flex flex-col items-center">
                <div
                  className="relative h-64 w-64 sm:h-80 sm:w-80"
                  role="img"
                  aria-label={`Weighted reward wheel with ${spinRewardSegments.length} reward options`}
                >
                  <Motion.div
                    className="absolute inset-0 rounded-full border border-[#fff4d1]/30 bg-[#eac75c]/[0.04] shadow-[0_0_52px_rgba(234,199,92,0.16)]"
                    animate={spinning && !reduceMotion ? { rotate: 360 } : { rotate: 0 }}
                    transition={spinning && !reduceMotion ? { duration: 8, repeat: Infinity, ease: 'linear' } : { duration: 0.6 }}
                    aria-hidden="true"
                  >
                    {Array.from({ length: 24 }, (_, index) => {
                      const angle = (index * 15 * Math.PI) / 180;
                      return (
                        <span
                          key={index}
                          className={`absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full ${index % 3 === 0 ? 'bg-[#fff4d1]' : 'bg-[#eac75c]/55'}`}
                          style={{
                            left: `${50 + Math.sin(angle) * 49}%`,
                            top: `${50 - Math.cos(angle) * 49}%`,
                          }}
                        />
                      );
                    })}
                  </Motion.div>
                  <div className="absolute inset-[7px] rounded-full bg-gradient-to-br from-[#f8e6a2] via-[#98772b] to-[#f8e6a2] p-[7px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_12px_30px_rgba(0,0,0,0.55)]">
                    <Motion.div
                      className="relative h-full w-full overflow-hidden rounded-full border border-black/40 shadow-[inset_0_0_24px_rgba(0,0,0,0.55)]"
                      style={{
                        background: spinRewardSegments.length
                          ? `conic-gradient(${spinRewardSegments.map(segment =>
                            `${segment.color} ${segment.startAngle}deg ${segment.endAngle}deg`
                          ).join(', ')})`
                          : 'radial-gradient(circle, #25372c, #101a26)',
                      }}
                      animate={{ rotate: spinRotation }}
                      transition={{ duration: spinDuration / 1000, ease: [0.12, 0.82, 0.16, 1] }}
                    >
                      {spinRewardSegments.map(segment => {
                        const angle = (segment.centerAngle * Math.PI) / 180;
                        const x = Math.sin(angle) * 35;
                        const y = -Math.cos(angle) * 35;
                        const hasRoomForLabel = segment.endAngle - segment.startAngle >= 34;
                        return (
                          <span
                            key={segment.index}
                            className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center font-bold leading-tight [text-shadow:0_1px_4px_rgba(0,0,0,0.8)] ${
                              hasRoomForLabel ? 'w-[26%] text-[8px] sm:text-[9px]' : 'h-5 w-5 rounded-full border border-white/40 bg-black/35 text-[9px]'
                            }`}
                            style={{ left: `${50 + x}%`, top: `${50 + y}%`, color: segment.textColor }}
                          >
                            {hasRoomForLabel ? segment.wheelLabel : segment.index + 1}
                          </span>
                        );
                      })}
                      <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.2),transparent_34%,rgba(0,0,0,0.2)_100%)]" />
                      <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
                    </Motion.div>
                  </div>
                  <Motion.span
                    className="absolute -top-1 left-1/2 z-20 h-0 w-0 -translate-x-1/2 border-x-[12px] border-t-[22px] border-x-transparent border-t-[#fff4d1] drop-shadow-[0_3px_4px_rgba(0,0,0,0.8)]"
                    animate={spinning && !reduceMotion ? { y: [0, 3, 0] } : { y: 0}}
                    transition={spinning && !reduceMotion ? { duration: 0.22, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
                    aria-hidden="true"
                  />
                  <span className="absolute inset-0 z-10 m-auto flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full border-[3px] border-[#f8e6a2] bg-[radial-gradient(circle_at_35%_30%,#243126,#090d0d_68%)] text-[#f8e6a2] shadow-[0_0_0_5px_rgba(9,13,13,0.65),0_0_26px_rgba(234,199,92,0.5)] sm:h-[5rem] sm:w-[5rem]">
                    <Sparkles size={23} strokeWidth={1.8} />
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#cbd5e1]">
                  <span className={`h-1.5 w-1.5 rounded-full ${spinning ? 'animate-pulse bg-[#f8e6a2]' : 'bg-emerald-300'}`} />
                  {spinning ? 'Your reward is on its way' : spinClaim ? 'Your spin is complete' : 'One spin · one personal reward'}
                </div>
              </div>

              <div className="min-w-0">
                {spinClaim ? (
                  <Motion.div
                    initial={showSpinCelebration ? { opacity: 0, y: 18, scale: 0.97 } : false}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="rounded-2xl border border-[#f8e6a2]/35 bg-[linear-gradient(145deg,rgba(234,199,92,0.13),rgba(7,10,14,0.78)_58%)] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.28)] sm:p-6"
                  >
                    <div className="flex items-center gap-2 text-[#f8e6a2]">
                      <Sparkles size={15} />
                      <p className="text-[10px] font-black uppercase tracking-[0.24em]">
                        {showSpinCelebration ? 'Reward unlocked' : 'Your reward'}
                      </p>
                    </div>
                    <h3 className="mt-2 font-serif text-2xl font-bold leading-tight text-white sm:text-3xl">
                      {spinClaim.reward}
                    </h3>
                    {spinClaim.rewardDescription && !String(spinClaim.rewardDescription).startsWith('order_spin_reward:') && (
                      <p className="mt-2 text-sm leading-relaxed text-[#cbd5e1]">{spinClaim.rewardDescription}</p>
                    )}
                    {spinClaim.rewardType === 'points' ? (
                      <p className="mt-3 rounded-xl border border-emerald-200/15 bg-emerald-200/[0.06] p-3 text-xs leading-relaxed text-emerald-100">
                        <Check size={14} className="mr-1.5 inline" />
                        {spinClaim.pointsAwarded} loyalty points have been credited to your member balance.
                      </p>
                    ) : (
                      <>
                        <p className="mt-3 text-xs text-[#cbd5e1]">Your personal reward voucher code</p>
                        <code className="mt-1 inline-flex rounded-lg border border-[#d4af37]/50 bg-[#d4af37]/10 px-3 py-1.5 font-mono text-sm font-bold tracking-wider text-[#f8e6a2]">
                          {spinClaim.couponCode}
                        </code>
                      </>
                    )}
                    <p className="mt-3 text-[11px] leading-relaxed text-[#94a3b8]">
                      {spinClaim.rewardType === 'points'
                        ? 'Your updated loyalty credits are active now in your profile dashboard.'
                        : 'Your spin voucher is linked to your account for your next checkout.'}
                    </p>
                    {spinClaim.rewardType !== 'points' && (
                      <div className="mt-3 space-y-1.5 border-t border-[#d4af37]/15 pt-3 text-xs text-[#cbd5e1]">
                        <p>Minimum order: {Number(spinClaim.minimumOrderAmount) > 0 ? `₹${Number(spinClaim.minimumOrderAmount).toLocaleString('en-IN')}` : 'No minimum spend'}</p>
                        {spinClaim.termsAndConditions && <p>Terms and conditions: {spinClaim.termsAndConditions}</p>}
                      </div>
                    )}
                  </Motion.div>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="font-sub-gold text-[10px] font-bold uppercase tracking-[0.24em] text-[#eac75c]">
                        Your order, with a little extra
                      </p>
                      <h3 className="mt-1 font-serif text-xl text-white sm:text-2xl">
                        {spinning ? 'The wheel is choosing…' : 'Ready when you are'}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#aebbb4]">
                        Every slice is a possible thank-you. Your reward is issued securely when the wheel stops.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={spinForReward}
                      disabled={spinning || spinStatus !== 'available' || spinRewards.length === 0}
                      className="group relative inline-flex min-h-[3.5rem] w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-[#fff0b7]/70 bg-gradient-to-r from-[#f5df9a] via-[#eac75c] to-[#bd912f] px-6 py-3 text-xs font-black uppercase tracking-[0.15em] text-[#182018] shadow-[0_10px_30px_rgba(234,199,92,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(234,199,92,0.34)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fff4d1] disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      <span aria-hidden="true" className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 transition-transform duration-700 group-hover:translate-x-[430%]" />
                      {spinning ? (
                        <>
                          <LoaderCircle size={17} className="animate-spin" />
                          Spinning…
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          Spin for my reward
                          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                    {spinError && <p role="alert" className="mt-3 text-xs font-medium text-rose-300">{spinError}</p>}
                    <p className="mt-2 text-center text-[10px] leading-relaxed text-[#87948d]">
                      One spin is available for this order. Your reward will be added to your account.
                    </p>
                  </>
                )}

                {spinRewardSegments.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#93a097]">
                        {spinClaim ? 'On the wheel' : 'Rewards in the wheel'}
                      </p>
                      <span className="text-[9px] font-mono text-[#718078]">{spinRewardSegments.length} rewards</span>
                    </div>
                    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                      {spinRewardSegments.map(segment => (
                        <li key={segment.index} className="flex min-w-0 items-center gap-2.5 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white/10" style={{ backgroundColor: segment.color }} />
                          <span className="min-w-0 flex-1 truncate text-xs font-semibold text-[#e3e8e3]">{segment.label}</span>
                          <span className="shrink-0 font-mono text-[9px] text-[#86948b]">{Math.round(segment.weight / spinRewardSegments.reduce((sum, item) => sum + item.weight, 0) * 100)}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <AnimatePresence>
              {showSpinCelebration && (
                <Motion.div
                  className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {celebrationPieces.map((piece, index) => (
                    <Motion.span
                      key={index}
                      className="absolute top-0 rounded-[2px] shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                      style={{ left: piece.left, width: piece.size, height: piece.size * 1.7, backgroundColor: piece.color }}
                      initial={{ opacity: 0, y: -24, rotate: 0, x: 0 }}
                      animate={{ opacity: [0, 1, 1, 0], y: 520, rotate: piece.rotation, x: piece.drift }}
                      transition={{ duration: 2.8, delay: piece.delay, ease: 'easeIn' }}
                    />
                  ))}
                  <Motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#fff4d1]/50 bg-[#101812]/90 px-5 py-2.5 text-center text-[10px] font-black uppercase tracking-[0.24em] text-[#fff4d1] shadow-[0_0_40px_rgba(234,199,92,0.35)] backdrop-blur-md"
                    initial={{ opacity: 0, scale: 0.6, y: 12 }}
                    animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1.06, 1, 0.96], y: [12, 0, 0, -6] }}
                    transition={{ duration: 3.4, times: [0, 0.18, 0.78, 1], ease: 'easeOut' }}
                  >
                    <Sparkles size={14} className="mr-1.5 inline" />
                    Reward unlocked
                  </Motion.div>
                </Motion.div>
              )}
            </AnimatePresence>
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
