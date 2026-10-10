import { ArrowRight, FileText, PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function ProvenanceEngine() {
  return (
    <main className="min-h-screen bg-[#f4f1e9] text-[#1b2921]">
      <SEO
        title="Product Information | Bhumivera"
        description="Find product-specific details and learn where to check the information supplied with your Bhumivera item."
        route="/provenance-engine"
      />
      <section className="bg-[#142019] px-5 py-24 text-white sm:px-8 sm:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="inline-flex items-center gap-2 border border-white/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#dce7c5]">
            <PackageSearch size={15} aria-hidden="true" /> Product information
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
            Check the details for the item you have.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            Product names, ingredient information, directions and other details can vary by item. Use the current product page and packaging for the information that applies to your purchase.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <article className="border-t border-[#536b4d]/35 pt-5">
          <FileText size={22} className="text-[#536b4d]" aria-hidden="true" />
          <h2 className="mt-4 font-serif text-2xl sm:text-3xl">Use current product information</h2>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            Review the specific product page and the label supplied with your item. If information differs or is unclear, contact customer support with the product name and order details so the team can help check.
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            Botanical names and ingredient descriptions do not, by themselves, verify a product’s formula, sourcing, quality, safety, certification or expected results.
          </p>
        </article>

        <article className="border-t border-[#536b4d]/35 pt-5">
          <h2 className="font-serif text-2xl sm:text-3xl">No live batch authentication here</h2>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            This website does not currently connect a batch code or serial number to an independently maintained product record. A code entered on this page cannot establish authenticity, manufacturing details, testing, certification or ingredient origin.
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            We will provide batch-specific information here only when the underlying records and verification process are available and can be checked.
          </p>
          <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row">
            <Link to="/shop" className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#26392c] px-4 py-3 text-xs font-semibold text-white hover:bg-[#40563f]">
              Browse products <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link to="/contact" className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#536b4d]/35 px-4 py-3 text-xs font-semibold text-[#26392c] hover:bg-white">
              Ask customer support
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
