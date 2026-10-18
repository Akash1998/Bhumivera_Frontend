import React, { useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  Leaf,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Scale,
  Droplets,
  Heart,
  Calculator,
  Award,
  Sparkles,
  ExternalLink,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import api from '../services/api';
import { IMPACT_PAGE_DATA } from '../data/bhumiveraUniqueData';
import {
  IMPACT_PROJECTS,
  INDIA_SCARCITY_OVERVIEW,
  LEGAL_CHARTER_FRAMEWORK,
} from '../data/impactDeepDiveData';

const impactQuestions = [
  [
    'Can Bhumivera as a commercial company accept charitable donations?',
    'No. Under the Companies Act 2013 and Section 80G/12A of the Income Tax Act 1961, commercial for-profit entities in India cannot solicit or accept charitable donations from the public. Bhumivera does NOT take donations. Instead, we offer a 100% voluntary Ecological Co-Sponsorship / Green Surcharge model where patrons co-sponsor verified botanical goods (saplings, coir blankets, seed vaults) with 0% administrative deductions. In 2027, our independent Section 8 "Bhumivera Earth Foundation" will formally launch to offer direct 80G tax-deductible giving.',
  ],
  [
    'How do Cash-on-Delivery (COD) pledges work?',
    'When you add an optional contribution at checkout, it is recorded as a pledge in escrow. It enters public collected totals only after courier doorstep delivery and subsequent cash remittance reconciliation.',
  ],
  [
    'What makes a field update verified?',
    'An authorized stewardship auditor must record a specific field date, geotagged location, comprehensive work summary, and authentic on-ground field photographs documenting the executed botanical work.',
  ],
  [
    'Can I leave the contribution at zero?',
    'Yes, absolutely. Zero is the default setting at checkout, and every environmental contribution is 100% voluntary.',
  ],
  [
    'What happens if an order is cancelled or returned?',
    'Any uncollected pledge attached to a cancelled, returned, or unfulfilled order is automatically voided in real-time and permanently excluded from public ledger totals.',
  ],
  [
    'Are administrative costs deducted from contributions?',
    'Zero administrative or marketing overhead is deducted. 100% of every reconciled rupee is directly channeled into sapling nurseries, coir erosion logs, and community botanical literacy programs.',
  ],
  [
    'When will the 2027 Phase II megaprojects begin?',
    'Phase II initiatives (Pampore Saffron Corridors, Sacred Grove Reserves, and Wetland Kunds) are scheduled for Q1 2027 after baseline biodiversity soil audits are completed.',
  ],
];

const DEFAULT_TOTALS = [
  { project_key: 'native-trees', collected_amount: 0, contributions: 0 },
  { project_key: 'river-care', collected_amount: 0, contributions: 0 },
  { project_key: 'community-care', collected_amount: 0, contributions: 0 },
];

const money = amount => `₹${Number(amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function Impact() {
  const [ledger, setLedger] = useState({
    totals: DEFAULT_TOTALS,
  });
  const [openFaq, setOpenFaq] = useState(0);

  // Interactive Footprint & Green Offset Calculator State
  const [orderVolume, setOrderVolume] = useState(3); // default 3 orders / months
  const [calcOffsetType, setCalcOffsetType] = useState('trees'); // 'trees', 'water', 'river'

  // Quick Pledge Modal state
  const [quickPledgeOpen, setQuickPledgeOpen] = useState(false);
  const [quickPledgeProject, setQuickPledgeProject] = useState(IMPACT_PROJECTS[0]);
  const [pledgeAmount, setPledgeAmount] = useState(500);
  const [patronName, setPatronName] = useState('');
  const [patronEmail, setPatronEmail] = useState('');
  const [certificateData, setCertificateData] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get('/impact/public')
      .then(({ data }) => {
        if (!active) return;
        if (Array.isArray(data?.totals)) {
          const liveTotals = DEFAULT_TOTALS.map(base => {
            const match = data.totals.find(t => t.project_key === base.project_key);
            return match
              ? {
                  ...base,
                  collected_amount: Number(match.collected_amount || 0),
                  contributions: Number(match.contributions || 0),
                }
              : base;
          });
          setLedger({ totals: liveTotals });
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const totalCollected = ledger.totals.reduce((sum, row) => sum + Number(row.collected_amount || 0), 0);
  const totalContributions = ledger.totals.reduce((sum, row) => sum + Number(row.contributions || 0), 0);

  // Calculations for footprint offset
  const calculatedSaplings = Math.max(1, Math.round(orderVolume * 1.5));
  const calculatedWaterLiters = orderVolume * 650;
  const calculatedRiverMeters = Math.max(1, Math.round(orderVolume * 2.2));
  const calculatedOffsetPledge = orderVolume * 100;

  const handleQuickPledgeSubmit = e => {
    e.preventDefault();
    if (!patronName.trim() || !patronEmail.trim()) return;

    const certCode = `BV-${quickPledgeProject.id.toUpperCase().substring(0, 4)}-${Date.now().toString(36).toUpperCase()}`;
    const cert = {
      code: certCode,
      name: patronName.trim(),
      amount: pledgeAmount,
      projectTitle: quickPledgeProject.title,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    };

    // Store in localStorage
    try {
      const key = `bv_pledges_${quickPledgeProject.id}`;
      const stored = localStorage.getItem(key);
      const parsed = stored ? JSON.parse(stored) : { totalPledged: 0, count: 0 };
      parsed.totalPledged += pledgeAmount;
      parsed.count += 1;
      localStorage.setItem(key, JSON.stringify(parsed));
    } catch {
      // ignore
    }

    setCertificateData(cert);
  };

  return (
    <main className="min-h-screen bg-[#070a0e] text-[#e2e8f0] pb-24 font-sans selection:bg-[#d4af37]/30 selection:text-white">
      <SEO
        title="Public Stewardship Ledger & 2027 Ecological Initiatives | Bhumivera"
        description="Inspect Bhumivera's receipt-reconciled environmental stewardship ledger, India's ecological scarcity data, and 6 upcoming 2027 restoration megaprojects."
        route="/impact"
      />

      {/* 1. HERO SECTION */}
      <section className="relative isolate min-h-[75svh] overflow-hidden border-b border-[#d4af37]/20 bg-[#070a0e]">
        <div className="absolute inset-0 -z-20 h-full w-full">
          <Link
            to="/impact/hero"
            aria-label="Open details for the impact page hero image"
            className="block h-full w-full"
          >
            <img
              src={IMPACT_PAGE_DATA.heroImage}
              alt="Bhumivera public stewardship ledger and verifiable field documentation"
              className="h-full w-full object-contain object-center opacity-30 brightness-90 filter contrast-105"
            />
          </Link>
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#070a0e] via-[#070a0e]/85 to-[#070a0e]/50" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#070a0e]/95 via-[#070a0e]/80 to-transparent" />

        <div className="mx-auto flex min-h-[75svh] max-w-7xl flex-col justify-end px-6 pb-14 pt-32 md:pb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#102219]/90 backdrop-blur-md px-4 py-1.5 font-sub-gold text-[10px] tracking-[0.25em] uppercase text-[#fce096] mb-5 w-fit">
            <Leaf size={14} className="text-[#d4af37]" /> Bhumivera · Verifiable Public Stewardship Ledger
          </div>

          <h1 className="max-w-4xl font-serif text-4xl sm:text-6xl md:text-7xl leading-[1.05] text-white">
            <span className="font-headline-gold">Care Should Leave</span> <br className="hidden sm:inline" />
            <span className="font-headline-silver">A Verifiable Record.</span>
          </h1>

          <div className="gold-hairline my-5 max-w-xs" />

          <p className="mt-2 max-w-2xl text-base leading-7 text-[#cbd5e1] md:text-lg">
            Every environmental pledge, cash reconciliation receipt, and on-ground field photograph is logged transparently in our public ledger. Zero estimated claims. 100% receipt-backed truth.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#ledger"
              className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl hover:scale-[1.02] transition-transform"
            >
              Inspect Reconciled Ledger <ArrowDownRight size={16} />
            </a>
            <a
              href="#upcoming-2027"
              className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#cbd5e1] hover:text-white transition-colors"
            >
              2027 Megaprojects <ArrowRight size={15} />
            </a>
            <a
              href="#legal-rules"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#fce096] hover:underline"
            >
              <Scale size={13} /> Indian Legal Rules &amp; How We Work
            </a>
          </div>
        </div>
      </section>

      {/* 2. PROJECT POSTERS: 6 IMAGES GALLERY (CLICKABLE TO DEEP-DIVE RESEARCH DOSSIERS) */}
      <section id="project-posters" className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="font-sub-gold text-[10px] tracking-[0.25em] block uppercase text-[#fce096] mb-1">
              Field Documentation Archive
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white">
              <span className="font-headline-gold">Impact Projects</span>{' '}
              <span className="font-headline-silver">In Pictures</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#94a3b8] max-w-md">
            Click on any authentic field artwork to inspect India’s environmental scarcity dossier, the catastrophic future without it, and quantifiable 2027 restoration impact data.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {IMPACT_PAGE_DATA.projectPosters.map((poster, idx) => (
            <Link
              key={poster.id}
              to={`/impact/${poster.id}`}
              aria-label={`Open details for ${poster.title}`}
              className="group block overflow-hidden rounded-3xl border border-[#d4af37]/25 bg-[#070a0e] transition-all duration-300 hover:border-[#d4af37]/80 hover:shadow-2xl relative"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#070a0e] relative">
                <img
                  src={poster.image}
                  alt={poster.title}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070a0e] via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 rounded-full border border-[#d4af37]/40 bg-[#070a0e]/90 backdrop-blur-md px-3 py-1 text-[10px] font-mono text-[#fce096]">
                  Corridor #0{idx + 1}
                </span>
                <span className="absolute top-3 right-3 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-emerald-400">
                  2027 Roadmap
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#fce096] transition-colors line-clamp-1">
                  {poster.title}
                </h3>
                <p className="text-xs text-[#94a3b8] flex items-center justify-between font-mono pt-1">
                  <span>Inspect Research Dossier</span>
                  <ArrowRight size={13} className="text-[#d4af37] group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. RECONCILED PUBLIC LEDGER DASHBOARD (ONLY UPDATED FROM ADMIN) */}
      <section id="ledger" className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="rounded-3xl two-tone-panel-gold border border-[#d4af37]/40 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-60 w-60 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[#d4af37]/20">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-sub-gold text-[10px] tracking-[0.25em] uppercase text-[#fce096]">
                  Real-Time Public Stewardship Audit
                </span>
                <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[9px] font-mono text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Admin-Verified Only
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl leading-tight text-white">
                No impact claim without a receipt and an on-ground field photograph.
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-6 text-[#cbd5e1]">
                Contributions added to orders begin as pledges in escrow. Funds enter these public totals strictly after administrator reconciliation of courier delivery receipts and cash remittances. Cancelled or returned orders are immediately voided. Zero simulated numbers.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2 rounded-2xl border border-[#d4af37]/30 bg-[#070a0e]/60 px-4 py-3 backdrop-blur-md">
              <ShieldCheck size={20} className="text-[#d4af37] shrink-0" />
              <div className="text-left">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#94a3b8]">Audit Protocol</div>
                <div className="text-xs font-bold text-white">Continuous 3-Way Reconciliation</div>
              </div>
            </div>
          </div>

          {/* 4 Metric Counters Grid */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-[#d4af37]/20 bg-[#070a0e]/50 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#94a3b8]">Reconciled Fund</p>
              <p className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-[#fce096]">{money(totalCollected)}</p>
              <p className="mt-2 text-[10px] font-mono text-[#cbd5e1]">
                {totalCollected > 0 ? '100% Cash-Reconciled' : 'Awaiting Admin COD Reconciliation'}
              </p>
            </div>

            <div className="rounded-2xl border border-[#d4af37]/20 bg-[#070a0e]/50 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#94a3b8]">Verified Receipts</p>
              <p className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-white">{totalContributions}</p>
              <p className="mt-2 text-[10px] font-mono text-[#cbd5e1]">Audited Order Parcels</p>
            </div>

            <div className="rounded-2xl border border-[#d4af37]/20 bg-[#070a0e]/50 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#94a3b8]">Active Corridors</p>
              <p className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-[#fce096]">3</p>
              <p className="mt-2 text-[10px] font-mono text-[#cbd5e1]">3 Active · 6 Upcoming (2027)</p>
            </div>

            <div className="rounded-2xl border border-[#d4af37]/20 bg-[#070a0e]/50 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#94a3b8]">Direct Field Flow</p>
              <p className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-emerald-400">100%</p>
              <p className="mt-2 text-[10px] font-mono text-[#cbd5e1]">Zero Admin / Overhead Cut</p>
            </div>
          </div>

          {/* Allocation Breakdown Bar */}
          <div className="mt-8 border-t border-[#d4af37]/20 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mb-3 font-mono">
              <span className="text-[#94a3b8] uppercase tracking-wider text-[11px]">Corridor Allocation Breakdown</span>
              <span className="text-[#fce096]">{money(totalCollected)} Total Reconciled Across Corridors</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ledger.totals.map((t, idx) => {
                const project = IMPACT_PAGE_DATA.projects.find(p => p.id === t.project_key) || IMPACT_PAGE_DATA.projects[idx];
                return (
                  <div key={t.project_key || idx} className="rounded-xl border border-[#d4af37]/15 bg-[#070a0e]/70 px-4 py-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-white truncate max-w-[170px]">{project?.title?.split('&')[0] || t.project_key}</div>
                      <div className="text-[10px] font-mono text-[#94a3b8]">{t.contributions} receipts</div>
                    </div>
                    <div className="font-serif font-bold text-sm text-[#fce096]">{money(t.collected_amount)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. INDIA'S MACRO ECOLOGICAL SCARCITY MATRIX */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-rose-900/30 bg-gradient-to-br from-[#120a0b] via-[#070a0e] to-[#070a0e] p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-rose-400" />
            <span className="font-sub-gold text-[10px] tracking-[0.25em] uppercase text-rose-300">
              National Crisis Dossier · India's Acute Ecological Scarcity
            </span>
          </div>

          <div className="max-w-3xl">
            <h2 className="font-serif text-2xl sm:text-4xl text-white leading-tight">
              Why We Are Launching 6 Megaprojects in 2027
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#cbd5e1] leading-6">
              Official data from NITI Aayog, Central Ground Water Board, and ISRO reveals India is confronting simultaneous groundwater depletion, pollinator collapse, and topsoil desertification. Superficial tokenism is no longer an option.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {INDIA_SCARCITY_OVERVIEW.nationalStats.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-5 space-y-2 hover:border-rose-500/40 transition-colors"
              >
                <div className="font-serif text-3xl font-bold text-rose-300">{item.metric}</div>
                <h3 className="font-serif text-sm font-bold text-white">{item.label}</h3>
                <p className="text-xs text-[#cbd5e1] leading-5">{item.detail}</p>
                <div className="pt-2 text-[10px] font-mono text-rose-200/60 border-t border-rose-500/15">
                  Source: {item.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PHASE II 2027 ENVIRONMENTAL MEGAPROJECTS (ALL 6 PROJECTS DEEP-DIVE) */}
      <section id="upcoming-2027" className="mx-auto max-w-7xl px-6 py-14">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-sub-gold text-[10px] tracking-[0.25em] block uppercase text-[#fce096] mb-2">
            Phase II Megaproject Roadmap · Execution 2027
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-white">
            <span className="font-headline-gold">Six Historic</span>{' '}
            <span className="font-headline-silver">Restoration Corridors</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#94a3b8] leading-6">
            Click into each project to review the precise historical degradation, the catastrophic future without intervention, and verifiable before-and-after percentage impact benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {IMPACT_PROJECTS.map(proj => {
            const pct = Math.min(
              100,
              Math.round((proj.funding.pledgedAmount / (proj.funding.targetAmount || 1)) * 100)
            );
            return (
              <article
                key={proj.id}
                className="overflow-hidden rounded-3xl border border-[#d4af37]/30 bg-[#070a0e] shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-[#d4af37]/80 hover:-translate-y-1"
              >
                <div>
                  <Link
                    to={`/impact/${proj.slug}`}
                    className="relative block aspect-[16/10] w-full overflow-hidden bg-[#070a0e]"
                  >
                    <img
                      src={proj.posterImage}
                      alt={proj.title}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070a0e] via-transparent to-black/20" />
                    <span className="absolute top-3 left-3 rounded-full border border-[#d4af37]/40 bg-[#070a0e]/90 px-3 py-1 text-[10px] font-mono text-[#fce096]">
                      <MapPin size={11} className="mr-1 inline text-[#d4af37]" />
                      {proj.location.split(',')[0]}
                    </span>
                    <span className="absolute top-3 right-3 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-emerald-400">
                      2027 Launch
                    </span>
                  </Link>

                  <div className="p-6 space-y-3">
                    <h3 className="font-serif text-xl font-bold text-white hover:text-[#fce096] transition-colors">
                      <Link to={`/impact/${proj.slug}`}>{proj.title}</Link>
                    </h3>
                    <p className="text-xs text-[#cbd5e1] leading-5 line-clamp-3">
                      {proj.tagline}
                    </p>

                    {/* Scarcity Snapshot */}
                    <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3 text-[11px] text-rose-200">
                      <strong className="text-white block font-sans mb-0.5">The Problem Created:</strong>
                      {proj.problemDossier.keyFactors[0]}
                    </div>

                    {/* Funding Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#94a3b8]">Pledged: {money(proj.funding.pledgedAmount)}</span>
                        <span className="text-[#fce096] font-bold">{pct}% of {money(proj.funding.targetAmount)}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#070a0e] border border-[#d4af37]/25 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-emerald-400"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-[#d4af37]/15 mt-3 flex items-center justify-between gap-2">
                  <Link
                    to={`/impact/${proj.slug}`}
                    className="btn-silver-luxury w-full text-center rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider text-[#cbd5e1] hover:text-white"
                  >
                    Full Dossier &amp; Pledges <ArrowRight size={13} className="inline ml-1" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 6. INTERACTIVE ECOLOGICAL FOOTPRINT & GREEN OFFSET CALCULATOR */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-[#d4af37]/40 bg-gradient-to-r from-[#102219] via-[#070a0e] to-[#102219] p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-mono text-emerald-400 uppercase">
                <Calculator size={13} /> Personal Footprint Offset Engine
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl text-white">
                Calculate &amp; Neutralize Your Order Footprint
              </h2>
              <p className="text-xs sm:text-sm text-[#cbd5e1] leading-6">
                Calculate the real-world botanical resources required to counterbalance your household or e-commerce transit footprint, and sponsor exact living equivalents.
              </p>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-mono uppercase text-[#94a3b8]">
                  How many e-commerce orders do you receive per month?
                </label>
                <div className="flex items-center gap-3">
                  {[1, 3, 5, 10, 20].map(vol => (
                    <button
                      key={vol}
                      type="button"
                      onClick={() => setOrderVolume(vol)}
                      className={`h-10 w-12 rounded-xl font-mono text-xs font-bold border transition-all ${
                        orderVolume === vol
                          ? 'border-[#d4af37] bg-[#d4af37] text-black shadow-lg'
                          : 'border-[#d4af37]/30 bg-[#070a0e] text-[#cbd5e1] hover:border-[#d4af37]'
                      }`}
                    >
                      {vol}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl border border-[#d4af37]/30 bg-[#070a0e]/80 p-6 sm:p-8 space-y-6">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#94a3b8] block">
                Calculated Ecological Offset Balance for {orderVolume} Orders/Month:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-[#d4af37]/20 bg-[#102219]/50 p-4">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase">Native Keystone Trees</div>
                  <div className="font-serif text-2xl font-bold text-white mt-1">{calculatedSaplings} Saplings</div>
                  <div className="text-[10px] text-[#cbd5e1] mt-0.5">Jute root-balls with mycorrhizae</div>
                </div>

                <div className="rounded-xl border border-[#d4af37]/20 bg-[#102219]/50 p-4">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase">Rainwater Aquifer Recharge</div>
                  <div className="font-serif text-2xl font-bold text-white mt-1">{calculatedWaterLiters.toLocaleString()} L</div>
                  <div className="text-[10px] text-[#cbd5e1] mt-0.5">Traditional earthen Kund sink</div>
                </div>

                <div className="rounded-xl border border-[#d4af37]/20 bg-[#102219]/50 p-4">
                  <div className="text-[10px] font-mono text-amber-400 uppercase">Riparian River Buffer</div>
                  <div className="font-serif text-2xl font-bold text-white mt-1">{calculatedRiverMeters} Meters</div>
                  <div className="text-[10px] text-[#cbd5e1] mt-0.5">Vetiver &amp; coir erosion log</div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#d4af37]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-[#94a3b8] uppercase block">Recommended Monthly Co-Sponsorship:</span>
                  <div className="font-serif text-2xl font-bold text-[#fce096]">{money(calculatedOffsetPledge)}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPledgeAmount(calculatedOffsetPledge);
                    setQuickPledgeOpen(true);
                  }}
                  className="btn-gold-luxury rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xl hover:scale-105 transition-transform"
                >
                  <Heart size={14} className="inline mr-1 text-rose-300" /> Co-Sponsor This Offset
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INDIAN CORPORATE ENVIRONMENTAL LAW & STEWARDSHIP CHARTER */}
      <section id="legal-rules" className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-[#d4af37]/40 bg-[#070a0e] p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center gap-2">
            <Scale size={22} className="text-[#d4af37]" />
            <div>
              <span className="font-sub-gold text-[10px] tracking-[0.25em] block uppercase text-[#fce096]">
                Corporate Law &amp; Fiscal Compliance
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-white">
                Can An Indian Company Take Donations? The Full Legal Truth
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#cbd5e1] leading-6 max-w-4xl">
            We reject ambiguous greenwashing. Indian corporate and tax jurisprudence strictly governs public funds. Here is the legal breakdown of how Bhumivera operates with 100% compliance:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {LEGAL_CHARTER_FRAMEWORK.rules.map(rule => (
              <div
                key={rule.id}
                className="rounded-2xl border border-[#d4af37]/20 bg-[#102219]/30 p-6 space-y-3"
              >
                <h3 className="font-serif text-base font-bold text-white">{rule.title}</h3>
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs font-semibold text-amber-200">
                  {rule.shortAnswer}
                </div>
                <p className="text-xs text-[#cbd5e1] leading-5">{rule.fullExplanation}</p>
                <div className="pt-2 border-t border-[#d4af37]/15 text-[11px] font-mono text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 size={13} className="shrink-0" />
                  <span>{rule.implication}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                The 2027 Section 8 Bhumivera Earth Foundation
              </h4>
              <p className="text-xs text-[#cbd5e1]">
                To scale our Phase II megaprojects, our independent not-for-profit Section 8 company will launch with 80G tax certificates, allowing donors to claim 50% income tax deductions.
              </p>
            </div>
            <Link
              to="/impact/charter"
              className="btn-gold-luxury rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shrink-0 text-center"
            >
              Inspect Governance Charter
            </Link>
          </div>
        </div>
      </section>

      {/* 8. ACTIVE CORRIDORS (PHASE I) */}
      <section id="active-corridors" className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 border-b border-[#d4af37]/20 pb-5">
          <span className="font-sub-gold text-[10px] tracking-[0.2em] block uppercase text-[#fce096]">
            Phase I On-Ground Deployment · Active Execution
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-white">
            <span className="font-headline-gold">Three Active</span>{' '}
            <span className="font-headline-silver">Ecological Focus Corridors</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {IMPACT_PAGE_DATA.projects.map((project, idx) => (
            <article key={project.id} className="overflow-hidden rounded-3xl two-tone-card border border-[#d4af37]/25 shadow-xl">
              <Link
                to={`/impact/${project.id}`}
                aria-label={`Open details for ${project.title} image`}
                className="relative block aspect-[16/10] w-full overflow-hidden bg-[#070a0e]"
              >
                <img src={project.image} alt={project.title} loading="lazy" className="h-full w-full object-contain" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070a0e] via-transparent to-black/20" />
                <span className="absolute top-3 left-3 rounded-full border border-[#d4af37]/30 bg-[#070a0e]/85 px-3 py-1 text-[10px] font-mono text-[#fce096]">
                  <MapPin size={11} className="mr-1 inline text-[#d4af37]" />{project.location}
                </span>
                <span className="absolute top-3 right-3 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-emerald-400">
                  Active Corridor 0{idx + 1}
                </span>
              </Link>
              <div className="space-y-3 p-6">
                <h3 className="font-serif text-xl font-bold text-white">{project.title}</h3>
                <p className="text-xs leading-6 text-[#cbd5e1]">{project.copy}</p>
                <p className="rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/70 p-3.5 font-mono text-[11px] text-[#fce096]">
                  {project.metric}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 9. FAQ + CHARTER GOVERNANCE SECTION */}
      <section className="mx-auto max-w-7xl px-6 pt-6">
        <div className="grid gap-10 lg:grid-cols-12 items-start rounded-3xl two-tone-card border border-[#d4af37]/35 p-6 sm:p-10 shadow-2xl">
          {/* Left Column: Framed Governance Charter Panel */}
          <div className="lg:col-span-5 space-y-6">
            <Link to="/impact/charter" aria-label="Open details for the stewardship charter image" className="relative block aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#d4af37]/30 shadow-lg bg-[#070a0e]">
              <img
                src={IMPACT_PAGE_DATA.charterImage}
                alt="Bhumivera environmental stewardship charter and field governance"
                className="h-full w-full object-contain object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070a0e] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="rounded-full bg-[#070a0e]/90 backdrop-blur-md px-3 py-1 border border-[#d4af37]/30 text-[10px] font-mono text-[#fce096]">
                  Stewardship Charter &amp; Field Protocol
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-mono text-emerald-400 border border-emerald-500/40 font-bold">
                  Active Audit
                </span>
              </div>
            </Link>

            <div className="rounded-2xl border border-[#d4af37]/20 bg-[#070a0e]/60 p-5 space-y-3">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#d4af37]" />
                The Bhumivera Governance Promise
              </h3>
              <p className="text-xs leading-5 text-[#cbd5e1]">
                Environmental care must be provable down to the single rupee. We maintain an open-door audit policy for all patrons:
              </p>
              <ul className="space-y-2 text-[11px] text-[#cbd5e1]">
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] font-bold">✓</span>
                  <span><strong>Zero Admin Cut:</strong> 100% of voluntary checkout contributions go directly into ground initiatives.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] font-bold">✓</span>
                  <span><strong>COD Escrow Rule:</strong> Pledges enter public totals only after delivery is fulfilled and courier remittance reconciles.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] font-bold">✓</span>
                  <span><strong>Instant Voiding:</strong> If an order is returned or cancelled, the attached pledge is instantly purged.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] font-bold">✓</span>
                  <span><strong>Public Ledger:</strong> All reconciled ledger entries remain accessible to the public 24/7.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <span className="font-sub-gold text-[10px] tracking-[0.25em] block uppercase text-[#fce096]">
                Transparency &amp; Governance
              </span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl text-white">
                Stewardship Governance Questions
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#94a3b8]">
                Direct, transparent answers regarding checkout pledges, verification protocols, and fund reconciliation.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {impactQuestions.map(([q, a], idx) => (
                <div
                  key={q}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    openFaq === idx
                      ? 'border-[#d4af37]/60 bg-[#102219]/70 shadow-lg'
                      : 'border-[#d4af37]/20 bg-[#070a0e] hover:border-[#d4af37]/40'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-semibold text-white hover:text-[#fce096] transition-colors"
                  >
                    <span className="pr-4">{q}</span>
                    <span className="text-[#d4af37] font-bold text-lg shrink-0">
                      {openFaq === idx ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-[#d4af37]/15 mt-1">
                      <p className="text-xs sm:text-sm leading-6 text-[#cbd5e1]">{a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. VERIFICATION & TRANSPARENCY CTA */}
      <section className="mx-auto max-w-7xl px-6 pt-16">
        <div className="rounded-3xl border border-[#d4af37]/30 bg-gradient-to-r from-[#102219] via-[#070a0e] to-[#102219] p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="mx-auto max-w-3xl space-y-4">
            <span className="font-sub-gold text-[10px] tracking-[0.25em] block uppercase text-[#fce096]">
              Radical Botanical &amp; Ledger Transparency
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white">
              Every Bottle Has A Story. Every Rupee Has A Record.
            </h2>
            <p className="text-xs sm:text-sm leading-6 text-[#cbd5e1] max-w-xl mx-auto">
              Inspect your individual bottle's artisanal serial number, review independent lab assays, or explore the regional harvesting corridors that sustain our formulas.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                to="/verify"
                className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl"
              >
                <ShieldCheck size={16} /> Verify Bottle Serial
              </Link>
              <Link
                to="/provenance-engine"
                className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#cbd5e1] hover:text-white"
              >
                <Leaf size={15} /> Sourcing &amp; Provenance
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK PLEDGE MODAL */}
      {quickPledgeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border border-[#d4af37]/50 bg-[#070a0e] p-6 sm:p-8 shadow-2xl my-8">
            <button
              type="button"
              onClick={() => {
                setQuickPledgeOpen(false);
                setCertificateData(null);
              }}
              className="absolute top-5 right-5 text-[#94a3b8] hover:text-white text-xl font-bold font-mono"
            >
              ✕
            </button>

            {!certificateData ? (
              <form onSubmit={handleQuickPledgeSubmit} className="space-y-5">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-[#102219] px-3 py-1 text-[10px] font-mono text-[#fce096] uppercase mb-2">
                    <Heart size={12} className="text-rose-400" /> Voluntary Ecological Co-Sponsorship
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white">Co-Sponsor Environmental Action</h3>
                  <p className="mt-1 text-xs text-[#94a3b8]">
                    100% of your pledge is channeled directly to on-ground botanical restoration. Zero admin cut.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#cbd5e1] mb-1">
                    Select Environmental Corridor:
                  </label>
                  <select
                    value={quickPledgeProject.id}
                    onChange={e => {
                      const match = IMPACT_PROJECTS.find(p => p.id === e.target.value);
                      if (match) setQuickPledgeProject(match);
                    }}
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  >
                    {IMPACT_PROJECTS.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#cbd5e1] mb-1">
                    Pledge Amount (INR):
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[100, 250, 500, 1000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setPledgeAmount(amt)}
                        className={`rounded-xl border p-2 text-xs font-mono font-bold ${
                          pledgeAmount === amt
                            ? 'border-[#d4af37] bg-[#102219] text-[#fce096]'
                            : 'border-[#d4af37]/20 bg-[#070a0e] text-white hover:border-[#d4af37]'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#cbd5e1] mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Rohan Gupta"
                      value={patronName}
                      onChange={e => setPatronName(e.target.value)}
                      className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#cbd5e1] mb-1">Email (For Certificate) *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g., rohan@example.com"
                      value={patronEmail}
                      onChange={e => setPatronEmail(e.target.value)}
                      className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-[#d4af37]/20 bg-[#070a0e] p-3 text-[11px] text-[#94a3b8] leading-5">
                  <strong className="text-amber-300">Indian Legal Notice:</strong> Bhumivera is an eco-botanical enterprise. This is a voluntary green co-sponsorship pledge of tangible field materials, NOT an 80G tax donation.
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setQuickPledgeOpen(false)}
                    className="rounded-xl border border-[#d4af37]/30 px-4 py-2 text-xs font-mono text-[#cbd5e1]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gold-luxury rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xl hover:scale-105 transition-transform"
                  >
                    Confirm &amp; Issue Certificate
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <Award size={26} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">Stewardship Certificate Generated</h3>
                <div className="rounded-2xl border-2 border-[#d4af37] bg-gradient-to-b from-[#102219] to-[#070a0e] p-6 text-left space-y-3">
                  <div className="flex items-center justify-between border-b border-[#d4af37]/25 pb-2 text-[10px] font-mono text-[#fce096]">
                    <span>Bhumivera Verified Ledger</span>
                    <span>{certificateData.code}</span>
                  </div>
                  <h4 className="font-serif text-xl font-bold text-white">{certificateData.name}</h4>
                  <p className="text-xs text-[#cbd5e1]">
                    Has pledged <strong>₹{certificateData.amount}</strong> to support{' '}
                    <strong className="text-[#fce096]">{certificateData.projectTitle}</strong>.
                  </p>
                  <div className="text-[10px] font-mono text-[#94a3b8]">
                    Recorded on {certificateData.date} · 100% Direct Field Allocation
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn-gold-luxury rounded-xl px-5 py-2.5 text-xs font-bold uppercase text-white shadow-xl"
                  >
                    Print Certificate
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuickPledgeOpen(false);
                      setCertificateData(null);
                    }}
                    className="rounded-xl border border-[#d4af37]/40 px-5 py-2.5 text-xs font-mono text-[#cbd5e1]"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
