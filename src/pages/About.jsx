import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Sparkles, ShieldCheck, ArrowRight, FlaskConical, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import { ABOUT_PAGE_DATA } from '../data/bhumiveraUniqueData';

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
        title="Our Story & Botanical Craft | Bhumivera"
        description="Discover how Bhumivera pairs traditional Indian botanicals with pH-calibrated dermatological actives, cleanroom filling, and full label honesty."
        route="/about"
      />
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#070a0e] text-white py-24 px-6">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={ABOUT_PAGE_DATA.heroImage}
            alt="Bhumivera botanical workshop and formulation heritage"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070a0e] via-[#070a0e]/80 to-[#070a0e]/90" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/40 bg-[#0d1520]/80 mb-6 backdrop-blur-sm">
            <Sparkles size={14} className="text-[#d4af37]" />
            <span className="font-sub-gold text-[10px] tracking-[0.26em]">
              Our Story · Rooted in West Bengal, India
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight mb-4 leading-tight">
            <span className="font-headline-gold">Care,</span> <span className="font-headline-silver italic font-light">with Context.</span>
          </h1>
          <div className="gold-hairline my-6 max-w-xs mx-auto" />
          <p className="font-sub-silver text-xs sm:text-sm tracking-[0.16em] uppercase mb-4 text-[#fce096]/90">
            Analytical discipline · Pure botanicals · Clinical verification
          </p>
          <p className="text-base md:text-lg text-[#cbd5e1] max-w-2xl mx-auto leading-relaxed">
            We founded Bhumivera to replace exaggerated cosmetic promises with exact botanical concentrations, skin-identical pH calibration, and verifiable quality records.
          </p>
        </div>
      </section>

      {/* 2. THE GENESIS */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl two-tone-card border border-[#d4af37]/30 p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="overflow-hidden rounded-2xl border border-[#d4af37]/30 shadow-lg bg-[#070a0e]">
            <img
              src={ABOUT_PAGE_DATA.genesisImage}
              alt="Botanical extraction and laboratory calibration"
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
              Every Bhumivera cleanser and elixir is formulated without harsh sulfates (SLS/SLES) or synthetic fillers, and paired with measured clinical co-actives like Niacinamide (1%) and Hyaluronic Acid (0.5%).
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
                <img src={m.image} alt={m.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
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
              className="aspect-square w-full rounded-2xl object-cover border border-[#d4af37]/25"
            />
            <img
              src={ABOUT_PAGE_DATA.cleanroomImage}
              alt="GMP cleanroom bottle filling line"
              className="aspect-square w-full rounded-2xl object-cover border border-[#d4af37]/25"
            />
          </div>
          <div className="space-y-4">
            <span className="font-sub-gold text-[10px] tracking-[0.24em] block">
              Our Written Pledge
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white">
              <span className="font-headline-gold">Verify</span> <span className="font-headline-silver">Everything We Do.</span>
            </h2>
            <div className="gold-hairline my-4 max-w-xs" />
            <p className="text-xs sm:text-sm leading-6 text-[#cbd5e1]">
              Whether you are checking a bottle’s serial number on E-Warranty, comparing INCI concentrations on the Somatic Label Registry, or reviewing our public environmental impact ledger, every Bhumivera claim is backed by a primary record.
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

      {/* 5. ARCHITECTURAL CRAFTSMANSHIP & ENGINEERING SEAL */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="rounded-3xl two-tone-card border border-[#d4af37]/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#070a0e] border border-[#d4af37]/50 text-[#d4af37] shrink-0 shadow-sm">
              <Sparkles size={24} />
            </div>
            <div>
              <p className="font-sub-gold text-[10px] tracking-[0.25em]">
                Digital Maison Architecture &amp; Systems Engineering
              </p>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                Developed By Akash Prasad
              </h3>
              <p className="text-xs text-[#cbd5e1] mt-1 max-w-xl">
                Engineered with clinical precision, zero-latency micro-chunk streaming, high-fidelity security shields, and bespoke luxury botanical aesthetics.
              </p>
            </div>
          </div>
          <Link
            to="/shop"
            className="btn-gold-luxury inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(212,175,55,0.4)] shrink-0"
          >
            Explore Maison Rituals <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
