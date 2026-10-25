import React, { useState } from 'react';
import {
  ArrowRight,
  FlaskConical,
  Leaf,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  Sparkles,
  CheckCircle2,
  Droplets,
  ThermometerSnowflake,
  Layers,
  Award,
  Lock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import BestSellersToday from '../components/BestSellersToday';
import {
  HOME_VISUAL_ASSETS,
  MAISON_REGIMEN_BUNDLES,
} from '../data/bhumiveraUniqueData';

const tiles = [
  { to: '/shop', label: 'The 6 Formulations', note: '100% Active % Disclosed', icon: ShoppingBag },
  { to: '/lab', label: 'Cold-Pressed Protocol', note: 'Sub-28°C Extraction Lab', icon: FlaskConical },
  { to: '/impact', label: 'Public Impact Ledger', note: 'Pledge-to-Proof Receipts', icon: Sprout },
  { to: '/science', label: 'pH 5.0–5.5 Science', note: 'Acid-Mantle Monograph', icon: Leaf },
];

const promises = [
  { icon: Leaf, title: 'Sub-28°C Cold-Pressed', text: 'Extracted below 28°C so heat-sensitive Omega-7 and Vitamin C remain intact.' },
  { icon: FlaskConical, title: 'pH 5.0–5.5 Calibrated', text: 'Matched to the skin acid mantle and verified by digital electrode assay.' },
  { icon: ShieldCheck, title: 'Transparent availability', text: 'A separate, clearly labeled visual simulator never replaces actual checkout stock.' },
  { icon: Sprout, title: '100% Label Disclosure', text: 'Exact percentages (3% Charcoal, 4% Sea Buckthorn, 25mg Reetha) printed openly.' },
  { icon: Lock, title: 'Artisanal Wax-Sealed Custody', text: 'Hand-sealed gold-foil collar & ±0.5g cleanroom gravimetric verification.' },
];

const stats = [
  { value: '2016', label: 'Maison Established' },
  { value: 'Up to 250', label: 'Maximum illustrative cap, not live stock' },
  { value: '<28°C', label: 'Cold-Press Extraction' },
  { value: '100%', label: 'Active % Label Disclosed' },
];

const MARKET_QUADRANT_ROWS = [
  {
    dimension: 'Active Concentration Disclosure',
    bhumivera: '100% Disclosed on Front Label (3% Charcoal, 4% Sea Buckthorn, 5% Glycerin, 25mg Reetha, 9.0ml/10ml 7-Tulsi)',
    labBrands: 'Disclosed only for synthetic isolates (e.g. 10% Niacinamide); zero whole-plant phytonutrients',
    opaqueAyurveda: 'Hidden behind "Aq. Extract Q.S." or "Base Q.S." (often <0.01% herbal dust)',
  },
  {
    dimension: 'Botanical Extraction Thermal Standard',
    bhumivera: 'Sub-28°C Cold-Pressed & Cold-Macerated to preserve Omega-7 & bioactive polyphenols',
    labBrands: 'Industrial chemical synthesis; sterile lab-only solvent matrices',
    opaqueAyurveda: '80°C–100°C steam-boiled decoctions that denature delicate vitamins & lipids',
  },
  {
    dimension: 'Acid-Mantle pH Calibration',
    bhumivera: 'Digital electrode calibrated at pH 5.0–5.5; batch COA published per bottle serial',
    labBrands: 'pH-adjusted but lacks soothing botanical lipid-barrier cushioning',
    opaqueAyurveda: 'Often alkaline (pH 8.0–9.5) soap bases that strip the stratum corneum barrier',
  },
  {
    dimension: 'Batch Traceability & Security',
    bhumivera: 'Use verified production and batch records; do not infer batch size from the promotional simulator',
    labBrands: '50,000+ unit mass factory runs with generic lot codes',
    opaqueAyurveda: 'Mass contract manufacturing or ₹1,500–₹3,500 boutique markup with zero lab COA',
  },
];

const PH_STRIP_SAMPLES = [
  {
    id: 'bhumivera-sb',
    label: 'Bhumivera 4% Sea Buckthorn Face Wash',
    ph: '5.42',
    zone: 'Optimal Skin Acid Mantle (pH 5.0–5.5)',
    color: '#D4AF37',
    stripBg: 'from-amber-400 to-yellow-500',
    verdict: 'Preserves ceramide lipid barrier; zero post-wash tightness via 5% Botanical Glycerin + 0.1% HA.',
  },
  {
    id: 'bhumivera-sh',
    label: 'Bhumivera Royal 2-in-1 Saponin Shampoo',
    ph: '5.18',
    zone: 'Cuticle-Sealing Acidic Window (pH 5.0–5.24)',
    color: '#10B981',
    stripBg: 'from-emerald-400 to-amber-400',
    verdict: 'Natural 25mg Reetha + 5mg Shikakai saponins flatten hair cuticles for silicone-free mirror shine.',
  },
  {
    id: 'mass-cleanser',
    label: 'Typical Commercial Foaming Face Wash',
    ph: '8.70',
    zone: 'Alkaline Barrier-Disrupting Zone (pH 8.0–9.2)',
    color: '#EF4444',
    stripBg: 'from-teal-600 to-blue-800',
    verdict: 'High-pH SLS detergents swell the stratum corneum, strip natural sebum, and trigger rebound oiliness.',
  },
  {
    id: 'herbal-qs',
    label: 'Generic "Herbal Base Q.S." Market Wash',
    ph: '8.15',
    zone: 'Opaque Alkaline Detergent Base',
    color: '#F97316',
    stripBg: 'from-emerald-700 to-cyan-800',
    verdict: 'Uses <0.05% herb extract for label claims inside an unbuffered alkaline surfactant base.',
  },
];

const HOME_CONSCIOUS_FAQS = [
  {
    q: 'What makes Bhumivera "The Transparent Maison" in 2026 personal care?',
    a: 'For years, skincare buyers were forced to choose between sterile synthetic lab brands (which disclose active percentages but rely on harsh chemical isolates) and traditional Ayurvedic brands (which celebrate botanicals but hide behind "Base Q.S." with zero concentration transparency). Bhumivera unites both worlds: cold-pressed Indian botanicals (<28°C) and proven barrier humectants with 100% active percentage and milligram disclosure printed on every bottle.',
  },
  {
    q: 'How does the "Inside-Out Botanical Ritual" with Kalpvriksh Satva 7-Tulsi Drops work for skin clarity?',
    a: 'Breakouts, dullness, and barrier inflammation are driven both externally (urban PM2.5 soot, alkaline cleansers) and internally (cortisol spikes, gut-skin oxidative stress). Pairing our topical pH 5.4 cleansers (3% Activated Charcoal or 4% Himalayan Sea Buckthorn) with 3–4 internal drops of Kalpvriksh Satva Tulsi (9.0 ml Seven-Tulsi phyto-extract per 10 ml rich in Eugenol and Rosmarinic Acid) addresses skin radiance from the inside out.',
  },
  {
    q: 'How do I verify a bottle serial number?',
    a: 'Scan the QR code on the product label or enter its serial number in the product verification portal. Only registered batches are shown as genuine.',
  },
];

export default function PremiumHome() {
  const [selectedPhSample, setSelectedPhSample] = useState(PH_STRIP_SAMPLES[0]);

  return (
    <main className="min-h-screen bg-[#14291F] text-[#FAF7F2] font-sans">
      <SEO
        title="Bhumivera Organics (Est. 2016) | The Transparent Maison — 100% Active % Disclosed Cold-Pressed Botanical Skincare & Inside-Out Rituals"
        description="Minimalist gave you synthetic transparency. Heritage Ayurveda gave you botanicals with zero disclosure. Bhumivera gives you 100% active percentage disclosure in sub-28°C cold-pressed botanical formulas calibrated to pH 5.0–5.5."
        keywords="Bhumivera Organics, The Transparent Maison, 100% label disclosed botanical skincare India, 3% activated charcoal face wash, 4% sea buckthorn face wash, 25mg reetha 20mg amla shampoo, kalpvriksh satva 7 tulsi cortisol adaptogen drops"
        route="/"
        ogImage={HOME_VISUAL_ASSETS.heroPrimary}
        faqs={HOME_CONSCIOUS_FAQS}
      />

      {/* HERO SECTION: THE TRANSPARENT MAISON */}
      <section className="premium-home-hero relative isolate min-h-[82svh] overflow-hidden bg-[#14291F]">
        <div className="absolute inset-0 -z-20">
          <img
            src={HOME_VISUAL_ASSETS.heroPrimary}
            alt="Himalayan Sea Buckthorn harvest in Ladakh mountain valley"
            className="premium-home-hero__image h-full w-full object-cover object-center opacity-30"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#14291F] via-[#14291F]/88 to-[#14291F]/45" />

        <div className="mx-auto flex min-h-[80svh] max-w-7xl flex-col justify-center px-6 pb-14 pt-24 sm:px-10 lg:pb-20">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D4AF37]/45 bg-[#102219]/90 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#FCE096]">
            <Leaf size={14} className="text-[#D4AF37]" /> Bhumivera · The Transparent Botanical Maison (Est. 2016)
          </div>
          <h1 className="mt-5 max-w-4xl font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="font-headline-gold">Ayurveda With Clinical Actives.</span>{' '}
            <span className="font-headline-silver">Every Percentage Disclosed.</span>
          </h1>
          <div className="gold-hairline my-5 max-w-xs" />
          <p className="max-w-2xl text-sm font-light leading-relaxed text-[#DFD7C4] sm:text-base">
            Lab-serum brands gave you transparency with sterile synthetic chemicals. Legacy Ayurvedic houses gave you botanicals hidden behind <span className="font-mono text-[#FCE096]">&ldquo;Base Q.S.&rdquo;</span> with zero disclosure. <strong className="text-white">Bhumivera</strong> gives you <strong className="text-[#FCE096]">100% active percentage &amp; milligram disclosure</strong> in sub-28°C cold-pressed botanical formulas calibrated to skin-identical <strong className="text-[#FCE096]">pH 5.0–5.5</strong>.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#regimen-bundles" className="btn-gold-luxury inline-flex min-h-12 items-center gap-2.5 rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-[0.16em]">
              Shop Complete Daily Regimen (₹1,499) <ArrowRight size={15} />
            </a>
            <a href="#live-batch-coa" className="btn-silver-luxury inline-flex min-h-12 items-center gap-2.5 rounded-full px-6 py-3.5 text-xs font-semibold uppercase tracking-wider">
              <QrCode size={16} className="text-[#D4AF37]" /> Verify Bottle Serial &amp; Lab COA
            </a>
            <Link to="/shop" className="inline-flex min-h-12 items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#FCE096] hover:text-white">
              Explore All 6 SKUs <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <BestSellersToday />

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-10">
        {/* 4 PILLAR TILES */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {tiles.map((tile) => (
            <Link
              key={tile.to}
              to={tile.to}
              className="flex min-h-[112px] flex-col justify-between rounded-2xl border border-[#244A38] bg-[#102219] p-4 transition hover:border-[#D4AF37]/60 active:scale-[0.98]"
            >
              <tile.icon size={22} className="text-[#D4AF37]" />
              <div>
                <p className="font-serif text-base font-bold">{tile.label}</p>
                <p className="text-[11px] text-[#9BB0A5]">{tile.note}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Product authenticity is checked against the live batch registry. */}
        <div id="live-batch-coa" className="mt-12 rounded-3xl border border-[#D4AF37]/45 bg-[#102219] p-6 sm:p-9 shadow-2xl">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#14291F] px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#FCE096]">
                <QrCode size={13} className="text-[#D4AF37]" /> Product Authenticity
              </span>
              <h2 className="mt-4 font-serif text-2xl font-bold sm:text-4xl">
                <span className="font-headline-gold">Verify a product</span>{' '}
                <span className="font-headline-silver">against its registered batch</span>
              </h2>
              <p className="mt-3 max-w-2xl text-xs leading-relaxed text-[#DFD7C4] sm:text-sm">
                Scan the QR on your product or enter its unique code to view registered batch details and expiry information.
              </p>
            </div>
            <Link to="/verify" className="btn-gold-luxury inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={16} /> Verify product
            </Link>
          </div>
        </div>

        {/* STRATEGIC PLAY 1: PRICING & UNIT ECONOMICS FUNNEL — CURATED REGIMEN BUNDLES (AOV > ₹1,200) */}
        <div id="regimen-bundles" className="mt-14">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-sub-gold inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.26em]">
                <Layers size={14} className="text-[#D4AF37]" /> Complete Botanical Regimens · Architectural Value
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold sm:text-4xl">
                <span className="font-headline-gold">Curated Daily Rituals</span>{' '}
                <span className="font-headline-silver">&amp; Inside-Out Systems</span>
              </h2>
              <div className="gold-hairline my-3 w-24" />
            </div>
            <p className="max-w-md text-xs text-[#DFD7C4] leading-relaxed">
              True skin and scalp transformation requires a cohesive pH-calibrated system rather than isolated single bottles. Save up to ₹845 with our curated Regimen Sets.
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {(MAISON_REGIMEN_BUNDLES || []).map((bundle) => (
              <article
                key={bundle.id}
                className="flex flex-col justify-between rounded-3xl border border-[#D4AF37]/40 bg-[#102219] p-6 shadow-xl transition hover:border-[#D4AF37]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#FCE096]">
                      {bundle.badge}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400">{bundle.batchAllocation}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2"><Link to={`/combo/${bundle.id}`} className="font-serif text-xl font-bold text-white hover:text-[#FCE096]">{bundle.name}</Link><span className="shrink-0 rounded-full border border-[#D4AF37]/50 bg-[#070a0e] px-2.5 py-1 font-mono text-xs font-bold text-[#FCE096]">★ {bundle.rating || 4.92} ({bundle.reviews || 378})</span></div>
                  <p className="mt-1 text-xs text-[#DFD7C4] leading-relaxed">{bundle.tagline}</p>

                  <ul className="mt-4 space-y-2.5 border-t border-[#244A38] pt-4 text-xs">
                    {bundle.items.map((item) => (
                      <li key={item.id} className="flex items-start gap-2.5">
                        <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                        <div>
                          <span className="font-semibold text-white">{item.name}</span>
                          <span className="ml-1.5 font-mono text-[10px] text-[#FCE096]">(₹{item.price})</span>
                          <p className="text-[11px] text-[#9BB0A5]">{item.active}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 border-t border-[#244A38] pt-4">
                  <Link to={`/combo/${bundle.id}`} className="inline-flex text-xs font-bold uppercase tracking-wider text-[#FCE096] hover:text-white">
                    View regimen details <ArrowRight size={14} className="ml-1" />
                  </Link>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="font-serif text-2xl font-bold text-[#FCE096]">₹{bundle.bundlePrice}</span>
                      <span className="ml-2 text-xs text-[#9BB0A5] line-through">MRP ₹{bundle.mrpTotal}</span>
                      <span className="ml-2 rounded bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
                        Save ₹{bundle.savings}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/combo/${bundle.id}`}
                    className="btn-gold-luxury mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-bold uppercase tracking-widest"
                  >
                    <ShoppingBag size={15} /> View regimen &amp; add to bag
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* STRATEGIC PLAY 3: REFRAME THE INGESTIBLE 7-TULSI SKU AS AN INSIDE-OUT SKIN-CLEARING & CORTISOL ADAPTOGEN */}
        <div className="mt-16 rounded-3xl border border-[#D4AF37]/40 bg-gradient-to-br from-[#102219] via-[#14291F] to-[#0D1C14] p-6 sm:p-10 shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#070a0e] px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#FCE096]">
                <Droplets size={13} className="text-[#D4AF37]" /> Unified Inside-Out Botanical Ritual
              </span>
              <h2 className="mt-4 font-serif text-2xl font-bold sm:text-4xl">
                <span className="font-headline-gold">Why Clear Skin Starts</span>{' '}
                <span className="font-headline-silver">With Your Cortisol &amp; Gut Axis</span>
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#DFD7C4]">
                Topical cleansers alone cannot stop stress-induced sebum spikes or systemic oxidative dullness. That is why <strong className="text-white">Kalpvriksh Satva Tulsi (30 ml | ₹499)</strong> is formulated at a <strong className="text-[#FCE096]">90% active concentration (9.0 ml extract per 10 ml)</strong> across 7 rare Tulsi cultivars (Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi).
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#244A38] bg-[#070a0e]/70 p-4">
                  <p className="font-mono text-[10px] font-bold uppercase text-[#FCE096]">Step 01 · External Acid-Mantle Care</p>
                  <p className="mt-1 text-xs text-[#DFD7C4]">
                    3% Activated Charcoal or 4% Himalayan Sea Buckthorn Face Wash clears PM2.5 pore congestion and replenishes Omega-7 lipids at pH 5.4.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#244A38] bg-[#070a0e]/70 p-4">
                  <p className="font-mono text-[10px] font-bold uppercase text-emerald-400">Step 02 · Internal Cortisol Adaptogen</p>
                  <p className="mt-1 text-xs text-[#DFD7C4]">
                    3–4 drops of 7-Tulsi Elixir in warm water twice daily deliver Eugenol, Ursolic Acid &amp; Rosmarinic Acid to calm cortisol spikes from within.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/products/kalpvriksh-satva-tulsi-7-tulsi-extract"
                  className="btn-gold-luxury inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider"
                >
                  Inspect 7-Tulsi Cellular Drops <ArrowRight size={14} />
                </Link>
                <a
                  href="#regimen-bundles"
                  className="btn-silver-luxury inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                >
                  Bundle Inside-Out Ritual (₹1,299)
                </a>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[#D4AF37]/35 bg-[#070a0e] p-5 text-center">
                <img
                  src="/images/products/bhumivera-kalpvriksh-satva-tulsi-drops.webp"
                  alt="Kalpvriksh Satva 7-Tulsi Ingestible Skin-Clearing & Cortisol Adaptogen"
                  className="mx-auto h-56 w-auto object-contain"
                />
                <p className="mt-3 font-mono text-xs font-bold text-[#FCE096]">
                  9.0 ml Active Seven-Tulsi Extract per 10 ml (90% Potency)
                </p>
                <p className="mt-1 text-[11px] text-[#9BB0A5]">
                  Van · Sweet · Marua · Bisva · Kala · Rama · Lemon Tulsi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* STRATEGIC PLAY 4: INGREDIENT VERIFICATION & DE-INFLUENCING PROOF LAB */}
        <div className="mt-16">
          <p className="font-sub-gold inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.26em]">
            <ThermometerSnowflake size={14} className="text-[#D4AF37]" /> Ingredient Verification Proof · De-Influencing the Market
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold sm:text-4xl">
            <span className="font-headline-gold">Interactive pH Strip Assay</span>{' '}
            <span className="font-headline-silver">&amp; The 2026 Transparent Maison Matrix</span>
          </h2>
          <div className="gold-hairline my-3 w-24" />

          {/* Interactive pH Strip Tester */}
          <div className="mt-6 rounded-3xl border border-[#244A38] bg-[#102219] p-6 sm:p-8">
            <h3 className="font-serif text-xl font-bold text-white">
              Live Laboratory pH Strip Comparison: Barrier-Safe pH 5.4 vs. Alkaline Store Cleansers
            </h3>
            <p className="mt-1 text-xs text-[#DFD7C4]">
              Select a cleanser below to simulate a colorimetric pH strip assay and inspect its impact on your skin&apos;s protective acid mantle:
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {PH_STRIP_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => setSelectedPhSample(sample)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selectedPhSample.id === sample.id
                      ? 'border-[#D4AF37] bg-[#14291F] shadow-lg'
                      : 'border-[#244A38] bg-[#070a0e]/60 hover:border-[#D4AF37]/50'
                  }`}
                >
                  <span className="font-mono text-xs font-bold" style={{ color: sample.color }}>
                    pH {sample.ph}
                  </span>
                  <p className="mt-1 font-serif text-sm font-bold text-white">{sample.label}</p>
                  <p className="mt-1 text-[11px] text-[#9BB0A5]">{sample.zone}</p>
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-[#D4AF37]/30 bg-[#070a0e] p-5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#FCE096]">
                  Active Assay Readout · {selectedPhSample.zone}
                </span>
                <h4 className="mt-1 font-serif text-xl font-bold text-white">
                  {selectedPhSample.label} — Calibrated at pH {selectedPhSample.ph}
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-[#DFD7C4] leading-relaxed">
                  {selectedPhSample.verdict}
                </p>
              </div>
              <div className="w-full md:w-64 shrink-0 rounded-xl border border-[#244A38] bg-[#102219] p-4 text-center">
                <div className={`h-8 w-full rounded-lg bg-gradient-to-r ${selectedPhSample.stripBg} shadow-inner`} />
                <p className="mt-2 font-mono text-lg font-bold text-white">pH {selectedPhSample.ph}</p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#9BB0A5]">
                  Digital Glass Electrode @ 25°C
                </p>
              </div>
            </div>
          </div>

          {/* 2026 White Space Comparison Table */}
          <div className="mt-8 overflow-x-auto rounded-3xl border border-[#D4AF37]/35 bg-[#102219] shadow-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#244A38] bg-[#070a0e] font-mono text-[11px] uppercase tracking-wider text-[#FCE096]">
                  <th className="p-4 sm:p-5">Formulation Standard</th>
                  <th className="p-4 sm:p-5 text-[#D4AF37]">★ Bhumivera (The Transparent Maison)</th>
                  <th className="p-4 sm:p-5 text-[#9BB0A5]">Synthetic Lab Brands (e.g. Minimalist)</th>
                  <th className="p-4 sm:p-5 text-[#9BB0A5]">Legacy &amp; Viral Ayurveda (Opaque &ldquo;Q.S.&rdquo;)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#244A38]">
                {MARKET_QUADRANT_ROWS.map((row) => (
                  <tr key={row.dimension} className="hover:bg-[#14291F]/60">
                    <td className="p-4 sm:p-5 font-serif font-bold text-white">{row.dimension}</td>
                    <td className="p-4 sm:p-5 font-medium text-[#FCE096] bg-[#14291F]/40">{row.bhumivera}</td>
                    <td className="p-4 sm:p-5 text-[#DFD7C4]">{row.labBrands}</td>
                    <td className="p-4 sm:p-5 text-[#9BB0A5]">{row.opaqueAyurveda}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* WHY BHUMIVERA: 5 PROMISES & STATS */}
        <div className="mt-14">
          <p className="font-sub-gold text-xs font-bold uppercase tracking-[0.26em]">The Maison Standard</p>
          <h2 className="mt-2 font-serif text-2xl font-bold sm:text-4xl">
            <span className="font-headline-gold">Five Promises</span>{' '}
            <span className="font-headline-silver">On Every Bottle</span>
          </h2>
          <div className="gold-hairline my-3 w-24" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {promises.map((item) => (
              <div key={item.title} className="rounded-2xl border border-[#244A38] bg-[#102219] p-4">
                <item.icon size={22} className="text-[#D4AF37]" />
                <h3 className="mt-3 font-serif text-base font-bold">{item.title}</h3>
                <p className="mt-1 text-[11px] font-light leading-5 text-[#9BB0A5]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-[#D4AF37]/25 bg-[#102219] p-4 text-center">
              <p className="font-serif text-2xl font-bold text-[#D4AF37]">{stat.value}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-[#9BB0A5]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CONSCIOUS SKINCARE BUYER FAQ BLOCK */}
        <div className="mt-12 rounded-3xl border border-[#D4AF37]/30 bg-[#102219] p-6 sm:p-10">
          <p className="font-sub-gold text-xs font-bold uppercase tracking-[0.24em]">The Transparent Maison Dossier</p>
          <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl text-white">
            Frequently Asked Questions by Label-Conscious Buyers
          </h2>
          <div className="mt-6 space-y-4">
            {HOME_CONSCIOUS_FAQS.map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-[#244A38] bg-[#070a0e]/70 p-5">
                <h3 className="font-serif text-base font-bold text-[#FCE096]">{item.q}</h3>
                <p className="mt-2 text-xs sm:text-sm text-[#DFD7C4] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
