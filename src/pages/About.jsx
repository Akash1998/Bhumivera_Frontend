import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Leaf,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  FlaskConical,
  Award,
  Building2,
  MapPin,
} from 'lucide-react';
import SEO, { GLOBAL_CORPORATE_FAQS } from '../components/SEO';
import { ABOUT_PAGE_DATA } from '../data/bhumiveraUniqueData';

const HERITAGE_CHAPTERS = [
  {
    chapter: 'Chapter I',
    dateTime: '2016-09-22',
    eraLabel: '2016: Genesis (September 22, 2016)',
    heading: 'Dilip Prasad Nonia Establishes MPG E-Business Private Limited in Asansol',
    detail:
      'On September 22, 2016, family patriarch Dilip Prasad Nonia officially incorporated MPG E-Business Private Limited (CIN: U74999WB2016PTC217735) at 608, BNR Sen Raleigh Road, Park Lane, Behind Spencer, Asansol, West Bengal - 713305. This foundational enterprise built a resilient regional supply chain and household distribution network for authentic herbal preparations, wellness remedies, and daily essentials across Asansol and West Bengal.',
    milestoneBadge: 'CIN: U74999WB2016PTC217735 · Est. Sept 22, 2016',
  },
  {
    chapter: 'Chapter II',
    dateTime: '2016/2025',
    eraLabel: '2016–2025: The Formulation Years',
    heading: 'Direct Consumer Testing, Herbal Sourcing & Sub-28°C Botanical Refinement',
    detail:
      'Over nearly a decade of continuous household feedback and regional trust building across West Bengal, the family refined its botanical extraction protocols under MPG E-Business. By pioneering cold-pressed Indian botanical maceration below 28°C, calibrating wash-off bases to skin-identical pH 5.0–5.5, and eliminating inert fillers in favor of 100% active percentages, the formulation blueprint for The Transparent Maison was forged.',
    milestoneBadge: '10 Years of Regional Trust · Asansol, West Bengal',
  },
  {
    chapter: 'Chapter III',
    dateTime: '2026-08-04',
    eraLabel: '2026: The Digital Maison (August 4, 2026)',
    heading: 'Akash Prasad Launches Bhumivera Organics India Private Limited & bhumivera.com',
    detail:
      'On August 4, 2026, Founder Akash Prasad and Director Akash Prasad, Payal Prasad & Aman Prasad formally incorporated Bhumivera Organics India Private Limited with the Ministry of Corporate Affairs (MCA), operating from Brand HQ on G.T. Road, Gopalpur, Asansol, West Bengal 713304. Through its flagship digital platform at bhumivera.com, Bhumivera brings a decade of family botanical manufacturing heritage to global clean-beauty standards with radical milligram-level ingredient disclosure.',
    milestoneBadge: 'Incorporated August 4, 2026 · Flagship: bhumivera.com',
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
        title="Bhumivera | The Transparent Maison — Rooted in Heritage Since 2016"
        description="Discover Bhumivera (bhumivera.com). Founded on a decade of family manufacturing heritage with MPG E-Business (Est. 2016), delivering 100% active, milligram-disclosed cold-pressed botanical skincare."
        keywords="Bhumivera, bhumivera.com, MPG E-Business, MPG E-Business Private Limited, Dilip Prasad Nonia, Akash Prasad, Akash Prasad, Payal Prasad & Aman Prasad, Asansol West Bengal, Bhumivera Organics India Private Limited, U74999WB2016PTC217735"
        route="/about"
        faqs={GLOBAL_CORPORATE_FAQS}
        breadcrumbs={[
          { name: 'Bhumivera', url: 'https://bhumivera.com/' },
          { name: 'Our Heritage (Est. 2016)', url: 'https://bhumivera.com/about' },
        ]}
      />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#070a0e] text-white py-24 px-6">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={ABOUT_PAGE_DATA.heroImage}
            alt="Bhumivera 10-year family botanical manufacturing heritage in Asansol West Bengal since 2016"
            width="1400"
            height="800"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070a0e] via-[#070a0e]/80 to-[#070a0e]/90" />
        </div>

        <article className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/40 bg-[#0d1520]/80 mb-6 backdrop-blur-sm">
            <Sparkles size={14} className="text-[#d4af37]" />
            <span className="font-sub-gold text-[10px] tracking-[0.22em]">
              MPG E-Business Heritage (<time dateTime="2016-09-22">Est. Sept 22, 2016</time>) · Bhumivera Flagship (<time dateTime="2026-08-04">Inc. Aug 4, 2026</time>)
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight mb-4 leading-tight">
            <span className="font-headline-gold">Bhumivera: The Transparent Maison,</span>{' '}
            <span className="font-headline-silver italic font-light">Rooted in Heritage Since 2016.</span>
          </h1>
          <div className="gold-hairline my-6 max-w-xs mx-auto" />
          <p className="font-sub-silver text-xs sm:text-sm tracking-[0.14em] uppercase mb-4 text-[#fce096]/90">
            Parent Legacy: MPG E-Business Private Limited (CIN: U74999WB2016PTC217735) · Flagship: Bhumivera Organics India Private Limited (<a href="https://bhumivera.com" className="underline hover:text-white">bhumivera.com</a>)
          </p>
          <p className="text-base md:text-lg text-[#cbd5e1] max-w-3xl mx-auto leading-relaxed">
            <strong>Bhumivera</strong> (<a href="https://bhumivera.com" className="text-[#fce096] underline">bhumivera.com</a>) is not a fledgling standalone startup—it is the modern digital flagship of a 10-year family manufacturing and herbal distribution legacy in <strong>Asansol, West Bengal</strong>. Originating on <time dateTime="2016-09-22">September 22, 2016</time>, when patriarch <strong>Dilip Prasad Nonia</strong> established <strong>MPG E-Business Private Limited</strong> (CIN: <span className="font-mono text-[#fce096]">U74999WB2016PTC217735</span>), our family spent a decade mastering botanical supply chains and household wellness formulations before <strong>Akash Prasad</strong> (Founder) and <strong>Akash Prasad, Payal Prasad & Aman Prasad</strong> (Director) incorporated <strong>Bhumivera Organics India Private Limited</strong> on <time dateTime="2026-08-04">August 4, 2026</time>.
          </p>
        </article>
      </section>

      {/* 2. MULTI-CHAPTER HERITAGE TIMELINE (2016 -> 2016-2025 -> 2026) */}
      <section aria-labelledby="heritage-timeline-heading" className="max-w-7xl mx-auto px-6 py-14">
        <div className="rounded-3xl two-tone-panel-gold border border-[#d4af37]/40 p-8 sm:p-12 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-[#d4af37]/25 pb-5">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#fce096] flex items-center gap-2">
                <Award size={14} className="text-[#d4af37]" /> Official Corporate &amp; Family Lineage (<time dateTime="2016-09-22">2016</time> – <time dateTime="2026-08-04">2026</time>)
              </span>
              <h2 id="heritage-timeline-heading" className="font-serif text-2xl sm:text-4xl text-white mt-1">
                From MPG E-Business (2016) to Bhumivera at bhumivera.com (2026)
              </h2>
            </div>
            <span className="rounded-full bg-[#070a0e] border border-[#d4af37]/40 px-4 py-1.5 font-mono text-xs font-bold text-[#fce096]">
              10 Years of Group Heritage · Asansol, West Bengal
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HERITAGE_CHAPTERS.map((item) => (
              <article
                key={item.chapter}
                className="rounded-2xl bg-[#070a0e]/85 border border-[#d4af37]/30 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
                      {item.chapter}
                    </span>
                    <time
                      dateTime={item.dateTime}
                      className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#fce096]"
                    >
                      {item.eraLabel}
                    </time>
                  </div>
                  <h2 className="font-serif text-xl font-bold text-white mb-3">{item.heading}</h2>
                  <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">{item.detail}</p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#d4af37]/20">
                  <span className="font-mono text-[10px] text-[#fce096] block">{item.milestoneBadge}</span>
                </div>
              </article>
            ))}
          </div>

          {/* Corporate Registry & Lineage Verification Grid */}
          <div className="mt-8 pt-6 border-t border-[#d4af37]/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <article className="rounded-xl bg-[#070a0e]/60 border border-[#d4af37]/20 p-4">
              <span className="text-[#94a3b8] block uppercase tracking-wider font-mono text-[10px]">
                Current Flagship Corporate Entity
              </span>
              <strong className="text-white block mt-1">Bhumivera Organics India Private Limited</strong>
              <span className="text-[#fce096] text-[11px] font-mono mt-0.5 block">
                Incorporated: <time dateTime="2026-08-04">August 4, 2026</time> (MCA)
              </span>
              <span className="text-[#94a3b8] text-[11px] block mt-0.5">
                Founder: Akash Prasad · Director: Akash Prasad, Payal Prasad & Aman Prasad
              </span>
            </article>

            <article className="rounded-xl bg-[#070a0e]/60 border border-[#d4af37]/20 p-4">
              <span className="text-[#94a3b8] block uppercase tracking-wider font-mono text-[10px]">
                Parent Heritage / Legacy Entity
              </span>
              <strong className="text-white block mt-1">MPG E-Business Private Limited</strong>
              <span className="text-[#fce096] text-[11px] font-mono mt-0.5 block">
                CIN: U74999WB2016PTC217735
              </span>
              <span className="text-[#94a3b8] text-[11px] block mt-0.5">
                Inc. <time dateTime="2016-09-22">September 22, 2016</time> · Founder: Dilip Prasad Nonia
              </span>
            </article>

            <article className="rounded-xl bg-[#070a0e]/60 border border-[#d4af37]/20 p-4">
              <span className="text-[#94a3b8] block uppercase tracking-wider font-mono text-[10px]">
                Brand HQ (Bhumivera)
              </span>
              <strong className="text-white block mt-1">G.T. Road, Gopalpur, Asansol</strong>
              <span className="text-[#fce096] text-[11px] font-mono mt-0.5 block">
                Pincode: 713304 · West Bengal, India
              </span>
              <a
                href="https://bhumivera.com"
                className="text-[#d4af37] text-[11px] underline block mt-0.5"
              >
                https://bhumivera.com
              </a>
            </article>

            <article className="rounded-xl bg-[#070a0e]/60 border border-[#d4af37]/20 p-4">
              <span className="text-[#94a3b8] block uppercase tracking-wider font-mono text-[10px]">
                Heritage Corporate Office (MPG E-Business)
              </span>
              <strong className="text-white block mt-1">608, BNR Sen Raleigh Road, Park Lane</strong>
              <span className="text-[#fce096] text-[11px] font-mono mt-0.5 block">
                Behind Spencer, Asansol - 713305
              </span>
              <span className="text-[#94a3b8] text-[11px] block mt-0.5">
                Asansol, West Bengal, India
              </span>
            </article>
          </div>
        </div>
      </section>

      {/* 3. CORE PHILOSOPHY: THE TRANSPARENT MAISON */}
      <section aria-labelledby="transparent-maison-heading" className="py-12 px-6 max-w-7xl mx-auto">
        <article className="rounded-3xl two-tone-card border border-[#d4af37]/30 p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="overflow-hidden rounded-2xl border border-[#d4af37]/30 shadow-lg bg-[#070a0e]">
            <img
              src={ABOUT_PAGE_DATA.genesisImage}
              alt="Bhumivera cold-pressed Indian botanical extraction under 28 degrees Celsius in Asansol West Bengal"
              width="700"
              height="525"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="space-y-5">
            <span className="font-sub-gold text-[10px] tracking-[0.24em] block">
              01 · Core Philosophy &amp; Transparency
            </span>
            <h2 id="transparent-maison-heading" className="font-serif text-3xl sm:text-4xl text-white leading-tight">
              <span className="font-headline-gold">Why Bhumivera Is Called</span>{' '}
              <span className="font-headline-silver">&ldquo;The Transparent Maison&rdquo;</span>
            </h2>
            <div className="gold-hairline my-4 max-w-xs" />
            <p className="text-sm sm:text-base leading-7 text-[#cbd5e1]">
              Rooted in the 10-year manufacturing discipline started by <strong>Dilip Prasad Nonia</strong> under <strong>MPG E-Business Private Limited</strong> (<time dateTime="2016-09-22">Est. 2016</time>) and modernized by <strong>Akash Prasad</strong> at <strong>bhumivera.com</strong>, <strong>Bhumivera</strong> distinguishes itself in clean beauty through radical ingredient honesty:
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-[#cbd5e1]">
              <li className="rounded-xl bg-[#070a0e]/70 border border-[#d4af37]/25 p-3.5">
                <strong className="text-[#fce096]">100% Active Percentage:</strong> Every formulation highlights that each botanical and biomimetic humectant serves an active purpose for the skin barrier rather than acting as an inert filler.
              </li>
              <li className="rounded-xl bg-[#070a0e]/70 border border-[#d4af37]/25 p-3.5">
                <strong className="text-[#fce096]">Milligram Disclosure:</strong> Breaking away from opaque cosmetic labelling practices, Bhumivera prints the exact percentage and milligram weight of ingredients (such as 25 mg Reetha, 20 mg Amla, 10 mg Rosemary Oil, 3% Charcoal, and 4% Sea Buckthorn) directly on packaging.
              </li>
              <li className="rounded-xl bg-[#070a0e]/70 border border-[#d4af37]/25 p-3.5">
                <strong className="text-[#fce096]">Cold-Pressed Under 28°C:</strong> Indian botanicals are extracted at temperatures below 28°C to preserve heat-sensitive Omega-7 lipids, polyphenols, and natural vitamins.
              </li>
            </ul>
            <div className="pt-3 flex flex-wrap gap-4">
              <Link
                to="/science"
                className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg"
              >
                Explore Product Science <ArrowRight size={14} />
              </Link>
              <Link
                to="/shop"
                className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#cbd5e1]"
              >
                Browse Flagship Catalog
              </Link>
            </div>
          </div>
        </article>
      </section>

      {/* 4. FOUR OPERATIONAL PILLARS */}
      <section aria-labelledby="operational-pillars-heading" className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10 text-center sm:text-left">
          <span className="font-sub-gold text-[10px] tracking-[0.24em] block">
            02 · Four Operational Pillars in Asansol, West Bengal
          </span>
          <h2 id="operational-pillars-heading" className="mt-2 font-serif text-3xl sm:text-4xl">
            <span className="font-headline-gold">How Every Bhumivera Bottle Is Formulated,</span>{' '}
            <span className="font-headline-silver">Tested &amp; Dispatched</span>
          </h2>
          <div className="gold-hairline my-4 max-w-xs" />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {ABOUT_PAGE_DATA.milestones.map((m) => (
            <article key={m.title} className="overflow-hidden rounded-2xl two-tone-card border border-[#d4af37]/25 shadow-lg">
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#070a0e]">
                <img
                  src={m.image}
                  alt={m.title}
                  width="640"
                  height="360"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
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

      {/* 5. CORPORATE FAQ & LINEAGE VERIFICATION */}
      <section aria-labelledby="heritage-faq-heading" className="max-w-7xl mx-auto px-6 pt-8">
        <div className="rounded-3xl two-tone-panel-gold p-8 sm:p-12 text-white border border-[#d4af37]/40 shadow-2xl">
          <span className="font-sub-gold text-[10px] tracking-[0.24em] block">
            03 · Verified Corporate &amp; Heritage FAQ
          </span>
          <h2 id="heritage-faq-heading" className="mt-2 font-serif text-3xl sm:text-4xl text-white">
            <span className="font-headline-gold">Bhumivera &amp; MPG E-Business</span>{' '}
            <span className="font-headline-silver">Institutional Record</span>
          </h2>
          <div className="gold-hairline my-4 max-w-xs" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {GLOBAL_CORPORATE_FAQS.map((faq, idx) => (
              <article key={idx} className="rounded-2xl bg-[#070a0e]/85 border border-[#d4af37]/30 p-5">
                <h3 className="font-serif text-lg font-bold text-[#fce096] mb-2">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">{faq.a}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="btn-gold-luxury rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg"
            >
              Browse the Collection at bhumivera.com
            </Link>
            <a
              href="https://linktr.ee/bhumivera"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-silver-luxury rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#cbd5e1]"
            >
              Official Bhumivera Linktree ↗
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
