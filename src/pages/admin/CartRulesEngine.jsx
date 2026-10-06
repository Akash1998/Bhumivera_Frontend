import { useEffect, useState } from 'react';
import { cartRules as cartRulesApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Layers3, Plus, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';

const blankRule = { name: '', description: '', priority: 0, min_cart_value: 0, max_cart_value: '', start_time: '', end_time: '', enforce_min_checkout: 0, badge_text: '', status: 'active' };
const dateToIso = value => value ? new Date(value).toISOString() : null;

export default function CartRulesEngine() {
  const [rules, setRules] = useState([]);
  const [draft, setDraft] = useState(blankRule);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast() || {};

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await cartRulesApi.list();
      setRules(data?.data || []);
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not load cart rules.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async event => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...draft,
      priority: Number(draft.priority) || 0,
      min_cart_value: Number(draft.min_cart_value) || 0,
      max_cart_value: draft.max_cart_value === '' ? null : Number(draft.max_cart_value),
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
      <header className="flex items-end justify-between gap-4 border-b border-slate-800 pb-5"><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Cart policy</p><h2 className="mt-2 text-2xl font-black text-white">Cart Rules Engine</h2></div><button title="Refresh rules" onClick={load} className="rounded-lg border border-slate-700 p-2.5 text-slate-300 hover:border-emerald-500"><RefreshCw size={17}/></button></header>
      <form onSubmit={create} className="grid gap-4 border-y border-slate-800 py-5 md:grid-cols-4">
        <label className="text-xs text-slate-400">Rule name<input required value={draft.name} onChange={event => setDraft(current => ({ ...current, name: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"/></label>
        <label className="text-xs text-slate-400">Priority<input type="number" value={draft.priority} onChange={event => setDraft(current => ({ ...current, priority: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"/></label>
        <label className="text-xs text-slate-400">Minimum ₹<input min="0" required type="number" value={draft.min_cart_value} onChange={event => setDraft(current => ({ ...current, min_cart_value: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"/></label>
        <label className="text-xs text-slate-400">Maximum ₹<input min="0" type="number" value={draft.max_cart_value} onChange={event => setDraft(current => ({ ...current, max_cart_value: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"/></label>
        <label className="text-xs text-slate-400">Starts at<input type="datetime-local" value={draft.start_time} onChange={event => setDraft(current => ({ ...current, start_time: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"/></label>
        <label className="text-xs text-slate-400">Ends at<input type="datetime-local" value={draft.end_time} onChange={event => setDraft(current => ({ ...current, end_time: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"/></label>
        <label className="text-xs text-slate-400">Badge text<input value={draft.badge_text} onChange={event => setDraft(current => ({ ...current, badge_text: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"/></label>
        <label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={Boolean(Number(draft.enforce_min_checkout))} onChange={event => setDraft(current => ({ ...current, enforce_min_checkout: event.target.checked ? 1 : 0 }))} className="h-4 w-4 accent-emerald-400"/>Enforce minimum</label>
        <label className="text-xs text-slate-400 md:col-span-3">Description<input value={draft.description} onChange={event => setDraft(current => ({ ...current, description: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"/></label>
        <button disabled={saving} type="submit" className="inline-flex items-center justify-center gap-2 bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-50"><Plus size={15}/>Add rule</button>
      </form>
      <div className="overflow-x-auto border-y border-slate-800"><table className="w-full min-w-[700px] text-left text-sm"><thead className="text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="py-3">Rule</th><th>Range</th><th>Window</th><th>Enforced</th><th>Status</th><th>Actions</th></tr></thead><tbody>{loading ? <tr><td colSpan="6" className="py-8 text-center text-slate-500">Loading…</td></tr> : rules.map(rule => <tr key={rule.id} className="border-t border-slate-800"><td className="py-3 font-semibold text-white">{rule.name}<span className="ml-2 text-xs text-slate-500">P{rule.priority}</span></td><td>{rule.min_cart_value} – {rule.max_cart_value ?? '∞'}</td><td className="text-xs text-slate-400">{rule.start_time || 'Always'} → {rule.end_time || 'Open'}</td><td>{Number(rule.enforce_min_checkout) ? <ShieldCheck size={15} className="text-emerald-400"/> : '—'}</td><td><button onClick={() => toggle(rule)} className="text-xs text-emerald-300">{rule.status}</button></td><td><button aria-label={`Delete ${rule.name}`} onClick={() => remove(rule)} className="p-2 text-slate-500 hover:text-rose-300"><Trash2 size={15}/></button></td></tr>)}</tbody></table>{!loading && rules.length === 0 && <div className="py-8 text-center text-sm text-slate-500"><Layers3 className="mx-auto mb-2"/>No rules configured.</div>}</div>
    </div>
  );
}
