import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Droplets,
  Leaf,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import SEO from '../components/SEO';
import { categories as categoriesApi, products as productsApi, reviews as reviewsApi } from '../services/api';

const IMAGE_BASE = import.meta.env.VITE_R2_PUBLIC_URL || import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-22cd43cce9bc475680ad496e199706c4.r2.dev';

const productImage = product => {
  const source = product?.images?.[0] || product?.image_url || product?.image;
  if (!source) return '/logo.webp';
  const path = typeof source === 'object' ? source.url || source.file_path || source.path : source;
  if (!path) return '/logo.webp';
  return /^https?:\/\//i.test(path) ? path : `${IMAGE_BASE.replace(/\/$/, '')}/${String(path).replace(/^\//, '')}`;
};

const price = product => Number(product.discount_price || product.price || 0).toLocaleString('en-IN');
const image = name => `/assets/images/${name}`;

const ingredientStories = [
  {
    name: 'Sea buckthorn',
    note: 'A vivid botanical with a story all its own.',
    image: 'seabuckthorn nature.webp',
    tone: 'from-[#381d0d]/80',
  },
  {
    name: 'Charcoal',
    note: 'A grounded, elemental presence in the ritual.',
    image: 'charcoal.webp',
    tone: 'from-[#111a15]/90',
  },
  {
    name: 'Tulsi',
    note: 'A familiar botanical, seen with fresh attention.',
    image: 'tulsi.webp',
    tone: 'from-[#172719]/85',
  },
  {
    name: 'Aloe vera',
    note: 'A generous plant, and a thoughtful place to begin.',
    image: 'aloeveradna.webp',
    tone: 'from-[#102019]/85',
  },
];

const campaignStories = [
  {
    image: 'Promo1.webp',
    number: '01',
    title: 'Nature’s precision. Planet first.',
    copy: 'A reminder to look closer: the natural world is intricate, generous and worth treating with care.',
  },
  {
    image: 'Promo2.webp',
    number: '02',
    title: 'Where science meets soil.',
    copy: 'Curiosity helps us understand what goes into a formula—and keep the conversation grounded in nature.',
  },
  {
    image: 'Promo3.webp',
    number: '03',
    title: 'Change, made thoughtfully.',
    copy: 'Better choices are built into everyday life, one considered decision at a time.',
  },
  {
    image: 'Promo4.webp',
    number: '04',
    title: 'Where nature meets logic.',
    copy: 'Botanical inspiration and careful thinking can belong in the same story.',
  },
];

const questions = [
  {
    key: 'ingredients',
    label: 'Ingredients',
    question: 'What is actually inside each formula?',
    answer: 'Every product has its own ingredient list and directions. Explore the product page before choosing; the ingredient stories on this homepage are an introduction to our world, not a claim that every ingredient appears in every formula.',
    link: '/science',
    linkLabel: 'Explore ingredient notes',
  },
  {
    key: 'choosing',
    label: 'Choosing a ritual',
    question: 'Where should I begin?',
    answer: 'Begin with the product that fits a routine you already enjoy. Read its details, check current availability, and add one considered step at a time. There is no need to build a complicated routine.',
    link: '/shop',
    linkLabel: 'Browse the collection',
  },
  {
    key: 'orders',
    label: 'Orders',
    question: 'Where can I follow an order?',
    answer: 'Use your order reference on the order-tracking page to see the latest fulfillment update recorded by our team.',
    link: '/order-tracking',
    linkLabel: 'Track an order',
  },
  {
    key: 'returns',
    label: 'Returns',
    question: 'How do returns work?',
    answer: 'Return eligibility depends on the published policy, order details and product condition. Review the Returns Centre for the current steps before sending an item back.',
    link: '/returns-centre',
    linkLabel: 'Visit the Returns Centre',
  },
  {
    key: 'impact',
    label: 'Our impact',
    question: 'How are checkout contributions recorded?',
    answer: 'An eligible checkout contribution is treated as a pledge first. It is recorded as collected only after delivery and reconciliation; verified field updates are shared in our impact record when evidence is available.',
    link: '/impact',
    linkLabel: 'Explore our impact',
  },
];

export default function PremiumHome() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [customerStories, setCustomerStories] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState('ingredients');
  const heroProduct = products.find(product => /sea.?buckthorn/i.test(product.name)) || products[0];
  const activeFaq = questions.find(question => question.key === activeQuestion) || questions[0];

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      productsApi.getAllActive({ limit: 8 }),
      categoriesApi.getAll(),
    ]).then(([productResult, categoryResult]) => {
      if (!active) return;
      if (productResult.status === 'fulfilled') {
        const response = productResult.value.data;
        const productData = response?.data?.data || response?.data?.products || response?.data || [];
        setProducts(Array.isArray(productData) ? productData.slice(0, 8) : []);
      } else {
        console.error('[HOME_CATALOG_PRODUCTS]', productResult.reason);
      }
      if (categoryResult.status === 'fulfilled') {
        const response = categoryResult.value.data;
        const categoryData = response?.data?.data || response?.data?.categories || response?.data || [];
        setCategories(Array.isArray(categoryData) ? categoryData : []);
      } else {
        console.error('[HOME_CATALOG_CATEGORIES]', categoryResult.reason);
      }
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!products.length) return undefined;
    let active = true;
    Promise.allSettled(products.slice(0, 4).map(product => reviewsApi.getByProduct(product.id)))
      .then(results => {
        if (!active) return;
        const rows = results.flatMap(result => result.status === 'fulfilled'
          ? (result.value.data?.reviews || result.value.data?.data || [])
          : []);
        setApprovedReviews(rows.filter(review => Number(review.is_approved) === 1).slice(0, 4));
      });
    return () => { active = false; };
  }, [products]);

  useEffect(() => {
    let active = true;
    reviewsApi.getPublicStories()
      .then(({ data }) => {
        if (active) setCustomerStories(Array.isArray(data?.stories) ? data.stories : []);
      })
      .catch(error => {
        console.error('[HOME_CUSTOMER_STORIES]', error);
        if (active) setCustomerStories([]);
      });
    return () => { active = false; };
  }, []);

  const goToQuestion = direction => {
    const currentIndex = questions.findIndex(question => question.key === activeQuestion);
    const nextIndex = (currentIndex + direction + questions.length) % questions.length;
    setActiveQuestion(questions[nextIndex].key);
  };

  return (
    <main className="overflow-hidden bg-[#f4f1e9] text-[#1b2921]">
      <SEO
        title="Bhumivera | Botanical rituals, considered in every detail"
        description="Explore Bhumivera's botanical stories, modern skincare ingredients and considered everyday rituals."
        keywords="Bhumivera, botanical skincare, sea buckthorn, charcoal, niacinamide, hyaluronic acid, skincare rituals"
        ogImage="/assets/images/seabuckthorn.webp"
        route="/"
      />

      <section className="relative isolate flex min-h-[min(760px,calc(100svh_-_72px))] items-end overflow-hidden bg-[#16231c] text-white lg:min-h-[min(800px,calc(100svh_-_110px))] lg:items-center">
        <img
          src={image('seabuckthorn.webp')}
          alt="Bhumivera sea-buckthorn face wash among sea-buckthorn berries"
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[45%_center] sm:object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#101811]/95 via-[#101811]/72 to-[#101811]/20 lg:bg-gradient-to-r lg:from-[#101811]/90 lg:via-[#101811]/65 lg:to-[#101811]/10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101811]/65 via-[#101811]/30 to-transparent lg:hidden" />
        <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-28 sm:px-8 sm:pb-12 sm:pt-32 lg:px-10 lg:pb-24 lg:pt-28">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="relative isolate max-w-3xl before:absolute before:inset-y-[-12px] before:-left-5 before:-right-5 before:-z-10 before:bg-gradient-to-r before:from-[#101811]/75 before:via-[#101811]/45 before:to-transparent before:content-[''] sm:before:hidden"
          >
            <p className="mb-5 inline-flex items-center gap-2 border border-white/25 bg-black/10 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#e1e8ce] backdrop-blur-sm sm:mb-6 sm:text-[10px] sm:tracking-[0.24em]">
              <Sparkles size={13} /> A story that begins with the earth
            </p>
            <h1 className="max-w-2xl font-serif text-[clamp(2.8rem,11.5vw,4.75rem)] leading-[0.96] tracking-[-0.045em] lg:text-[clamp(4.5rem,6vw,6.5rem)]">
              <span className="sm:hidden">Rooted in nature.<br />Made with care.</span>
              <span className="hidden sm:inline">Rooted in nature. Made for your everyday.</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-white/80 sm:mt-6 sm:text-base sm:leading-7">
              From botanicals shaped by the natural world to the care we choose to give it, discover a more considered way to make your everyday ritual your own.
            </p>
            <div className="mt-6 flex flex-col gap-3 min-[380px]:flex-row sm:mt-8">
              <Link to="/shop" className="group inline-flex min-h-12 w-full items-center justify-center gap-2 whitespace-nowrap bg-[#e0e8ce] px-3 py-3 text-xs font-semibold text-[#19271e] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white min-[380px]:w-auto sm:gap-3 sm:px-5 sm:text-sm">
                Discover the collection <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/about" className="inline-flex min-h-12 w-full items-center justify-center gap-2 whitespace-nowrap border border-white/45 bg-white/[0.04] px-3 py-3 text-xs font-semibold text-white transition-colors hover:bg-white/10 min-[380px]:w-auto sm:gap-3 sm:px-5 sm:text-sm">
                Our story <ArrowUpRight size={16} />
              </Link>
            </div>
          </Motion.div>
          <div className="mt-8 flex items-end justify-between gap-3 border-t border-white/25 pt-3 sm:mt-10 sm:pt-4 lg:absolute lg:bottom-9 lg:left-1/2 lg:mt-0 lg:w-[min(88%,1280px)] lg:-translate-x-1/2">
            <span className="max-w-[65%] text-[8px] font-semibold uppercase leading-4 tracking-[0.14em] text-white/65 sm:max-w-none sm:text-[10px] sm:tracking-[0.18em]">Botanical heritage · contemporary skin science</span>
            {heroProduct && <Link to={`/product/${heroProduct.slug || heroProduct.id}`} className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#e0e8ce] sm:inline-flex">In focus: {heroProduct.name} <ArrowRight size={13} /></Link>}
            <a href="#roots" aria-label="Scroll to the tree-planting story" className="inline-flex shrink-0 items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-white/65 sm:text-[9px] sm:tracking-[0.18em] lg:hidden">Scroll <ArrowDown size={13} /></a>
          </div>
        </div>
      </section>

      <section id="roots" className="bg-[#f4f1e9] px-4 py-5 text-[#1b2921] sm:px-8 sm:py-10 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-2xl bg-[#e7e9de] md:grid-cols-[0.95fr_1.05fr]">
          <div className="order-2 flex flex-col justify-center px-5 py-6 sm:px-8 sm:py-8 md:order-1 md:px-8 md:py-8 lg:px-12 lg:py-10 xl:px-16">
            <p className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#56684d] sm:text-[10px] sm:tracking-[0.24em]"><Leaf size={14} /> Care, returned to the earth</p>
            <h2 className="mt-3 max-w-xl font-serif text-3xl leading-[1.06] tracking-[-0.025em] sm:mt-4 sm:text-4xl lg:text-5xl xl:text-6xl">A future worth growing, one tree at a time.</h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-[#53604e] sm:mt-5 sm:text-base sm:leading-7">
              Our planting vision starts with locally chosen trees and care that continues beyond planting day. We believe the work should be guided by local knowledge and shared through updates you can verify.
            </p>
            <p className="mt-3 max-w-lg text-xs leading-5 text-[#65705f] sm:mt-4 sm:leading-6">
              A future direction—not a claim of completed planting.
            </p>
            <Link to="/impact" className="mt-4 inline-flex min-h-11 w-fit items-center gap-3 border-b border-[#536b4d]/40 pb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#354933] sm:mt-5 sm:text-xs sm:tracking-[0.14em]">
              Explore our impact record <ArrowRight size={15} />
            </Link>
          </div>
          <div className="relative order-1 aspect-[16/10] overflow-hidden bg-[#26392c] sm:aspect-[16/9] md:order-2 md:aspect-auto md:min-h-[390px] lg:min-h-[440px]">
            <img src={image('plant tree.webp')} alt="Illustrative vision of people planting a young tree together, not a verified Bhumivera field report" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101811]/65 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-3 bg-[#101811]/75 px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#e1e8ce] backdrop-blur-sm sm:bottom-5 sm:left-5 sm:px-3 sm:py-2 sm:text-[9px] sm:tracking-[0.16em]">A planting vision · illustrative artwork</span>
          </div>
        </div>
      </section>

      <section id="story" className="mx-auto grid max-w-7xl gap-5 px-5 py-10 sm:gap-8 sm:px-8 sm:py-14 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16 lg:px-10 lg:py-20">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#687958]">The Bhumivera point of view</p>
          <p className="mt-3 font-serif text-3xl leading-tight sm:mt-4 sm:text-4xl">Care should feel like coming back to yourself.</p>
        </div>
        <div className="max-w-3xl">
          <p className="font-serif text-2xl leading-snug text-[#26352b] sm:text-3xl lg:text-4xl">
            We begin with the living world, then bring curiosity to every detail.
          </p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            Aloe vera, tulsi, charcoal and sea buckthorn each bring a different character to our story. We pair that botanical curiosity with contemporary skin care knowledge—without louder promises or more steps than you need.
          </p>
          <Link to="/about" className="mt-6 inline-flex items-center gap-2 border-b border-[#667956]/50 pb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#354933] hover:border-[#354933]">
            Read the Bhumivera story <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className="bg-[#e7e4d9] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#687958]">A living ingredient palette</p>
              <h2 className="mt-3 max-w-2xl font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">Nature has more than one note.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-stone-600">Meet the botanicals that inspire us—and the contemporary actives shaping the next chapter of skin care.</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {ingredientStories.map((story, index) => (
              <article key={story.name} className="group relative isolate aspect-[3/4] min-h-[205px] overflow-hidden bg-[#26352b] text-white sm:aspect-auto sm:min-h-[330px] lg:min-h-[400px]">
                <img src={image(story.image)} alt={`${story.name} ingredient story`} loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                <div className={`absolute inset-0 -z-10 bg-gradient-to-t ${story.tone} via-[#101811]/15 to-transparent`} />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 lg:p-6">
                  <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#e0e8ce] sm:text-[9px] sm:tracking-[0.2em]">Ingredient story · 0{index + 1}</span>
                  <h3 className="mt-1.5 font-serif text-xl sm:mt-2 sm:text-3xl">{story.name}</h3>
                  <p className="mt-1.5 max-w-xs text-[11px] leading-4 text-white/80 sm:mt-2 sm:text-sm sm:leading-5">{story.note}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#17231d] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-7 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:px-10 lg:py-20">
          <div className="relative order-2 overflow-hidden bg-[#e8e5d9] lg:order-1">
            <img src={image('niacidamine.webp')} alt="Niacinamide and hyaluronic acid, two contemporary skincare actives" loading="lazy" className="aspect-[16/9] w-full object-contain" />
            <span className="absolute bottom-3 left-3 bg-[#f4f1e9]/90 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#28382b] backdrop-blur-sm sm:bottom-5 sm:left-5">Modern actives, thoughtfully considered</span>
          </div>
          <div className="order-1 lg:order-2">
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#dce7c5]"><Droplets size={14} /> The modern ingredient edit</p>
            <h2 className="mt-3 font-serif text-3xl leading-[1.05] sm:mt-4 sm:text-4xl lg:text-5xl">Two names shaping today’s skin conversation.</h2>
            <div className="mt-5 grid gap-4 border-t border-white/20 pt-4 sm:mt-7 sm:grid-cols-2 sm:gap-5 sm:pt-5">
              <div>
                <h3 className="font-serif text-2xl text-[#e3e9d5]">Niacinamide</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">A much-loved modern active, often explored in routines focused on the look of tone and the feel of the skin barrier.</p>
              </div>
              <div>
                <h3 className="font-serif text-2xl text-[#e3e9d5]">Hyaluronic acid</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">A familiar hydration-focused ingredient, valued for the supple, comfortable feel it can bring to a routine.</p>
              </div>
            </div>
            <p className="mt-5 text-xs leading-5 text-white/50">Ingredient presence and directions vary by product. Always check the individual product page and label.</p>
            <Link to="/science" className="mt-6 inline-flex items-center gap-2 border-b border-[#dce7c5]/50 pb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#e3e9d5] hover:border-white">
              Explore the ingredient notes <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="border-b border-[#26392c]/15 bg-[#f4f1e9]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-3 px-5 py-5 sm:px-8 md:px-10">
            <span className="mr-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#77816d]">Explore by ritual</span>
            {categories.slice(0, 5).map(category => <Link key={category.id} to={`/shop?category=${category.id}`} className="text-xs text-[#334632] underline decoration-[#536b4d]/30 underline-offset-4 hover:decoration-[#253b2f]">{category.name}</Link>)}
          </div>
        </section>
      )}

      <section id="collection" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[#253b2f]/15 pb-5 sm:mb-10 sm:gap-5 sm:pb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#687958]">The considered collection</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl">Find your daily ritual.</h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 pb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#354933]">View all <ArrowRight size={15} /></Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{[0, 1, 2, 3].map(item => <div key={item} className="aspect-[4/5] animate-pulse bg-[#e8e5dc]" />)}</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {products.slice(0, 8).map((product, index) => (
              <Motion.article key={product.id || product._id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (index % 4) * 0.06 }} className="group min-w-0">
                <Link to={`/product/${product.slug || product.id}`} className="relative block overflow-hidden bg-[#e8e5dc]">
                  <img src={productImage(product)} alt={product.name} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" onError={event => { event.currentTarget.src = '/logo.webp'; }} />
                  <span className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center bg-[#f4f1e9]/90 text-[#24352a] transition-colors group-hover:bg-[#dce7c5] sm:bottom-3 sm:right-3"><ArrowUpRight size={16} /></span>
                </Link>
                <div className="flex flex-col gap-1 border-b border-[#253b2f]/15 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3 sm:py-4">
                  <div className="min-w-0"><p className="truncate text-[8px] font-semibold uppercase tracking-[0.15em] text-[#71806a] sm:text-[10px]">{product.category_name || 'Bhumivera ritual'}</p><h3 className="mt-1 line-clamp-2 font-serif text-base leading-snug sm:text-xl">{product.name}</h3></div>
                  <span className="text-xs font-semibold sm:shrink-0 sm:pt-4 sm:text-sm">₹{price(product)}</span>
                </div>
                <Link to={`/product/${product.slug || product.id}`} className="mt-3 inline-flex min-h-8 items-center gap-2 text-[9px] font-bold uppercase tracking-[0.13em] text-[#3d553b] sm:text-[10px]">Discover details <ArrowRight size={13} /></Link>
              </Motion.article>
            ))}
          </div>
        ) : (
          <div className="border-y border-[#253b2f]/15 py-10 sm:py-14">
            <p className="font-serif text-2xl sm:text-3xl">A collection worth taking your time with.</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">The live collection is being refreshed. Visit the shop to see current product availability.</p>
            <Link to="/shop" className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#354933]">Visit the shop <ArrowRight size={14} /></Link>
          </div>
        )}
      </section>

      <section className="bg-[#e7e4d9] px-4 py-8 text-[#1b2921] sm:px-8 sm:py-12 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-2xl bg-[#dce1d2] md:grid-cols-[1fr_1fr]">
          <div className="relative order-1 aspect-[16/10] overflow-hidden bg-[#26392c] md:order-2 md:aspect-auto md:min-h-[420px]">
            <img src={image('river free.webp')} alt="Illustrative scene of people tending a leafy riverbank, not a verified Bhumivera field report" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center" />
            <span className="absolute bottom-3 left-3 bg-[#101811]/75 px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#e1e8ce] backdrop-blur-sm sm:bottom-5 sm:left-5 sm:px-3 sm:py-2 sm:text-[9px] sm:tracking-[0.16em]">A vision of care for land and water · illustrative image</span>
          </div>
          <div className="order-2 flex flex-col justify-center px-5 py-7 sm:px-8 sm:py-9 md:order-1 lg:px-12 lg:py-12 xl:px-16">
            <p className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#56684d] sm:text-[10px] sm:tracking-[0.24em]"><Leaf size={14} /> A closer kind of care</p>
            <h2 className="mt-3 max-w-xl font-serif text-3xl leading-[1.06] tracking-[-0.025em] sm:mt-4 sm:text-4xl lg:text-5xl">Care is a relationship with the living world.</h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-[#53604e] sm:mt-5 sm:text-base sm:leading-7">
              From the soil beneath our feet to the water that gives life, nature is not a backdrop to what we do. It is the source of our inspiration—and a responsibility we want to meet with respect.
            </p>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#53604e] sm:mt-4">
              It shapes how we think about botanicals, the rituals we make room for, and the kind of future we hope to help grow.
            </p>
            <Link to="/about" className="mt-5 inline-flex min-h-11 w-fit items-center gap-3 border-b border-[#536b4d]/40 pb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#354933] sm:mt-6 sm:text-xs sm:tracking-[0.14em]">
              Get to know our story <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#e7e4d9] text-[#1b2921]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="mb-7 grid gap-4 border-b border-[#26392c]/20 pb-5 lg:mb-10 lg:grid-cols-[1fr_0.65fr] lg:items-end lg:pb-9">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#687958]">A Bhumivera visual story</p>
              <h2 className="mt-3 max-w-2xl font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">Four notes on care.</h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-stone-600 sm:text-base">From the intelligence of nature to the choices we make each day, these campaign frames share one thought: care is most beautiful when it is considered.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
            {campaignStories.map(story => (
              <article key={story.number} className="group grid min-h-[220px] grid-cols-[minmax(112px,0.72fr)_1fr] overflow-hidden border border-[#26392c]/15 bg-[#f4f1e9] sm:min-h-[340px] sm:grid-cols-[minmax(170px,0.78fr)_1fr]">
                <div className="relative overflow-hidden bg-[#17231d]">
                  <img src={image(story.image)} alt={`${story.title} — Bhumivera campaign artwork`} loading="lazy" className="h-full min-h-[270px] w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.025] sm:min-h-[340px]" />
                  <span className="absolute left-2 top-2 bg-[#111c17]/85 px-2 py-1.5 font-mono text-[9px] tracking-[0.12em] text-[#e1e8ce] sm:left-3 sm:top-3 sm:px-3 sm:text-[10px]">{story.number} / 04</span>
                </div>
                <div className="flex flex-col justify-center p-3 sm:p-6 lg:p-8">
                  <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#77816d] sm:text-[9px] sm:tracking-[0.2em]">A note on care</span>
                  <h3 className="mt-2 font-serif text-lg leading-tight sm:mt-3 sm:text-2xl lg:text-3xl">{story.title}</h3>
                  <p className="mt-2 text-[11px] leading-4 text-stone-600 sm:mt-4 sm:text-sm sm:leading-6">{story.copy}</p>
                  <span className="mt-5 h-px w-10 bg-[#879477] sm:mt-7" aria-hidden="true" />
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 text-[10px] leading-5 text-stone-500">Campaign artwork and brand perspective; not a record of completed field activity.</p>
        </div>
      </section>

      {approvedReviews.length > 0 && (
        <section className="bg-[#e7e4d9]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:px-10 md:py-20">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#687958]">Notes from our community</p><h2 className="mt-3 font-serif text-4xl sm:text-5xl">Shared, in their own words.</h2></div>
              <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold text-[#354933]">Explore products <ArrowRight size={14} /></Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {approvedReviews.map((review, index) => (
                <blockquote key={review.id || index} className="border-t border-[#253b2f]/25 py-5 sm:py-6">
                  <div className="text-xs tracking-[0.2em] text-[#78875f]" aria-label={`${review.rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map(star => <span key={star}>{Number(review.rating) >= star ? '★' : '☆'}</span>)}</div>
                  <p className="mt-4 font-serif text-xl leading-relaxed sm:text-2xl">“{review.body || review.comment}”</p>
                  <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#71806a]">{review.user_name || 'Bhumivera customer'}{review.product_name ? ` · ${review.product_name}` : ''}</p>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {customerStories.length > 0 && (
        <section className="bg-[#19261e] text-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:px-10 md:py-24">
            <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#dce7c5]">Our community, by choice</p><h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">The people who make this story their own.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-white/65">These customer photos and words are shared with permission and shown only after the review is approved.</p></div>
              <Link to="/impact" className="inline-flex min-h-11 items-center gap-2 border-b border-[#dce7c5]/40 pb-1 text-xs font-semibold text-[#e0e8ce]">See our verified impact record <ArrowRight size={14}/></Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {customerStories.slice(0, 3).map((story, index) => (
                <article key={story.id} className={`overflow-hidden rounded-2xl border border-white/10 bg-[#223229] ${index === 0 ? 'md:col-span-2 md:grid md:grid-cols-[1fr_1fr]' : ''}`}>
                  <Link to={`/product/${story.product_id || ''}`} aria-label={`Read ${story.product_name || 'product'} details`} className="block aspect-[4/3] overflow-hidden bg-[#314238] md:aspect-auto">
                    <img src={productImage({ image_url: story.images?.[0] })} alt={`${story.first_name || 'Customer'} with a Bhumivera product`} loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/logo.webp'; }} className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]"/>
                  </Link>
                  <div className="flex flex-col justify-center p-5 sm:p-7">
                    <div className="text-sm tracking-[0.16em] text-[#d6dfbf]" aria-label={`${story.rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map(star => <span key={star}>{Number(story.rating) >= star ? '★' : '☆'}</span>)}</div>
                    {story.body && <blockquote className="mt-4 line-clamp-5 font-serif text-xl leading-relaxed text-white/90">“{story.body}”</blockquote>}
                    {story.title && <p className="mt-3 text-xs font-semibold text-[#e0e8ce]">{story.title}</p>}
                    <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.17em] text-white/55">Shared by {story.first_name || 'a customer'} · Approved review</p>
                    {story.product_name && <p className="mt-1 text-xs text-white/70">{story.product_name}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative isolate overflow-hidden bg-[#17231d] text-white">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#111a14] via-[#111a14] to-[#26352b]" />
        <div className="mx-auto grid max-w-7xl gap-9 px-5 py-14 sm:px-8 md:grid-cols-[1fr_auto] md:items-end md:px-10 md:py-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#dce7c5]">A more personal kind of help</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">A question deserves a considered answer.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">Explore the topics that matter to you, one answer at a time. For anything more personal, our team is here to help.</p>
          </div>
          <Link to="/contact" className="inline-flex min-h-12 w-fit items-center gap-3 bg-[#dce7c5] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#19271e] transition-colors hover:bg-white">Speak with our team <ArrowRight size={15} /></Link>
        </div>
      </section>

      <section className="bg-[#f4f1e9]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:px-10 md:py-20">
          <div className="mb-8 grid gap-4 sm:mb-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#687958]">The considered answer</p><h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">Good to know.</h2></div>
            <p className="max-w-lg text-sm leading-6 text-stone-600">Choose a topic to reveal its answer. No wall of questions—just the details you came for.</p>
          </div>
          <div className="grid overflow-hidden border border-[#26392c]/15 bg-[#eeece3] md:grid-cols-[0.7fr_1.3fr]">
            <div role="tablist" aria-label="Help topics" className="flex gap-2 overflow-x-auto border-b border-[#26392c]/15 p-3 [scrollbar-width:none] md:flex-col md:gap-1 md:border-b-0 md:border-r md:p-5">
              {questions.map((question, index) => (
                <button key={question.key} type="button" role="tab" id={`faq-tab-${question.key}`} aria-selected={activeQuestion === question.key} aria-controls="faq-panel" onClick={() => setActiveQuestion(question.key)} className={`flex min-h-11 shrink-0 items-center gap-3 px-3 text-left text-xs font-semibold transition-colors md:w-full md:py-3 ${activeQuestion === question.key ? 'bg-[#213329] text-[#e0e8ce]' : 'text-[#576451] hover:bg-white/70 hover:text-[#1c2922]'}`}>
                  <span className={`font-mono text-[9px] ${activeQuestion === question.key ? 'text-[#d0dcba]' : 'text-[#8a927e]'}`}>0{index + 1}</span>{question.label}
                </button>
              ))}
            </div>
            <div id="faq-panel" role="tabpanel" aria-labelledby={`faq-tab-${activeFaq.key}`} className="flex min-h-[300px] flex-col justify-between p-5 sm:p-8 md:min-h-[360px] md:p-10">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#77816d]">{activeFaq.label} · Bhumivera care</span>
                <h3 className="mt-5 max-w-2xl font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">{activeFaq.question}</h3>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600">{activeFaq.answer}</p>
                <Link to={activeFaq.link} className="mt-5 inline-flex min-h-10 items-center gap-2 border-b border-[#536b4d]/40 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#354933]">{activeFaq.linkLabel} <ArrowRight size={14} /></Link>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-[#26392c]/15 pt-4">
                <span className="font-mono text-[10px] tracking-[0.15em] text-[#7c8673]">0{questions.findIndex(question => question.key === activeQuestion) + 1} <span className="mx-1 text-[#b0b2a6]">/</span> 0{questions.length}</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => goToQuestion(-1)} aria-label="Previous help topic" className="grid h-10 w-10 place-items-center border border-[#26392c]/20 text-[#354933] transition-colors hover:bg-white"><ArrowLeft size={15} /></button>
                  <button type="button" onClick={() => goToQuestion(1)} aria-label="Next help topic" className="grid h-10 w-10 place-items-center bg-[#213329] text-white transition-colors hover:bg-[#354933]"><ArrowRight size={15} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#26392c]/15 bg-[#e7e4d9]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-12">
          <div className="flex items-start gap-4"><span className="mt-1 text-[#667956]"><Leaf size={18} /></span><div><p className="font-serif text-2xl">Care, returned to its source.</p><p className="mt-1 text-xs leading-5 text-stone-600">A considered ritual. A clear choice. A little more room to be yourself.</p></div></div>
          <Link to="/impact" className="inline-flex min-h-11 w-fit items-center gap-2 border-b border-[#536b4d]/40 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#354933]">Visit our impact page <ArrowRight size={14} /></Link>
        </div>
      </section>
    </main>
  );
}
