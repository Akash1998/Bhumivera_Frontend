import { useEffect, useMemo, useState } from 'react';
import { loyaltyTiers as loyaltyTiersApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Award, Pencil, Plus, Save, Trash2, Truck, X } from 'lucide-react';

const emptyTier = { name: '', min_points: 0, benefits: '', points_multiplier: 1, tier_discount_percent: 0, cashback_percent: 0, free_shipping: false, bonus_points: 0, color: '#34d399', is_active: true };
const defaultConfig = { enabled: true, points_per_rupee: 0.1, redemption_points_per_rupee: 10, max_redemption_percent: 20, minimum_redemption_points: 100 };

export default function LoyaltyTierForge() {
  const [tiers, setTiers] = useState([]);
  const [matrixConfig, setMatrixConfig] = useState(defaultConfig);
  const [draft, setDraft] = useState(null);
  const [previewPoints, setPreviewPoints] = useState(2500);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast() || {};

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await loyaltyTiersApi.getMatrix();
      setTiers(data?.data?.tiers || []);
      setMatrixConfig({ ...defaultConfig, ...(data?.data?.config || {}) });
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not load loyalty tiers.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const saveMatrix = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await loyaltyTiersApi.saveMatrix({
        ...matrixConfig,
        enabled: Boolean(matrixConfig.enabled),
        points_per_rupee: Number(matrixConfig.points_per_rupee),
        redemption_points_per_rupee: Number(matrixConfig.redemption_points_per_rupee),
        max_redemption_percent: Number(matrixConfig.max_redemption_percent),
        minimum_redemption_points: Number(matrixConfig.minimum_redemption_points),
      });
      setMatrixConfig({ ...defaultConfig, ...data?.data });
      showToast?.('Loyalty matrix settings saved.', 'success');
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not save loyalty matrix settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const preview = useMemo(() => {
    const ordered = tiers.filter(tier => Number(tier.is_active) === 1).sort((a, b) => Number(a.min_points) - Number(b.min_points));
    let currentIndex = 0;
    ordered.forEach((tier, index) => { if (previewPoints >= Number(tier.min_points)) currentIndex = index; });
    const current = ordered[currentIndex];
    const next = ordered[currentIndex + 1];
    const low = Number(current?.min_points) || 0;
    const high = Number(next?.min_points) || low;
    const progress = next && high > low ? Math.min(100, Math.max(0, (previewPoints - low) * 100 / (high - low))) : 100;
    return { current, next, progress, missing: next ? Math.max(0, high - previewPoints) : 0 };
  }, [tiers, previewPoints]);

  const save = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...draft,
        min_points: Math.max(0, Math.trunc(Number(draft.min_points) || 0)),
        points_multiplier: Number(draft.points_multiplier),
        tier_discount_percent: Number(draft.tier_discount_percent),
        cashback_percent: Number(draft.cashback_percent),
        free_shipping: Boolean(draft.free_shipping),
        bonus_points: Math.max(0, Math.trunc(Number(draft.bonus_points) || 0)),
      };
      if (draft.id) await loyaltyTiersApi.update(draft.id, payload);
      else await loyaltyTiersApi.create(payload);
      setDraft(null);
      showToast?.('Loyalty tier saved.', 'success');
      await load();
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not save loyalty tier.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async tier => {
    if (!window.confirm(`Delete the ${tier.name} tier?`)) return;
    try {
      await loyaltyTiersApi.remove(tier.id);
      await load();
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not delete loyalty tier.', 'error');
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-5"><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Earn, status and checkout redemption</p><h2 className="mt-2 text-2xl font-bold text-white">Loyalty Matrix</h2></div><button type="button" onClick={() => setDraft({ ...emptyTier })} className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950"><Plus size={16}/>Add tier</button></header>
      <form onSubmit={saveMatrix} className="grid gap-4 border-y border-slate-800 py-5 md:grid-cols-2 xl:grid-cols-3">
        <label className="flex items-start gap-3 border border-white/10 p-4 text-sm text-white md:col-span-2 xl:col-span-3"><input type="checkbox" checked={Boolean(matrixConfig.enabled)} onChange={event => setMatrixConfig(current => ({ ...current, enabled: event.target.checked }))} className="mt-0.5 accent-emerald-400"/><span><strong>Loyalty program active</strong><span className="mt-1 block text-xs text-slate-400">When off, tier discounts, loyalty free shipping, point earning and point redemption stop. Existing balances remain intact.</span></span></label>
        <label className="text-xs text-slate-400">Base points earned per ₹1 eligible spend<input type="number" min="0" max="100" step="0.01" required value={matrixConfig.points_per_rupee} onChange={event => setMatrixConfig(current => ({ ...current, points_per_rupee: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-[#10241f] px-3 py-2 text-sm text-white"/><span className="mt-1 block text-slate-500">Default 0.1 point per ₹1 (1 point per ₹10).</span></label>
        <label className="text-xs text-slate-400">Points required for ₹1 at checkout<input type="number" min="1" max="100000" step="1" required value={matrixConfig.redemption_points_per_rupee} onChange={event => setMatrixConfig(current => ({ ...current, redemption_points_per_rupee: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-[#10241f] px-3 py-2 text-sm text-white"/><span className="mt-1 block text-slate-500">Default 10 points = ₹1; points have no cash-out route.</span></label>
        <label className="text-xs text-slate-400">Maximum points discount (% of remaining items)<input type="number" min="0" max="100" step="1" required value={matrixConfig.max_redemption_percent} onChange={event => setMatrixConfig(current => ({ ...current, max_redemption_percent: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-[#10241f] px-3 py-2 text-sm text-white"/></label>
        <label className="text-xs text-slate-400">Minimum points to redeem<input type="number" min="0" max="1000000" step="1" required value={matrixConfig.minimum_redemption_points} onChange={event => setMatrixConfig(current => ({ ...current, minimum_redemption_points: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-[#10241f] px-3 py-2 text-sm text-white"/></label>
        <button type="submit" disabled={saving} className="inline-flex min-h-10 items-center justify-center gap-2 bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-50"><Save size={15}/>{saving ? 'Saving…' : 'Save matrix settings'}</button>
      </form>
      {loading ? <p className="text-sm text-slate-400">Loading tiers…</p> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tiers.map(tier => <article key={tier.id} className={`border-y py-4 ${Number(tier.is_active) === 1 ? 'border-slate-800' : 'border-amber-900/50 opacity-60'}`}>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm font-bold text-white"><Award size={16} style={{ color: tier.color || '#34d399' }}/>{tier.name}</span><span className="font-mono text-xs text-emerald-300">{Number(tier.min_points).toLocaleString()} lifetime pts</span></div>
            <p className="mt-2 text-xs text-slate-400">{tier.benefits || 'Tier benefits'}</p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
              <li>{Number(tier.points_multiplier).toLocaleString()}× points on eligible spend</li>
              {Number(tier.tier_discount_percent) > 0 && <li>{Number(tier.tier_discount_percent)}% order discount, stacked after offers</li>}
              {Number(tier.cashback_percent) > 0 && <li>{Number(tier.cashback_percent)}% cashback issued as site-only points</li>}
              {Number(tier.bonus_points) > 0 && <li>+{Number(tier.bonus_points).toLocaleString()} points per confirmed order</li>}
              {Number(tier.free_shipping) === 1 && <li className="flex items-center gap-1"><Truck size={13}/>Free shipping</li>}
              {!Number(tier.tier_discount_percent) && !Number(tier.cashback_percent) && !Number(tier.bonus_points) && !Number(tier.free_shipping) && <li className="text-slate-500">No extra benefits configured</li>}
            </ul>
            <div className="mt-3 flex items-center justify-between"><span className={`text-[10px] font-semibold uppercase ${Number(tier.is_active) === 1 ? 'text-emerald-300' : 'text-amber-300'}`}>{Number(tier.is_active) === 1 ? 'Active' : 'Inactive'}</span><div className="flex gap-2"><button type="button" title={`Edit ${tier.name}`} onClick={() => setDraft({ ...tier, free_shipping: Number(tier.free_shipping) === 1, is_active: Number(tier.is_active) === 1 })} className="border border-slate-700 p-2 text-slate-300 hover:text-white"><Pencil size={14}/></button><button type="button" title={`Delete ${tier.name}`} onClick={() => remove(tier)} className="border border-slate-700 p-2 text-slate-300 hover:text-rose-300"><Trash2 size={14}/></button></div></div>
          </article>)}
        </div>
      )}
      <section className="max-w-2xl border-y border-slate-800 py-5">
        <div className="flex items-center justify-between gap-4"><div><h3 className="text-sm font-bold text-white">Customer journey preview</h3><p className="mt-1 text-xs text-slate-500">{preview.current?.name || 'No current tier'}{preview.next ? ` · ${preview.missing} points to ${preview.next.name}` : ' · Top tier reached'}</p></div><label className="text-xs text-slate-400">Points<input type="number" min="0" value={previewPoints} onChange={event => setPreviewPoints(Math.max(0, Number(event.target.value) || 0))} className="ml-2 w-24 border-b border-slate-700 bg-transparent px-1 py-1 text-white"/></label></div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full bg-emerald-400 transition-all" style={{ width: `${preview.progress}%` }}/></div>
        <div className="mt-2 flex justify-between text-[10px] text-slate-500"><span>{preview.current?.name || '—'}</span><span>{preview.next?.name || 'Top tier'}</span></div>
      </section>
      {draft && <div role="presentation" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"><form role="dialog" aria-modal="true" onSubmit={save} className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto border border-slate-700 bg-[#081b15] p-5 shadow-2xl sm:p-6"><div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-white">{draft.id ? `Edit ${draft.name}` : 'Create loyalty tier'}</h3><button type="button" aria-label="Close" onClick={() => setDraft(null)} className="text-slate-400"><X size={18}/></button></div><div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs text-slate-400">Tier name<input required maxLength="80" value={draft.name} onChange={event => setDraft(current => ({ ...current, name: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-[#10241f] px-3 py-2 text-sm text-white"/></label><label className="block text-xs text-slate-400">Lifetime points to qualify<input required min="0" step="1" type="number" value={draft.min_points} onChange={event => setDraft(current => ({ ...current, min_points: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-[#10241f] px-3 py-2 text-sm text-white"/></label><label className="block text-xs text-slate-400">Points multiplier<input required min="0.1" max="10" step="0.1" type="number" value={draft.points_multiplier} onChange={event => setDraft(current => ({ ...current, points_multiplier: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-[#10241f] px-3 py-2 text-sm text-white"/><span className="mt-1 block text-slate-500">Applied to the base points earned per eligible order spend.</span></label><label className="block text-xs text-slate-400">Stacked order discount (%)<input required min="0" max="25" step="0.1" type="number" value={draft.tier_discount_percent} onChange={event => setDraft(current => ({ ...current, tier_discount_percent: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-[#10241f] px-3 py-2 text-sm text-white"/><span className="mt-1 block text-slate-500">Applied after cart rules and coupon, capped at remaining merchandise value.</span></label><label className="block text-xs text-slate-400">Cashback issued as loyalty points (%)<input required min="0" max="25" step="0.1" type="number" value={draft.cashback_percent} onChange={event => setDraft(current => ({ ...current, cashback_percent: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-[#10241f] px-3 py-2 text-sm text-white"/></label><label className="block text-xs text-slate-400">Bonus points per confirmed order<input required min="0" max="1000000" step="1" type="number" value={draft.bonus_points} onChange={event => setDraft(current => ({ ...current, bonus_points: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-[#10241f] px-3 py-2 text-sm text-white"/></label><label className="block text-xs text-slate-400">Customer-facing benefit note<input maxLength="255" value={draft.benefits || ''} onChange={event => setDraft(current => ({ ...current, benefits: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-[#10241f] px-3 py-2 text-sm text-white"/></label><label className="block text-xs text-slate-400">Tier colour<input type="color" value={draft.color || '#34d399'} onChange={event => setDraft(current => ({ ...current, color: event.target.value }))} className="mt-2 block h-9 w-14 border-0 bg-transparent"/></label></div><label className="flex items-start gap-3 border border-white/10 p-3 text-sm text-white"><input type="checkbox" checked={Boolean(draft.free_shipping)} onChange={event => setDraft(current => ({ ...current, free_shipping: event.target.checked }))} className="mt-0.5 accent-emerald-400"/><span><strong>Free shipping at this tier</strong><span className="mt-1 block text-xs text-slate-400">Applies to standard/express shipping when the loyalty program is active.</span></span></label><label className="flex items-start gap-3 border border-white/10 p-3 text-sm text-white"><input type="checkbox" checked={Boolean(draft.is_active)} onChange={event => setDraft(current => ({ ...current, is_active: event.target.checked }))} className="mt-0.5 accent-emerald-400"/><span><strong>Tier active</strong><span className="mt-1 block text-xs text-slate-400">Inactive tiers do not qualify customers or provide checkout benefits.</span></span></label><button disabled={saving} type="submit" className="inline-flex items-center gap-2 bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"><Save size={15}/>{saving ? 'Saving…' : 'Save tier'}</button></form></div>}
    </div>
  );
}
