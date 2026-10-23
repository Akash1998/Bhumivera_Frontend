import React, { useEffect } from 'react';
import {
  ArrowRight,
  Microscope,
  ShieldCheck,
  ExternalLink,
  Activity,
  FlaskConical,
  Scale,
  CheckCircle2,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import {
  SCIENCE_PAGE_DATA,
  GUT_SKIN_AXIS_CASCADE_STAGES,
  SCALING_ROADMAP_PHASES,
} from '../data/bhumiveraUniqueData';

const PROTOCOL_ARCHITECTURE_TABLE = [
  {
    step: 'Step 1: Internal Pathway (Ingestible Nutricosmetic Elixir)',
    designation: 'Kalpvriksh Satva 7-Tulsi Cellular Reset Drops (30 ml)',
    profile:
      '9.0 ml active liquid extract per 10 ml (90% potency) formulated across 7 Sacred Tulsi chemotypes (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi). Standardized for Eugenol (≥42%), Rosmarinic Acid (≥18%), and Ursolic Acid (≥12%).',
    target:
      'Downregulates intestinal COX-1 (97%) and COX-2 pathways; seals gut mucosal tight junctions (ZO-1 & occludin) against LPS endotoxemia; suppresses circulating TNF-α, IL-6, and IL-17 cytokines.',
    ritual:
      '4 concentrated drops blended into 100 ml of lukewarm water consumed every morning on an empty stomach to neutralize gut-derived inflammatory triggers.',
    regulatory: 'FSSAI Ayush-Aahar / Nutraceutical Statutory Framework · Biophotonic UV Glass Dropper',
  },
  {
    step: 'Step 2: External Pathway (Postbiotic Topical Emulsion)',
    designation: 'Himalayan Sea Buckthorn Postbiotic Cellular Emulsion (100 ml)',
    profile:
      '4.0% wild Himalayan Sea Buckthorn extract (>11,000 ft Ladakh & Spiti, sub-28°C cold-extracted), 5.0% Botanical Glycerin, 1.5% Postbiotic Lactobacillus Ferments, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.1% HA & 0.1% Niacinamide.',
    target:
      'High natural density of Omega-7 palmitoleic acid (≥34%) and native bio-ferulic acid; non-stripping decyl/coco-glucoside cleansing calibrated strictly at pH 5.3–5.5 to protect the acid mantle and commensal skin microbiome.',
    ritual:
      '2 pumps gently massaged onto damp facial skin morning and night for 45 seconds, transforming into a golden micro-emulsion that rinses away dirt while leaving the barrier lipid matrix intact.',
    regulatory: 'AYUSH / Cosmetics Rules, 2020 (CDSCO) · Biophotonic UV Glass Pump',
  },
];

const ENHANCED_SPECIMENS = [
  {
    id: 'sea_buckthorn',
    name: 'Wild Himalayan Sea Buckthorn (4.0%)',
    botanicalName: 'Hippophae rhamnoides L. · Sub-28°C Cold-Extracted Berry & Seed Lipid',
    concentration: '4.0% (Emulsion) / 3.0% (Barrier Crème)',
    phWindow: 'pH 5.3 – 5.5',
    origin: 'Ladakh & Spiti High-Altitude Tribal Cooperatives (>11,000 ft)',
    note: 'Contains 32%–42% rare Omega-7 palmitoleic acid (16:1 n-7), native bio-ferulic acid, beta-carotene, and alpha-tocopherol. Accelerates keratinocyte re-epithelialization, inhibits NF-κB & STAT1 inflammation, and rebuilds intercellular lipid lamellae.',
    realLifeTest: 'Sub-28°C thermal extraction preserves 99.4% of bioactive Omega-7 while reducing industrial thermal energy consumption by 60%.',
    image: '/assets/images/seabuckthorn nature.webp',
    reference: 'https://www.mdpi.com/2079-9284/13/1/45',
    aiPrompt: 'Tell me about Sea Buckthorn Face Wash and its key ingredients',
  },
  {
    id: 'tulsi',
    name: '7-Cultivar Kalpvriksh Satva Tulsi (90%)',
    botanicalName: 'Ocimum tenuiflorum, gratissimum, basilicum, americanum, kilimandscharicum & × citriodorum',
    concentration: '9.0 ml per 10 ml (90% Active Liquid Phyto-Extract)',
    phWindow: 'Internal COX-2 & Tight-Junction Reset',
    origin: 'Vrindavan & Bundelkhand Organic Sanctuaries',
    note: 'Rich in standardized Eugenol (≥42%), Rosmarinic Acid (≥18%), and Ursolic Acid (≥12%). Seals intestinal ZO-1/occludin tight junctions against leaky-gut LPS endotoxemia and downregulates systemic TNF-α, IL-6, and IL-17 cytokines.',
    realLifeTest: 'Cold-hydro-distilled at 24.9°C; verified 0.000 ppm pesticide residue (GC-MS/MS) and Non-Detect heavy metals (ICP-MS).',
    image: '/assets/images/tulsi.webp',
    reference: 'https://www.researchgate.net/publication/12533260_Antioxidant_and_cyclooxygenase_inhibitory_phenolic_compounds_from_Ocimum_sanctum_Linn',
    aiPrompt: 'Tell me about Tulsi in Sea Buckthorn Face Wash',
  },
  {
    id: 'postbiotic_lactobacillus',
    name: 'Postbiotic Lactobacillus & Prebiotic GOS',
    botanicalName: 'Lactobacillus Ferment Lysate (1.5%) & Galactooligosaccharides (2.0%)',
    concentration: '1.5% Postbiotic Lysate + 2.0% Prebiotic GOS',
    phWindow: 'pH 5.30 – 5.45 (Microbiome Homeostasis)',
    origin: 'Controlled Cleanroom Bio-Fermentation',
    note: 'Delivers organic lactic acid and antimicrobial bacteriocins that maintain facial acidity at pH 5.3–5.5, selectively feeding commensal Staphylococcus epidermidis while inhibiting virulent Cutibacterium acnes phylotype IA1.',
    realLifeTest: 'Verified to buffer municipal hard-water alkalinity (pH 7.8–8.5) back to skin-identical pH 5.4 within 45 seconds.',
    image: '/assets/images/aloeverabeaker.webp',
    reference: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12505367/',
    aiPrompt: 'Is Sea Buckthorn Face Wash safe for sensitive or acne-prone skin, and how do I patch test?',
  },
  {
    id: 'niacinamide',
    name: 'Niacinamide (USP Vitamin B3)',
    botanicalName: 'Nicotinamide / Pyridine-3-Carboxamide (CAS 98-92-0)',
    concentration: '0.1% (Cleansing Emulsions) / 1.0% (Barrier Crème)',
    phWindow: 'pH 5.4 – 6.0 (Zero Nicotinic Acid Flush)',
    origin: 'USP Analytical Grade · Purity ≥99.5%',
    note: 'Upregulates serine palmitoyltransferase (SPT) to stimulate endogenous ceramide NP/EOS synthesis, inhibits melanosome transfer to fade post-acne hyperpigmentation (PIH), and brakes sebocyte lipogenesis.',
    realLifeTest: 'Calibrated at pH 5.42 to prevent hydrolysis into nicotinic acid, ensuring zero flushing on barrier-impaired skin.',
    image: '/assets/images/niacidamine.webp',
    reference: 'https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide',
    aiPrompt: 'Tell me about Niacinamide in Sea Buckthorn Face Wash',
  },
  {
    id: 'hyaluronic_acid',
    name: 'Multi-Molecular Hyaluronic Acid & 5% Glycerin',
    botanicalName: 'Sodium Hyaluronate (CAS 9067-32-7) & Plant Glycerol (CAS 56-81-5)',
    concentration: '0.1%–0.5% HA + 5.0% Botanical Glycerin',
    phWindow: 'pH 5.0 – 5.5',
    origin: 'Plant-Glucose Bio-Fermentation',
    note: 'Binds up to 1,000x its molecular weight in water while activating epidermal Aquaporin-3 (AQP3) channels, forming a breathable hydrophilic cushion that prevents post-wash transepidermal water loss (TEWL).',
    realLifeTest: 'Reduces surfactant monomer penetration into the stratum corneum during the 45-second cleansing massage.',
    image: '/assets/images/hyaluronic-acid-qc.webp',
    reference: 'https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate',
    aiPrompt: 'Tell me about Hyaluronic Acid in Sea Buckthorn Face Wash',
  },
  {
    id: 'manjistha_haridra',
    name: 'Manjistha (0.5%) & Haridra Curcuminoids (0.5%)',
    botanicalName: 'Rubia cordifolia (≥8% Rubiadin) & Curcuma longa (≥25% Curcuminoids)',
    concentration: '0.5% Manjistha + 0.5% Haridra + 0.5% Neem',
    phWindow: 'pH 5.3 – 5.5',
    origin: 'Eastern & Central Indian Biodiversity Corridors',
    note: 'Suppresses Toll-Like Receptor 2 (TLR-2) and NF-κB activation triggered by C. acnes lipopolysaccharides and propionic acid, rapidly calming perifollicular redness and post-blemish pigmentation.',
    realLifeTest: 'Sub-28°C cold extraction preserves heat-labile rubiadin anthraquinones and tetrahydrocurcuminoids.',
    image: '/assets/images/kashmiri-saffron.webp',
    reference: 'https://powo.science.kew.org/results?q=Rubia%20cordifolia',
    aiPrompt: 'How do Sea Buckthorn and Niacinamide work together in Sea Buckthorn Face Wash?',
  },
  {
    id: 'charcoal',
    name: 'Microporous Activated Bamboo Carbon (3.0%)',
    botanicalName: 'Bambusa tulda Steam-Activated Carbon (<15 Microns)',
    concentration: '3.0% Ultra-Fine Microporous Carbon (>900 m²/g)',
    phWindow: 'pH 5.45 – 5.50',
    origin: 'Sustainable Bamboo Groves, Assam',
    note: 'High-surface-area microporous carbon chelates PM2.5 polycyclic aromatic hydrocarbons (PAHs), heavy metals, and peroxidized squalene from congested pores via Van der Waals adsorption without mechanical abrasion.',
    realLifeTest: 'Jet-milled to <15 microns and suspended in 5.0% Botanical Glycerin + 1.0% Lactobacillus Postbiotic Ferment.',
    image: '/assets/images/charcoal.webp',
    reference: 'https://en.wikipedia.org/wiki/Activated_carbon',
    aiPrompt: 'Tell me about Charcoal Face Wash and its key ingredients',
  },
  {
    id: 'centella_panthenol',
    name: 'Centella Madecassoside (3.0%) & D-Panthenol (2.0%)',
    botanicalName: 'Centella asiatica Triterpenes & Pro-Vitamin B5 (CAS 81-13-0)',
    concentration: '3.0% Centella Extract + 2.0% D-Panthenol',
    phWindow: 'pH 5.40 (Lamellar Barrier Crème)',
    origin: 'Eastern Himalayan & Bengal Wetland Corridors',
    note: 'Inhibits matrix metalloproteinase-1 (MMP-1) collagen breakdown and converts to Coenzyme A in keratinocytes, accelerating barrier recovery in skin damaged by synthetic acid peels or retinoids.',
    realLifeTest: 'Formulated into our Phase 2 Restorative Barrier Crème alongside 3% Ladakh Sea Buckthorn and 2% Prebiotic GOS.',
    image: '/assets/images/aloeverascience.webp',
    reference: 'https://powo.science.kew.org/results?q=Centella%20asiatica',
    aiPrompt: 'What skincare products should I apply right after using Sea Buckthorn Face Wash?',
  },
];

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
        title="20X Gut-Skin Axis Biochemistry & Formulation Science | Bhumivera"
        description="Inspect Bhumivera's Synchronized Inside-Out Gut-Skin Biotic Protocol: 90% 7-Tulsi COX-2/cytokine modulation, 4% sub-28°C Ladakh Sea Buckthorn Omega-7, Postbiotic Lactobacillus ferments at pH 5.3–5.5, and Biophotonic UV glass preservation."
        route="/science"
      />

      {/* 1. HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-[#070a0e] text-white py-20 px-6 sm:py-28 border-b border-[#d4af37]/20">
        <div className="absolute inset-0 -z-20 opacity-25">
          <img
            src={SCIENCE_PAGE_DATA.heroImage}
            alt="Bhumivera gut-skin biotic formulation laboratory"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070a0e]/95 via-[#070a0e]/85 to-[#070a0e]/60" />
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#0d1520] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fce096]">
              <Microscope size={14} className="text-[#d4af37]" /> 20X Biochemical Dossier · Gut-Skin-Microbiome Axis
            </p>
            <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl text-white">
              <span className="font-headline-gold">The Synchronized</span>{' '}
              <span className="font-headline-silver">Inside-Out Biotic Protocol.</span>
            </h1>
            <div className="gold-hairline my-5 max-w-xs" />
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#cbd5e1] sm:text-base">
              Chronic cutaneous inflammation is a bidirectional cascade: intestinal tight-junction permeability (<span className="font-mono text-[#fce096]">LPS endotoxemia</span>) upregulates systemic <strong className="text-white">TNF-α, IL-6, and IL-17 cytokines</strong> internally, while alkaline detergents and synthetic acids strip the <strong className="text-[#fce096]">pH 5.3–5.5 acid mantle</strong> externally. Bhumivera engineers both pathways into a single synchronized protocol.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#protocol-architecture"
                className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl"
              >
                Inspect 2-Step Protocol Matrix <ArrowRight size={14} />
              </a>
              <Link
                to="/products/biotic-cellular-reset-30-day-gut-skin-protocol"
                className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#cbd5e1]"
              >
                Shop 30-Day Protocol (₹1,199)
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#d4af37]/30 bg-[#070a0e] shadow-2xl">
            <img
              src={SCIENCE_PAGE_DATA.labBenchImage}
              alt="Sub-28°C cold extraction and digital pH 5.42 electrode calibration"
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="p-4 text-xs text-[#cbd5e1] border-t border-[#d4af37]/20 bg-[#0d1520]">
              <strong className="text-[#fce096]">Sub-28°C &amp; Biophotonic Standard:</strong> Digital glass electrode pH 5.3–5.5 assay, GC-MS/MS 0.000 ppm pesticide verification, and Biophotonic UV glass filling.
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 2-STEP SYNCHRONIZED PROTOCOL ARCHITECTURE TABLE */}
      <section id="protocol-architecture" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8">
          <p className="font-sub-gold text-[10px] uppercase tracking-[0.24em]">
            Pharmacological &amp; Biochemical Convergence
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-5xl text-white">
            <span className="font-headline-gold">The Biotic Cellular Reset:</span>{' '}
            <span className="font-headline-silver">2-Step Physiological Matrix</span>
          </h2>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-[#d4af37]/40 bg-[#0d1520] shadow-2xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#d4af37]/30 bg-[#070a0e] font-mono text-[11px] uppercase tracking-wider text-[#fce096]">
                <th className="p-4 sm:p-5">Protocol Pathway</th>
                <th className="p-4 sm:p-5">Commercial Designation</th>
                <th className="p-4 sm:p-5">Pharmacological &amp; Active Profile</th>
                <th className="p-4 sm:p-5">Physiological Target &amp; Mechanism</th>
                <th className="p-4 sm:p-5">Daily Ritual &amp; Statutory License</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d4af37]/20">
              {PROTOCOL_ARCHITECTURE_TABLE.map((row) => (
                <tr key={row.step} className="hover:bg-white/5">
                  <td className="p-4 sm:p-5 font-mono font-bold text-[#fce096]">{row.step}</td>
                  <td className="p-4 sm:p-5 font-serif font-bold text-white text-base">{row.designation}</td>
                  <td className="p-4 sm:p-5 text-[#cbd5e1] leading-relaxed">{row.profile}</td>
                  <td className="p-4 sm:p-5 text-[#cbd5e1] leading-relaxed">{row.target}</td>
                  <td className="p-4 sm:p-5 text-xs text-emerald-300 leading-relaxed">
                    <p>{row.ritual}</p>
                    <p className="mt-2 font-mono text-[10px] text-[#fce096]">{row.regulatory}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. 8 CORNERSTONE BOTANICAL, POSTBIOTIC & CLINICAL SPECIMENS */}
      <section id="ingredients" className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#d4af37]/20 pb-6 md:flex-row md:items-end">
          <div>
            <p className="font-sub-gold text-[10px] tracking-[0.22em] block">
              8 Standardized Bio-Actives · 100% Label-Disclosed Stoichiometry
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-5xl text-white">
              <span className="font-headline-gold">Phytochemical &amp; Postbiotic</span>{' '}
              <span className="font-headline-silver">Active Monograph</span>
            </h2>
          </div>
          <p className="max-w-md text-xs leading-6 text-[#94a3b8]">
            Click any specimen to consult our AI Concierge or inspect its peer-reviewed scientific publication (MDPI, PubMed Central, ResearchGate, PubChem, Kew POWO).
          </p>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {ENHANCED_SPECIMENS.map((spec) => (
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
                    Peer-Reviewed Study <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. BIOPHOTONIC UV GLASS & STATUTORY COMPLIANCE ARCHITECTURE */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-[#d4af37]/40 bg-[#0d1520] p-6 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#fce096]">
            <Scale size={14} className="text-[#d4af37]" /> Indian Statutory &amp; Ecological Packaging Compliance
          </div>
          <h2 className="mt-2 font-serif text-2xl sm:text-4xl text-white">
            Biophotonic Ultraviolet Glass &amp; Dual-License Regulatory Architecture
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-[#d4af37]/25 bg-[#070a0e] p-5">
              <span className="font-mono text-[10px] font-bold uppercase text-emerald-400">
                1. FSSAI Ayush-Aahar / Nutraceutical Framework
              </span>
              <h3 className="mt-2 font-serif text-lg font-bold text-white">
                Step 1 Internal 7-Tulsi Elixir Compliance
              </h3>
              <p className="mt-2 text-xs text-[#cbd5e1] leading-relaxed">
                Manufactured, labeled, and distributed under valid Food Safety and Standards Authority of India (FSSAI) Ayush-Aahar / Nutraceutical standards with complete phytonutrient and batch disclosure.
              </p>
            </div>
            <div className="rounded-2xl border border-[#d4af37]/25 bg-[#070a0e] p-5">
              <span className="font-mono text-[10px] font-bold uppercase text-[#fce096]">
                2. Cosmetics Rules, 2020 &amp; Legal Metrology 2011
              </span>
              <h3 className="mt-2 font-serif text-lg font-bold text-white">
                Step 2 External Emulsion &amp; Dual-Panel Box
              </h3>
              <p className="mt-2 text-xs text-[#cbd5e1] leading-relaxed">
                Topical Sea Buckthorn and Charcoal Postbiotic Emulsions operate under State Licensing Authority AYUSH / Cosmetics Rules, 2020, enclosed in a Legal Metrology (Packaged Commodities) Rules, 2011 compliant secondary box.
              </p>
            </div>
            <div className="rounded-2xl border border-[#d4af37]/25 bg-[#070a0e] p-5">
              <span className="font-mono text-[10px] font-bold uppercase text-purple-300">
                3. Biophotonic Ultraviolet Glass Vessels
              </span>
              <h3 className="mt-2 font-serif text-lg font-bold text-white">
                Zero Virgin Plastic · Natural Spectral Preservation
              </h3>
              <p className="mt-2 text-xs text-[#cbd5e1] leading-relaxed">
                Eliminates virgin petroleum plastic; filters out degrading visible light (450–720 nm) while admitting beneficial UV-A/violet wavelengths to protect Omega-7 and 7-Tulsi polyphenols without synthetic chemical preservatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 4-PHASE ENTERPRISE SCALING & CLINICAL TRIAL ROADMAP */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-3xl border border-[#d4af37]/35 bg-[#0d1520] p-6 sm:p-10">
          <p className="font-sub-gold text-[10px] uppercase tracking-[0.24em]">
            Clinical &amp; Institutional Trajectory
          </p>
          <h2 className="mt-2 font-serif text-2xl sm:text-4xl text-white">
            4-Phase Clinical Validation &amp; Enterprise Scaling Roadmap
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {(SCALING_ROADMAP_PHASES || []).map((item) => (
              <div key={item.phase} className="rounded-2xl border border-[#d4af37]/25 bg-[#070a0e] p-5 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase text-[#fce096]">{item.timeline}</span>
                  <h3 className="mt-1 font-serif text-base font-bold text-white">{item.phase}</h3>
                  <p className="mt-1 font-mono text-xs text-emerald-400">{item.milestone}</p>
                  <p className="mt-3 text-xs text-[#cbd5e1] leading-relaxed">{item.architecture}</p>
                </div>
                <p className="mt-4 pt-3 border-t border-white/10 text-[11px] text-[#94a3b8]">
                  {item.strategy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
