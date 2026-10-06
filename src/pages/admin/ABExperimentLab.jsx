import { useEffect, useState } from 'react';
import { settings as settingsApi } from '../../services/api';
import { FlaskConical, Plus, Trophy } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const emptyExperiment = { name: '', audience: 'all_customers', control: '', variant: '' };

export default function ABExperimentLab() {
  const [experiments, setExperiments] = useState([]);
  const [draft, setDraft] = useState(emptyExperiment);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast() || {};

  useEffect(() => {
    let active = true;
    settingsApi.get().then(({ data }) => {
      if (!active) return;
      try { setExperiments(JSON.parse(data?.experiments?.experiment_registry || '[]')); }
      catch { setExperiments([]); }
    }).catch(error => {
      if (active) showToast?.(error.normalized?.message || 'Could not load experiments.', 'error');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [showToast]);

  const persist = async next => {
    setSaving(true);
    try {
      await settingsApi.update({ experiment_registry: JSON.stringify(next) });
      setExperiments(next);
      showToast?.('Experiment registry saved.', 'success');
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not save experiments.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const create = event => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.control.trim() || !draft.variant.trim()) return;
    const experiment = { ...draft, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, status: 'running', winner: null, createdAt: new Date().toISOString() };
    setDraft(emptyExperiment);
    void persist([...experiments, experiment]);
  };

  const update = (id, changes) => persist(experiments.map(experiment => experiment.id === id ? { ...experiment, ...changes } : experiment));

  return (
    <div className="space-y-6 text-slate-100">
      <header className="border-b border-slate-800 pb-5"><p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Promotion controls</p><h2 className="mt-2 text-2xl font-black text-white">A/B Experiment Lab</h2></header>
      <form onSubmit={create} className="grid gap-3 border-y border-slate-800 py-5 md:grid-cols-2">
        <input required aria-label="Experiment name" placeholder="Experiment name" value={draft.name} onChange={event => setDraft(current => ({ ...current, name: event.target.value }))} className="border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"/>
        <select aria-label="Audience" value={draft.audience} onChange={event => setDraft(current => ({ ...current, audience: event.target.value }))} className="border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"><option value="all_customers">All customers</option><option value="new_customers">New customers</option><option value="returning_customers">Returning customers</option><option value="vip">VIP customers</option></select>
        <input required aria-label="Control variant" placeholder="Control variant" value={draft.control} onChange={event => setDraft(current => ({ ...current, control: event.target.value }))} className="border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"/>
        <input required aria-label="Test variant" placeholder="Test variant" value={draft.variant} onChange={event => setDraft(current => ({ ...current, variant: event.target.value }))} className="border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"/>
        <button disabled={saving} type="submit" className="inline-flex items-center justify-center gap-2 bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-50 md:col-span-2"><Plus size={16}/>Create experiment</button>
      </form>
      {loading ? <p className="text-sm text-slate-400">Loading experiment registry…</p> : experiments.length === 0 ? <p className="py-8 text-sm text-slate-500">No experiments yet.</p> : (
        <div className="divide-y divide-slate-800 border-y border-slate-800">
          {experiments.map(experiment => <article key={experiment.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div><h3 className="font-semibold text-white">{experiment.name}</h3><p className="mt-1 text-xs text-slate-500">{experiment.audience} · Control: {experiment.control} · Variant: {experiment.variant}</p><p className="mt-1 text-xs text-slate-400">{experiment.status}{experiment.winner ? ` · Winner: ${experiment.winner}` : ''}</p></div>
            <div className="flex flex-wrap gap-2">
              <button disabled={saving || experiment.status === 'concluded'} onClick={() => update(experiment.id, { status: experiment.status === 'paused' ? 'running' : 'paused' })} className="border border-slate-700 px-3 py-2 text-xs text-slate-300 disabled:opacity-40">{experiment.status === 'paused' ? 'Resume' : 'Pause'}</button>
              <button disabled={saving || experiment.status === 'concluded'} onClick={() => update(experiment.id, { status: 'concluded' })} className="border border-slate-700 px-3 py-2 text-xs text-slate-300 disabled:opacity-40">Conclude</button>
              <button disabled={saving || experiment.status === 'concluded'} onClick={() => update(experiment.id, { winner: experiment.variant, status: 'concluded' })} className="inline-flex items-center gap-1 border border-amber-500/30 px-3 py-2 text-xs text-amber-200 disabled:opacity-40"><Trophy size={13}/>Variant wins</button>
            </div>
          </article>)}
        </div>
      )}
      <p className="flex items-center gap-2 text-xs text-slate-500"><FlaskConical size={14}/>Experiment records persist in the settings registry.</p>
    </div>
  );
}
