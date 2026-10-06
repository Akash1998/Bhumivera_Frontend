import { useEffect, useState } from 'react';
import { settings as settingsApi } from '../../services/api';
import { Save, SlidersHorizontal } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const DEFAULTS = {
  personalization_related_weight: '50',
  personalization_popular_weight: '30',
  personalization_recent_weight: '20',
  personalization_welcome_name_enabled: '1',
  personalization_recently_viewed_limit: '8',
};

const WEIGHTS = [
  ['personalization_related_weight', 'Related products'],
  ['personalization_popular_weight', 'Popular products'],
  ['personalization_recent_weight', 'Recently viewed'],
];

export default function PersonalizationCenter() {
  const [values, setValues] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast() || {};

  useEffect(() => {
    let active = true;
    settingsApi.get().then(({ data }) => {
      if (active) setValues(current => ({ ...current, ...(data?.personalization || {}) }));
    }).catch(error => {
      if (active) showToast?.(error.normalized?.message || 'Could not load personalization settings.', 'error');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [showToast]);

  const save = async event => {
    event.preventDefault();
    const normalizedWeights = WEIGHTS.map(([key]) => Math.max(0, Number(values[key]) || 0));
    const total = normalizedWeights.reduce((sum, value) => sum + value, 0);
    if (total <= 0) return showToast?.('At least one recommendation weight must be above zero.', 'error');
    const payload = { ...values };
    WEIGHTS.forEach(([key], index) => { payload[key] = String(Math.round(normalizedWeights[index] * 100 / total)); });
    setSaving(true);
    try {
      await settingsApi.update(payload);
      setValues(payload);
      showToast?.('Personalization settings saved.', 'success');
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not save personalization settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="max-w-3xl space-y-6 text-slate-100">
      <header className="border-b border-slate-800 pb-5"><p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Promotion controls</p><h2 className="mt-2 text-2xl font-black text-white">Personalization Center</h2></header>
      {loading ? <p className="text-sm text-slate-400">Loading settings…</p> : <>
        <section className="space-y-6 border-y border-slate-800 py-6">
          {WEIGHTS.map(([key, label]) => <label key={key} className="block text-sm font-semibold text-white">{label}<span className="float-right font-mono text-emerald-300">{values[key]}%</span><input type="range" min="0" max="100" value={values[key]} onChange={event => setValues(current => ({ ...current, [key]: event.target.value }))} className="mt-3 w-full accent-emerald-400"/></label>)}
          <p className="text-xs text-slate-500">Weights are normalized to 100% when saved.</p>
        </section>
        <label className="flex items-center justify-between gap-4 border-b border-slate-800 py-4 text-sm text-slate-200">Personalized welcome name<input type="checkbox" checked={values.personalization_welcome_name_enabled === '1' || values.personalization_welcome_name_enabled === 1} onChange={event => setValues(current => ({ ...current, personalization_welcome_name_enabled: event.target.checked ? '1' : '0' }))} className="h-4 w-4 accent-emerald-400"/></label>
        <label className="block max-w-xs text-sm text-slate-300">Recently viewed items<input type="number" min="1" max="50" value={values.personalization_recently_viewed_limit} onChange={event => setValues(current => ({ ...current, personalization_recently_viewed_limit: event.target.value }))} className="mt-2 w-full border-b border-slate-700 bg-transparent px-1 py-2 text-white outline-none focus:border-emerald-400"/></label>
        <div className="border-t border-slate-800 pt-5"><button disabled={saving} type="submit" className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-50"><Save size={16}/>{saving ? 'Saving…' : 'Save personalization'}</button></div>
      </>}
      <p className="flex items-center gap-2 text-xs text-slate-500"><SlidersHorizontal size={14}/>Recommendation weights are normalized when saved.</p>
    </form>
  );
}
