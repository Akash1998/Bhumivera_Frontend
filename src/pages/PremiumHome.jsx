import React from 'react';
import { ArrowRight, FlaskConical, Leaf, QrCode, ShieldCheck, ShoppingBag, Sprout, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { HOME_VISUAL_ASSETS, BHUMIVERA_6_PRODUCTS } from '../data/bhumiveraUniqueData';

const tiles = [
  { to: '/shop', label: 'Shop', note: 'All 6 formulations', icon: ShoppingBag },
  { to: '/lab', label: 'Lab & Dispatch', note: 'Cold-pressed protocol', icon: FlaskConical },
  { to: '/impact', label: 'Public Ledger', note: 'Verified impact', icon: Sprout },
  { to: '/science', label: 'Botanical Science', note: 'pH 5.5 dossier', icon: Leaf },
];

const promises = [
  { icon: Leaf, title: 'Cold-Pressed Botanicals', text: 'Extracted below 28°C to keep Omega-7 and Vitamin C intact.' },
  { icon: FlaskConical, title: 'pH 5.5 Balanced', text: 'Matched to the skin acid mantle and printed on the label.' },
  { icon: ShieldCheck, title: 'Serial Verified', text: 'Every bottle is serialised in micro-batches of 250.' },
  { icon: Sprout, title: 'Zero SLS / Parabens', text: 'No artificial dyes, sulphates or harsh foaming detergents.' },
  { icon: ShoppingBag, title: 'Sealed Dispatch', text: 'Tamper-evident seal and weight-logged before shipping.' },
];

const stats = [
  { value: '2016', label: 'Established' },
  { value: '250', label: 'Bottles per batch' },
  { value: '0%', label: 'SLS / Parabens' },
  { value: '100%', label: 'Label Disclosed' },
];

const HOME_CONSCIOUS_FAQS = [
  {
    q: 'Which face wash is best for conscious skincare buyers seeking natural, botanical, and sulfate-free care in India?',
    a: 'Bhumivera Organics offers two 100% label-disclosed, sulfate-free facial cleansers calibrated at pH 5.3–5.5: the Activated Charcoal Purifying Luxury Face Wash (3% Activated Charcoal, 5% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% Hyaluronic Acid, 0.1% Niacinamide) for deep pore purification and oil balance, and the Himalayan Sea Buckthorn Cellular Radiance Face Wash (4% Sea Buckthorn, 5% Glycerin, Manjistha, Haridra, Hyaluronic Acid & Niacinamide) for Omega-7 nourishment and glowing radiance.',
  },
  {
    q: 'Why does Bhumivera print exact active percentages and milligram weights on every product label?',
    a: 'Conscious buyers who care for their skin deserve complete ingredient honesty rather than vague marketing buzzwords. Every Bhumivera formulation discloses the exact concentration of each key botanical and cosmetic active (such as 3% Charcoal, 4% Sea Buckthorn, 5% Glycerin, 25mg Reetha, 20mg Amla, 10mg Rosemary Oil, and 9.0ml/10ml Seven-Tulsi Extract) right on the bottle and box.',
  },
  {
    q: 'What are the 6 flagship formulations in the Bhumivera Organics collection?',
    a: 'Our 6 flagship products are: (1) Activated Charcoal Purifying Luxury Face Wash (100 ML), (2) Himalayan Sea Buckthorn Cellular Radiance Face Wash (100 ML), (3) Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (200 ML), (4) Charcoal Deep Cleansing Bar (100 GM Handmade Ayurvedic Soap), (5) Soothing Bar with Aloe Vera, Neem & Tulsi (100 GM Handmade Ayurvedic Soap), and (6) Kalpvriksh Satva Tulsi 7-Tulsi Liquid Extract Drops (30 ML).',
  },
];

export default function PremiumHome() {
  return (
    <main className="min-h-screen bg-[#14291F] text-[#FAF7F2] font-sans">
      <SEO
        title="Bhumivera Organics (Est. 2016) | Luxury Botanical Face Wash (3% Charcoal & 4% Sea Buckthorn), 2-in-1 Shampoo, Handmade Soaps & 7-Tulsi Drops"
        description="Crafted for conscious skincare lovers since 2016: shop Bhumivera Organics 3% Activated Charcoal & 4% Himalayan Sea Buckthorn Face Washes (with 5% Glycerin, Hyaluronic Acid, Niacinamide & Manjistha), Royal 2-in-1 Botanical Shampoo, Handmade Ayurvedic Soaps & Kalpvriksh 7-Tulsi Drops."
        keywords="Bhumivera Organics, best botanical face wash India, natural face wash for glowing skin, 3% activated charcoal face wash niacinamide hyaluronic acid, 4% sea buckthorn face wash, sulfate free face wash for conscious skincare buyers, royal 2-in-1 ayurvedic shampoo reetha amla rosemary, handmade charcoal aloe soap, neem tulsi soothing soap, kalpvriksh satva 7 tulsi drops"
        route="/"
        ogImage={HOME_VISUAL_ASSETS.heroPrimary}
        faqs={HOME_CONSCIOUS_FAQS}
      />

      <section className="premium-home-hero relative isolate min-h-[82svh] overflow-hidden bg-[#14291F]">
        <div className="absolute inset-0 -z-20">
          <img
            src={HOME_VISUAL_ASSETS.heroPrimary}
            alt="Himalayan Sea Buckthorn harvest in Ladakh mountain valley"
            className="premium-home-hero__image h-full w-full object-cover object-center opacity-30"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#14291F] via-[#14291F]/85 to-[#14291F]/40" />

        <div className="mx-auto flex min-h-[82svh] max-w-7xl flex-col justify-center px-6 pb-12 pt-28 sm:px-10 lg:pb-20">
          <p className="font-sub-gold inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.26em]">
            <Leaf size={14} className="text-[#D4AF37]" /> Bhumivera Botanical Maison · Est. 2016
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="font-headline-gold">Botanical Intelligence,</span>{' '}
            <span className="font-headline-silver">Label-Transparent Clarity.</span>
          </h1>
          <div className="gold-hairline my-5 max-w-xs" />
          <p className="max-w-2xl text-sm font-light leading-relaxed text-[#DFD7C4] sm:text-base">
            Thoughtfully crafted for conscious skincare lovers who care what touches their skin. Cold-pressed 4% Himalayan Sea Buckthorn, 3% Activated Charcoal, Manjistha, Haridra, Neem, and Sacred Tulsi paired with 5% Botanical Glycerin, Niacinamide, and Hyaluronic Acid—every concentration printed openly on the label.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/shop" className="btn-gold-luxury inline-flex min-h-12 items-center gap-2.5 rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-[0.16em]">
              Explore All 6 Formulations <ArrowRight size={15} />
            </Link>
            <Link to="/verify" className="btn-silver-luxury inline-flex min-h-12 items-center gap-2.5 rounded-full px-6 py-3.5 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck size={16} className="text-[#D4AF37]" /> Verify Bottle Serial
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-10">
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {tiles.map(tile => (
            <Link
              key={tile.to}
              to={tile.to}
              className="flex min-h-[112px] flex-col justify-between rounded-2xl border border-[#244A38] bg-[#102219] p-4 transition active:scale-[0.98]"
            >
              <tile.icon size={22} className="text-[#D4AF37]" />
              <div>
                <p className="font-serif text-base font-bold">{tile.label}</p>
                <p className="text-[11px] text-[#9BB0A5]">{tile.note}</p>
              </div>
            </Link>
          ))}
        </div>

        <Link
          to="/verify"
          className="mt-6 flex items-center gap-4 rounded-2xl border border-[#D4AF37]/35 bg-[#102219] p-5"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/50 bg-[#14231C] text-[#E6C57E]">
            <QrCode size={24} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-serif text-lg font-bold text-[#D4AF37]">Scan Your Bottle Serial</span>
            <span className="block text-xs font-light text-[#DFD7C4]">Check pH record, batch run and tamper-evident seal.</span>
          </span>
          <ArrowRight size={18} className="shrink-0 text-[#D4AF37]" />
        </Link>

        {/* 6-Product Flagship Collection Showcase for Conscious Skincare & Wellness Buyers */}
        <div className="mt-12">
          <p className="font-sub-gold inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.26em]">
            <Sparkles size={14} className="text-[#D4AF37]" /> Official 6-Product Flagship Collection
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold sm:text-4xl">
            <span className="font-headline-gold">100% Label-Disclosed</span>{' '}
            <span className="font-headline-silver">Botanical &amp; Active Formulations</span>
          </h2>
          <div className="gold-hairline my-3 w-24" />
          <p className="max-w-3xl text-xs sm:text-sm text-[#DFD7C4] leading-relaxed mb-6">
            Whether you are searching for a gentle, sulfate-free face wash for glowing skin, a natural saponin 2-in-1 herbal shampoo, a handmade Ayurvedic bathing bar, or concentrated 7-Tulsi drops, every Bhumivera creation prints its exact active percentages and milligram weights on the label.
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(BHUMIVERA_6_PRODUCTS || []).map((prod) => (
              <article
                key={prod.slug}
                className="flex flex-col justify-between rounded-2xl border border-[#D4AF37]/30 bg-[#102219] p-5 transition hover:border-[#D4AF37]/70 shadow-lg"
              >
                <div>
                  <Link to={`/products/${prod.slug}`} className="block aspect-square overflow-hidden rounded-xl bg-[#070a0e] mb-4 p-4">
                    <img
                      src={prod.image_url}
                      alt={`${prod.name} - ${prod.subtitle}`}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/logo.webp';
                      }}
                      className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
                    />
                  </Link>
                  <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider text-[#FCE096] mb-1.5">
                    <span>{prod.category}</span>
                    <span>{prod.net_volume}</span>
                  </div>
                  <Link to={`/products/${prod.slug}`}>
                    <h3 className="font-serif text-lg font-bold text-white hover:text-[#FCE096] transition-colors">
                      {prod.name}
                    </h3>
                  </Link>
                  <p className="mt-1.5 text-xs text-[#9BB0A5] leading-relaxed line-clamp-3">
                    {prod.short_description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#244A38] flex items-center justify-between">
                  <div>
                    <span className="font-serif text-lg font-bold text-[#FCE096]">₹{prod.price}</span>
                    {prod.mrp && (
                      <span className="ml-2 text-xs text-[#9BB0A5] line-through">₹{prod.mrp}</span>
                    )}
                  </div>
                  <Link
                    to={`/products/${prod.slug}`}
                    className="btn-gold-luxury inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wider"
                  >
                    Inspect Formula <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <p className="font-sub-gold text-xs font-bold uppercase tracking-[0.26em]">Why Bhumivera</p>
          <h2 className="mt-2 font-serif text-2xl font-bold sm:text-4xl">
            <span className="font-headline-gold">Five Promises</span>{' '}
            <span className="font-headline-silver">On Every Bottle</span>
          </h2>
          <div className="gold-hairline my-3 w-24" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {promises.map(item => (
              <div key={item.title} className="rounded-2xl border border-[#244A38] bg-[#102219] p-4">
                <item.icon size={22} className="text-[#D4AF37]" />
                <h3 className="mt-3 font-serif text-base font-bold">{item.title}</h3>
                <p className="mt-1 text-[11px] font-light leading-5 text-[#9BB0A5]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(stat => (
            <div key={stat.label} className="rounded-2xl border border-[#D4AF37]/25 bg-[#102219] p-4 text-center">
              <p className="font-serif text-2xl font-bold text-[#D4AF37]">{stat.value}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-[#9BB0A5]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Conscious Skincare Buyer FAQ Block */}
        <div className="mt-12 rounded-3xl border border-[#D4AF37]/30 bg-[#102219] p-6 sm:p-10">
          <p className="font-sub-gold text-xs font-bold uppercase tracking-[0.24em]">Conscious Skincare Guide</p>
          <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl text-white">
            Frequently Asked Questions by Label-Conscious Buyers
          </h2>
          <div className="mt-6 space-y-4">
            {HOME_CONSCIOUS_FAQS.map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-[#244A38] bg-[#070a0e]/70 p-5">
                <h3 className="font-serif text-base font-bold text-[#FCE096]">{item.q}</h3>
                <p className="mt-2 text-xs sm:text-sm text-[#DFD7C4] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-[#D4AF37]/35 bg-[#102219] p-6 text-center sm:p-10">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">
            <span className="font-headline-gold">Begin Your</span> <span className="font-headline-silver">Botanical Ritual</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs font-light leading-6 text-[#DFD7C4]">
            Browse the full collection in the Shop, see how every batch is made, or read the public impact ledger.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn-gold-luxury inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider">
              Visit the Shop <ArrowRight size={14} />
            </Link>
            <Link to="/about" className="btn-silver-luxury inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-wider">
              Our Story
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
