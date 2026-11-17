import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle, CheckCircle2, Copy, ExternalLink, Film, Gift,
  IndianRupee, RefreshCw, ShieldCheck, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { affiliate as affiliateApi } from '../../services/api';

const INITIAL_FORM = {
  socialPlatform: '',
  socialHandle: '',
  profileUrl: '',
  followerCount: '',
  followerTier: '',
  contentNiche: '',
  collaborationType: 'both',
  partnershipIntent: '',
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

const DEFAULT_MILESTONES = [
  { ordersRequired: 3, rewardInr: 500, label: '₹500 Bhumivera Luxury Store Gift Card', shareBoost: null },
  { ordersRequired: 10, rewardInr: 1200, label: '₹1,200 Creator Bonus + Full-Range 6-SKU PR Box', shareBoost: null },
  { ordersRequired: 25, rewardInr: 2500, label: '₹2,500 VIP Gift Card + 25% Profit-Share Upgrade', shareBoost: 25 },
];

const formatMoney = value => `₹${(Number(value) || 0).toFixed(2)}`;
const SAVED_APPLICATION_KEY = 'bhumivera_creator_application_saved';

export default function PromoterPortal() {
  const [dashboard, setDashboard] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(() => localStorage.getItem(SAVED_APPLICATION_KEY) === 'true');
  const [commissionPage, setCommissionPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [savingPerks, setSavingPerks] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [copied, setCopied] = useState(false);
  const [editingApplication, setEditingApplication] = useState(false);
  const [ownsProfile, setOwnsProfile] = useState(false);

  const [customCodeInput, setCustomCodeInput] = useState('');

  const loadDashboard = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await affiliateApi.getPartnerDashboard({ commissionPage: page });
      const data = response.data?.dashboard || null;
      setDashboard(data);
      setCommissionPage(Number(data?.commissionPagination?.page) || page);
      if (data?.partner) {
        setForm({
          socialPlatform: data.partner.social_platform || 'Instagram',
          socialHandle: data.partner.social_handle || '',
          profileUrl: data.partner.profile_url || '',
          followerCount: String(data.partner.follower_count ?? ''),
          followerTier: data.partner.follower_tier || '',
          contentNiche: data.partner.content_niche || '',
          collaborationType: 'both',
          partnershipIntent: data.partner.partnership_intent || '',
        });
        setCustomCodeInput(data.partner.referral_code || '');
      }
      return data;
    } catch (loadError) {
      setError(loadError.response?.data?.message || 'Could not load the promoter portal.');
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem(SAVED_APPLICATION_KEY) === 'true') {
      loadDashboard();
    } else {
      setLoading(false);
    }
  }, [loadDashboard]);
  const partner = dashboard?.partner;
  const shareUrl = useMemo(() => partner?.referral_code
    ? `${window.location.origin}/?aff=${encodeURIComponent(partner.referral_code)}`
    : '', [partner?.referral_code]);

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
      localStorage.setItem(SAVED_APPLICATION_KEY, 'true');
      setNotice('Application received. Your reserved promoter code remains inactive while the team reviews your profile.');
      await loadDashboard();
    } catch (applyError) {
      setError(applyError.response?.data?.message || 'Could not submit your application.');
    } finally {
      setSubmitting(false);
    }
  };

  const checkSavedApplication = async () => {
    setNotice('');
    const data = await loadDashboard();
    if (data?.partner) {
      localStorage.setItem(SAVED_APPLICATION_KEY, 'true');
    } else if (data === null) {
      localStorage.removeItem(SAVED_APPLICATION_KEY);
      setNotice('No saved creator application was found. You can apply using the form.');
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
      });
      if (response.data?.dashboard) {
        setDashboard(response.data.dashboard);
        setCommissionPage(Number(response.data.dashboard.commissionPagination?.page) || 1);
      } else {
        await loadDashboard();
      }
      setNotice('Your creator code has been updated.');
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
  const fundedImpactContributions = Number(dashboard?.summary?.funded_impact_contributions || 0);
  const milestones = dashboard?.milestones || DEFAULT_MILESTONES.map(m => ({
    ...m,
    unlocked: deliveredOrdersCount >= m.ordersRequired,
    progressPct: Math.min(100, Math.round((deliveredOrdersCount / m.ordersRequired) * 100)),
    remainingOrders: Math.max(0, m.ordersRequired - deliveredOrdersCount),
  }));
  const commissionPagination = dashboard?.commissionPagination || {
    page: 1,
    pageSize: 20,
    total: (dashboard?.commissions || []).length,
    pages: 1,
  };
  const firstCommissionNumber = commissionPagination.total
    ? (commissionPagination.page - 1) * commissionPagination.pageSize + 1
    : 0;
  const lastCommissionNumber = Math.min(
    commissionPagination.page * commissionPagination.pageSize,
    commissionPagination.total
  );

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
              <h1 className="mt-4 font-serif text-3xl font-bold text-white sm:text-5xl">Build trust. Share value. Grow together.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#C5D8CC]">
                This is a relationship, not a one-post transaction. We want creators who care about honest product education, a thriving community and a more thoughtful relationship with nature—and who want to grow with us over time.
              </p>
            </div>
            <button type="button" onClick={() => loadDashboard(commissionPage)} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/10 px-3 py-2.5 text-xs font-semibold text-white transition hover:border-[#D4AF37]/50 disabled:opacity-50">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>Refresh
            </button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#D4AF37]/35 bg-gradient-to-br from-[#133524] to-[#0b1f15] p-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FCE096]">
              <Zap size={12}/> Current track · shared growth
            </span>
            <h3 className="mt-3 font-serif text-xl font-bold text-white">A continuing creator partnership</h3>
            <p className="mt-1.5 text-xs leading-5 text-[#B7C9BD]">
              We agree the product, scope and terms before a campaign. Product gifting is selective—not the reason to join or a guaranteed perk. Your approved customer offer and contribution-share rate are visible below; actual order earnings are itemized in your ledger.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#10251D] to-[#091A14] p-5 opacity-90">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
              <Gift size={12}/> Separate track · not currently open
            </span>
            <h3 className="mt-3 font-serif text-xl font-bold text-white">Paid UGC &amp; trial reimbursement</h3>
            <p className="mt-1.5 text-xs leading-5 text-[#B7C9BD]">
              These paid campaign services are not accepting applications yet. We will publish a written scope, fee and usage rights before opening this track—no implied or retroactive fee.
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
                <p className="mt-2 text-sm leading-6 text-[#B4C7BB]">Tell us what you want to build with us. We look for thoughtful product educators and community partners—not applications motivated only by receiving free products.</p>
                <button
                  type="button"
                  onClick={checkSavedApplication}
                  disabled={loading}
                  className="mt-3 text-xs font-semibold text-[#F0D98A] underline underline-offset-2 disabled:opacity-50"
                >
                  Already applied? Check your saved application
                </button>
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
                  <option value="both">Current track: ongoing partnership + order-based profit sharing</option>
                  <option value="paid_collaboration" disabled>Paid collaboration — Coming soon</option>
                </select>
              </label>
            </div>

            <label htmlFor="promoter-profile-url" className="block space-y-2 text-sm font-semibold text-[#E7EEE8]">
              Public profile link
              <input id="promoter-profile-url" required type="url" maxLength={500} value={form.profileUrl} onChange={event => setForm(current => ({ ...current, profileUrl: event.target.value }))} placeholder="https://instagram.com/yourprofile" className="w-full rounded-xl border border-white/10 bg-[#07180F]/65 px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]/60"/>
            </label>

            <label htmlFor="promoter-partnership-intent" className="block space-y-2 text-sm font-semibold text-[#E7EEE8]">
              What would a meaningful, long-term partnership look like to you?
              <textarea
                id="promoter-partnership-intent"
                required
                minLength={30}
                maxLength={800}
                rows={4}
                value={form.partnershipIntent}
                onChange={event => setForm(current => ({ ...current, partnershipIntent: event.target.value }))}
                placeholder="Tell us what you would like to teach or build with your community, why our nature-minded approach resonates with you, and how you see the relationship growing beyond one post."
                className="w-full rounded-xl border border-white/10 bg-[#07180F]/65 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-[#82998D] focus:border-[#D4AF37]/60"
              />
              <span className="block text-xs font-normal leading-5 text-[#9BB0A5]">30–800 characters. We review alignment, honesty and intent—not follower count alone. Product gifting is selective and never guaranteed.</span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-[#C5D8CC]">
              <input type="checkbox" checked={ownsProfile} onChange={event => setOwnsProfile(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#D4AF37]"/>
              <span>I confirm that I own or manage this profile, the details are accurate, and I understand this program is built around ongoing contribution—not guaranteed free products or a guaranteed income.</span>
            </label>

            <button type="submit" disabled={submitting} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 text-sm font-bold text-[#102219] transition hover:bg-[#FCE096] disabled:opacity-60">
              {submitting ? 'Sending application…' : 'Send creator application'} <ExternalLink size={15}/>
            </button>
          </form>
        ) : partner.status === 'rejected' ? (
          <section className={`${cardClass} mx-auto max-w-2xl`}>
            <span className="rounded-full border border-rose-400/30 bg-rose-950/30 px-3 py-1 text-[10px] font-bold uppercase text-rose-100">Application not approved</span>
            <h2 className="mt-4 font-serif text-2xl font-bold text-white">You can tell us more about your approach</h2>
            <p className="mt-2 text-sm leading-6 text-[#9BB0A5]">Our review is about partnership fit, not your follower count. If your plans or information have changed, update your application and share what you would like to build with your community.</p>
            <button type="button" onClick={() => { setEditingApplication(true); setNotice(''); setError(''); }} className="mt-5 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-xs font-bold text-[#102219] hover:bg-[#FCE096]">
              Update and resubmit
            </button>
          </section>
        ) : partner.status === 'pending' ? (
          <section className={`${cardClass} mx-auto max-w-2xl`}>
            <span className="rounded-full border border-amber-400/30 bg-amber-950/30 px-3 py-1 text-[10px] font-bold uppercase text-amber-100">Application under review</span>
            <h2 className="mt-4 font-serif text-2xl font-bold text-white">Your Creator Code Is Reserved</h2>
            <p className="mt-2 text-sm leading-6 text-[#9BB0A5]">Our team reviews applications within 12–24 hours. We consider your content, audience fit and partnership intent. Your reserved code remains inactive while your profile is under review.</p>
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
                  Your audience gets the approved <strong className="text-[#FCE096]">{Number(partner.discount_percent)}% offer</strong>. Your rate is <strong className="text-[#FCE096]">{Number(partner.commission_share_percent)}%</strong> of qualifying contribution profit—not the order total. Any checkout gifts or promotions are separate and may change.
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

            <section className={`${cardClass} grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center`}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Community impact</p>
                <h2 className="mt-1 font-serif text-xl font-bold text-white">Impact contributions from your referred orders</h2>
                <p className="mt-2 max-w-2xl text-xs leading-5 text-[#9BB0A5]">
                We invite creators to make nature part of an honest conversation with their community. This total includes customer-selected contributions linked to your orders only after they are recorded as collected; it is not a fixed percentage of every order or an unverified brand pledge.
                </p>
                <p className="mt-2 text-xs text-[#9BB0A5]">
                  {fundedImpactContributions} collected contribution{fundedImpactContributions === 1 ? '' : 's'}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs text-[#9BB0A5]">Verified amount collected</p>
                <p className="mt-1 font-serif text-2xl font-bold text-[#FCE096]">{formatMoney(dashboard.summary?.impact_amount)}</p>
                <Link to="/impact" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#FCE096] hover:underline">
                  Explore impact projects <ExternalLink size={12}/>
                </Link>
              </div>
            </section>

            <section className={cardClass}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Creator Milestones</p>
                  <h2 className="mt-1 font-serif text-xl font-bold text-white">Recognition follows sustained, delivered contribution</h2>
                </div>
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
                  <IndianRupee size={18}/>
                  <h2 className="font-serif text-xl font-bold text-white">Your order economics, without guesswork</h2>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#B7C9BD]">
                  We do not forecast a fixed rupee amount per order. Your confirmed rate is applied to each order’s actual contribution after tax, discounts and recorded costs. Expand any ledger row below to see that order’s calculation.
                </p>
                <p className="mt-4 rounded-xl border border-[#315541] bg-[#0b1c14] p-4 text-xs leading-6 text-[#E7EEE8]">
                  Contribution = discounted merchandise revenue excluding GST − product cost − fulfillment − return reserve − applicable payment fee.<br/>
                  Your commission = the lower of your approved share of positive contribution or the amount that preserves Bhumivera’s minimum retained margin.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  {[
                    ['Fulfillment reserve', dashboard?.programConfig?.fulfillment_cost == null ? '—' : formatMoney(dashboard.programConfig.fulfillment_cost)],
                    ['Return-to-origin reserve', dashboard?.programConfig?.rto_reserve == null ? '—' : formatMoney(dashboard.programConfig.rto_reserve)],
                    ['Online payment fee', dashboard?.programConfig?.online_payment_fee_percent == null ? '—' : `${Number(dashboard.programConfig.online_payment_fee_percent)}%`],
                    ['Minimum retained margin', dashboard?.programConfig?.minimum_retained_margin_percent == null ? '—' : `${Number(dashboard.programConfig.minimum_retained_margin_percent)}%`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-[#315541] bg-[#0b1c14] p-3">
                      <span className="text-[#9BB0A5]">{label}</span>
                      <strong className="mt-1 block text-white">{value}</strong>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[11px] leading-5 text-[#9BB0A5]">
                  These are current program settings; the order ledger is the source of truth for each order. Product cost is shown as an order-level total. Supplier identities and invoices remain private. Brand-retained contribution is before company overhead and is not net profit.
                </p>
              </section>

              <form onSubmit={savePartnerPerks} className={`${cardClass} space-y-4`}>
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Film size={18}/>
                  <h2 className="font-serif text-xl font-bold text-white">Custom Vanity Code</h2>
                </div>
                <p className="text-xs text-[#9BB0A5]">Choose a simple code your community can remember. Your code is a tool for an ongoing relationship—not a substitute for trust.</p>
                <label className="block space-y-1 text-xs font-semibold text-white">
                  Custom Vanity Promo Code
                  <input value={customCodeInput} onChange={e => setCustomCodeInput(e.target.value.toUpperCase())} maxLength={20} placeholder="AYEESHA10" className="w-full rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-2 font-mono text-sm text-[#FCE096]"/>
                </label>
                <div className="flex items-center justify-between pt-1">
                  <button type="submit" disabled={savingPerks} className="rounded-lg bg-[#D4AF37] px-4 py-2 text-xs font-bold text-[#102219] hover:bg-[#FCE096] disabled:opacity-50">
                    {savingPerks ? 'Saving…' : 'Save Code'}
                  </button>
                </div>
              </form>

              <section className={`${cardClass} space-y-3`}>
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Film size={18}/>
                  <h2 className="font-serif text-xl font-bold text-white">Paid UGC &amp; trial reimbursement</h2>
                </div>
                <span className="inline-flex rounded-full border border-amber-300/30 bg-amber-900/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-100">Coming soon · not accepting submissions</span>
                <p className="text-xs leading-5 text-[#9BB0A5]">The current active track is ongoing community partnership with order-based profit sharing. This separate paid-content track is not available yet; no fee or usage rights are implied until agreed in writing.</p>
                {(partner.reel_submission_url || partner.trial_cashback_status && partner.trial_cashback_status !== 'none') && (
                  <p className="text-[11px] text-[#9BB0A5]">Existing submission status: <strong className="uppercase text-[#FCE096]">{partner.trial_cashback_status || 'submitted'}</strong></p>
                )}
                {partner.reel_submission_url && <p className="break-all text-[11px] text-[#9BB0A5]">Previously submitted Reel: {partner.reel_submission_url}</p>}
                {partner.trial_order_id && <p className="text-[11px] text-[#9BB0A5]">Previously submitted trial order: #{partner.trial_order_id}</p>}
              </section>
            </div>

            <section className={cardClass}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">A shared standard</p>
              <h2 className="mt-1 font-serif text-xl font-bold text-white">Build trust first; let growth follow</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {[
                  ['Use your own voice', 'Share a real experience after using the product. A brief guides accuracy; it never requires a scripted endorsement.'],
                  ['Be clear with your audience', 'Disclose gifted products and affiliate links as required. No medical claims, invented results or guaranteed outcomes.'],
                  ['Keep the relationship open', 'Share what your community learns, what could improve and how you want the partnership to evolve.'],
                ].map(([title, description]) => (
                  <div key={title} className="rounded-xl border border-[#315541] bg-[#0b1c14] p-4">
                    <h3 className="font-serif text-sm font-bold text-white">{title}</h3>
                    <p className="mt-2 text-xs leading-5 text-[#9BB0A5]">{description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="font-serif text-xl font-bold text-white">Open order ledger</h2>
              <p className="mt-1 text-xs leading-5 text-[#9BB0A5]">Each row shows the stored order economics behind your commission. Pending amounts are not yet payable; cancelled or returned orders are reversed. Payments are made by UPI/bank transfer and recorded here.</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#9BB0A5]">
                <span>Showing {firstCommissionNumber}–{lastCommissionNumber} of {commissionPagination.total} attributed orders</span>
                <div className="flex items-center gap-2">
                  <button type="button" disabled={loading || commissionPagination.page <= 1} onClick={() => loadDashboard(commissionPagination.page - 1)} className="rounded-lg border border-[#315541] px-3 py-1.5 font-semibold text-white disabled:opacity-40">Previous</button>
                  <span>Page {commissionPagination.page} of {commissionPagination.pages}</span>
                  <button type="button" disabled={loading || commissionPagination.page >= commissionPagination.pages} onClick={() => loadDashboard(commissionPagination.page + 1)} className="rounded-lg border border-[#315541] px-3 py-1.5 font-semibold text-white disabled:opacity-40">Next</button>
                </div>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-xs">
                  <thead className="text-[10px] uppercase tracking-wider text-[#9BB0A5]"><tr><th className="py-2">Order</th><th>Merchandise value</th><th>Your commission</th><th>Brand retained contribution*</th><th>Status</th><th>Order split</th></tr></thead>
                  <tbody className="divide-y divide-[#244A38]">
                    {(dashboard.commissions || []).map(row => {
                      const contribution = Number(row.contribution_profit) || 0;
                      const shareRate = Number(row.commission_share_percent) || 0;
                      const commissionBeforeCap = Math.max(0, contribution * shareRate / 100);
                      const marginCapAdjustment = Math.max(0, commissionBeforeCap - (Number(row.commission_amount) || 0));
                      return (
                        <React.Fragment key={row.id}>
                          <tr>
                            <td className="py-3 font-semibold text-white">#{row.order_id}</td>
                            <td>{formatMoney(row.order_subtotal)}</td>
                            <td className="font-semibold text-[#FCE096]">{formatMoney(row.commission_amount)}</td>
                            <td>{formatMoney(row.retained_profit)} <span className="block text-[10px] text-[#9BB0A5]">{Number(row.retained_margin_percent || 0).toFixed(2)}% margin</span></td>
                            <td><span className="rounded-full bg-white/10 px-2 py-1 capitalize">{row.status}</span></td>
                            <td><details className="group">
                              <summary className="cursor-pointer font-semibold text-[#FCE096] underline underline-offset-2">View breakdown</summary>
                              <div className="mt-2 w-[min(78vw,34rem)] rounded-xl border border-[#315541] bg-[#07180F] p-4 shadow-2xl">
                                <h3 className="mb-3 font-serif text-base font-bold text-white">Order #{row.order_id} · calculation record</h3>
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                  {[
                                    ['Merchandise before discounts', formatMoney(row.order_subtotal)],
                                    ['Discounts applied', `−${formatMoney(row.discount_amount)}`],
                                    ['Revenue excluding GST', formatMoney(row.revenue_ex_tax)],
                                    ['Product cost (order total)', `−${formatMoney(row.product_cost)}`],
                                    ['Fulfillment', `−${formatMoney(row.fulfillment_cost)}`],
                                    ['Return-to-origin reserve', `−${formatMoney(row.rto_reserve)}`],
                                    ['Online payment fee', `−${formatMoney(row.payment_fee)}`],
                                    ['Contribution before creator share', formatMoney(row.contribution_profit)],
                                    [`Your configured share (${shareRate}%)`, formatMoney(commissionBeforeCap)],
                                    ['Margin safeguard adjustment', `−${formatMoney(marginCapAdjustment)}`],
                                    ['Your recorded commission', formatMoney(row.commission_amount)],
                                    ['Bhumivera retained contribution*', formatMoney(row.retained_profit)],
                                    ['Retained margin', `${Number(row.retained_margin_percent || 0).toFixed(2)}%`],
                                  ].map(([label, value]) => (
                                    <React.Fragment key={label}>
                                      <dt className="text-[#9BB0A5]">{label}</dt>
                                      <dd className="text-right font-semibold text-white">{value}</dd>
                                    </React.Fragment>
                                  ))}
                                </dl>
                                <p className="mt-3 border-t border-white/10 pt-3 text-[10px] leading-5 text-[#9BB0A5]">
                                  *Contribution after creator commission, before company overhead and other expenses; it is not net profit or a nature-funding promise. Product cost is aggregated to protect supplier details. This is the original calculation snapshot; check order status for reversals.
                                </p>
                              </div>
                            </details></td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                    {(dashboard.commissions || []).length === 0 && <tr><td colSpan="6" className="py-8 text-center text-[#9BB0A5]">No attributed orders yet. Build trust with your community; your actual order calculations will appear here as orders are placed.</td></tr>}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[10px] leading-5 text-[#82998D]">*Bhumivera retained contribution is not company net profit and does not imply a fixed amount is allocated to nature. Nature contributions are reported separately only when actually collected.</p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
