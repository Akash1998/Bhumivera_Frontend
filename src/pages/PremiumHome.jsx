import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Leaf, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Quote } from 'lucide-react';
import SEO from '../components/SEO';
import { categories as categoriesApi, products as productsApi, reviews as reviewsApi } from '../services/api';

const IMAGE_BASE = import.meta.env.VITE_R2_PUBLIC_URL || import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-22cd43cce9bc475680ad496e199706c4.r2.dev';

const productImage = product => {
  const source = product?.images?.[0] || product?.image_url || product?.image;
  if (!source) return '/assets/images/aloeverabeaker.webp';
  const path = typeof source === 'object' ? source.url || source.file_path || source.path : source;
  if (!path) return '/assets/images/aloeverabeaker.webp';
  return /^https?:\/\//i.test(path) ? path : `${IMAGE_BASE.replace(/\/$/, '')}/${String(path).replace(/^\//, '')}`;
};

const price = product => Number(product.discount_price || product.price || 0).toLocaleString('en-IN');

const questions = [
  ['Where should I begin?', 'Start with the product that fits the ritual you already have. Open its product page for the current description, ingredients, price and availability. There is no need to buy a full routine at once.'],
  ['What is currently available?', 'Availability is determined by the live collection. If a product is not listed there, it is not currently available to order.'],
  ['Is Aloe Vera Face Wash available?', 'When it is in stock, Aloe Vera Face Wash appears in the live collection with current price and stock shown on its product page.'],
  ['Are charcoal products available now?', 'Check the collection for current active products. We do not mark a charcoal product available until it has a live catalog listing.'],
  ['When will sea-buckthorn face wash arrive?', 'Sea-buckthorn face care is part of the collection we are developing. We will publish it with full product details when it is ready to order.'],
  ['Are hair oil and shampoo available?', 'Hair oil and shampoo are upcoming. They will appear in the hair-care collection once the products are ready and listed.'],
  ['How should I use a product?', 'Follow the directions and ingredient information on that specific product page and its packaging. If you have a skin or scalp condition, ask a qualified clinician before changing your routine.'],
  ['Where can I see product ingredients?', 'Open the product detail page and review its published description and specifications. If a detail is not published, contact our support team before purchasing.'],
  ['How do I know if something suits me?', 'Skin and hair vary. Review the product information, patch-test new products according to their packaging, and stop using a product if irritation occurs.'],
  ['Can I add a contribution to my order?', 'A contribution is optional and currently available on cash-on-delivery checkout only. The available amounts and focus areas are shown before you place your order.'],
  ['When is my contribution counted?', 'It begins as a pledge. It is counted as collected only after delivery and manual collection reconciliation. The public impact ledger shows the reconciled total.'],
  ['Can I receive a charitable tax receipt?', 'The current checkout contribution is tracked in Bhumivera’s internal field ledger. It is not presented as a tax-deductible charitable donation or issued by a named nonprofit.'],
  ['How will I see what the contribution supported?', 'Verified field updates, when work has taken place and evidence is available, are published in the public impact ledger with a date and photo or video.'],
  ['How do I track an order?', 'Use Track Order in the navigation or view your order history after signing in. The page reflects the latest fulfillment status recorded by the team.'],
  ['Who can help with an order or product question?', 'Visit Help & Support and include your order reference where relevant. That helps the team find the right record.'],
  ['Can I return a purchase?', 'Review the current Returns Centre and the terms shown for your order. Eligibility depends on the published policy and product condition.'],
];

export default function PremiumHome() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const heroProduct = products[0];
  const aloeProduct = products.find(product => /aloe/i.test(product.name)) || heroProduct;
  const charcoalProduct = products.find(product => /charcoal/i.test(product.name));
  const seaBuckthornProduct = products.find(product => /sea.?buckthorn/i.test(product.name));
  const hairProducts = products.filter(product => /hair|shampoo|scalp/i.test(`${product.name} ${product.category_name || ''}`));

  useEffect(() => {
    let active = true;
    Promise.all([
      productsApi.getAllActive({ limit: 8 }),
      categoriesApi.getAll(),
    ]).then(([productResponse, categoryResponse]) => {
      if (!active) return;
      const productData = productResponse.data?.data || productResponse.data?.products || productResponse.data || [];
      const categoryData = categoryResponse.data?.data || categoryResponse.data?.categories || categoryResponse.data || [];
      setProducts(Array.isArray(productData) ? productData.slice(0, 8) : []);
      setCategories(Array.isArray(categoryData) ? categoryData : []);
    }).catch(error => {
      console.error('[HOME_CATALOG]', error);
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
        setApprovedReviews(rows.filter(review => Number(review.is_approved) === 1).slice(0, 6));
      });
    return () => { active = false; };
  }, [products]);

  return (
    <main className="bg-[#f4f2eb] text-[#1c2922]">
      <SEO title="Bhumivera | Considered care, closer to nature" description="Explore Bhumivera's aloe vera and charcoal cleansing, sea-buckthorn face care, and hair rituals." route="/" />

      <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-[#14201a] text-white">
        <img src={productImage(heroProduct)} alt={heroProduct ? heroProduct.name : 'Aloe vera botanical preparation'} fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-70" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0b110e]/90 via-[#0b110e]/55 to-transparent" />
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-12 pt-36 md:grid-cols-[1fr_auto] md:items-end md:pb-20">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <p className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d3dfb5]"><Leaf size={14}/> Aloe vera · charcoal · sea buckthorn</p>
            <h1 className="font-serif text-6xl leading-[0.95] sm:text-7xl md:text-8xl">Bhumivera</h1>
            <p className="mt-6 max-w-xl font-serif text-2xl leading-snug text-white/90 md:text-3xl">Care, returned to its source.</p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/75 md:text-base">Thoughtful skin and hair rituals, made for everyday use and explained without the noise.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="inline-flex items-center gap-3 bg-[#dce7c5] px-5 py-3 text-sm font-semibold text-[#17251c] transition-colors hover:bg-white">Explore the collection <ArrowRight size={16}/></Link>
              <Link to="/impact" className="inline-flex items-center gap-3 border border-white/45 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">Our field ledger <ArrowRight size={16}/></Link>
            </div>
          </motion.div>
          {heroProduct && <Link to={`/product/${heroProduct.slug || heroProduct.id}`} className="hidden max-w-56 border-l border-white/35 pl-5 text-sm text-white/80 transition-colors hover:text-white md:block"><span className="block text-[10px] uppercase tracking-[0.2em] text-[#d3dfb5]">In focus</span><span className="mt-2 block font-serif text-xl">{heroProduct.name}</span><span className="mt-1 block">₹{price(heroProduct)}</span></Link>}
        </div>
        <a href="#collection" aria-label="Scroll to collection" className="absolute bottom-6 right-6 hidden items-center gap-2 text-xs uppercase tracking-widest text-white/70 md:flex">Scroll to explore <ArrowDown size={15}/></a>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-[0.7fr_1.3fr] md:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#607552]">A note from Bhumivera</p>
        <blockquote className="max-w-4xl font-serif text-3xl leading-tight md:text-5xl">“The best care feels considered: honest about what it is, gentle in how it speaks, and mindful of what it leaves behind.”</blockquote>
      </section>

      <section className="relative grid overflow-hidden border-y border-[#253b2f]/15 bg-[#e8e6dc] lg:min-h-[680px] lg:grid-cols-2">
        <div className="relative min-h-[360px] overflow-hidden lg:min-h-full">
          <img src="/assets/images/aloeveradna.webp" alt="Aloe vera botanical texture" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18261d]/55 via-transparent to-transparent" />
          <p className="absolute bottom-6 left-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/85">The plant, before the promise.</p>
        </div>
        <div className="flex flex-col justify-center px-6 py-14 md:px-12 lg:px-20">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#607552]">A slower point of view</p>
          <h2 className="mt-5 max-w-xl font-serif text-4xl leading-[1.08] md:text-6xl">“Let the formula speak plainly. Let the ritual feel like yours.”</h2>
          <p className="mt-6 max-w-lg text-sm leading-7 text-stone-600">Bhumivera is moving from a single-soap beginning into a considered skin and hair collection. Aloe vera and charcoal cleansing is here; sea-buckthorn face care and new hair rituals join as each product is ready.</p>
          <Link to="/shop" className="mt-8 inline-flex w-fit items-center gap-3 border-b border-[#35533c]/35 pb-2 text-sm font-semibold text-[#253b2f] hover:border-[#253b2f]">See what is available now <ArrowRight size={16}/></Link>
        </div>
      </section>

      {categories.length > 0 && <section className="border-y border-[#253b2f]/15 bg-[#e9ebdf]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#536b4d]">Explore by ritual</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3">{categories.slice(0, 6).map(category => <Link key={category.id} to={`/shop?category=${category.id}`} className="text-sm text-[#253b2f] underline decoration-[#536b4d]/30 underline-offset-4 hover:decoration-[#253b2f]">{category.name}</Link>)}</div>
        </div>
      </section>}

      <section className="relative isolate min-h-[680px] overflow-hidden bg-[#17231d] text-white md:min-h-[820px]">
        <img src="/assets/images/transformation.webp" alt="Bhumivera's first cleansing ritual, made with a botanical point of view" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0b120e]/90 via-[#0b120e]/15 to-[#0b120e]/20" />
        <div className="mx-auto flex min-h-[680px] max-w-7xl flex-col justify-end px-6 pb-12 md:min-h-[820px] md:pb-20">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#dce7c5]">A beginning, not a boundary</p>
          <h2 className="mt-5 max-w-4xl font-serif text-4xl leading-[1.05] md:text-7xl">From one daily ritual to a more considered collection.</h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/75 md:text-base">Bhumivera began with a simple belief: everyday care can feel thoughtful without becoming complicated. Today, aloe vera cleansing is part of the live collection. New skin and hair rituals will join as each is ready, documented and available to order.</p>
          <div className="mt-8 flex flex-wrap gap-4"><Link to={aloeProduct ? `/product/${aloeProduct.slug || aloeProduct.id}` : '/shop'} className="inline-flex items-center gap-3 bg-[#dce7c5] px-5 py-3 text-sm font-semibold text-[#14201a] hover:bg-white">{aloeProduct ? `Discover ${aloeProduct.name}` : 'Explore the collection'} <ArrowRight size={16}/></Link><Link to="/about" className="inline-flex items-center gap-3 border border-white/50 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Read our story <ArrowRight size={16}/></Link></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mb-12 grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#607552]">A close look at the ritual</p><h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">Texture. Water. A moment to yourself.</h2></div>
          <p className="max-w-2xl text-sm leading-7 text-stone-600">The details of care are small: the feel of a cleanser, the temperature of the water, the minute between one part of the day and the next. We want our products to earn a place in that quiet space, one honest formula at a time.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-12 md:grid-rows-[260px_260px]">
          <figure className="group relative min-h-[320px] overflow-hidden md:col-span-7 md:row-span-2 md:min-h-0"><img src="/assets/images/aloeveradna.webp" alt="Aloe vera leaf surface in morning light" loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.035]"/><figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101a17]/80 to-transparent p-6 pt-20"><span className="text-xs font-bold uppercase tracking-[0.18em] text-[#dce7c5]">01 · The botanical</span><p className="mt-2 max-w-lg font-serif text-2xl text-white">Begin with what the product actually contains.</p></figcaption></figure>
          <figure className="group relative min-h-[260px] overflow-hidden md:col-span-5 md:min-h-0"><img src="/assets/images/aloeveradrop.webp" alt="A drop of aloe vera preparation" loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.035]"/><figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101a17]/80 to-transparent p-5 pt-16"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#dce7c5]">02 · The practice</span><p className="mt-1 font-serif text-xl text-white">Use it as directed. Leave room for your own rhythm.</p></figcaption></figure>
          <figure className="group relative min-h-[260px] overflow-hidden md:col-span-5 md:min-h-0"><img src="/assets/images/aloeverascience.webp" alt="A botanical research and ingredient study" loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.035]"/><figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101a17]/80 to-transparent p-5 pt-16"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#dce7c5]">03 · The standard</span><p className="mt-1 font-serif text-xl text-white">If a detail is not published, ask us before you buy.</p></figcaption></figure>
        </div>
      </section>

      <section className="border-y border-[#253b2f]/15 bg-[#e8e6dc]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="mb-12 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#607552]">A range in the making</p><h2 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">Different needs deserve different thought.</h2><p className="mt-5 text-sm leading-7 text-stone-600">We are not turning one product into a promise for everyone. Each ritual earns its place with its own listing, clear details and current availability.</p></div>
          <div className="grid gap-px border-y border-[#253b2f]/20 bg-[#253b2f]/20 md:grid-cols-2">
            {[
              { key: 'face', label: 'Skin · available now', title: aloeProduct?.name || 'Aloe vera cleansing', copy: aloeProduct ? 'This product is listed in the live collection. Visit its page for current pricing, stock, description and specifications.' : 'Browse the live collection for current skin-care products and their published details.', image: '/assets/images/aloeverabeaker.webp', item: aloeProduct },
              { key: 'charcoal', label: 'Skin · collection direction', title: charcoalProduct?.name || 'Aloe vera and charcoal', copy: charcoalProduct ? 'This product is available in the current catalog. Its page shows the details and stock today.' : 'Charcoal is part of the direction you shared. We will link it here when a product is listed and ready to order.', image: '/assets/images/aloeveradrop.webp', item: charcoalProduct },
              { key: 'sea-buckthorn', label: 'Skin · in development', title: seaBuckthornProduct?.name || 'Sea-buckthorn face care', copy: seaBuckthornProduct ? 'Explore the live product page for current information.' : 'A future face-care direction. No launch date or product claims until the formula is ready.', image: '/assets/images/aloeverascience.webp', item: seaBuckthornProduct },
              { key: 'hair', label: 'Hair · in development', title: hairProducts[0]?.name || 'Hair oil and shampoo', copy: hairProducts.length ? 'See the currently listed hair products and their directions.' : 'Hair oil and shampoo are upcoming. They are not yet offered for sale.', image: '/assets/images/aloeveradna.webp', item: hairProducts[0] },
            ].map((story, index) => <article key={story.key} className={`grid min-h-[360px] bg-[#f4f2eb] sm:grid-cols-2 ${index % 2 ? 'md:flex-row-reverse' : ''}`}>
              <div className={`relative min-h-[260px] overflow-hidden ${index % 2 ? 'sm:order-2' : ''}`}><img src={story.image} alt={story.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover"/></div>
              <div className="flex flex-col justify-center p-6 md:p-9"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#71806a]">{story.label}</p><h3 className="mt-3 font-serif text-2xl md:text-3xl">{story.title}</h3><p className="mt-4 text-sm leading-6 text-stone-600">{story.copy}</p>{story.item ? <Link to={`/product/${story.item.slug || story.item.id}`} className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#35533c]">View product <ArrowRight size={14}/></Link> : <span className="mt-6 w-fit border border-[#253b2f]/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-[#536b4d]">Not yet available</span>}</div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[0.7fr_1.3fr] md:py-24">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#607552]">A human note</p><p className="mt-4 font-serif text-3xl leading-tight md:text-4xl">“I want care to feel like a kindness you can keep doing—not another thing you have to get perfect.”</p><span className="mt-5 block text-[10px] font-bold uppercase tracking-widest text-[#71806a]">A thought from the Bhumivera journal</span></div>
        <div className="relative grid min-h-[360px] place-items-center overflow-hidden bg-[#16231c] p-8 text-center text-white md:min-h-[480px]"><img src="/assets/images/foundermanifesto.webp" alt="The people and place behind Bhumivera" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-40"/><div className="relative max-w-2xl"><Quote className="mx-auto mb-7 text-[#dce7c5]" size={30}/><blockquote className="font-serif text-3xl leading-tight md:text-5xl">“A brand is not only what it makes. It is what it chooses to notice, and what it takes responsibility for next.”</blockquote><p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#dce7c5]">The Bhumivera journal</p></div></div>
      </section>

      <section className="border-y border-[#253b2f]/15 bg-[#f4f2eb]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#607552]">Words from customers</p><h2 className="mt-4 font-serif text-4xl md:text-5xl">The experience, in their words.</h2></div><Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-[#35533c]">Explore products <ArrowRight size={16}/></Link></div>
          {approvedReviews.length ? <div className="grid gap-0 border-y border-[#253b2f]/20 md:grid-cols-2 md:divide-x md:divide-[#253b2f]/20">{approvedReviews.map((review, index) => <blockquote key={review.id || index} className="py-7 md:px-7 first:md:pl-0"><div className="flex gap-1 text-[#78875f]" aria-label={`${review.rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map(star => <span key={star}>{Number(review.rating) >= star ? '★' : '☆'}</span>)}</div><p className="mt-4 font-serif text-xl leading-relaxed">“{review.body || review.comment}”</p><p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[#71806a]">{review.user_name || 'Bhumivera customer'}{review.product_name ? ` · ${review.product_name}` : ''}</p></blockquote>)}</div> : <div className="border-y border-[#253b2f]/20 py-10"><p className="max-w-2xl font-serif text-2xl">No approved customer stories are published yet.</p><p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">When customers choose to share their experience and it is approved, their words can live here. Until then, this page speaks in the brand’s own voice.</p></div>}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#14201a] text-white">
        <img src="/assets/images/aloeveradna.webp" alt="Aloe vera leaf, close to the earth" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35"/><div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0a100e]/90 to-[#0a100e]/35"/>
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1fr_0.7fr] md:py-24"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#dce7c5]">A ritual with room to grow</p><h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">The most meaningful routine is the one that still feels like yours.</h2></div><div className="self-end"><p className="text-sm leading-7 text-white/75">Keep what works. Read the product details. Ask us when something is unclear. Let a small daily habit be simple, rather than turning self-care into a performance.</p><Link to="/shop" className="mt-7 inline-flex items-center gap-3 border-b border-[#dce7c5]/60 pb-2 text-sm font-semibold text-[#e7edda]">Find your next ritual <ArrowRight size={16}/></Link></div></div>
      </section>

      <section className="bg-[#f4f2eb]">
        <div className="mx-auto grid max-w-7xl gap-0 px-6 py-8 md:grid-cols-2 md:py-14">
          {[
            'The kindest ritual is one you can return to without bargaining with yourself.',
            'A product earns trust in the little things: a clear label, a truthful promise, a helpful answer.',
            'Growing a collection should feel like learning. Each new idea deserves its own care.',
            'Nature is not a brand color. It is the living world our choices touch.',
          ].map((quote, index) => <blockquote key={quote} className="border-b border-[#253b2f]/20 py-7 md:px-8 md:even:border-l md:even:border-b-0"><span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#71806a]">Bhumivera journal · {String(index + 1).padStart(2, '0')}</span><p className="mt-4 max-w-xl font-serif text-2xl leading-relaxed text-[#1c2922] md:text-3xl">“{quote}”</p></blockquote>)}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="mb-10 text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#607552]">The Bhumivera journal</p><h2 className="mt-4 font-serif text-4xl md:text-5xl">A few things worth asking.</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-stone-600">Clear information is part of a good experience. If you need something more specific, our support team is here to help.</p></div>
        <div className="border-t border-[#253b2f]/20">{questions.map(([question, answer], index) => <article key={question} className="border-b border-[#253b2f]/20">
          <button type="button" aria-expanded={activeQuestion === index} onClick={() => setActiveQuestion(activeQuestion === index ? -1 : index)} className="flex w-full items-center justify-between gap-6 py-5 text-left font-serif text-lg text-[#1c2922] hover:text-[#607552] md:text-xl"><span><span className="mr-4 font-mono text-xs text-[#8b987e]">{String(index + 1).padStart(2, '0')}</span>{question}</span><ChevronDown size={18} className={`shrink-0 transition-transform duration-300 ${activeQuestion === index ? 'rotate-180' : ''}`}/></button>
          {activeQuestion === index && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="max-w-3xl pb-6 pl-9 text-sm leading-7 text-stone-600">{answer}</motion.p>}
        </article>)}</div>
        <p className="mt-8 text-center text-sm text-stone-500">Still wondering? <Link to="/contact" className="font-semibold text-[#35533c] underline underline-offset-4">Talk with our team</Link></p>
      </section>

      <section id="collection" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5 border-b border-[#253b2f]/15 pb-6">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#607552]">The collection</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">Made for your daily ritual.</h2></div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-[#35533c] hover:text-[#14201a]">View all products <ArrowRight size={16}/></Link>
        </div>
        {loading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map(item => <div key={item} className="aspect-[4/5] animate-pulse bg-[#e8e7dd]"/>)}</div> : products.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 8).map((product, index) => <motion.article key={product.id || product._id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (index % 4) * 0.07 }} className="group">
              <Link to={`/product/${product.slug || product.id}`} className="block overflow-hidden bg-[#e8e7dd]">
                <img src={productImage(product)} alt={product.name} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" onError={event => { event.currentTarget.src = '/assets/images/aloeverabeaker.webp'; }}/>
              </Link>
              <div className="flex items-start justify-between gap-3 border-b border-[#253b2f]/15 py-4">
                <div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71806a]">{product.category_name || 'Bhumivera ritual'}</p><h3 className="mt-1 font-serif text-xl">{product.name}</h3></div>
                <span className="shrink-0 pt-4 text-sm font-semibold">₹{price(product)}</span>
              </div>
              <Link to={`/product/${product.slug || product.id}`} className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#35533c]">Discover formula <ArrowRight size={14}/></Link>
            </motion.article>)}
          </div>
        ) : <div className="border-y border-[#253b2f]/15 py-12 text-sm text-stone-600">The collection is being updated. Visit the shop for current availability.</div>}
      </section>

      <section className="bg-[#e8e6dc]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="mb-12 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#607552]">The Bhumivera edit</p><h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">A collection growing with intention.</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">Skin and hair are not the same ritual. We are building each with its own pace, product details and ingredient story instead of stretching one formula across every need.</p></div>
          <div className="grid gap-0 border-y border-[#253b2f]/20 md:grid-cols-3 md:divide-x md:divide-[#253b2f]/20">
            {[
              { image: '/assets/images/aloeverabeaker.webp', number: '01', title: 'Cleanse with care', note: 'Aloe vera face wash is listed in the live collection. Open its product page for current price, stock and description.', query: 'aloe vera' },
              { image: '/assets/images/aloeveradrop.webp', number: '02', title: 'Explore the next face ritual', note: 'Sea-buckthorn face care is part of the direction. Products will appear here when they are listed and ready to order.', query: 'sea buckthorn' },
              { image: '/assets/images/aloeverascience.webp', number: '03', title: 'Care for hair, thoughtfully', note: 'Hair oil and shampoo are being prepared for the collection. We will not show them as available before launch.', query: 'hair' },
            ].map((ritual, index) => <article key={ritual.number} className="group relative min-h-[430px] overflow-hidden md:min-h-[540px]">
              <img src={ritual.image} alt="Bhumivera botanical ritual" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.035]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b140e]/90 via-[#0b140e]/15 to-[#0b140e]/10" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                <span className="font-mono text-xs text-[#dce7c5]">{ritual.number} / THE RITUAL</span>
                <h3 className="mt-4 font-serif text-3xl">{ritual.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">{ritual.note}</p>
                <Link to={`/shop?search=${encodeURIComponent(ritual.query)}`} className="mt-6 inline-flex items-center gap-2 border-b border-white/50 pb-1 text-xs font-bold uppercase tracking-widest hover:border-[#dce7c5] hover:text-[#dce7c5]">Explore <ArrowRight size={14}/></Link>
              </div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="grid min-h-[520px] bg-[#17231d] text-white md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 md:px-12 lg:px-20">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#c2d09f]">Care beyond the bathroom</p>
          <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight md:text-5xl">Good intentions deserve a public record.</h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-white/65">Choose an optional contribution at eligible cash-on-delivery checkout. We show it as a pledge until collected, and publish field photos or video only after the work is completed and verified.</p>
          <Link to="/impact" className="mt-7 inline-flex w-fit items-center gap-3 border-b border-[#c2d09f]/60 pb-2 text-sm font-semibold text-[#e5ebd5] hover:text-white">Read the Bhumivera field ledger <ArrowRight size={16}/></Link>
        </div>
        <div className="relative min-h-[300px] overflow-hidden md:min-h-full">
          <img src="/assets/images/foundermanifesto.webp" alt="Bhumivera's nature-first commitment" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17231d]/45 to-transparent" />
          <p className="absolute bottom-5 left-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Our commitment begins with accountability.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-3 md:py-20">
        {[
          ['01', 'Know the formula', 'Product pages lead with what is actually listed for that product, not a universal promise.'],
          ['02', 'Buy what is available', 'The collection reflects live catalog items. New rituals appear when they are ready.'],
          ['03', 'Follow the record', 'Collected contributions and documented field work have separate, visible statuses.'],
        ].map(([number, title, copy]) => <article key={number} className="border-t border-[#253b2f]/25 pt-5"><span className="font-mono text-xs text-[#71806a]">{number}</span><h3 className="mt-4 font-serif text-2xl">{title}</h3><p className="mt-3 text-sm leading-6 text-stone-600">{copy}</p></article>)}
      </section>

      <section className="border-y border-[#253b2f]/15 bg-[#f4f2eb]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[0.7fr_1.3fr] md:py-24">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#607552]">Our point of view</p><h2 className="mt-4 font-serif text-4xl leading-tight">Luxury is attention, not excess.</h2></div>
          <div className="grid gap-8 sm:grid-cols-2">
            <blockquote className="border-l border-[#536b4d]/40 pl-5 font-serif text-xl leading-relaxed">“A good ritual should leave room for the rest of life.”<span className="mt-4 block font-sans text-[10px] font-bold uppercase tracking-widest text-[#71806a]">The Bhumivera journal</span></blockquote>
            <blockquote className="border-l border-[#536b4d]/40 pl-5 font-serif text-xl leading-relaxed">“Care for the earth begins with learning what is true, then doing what we can.”<span className="mt-4 block font-sans text-[10px] font-bold uppercase tracking-widest text-[#71806a]">The Bhumivera journal</span></blockquote>
          </div>
        </div>
      </section>
    </main>
  );
}