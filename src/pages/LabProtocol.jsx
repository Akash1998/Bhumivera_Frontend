import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { HOME_VISUAL_ASSETS } from '../data/bhumiveraUniqueData';

const questions = [
  {
    key: 'ingredients',
    label: 'Ingredients',
    question: 'What is actually inside each formula?',
    answer: 'Every product has its own transcribed ingredient list, calibrated pH level, and directions. Explore the Lab Science dossier before choosing.',
    link: '/science',
    linkLabel: 'Explore ingredient science',
  },
  {
    key: 'choosing',
    label: 'Choosing a ritual',
    question: 'Where should I begin?',
    answer: 'Begin with the cleanser or elixir that fits your skin type, or explore our full artisanal micro-batch catalog.',
    link: '/shop',
    linkLabel: 'Explore formulations',
  },
  {
    key: 'orders',
    label: 'Orders',
    question: 'Where can I follow an order?',
    answer: 'Use your order reference on the Order Tracking page to inspect warehouse digital weight-scan logs and courier milestones.',
    link: '/order-tracking',
    linkLabel: 'Track an order',
  },
];

export default function LabProtocol() {
  const [openQuestion, setOpenQuestion] = useState('');

  return (
    <main className="min-h-screen bg-[#14291F] pt-24 text-[#FAF7F2] font-sans">
      <SEO
        title="Inside Our Lab & Dispatch Protocol | Bhumivera"
        description="Cold-pressed extraction, patch-test protocol, tamper-evident dispatch and the public impact ledger behind every Bhumivera bottle."
        route="/lab"
      />

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-10">
        <p className="font-sub-gold text-xs font-bold uppercase tracking-[0.26em]">Real-Life Quality Benchmarks</p>
        <h1 className="mt-2 font-serif text-3xl font-bold sm:text-5xl">
          <span className="font-headline-gold">Inside Our Lab</span>{' '}
          <span className="font-headline-silver">&amp; Dispatch Protocol</span>
        </h1>
        <div className="gold-hairline my-3 w-24" />

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {HOME_VISUAL_ASSETS.realLifeFieldStudies.map(study => (
            <article key={study.id} className="flex flex-col overflow-hidden rounded-2xl border border-[#244A38] bg-[#102219]">
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#102219]">
                <img src={study.image} alt={study.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FCE096]">{study.tag}</span>
                <h2 className="mt-2 font-serif text-xl font-bold">{study.title}</h2>
                <p className="mt-1 text-xs font-medium text-[#DFD7C4]">{study.subtitle}</p>
                <p className="mt-2.5 text-xs font-light leading-6 text-[#9BB0A5]">{study.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#244A38]/50 bg-[#102219] py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-10">
          <p className="font-sub-gold flex items-center gap-2 text-xs font-bold uppercase tracking-[0.26em]">
            <Sparkles size={13} className="text-[#D4AF37]" /> Small-Batch Botanical Potency &amp; Origin
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
            <span className="font-headline-gold">Cornerstone Botanical</span>{' '}
            <span className="font-headline-silver">Actives</span>
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOME_VISUAL_ASSETS.ingredients.map(ing => (
              <article key={ing.name} className="overflow-hidden rounded-3xl border border-[#244A38] bg-[#14291F]">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <img src={ing.image} alt={ing.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${ing.tone} via-[#14291F]/40 to-transparent`} />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#14291F]/95 to-transparent p-5">
                    <h3 className="font-serif text-2xl font-bold">{ing.name}</h3>
                    <p className="mt-0.5 font-mono text-[11px] text-[#FCE096]">{ing.botanical}</p>
                    <p className="mt-2 text-xs font-light leading-5 text-[#DFD7C4]">{ing.note}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <Link to="/science" className="btn-silver-luxury mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider">
            Lab Science Dossier <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-10">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-[#D4AF37]/40 bg-[#102219]">
            <img
              src={HOME_VISUAL_ASSETS.stewardshipBanner}
              alt="Bhumivera copper hydrosol distillation and botanical craft"
              loading="lazy"
              decoding="async"
              className="aspect-[16/10] w-full object-cover opacity-85"
            />
            <div className="p-6">
              <span className="font-sub-gold text-[10px] font-bold uppercase tracking-widest">Public Ledger</span>
              <h3 className="mt-2 font-serif text-2xl font-bold">No impact claim without a receipt and a field record.</h3>
              <p className="mt-3 text-xs font-light leading-6 text-[#DFD7C4]">
                Inspect our public environmental ledger, native sapling nursery photographs, and riparian care records.
              </p>
              <Link to="/impact" className="btn-gold-luxury mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider">
                Open Public Impact Ledger <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-sub-gold text-xs font-bold uppercase tracking-[0.26em]">Practical Answers</p>
            <h2 className="font-serif text-3xl font-bold">
              <span className="font-headline-gold">Common Inquiries</span>
            </h2>
            {questions.map(item => {
              const isOpen = openQuestion === item.key;
              return (
                <div key={item.key} className="rounded-2xl border border-[#244A38] bg-[#102219] p-5">
                  <button
                    type="button"
                    onClick={() => setOpenQuestion(isOpen ? '' : item.key)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#FCE096]">{item.label}</span>
                      <h3 className="mt-1 font-serif text-lg font-bold">{item.question}</h3>
                    </div>
                    <span className="text-xl font-bold text-[#D4AF37]">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="mt-3 border-t border-[#244A38]/60 pt-3 text-xs font-light leading-6 text-[#DFD7C4]">
                      <p>{item.answer}</p>
                      <Link to={item.link} className="mt-3 inline-flex items-center gap-1.5 font-semibold text-[#FCE096]">
                        {item.linkLabel} <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
