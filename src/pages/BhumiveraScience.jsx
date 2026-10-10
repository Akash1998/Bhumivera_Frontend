import { useEffect } from 'react';
import { ArrowRight, BookOpen, Droplets, Leaf, Microscope, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const ingredientStories = [
  {
    name: 'Aloe vera',
    botanicalName: 'Aloe vera (L.) Burm.f.',
    note: 'A succulent plant in the Asphodelaceae family. The name helps identify the botanical; it does not describe the percentage or form used in any particular product.',
    image: 'aloeveradrop.webp',
    imageAlt: 'Aloe leaf represented in a clean botanical illustration',
    reference: 'https://powo.science.kew.org/results?q=Aloe%20vera',
  },
  {
    name: 'Sea buckthorn',
    botanicalName: 'Hippophae rhamnoides L.',
    note: 'A recognised plant species in the Elaeagnaceae family. Its berries, leaves and seed oils are distinct materials, so the ingredient list matters.',
    image: 'seabuckthorn nature.webp',
    imageAlt: 'Sea buckthorn berries among narrow green leaves',
    reference: 'https://powo.science.kew.org/results?q=Hippophae%20rhamnoides',
  },
  {
    name: 'Tulsi',
    botanicalName: 'Ocimum tenuiflorum L.',
    note: 'A member of the mint family, Lamiaceae. “Tulsi” is a common name; botanical naming helps distinguish a plant from a broad marketing description.',
    image: 'tulsi.webp',
    imageAlt: 'Tulsi leaves and flowering stems',
    reference: 'https://powo.science.kew.org/results?q=Ocimum%20tenuiflorum',
  },
  {
    name: 'Charcoal',
    botanicalName: 'A material, not a plant species',
    note: 'Charcoal is a carbon-rich material made by heating organic matter with limited oxygen. “Charcoal” alone does not establish source, grade or cosmetic performance.',
    image: 'charcoal.webp',
    imageAlt: 'Pieces of charcoal with green leaves',
    reference: 'https://www.britannica.com/science/charcoal',
  },
];

const principles = [
  {
    number: '01',
    icon: Leaf,
    title: 'Name what is there',
    copy: 'A botanical story is an introduction, not a substitute for the ingredient list on an individual product.',
  },
  {
    number: '02',
    icon: Microscope,
    title: 'Context over superlatives',
    copy: 'Ingredient form, amount, processing and the finished formula all matter. A plant name alone cannot establish a product result.',
  },
  {
    number: '03',
    icon: ShieldCheck,
    title: 'Make room for individual skin',
    copy: 'People can respond differently to the same cosmetic. Read the directions and ingredient information before use.',
  },
];

const readingSteps = [
  ['Find the product', 'Open the exact item you are considering; product formulas are not interchangeable.'],
  ['Read its ingredient list', 'Check the complete list and directions on that product’s own page and packaging.'],
  ['Choose with context', 'Consider your preferences and sensitivities. If a product does not suit you, stop using it.'],
];

export default function BhumiveraScience() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return undefined;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash]);

  return (
    <main className="bg-[#f5f2e9] text-[#1d2b22]">
      <SEO
        title="Botanical Science | Bhumivera"
        description="Explore botanical identities, ingredient context and a clearer way to read Bhumivera product information."
        keywords="Bhumivera, botanical ingredients, aloe vera, sea buckthorn, tulsi, cosmetic ingredient information"
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
              <Leaf size={14} /> Botanical notes · product clarity
            </p>
            <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
              Nature invites curiosity. Good information earns trust.
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              Explore the plants and materials that inspire our point of view—and learn how to check what is actually in the product you choose. Clear names, considered context, no promises that a label cannot support.
            </p>
            <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
              <a href="#ingredients" className="inline-flex min-h-12 items-center justify-center gap-3 bg-[#dce7c5] px-5 py-3 text-xs font-bold text-[#19271e] sm:text-sm">
                Explore ingredient notes <ArrowRight size={15} />
              </a>
              <Link to="/shop" className="inline-flex min-h-12 items-center justify-center gap-3 border border-white/40 px-5 py-3 text-xs font-semibold text-white sm:text-sm">
                Browse products <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/20 pt-5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/60 sm:text-[10px]">
            <a href="#approach" className="hover:text-white">Our approach</a>
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
              Nature is complex. We can respect that complexity without turning it into a claim of guaranteed results.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600 sm:text-base">
              This page introduces selected botanical identities and general cosmetic context. It is not a complete formula record, a medical guide, or evidence that every featured ingredient appears in every product. For a specific formula, use that product’s ingredient list and directions.
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

      <section id="ingredients" className="scroll-mt-24 bg-[#e7e4d9]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="mb-8 grid gap-4 border-b border-[#26392c]/15 pb-6 sm:mb-10 sm:grid-cols-[1fr_0.7fr] sm:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#687958]">A small field guide</p>
              <h2 className="mt-3 max-w-2xl font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">Names first. Context always.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-stone-600">
              Botanical references help identify a species. They do not establish the contents, concentration or performance of a finished product.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ingredientStories.map((story, index) => (
              <article key={story.name} className="group overflow-hidden border border-[#26392c]/10 bg-[#f5f2e9]">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#d8ddcf]">
                  <img src={`/assets/images/${story.image}`} alt={story.imageAlt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  <span className="absolute left-3 top-3 bg-[#15231c]/85 px-2.5 py-1.5 font-mono text-[9px] text-[#e0e8ce]">FIELD NOTE · 0{index + 1}</span>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-serif text-2xl">{story.name}</h3>
                  <p className="mt-1 font-mono text-[10px] leading-5 text-[#687958]">{story.botanicalName}</p>
                  <p className="mt-3 text-xs leading-5 text-stone-600 sm:text-sm">{story.note}</p>
                  <a href={story.reference} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-10 items-center gap-2 border-b border-[#536b4d]/30 pb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#354933] sm:text-[10px]">
                    Check reference <ArrowRight size={13} />
                  </a>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 text-[10px] leading-5 text-stone-500">
            Botanical names are provided for identification. Ingredient sourcing and inclusion are product-specific; check the relevant product information.
          </p>
        </div>
      </section>

      <section id="formulas" className="scroll-mt-24 bg-[#17231d] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-10 lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#dce7c5]"><BookOpen size={15} /> A practical guide</p>
            <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">A better way to read a product page.</h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/65">
              The botanical story can spark interest. The exact product label is where to confirm ingredients and directions.
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
            <p className="mt-2 max-w-2xl text-xs leading-5 text-stone-600 sm:text-sm">Read the individual product details, explore our brand story, or browse the live collection.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/about" className="inline-flex min-h-11 items-center gap-2 border border-[#536b4d]/30 px-4 py-2 text-xs font-semibold text-[#354933]">Our story <ArrowRight size={14} /></Link>
            <Link to="/shop" className="inline-flex min-h-11 items-center gap-2 bg-[#213329] px-4 py-2 text-xs font-semibold text-white">Explore products <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
