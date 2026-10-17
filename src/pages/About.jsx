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
    <main className="bg-[#faf8f5] text-[#1c2922] font-sans pb-20">
      <SEO
        title="Our Story & Botanical Craft | Bhumivera"
        description="Discover how Bhumivera pairs traditional Indian botanicals with pH-calibrated dermatological actives, cleanroom filling, and full label honesty."
        route="/about"
      />
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#0a1410] text-white py-24 px-6">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={ABOUT_PAGE_DATA.heroImage}
            alt="Bhumivera botanical workshop and formulation heritage"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1410] via-[#0a1410]/60 to-[#0a1410]/80" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 mb-6">
            <Sparkles size={14} className="text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-300">
              Our Story · Rooted in West Bengal, India
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-6">
            Care, <span className="italic font-light text-[#dce7c5]">with context.</span>
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            We founded Bhumivera to replace exaggerated cosmetic promises with exact botanical concentrations, skin-identical pH calibration, and verifiable quality records.
          </p>
        </div>
      </section>

      {/* 2. THE GENESIS */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="overflow-hidden rounded-3xl border border-[#1c2922]/15 shadow-lg">
            <img
              src={ABOUT_PAGE_DATA.genesisImage}
              alt="Botanical extraction and laboratory calibration"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="space-y-5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b4226]">
              01 · Why Bhumivera Exists
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#1c2922] leading-tight">
              Traditional Indian flora meets analytical formulation discipline.
            </h2>
            <p className="text-sm sm:text-base leading-7 text-stone-600">
              Indian botanicals—such as Ladakh Sea Buckthorn, Pampore Kashmiri Saffron, Assam Bamboo Charcoal, Neem, Tulsi, Amla, and Bhringraj—carry extraordinary phytochemical complexity. Yet their benefits depend entirely on how gently they are extracted and the pH of the base they are suspended in.
            </p>
            <p className="text-sm sm:text-base leading-7 text-stone-600">
              Every Bhumivera cleanser and elixir is formulated without harsh sulfates (SLS/SLES) or synthetic fillers, and paired with measured clinical co-actives like Niacinamide (1%) and Hyaluronic Acid (0.5%).
            </p>
            <div className="pt-3 flex flex-wrap gap-4">
              <Link
                to="/science"
                className="inline-flex items-center gap-2 rounded-xl bg-[#1c2922] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white"
              >
                Explore Product Science <ArrowRight size={14} />
              </Link>
              <Link
                to="/provenance-engine"
                className="inline-flex items-center gap-2 rounded-xl border border-[#1c2922]/25 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#1c2922]"
              >
                View Harvest Corridors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 4 REAL-LIFE PILLARS WITH UNIQUE PHOTOGRAPHS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-10">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-800">
            02 · Four Operational Pillars
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
            How Every Bottle Is Made, Tested &amp; Dispatched
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {ABOUT_PAGE_DATA.milestones.map((m) => (
            <article key={m.title} className="overflow-hidden rounded-2xl border border-[#1c2922]/15 bg-white shadow-sm">
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#101d16]">
                <img src={m.image} alt={m.title} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-6 sm:p-8">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#6b4226]">
                  {m.year}
                </span>
                <h3 className="mt-2 font-serif text-2xl font-bold text-[#1c2922]">{m.title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-6 text-stone-600">{m.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. CLEANROOM & MANIFESTO BANNER */}
      <section className="max-w-7xl mx-auto px-6 pt-4">
        <div className="grid lg:grid-cols-2 gap-8 rounded-3xl bg-[#101d16] p-8 sm:p-12 text-white items-center">
          <div className="grid grid-cols-2 gap-4">
            <img
              src={ABOUT_PAGE_DATA.manifestoImage}
              alt="Botanical ingredients on stone"
              className="aspect-square w-full rounded-2xl object-cover"
            />
            <img
              src={ABOUT_PAGE_DATA.cleanroomImage}
              alt="GMP cleanroom bottle filling line"
              className="aspect-square w-full rounded-2xl object-cover"
            />
          </div>
          <div className="space-y-4">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
              Our Written Pledge
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl">
              Verify Everything We Do.
            </h2>
            <p className="text-xs sm:text-sm leading-6 text-white/75">
              Whether you are checking a bottle’s serial number on E-Warranty, comparing INCI concentrations on the Somatic Label Registry, or reviewing our public environmental impact ledger, every Bhumivera claim is backed by a primary record.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/shop" className="rounded-xl bg-[#d4af37] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#101d16]">
                Browse the Collection
              </Link>
              <Link to="/impact" className="rounded-xl border border-white/25 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10">
                Inspect Impact Ledger
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ARCHITECTURAL CRAFTSMANSHIP & ENGINEERING SEAL */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="rounded-3xl border border-[#d4af37]/35 bg-gradient-to-r from-[#0c1712] via-[#09130e] to-[#070f0b] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d4af37]">
                Digital Maison Architecture &amp; Systems Engineering
              </p>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                Developed By Akash Prasad
              </h3>
              <p className="text-xs text-white/70 mt-1 max-w-xl">
                Engineered with clinical precision, zero-latency micro-chunk streaming, high-fidelity security shields, and bespoke luxury botanical aesthetics.
              </p>
            </div>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#0c1712] transition hover:bg-[#e5c247] shadow-[0_0_15px_rgba(212,175,55,0.3)] shrink-0"
          >
            Explore Maison Rituals <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
