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
    <main className="min-h-screen bg-[#f6f0e4] text-[#2c2c2c]">
      <section className="bg-[#1e1510] px-5 py-20 text-[#f6f0e4] sm:px-8 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="inline-flex items-center gap-2 border border-[#d4af37]/35 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]">
            <BriefcaseBusiness size={14} aria-hidden="true" /> Business enquiries
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
            Ask us about possible work or supply arrangements.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#e2d8c8]/80 sm:text-base">
            Contact us to request current information about any available production, cultivation or craft opportunity. Details must be confirmed in writing before you make a decision.
          </p>
          <div className="mt-7 border-l-2 border-[#d4af37] bg-white/[0.04] p-4 text-xs leading-6 text-white/70 sm:p-5 sm:text-sm">
            This page does not confirm current openings, eligibility, income, material delivery, product collection, buyback, licensing coverage or any guaranteed outcome. Do not pay a fee or begin work based only on a phone or WhatsApp conversation; request and review complete written terms first.
          </div>
          <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row">
            <a href={`tel:${phoneNumber}`} className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#d4af37] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#1e1510] hover:bg-[#f6f0e4]">
              Call to enquire <ArrowRight size={15} aria-hidden="true" />
            </a>
            <a href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/35 px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-white/10">
              <MessageCircle size={15} aria-hidden="true" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b4226]">Before proceeding</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-[#1e1510] sm:text-4xl">Get the details. Take time to review them.</h2>
            <p className="mt-4 text-sm leading-7 text-[#4a3628]">
              An enquiry is not an offer, contract, employment relationship, agency appointment or promise of income. The arrangement, if any, depends on the written terms agreed by the parties and applicable requirements.
            </p>
          </div>
          <div className="space-y-7">
            {points.map((point, index) => (
              <article key={point.title} className="grid gap-4 border-t border-[#6b4226]/20 pt-5 sm:grid-cols-[48px_1fr]">
                <span className="font-serif text-2xl text-[#6b4226]/60">0{index + 1}</span>
                <div>
                  <h3 className="font-serif text-xl text-[#1e1510]">{point.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#4a3628]">{point.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#ebe1d1] px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <ClipboardList size={26} className="mx-auto text-[#6b4226]" aria-hidden="true" />
          <h2 className="mt-4 font-serif text-2xl text-[#1e1510] sm:text-3xl">Need information in writing?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#4a3628]">
            Ask for the complete terms and time to review them. If any term is unclear, seek independent advice before signing, paying or supplying goods.
          </p>
          <a href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 border-b border-[#6b4226]/40 pb-1 text-xs font-bold uppercase tracking-[0.12em] text-[#6b4226]">
            Request information <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
