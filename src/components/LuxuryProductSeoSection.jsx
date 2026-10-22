import React from 'react';

/**
 * Drop-in React Luxury Botanical Specification, Conscious Buyer Highlights & FAQ Component
 * for Product Detail Pages. Renders the exact label concentration matrix, Wikipedia-backed
 * botanical mechanisms, and 100% compliant cosmetic disclosures.
 */
export default function LuxuryProductSeoSection({ product }) {
  if (!product) return null;

  const rawComposition = typeof product.composition_json === 'string'
    ? (() => { try { return JSON.parse(product.composition_json); } catch { return []; } })()
    : (product.composition_table || product.exactCompositionTable || []);

  const composition = rawComposition.map((row) => ({
    ingredient: row.ingredient || row.active || '',
    concentration: row.concentration || row.potency || '',
    botanical: row.botanical || row.classification || '',
    role: row.role || row.mechanism || '',
  }));

  const faqs = typeof product.faqs_json === 'string'
    ? (() => { try { return JSON.parse(product.faqs_json); } catch { return []; } })()
    : (product.faqs || product.directAnswerFaqs || []);

  const wikipediaEntities = product.wikipedia_entities || [];
  const highlights = product.conscious_buyer_highlights || [
    '100% Label-Disclosed Active Concentrations printed openly on every bottle and bar.',
    'Formulated without SLS/SLES sulfates, parabens, mineral oil, or harsh synthetic detergents.',
    'Balanced to respect your skin moisture barrier and scalp comfort.',
    'Botanical & Ayurvedic-inspired personal care; 24-hour inner-forearm patch test recommended before first use.',
  ];

  return (
    <section className="max-w-7xl mx-auto my-12 px-4 sm:px-6 text-[#FAF7F2]">
      {/* 4-Pillar Luxury & Compliance Badge Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 p-5 bg-[#102219] border border-[#D4AF37]/40 rounded-2xl text-center shadow-xl">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-mono font-bold">Net Volume / Weight</p>
          <p className="text-lg font-serif font-bold text-white mt-1">{product.net_volume || product.volume || '100 ML'}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-mono font-bold">Formulation Standard</p>
          <p className="text-xs sm:text-sm font-bold text-[#FCE096] mt-1">{product.ph_level || product.phLevel || 'pH 5.4 – 5.5 Balanced'}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-mono font-bold">Label Transparency</p>
          <p className="text-xs sm:text-sm font-bold text-white mt-1">100% Label-Disclosed Actives</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-mono font-bold">Clean Formulation</p>
          <p className="text-xs sm:text-sm font-bold text-white mt-1">Zero SLS, Parabens or Harsh Detergents</p>
        </div>
      </div>

      {/* Conscious Skincare Buyer Highlights */}
      <div className="mb-10 rounded-3xl bg-[#102219]/90 border border-[#D4AF37]/30 p-6 sm:p-8 shadow-xl">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#D4AF37] block mb-2">
          Crafted for Conscious, Skin-Caring Buyers
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4">
          Why Label-Conscious Buyers Choose {product.luxuryName || product.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {highlights.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#070a0e]/70 border border-[#D4AF37]/25 text-xs sm:text-sm text-[#DFD7C4] leading-relaxed">
              <span className="text-[#D4AF37] font-bold mr-2">✦</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Editorial Story */}
      {product.full_description && (
        <div
          className="prose prose-invert max-w-none mb-12 p-6 sm:p-8 rounded-3xl bg-[#102219]/80 border border-[#D4AF37]/30 leading-relaxed text-[#DFD7C4]"
          dangerouslySetInnerHTML={{ __html: product.full_description }}
        />
      )}

      {/* Exact Label Composition Matrix */}
      {composition.length > 0 && (
        <div className="mb-12 rounded-3xl bg-[#102219]/90 border border-[#D4AF37]/35 p-6 sm:p-8 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
            Verified Label Composition &amp; Botanical Action Matrix
          </h2>
          <p className="text-xs font-mono uppercase tracking-wider text-[#FCE096] mb-6">
            100% Label-Disclosed Active Concentrations · {product.net_volume || 'Standard Unit'}
          </p>
          <div className="overflow-x-auto border border-[#D4AF37]/30 rounded-2xl shadow-sm bg-[#070a0e]/85">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#14291F] text-[#FCE096] text-xs font-mono uppercase tracking-wider border-b border-[#D4AF37]/30">
                  <th className="p-4">Active Ingredient</th>
                  <th className="p-4">Label Potency</th>
                  <th className="p-4">Botanical / Active Source</th>
                  <th className="p-4">Skincare / Wellness Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                {composition.map((row, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="p-4 font-bold text-white">{row.ingredient}</td>
                    <td className="p-4 font-mono font-semibold text-[#FCE096]">{row.concentration}</td>
                    <td className="p-4 italic text-[#9BB0A5]">{row.botanical}</td>
                    <td className="p-4 text-[#DFD7C4] leading-relaxed">{row.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Wikipedia Knowledge Graph Botanical Monograph Links */}
      {wikipediaEntities.length > 0 && (
        <div className="mb-12 rounded-2xl bg-[#102219]/80 border border-[#D4AF37]/25 p-5 sm:p-6">
          <p className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] mb-3">
            Encyclopedic Botanical &amp; Active References (Knowledge Graph Entities)
          </p>
          <div className="flex flex-wrap gap-2.5">
            {wikipediaEntities.map((ent, idx) => (
              <a
                key={idx}
                href={ent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#070a0e] border border-[#D4AF37]/35 text-xs text-[#FCE096] hover:border-[#D4AF37] transition"
              >
                <span>{ent.name}</span>
                <span aria-hidden="true" className="text-[#D4AF37]">↗</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Direct-Answer AI FAQ Accordion */}
      {faqs.length > 0 && (
        <div className="mb-10 rounded-3xl bg-[#102219]/90 border border-[#D4AF37]/35 p-6 sm:p-8 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <div key={idx} className="p-5 bg-[#070a0e]/85 border border-[#D4AF37]/25 rounded-2xl shadow-sm">
                <h3 className="text-base font-serif font-bold text-[#FCE096] mb-2">{item.q}</h3>
                <p className="text-xs sm:text-sm text-[#DFD7C4] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 100% Regulatory Compliance & Transparency Notice */}
      <div className="rounded-2xl bg-[#070a0e]/80 border border-[#D4AF37]/20 p-4 sm:p-5 text-[11px] text-[#9BB0A5] leading-relaxed">
        <strong className="text-[#FCE096]">Formulation &amp; Regulatory Transparency:</strong> Bhumivera Organics is the registered brand of Bhumivera Organics India Private Limited (Est. 2016 heritage under MPG E Business Private Limited). All products are cosmetic and Ayurvedic-inspired botanical formulations crafted with plant-derived extracts and cosmetic-grade actives at the exact label concentrations shown above. Every active concentration is disclosed openly on the product label for complete consumer transparency. These products are not intended to diagnose, treat, cure, or prevent any medical skin disease. Perform a 24-hour patch test on the inner forearm before first use.
      </div>
    </section>
  );
}