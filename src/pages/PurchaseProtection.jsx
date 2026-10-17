import { ArrowRight, CreditCard, PackageCheck, RotateCcw, Truck, ShieldCheck, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import BhumiveraVideo from '../components/BhumiveraVideo';

const supportTopics = [
  {
    icon: CreditCard,
    title: 'Payment & Gateway Security',
    copy: 'All online payments are processed via PCI-DSS compliant Razorpay/UPI gateways. Checkout totals are locked server-side, and atomic ledger reconciliation protects every transaction.',
  },
  {
    icon: Truck,
    title: 'CCTV-Verified Dispatch & Delivery',
    copy: 'Every parcel is weighed, barcode-scanned, and filmed under warehouse CCTV prior to dispatch. Use your 9-digit order number on the tracking page for live carrier updates.',
  },
  {
    icon: RotateCcw,
    title: 'Hygiene Seal & Courtesy Protection',
    copy: 'Personal-care cosmetics are non-returnable once delivered for hygiene safety. Submit a continuous 360° uncut unboxing video within 48 hours of delivery for any transit damage to receive a free replacement or 100% Wallet credit.',
  },
];

export default function PurchaseProtection() {
  return (
    <main className="min-h-screen bg-[#f4f1e9] text-[#1b2921]">
      <SEO
        title="Orders, Purchase Protection & Anti-Fraud Guarantee | Bhumivera"
        description="Find information about payments, CCTV-verified delivery, 360-degree unboxing protection, and customer support for your Bhumivera order."
        route="/purchase-protection"
      />
      <section className="relative isolate overflow-hidden bg-[#142019] px-5 py-24 text-white sm:px-8 sm:py-32">
        <div className="absolute inset-0 -z-20 opacity-35">
          <BhumiveraVideo
            src="/assets/videos/unboxing-protection.mp4"
            poster="/assets/images/Promo1.webp"
            alt="Bhumivera order and purchase protection video"
            className="h-full w-full object-cover"
            containerClassName="relative h-full w-full overflow-hidden"
            showControls
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101a14]/95 via-[#101a14]/80 to-[#101a14]/45" />
        <div className="mx-auto max-w-4xl">
          <p className="inline-flex items-center gap-2 border border-white/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#dce7c5]">
            <PackageCheck size={15} aria-hidden="true" /> Order support &amp; purchase protection
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
            Clear protection and verified records for every order.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
            From cryptographic payment ledgers and warehouse CCTV weight-scans to our 48-hour 360° unboxing courtesy guarantee, every Bhumivera order is backed by transparent operational and legal safeguards.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-3 md:gap-7 lg:px-10">
        {supportTopics.map(({ icon: Icon, title, copy }) => (
          <article key={title} className="border border-[#26392c]/15 bg-white p-6 sm:p-8">
            <Icon size={22} className="text-[#536b4d]" aria-hidden="true" />
            <h2 className="mt-5 font-serif text-2xl">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">{copy}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="grid gap-8 border-t border-[#26392c]/15 pt-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div className="aspect-[16/9] overflow-hidden border border-[#26392c]/15 bg-[#101a14]">
            <BhumiveraVideo
              src="/assets/videos/founder-manifesto.mp4"
              poster="/assets/images/foundermanifesto.webp"
              alt="Bhumivera stewardship and authenticity film"
              className="h-full w-full object-cover"
              containerClassName="relative h-full w-full overflow-hidden"
              badge="Bhumivera Fulfilment & Legal Shield · HD"
              showControls
            />
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl">Need help with a delivery or damaged parcel?</h2>
              <p className="mt-3 text-sm leading-7 text-stone-600">
                Check the latest tracking information first. If your parcel arrives damaged or leaking, record an uncut 360° unboxing video showing the sealed outer box and AWB label, and submit it within 48 hours of delivery.
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                <Link to="/order-tracking" className="inline-flex min-h-11 items-center gap-2 border-b border-[#536b4d]/40 pb-1 text-xs font-semibold text-[#26392c]">
                  Track an order <ArrowRight size={14} aria-hidden="true" />
                </Link>
                <Link to="/returns" className="inline-flex min-h-11 items-center gap-2 border-b border-[#536b4d]/40 pb-1 text-xs font-semibold text-[#26392c]">
                  Courtesy Replacement Policy <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="border-t border-[#26392c]/15 pt-5">
              <h2 className="font-serif text-2xl">Complete Legal &amp; Anti-Fraud Terms</h2>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Review our complete 8-part Conditions of Use &amp; Sale, Hygiene Non-Return Policy, Mandatory 360° Unboxing Rules, and Statutory Grievance Redressal mechanism.
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                <Link to="/legal?section=terms" className="inline-flex min-h-11 items-center gap-2 bg-[#142019] px-4 py-2.5 text-xs font-semibold text-white">
                  <Scale size={14} /> Open Master Legal Suite <ArrowRight size={14} />
                </Link>
                <Link to="/contact" className="inline-flex min-h-11 items-center gap-2 border border-[#26392c]/30 px-4 py-2.5 text-xs font-semibold text-[#26392c]">
                  <ShieldCheck size={14} /> Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
