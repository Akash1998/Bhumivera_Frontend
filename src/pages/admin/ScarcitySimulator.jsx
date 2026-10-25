import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  FlaskConical,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
} from 'lucide-react';
import { products as productsApi, scarcitySimulator } from '../../services/api';
import ScarcitySimulationBadge from '../../components/ScarcitySimulationBadge';
import { BHUMIVERA_6_PRODUCTS } from '../../data/bhumiveraUniqueData';

const DEFAULT_PRODUCT_CONFIG = {
  enabled: true,
  paused: false,
  outOfStock: false,
  dailyCap: 250,
  minDailySold: 0,
  maxDailySold: 250,
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

const getIstClock = () => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  const timeStr = formatter.format(now);
  const shifted = new Date(now.getTime() + 330 * 60 * 1000);
  const istHours = shifted.getUTCHours();
  const istMinutes = shifted.getUTCMinutes();
  const totalMinutes = istHours * 60 + istMinutes;
  const isDecreasing = totalMinutes < 12 * 60; // 00:00 to 12:00 Asia/Kolkata
  const progressPct = Math.min(100, Math.round((totalMinutes / (12 * 60)) * 100));

  return {
    timeStr,
    isDecreasing,
    progressPct: isDecreasing ? progressPct : 100,
    phaseText: isDecreasing
      ? `Decreasing Phase (00:00 – 12:00 Asia/Kolkata) · Progress: ${progressPct}% of daily run completed`
      : `Holding Steady (12:00 – 00:00 Asia/Kolkata) · Units remain steady until reset at 00:00 midnight`,
  };
};

export default function ScarcitySimulator() {
  const [products, setProducts] = useState([]);
  const [config, setConfig] = useState({ enabled: true, sampleActivityEnabled: false, products: {} });
  const [snapshots, setSnapshots] = useState({});
  const [dayKey, setDayKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [snapshotError, setSnapshotError] = useState('');
  const [saved, setSaved] = useState(false);

  // Search & Filter controls
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, paused, outOfStock

  // IST Clock
  const [clock, setClock] = useState(getIstClock());

  useEffect(() => {
    const clockTimer = window.setInterval(() => {
      setClock(getIstClock());
    }, 1000);
    return () => window.clearInterval(clockTimer);
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError('');
    setSaved(false);
    try {
      let rows = [];
      try {
        const productsResponse = await productsApi.getAllAdmin();
        rows = getRows(productsResponse).filter(product => product?.id != null);
      } catch (prodErr) {
        console.warn('[SCARCITY_SIMULATOR] productsApi.getAllAdmin fallback', prodErr);
      }
      if (rows.length === 0) {
        rows = BHUMIVERA_6_PRODUCTS || [];
      }

      let initial = { enabled: true, sampleActivityEnabled: false, products: {} };
      try {
        const configResponse = await scarcitySimulator.getAdmin();
        if (configResponse.data?.config) {
          initial = configResponse.data.config;
        }
      } catch (cfgErr) {
        console.warn('[SCARCITY_SIMULATOR] scarcitySimulator.getAdmin fallback', cfgErr);
      }

      const snapshotResults = await Promise.all(
        chunksOf(rows.map(product => String(product.id)), 100)
          .map(ids => scarcitySimulator.getPublic(ids).catch(() => ({ data: { products: {} } })))
      );
      const mergedSnapshots = Object.assign({}, ...snapshotResults.map(result => result.data?.products || {}));
      const configuredProducts = {};
      for (const product of rows) {
        const id = String(product.id);
        const existing = initial.products?.[id];
        configuredProducts[id] = existing
          ? { ...DEFAULT_PRODUCT_CONFIG, ...existing }
          : { ...DEFAULT_PRODUCT_CONFIG };
      }
      setProducts(rows);
      setSnapshots(mergedSnapshots);
      setSnapshotError('');
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

  useEffect(() => {
    if (!products.length) return undefined;

    let active = true;
    const refreshSnapshots = async () => {
      try {
        const results = await Promise.all(
          chunksOf(products.map(product => String(product.id)), 100)
            .map(ids => scarcitySimulator.getPublic(ids).catch(() => ({ data: { products: {} } })))
        );
        if (active) {
          setSnapshots(Object.assign({}, ...results.map(result => result.data?.products || {})));
          setSnapshotError('');
        }
      } catch (refreshError) {
        console.error('[SCARCITY_SIMULATOR_ADMIN_REFRESH]', refreshError);
        if (active) {
          setSnapshotError(refreshError.response?.data?.message || 'Could not refresh simulated stock progression.');
        }
      }
    };

    const timer = window.setInterval(refreshSnapshots, 30_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [products]);

  const summary = useMemo(() => {
    const values = Object.values(config.products);
    return {
      enabled: values.filter(item => item.enabled && !item.paused && !item.outOfStock).length,
      paused: values.filter(item => item.paused).length,
      outOfStock: values.filter(item => item.outOfStock).length,
      total: products.length,
    };
  }, [config.products, products.length]);

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

  // Batch actions
  const batchEnableAll = () => {
    setSaved(false);
    setConfig(current => {
      const updated = {};
      for (const [id, item] of Object.entries(current.products)) {
        updated[id] = { ...item, enabled: true, paused: false };
      }
      return { ...current, products: updated };
    });
  };

  const batchPauseAll = () => {
    setSaved(false);
    setConfig(current => {
      const updated = {};
      for (const [id, item] of Object.entries(current.products)) {
        updated[id] = { ...item, paused: true };
      }
      return { ...current, products: updated };
    });
  };

  const batchResumeAll = () => {
    setSaved(false);
    setConfig(current => {
      const updated = {};
      for (const [id, item] of Object.entries(current.products)) {
        updated[id] = { ...item, paused: false };
      }
      return { ...current, products: updated };
    });
  };

  const batchResetDefaults = () => {
    setSaved(false);
    setConfig(current => {
      const updated = {};
      for (const id of Object.keys(current.products)) {
        updated[id] = { ...DEFAULT_PRODUCT_CONFIG };
      }
      return { ...current, products: updated };
    });
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

      // Immediately refresh public snapshots so live preview reflects server confirmation
      try {
        const snapshotResults = await Promise.all(
          chunksOf(products.map(product => String(product.id)), 100)
            .map(ids => scarcitySimulator.getPublic(ids).catch(() => ({ data: { products: {} } })))
        );
        setSnapshots(Object.assign({}, ...snapshotResults.map(result => result.data?.products || {})));
      } catch {
        // Non-blocking
      }
    } catch (saveError) {
      console.error('[SCARCITY_SIMULATOR_ADMIN_SAVE]', saveError);
      setError(saveError.response?.data?.message || saveError.message || 'Could not save simulator controls.');
    } finally {
      setSaving(false);
    }
  };

  // Filtered product list
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const id = String(product.id);
      const item = config.products[id] || DEFAULT_PRODUCT_CONFIG;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name?.toLowerCase().includes(query);
        const matchesSku = product.sku?.toLowerCase().includes(query);
        const matchesId = id.includes(query);
        if (!matchesName && !matchesSku && !matchesId) return false;
      }
      if (statusFilter === 'active') {
        return item.enabled && !item.paused && !item.outOfStock;
      }
      if (statusFilter === 'paused') {
        return item.paused;
      }
      if (statusFilter === 'outOfStock') {
        return item.outOfStock;
      }
      return true;
    });
  }, [products, config.products, searchQuery, statusFilter]);

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
          <h2 className="mt-2 text-2xl font-black text-white">Scarcity Simulator & Stock Progression</h2>
          <p className="mt-1 text-sm text-slate-400">
            Configure storefront visual stock counters. These settings never update actual inventory, orders, or checkout limits.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-400 px-4 text-xs font-black uppercase tracking-wider text-emerald-950 hover:bg-emerald-300 transition-colors disabled:opacity-50"
          >
            <Save size={14} /> {saving ? 'Saving…' : 'Save simulator settings'}
          </button>
        </div>
      </header>

      {/* Mandatory Specification Alert Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-300/40 bg-amber-950/35 p-4 text-sm text-amber-100">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-300" aria-hidden="true" />
        <p className="leading-relaxed">
          Storefront counters must remain visibly labeled as simulated. These settings never update{' '}
          <code className="rounded bg-black/25 px-1 font-mono text-amber-200">products.quantity</code>, order records, or actual checkout availability.
          Simulated units decrease from 00:00 to 12:00 Asia/Kolkata, then remain steady until the next daily reset.
        </p>
      </div>

      {/* Live Timing & Algorithm Status Bar */}
      <section className="rounded-xl border border-emerald-400/20 bg-emerald-950/20 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-300">
              <Clock size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Asia/Kolkata Time:</span>
                <span className="font-mono text-sm font-black text-emerald-300">{clock.timeStr}</span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
                  Day: {dayKey || 'Active'}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-300">{clock.phaseText}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              clock.isDecreasing
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
            }`}>
              <span className={`h-2 w-2 rounded-full ${clock.isDecreasing ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {clock.isDecreasing ? 'Decreasing Phase' : 'Holding Steady'}
            </span>
          </div>
        </div>
      </section>

      {snapshotError && (
        <div role="status" className="rounded-lg border border-amber-300/30 bg-amber-950/30 px-4 py-3 text-sm text-amber-100">
          {snapshotError}
        </div>
      )}

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

      {/* Metric summary */}
      <section className="grid gap-3 sm:grid-cols-4">
        {[
          ['Status', config.enabled ? 'Enabled' : 'Paused'],
          ['Active simulations', summary.enabled],
          ['Paused simulations', summary.paused],
          ['Simulated sold out', summary.outOfStock],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-black text-white">{value}</p>
          </div>
        ))}
      </section>

      {/* Global master switches */}
      <section className="grid gap-4 lg:grid-cols-2">
        <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 cursor-pointer hover:border-white/20 transition-colors">
          <span>
            <span className="block text-sm font-bold text-white">Enable simulator visuals</span>
            <span className="mt-1 block text-xs text-slate-400">Display the labeled illustrative badge across Shop, Product Detail, and Bestseller fixtures.</span>
          </span>
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={event => setConfig(current => ({ ...current, enabled: event.target.checked }))}
            className="h-5 w-5 accent-emerald-400 cursor-pointer"
          />
        </label>
        <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 cursor-pointer hover:border-white/20 transition-colors">
          <span>
            <span className="block text-sm font-bold text-white">Show sample activity</span>
            <span className="mt-1 block text-xs text-slate-400">Display fictional shopper names and cities. Never reveals real customer data or orders.</span>
          </span>
          <input
            type="checkbox"
            checked={config.sampleActivityEnabled}
            onChange={event => setConfig(current => ({ ...current, sampleActivityEnabled: event.target.checked }))}
            className="h-5 w-5 accent-emerald-400 cursor-pointer"
          />
        </label>
      </section>

      {/* Per-product visual controls */}
      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#071a12]/80">
        <div className="flex flex-col gap-4 border-b border-white/10 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-white">Per-Product Visual Controls</h3>
              <p className="text-xs text-slate-400">
                Daily visual targets randomize from 0 to visual cap. Stock smoothly decreases between 00:00 and 12:00 Asia/Kolkata, then stays steady until midnight reset.
              </p>
            </div>
            {/* Batch actions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 sm:pt-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1">Batch:</span>
              <button
                type="button"
                onClick={batchEnableAll}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-emerald-400/50 hover:text-emerald-300"
              >
                Enable All
              </button>
              <button
                type="button"
                onClick={batchPauseAll}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-amber-400/50 hover:text-amber-300"
              >
                Pause All
              </button>
              <button
                type="button"
                onClick={batchResumeAll}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-emerald-400/50 hover:text-emerald-300"
              >
                Resume All
              </button>
              <button
                type="button"
                onClick={batchResetDefaults}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-rose-400/50 hover:text-rose-300"
              >
                <RotateCcw size={11} /> Reset
              </button>
            </div>
          </div>

          {/* Search & filter toolbar */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between pt-1">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products by title or SKU…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Filter size={13} className="text-slate-500 mr-1" />
              {[
                ['all', `All (${products.length})`],
                ['active', `Active (${summary.enabled})`],
                ['paused', `Paused (${summary.paused})`],
                ['outOfStock', `Sold Out (${summary.outOfStock})`],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatusFilter(key)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    statusFilter === key
                      ? 'bg-emerald-400/20 border border-emerald-400/50 text-emerald-300 font-bold'
                      : 'border border-white/10 bg-white/[0.02] text-slate-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-400">
            {products.length === 0
              ? 'No products are available to configure.'
              : 'No products match the selected search or filter.'}
          </p>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredProducts.map(product => {
              const id = String(product.id);
              const item = config.products[id] || DEFAULT_PRODUCT_CONFIG;
              const snapshot = snapshots[id];
              const previewSoldToday = !config.enabled || !item.enabled || item.paused || item.outOfStock
                ? 0
                : Math.min(item.dailyCap, Number(snapshot?.simulatedSoldToday ?? snapshot?.soldToday) || 0);

              const previewSnapshot = {
                ...(snapshot || {}),
                enabled: config.enabled && item.enabled,
                paused: item.paused,
                outOfStock: item.outOfStock,
                dailyCap: item.dailyCap,
                simulatedSoldToday: previewSoldToday,
                remaining: item.outOfStock ? 0 : Math.max(0, item.dailyCap - previewSoldToday),
                label: snapshot?.label || 'Simulation — illustrative data, not live inventory or sales',
                sampleActivity: snapshot?.sampleActivity || [],
              };

              return (
                <article
                  key={id}
                  className="grid gap-4 p-4 sm:p-5 xl:grid-cols-[minmax(180px,1.4fr)_repeat(3,minmax(100px,0.65fr))_minmax(190px,1.2fr)] xl:items-center hover:bg-white/[0.015] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{product.name}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                      {product.sku || `Product ${id}`} · Actual inventory is not modified
                    </p>
                    <p className="mt-1 text-xs text-amber-200">
                      Preview: {previewSnapshot.simulatedSoldToday} simulated units sold · {previewSnapshot.remaining}/{previewSnapshot.dailyCap} units remaining
                    </p>
                  </div>

                  <label className="text-xs text-slate-400">
                    Visual cap / day (max 250)
                    <input
                      type="number"
                      min="0"
                      max="250"
                      value={item.dailyCap}
                      onChange={event => {
                        const dailyCap = Math.max(0, Math.min(250, Number(event.target.value) || 0));
                        const minDailySold = Math.min(item.minDailySold, dailyCap);
                        updateProduct(id, {
                          dailyCap,
                          minDailySold,
                          maxDailySold: Math.min(Math.max(minDailySold, item.maxDailySold), dailyCap),
                        });
                      }}
                      className="mt-1 block w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </label>

                  <label className="text-xs text-slate-400">
                    Daily sold min
                    <input
                      type="number"
                      min="0"
                      max={item.dailyCap}
                      value={item.minDailySold}
                      onChange={event => {
                        const minDailySold = Math.max(
                          0,
                          Math.min(item.dailyCap, Number(event.target.value) || 0)
                        );
                        updateProduct(id, {
                          minDailySold,
                          maxDailySold: Math.max(minDailySold, item.maxDailySold),
                        });
                      }}
                      className="mt-1 block w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
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
                      className="mt-1 block w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </label>

                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/10 px-2.5 text-xs cursor-pointer hover:border-white/20">
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={event => updateProduct(id, { enabled: event.target.checked })}
                        className="accent-emerald-400 cursor-pointer"
                      />
                      Show
                    </label>
                    <button
                      type="button"
                      aria-pressed={item.paused}
                      onClick={() => updateProduct(id, { paused: !item.paused })}
                      className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs transition-colors ${
                        item.paused
                          ? 'border-amber-300/50 text-amber-200 bg-amber-400/10'
                          : 'border-white/10 text-slate-300 hover:border-white/30'
                      }`}
                    >
                      {item.paused ? <Play size={13} /> : <Pause size={13} />}
                      {item.paused ? 'Resume' : 'Pause'}
                    </button>
                    <label className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/10 px-2.5 text-xs cursor-pointer hover:border-white/20">
                      <input
                        type="checkbox"
                        checked={item.outOfStock}
                        onChange={event => updateProduct(id, { outOfStock: event.target.checked })}
                        className="accent-rose-400 cursor-pointer"
                      />
                      Show as sold out
                    </label>
                  </div>

                  <div className="xl:col-span-full">
                    <ScarcitySimulationBadge
                      snapshot={previewSnapshot}
                      productName={product.name}
                      sampleActivityEnabled={config.sampleActivityEnabled}
                      compact
                    />
                  </div>
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
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-400 px-5 text-xs font-black uppercase tracking-wider text-emerald-950 hover:bg-emerald-300 transition-colors disabled:opacity-50"
        >
          <Save size={15} /> {saving ? 'Saving…' : 'Save simulator settings'}
        </button>
      </div>
    </form>
  );
}
