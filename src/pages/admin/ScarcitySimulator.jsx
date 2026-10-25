import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  Flame,
  FlaskConical,
  Gauge,
  Layers,
  MapPin,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Sliders,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
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

const STRATEGY_PRESETS = [
  {
    id: 'high-rush',
    name: 'High Urgency Rush',
    icon: Flame,
    color: 'from-amber-500/20 to-rose-500/20 border-rose-500/40 text-rose-300',
    desc: 'Aggressive 80–95% daily depletion pace for peak promotional periods.',
    dailyCap: 200,
    minDailySold: 160,
    maxDailySold: 190,
  },
  {
    id: 'organic',
    name: 'Organic Daily Drift',
    icon: Sparkles,
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300',
    desc: 'Balanced, natural sales velocity across the 22h 45m simulation window.',
    dailyCap: 250,
    minDailySold: 60,
    maxDailySold: 180,
  },
  {
    id: 'bespoke',
    name: 'Bespoke Micro-Batch',
    icon: FlaskConical,
    color: 'from-amber-400/20 to-yellow-500/20 border-amber-400/40 text-[#FCE096]',
    desc: 'Ultra-scarce luxury batch feel (50 units cap, ~45–55 claimed).',
    dailyCap: 60,
    minDailySold: 45,
    maxDailySold: 56,
  },
  {
    id: 'conservative',
    name: 'Conservative Steady',
    icon: Activity,
    color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-300',
    desc: 'Gentle, subtle pacing for evergreen everyday luxury offerings.',
    dailyCap: 250,
    minDailySold: 25,
    maxDailySold: 95,
  },
];

const MOCK_INDIA_LOCATIONS = [
  'Bandra West, Mumbai',
  'Indiranagar, Bengaluru',
  'Vasant Vihar, New Delhi',
  'C-Scheme, Jaipur',
  'Salt Lake, Kolkata',
  'Koregaon Park, Pune',
  'Jubilee Hills, Hyderabad',
  'Bodakdev, Ahmedabad',
  'Fort Kochi, Kerala',
  'Sector 17, Chandigarh',
  'Gomti Nagar, Lucknow',
  'Alwarpet, Chennai',
  'Vijay Nagar, Indore',
  'Miramar, Panaji',
];

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

// 01:00 AM (60m) to 23:45 PM (1425m) = 1365m (22h 45m window)
const WINDOW_START_MINUTES = 60;
const WINDOW_END_MINUTES = 23 * 60 + 45;
const WINDOW_DURATION_MINUTES = WINDOW_END_MINUTES - WINDOW_START_MINUTES;

const getIstInfo = (overrideMinute = null) => {
  const now = new Date();
  const shifted = new Date(now.getTime() + 330 * 60 * 1000);
  const istHours = shifted.getUTCHours();
  const istMinutes = shifted.getUTCMinutes();
  const currentTotalMinutes = istHours * 60 + istMinutes;

  const totalMinutes = overrideMinute !== null ? overrideMinute : currentTotalMinutes;
  const elapsedInWindow = totalMinutes - WINDOW_START_MINUTES;
  const progress = Math.min(1, Math.max(0, elapsedInWindow / WINDOW_DURATION_MINUTES));

  const isDecreasing = totalMinutes >= WINDOW_START_MINUTES && totalMinutes <= WINDOW_END_MINUTES;

  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  const displayM = m < 10 ? `0${m}` : m;
  const timeFormatted = `${displayH}:${displayM} ${ampm}`;

  return {
    timeFormatted,
    totalMinutes,
    progress,
    progressPct: Math.round(progress * 100),
    isDecreasing,
    phaseText: isDecreasing
      ? `Decreasing Phase (01:00 AM – 23:45 PM Asia/Kolkata) · Progress: ${Math.round(progress * 100)}% of daily run`
      : totalMinutes < WINDOW_START_MINUTES
        ? `Pre-Run Buffer (00:00 – 01:00 AM Asia/Kolkata) · 100% Initial Visual Capacity`
        : `Holding Steady (23:45 PM – 00:00 Midnight Asia/Kolkata) · Units holding at final daily target`,
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

  // Time machine simulation scrubber
  const [timeMachineActive, setTimeMachineActive] = useState(false);
  const [scrubMinute, setScrubMinute] = useState(12 * 60); // default noon

  // Live real-time clock
  const [currentIst, setCurrentIst] = useState(getIstInfo());

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Bulk edit inputs
  const [bulkCap, setBulkCap] = useState(250);
  const [bulkMin, setBulkMin] = useState(0);
  const [bulkMax, setBulkMax] = useState(250);

  // Live simulated purchase feed in admin
  const [recentLiveOrders, setRecentLiveOrders] = useState([
    { id: 1, buyer: 'Shopper #318', location: 'Bandra West, Mumbai', product: 'Purifying Face Wash', time: '1m ago' },
    { id: 2, buyer: 'Shopper #742', location: 'Indiranagar, Bengaluru', product: 'Night Elixir', time: '4m ago' },
    { id: 3, buyer: 'Shopper #129', location: 'C-Scheme, Jaipur', product: 'Hydrating Cleanser', time: '8m ago' },
  ]);

  useEffect(() => {
    const clockTimer = window.setInterval(() => {
      setCurrentIst(getIstInfo());
    }, 1000);
    return () => window.clearInterval(clockTimer);
  }, []);

  const activeIst = useMemo(() => {
    return timeMachineActive ? getIstInfo(scrubMinute) : currentIst;
  }, [timeMachineActive, scrubMinute, currentIst]);

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

  // Preset Applicator
  const applyPreset = preset => {
    setSaved(false);
    setConfig(current => {
      const updated = {};
      for (const id of Object.keys(current.products)) {
        updated[id] = {
          ...current.products[id],
          dailyCap: preset.dailyCap,
          minDailySold: preset.minDailySold,
          maxDailySold: preset.maxDailySold,
          paused: false,
          outOfStock: false,
        };
      }
      return { ...current, products: updated };
    });
  };

  // Mass Bulk Actions
  const applyBulkCap = () => {
    setSaved(false);
    setConfig(current => {
      const updated = {};
      for (const [id, item] of Object.entries(current.products)) {
        const cap = Math.max(0, Math.min(250, Number(bulkCap) || 0));
        updated[id] = {
          ...item,
          dailyCap: cap,
          minDailySold: Math.min(item.minDailySold, cap),
          maxDailySold: Math.min(item.maxDailySold, cap),
        };
      }
      return { ...current, products: updated };
    });
  };

  const applyBulkRanges = () => {
    setSaved(false);
    setConfig(current => {
      const updated = {};
      for (const [id, item] of Object.entries(current.products)) {
        const min = Math.max(0, Math.min(item.dailyCap, Number(bulkMin) || 0));
        const max = Math.max(min, Math.min(item.dailyCap, Number(bulkMax) || 0));
        updated[id] = { ...item, minDailySold: min, maxDailySold: max };
      }
      return { ...current, products: updated };
    });
  };

  const batchToggleAll = enable => {
    setSaved(false);
    setConfig(current => {
      const updated = {};
      for (const [id, item] of Object.entries(current.products)) {
        updated[id] = { ...item, enabled: enable, paused: false };
      }
      return { ...current, products: updated };
    });
  };

  const batchPauseAll = pause => {
    setSaved(false);
    setConfig(current => {
      const updated = {};
      for (const [id, item] of Object.entries(current.products)) {
        updated[id] = { ...item, paused: pause };
      }
      return { ...current, products: updated };
    });
  };

  const triggerTestSimulatedPurchase = () => {
    const loc = MOCK_INDIA_LOCATIONS[Math.floor(Math.random() * MOCK_INDIA_LOCATIONS.length)];
    const prod = products[Math.floor(Math.random() * products.length)]?.name || 'Kumkumadi Night Elixir';
    const newOrder = {
      id: Date.now(),
      buyer: `Shopper #${Math.floor(Math.random() * 899 + 100)}`,
      location: loc,
      product: prod,
      time: 'Just now',
    };
    setRecentLiveOrders(prev => [newOrder, ...prev.slice(0, 5)]);
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

      try {
        const snapshotResults = await Promise.all(
          chunksOf(products.map(product => String(product.id)), 100)
            .map(ids => scarcitySimulator.getPublic(ids).catch(() => ({ data: { products: {} } })))
        );
        setSnapshots(Object.assign({}, ...snapshotResults.map(result => result.data?.products || {})));
      } catch {
        // non-blocking
      }
    } catch (saveError) {
      console.error('[SCARCITY_SIMULATOR_ADMIN_SAVE]', saveError);
      setError(saveError.response?.data?.message || saveError.message || 'Could not save simulator controls.');
    } finally {
      setSaving(false);
    }
  };

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
      if (statusFilter === 'active') return item.enabled && !item.paused && !item.outOfStock;
      if (statusFilter === 'paused') return item.paused;
      if (statusFilter === 'outOfStock') return item.outOfStock;
      return true;
    });
  }, [products, config.products, searchQuery, statusFilter]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-slate-400">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D4AF37]/20 border-t-[#D4AF37]" />
        <p className="text-xs font-bold uppercase tracking-widest text-[#FCE096]">Loading Scarcity Command Center…</p>
      </div>
    );
  }

  return (
    <form onSubmit={save} className="space-y-8 text-slate-200">
      {/* Top Luxury Header */}
      <header className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-r from-[#071a12] via-[#0d2a1d] to-[#071a12] p-6 shadow-2xl backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 text-amber-300">
              <FlaskConical size={20} className="text-[#D4AF37]" aria-hidden="true" />
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#FCE096]">
                Maison Promotional Algorithm · Visual Scarcity Studio
              </p>
            </div>
            <h1 className="mt-2 text-3xl font-serif font-bold text-white tracking-tight">
              Scarcity Simulator & Stock Progression
            </h1>
            <p className="mt-1.5 text-sm text-slate-300 max-w-2xl leading-relaxed">
              Full administrative control over storefront simulated stock decay, randomized daily targets, and nationwide live purchase simulations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={refresh}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 text-xs font-bold text-white hover:border-[#D4AF37]/60 hover:bg-white/[0.08] transition-all"
            >
              <RefreshCw size={14} /> Refresh Catalog
            </button>
            <button
              type="submit"
              disabled={saving || products.length === 0}
              className="btn-gold-luxury inline-flex min-h-11 items-center gap-2 rounded-xl px-6 text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-[#D4AF37]/20 transition-all disabled:opacity-50"
            >
              <Save size={15} /> {saving ? 'Deploying to Store…' : 'Deploy Simulator Settings'}
            </button>
          </div>
        </div>
      </header>

      {/* Mandatory Specification Alert Banner */}
      <div className="flex items-start gap-3.5 rounded-2xl border border-amber-300/40 bg-gradient-to-r from-amber-950/40 to-amber-900/25 p-4 sm:p-5 text-sm text-amber-100 shadow-lg">
        <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-300" aria-hidden="true" />
        <p className="leading-relaxed">
          Storefront counters must remain visibly labeled as simulated. These settings never update{' '}
          <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-amber-200 border border-amber-300/20">
            products.quantity
          </code>
          , order records, or actual checkout availability. Simulated units decrease from 01:00 to 23:45 Asia/Kolkata, then remain steady until the next daily reset.
        </p>
      </div>

      {/* Heavy Visual: 24-Hour Timeline & Scrubber Dashboard */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#081b13]/85 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-emerald-500/20 border border-[#D4AF37]/40 text-[#FCE096]">
              <Clock size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Asia/Kolkata Time:</span>
                <span className="font-mono text-xl font-bold text-white">{activeIst.timeFormatted}</span>
                {timeMachineActive && (
                  <span className="rounded-full bg-amber-400/20 border border-amber-400/50 px-2 py-0.5 text-[10px] font-bold text-amber-300 animate-pulse">
                    ⚡ Time Machine Mode
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-300 font-medium">{activeIst.phaseText}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTimeMachineActive(!timeMachineActive)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all border ${
                timeMachineActive
                  ? 'bg-amber-400/20 border-amber-400/60 text-amber-200 shadow-md shadow-amber-400/10'
                  : 'bg-white/[0.04] border-white/10 text-slate-300 hover:border-white/30'
              }`}
            >
              <Gauge size={14} />
              {timeMachineActive ? 'Exit Time Machine' : 'Launch Time Scrubber'}
            </button>
            <button
              type="button"
              onClick={triggerTestSimulatedPurchase}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-400/40 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition-all"
            >
              <Zap size={14} /> Trigger Simulated Buy
            </button>
          </div>
        </div>

        {/* 24-Hour Timeline Visual Curve */}
        <div className="mt-6 space-y-4">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
            <span>00:00 (Reset)</span>
            <span className="text-emerald-400">01:00 AM (Start Run)</span>
            <span>12:00 PM (Midday)</span>
            <span className="text-[#FCE096]">23:45 PM (Target Reached)</span>
            <span>24:00 (Hold)</span>
          </div>

          {/* SVG Progression Track */}
          <div className="relative h-12 w-full rounded-2xl bg-black/40 border border-white/10 p-2 overflow-hidden flex items-center">
            {/* 01:00 to 23:45 highlight zone (22h 45m window) */}
            <div
              className="absolute top-0 bottom-0 bg-gradient-to-r from-emerald-500/15 via-[#D4AF37]/20 to-amber-500/15 border-x border-emerald-400/30"
              style={{ left: `${(60 / 1440) * 100}%`, width: `${(1365 / 1440) * 100}%` }}
            />
            {/* Progress line */}
            <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-[#D4AF37] to-amber-400 transition-all duration-300 shadow-[0_0_12px_rgba(212,175,55,0.8)]"
                style={{ width: `${activeIst.progressPct}%` }}
              />
            </div>
            {/* Time Cursor Pin */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-300"
              style={{ left: `${(activeIst.totalMinutes / 1440) * 100}%` }}
            >
              <span className="h-4 w-4 rounded-full bg-[#FCE096] border-2 border-emerald-950 shadow-[0_0_10px_#FCE096] animate-pulse" />
            </div>
          </div>

          {/* Time Scrubber Slider (when active) */}
          {timeMachineActive && (
            <div className="rounded-2xl border border-amber-300/30 bg-black/40 p-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between text-xs text-amber-200 mb-2">
                <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders size={13} /> Drag to simulate stock at any hour of the day:
                </span>
                <span className="font-mono font-bold text-white text-sm">{activeIst.timeFormatted}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1439"
                value={scrubMinute}
                onChange={e => setScrubMinute(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer h-2 rounded-lg bg-white/10"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>00:00 AM (0 sold)</span>
                <span>06:00 AM (~22% sold)</span>
                <span>12:00 PM (~48% sold)</span>
                <span>18:00 PM (~75% sold)</span>
                <span>23:45 PM (100% target)</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Preset Strategies Grid */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-[#D4AF37]" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">1-Click Velocity Presets</h2>
          <span className="text-xs text-slate-400">(Instantly apply strategic pacing to all products)</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STRATEGY_PRESETS.map(preset => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`group relative flex flex-col text-left rounded-2xl border bg-gradient-to-br ${preset.color} p-4 sm:p-5 transition-all hover:scale-[1.02] hover:shadow-xl`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/30 border border-white/10">
                    <Icon size={18} />
                  </span>
                  <span className="rounded-full bg-black/40 px-2 py-0.5 font-mono text-[10px] font-bold">
                    Cap: {preset.dailyCap}
                  </span>
                </div>
                <h3 className="mt-3 font-bold text-white text-base group-hover:text-[#FCE096] transition-colors">
                  {preset.name}
                </h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">{preset.desc}</p>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Sold: {preset.minDailySold}–{preset.maxDailySold}</span>
                  <span className="font-bold text-white group-hover:underline">Apply Strategy →</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Mass Bulk Action Toolbar */}
      <section className="rounded-2xl border border-white/10 bg-black/30 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Mass Catalog Actions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Quickly adjust caps, limits, or statuses across all items simultaneously.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs">
              <span className="text-slate-400">Cap:</span>
              <input
                type="number"
                min="0"
                max="250"
                value={bulkCap}
                onChange={e => setBulkCap(e.target.value)}
                className="w-14 rounded bg-white/10 px-1.5 py-0.5 text-white font-mono text-center focus:outline-none"
              />
              <button
                type="button"
                onClick={applyBulkCap}
                className="rounded bg-white/10 px-2 py-0.5 font-bold hover:bg-emerald-400 hover:text-black transition-colors"
              >
                Apply
              </button>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs">
              <span className="text-slate-400">Min/Max:</span>
              <input
                type="number"
                min="0"
                max="250"
                value={bulkMin}
                onChange={e => setBulkMin(e.target.value)}
                className="w-12 rounded bg-white/10 px-1 py-0.5 text-white font-mono text-center focus:outline-none"
              />
              <span className="text-slate-500">–</span>
              <input
                type="number"
                min="0"
                max="250"
                value={bulkMax}
                onChange={e => setBulkMax(e.target.value)}
                className="w-12 rounded bg-white/10 px-1 py-0.5 text-white font-mono text-center focus:outline-none"
              />
              <button
                type="button"
                onClick={applyBulkRanges}
                className="rounded bg-white/10 px-2 py-0.5 font-bold hover:bg-emerald-400 hover:text-black transition-colors"
              >
                Set
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => batchToggleAll(true)}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-emerald-400/50 hover:text-emerald-300"
              >
                Enable All
              </button>
              <button
                type="button"
                onClick={() => batchPauseAll(true)}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-amber-400/50 hover:text-amber-300"
              >
                Pause All
              </button>
              <button
                type="button"
                onClick={() => batchPauseAll(false)}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-emerald-400/50 hover:text-emerald-300"
              >
                Resume All
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Global Master Toggles & Live Purchase Stream */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Master switches */}
        <div className="lg:col-span-2 space-y-4">
          <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#081a13] p-5 cursor-pointer hover:border-[#D4AF37]/40 transition-colors shadow-lg">
            <div>
              <span className="block text-sm font-bold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-[#D4AF37]" />
                Enable Storefront Visual Simulator
              </span>
              <span className="mt-1 block text-xs text-slate-300">
                Display the labeled illustrative badge across Shop catalog, Product Detail, and Bestseller carousels.
              </span>
            </div>
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={e => setConfig(curr => ({ ...curr, enabled: e.target.checked }))}
              className="h-6 w-6 accent-[#D4AF37] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#081a13] p-5 cursor-pointer hover:border-[#D4AF37]/40 transition-colors shadow-lg">
            <div>
              <span className="block text-sm font-bold text-white flex items-center gap-2">
                <MapPin size={16} className="text-emerald-400" />
                Show Simulated Live Purchase Activity
              </span>
              <span className="mt-1 block text-xs text-slate-300">
                Display genuine simulated purchase pulses from across India (Mumbai, Bengaluru, Jaipur, etc.) on product pages.
              </span>
            </div>
            <input
              type="checkbox"
              checked={config.sampleActivityEnabled}
              onChange={e => setConfig(curr => ({ ...curr, sampleActivityEnabled: e.target.checked }))}
              className="h-6 w-6 accent-emerald-400 cursor-pointer"
            />
          </label>
        </div>

        {/* Live simulated purchase stream ticker */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
              <span className="font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Live Purchase Feed
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Simulated</span>
            </div>
            <div className="mt-3 space-y-2">
              {recentLiveOrders.map(order => (
                <div key={order.id} className="rounded-xl bg-white/[0.03] border border-white/5 p-2 text-xs">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span className="text-[#FCE096] font-semibold">{order.buyer}</span>
                    <span>{order.time}</span>
                  </div>
                  <p className="mt-0.5 text-white font-medium truncate">{order.product}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <MapPin size={10} className="text-[#D4AF37]" /> {order.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={triggerTestSimulatedPurchase}
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.04] py-1.5 text-center text-xs font-bold text-slate-300 hover:text-white hover:bg-white/[0.08]"
          >
            + Generate Test Order Pulse
          </button>
        </div>
      </div>

      {snapshotError && (
        <div role="status" className="rounded-xl border border-amber-300/30 bg-amber-950/30 px-4 py-3 text-sm text-amber-100">
          {snapshotError}
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-xl border border-rose-400/30 bg-rose-950/30 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {saved && (
        <div role="status" className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200">
          <CheckCircle2 size={16} /> Simulator deployed. Actual inventory and orders are unchanged.
        </div>
      )}

      {/* Per-Product Visual Controls */}
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#071a12]/90 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-serif font-bold text-white">Per-Product Configuration Matrix</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Each product randomizes targets deterministically between Daily Sold Min & Max over the 01:00 AM – 23:45 PM window.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 font-mono text-xs text-slate-300">
                {filteredProducts.length} of {products.length} Products
              </span>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search formulations by name, SKU or ID…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/40 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
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
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                    statusFilter === key
                      ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/60 text-[#FCE096] font-bold shadow-md'
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
          <p className="p-12 text-center text-sm text-slate-400">
            {products.length === 0
              ? 'No products are available to configure.'
              : 'No products match your current search or filter query.'}
          </p>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredProducts.map(product => {
              const id = String(product.id);
              const item = config.products[id] || DEFAULT_PRODUCT_CONFIG;
              const snapshot = snapshots[id];

              // Calculate preview based on active Ist time (supporting time machine scrubber!)
              const dailyTarget = Math.round(item.minDailySold + ((item.maxDailySold - item.minDailySold) * 0.75));
              const progressCalc = activeIst.progress;
              const simulatedSoldCalculated = Math.round(dailyTarget * progressCalc);

              const previewSoldToday = !config.enabled || !item.enabled || item.paused || item.outOfStock
                ? 0
                : Math.min(item.dailyCap, timeMachineActive ? simulatedSoldCalculated : Number(snapshot?.simulatedSoldToday ?? snapshot?.soldToday) || simulatedSoldCalculated);

              const previewRemaining = item.outOfStock
                ? 0
                : Math.max(0, item.dailyCap - previewSoldToday);

              const previewSnapshot = {
                ...(snapshot || {}),
                enabled: config.enabled && item.enabled,
                paused: item.paused,
                outOfStock: item.outOfStock,
                dailyCap: item.dailyCap,
                simulatedSoldToday: previewSoldToday,
                remaining: previewRemaining,
                label: snapshot?.label || 'Simulation — illustrative data, not live inventory or sales',
                sampleActivity: snapshot?.sampleActivity || [],
              };

              const percentageSold = Math.min(100, Math.round((previewSoldToday / Math.max(1, item.dailyCap)) * 100));

              return (
                <article
                  key={id}
                  className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(220px,1.4fr)_repeat(3,minmax(120px,0.7fr))_minmax(200px,1.2fr)] xl:items-center hover:bg-white/[0.015] transition-colors"
                >
                  {/* Product title & metadata */}
                  <div className="min-w-0">
                    <p className="truncate font-serif font-bold text-white text-base">{product.name}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                      {product.sku || `Product BV-${id}`} · Warehouse stock is untouched
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        percentageSold > 80
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : percentageSold > 40
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {percentageSold}% Claimed Today
                      </span>
                      <span className="text-xs text-amber-200">
                        {previewRemaining} units left / {previewSoldToday} sold
                      </span>
                    </div>
                  </div>

                  {/* Daily Visual Cap input */}
                  <label className="text-xs text-slate-400">
                    Visual Cap (Max 250)
                    <input
                      type="number"
                      min="0"
                      max="250"
                      value={item.dailyCap}
                      onChange={e => {
                        const dailyCap = Math.max(0, Math.min(250, Number(e.target.value) || 0));
                        const minDailySold = Math.min(item.minDailySold, dailyCap);
                        updateProduct(id, {
                          dailyCap,
                          minDailySold,
                          maxDailySold: Math.min(Math.max(minDailySold, item.maxDailySold), dailyCap),
                        });
                      }}
                      className="mt-1.5 block w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm font-mono text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </label>

                  {/* Daily Sold Min input */}
                  <label className="text-xs text-slate-400">
                    Daily Sold Min
                    <input
                      type="number"
                      min="0"
                      max={item.dailyCap}
                      value={item.minDailySold}
                      onChange={e => {
                        const minDailySold = Math.max(0, Math.min(item.dailyCap, Number(e.target.value) || 0));
                        updateProduct(id, {
                          minDailySold,
                          maxDailySold: Math.max(minDailySold, item.maxDailySold),
                        });
                      }}
                      className="mt-1.5 block w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm font-mono text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </label>

                  {/* Daily Sold Max input */}
                  <label className="text-xs text-slate-400">
                    Daily Sold Max
                    <input
                      type="number"
                      min={item.minDailySold}
                      max={item.dailyCap}
                      value={item.maxDailySold}
                      onChange={e => updateProduct(id, {
                        maxDailySold: Math.max(item.minDailySold, Math.min(item.dailyCap, Number(e.target.value) || 0)),
                      })}
                      className="mt-1.5 block w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm font-mono text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </label>

                  {/* Action buttons & switches */}
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-3 text-xs cursor-pointer hover:border-white/30 transition-colors">
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={e => updateProduct(id, { enabled: e.target.checked })}
                        className="accent-[#D4AF37] cursor-pointer"
                      />
                      Show
                    </label>

                    <button
                      type="button"
                      aria-pressed={item.paused}
                      onClick={() => updateProduct(id, { paused: !item.paused })}
                      className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-3 text-xs font-medium transition-all ${
                        item.paused
                          ? 'border-amber-400/60 text-amber-200 bg-amber-400/15 shadow-sm'
                          : 'border-white/15 text-slate-300 hover:border-white/30 bg-white/[0.03]'
                      }`}
                    >
                      {item.paused ? <Play size={13} /> : <Pause size={13} />}
                      {item.paused ? 'Resume' : 'Pause'}
                    </button>

                    <label className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-3 text-xs cursor-pointer hover:border-white/30 transition-colors">
                      <input
                        type="checkbox"
                        checked={item.outOfStock}
                        onChange={e => updateProduct(id, { outOfStock: e.target.checked })}
                        className="accent-rose-400 cursor-pointer"
                      />
                      Sold Out
                    </label>
                  </div>

                  {/* Heavy Visual Interactive Preview Badge */}
                  <div className="xl:col-span-full pt-1">
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

      {/* Sticky Deployment Footer */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-[#D4AF37]/40 bg-[#071a12]/95 p-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <FlaskConical size={16} className="text-[#D4AF37]" />
          <span>
            Changes apply to storefront promotional badges only. Real stock remains 100% authoritative at checkout.
          </span>
        </div>
        <button
          type="submit"
          disabled={saving || products.length === 0}
          className="btn-gold-luxury inline-flex min-h-11 items-center gap-2 rounded-xl px-6 text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-[#D4AF37]/25 transition-all disabled:opacity-50"
        >
          <Save size={15} /> {saving ? 'Deploying Changes…' : 'Deploy Simulator Settings'}
        </button>
      </div>
    </form>
  );
}
