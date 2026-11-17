import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle, Check, CheckSquare, Clipboard, Coins, Download,
  Filter, MessageSquare, RefreshCw, Save, Search, ShieldCheck,
  UserPlus, Users, Wallet
} from 'lucide-react';
import { affiliate as affiliateApi } from '../../services/api';
import PromoterAnalyticsDashboard from './PromoterAnalyticsDashboard';

const INITIAL_CONFIG = {
  default_customer_discount_percent: 10,
  default_commission_share_percent: 20,
  fulfillment_cost: 110,
  rto_reserve: 40,
  online_payment_fee_percent: 2,
  minimum_retained_margin_percent: 15,
  target_retained_margin_percent: 25,
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
  affiliate_commission: 'Affiliate profit sharing (legacy preference)',
  both: 'Product gifting / barter + affiliate profit sharing',
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

  // 20x Filter, Search, Sort & Bulk State
  const [partnerSearch, setPartnerSearch] = useState('');
  const [partnerStatusFilter, setPartnerStatusFilter] = useState('all');
  const [partnerPlatformFilter, setPartnerPlatformFilter] = useState('all');
  const [partnerSort, setPartnerSort] = useState('pending_first');
  const [selectedPartnerIds, setSelectedPartnerIds] = useState([]);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkRateDiscount, setBulkRateDiscount] = useState('');
  const [bulkRateShare, setBulkRateShare] = useState('');

  const [commissionFilter, setCommissionFilter] = useState('all');
  const [commissionSearch, setCommissionSearch] = useState('');
  const [selectedCommissionIds, setSelectedCommissionIds] = useState([]);
  const [batchPayoutReference, setBatchPayoutReference] = useState('');
  const [batchPaying, setBatchPaying] = useState(false);

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

  const filteredPartners = useMemo(() => {
    const q = partnerSearch.trim().toLowerCase();
    const list = partners.filter(partner => {
      if (partnerStatusFilter !== 'all' && partner.status !== partnerStatusFilter) return false;
      if (partnerPlatformFilter !== 'all' && partner.social_platform !== partnerPlatformFilter) return false;
      if (!q) return true;
      return (
        String(partner.user_name || '').toLowerCase().includes(q) ||
        String(partner.user_email || '').toLowerCase().includes(q) ||
        String(partner.social_handle || '').toLowerCase().includes(q) ||
        String(partner.referral_code || '').toLowerCase().includes(q) ||
        String(partner.content_niche || '').toLowerCase().includes(q)
      );
    });
    return [...list].sort((a, b) => {
      if (partnerSort === 'payable_desc') return (Number(b.payable_amount) || 0) - (Number(a.payable_amount) || 0);
      if (partnerSort === 'followers_desc') return (Number(b.follower_count) || 0) - (Number(a.follower_count) || 0);
      if (partnerSort === 'paid_desc') return (Number(b.paid_amount) || 0) - (Number(a.paid_amount) || 0);
      return (b.status === 'pending' ? 1 : 0) - (a.status === 'pending' ? 1 : 0);
    });
  }, [partners, partnerSearch, partnerStatusFilter, partnerPlatformFilter, partnerSort]);

  const filteredCommissions = useMemo(() => {
    const q = commissionSearch.trim().toLowerCase();
    return commissions.filter(c => {
      if (commissionFilter !== 'all' && c.status !== commissionFilter) return false;
      if (!q) return true;
      return (
        String(c.order_id || '').includes(q) ||
        String(c.promoter_name || '').toLowerCase().includes(q) ||
        String(c.referral_code || '').toLowerCase().includes(q)
      );
    });
  }, [commissions, commissionFilter, commissionSearch]);

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
      setNotice(`Creator added and approved. Share promo code ${data.partner.referral_code}.`);
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

  const savePartner = async partner => {
    const discountPercent = Number(partner.discount_percent ?? config.default_customer_discount_percent);
    const commissionSharePercent = Number(partner.commission_share_percent ?? config.default_commission_share_percent);
    const promoUsageLimit = partner.promo_usage_limit === '' || partner.promo_usage_limit === null || partner.promo_usage_limit === undefined
      ? null
      : Number(partner.promo_usage_limit);
    const promoPerUserLimit = Number(partner.promo_per_user_limit ?? 1);
    if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 60 ||
        !Number.isFinite(commissionSharePercent) || commissionSharePercent < 0 || commissionSharePercent > 100 ||
        (promoUsageLimit !== null && (!Number.isSafeInteger(promoUsageLimit) || promoUsageLimit < 1 || promoUsageLimit > 1000000)) ||
        !Number.isSafeInteger(promoPerUserLimit) || promoPerUserLimit < 0 || promoPerUserLimit > 1000000) {
      setError('Enter a customer discount from 0–60%, a contribution share from 0–100%, and whole-number promo use limits.');
      setNotice('');
      return;
    }
    setBusyPartner(partner.id);
    setError('');
    setNotice('');
    try {
      const { data } = await affiliateApi.updateAdminPartner(partner.id, {
        discountPercent,
        commissionSharePercent,
        referralCode: partner.referral_code || '',
        promoUsageLimit,
        promoPerUserLimit,
        adminNotes: partner.admin_notes || '',
      });
      setPartners(current => current.map(item => (
        item.id === partner.id ? { ...item, ...data.partner } : item
      )));
      setNotice(`${partner.user_name || 'Creator'} promo settings saved. Changes apply to new eligible orders; existing orders and earnings stay unchanged.`);
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Could not save this promoter profile.');
    } finally {
      setBusyPartner(null);
    }
  };

  const runBulkPartnerAction = async ({ status, applyRates = false }) => {
    if (!selectedPartnerIds.length) {
      setError('Select at least one promoter checkbox first.');
      return;
    }
    setBulkBusy(true);
    setError('');
    setNotice('');
    try {
      const payload = {
        partnerIds: selectedPartnerIds,
        ...(status ? { status } : {}),
        ...(applyRates && bulkRateDiscount !== '' ? { discountPercent: Number(bulkRateDiscount) } : {}),
        ...(applyRates && bulkRateShare !== '' ? { commissionSharePercent: Number(bulkRateShare) } : {}),
      };
      if (affiliateApi.bulkUpdateAdminPartners) {
        await affiliateApi.bulkUpdateAdminPartners(payload);
      } else {
        for (const id of selectedPartnerIds) {
          const existing = partners.find(p => p.id === id);
          if (existing) {
            await affiliateApi.updateAdminPartner(id, {
              ...(status ? { status } : {}),
              discountPercent: applyRates && bulkRateDiscount !== '' ? Number(bulkRateDiscount) : Number(existing.discount_percent ?? config.default_customer_discount_percent),
              commissionSharePercent: applyRates && bulkRateShare !== '' ? Number(bulkRateShare) : Number(existing.commission_share_percent ?? config.default_commission_share_percent),
              referralCode: existing.referral_code || undefined,
              adminNotes: existing.admin_notes || '',
            });
          }
        }
      }
      setNotice(`Updated ${selectedPartnerIds.length} promoter profile(s).`);
      setSelectedPartnerIds([]);
      await loadData();
    } catch (bulkErr) {
      setError(bulkErr.response?.data?.message || 'Could not complete bulk promoter update.');
    } finally {
      setBulkBusy(false);
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

  const runBatchPayout = async () => {
    const reference = batchPayoutReference.trim();
    if (!selectedCommissionIds.length || reference.length < 3) {
      setError('Select approved commissions and enter a transfer reference of at least 3 characters.');
      return;
    }
    setBatchPaying(true);
    setError('');
    setNotice('');
    try {
      if (affiliateApi.bulkPayAdminCommissions) {
        const { data } = await affiliateApi.bulkPayAdminCommissions({
          commissionIds: selectedCommissionIds,
          reference,
        });
        setNotice(`Batch payout recorded for ${data.paidCount || selectedCommissionIds.length} commission(s).`);
      } else {
        for (const id of selectedCommissionIds) {
          await affiliateApi.payAdminCommission(id, { reference });
        }
        setNotice(`Batch payout recorded for ${selectedCommissionIds.length} commission(s).`);
      }
      setSelectedCommissionIds([]);
      setBatchPayoutReference('');
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not complete batch commission payout.');
    } finally {
      setBatchPaying(false);
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

  const copyWelcomeMessage = async partner => {
    const code = partner.referral_code || 'PENDING';
    const link = `${window.location.origin}/?aff=${encodeURIComponent(code)}`;
    const msg = `Hi ${partner.user_name || 'there'}, your Bhumivera Creator Partnership (${partner.social_handle}) is ${partner.status}! Your creator promo code ${code} gives ${Number(partner.discount_percent ?? config.default_customer_discount_percent)}% off at ${link} and earns ${Number(partner.commission_share_percent ?? config.default_commission_share_percent)}% of qualifying order contribution. View your live ledger & briefs at ${window.location.origin}/promotions/dashboard`;
    await copyText(msg);
  };

  const exportCommissionsCsv = () => {
    if (!filteredCommissions.length) return;
    const headers = ['Commission ID', 'Order ID', 'Promoter', 'Code', 'Revenue Ex GST', 'Product Cost', 'Commission Amount', 'Retained Margin %', 'Status'];
    const lines = [
      headers.join(','),
      ...filteredCommissions.map(c => [
        c.id,
        c.order_id,
        `"${String(c.promoter_name || '').replace(/"/g, '""')}"`,
        c.referral_code,
        Number(c.revenue_ex_tax || 0).toFixed(2),
        Number(c.product_cost || 0).toFixed(2),
        Number(c.commission_amount || 0).toFixed(2),
        Number(c.retained_margin_percent || 0).toFixed(2),
        c.status,
      ].join(',')),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bhumivera-promoter-commissions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const togglePartnerSelect = id => {
    setSelectedPartnerIds(curr => curr.includes(id) ? curr.filter(item => item !== id) : [...curr, id]);
  };

  const toggleCommissionSelect = id => {
    setSelectedCommissionIds(curr => curr.includes(id) ? curr.filter(item => item !== id) : [...curr, id]);
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
          <h2 className="font-serif text-lg font-bold text-white">Creator accounts &amp; promo codes</h2>
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
            <UserPlus size={14}/>{showAddForm ? 'Close form' : 'Add creator'}
          </button>
        </div>
        <p className="text-xs leading-5 text-[#9BB0A5]">Manage each creator’s account, customer discount, promo code, and use limits. Promo settings apply in cart and checkout; existing orders and earnings stay unchanged.</p>

        {partners.length > 1 && (
          <div className="space-y-3 rounded-xl border border-[#244A38] bg-[#0b1c14] p-3.5">
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              <label className="flex items-center gap-2 rounded-lg border border-[#315541] bg-[#102219] px-3 py-1.5 text-xs text-[#9BB0A5]">
                <Search size={14}/>
                <input
                  value={partnerSearch}
                  onChange={e => setPartnerSearch(e.target.value)}
                  placeholder="Search name, @handle, email, code…"
                  className="w-full bg-transparent text-xs text-white outline-none"
                />
              </label>
              <select value={partnerStatusFilter} onChange={e => setPartnerStatusFilter(e.target.value)} className="rounded-lg border border-[#315541] bg-[#102219] px-3 py-1.5 text-xs text-white">
                <option value="all">All statuses ({partners.length})</option>
                <option value="pending">Pending review</option>
                <option value="approved">Approved</option>
                <option value="paused">Paused</option>
                <option value="rejected">Rejected</option>
              </select>
              <select value={partnerPlatformFilter} onChange={e => setPartnerPlatformFilter(e.target.value)} className="rounded-lg border border-[#315541] bg-[#102219] px-3 py-1.5 text-xs text-white">
                <option value="all">All platforms</option>
                {['Instagram', 'YouTube', 'Facebook', 'X', 'Other'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select value={partnerSort} onChange={e => setPartnerSort(e.target.value)} className="rounded-lg border border-[#315541] bg-[#102219] px-3 py-1.5 text-xs text-white">
                <option value="pending_first">Sort: Pending review first</option>
                <option value="payable_desc">Sort: Highest payable balance</option>
                <option value="paid_desc">Sort: Highest lifetime paid</option>
                <option value="followers_desc">Sort: Highest followers</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#244A38] pt-2.5 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPartnerIds(selectedPartnerIds.length === filteredPartners.length ? [] : filteredPartners.map(p => p.id))}
                  className="inline-flex items-center gap-1 rounded border border-[#315541] px-2.5 py-1 text-[11px] text-[#FCE096]"
                >
                  <CheckSquare size={12}/> {selectedPartnerIds.length === filteredPartners.length && filteredPartners.length > 0 ? 'Clear selection' : `Select visible (${filteredPartners.length})`}
                </button>
                {selectedPartnerIds.length > 0 && (
                  <>
                    <button type="button" disabled={bulkBusy} onClick={() => runBulkPartnerAction({ status: 'approved' })} className="rounded bg-emerald-700 px-2.5 py-1 text-[11px] font-bold text-white">
                      Bulk Approve ({selectedPartnerIds.length})
                    </button>
                    <button type="button" disabled={bulkBusy} onClick={() => runBulkPartnerAction({ status: 'paused' })} className="rounded border border-amber-400/30 px-2.5 py-1 text-[11px] text-amber-100">
                      Bulk Pause
                    </button>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      step="0.5"
                      value={bulkRateDiscount}
                      onChange={e => setBulkRateDiscount(e.target.value)}
                      placeholder="Disc %"
                      className="w-20 rounded border border-[#315541] bg-[#102219] px-2 py-1 text-[11px] text-white"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={bulkRateShare}
                      onChange={e => setBulkRateShare(e.target.value)}
                      placeholder="Share %"
                      className="w-20 rounded border border-[#315541] bg-[#102219] px-2 py-1 text-[11px] text-white"
                    />
                    <button type="button" disabled={bulkBusy} onClick={() => runBulkPartnerAction({ applyRates: true })} className="rounded bg-[#D4AF37] px-2.5 py-1 text-[11px] font-bold text-[#102219]">
                      Apply Rates
                    </button>
                  </>
                )}
              </div>
              <span className="text-[11px] text-[#9BB0A5]">Showing {filteredPartners.length} of {partners.length} promoters</span>
            </div>
          </div>
        )}

        {showAddForm && (
          <form onSubmit={addPartner} className="space-y-3 rounded-xl border border-[#315541] bg-[#0b1c14] p-4">
            <p className="text-sm font-semibold text-white">Create an active creator account</p>
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
        <p className="text-xs leading-5 text-[#9BB0A5]">Save rates, promoter codes, and private admin notes per profile without changing its status. Rate changes apply to new eligible orders; existing commission records are not recalculated. Program milestone upgrades remain in effect.</p>
        {loading ?         <p className="text-sm text-[#9BB0A5]">Loading creator accounts…</p> : filteredPartners.length === 0 ? (
            <p className="text-sm text-[#9BB0A5]">No creators match the current filter. Click <strong className="text-white">Add creator</strong> to onboard one now, or ask them to sign in and apply on the public creator page.</p>
        ) : (
          <div className="space-y-3">
            {filteredPartners.map(partner => (
              <article key={partner.id} className="rounded-xl border border-[#315541] bg-[#0b1c14] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {partners.length > 1 && (
                      <input
                        type="checkbox"
                        aria-label={`Select promoter ${partner.user_name || partner.id}`}
                        checked={selectedPartnerIds.includes(partner.id)}
                        onChange={() => togglePartnerSelect(partner.id)}
                        className="mt-1 h-4 w-4 accent-[#D4AF37]"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-white">{partner.user_name} <span className="font-normal text-[#9BB0A5]">· {partner.social_platform} / {partner.social_handle}</span></h3>
                      <p className="mt-1 text-xs text-[#9BB0A5]">
                        {partner.user_email} · {AUDIENCE_TIERS[partner.follower_tier] || `${Number(partner.follower_count).toLocaleString()} followers`}
                        {partner.content_niche ? ` · ${partner.content_niche}` : ''}
                        {partner.collaboration_type ? ` · ${COLLABORATION_TYPES[partner.collaboration_type] || partner.collaboration_type}` : ''}
                        {partner.profile_url ? <> · <a href={partner.profile_url} target="_blank" rel="noreferrer" className="text-[#FCE096] underline">profile</a></> : ''}
                      </p>
                      {partner.partnership_intent && (
                        <p className="mt-2 max-w-3xl rounded-lg border border-[#315541] bg-black/10 p-3 text-xs leading-5 text-[#C5D8CC]">
                          <strong className="text-[#FCE096]">Partnership intent:</strong> {partner.partnership_intent}
                        </p>
                      )}
                      {(partner.preferred_products || partner.content_formats || partner.payout_upi_id || partner.whatsapp_contact) && (
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#9BB0A5]">
                          {partner.preferred_products && <span className="rounded border border-[#244A38] bg-[#102219] px-2 py-0.5">Products: <strong className="text-white">{partner.preferred_products}</strong></span>}
                          {partner.content_formats && <span className="rounded border border-[#244A38] bg-[#102219] px-2 py-0.5">Formats: <strong className="text-white">{partner.content_formats}</strong></span>}
                          {partner.payout_upi_id && <span className="rounded border border-[#244A38] bg-[#102219] px-2 py-0.5">UPI: <strong className="text-[#FCE096]">{partner.payout_upi_id}</strong></span>}
                          {partner.whatsapp_contact && <span className="rounded border border-[#244A38] bg-[#102219] px-2 py-0.5">WhatsApp: <strong className="text-white">{partner.whatsapp_contact}</strong></span>}
                        </div>
                      )}
                      <p className="mt-1 text-xs text-[#9BB0A5]">Attributed orders: {Number(partner.pending_orders || 0)} pending · Payable {money(partner.payable_amount)} · Paid {money(partner.paid_amount)}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${partner.status === 'approved' ? 'bg-emerald-900/50 text-emerald-200' : partner.status === 'pending' ? 'bg-amber-900/40 text-amber-100' : 'bg-white/10 text-[#C9C4B8]'}`}>{partner.status}</span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Customer promo discount %
                    <input type="number" min="0" max="60" step="0.1" value={partner.discount_percent ?? config.default_customer_discount_percent} onChange={event => updatePartnerField(partner.id, 'discount_percent', event.target.value)} className={inputClass}/>
                  </label>
                  <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Contribution share %
                    <input type="number" min="0" max="100" step="0.1" value={partner.commission_share_percent ?? config.default_commission_share_percent} onChange={event => updatePartnerField(partner.id, 'commission_share_percent', event.target.value)} className={inputClass}/>
                  </label>
                  <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Creator promo code
                    <input value={partner.referral_code || ''} onChange={event => updatePartnerField(partner.id, 'referral_code', event.target.value.toUpperCase())} placeholder="Generated when approved" className={inputClass}/>
                  </label>
                  <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Total promo uses <span className="font-normal">(blank = unlimited)</span>
                    <input type="number" min="1" max="1000000" step="1" value={partner.promo_usage_limit ?? ''} onChange={event => updatePartnerField(partner.id, 'promo_usage_limit', event.target.value)} placeholder="Unlimited" className={inputClass}/>
                  </label>
                  <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Uses per customer <span className="font-normal">(0 = unlimited)</span>
                    <input type="number" min="0" max="1000000" step="1" value={partner.promo_per_user_limit ?? 1} onChange={event => updatePartnerField(partner.id, 'promo_per_user_limit', event.target.value)} className={inputClass}/>
                  </label>
                  <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Private admin notes
                    <textarea rows="2" maxLength="1000" value={partner.admin_notes || ''} onChange={event => updatePartnerField(partner.id, 'admin_notes', event.target.value)} className={`${inputClass} resize-y`}/>
                  </label>
                </div>
                <p className="mt-2 text-[11px] text-[#9BB0A5]">
                  Promo uses: {Number(partner.promo_used_count || 0).toLocaleString()}
                  {partner.promo_usage_limit ? ` of ${Number(partner.promo_usage_limit).toLocaleString()}` : ' · no total limit'}
                  {partner.promo_usage_limit ? ` · ${Math.max(0, Number(partner.promo_usage_limit) - Number(partner.promo_used_count || 0)).toLocaleString()} remaining` : ''}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" disabled={busyPartner === partner.id} onClick={() => savePartner(partner)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#D4AF37] px-3 py-2 text-xs font-bold text-[#102219] disabled:opacity-50"><Save size={14}/>{busyPartner === partner.id ? 'Saving…' : 'Save changes'}</button>
                  {partner.status !== 'approved' && <button type="button" disabled={busyPartner === partner.id} onClick={() => reviewPartner(partner, 'approved')} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"><Check size={14}/>Approve</button>}
                  {partner.status !== 'rejected' && <button type="button" disabled={busyPartner === partner.id} onClick={() => reviewPartner(partner, 'rejected')} className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs font-semibold text-rose-200 disabled:opacity-50">Reject</button>}
                  {partner.status === 'approved' && <button type="button" disabled={busyPartner === partner.id} onClick={() => reviewPartner(partner, 'paused')} className="rounded-lg border border-amber-400/30 px-3 py-2 text-xs font-semibold text-amber-100 disabled:opacity-50">Pause</button>}
                  {partner.status === 'paused' && <button type="button" disabled={busyPartner === partner.id} onClick={() => reviewPartner(partner, 'approved')} className="rounded-lg border border-emerald-400/30 px-3 py-2 text-xs font-semibold text-emerald-100 disabled:opacity-50">Resume</button>}
                  {partner.referral_code && <button type="button" onClick={() => copyText(`${window.location.origin}/?aff=${encodeURIComponent(partner.referral_code)}`)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#315541] px-3 py-2 text-xs text-[#FCE096]"><Clipboard size={13}/>Copy promo link</button>}
                  <button type="button" onClick={() => copyWelcomeMessage(partner)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#315541] px-3 py-2 text-xs text-[#C5D8CC] hover:border-[#D4AF37]"><MessageSquare size={13}/>Copy creator welcome</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className={`${panelClass} space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2"><Coins className="text-[#D4AF37]" size={18}/><h2 className="font-serif text-lg font-bold text-white">Commission ledger</h2></div>
          {commissions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={commissionSearch}
                onChange={e => setCommissionSearch(e.target.value)}
                placeholder="Search order # or promoter…"
                className="rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-1.5 text-xs text-white outline-none"
              />
              <select value={commissionFilter} onChange={e => setCommissionFilter(e.target.value)} className="rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-1.5 text-xs text-white">
                <option value="all">All statuses</option>
                <option value="approved">Approved (Payable)</option>
                <option value="pending">Pending Delivery</option>
                <option value="paid">Paid</option>
                <option value="reversed">Reversed</option>
              </select>
              <button type="button" onClick={exportCommissionsCsv} className="inline-flex items-center gap-1 rounded-lg border border-[#315541] px-3 py-1.5 text-xs font-semibold text-[#FCE096]">
                <Download size={13}/> Export CSV
              </button>
            </div>
          )}
        </div>
        <p className="text-xs leading-5 text-[#9BB0A5]">Orders remain pending until delivered. Cancelled or returned orders reverse the commission. Record a payout only after you have sent the payment; each commission can be paid once.</p>

        {selectedCommissionIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#D4AF37]/40 bg-[#0b1c14] p-3 text-xs">
            <span className="font-semibold text-[#FCE096]">{selectedCommissionIds.length} approved commission(s) selected</span>
            <input
              value={batchPayoutReference}
              onChange={e => setBatchPayoutReference(e.target.value)}
              placeholder="Batch UPI / bank reference"
              className="rounded border border-[#315541] bg-[#102219] px-3 py-1.5 text-xs text-white"
            />
            <button type="button" disabled={batchPaying} onClick={runBatchPayout} className="rounded bg-[#D4AF37] px-3 py-1.5 font-bold text-[#102219]">
              {batchPaying ? 'Settling…' : 'Settle Selected Batch'}
            </button>
          </div>
        )}

        {filteredCommissions.length === 0 ? <p className="text-sm text-[#9BB0A5]">No attributed orders yet.</p> : <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-xs">
            <thead className="text-[10px] uppercase tracking-wider text-[#9BB0A5]"><tr><th className="py-2">Order / promoter</th><th>Revenue ex GST</th><th>Product cost</th><th>Commission</th><th>Retained margin</th><th>Status / payout</th></tr></thead>
            <tbody className="divide-y divide-[#244A38]">
              {filteredCommissions.map(commission => <tr key={commission.id}>
                <td className="py-3">
                  <div className="flex items-start gap-2">
                    {commission.status === 'approved' && (
                      <input
                        type="checkbox"
                        checked={selectedCommissionIds.includes(commission.id)}
                        onChange={() => toggleCommissionSelect(commission.id)}
                        className="mt-0.5 h-3.5 w-3.5 accent-[#D4AF37]"
                      />
                    )}
                    <div>
                      <strong className="text-white">#{commission.order_id}</strong>
                      <span className="block text-[#9BB0A5]">{commission.promoter_name} · {commission.referral_code}</span>
                    </div>
                  </div>
                </td>
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
