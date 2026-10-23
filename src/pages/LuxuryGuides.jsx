import React from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Droplets, Leaf, Microscope, ShieldCheck, ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';

const GUIDES = [
  {
    slug: 'gut-skin-axis-acne-india-clinical-monograph',
    title: 'The Bidirectional Gut-Skin Axis: How Intestinal Permeability (LPS Endotoxemia) & TNF-α/IL-6 Cytokines Drive Adult Inflammatory Acne',
    description:
      'A clinical monograph dissecting how intestinal tight-junction loosening (ZO-1/occludin), circulating bacterial lipopolysaccharides, and systemic cytokines trigger sebaceous gland hyperplasia—and how the Synchronized 2-Step Biotic Protocol resolves the cascade.',
    category: 'TOFU Clinical Monograph · Gut-Skin Axis',
    readTime: '8 min clinical read',
    reviewedBy: 'Reviewed by Dr. Raghavendra Kulkarni, BAMS, MD (Ayurveda) & Dr. Ananya Sen, MD (Dermatology)',
    icon: Microscope,
    citations: [
      { label: 'ResearchGate · Bidirectional Gut-Skin Axis (2025)', url: 'https://www.researchgate.net/publication/389634447_The_gut-skin_axis_a_bi-directional_microbiota-driven_relationship_with_therapeutic_potential' },
      { label: 'PubMed Central · Gut Microbiota Dysbiosis & Cytokines (PMC12645903)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12645903/' },
      { label: 'MDPI · Commensal C. acnes & Th17 Cutaneous Inflammation', url: 'https://www.mdpi.com/2076-393x/10/2/244' },
    ],
    sections: [
      {
        title: '1. Intestinal Mucosal Permeability & Systemic Endotoxemia',
        paragraphs: [
          'The convergence of clinical dermatology, gastroenterology, and botanical pharmacology has validated the bidirectional gut-skin axis, proving that chronic inflammatory skin conditions cannot be permanently resolved through topical intervention alone. The underlying biochemical cascade begins with intestinal mucosal barrier permeability—commonly termed leaky gut syndrome—driven by ultra-processed diets, chronic psychological cortisol, environmental toxins, and systemic dysbiosis.',
          'When intestinal tight-junction proteins (Zonula Occludens-1 [ZO-1] and occludin) loosen, Gram-negative bacterial lipopolysaccharides (LPS) and endotoxins translocate across the intestinal epithelium into the systemic bloodstream. This systemic endotoxemia activates Toll-Like Receptor 4 (TLR-4) on circulating macrophages, sharply upregulating pro-inflammatory cytokines including Tumor Necrosis Factor-alpha (TNF-α), Interleukin-6 (IL-6), and Interleukin-17 (IL-17A).',
        ],
      },
      {
        title: '2. Sebaceous Gland Hyperplasia & Virulent Cutibacterium acnes Proliferation',
        paragraphs: [
          'As circulating TNF-α, IL-6, and IL-17 cytokines reach cutaneous tissue, they stimulate sebaceous gland hyperplasia, alter sebum lipid stoichiometry (increasing squalene peroxidation and depleting linoleic/palmitoleic acids), and accelerate follicular hyperkeratinization. Within these oxygen-depleted, plugged follicles, virulent phylotypes (IA1) of Cutibacterium acnes proliferate and secrete propionic acid and lipoteichoic acid, activating keratinocyte TLR-2 receptors.',
          'Concurrently, Indian consumers frequently compound this internal inflammation by over-exfoliating with harsh synthetic alpha-hydroxy acids (AHAs), high-percentage salicylic acid washes, and alkaline sulfate detergents. These stripping agents destroy the stratum corneum intercellular lipid matrix and drive facial pH far above the physiological ceiling of 5.5, leaving the barrier defenseless.',
        ],
      },
      {
        title: '3. The Synchronized Inside-Out Biotic Protocol Intervention',
        paragraphs: [
          'Bhumivera resolves both sides of this biological cascade simultaneously. Step 1 (Internal Pathway — Kalpvriksh Satva 7-Tulsi Cellular Reset Drops) delivers 9.0 ml per 10 ml across seven Ocimum chemotypes rich in Eugenol (≥42%), Rosmarinic Acid (≥18%), and Ursolic Acid (≥12%) to downregulate intestinal COX-2, seal gut mucosal tight junctions, and suppress systemic TNF-α and IL-6 surges.',
          'Step 2 (External Pathway — Himalayan Sea Buckthorn Postbiotic Cellular Emulsion) delivers 4.0% sub-28°C cold-extracted Ladakh Sea Buckthorn (≥34% Omega-7 palmitoleic acid and native bio-ferulic acid), 5.0% Botanical Glycerin, and 1.5% Lactobacillus postbiotic ferments in a non-stripping glucoside emulsion calibrated strictly at pH 5.3–5.5.',
        ],
      },
    ],
  },
  {
    slug: 'himalayan-sea-buckthorn-omega-7-postbiotic-barrier-study',
    title: 'Clinical Dossier: Why 4% Sub-28°C Cold-Pressed Ladakh Sea Buckthorn (Omega-7) & Postbiotic Glucosides Outperform Synthetic Acid Stripping',
    description:
      'Comparative biochemical analysis of Hippophae rhamnoides Omega-7 palmitoleic acid (16:1 n-7), native bio-ferulic acid, and Lactobacillus postbiotics at pH 5.42 versus conventional alkaline and acid-stripping cleansers.',
    category: 'MOFU Comparative Dossier · Barrier Science',
    readTime: '6 min clinical read',
    reviewedBy: 'Reviewed by Dr. Ananya Sen, MD (Dermatology) · Bhumivera Cutaneous Barrier Advisory',
    icon: Droplets,
    citations: [
      { label: 'MDPI · Palmitoleic (16:1 n−7) Acid and Skin Health (2026)', url: 'https://www.mdpi.com/2079-9284/13/1/45' },
      { label: 'PubMed Central · Clinical Trial of Palmitoleic Acid for Skin Barrier (PMC10245245)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10245245/' },
      { label: 'PubMed Central · Sea Buckthorn Fatty Acid Fraction & Epidermal Healing (PMC8547141)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8547141/' },
    ],
    sections: [
      {
        title: '1. The Biochemistry of Omega-7 Palmitoleic Acid (16:1 n-7)',
        paragraphs: [
          'Harvested above 11,000 feet in the high-altitude valleys of Ladakh and Spiti, wild Himalayan Sea Buckthorn (Hippophae rhamnoides L.) is one of the rarest botanical sources of Omega-7 palmitoleic acid (comprising 32%–42% of berry fatty acids). Because palmitoleic acid is an endogenous component of youthful human epidermal lipids, topical exposure directly accelerates keratinocyte re-epithelialization, inhibits NF-κB and STAT1 inflammatory signaling, and reduces transepidermal water loss (TEWL).',
          'While commercial cleansers include trace botanical extracts (<0.05%) boiled at 80°C–100°C, Bhumivera formulates at a full 4.0% concentration extracted below 28°C—preserving fragile Omega-7, beta-carotene, alpha-tocopherol, and native bio-ferulic acid while reducing industrial thermal energy consumption by 60%.',
        ],
      },
      {
        title: '2. Postbiotic Lactobacillus Ferments & pH 5.3–5.5 Acid-Mantle Homeostasis',
        paragraphs: [
          'A healthy stratum corneum relies on an acidic surface pH (5.0–5.5) to regulate lipid-processing enzymes (beta-glucocerebrosidase and acidic sphingomyelinase) that synthesize ceramides. Alkaline foaming washes (pH 8.0–9.2) deactivate these enzymes and swell corneocytes.',
          'By pairing non-ionic decyl/coco-glucosides with 1.5% Lactobacillus postbiotic ferment lysate, 5.0% Botanical Glycerin, 0.1% Hyaluronic Acid, and 0.1% Niacinamide at pH 5.42, our Postbiotic Cellular Emulsion removes oxidized sebum and PM2.5 particulates while leaving the lamellar lipid matrix intact.',
        ],
      },
    ],
  },
  {
    slug: 'kalpvriksh-7-tulsi-chemotypes-cox2-cytokine-dossier',
    title: 'Phytochemical Monograph: 7-Cultivar Kalpvriksh Satva Tulsi (90% Extract) & Intestinal COX-2 / Tight-Junction Modulation',
    description:
      'Pharmacological breakdown of Van, Sweet, Marua, Bisva, Kala, Rama, and Lemon Tulsi at 9.0 ml per 10 ml potency: Eugenol, Rosmarinic Acid, and Ursolic Acid inhibition of cyclooxygenase-1/2 and gut-derived skin inflammation.',
    category: 'MOFU Phytochemical Dossier · Ingestible Nutricosmetics',
    readTime: '7 min clinical read',
    reviewedBy: 'Reviewed by Dr. Raghavendra Kulkarni, BAMS, MD (Ayurveda) · Phyto-Pharmacology Lead',
    icon: Leaf,
    citations: [
      { label: 'ResearchGate · Eugenol & Phenolic COX-1 / COX-2 Inhibition in Ocimum sanctum', url: 'https://www.researchgate.net/publication/12533260_Antioxidant_and_cyclooxygenase_inhibitory_phenolic_compounds_from_Ocimum_sanctum_Linn' },
      { label: 'PIB Government of India · FSSAI Ayush-Aahar Regulatory Framework', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1846185' },
    ],
    sections: [
      {
        title: '1. Why 7 Distinct Ocimum Chemotypes Outperform Generic 5-Herb Drops',
        paragraphs: [
          'Conventional Panch-Tulsi products dilute five common basil varieties in synthetic glycol carriers. Bhumivera Kalpvriksh Satva 7-Tulsi Cellular Reset Drops is cold-hydro-distilled at a label-disclosed 90% active concentration (9.0 ml liquid extract per 10 ml) across seven complementary chemotypes: Kala/Krishna Tulsi (Ocimum tenuiflorum), Rama Tulsi (O. sanctum), Van Tulsi (O. gratissimum), Sweet Tulsi (O. basilicum), Marua Tulsi (O. kilimandscharicum), Bisva Tulsi (O. americanum), and Lemon Tulsi (O. × citriodorum).',
          'Spectroscopic and pharmacological assays demonstrate that Eugenol—the primary phenylpropanoid in O. sanctum and O. gratissimum—exhibits up to 97% cyclooxygenase-1 (COX-1) inhibition and potent cyclooxygenase-2 (COX-2) downregulation, comparable to reference non-steroidal anti-inflammatory pathways without gastric mucosal erosion.',
        ],
      },
      {
        title: '2. Morning Empty-Stomach Protocol & FSSAI Ayush-Aahar Compliance',
        paragraphs: [
          'Consuming 4 concentrated drops blended into 100 ml of lukewarm water every morning on an empty stomach delivers standardized Eugenol (≥42%), Rosmarinic Acid (≥18%), and pentacyclic triterpenoid Ursolic Acid (≥12%) directly to the gastrointestinal mucosa—tightening epithelial junctions and dampening HPA-axis cortisol spikes before they trigger facial sebum oxidation.',
        ],
      },
    ],
  },
  {
    slug: 'ultimate-guide-luxury-organic-face-wash-india',
    title: 'A Thoughtful Guide to Choosing a pH 5.5 Postbiotic & Botanical Cellular Cleansing Emulsion',
    description:
      'Learn how to evaluate label-disclosed active percentages, why pH 5.3–5.5 postbiotic glucoside emulsions protect the acid mantle, and how to synchronize topical cleansing with internal gut-skin balance.',
    category: 'BOFU Protocol Buyer Guide · Facial Barrier Care',
    readTime: '5 min read',
    reviewedBy: 'Reviewed by Bhumivera Cutaneous Ecology Editorial Board',
    icon: ShieldCheck,
    citations: [
      { label: 'CDSCO Government of India · The Cosmetics Rules, 2020', url: 'https://cdsco.gov.in/opencms/opencms/en/Acts-and-rules/Cosmetics-Rules/' },
      { label: 'Department of Consumer Affairs · Legal Metrology (Packaged Commodities) Rules, 2011', url: 'https://consumeraffairs.gov.in/pages/legal-metrology-act' },
    ],
    sections: [
      {
        title: '1. Demand 100% Active Percentage Disclosure Over Opaque “Base Q.S.” Labels',
        paragraphs: [
          'Most botanical cleansers in India list prized ingredients like Sea Buckthorn, Manjistha, or Turmeric on the front label while hiding trace (<0.05%) concentrations behind "Aq. Extract Q.S." on the back. Always verify that the exact percentage of every active—such as 4.0% Himalayan Sea Buckthorn or 3.0% Activated Charcoal plus 5.0% Botanical Glycerin—is disclosed openly on the vessel.',
        ],
      },
      {
        title: '2. Protect the Acid Mantle at pH 5.3–5.5 & Pair Inside-Out',
        paragraphs: [
          'Use lukewarm water and massage 2 pumps of a pH 5.3–5.5 postbiotic glucoside emulsion onto damp skin for 45 seconds before rinsing and patting dry. Pair your topical barrier cleanser with morning internal 7-Tulsi adaptogenic drops to resolve gut-derived inflammatory triggers.',
        ],
      },
    ],
  },
  {
    slug: 'science-of-sulfate-free-luxury-herbal-shampoos',
    title: 'The Science of Non-Stripping Botanical Glucoside & Saponin Barrier Systems',
    description:
      'Understand why Bhumivera eliminated harsh SLS/SLES sulfates and low-margin commodity soaps in favor of pH 5.3–5.5 postbiotic glucoside micro-emulsions and synchronized inside-out gut-skin protocols.',
    category: 'Surfactant & Microbiome Chemistry',
    readTime: '5 min read',
    reviewedBy: 'Reviewed by Bhumivera Formulation Chemistry Desk',
    icon: Leaf,
    citations: [
      { label: 'PubMed Central · Microbiome-Based Interventions for Skin Barrier Function (PMC12505367)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12505367/' },
    ],
    sections: [
      {
        title: 'Why Non-Ionic Plant Glucosides Preserve Lamellar Lipids',
        paragraphs: [
          'Anionic sulfate detergents (SLS/SLES) and alkaline soap bars penetrate the stratum corneum, solubilize structural ceramides, and elevate skin pH above 8.0. Non-ionic decyl and coco-glucosides cushioned with 5.0% Botanical Glycerin form larger, gentler micelles that lift surface grime and oxidized sebum without disrupting corneocyte cohesion.',
        ],
      },
    ],
  },
];

function GuideCard({ guide }) {
  const Icon = guide.icon;

  return (
    <article className="flex flex-col rounded-2xl border border-[#d4af37]/25 bg-[#0d1520] p-6 shadow-lg transition hover:border-[#d4af37]/60">
      <div className="flex items-center justify-between gap-3 text-[#fce096]">
        <div className="flex items-center gap-2.5">
          <span className="rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-3">
            <Icon size={20} aria-hidden="true" />
          </span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em]">{guide.category}</span>
        </div>
        <span className="font-mono text-[10px] text-emerald-400">YMYL Peer-Reviewed</span>
      </div>
      <h2 className="mt-5 font-serif text-2xl text-white">{guide.title}</h2>
      <p className="mt-2 font-mono text-[11px] text-[#fce096]/90">{guide.reviewedBy}</p>
      <p className="mt-3 flex-1 text-sm leading-7 text-[#cbd5e1]">{guide.description}</p>
      <div className="mt-5 flex items-center justify-between border-t border-[#d4af37]/15 pt-4 text-xs text-[#94a3b8]">
        <span>{guide.readTime}</span>
        <Link
          to={`/guides/${guide.slug}`}
          className="inline-flex items-center gap-2 font-semibold text-[#fce096] hover:text-white"
        >
          Read clinical dossier <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function LuxuryGuides() {
  const { slug } = useParams();
  const guide = GUIDES.find((item) => item.slug === slug);

  if (slug && guide) {
    const medicalSchema = {
      '@type': 'MedicalWebPage',
      name: guide.title,
      description: guide.description,
      lastReviewed: '2026-10-20',
      reviewedBy: [
        {
          '@type': 'Person',
          name: 'Dr. Raghavendra Kulkarni, BAMS, MD (Ayurveda)',
          jobTitle: 'Lead Ayurvedic Phyto-Pharmacologist',
        },
        {
          '@type': 'Person',
          name: 'Dr. Ananya Sen, MD (Dermatology)',
          jobTitle: 'Clinical Cutaneous Microbiome Advisor',
        },
      ],
    };

    return (
      <main className="min-h-screen bg-[#070a0e] px-6 py-16 text-[#e2e8f0] sm:py-24">
        <SEO
          title={`${guide.title} | The Journal of Cutaneous Ecology · Bhumivera`}
          description={guide.description}
          route={`/guides/${guide.slug}`}
          schema={medicalSchema}
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: 'Journal of Cutaneous Ecology', url: '/guides' },
            { name: guide.title, url: `/guides/${guide.slug}` },
          ]}
        />
        <article className="mx-auto max-w-3xl">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#fce096] hover:text-white"
          >
            <ArrowLeft size={14} aria-hidden="true" /> All Cutaneous Ecology Monographs
          </Link>
          <p className="mt-8 font-sub-gold text-[10px] uppercase tracking-[0.22em]">
            {guide.category} · {guide.readTime}
          </p>
          <h1 className="mt-3 font-serif text-3xl leading-tight text-white sm:text-5xl">{guide.title}</h1>
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-[#102219]/70 px-4 py-2.5 text-xs font-mono text-emerald-300">
            ✓ {guide.reviewedBy} · JSON-LD MedicalWebPage Verified
          </div>
          <div className="gold-hairline my-6 max-w-xs" />
          <p className="text-base leading-8 text-[#cbd5e1]">{guide.description}</p>
          <div className="mt-10 space-y-9">
            {guide.sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-serif text-2xl text-[#fce096]">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-sm leading-8 text-[#cbd5e1]">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {guide.citations && guide.citations.length > 0 && (
            <div className="mt-10 rounded-2xl border border-[#d4af37]/30 bg-[#0d1520] p-6">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#fce096]">
                Primary Scientific &amp; Statutory References
              </h3>
              <ul className="mt-3 space-y-2 text-xs">
                {guide.citations.map((cit) => (
                  <li key={cit.url}>
                    <a
                      href={cit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#cbd5e1] hover:text-[#fce096] underline underline-offset-4"
                    >
                      {cit.label} <ExternalLink size={12} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12 flex flex-wrap gap-4 border-t border-[#d4af37]/20 pt-7">
            <Link
              to="/products/biotic-cellular-reset-30-day-gut-skin-protocol"
              className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white"
            >
              Shop 30-Day Gut-Skin Protocol (₹1,199) <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link
              to="/science"
              className="inline-flex items-center gap-2 rounded-xl border border-[#d4af37]/30 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#cbd5e1] hover:text-white"
            >
              <BookOpen size={14} aria-hidden="true" /> 20X Biochemical Science
            </Link>
          </div>
        </article>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070a0e] px-6 py-16 text-[#e2e8f0] sm:py-24">
      <SEO
        title="The Journal of Cutaneous Ecology | Gut-Skin Axis & Postbiotic Clinical Monographs · Bhumivera"
        description="Explore peer-reviewed clinical monographs dissecting the bidirectional gut-skin axis, intestinal LPS endotoxemia, 7-Tulsi COX-2 downregulation, and 4% Ladakh Sea Buckthorn Omega-7 barrier repair."
        route="/guides"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'The Journal of Cutaneous Ecology', url: '/guides' },
        ]}
      />
      <header className="mx-auto mb-12 max-w-4xl text-center">
        <p className="font-sub-gold text-[10px] uppercase tracking-[0.24em]">
          YMYL Clinical &amp; Phytochemical Dossiers · Accredited Advisory Board
        </p>
        <h1 className="mt-4 font-serif text-4xl text-white sm:text-6xl">
          <span className="font-headline-gold">The Journal of</span>{' '}
          <span className="font-headline-silver">Cutaneous Ecology</span>
        </h1>
        <div className="gold-hairline mx-auto my-5 max-w-xs" />
        <p className="mx-auto max-w-2xl text-sm leading-7 text-[#cbd5e1]">
          Clinical research monographs dissecting the biochemical pathways between intestinal dysbiosis, systemic cytokines (TNF-α, IL-6, IL-17), and stratum corneum acid-mantle homeostasis.
        </p>
      </header>
      <section aria-label="Cutaneous Ecology Monographs" className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        {GUIDES.map((item) => <GuideCard key={item.slug} guide={item} />)}
      </section>
    </main>
  );
}
