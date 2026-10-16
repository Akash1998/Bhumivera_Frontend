import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Clock, Droplets, Leaf, Microscope, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { FRONTEND_PRODUCTS_GUIDE, FRONTEND_INGREDIENT_MEMORY } from '../utils/bhumiveraAiConciergeFallback';

const ingredientStories = [
  {
    id: 'sea_buckthorn',
    name: 'Sea buckthorn',
    botanicalName: 'Hippophae rhamnoides L. (Elaeagnaceae)',
    concentration: '1.5% – 3.0% Cold-Pressed Berry & Seed Extract',
    note: 'Rich in rare Omega-7 (palmitoleic acid), Omega-3/6/9, beta-carotene, and Vitamins C & E. Cushions skin lipids during cleansing so skin feels supple, calm, and radiant after rinsing.',
    image: 'seabuckthorn nature.webp',
    imageAlt: 'Sea buckthorn berries among narrow green leaves',
    reference: 'https://powo.science.kew.org/results?q=Hippophae%20rhamnoides',
    aiPrompt: 'Tell me about Sea Buckthorn Face Wash and its key ingredients',
  },
  {
    id: 'niacinamide',
    name: 'Niacinamide (Vitamin B3)',
    botanicalName: 'Nicotinamide / Vitamin B3 Amide (C6H6N2O)',
    concentration: '0.1% – 1.0% Barrier & Pore Active',
    note: 'Water-soluble Vitamin B3 active that supports natural ceramide synthesis, regulates excess T-zone sebum, refines the appearance of enlarged pores, and calms redness without irritation.',
    image: 'aloeveradrop.webp',
    imageAlt: 'Botanical and modern dermatological formulation droplets',
    reference: 'https://pubchem.ncbi.nlm.nih.gov/compound/Nicotinamide',
    aiPrompt: 'Tell me about Niacinamide in Sea Buckthorn Face Wash',
  },
  {
    id: 'hyaluronic_acid',
    name: 'Hyaluronic Acid',
    botanicalName: 'Sodium Hyaluronate Polysaccharide',
    concentration: '0.1% – 0.5% Multi-Molecular Humectant',
    note: 'Biomimetic humectant that binds up to 1,000 times its weight in water, forming a breathable moisture cushion during washing so cleansing never leaves skin tight or dry.',
    image: 'aloeverascience.webp',
    imageAlt: 'Hydrating botanical gel droplets',
    reference: 'https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Hyaluronate',
    aiPrompt: 'Tell me about Hyaluronic Acid in Sea Buckthorn Face Wash',
  },
  {
    id: 'aloe_vera',
    name: 'Aloe vera',
    botanicalName: 'Aloe vera (L.) Burm.f. (Asphodelaceae)',
    concentration: '3.0% – 5.0% Inner Leaf Fillet Gel',
    note: 'Rich in acemannan polysaccharides, amino acids, and soothing plant sterols. Cools heat-flushed skin and cushions surfactant action during morning and evening cleansing.',
    image: 'aloeveradrop.webp',
    imageAlt: 'Aloe leaf represented in a clean botanical illustration',
    reference: 'https://powo.science.kew.org/results?q=Aloe%20vera',
    aiPrompt: 'Tell me about Aloe Vera in Sea Buckthorn Face Wash',
  },
  {
    id: 'tulsi',
    name: 'Tulsi (Holy Basil)',
    botanicalName: 'Ocimum tenuiflorum L. (Lamiaceae)',
    concentration: '0.3% – 0.8% Standardized Leaf Extract',
    note: 'Contains rosmarinic acid, ursolic acid, and eugenol polyphenols that clarify urban pollution buildup and help calm blemish-prone skin.',
    image: 'tulsi.webp',
    imageAlt: 'Tulsi leaves and flowering stems',
    reference: 'https://powo.science.kew.org/results?q=Ocimum%20tenuiflorum',
    aiPrompt: 'Tell me about Tulsi in Sea Buckthorn Face Wash',
  },
  {
    id: 'charcoal',
    name: 'Activated Bamboo Charcoal',
    botanicalName: 'Microporous Carbon Adsorbent',
    concentration: '1.0% – 2.0% Cosmetic Grade Charcoal',
    note: 'High-surface-area microporous carbon that acts like a gentle magnet for excess sebum, oxidized pore debris, and PM2.5 urban traffic soot.',
    image: 'charcoal.webp',
    imageAlt: 'Pieces of charcoal with green leaves',
    reference: 'https://www.britannica.com/science/charcoal',
    aiPrompt: 'Tell me about Charcoal Face Wash and its key ingredients',
  },
];

const principles = [
  {
    number: '01',
    icon: Leaf,
    title: 'Name what is there',
    copy: 'Every Bhumivera formulation lists its exact botanical extracts and dermatological actives—from Sea Buckthorn and Niacinamide to Hyaluronic Acid and Aloe Vera.',
  },
  {
    number: '02',
    icon: Microscope,
    title: 'Context over superlatives',
    copy: 'Ingredient form, concentration, contact time (30–45 seconds during cleansing), and synergistic pairings all matter.',
  },
  {
    number: '03',
    icon: ShieldCheck,
    title: 'Make room for individual skin',
    copy: 'Use our interactive Product & Ingredient Guide or click any active below to ask the Bhumivera AI Client Concierge for tailored AM/PM instructions.',
  },
];

const readingSteps = [
  ['Find the product & click Know More', 'Select Sea Buckthorn Face Wash, Activated Charcoal Face Wash, or Kumkumadi Night Elixir to inspect its complete listed ingredient memory.'],
  ['Explore 2+1 Ingredient Synergies', 'Click any active ingredient (such as Niacinamide) in our AI Concierge to unlock 2 deep-dive insights on that ingredient plus 1 closely related synergistic active.'],
  ['Follow the AM/PM Usage & Timing Ritual', 'Use lukewarm water, massage for 30–45 seconds to give water-soluble actives contact time, and apply hydration within 60 seconds on damp skin.'],
];

export default function BhumiveraScience() {
  const location = useLocation();
  const [selectedProductId, setSelectedProductId] = useState(FRONTEND_PRODUCTS_GUIDE[0].id);
  const selectedProduct =
    FRONTEND_PRODUCTS_GUIDE.find(p => p.id === selectedProductId) || FRONTEND_PRODUCTS_GUIDE[0];

  useEffect(() => {
    if (!location.hash) return undefined;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash]);

  const askConcierge = promptText => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new CustomEvent('bhumivera:open-support-chat', {
        detail: { prompt: promptText, autoSend: true },
      })
    );
  };

  return (
    <main className="bg-[#f5f2e9] text-[#1d2b22]">
      <SEO
        title="Botanical Science & Product Ingredients Guide | Bhumivera"
        description="Explore Bhumivera’s complete product and ingredient guide—including Sea Buckthorn Face Wash, Niacinamide, Hyaluronic Acid, Aloe Vera, and AM/PM usage timing."
        keywords="Bhumivera, Sea Buckthorn Face Wash, Niacinamide, Hyaluronic Acid, Aloe Vera, Tulsi, Charcoal, skincare usage guide"
        route="/science"
      />

      <section className="relative isolate overflow-hidden bg-[#122019] text-white">
        <img
          src="/assets/images/aloeverascience.webp"
          alt="A close botanical view of an aloe leaf"
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101a14]/95 via-[#101a14]/80 to-[#101a14]/35" />
        <div className="mx-auto flex min-h-[min(690px,calc(100svh_-_72px))] max-w-7xl flex-col justify-center px-5 py-20 sm:px-8 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="max-w-3xl">
            <p className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.22em] text-[#dce7c5] sm:text-[10px]">
              <Leaf size={14} /> Botanical notes · product & ingredient master guide
            </p>
            <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
              Nature invites curiosity. Good information earns trust.
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              Explore the exact botanical extracts and dermatological actives inside Bhumivera formulations—including Sea Buckthorn, Niacinamide (Vitamin B3), Hyaluronic Acid, Aloe Vera, and Activated Charcoal—plus our complete AM/PM usage & timing guide.
            </p>
            <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row flex-wrap">
              <a href="#product-guide" className="inline-flex min-h-12 items-center justify-center gap-3 bg-[#dce7c5] px-5 py-3 text-xs font-bold text-[#19271e] sm:text-sm">
                Interactive Product & Ingredient Guide <ArrowRight size={15} />
              </a>
              <button
                type="button"
                onClick={() => askConcierge('Tell me about Sea Buckthorn Face Wash and its key ingredients')}
                className="inline-flex min-h-12 items-center justify-center gap-2.5 border border-[#D4AF37]/60 bg-[#0B2419]/80 px-5 py-3 text-xs font-semibold text-[#D4AF37] hover:bg-[#0B2419] sm:text-sm"
              >
                <Sparkles size={15} /> Ask AI Concierge: Sea Buckthorn Face Wash
              </button>
              <Link to="/shop" className="inline-flex min-h-12 items-center justify-center gap-3 border border-white/40 px-5 py-3 text-xs font-semibold text-white sm:text-sm">
                Browse products <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/20 pt-5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/60 sm:text-[10px]">
            <a href="#approach" className="hover:text-white">Our approach</a>
            <a href="#product-guide" className="hover:text-white">Product & Usage Master Guide</a>
            <a href="#ingredients" className="hover:text-white">Ingredient notes</a>
            <a href="#formulas" className="hover:text-white">Reading formulas</a>
            <a href="#references" className="hover:text-white">References</a>
          </div>
        </div>
      </section>

      <section id="approach" className="scroll-mt-24 border-b border-[#26392c]/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-10 lg:py-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#687958]">The Bhumivera approach</p>
            <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">Start with what can be checked.</h2>
          </div>
          <div>
            <p className="font-serif text-xl leading-relaxed text-[#26352b] sm:text-2xl">
              Nature is complex. We pair heritage Indian botanicals with precision dermatological actives so every wash and ritual respects your skin barrier.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600 sm:text-base">
              This master guide connects each Bhumivera formulation to its full listed ingredients, concentration context, synergistic active pairings, and exact morning (AM) and evening (PM) application windows.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {principles.map(({ number, icon: Icon, title, copy }) => (
                <article key={number} className="border-t border-[#536b4d]/30 py-4">
                  <div className="flex items-center justify-between text-[#687958]">
                    <span className="font-mono text-[10px]">{number}</span>
                    <Icon size={17} aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-stone-600 sm:text-sm">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Website Product, Ingredient Memory & Usage Timing Master Guide */}
      <section id="product-guide" className="scroll-mt-24 border-b border-[#26392c]/15 bg-[#fdfbf7]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="flex flex-col gap-4 border-b border-[#26392c]/15 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#687958]">
                <Sparkles size={13} /> Interactive Formulation & Usage Guide
              </p>
              <h2 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
                Product Ingredients, 2+1 Synergies & AM/PM Rituals
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {FRONTEND_PRODUCTS_GUIDE.map(prod => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => setSelectedProductId(prod.id)}
                  className={`px-4 py-2.5 text-xs font-semibold transition-all border ${
                    selectedProduct.id === prod.id
                      ? 'bg-[#122019] text-[#dce7c5] border-[#122019]'
                      : 'bg-white text-[#1d2b22] border-[#26392c]/20 hover:border-[#122019]'
                  }`}
                >
                  {prod.name.replace('Bhumivera ', '')}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Left Column: Complete Listed Ingredients & 1-Click AI Deep-Dive */}
            <div className="space-y-6 border border-[#26392c]/15 bg-[#f5f2e9] p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#26392c]/10 pb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#687958]">
                    Complete Formulation Profile
                  </span>
                  <h3 className="mt-1 font-serif text-2xl sm:text-3xl">{selectedProduct.name}</h3>
                  <p className="mt-1 text-xs font-medium text-[#536b4d] sm:text-sm">{selectedProduct.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => askConcierge(selectedProduct.prompts.knowMore)}
                  className="inline-flex items-center gap-2 bg-[#122019] px-4 py-2.5 text-xs font-semibold text-[#D4AF37] hover:bg-[#1d3328]"
                >
                  <Sparkles size={14} /> Know More in AI Concierge
                </button>
              </div>

              <p className="text-xs leading-relaxed text-stone-700 sm:text-sm">
                <strong>Ideal Skin Types:</strong> {selectedProduct.skinTypes}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#354933]">
                  Listed Ingredients Saved in AI Memory (Click Any Ingredient to Ask AI)
                </h4>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {selectedProduct.keyActives.map(active => (
                    <div
                      key={active.id}
                      className="flex flex-col justify-between border border-[#26392c]/12 bg-white p-3.5 transition-all hover:border-[#122019]"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-serif text-base font-semibold text-[#122019]">{active.name}</span>
                          <span className="bg-[#e7e4d9] px-2 py-0.5 font-mono text-[10px] font-bold text-[#354933]">
                            {active.pct}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-stone-600">{active.role}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => askConcierge(`Tell me about ${active.name.split(' (')[0]} in ${selectedProduct.name}`)}
                        className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#122019] hover:text-[#687958]"
                      >
                        <Sparkles size={12} className="text-[#D4AF37]" /> Explore {active.name.split(' (')[0]} + 2&1 Suggestions <ArrowRight size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: How & What Time to Use Step-by-Step Guide */}
            <div className="flex flex-col justify-between border border-[#26392c]/15 bg-[#122019] p-6 text-white sm:p-8">
              <div className="space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#dce7c5]">
                    <Clock size={13} /> Best Time & Step-by-Step Ritual
                  </span>
                  <h3 className="mt-2 font-serif text-2xl sm:text-3xl">
                    How & What Time to Use {selectedProduct.name.replace('Bhumivera ', '')}
                  </h3>
                </div>

                <div className="space-y-3 border-y border-white/15 py-4 text-xs leading-relaxed text-white/85">
                  <p>
                    <strong className="text-[#dce7c5]">🌅 Morning Window:</strong> {selectedProduct.bestTimeToUse.morning}
                  </p>
                  <p>
                    <strong className="text-[#dce7c5]">🌙 Evening Window:</strong> {selectedProduct.bestTimeToUse.evening}
                  </p>
                  <p>
                    <strong className="text-[#dce7c5]">🔁 Frequency:</strong> {selectedProduct.bestTimeToUse.frequency}
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#dce7c5]">
                    60-Second Step-by-Step Application
                  </h4>
                  <ol className="mt-3 space-y-2.5 text-xs leading-relaxed text-white/80">
                    {selectedProduct.howToUseSteps.map((stepText, idx) => (
                      <li key={idx} className="grid grid-cols-[24px_1fr] gap-2">
                        <span className="font-mono font-bold text-[#D4AF37]">0{idx + 1}</span>
                        <span>{stepText}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => askConcierge(selectedProduct.prompts.usage)}
                  className="inline-flex items-center gap-2 bg-[#dce7c5] px-4 py-2.5 text-xs font-bold text-[#122019] hover:bg-white"
                >
                  Ask AI Concierge for Custom Routine <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => askConcierge(selectedProduct.prompts.niacinamide)}
                  className="inline-flex items-center gap-2 border border-white/30 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10"
                >
                  Check Niacinamide 2+1 Suggestions
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ingredients" className="scroll-mt-24 bg-[#e7e4d9]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="mb-8 grid gap-4 border-b border-[#26392c]/15 pb-6 sm:mb-10 sm:grid-cols-[1fr_0.7fr] sm:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#687958]">A small field guide</p>
              <h2 className="mt-3 max-w-2xl font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">Names first. Context always.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-stone-600">
              Botanical and dermatological references help identify each active. Click any ingredient card below to open its saved reference and 2+1 related suggestions in the Bhumivera Client Concierge.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ingredientStories.map((story, index) => (
              <article key={story.name} className="group flex flex-col justify-between overflow-hidden border border-[#26392c]/10 bg-[#f5f2e9]">
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#d8ddcf]">
                    <img src={`/assets/images/${story.image}`} alt={story.imageAlt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                    <span className="absolute left-3 top-3 bg-[#15231c]/85 px-2.5 py-1.5 font-mono text-[9px] text-[#e0e8ce]">FIELD NOTE · 0{index + 1}</span>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="font-serif text-2xl">{story.name}</h3>
                    <p className="mt-1 font-mono text-[10px] leading-5 text-[#687958]">{story.botanicalName}</p>
                    <p className="mt-1 font-mono text-[10px] font-semibold text-[#354933]">{story.concentration}</p>
                    <p className="mt-3 text-xs leading-5 text-stone-600 sm:text-sm">{story.note}</p>
                  </div>
                </div>
                <div className="px-4 pb-5 sm:px-5 flex flex-wrap items-center justify-between gap-2">
                  <a href={story.reference} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-1.5 border-b border-[#536b4d]/30 pb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#354933] sm:text-[10px]">
                    Check reference <ArrowRight size={12} />
                  </a>
                  <button
                    type="button"
                    onClick={() => askConcierge(story.aiPrompt)}
                    className="inline-flex items-center gap-1.5 bg-[#122019] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#dce7c5] hover:bg-[#213329]"
                  >
                    <Sparkles size={11} /> Ask AI Concierge
                  </button>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 text-[10px] leading-5 text-stone-500">
            Botanical and active names are provided for identification. Ingredient sourcing and inclusion are product-specific; check the relevant product information.
          </p>
        </div>
      </section>

      <section id="formulas" className="scroll-mt-24 bg-[#17231d] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-10 lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#dce7c5]"><BookOpen size={15} /> A practical guide</p>
            <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">A better way to read a product page.</h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/65">
              The botanical story can spark interest. The exact product label and our AI Client Concierge are where to confirm listed ingredients, synergistic actives, and AM/PM directions.
            </p>
            <a href="https://www.fda.gov/cosmetics/cosmetics-labeling-regulations/cosmetics-labeling-guide" target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-10 items-center gap-2 border-b border-[#dce7c5]/40 pb-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#e0e8ce] sm:text-[10px]">
              Read a cosmetics labeling guide <ArrowRight size={13} />
            </a>
          </div>
          <div className="border-y border-white/15">
            {readingSteps.map(([title, copy], index) => (
              <div key={title} className="grid grid-cols-[36px_1fr] gap-3 border-b border-white/10 py-5 last:border-b-0 sm:grid-cols-[48px_1fr] sm:gap-5 sm:py-6">
                <span className="font-mono text-xs text-[#c8d6aa]">0{index + 1}</span>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl">{title}</h3>
                  <p className="mt-2 max-w-xl text-xs leading-5 text-white/60 sm:text-sm sm:leading-6">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="references" className="scroll-mt-24 bg-[#f5f2e9]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 sm:px-8 sm:py-12 md:flex-row md:items-center md:justify-between lg:px-10">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#687958]"><Droplets size={14} /> Keep exploring</p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl">Curiosity belongs beside clear choices.</h2>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-stone-600 sm:text-sm">Read the individual product details, explore our Brand Ambassador Program, or browse the live collection.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => askConcierge('How do I join the Bhumivera Brand Ambassador Program?')}
              className="inline-flex min-h-11 items-center gap-2 border border-[#536b4d]/40 bg-white px-4 py-2 text-xs font-semibold text-[#122019]"
            >
              Brand Ambassador Program <ArrowRight size={14} />
            </button>
            <Link to="/about" className="inline-flex min-h-11 items-center gap-2 border border-[#536b4d]/30 px-4 py-2 text-xs font-semibold text-[#354933]">Our story <ArrowRight size={14} /></Link>
            <Link to="/shop" className="inline-flex min-h-11 items-center gap-2 bg-[#213329] px-4 py-2 text-xs font-semibold text-white">Explore products <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
