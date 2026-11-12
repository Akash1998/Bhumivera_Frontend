import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Drop-in React Luxury Botanical Specification, Milligram-Weight Disclosure & FAQ Component
 * for Product Detail Pages. Highlights "Formulated under the Bhumivera Transparency Standard (Est. 2016 lineage)".
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
    inci: row.inci || '',
    molecular_markers: row.molecular_markers || '',
    extraction_method: row.extraction_method || '<28°C Cold-Processed',
    harvest_corridor: row.harvest_corridor || 'Indian Botanical Corridor',
    corridor_url: row.corridor_url || '/provenance-engine',
    ph_window: row.ph_window || product.ph_level || 'pH 5.4–5.5',
    role: row.role || row.mechanism || '',
    synergy_partners: row.synergy_partners || '',
    reference_url: row.reference_url || '',
  }));

  const faqs = typeof product.faqs_json === 'string'
    ? (() => { try { return JSON.parse(product.faqs_json); } catch { return []; } })()
    : (product.faqs || product.directAnswerFaqs || []);

  const rawSpecs = typeof product.specifications === 'string'
    ? (() => { try { return JSON.parse(product.specifications); } catch { return {}; } })()
    : (product.specifications || {});
  const specEntries = rawSpecs && typeof rawSpecs === 'object' && !Array.isArray(rawSpecs)
    ? Object.entries(rawSpecs).filter(([, v]) => v !== null && v !== undefined && String(v).trim())
    : [];

  const wikipediaEntities = product.wikipedia_entities || [];
  const relatedProducts = product.related_products || [];
  const highlights = product.conscious_buyer_highlights || [
    'Formulated under the Bhumivera Transparency Standard (Est. 2016 lineage) with 100% active percentages and milligram-level disclosure.',
    'Cold-pressed Indian botanicals processed under 28°C to preserve delicate Omega-7 lipids, polyphenols, and vitamins.',
    'Formulated without SLS/SLES sulfates, parabens, mineral oil, or harsh synthetic detergents.',
    'Calibrated to skin- and scalp-identical pH 5.0–5.5; 24-hour inner-forearm patch test recommended before first use.',
  ];

  return (
    <section className="max-w-7xl mx-auto my-12 px-4 sm:px-6 text-[#FAF7F2]">
      {/* Milligram-Weight Disclosure & Lineage Banner */}
      <div className="mb-8 rounded-3xl border border-[#D4AF37]/50 bg-gradient-to-r from-[#102219]/90 via-[#14291F]/90 to-[#102219]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-4 mb-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#D4AF37] block">
              The Transparent Maison · Radical Milligram &amp; Active % Disclosure
            </span>
            <h2 className="mt-1 font-serif text-xl sm:text-3xl font-bold text-white">
              Formulated under the Bhumivera Transparency Standard (Est. 2016 lineage)
            </h2>
          </div>
          <span className="rounded-full border border-[#D4AF37]/50 bg-[#070a0e]/85 px-4 py-1.5 font-mono text-xs font-bold text-[#FCE096]">
            100% Active Percentage · &lt;28°C Cold-Pressed
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#DFD7C4] leading-relaxed">
          Breaking away from standard cosmetic labelling practices that hide behind opaque <span className="font-mono text-[#FCE096]">&ldquo;Base Q.S.&rdquo;</span> blends, <strong className="text-white">Bhumivera</strong> (<a href="https://www.bhumivera.com" className="text-[#FCE096] underline">bhumivera.com</a>) prints the precise milligram weight and active percentage of every functional botanical and barrier humectant directly on the packaging. Originating from the 10-year manufacturing and herbal supply-chain mastery of <strong className="text-white">MPG E-Business Private Limited</strong> (Est. September 22, 2016, Asansol · CIN: U74999WB2016PTC217735 · Founder: Dilip Prasad Nonia; <Link to="/mpge-business" className="text-[#FCE096] underline">Corporate Heritage</Link>) and modernized by <strong className="text-white">Akash Prasad</strong> under <strong className="text-white">Bhumivera Organics India Private Limited</strong> (Inc. August 4, 2026 · Directors: Akash Prasad, Payal Prasad &amp; Aman Prasad; <Link to="/about" className="text-[#FCE096] underline">About the Maison</Link>).
        </p>
      </div>

      {/* 4-Pillar Luxury & Compliance Badge Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 p-5 bg-[#102219]/85 border border-[#D4AF37]/40 rounded-2xl text-center shadow-xl backdrop-blur-lg">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-mono font-bold">Net Volume / Weight</p>
          <p className="text-lg font-serif font-bold text-white mt-1">{product.net_volume || product.volume || '100 ML'}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-mono font-bold">Formulation Standard</p>
          <p className="text-xs sm:text-sm font-bold text-[#FCE096] mt-1">{product.ph_level || product.phLevel || 'pH 5.4 – 5.5 Balanced'}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-mono font-bold">Milligram Disclosure</p>
          <p className="text-xs sm:text-sm font-bold text-white mt-1">100% Active % &amp; Milligram Printed</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-mono font-bold">Heritage Standard</p>
          <p className="text-xs sm:text-sm font-bold text-white mt-1">Est. 2016 Lineage · Sub-28°C</p>
        </div>
      </div>

      {/* Conscious Skincare Buyer Highlights */}
      <div className="mb-10 rounded-3xl bg-[#102219]/85 border border-[#D4AF37]/30 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#D4AF37] block mb-2">
          Formulated under the Bhumivera Transparency Standard (Est. 2016 lineage)
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

      {/* Complete 1,500+ Word Editorial & Technical Monograph */}
      {product.full_description && (
        <div className="mb-12 rounded-3xl bg-[#102219]/85 border border-[#D4AF37]/30 p-6 sm:p-10 shadow-xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D4AF37]/25 pb-4 mb-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#D4AF37] block">
                Complete Formulation Monograph &amp; Clinical Botanical Dossier
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                {product.luxuryName || product.name} — In-Depth Formulation &amp; Usage Guide
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <Link to="/science" className="px-3 py-1.5 rounded-full bg-[#070a0e] border border-[#D4AF37]/35 text-[#FCE096] hover:border-[#D4AF37]">
                Botanical Science ↗
              </Link>
              <Link to="/somatic-registry" className="px-3 py-1.5 rounded-full bg-[#070a0e] border border-[#D4AF37]/35 text-[#FCE096] hover:border-[#D4AF37]">
                Somatic Label Decoder ↗
              </Link>
              <Link to="/provenance-engine" className="px-3 py-1.5 rounded-full bg-[#070a0e] border border-[#D4AF37]/35 text-[#FCE096] hover:border-[#D4AF37]">
                Harvest Provenance ↗
              </Link>
            </div>
          </div>
          <div
            className="prose prose-invert max-w-none leading-relaxed text-[#DFD7C4] space-y-4 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:text-[#FCE096] [&_h3]:mt-8 [&_h3]:mb-3 [&_h4]:font-serif [&_h4]:text-lg [&_h4]:text-white [&_a]:text-[#FCE096] [&_a]:underline [&_table]:w-full [&_table]:border-collapse [&_th]:bg-[#14291F] [&_th]:p-3 [&_th]:text-left [&_th]:text-xs [&_th]:text-[#FCE096] [&_td]:p-3 [&_td]:border-t [&_td]:border-white/10 [&_td]:text-xs [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
            dangerouslySetInnerHTML={{ __html: product.full_description }}
          />
        </div>
      )}

      {/* 10x Enhanced Milligram-Weight & Active Percentage Disclosure Matrix */}
      {composition.length > 0 && (
        <div className="mb-12 rounded-3xl bg-[#102219]/90 border border-[#D4AF37]/35 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
            10x Enhanced Formulation &amp; Active Phytochemical Matrix
          </h2>
          <p className="text-xs font-mono uppercase tracking-wider text-[#FCE096] mb-6">
            Formulated under the Bhumivera Transparency Standard (Est. 2016 lineage) · {product.net_volume || 'Standard Unit'} · {product.ph_level || 'pH Calibrated'}
          </p>
          <div className="overflow-x-auto border border-[#D4AF37]/30 rounded-2xl shadow-sm bg-[#070a0e]/85">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#14291F] text-[#FCE096] text-[11px] font-mono uppercase tracking-wider border-b border-[#D4AF37]/30">
                  <th className="p-3.5">Active Ingredient &amp; INCI</th>
                  <th className="p-3.5">Label Potency</th>
                  <th className="p-3.5">Bioactive Markers &amp; Extraction</th>
                  <th className="p-3.5">Harvest Corridor &amp; pH Window</th>
                  <th className="p-3.5">Dermal / Follicular Mechanism &amp; Synergy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                {composition.map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 align-top">
                    <td className="p-3.5">
                      <p className="font-bold text-white">{row.ingredient}</p>
                      <p className="text-[11px] italic text-[#9BB0A5] mt-0.5">{row.botanical}</p>
                      {row.inci && <p className="text-[10px] font-mono text-[#D4AF37] mt-1">INCI: {row.inci}</p>}
                      {row.reference_url && (
                        <a
                          href={row.reference_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-1 text-[10px] font-mono text-[#FCE096] underline hover:text-white"
                        >
                          Monograph Reference ↗
                        </a>
                      )}
                    </td>
                    <td className="p-3.5 font-mono font-semibold text-[#FCE096] whitespace-nowrap">{row.concentration}</td>
                    <td className="p-3.5 text-xs text-[#DFD7C4]">
                      {row.molecular_markers && <p className="mb-1"><strong className="text-white">Markers:</strong> {row.molecular_markers}</p>}
                      {row.extraction_method && <p className="text-[11px] text-[#9BB0A5]"><strong className="text-[#FCE096]">Method:</strong> {row.extraction_method}</p>}
                    </td>
                    <td className="p-3.5 text-xs text-[#DFD7C4]">
                      <Link to={row.corridor_url || '/provenance-engine'} className="text-[#FCE096] underline hover:text-white block mb-1">
                        {row.harvest_corridor}
                      </Link>
                      <span className="inline-block px-2 py-0.5 rounded bg-[#14291F] border border-[#D4AF37]/30 font-mono text-[10px] text-[#FCE096]">
                        {row.ph_window}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#DFD7C4] leading-relaxed">
                      <p>{row.role}</p>
                      {row.synergy_partners && (
                        <p className="mt-1.5 text-[11px] text-[#9BB0A5]">
                          <strong className="text-[#FCE096]">Synergy Partners:</strong> {row.synergy_partners}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 20x Enhanced Technical, Regulatory & Analytical Specification Ledger */}
      {specEntries.length > 0 && (
        <div className="mb-12 rounded-3xl bg-[#102219]/90 border border-[#D4AF37]/35 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#D4AF37] block">
                Complete 30-Point Analytical, Physical, Packaging &amp; Regulatory Ledger
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Technical Specifications &amp; Batch Quality Parameters ({specEntries.length} Attributes)
              </h2>
            </div>
            <Link
              to={`/verify?serial=${encodeURIComponent(product.batch_no || product.sku || 'BHMV-2610-SB083')}`}
              className="btn-gold-luxury px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white"
            >
              Verify Batch COA on /verify
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {specEntries.map(([label, value]) => (
              <div key={label} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-3.5 rounded-2xl bg-[#070a0e]/80 border border-[#D4AF37]/25">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37] font-bold">{label}</span>
                <span className="text-xs sm:text-sm text-[#FAF7F2] sm:text-right font-medium">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Internal Cross-Links to Complementary Formulations & Botanical Silos */}
      {relatedProducts.length > 0 && (
        <div className="mb-12 rounded-3xl bg-[#102219]/85 border border-[#D4AF37]/30 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#D4AF37] block mb-1">
            Complete Your Inside-Out Botanical Regimen
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-4">
            Complementary Bhumivera Formulations &amp; Regimen Pairings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedProducts.map((rel, idx) => (
              <Link
                key={idx}
                to={`/product/${rel.slug}`}
                className="group p-4 rounded-2xl bg-[#070a0e]/80 border border-[#D4AF37]/30 hover:border-[#D4AF37] transition flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#D4AF37] block mb-1">
                    {rel.relation || 'Companion Formulation'}
                  </span>
                  <h3 className="font-serif text-base font-bold text-white group-hover:text-[#FCE096] transition">
                    {rel.name}
                  </h3>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-[#FCE096]">
                  Explore Formulation Monograph →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Wikipedia Knowledge Graph Botanical Monograph Links */}
      {wikipediaEntities.length > 0 && (
        <div className="mb-12 rounded-2xl bg-[#102219]/80 border border-[#D4AF37]/25 p-5 sm:p-6 backdrop-blur-lg">
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
        <div className="mb-10 rounded-3xl bg-[#102219]/90 border border-[#D4AF37]/35 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-6">
            Comprehensive Frequently Asked Questions ({faqs.length} Direct-Answer Monographs)
          </h2>
          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <div key={idx} className="p-5 bg-[#070a0e]/85 border border-[#D4AF37]/25 rounded-2xl shadow-sm">
                <h3 className="text-base font-serif font-bold text-[#FCE096] mb-2">{idx + 1}. {item.q}</h3>
                <p className="text-xs sm:text-sm text-[#DFD7C4] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 100% Regulatory Compliance & Transparency Notice */}
      <div className="rounded-2xl bg-[#070a0e]/80 border border-[#D4AF37]/20 p-4 sm:p-5 text-[11px] text-[#9BB0A5] leading-relaxed backdrop-blur-md">
        <strong className="text-[#FCE096]">Formulation &amp; Regulatory Transparency:</strong> Bhumivera™ is the flagship clean-beauty brand of Bhumivera Organics India Private Limited (Incorporated August 4, 2026; Founder: Akash Prasad; Directors: Akash Prasad, Payal Prasad &amp; Aman Prasad; Brand HQ: G.T. Road, Gopalpur, Asansol, WB 713304), backed by the 10-year manufacturing and consumer trust legacy of MPG E-Business Private Limited (Incorporated September 22, 2016; CIN: U74999WB2016PTC217735; Founder: Dilip Prasad Nonia; Heritage Corporate Office: 608, BNR Sen Raleigh Road, Park Lane, Behind Spencer, Asansol, WB 713305). Formulated under the Bhumivera Transparency Standard (Est. 2016 lineage), every active percentage and milligram dosage is disclosed openly on the product label. Perform a 24-hour patch test on the inner forearm before first use.
      </div>
    </section>
  );
}