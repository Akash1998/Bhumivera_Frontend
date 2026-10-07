import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Leaf, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { categories as categoriesApi, products as productsApi } from '../services/api';

const IMAGE_BASE = import.meta.env.VITE_R2_PUBLIC_URL || import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-22cd43cce9bc475680ad496e199706c4.r2.dev';

const productImage = product => {
  const source = product?.images?.[0] || product?.image_url || product?.image;
  if (!source) return '/assets/images/aloeverabeaker.webp';
  const path = typeof source === 'object' ? source.url || source.file_path || source.path : source;
  if (!path) return '/assets/images/aloeverabeaker.webp';
  return /^https?:\/\//i.test(path) ? path : `${IMAGE_BASE.replace(/\/$/, '')}/${String(path).replace(/^\//, '')}`;
};

const price = product => Number(product.discount_price || product.price || 0).toLocaleString('en-IN');

export default function PremiumHome() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroProduct = products[0];

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