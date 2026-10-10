import { ArrowRight, CreditCard, PackageCheck, RotateCcw, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const supportTopics = [
  {
    icon: CreditCard,
    title: 'Payment',
    copy: 'Review the payment options shown during checkout. Your payment provider may also publish information about its own payment and data-handling practices.',
  },
  {
    icon: Truck,
    title: 'Delivery',
    copy: 'Dispatch and delivery estimates can vary by order and destination. Use the tracking details associated with your order for the latest available update.',
  },
  {
    icon: RotateCcw,
    title: 'Returns and refunds',
    copy: 'Eligibility and available options depend on the terms that apply to your order. Contact support before sending an item back.',
  },
];

export default function PurchaseProtection() {
  return (
    <main className="min-h-screen bg-[#f4f1e9] text-[#1b2921]">
      <SEO
        title="Orders and Customer Support | Bhumivera"
        description="Find information about payments, delivery, returns and help with a Bhumivera order."
        route="/purchase-protection"
      />
      <section className="bg-[#142019] px-5 py-24 text-white sm:px-8 sm:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="inline-flex items-center gap-2 border border-white/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#dce7c5]">
            <PackageCheck size={15} aria-hidden="true" /> Order support
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
            Clear information for your order.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            Check your order confirmation and the terms shown for your purchase. If you need help, our support team can review the details with you.
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
        <div className="grid gap-6 border-t border-[#26392c]/15 pt-8 sm:grid-cols-2 sm:gap-10">
          <div>
            <h2 className="font-serif text-2xl">Need help with a delivery?</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Check the latest tracking information first. If the status appears incorrect or your parcel has not arrived, contact support with your order number. The team will advise you on the next steps for your case.
            </p>
            <Link to="/order-tracking" className="mt-5 inline-flex min-h-11 items-center gap-2 border-b border-[#536b4d]/40 pb-1 text-xs font-semibold text-[#26392c]">
              Track an order <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div>
            <h2 className="font-serif text-2xl">Need help with a product?</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              For ingredients, directions and product-specific details, refer to the current product page and packaging. Contact support if you need help locating information.
            </p>
            <Link to="/contact" className="mt-5 inline-flex min-h-11 items-center gap-2 border-b border-[#536b4d]/40 pb-1 text-xs font-semibold text-[#26392c]">
              Contact support <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
