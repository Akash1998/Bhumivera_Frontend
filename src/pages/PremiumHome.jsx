import React from 'react';
import { ArrowRight, FlaskConical, Leaf, QrCode, ShieldCheck, ShoppingBag, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { HOME_VISUAL_ASSETS } from '../data/bhumiveraUniqueData';

const tiles = [
  { to: '/shop', label: 'Shop', note: 'All formulations', icon: ShoppingBag },
  { to: '/lab', label: 'Lab & Dispatch', note: 'Cold-pressed protocol', icon: FlaskConical },
  { to: '/impact', label: 'Public Ledger', note: 'Verified impact', icon: Sprout },
  { to: '/science', label: 'Lab Science', note: 'pH 5.5 dossier', icon: Leaf },
];

const promises = [
  { icon: Leaf, title: 'Cold-Pressed Actives', text: 'Extracted below 28°C to keep Omega-7 and Vitamin C intact.' },
  { icon: FlaskConical, title: 'pH 5.5 Calibrated', text: 'Matched to the skin acid mantle and printed on the label.' },
  { icon: ShieldCheck, title: 'Serial Verified', text: 'Every bottle is serialised in micro-batches of 250.' },
  { icon: Sprout, title: 'Zero SLS / Parabens', text: 'No artificial dyes, sulphates or foaming agents.' },
  { icon: ShoppingBag, title: 'Sealed Dispatch', text: 'Tamper-evident seal and weight-logged before shipping.' },
];

const stats = [
  { value: '2016', label: 'Established' },
  { value: '250', label: 'Bottles per batch' },
  { value: '0%', label: 'SLS / Parabens' },
  { value: '5.5', label: 'Calibrated pH' },
];

export default function PremiumHome() {
  return (
    <main className="min-h-screen bg-[#14291F] text-[#FAF7F2] font-sans">
      <SEO
        title="Bhumivera Organics (Est. 2016) | Himalayan Botanical & Dermatological Skincare Maison"
        description="Cold-pressed Himalayan Sea Buckthorn, Kashmiri Saffron, Activated Charcoal & Royal 2-in-1 Botanical Shampoo by Bhumivera Organics."
        route="/"
        ogImage={HOME_VISUAL_ASSETS.heroPrimary}
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
            <span className="font-headline-silver">Clinical Clarity.</span>
          </h1>
          <div className="gold-hairline my-5 max-w-xs" />
          <p className="max-w-2xl text-sm font-light leading-relaxed text-[#DFD7C4] sm:text-base">
            Cold-pressed Himalayan Sea Buckthorn, Pampore Kashmiri Saffron and fresh Aloe Vera with pH 5.5 Niacinamide and Hyaluronic Acid. Every concentration printed openly on the label.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/shop" className="btn-gold-luxury inline-flex min-h-12 items-center gap-2.5 rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-[0.16em]">
              Explore Collections <ArrowRight size={15} />
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
            <span className="block text-xs font-light text-[#DFD7C4]">Check pH record, batch run and herbalist seal.</span>
          </span>
          <ArrowRight size={18} className="shrink-0 text-[#D4AF37]" />
        </Link>

        <div className="mt-10">
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
