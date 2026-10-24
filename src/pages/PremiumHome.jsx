import React, { useEffect, useState } from 'react';
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
  Building2,
  Search,
  Layers,
  Lock,
  Activity,
  Microscope,
  ExternalLink,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getActiveReviewsStore, getReviewsForProduct } from '../data/bhumiveraReviewsData';
import {
  HOME_VISUAL_ASSETS,
  BHUMIVERA_6_PRODUCTS,
  MAISON_REGIMEN_BUNDLES,
  SAMPLE_BATCH_COAS,
  GUT_SKIN_AXIS_CASCADE_STAGES,
  COMPETITIVE_D2C_MATRIX,
  OMNICHANNEL_DISTRIBUTION_TABLE,
  SCALING_ROADMAP_PHASES,
} from '../data/bhumiveraUniqueData';

const tiles = [
  { to: '/shop', label: 'The 2-Step Protocol', note: '100% Active % Disclosed', icon: ShoppingBag },
  { to: '/science', label: 'Gut-Skin Biochemistry', note: '20X Clinical Dossier', icon: Microscope },
  { to: '/verify', label: 'On-Bottle QR Lab COA', note: '0.000 ppm Pesticide Verified', icon: QrCode },
  { to: '/guides', label: 'Cutaneous Ecology Journal', note: 'Peer-Reviewed Monographs', icon: FlaskConical },
];

const promises = [
  { icon: Leaf, title: 'Sub-28°C Cold-Extracted', text: 'Extracted below 28°C in Ladakh & Bundelkhand, preserving fragile Omega-7 and saving 60% thermal energy.' },
  { icon: FlaskConical, title: 'pH 5.3–5.5 Postbiotic', text: 'Calibrated to the stratum corneum acid mantle with Lactobacillus ferments and non-stripping glucosides.' },
  { icon: ShieldCheck, title: 'Biophotonic UV Glass', text: 'Zero virgin petroleum plastic; filters visible light (450–720 nm) to protect bio-actives without synthetic preservatives.' },
  { icon: Sprout, title: '100% Label Stoichiometry', text: 'Exact active percentages (4% Sea Buckthorn, 9.0ml/10ml 7-Tulsi, 3% Carbon) disclosed openly on every vessel.' },
  { icon: Lock, title: 'Dual Statutory Compliance', text: 'FSSAI Ayush-Aahar (Step 1) + Cosmetics Rules 2020 (Step 2) in a Legal Metrology 2011 compliant dual-panel box.' },
];

const stats = [
  { value: '₹1,199', label: '30-Day 2-Step Protocol (MRP ₹1,498)' },
  { value: '90%', label: '7-Tulsi Bio-Extract Potency (9ml/10ml)' },
  { value: '<28°C', label: 'Sub-Zero Cold Extraction Standard' },
  { value: 'pH 5.42', label: 'Postbiotic Acid-Mantle Calibration' },
];

const PH_STRIP_SAMPLES = [
  {
    id: 'bhumivera-sb',
    label: 'Step 2: Bhumivera 4% Sea Buckthorn Postbiotic Emulsion',
    ph: '5.42',
    zone: 'Optimal Acid Mantle & Commensal Microbiome Window (pH 5.3–5.5)',
    color: '#D4AF37',
    stripBg: 'from-amber-400 to-yellow-500',
    verdict: 'Preserves intercellular ceramide lamellae and commensal S. epidermidis while inhibiting virulent C. acnes IA1 via 1.5% Lactobacillus ferments + 4% Omega-7.',
  },
  {
    id: 'bhumivera-mist',
    label: 'Phase 2: Bhumivera Fermented 7-Tulsi Cellular Hydration Mist',
    ph: '5.30',
    zone: 'Post-Rinse Hard-Water Alkalinity Buffer (pH 5.2–5.4)',
    color: '#10B981',
    stripBg: 'from-emerald-400 to-amber-400',
    verdict: 'Immediately neutralizes pH 7.8–8.5 Indian municipal tap-water carbonate residue within 5 seconds of misting onto damp skin.',
  },
  {
    id: 'synthetic-acid-peel',
    label: 'Aggressive Synthetic AHA/BHA Over-Exfoliation',
    ph: '3.10',
    zone: 'Corneocyte-Stripping Hyper-Acidic Zone (pH < 3.5)',
    color: '#F97316',
    stripBg: 'from-rose-500 to-orange-500',
    verdict: 'Chronic unbuffered acid stripping erodes stratum corneum lipid bilayers, triggering neurogenic erythema and defenseless barrier permeability.',
  },
  {
    id: 'alkaline-cleanser',
    label: 'Conventional SLS/Soap Foaming Wash',
    ph: '8.70',
    zone: 'Alkaline Barrier-Destroying Zone (pH 8.0–9.5)',
    color: '#EF4444',
    stripBg: 'from-teal-600 to-blue-800',
    verdict: 'High-pH detergents denature kallikrein barrier enzymes, strip protective sebum, and accelerate virulent C. acnes colonization.',
  },
];

const HOME_CONSCIOUS_FAQS = [
  {
    q: 'Why can’t chronic acne and inflammatory breakouts be permanently resolved with topical serums alone?',
    a: 'Clinical dermatology and gastroenterology confirm the bidirectional gut-skin axis: intestinal mucosal permeability ("leaky gut") allows bacterial lipopolysaccharides (LPS) to enter systemic circulation, upregulating pro-inflammatory cytokines (TNF-α, IL-6, and IL-17). These cytokines stimulate sebaceous gland hyperplasia and alter sebum lipids from within, while harsh topical acids and sulfates strip the outer acid mantle. Bhumivera’s Synchronized 2-Step Protocol resolves both pathways simultaneously.',
  },
  {
    q: 'How does The Biotic Cellular Reset: 2-Step Gut-Skin Protocol (₹1,199) work daily?',
    a: 'Step 1 (Internal Pathway): Blend 4 concentrated drops of Kalpvriksh Satva 7-Tulsi Cellular Reset Drops (9.0 ml active extract per 10 ml across Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi) into 100 ml of lukewarm water every morning on an empty stomach to downregulate intestinal COX-2 and suppress circulating TNF-α and IL-6. Step 2 (External Pathway): Massage 2 pumps of Himalayan Sea Buckthorn Postbiotic Cellular Emulsion (4% sub-28°C Ladakh Sea Buckthorn Omega-7 + 1.5% Lactobacillus ferments + 5% Glycerin) onto damp skin morning and night at pH 5.42.',
  },
  {
    q: 'How do I verify my bottle’s pH 5.3–5.5 calibration, pesticide-free status, and Ladakh harvest coordinates?',
    a: 'Every Biophotonic UV glass bottle is compounded in serialized 250-unit micro-batches. Enter your bottle serial number (e.g., BHMV-2610-SB083 or BHMV-2610-TL019) in the On-Bottle QR Batch COA Verifier below or on /verify to inspect third-party GC-MS/MS 0.000 ppm pesticide certificates, ICP-MS heavy metal screens, digital electrode pH logs, and GPS harvest coordinates in Ladakh (34.5821° N, 77.4682° E).',
  },
];

export default function PremiumHome() {
  const { addToCart } = useCart() || {};
  const { showToast } = useToast() || {};
  const navigate = useNavigate();

  const [serialInput, setSerialInput] = useState('BHMV-2610-SB083');
  const [selectedCoa, setSelectedCoa] = useState(SAMPLE_BATCH_COAS['BHMV-2610-SB083']);
  const [selectedPhSample, setSelectedPhSample] = useState(PH_STRIP_SAMPLES[0]);
  const [activeCascadeIdx, setActiveCascadeIdx] = useState(0);
  const [subscriptionMode, setSubscriptionMode] = useState(true);
  const [allStoreReviews, setAllStoreReviews] = useState(() => getActiveReviewsStore());
  const [homeReviewSkuFilter, setHomeReviewSkuFilter] = useState('all');
  const [homeReviewVisibleCount, setHomeReviewVisibleCount] = useState(12);

  useEffect(() => {
    const syncReviews = () => setAllStoreReviews(getActiveReviewsStore());
    window.addEventListener('bhumivera:reviews-updated', syncReviews);
    return () => window.removeEventListener('bhumivera:reviews-updated', syncReviews);
  }, []);

  // Interactive Diagnostic Gut-Skin Quiz State
  const [quizAnswers, setQuizAnswers] = useState({
    digestion: 'bloating_stress',
    breakoutZone: 'jawline_cheeks',
    cleanserHistory: 'acid_sulfate_stripping',
    contactHandle: '',
  });
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleVerifySerial = (e) => {
    if (e) e.preventDefault();
    const code = serialInput.trim().toUpperCase();
    if (!code) return;
    if (SAMPLE_BATCH_COAS[code]) {
      setSelectedCoa(SAMPLE_BATCH_COAS[code]);
      showToast?.(`Verified ${code} against NABL Third-Party Batch Registry`, 'success');
      return;
    }
    const bottleNum = String((code.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 250) + 1).padStart(3, '0');
    setSelectedCoa({
      serial: code,
      batchCode: 'BATCH-04/26-BV',
      productName: 'Bhumivera Biophotonic UV Glass Micro-Batch Formulation (250-Unit Run)',
      bottleSequence: `Biophotonic Vessel #${bottleNum} of 250`,
      remainingInBatch: 83,
      pressedDate: '2026-10-18',
      extractionTemp: '26.4°C (Sub-28°C Cold-Extracted · 60% Thermal Energy Saved)',
      calibratedPh: '5.42 pH (at 25.0°C Digital Electrode)',
      microbiologicalAssay: 'TAMC < 10 CFU/ml · Zero Pathogens (ISO 17516)',
      heavyMetals: 'Pb <0.02 ppm · As <0.01 ppm · Hg ND · Cd ND (ICP-MS)',
      pesticideResidue: '0.000 ppm Across 210 Pesticides (GC-MS/MS Verified)',
      harvestCoordinates: 'Nubra & Spiti Valley Cooperative (34.5821° N, 77.4682° E · 11,420 ft)',
      regulatoryLicense: 'FSSAI Ayush-Aahar + Cosmetics Rules 2020 · Legal Metrology 2011',
      disclosedActives: '100% Label-Disclosed Active Stoichiometry Verified on Biophotonic Vessel',
      tamperCustody: 'Biophotonic UV Glass · Artisanal Wax-Sealed & Gold-Foil Collar Intact',
      originLot: 'Bhumivera Cleanroom Compounding Registry #BV-2026-Q4',
    });
    showToast?.(`Lab COA retrieved for ${code}`, 'success');
  };

  const handleAddProtocolProduct = async (productId = 3, goCheckout = false) => {
    const targetProduct =
      (BHUMIVERA_6_PRODUCTS || []).find((p) => Number(p.id) === Number(productId)) ||
      BHUMIVERA_6_PRODUCTS[2];
    if (typeof addToCart === 'function' && targetProduct) {
      const priceToUse = subscriptionMode && Number(targetProduct.id) === 3 ? 1019 : targetProduct.price;
      await addToCart(
        {
          ...targetProduct,
          id: targetProduct.id,
          product_id: targetProduct.id,
          price: targetProduct.mrp || targetProduct.price,
          discount_price: priceToUse,
          quantity: 250,
          stock: 250,
          status: 'active',
        },
        1
      );
      if (goCheckout) {
        navigate('/checkout');
      }
    }
  };

  const handleAddBundleToCart = async (bundle) => {
    const mappedId = bundle.id === 'bundle-inside-out-clarifying' ? 1 : bundle.id === 'bundle-complete-microbiome-vault' ? 4 : 3;
    const baseProd = (BHUMIVERA_6_PRODUCTS || []).find((p) => p.id === mappedId) || BHUMIVERA_6_PRODUCTS[2];
    if (typeof addToCart === 'function') {
      await addToCart(
        {
          ...baseProd,
          id: baseProd.id,
          product_id: baseProd.id,
          name: bundle.name,
          price: bundle.mrpTotal,
          discount_price: subscriptionMode && bundle.subscriptionPrice ? bundle.subscriptionPrice : bundle.bundlePrice,
          image_url: bundle.image_url,
          category_name: 'Synchronized Gut-Skin Protocol',
          quantity: 250,
          stock: 250,
          status: 'active',
        },
        1
      );
    }
  };

  const recommendedQuizBundle =
    quizAnswers.breakoutZone === 'tzone_pm25' ? MAISON_REGIMEN_BUNDLES[1] : MAISON_REGIMEN_BUNDLES[0];

  return (
    <main className="min-h-screen bg-[#14291F] text-[#FAF7F2] font-sans">
      <SEO
        title="Bhumivera Organics (Est. 2016) | The Synchronized Gut-Skin Biotic Protocol — 7-Tulsi Cellular Reset & 4% Sea Buckthorn Postbiotic Emulsion"
        description="India's first Synchronized Inside-Out Gut-Skin Biotic Protocol (₹1,199). Uniting Step 1 Kalpvriksh Satva 7-Tulsi Cellular Reset Drops (90% extract, COX-2 & TNF-α/IL-6 suppression) with Step 2 Himalayan Sea Buckthorn Postbiotic Cellular Emulsion (4% Omega-7, pH 5.3–5.5) in Biophotonic UV glass."
        keywords="Bhumivera Organics, gut skin axis acne India, buy gut skin reset protocol, inside out acne treatment kit, best pH 5.5 face wash India, Himalayan sea buckthorn skin barrier benefits, 7 tulsi drops for skin inflammation, leaky gut cystic acne connection"
        route="/"
        ogImage={HOME_VISUAL_ASSETS.heroPrimary}
        faqs={HOME_CONSCIOUS_FAQS}
      />

      {/* LIVE MICRO-BATCH & BIOPHOTONIC UV GLASS TRACEABILITY TICKER */}
      <div className="border-b border-[#D4AF37]/35 bg-[#0D1C14] px-4 py-2.5 text-center text-[11px] sm:text-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1.5 font-mono font-bold uppercase tracking-widest text-[#FCE096]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Batch 04/26 · Biophotonic UV Glass Run
          </span>
          <span className="text-[#DFD7C4]">
            Ladakh Harvest (&gt;11,000 ft) Cold-Extracted at <strong className="text-white">26.4°C</strong> · Acid-Mantle Calibrated at <strong className="text-white">pH 5.42</strong> · <strong className="text-emerald-300">0.000 ppm Pesticides</strong>
          </span>
          <span className="rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#FCE096]">
            38 / 250 Protocol Kits Left
          </span>
          <a href="#live-batch-coa" className="font-semibold text-[#D4AF37] underline underline-offset-4 hover:text-[#FCE096]">
            Verify QR Lab COA →
          </a>
        </div>
      </div>

      {/* HERO SECTION: THE SYNCHRONIZED GUT-SKIN BIOTIC PROTOCOL */}
      <section className="premium-home-hero relative isolate min-h-[85svh] overflow-hidden bg-[#14291F]">
        <div className="absolute inset-0 -z-20">
          <img
            src={HOME_VISUAL_ASSETS.heroPrimary}
            alt="Wild Himalayan Sea Buckthorn harvest above 11,000 feet in Ladakh"
            className="premium-home-hero__image h-full w-full object-cover object-center opacity-28"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#14291F] via-[#14291F]/92 to-[#14291F]/55" />

        <div className="mx-auto grid min-h-[82svh] max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-16 pt-20 sm:px-10 lg:grid-cols-12 lg:pb-20">
          <div className="lg:col-span-7">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D4AF37]/45 bg-[#102219]/90 px-4 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#FCE096]">
              <Microscope size={14} className="text-[#D4AF37]" /> Category Pioneer · Synchronized Inside-Out Biotic Dermatology
            </div>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
              <span className="font-headline-gold">The Biotic Cellular Reset:</span>{' '}
              <span className="font-headline-silver">The 2-Step Gut-Skin Protocol.</span>
            </h1>
            <div className="gold-hairline my-5 max-w-xs" />
            <p className="max-w-2xl text-sm font-light leading-relaxed text-[#DFD7C4] sm:text-base">
              Chronic inflammatory breakouts and barrier sensitivity cannot be permanently resolved by topical serums alone. When intestinal tight junctions loosen, circulating bacterial endotoxins (<span className="font-mono text-[#FCE096]">LPS</span>) upregulate <strong className="text-white">TNF-α, IL-6, and IL-17 cytokines</strong> that trigger sebaceous hyperplasia—while harsh synthetic acids strip your outer acid mantle. <strong className="text-[#FCE096]">Bhumivera</strong> unites a <strong className="text-white">90% 7-Tulsi internal cellular reset</strong> with a <strong className="text-white">4% Ladakh Sea Buckthorn postbiotic topical emulsion</strong> at <strong className="text-[#FCE096]">pH 5.3–5.5</strong>.
            </p>

            {/* SUBSCRIPTION VS ONE-TIME PROTOCOL SELECTOR */}
            <div className="mt-6 max-w-xl rounded-2xl border border-[#D4AF37]/40 bg-[#102219]/95 p-4 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#244A38]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 font-bold">
                  ★ 30-Day Synchronized Combination Offer (Step 1 Internal + Step 2 External)
                </span>
                <span className="font-mono text-[10px] text-[#FCE096]">
                  FSSAI Ayush-Aahar + Cosmetics Rules 2020
                </span>
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSubscriptionMode(true)}
                  className={`rounded-xl border p-3 text-left transition ${
                    subscriptionMode
                      ? 'border-[#D4AF37] bg-[#14291F] shadow-md'
                      : 'border-[#244A38] bg-[#070a0e]/60 hover:border-[#D4AF37]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1">
                      <RefreshCw size={11} /> 25-Day Auto-Replenish
                    </span>
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-300">
                      Extra 15% Off
                    </span>
                  </div>
                  <p className="mt-1 font-serif text-xl font-bold text-[#FCE096]">
                    ₹1,019 <span className="text-xs font-normal text-[#9BB0A5] line-through">₹1,498</span>
                  </p>
                  <p className="text-[10px] text-[#DFD7C4]">WhatsApp 25-day reorder alert · Cancel anytime</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSubscriptionMode(false)}
                  className={`rounded-xl border p-3 text-left transition ${
                    !subscriptionMode
                      ? 'border-[#D4AF37] bg-[#14291F] shadow-md'
                      : 'border-[#244A38] bg-[#070a0e]/60 hover:border-[#D4AF37]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#FCE096]">
                      Single 30-Day Protocol Kit
                    </span>
                    <span className="rounded bg-[#D4AF37]/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#FCE096]">
                      Save ₹299
                    </span>
                  </div>
                  <p className="mt-1 font-serif text-xl font-bold text-white">
                    ₹1,199 <span className="text-xs font-normal text-[#9BB0A5] line-through">₹1,498</span>
                  </p>
                  <p className="text-[10px] text-[#DFD7C4]">30 ml 7-Tulsi Drops + 100 ml Sea Buckthorn Emulsion</p>
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleAddProtocolProduct(3, true)}
                  className="btn-gold-luxury flex-1 min-w-[220px] inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em]"
                >
                  <Zap size={15} /> 1-Click Checkout Protocol (₹{subscriptionMode ? '1,019' : '1,199'})
                </button>
                <button
                  type="button"
                  onClick={() => handleAddProtocolProduct(3, false)}
                  className="btn-silver-luxury inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
                >
                  <ShoppingBag size={15} className="text-[#D4AF37]" /> Add to Bag
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-[#DFD7C4]">
              <a href="#gut-skin-quiz" className="font-semibold text-[#FCE096] underline underline-offset-4 hover:text-white">
                Take 60-Second Gut-Skin Diagnostic Quiz →
              </a>
              <span className="text-[#244A38]">•</span>
              <a href="#biochemical-cascade" className="font-semibold text-[#DFD7C4] hover:text-[#FCE096]">
                Inspect TNF-α / IL-6 Biochemical Cascade →
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: SYNCHRONIZED 2-STEP ARCHITECTURE VISUAL CARD */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[#D4AF37]/45 bg-[#102219]/95 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#244A38] pb-3">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#FCE096]">
                  Physiological Protocol Architecture
                </span>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
                  Biophotonic UV Glass
                </span>
              </div>

              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#070a0e]/85 p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/products/bhumivera-kalpvriksh-satva-tulsi-drops.webp"
                      alt="Step 1 Internal Kalpvriksh Satva 7-Tulsi Cellular Reset Drops"
                      className="h-16 w-16 rounded-xl bg-[#102219] object-contain p-1.5 border border-[#D4AF37]/30"
                    />
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        Step 1: Internal Pathway (7:00 AM Empty Stomach)
                      </span>
                      <h2 className="font-serif text-base font-bold text-white">
                        Kalpvriksh Satva 7-Tulsi Cellular Reset Drops
                      </h2>
                      <p className="font-mono text-[11px] text-[#FCE096]">
                        9.0 ml / 10 ml Extract · Van, Sweet, Marua, Bisva, Kala, Rama &amp; Lemon Tulsi
                      </p>
                    </div>
                  </div>
                  <p className="mt-2.5 text-xs text-[#DFD7C4] leading-relaxed">
                    <strong className="text-white">Mechanism:</strong> Standardized Eugenol (≥42%), Rosmarinic Acid (≥18%) &amp; Ursolic Acid (≥12%) downregulate intestinal <span className="font-mono text-[#FCE096]">COX-2</span>, seal gut mucosal <span className="font-mono text-[#FCE096]">ZO-1/occludin</span> junctions, and suppress systemic <span className="font-mono text-[#FCE096]">TNF-α &amp; IL-6</span> cytokines.
                  </p>
                  <p className="mt-1.5 font-mono text-[10px] text-emerald-300">
                    Ritual: 4 drops in 100 ml lukewarm water every morning · FSSAI Ayush-Aahar
                  </p>
                </div>

                <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#070a0e]/85 p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/products/bhumivera-seabuckthorn-luxury-face-wash.webp"
                      alt="Step 2 External Himalayan Sea Buckthorn Postbiotic Cellular Emulsion"
                      className="h-16 w-16 rounded-xl bg-[#102219] object-contain p-1.5 border border-[#D4AF37]/30"
                    />
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FCE096]">
                        Step 2: External Pathway (AM &amp; PM Facial Ritual)
                      </span>
                      <h2 className="font-serif text-base font-bold text-white">
                        Himalayan Sea Buckthorn Postbiotic Emulsion
                      </h2>
                      <p className="font-mono text-[11px] text-[#FCE096]">
                        4% Wild Ladakh Sea Buckthorn + 5% Glycerin + 1.5% Lactobacillus Ferment
                      </p>
                    </div>
                  </div>
                  <p className="mt-2.5 text-xs text-[#DFD7C4] leading-relaxed">
                    <strong className="text-white">Mechanism:</strong> High natural density of <span className="font-mono text-[#FCE096]">Omega-7 palmitoleic acid (≥34%)</span> and native bio-ferulic acid in a non-stripping glucoside micro-emulsion calibrated strictly at <span className="font-mono text-[#FCE096]">pH 5.3–5.5</span> to fortify the acid mantle.
                  </p>
                  <p className="mt-1.5 font-mono text-[10px] text-[#FCE096]">
                    Ritual: 2 pumps massaged 45s onto damp skin AM &amp; PM · Cosmetics Rules 2020
                  </p>
                </div>
              </div>
            </div>
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

        {/* 20X FORMULATION ENHANCEMENT: INTERACTIVE 4-STAGE BIDIRECTIONAL GUT-SKIN AXIS BIOCHEMICAL CASCADE */}
        <div id="biochemical-cascade" className="mt-14 rounded-3xl border border-[#D4AF37]/45 bg-[#102219] p-6 sm:p-9 shadow-2xl">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end border-b border-[#244A38] pb-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#070a0e] px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#FCE096]">
                <Activity size={13} className="text-[#D4AF37]" /> 20X Biochemical &amp; Clinical Formulation Architecture
              </span>
              <h2 className="mt-3 font-serif text-2xl font-bold sm:text-4xl">
                <span className="font-headline-gold">The Bidirectional Gut-Skin Axis</span>{' '}
                <span className="font-headline-silver">Biochemical Cascade</span>
              </h2>
            </div>
            <p className="max-w-md text-xs text-[#DFD7C4] leading-relaxed">
              Explore the 4-stage molecular pathway linking intestinal mucosal permeability to cutaneous inflammation—and how our Synchronized Biotic Protocol intervenes at every receptor.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(GUT_SKIN_AXIS_CASCADE_STAGES || []).map((stage, idx) => (
              <button
                key={stage.step}
                type="button"
                onClick={() => setActiveCascadeIdx(idx)}
                className={`rounded-2xl border p-4 text-left transition ${
                  activeCascadeIdx === idx
                    ? 'border-[#D4AF37] bg-[#14291F] shadow-xl'
                    : 'border-[#244A38] bg-[#070a0e]/70 hover:border-[#D4AF37]/50'
                }`}
              >
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FCE096]">
                  {stage.step}
                </span>
                <h3 className="mt-1.5 font-serif text-base font-bold text-white">{stage.title}</h3>
                <p className="mt-2 text-[11px] text-[#9BB0A5] line-clamp-2">{stage.molecularMarkers}</p>
              </button>
            ))}
          </div>

          {GUT_SKIN_AXIS_CASCADE_STAGES?.[activeCascadeIdx] && (
            <div className="mt-6 rounded-2xl border border-[#D4AF37]/40 bg-[#070a0e] p-6 grid gap-6 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 space-y-3">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  {GUT_SKIN_AXIS_CASCADE_STAGES[activeCascadeIdx].step} · Pathophysiological Mechanism
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  {GUT_SKIN_AXIS_CASCADE_STAGES[activeCascadeIdx].title}
                </h3>
                <p className="text-xs sm:text-sm text-[#DFD7C4] leading-relaxed">
                  {GUT_SKIN_AXIS_CASCADE_STAGES[activeCascadeIdx].biochemistry}
                </p>
                <div className="rounded-xl border border-[#244A38] bg-[#102219]/80 p-3.5 text-xs">
                  <span className="font-mono text-[10px] uppercase text-[#FCE096] block mb-1">
                    Key Molecular &amp; Cytokine Biomarkers:
                  </span>
                  <strong className="text-white font-mono text-[11px]">
                    {GUT_SKIN_AXIS_CASCADE_STAGES[activeCascadeIdx].molecularMarkers}
                  </strong>
                </div>
              </div>
              <div className="lg:col-span-5 rounded-2xl border border-[#D4AF37]/35 bg-[#102219] p-5 space-y-3">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#FCE096] block">
                  Targeted Bhumivera Protocol Intervention
                </span>
                <p className="text-xs sm:text-sm text-white leading-relaxed font-medium">
                  {GUT_SKIN_AXIS_CASCADE_STAGES[activeCascadeIdx].intervention}
                </p>
                <div className="pt-2 border-t border-[#244A38] flex items-center justify-between gap-2">
                  <a
                    href={GUT_SKIN_AXIS_CASCADE_STAGES[activeCascadeIdx].citationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#FCE096] hover:underline"
                  >
                    {GUT_SKIN_AXIS_CASCADE_STAGES[activeCascadeIdx].citationLabel} <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TOFU CONVERSION MECHANISM: INTERACTIVE DIAGNOSTIC GUT-SKIN HEALTH ASSESSMENT QUIZ */}
        <div id="gut-skin-quiz" className="mt-14 rounded-3xl border border-[#D4AF37]/45 bg-gradient-to-br from-[#102219] via-[#14291F] to-[#0D1C14] p-6 sm:p-9 shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#070a0e] px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#FCE096]">
                <Sparkles size={13} className="text-[#D4AF37]" /> Clinical Diagnostic Assessment · 60-Second Protocol Matcher
              </span>
              <h2 className="mt-3 font-serif text-2xl font-bold sm:text-4xl">
                <span className="font-headline-gold">Diagnostic Gut-Skin</span>{' '}
                <span className="font-headline-silver">Health Assessment Quiz</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#DFD7C4] leading-relaxed">
                Identify whether your breakouts and barrier sensitivity are driven by internal intestinal permeability (LPS endotoxemia), cortisol-induced sebum oxidation, or topical acid/sulfate stripping.
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#FCE096] mb-1.5">
                    1. Primary Digestive &amp; Gut-Axis Pattern
                  </label>
                  <select
                    value={quizAnswers.digestion}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, digestion: e.target.value })}
                    className="w-full rounded-xl border border-[#D4AF37]/40 bg-[#070a0e] px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-[#D4AF37]"
                  >
                    <option value="bloating_stress">Post-meal bloating, irregular digestion, or sugar/dairy flare-ups (LPS Endotoxemia)</option>
                    <option value="cortisol_acidity">High work stress, late nights, or gastric acidity spikes (HPA-Cortisol Axis)</option>
                    <option value="antibiotic_history">History of oral antibiotics or processed urban diet (Microbiome Dysbiosis)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#FCE096] mb-1.5">
                    2. Cutaneous Breakout &amp; Redness Topology
                  </label>
                  <select
                    value={quizAnswers.breakoutZone}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, breakoutZone: e.target.value })}
                    className="w-full rounded-xl border border-[#D4AF37]/40 bg-[#070a0e] px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-[#D4AF37]"
                  >
                    <option value="jawline_cheeks">Deep tender papules on cheeks/jawline + persistent red/brown post-acne marks (PIH)</option>
                    <option value="tzone_pm25">Congested T-zone pores, oxidized blackheads, and urban PM2.5 oiliness</option>
                    <option value="dehydrated_reactive">Tight, flaky, redness-prone barrier that stings when applying active serums</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#FCE096] mb-1.5">
                    3. Current Topical Cleanser &amp; Active Exposure
                  </label>
                  <select
                    value={quizAnswers.cleanserHistory}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, cleanserHistory: e.target.value })}
                    className="w-full rounded-xl border border-[#D4AF37]/40 bg-[#070a0e] px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-[#D4AF37]"
                  >
                    <option value="acid_sulfate_stripping">Using salicylic/glycolic acid washes, retinoids, or high-foam sulfate cleansers</option>
                    <option value="herbal_qs">Using generic market herbal washes with undisclosed &ldquo;Base Q.S.&rdquo; ingredients</option>
                    <option value="minimal_routine">Minimal water/cleanser routine seeking clinical barrier protection</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <input
                    type="text"
                    value={quizAnswers.contactHandle}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, contactHandle: e.target.value })}
                    placeholder="Optional Email or WhatsApp for 25-Day Reorder & Clinical Dossier"
                    className="flex-1 rounded-xl border border-[#244A38] bg-[#070a0e] px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setQuizSubmitted(true);
                      showToast?.('Gut-Skin Clinical Diagnostic Profile Generated', 'success');
                    }}
                    className="btn-gold-luxury rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider shrink-0"
                  >
                    Generate Clinical Prescription
                  </button>
                </div>
              </div>
            </div>

            {/* DIAGNOSTIC OUTPUT PRESCRIPTION CARD */}
            <div className="lg:col-span-6 rounded-2xl border border-[#D4AF37]/45 bg-[#070a0e] p-6 shadow-inner">
              <div className="flex items-center justify-between border-b border-[#244A38] pb-4">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    {quizSubmitted ? '✓ Personalized Gut-Skin Axis Prescription Ready' : 'Live Diagnostic Preview'}
                  </span>
                  <h3 className="mt-1 font-serif text-xl font-bold text-white">
                    {recommendedQuizBundle.name}
                  </h3>
                </div>
                <span className="rounded-xl border border-[#D4AF37]/40 bg-[#102219] px-3 py-1.5 font-mono text-xs font-bold text-[#FCE096]">
                  Save ₹{recommendedQuizBundle.savings}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-[#244A38] bg-[#102219]/70 p-3">
                  <span className="font-mono text-[10px] uppercase text-[#9BB0A5] block">Primary Root Trigger</span>
                  <strong className="mt-0.5 block text-[#FCE096]">
                    {quizAnswers.digestion === 'bloating_stress'
                      ? 'Intestinal LPS Endotoxemia + TNF-α/IL-6 Surge'
                      : quizAnswers.digestion === 'cortisol_acidity'
                        ? 'HPA-Axis Cortisol & COX-2 Upregulation'
                        : 'Gut-Skin Microbiome Alpha-Diversity Depletion'}
                  </strong>
                </div>
                <div className="rounded-xl border border-[#244A38] bg-[#102219]/70 p-3">
                  <span className="font-mono text-[10px] uppercase text-[#9BB0A5] block">Estimated Surface pH</span>
                  <strong className="mt-0.5 block text-rose-300">
                    {quizAnswers.cleanserHistory === 'acid_sulfate_stripping'
                      ? 'pH 6.4 – 7.1 (Stripped Lipid Matrix)'
                      : 'pH 5.9 – 6.3 (Unbuffered Acid Mantle)'}
                  </strong>
                  <span className="text-[10px] text-emerald-300">Target Reset: pH 5.30 – 5.45</span>
                </div>
              </div>

              <div className="mt-4 space-y-2.5 text-xs">
                {recommendedQuizBundle.items.map((item) => (
                  <div key={item.name} className="flex items-start gap-2.5 rounded-xl border border-[#244A38]/80 bg-[#102219]/50 p-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-[11px] text-[#9BB0A5]">{item.active}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#244A38] pt-4">
                <div>
                  <span className="font-serif text-2xl font-bold text-[#FCE096]">
                    ₹{subscriptionMode && recommendedQuizBundle.subscriptionPrice ? recommendedQuizBundle.subscriptionPrice : recommendedQuizBundle.bundlePrice}
                  </span>
                  <span className="ml-2 text-xs text-[#9BB0A5] line-through">MRP ₹{recommendedQuizBundle.mrpTotal}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddBundleToCart(recommendedQuizBundle)}
                  className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider"
                >
                  <ShoppingBag size={15} /> Add Prescribed Protocol to Bag
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ON-BOTTLE QR BATCH VERIFICATION & LAB COA LOOKUP */}
        <div id="live-batch-coa" className="mt-14 rounded-3xl border border-[#D4AF37]/45 bg-[#102219] p-6 sm:p-9 shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#14291F] px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#FCE096]">
                <QrCode size={13} className="text-[#D4AF37]" /> On-Bottle Verification Protocol · Zero Greenwashing
              </span>
              <h2 className="mt-4 font-serif text-2xl font-bold sm:text-4xl">
                <span className="font-headline-gold">Serialized Batch COA</span>{' '}
                <span className="font-headline-silver">&amp; Harvest GPS Verifier</span>
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#DFD7C4]">
                Every serialized production batch features a scannable QR code directing you to a third-party analytical laboratory certificate verifying <strong className="text-white">0.000 ppm pesticide residue (GC-MS/MS)</strong>, <strong className="text-white">certified pH batch testing between 5.3 and 5.5</strong>, <strong className="text-white">&lt;28°C sub-zero thermal extraction</strong>, and exact <strong className="text-[#FCE096]">Ladakh &amp; Bundelkhand geographical harvest coordinates</strong>.
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
                  Quick-Inspect Active Batch 04/26 Serials:
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

            {/* LIVE LAB CERTIFICATE OF ANALYSIS (COA) CARD */}
            {selectedCoa && (
              <div className="rounded-2xl border border-[#D4AF37]/45 bg-[#070a0e] p-5 sm:p-6 shadow-inner">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#244A38] pb-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                      <CheckCircle2 size={14} /> Third-Party Analytical Lab Certificate (NABL / ISO 17516)
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
                    <span className="block font-mono text-[10px] uppercase text-[#9BB0A5]">Sub-Zero / Cold Temp</span>
                    <strong className="mt-0.5 block text-white">{selectedCoa.extractionTemp}</strong>
                  </div>
                  <div className="rounded-xl border border-[#244A38] bg-[#102219]/70 p-3">
                    <span className="block font-mono text-[10px] uppercase text-[#9BB0A5]">Pesticide Residue</span>
                    <strong className="mt-0.5 block text-emerald-300">{selectedCoa.pesticideResidue || '0.000 ppm (GC-MS/MS)'}</strong>
                  </div>
                  <div className="rounded-xl border border-[#244A38] bg-[#102219]/70 p-3">
                    <span className="block font-mono text-[10px] uppercase text-[#9BB0A5]">Heavy Metal Screen</span>
                    <strong className="mt-0.5 block text-white">{selectedCoa.heavyMetals}</strong>
                  </div>
                  <div className="rounded-xl border border-[#244A38] bg-[#102219]/70 p-3">
                    <span className="block font-mono text-[10px] uppercase text-[#9BB0A5]">GPS Harvest Origin</span>
                    <strong className="mt-0.5 block text-[#FCE096]">{selectedCoa.harvestCoordinates || selectedCoa.originLot}</strong>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-[#D4AF37]/25 bg-[#102219]/90 p-3 text-xs text-[#DFD7C4]">
                  <p><strong className="text-[#FCE096]">100% Disclosed Actives:</strong> {selectedCoa.disclosedActives}</p>
                  <p className="mt-1 text-[11px] text-[#9BB0A5]"><strong className="text-white">Statutory &amp; Vessel Custody:</strong> {selectedCoa.regulatoryLicense || 'FSSAI Ayush-Aahar & Cosmetics Rules 2020'} · {selectedCoa.tamperCustody}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SYNCHRONIZED PROTOCOL BUNDLES (AOV > ₹1,199) */}
        <div id="regimen-bundles" className="mt-14">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-sub-gold inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.26em]">
                <Layers size={14} className="text-[#D4AF37]" /> Synchronized Inside-Out Protocols · Unit Economics Engineered
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold sm:text-4xl">
                <span className="font-headline-gold">30-Day &amp; 60-Day</span>{' '}
                <span className="font-headline-silver">Gut-Skin Biotic Protocols</span>
              </h2>
              <div className="gold-hairline my-3 w-24" />
            </div>
            <p className="max-w-md text-xs text-[#DFD7C4] leading-relaxed">
              Instead of fragmented soaps or generic shampoos, every Bhumivera protocol pairs internal 7-Tulsi cytokine modulation with external pH 5.3–5.5 postbiotic barrier care.
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
                  <h3 className="mt-4 font-serif text-xl font-bold text-white">{bundle.name}</h3>
                  <p className="mt-1 text-xs text-[#DFD7C4] leading-relaxed">{bundle.tagline}</p>

                  <ul className="mt-4 space-y-2.5 border-t border-[#244A38] pt-4 text-xs">
                    {bundle.items.map((item) => (
                      <li key={item.name} className="flex items-start gap-2.5">
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
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="font-serif text-2xl font-bold text-[#FCE096]">₹{bundle.bundlePrice}</span>
                      <span className="ml-2 text-xs text-[#9BB0A5] line-through">MRP ₹{bundle.mrpTotal}</span>
                      <span className="ml-2 rounded bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
                        Save ₹{bundle.savings}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddBundleToCart(bundle)}
                    className="btn-gold-luxury mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-bold uppercase tracking-widest"
                  >
                    <ShoppingBag size={15} /> Add Complete Protocol to Bag
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 6-PRODUCT RATIONALIZED GUT-SKIN BIOTIC CATALOG SHOWCASE */}
        <div className="mt-16">
          <p className="font-sub-gold inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.26em]">
            <Sparkles size={14} className="text-[#D4AF37]" /> Rationalized Clinical Portfolio · Zero Commodity Dilution
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold sm:text-4xl">
            <span className="font-headline-gold">The 6 Synchronized</span>{' '}
            <span className="font-headline-silver">Gut-Skin &amp; Microbiome Formulations</span>
          </h2>
          <div className="gold-hairline my-3 w-24" />
          <p className="max-w-3xl text-xs sm:text-sm text-[#DFD7C4] leading-relaxed mb-6">
            We eliminated low-ticket commodity soaps and generic 2-in-1 shampoos to focus 100% of our R&amp;D and cleanroom bandwidth on the Synchronized Inside-Out Gut-Skin Biotic Protocol and its Phase 2 Microbiome Barrier Extensions.
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(BHUMIVERA_6_PRODUCTS || []).map((prod) => (
              <article
                key={prod.slug}
                className="flex flex-col justify-between rounded-2xl border border-[#D4AF37]/30 bg-[#102219] p-5 transition hover:border-[#D4AF37]/70 shadow-lg"
              >
                <div>
                  <Link to={`/products/${prod.slug}`} className="relative block aspect-square overflow-hidden rounded-xl bg-[#070a0e] mb-4 p-4">
                    <img
                      src={prod.image_url}
                      alt={`${prod.name} - ${prod.subtitle}`}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/logo.webp';
                      }}
                      className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 rounded-full border border-[#D4AF37]/40 bg-[#102219]/90 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-[#FCE096]">
                      {prod.id === 3
                        ? '★ Flagship 2-Step Protocol Kit'
                        : prod.id === 6
                          ? 'Step 1 · Internal Gut-Skin Elixir'
                          : prod.id === 2
                            ? 'Step 2 · External Postbiotic Emulsion'
                            : 'Biophotonic UV Glass · 250-Unit Run'}
                    </span>
                  </Link>
                  <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider text-[#FCE096] mb-1.5">
                    <span>{prod.category}</span>
                    <span>{prod.net_volume}</span>
                  </div>
                  <Link to={`/products/${prod.slug}`}>
                    <h3 className="font-serif text-lg font-bold text-white hover:text-[#FCE096] transition-colors">
                      {prod.name}
                    </h3>
                  </Link>
                  <p className="mt-1 font-mono text-[11px] text-emerald-300">
                    {prod.subtitle}
                  </p>
                  <p className="mt-2 text-xs text-[#9BB0A5] leading-relaxed line-clamp-3">
                    {prod.short_description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#244A38] flex items-center justify-between">
                  <div>
                    <span className="font-serif text-lg font-bold text-[#FCE096]">₹{prod.price}</span>
                    {prod.mrp && (
                      <span className="ml-2 text-xs text-[#9BB0A5] line-through">₹{prod.mrp}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddProtocolProduct(prod.id, false)}
                      className="rounded-xl border border-[#D4AF37]/40 bg-[#070a0e] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#FCE096] hover:border-[#D4AF37]"
                    >
                      + Bag
                    </button>
                    <Link
                      to={`/products/${prod.slug}`}
                      className="btn-gold-luxury inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wider"
                    >
                      20X Dossier <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* INTERACTIVE PH STRIP ASSAY & COMPETITIVE D2C MATRIX */}
        <div className="mt-16">
          <p className="font-sub-gold inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.26em]">
            <ThermometerSnowflake size={14} className="text-[#D4AF37]" /> Clinical Acid-Mantle Proof &amp; Competitive Intelligence
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold sm:text-4xl">
            <span className="font-headline-gold">Interactive pH 5.42 Strip Assay</span>{' '}
            <span className="font-headline-silver">&amp; Indian D2C Sector Matrix</span>
          </h2>
          <div className="gold-hairline my-3 w-24" />

          {/* Interactive pH Strip Tester */}
          <div className="mt-6 rounded-3xl border border-[#244A38] bg-[#102219] p-6 sm:p-8">
            <h3 className="font-serif text-xl font-bold text-white">
              Colorimetric pH Electrode Simulation: Postbiotic pH 5.3–5.5 vs. Synthetic Acid &amp; Sulfate Stripping
            </h3>
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

          {/* Competitive Intelligence Matrix */}
          <div className="mt-8 overflow-x-auto rounded-3xl border border-[#D4AF37]/35 bg-[#102219] shadow-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#244A38] bg-[#070a0e] font-mono text-[11px] uppercase tracking-wider text-[#FCE096]">
                  <th className="p-4 sm:p-5">Enterprise / Brand</th>
                  <th className="p-4 sm:p-5">Core Paradigm &amp; Category Hook</th>
                  <th className="p-4 sm:p-5">Price Tier &amp; AOV</th>
                  <th className="p-4 sm:p-5">Structural Position &amp; Gut-Skin Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#244A38]">
                {(COMPETITIVE_D2C_MATRIX || []).map((row, idx) => (
                  <tr key={row.brand} className={idx === 0 ? 'bg-[#14291F]/80' : 'hover:bg-[#14291F]/40'}>
                    <td className="p-4 sm:p-5 font-serif font-bold text-white">
                      {idx === 0 ? <span className="text-[#FCE096]">★ {row.brand}</span> : row.brand}
                      <span className="block font-mono text-[10px] font-normal text-[#9BB0A5]">{row.backing}</span>
                    </td>
                    <td className="p-4 sm:p-5 text-[#DFD7C4]">{row.hook}</td>
                    <td className="p-4 sm:p-5 font-mono text-xs text-[#FCE096]">{row.tier}</td>
                    <td className="p-4 sm:p-5 text-xs text-[#DFD7C4]">{row.vulnerability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* OMNICHANNEL QUICK-COMMERCE & INSTITUTIONAL DISTRIBUTION ARCHITECTURE */}
        <div className="mt-16 rounded-3xl border border-[#D4AF37]/35 bg-[#102219] p-6 sm:p-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end mb-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#FCE096]">
                <Building2 size={14} className="text-[#D4AF37]" /> Omnichannel &amp; Quick-Commerce Replenishment Engine
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold sm:text-4xl">
                <span className="font-headline-gold">30-Day Consumable Habit</span>{' '}
                <span className="font-headline-silver">Across D2C, Quick-Commerce &amp; Clinics</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#DFD7C4]">
                By packaging the 7-Tulsi Cellular Reset Drops and 4% Sea Buckthorn Postbiotic Emulsion as a synchronized 30-day consumable supply, Bhumivera pairs high-margin D2C subscriptions with instant metro fulfillment across <strong className="text-white">Blinkit, Zepto, and Swiggy Instamart</strong> dark stores and <strong className="text-white">Functional Medicine Clinics</strong>.
              </p>
            </div>
            <Link
              to="/sell-on-bhumivera"
              className="btn-gold-luxury inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-wider shrink-0"
            >
              Partner With Clinical &amp; Retail Desk <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(OMNICHANNEL_DISTRIBUTION_TABLE || []).map((ch) => (
              <div key={ch.channel} className="rounded-2xl border border-[#244A38] bg-[#070a0e]/80 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase text-[#FCE096]">
                    <span>Share: {ch.revenueShare}</span>
                    <span className="text-emerald-400">CM2: {ch.cm2Margin}</span>
                  </div>
                  <h3 className="mt-2 font-serif text-base font-bold text-white">{ch.channel}</h3>
                  <p className="mt-2 text-xs text-[#DFD7C4] leading-relaxed">{ch.mechanics}</p>
                </div>
                <p className="mt-4 pt-3 border-t border-[#244A38] font-mono text-[10px] text-[#9BB0A5]">
                  Blended CAC: <strong className="text-white">{ch.cacWindow}</strong>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FIVE PROMISES & STATS */}
        <div className="mt-14">
          <p className="font-sub-gold text-xs font-bold uppercase tracking-[0.26em]">The Biophotonic &amp; Cold-Pressed Standard</p>
          <h2 className="mt-2 font-serif text-2xl font-bold sm:text-4xl">
            <span className="font-headline-gold">Five Ecological &amp; Clinical</span>{' '}
            <span className="font-headline-silver">Guarantees On Every Vessel</span>
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

        {/* 330+ VERIFIED CUSTOMER REVIEWS & PATRON FEEDBACK WALL */}
        <div id="verified-patron-reviews" className="mt-16 rounded-3xl border border-[#D4AF37]/40 bg-[#102219] p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#244A38] pb-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#070a0e] px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#FCE096]">
                <Star size={12} className="fill-current text-[#D4AF37]" /> {allStoreReviews.length}+ Verified Customer Reviews · 100% Non-Repeating Patron Ledger
              </span>
              <h2 className="mt-3 font-serif text-2xl font-bold sm:text-4xl text-white">
                <span className="font-headline-gold">Real Customer Experiences</span>{' '}
                <span className="font-headline-silver">Across India (4.4★ – 4.8★)</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#DFD7C4] max-w-2xl leading-relaxed">
                Unfiltered feedback from verified patrons across Kolkata, Asansol, Mumbai, Bengaluru, New Delhi, Chennai, Pune, and Tier-2/3 cities—with our highest 4.8★ rating and review volume on the 2-Step Combo Pack.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 shrink-0 text-center">
              <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#070a0e] px-4 py-3">
                <span className="font-serif text-2xl font-bold text-[#FCE096]">4.8 ★</span>
                <span className="block font-mono text-[9px] uppercase tracking-wider text-emerald-400">Combo Pack (95)</span>
              </div>
              <div className="rounded-2xl border border-[#244A38] bg-[#070a0e] px-4 py-3">
                <span className="font-serif text-2xl font-bold text-white">{allStoreReviews.length}</span>
                <span className="block font-mono text-[9px] uppercase tracking-wider text-[#9BB0A5]">Verified Reviews</span>
              </div>
              <div className="rounded-2xl border border-[#244A38] bg-[#070a0e] px-4 py-3">
                <span className="font-serif text-2xl font-bold text-[#FCE096]">4.4–4.8★</span>
                <span className="block font-mono text-[9px] uppercase tracking-wider text-[#9BB0A5]">Calibrated Band</span>
              </div>
            </div>
          </div>

          {/* Filter Pills by SKU */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { id: 'all', label: `All Verified Reviews (${allStoreReviews.length})` },
              { id: '3', label: `★ Combo Pack: 30-Day Protocol (4.8★ · ${getReviewsForProduct(3).summary.total})` },
              { id: '2', label: `Sea Buckthorn Emulsion ₹799 (4.7★ · ${getReviewsForProduct(2).summary.total})` },
              { id: '1', label: `Charcoal Emulsion ₹699 (4.6★ · ${getReviewsForProduct(1).summary.total})` },
              { id: '5', label: `7-Tulsi Hydrosol Mist ₹649 (4.6★ · ${getReviewsForProduct(5).summary.total})` },
              { id: '6', label: `Kalpvriksh 7-Tulsi Drops ₹499 (4.5★ · ${getReviewsForProduct(6).summary.total})` },
              { id: '4', label: `Prebiotic Barrier Crème ₹999 (4.4★ · ${getReviewsForProduct(4).summary.total})` },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setHomeReviewSkuFilter(tab.id); setHomeReviewVisibleCount(12); }}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  homeReviewSkuFilter === tab.id
                    ? 'bg-[#D4AF37] text-[#070a0e] shadow-md'
                    : 'border border-[#244A38] bg-[#070a0e]/70 text-[#DFD7C4] hover:border-[#D4AF37]/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Reviews Grid */}
          {(() => {
            const filteredHomeReviews = allStoreReviews.filter(r =>
              Number(r.is_approved ?? 1) === 1 &&
              (homeReviewSkuFilter === 'all' || String(r.product_id) === String(homeReviewSkuFilter))
            );
            const shownReviews = filteredHomeReviews.slice(0, homeReviewVisibleCount);
            return (
              <>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {shownReviews.map(rev => (
                    <article
                      key={rev.id}
                      className="flex flex-col justify-between rounded-2xl border border-[#244A38] bg-[#070a0e]/85 p-5 hover:border-[#D4AF37]/40 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-0.5 text-[#D4AF37]">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={13} fill={s <= Number(rev.rating) ? 'currentColor' : 'none'} />
                            ))}
                            <span className="ml-1.5 font-mono text-[11px] font-bold text-[#FCE096]">{rev.rating}.0 / 5</span>
                          </div>
                          <span className="rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase text-emerald-300">
                            ✓ Verified Patron
                          </span>
                        </div>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-[#9BB0A5] mb-1.5 truncate">
                          {rev.product_name}
                        </p>
                        {rev.title && (
                          <h3 className="font-serif text-base font-bold text-white mb-1.5">
                            &ldquo;{rev.title}&rdquo;
                          </h3>
                        )}
                        <p className="text-xs text-[#DFD7C4] leading-relaxed">
                          {rev.body || rev.comment}
                        </p>
                        {Array.isArray(rev.images) && rev.images.length > 0 && (
                          <div className="mt-3 flex gap-2">
                            {rev.images.map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt={`Customer photo by ${rev.user_name}`}
                                className="h-14 w-14 rounded-lg object-cover border border-[#D4AF37]/30"
                                loading="lazy"
                                onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/logo.webp'; }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#244A38]/80 flex items-center justify-between text-[11px] text-[#9BB0A5]">
                        <span className="font-bold text-white">
                          {rev.user_name}{rev.reviewer_location ? ` · ${rev.reviewer_location}` : ''}
                        </span>
                        <span className="font-mono text-[10px]">
                          {rev.created_at ? new Date(rev.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
                {homeReviewVisibleCount < filteredHomeReviews.length && (
                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      onClick={() => setHomeReviewVisibleCount(c => c + 18)}
                      className="btn-gold-luxury rounded-full px-7 py-3 text-xs font-bold uppercase tracking-wider"
                    >
                      Load More Verified Reviews ({filteredHomeReviews.length - homeReviewVisibleCount} remaining)
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </div>

        {/* CONSCIOUS SKINCARE BUYER FAQ BLOCK */}
        <div className="mt-12 rounded-3xl border border-[#D4AF37]/30 bg-[#102219] p-6 sm:p-10">
          <p className="font-sub-gold text-xs font-bold uppercase tracking-[0.24em]">Clinical &amp; Regulatory Dossier</p>
          <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl text-white">
            Frequently Asked Questions on the Synchronized Gut-Skin Biotic Protocol
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
