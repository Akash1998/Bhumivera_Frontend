import React, { useState } from 'react';
import { ArrowRight, Leaf, ShieldCheck, FlaskConical, Eye } from 'lucide-react';
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
    <main className="min-h-screen bg-[#070a0e] pb-24 font-sans text-[#e2e8f0] selection:bg-[#d4af37]/30 selection:text-white">
      <SEO
        title="Somatic Label Registry & Transcribed INCI Decoder | Bhumivera"
        description="Inspect transcribed physical bottle labels, exact botanical percentages, pH values, and allergen disclosures across Bhumivera formulations."
        route="/somatic-registry"
      />
      
      {/* Hero Section */}
      <section className="border-b border-[#d4af37]/20 bg-[#070a0e] px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-36">
        <div className="mx-auto max-w-6xl">
          <p className="font-sub-gold inline-flex items-center gap-2 border border-[#d4af37]/40 bg-[#0d1520] px-3.5 py-1.5 text-[10px] tracking-[0.2em]">
            <Leaf size={14} className="text-[#d4af37]" aria-hidden="true" /> Transcribed Physical Label &amp; INCI Registry
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-3xl sm:text-5xl lg:text-6xl uppercase tracking-wider font-normal leading-tight">
            <span className="font-headline-gold">Somatic Label</span>{' '}
            <span className="font-headline-silver">INCI Registry</span>
          </h1>
          <div className="gold-hairline my-5 max-w-xs" />
          <p className="mt-4 max-w-2xl text-xs sm:text-sm leading-7 text-[#cbd5e1] sm:text-base">
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
                  className={`group overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                    isSelected
                      ? 'border-[#d4af37] bg-[#0d1520] shadow-xl shadow-[#d4af37]/10 ring-1 ring-[#d4af37]/50'
                      : 'border-white/10 bg-[#0d1520]/60 hover:border-[#d4af37]/40'
                  }`}
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-[#070a0e]">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#fce096]">
                      SKU: {prod.sku} · pH {prod.phValue}
                    </span>
                    <h2 className="mt-1 font-serif text-xl text-white font-bold">{prod.name}</h2>
                    <p className="mt-2 text-xs leading-5 text-[#94a3b8] line-clamp-2">{prod.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Label Inspection Table + Real-Life Specimen Image */}
      <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="two-tone-panel-gold rounded-2xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
              <div>
                <span className="font-sub-gold text-[10px] tracking-widest block">
                  Verbatim Label Transcription
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl text-white font-bold">{currentProduct.name}</h2>
              </div>
              <span className="rounded-full border border-[#d4af37]/35 bg-[#070a0e] px-3.5 py-1 font-mono text-xs text-[#fce096]">
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
                      ? 'border-[#d4af37] bg-gradient-to-r from-[#d4af37] to-[#fce096] text-black font-bold shadow-md'
                      : 'border-white/15 bg-white/5 text-[#cbd5e1] hover:border-[#d4af37]/40 hover:text-white'
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
                      ? 'border-[#d4af37] bg-[#070a0e] text-[#fce096] font-semibold'
                      : 'border-white/10 bg-[#070a0e]/40 text-[#94a3b8] hover:border-white/20'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>

            {safety !== 'none' && (
              <div className="mt-5 rounded-xl border border-[#d4af37]/40 bg-[#070a0e] p-4 text-xs leading-6 text-[#fce096]">
                <strong>Patch-Test Advisory:</strong> Because this formula lists {currentProduct.fragrance}, perform a 24-to-48-hour inner-forearm patch test before facial use and check the physical bottle in hand.
              </div>
            )}

            {/* Ingredient Breakdown Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#d4af37]/30 text-[10px] font-bold uppercase tracking-wider text-[#fce096]">
                    <th className="py-3 pr-4">Listed Ingredient</th>
                    <th className="py-3 px-4">Label %</th>
                    <th className="py-3 pl-4">Functional Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {currentProduct.ingredients.map(([ingName, pct, role]) => (
                    <tr key={ingName} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 pr-4 font-semibold text-white">{ingName}</td>
                      <td className="py-3.5 px-4 font-mono text-[#fce096]">{pct}</td>
                      <td className="py-3.5 pl-4 text-[#cbd5e1]">{role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Real-Life Specimen Photo & Actions */}
          <div className="space-y-6">
            <div className="two-tone-card overflow-hidden rounded-2xl border border-[#d4af37]/25 bg-[#0d1520] shadow-lg">
              <img
                src={currentProduct.labelSpecImage}
                alt={`${currentProduct.name} laboratory specimen`}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-6">
                <span className="font-sub-gold text-[10px] tracking-widest block">
                  Real-Life Formulation &amp; Label Audit
                </span>
                <h3 className="mt-2 font-serif text-2xl text-white font-bold">Verify Against Your Bottle</h3>
                <p className="mt-2 text-xs leading-6 text-[#94a3b8]">
                  Always cross-check the printed INCI list, batch number, and expiry date on your physical Bhumivera bottle. Need to compare all formulations side-by-side?
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to={`/shop?q=${encodeURIComponent(currentProduct.search)}`}
                    className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
                  >
                    View in Shop <ArrowRight size={14} />
                  </Link>
                  <Link
                    to="/compare"
                    className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#cbd5e1]"
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
