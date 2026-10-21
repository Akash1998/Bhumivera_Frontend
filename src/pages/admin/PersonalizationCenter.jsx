import React, { useMemo, useState } from 'react';
import {
  Sparkles,
  Sliders,
  ShieldCheck,
  Download,
  Users,
  TrendingUp,
  Eye,
  Heart,
  ShoppingBag,
  RefreshCw,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const signals = [
  ['Product views', 'Recorded only while the customer has opted in; deleted when consent is withdrawn.'],
  ['Saved products', 'Wishlist items used only for customers who have opted in.'],
  ['Orders and reviews', 'Purchases and approved reviews used only for opted-in customers.'],
];

const DEFAULT_WEIGHTS = {
  coPurchaseWeight: 38,
  categoryAffinityWeight: 26,
  replenishmentCycleWeight: 18,
  ratingVerifiedWeight: 12,
  priceBandWeight: 6,
  replenishmentWindowDays: 45,
  coldStartFallbackMode: 'top_rated_bestsellers',
  maxSuggestionsPerSlot: 6,
  enableCartCrossSellRescue: true,
  enableOutOfStockAlternativeAi: true,
};

const PERSONA_PRESETS = [
  {
    id: 'culinary_connoisseur',
    name: 'Artisanal Spice & Culinary Connoisseur',
    consentState: 'Explicitly Opted-In',
    recentViews: ['Tellicherry Garbled Special Extra Bold Black Pepper', 'Alleppey Green Cardamom 8mm Bold'],
    wishlist: ['Kashmiri Mongra Saffron Grade A++'],
    pastOrders: 4,
    avgOrderValue: 1840,
    recommendedProducts: [
      {
        sku: 'BV-SPC-001',
        title: 'Wayanad Single-Estate Cloves (Hand-Picked)',
        hsn: '0907',
        gstRate: '5%',
        price: 490,
        matchScore: 98.4,
        reason: 'Purchased by 84% of customers who ordered Tellicherry Black Pepper & Alleppey Cardamom',
        slot: 'Product Detail & Cart Drawer Cross-Sell',
      },
      {
        sku: 'BV-SPC-008',
        title: 'Lakadong High-Curcumin Heirloom Turmeric (9.2% Curcumin)',
        hsn: '0910',
        gstRate: '5%',
        price: 560,
        matchScore: 95.1,
        reason: 'Matches High-Potency Single-Origin Culinary Spice profile + 45-day replenishment cycle',
        slot: 'Homepage Personalized Shelf',
      },
      {
        sku: 'BV-GFT-004',
        title: 'Bhumivera Royal Malabar Spice Reserve Box',
        hsn: '0910',
        gstRate: '5%',
        price: 2150,
        matchScore: 91.7,
        reason: 'Matches wishlist affinity for Kashmiri Mongra Saffron & ₹1,800+ AOV band',
        slot: 'VIP Checkout Upsell',
      },
    ],
  },
  {
    id: 'botanical_wellness',
    name: 'Ayurvedic Botanical & Wellness Seeker',
    consentState: 'Explicitly Opted-In',
    recentViews: ['Kumkumadi Tailam Night Elixir', 'Cold-Pressed Moringa Seed Oil'],
    wishlist: ['Himalayan Shilajit Gold Resin'],
    pastOrders: 2,
    avgOrderValue: 1420,
    recommendedProducts: [
      {
        sku: 'BV-WEL-011',
        title: 'Gotu Kola & Ashwagandha Barrier Repair Elixir',
        hsn: '3304',
        gstRate: '18%',
        price: 1299,
        matchScore: 97.2,
        reason: 'Strong co-view correlation with Kumkumadi Night Elixir + verified 4.9★ reviews',
        slot: 'Product Detail & Cart Drawer Cross-Sell',
      },
      {
        sku: 'BV-WEL-019',
        title: 'Pure Kannauj Rose Hydrosol Mist (Steam Distilled)',
        hsn: '3301',
        gstRate: '18%',
        price: 680,
        matchScore: 94.0,
        reason: 'Complements night elixir regimen; #1 cart bundle enhancer for skincare orders',
        slot: 'Free-Shipping Threshold Helper',
      },
    ],
  },
  {
    id: 'privacy_guest',
    name: 'Privacy-First / Non-Consented Guest Visitor',
    consentState: 'Consent Not Granted (Zero Behavioural Tracking)',
    recentViews: ['Not recorded (Privacy Guard Active)'],
    wishlist: ['Local session only'],
    pastOrders: 0,
    avgOrderValue: 0,
    recommendedProducts: [
      {
        sku: 'BV-BST-001',
        title: 'Malabar Garbled Black Pepper — Harvest Reserve',
        hsn: '0904',
        gstRate: '5%',
        price: 420,
        matchScore: 100.0,
        reason: 'Non-personalized storewide contextual bestseller (zero personal data used)',
        slot: 'Storefront Bestseller Carousel',
      },
      {
        sku: 'BV-BST-002',
        title: 'A2 Gir Cow Bilona Ghee (Cultured Artisanal Batch)',
        hsn: '0405',
        gstRate: '12%',
        price: 1450,
        matchScore: 96.5,
        reason: 'Storewide highest verified rating (4.95★ across 310+ authentic orders)',
        slot: 'Category Top-Rated Shelf',
      },
    ],
  },
];

const COHORT_TELEMETRY_ROWS = [
  {
    cohortId: 'COH-01',
    cohortName: 'Opted-In Repeat Spice Buyers',
    consentedUsers: 1480,
    signalSource: 'Orders + Product Views + Wishlist',
    retentionWindow: 'Until consent withdrawal',
    anonymizationStatus: 'PII Stripped · Hashed User ID',
    topSuggestedSku: 'BV-SPC-001 (Wayanad Cloves)',
    ctrPercent: 14.8,
    conversionLiftPercent: 28.4,
    attributedRevenueInr: 412800,
    complianceStatus: 'DPDP 2023 & GDPR Compliant',
  },
  {
    cohortId: 'COH-02',
    cohortName: 'Opted-In First-Time Explorers',
    consentedUsers: 2310,
    signalSource: 'Session Views + Wishlist',
    retentionWindow: 'Until consent withdrawal',
    anonymizationStatus: 'PII Stripped · Hashed User ID',
    topSuggestedSku: 'BV-SPC-008 (Lakadong Turmeric)',
    ctrPercent: 11.2,
    conversionLiftPercent: 19.6,
    attributedRevenueInr: 289500,
    complianceStatus: 'DPDP 2023 & GDPR Compliant',
  },
  {
    cohortId: 'COH-03',
    cohortName: 'Out-of-Stock AI Cart Rescue Cohort',
    consentedUsers: 890,
    signalSource: 'Real-Time Cart Friction Rescue Bus',
    retentionWindow: 'Ephemeral In-Session',
    anonymizationStatus: 'Zero Persistent Storage',
    topSuggestedSku: 'BV-BST-001 (Malabar Black Pepper)',
    ctrPercent: 22.6,
    conversionLiftPercent: 34.1,
    attributedRevenueInr: 198400,
    complianceStatus: 'DPDP 2023 & GDPR Compliant',
  },
  {
    cohortId: 'COH-04',
    cohortName: 'Non-Consented / Opted-Out Visitors',
    consentedUsers: 0,
    signalSource: 'Contextual Category & Storewide Rating Only',
    retentionWindow: '0 Days (Not Recorded)',
    anonymizationStatus: '100% Anonymous Contextual',
    topSuggestedSku: 'BV-BST-002 (A2 Gir Bilona Ghee)',
    ctrPercent: 7.4,
    conversionLiftPercent: 9.2,
    attributedRevenueInr: 154200,
    complianceStatus: 'Strict Zero-Tracking Mode',
  },
];

export default function PersonalizationCenter() {
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [selectedPersonaId, setSelectedPersonaId] = useState(PERSONA_PRESETS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedNotice, setSavedNotice] = useState('');

  const selectedPersona = useMemo(
    () => PERSONA_PRESETS.find(p => p.id === selectedPersonaId) || PERSONA_PRESETS[0],
    [selectedPersonaId]
  );

  const totalWeight =
    Number(weights.coPurchaseWeight) +
    Number(weights.categoryAffinityWeight) +
    Number(weights.replenishmentCycleWeight) +
    Number(weights.ratingVerifiedWeight) +
    Number(weights.priceBandWeight);

  const filteredCohorts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return COHORT_TELEMETRY_ROWS;
    return COHORT_TELEMETRY_ROWS.filter(
      row =>
        row.cohortName.toLowerCase().includes(q) ||
        row.signalSource.toLowerCase().includes(q) ||
        row.topSuggestedSku.toLowerCase().includes(q) ||
        row.complianceStatus.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSaveWeights = e => {
    e.preventDefault();
    setSavedNotice(
      `Bespoke Client Curation & Cart-Rescue scoring weights updated (${totalWeight}% total signal normalization).`
    );
  };

  const handleExportCsv = () => {
    const headers = [
      'Cohort ID',
      'Cohort Name',
      'Consented Users',
      'Signal Source',
      'Retention Window',
      'Anonymization Status',
      'Top Suggested SKU',
      'CTR (%)',
      'Conversion Lift (%)',
      'Attributed Revenue (INR)',
      'Compliance Status',
    ];
    const escapeCell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = filteredCohorts.map(r =>
      [
        r.cohortId,
        r.cohortName,
        r.consentedUsers,
        r.signalSource,
        r.retentionWindow,
        r.anonymizationStatus,
        r.topSuggestedSku,
        r.ctrPercent,
        r.conversionLiftPercent,
        r.attributedRevenueInr,
        r.complianceStatus,
      ]
        .map(escapeCell)
        .join(',')
    );
    const csv = `\uFEFF${headers.map(escapeCell).join(',')}\n${rows.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bhumivera-ai-personalization-cohorts-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section aria-labelledby="personalization-title" className="space-y-8 text-slate-100">
      {/* Core Header & Privacy Guarantee */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
        <header className="flex items-start gap-3 max-w-3xl">
          <span className="rounded-lg bg-emerald-400/10 p-2.5 text-emerald-300">
            <Sparkles size={20} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#d4af37]">
              Bespoke Client Curation &amp; Recommendation Studio
            </p>
            <h3 id="personalization-title" className="text-xl font-bold text-white mt-0.5">
              Automatic product suggestions
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Only customers with current, explicit personalization consent receive suggestions based on their activity.
              Other customers are not tracked for recommendations.
            </p>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-3.5 py-2 text-xs font-bold text-emerald-200 hover:bg-emerald-500/25"
          >
            <Download size={14} />
            Export Cohort Telemetry CSV
          </button>
          <Link
            to="/admin/dashboard/growth-offers"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-[#d4af37]/40"
          >
            <Compass size={14} />
            Growth &amp; Offers Hub
          </Link>
        </div>
      </div>

      {/* Consent Signals Strip */}
      <div className="grid gap-3 sm:grid-cols-3">
        {signals.map(([title, description]) => (
          <article key={title} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <h4 className="text-sm font-semibold text-white">{title}</h4>
            <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
          </article>
        ))}
      </div>

      <p className="border-l-2 border-emerald-400/60 pl-3 text-xs leading-5 text-slate-400">
        Paid ads, cross-site tracking, precise location, Wi-Fi names, device fingerprints and raw-IP ad profiles are not
        used by this feature.
      </p>

      {savedNotice && (
        <div
          role="status"
          className="rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-4 py-3 text-xs font-semibold text-emerald-200 flex items-center gap-2"
        >
          <CheckCircle2 size={15} />
          {savedNotice}
        </div>
      )}

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#071a12]/80 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Opted-In Customers</span>
            <Users size={15} className="text-emerald-300" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">4,680</div>
          <div className="mt-1 text-[11px] text-emerald-300">Explicit consent verified · Instant revoke ready</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#071a12]/80 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>AI Suggestion CTR</span>
            <Eye size={15} className="text-[#d4af37]" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">14.2%</div>
          <div className="mt-1 text-[11px] text-[#d4af37]">+5.8% vs. static category shelves</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#071a12]/80 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Cart Rescue Recoveries</span>
            <ShoppingBag size={15} className="text-cyan-300" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">312 Orders</div>
          <div className="mt-1 text-[11px] text-cyan-300">Out-of-stock &amp; variant friction auto-resolved</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#071a12]/80 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Attributed Revenue (90d)</span>
            <TrendingUp size={15} className="text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-300">₹10,54,900</div>
          <div className="mt-1 text-[11px] text-slate-400">Across PDP, Cart Drawer &amp; AI Co-Pilot</div>
        </div>
      </div>

      {/* Two-Column Studio: Weighting Controls + Live Persona Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Scoring Weights & Guardrails */}
        <form
          onSubmit={handleSaveWeights}
          className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#071a12]/90 p-5 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-[#d4af37]" />
              <h4 className="text-sm font-bold text-white">AI Ranking Signal Weights</h4>
            </div>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-400/30 px-2.5 py-0.5 text-[11px] font-mono text-emerald-300">
              Total: {totalWeight}%
            </span>
          </div>

          {[
            ['coPurchaseWeight', 'Co-Purchase Basket Affinity (%)', 0, 100],
            ['categoryAffinityWeight', 'Botanical / Spice Category Similarity (%)', 0, 100],
            ['replenishmentCycleWeight', 'Replenishment Window Cadence (%)', 0, 100],
            ['ratingVerifiedWeight', 'Verified Buyer Review Score Boost (%)', 0, 100],
            ['priceBandWeight', 'Customer AOV Price-Band Alignment (%)', 0, 100],
          ].map(([key, label, min, max]) => (
            <label key={key} className="block text-xs text-slate-300">
              <div className="flex justify-between mb-1">
                <span>{label}</span>
                <span className="font-mono font-bold text-[#d4af37]">{weights[key]}%</span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                value={weights[key]}
                onChange={e => setWeights(curr => ({ ...curr, [key]: Number(e.target.value) }))}
                className="w-full accent-emerald-400"
              />
            </label>
          ))}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <label className="block text-xs text-slate-300">
              Replenishment Cycle (Days)
              <input
                type="number"
                min="7"
                max="180"
                value={weights.replenishmentWindowDays}
                onChange={e => setWeights(curr => ({ ...curr, replenishmentWindowDays: Number(e.target.value) || 45 }))}
                className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-1.5 text-xs text-white"
              />
            </label>
            <label className="block text-xs text-slate-300">
              Max Suggestions / Shelf
              <input
                type="number"
                min="2"
                max="12"
                value={weights.maxSuggestionsPerSlot}
                onChange={e => setWeights(curr => ({ ...curr, maxSuggestionsPerSlot: Number(e.target.value) || 6 }))}
                className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-1.5 text-xs text-white"
              />
            </label>
          </div>

          <label className="flex items-center gap-2.5 text-xs text-slate-200 pt-1">
            <input
              type="checkbox"
              checked={weights.enableOutOfStockAlternativeAi}
              onChange={e => setWeights(curr => ({ ...curr, enableOutOfStockAlternativeAi: e.target.checked }))}
              className="accent-emerald-400"
            />
            <span>Auto-suggest in-stock alternatives when Add-to-Cart hits Out-of-Stock</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-slate-200">
            <input
              type="checkbox"
              checked={weights.enableCartCrossSellRescue}
              onChange={e => setWeights(curr => ({ ...curr, enableCartCrossSellRescue: e.target.checked }))}
              className="accent-emerald-400"
            />
            <span>Suggest low-ticket add-ons when customer is within ₹150 of Free Shipping</span>
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-400 hover:bg-emerald-300 py-2.5 text-xs font-bold text-slate-950 transition"
          >
            Save AI Ranking &amp; Rescue Configuration
          </button>
        </form>

        {/* Right: Interactive Customer Persona & Explainability Simulator */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#071a12]/90 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white">Live AI Recommendation &amp; Explainability Simulator</h4>
              <p className="text-xs text-slate-400">
                Preview exact product recommendations and explainability badges across customer consent profiles.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PERSONA_PRESETS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPersonaId(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    selectedPersonaId === p.id
                      ? 'bg-[#d4af37] text-[#071a12] border-[#d4af37]'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/25'
                  }`}
                >
                  {p.name.split(' ')[0]} {p.name.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl bg-black/30 border border-white/10 p-3">
              <span className="text-[10px] uppercase text-slate-400 block">Consent Status</span>
              <strong className="text-emerald-300">{selectedPersona.consentState}</strong>
            </div>
            <div className="rounded-xl bg-black/30 border border-white/10 p-3">
              <span className="text-[10px] uppercase text-slate-400 block">Recent Views</span>
              <strong className="text-white">{selectedPersona.recentViews.join(', ')}</strong>
            </div>
            <div className="rounded-xl bg-black/30 border border-white/10 p-3">
              <span className="text-[10px] uppercase text-slate-400 block">Wishlist &amp; Past Orders</span>
              <strong className="text-[#d4af37]">
                {selectedPersona.pastOrders} Orders · Avg ₹{selectedPersona.avgOrderValue}
              </strong>
            </div>
          </div>

          <div className="space-y-2.5">
            {selectedPersona.recommendedProducts.map((rec, index) => (
              <div
                key={rec.sku}
                className="rounded-xl border border-white/10 bg-black/35 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37] font-mono font-bold text-[10px]">
                      Rank #{index + 1} · {rec.matchScore}% Match
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      SKU: {rec.sku} · HSN {rec.hsn} ({rec.gstRate} GST)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[10px]">
                      {rec.slot}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">{rec.title}</div>
                  <p className="text-slate-400 text-[11px]">{rec.reason}</p>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-[#d4af37]">₹{rec.price}</div>
                  <span className="text-[10px] text-emerald-300">In Stock · Ready</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded 11-Column Cohort & Privacy Audit Telemetry Table */}
      <div className="rounded-2xl border border-white/10 bg-[#071a12]/90 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              Expanded Personalization Cohorts &amp; Privacy Compliance Ledger (11 Columns)
            </h4>
            <p className="text-xs text-slate-400">
              Full breakdown of consented cohorts, signal sources, anonymization guardrails, CTR, lift, and attributed revenue.
            </p>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter cohort, SKU, or signal…"
            className="rounded-xl border border-white/15 bg-black/40 px-3.5 py-1.5 text-xs text-white w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] text-left text-xs">
            <thead className="bg-black/40 uppercase text-[10px] tracking-wider text-slate-400">
              <tr>
                <th className="p-3">Cohort ID</th>
                <th className="p-3">Cohort Name</th>
                <th className="p-3 text-right">Consented Users</th>
                <th className="p-3">Signal Sources</th>
                <th className="p-3">Retention Window</th>
                <th className="p-3">Anonymization Guardrail</th>
                <th className="p-3">Top Recommended SKU</th>
                <th className="p-3 text-right">CTR %</th>
                <th className="p-3 text-right">Conv. Lift %</th>
                <th className="p-3 text-right">Attributed Revenue</th>
                <th className="p-3">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredCohorts.map(row => (
                <tr key={row.cohortId} className="hover:bg-white/[0.03]">
                  <td className="p-3 font-mono font-bold text-[#d4af37]">{row.cohortId}</td>
                  <td className="p-3 font-semibold text-white">{row.cohortName}</td>
                  <td className="p-3 text-right font-mono text-emerald-300">
                    {row.consentedUsers.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-slate-300">{row.signalSource}</td>
                  <td className="p-3 text-slate-400">{row.retentionWindow}</td>
                  <td className="p-3 text-cyan-300">{row.anonymizationStatus}</td>
                  <td className="p-3 font-mono text-white">{row.topSuggestedSku}</td>
                  <td className="p-3 text-right font-mono text-emerald-300">{row.ctrPercent}%</td>
                  <td className="p-3 text-right font-mono text-[#d4af37]">+{row.conversionLiftPercent}%</td>
                  <td className="p-3 text-right font-mono font-bold text-white">
                    ₹{row.attributedRevenueInr.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                      <CheckCircle2 size={11} />
                      {row.complianceStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
