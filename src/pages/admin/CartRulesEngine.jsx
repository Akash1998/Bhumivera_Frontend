import { useCallback, useEffect, useState } from 'react';
import { cartRules as cartRulesApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Layers3, Plus, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';

const blankRule = { name: '', description: '', priority: 0, min_cart_value: 0, max_cart_value: '', discount_amount: 0, discount_percent: 0, free_shipping_enabled: 0, gift_product_id: '', gift_quantity: 1, loyalty_bonus_points: 0, loyalty_tier_id: '', start_time: '', end_time: '', enforce_min_checkout: 0, badge_text: '', status: 'active' };
const dateToIso = value => value ? new Date(value).toISOString() : null;

export default function CartRulesEngine() {
  const [rules, setRules] = useState([]);
  const [loyaltyTiers, setLoyaltyTiers] = useState([]);
  const [draft, setDraft] = useState(blankRule);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast() || {};

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rulesResponse, tiersResponse] = await Promise.all([
        cartRulesApi.list(),
        cartRulesApi.getLoyaltyTiers(),
      ]);
      setRules(rulesResponse.data?.data || []);
      setLoyaltyTiers(tiersResponse.data?.data || []);
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not load cart rules.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const create = async event => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...draft,
      priority: Number(draft.priority) || 0,
      min_cart_value: Number(draft.min_cart_value) || 0,
      max_cart_value: draft.max_cart_value === '' ? null : Number(draft.max_cart_value),
      discount_amount: Math.max(0, Number(draft.discount_amount) || 0),
      discount_percent: Math.max(0, Math.min(100, Number(draft.discount_percent) || 0)),
      free_shipping_enabled: draft.free_shipping_enabled ? 1 : 0,
      gift_product_id: draft.gift_product_id === '' ? null : Number(draft.gift_product_id),
      gift_quantity: Math.max(1, Number(draft.gift_quantity) || 1),
      loyalty_bonus_points: Math.max(0, Number(draft.loyalty_bonus_points) || 0),
      loyalty_tier_id: draft.loyalty_tier_id === '' ? null : Number(draft.loyalty_tier_id),
      enforce_min_checkout: draft.enforce_min_checkout ? 1 : 0,
      start_time: dateToIso(draft.start_time),
      end_time: dateToIso(draft.end_time),
    };
    try {
      await cartRulesApi.create(payload);
      setDraft(blankRule);
      showToast?.('Cart rule created.', 'success');
      await load();
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not create cart rule.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggle = async rule => {
    try {
      await cartRulesApi.toggle(rule.id, rule.status === 'active' ? 'inactive' : 'active');
      await load();
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not change rule status.', 'error');
    }
  };

  const remove = async rule => {
    if (!window.confirm(`Delete ${rule.name}?`)) return;
    try {
      await cartRulesApi.remove(rule.id);
      await load();
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not delete rule.', 'error');
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <header className="flex items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div><p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Cart policy</p><h2 className="mt-2 text-2xl font-semibold text-white">Cart rules</h2></div>
        <button title="Refresh rules" onClick={load} className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 backdrop-blur-lg transition hover:border-emerald-400/50 hover:bg-white/10"><RefreshCw size={17}/></button>
      </header>
      <form onSubmit={create} className="admin-glass-panel grid gap-4 rounded-2xl p-5 md:grid-cols-4">
        <label className="text-xs text-slate-300">Rule name<input required value={draft.name} onChange={event => setDraft(current => ({ ...current, name: event.target.value }))} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"/></label>
        <label className="text-xs text-slate-300">Priority<input type="number" value={draft.priority} onChange={event => setDraft(current => ({ ...current, priority: event.target.value }))} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"/></label>
        <label className="text-xs text-slate-300">Minimum ₹<input min="0" required type="number" value={draft.min_cart_value} onChange={event => setDraft(current => ({ ...current, min_cart_value: event.target.value }))} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"/></label>
        <label className="text-xs text-slate-300">Maximum ₹<input min="0" type="number" value={draft.max_cart_value} onChange={event => setDraft(current => ({ ...current, max_cart_value: event.target.value }))} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"/></label>
        <label className="text-xs text-slate-300">Discount ₹<input min="0" type="number" value={draft.discount_amount} onChange={event => setDraft(current => ({ ...current, discount_amount: event.target.value }))} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"/></label>
        <label className="text-xs text-slate-300">Discount %<input min="0" max="100" type="number" value={draft.discount_percent} onChange={event => setDraft(current => ({ ...current, discount_percent: event.target.value }))} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"/></label>
        <label className="text-xs text-slate-300">Member tier
          <select value={draft.loyalty_tier_id} onChange={event => setDraft(current => ({ ...current, loyalty_tier_id: event.target.value }))} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm">
            <option value="">All members</option>{loyaltyTiers.map(tier => <option key={tier.id} value={tier.id}>{tier.name}</option>)}
          </select>
        </label>
        <label className="text-xs text-slate-300">Gift product ID<input min="1" type="number" value={draft.gift_product_id} onChange={event => setDraft(current => ({ ...current, gift_product_id: event.target.value }))} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"/></label>
        <label className="text-xs text-slate-300">Gift quantity<input min="1" type="number" value={draft.gift_quantity} onChange={event => setDraft(current => ({ ...current, gift_quantity: event.target.value }))} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"/></label>
        <label className="text-xs text-slate-300">Bonus loyalty points<input min="0" type="number" value={draft.loyalty_bonus_points} onChange={event => setDraft(current => ({ ...current, loyalty_bonus_points: event.target.value }))} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"/></label>
        <label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={Boolean(Number(draft.free_shipping_enabled))} onChange={event => setDraft(current => ({ ...current, free_shipping_enabled: event.target.checked ? 1 : 0 }))} className="h-4 w-4 accent-emerald-400"/>Free shipping</label>
        <label className="text-xs text-slate-300">Starts at<input type="datetime-local" value={draft.start_time} onChange={event => setDraft(current => ({ ...current, start_time: event.target.value }))} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"/></label>
        <label className="text-xs text-slate-300">Ends at<input type="datetime-local" value={draft.end_time} onChange={event => setDraft(current => ({ ...current, end_time: event.target.value }))} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"/></label>
        <label className="text-xs text-slate-300">Badge text<input value={draft.badge_text} onChange={event => setDraft(current => ({ ...current, badge_text: event.target.value }))} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"/></label>
        <label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={Boolean(Number(draft.enforce_min_checkout))} onChange={event => setDraft(current => ({ ...current, enforce_min_checkout: event.target.checked ? 1 : 0 }))} className="h-4 w-4 accent-emerald-400"/>Enforce minimum</label>
        <label className="text-xs text-slate-300 md:col-span-3">Description<input value={draft.description} onChange={event => setDraft(current => ({ ...current, description: event.target.value }))} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"/></label>
        <button disabled={saving} type="submit" className="inline-flex items-center justify-center gap-2 self-end rounded-lg bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-50"><Plus size={15}/>Add rule</button>
      </form>
      <div className="admin-glass-panel overflow-hidden rounded-2xl">
        <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-white/[0.035] text-[10px] uppercase tracking-wider text-slate-400"><tr><th className="px-4 py-3">Rule</th><th>Range</th><th>Reward / Tier</th><th>Window</th><th>Enforced</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody className="divide-y divide-white/10">{loading ? <tr><td colSpan="7" className="py-8 text-center text-slate-400">Loading…</td></tr> : rules.map(rule => <tr key={rule.id} className="transition-colors hover:bg-white/[0.035]"><td className="px-4 py-3 font-semibold text-white">{rule.name}<span className="ml-2 text-xs text-slate-500">P{rule.priority}</span></td><td>{rule.min_cart_value} – {rule.max_cart_value ?? '∞'}</td><td className="text-xs text-slate-300">{rule.loyalty_tier_name || 'All members'} · {Number(rule.discount_percent) || 0}% · ₹{Number(rule.discount_amount) || 0}{rule.gift_product_name ? ` · Gift: ${rule.gift_product_name}` : ''}{Number(rule.free_shipping_enabled) ? ' · Free delivery' : ''}</td><td className="text-xs text-slate-400">{rule.start_time || 'Always'} → {rule.end_time || 'Open'}</td><td>{Number(rule.enforce_min_checkout) ? <ShieldCheck size={15} className="text-emerald-400"/> : '—'}</td><td><button onClick={() => toggle(rule)} className="text-xs text-emerald-300">{rule.status}</button></td><td><button aria-label={`Delete ${rule.name}`} onClick={() => remove(rule)} className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-400/10 hover:text-rose-300"><Trash2 size={15}/></button></td></tr>)}</tbody>
        </table></div>
        {!loading && rules.length === 0 && <div className="py-8 text-center text-sm text-slate-400"><Layers3 className="mx-auto mb-2"/>No rules configured.</div>}
      </div>
    </div>
  );
}
