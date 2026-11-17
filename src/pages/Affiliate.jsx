import React, { useEffect } from 'react';
import { ArrowRight, CheckCircle2, Handshake, Leaf, Scale, ShieldCheck, Sprout, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { AFFILIATE_PAGE_DATA } from '../data/bhumiveraUniqueData';
import { useAuth } from '../context/AuthContext';
import PromoterPortal from './affiliate/PromoterPortal';

const PARTNERSHIP_STEPS = [
  ['01', 'Start with alignment', 'We look at your point of view, audience relationship, product curiosity and nature-minded values—not follower count alone.'],
  ['02', 'Agree before creating', 'Campaign scope, product gifting, creator rate, customer offer, usage rights and timelines are discussed before either side commits.'],
  ['03', 'Create in your own voice', 'Use the product, share an honest experience, disclose incentives and tell your community what you genuinely learned.'],
  ['04', 'Grow from real outcomes', 'Eligible delivered orders are tracked individually. We share what is working, listen to feedback and build the next step together.'],
];

const PARTNER_VALUES = [
  {
    icon: Handshake,
    title: 'A relationship, not a one-off reel',
    description: 'We are not looking to send a product for one post and disappear. We want thoughtful partners who want to learn, contribute and grow with the brand and their community over time.',
  },
  {
    icon: Wallet,
    title: 'Order economics in the open',
    description: 'Your agreed customer offer and profit-share rate are visible in your portal. Every attributed order has a calculation record: tax-exclusive revenue, costs, contribution, your commission and the brand-retained contribution.',
  },
  {
    icon: Sprout,
    title: 'Nature, with proof not slogans',
    description: 'Creators can help their communities discover nature-minded choices and verified impact projects. Contributions are reported as funded only when actually collected; we do not claim a fixed share of every order.',
  },
];

export default function Affiliate() {
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (user) return <PromoterPortal />;

  return (
    <main className="min-h-screen bg-[#07140e] pb-20 font-sans text-[#e2e8f0] selection:bg-[#d4af37]/30 selection:text-white">
      <SEO
        title="Bhumivera Creator Partnership | Grow Together"
        description="A long-term, transparent creator partnership rooted in honest product education, shared growth and nature-minded community."
        route="/affiliate"
      />

      <header className="relative isolate overflow-hidden px-4 py-24 text-center text-white sm:py-32">
        <div className="absolute inset-0 -z-20 opacity-25">
          <img src={AFFILIATE_PAGE_DATA.heroImage} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#07140e]/95 via-[#07140e]/80 to-[#07140e]"/>
        <div className="mx-auto max-w-4xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#0d2017] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fce096]">
            <Leaf size={14}/> Creator partnership · built for the long term
          </span>
          <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-6xl">
            Not one post and goodbye.<br/><span className="text-[#e8cd75]">Let’s grow together.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#cbd5e1] sm:text-base">
            We want to build with creators who care about honest education, meaningful community and a more thoughtful relationship with nature. This is a shared journey—not a free-product exchange or a guaranteed-income promise.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/promotions/dashboard#apply" className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#102219] transition hover:bg-[#fce096]">
              Explore the partnership <ArrowRight size={15}/>
            </Link>
            <Link to="/legal/warranty-affiliate-b2b" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#e2e8f0] transition hover:border-[#d4af37]/60">
              <Scale size={14}/> Read partner terms
            </Link>
          </div>
        </div>
      </header>

      <section aria-labelledby="partnership-model-heading" className="mx-auto mt-12 max-w-7xl px-4">
        <div className="rounded-3xl border border-[#d4af37]/30 bg-gradient-to-br from-[#143a29] via-[#0d261b] to-[#081a12] p-6 shadow-2xl sm:p-10">
          <div className="max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]">How we work together</span>
            <h2 id="partnership-model-heading" className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">A clear relationship, from the first conversation</h2>
            <p className="mt-3 text-sm leading-6 text-[#cbd5e1]">No surprise deliverables. No hidden commission basis. No claim that every sale funds a nature project. Both sides know the terms and the evidence behind the numbers.</p>
          </div>
          <ol className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {PARTNERSHIP_STEPS.map(([number, title, description]) => (
              <li key={number} className="rounded-2xl border border-white/10 bg-[#07140e]/55 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 text-xs font-bold text-[#fce096]">{number}</span>
                <h3 className="mt-4 font-serif text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#cbd5e1]">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="open-book-heading" className="mx-auto mt-8 max-w-7xl px-4">
        <div className="rounded-3xl border border-white/10 bg-[#0d261b]/70 p-6 sm:p-10">
          <div className="max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]">Open-book order ledger</span>
            <h2 id="open-book-heading" className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">Know what each order does—and does not—earn</h2>
            <p className="mt-3 text-sm leading-6 text-[#cbd5e1]">There is no flat rupee amount per order. The exact amount varies with the products, discount, tax, inventory cost, fulfillment, return reserve and payment method. Your approved share rate and customer offer are shown in your creator portal before you promote.</p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-[#d4af37]/25 bg-[#07140e]/70 p-5">
              <h3 className="font-serif text-lg font-bold text-white">The calculation, line by line</h3>
              <ol className="mt-4 space-y-3 text-xs leading-5 text-[#cbd5e1]">
                <li><strong className="text-[#fce096]">1. Revenue:</strong> eligible merchandise revenue after discounts, excluding GST.</li>
                <li><strong className="text-[#fce096]">2. Contribution:</strong> revenue less actual product cost, fulfillment, return-to-origin reserve and applicable online payment fee.</li>
                <li><strong className="text-[#fce096]">3. Creator share:</strong> your agreed percentage of positive contribution, capped only when needed to preserve the program’s minimum retained margin.</li>
                <li><strong className="text-[#fce096]">4. Brand retained:</strong> contribution remaining after your commission, before company overhead and other expenses—not company net profit.</li>
              </ol>
              <p className="mt-4 border-t border-white/10 pt-4 text-[11px] leading-5 text-[#9ca3af]">The portal shows the recorded rupee amounts for every attributed order, including any margin-safeguard adjustment. Product cost is shown as an order total; supplier identities and invoices remain private.</p>
            </div>

            <div className="rounded-2xl border border-[#d4af37]/25 bg-[#07140e]/70 p-5">
              <h3 className="font-serif text-lg font-bold text-white">The rules are visible too</h3>
              <ul className="mt-4 space-y-3 text-xs leading-5 text-[#cbd5e1]">
                <li className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#d4af37]"/>Only qualifying, delivered orders earn commission.</li>
                <li className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#d4af37]"/>Cancelled or returned orders are reversed; payouts are processed manually and recorded.</li>
                <li className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#d4af37]"/>There is no guaranteed order volume, income or product gifting.</li>
                <li className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#d4af37]"/>Your personal rate and audience offer are shown in your portal; no one-size-fits-all rate is implied here.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Partnership values" className="mx-auto mt-8 grid max-w-7xl gap-4 px-4 md:grid-cols-3">
        {PARTNER_VALUES.map(({ icon: Icon, title, description }) => (
          <article key={title} className="rounded-2xl border border-[#d4af37]/20 bg-[#0d261b]/65 p-6 shadow-lg">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#fce096]">{React.createElement(Icon, { size: 20 })}</span>
            <h2 className="mt-4 font-serif text-xl font-bold text-white">{title}</h2>
            <p className="mt-2 text-xs leading-6 text-[#cbd5e1]">{description}</p>
          </article>
        ))}
      </section>

      <section aria-labelledby="partner-fit-heading" className="mx-auto mt-8 max-w-7xl px-4">
        <div className="grid gap-5 rounded-3xl border border-[#d4af37]/25 bg-[#0d261b]/70 p-6 sm:p-10 lg:grid-cols-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]">Who belongs here</span>
            <h2 id="partner-fit-heading" className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">Creators who want to contribute, not just collect</h2>
            <p className="mt-3 text-sm leading-6 text-[#cbd5e1]">We welcome emerging voices and established creators. Fit is about the care you bring to your audience, your curiosity and your willingness to build something honest—not your reach alone.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['A good fit', 'You want to learn the products, create in your own voice, share transparently and grow a long-term community relationship.'],
              ['Not a free-product offer', 'Gifting is selective, campaign-specific and never guaranteed. Applying does not promise a kit, commission, paid post or income.'],
              ['Nature is a practice', 'We value thoughtful education and verified impact. We will not ask you to repeat unsupported sustainability or medical claims.'],
              ['Clear agreements', 'Scope, timing, rates, disclosure and content rights should be clear before any campaign begins.'],
            ].map(([title, description]) => (
              <article key={title} className="rounded-xl border border-white/10 bg-[#07140e]/60 p-4">
                <h3 className="text-sm font-bold text-[#fce096]">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#cbd5e1]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="nature-ledger-heading" className="mx-auto mt-8 max-w-7xl px-4">
        <div className="flex flex-col gap-5 rounded-3xl border border-emerald-300/20 bg-gradient-to-br from-[#103323] to-[#091a12] p-6 sm:p-9 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200"><Sprout size={14}/> Nature and accountability</span>
            <h2 id="nature-ledger-heading" className="mt-2 font-serif text-2xl font-bold text-white">Share the purpose. Show the proof.</h2>
            <p className="mt-3 text-sm leading-6 text-[#cbd5e1]">Creators may invite their audience to explore impact projects or make a voluntary contribution. We report money as funded only after it is recorded as collected. We do not claim a fixed nature allocation from every sale unless a specific, verifiable campaign says so.</p>
          </div>
          <Link to="/impact" className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-emerald-200/30 px-5 py-3 text-xs font-bold text-emerald-100 transition hover:bg-emerald-100/10">
            Explore impact reporting <ArrowRight size={14}/>
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-8 flex max-w-7xl flex-col items-start justify-between gap-5 rounded-3xl border border-[#d4af37]/30 bg-[#0d261b]/75 p-6 sm:p-9 md:flex-row md:items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]"><ShieldCheck size={14}/> Make it real together</span>
          <h2 className="mt-2 font-serif text-2xl font-bold text-white">Ready to build beyond a single post?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#cbd5e1]">Share your perspective and what you hope to contribute. We review for fit, honesty and intent; there is no follower minimum and no fee to apply.</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link to="/promotions/dashboard#apply" className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-5 py-3 text-xs font-bold text-[#102219] hover:bg-[#fce096]">Start an application <ArrowRight size={14}/></Link>
          <Link to="/legal/warranty-affiliate-b2b" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-xs font-semibold text-white hover:border-[#d4af37]/50"><Scale size={14}/> Partner terms</Link>
        </div>
      </section>
    </main>
  );
}
