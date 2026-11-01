import React, { useCallback, useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Gift, Printer, RefreshCw, Save, Ban } from 'lucide-react';
import { welcomeGifts } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const inputClass = 'w-full rounded-xl border border-[#D4AF37]/25 bg-[#0b0e12] px-3 py-2.5 text-sm text-white outline-none focus:border-[#D4AF37]';
const labelClass = 'mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-400';

const giftUrl = code => {
  const url = new URL('/verify', window.location.origin);
  url.searchParams.set('gift', code);
  return url.toString();
};

export default function WelcomeCardManagement() {
  const { showToast } = useToast() || {};
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [minDraft, setMinDraft] = useState('');
  const [form, setForm] = useState({
    label: 'Welcome card gift',
    count: 100,
    totalValue: 200,
    perOrderValue: 100,
    minOrderAmount: 999,
    validityDays: 365,
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await welcomeGifts.getCampaigns();
      setCampaigns(Array.isArray(data?.campaigns) ? data.campaigns : []);
    } catch (loadError) {
      setError(loadError.response?.data?.message || 'Could not load welcome card campaigns.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const printCodes = async (codes, title) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast?.('Allow pop-ups to print the QR sheet.', 'error');
      return;
    }
    printWindow.document.write('<p style="font-family:sans-serif">Preparing QR sheet…</p>');
    try {
      const images = await Promise.all(codes.map(async code => ({
        code,
        dataUrl: await QRCode.toDataURL(giftUrl(code), { errorCorrectionLevel: 'Q', margin: 2, width: 240 }),
      })));
      const cells = images.map(({ code, dataUrl }) => (
        `<div class="cell"><img src="${dataUrl}" alt=""><span>${code}</span></div>`
      )).join('');
      printWindow.document.open();
      printWindow.document.write(`<!doctype html><html><head><title>${title}</title><style>
        body{margin:0;padding:8mm;font-family:monospace}
        .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6mm}
        .cell{text-align:center;break-inside:avoid;border:1px dashed #999;padding:3mm}
        img{width:100%;max-width:38mm}
        span{display:block;font-size:9px;margin-top:2px}
      </style></head><body><div class="grid">${cells}</div></body></html>`);
      printWindow.document.close();
      printWindow.focus();
      window.setTimeout(() => printWindow.print(), 300);
    } catch (printError) {
      printWindow.close();
      showToast?.('Could not generate the QR sheet.', 'error');
    }
  };

  const handleCreate = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await welcomeGifts.createCampaign({
        ...form,
        count: Number(form.count),
        totalValue: Number(form.totalValue),
        perOrderValue: Number(form.perOrderValue),
        minOrderAmount: Number(form.minOrderAmount),
        validityDays: Number(form.validityDays),
      });
      showToast?.(`Created ${data.campaign.cardCount} welcome card QR codes.`, 'success');
      await load();
      await printCodes(data.campaign.codes, data.campaign.label);
    } catch (createError) {
      showToast?.(createError.response?.data?.message || 'Could not create welcome cards.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const openCampaign = async id => {
    try {
      const { data } = await welcomeGifts.getCampaign(id);
      setSelected(data.campaign);
      setMinDraft(String(data.campaign.min_order_amount));
    } catch (openError) {
      setError(openError.response?.data?.message || 'Could not load this campaign.');
    }
  };

  const saveMinimum = async () => {
    if (!selected) return;
    try {
      await welcomeGifts.updateCampaign(selected.id, { minOrderAmount: Number(minDraft) });
      showToast?.('Minimum order amount updated for all unused gifts.', 'success');
      await load();
      await openCampaign(selected.id);
    } catch (saveError) {
      showToast?.(saveError.response?.data?.message || 'Could not update the minimum order amount.', 'error');
    }
  };

  const voidCard = async cardId => {
    try {
      await welcomeGifts.voidCard(cardId);
      await load();
      await openCampaign(selected.id);
    } catch (voidError) {
      showToast?.(voidError.response?.data?.message || 'Could not void this card.', 'error');
    }
  };

  const setField = key => event => setForm(current => ({ ...current, [key]: event.target.value }));

  return (
    <div className="space-y-7 pb-10 text-slate-200">
      <header className="flex flex-col gap-3 border-b border-[#D4AF37]/20 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#D4AF37]">Welcome card QR gifts</p>
          <h1 className="mt-1 flex items-center gap-2 font-serif text-2xl font-semibold text-white">
            <Gift size={24} className="text-[#D4AF37]" /> Welcome Card Gifts
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Generate one-time QR codes for your welcome cards. When a customer scans and signs in, they receive a personal
            coupon: a fixed discount per order, usable until the total gift value is spent, above the minimum order amount you set.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/bhumivera-patron-card-8k.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fce096] to-[#b38f2e] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg hover:brightness-110"
          >
            <Printer size={15} /> Print 8K 2-Page Letter Card
          </a>
          <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF37]/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#fce096]">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </header>

      {error && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-sm text-rose-300">{error}</p>}

      <form onSubmit={handleCreate} className="grid gap-4 rounded-2xl border border-[#D4AF37]/25 bg-[#0d1520] p-5 sm:grid-cols-3">
        <div className="sm:col-span-3"><h2 className="font-serif text-lg font-semibold text-white">Generate welcome card QR codes</h2></div>
        <div>
          <label className={labelClass} htmlFor="wc-label">Campaign name</label>
          <input id="wc-label" className={inputClass} value={form.label} onChange={setField('label')} maxLength={120} />
        </div>
        <div>
          <label className={labelClass} htmlFor="wc-count">Number of cards (max 1000)</label>
          <input id="wc-count" type="number" min="1" max="1000" required className={inputClass} value={form.count} onChange={setField('count')} />
        </div>
        <div>
          <label className={labelClass} htmlFor="wc-validity">Valid for (days after claim)</label>
          <input id="wc-validity" type="number" min="1" required className={inputClass} value={form.validityDays} onChange={setField('validityDays')} />
        </div>
        <div>
          <label className={labelClass} htmlFor="wc-total">Total gift value (₹)</label>
          <input id="wc-total" type="number" min="1" required className={inputClass} value={form.totalValue} onChange={setField('totalValue')} />
        </div>
        <div>
          <label className={labelClass} htmlFor="wc-per">Usable per order (₹)</label>
          <input id="wc-per" type="number" min="1" required className={inputClass} value={form.perOrderValue} onChange={setField('perOrderValue')} />
        </div>
        <div>
          <label className={labelClass} htmlFor="wc-min">Minimum order amount (₹)</label>
          <input id="wc-min" type="number" min="0" required className={inputClass} value={form.minOrderAmount} onChange={setField('minOrderAmount')} />
        </div>
        <div className="sm:col-span-3">
          <button type="submit" disabled={saving} className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50">
            <Printer size={15} /> {saving ? 'Generating…' : 'Generate & print QR sheet'}
          </button>
        </div>
      </form>

      <section className="rounded-2xl border border-[#D4AF37]/25 bg-[#0d1520] p-5">
        <h2 className="font-serif text-lg font-semibold text-white">Campaigns</h2>
        {loading ? <p className="mt-3 text-sm text-slate-400">Loading…</p> : campaigns.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">No welcome card campaigns yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                <tr><th className="py-2">Campaign</th><th>Gift</th><th>Per order</th><th>Min order</th><th>Claimed</th><th /></tr>
              </thead>
              <tbody>
                {campaigns.map(campaign => (
                  <tr key={campaign.id} className="border-t border-white/5">
                    <td className="py-2 font-semibold text-white">{campaign.label}</td>
                    <td>₹{Number(campaign.total_value)}</td>
                    <td>₹{Number(campaign.per_order_value)}</td>
                    <td>₹{Number(campaign.min_order_amount)}</td>
                    <td>{campaign.claimed_count} / {campaign.card_count}</td>
                    <td className="text-right">
                      <button type="button" onClick={() => openCampaign(campaign.id)} className="rounded-lg border border-[#D4AF37]/30 px-3 py-1 text-xs font-bold text-[#fce096]">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selected && (
        <section className="space-y-4 rounded-2xl border border-[#D4AF37]/25 bg-[#0d1520] p-5">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <h2 className="font-serif text-lg font-semibold text-white">{selected.label}</h2>
              <p className="text-xs text-slate-400">₹{Number(selected.total_value)} gift · ₹{Number(selected.per_order_value)} per order</p>
            </div>
            <div className="ml-auto flex flex-wrap items-end gap-2">
              <div>
                <label className={labelClass} htmlFor="wc-edit-min">Minimum order amount (₹)</label>
                <input id="wc-edit-min" type="number" min="0" className={`${inputClass} w-40`} value={minDraft} onChange={event => setMinDraft(event.target.value)} />
              </div>
              <button type="button" onClick={saveMinimum} className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white">
                <Save size={14} /> Save
              </button>
              <button
                type="button"
                onClick={() => printCodes(selected.cards.filter(card => card.status === 'unclaimed').map(card => card.code), selected.label)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF37]/30 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#fce096]"
              >
                <Printer size={14} /> Reprint unclaimed
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                <tr><th className="py-2">Code</th><th>Status</th><th>Claimed by</th><th>Coupon</th><th /></tr>
              </thead>
              <tbody>
                {selected.cards.map(card => (
                  <tr key={card.id} className="border-t border-white/5">
                    <td className="py-2 font-mono text-[#fce096]">{card.code}</td>
                    <td className="capitalize">{card.status}</td>
                    <td>{card.claimed_by_name || card.claimed_by_email || '—'}</td>
                    <td className="font-mono">{card.coupon_code || '—'}</td>
                    <td className="text-right">
                      {card.status === 'unclaimed' && (
                        <button type="button" onClick={() => voidCard(card.id)} className="inline-flex items-center gap-1 text-xs font-bold text-rose-300">
                          <Ban size={12} /> Void
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
