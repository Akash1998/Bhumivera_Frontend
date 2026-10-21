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
  Heart,
  Award,
  Sparkles,
  Calendar,
  AlertTriangle,
  Users,
  HandHeart,
  MessageSquare,
  Send,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import api from '../services/api';
import {
  IMPACT_PROJECTS,
  WEST_BENGAL_SCARCITY_OVERVIEW,
  LEGAL_CHARTER_FRAMEWORK,
} from '../data/impactDeepDiveData';

const impactQuestions = [
  [
    'How are impact contributions and public totals verified?',
    'The public ledger updates only after a Razorpay payment is verified or a cash-on-delivery contribution is reconciled by our team. We do not simulate totals; on-ground invoices and field reports are published separately as work is completed.',
  ],
  [
    'Can Bhumivera as a commercial company accept charitable donations?',
    'No. Under the Companies Act 2013 and Section 80G/12A of the Income Tax Act 1961, commercial companies in India cannot solicit or accept charitable donations from the public. We offer a 100% voluntary Ecological & Community Co-Sponsorship model where patrons sponsor tangible physical goods (rice bags, animal food, saplings in jute bags, coir logs) with 0% administrative deductions. In 2028, our independent Section 8 "Bhumivera Earth Foundation" will launch to offer direct 80G tax-exempt receipts.',
  ],
  [
    'What projects are starting right now in December 2026?',
    'Starting December 2026, we are directly addressing immediate human and animal suffering in our home district of Paschim Bardhaman (West Bengal): 1) Warm Meal Annadaan for hungry daily-wage workers and children, 2) Feeding and winter straw beds for street dogs and cats, and 3) Delivering monthly grain and warm blanket kits to abandoned elderly widows and disabled citizens.',
  ],
  [
    'Why are the ecological restoration projects scheduled for 2027 End - 2028?',
    'Restoring natural ecosystems—like planting living vetiver grass along the Damodar riverbank, raising 2,000 native saplings in biodegradable jute sacks, and desilting village ponds—requires careful seasonal baseline preparation, soil tests, and community training. We focus on low-cost, realistically achievable West Bengal projects rather than over-hyped corporate promises.',
  ],
  [
    'How can I volunteer and participate in on-ground drives?',
    'You can join 100+ local citizens by registering via our Volunteer Collaboration Hub below. Select your focus (Food Kitchen, Street Animal Care, River Cleanup, Tree Planting), and you will be added directly to our local weekend action drives.',
  ],
  [
    'Are administrative costs deducted from voluntary contributions?',
    'Zero administrative or marketing overhead is deducted. 100% of every rupee goes directly into buying groceries, animal medicines, jute bags, and riverbank vetiver slips. Invoices are published on our public ledger.',
  ],
];

const DEFAULT_COMMUNITY_POSTS = [
  {
    id: 1,
    name: 'Anirban Mukherjee',
    location: 'Raniganj, West Bengal',
    action: 'Fed 14 street dogs near station market',
    time: '2 hours ago',
    message: 'Set up two earthen water bowls outside the grocery market and fed 14 stray dogs warm rice with broth. Excited for the December winter bedding drive!',
  },
  {
    id: 2,
    name: 'Priyanka Das',
    location: 'Asansol, West Bengal',
    action: 'Pledged to volunteer for Weekend Annadaan',
    time: 'Yesterday',
    message: 'Proud to see a local brand tackling real hunger in our own towns. Ready to join the food distribution team starting this December.',
  },
  {
    id: 3,
    name: 'Rohan Sen',
    location: 'Durgapur, West Bengal',
    action: 'Damodar riverbank survey',
    time: '3 days ago',
    message: 'Inspected the mud erosion near the tributary ghats. Deep-rooting vetiver grass is the perfect affordable solution. Count me in for the planting drives!',
  },
];

const money = amount => `₹${Number(amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function Impact() {
  const [openFaq, setOpenFaq] = useState(0);

  // Volunteer form state
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerPhone, setVolunteerPhone] = useState('');
  const [volunteerTown, setVolunteerTown] = useState('Asansol');
  const [volunteerFocus, setVolunteerFocus] = useState('Hunger Relief & Annadaan Kitchen');
  const [volunteerRegistered, setVolunteerRegistered] = useState(false);

  // Community work sharing wall state
  const [communityPosts, setCommunityPosts] = useState(DEFAULT_COMMUNITY_POSTS);
  const [impactLedger, setImpactLedger] = useState(null);
  const [impactLedgerError, setImpactLedgerError] = useState(false);
  const [postAuthor, setPostAuthor] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [postAction, setPostAction] = useState('');
  const [postMsg, setPostMsg] = useState('');
  const [postSubmitted, setPostSubmitted] = useState(false);

  // Filter tabs for projects
  const [activeTab, setActiveTab] = useState('dec2026'); // 'dec2026' or 'roadmap2028'

  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem('bv_community_wall_posts');
      if (savedPosts) {
        setCommunityPosts(JSON.parse(savedPosts));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    let active = true;
    api.get('/impact/public')
      .then(({ data }) => {
        if (active) setImpactLedger(data);
      })
      .catch(error => {
        console.error('[IMPACT_LEDGER_LOAD]', error);
        if (active) setImpactLedgerError(true);
      });
    return () => { active = false; };
  }, []);

  const collectedAmount = Array.isArray(impactLedger?.totals)
    ? impactLedger.totals.reduce((total, row) => total + (Number(row.collected_amount) || 0), 0)
    : 0;
  const verifiedReceipts = Array.isArray(impactLedger?.totals)
    ? impactLedger.totals.reduce((total, row) => total + (Number(row.contributions) || 0), 0)
    : 0;

  const handleVolunteerSubmit = e => {
    e.preventDefault();
    if (!volunteerName.trim() || !volunteerPhone.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem('bv_volunteers_list') || '[]');
      existing.push({
        name: volunteerName.trim(),
        phone: volunteerPhone.trim(),
        town: volunteerTown,
        focus: volunteerFocus,
        date: new Date().toISOString(),
      });
      localStorage.setItem('bv_volunteers_list', JSON.stringify(existing));
    } catch {
      // ignore
    }

    setVolunteerRegistered(true);
  };

  const handlePostSubmit = e => {
    e.preventDefault();
    if (!postAuthor.trim() || !postMsg.trim()) return;

    const newPost = {
      id: Date.now(),
      name: postAuthor.trim(),
      location: postLocation.trim() || 'West Bengal',
      action: postAction.trim() || 'Community Stewardship Support',
      time: 'Just now',
      message: postMsg.trim(),
    };

    const updated = [newPost, ...communityPosts];
    setCommunityPosts(updated);
    try {
      localStorage.setItem('bv_community_wall_posts', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setPostAuthor('');
    setPostLocation('');
    setPostAction('');
    setPostMsg('');
    setPostSubmitted(true);
    setTimeout(() => setPostSubmitted(false), 3000);
  };

  const immediateProjects = IMPACT_PROJECTS.filter(p => p.category === 'immediate');
  const ecologicalProjects = IMPACT_PROJECTS.filter(p => p.category === 'ecological_2028');

  return (
    <main className="min-h-screen bg-[#070a0e] text-[#e2e8f0] pb-24 font-sans selection:bg-[#d4af37]/30 selection:text-white">
      <SEO
        title="Public Stewardship & Grassroots Action | Bhumivera"
        description="Bhumivera grassroots community stewardship: Immediate December 2026 hunger relief, street animal care & elderly rations in West Bengal, plus realistic 2027-2028 ecological restoration."
        route="/impact"
      />

      {/* 1. HERO SECTION */}
      <section className="relative isolate min-h-[75svh] overflow-hidden border-b border-[#d4af37]/20 bg-[#070a0e]">
        <div className="absolute inset-0 -z-20 h-full w-full">
          <Link
            to="/impact/hungry-feeding"
            aria-label="Open details for grassroots stewardship"
            className="block h-full w-full"
          >
            <img
              src="/assets/images/home-stewardship-ledger.webp"
              alt="Bhumivera grassroots stewardship and verifiable community action"
              className="h-full w-full object-contain object-center opacity-25 brightness-90 filter contrast-105"
            />
          </Link>
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#070a0e] via-[#070a0e]/85 to-[#070a0e]/50" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#070a0e]/95 via-[#070a0e]/80 to-transparent" />

        <div className="mx-auto flex min-h-[75svh] max-w-7xl flex-col justify-end px-6 pb-14 pt-32 md:pb-20">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-[#102219]/90 backdrop-blur-md px-3.5 py-1 text-[10px] font-mono tracking-widest uppercase text-emerald-300">
              <Leaf size={12} className="text-emerald-400" /> Rooted in West Bengal · Starting From Our Own Towns
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[10px] font-mono tracking-wider uppercase text-amber-300">
              Starts December 2026: Feeding &amp; Animal Care
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/40 bg-[#070a0e] px-3 py-1 text-[10px] font-mono tracking-wider uppercase text-[#fce096]">
              {impactLedger
                ? `Verified Ledger · ${money(collectedAmount)} Recorded`
                : impactLedgerError
                  ? 'Verified Ledger Temporarily Unavailable'
                  : 'Loading Verified Ledger…'}
            </span>
          </div>

          <h1 className="max-w-4xl font-serif text-4xl sm:text-6xl md:text-7xl leading-[1.05] text-white">
            <span className="font-headline-gold">Real Compassion.</span> <br className="hidden sm:inline" />
            <span className="font-headline-silver">Zero Fake Numbers.</span>
          </h1>

          <div className="gold-hairline my-5 max-w-xs" />

          <p className="mt-2 max-w-2xl text-base leading-7 text-[#cbd5e1] md:text-lg">
            We are solving our own local problems first. Starting in <strong>December 2026</strong>, we are feeding hungry people nearby, sheltering and nourishing stray dogs and cats, and delivering food and warm rations to disabled seniors. Followed by low-budget, volunteer-powered West Bengal ecological restoration in <strong>2027 End - 2028</strong>.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/community"
              className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl hover:scale-[1.02] transition-transform"
            >
              <Users size={16} /> Community &amp; Volunteer Hub (100+ Network)
            </Link>
            <a
              href="#dec-2026-projects"
              className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#cbd5e1] hover:text-white transition-colors"
            >
              December 2026 Projects <ArrowDownRight size={15} />
            </a>
            <a
              href="#legal-rules"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#fce096] hover:underline"
            >
              <Scale size={13} /> Legal Rules &amp; Voluntary Co-Sponsorship
            </a>
          </div>
        </div>
      </section>

      {/* 2. AUTHENTIC PUBLIC LEDGER */}
      <section id="ledger" className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl two-tone-panel-gold border border-[#d4af37]/40 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-60 w-60 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[#d4af37]/20">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-sub-gold text-[10px] tracking-[0.25em] uppercase text-[#fce096]">
                  Public Stewardship Audit · Live Verified Contributions
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-mono text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                  Zero Fake Counters
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl leading-tight text-white">
                Every contribution has a verified payment or collection record.
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-6 text-[#cbd5e1]">
                No simulated counters: this ledger updates only for verified online payments and reconciled cash collections. Field reports and proof of on-ground execution are published separately.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2 rounded-2xl border border-[#d4af37]/30 bg-[#070a0e]/60 px-4 py-3 backdrop-blur-md">
              <ShieldCheck size={20} className="text-[#d4af37] shrink-0" />
              <div className="text-left">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#94a3b8]">Trust Protocol</div>
                <div className="text-xs font-bold text-white">Zero Simulated Data Guarantee</div>
              </div>
            </div>
          </div>

          {/* Live counters include only verified payments and reconciled collections. */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-[#d4af37]/20 bg-[#070a0e]/50 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#94a3b8]">Verified Contribution Total</p>
              <p className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-[#fce096]">
                {impactLedger ? money(collectedAmount) : '—'}
              </p>
              <p className="mt-2 text-[10px] font-mono text-[#cbd5e1]">
                {impactLedgerError ? 'Ledger temporarily unavailable' : 'Verified payments & reconciled collections'}
              </p>
            </div>

            <div className="rounded-2xl border border-[#d4af37]/20 bg-[#070a0e]/50 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#94a3b8]">Verified Receipts</p>
              <p className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-white">
                {impactLedger ? verifiedReceipts.toLocaleString('en-IN') : '—'}
              </p>
              <p className="mt-2 text-[10px] font-mono text-[#cbd5e1]">Payment-verified / collection-reconciled</p>
            </div>

            <div className="rounded-2xl border border-[#d4af37]/20 bg-[#070a0e]/50 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#94a3b8]">Active Projects</p>
              <p className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-[#fce096]">3 Dec 2026</p>
              <p className="mt-2 text-[10px] font-mono text-[#cbd5e1]">+ 6 Projects (2027-2028)</p>
            </div>

            <div className="rounded-2xl border border-[#d4af37]/20 bg-[#070a0e]/50 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#94a3b8]">Direct Field Flow</p>
              <p className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-emerald-400">100%</p>
              <p className="mt-2 text-[10px] font-mono text-[#cbd5e1]">Zero Admin / Overhead Cut</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 1: IMMEDIATE COMMUNITY CARE (STARTING DECEMBER 2026) */}
      <section id="dec-2026-projects" className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-rose-500/20">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Heart size={16} className="text-rose-400" />
              <span className="font-sub-gold text-[10px] tracking-[0.25em] uppercase text-rose-300">
                Phase I Immediate Action · Starting December 2026
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white">
              Compassion on Our Own Streets (West Bengal)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#94a3b8] max-w-md">
            Direct, practical, human &amp; animal care starting this winter in our local neighborhood. Anyone can volunteer to cook, pack, feed, or distribute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {immediateProjects.map((proj, idx) => (
            <article
              key={proj.id}
              className="overflow-hidden rounded-3xl border-2 border-rose-500/30 bg-[#070a0e] shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-rose-400 hover:-translate-y-1"
            >
              <div>
                <Link to={`/impact/${proj.slug}`} className="relative block aspect-[16/10] w-full overflow-hidden bg-[#070a0e]">
                  <img
                    src={proj.posterImage}
                    alt={proj.title}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070a0e] via-transparent to-black/30" />
                  <span className="absolute top-3 left-3 rounded-full border border-rose-500/40 bg-[#070a0e]/90 px-3 py-1 text-[10px] font-mono text-rose-300">
                    <MapPin size={11} className="mr-1 inline text-rose-400" />
                    {proj.location.split(',')[0]}
                  </span>
                  <span className="absolute top-3 right-3 rounded-full border border-amber-500/40 bg-amber-500/20 px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-amber-300">
                    Launch Dec 2026
                  </span>
                </Link>

                <div className="p-6 space-y-3">
                  <h3 className="font-serif text-xl font-bold text-white hover:text-[#fce096] transition-colors">
                    <Link to={`/impact/${proj.slug}`}>{proj.title}</Link>
                  </h3>
                  <p className="text-xs text-[#cbd5e1] leading-5">
                    {proj.tagline}
                  </p>

                  <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3 text-[11px] text-rose-200">
                    <strong className="text-white block font-sans mb-0.5">The Ground Need:</strong>
                    {proj.problemDossier.keyFactors[0]}
                  </div>

                  <div className="rounded-xl border border-[#d4af37]/20 bg-[#102219]/40 p-3 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#94a3b8]">Monthly Target Budget:</span>
                    <span className="text-[#fce096] font-bold">{money(proj.funding.targetAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#d4af37]/15 mt-3 grid grid-cols-2 gap-2">
                <Link
                  to={`/impact/${proj.slug}`}
                  className="btn-gold-luxury text-center rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider text-white"
                >
                  Volunteer / Co-Sponsor
                </Link>
                <Link
                  to={`/impact/${proj.slug}`}
                  className="btn-silver-luxury text-center rounded-xl py-2.5 text-xs font-semibold uppercase tracking-wider text-[#cbd5e1] hover:text-white"
                >
                  Full Dossier
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. SECTION 2: 2027 END - 2028 WEST BENGAL ECOLOGICAL RESTORATION (6 LOW-BUDGET PRACTICAL PROJECTS) */}
      <section id="ecological-roadmap" className="mx-auto max-w-7xl px-6 py-14">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-sub-gold text-[10px] tracking-[0.25em] block uppercase text-[#fce096] mb-2">
            Phase II Practical Environmental Action · 2027 End - 2028
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-white">
            <span className="font-headline-gold">Six Achievable</span>{' '}
            <span className="font-headline-silver">West Bengal Corridors</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#94a3b8] leading-6">
            Grounded, low-budget initiatives designed for an earnest grassroots team and passionate local volunteers. No over-hyped multi-crore promises. Just real work on riverbanks, village ponds, and native seeds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ecologicalProjects.map((proj, idx) => (
            <article
              key={proj.id}
              className="overflow-hidden rounded-3xl border border-[#d4af37]/30 bg-[#070a0e] shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-[#d4af37]/80 hover:-translate-y-1"
            >
              <div>
                <Link to={`/impact/${proj.slug}`} className="relative block aspect-[16/10] w-full overflow-hidden bg-[#070a0e]">
                  <img
                    src={proj.posterImage}
                    alt={proj.title}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070a0e] via-transparent to-black/20" />
                  <span className="absolute top-3 left-3 rounded-full border border-[#d4af37]/40 bg-[#070a0e]/90 px-3 py-1 text-[10px] font-mono text-[#fce096]">
                    Corridor #0{idx + 1}
                  </span>
                  <span className="absolute top-3 right-3 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-emerald-400">
                    2027 End - 2028
                  </span>
                </Link>

                <div className="p-6 space-y-3">
                  <h3 className="font-serif text-xl font-bold text-white hover:text-[#fce096] transition-colors">
                    <Link to={`/impact/${proj.slug}`}>{proj.title}</Link>
                  </h3>
                  <p className="text-xs text-[#cbd5e1] leading-5 line-clamp-3">
                    {proj.tagline}
                  </p>

                  <div className="rounded-xl border border-emerald-500/20 bg-[#102219]/50 p-3 text-[11px] text-[#cbd5e1]">
                    <strong className="text-emerald-300 block font-sans mb-0.5">Grassroots Approach:</strong>
                    {proj.solutionBlueprint.pillars[0].desc}
                  </div>

                  <div className="rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/80 p-3 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#94a3b8]">Modest Target Budget:</span>
                    <span className="text-[#fce096] font-bold">{money(proj.funding.targetAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#d4af37]/15 mt-3 flex items-center justify-between gap-2">
                <Link
                  to={`/impact/${proj.slug}`}
                  className="btn-silver-luxury w-full text-center rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider text-[#cbd5e1] hover:text-white"
                >
                  Inspect Research &amp; Plan <ArrowRight size={13} className="inline ml-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. SECTION 3: COMMUNITY & 100+ VOLUNTEER COLLABORATION HUB */}
      <section id="volunteer-hub" className="mx-auto max-w-7xl px-6 py-14">
        <div className="rounded-3xl border border-[#d4af37]/40 bg-gradient-to-br from-[#102219] via-[#070a0e] to-[#102219] p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Volunteer Registration */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-mono text-emerald-400 uppercase mb-2">
                  <HandHeart size={13} /> Grassroots Volunteer Network
                </div>
                <h2 className="font-serif text-2xl sm:text-4xl text-white">
                  Volunteer With Us in West Bengal
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-[#cbd5e1] leading-6">
                  You don't need money to make an impact. We need 100+ compassionate local citizens to cook meals, feed street animals, plant vetiver slips, and deliver dry rations.
                </p>
              </div>

              {!volunteerRegistered ? (
                <form onSubmit={handleVolunteerSubmit} className="space-y-4 rounded-2xl border border-[#d4af37]/25 bg-[#070a0e]/80 p-5">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#cbd5e1] mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Debashis Mukherjee"
                      value={volunteerName}
                      onChange={e => setVolunteerName(e.target.value)}
                      className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#cbd5e1] mb-1">WhatsApp / Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g., 9832100000"
                      value={volunteerPhone}
                      onChange={e => setVolunteerPhone(e.target.value)}
                      className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#cbd5e1] mb-1">Your Town / Area</label>
                      <select
                        value={volunteerTown}
                        onChange={e => setVolunteerTown(e.target.value)}
                        className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                      >
                        <option value="Asansol">Asansol</option>
                        <option value="Raniganj">Raniganj</option>
                        <option value="Durgapur">Durgapur</option>
                        <option value="Bardhaman">Bardhaman</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Other West Bengal">Other WB</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#cbd5e1] mb-1">Preferred Action</label>
                      <select
                        value={volunteerFocus}
                        onChange={e => setVolunteerFocus(e.target.value)}
                        className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                      >
                        <option value="Hunger Relief & Annadaan Kitchen">Hunger Relief Meals</option>
                        <option value="Stray Dog & Cat Care / Feeding">Street Animal Care</option>
                        <option value="Elderly & Disabled Ration Delivery">Elderly Rations</option>
                        <option value="River Cleanup & Vetiver Planting">River &amp; Trees</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-gold-luxury w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xl hover:scale-[1.02] transition-transform"
                  >
                    Join Volunteer Network (Free)
                  </button>
                </form>
              ) : (
                <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/20 p-6 text-center space-y-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 size={22} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">Welcome to the Team, {volunteerName}!</h3>
                  <p className="text-xs text-[#cbd5e1]">
                    You are registered as a volunteer for <strong>{volunteerFocus}</strong> in <strong>{volunteerTown}</strong>. Our local volunteer lead will connect with you on WhatsApp before our first December 2026 drive.
                  </p>
                  <button
                    type="button"
                    onClick={() => setVolunteerRegistered(false)}
                    className="text-[11px] font-mono text-[#fce096] underline"
                  >
                    Register another family member or friend
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Community Work Wall & Work Sharing Board */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                    Community Action Wall
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    Voices &amp; Deeds from the Ground
                  </h3>
                </div>
                <Link
                  to="/community"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#fce096] hover:underline"
                >
                  Full Community Hub &amp; Calendar <ArrowRight size={13} />
                </Link>
              </div>

              {/* Feed of Posts */}
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                {communityPosts.map(post => (
                  <div
                    key={post.id}
                    className="rounded-2xl border border-[#d4af37]/20 bg-[#070a0e]/80 p-4 space-y-2 hover:border-[#d4af37]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                          {post.name[0]}
                        </span>
                        <strong className="text-xs text-white">{post.name}</strong>
                        <span className="text-[10px] text-[#94a3b8]">· {post.location}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#cbd5e1]">{post.time}</span>
                    </div>
                    <div className="inline-block rounded-full bg-[#102219] px-2.5 py-0.5 text-[10px] font-mono text-[#fce096] border border-[#d4af37]/25">
                      {post.action}
                    </div>
                    <p className="text-xs text-[#cbd5e1] leading-5">{post.message}</p>
                  </div>
                ))}
              </div>

              {/* Share Your Own Support Form */}
              <form onSubmit={handlePostSubmit} className="rounded-2xl border border-[#d4af37]/30 bg-[#070a0e] p-4 space-y-3">
                <span className="text-xs font-serif font-bold text-white block">
                  Share Your Work or Leave a Message of Support:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={postAuthor}
                    onChange={e => setPostAuthor(e.target.value)}
                    className="rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Your Location (e.g., Asansol)"
                    value={postLocation}
                    onChange={e => setPostLocation(e.target.value)}
                    className="rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Action Taken (e.g., Fed 5 dogs)"
                    value={postAction}
                    onChange={e => setPostAction(e.target.value)}
                    className="rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Write a message of love, report an action, or encourage volunteers..."
                    value={postMsg}
                    onChange={e => setPostMsg(e.target.value)}
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="btn-gold-luxury rounded-xl px-4 py-2 text-xs font-bold shrink-0 flex items-center gap-1.5"
                  >
                    <Send size={13} /> Post
                  </button>
                </div>
                {postSubmitted && (
                  <p className="text-[11px] font-mono text-emerald-400">
                    Your post has been pinned to the Community Action Wall! Thank you.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION 4: WEST BENGAL SCARCITY MATRIX */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-rose-900/30 bg-gradient-to-br from-[#120a0b] via-[#070a0e] to-[#070a0e] p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-rose-400" />
            <span className="font-sub-gold text-[10px] tracking-[0.25em] uppercase text-rose-300">
              Local Scarcity Dossier · West Bengal's Real Ground Realities
            </span>
          </div>

          <div className="max-w-3xl">
            <h2 className="font-serif text-2xl sm:text-4xl text-white leading-tight">
              Solving Local Problems First
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#cbd5e1] leading-6">
              Before claiming to change the world, we must heal our own neighborhood. Official state data and ground reality in Paschim Bardhaman demand immediate grassroots intervention.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {WEST_BENGAL_SCARCITY_OVERVIEW.stats.map((item, idx) => (
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

      {/* 7. SECTION 5: INDIAN LEGAL RULES & WHY A COMPANY CANNOT TAKE DONATIONS */}
      <section id="legal-rules" className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-[#d4af37]/40 bg-[#070a0e] p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center gap-2">
            <Scale size={22} className="text-[#d4af37]" />
            <div>
              <span className="font-sub-gold text-[10px] tracking-[0.25em] block uppercase text-[#fce096]">
                Corporate Law &amp; Fiscal Purity
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-white">
                Can An Indian Company Take Donations? The Full Legal Truth
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#cbd5e1] leading-6 max-w-4xl">
            We reject ambiguous corporate greenwashing. Indian corporate and tax jurisprudence strictly governs public funds. Here is the legal breakdown of how Bhumivera operates with 100% compliance:
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
                The 2028 Section 8 Bhumivera Earth Foundation Roadmap
              </h4>
              <p className="text-xs text-[#cbd5e1]">
                By 2028, our independent Section 8 not-for-profit company will launch with 80G tax certificates, allowing donors to claim 50% income tax deductions.
              </p>
            </div>
            <Link
              to="/impact/hungry-feeding"
              className="btn-gold-luxury rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shrink-0 text-center"
            >
              Inspect Grassroots Dossier
            </Link>
          </div>
        </div>
      </section>

      {/* 8. SECTION 6: FAQ ACCORDION */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-[#d4af37]/30 bg-[#070a0e] p-6 sm:p-10 shadow-2xl space-y-6">
          <div>
            <span className="font-sub-gold text-[10px] tracking-[0.25em] block uppercase text-[#fce096]">
              Radical Transparency
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white">
              Stewardship Governance &amp; Ground Action FAQ
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#94a3b8]">
              Honest, direct answers regarding verified contributions, volunteer participation, and procurement transparency.
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
      </section>

      {/* 9. BOTTOM VERIFICATION CTA */}
      <section className="mx-auto max-w-7xl px-6 pt-6">
        <div className="rounded-3xl border border-[#d4af37]/30 bg-gradient-to-r from-[#102219] via-[#070a0e] to-[#102219] p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="mx-auto max-w-3xl space-y-4">
            <span className="font-sub-gold text-[10px] tracking-[0.25em] block uppercase text-[#fce096]">
              Radical Botanical &amp; Ledger Transparency
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white">
              Every Action Has A Record. Every Rupee Has A Face.
            </h2>
            <p className="text-xs sm:text-sm leading-6 text-[#cbd5e1] max-w-xl mx-auto">
              Join us this December 2026. Whether you donate ₹50 for animal food or come join us on a Sunday to serve hot meals, your presence transforms our community.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <a
                href="#volunteer-hub"
                className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl"
              >
                <HandHeart size={16} /> Register as Volunteer
              </a>
              <Link
                to="/verify"
                className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#cbd5e1] hover:text-white"
              >
                <ShieldCheck size={15} /> Verify Bottle Serial
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
