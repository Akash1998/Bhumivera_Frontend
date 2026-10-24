import React, { useEffect, useMemo, useState } from 'react';
import { Activity, AlertCircle, CheckCircle2, FlaskConical, Pause, Play, RefreshCw, Save } from 'lucide-react';
import { products as productsApi, scarcitySimulator } from '../../services/api';
import ScarcitySimulationBadge from '../../components/ScarcitySimulationBadge';

const DEFAULT_PRODUCT_CONFIG = {
  enabled: true,
  paused: false,
  outOfStock: false,
  dailyCap: 250,
  minDailySold: 200,
  maxDailySold: 250,
  lifetimeSold: 20000,
};

const getRows = response => {
  const data = response?.data?.data || response?.data?.products || response?.data || [];
  return Array.isArray(data) ? data : [];
};

const chunksOf = (items, size) => {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

export default function ScarcitySimulator() {
  const [products, setProducts] = useState([]);
  const [config, setConfig] = useState({ enabled: true, sampleActivityEnabled: false, products: {} });
  const [snapshots, setSnapshots] = useState({});
  const [dayKey, setDayKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setError('');
    setSaved(false);
    try {
      const [productsResponse, configResponse] = await Promise.all([
        productsApi.getAllAdmin(),
        scarcitySimulator.getAdmin(),
      ]);
      const rows = getRows(productsResponse).filter(product => product?.id != null);
      const initial = configResponse.data?.config;
      if (!initial?.products || typeof initial.products !== 'object') {
        throw new Error('Simulator settings returned an invalid configuration.');
      }

      const snapshotResults = await Promise.all(
        chunksOf(rows.map(product => String(product.id)), 100)
          .map(ids => scarcitySimulator.getPublic(ids))
      );
      const mergedSnapshots = Object.assign({}, ...snapshotResults.map(result => result.data?.products || {}));
      const configuredProducts = {};
      for (const product of rows) {
        const id = String(product.id);
        const existing = initial.products[id];
        const snapshot = mergedSnapshots[id];
        configuredProducts[id] = existing
          ? { ...DEFAULT_PRODUCT_CONFIG, ...existing }
          : {
              ...DEFAULT_PRODUCT_CONFIG,
              lifetimeSold: Math.max(
                0,
                Number(snapshot?.lifetimeSold || DEFAULT_PRODUCT_CONFIG.lifetimeSold) - Number(snapshot?.soldToday || 0)
              ),
            };
      }
      setProducts(rows);
      setSnapshots(mergedSnapshots);
      setConfig({
        enabled: initial.enabled !== false,
        sampleActivityEnabled: initial.sampleActivityEnabled === true,
        products: configuredProducts,
      });
      setDayKey(initial.dayKey || '');
    } catch (loadError) {
      console.error('[SCARCITY_SIMULATOR_ADMIN_LOAD]', loadError);
      setError(loadError.response?.data?.message || loadError.message || 'Could not load simulator controls.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const summary = useMemo(() => {
    const values = Object.values(config.products);
    return {
      enabled: values.filter(item => item.enabled && !item.paused && !item.outOfStock).length,
      paused: values.filter(item => item.paused).length,
      outOfStock: values.filter(item => item.outOfStock).length,
    };
  }, [config.products]);

  const updateProduct = (id, patch) => {
    setSaved(false);
    setConfig(current => ({
      ...current,
      products: {
        ...current.products,
        [id]: { ...current.products[id], ...patch },
      },
    }));
  };

  const save = async event => {
    event.preventDefault();
    if (products.length === 0) {
      setError('Load the product catalog before saving simulator settings.');
      return;
    }
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const { data } = await scarcitySimulator.save(config);
      if (!data?.config) throw new Error('Simulator settings were not confirmed by the server.');
      setSaved(true);
    } catch (saveError) {
      console.error('[SCARCITY_SIMULATOR_ADMIN_SAVE]', saveError);
      setError(saveError.response?.data?.message || saveError.message || 'Could not save simulator controls.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[45vh] flex-col items-center justify-center gap-3 text-slate-400">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-400/20 border-t-emerald-400" />
        <p className="text-xs font-bold uppercase tracking-widest">Loading simulator controls</p>
      </div>
    );
  }

  return (
    <form onSubmit={save} className="space-y-6 text-slate-200">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-amber-300">
            <FlaskConical size={19} aria-hidden="true" />
            <p className="text-[10px] font-black uppercase tracking-[0.18em]">Promotional visualization only</p>
          </div>
          <h2 className="mt-2 text-2xl font-black text-white">Scarcity Simulator</h2>
          <p className="mt-1 text-sm text-slate-400">
            Daily visual stock and counters are separate from real inventory, checkout, and order reporting.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={refresh}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-bold hover:border-amber-300/50"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            type="submit"
            disabled={saving || products.length === 0}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-400 px-4 text-xs font-black uppercase tracking-wider text-emerald-950 disabled:opacity-50"
          >
            <Save size={14} /> {saving ? 'Saving…' : 'Save simulator'}
          </button>
        </div>
      </header>

      <div className="flex items-start gap-3 rounded-xl border border-amber-300/40 bg-amber-950/35 p-4 text-sm text-amber-100">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-300" aria-hidden="true" />
        <p>
          Storefront counters must remain visibly labeled as simulated. These settings never update{' '}
          <code className="rounded bg-black/25 px-1">products.quantity</code>, order records, or actual checkout availability.
          The display resets daily at 00:00 Asia/Kolkata.
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-rose-400/30 bg-rose-950/30 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}
      {saved && (
        <div role="status" className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200">
          <CheckCircle2 size={16} /> Simulator saved. Actual inventory and orders are unchanged.
        </div>
      )}

      <section className="grid gap-3 sm:grid-cols-4">
        {[
          ['Status', config.enabled ? 'Enabled' : 'Paused'],
          ['Products shown', summary.enabled],
          ['Paused simulations', summary.paused],
          ['Simulated sold out', summary.outOfStock],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-black text-white">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <span>
            <span className="block text-sm font-bold text-white">Enable simulator visuals</span>
            <span className="mt-1 block text-xs text-slate-400">Hide or show the labeled illustration across the storefront.</span>
          </span>
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={event => setConfig(current => ({ ...current, enabled: event.target.checked }))}
            className="h-5 w-5 accent-emerald-400"
          />
        </label>
        <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <span>
            <span className="block text-sm font-bold text-white">Show sample activity</span>
            <span className="mt-1 block text-xs text-slate-400">Use only explicit sample scenarios; never real customer names or orders.</span>
          </span>
          <input
            type="checkbox"
            checked={config.sampleActivityEnabled}
            onChange={event => setConfig(current => ({ ...current, sampleActivityEnabled: event.target.checked }))}
            className="h-5 w-5 accent-emerald-400"
          />
        </label>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#071a12]/80">
        <div className="flex flex-col gap-1 border-b border-white/10 px-4 py-4 sm:px-5">
          <h3 className="font-bold text-white">Per-product visual controls</h3>
          <p className="text-xs text-slate-400">
            Daily capacity can be set from 0 to 250. The default illustrative daily progression is 200–250 units.
            Current simulator day: {dayKey || 'loading'} (Asia/Kolkata).
          </p>
        </div>
        {products.length === 0 ? (
          <p className="p-5 text-sm text-slate-400">No products are available to configure.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {products.map(product => {
              const id = String(product.id);
              const item = config.products[id] || DEFAULT_PRODUCT_CONFIG;
              const snapshot = snapshots[id];
              const previewSoldToday = item.paused || item.outOfStock
                ? 0
                : Math.min(item.dailyCap, Number(snapshot?.soldToday) || 0);
              const previewSnapshot = snapshot ? {
                ...snapshot,
                enabled: config.enabled && item.enabled,
                paused: item.paused,
                outOfStock: item.outOfStock,
                dailyCap: item.dailyCap,
                remaining: item.outOfStock ? 0 : Math.max(0, item.dailyCap - previewSoldToday),
                lifetimeSold: item.lifetimeSold + previewSoldToday,
              } : null;
              return (
                <article key={id} className="grid gap-4 p-4 sm:p-5 xl:grid-cols-[minmax(180px,1.4fr)_repeat(3,minmax(100px,0.65fr))_minmax(190px,1.2fr)] xl:items-center">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{product.name}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                      {product.sku || `Product ${id}`} · Actual inventory is not modified
                    </p>
                    {previewSnapshot && (
                      <p className="mt-1 text-xs text-amber-200">
                        Preview: {previewSnapshot.remaining}/{previewSnapshot.dailyCap} Today's units remaining
                      </p>
                    )}
                  </div>
                  <label className="text-xs text-slate-400">
                    Visual cap / day
                    <input
                      type="number"
                      min="0"
                      max="250"
                      value={item.dailyCap}
                      onChange={event => {
                        const dailyCap = Math.max(0, Math.min(250, Number(event.target.value) || 0));
                        const minimumSales = Math.min(200, dailyCap);
                        const minDailySold = Math.max(minimumSales, Math.min(item.minDailySold, dailyCap));
                        updateProduct(id, {
                          dailyCap,
                          minDailySold,
                          maxDailySold: Math.min(Math.max(minDailySold, item.maxDailySold), dailyCap),
                        });
                      }}
                      className="mt-1 block w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <label className="text-xs text-slate-400">
                    Daily sold min
                    <input
                      type="number"
                      min={Math.min(200, item.dailyCap)}
                      max={item.dailyCap}
                      value={item.minDailySold}
                      onChange={event => {
                        const minDailySold = Math.max(
                          Math.min(200, item.dailyCap),
                          Math.min(item.dailyCap, Number(event.target.value) || 0)
                        );
                        updateProduct(id, {
                          minDailySold,
                          maxDailySold: Math.max(minDailySold, item.maxDailySold),
                        });
                      }}
                      className="mt-1 block w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <label className="text-xs text-slate-400">
                    Daily sold max
                    <input
                      type="number"
                      min={item.minDailySold}
                      max={item.dailyCap}
                      value={item.maxDailySold}
                      onChange={event => updateProduct(id, {
                        maxDailySold: Math.max(item.minDailySold, Math.min(item.dailyCap, Number(event.target.value) || 0)),
                      })}
                      className="mt-1 block w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/10 px-2.5 text-xs">
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={event => updateProduct(id, { enabled: event.target.checked })}
                        className="accent-emerald-400"
                      />
                      Show
                    </label>
                    <button
                      type="button"
                      aria-pressed={item.paused}
                      onClick={() => updateProduct(id, { paused: !item.paused })}
                      className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs ${item.paused ? 'border-amber-300/50 text-amber-200' : 'border-white/10 text-slate-300'}`}
                    >
                      {item.paused ? <Play size={13} /> : <Pause size={13} />}
                      {item.paused ? 'Resume' : 'Pause'}
                    </button>
                    <label className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/10 px-2.5 text-xs">
                      <input
                        type="checkbox"
                        checked={item.outOfStock}
                        onChange={event => updateProduct(id, { outOfStock: event.target.checked })}
                        className="accent-rose-400"
                      />
                      Show as sold out
                    </label>
                  </div>
                  {previewSnapshot && (
                    <div className="xl:col-span-full">
                      <ScarcitySimulationBadge
                        snapshot={previewSnapshot}
                        productName={product.name}
                        sampleActivityEnabled={config.sampleActivityEnabled}
                        compact
                      />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <div className="flex justify-end border-t border-white/10 pt-4">
        <button
          type="submit"
          disabled={saving || products.length === 0}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-400 px-5 text-xs font-black uppercase tracking-wider text-emerald-950 disabled:opacity-50"
        >
          <Save size={15} /> {saving ? 'Saving…' : 'Save simulator settings'}
        </button>
      </div>
    </form>
  );
}
