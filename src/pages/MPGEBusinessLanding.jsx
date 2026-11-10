import React from 'react';
import { ArrowRight, BriefcaseBusiness, ClipboardList, MessageCircle } from 'lucide-react';

const phoneNumber = '+917430985647';
const whatsappNumber = '917430985647';
const whatsappMessage = encodeURIComponent(
  'Hello, I would like to request current written information about any available work, supply, or production arrangement.'
);

const points = [
  {
    title: 'Ask what is currently available',
    copy: 'Availability, location, eligibility and the nature of any work or supply arrangement must be confirmed directly before you decide whether to proceed.',
  },
  {
    title: 'Request the full written terms',
    copy: 'Ask for the responsible legal entity, the scope of work, all costs, payment method and timing, quality criteria, collection arrangements, and cancellation terms in writing.',
  },
  {
    title: 'Check requirements independently',
    copy: 'Licensing, registration, tax and other requirements depend on the activity and location. Confirm them with the relevant authority or an appropriately qualified adviser.',
  },
];

export default function MPGEBusinessLanding() {
  return (
    <main className="min-h-screen bg-[#070a0e] text-[#e2e8f0] pb-24 font-sans selection:bg-[#d4af37]/30 selection:text-white">
      {/* Hero Section */}
      <section className="bg-[#070a0e] border-b border-[#d4af37]/20 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="font-sub-gold inline-flex items-center gap-2 border border-[#d4af37]/40 bg-[#0d1520] px-3.5 py-1.5 text-[10px] tracking-[0.2em]">
            <BriefcaseBusiness size={14} className="text-[#d4af37]" aria-hidden="true" /> Business Enquiries &amp; Supply Desk
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-3xl sm:text-5xl lg:text-6xl uppercase tracking-wider font-normal leading-tight">
            <span className="font-headline-gold">Business Enquiries</span>{' '}
            <span className="font-headline-silver">&amp; Supply Desk</span>
          </h1>
          <div className="gold-hairline my-5 max-w-xs" />
          <p className="mt-4 max-w-2xl text-xs sm:text-sm leading-7 text-[#cbd5e1] sm:text-base">
            Contact us to request current information about any available production, cultivation or craft opportunity. Details must be confirmed in writing before you make a decision.
          </p>
          <div className="mt-7 border-l-2 border-[#d4af37] bg-[#0d1520] p-4 text-xs leading-6 text-[#94a3b8] sm:p-5 sm:text-sm rounded-r-xl border border-white/5">
            This page does not confirm current openings, eligibility, income, material delivery, product collection, buyback, licensing coverage or any guaranteed outcome. Do not pay a fee or begin work based only on a phone or WhatsApp conversation; request and review complete written terms first.
          </div>
          <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row">
            <a href={`tel:${phoneNumber}`} className="btn-gold-luxury inline-flex min-h-12 items-center justify-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-xl">
              Call to Enquire <ArrowRight size={15} aria-hidden="true" />
            </a>
            <a href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="btn-silver-luxury inline-flex min-h-12 items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[#cbd5e1]">
              <MessageCircle size={15} aria-hidden="true" className="text-[#d4af37]" /> WhatsApp Desk
            </a>
          </div>
        </div>
      </section>

      {/* Guidance Points Section */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="font-sub-gold text-[10px] tracking-[0.2em] block">Before Proceeding</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-white sm:text-4xl">Get the details. Take time to review them.</h2>
            <div className="gold-hairline my-4 max-w-xs" />
            <p className="mt-4 text-xs sm:text-sm leading-7 text-[#94a3b8]">
              An enquiry is not an offer, contract, employment relationship, agency appointment or promise of income. The arrangement, if any, depends on the written terms agreed by the parties and applicable requirements.
            </p>
          </div>
          <div className="space-y-7">
            {points.map((point, index) => (
              <article key={point.title} className="two-tone-card grid gap-4 border border-[#d4af37]/25 bg-[#0d1520] p-6 rounded-2xl sm:grid-cols-[48px_1fr] transition-all hover:border-[#d4af37]/50">
                <span className="font-serif text-2xl font-bold text-[#fce096]">0{index + 1}</span>
                <div>
                  <h3 className="font-serif text-xl text-white font-bold">{point.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-7 text-[#cbd5e1]">{point.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Action Section */}
      <section className="px-5 py-12 sm:px-8 sm:py-16">
        <div className="two-tone-panel-gold mx-auto max-w-4xl text-center rounded-3xl p-8 sm:p-12 shadow-xl">
          <ClipboardList size={28} className="mx-auto text-[#fce096]" aria-hidden="true" />
          <h2 className="mt-4 font-serif text-2xl text-white sm:text-3xl font-bold">Need Information in Writing?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm leading-7 text-[#cbd5e1]">
            Ask for the complete terms and time to review them. If any term is unclear, seek independent advice before signing, paying or supplying goods.
          </p>
          <a href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="btn-gold-luxury mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-xl">
            Request Formal Information <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
