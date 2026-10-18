import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Droplets,
  Leaf,
  Sparkles,
  ShieldCheck,
  FlaskConical,
  QrCode,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { categories as categoriesApi, products as productsApi, recommendations as recommendationsApi, reviews as reviewsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getProductImageUrl } from '../utils/productImageUrl';
import { HOME_VISUAL_ASSETS, FALLBACK_CATALOG_PRODUCTS } from '../data/bhumiveraUniqueData';

const productImage = (product, idx = 0) =>
  getProductImageUrl(product?.image_url || product?.images || product?.image) ||
  FALLBACK_CATALOG_PRODUCTS[idx % FALLBACK_CATALOG_PRODUCTS.length].image_url;

const price = product => Number(product.discount_price || product.price || 0).toLocaleString('en-IN');

const questions = [
  {
    key: 'ingredients',
    label: 'Ingredients',
    question: 'What is actually inside each formula?',
    answer: 'Every product has its own transcribed ingredient list, calibrated pH level, and directions. Explore the product page or Somatic Label Registry before choosing.',
    link: '/science',
    linkLabel: 'Explore ingredient science',
  },
  {
    key: 'choosing',
    label: 'Choosing a ritual',
    question: 'Where should I begin?',
    answer: 'Begin with the cleanser or elixir that fits your skin type, or compare our 6 formulations side-by-side on the Compare Formulations matrix.',
    link: '/compare',
    linkLabel: 'Compare formulations',
  },
  {
    key: 'orders',
    label: 'Orders',
    question: 'Where can I follow an order?',
    answer: 'Use your 9-digit order reference on the Order Tracking page to inspect warehouse digital weight-scan logs and courier AWB milestones.',
    link: '/order-tracking',
    linkLabel: 'Track an order',
  },
  {
    key: 'genuinity',
    label: 'Bottle Serial & Purity',
    question: 'How do I test my bottle’s genuineness?',
    answer: 'Every Bhumivera vessel is individually serialized in artisanal micro-runs of 250 bottles. Scan the bottle QR code or enter your serial on the Genuinity Test page to inspect real lab pH calibration and botanical origin.',
    link: '/verify',
    linkLabel: 'Verify bottle serial & genuinity',
  },
];

export default function PremiumHome() {
  const { user } = useAuth() || {};
  const { addToCart } = useCart() || {};
  const [products, setProducts] = useState(FALLBACK_CATALOG_PRODUCTS);
  const [categories, setCategories] = useState([]);
  const [openQuestion, setOpenQuestion] = useState('ingredients');

  useEffect(() => {
    let active = true;
    productsApi
      .getAllActive()
      .then(({ data }) => {
        const rows = data?.data || data;
        if (active && Array.isArray(rows) && rows.length > 0) {
          // Ensure every product has a unique non-repeating image if missing
          const enriched = rows.map((p, idx) => ({
            ...FALLBACK_CATALOG_PRODUCTS[idx % FALLBACK_CATALOG_PRODUCTS.length],
            ...p,
            image_url:
              p.image_url ||
              FALLBACK_CATALOG_PRODUCTS[idx % FALLBACK_CATALOG_PRODUCTS.length].image_url,
          }));
          setProducts(enriched);
        }
      })
      .catch(() => {});

    categoriesApi
      .getAll()
      .then(({ data }) => {
        const rows = data?.data || data;
        if (active && Array.isArray(rows)) setCategories(rows);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#070a0e] text-[#e2e8f0] font-sans">
      <SEO
        title="Bhumivera | Himalayan Botanical & Dermatological Skincare Maison"
        description="Cold-pressed Himalayan Sea Buckthorn, Pampore Kashmiri Saffron, Niacinamide, and Hyaluronic Acid formulations with full label transparency."
        route="/"
        ogImage={HOME_VISUAL_ASSETS.heroPrimary}
      />

      {/* 1. TWO-TONE LUXURY HERO SECTION */}
      <section className="relative isolate min-h-[88svh] overflow-hidden bg-[#070a0e] text-[#e2e8f0]">
        <div className="absolute inset-0 -z-20">
          <img
            src={HOME_VISUAL_ASSETS.heroPrimary}
            alt="Himalayan Sea Buckthorn harvest in Ladakh mountain valley"
            className="h-full w-full object-cover object-center opacity-40"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070a0e]/95 via-[#070a0e]/80 to-[#070a0e]/40" />

        <div className="mx-auto flex min-h-[88svh] max-w-7xl flex-col justify-between px-6 pb-14 pt-28 sm:px-10 lg:pb-20">
          <div className="max-w-3xl pt-8">
            <p className="font-sub-gold uppercase tracking-[0.26em] text-xs font-bold inline-flex items-center gap-2">
              <Leaf size={14} className="text-[#d4af37]" /> Bhumivera Botanical Maison · Est. India
            </p>
            
            <h1 className="mt-5 font-serif text-4xl leading-[1.08] sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="font-headline-gold">Botanical Intelligence,</span><br className="hidden sm:inline" />{' '}
              <span className="font-headline-silver">Clinical Clarity.</span>
            </h1>

            <div className="gold-hairline my-5 max-w-xs" />

            <p className="font-sub-silver uppercase tracking-[0.22em] text-xs font-medium">
              Small-Batch Artisanal Compounding · Cold-Pressed High-Altitude Actives
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#cbd5e1] font-light sm:text-base">
              Cold-pressed Himalayan Sea Buckthorn (Omega-7), Pampore Kashmiri Saffron, and fresh Aloe Vera inner fillet paired with pH 5.5 Niacinamide and Hyaluronic Acid. Every concentration printed openly on the label with verified virgin custody.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <Link
                to="/shop"
                className="btn-gold-luxury inline-flex min-h-12 items-center gap-2.5 rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-white"
              >
                Shop the Collection <ArrowRight size={15} />
              </Link>
              <Link
                to="/verify"
                className="btn-silver-luxury inline-flex min-h-12 items-center gap-2.5 rounded-full px-6 py-3.5 text-xs font-semibold uppercase tracking-wider"
              >
                <ShieldCheck size={16} className="text-[#d4af37]" /> Verify Bottle Serial
              </Link>
              <Link
                to="/compare"
                className="two-tone-card inline-flex min-h-12 items-center gap-2.5 rounded-full border border-[#d4af37]/25 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#cbd5e1] hover:text-[#fce096] transition"
              >
                Compare Formulations
              </Link>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-[#d4af37]/20 pt-6 sm:grid-cols-4 text-xs">
            <div className="two-tone-card p-3.5 rounded-2xl border border-[#d4af37]/20">
              <p className="font-sub-gold text-[10px] uppercase tracking-widest font-bold">Acid Mantle Standard</p>
              <p className="mt-1 font-serif text-sm font-bold text-white">pH 5.3 – 5.6 Calibrated</p>
            </div>
            <div className="two-tone-card p-3.5 rounded-2xl border border-[#d4af37]/20">
              <p className="font-sub-gold text-[10px] uppercase tracking-widest font-bold">Surfactant Matrix</p>
              <p className="mt-1 font-serif text-sm font-bold text-white">0% SLS / SLES / Parabens</p>
            </div>
            <div className="two-tone-card p-3.5 rounded-2xl border border-[#d4af37]/20">
              <p className="font-sub-gold text-[10px] uppercase tracking-widest font-bold">Dispatch Integrity</p>
              <p className="mt-1 font-serif text-sm font-bold text-white">±0.5g Digital Scale Logged</p>
            </div>
            <div className="two-tone-card p-3.5 rounded-2xl border border-[#d4af37]/20">
              <p className="font-sub-gold text-[10px] uppercase tracking-widest font-bold">Sanitary Custody</p>
              <p className="mt-1 font-serif text-sm font-bold text-[#fce096]">100% Sealed &amp; Serial Tested</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED FORMULATIONS COLLECTION GRID */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24">
        <div className="flex flex-col justify-between gap-4 border-b border-[#d4af37]/20 pb-6 md:flex-row md:items-end">
          <div>
            <p className="font-sub-gold uppercase tracking-[0.26em] text-xs font-bold">
              Apothecary Formulations
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-5xl font-bold text-white">
              <span className="font-headline-gold">Considered Daily</span>{' '}
              <span className="font-headline-silver">Rituals</span>
            </h2>
            <div className="gold-hairline w-24 my-3" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/compare"
              className="btn-silver-luxury inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider"
            >
              Side-by-Side Comparison
            </Link>
            <Link
              to="/shop"
              className="btn-gold-luxury inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white"
            >
              View All {products.length} Formulations <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product, idx) => (
            <article
              key={product.id || product._id || idx}
              className="group flex flex-col overflow-hidden rounded-3xl border border-[#d4af37]/25 two-tone-card shadow-sm transition hover:border-[#d4af37]/60 hover:shadow-2xl"
            >
              <Link
                to={`/product/${product.slug || product.id}`}
                className="relative aspect-[4/3] w-full overflow-hidden bg-[#070a0e]"
              >
                <img
                  src={productImage(product, idx)}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-[#070a0e]/85 border border-[#d4af37]/40 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#fce096] backdrop-blur-sm">
                  {product.phLevel || 'pH 5.5 Calibrated'}
                </span>
              </Link>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#fce096]">
                    {product.category_name || 'Botanical Care'} · {product.volume || '100 ml'}
                  </p>
                  <Link to={`/product/${product.slug || product.id}`}>
                    <h3 className="mt-2 font-serif text-2xl font-bold text-white group-hover:text-[#fce096] transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="mt-2 text-xs leading-6 text-[#cbd5e1] font-light line-clamp-3">
                    {product.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-[#d4af37]/20 pt-4">
                  <div>
                    <span className="font-serif text-2xl font-bold text-[#fce096]">
                      ₹{price(product)}
                    </span>
                    {product.discount_price && (
                      <span className="ml-2 text-xs text-[#94a3b8] line-through font-light">
                        ₹{product.price}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart?.(product, 1)}
                    className="btn-gold-luxury rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. 4 CORE BOTANICAL SPECIMEN CARDS */}
      <section className="bg-[#070a0e] py-16 text-white sm:py-24 border-y border-[#d4af37]/20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="flex flex-col justify-between gap-4 border-b border-[#d4af37]/30 pb-8 md:flex-row md:items-end">
            <div>
              <p className="font-sub-gold uppercase tracking-[0.26em] text-xs font-bold flex items-center gap-2">
                <Sparkles size={13} className="text-[#d4af37]" /> Small-Batch Botanical Potency &amp; Origin
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-5xl font-bold text-white">
                <span className="font-headline-gold">Cornerstone Botanical</span>{' '}
                <span className="font-headline-silver">Actives</span>
              </h2>
              <div className="gold-hairline w-24 my-3" />
              <p className="mt-2 max-w-xl text-xs sm:text-sm text-[#cbd5e1] font-light">
                Transcribed from our physical bottle labels: pure steam-activated charcoal, high-altitude Sea Buckthorn, sacred neem, haridra, and triphala saponins.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/verify"
                className="btn-gold-luxury inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white"
              >
                <ShieldCheck size={14} /> Test Bottle Genuinity
              </Link>
              <Link
                to="/provenance-engine"
                className="btn-silver-luxury inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider"
              >
                Inspect 6 Harvest Corridors <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOME_VISUAL_ASSETS.ingredients.map((ing, idx) => (
              <article
                key={ing.name}
                className="group relative overflow-hidden rounded-3xl two-tone-card border border-[#d4af37]/30 transition-all duration-500 hover:-translate-y-1 hover:border-[#d4af37]"
              >
                <div className="aspect-[4/5] w-full overflow-hidden relative">
                  <img
                    src={ing.image}
                    alt={ing.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${ing.tone} via-[#070a0e]/40 to-transparent`} />
                </div>
                
                {/* Gold Accent Top Ribbon */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex justify-between items-center pointer-events-none">
                  <span className="rounded-full bg-[#070a0e]/85 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-[#fce096] border border-[#d4af37]/40 backdrop-blur-md">
                    {ing.badge}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#070a0e]/95 via-[#070a0e]/85 to-transparent">
                  <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#fce096] transition-colors">{ing.name}</h3>
                  <p className="text-[11px] font-mono text-[#fce096] mt-0.5">{ing.botanical}</p>
                  <p className="mt-2 text-xs leading-5 text-[#cbd5e1] font-light">{ing.note}</p>
                </div>
              </article>
            ))}
          </div>

          {/* SERIAL QR GENUINITY BANNER */}
          <div className="mt-12 two-tone-panel-gold rounded-3xl p-6 sm:p-8 border border-[#d4af37]/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#070a0e]/80 border border-[#d4af37]/40 text-[#fce096] shrink-0">
                <QrCode size={28} />
              </span>
              <div>
                <p className="font-sub-gold uppercase tracking-[0.2em] font-bold text-[10px]">
                  Artisanal Provenance &amp; Verification
                </p>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                  Scan Your Bottle Serial Number
                </h3>
                <p className="text-xs sm:text-sm text-[#cbd5e1] font-light mt-1 max-w-xl">
                  Inspect the live spectrophotometric purity assay, calibrated pH record, small-batch run allocation (250 bottles), and master herbalist seal for your specific bottle.
                </p>
              </div>
            </div>
            <Link
              to="/verify"
              className="btn-gold-luxury inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-xs font-semibold uppercase tracking-wider text-white shadow-xl shrink-0"
            >
              <ShieldCheck size={16} /> Open Genuinity Test Report <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. REAL-LIFE LABORATORY & FULFILMENT STUDIES */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#d4af37]/20 pb-6 md:flex-row md:items-end">
          <div>
            <p className="font-sub-gold uppercase tracking-[0.26em] text-xs font-bold">
              Real-Life Quality Benchmarks
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-5xl font-bold text-white">
              <span className="font-headline-gold">Inside Our Lab</span>{' '}
              <span className="font-headline-silver">&amp; Dispatch Protocol</span>
            </h2>
            <div className="gold-hairline w-24 my-3" />
          </div>
          <Link
            to="/science"
            className="btn-silver-luxury inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider"
          >
            Read Full Formulation Science <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
          {HOME_VISUAL_ASSETS.realLifeFieldStudies.map((study) => (
            <article
              key={study.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#d4af37]/25 two-tone-card shadow-sm"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#070a0e]">
                <img
                  src={study.image}
                  alt={study.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#fce096]">
                    {study.tag}
                  </span>
                  <h3 className="mt-2 font-serif text-xl font-bold text-white">{study.title}</h3>
                  <p className="mt-1 text-xs font-medium text-[#cbd5e1]">{study.subtitle}</p>
                  <p className="mt-2.5 text-xs leading-6 text-[#94a3b8] font-light">{study.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. STEWARDSHIP & FAQ SECTION */}
      <section className="border-t border-[#d4af37]/20 bg-[#070a0e] px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[0.95fr_1.05fr] items-center">
          <div className="overflow-hidden rounded-3xl two-tone-panel-gold border border-[#d4af37]/40 shadow-xl">
            <img
              src={HOME_VISUAL_ASSETS.stewardshipBanner}
              alt="Bhumivera copper hydrosol distillation and botanical craft"
              loading="lazy"
              className="aspect-[16/10] w-full object-cover opacity-85"
            />
            <div className="p-6 sm:p-8 text-white">
              <span className="font-sub-gold uppercase tracking-widest text-[10px] font-bold">
                Verified Stewardship Ledger
              </span>
              <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-white">
                No impact claim without a receipt and a field record.
              </h3>
              <p className="mt-3 text-xs sm:text-sm leading-6 text-[#cbd5e1] font-light">
                Inspect our public environmental ledger, native sapling nursery photographs, and riparian care records.
              </p>
              <Link
                to="/impact"
                className="btn-gold-luxury mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white"
              >
                Open Public Impact Ledger <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-sub-gold uppercase tracking-[0.26em] text-xs font-bold">
              Practical Answers
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              <span className="font-headline-gold">Common Inquiries</span>{' '}
              <span className="font-headline-silver">Before You Choose</span>
            </h2>
            <div className="gold-hairline w-24 my-3" />

            <div className="mt-6 space-y-3">
              {questions.map((item) => {
                const isOpen = openQuestion === item.key;
                return (
                  <div
                    key={item.key}
                    className="two-tone-panel rounded-2xl border border-[#d4af37]/25 p-5 shadow-sm transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenQuestion(isOpen ? '' : item.key)}
                      className="flex w-full items-center justify-between gap-4 text-left"
                    >
                      <div>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#fce096]">
                          {item.label}
                        </span>
                        <h3 className="mt-1 font-serif text-lg sm:text-xl font-bold text-white">
                          {item.question}
                        </h3>
                      </div>
                      <span className="text-xl font-bold text-[#d4af37]">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="mt-3 border-t border-[#d4af37]/20 pt-3 text-xs sm:text-sm leading-6 text-[#cbd5e1] font-light">
                        <p>{item.answer}</p>
                        <Link
                          to={item.link}
                          className="mt-3 inline-flex items-center gap-1.5 font-semibold text-[#fce096] hover:text-white transition-colors"
                        >
                          {item.linkLabel} <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
