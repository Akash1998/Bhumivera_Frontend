import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Copy, ExternalLink, Gift, RefreshCw, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { affiliate as affiliateApi } from '../../services/api';

const INITIAL_FORM = {
  socialPlatform: 'Instagram',
  socialHandle: '',
  profileUrl: '',
  followerCount: '',
};

const formatMoney = value => `₹${(Number(value) || 0).toFixed(2)}`;

export default function PromoterPortal() {
  const [dashboard, setDashboard] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [copied, setCopied] = useState(false);
  const [editingApplication, setEditingApplication] = useState(false);

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

  const partner = dashboard?.partner;
  const shareUrl = useMemo(() => partner?.referral_code
    ? `${window.location.origin}/?aff=${encodeURIComponent(partner.referral_code)}`
    : '', [partner?.referral_code]);

  const apply = async event => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setNotice('');
    try {
      await affiliateApi.applyForPartner({
        ...form,
        followerCount: Number(form.followerCount),
      });
      setNotice('Your application is submitted. The Bhumivera team will review it before issuing a code.');
      await loadDashboard();
    } catch (applyError) {
      setError(applyError.response?.data?.message || 'Could not submit your application.');
    } finally {
      setSubmitting(false);
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

  const cardClass = 'rounded-2xl border border-[#D4AF37]/20 bg-[#102219]/90 p-5 shadow-xl';

  return (
    <main className="min-h-screen bg-[#070a0e] px-4 py-10 text-[#DFD7C4] sm:py-14">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FCE096]"><ShieldCheck size={14}/> Creator &amp; promoter account</p>
            <h1 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">Your Bhumivera partner desk</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#9BB0A5]">Apply to join, share your approved offer link, and track attributed orders and commission status transparently.</p>
          </div>
          <button type="button" onClick={loadDashboard} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-[#315541] px-3 py-2 text-xs font-semibold text-white hover:border-[#D4AF37] disabled:opacity-50"><RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>Refresh</button>
        </header>

        {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-950/30 p-3 text-sm text-rose-200"><AlertCircle size={17} className="mt-0.5 shrink-0"/>{error}</div>}
        {notice && <p role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-950/20 p-3 text-sm text-emerald-200">{notice}</p>}

        {loading ? <div className={cardClass}>Loading your promoter account…</div> : !partner || (partner.status === 'rejected' && editingApplication) ? (
          <form onSubmit={apply} className={`${cardClass} mx-auto max-w-2xl space-y-5`}>
            <div>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#0b1c14] text-[#D4AF37]"><Gift size={19}/></span>
              <h2 className="mt-3 font-serif text-2xl font-bold text-white">Apply to become a promoter</h2>
              <p className="mt-2 text-sm leading-6 text-[#9BB0A5]">Tell us which audience you reach. Applications are reviewed before a referral code or offer is activated.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-xs font-semibold">Platform
                <select value={form.socialPlatform} onChange={event => setForm(current => ({ ...current, socialPlatform: event.target.value }))} className="w-full rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-2.5 text-sm text-white">
                  {['Instagram', 'YouTube', 'Facebook', 'Other'].map(platform => <option key={platform}>{platform}</option>)}
                </select>
              </label>
              <label className="space-y-1.5 text-xs font-semibold">Profile name / handle
                <input required maxLength={120} value={form.socialHandle} onChange={event => setForm(current => ({ ...current, socialHandle: event.target.value }))} placeholder="@yourprofile" className="w-full rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-2.5 text-sm text-white"/>
              </label>
              <label className="space-y-1.5 text-xs font-semibold">Profile URL (optional)
                <input type="url" maxLength={500} value={form.profileUrl} onChange={event => setForm(current => ({ ...current, profileUrl: event.target.value }))} placeholder="https://…" className="w-full rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-2.5 text-sm text-white"/>
              </label>
              <label className="space-y-1.5 text-xs font-semibold">Approx. follower count
                <input required type="number" min="0" max="100000000" value={form.followerCount} onChange={event => setForm(current => ({ ...current, followerCount: event.target.value }))} placeholder="1000" className="w-full rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-2.5 text-sm text-white"/>
              </label>
            </div>
            <button type="submit" disabled={submitting} className="rounded-xl bg-[#D4AF37] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#102219] disabled:opacity-50">{submitting ? 'Submitting…' : 'Submit application'}</button>
            <p className="text-[11px] leading-5 text-[#9BB0A5]">Participation requires accurate product claims and applicable #ad / affiliate disclosures. Review our <Link to="/legal/warranty-affiliate-b2b" className="text-[#FCE096] underline">partner terms</Link>.</p>
          </form>
        ) : partner.status === 'pending' ? (
          <section className={`${cardClass} mx-auto max-w-2xl`}>
            <span className="rounded-full border border-amber-400/30 bg-amber-950/30 px-3 py-1 text-[10px] font-bold uppercase text-amber-100">Application under review</span>
            <h2 className="mt-4 font-serif text-2xl font-bold text-white">Thanks for applying, {partner.social_handle}.</h2>
            <p className="mt-2 text-sm leading-6 text-[#9BB0A5]">Your platform, audience size, and profile are with our team. A unique code and offer link will appear here after approval.</p>
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
    </main>
  );
}
