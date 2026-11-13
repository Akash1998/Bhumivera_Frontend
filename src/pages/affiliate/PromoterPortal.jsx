import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Copy, ExternalLink, Gift, IndianRupee, RefreshCw, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { affiliate as affiliateApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { parsePromoterProfileUrl } from '../../utils/promoterProfileUrl';

const INITIAL_FORM = {
  socialPlatform: '',
  socialHandle: '',
  profileUrl: '',
  followerCount: '',
};

const SOCIAL_PLATFORMS = [
  { name: 'Facebook', Icon: FaFacebookF, color: '#1877F2' },
  { name: 'Instagram', Icon: FaInstagram, color: '#E1306C' },
  { name: 'YouTube', Icon: FaYoutube, color: '#FF0000' },
];

const formatMoney = value => `₹${(Number(value) || 0).toFixed(2)}`;

export default function PromoterPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [copied, setCopied] = useState(false);
  const [editingApplication, setEditingApplication] = useState(false);
  const [confirmingProfile, setConfirmingProfile] = useState(false);
  const [ownsProfile, setOwnsProfile] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [redirectSeconds, setRedirectSeconds] = useState(5);

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
        });
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
  const parsedProfile = parsePromoterProfileUrl(form.profileUrl);
  const shareUrl = useMemo(() => partner?.referral_code
    ? `${window.location.origin}/?aff=${encodeURIComponent(partner.referral_code)}`
    : '', [partner?.referral_code]);

  const apply = async event => {
    event.preventDefault();
    if (!parsedProfile ||
        parsedProfile.platform !== form.socialPlatform ||
        parsedProfile.handle.toLowerCase() !== form.socialHandle.trim().toLowerCase()) {
      setError('Paste a supported Facebook, Instagram, or YouTube profile URL so we can match the platform and handle.');
      return;
    }
    setError('');
    setOwnsProfile(false);
    setConfirmingProfile(true);
  };

  const confirmApplication = async () => {
    if (!ownsProfile) return;
    setConfirmingProfile(false);
    setSubmitting(true);
    setError('');
    setNotice('');
    try {
      await affiliateApi.applyForPartner({
        ...form,
        followerCount: Number(form.followerCount),
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

  const handleProfileUrlChange = value => {
    const profile = parsePromoterProfileUrl(value);
    setForm(current => ({
      ...current,
      profileUrl: value,
      socialPlatform: profile?.platform || '',
      socialHandle: profile?.handle || '',
    }));
    setOwnsProfile(false);
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

  const cardClass = 'rounded-2xl border border-[#D4AF37]/25 bg-[#102A1E]/95 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.25)] sm:p-7';

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07180F] px-4 py-8 text-[#DFD7C4] sm:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_8%_0%,rgba(34,112,74,0.42),transparent_40%),radial-gradient(ellipse_at_90%_8%,rgba(212,175,55,0.16),transparent_32%)]"/>
        <div className="absolute -left-40 top-96 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"/>
        <div className="absolute -right-36 top-[55rem] h-96 w-96 rounded-full bg-amber-400/10 blur-3xl"/>
      </div>
      <div className="relative mx-auto max-w-7xl space-y-7">
        <header className="relative overflow-hidden rounded-[2rem] border border-[#D4AF37]/30 bg-gradient-to-br from-[#17422F] via-[#103322] to-[#0B2117] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:p-9">
          <div aria-hidden="true" className="absolute -right-8 -top-20 h-72 w-72 rounded-full border border-[#D4AF37]/10 bg-[#D4AF37]/[0.04]"/>
          <div aria-hidden="true" className="absolute right-8 top-12 h-40 w-40 rounded-full border border-white/5"/>
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-black/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FCE096]"><ShieldCheck size={14}/> Creator &amp; promoter account</p>
              <h1 className="mt-4 font-serif text-3xl font-bold text-white sm:text-5xl">Your Bhumivera partner desk</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#C5D8CC]">A clear, people-first home for your application, approved offer, attributed orders, and earnings.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {SOCIAL_PLATFORMS.map(({ name, Icon, color }) => (
                  <span key={name} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#07180F]/50 px-3 py-2 text-xs font-semibold text-white">
                    {React.createElement(Icon, { size: 15, style: { color } })} {name}
                  </span>
                ))}
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#07180F]/50 px-3 py-2 text-xs font-semibold text-[#FCE096]"><IndianRupee size={14}/> Transparent rupee earnings</span>
              </div>
            </div>
            <button type="button" onClick={loadDashboard} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/10 px-3 py-2.5 text-xs font-semibold text-white transition hover:border-[#D4AF37]/50 disabled:opacity-50"><RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>Refresh</button>
          </div>
        </header>

        {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-950/30 p-3 text-sm text-rose-200"><AlertCircle size={17} className="mt-0.5 shrink-0"/>{error}</div>}
        {notice && <p role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-950/20 p-3 text-sm text-emerald-200">{notice}</p>}

        {loading ? <div className={cardClass}>Loading your promoter account…</div> : !partner || (partner.status === 'rejected' && editingApplication) ? (
          <form onSubmit={apply} className={`${cardClass} mx-auto max-w-2xl space-y-5`}>
            <div>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#0b1c14] text-[#D4AF37]"><Gift size={19}/></span>
              <h2 className="mt-3 font-serif text-2xl font-bold text-white">Apply to become a promoter</h2>
              <p className="mt-2 text-sm leading-6 text-[#9BB0A5]">Tell us which audience you reach. We will verify your profile before activating your promoter account or offer.</p>
            </div>
            <label className="block space-y-1.5 text-xs font-semibold">Application email
              <input aria-label="Application email" value={user?.email || ''} readOnly className="w-full cursor-not-allowed rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-2.5 text-sm text-[#9BB0A5]"/>
              <span className="block text-[11px] font-normal text-[#82998D]">This verified Bhumivera account will own the application and receive its status updates.</span>
            </label>
            <label className="block space-y-1.5 text-xs font-semibold">Public profile URL
              <input required type="url" maxLength={500} value={form.profileUrl} onChange={event => handleProfileUrlChange(event.target.value)} placeholder="https://www.instagram.com/yourprofile" className="w-full rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-2.5 text-sm text-white outline-none focus:border-[#D4AF37]"/>
              <span className="block text-[11px] font-normal text-[#82998D]">Use your Facebook, Instagram, or YouTube profile/channel URL. We read the platform and handle from the URL; we do not scrape the site.</span>
            </label>
            <div className="grid gap-3 sm:grid-cols-3">
              {SOCIAL_PLATFORMS.map(({ name, Icon, color }) => {
                const detected = form.socialPlatform === name;
                return (
                  <div key={name} className={`flex items-center gap-3 rounded-xl border p-3 transition ${detected ? 'border-[#D4AF37]/70 bg-[#D4AF37]/10' : 'border-[#315541] bg-[#0b1c14]/70'}`}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/20">{React.createElement(Icon, { size: 20, style: { color } })}</span>
                    <span><strong className="block text-xs text-white">{name}</strong><span className="text-[10px] text-[#9BB0A5]">{detected ? 'Detected from URL' : 'Paste profile URL'}</span></span>
                    {detected && <CheckCircle2 size={16} className="ml-auto text-[#D4AF37]"/>}
                  </div>
                );
              })}
            </div>
            {form.profileUrl && !parsedProfile && <p role="alert" className="rounded-lg border border-amber-400/30 bg-amber-950/20 px-3 py-2 text-xs leading-5 text-amber-100">We could not identify a supported profile from this URL. Check that it is the public HTTPS profile or channel URL, not a post or video link.</p>}
            {parsedProfile && <p role="status" className="rounded-lg border border-emerald-400/25 bg-emerald-950/20 px-3 py-2 text-xs text-emerald-100">Detected {parsedProfile.platform} account <strong>{parsedProfile.handle}</strong>. Please confirm ownership before submitting.</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-xs font-semibold">Detected profile name / handle
                <input required readOnly value={form.socialHandle} placeholder="Filled from your profile URL" className="w-full cursor-not-allowed rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-2.5 text-sm text-[#C8D5CC]"/>
              </label>
              <label className="space-y-1.5 text-xs font-semibold">Approx. followers (self-reported)
                <input required type="number" min="0" max="100000000" value={form.followerCount} onChange={event => setForm(current => ({ ...current, followerCount: event.target.value }))} placeholder="Enter your current count" className="w-full rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-2.5 text-sm text-white"/>
              </label>
            </div>
            <p className="rounded-lg border border-[#D4AF37]/20 bg-[#0b1c14]/70 px-3 py-2 text-[11px] leading-5 text-[#C8D5CC]">Follower counts are not fetched or independently verified yet. Never share a social-media password. Bhumivera will review the profile before activation.</p>
            <button type="submit" disabled={submitting || !parsedProfile || parsedProfile.platform !== form.socialPlatform} className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#102219] transition hover:bg-[#FCE096] disabled:opacity-50">{submitting ? 'Submitting…' : 'Review and confirm profile'} <ExternalLink size={14}/></button>
            <p className="text-[11px] leading-5 text-[#9BB0A5]">Participation requires accurate product claims and applicable #ad / affiliate disclosures. Review our <Link to="/legal/warranty-affiliate-b2b" className="text-[#FCE096] underline">partner terms</Link>.</p>
          </form>
        ) : partner.status === 'pending' ? (
          <section className={`${cardClass} mx-auto max-w-2xl`}>
            <span className="rounded-full border border-amber-400/30 bg-amber-950/30 px-3 py-1 text-[10px] font-bold uppercase text-amber-100">Application under review</span>
            <h2 className="mt-4 font-serif text-2xl font-bold text-white">Thank you for your interest in collaborating with Bhumivera.</h2>
            <p className="mt-2 text-sm leading-6 text-[#9BB0A5]">You are in the queue while our team verifies your account and profile. We expect to update your activation status within 12–24 hours. Please check this page or the email on your Bhumivera account for our response.</p>
            <p className="mt-3 text-sm leading-6 text-[#9BB0A5]">Your promoter account is not active yet. The code below is reserved for you and cannot be used until Bhumivera approves the application.</p>
            {partner.referral_code && <div className="mt-4 rounded-xl border border-[#315541] bg-[#0b1c14] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#9BB0A5]">Reserved promoter code · inactive</p>
              <p className="mt-1 font-mono text-lg font-bold tracking-widest text-[#FCE096]">{partner.referral_code}</p>
            </div>}
          </section>
        ) : partner.status === 'rejected' ? (
          <section className={`${cardClass} mx-auto max-w-2xl`}>
            <h2 className="font-serif text-2xl font-bold text-white">Application not approved</h2>
            <p className="mt-2 text-sm leading-6 text-[#9BB0A5]">{partner.admin_notes || 'Please contact our team if you would like clarification.'}</p>
            <button type="button" onClick={() => setEditingApplication(true)} className="mt-4 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-xs font-bold text-[#102219]">Update and resubmit</button>
          </section>
        ) : (
          <>
            <section className={`${cardClass} grid gap-5 lg:grid-cols-[1.2fr_0.8fr]`}>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${partner.status === 'approved' ? 'bg-emerald-900/50 text-emerald-200' : 'bg-amber-900/40 text-amber-100'}`}>{partner.status}</span>
                  <span className="text-xs text-[#9BB0A5]">{partner.social_platform} · {Number(partner.follower_count).toLocaleString()} followers</span>
                </div>
                <h2 className="mt-3 font-serif text-2xl font-bold text-white">Share your offer</h2>
                <p className="mt-1 text-sm leading-6 text-[#9BB0A5]">Your audience gets <strong className="text-[#FCE096]">{Number(partner.discount_percent)}% off</strong>. Your profit share is <strong className="text-[#FCE096]">{Number(partner.commission_share_percent)}%</strong> of eligible contribution profit, subject to the retained-margin floor.</p>
                <p className="mt-1 text-xs text-[#9BB0A5]">Retained-margin floor: {Number(dashboard.programConfig?.minimum_retained_margin_percent ?? 12)}% · target: {Number(dashboard.programConfig?.target_retained_margin_percent ?? 20)}%.</p>
                {partner.status === 'paused' && <p className="mt-3 rounded-lg border border-amber-400/30 bg-amber-950/20 px-3 py-2 text-xs text-amber-100">Your link is paused and cannot receive new attributed orders.</p>}
                <div className="mt-4 rounded-xl border border-[#315541] bg-[#0b1c14] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9BB0A5]">Promoter code</p>
                  <p className="mt-1 font-mono text-lg font-bold tracking-widest text-[#FCE096]">{partner.referral_code}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-3 py-2 text-xs font-bold text-[#102219]"><Copy size={14}/>{copied ? 'Copied' : 'Copy offer link'}</button>
                    <a href={shareUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#315541] px-3 py-2 text-xs text-white">Preview link <ExternalLink size={13}/></a>
                  </div>
                  <p className="mt-2 break-all text-[11px] text-[#9BB0A5]">{shareUrl}</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {[
                  ['Attributed orders', dashboard.summary?.attributed_orders],
                  ['Pending delivery', formatMoney(dashboard.summary?.pending_commission)],
                  ['Ready for payout', formatMoney(dashboard.summary?.payable_commission)],
                  ['Paid to date', formatMoney(dashboard.summary?.paid_commission)],
                ].map(([label, value]) => <div key={label} className="rounded-xl border border-[#315541] bg-[#0b1c14] p-4"><div className="flex items-center justify-between text-xs text-[#9BB0A5]"><span>{label}</span></div><p className="mt-2 font-serif text-xl font-bold text-white">{value ?? 0}</p></div>)}
                {Number(dashboard.summary?.balance_carryover) > 0 && <p className="rounded-lg border border-amber-400/30 bg-amber-950/20 px-3 py-2 text-xs leading-5 text-amber-100">A previous returned order balance of {formatMoney(dashboard.summary.balance_carryover)} will be offset against future commissions.</p>}
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="font-serif text-xl font-bold text-white">Your attributed orders</h2>
              <p className="mt-1 text-xs leading-5 text-[#9BB0A5]">Commissions stay pending until delivery. Cancelled or returned orders are reversed; payouts are processed manually by Bhumivera.</p>
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
                    {(dashboard.commissions || []).length === 0 && <tr><td colSpan="6" className="py-8 text-center text-[#9BB0A5]">No orders have been attributed yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        <p className="text-center text-[11px] leading-5 text-[#82998D]">Commission is based on actual inventory unit costs and the order’s final discounts. It is not a guaranteed amount. See the <Link to="/legal/warranty-affiliate-b2b" className="text-[#FCE096] underline">partner terms</Link> for program conditions.</p>
      </div>
      {confirmingProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020905]/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="profile-confirmation-title">
          <section className="w-full max-w-lg space-y-4 rounded-3xl border border-[#D4AF37]/35 bg-gradient-to-br from-[#163A29] to-[#0B1C14] p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#07180F] text-[#D4AF37]"><ShieldCheck size={20}/></span>
              <button type="button" onClick={() => setConfirmingProfile(false)} aria-label="Close profile confirmation" className="rounded-lg p-2 text-[#9BB0A5] hover:bg-white/10 hover:text-white"><X size={18}/></button>
            </div>
            <div>
              <h2 id="profile-confirmation-title" className="font-serif text-2xl font-bold text-white">Is this your account?</h2>
              <p className="mt-2 text-sm leading-6 text-[#C5D8CC]">We detected this platform and profile name from the URL you entered. Check both carefully before continuing.</p>
            </div>
            <div className="space-y-2 rounded-xl border border-white/10 bg-[#07180F]/70 p-4 text-sm">
              <p><span className="text-[#9BB0A5]">Platform: </span><strong className="text-white">{form.socialPlatform}</strong></p>
              <p><span className="text-[#9BB0A5]">Profile: </span><strong className="break-all text-[#FCE096]">{form.socialHandle}</strong></p>
              <p className="break-all text-xs text-[#9BB0A5]">{form.profileUrl}</p>
            </div>
            <p className="rounded-xl border border-amber-300/20 bg-amber-950/25 p-3 text-xs leading-5 text-amber-100">The profile URL is matched locally; follower count is self-reported and no social account is API-verified yet. We will not ask for your social password.</p>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#315541] bg-[#07180F]/50 p-3 text-xs leading-5 text-[#DFD7C4]">
              <input type="checkbox" checked={ownsProfile} onChange={event => setOwnsProfile(event.target.checked)} className="mt-1 accent-[#D4AF37]"/>
              <span>I confirm that I own or manage this social account and that this profile URL is correct.</span>
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => setConfirmingProfile(false)} className="rounded-xl border border-white/15 px-4 py-3 text-xs font-bold text-white hover:border-[#D4AF37]/50">Go back and edit</button>
              <button type="button" disabled={!ownsProfile || submitting} onClick={confirmApplication} className="rounded-xl bg-[#D4AF37] px-4 py-3 text-xs font-bold text-[#102219] hover:bg-[#FCE096] disabled:opacity-50">{submitting ? 'Submitting…' : 'Yes, submit my application'}</button>
            </div>
          </section>
        </div>
      )}
      {celebrating && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-hidden bg-[#03110A]/90 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="application-success-title" aria-live="polite">
          <style>{`
            @keyframes promoter-confetti-fall {
              0% { transform: translate3d(0, -8vh, 0) rotate(0deg); opacity: 0; }
              10% { opacity: 1; }
              100% { transform: translate3d(var(--confetti-drift), 110vh, 0) rotate(780deg); opacity: 0; }
            }
            .promoter-confetti { animation-name: promoter-confetti-fall; animation-timing-function: cubic-bezier(.2,.7,.35,1); animation-fill-mode: both; }
            @media (prefers-reduced-motion: reduce) { .promoter-confetti { display: none; } }
          `}</style>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 42 }, (_, index) => (
              <span
                key={index}
                className="promoter-confetti absolute top-[-1rem] h-3 w-2 rounded-sm"
                style={{
                  left: `${(index * 37) % 100}%`,
                  backgroundColor: ['#D4AF37', '#FCE096', '#34D399', '#FB7185', '#60A5FA', '#FFFFFF'][index % 6],
                  animationDuration: `${2.8 + (index % 6) * 0.3}s`,
                  animationDelay: `${(index % 12) * 0.08}s`,
                  '--confetti-drift': `${((index % 5) - 2) * 8}vw`,
                }}
              />
            ))}
          </div>
          <section className="relative w-full max-w-xl rounded-[2rem] border border-[#D4AF37]/40 bg-gradient-to-br from-[#194832] via-[#103322] to-[#0B1C14] p-6 text-center shadow-[0_30px_100px_rgba(0,0,0,0.5)] sm:p-9">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/15 text-[#FCE096]"><IndianRupee size={30}/></div>
            <Sparkles aria-hidden="true" className="mx-auto mt-4 text-[#D4AF37]" size={20}/>
            <h2 id="application-success-title" className="mt-3 font-serif text-3xl font-bold text-white">Application received!</h2>
            <p className="mt-3 text-sm leading-6 text-[#D3E1D8]">Thank you for your interest in collaborating with Bhumivera. You’re in our verification queue; we aim to update your status within 12–24 hours.</p>
            {dashboard?.partner?.referral_code && <p className="mt-4 rounded-xl border border-white/10 bg-[#07180F]/55 px-4 py-3 text-xs text-[#C5D8CC]">Your reserved code <strong className="font-mono tracking-widest text-[#FCE096]">{dashboard.partner.referral_code}</strong> is inactive until approval.</p>}
            <p className="mt-4 text-xs text-[#9BB0A5]">Explore the people and projects behind Bhumivera while you wait.</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => navigate('/impact', { replace: true })} className="rounded-xl bg-[#D4AF37] px-4 py-3 text-xs font-bold text-[#102219] transition hover:bg-[#FCE096]">Explore Bhumivera’s impact</button>
              <span className="flex items-center justify-center rounded-xl border border-white/15 px-4 py-3 text-xs text-[#C5D8CC]">Redirecting in {redirectSeconds}s…</span>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
