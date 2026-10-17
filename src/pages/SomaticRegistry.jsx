import React, { useState } from 'react';
import { ArrowRight, Check, CircleHelp, Leaf, ShieldCheck, FlaskConical, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { SOMATIC_REGISTRY_PRODUCTS } from '../data/bhumiveraUniqueData';

const safetyChoices = [
  { id: 'none', label: 'No known ingredient sensitivities (Standard 24h patch test)' },
  { id: 'fragrance', label: 'I prefer 100% essential-oil / synthetic fragrance-free formulas' },
  { id: 'sensitivity', label: 'I have reactive skin and want to inspect every listed active first' },
];

export default function SomaticRegistry() {
  const [selectedKey, setSelectedKey] = useState('charcoal_face');
  const [selectedPref, setSelectedPref] = useState('all');
  const [safety, setSafety] = useState('none');

  const currentProduct = SOMATIC_REGISTRY_PRODUCTS[selectedKey];
  const productEntries = Object.values(SOMATIC_REGISTRY_PRODUCTS);

  return (
    <main className="min-h-screen bg-[#101713] pb-20 font-sans text-[#f4f2e9]">
      <SEO
        title="Somatic Label Registry & Transcribed INCI Decoder | Bhumivera"
        description="Inspect transcribed physical bottle labels, exact botanical percentages, pH values, and allergen disclosures across Bhumivera formulations."
        route="/somatic-registry"
      />
      <section className="border-b border-white/10 bg-[radial-gradient(ellipse_at_top,_rgba(92,117,77,0.22),_transparent_62%)] px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-36">
        <div className="mx-auto max-w-6xl">
          <p className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d6dfbd]">
            <Leaf size={14} aria-hidden="true" /> Transcribed Physical Label &amp; INCI Registry
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-tight tracking-tight sm:text-6xl">
            Somatic Label Registry
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
            Select any Bhumivera formulation below to inspect its verbatim transcribed packaging label, active percentages, fragrance disclosure, and real-life photographic specimen before you buy.
          </p>

          {/* Product Selector Cards */}
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {productEntries.map((prod) => {
              const isSelected = prod.id === selectedKey;
              return (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => {
                    setSelectedKey(prod.id);
                    setSelectedPref('all');
                  }}
                  className={`group overflow-hidden rounded-2xl border text-left transition ${
                    isSelected
                      ? 'border-[#d4af37] bg-[#18261e] shadow-xl'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/30'
                  }`}
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-black">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
                      SKU: {prod.sku} · pH {prod.phValue}
                    </span>
                    <h2 className="mt-1 font-serif text-xl text-white">{prod.name}</h2>
                    <p className="mt-2 text-xs leading-5 text-white/65 line-clamp-2">{prod.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Label Inspection Table + Real-Life Specimen Image */}
      <section className="mx-auto max-w-6xl px-5 pt-12 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-white/15 bg-[#15201a] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#d6dfbd]">
                  Verbatim Label Transcription
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl text-white">{currentProduct.name}</h2>
              </div>
              <span className="rounded-full bg-[#d6dfbd]/15 px-3 py-1 font-mono text-xs text-[#d6dfbd]">
                Fragrance: {currentProduct.fragrance}
              </span>
            </div>

            {/* Filter Chips */}
            <div className="mt-5 flex flex-wrap gap-2">
              {currentProduct.preferences.map((pref) => (
                <button
                  key={pref.id}
                  type="button"
                  onClick={() => setSelectedPref(pref.id)}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                    selectedPref === pref.id
                      ? 'border-[#d6dfbd] bg-[#d6dfbd] text-[#101713]'
                      : 'border-white/15 bg-white/5 text-white/75 hover:bg-white/10'
                  }`}
                >
                  {pref.label}
                </button>
              ))}
            </div>

            {/* Safety Compatibility Filter */}
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {safetyChoices.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setSafety(sc.id)}
                  className={`rounded-xl border p-3 text-left text-xs transition ${
                    safety === sc.id
                      ? 'border-emerald-400/60 bg-emerald-500/10 text-white'
                      : 'border-white/10 bg-white/[0.02] text-white/60'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>

            {safety !== 'none' && (
              <div className="mt-5 rounded-xl border border-amber-400/40 bg-amber-500/10 p-4 text-xs leading-6 text-amber-200">
                <strong>Patch-Test Advisory:</strong> Because this formula lists {currentProduct.fragrance}, perform a 24-to-48-hour inner-forearm patch test before facial use and check the physical bottle in hand.
              </div>
            )}

            {/* Ingredient Breakdown Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/15 text-[10px] font-bold uppercase tracking-wider text-[#d6dfbd]">
                    <th className="py-3 pr-4">Listed Ingredient</th>
                    <th className="py-3 px-4">Label %</th>
                    <th className="py-3 pl-4">Functional Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {currentProduct.ingredients.map(([ingName, pct, role]) => (
                    <tr key={ingName} className="hover:bg-white/[0.03]">
                      <td className="py-3.5 pr-4 font-semibold text-white">{ingName}</td>
                      <td className="py-3.5 px-4 font-mono text-[#d4af37]">{pct}</td>
                      <td className="py-3.5 pl-4 text-white/70">{role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Real-Life Specimen Photo & Actions */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#15201a]">
              <img
                src={currentProduct.labelSpecImage}
                alt={`${currentProduct.name} laboratory specimen`}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#d4af37]">
                  Real-Life Formulation &amp; Label Audit
                </span>
                <h3 className="mt-2 font-serif text-2xl text-white">Verify Against Your Bottle in Hand</h3>
                <p className="mt-2 text-xs leading-6 text-white/70">
                  Always cross-check the printed INCI list, batch number, and expiry date on your physical Bhumivera bottle. Need to compare all formulations side-by-side?
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to={`/shop?q=${encodeURIComponent(currentProduct.search)}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#d6dfbd] px-4 py-2.5 text-xs font-bold text-[#101713]"
                  >
                    View in Shop <ArrowRight size={14} />
                  </Link>
                  <Link
                    to="/compare"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10"
                  >
                    Compare Formulations
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
