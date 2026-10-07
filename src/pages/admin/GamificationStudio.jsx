import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { settings as settingsApi } from '../../services/api';
import { ArrowUpRight, Flame, LoaderCircle, Save, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const HOOKS = [
  ['spin_after_purchase', 'Warranty reward spin'],
  ['abandoned_cart_email', 'Cart exit email capture'],
  ['seasonal_countdown', 'Seasonal sale countdown'],
];

export default function GamificationStudio() {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState('');
  const { showToast } = useToast() || {};

  useEffect(() => {
    let active = true;
    settingsApi.get().then(({ data }) => {
      if (active) setValues(data?.gamification || {});
    }).catch(error => {
      if (active) showToast?.(error.normalized?.message || 'Could not load gamification settings.', 'error');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [showToast]);

  const update = async (key, value) => {
    const previous = values[key];
    setValues(current => ({ ...current, [key]: String(value) }));
    setSavingKey(key);
    try {
      await settingsApi.update({ [key]: String(value) });
      showToast?.('Hook setting saved.', 'success');
    } catch (error) {
      setValues(current => ({ ...current, [key]: previous }));
      showToast?.(error.normalized?.message || 'Could not save hook setting.', 'error');
    } finally {
      setSavingKey('');
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <header className="border-b border-slate-800 pb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Promotion controls</p>
        <h2 className="mt-2 text-2xl font-black text-white">Gamification Studio</h2>
        <p className="mt-1 text-sm text-slate-500">Live storefront mechanics</p>
        <Link to="/spin-registration" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 px-3 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/10">
          Open spin experience <ArrowUpRight size={16}/>
        </Link>
      </header>
      {loading ? <p className="text-sm text-slate-400">Loading hook settings…</p> : (
        <div className="divide-y divide-slate-800 border-y border-slate-800">
          {HOOKS.map(([slug, label]) => {
            const enabledKey = `gamification_${slug}_enabled`;
            const enabled = values[enabledKey] === '1' || values[enabledKey] === 1;
            return (
              <section key={slug} className="grid gap-4 py-4 md:grid-cols-[minmax(0,1fr)_180px_minmax(180px,260px)] md:items-center">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300"><Sparkles size={17}/></span>
                  <div><h3 className="text-sm font-semibold text-white">{label}</h3><p className="mt-0.5 text-xs text-slate-500">{slug.replaceAll('_', ' ')}</p></div>
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-300">
                  <input type="checkbox" checked={enabled} disabled={savingKey === enabledKey} onChange={event => update(enabledKey, event.target.checked ? '1' : '0')} className="h-4 w-4 accent-emerald-400" />
                  {enabled ? 'Enabled' : 'Disabled'}
                </label>
                {slug === 'seasonal_countdown' ? (
                  <label className="text-xs text-slate-400">Countdown ends
                    <input type="datetime-local" value={values.seasonal_countdown_end_at || ''} disabled={savingKey === 'seasonal_countdown_end_at'} onChange={event => setValues(current => ({ ...current, seasonal_countdown_end_at: event.target.value }))} onBlur={event => update('seasonal_countdown_end_at', event.target.value)} className="mt-1 w-full border-b border-slate-700 bg-transparent px-1 py-2 text-sm text-white outline-none focus:border-emerald-400" />
                  </label>
                ) : <span className="text-xs text-slate-500">{savingKey === enabledKey ? <LoaderCircle size={14} className="animate-spin"/> : 'Connected to the storefront'}</span>}
              </section>
            );
          })}
        </div>
      )}
      <p className="flex items-center gap-2 text-xs text-slate-500"><Flame size={14}/> Changes are saved immediately.</p>
    </div>
  );
}
