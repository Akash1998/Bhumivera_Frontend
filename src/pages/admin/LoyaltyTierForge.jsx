import { useEffect, useMemo, useState } from 'react';
import { loyaltyTiers as loyaltyTiersApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Award, Pencil, Plus, Save, Trash2, X } from 'lucide-react';

const emptyTier = { name: '', min_points: 0, benefits: '', color: '' };

export default function LoyaltyTierForge() {
  const [tiers, setTiers] = useState([]);
  const [draft, setDraft] = useState(null);
  const [previewPoints, setPreviewPoints] = useState(750);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast() || {};

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await loyaltyTiersApi.list();
      setTiers(data?.data || []);
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not load loyalty tiers.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const preview = useMemo(() => {
    const ordered = [...tiers].sort((a, b) => Number(a.min_points) - Number(b.min_points));
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
      const payload = { ...draft, min_points: Math.max(0, Math.trunc(Number(draft.min_points) || 0)) };
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
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-5"><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Loyalty controls</p><h2 className="mt-2 text-2xl font-black text-white">Loyalty Tier Forge</h2></div><button onClick={() => setDraft({ ...emptyTier })} className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950"><Plus size={16}/>New tier</button></header>
      {loading ? <p className="text-sm text-slate-400">Loading tiers…</p> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tiers.map(tier => <article key={tier.id} className="border-y border-slate-800 py-4">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm font-bold text-white"><Award size={16} style={{ color: tier.color || '#34d399' }}/>{tier.name}</span><span className="font-mono text-xs text-emerald-300">{Number(tier.min_points).toLocaleString()} pts</span></div>
            <p className="mt-3 min-h-10 text-xs text-slate-400">{tier.benefits || 'No benefits configured.'}</p>
            <div className="mt-3 flex gap-2"><button title={`Edit ${tier.name}`} onClick={() => setDraft({ ...tier })} className="rounded border border-slate-700 p-2 text-slate-300 hover:text-white"><Pencil size={14}/></button><button title={`Delete ${tier.name}`} onClick={() => remove(tier)} className="rounded border border-slate-700 p-2 text-slate-300 hover:text-rose-300"><Trash2 size={14}/></button></div>
          </article>)}
        </div>
      )}
      <section className="max-w-2xl border-y border-slate-800 py-5">
        <div className="flex items-center justify-between gap-4"><div><h3 className="text-sm font-bold text-white">Customer journey preview</h3><p className="mt-1 text-xs text-slate-500">{preview.current?.name || 'No current tier'}{preview.next ? ` · ${preview.missing} points to ${preview.next.name}` : ' · Top tier reached'}</p></div><label className="text-xs text-slate-400">Points<input type="number" min="0" value={previewPoints} onChange={event => setPreviewPoints(Math.max(0, Number(event.target.value) || 0))} className="ml-2 w-24 border-b border-slate-700 bg-transparent px-1 py-1 text-white"/></label></div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full bg-emerald-400 transition-all" style={{ width: `${preview.progress}%` }}/></div>
        <div className="mt-2 flex justify-between text-[10px] text-slate-500"><span>{preview.current?.name || '—'}</span><span>{preview.next?.name || 'Top tier'}</span></div>
      </section>
      {draft && <div role="dialog" aria-modal="true" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"><form onSubmit={save} className="w-full max-w-lg space-y-4 border border-slate-700 bg-slate-950 p-6"><div className="flex items-center justify-between"><h3 className="text-lg font-bold text-white">{draft.id ? 'Edit tier' : 'Create tier'}</h3><button type="button" aria-label="Close" onClick={() => setDraft(null)} className="text-slate-400"><X size={18}/></button></div><label className="block text-xs text-slate-400">Name<input required value={draft.name} onChange={event => setDraft(current => ({ ...current, name: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-white"/></label><label className="block text-xs text-slate-400">Minimum points<input required min="0" type="number" value={draft.min_points} onChange={event => setDraft(current => ({ ...current, min_points: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-white"/></label><label className="block text-xs text-slate-400">Benefits<input value={draft.benefits || ''} onChange={event => setDraft(current => ({ ...current, benefits: event.target.value }))} className="mt-1 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-white"/></label><label className="block text-xs text-slate-400">Color<input type="color" value={draft.color || '#34d399'} onChange={event => setDraft(current => ({ ...current, color: event.target.value }))} className="mt-2 h-9 w-14 border-0 bg-transparent"/></label><button disabled={saving} type="submit" className="inline-flex items-center gap-2 bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-50"><Save size={15}/>{saving ? 'Saving…' : 'Save tier'}</button></form></div>}
    </div>
  );
}
