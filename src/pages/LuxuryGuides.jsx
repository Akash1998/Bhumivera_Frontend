import { ArrowLeft, ArrowRight, BookOpen, Droplets, Leaf, FlaskConical, Sparkles, ShieldCheck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';

const GUIDES = [
  {
    slug: 'ultimate-guide-luxury-organic-face-wash-india',
    title: 'A Thoughtful Guide to Choosing a Luxury Botanical & Organic-Inspired Face Wash in India',
    description:
      'Learn how to evaluate active ingredient percentages, pH 5.3–5.5 acid-mantle calibration, cold-pressed (<28°C) botanicals, and barrier humectants like 5% Glycerin, Niacinamide, and Hyaluronic Acid.',
    category: 'Skincare Science',
    readTime: '8 min read',
    icon: Droplets,
    relatedProducts: [
      { name: 'Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (4% Sea Buckthorn)', slug: 'himalayan-seabuckthorn-luxury-face-wash', price: '₹799' },
      { name: 'Bhumivera Activated Charcoal Purifying Luxury Face Wash (3% Charcoal)', slug: 'activated-charcoal-luxury-face-wash', price: '₹699' },
    ],
    sections: [
      {
        title: '1. Look Beyond Opaque "Base Q.S." Labels to Exact Percentage Disclosure',
        paragraphs: [
          'In conventional skincare, terms like “herbal” and “botanical” often mask formulas where active plant extracts make up less than 0.05% of the bottle, hidden behind an opaque “Aqua / Base Q.S.” label. Under The Bhumivera Transparency Standard (Est. 2016 lineage), every functional botanical and barrier active is printed openly with its exact concentration on the front and back of the bottle.',
          'When evaluating a facial cleanser, check whether the brand discloses its primary purifying or brightening active alongside its humectant cushion. For example, Bhumivera pairs 4.0% Himalayan Sea Buckthorn or 3.0% Activated Charcoal with a full 5.0% Botanical Glycerin cushion, 0.1% Hyaluronic Acid, 0.1% Niacinamide, 0.5% Manjistha, 0.5% Haridra (Turmeric), 0.5% Neem, and 0.5% Cucumber Extract.',
        ],
      },
      {
        title: '2. Why pH 5.3–5.5 Calibration Protects Your Stratum Corneum',
        paragraphs: [
          'Healthy human facial skin maintains a slightly acidic hydrolipidic film—known as the acid mantle—between pH 4.7 and 5.75. High-foaming commercial face washes formulated with Sodium Lauryl Sulfate (SLS) or alkaline soap bases (pH 8.0–9.5) strip intercellular ceramides, swell corneocytes, and leave skin feeling tight and vulnerable to rebound oiliness.',
          'Both Bhumivera facial cleansers are calibrated using digital glass electrodes at 25°C to pH 5.3–5.5. Using lukewarm water and a 30–45 second circular massage, they lift urban PM2.5 particulates, oxidized sebum, and sunscreen while leaving your natural lipid barrier calm, hydrated, and resilient.',
        ],
      },
      {
        title: '3. Choosing Between 4% Himalayan Sea Buckthorn and 3% Activated Charcoal',
        paragraphs: [
          'If your skin experiences dullness, uneven tone, sun-induced photo-stress, or dehydration, choose the Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (4% Hippophae rhamnoides rich in Omega-7 palmitoleic acid and Vitamin C carotenoids). If your primary concern is congested pores, T-zone oiliness, blackheads, or heavy urban traffic pollution, choose the Bhumivera Activated Charcoal Purifying Luxury Face Wash (3% microporous carbon). Many patrons use Sea Buckthorn in the morning (AM antioxidant ritual) and Activated Charcoal in the evening (PM deep pore reset).',
          'Because concentrated botanical extracts are bioactive, always perform a 24-hour patch test on your inner forearm before first facial application.',
        ],
      },
    ],
  },
  {
    slug: 'science-of-sulfate-free-luxury-herbal-shampoos',
    title: 'The Science of Sulfate-Free Luxury Herbal Shampoos: Reetha Saponins, Amla, Rosemary & Bhringraj',
    description:
      'Understand how natural Sapindus mukorossi (Reetha) plant saponins cleanse without SLS/SLES, why pH 5.0–5.24 seals hair cuticles, and how milligram-dosed Rosemary, Bhringraj, and Amla nourish roots.',
    category: 'Haircare & Trichology',
    readTime: '7 min read',
    icon: Leaf,
    relatedProducts: [
      { name: 'Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML)', slug: 'luxury-2-in-1-botanical-shampoo-conditioner', price: '₹899' },
    ],
    sections: [
      {
        title: '1. Plant Saponins vs. Harsh Synthetic Sulfates (SLS/SLES)',
        paragraphs: [
          'Conventional shampoos rely on aggressive anionic sulfates (Sodium Lauryl Sulfate and Sodium Laureth Sulfate) to generate heavy foam, stripping scalp sebum and roughing up the overlapping keratin scales of the hair cuticle. To mask this roughness, mass-market formulas coat the hair in heavy, non-biodegradable dimethicone silicones that build up on the scalp over time.',
          'The Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner replaces synthetic sulfates and heavy silicones with a precision-dosed 100 mg standardized 8-herb complex: Ritta/Reetha (25 mg), Amla (20 mg), Triphala (10 mg), Bringna/Bhringraj (10 mg), Rosemary Oil (10 mg), Neem (10 mg), Aloe Vera (10 mg), and Shikhakai (5 mg).',
        ],
      },
      {
        title: '2. Cuticle-Sealing pH 5.0–5.24 & Silicone-Free Conditioning',
        paragraphs: [
          'The hair fiber has an isoelectric point around pH 3.67, and the scalp acid mantle thrives at pH 4.5–5.5. Alkaline hair washes cause the cuticle scales to lift, leading to frizz, tangling, and breakage when wet. Calibrated to pH 5.0–5.24 with naturally acidic Shikakai (5 mg) and Aloe Vera inner-leaf mucilage (10 mg), Bhumivera’s 2-in-1 formula flattens and seals the cuticle during rinsing for effortless detangling and natural mirror-like shine.',
        ],
      },
      {
        title: '3. Follicular Nourishment: Rosemary Oil, Bhringraj, Amla & Triphala',
        paragraphs: [
          'To maximize scalp benefits, massage the shampoo into a wet scalp for a full 90 to 120 seconds before rinsing. This contact window allows 10 mg of pure Rosemary Essential Oil (carnosic acid and rosmarinic acid), 10 mg of Bhringraj (wedelolactone), 20 mg of Vitamin-C-rich Amla tannins, 10 mg of Triphala, and 10 mg of clarifying Neem to invigorate scalp micro-circulation and support resilient, fuller-looking hair from root to tip.',
        ],
      },
    ],
  },
  {
    slug: 'niacinamide-hyaluronic-acid-botanical-face-wash-guide',
    title: 'Face Wash with Niacinamide & Hyaluronic Acid: Why Barrier Humectants Matter in Rinse-Off Cleansers',
    description:
      'Discover how 0.1% Niacinamide (Vitamin B3), 0.1% Hyaluronic Acid, and 5% Botanical Glycerin work inside Bhumivera’s Sea Buckthorn and Activated Charcoal Face Washes to prevent post-wash tightness.',
    category: 'Ingredient Science',
    readTime: '6 min read',
    icon: FlaskConical,
    relatedProducts: [
      { name: 'Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash', slug: 'himalayan-seabuckthorn-luxury-face-wash', price: '₹799' },
      { name: 'Bhumivera Activated Charcoal Purifying Luxury Face Wash', slug: 'activated-charcoal-luxury-face-wash', price: '₹699' },
    ],
    sections: [
      {
        title: '1. Why Include Niacinamide & Hyaluronic Acid in a Facial Cleanser?',
        paragraphs: [
          'Many skincare buyers searching for a “face wash with niacinamide” (often spelled niacidamine) or a “hyaluronic acid cleanser” wonder whether water-soluble actives work in a 30–45 second wash-off ritual. During cleansing, surfactant micelles temporarily loosen surface lipids. When 5.0% Botanical Glycerin, 0.1% Sodium Hyaluronate (Hyaluronic Acid), and 0.1% Niacinamide (Vitamin B3) are suspended in a pH 5.4 emulsion, they form a hydrophilic moisture cushion across the stratum corneum that prevents transepidermal water loss (TEWL) during rinsing.',
          'Furthermore, calibrating the cleanser to pH 5.3–5.5 ensures Niacinamide remains 100% stable without hydrolyzing into nicotinic acid, meaning zero redness or flushing even on delicate skin.',
        ],
      },
      {
        title: '2. Synergy with Ayurvedic Manjistha, Haridra & Neem',
        paragraphs: [
          'While Niacinamide supports pore refinement and sebum balance, Bhumivera pairs it with 0.5% Manjistha (Rubia cordifolia), 0.5% Haridra (Curcuma longa), 0.5% Neem (Azadirachta indica), and 0.5% Cooling Cucumber Extract. This dual clinical-and-Ayurvedic architecture addresses dullness, uneven tone, and urban pore congestion simultaneously.',
        ],
      },
    ],
  },
  {
    slug: 'himalayan-seabuckthorn-omega-7-skincare-guide',
    title: 'Himalayan Sea Buckthorn (Hippophae rhamnoides): The Rare Omega-7 & Vitamin C Super-Berry for Radiant Skin',
    description:
      'Explore why Bhumivera formulates with a full 4.0% concentration of sub-28°C cold-pressed Himalayan Sea Buckthorn to nourish skin lipids and brighten dull complexions.',
    category: 'Botanical Monograph',
    readTime: '7 min read',
    icon: Sparkles,
    relatedProducts: [
      { name: 'Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML)', slug: 'himalayan-seabuckthorn-luxury-face-wash', price: '₹799' },
    ],
    sections: [
      {
        title: '1. High-Altitude Survival at 3,400 Meters in Ladakh & Spiti',
        paragraphs: [
          'Growing wild in the cold desert valleys of Ladakh and Lahaul-Spiti above 3,200 meters, Hippophae rhamnoides (Himalayan Sea Buckthorn) endures sub-zero frost and intense high-altitude UV radiation. To survive, the bright orange berry bio-accumulates over 190 bioactive nutrients—most notably rare Omega-7 (palmitoleic acid), Omega-3, 6, and 9 fatty acids, beta-carotene, lycopene, tocopherols (Vitamin E), and bio-available Vitamin C.',
        ],
      },
      {
        title: '2. Sub-28°C Cold-Pressing vs. Boiled Commercial Extracts',
        paragraphs: [
          'Omega-7 lipids and natural carotenoids degrade rapidly when exposed to industrial steam boiling (80°C–100°C). Bhumivera cold-presses its Sea Buckthorn extract below 28°C and incorporates it at a label-disclosed 4.0% potency per 100ml in the Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash—delivering authentic golden nourishment on every wash.',
        ],
      },
    ],
  },
  {
    slug: 'seven-tulsi-cortisol-gut-skin-axis-guide',
    title: 'Kalpvriksh Satva 7-Tulsi vs. Panch Tulsi: The Inside-Out Gut-Skin & Cortisol Adaptogen Ritual',
    description:
      'Understand how a 90% concentrated distillate (9.0ml per 10ml) of 7 distinct Tulsi varieties supports internal antioxidant vitality, seasonal wellness, and clear skin from within.',
    category: 'Ayurvedic Wellness',
    readTime: '6 min read',
    icon: ShieldCheck,
    relatedProducts: [
      { name: 'Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract Drops (30 ML)', slug: 'kalpvriksh-satva-tulsi-7-tulsi-extract', price: '₹499' },
      { name: 'Bhumivera Soothing Bar — Aloe Vera, Neem & Sacred Tulsi (100 GM)', slug: 'artisanal-aloe-vera-handmade-soap', price: '₹349' },
    ],
    sections: [
      {
        title: '1. Why 7 Distinct Tulsi Varieties Outperform Standard 5-Herb Panch Tulsi',
        paragraphs: [
          'While conventional market “Panch Tulsi” drops combine five varieties, Bhumivera Kalpvriksh Satva Tulsi unites seven distinct Ocimum chemotypes—Van Tulsi, Sweet Tulsi, Marua Tulsi, Bisva Tulsi, Kala Tulsi, Rama Tulsi, and Lemon Tulsi—at a label-disclosed concentration of 9.0 ml active extract per 10 ml (90% potency).',
          'Each variety contributes a distinct spectrum of volatile phytonutrients: eugenol, rosmarinic acid, ursolic acid, carvacrol, linalool, and citral. Taken as 3–4 drops in warm water or tea twice daily, it complements topical cleansing by supporting internal antioxidant balance and seasonal respiratory comfort.',
        ],
      },
    ],
  },
];

function GuideCard({ guide }) {
  const Icon = guide.icon;

  return (
    <article className="flex flex-col rounded-2xl two-tone-card border border-[#d4af37]/25 bg-[#0d1520]/60 p-6 shadow-lg transition hover:border-[#d4af37]/60">
      <div className="flex items-center gap-3 text-[#fce096]">
        <span className="rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-3">
          <Icon size={20} aria-hidden="true" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{guide.category}</span>
      </div>
      <h2 className="mt-5 font-serif text-2xl text-white">{guide.title}</h2>
      <p className="mt-3 flex-1 text-sm leading-7 text-[#cbd5e1]">{guide.description}</p>
      {guide.relatedProducts?.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
          <span className="block font-mono text-[9px] uppercase tracking-widest text-[#d4af37]">Featured Formulations:</span>
          {guide.relatedProducts.map((rp) => (
            <Link
              key={rp.slug}
              to={`/product/${rp.slug}`}
              className="block text-xs text-[#fce096] hover:underline truncate"
            >
              ✦ {rp.name} ({rp.price})
            </Link>
          ))}
        </div>
      )}
      <div className="mt-5 flex items-center justify-between border-t border-[#d4af37]/15 pt-4 text-xs text-[#94a3b8]">
        <span>{guide.readTime}</span>
        <Link
          to={`/guides/${guide.slug}`}
          className="inline-flex items-center gap-2 font-semibold text-[#fce096] hover:text-white"
        >
          Read monograph <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function LuxuryGuides() {
  const { slug } = useParams();
  const guide = GUIDES.find((item) => item.slug === slug);

  if (slug && guide) {
    return (
      <main className="min-h-screen bg-[#070a0e] px-6 py-16 text-[#e2e8f0] sm:py-24">
        <SEO
          title={`${guide.title} | Bhumivera`}
          description={guide.description}
          route={`/guides/${guide.slug}`}
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: 'Guides', url: '/guides' },
            { name: guide.title, url: `/guides/${guide.slug}` },
          ]}
        />
        <article className="mx-auto max-w-4xl">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#fce096] hover:text-white"
          >
            <ArrowLeft size={14} aria-hidden="true" /> All guides
          </Link>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-[#d4af37]">
            {guide.category} · {guide.readTime}
          </p>
          <h1 className="mt-3 font-serif text-3xl leading-tight text-white sm:text-5xl">
            {guide.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-[#cbd5e1]">{guide.description}</p>

          <div className="mt-10 space-y-8 border-t border-[#d4af37]/20 pt-8">
            {guide.sections.map((section) => (
              <section key={section.title} className="space-y-3 rounded-2xl two-tone-card border border-[#d4af37]/20 p-6">
                <h2 className="font-serif text-2xl text-white">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-7 text-[#cbd5e1]">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {guide.relatedProducts?.length > 0 && (
            <div className="mt-10 rounded-2xl two-tone-panel-gold border border-[#d4af37]/40 p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#fce096]">
                100% Label-Disclosed Formulations Referenced in This Monograph
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {guide.relatedProducts.map((rp) => (
                  <Link
                    key={rp.slug}
                    to={`/product/${rp.slug}`}
                    className="flex items-center justify-between rounded-xl border border-[#d4af37]/30 bg-[#070a0e]/80 p-4 text-xs font-semibold text-white hover:border-[#d4af37]"
                  >
                    <span>{rp.name}</span>
                    <span className="font-mono text-[#fce096] ml-2 shrink-0">{rp.price} →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 rounded-2xl border border-[#d4af37]/25 bg-[#0d1520] p-6">
            <h2 className="font-serif text-xl text-white">Explore the collection &amp; science</h2>
            <p className="mt-2 text-sm leading-6 text-[#cbd5e1]">
              View product details, ingredient lists, and usage instructions in the Bhumivera shop and science portal.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider text-white"
              >
                Visit the shop <ArrowRight size={14} aria-hidden="true" />
              </Link>
              <Link
                to="/science"
                className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#cbd5e1]"
              >
                Botanical Science <ArrowRight size={14} aria-hidden="true" />
              </Link>
              <Link
                to="/impact"
                className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#cbd5e1]"
              >
                Public Impact Ledger <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </article>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070a0e] px-6 py-16 text-[#e2e8f0] sm:py-24">
      <SEO
        title="Skincare, Haircare & Active Ingredient Guides | Bhumivera"
        description="Practical guides to botanical skincare, Niacinamide & Hyaluronic Acid cleansers, 4% Himalayan Sea Buckthorn, sulfate-free Reetha shampoos, and 7-Tulsi adaptogens from Bhumivera."
        route="/guides"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Guides', url: '/guides' },
        ]}
      />
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#0d1520] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fce096]">
            <BookOpen size={14} className="text-[#d4af37]" aria-hidden="true" /> Bhumivera Guides &amp; Ingredient Monographs
          </p>
          <h1 className="mt-5 font-serif text-3xl leading-tight text-white sm:text-5xl">
            Thoughtful care, explained simply.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#cbd5e1] sm:text-base">
            Explore our complete library of skincare, haircare, and active-ingredient monographs—grounding every formulation in 100% active percentage and milligram-level disclosure.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((item) => (
            <GuideCard key={item.slug} guide={item} />
          ))}
        </div>
      </div>
    </main>
  );
}
