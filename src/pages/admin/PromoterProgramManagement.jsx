import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Check, Clipboard, Coins, RefreshCw, Save, ShieldCheck, UserPlus, Users, Wallet } from 'lucide-react';
import { affiliate as affiliateApi } from '../../services/api';
import PromoterAnalyticsDashboard from './PromoterAnalyticsDashboard';

const INITIAL_CONFIG = {
  default_customer_discount_percent: 15,
  default_commission_share_percent: 25,
  fulfillment_cost: 220,
  rto_reserve: 100,
  online_payment_fee_percent: 2,
  minimum_retained_margin_percent: 12,
  target_retained_margin_percent: 20,
  minimum_order_amount: 599,
};

const MONEY_SETTINGS = [
  ['minimum_order_amount', 'Sitewide minimum order', '₹'],
  ['fulfillment_cost', 'Fulfillment, packaging & delivery reserve', '₹'],
  ['rto_reserve', 'RTO reserve per promoter order', '₹'],
  ['online_payment_fee_percent', 'Online payment fee', '%'],
  ['minimum_retained_margin_percent', 'Hard retained-margin floor', '%'],
  ['target_retained_margin_percent', 'Target retained margin', '%'],
  ['default_customer_discount_percent', 'New promoter customer discount', '%'],
  ['default_commission_share_percent', 'New promoter profit share', '%'],
];

const money = value => `₹${(Number(value) || 0).toFixed(2)}`;
const AUDIENCE_TIERS = {
  under_1k: 'Under 1,000',
  '1k_10k': '1,000–10,000',
  '10k_50k': '10,001–50,000',
  '50k_plus': '50,001+',
};
const COLLABORATION_TYPES = {
  product_gifting: 'Product gifting / barter',
  affiliate_commission: 'Affiliate commission',
  both: 'Product gifting + affiliate commission',
};

export default function PromoterProgramManagement() {
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const [partners, setPartners] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [payoutReferences, setPayoutReferences] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPartner, setNewPartner] = useState({
    email: '',
    socialPlatform: 'Instagram',
    socialHandle: '',
    profileUrl: '',
    followerCount: '0',
    discountPercent: '15',
    commissionSharePercent: '25',
  });
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [creatingPartner, setCreatingPartner] = useState(false);
  const [busyPartner, setBusyPartner] = useState(null);
  const [busyCommission, setBusyCommission] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [configResponse, partnersResponse, commissionResponse] = await Promise.all([
        affiliateApi.getAdminProgramConfig(),
        affiliateApi.getAdminPartners(),
        affiliateApi.getAdminCommissions(),
      ]);
      setConfig({ ...INITIAL_CONFIG, ...(configResponse.data?.config || {}) });
      setPartners(partnersResponse.data?.partners || []);
      setCommissions(commissionResponse.data?.commissions || []);
      setPayouts(commissionResponse.data?.payouts || []);
    } catch (loadError) {
      setError(loadError.response?.data?.message || 'Could not load the promoter program. Please retry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const saveConfig = async event => {
    event.preventDefault();
    setSavingConfig(true);
    setError('');
    setNotice('');
    try {
      const payload = Object.fromEntries(Object.entries(config).map(([key, value]) => [key, Number(value)]));
      const response = await affiliateApi.updateAdminProgramConfig(payload);
      setConfig({ ...INITIAL_CONFIG, ...(response.data?.config || payload) });
      setNotice('Promoter program settings saved.');
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Could not save promoter program settings.');
    } finally {
      setSavingConfig(false);
    }
  };

  const addPartner = async event => {
    event.preventDefault();
    setCreatingPartner(true);
    setError('');
    setNotice('');
    try {
      const { data } = await affiliateApi.addAdminPartner({
        ...newPartner,
        email: newPartner.email.trim(),
        socialHandle: newPartner.socialHandle.trim(),
        profileUrl: newPartner.profileUrl.trim(),
        followerCount: Number(newPartner.followerCount),
        discountPercent: Number(newPartner.discountPercent),
        commissionSharePercent: Number(newPartner.commissionSharePercent),
      });
      setNotice(`Promoter added and approved. Share code ${data.partner.referral_code}.`);
      setNewPartner({
        email: '',
        socialPlatform: 'Instagram',
        socialHandle: '',
        profileUrl: '',
        followerCount: '0',
        discountPercent: String(config.default_customer_discount_percent),
        commissionSharePercent: String(config.default_commission_share_percent),
      });
      setShowAddForm(false);
      await loadData();
    } catch (createError) {
      setError(createError.response?.data?.message || 'Could not add this promoter.');
    } finally {
      setCreatingPartner(false);
    }
  };

  const updatePartnerField = (id, field, value) => {
    setPartners(current => current.map(partner => partner.id === id ? { ...partner, [field]: value } : partner));
  };

  const reviewPartner = async (partner, status) => {
    setBusyPartner(partner.id);
    setError('');
    setNotice('');
    try {
      await affiliateApi.updateAdminPartner(partner.id, {
        status,
        discountPercent: Number(partner.discount_percent ?? config.default_customer_discount_percent),
        commissionSharePercent: Number(partner.commission_share_percent ?? config.default_commission_share_percent),
        referralCode: partner.referral_code || undefined,
        adminNotes: partner.admin_notes || '',
      });
      setNotice(`${partner.user_name || 'Promoter'} marked ${status}.`);
      await loadData();
    } catch (reviewError) {
      setError(reviewError.response?.data?.message || 'Could not update this promoter.');
    } finally {
      setBusyPartner(null);
    }
  };

  const recordPayout = async commission => {
    const reference = String(payoutReferences[commission.id] || '').trim();
    if (reference.length < 3) {
      setError('Enter the bank/UPI transfer reference before recording a payout.');
      return;
    }
    setBusyCommission(commission.id);
    setError('');
    setNotice('');
    try {
      await affiliateApi.payAdminCommission(commission.id, { reference });
      setNotice(`Recorded ${money(commission.commission_amount)} payout for ${commission.promoter_name}.`);
      setPayoutReferences(current => ({ ...current, [commission.id]: '' }));
      await loadData();
    } catch (payoutError) {
      setError(payoutError.response?.data?.message || 'Could not record this payout.');
    } finally {
      setBusyCommission(null);
    }
  };

  const copyText = async value => {
    try {
      await navigator.clipboard.writeText(value);
      setNotice('Copied.');
    } catch {
      setError('Clipboard access was unavailable. Select and copy the value manually.');
    }
  };

  const panelClass = 'rounded-2xl border border-[#244A38] bg-[#102219] p-5 shadow-lg';
  const inputClass = 'w-full rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]';

  return (
    <div className="space-y-6 p-4 text-[#DFD7C4] md:p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Revenue partnerships</p>
          <h1 className="mt-1 text-2xl font-serif font-bold text-white">Promoter program</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#9BB0A5]">Approve creators, set each partner’s offer and profit share, review order-level margin, and record payouts with a transfer reference.</p>
        </div>
        <button type="button" onClick={loadData} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-[#315541] px-3 py-2 text-xs font-semibold text-white hover:border-[#D4AF37] disabled:opacity-50">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''}/> Refresh
        </button>
      </header>

      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-950/30 p-3 text-sm text-rose-200"><AlertCircle size={17} className="mt-0.5 shrink-0"/>{error}</div>}
      {notice && <p role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-950/20 p-3 text-sm text-emerald-200">{notice}</p>}

      <PromoterAnalyticsDashboard config={config}/>

      <form onSubmit={saveConfig} className={`${panelClass} space-y-4`}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-[#D4AF37]" size={18}/>
          <h2 className="font-serif text-lg font-bold text-white">Program economics &amp; site minimum</h2>
        </div>
        <p className="text-xs leading-5 text-[#9BB0A5]">Commission is a share of contribution profit after GST-exclusive merchandise revenue, inventory cost, fulfilment, RTO reserve and online payment fees. The backend caps it so retained margin never falls below the hard floor.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MONEY_SETTINGS.map(([key, label, prefix]) => (
            <label key={key} className="space-y-1.5 text-xs font-semibold text-[#DFD7C4]">
              <span>{label}</span>
              <span className="relative block">
                <span className="absolute left-3 top-2.5 text-[#9BB0A5]">{prefix}</span>
                <input
                  type="number"
                  min="0"
                  step={prefix === '%' ? '0.1' : '1'}
                  value={config[key]}
                  onChange={event => setConfig(current => ({ ...current, [key]: event.target.value }))}
                  className={`${inputClass} pl-8`}
                />
              </span>
            </label>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#244A38] pt-4">
          <p className="text-xs text-[#9BB0A5]">₹599 applies sitewide to discounted merchandise (GST included), before shipping and wallet/points redemption.</p>
          <button type="submit" disabled={savingConfig || loading} className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-xs font-bold text-[#102219] disabled:opacity-50"><Save size={14}/>{savingConfig ? 'Saving…' : 'Save program settings'}</button>
        </div>
      </form>

      <section className={`${panelClass} space-y-4`}>
        <div className="flex flex-wrap items-center gap-2">
          <Users className="text-[#D4AF37]" size={18}/>
          <h2 className="font-serif text-lg font-bold text-white">Applications &amp; active promoters</h2>
          <span className="rounded-full bg-[#1E3E2F] px-2.5 py-1 text-xs">{partners.length}</span>
          <button
            type="button"
            onClick={() => {
              if (!showAddForm) {
                setNewPartner(current => ({
                  ...current,
                  discountPercent: String(config.default_customer_discount_percent),
                  commissionSharePercent: String(config.default_commission_share_percent),
                }));
              }
              setShowAddForm(open => !open);
            }}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-[#D4AF37] px-3 py-2 text-xs font-bold text-[#102219]"
          >
            <UserPlus size={14}/>{showAddForm ? 'Close form' : 'Add promoter'}
          </button>
        </div>
        <p className="text-xs leading-5 text-[#9BB0A5]">Add a promoter using their existing customer account, or approve people who apply through the public affiliate page.</p>
        {showAddForm && (
          <form onSubmit={addPartner} className="space-y-3 rounded-xl border border-[#315541] bg-[#0b1c14] p-4">
            <p className="text-sm font-semibold text-white">Create an active promoter</p>
            <p className="text-xs leading-5 text-[#9BB0A5]">The customer must already have an active Bhumivera account. This will approve them immediately and generate their offer code.</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Account email
                <input type="email" required maxLength={254} value={newPartner.email} onChange={event => setNewPartner(current => ({ ...current, email: event.target.value }))} className={inputClass} placeholder="creator@example.com"/>
              </label>
              <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Social platform
                <select value={newPartner.socialPlatform} onChange={event => setNewPartner(current => ({ ...current, socialPlatform: event.target.value }))} className={inputClass}>
                  {['Instagram', 'YouTube', 'Facebook', 'X', 'Other'].map(platform => <option key={platform}>{platform}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Social handle
                <input required maxLength={120} value={newPartner.socialHandle} onChange={event => setNewPartner(current => ({ ...current, socialHandle: event.target.value }))} className={inputClass} placeholder="@creator"/>
              </label>
              <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Profile URL (optional)
                <input type="url" maxLength={500} value={newPartner.profileUrl} onChange={event => setNewPartner(current => ({ ...current, profileUrl: event.target.value }))} className={inputClass} placeholder="https://..."/>
              </label>
              <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Follower count
                <input type="number" min="0" max="100000000" step="1" value={newPartner.followerCount} onChange={event => setNewPartner(current => ({ ...current, followerCount: event.target.value }))} className={inputClass}/>
              </label>
              <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Customer discount %
                <input type="number" min="0" max="60" step="0.1" value={newPartner.discountPercent} onChange={event => setNewPartner(current => ({ ...current, discountPercent: event.target.value }))} className={inputClass}/>
              </label>
              <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Contribution share %
                <input type="number" min="0" max="100" step="0.1" value={newPartner.commissionSharePercent} onChange={event => setNewPartner(current => ({ ...current, commissionSharePercent: event.target.value }))} className={inputClass}/>
              </label>
            </div>
            <button type="submit" disabled={creatingPartner} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">
              <UserPlus size={14}/>{creatingPartner ? 'Adding promoter…' : 'Create promoter & generate code'}
            </button>
          </form>
        )}
        {loading ? <p className="text-sm text-[#9BB0A5]">Loading applications…</p> : partners.length === 0 ? (
          <p className="text-sm text-[#9BB0A5]">No promoters yet. Click <strong className="text-white">Add promoter</strong> to onboard one now, or ask them to sign in and apply on the public affiliate page.</p>
        ) : (
          <div className="space-y-3">
            {partners.map(partner => (
              <article key={partner.id} className="rounded-xl border border-[#315541] bg-[#0b1c14] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">{partner.user_name} <span className="font-normal text-[#9BB0A5]">· {partner.social_platform} / {partner.social_handle}</span></h3>
                    <p className="mt-1 text-xs text-[#9BB0A5]">
                      {partner.user_email} · {AUDIENCE_TIERS[partner.follower_tier] || `${Number(partner.follower_count).toLocaleString()} followers`}
                      {partner.content_niche ? ` · ${partner.content_niche}` : ''}
                      {partner.collaboration_type ? ` · ${COLLABORATION_TYPES[partner.collaboration_type] || partner.collaboration_type}` : ''}
                      {partner.profile_url ? <> · <a href={partner.profile_url} target="_blank" rel="noreferrer" className="text-[#FCE096] underline">profile</a></> : ''}
                    </p>
                    <p className="mt-1 text-xs text-[#9BB0A5]">Attributed orders: {Number(partner.pending_orders || 0)} pending · Payable {money(partner.payable_amount)} · Paid {money(partner.paid_amount)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${partner.status === 'approved' ? 'bg-emerald-900/50 text-emerald-200' : partner.status === 'pending' ? 'bg-amber-900/40 text-amber-100' : 'bg-white/10 text-[#C9C4B8]'}`}>{partner.status}</span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Customer discount %
                    <input type="number" min="0" max="60" step="0.1" value={partner.discount_percent ?? config.default_customer_discount_percent} onChange={event => updatePartnerField(partner.id, 'discount_percent', event.target.value)} className={inputClass}/>
                  </label>
                  <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Contribution share %
                    <input type="number" min="0" max="100" step="0.1" value={partner.commission_share_percent ?? config.default_commission_share_percent} onChange={event => updatePartnerField(partner.id, 'commission_share_percent', event.target.value)} className={inputClass}/>
                  </label>
                  <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Promoter code
                    <input value={partner.referral_code || ''} onChange={event => updatePartnerField(partner.id, 'referral_code', event.target.value.toUpperCase())} placeholder="Generated when approved" className={inputClass}/>
                  </label>
                  <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Admin note
                    <input value={partner.admin_notes || ''} onChange={event => updatePartnerField(partner.id, 'admin_notes', event.target.value)} className={inputClass}/>
                  </label>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {partner.status !== 'approved' && <button type="button" disabled={busyPartner === partner.id} onClick={() => reviewPartner(partner, 'approved')} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"><Check size={14}/>Approve</button>}
                  {partner.status !== 'rejected' && <button type="button" disabled={busyPartner === partner.id} onClick={() => reviewPartner(partner, 'rejected')} className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs font-semibold text-rose-200 disabled:opacity-50">Reject</button>}
                  {partner.status === 'approved' && <button type="button" disabled={busyPartner === partner.id} onClick={() => reviewPartner(partner, 'paused')} className="rounded-lg border border-amber-400/30 px-3 py-2 text-xs font-semibold text-amber-100 disabled:opacity-50">Pause</button>}
                  {partner.status === 'paused' && <button type="button" disabled={busyPartner === partner.id} onClick={() => reviewPartner(partner, 'approved')} className="rounded-lg border border-emerald-400/30 px-3 py-2 text-xs font-semibold text-emerald-100 disabled:opacity-50">Resume</button>}
                  {partner.referral_code && <button type="button" onClick={() => copyText(`${window.location.origin}/?aff=${encodeURIComponent(partner.referral_code)}`)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#315541] px-3 py-2 text-xs text-[#FCE096]"><Clipboard size={13}/>Copy link</button>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className={`${panelClass} space-y-4`}>
        <div className="flex items-center gap-2"><Coins className="text-[#D4AF37]" size={18}/><h2 className="font-serif text-lg font-bold text-white">Commission ledger</h2></div>
        <p className="text-xs leading-5 text-[#9BB0A5]">Orders remain pending until delivered. Cancelled or returned orders reverse the commission. Record a payout only after you have sent the payment; each commission can be paid once.</p>
        {commissions.length === 0 ? <p className="text-sm text-[#9BB0A5]">No attributed orders yet.</p> : <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-xs">
            <thead className="text-[10px] uppercase tracking-wider text-[#9BB0A5]"><tr><th className="py-2">Order / promoter</th><th>Revenue ex GST</th><th>Product cost</th><th>Commission</th><th>Retained margin</th><th>Status / payout</th></tr></thead>
            <tbody className="divide-y divide-[#244A38]">
              {commissions.map(commission => <tr key={commission.id}>
                <td className="py-3"><strong className="text-white">#{commission.order_id}</strong><span className="block text-[#9BB0A5]">{commission.promoter_name} · {commission.referral_code}</span></td>
                <td>{money(commission.revenue_ex_tax)}</td><td>{money(commission.product_cost)}</td>
                <td className="font-bold text-[#FCE096]">{money(commission.commission_amount)}</td>
                <td><span className={Number(commission.retained_margin_percent) >= Number(config.target_retained_margin_percent) ? 'text-emerald-200' : 'text-amber-100'}>{Number(commission.retained_margin_percent).toFixed(2)}%</span><span className="block text-[10px] text-[#9BB0A5]">{Number(commission.retained_margin_percent) >= Number(config.target_retained_margin_percent) ? 'On target' : 'Above floor, below target'}</span></td>
                <td>
                  {commission.status === 'approved' ? <div className="flex min-w-[240px] gap-2">
                    <input value={payoutReferences[commission.id] || ''} onChange={event => setPayoutReferences(current => ({ ...current, [commission.id]: event.target.value }))} placeholder="UPI/bank reference" className="w-36 rounded border border-[#315541] bg-[#0b1c14] px-2 py-1.5 text-white"/>
                    <button type="button" disabled={busyCommission === commission.id} onClick={() => recordPayout(commission)} className="rounded bg-[#D4AF37] px-2 py-1.5 font-bold text-[#102219] disabled:opacity-50">{busyCommission === commission.id ? '…' : 'Mark paid'}</button>
                  </div> : <span className="rounded-full bg-white/10 px-2 py-1 capitalize">{commission.status}</span>}
                </td>
              </tr>)}
            </tbody>
          </table>
        </div>}
      </section>

      <section className={`${panelClass} space-y-3`}>
        <div className="flex items-center gap-2"><Wallet className="text-[#D4AF37]" size={18}/><h2 className="font-serif text-lg font-bold text-white">Payout audit</h2></div>
        {payouts.length === 0 ? <p className="text-sm text-[#9BB0A5]">No payouts recorded.</p> : <div className="space-y-2">
          {payouts.slice(0, 20).map(payout => <div key={payout.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#244A38] px-3 py-2 text-xs">
            <span className="text-white">{payout.promoter_name} · commission #{payout.commission_id} · {money(payout.amount)}</span>
            <span className="text-[#9BB0A5]">{payout.reference} · {new Date(payout.paid_at).toLocaleString()}</span>
          </div>)}
        </div>}
      </section>
    </div>
  );
}
