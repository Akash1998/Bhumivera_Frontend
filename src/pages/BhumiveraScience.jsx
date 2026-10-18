import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Clock, Droplets, Leaf, Microscope, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import { SCIENCE_PAGE_DATA, FALLBACK_CATALOG_PRODUCTS } from '../data/bhumiveraUniqueData';

export default function BhumiveraScience() {
  const location = useLocation();
  const [selectedSpecimen, setSelectedSpecimen] = useState(SCIENCE_PAGE_DATA.ingredientSpecimens[0]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 200);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <main className="min-h-screen bg-[#070a0e] text-[#e2e8f0] pb-24 font-sans selection:bg-[#d4af37]/30 selection:text-white">
      <SEO
        title="Product & Formulation Science | Bhumivera"
        description="Inspect Bhumivera's 8 cornerstone botanical and dermatological actives, pH 5.5 calibration, cold-pressed extraction, and 60-second layering science."
        route="/science"
      />

      {/* 1. HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-[#070a0e] text-white py-20 px-6 sm:py-28">
        <div className="absolute inset-0 -z-20 opacity-25">
          <img
            src={SCIENCE_PAGE_DATA.heroImage}
            alt="Bhumivera cosmetic formulation laboratory"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070a0e]/95 via-[#070a0e]/85 to-[#070a0e]/60" />
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#0d1520] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fce096]">
              <Microscope size={14} className="text-[#d4af37]" /> Analytical Cosmetic Chemistry &amp; Phytoscience
            </p>
            <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl text-white">
              <span className="font-headline-gold">Where Cold-Pressed Flora</span> <span className="font-headline-silver">Meets Clinical Actives.</span>
            </h1>
            <div className="gold-hairline my-5 max-w-xs" />
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#cbd5e1] sm:text-base">
              Every Bhumivera formulation is engineered around three measurable parameters: skin-identical pH (5.3–5.6), cold-processed botanical phytonutrients, and biomimetic barrier humectants.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#ingredients"
                className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl"
              >
                Inspect 8 Active Specimens <ArrowRight size={14} />
              </a>
              <Link
                to="/compare"
                className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#cbd5e1]"
              >
                Compare Formulations Matrix
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#d4af37]/30 bg-[#070a0e] shadow-2xl">
            <img
              src={SCIENCE_PAGE_DATA.labBenchImage}
              alt="Quality control scientist inspecting amber serum bottle"
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="p-4 text-xs text-[#cbd5e1] border-t border-[#d4af37]/20 bg-[#0d1520]">
              <strong className="text-[#fce096]">Cleanroom QC Protocol:</strong> Digital pH electrode verification, refractive index check, and 24-hour stability audit on every batch.
            </div>
          </div>
        </div>
      </section>

      {/* 2. 8 CORNERSTONE BOTANICAL & CLINICAL SPECIMENS (UNIQUE REAL-LIFE PHOTOGRAPHS) */}
      <section id="ingredients" className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#d4af37]/20 pb-6 md:flex-row md:items-end">
          <div>
            <p className="font-sub-gold text-[10px] tracking-[0.22em] block">
              8 Documented Specimens
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-5xl text-white">
              <span className="font-headline-gold">Botanical &amp; Clinical</span> <span className="font-headline-silver">Active Monograph</span>
            </h2>
          </div>
          <p className="max-w-md text-xs leading-6 text-[#94a3b8]">
            Click any active specimen card to ask our AI Concierge or inspect its international botanical/chemical registry reference.
          </p>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {SCIENCE_PAGE_DATA.ingredientSpecimens.map((spec) => (
            <article
              key={spec.id}
              className="flex flex-col overflow-hidden rounded-2xl two-tone-card border border-[#d4af37]/25 shadow-lg transition hover:border-[#d4af37]/60 hover:shadow-2xl"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#070a0e]">
                <img
                  src={spec.image}
                  alt={spec.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <span className="rounded-md bg-[#070a0e] border border-[#d4af37]/30 px-2.5 py-1 font-mono text-[10px] font-bold text-[#fce096] inline-block">
                    {spec.concentration}
                  </span>
                  <h3 className="mt-3 font-serif text-xl font-bold text-white">{spec.name}</h3>
                  <p className="mt-0.5 text-[11px] italic text-[#fce096]">{spec.botanicalName}</p>
                  <p className="mt-2.5 text-xs leading-6 text-[#cbd5e1]">{spec.note}</p>
                  <div className="mt-3 rounded-xl bg-[#070a0e]/90 border border-[#d4af37]/20 p-3 text-[11px] text-[#cbd5e1]">
                    <strong className="text-[#fce096]">Lab Standard ({spec.phWindow}):</strong> {spec.realLifeTest}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#d4af37]/15 pt-3 text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent('bhumivera:open-support-chat', {
                          detail: { prompt: spec.aiPrompt },
                        })
                      )
                    }
                    className="font-bold text-[#fce096] hover:text-white transition-colors"
                  >
                    Ask Concierge ↗
                  </button>
                  <a
                    href={spec.reference}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#94a3b8] hover:text-[#fce096] transition-colors"
                  >
                     Monograph <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. DERMATOLOGICAL PATCH TEST & 60-SECOND LAYERING RULE */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl two-tone-card border border-[#d4af37]/25 shadow-2xl">
            <img
              src={SCIENCE_PAGE_DATA.patchTestImage}
              alt="24-hour inner forearm dermatological patch test"
              className="aspect-[16/9] w-full object-cover"
            />
            <div className="p-6 sm:p-8">
              <span className="font-sub-gold text-[10px] tracking-widest block">
                Mandatory Safety Protocol
              </span>
              <h3 className="mt-2 font-serif text-2xl sm:text-3xl text-white">
                The 24-Hour Inner-Forearm Patch Test
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-6 text-[#cbd5e1]">
                Natural botanical extracts and essential oils are biologically active. Before applying any new cleanser, hydrosol, or night elixir to your face, apply a small drop to your clean inner forearm and wait 24 hours to confirm zero sensitivity.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl two-tone-card border border-[#d4af37]/25 shadow-2xl">
            <img
              src={SCIENCE_PAGE_DATA.textureMatrixImage}
              alt="Bhumivera formulation texture matrix"
              className="aspect-[16/9] w-full object-cover"
            />
            <div className="p-6 sm:p-8">
              <span className="font-sub-gold text-[10px] tracking-widest block">
                Epidermal Permeability Window
              </span>
              <h3 className="mt-2 font-serif text-2xl sm:text-3xl text-white">
                The 60-Second Post-Wash Layering Rule
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-6 text-[#cbd5e1]">
                Within 60 seconds of rinsing your cleanser and blotting with a soft muslin towel, mist damp skin with Copper-Distilled Tulsi-Rose Hydrosol and seal with Gotu Kola Barrier Gel (AM) or 2–3 warmed drops of Kumkumadi Night Elixir (PM).
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
