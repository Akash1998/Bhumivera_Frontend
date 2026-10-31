import React, { useState } from 'react';
import {
  ArrowRight,
  FlaskConical,
  Leaf,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  CheckCircle2,
  ThermometerSnowflake,
  Search,
  Award,
  Lock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO, { GLOBAL_CORPORATE_FAQS } from '../components/SEO';
import { useToast } from '../context/ToastContext';
import {
  HOME_VISUAL_ASSETS,
  SAMPLE_BATCH_COAS,
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
  { icon: ShieldCheck, title: 'Live Batch Traceability', text: 'Every micro-batch is tracked from sub-28°C extraction to sealed cleanroom dispatch.' },
  { icon: Sprout, title: '100% Label Disclosure', text: 'Exact percentages (3% Charcoal, 4% Sea Buckthorn, 25mg Reetha) printed openly.' },
  { icon: Lock, title: 'Artisanal Wax-Sealed Custody', text: 'Hand-sealed gold-foil collar & ±0.5g cleanroom gravimetric verification.' },
];

const stats = [
  { value: '2016', label: 'MPG Group Heritage' },
  { value: '100%', label: 'Active % Disclosed' },
  { value: '<28°C', label: 'Cold-Press Extraction' },
  { value: 'Asansol', label: 'West Bengal HQ (713304)' },
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
    bhumivera: 'Verified micro-batch production logs with serialized cleanroom COA traceability',
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
  ...GLOBAL_CORPORATE_FAQS,
  {
    q: 'What makes Bhumivera "The Transparent Maison" in 2026 personal care?',
    a: 'For years, skincare buyers were forced to choose between sterile synthetic lab brands (which disclose active percentages but rely on harsh chemical isolates) and traditional Ayurvedic brands (which celebrate botanicals but hide behind "Base Q.S." with zero concentration transparency). Bhumivera unites both worlds: cold-pressed Indian botanicals (<28°C) and proven barrier humectants with 100% active percentage and milligram disclosure printed on every bottle.',
  },
  {
    q: 'How does the "Inside-Out Botanical Ritual" with Kalpvriksh Satva 7-Tulsi Drops work for skin clarity?',
    a: 'Breakouts, dullness, and barrier inflammation are driven both externally (urban PM2.5 soot, alkaline cleansers) and internally (cortisol spikes, gut-skin oxidative stress). Pairing our topical pH 5.4 cleansers (3% Activated Charcoal or 4% Himalayan Sea Buckthorn) with 3–4 internal drops of Kalpvriksh Satva Tulsi (9.0 ml Seven-Tulsi phyto-extract per 10 ml rich in Eugenol and Rosmarinic Acid) addresses skin radiance from the inside out.',
  },
];

export default function PremiumHome() {
  const { showToast } = useToast() || {};
  const [serialInput, setSerialInput] = useState('BHMV-2610-SB083');
  const [selectedCoa, setSelectedCoa] = useState(SAMPLE_BATCH_COAS['BHMV-2610-SB083']);
  const [selectedPhSample, setSelectedPhSample] = useState(PH_STRIP_SAMPLES[0]);

  const handleVerifySerial = (e) => {
    if (e) e.preventDefault();
    const code = serialInput.trim().toUpperCase();
    if (!code) return;
    if (SAMPLE_BATCH_COAS[code]) {
      setSelectedCoa(SAMPLE_BATCH_COAS[code]);
      showToast?.(`Loaded sample certificate data for ${code}; this is not a live lab verification.`, 'success');
      return;
    }
    setSelectedCoa(null);
    showToast?.(`No sample certificate is available for ${code}.`, 'error');
  };

  return (
    <main className="min-h-screen bg-[#14291F] text-[#FAF7F2] font-sans">
      <SEO
        title="Bhumivera | The Transparent Maison — Rooted in Heritage Since 2016"
        description="Discover Bhumivera (bhumivera.com). Founded on a decade of family manufacturing heritage with MPG E-Business (Est. 2016), delivering 100% active, milligram-disclosed cold-pressed botanical skincare."
        keywords="Bhumivera, bhumivera.com, The Transparent Maison, Bhumivera Organics India Private Limited, MPG E-Business Private Limited, Dilip Prasad Nonia, Akash Prasad, Akash Prasad, Payal Prasad & Aman Prasad, Asansol West Bengal, 100% active percentage skincare, milligram disclosure"
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
          <div
            role="region"
            aria-label="Bhumivera brand and formulation standards"
            className="mb-1 w-fit max-w-3xl rounded-2xl border border-white/15 bg-[#102219]/45 px-4 py-3 shadow-lg backdrop-blur-md sm:px-5"
          >
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FCE096] sm:text-xs">
              <Leaf size={14} className="shrink-0 text-[#D4AF37]" />
              Bhumivera · The Transparent Maison
            </p>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium text-[#DFD7C4] sm:text-xs">
              <span>Rooted in 2016 heritage</span><span aria-hidden="true" className="text-[#D4AF37]">·</span>
              <span>Fully disclosed actives</span><span aria-hidden="true" className="text-[#D4AF37]">·</span>
              <span>Cold-pressed below 28°C</span><span aria-hidden="true" className="text-[#D4AF37]">·</span>
              <span>Made in Asansol, India</span>
            </p>
          </div>

          <h1 className="mt-5 max-w-4xl font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="font-headline-gold">Ayurveda With Clinical Actives.</span>{' '}
            <span className="font-headline-silver">Every Milligram Disclosed.</span>
          </h1>
          <div className="gold-hairline my-5 max-w-xs" />
          <p className="max-w-2xl text-sm font-light leading-relaxed text-[#DFD7C4] sm:text-base">
            Rooted in a family herbal tradition established in 2016, Bhumivera pairs cold-pressed Indian botanicals with modern actives—fully disclosed, milligram by milligram, and calibrated for thoughtful daily care.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/shop" className="btn-gold-luxury inline-flex min-h-12 items-center gap-2.5 rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-[0.16em]">
              Explore the Collection <ArrowRight size={15} />
            </Link>
            <Link to="/about" className="btn-silver-luxury inline-flex min-h-12 items-center gap-2.5 rounded-full px-6 py-3.5 text-xs font-semibold uppercase tracking-wider">
              <Award size={16} className="text-[#D4AF37]" /> Our Heritage
            </Link>
          </div>
        </div>
      </section>

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

        {/* STRATEGIC PLAY 2: INTERACTIVE HOMEPAGE MICRO-BATCH SERIAL & LAB COA VERIFIER */}
        <div id="live-batch-coa" className="mt-12 rounded-3xl border border-[#D4AF37]/45 bg-[#102219] p-6 sm:p-9 shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#14291F] px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#FCE096]">
                <QrCode size={13} className="text-[#D4AF37]" /> Sample Certificate Preview
              </span>
              <h2 className="mt-4 font-serif text-2xl font-bold sm:text-4xl">
                <span className="font-headline-gold">Interactive Bottle Serial</span>{' '}
                <span className="font-headline-silver">&amp; Lab COA Lookup</span>
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#DFD7C4]">
                This section contains sample certificate fixtures for interface preview only. It does not verify a real bottle or retrieve a live laboratory report. Enter one of the listed sample serials to preview the sample fields.
              </p>

              <form onSubmit={handleVerifySerial} className="mt-5 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={serialInput}
                  onChange={(e) => setSerialInput(e.target.value)}
                  aria-label="Bottle Serial Number"
                  placeholder="e.g. BHMV-2610-SB083"
                  className="flex-1 rounded-xl border border-[#D4AF37]/45 bg-[#070a0e] px-4 py-3 font-mono text-sm uppercase tracking-wider text-[#FCE096] outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="btn-gold-luxury inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider"
                >
                  <Search size={15} /> Pull Lab Certificate
                </button>
              </form>

              <div className="mt-4">
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#9BB0A5] mb-2">
                  Preview Sample Certificate Fixtures:
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(SAMPLE_BATCH_COAS).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setSerialInput(code);
                        setSelectedCoa(SAMPLE_BATCH_COAS[code]);
                      }}
                      className={`rounded-lg border px-3 py-1.5 font-mono text-[11px] transition ${
                        selectedCoa?.serial === code
                          ? 'border-[#D4AF37] bg-[#D4AF37] text-[#102219] font-bold'
                          : 'border-[#244A38] bg-[#14291F] text-[#FCE096] hover:border-[#D4AF37]/60'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {selectedCoa && (
              <div className="rounded-2xl border border-[#D4AF37]/45 bg-[#070a0e] p-5 sm:p-6 shadow-inner">
                <p className="mb-4 rounded-lg border border-amber-300/40 bg-amber-950/40 px-3 py-2 text-xs font-bold text-amber-100">
                  SAMPLE DATA ONLY — NOT A VERIFIED LAB CERTIFICATE OR LIVE INVENTORY RECORD
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#244A38] pb-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                      <CheckCircle2 size={14} /> Sample Certificate Fixture
                    </span>
                    <h3 className="mt-1 font-serif text-lg font-bold text-white">{selectedCoa.productName}</h3>
                  </div>
                  <span className="rounded-lg border border-[#D4AF37]/40 bg-[#102219] px-3 py-1 font-mono text-xs font-bold text-[#FCE096]">
                    {selectedCoa.bottleSequence}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                  <div className="rounded-xl border border-[#244A38] bg-[#102219]/70 p-3">
                    <span className="block font-mono text-[10px] uppercase text-[#9BB0A5]">Serial &amp; Batch</span>
                    <strong className="mt-0.5 block font-mono text-[#FCE096]">{selectedCoa.serial}</strong>
                    <span className="text-[10px] text-[#DFD7C4]">{selectedCoa.batchCode}</span>
                  </div>
                  <div className="rounded-xl border border-[#244A38] bg-[#102219]/70 p-3">
                    <span className="block font-mono text-[10px] uppercase text-[#9BB0A5]">Calibrated pH Assay</span>
                    <strong className="mt-0.5 block text-emerald-400">{selectedCoa.calibratedPh}</strong>
                  </div>
                  <div className="rounded-xl border border-[#244A38] bg-[#102219]/70 p-3">
                    <span className="block font-mono text-[10px] uppercase text-[#9BB0A5]">Extraction Temp</span>
                    <strong className="mt-0.5 block text-white">{selectedCoa.extractionTemp}</strong>
                  </div>
                  <div className="rounded-xl border border-[#244A38] bg-[#102219]/70 p-3">
                    <span className="block font-mono text-[10px] uppercase text-[#9BB0A5]">Microbiological Assay</span>
                    <strong className="mt-0.5 block text-white">{selectedCoa.microbiologicalAssay}</strong>
                  </div>
                  <div className="rounded-xl border border-[#244A38] bg-[#102219]/70 p-3">
                    <span className="block font-mono text-[10px] uppercase text-[#9BB0A5]">Heavy Metal Screen</span>
                    <strong className="mt-0.5 block text-white">{selectedCoa.heavyMetals}</strong>
                  </div>
                  <div className="rounded-xl border border-[#244A38] bg-[#102219]/70 p-3">
                    <span className="block font-mono text-[10px] uppercase text-[#9BB0A5]">Stock status</span>
                    <strong className="mt-0.5 block text-[#FCE096]">No live stock count</strong>
                    <span className="text-[10px] text-[#DFD7C4]">This fixture is illustrative only.</span>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-[#D4AF37]/25 bg-[#102219]/90 p-3 text-xs text-[#DFD7C4]">
                  <p><strong className="text-[#FCE096]">100% Disclosed Actives:</strong> {selectedCoa.disclosedActives}</p>
                  <p className="mt-1 text-[11px] text-[#9BB0A5]"><strong className="text-white">White-Glove Custody:</strong> {selectedCoa.tamperCustody} · {selectedCoa.originLot}</p>
                </div>
              </div>
            )}
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
