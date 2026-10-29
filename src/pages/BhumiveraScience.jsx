import React, { useEffect } from 'react';
import { ArrowRight, Microscope, ExternalLink, Award, ThermometerSnowflake } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SEO, { GLOBAL_CORPORATE_FAQS } from '../components/SEO';
import { SCIENCE_PAGE_DATA } from '../data/bhumiveraUniqueData';

export default function BhumiveraScience() {
  const location = useLocation();

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
        title="Bhumivera Science & Milligram Transparency | The Transparent Maison (Est. 2016)"
        description="Discover Bhumivera (bhumivera.com). Founded on a decade of family manufacturing heritage with MPG E-Business (Est. 2016), delivering 100% active, milligram-disclosed cold-pressed botanical skincare."
        keywords="Bhumivera, bhumivera.com, Bhumivera Transparency Standard, cold-pressed under 28C, 100% active percentage skincare, milligram ingredient disclosure, MPG E-Business Private Limited"
        route="/science"
        faqs={GLOBAL_CORPORATE_FAQS}
        breadcrumbs={[
          { name: 'Bhumivera', url: 'https://bhumivera.com/' },
          { name: 'Botanical Science & Milligram Disclosure', url: 'https://bhumivera.com/science' },
        ]}
      />

      {/* 1. HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-[#070a0e] text-white py-20 px-6 sm:py-28">
        <div className="absolute inset-0 -z-20 opacity-25">
          <img
            src={SCIENCE_PAGE_DATA.heroImage}
            alt="Bhumivera cosmetic formulation laboratory in Asansol West Bengal"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070a0e]/95 via-[#070a0e]/85 to-[#070a0e]/60" />
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <article>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#0d1520] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fce096]">
              <Microscope size={14} className="text-[#d4af37]" /> The Bhumivera Transparency Standard (Est. 2016 Lineage)
            </p>
            <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl text-white">
              <span className="font-headline-gold">Cold-Pressed Under 28°C.</span>{' '}
              <span className="font-headline-silver">100% Active &amp; Milligram Disclosed.</span>
            </h1>
            <div className="gold-hairline my-5 max-w-xs" />
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#cbd5e1] sm:text-base">
              Built on the 10-year herbal formulation legacy of <strong>MPG E-Business Private Limited</strong> (Est. <time dateTime="2016-09-22">September 22, 2016</time> · CIN: U74999WB2016PTC217735 · Founder: Dilip Prasad Nonia) and modernized by <strong>Akash Prasad</strong> at <strong>bhumivera.com</strong> under <strong>Bhumivera Organics India Private Limited</strong> (Inc. <time dateTime="2026-08-04">August 4, 2026</time> · Director: Payal Prasad), every Bhumivera formulation is engineered around three measurable pillars: <strong className="text-[#fce096]">sub-28°C cold-pressed botanical extraction</strong>, <strong className="text-[#fce096]">100% active percentages</strong>, and <strong className="text-[#fce096]">precise milligram-weight disclosure</strong> printed directly on the packaging.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#ingredients"
                className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl"
              >
                Inspect 8 Active Specimens <ArrowRight size={14} />
              </a>
              <Link
                to="/about"
                className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#cbd5e1]"
              >
                Explore 2016–2026 Lineage
              </Link>
            </div>
          </article>
          <div className="overflow-hidden rounded-2xl border border-[#d4af37]/30 bg-[#070a0e] shadow-2xl">
            <img
              src={SCIENCE_PAGE_DATA.labBenchImage}
              alt="Quality control scientist inspecting amber serum bottle"
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="p-4 text-xs text-[#cbd5e1] border-t border-[#d4af37]/20 bg-[#0d1520]">
              <strong className="text-[#fce096]">Cleanroom QC Protocol (Asansol, WB):</strong> Sub-28°C thermal extraction check, digital pH 5.0–5.5 electrode verification, and gravimetric milligram assay on every batch.
            </div>
          </div>
        </div>
      </section>

      {/* 2. 8 CORNERSTONE BOTANICAL & CLINICAL SPECIMENS */}
      <section id="ingredients" className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#d4af37]/20 pb-6 md:flex-row md:items-end">
          <div>
            <p className="font-sub-gold text-[10px] tracking-[0.22em] block">
              8 Documented Specimens · Formulated under the Bhumivera Transparency Standard (Est. 2016 lineage)
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-5xl text-white">
              <span className="font-headline-gold">Botanical &amp; Clinical</span>{' '}
              <span className="font-headline-silver">Active Monograph</span>
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

      {/* 3. 24-HOUR SKIN COMPATIBILITY PATCH TEST & 60-SECOND LAYERING RULE */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl two-tone-card border border-[#d4af37]/25 shadow-2xl">
            <img
              src={SCIENCE_PAGE_DATA.patchTestImage}
              alt="24-hour inner forearm skin compatibility patch test"
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
              alt="Applying Bhumivera face wash and skincare products"
              className="aspect-[16/9] w-full object-cover"
            />
            <div className="p-6 sm:p-8">
              <h3 className="mt-2 font-serif text-2xl sm:text-3xl text-white">
                The 60-Second Post-Wash Layering Rule
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-6 text-[#cbd5e1]">
                Apply your next skincare step while skin is still slightly damp after cleansing. Layer a lightweight hydrating product first, then finish with a moisturizer or facial oil suited to your routine.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
