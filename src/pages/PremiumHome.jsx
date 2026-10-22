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

export default function PremiumHome() {
  return (
    <main className="min-h-screen bg-[#14291F] text-[#FAF7F2] font-sans">
      <SEO
        title="Bhumivera Organics (Est. 2016) | Himalayan Botanical & Dermatological Skincare Maison"
        description="Cold-pressed Himalayan Sea Buckthorn, Kashmiri Saffron, Activated Charcoal & Royal 2-in-1 Botanical Shampoo by Bhumivera Organics."
        route="/"
        ogImage={HOME_VISUAL_ASSETS.heroPrimary}
      />

      <section className="premium-home-hero relative isolate overflow-hidden bg-[#14291F]">
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

        <div className="mx-auto max-w-7xl px-6 pb-12 pt-28 sm:px-10 lg:pb-20">
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
      </section>
    </main>
  );
}
