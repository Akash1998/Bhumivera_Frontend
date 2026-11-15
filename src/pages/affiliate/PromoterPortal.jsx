import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle, CheckCircle2, Copy, ExternalLink, Film, Gift,
  IndianRupee, RefreshCw, ShieldCheck, Sliders, Sparkles, Zap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { affiliate as affiliateApi } from '../../services/api';

const INITIAL_FORM = {
  socialPlatform: '',
  socialHandle: '',
  profileUrl: '',
  followerCount: '',
  followerTier: '',
  contentNiche: '',
  collaborationType: '',
};

const SOCIAL_PLATFORMS = [
  { name: 'Facebook', Icon: FaFacebookF, color: '#1877F2' },
  { name: 'Instagram', Icon: FaInstagram, color: '#E1306C' },
  { name: 'YouTube', Icon: FaYoutube, color: '#FF0000' },
];

const AUDIENCE_TIERS = [
  ['under_1k', 'Under 1,000'],
  ['1k_10k', '1,000–10,000'],
  ['10k_50k', '10,001–50,000'],
  ['50k_plus', '50,001+'],
];

const CONTENT_NICHES = ['Skincare', 'Haircare', 'Lifestyle', 'Wellness', 'Unboxing'];

const REEL_HOOK_SCRIPTS = [
  {
    tag: 'Hook #1 · Barrier Repair & Glow',
    title: 'Why my skin barrier hated harsh cleansers until I switched to 4% Himalayan Sea Buckthorn',
    script: 'Show texture close-up in natural window light -> lather on damp skin for 10 seconds -> point out zero tightness after rinsing + mention 0.1% Niacinamide & Hyaluronic Acid -> drop your custom code for 10% off + free gift above ₹799.',
  },
  {
    tag: 'Hook #2 · Pore Detox Routine',
    title: '3% Activated Charcoal + 5% Glycerin: Deep pore detox without stripping natural oils',
    script: 'Start with post-commute/workout skin -> apply 1 pump of Bhumivera Charcoal Face Wash -> show fresh matte-yet-hydrated finish -> share your promoter code in caption & first comment.',
  },
  {
    tag: 'Hook #3 · Unboxing + QR Authenticity',
    title: 'Scanning the QR code on my Bhumivera bottle to unlock ₹300 reward credit live',
    script: 'Film unboxing the gold-accented bottle -> scan the serialized authenticity QR on camera -> show batch lab metrics & ₹300 box gift claim -> invite followers to use your personal discount code.',
  },
];

const DEFAULT_MILESTONES = [
  { ordersRequired: 3, rewardInr: 500, label: '₹500 Bhumivera Luxury Store Gift Card', shareBoost: null },
  { ordersRequired: 10, rewardInr: 1200, label: '₹1,200 Creator Bonus + Full-Range 6-SKU PR Box', shareBoost: null },
  { ordersRequired: 25, rewardInr: 2500, label: '₹2,500 VIP Gift Card + 25% Profit-Share Upgrade', shareBoost: 25 },
];

const formatMoney = value => `₹${(Number(value) || 0).toFixed(2)}`;

export default function PromoterPortal() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingPerks, setSavingPerks] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [copied, setCopied] = useState(false);
  const [editingApplication, setEditingApplication] = useState(false);
  const [ownsProfile, setOwnsProfile] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [redirectSeconds, setRedirectSeconds] = useState(5);

  const [simOrdersPerMonth, setSimOrdersPerMonth] = useState(15);
  const [simBasketSp, setSimBasketSp] = useState(950);
  const [customCodeInput, setCustomCodeInput] = useState('');
  const [reelUrlInput, setReelUrlInput] = useState('');
  const [trialOrderIdInput, setTrialOrderIdInput] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await affiliateApi.getPartnerDashboard();
      const data = response.data?.dashboard || null;
      setDashboard(data);
      if (data?.partner) {
        setForm({
          socialPlatform: data.partner.social_platform || 'Instagram',
          socialHandle: data.partner.social_handle || '',
          profileUrl: data.partner.profile_url || '',
          followerCount: String(data.partner.follower_count ?? ''),
          followerTier: data.partner.follower_tier || '',
          contentNiche: data.partner.content_niche || '',
          collaborationType: data.partner.collaboration_type || '',
        });
        setCustomCodeInput(data.partner.referral_code || '');
        setReelUrlInput(data.partner.reel_submission_url || '');
        setTrialOrderIdInput(data.partner.trial_order_id ? String(data.partner.trial_order_id) : '');
      }
    } catch (loadError) {
      setError(loadError.response?.data?.message || 'Could not load the promoter portal.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);
  useEffect(() => {
    if (!celebrating) return undefined;
    const countdown = window.setInterval(() => {
      setRedirectSeconds(seconds => Math.max(0, seconds - 1));
    }, 1000);
    const redirect = window.setTimeout(() => navigate('/impact', { replace: true }), 5000);
    return () => {
      window.clearInterval(countdown);
      window.clearTimeout(redirect);
    };
  }, [celebrating, navigate]);

  const partner = dashboard?.partner;
  const shareUrl = useMemo(() => partner?.referral_code
    ? `${window.location.origin}/?aff=${encodeURIComponent(partner.referral_code)}`
    : '', [partner?.referral_code]);

  const simProjection = useMemo(() => {
    const discPct = Number(partner?.discount_percent ?? 10);
    const sharePct = Number(partner?.commission_share_percent ?? 20);
    const fulfill = Number(dashboard?.programConfig?.fulfillment_cost ?? 110);
    const rto = Number(dashboard?.programConfig?.rto_reserve ?? 40);
    const netBuyerPaid = simBasketSp * (1 - discPct / 100);
    const revExGst = netBuyerPaid / 1.12;
    const estCogs = simBasketSp * 0.34;
    const contribProfit = Math.max(0, revExGst - estCogs - fulfill - rto - netBuyerPaid * 0.02);
    const perOrderComm = Math.round(contribProfit * (sharePct / 100));
    const monthlyCash = perOrderComm * simOrdersPerMonth;
    const unlockedGiftCards = (simOrdersPerMonth >= 3 ? 500 : 0) + (simOrdersPerMonth >= 10 ? 1200 : 0) + (simOrdersPerMonth >= 25 ? 2500 : 0);
    return {
      perOrderComm,
      monthlyCash,
      unlockedGiftCards,
      totalMonthlyValue: monthlyCash + unlockedGiftCards + 300,
    };
  }, [partner?.discount_percent, partner?.commission_share_percent, dashboard?.programConfig, simBasketSp, simOrdersPerMonth]);

  const apply = async event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    if (!form.socialPlatform) {
      setError('Choose the platform where you have your largest audience.');
      return;
    }
    if (!ownsProfile) {
      setError('Please confirm that you own or manage this profile.');
      return;
    }
    setSubmitting(true);
    setError('');
    setNotice('');
    try {
      await affiliateApi.applyForPartner({
        ...form,
        followerCount: Number(form.followerCount || 0),
      });
      setNotice('Application received. Your reserved promoter code remains inactive while the team reviews your profile.');
      await loadDashboard();
      setCelebrating(true);
    } catch (applyError) {
      setError(applyError.response?.data?.message || 'Could not submit your application.');
    } finally {
      setSubmitting(false);
    }
  };

  const savePartnerPerks = async event => {
    event.preventDefault();
    if (!affiliateApi.updatePartnerPerks) return;
    setSavingPerks(true);
    setError('');
    setNotice('');
    try {
      const response = await affiliateApi.updatePartnerPerks({
        customCode: customCodeInput.trim().toUpperCase(),
        reelUrl: reelUrlInput.trim(),
        trialOrderId: trialOrderIdInput ? Number(trialOrderIdInput) : null,
      });
      if (response.data?.dashboard) {
        setDashboard(response.data.dashboard);
      } else {
        await loadDashboard();
      }
      setNotice('Your creator code and Reel cashback submission have been updated.');
    } catch (perkError) {
      setError(perkError.response?.data?.message || 'Could not update your creator settings.');
    } finally {
      setSavingPerks(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setNotice('Your promoter link has been copied.');
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Clipboard access is unavailable. Select and copy the link manually.');
    }
  };

  const deliveredOrdersCount = Number(dashboard?.summary?.delivered_orders || 0);
  const giftCardBalance = Number(dashboard?.summary?.gift_card_balance || (partner?.status === 'approved' ? 300 : 0));
  const milestones = dashboard?.milestones || DEFAULT_MILESTONES.map(m => ({
    ...m,
    unlocked: deliveredOrdersCount >= m.ordersRequired,
    progressPct: Math.min(100, Math.round((deliveredOrdersCount / m.ordersRequired) * 100)),
    remainingOrders: Math.max(0, m.ordersRequired - deliveredOrdersCount),
  }));

  const cardClass = 'rounded-2xl border border-[#D4AF37]/25 bg-[#102A1E]/95 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.25)] sm:p-7';

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07180F] px-4 py-8 text-[#DFD7C4] sm:py-12">
      <div className="relative mx-auto max-w-7xl space-y-7">
        <header className="relative overflow-hidden rounded-[2rem] border border-[#D4AF37]/30 bg-gradient-to-br from-[#17422F] via-[#103322] to-[#0B2117] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:p-9">
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-black/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FCE096]">
                <ShieldCheck size={14}/> Bhumivera Co-Creator &amp; Partner Desk
              </p>
              <h1 className="mt-4 font-serif text-3xl font-bold text-white sm:text-5xl">Share, Collaborate &amp; Unlock Perks</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#C5D8CC]">
                Choose your collaboration track: earn recurring profit-share commissions + instant Bhumivera Store Gift Cards, or claim 100% trial order cashback when your Reel goes live.
              </p>
            </div>
            <button type="button" onClick={loadDashboard} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/10 px-3 py-2.5 text-xs font-semibold text-white transition hover:border-[#D4AF37]/50 disabled:opacity-50">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>Refresh
            </button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#D4AF37]/35 bg-gradient-to-br from-[#133524] to-[#0b1f15] p-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FCE096]">
              <Zap size={12}/> Option 1 · Profit-Share + Gift Card Track
            </span>
            <h3 className="mt-3 font-serif text-xl font-bold text-white">20% Profit Share + ₹300 Instant Welcome Gift Card</h3>
            <p className="mt-1.5 text-xs leading-5 text-[#B7C9BD]">
              Get a custom code giving your followers <strong>10% off</strong> + free milestone gifts. You receive a <strong>₹300 Bhumivera Gift Card</strong> in your wallet on approval, earn <strong>20%–25% contribution profit share</strong> on every delivered order, and unlock <strong>₹500, ₹1,200 &amp; ₹2,500 milestone bonuses</strong>.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-[#102E24] to-[#091A14] p-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
              <Gift size={12}/> Option 2 · 100% Cashback Trial + Barter PR Track
            </span>
            <h3 className="mt-3 font-serif text-xl font-bold text-white">100% Order Reimbursement on Reel Publish</h3>
            <p className="mt-1.5 text-xs leading-5 text-[#B7C9BD]">
              Order your favorite Bhumivera products using your ₹300 Welcome Gift Card or Creator Trial code. Publish <strong>1 honest review Reel + 2 Stories</strong> tagging <strong>@bhumivera</strong>, submit your Reel link below, and get <strong>100% of your paid amount refunded</strong> + ongoing commissions!
            </p>
          </div>
        </section>

        {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-950/30 p-3 text-sm text-rose-200"><AlertCircle size={17} className="mt-0.5 shrink-0"/>{error}</div>}
        {notice && <p role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-950/20 p-3 text-sm text-emerald-200">{notice}</p>}

        {loading ? <div className={cardClass}>Loading your promoter account…</div> : !partner || (partner.status === 'rejected' && editingApplication) ? (
          <form onSubmit={apply} className="space-y-6 rounded-[1.75rem] border border-[#D4AF37]/20 bg-[#0D261B]/70 p-5 text-[#DFD7C4] shadow-[0_24px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-8">
            <div className="flex items-start gap-4 border-b border-white/10 pb-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#F0D98A]"><Gift size={21}/></span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#D4AF37]">Promoter application</p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-white sm:text-3xl">Join the Bhumivera Creator Program</h2>
                <p className="mt-2 text-sm leading-6 text-[#B4C7BB]">Select your platform and preferred collaboration track to unlock your ₹300 Welcome Gift Card and custom promo code.</p>
              </div>
            </div>

            <fieldset>
              <legend className="text-sm font-bold text-white">Choose your main platform</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {SOCIAL_PLATFORMS.map(({ name, Icon, color }) => {
                  const selected = form.socialPlatform === name;
                  return (
                    <label key={name} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition ${selected ? 'border-[#D4AF37]/55 bg-[#D4AF37]/10' : 'border-white/10 bg-white/[0.035]'}`}>
                      <input type="radio" name="socialPlatform" value={name} checked={selected} onChange={event => setForm(current => ({ ...current, socialPlatform: event.target.value }))} aria-label={name} className="sr-only"/>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/20">{React.createElement(Icon, { size: 19, style: { color } })}</span>
                      <span className="text-sm font-semibold text-white">{name}</span>
                      {selected && <CheckCircle2 size={17} className="ml-auto text-[#F0D98A]"/>}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <label htmlFor="promoter-handle" className="space-y-2 text-sm font-semibold text-[#E7EEE8]">
                Profile name or handle
                <input id="promoter-handle" required maxLength={120} value={form.socialHandle} onChange={event => setForm(current => ({ ...current, socialHandle: event.target.value }))} placeholder="@yourname" className="w-full rounded-xl border border-white/10 bg-[#07180F]/65 px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]/60"/>
              </label>
              <label htmlFor="promoter-follower-tier" className="space-y-2 text-sm font-semibold text-[#E7EEE8]">
                Follower / subscriber tier
                <select id="promoter-follower-tier" required value={form.followerTier} onChange={event => setForm(current => ({ ...current, followerTier: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#07180F]/65 px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]/60">
                  <option value="">Choose a range</option>
                  {AUDIENCE_TIERS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label htmlFor="promoter-content-niche" className="space-y-2 text-sm font-semibold text-[#E7EEE8]">
                Primary content niche
                <select id="promoter-content-niche" required value={form.contentNiche} onChange={event => setForm(current => ({ ...current, contentNiche: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#07180F]/65 px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]/60">
                  <option value="">Choose your niche</option>
                  {CONTENT_NICHES.map(niche => <option key={niche} value={niche}>{niche}</option>)}
                </select>
              </label>
              <label htmlFor="promoter-collaboration-type" className="space-y-2 text-sm font-semibold text-[#E7EEE8]">
                Preferred collaboration track
                <select id="promoter-collaboration-type" required value={form.collaborationType} onChange={event => setForm(current => ({ ...current, collaborationType: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#07180F]/65 px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]/60">
                  <option value="">Choose your track</option>
                  <option value="both">Option 1 + 2: 20% Profit Share + ₹300 Welcome Gift Card + 100% Reel Cashback</option>
                  <option value="affiliate_commission">Option 1: 20% Profit Share + Milestone Gift Cards</option>
                  <option value="product_gifting">Option 2: 100% Reel Cashback Trial + Product Gifting Barter</option>
                </select>
              </label>
            </div>

            <label htmlFor="promoter-profile-url" className="block space-y-2 text-sm font-semibold text-[#E7EEE8]">
              Public profile link
              <input id="promoter-profile-url" required type="url" maxLength={500} value={form.profileUrl} onChange={event => setForm(current => ({ ...current, profileUrl: event.target.value }))} placeholder="https://instagram.com/yourprofile" className="w-full rounded-xl border border-white/10 bg-[#07180F]/65 px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]/60"/>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-[#C5D8CC]">
              <input type="checkbox" checked={ownsProfile} onChange={event => setOwnsProfile(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#D4AF37]"/>
              <span>I confirm that I own or manage this profile and that the details above are accurate.</span>
            </label>

            <button type="submit" disabled={submitting} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 text-sm font-bold text-[#102219] transition hover:bg-[#FCE096] disabled:opacity-60">
              {submitting ? 'Sending application…' : 'Send application & reserve ₹300 Gift Card'} <ExternalLink size={15}/>
            </button>
          </form>
        ) : partner.status === 'pending' ? (
          <section className={`${cardClass} mx-auto max-w-2xl`}>
            <span className="rounded-full border border-amber-400/30 bg-amber-950/30 px-3 py-1 text-[10px] font-bold uppercase text-amber-100">Application under review</span>
            <h2 className="mt-4 font-serif text-2xl font-bold text-white">Your ₹300 Welcome Gift Card &amp; Code Are Reserved!</h2>
            <p className="mt-2 text-sm leading-6 text-[#9BB0A5]">Our team reviews applications within 12–24 hours. The moment you are approved, your ₹300 Bhumivera Gift Card will be credited to your wallet and your code below will go live.</p>
            {partner.referral_code && <div className="mt-4 rounded-xl border border-[#315541] bg-[#0b1c14] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#9BB0A5]">Reserved promoter code · inactive</p>
              <p className="mt-1 font-mono text-lg font-bold tracking-widest text-[#FCE096]">{partner.referral_code}</p>
            </div>}
          </section>
        ) : (
          <>
            <section className={`${cardClass} grid gap-5 lg:grid-cols-[1.2fr_0.8fr]`}>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-900/50 px-3 py-1 text-[10px] font-bold uppercase text-emerald-200">{partner.status}</span>
                  <span className="text-xs text-[#9BB0A5]">{partner.social_platform} · {partner.social_handle}</span>
                </div>
                <h2 className="mt-3 font-serif text-2xl font-bold text-white">Your Active Creator Code &amp; Offer</h2>
                <p className="mt-1 text-sm leading-6 text-[#9BB0A5]">
                  Your audience gets <strong className="text-[#FCE096]">{Number(partner.discount_percent)}% off</strong> + free milestone gifts above ₹799. Your profit share is <strong className="text-[#FCE096]">{Number(partner.commission_share_percent)}%</strong> of contribution profit.
                </p>
                <div className="mt-4 rounded-xl border border-[#315541] bg-[#0b1c14] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9BB0A5]">Active Promoter Code</p>
                  <p className="mt-1 font-mono text-2xl font-bold tracking-widest text-[#FCE096]">{partner.referral_code}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-3.5 py-2 text-xs font-bold text-[#102219]"><Copy size={14}/>{copied ? 'Copied' : 'Copy offer link'}</button>
                    <a href={shareUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#315541] px-3.5 py-2 text-xs text-white">Preview store link <ExternalLink size={13}/></a>
                  </div>
                  <p className="mt-2 break-all text-[11px] text-[#9BB0A5]">{shareUrl}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
                {[
                  ['Gift Card Vault Balance', formatMoney(giftCardBalance)],
                  ['Delivered / Total Orders', `${deliveredOrdersCount} / ${dashboard.summary?.attributed_orders ?? 0}`],
                  ['Pending Delivery Commission', formatMoney(dashboard.summary?.pending_commission)],
                  ['Ready for UPI Payout', formatMoney(dashboard.summary?.payable_commission)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-[#315541] bg-[#0b1c14] p-4">
                    <span className="text-xs text-[#9BB0A5]">{label}</span>
                    <p className="mt-2 font-serif text-xl font-bold text-[#FCE096]">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className={cardClass}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Creator Perk &amp; Gift Card Vault</p>
                  <h2 className="mt-1 font-serif text-xl font-bold text-white">Unlock Free Luxury Gift Cards &amp; 25% Profit Share</h2>
                </div>
                <span className="rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3 py-1 text-xs font-bold text-[#FCE096]">
                  Welcome Perk: ₹300 Gift Card Active
                </span>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {milestones.map(m => (
                  <div key={m.ordersRequired} className={`rounded-xl border p-4 ${m.unlocked ? 'border-emerald-400/50 bg-emerald-950/25' : 'border-[#315541] bg-[#0b1c14]'}`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold uppercase tracking-wider text-[#D4AF37]">{m.ordersRequired} Delivered Orders</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${m.unlocked ? 'bg-emerald-500/20 text-emerald-200' : 'bg-white/10 text-[#9BB0A5]'}`}>
                        {m.unlocked ? 'UNLOCKED' : `${m.remainingOrders} more to go`}
                      </span>
                    </div>
                    <p className="mt-2 font-serif text-base font-bold text-white">{m.label}</p>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/40">
                      <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FCE096]" style={{ width: `${m.progressPct}%` }}/>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className={cardClass}>
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Sliders size={18}/>
                  <h2 className="font-serif text-xl font-bold text-white">Live Creator Earnings Simulator</h2>
                </div>
                <p className="mt-1 text-xs text-[#9BB0A5]">Slide to estimate your monthly cash commissions + unlocked Bhumivera Gift Cards.</p>
                <div className="mt-4 space-y-4">
                  <label className="block space-y-1 text-xs">
                    <div className="flex justify-between font-semibold text-white">
                      <span>Delivered orders per month</span>
                      <span className="text-[#FCE096]">{simOrdersPerMonth} orders/mo</span>
                    </div>
                    <input type="range" min="1" max="50" value={simOrdersPerMonth} onChange={e => setSimOrdersPerMonth(Number(e.target.value))} className="w-full accent-[#D4AF37]"/>
                  </label>
                  <label className="block space-y-1 text-xs">
                    <div className="flex justify-between font-semibold text-white">
                      <span>Average follower cart size (SP)</span>
                      <span className="text-[#FCE096]">₹{simBasketSp}</span>
                    </div>
                    <input type="range" min="650" max="1650" step="50" value={simBasketSp} onChange={e => setSimBasketSp(Number(e.target.value))} className="w-full accent-[#D4AF37]"/>
                  </label>
                  <div className="grid grid-cols-3 gap-2 rounded-xl border border-[#315541] bg-[#0b1c14] p-3 text-center">
                    <div>
                      <span className="text-[10px] text-[#9BB0A5]">Cash Commission</span>
                      <p className="mt-1 font-serif text-lg font-bold text-white">₹{simProjection.monthlyCash}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#9BB0A5]">Milestone Gift Cards</span>
                      <p className="mt-1 font-serif text-lg font-bold text-[#FCE096]">₹{simProjection.unlockedGiftCards + 300}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#9BB0A5]">Total Monthly Value</span>
                      <p className="mt-1 font-serif text-lg font-bold text-emerald-300">₹{simProjection.totalMonthlyValue}</p>
                    </div>
                  </div>
                </div>
              </section>

              <form onSubmit={savePartnerPerks} className={`${cardClass} space-y-4`}>
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Film size={18}/>
                  <h2 className="font-serif text-xl font-bold text-white">Custom Vanity Code &amp; 100% Reel Cashback</h2>
                </div>
                <p className="text-xs text-[#9BB0A5]">Set a memorable code for your Reels (e.g., <strong>AYEESHA10</strong>) and paste your published Reel link to unlock 100% trial order cashback.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1 text-xs font-semibold text-white">
                    Custom Vanity Promo Code
                    <input value={customCodeInput} onChange={e => setCustomCodeInput(e.target.value.toUpperCase())} maxLength={20} placeholder="AYEESHA10" className="w-full rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-2 font-mono text-sm text-[#FCE096]"/>
                  </label>
                  <label className="space-y-1 text-xs font-semibold text-white">
                    Trial Order # (for 100% Cashback)
                    <input type="number" value={trialOrderIdInput} onChange={e => setTrialOrderIdInput(e.target.value)} placeholder="e.g. 104" className="w-full rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-2 text-sm text-white"/>
                  </label>
                </div>
                <label className="block space-y-1 text-xs font-semibold text-white">
                  Published Instagram Reel / YouTube Short Link
                  <input type="url" value={reelUrlInput} onChange={e => setReelUrlInput(e.target.value)} placeholder="https://www.instagram.com/reel/..." className="w-full rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-2 text-sm text-white"/>
                </label>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#9BB0A5]">Cashback status: <strong className="uppercase text-[#FCE096]">{partner.trial_cashback_status || 'none'}</strong></span>
                  <button type="submit" disabled={savingPerks} className="rounded-lg bg-[#D4AF37] px-4 py-2 text-xs font-bold text-[#102219] hover:bg-[#FCE096] disabled:opacity-50">
                    {savingPerks ? 'Saving…' : 'Save Code & Submit Reel'}
                  </button>
                </div>
              </form>
            </div>

            <section className={cardClass}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Creator Content Playbook</p>
              <h2 className="mt-1 font-serif text-xl font-bold text-white">3 High-Converting 15-Second Reel Hooks</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {REEL_HOOK_SCRIPTS.map(hook => (
                  <div key={hook.tag} className="rounded-xl border border-[#315541] bg-[#0b1c14] p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FCE096]">{hook.tag}</span>
                    <h3 className="mt-1.5 font-serif text-sm font-bold text-white">“{hook.title}”</h3>
                    <p className="mt-2 text-xs leading-5 text-[#9BB0A5]">{hook.script}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="font-serif text-xl font-bold text-white">Your Attributed Orders</h2>
              <p className="mt-1 text-xs leading-5 text-[#9BB0A5]">Commissions stay pending until delivery. Cancelled or returned orders are reversed; payouts are processed via UPI/bank transfer.</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-xs">
                  <thead className="text-[10px] uppercase tracking-wider text-[#9BB0A5]"><tr><th className="py-2">Order</th><th>Order value</th><th>Your commission</th><th>Retained margin</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody className="divide-y divide-[#244A38]">
                    {(dashboard.commissions || []).map(row => <tr key={row.id}>
                      <td className="py-3 font-semibold text-white">#{row.order_id}</td>
                      <td>{formatMoney(row.order_subtotal)}</td>
                      <td className="font-semibold text-[#FCE096]">{formatMoney(row.commission_amount)}</td>
                      <td>{Number(row.retained_margin_percent).toFixed(2)}%</td>
                      <td><span className="rounded-full bg-white/10 px-2 py-1 capitalize">{row.status}</span></td>
                      <td>{row.created_at ? new Date(row.created_at).toLocaleDateString() : '—'}</td>
                    </tr>)}
                    {(dashboard.commissions || []).length === 0 && <tr><td colSpan="6" className="py-8 text-center text-[#9BB0A5]">No orders have been attributed yet. Share your code above to start unlocking milestones!</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
