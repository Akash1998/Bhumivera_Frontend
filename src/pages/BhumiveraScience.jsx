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
    <main className="min-h-screen bg-[#f4f1e9] text-[#17251c] pb-20 font-sans">
      <SEO
        title="Product & Formulation Science | Bhumivera"
        description="Inspect Bhumivera's 8 cornerstone botanical and dermatological actives, pH 5.5 calibration, cold-pressed extraction, and 60-second layering science."
        route="/science"
      />

      {/* 1. HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-[#0e1914] text-white py-20 px-6 sm:py-28">
        <div className="absolute inset-0 -z-20 opacity-35">
          <img
            src={SCIENCE_PAGE_DATA.heroImage}
            alt="Bhumivera cosmetic formulation laboratory"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#09120e]/95 via-[#09120e]/80 to-[#09120e]/45" />
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]">
              <Microscope size={14} /> Analytical Cosmetic Chemistry &amp; Phytoscience
            </p>
            <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">
              Where Cold-Pressed Flora Meets Clinical Actives.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Every Bhumivera formulation is engineered around three measurable parameters: skin-identical pH (5.3–5.6), cold-processed botanical phytonutrients, and biomimetic barrier humectants.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#ingredients"
                className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-[#09120e]"
              >
                Inspect 8 Active Specimens <ArrowRight size={14} />
              </a>
              <Link
                to="/compare"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10"
              >
                Compare Formulations Matrix
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/40">
            <img
              src={SCIENCE_PAGE_DATA.labBenchImage}
              alt="Quality control scientist inspecting amber serum bottle"
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="p-4 text-xs text-[#dce7c5]">
              <strong>Cleanroom QC Protocol:</strong> Digital pH electrode verification, refractive index check, and 24-hour stability audit on every batch.
            </div>
          </div>
        </div>
      </section>

      {/* 2. 8 CORNERSTONE BOTANICAL & CLINICAL SPECIMENS (UNIQUE REAL-LIFE PHOTOGRAPHS) */}
      <section id="ingredients" className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#17251c]/15 pb-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b4226]">
              8 Documented Specimens
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-5xl">
              Botanical &amp; Clinical Active Monograph
            </h2>
          </div>
          <p className="max-w-md text-xs leading-6 text-stone-600">
            Click any active specimen card to ask our AI Concierge or inspect its international botanical/chemical registry reference.
          </p>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {SCIENCE_PAGE_DATA.ingredientSpecimens.map((spec) => (
            <article
              key={spec.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#17251c]/15 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#101d16]">
                <img
                  src={spec.image}
                  alt={spec.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <span className="rounded bg-[#eef0e6] px-2.5 py-1 font-mono text-[10px] font-bold text-[#26392c]">
                    {spec.concentration}
                  </span>
                  <h3 className="mt-3 font-serif text-xl font-bold text-[#17251c]">{spec.name}</h3>
                  <p className="mt-0.5 text-[11px] italic text-[#6b4226]">{spec.botanicalName}</p>
                  <p className="mt-2.5 text-xs leading-6 text-stone-600">{spec.note}</p>
                  <div className="mt-3 rounded-xl bg-[#f4f6ef] p-3 text-[11px] text-[#17251c]">
                    <strong>Lab Standard ({spec.phWindow}):</strong> {spec.realLifeTest}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent('bhumivera:open-support-chat', {
                          detail: { prompt: spec.aiPrompt },
                        })
                      )
                    }
                    className="font-bold text-[#17251c] hover:text-[#6b4226]"
                  >
                    Ask Concierge ↗
                  </button>
                  <a
                    href={spec.reference}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-stone-500 hover:text-[#17251c]"
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
          <div className="overflow-hidden rounded-3xl border border-[#17251c]/15 bg-white shadow-sm">
            <img
              src={SCIENCE_PAGE_DATA.patchTestImage}
              alt="24-hour inner forearm dermatological patch test"
              className="aspect-[16/9] w-full object-cover"
            />
            <div className="p-6 sm:p-8">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                Mandatory Safety Protocol
              </span>
              <h3 className="mt-2 font-serif text-2xl sm:text-3xl">
                The 24-Hour Inner-Forearm Patch Test
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-6 text-stone-600">
                Natural botanical extracts and essential oils are biologically active. Before applying any new cleanser, hydrosol, or night elixir to your face, apply a small drop to your clean inner forearm and wait 24 hours to confirm zero sensitivity.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[#17251c]/15 bg-white shadow-sm">
            <img
              src={SCIENCE_PAGE_DATA.textureMatrixImage}
              alt="Bhumivera formulation texture matrix"
              className="aspect-[16/9] w-full object-cover"
            />
            <div className="p-6 sm:p-8">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#6b4226]">
                Epidermal Permeability Window
              </span>
              <h3 className="mt-2 font-serif text-2xl sm:text-3xl">
                The 60-Second Post-Wash Layering Rule
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-6 text-stone-600">
                Within 60 seconds of rinsing your cleanser and blotting with a soft muslin towel, mist damp skin with Copper-Distilled Tulsi-Rose Hydrosol and seal with Gotu Kola Barrier Gel (AM) or 2–3 warmed drops of Kumkumadi Night Elixir (PM).
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
