import { ArrowLeft, ArrowRight, BookOpen, Droplets, Leaf } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';

const GUIDES = [
  {
    slug: 'ultimate-guide-luxury-organic-face-wash-india',
    title: 'A Thoughtful Guide to Choosing a Luxury Organic Face Wash',
    description:
      'Learn what to look for in a botanical face wash, how to cleanse gently, and how to build a simple routine around your skin’s needs.',
    category: 'Skincare',
    readTime: '5 min read',
    icon: Droplets,
    sections: [
      {
        title: 'Look beyond the label',
        paragraphs: [
          '“Natural” and “organic” can mean different things from one product to another. Read the full ingredient list, check that the product is intended for your skin type, and look for clear information about how and when to use it.',
          'A cleanser should remove everyday dirt, sunscreen, and excess oil without leaving your skin feeling tight or uncomfortable. A high price or a long ingredient list alone does not tell you whether a formula is right for you.',
        ],
      },
      {
        title: 'Keep cleansing gentle',
        paragraphs: [
          'Use lukewarm water and a small amount of cleanser, then massage it over damp skin with clean fingertips. Rinse thoroughly and pat dry rather than rubbing. Follow the directions on the product label, especially for products with specific use instructions.',
          'For most routines, cleansing once or twice daily is enough. If your skin feels dry or irritated, reduce friction and frequency, and review the products you are using.',
        ],
      },
      {
        title: 'Build a simple routine',
        paragraphs: [
          'After cleansing, apply products that suit your skin and finish with sunscreen during the day. Introduce new products one at a time so you can notice how your skin responds. Patch testing can help identify a reaction before you use a new product more widely.',
          'Botanical ingredients can still cause sensitivity. Stop using a product if irritation develops, and seek advice from a qualified healthcare professional for persistent or severe symptoms.',
        ],
      },
    ],
  },
  {
    slug: 'science-of-sulfate-free-luxury-herbal-shampoos',
    title: 'The Science of Sulfate-Free Luxury Herbal Shampoos',
    description:
      'Understand how sulfate-free shampoos cleanse, what to consider when choosing a hair wash, and how to care for your scalp and lengths.',
    category: 'Haircare',
    readTime: '5 min read',
    icon: Leaf,
    sections: [
      {
        title: 'What “sulfate-free” means',
        paragraphs: [
          'Sulfates are a family of cleansing ingredients used in many shampoos. A sulfate-free formula uses other cleansing agents instead; it may produce less foam, but foam is not a reliable measure of how well a shampoo cleans.',
          'Different formulas suit different hair and scalp needs. Consider how often you wash, whether your scalp tends to feel oily or dry, and whether your hair is treated or especially fragile.',
        ],
      },
      {
        title: 'Wash the scalp, care for the lengths',
        paragraphs: [
          'Wet your hair thoroughly and work shampoo gently into the scalp with your fingertips. Let the rinse carry product through the lengths instead of piling or scrubbing them. Use conditioner where your hair needs it and follow the product label.',
          'If you use styling products or have a particularly oily scalp, your preferred cleansing routine may differ. Adjust gradually and avoid aggressive scrubbing, which can leave the scalp uncomfortable.',
        ],
      },
      {
        title: 'Choose a routine that works for you',
        paragraphs: [
          'Herbal extracts and oils can be part of a shampoo formula, but “herbal” does not guarantee that a product will suit everyone. Review the ingredients, follow usage directions, and discontinue use if you experience irritation.',
          'A gentle routine is individual: washing frequency, water temperature, and conditioning needs vary by person. If scalp concerns persist, consult a qualified healthcare professional.',
        ],
      },
    ],
  },
];

function GuideCard({ guide }) {
  const Icon = guide.icon;

  return (
    <article className="flex flex-col rounded-2xl border border-[#d4af37]/25 bg-[#0d1520] p-6 shadow-lg transition hover:border-[#d4af37]/60">
      <div className="flex items-center gap-3 text-[#fce096]">
        <span className="rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-3">
          <Icon size={20} aria-hidden="true" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{guide.category}</span>
      </div>
      <h2 className="mt-5 font-serif text-2xl text-white">{guide.title}</h2>
      <p className="mt-3 flex-1 text-sm leading-7 text-[#cbd5e1]">{guide.description}</p>
      <div className="mt-5 flex items-center justify-between border-t border-[#d4af37]/15 pt-4 text-xs text-[#94a3b8]">
        <span>{guide.readTime}</span>
        <Link
          to={`/guides/${guide.slug}`}
          className="inline-flex items-center gap-2 font-semibold text-[#fce096] hover:text-white"
        >
          Read guide <ArrowRight size={14} aria-hidden="true" />
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
        <article className="mx-auto max-w-3xl">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#fce096] hover:text-white"
          >
            <ArrowLeft size={14} aria-hidden="true" /> All guides
          </Link>
          <p className="mt-10 font-sub-gold text-[10px] uppercase tracking-[0.22em]">
            {guide.category} · {guide.readTime}
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-white sm:text-5xl">{guide.title}</h1>
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
          <div className="mt-12 flex flex-wrap gap-4 border-t border-[#d4af37]/20 pt-7">
            <Link
              to="/shop"
              className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider text-white"
            >
              Explore the collection <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link
              to="/science"
              className="inline-flex items-center gap-2 rounded-xl border border-[#d4af37]/30 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#cbd5e1] hover:text-white"
            >
              <BookOpen size={14} aria-hidden="true" /> Botanical science
            </Link>
          </div>
        </article>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070a0e] px-6 py-16 text-[#e2e8f0] sm:py-24">
      <SEO
        title="Botanical Skincare & Haircare Guides | Bhumivera"
        description="Explore practical guides to gentle botanical skincare, face wash, and sulfate-free herbal haircare from Bhumivera."
        route="/guides"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Guides', url: '/guides' },
        ]}
      />
      <header className="mx-auto mb-12 max-w-4xl text-center">
        <p className="font-sub-gold text-[10px] uppercase tracking-[0.24em]">The Bhumivera Journal</p>
        <h1 className="mt-4 font-serif text-4xl text-white sm:text-6xl">
          <span className="font-headline-gold">Botanical Care</span>{' '}
          <span className="font-headline-silver">Guides</span>
        </h1>
        <div className="gold-hairline mx-auto my-5 max-w-xs" />
        <p className="mx-auto max-w-2xl text-sm leading-7 text-[#cbd5e1]">
          Clear, practical reading to help you understand your personal-care routine and choose products thoughtfully.
        </p>
      </header>
      <section aria-label="Care guides" className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        {GUIDES.map((item) => <GuideCard key={item.slug} guide={item} />)}
      </section>
    </main>
  );
}
