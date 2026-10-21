import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Sparkles, ShieldCheck, ArrowRight, FlaskConical, CheckCircle2, Award } from 'lucide-react';
import SEO from '../components/SEO';
import { ABOUT_PAGE_DATA } from '../data/bhumiveraUniqueData';

const HERITAGE_TIMELINE = [
  {
    era: '2016 · Founding Botanical Stewardship',
    heading: 'Established Under MPG E Business Private Limited',
    detail:
      'Our journey began in 2016 under our founding enterprise, MPG E Business Private Limited, formulating and distributing plant-based personal care and Ayurvedic botanical preparations through brick-and-mortar apothecaries and offline retail partners across India.',
  },
  {
    era: '2018 – 2025 · Regional Harvest & Clinical pH Calibration',
    heading: 'A Decade of Patron Trust & Formulation Refinement',
    detail:
      'Across ten years of offline customer feedback and analytical R&D, we established direct grower corridors in Leh-Ladakh (Sea Buckthorn), Pampore (Mongra Saffron), Assam (Bamboo Charcoal), and the Western Ghats (Reetha, Amla, Bhringraj & Rosemary), calibrating every wash-off formula to skin- and cuticle-identical pH 5.0–5.5.',
  },
  {
    era: 'August 2026 · Luxury Flagship Incorporation & Trademark',
    heading: 'Bhumivera Organics India Private Limited',
    detail:
      'Marking a decade of offline formulation mastery since 2016, we formally incorporated our dedicated luxury flagship corporate entity—Bhumivera Organics India Private Limited—and registered our official trademark in August 2026 to bring our serialized 250-unit micro-batch apothecary directly to pan-India and global patrons.',
  },
];

const HERITAGE_FAQS = [
  {
    q: 'When was Bhumivera founded and how old is the brand?',
    a: 'Bhumivera’s botanical formulation and offline retail heritage was established in 2016 under its founding enterprise, MPG E Business Private Limited. After 10 years of serving patrons across offline Indian retail and apothecary channels (2016–2026), the house formally incorporated its dedicated luxury flagship entity and registered trademark as Bhumivera Organics India Private Limited in August 2026.',
  },
  {
    q: 'Why do corporate registries show August 2026 for Bhumivera Organics India Private Limited?',
    a: 'August 2026 marks the 10-year milestone corporate restructuring and trademark incorporation of Bhumivera Organics India Private Limited as a dedicated luxury skincare and haircare maison, building on a decade of established offline botanical formulation and retail distribution since 2016 under MPG E Business Private Limited.',
  },
];

export default function About() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <main className="bg-[#070a0e] text-[#e2e8f0] font-sans pb-28 pt-10 selection:bg-[#d4af37]/30 selection:text-white">
      <SEO
        title="Our 10-Year Heritage (Est. 2016) & Botanical Craft | Bhumivera Organics"
        description="Established in 2016 under founding enterprise MPG E Business Private Limited and incorporated as luxury flagship Bhumivera Organics India Private Limited in August 2026. Discover a decade of pH-calibrated botanical skincare and haircare."
        route="/about"
        faqs={HERITAGE_FAQS}
        breadcrumbs={[
          { name: 'Bhumivera Organics (Est. 2016)', url: '/' },
          { name: 'Our 10-Year Heritage & Story', url: '/about' },
        ]}
      />
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#070a0e] text-white py-24 px-6">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={ABOUT_PAGE_DATA.heroImage}
            alt="Bhumivera Organics 10-year botanical workshop and formulation heritage since 2016"
            width="1400"
            height="800"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070a0e] via-[#070a0e]/80 to-[#070a0e]/90" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/40 bg-[#0d1520]/80 mb-6 backdrop-blur-sm">
            <Sparkles size={14} className="text-[#d4af37]" />
            <span className="font-sub-gold text-[10px] tracking-[0.26em]">
              Est. 2016 Heritage · Incorporated as Luxury Flagship Aug 2026
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight mb-4 leading-tight">
            <span className="font-headline-gold">A Decade of Botanical Mastery,</span>{' '}
            <span className="font-headline-silver italic font-light">Since 2016.</span>
          </h1>
          <div className="gold-hairline my-6 max-w-xs mx-auto" />
          <p className="font-sub-silver text-xs sm:text-sm tracking-[0.16em] uppercase mb-4 text-[#fce096]/90">
            Founded 2016 (MPG E Business Pvt. Ltd.) · Luxury Maison Incorporated Aug 2026 (Bhumivera Organics India Pvt. Ltd.)
          </p>
          <p className="text-base md:text-lg text-[#cbd5e1] max-w-3xl mx-auto leading-relaxed">
            For over ten years since 2016, our formulations have earned the trust of patrons across offline Indian retail and apothecary channels under our founding enterprise, <strong>MPG E Business Private Limited</strong>. In August 2026, we formally incorporated our dedicated luxury flagship entity and registered trademark—<strong>Bhumivera Organics India Private Limited</strong>—to bring exact botanical concentrations, pH 5.0–5.5 calibration, and verifiable cleanroom quality to global and pan-India digital patrons.
          </p>
        </div>
      </section>

      {/* 1B. 10-YEAR CORPORATE HERITAGE TIMELINE (2016 -> AUGUST 2026) */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="rounded-3xl two-tone-panel-gold border border-[#d4af37]/40 p-8 sm:p-12 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-[#d4af37]/25 pb-5">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#fce096] flex items-center gap-2">
                <Award size={14} className="text-[#d4af37]" /> Official Institutional Lineage (2016 – 2026)
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-white mt-1">
                10 Years of Proven Offline Apothecary Trust
              </h2>
            </div>
            <span className="rounded-full bg-[#070a0e] border border-[#d4af37]/40 px-4 py-1.5 font-mono text-xs font-bold text-[#fce096]">
              Est. 2016 · 10+ Years
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HERITAGE_TIMELINE.map((item, idx) => (
              <div key={idx} className="rounded-2xl bg-[#070a0e]/85 border border-[#d4af37]/30 p-6 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#fce096] block mb-2">
                    {item.era}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white mb-3">{item.heading}</h3>
                  <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. THE GENESIS */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl two-tone-card border border-[#d4af37]/30 p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="overflow-hidden rounded-2xl border border-[#d4af37]/30 shadow-lg bg-[#070a0e]">
            <img
              src={ABOUT_PAGE_DATA.genesisImage}
              alt="Botanical extraction and laboratory calibration since 2016"
              width="700"
              height="525"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="space-y-5">
            <span className="font-sub-gold text-[10px] tracking-[0.24em] block">
              01 · Why Bhumivera Exists
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white leading-tight">
              <span className="font-headline-gold">Traditional Indian Flora</span> <span className="font-headline-silver">Meets Analytical Discipline.</span>
            </h2>
            <div className="gold-hairline my-4 max-w-xs" />
            <p className="text-sm sm:text-base leading-7 text-[#cbd5e1]">
              Indian botanicals—such as Ladakh Sea Buckthorn, Pampore Kashmiri Saffron, Assam Bamboo Charcoal, Neem, Tulsi, Amla, and Bhringraj—carry extraordinary phytochemical complexity. Yet their benefits depend entirely on how gently they are extracted and the pH of the base they are suspended in.
            </p>
            <p className="text-sm sm:text-base leading-7 text-[#cbd5e1]">
              Every Bhumivera cleanser, shampoo, and elixir is formulated without harsh sulfates (SLS/SLES) or synthetic fillers, and paired with measured clinical co-actives like Niacinamide, Hyaluronic Acid, and Botanical Glycerin.
            </p>
            <div className="pt-3 flex flex-wrap gap-4">
              <Link
                to="/science"
                className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg"
              >
                Explore Product Science <ArrowRight size={14} />
              </Link>
              <Link
                to="/provenance-engine"
                className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#cbd5e1]"
              >
                View Harvest Corridors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 4 REAL-LIFE PILLARS WITH UNIQUE PHOTOGRAPHS */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10 text-center sm:text-left">
          <span className="font-sub-gold text-[10px] tracking-[0.24em] block">
            02 · Four Operational Pillars
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
            <span className="font-headline-gold">How Every Bottle Is Made,</span> <span className="font-headline-silver">Tested &amp; Dispatched</span>
          </h2>
          <div className="gold-hairline my-4 max-w-xs" />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {ABOUT_PAGE_DATA.milestones.map((m) => (
            <article key={m.title} className="overflow-hidden rounded-2xl two-tone-card border border-[#d4af37]/25 shadow-lg">
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#070a0e]">
                <img src={m.image} alt={m.title} width="640" height="360" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="p-6 sm:p-8">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#fce096] bg-[#070a0e] px-2.5 py-1 rounded-full border border-[#d4af37]/30 inline-block">
                  {m.year}
                </span>
                <h3 className="mt-3 font-serif text-2xl font-bold text-white">{m.title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-6 text-[#cbd5e1]">{m.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. CLEANROOM & MANIFESTO BANNER */}
      <section className="max-w-7xl mx-auto px-6 pt-8">
        <div className="grid lg:grid-cols-2 gap-8 rounded-3xl two-tone-panel-gold p-8 sm:p-12 text-white items-center border border-[#d4af37]/40 shadow-2xl">
          <div className="grid grid-cols-2 gap-4">
            <img
              src={ABOUT_PAGE_DATA.manifestoImage}
              alt="Botanical ingredients on stone"
              width="400"
              height="400"
              className="aspect-square w-full rounded-2xl object-cover border border-[#d4af37]/25"
            />
            <img
              src={ABOUT_PAGE_DATA.cleanroomImage}
              alt="GMP cleanroom bottle filling line"
              width="400"
              height="400"
              className="aspect-square w-full rounded-2xl object-cover border border-[#d4af37]/25"
            />
          </div>
          <div className="space-y-4">
            <span className="font-sub-gold text-[10px] tracking-[0.24em] block">
              Our Written Pledge Since 2016
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white">
              <span className="font-headline-gold">Verify</span> <span className="font-headline-silver">Everything We Do.</span>
            </h2>
            <div className="gold-hairline my-4 max-w-xs" />
            <p className="text-xs sm:text-sm leading-6 text-[#cbd5e1]">
              Whether you are checking a bottle’s serial number on our Product Verification page, comparing INCI concentrations on the Somatic Label Registry, or reviewing our public environmental impact ledger, every Bhumivera claim is backed by a primary record.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-gold-luxury rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                Browse the Collection
              </Link>
              <Link to="/impact" className="btn-silver-luxury rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#cbd5e1]">
                Inspect Impact Ledger
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
