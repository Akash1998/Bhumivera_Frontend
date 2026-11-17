import React, { useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, Gift, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import PromoterPortal from './affiliate/PromoterPortal';

const STEPS = [
  ['01', 'Share your intent', 'Tell us what you want to teach or build with your community and why this relationship matters to you.'],
  ['02', 'Find the fit', 'Our team reviews content, audience fit and shared values—not follower count alone.'],
  ['03', 'Agree, then create', 'Before a campaign, both sides confirm the scope, offer, rate, timing and content rights. Then we learn and grow together.'],
];

const COLLABORATIONS = [
  {
    icon: Gift,
    title: 'Selective product experience',
    label: 'Gifting · campaign-specific',
    description: 'A product may be offered when there is a clear shared campaign and genuine product fit. Gifting is selective, never guaranteed, and is not the reason to join.',
    accent: 'text-[#F0D98A]',
  },
  {
    icon: Sparkles,
    title: 'Shared community growth',
    label: 'Order-based profit share',
    description: 'Your agreed customer offer and creator rate are shown in your portal. Each attributed order has a recorded breakdown; actual commission depends on that order’s contribution and status.',
    accent: 'text-emerald-200',
  },
];

const PERKS = [
  ['A visible earnings ledger', 'See the recorded revenue, costs, contribution, creator commission and brand-retained contribution for each order.'],
  ['A relationship that can evolve', 'Share feedback, learn from your community and shape the next campaign together.'],
  ['Room for your own voice', 'We ask for honest experience and accurate information—not scripted praise or guaranteed results.'],
  ['Nature with accountability', 'Invite your audience to verified impact activity; contributions are reported as funded only when collected.'],
];

const PRODUCT_SPECS = [
  {
    name: 'Sea Buckthorn Face Wash',
    slug: 'himalayan-seabuckthorn-luxury-face-wash',
    alt: 'Bhumivera Sea Buckthorn face wash product',
    fallbackImage: '/images/products/bhumivera-seabuckthorn-face-wash-front.webp',
  },
  {
    name: 'Botanical 2-in-1 Shampoo',
    slug: 'luxury-2-in-1-botanical-shampoo-conditioner',
    alt: 'Bhumivera botanical shampoo and conditioner product',
    fallbackImage: '/images/products/bhumivera-royal-shampoo-front.webp',
  },
  {
    name: 'Artisanal Cleansing Bar',
    slug: 'artisanal-charcoal-handmade-soap',
    alt: 'Bhumivera handmade charcoal cleansing bar',
    fallbackImage: '/images/products/bhumivera-charcoal-cleansing-bar-front.webp',
  },
  {
    name: 'Seven-Tulsi Drops',
    slug: 'kalpvriksh-satva-tulsi-7-tulsi-extract',
    alt: 'Bhumivera Kalpvriksh Satva Tulsi drops',
    fallbackImage: '/images/products/bhumivera-seven-tulsi-drops-front.webp',
  },
];

const PROMOTION_PRODUCTS = PRODUCT_SPECS
  .filter(product => product.fallbackImage)
  .map(product => ({ ...product, image: product.fallbackImage }));

const FAQS = [
  {
    q: 'Is there a minimum follower count?',
    a: 'No fixed minimum. We review audience fit, content quality, consistency, and engagement—not follower count alone.',
  },
  {
    q: 'What kind of collaboration can I choose?',
    a: 'The current track is an ongoing creator partnership with order-based profit sharing. Product gifting is campaign-specific and not guaranteed. Paid UGC and trial-order reimbursements are not currently open.',
  },
  {
    q: 'Do I have to pay to apply or buy a product?',
    a: 'There is no application fee and you do not need to buy a product to apply. If selected for product gifting, the campaign scope and delivery details are shared before you agree.',
  },
  {
    q: 'When will I hear back, and when would a kit ship?',
    a: 'We aim to review applications within 12–24 hours. A product kit is only discussed after approval and selection for a campaign; the dispatch estimate is confirmed with you before shipping.',
  },
  {
    q: 'When do you ask for WhatsApp and delivery details?',
    a: 'Only after approval, and only if needed for a campaign. We will request your WhatsApp number and delivery city/pincode separately; they are not required to apply.',
  },
  {
    q: 'Is this a free-product or one-post program?',
    a: 'No. We are looking for creators who want to contribute to an ongoing relationship with their community and Bhumivera. Product gifting is selective, never guaranteed, and an application is not a request for a free kit.',
  },
  {
    q: 'How are affiliate orders and commissions tracked?',
    a: 'Your promoter desk shows the stored order-level calculation: revenue excluding tax, discounts, product cost total, fulfillment and return reserves, payment fee, contribution, your commission and the brand-retained contribution. Commissions depend on eligible, delivered orders; cancellations or returns are reversed and payouts are recorded after manual processing.',
  },
  {
    q: 'Does a fixed part of every order go to nature?',
    a: 'No fixed percentage is promised. Customers may choose a contribution separately, and we report it as funded only after it is recorded as collected. Creators can help their communities discover verified impact initiatives without making unsupported funding claims.',
  },
  {
    q: 'What should I disclose in a creator post?',
    a: 'Be clear when a product was gifted or a link may earn commission. Use applicable #gifted or #ad disclosures, follow the campaign brief, and stick to substantiated product information—never make medical or guaranteed-result claims.',
  },
];

export default function Promotions() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const emailInput = useRef(null);
  const [email, setEmail] = useState('');
  if (loading) {
    return <main className="min-h-screen bg-[#07140e] px-4 py-20 text-center text-[#9BB0A5]">Loading your account…</main>;
  }

  if (user) return <PromoterPortal />;

  const registrationPath = email.trim()
    ? `/register?email=${encodeURIComponent(email.trim())}`
    : '/register';
  const accountState = { from: '/promotions' };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07140e] px-4 py-8 text-[#DFD7C4] sm:py-12">
      <SEO
        title="Bhumivera Creator Partnership | Grow Together"
        description="Build a long-term Bhumivera creator partnership through honest product education, open order economics and nature-minded community."
        keywords="Bhumivera creator partnership, skincare creator program India, transparent creator earnings, botanical skincare community"
        route="/promotions"
        ogImage="/images/products/bhumivera-seabuckthorn-luxury-face-wash.webp"
        faqs={FAQS}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-32 h-[32rem] w-[32rem] rounded-full bg-emerald-700/15 blur-[120px]"/>
        <div className="absolute -right-36 top-[42rem] h-[30rem] w-[30rem] rounded-full bg-[#D4AF37]/[0.07] blur-[120px]"/>
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8">
        <header className="relative overflow-hidden rounded-[2rem] border border-[#D4AF37]/25 bg-gradient-to-br from-[#143A29]/95 via-[#0D261B]/90 to-[#081A12]/95 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-10">
          <div aria-hidden="true" className="absolute -right-12 -top-20 h-72 w-72 rounded-full border border-[#D4AF37]/10 bg-[#D4AF37]/[0.03]"/>
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FCE096]">
                <Leaf size={13}/> Creator partnership · built for the long term
              </p>
              <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-tight text-white sm:text-6xl">
                Not one post and goodbye. <span className="text-[#E8CD75]">Let’s grow together.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#C5D8CC] sm:text-base">
                We want creators who care about honest education, a thriving community and a more thoughtful relationship with nature. This is a shared journey—not a free-product exchange or a guaranteed-income promise.
              </p>
              <p className="mt-4 max-w-2xl border-l-2 border-[#D4AF37]/55 pl-4 font-serif text-sm italic leading-6 text-[#F0D98A]">
                “Create with us, learn with us, and grow with your community.”
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['No fixed follower minimum', 'Honest intent matters', 'No application fee'].map(item => (
                  <span key={item} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-[#E7EEE8]">
                    <CheckCircle2 size={14} className="text-[#C4D99A]"/> {item}
                  </span>
                ))}
              </div>
              <a href="#apply" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-[#102219] transition hover:bg-[#FCE096]">
                Explore the partnership <ArrowRight size={16}/>
              </a>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute inset-5 rounded-[2rem] bg-[#D4AF37]/10 blur-2xl"/>
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0A1D14]/70 p-4 shadow-2xl backdrop-blur-lg">
                <img
                  src={PROMOTION_PRODUCTS[0].image}
                  alt={PROMOTION_PRODUCTS[0].alt}
                  width="640"
                  height="640"
                  fetchpriority="high"
                  onError={event => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = PROMOTION_PRODUCTS[0].image;
                  }}
                  className="aspect-[4/3] w-full rounded-2xl bg-[#10251A] object-contain p-3 sm:p-4"
                />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">Built on thoughtful rituals</p>
                    <p className="mt-1 font-serif text-lg font-bold text-white">Stories grounded in use</p>
                  </div>
                  <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07] px-3 py-2 text-[10px] font-semibold text-[#F0D98A]">Est. 2016 lineage</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section aria-labelledby="creator-steps-title" className="rounded-[1.75rem] border border-white/10 bg-[#0D261B]/65 p-5 shadow-xl backdrop-blur-xl sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">A clear path, no guesswork</p>
              <h2 id="creator-steps-title" className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">How the partnership begins</h2>
            </div>
            <p className="text-xs text-[#9BB0A5]">Our review aim: 12–24 hours</p>
          </div>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {STEPS.map(([number, title, description], index) => (
              <li key={number} className="relative rounded-2xl border border-white/10 bg-black/15 p-5">
                {index < STEPS.length - 1 && <span aria-hidden="true" className="absolute -right-4 top-9 z-10 hidden h-px w-4 bg-gradient-to-r from-[#D4AF37]/50 to-transparent md:block"/>}
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10 text-xs font-bold text-[#FCE096]">{number}</span>
                <h3 className="mt-4 font-serif text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#B7C9BD]">{description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="collaboration-title" className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[1.75rem] border border-[#D4AF37]/20 bg-gradient-to-br from-[#143A29]/80 to-[#0A1D14]/80 p-6 backdrop-blur-xl sm:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Current model · shared growth</p>
            <h2 id="collaboration-title" className="mt-3 font-serif text-3xl font-bold text-white">Build the relationship before the post.</h2>
            <p className="mt-3 text-sm leading-6 text-[#B7C9BD]">
              Our active track is an ongoing creator partnership with order-based profit sharing. We want to learn with you, support honest product education and build a relationship that can grow beyond one campaign.
            </p>
            <p className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 text-xs leading-5 text-[#C5D8CC]">
              Product gifting is selective and never guaranteed. It is not a reward for applying or the purpose of the partnership. No purchase is needed to apply, and there is no fixed follower threshold.
            </p>
            <p className="mt-3 rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.06] p-4 text-xs leading-5 text-[#F0D98A]">
              <strong className="uppercase tracking-wider">Before anything goes live:</strong> You can review your customer offer, approved share rate, campaign scope, timing and content rights. Your portal records the actual calculation for each attributed order.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {COLLABORATIONS.map(({ icon: Icon, title, label, description, accent }) => (
              <article key={title} className="rounded-[1.5rem] border border-white/10 bg-[#0D261B]/65 p-5 shadow-lg backdrop-blur-xl sm:p-6">
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/20 ${accent}`}>{React.createElement(Icon, { size: 20 })}</span>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">{label}</p>
                <h3 className="mt-2 font-serif text-xl font-bold text-white">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#B7C9BD]">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="creator-economics-title" className="rounded-[1.75rem] border border-[#D4AF37]/30 bg-gradient-to-br from-[#143A29]/75 to-[#081A12]/90 p-6 shadow-xl sm:p-8">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">No mystery math</p>
            <h2 id="creator-economics-title" className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">See what each order contributes</h2>
            <p className="mt-3 text-sm leading-6 text-[#C5D8CC]">There is no guaranteed flat amount per order. Your approved share rate is applied to actual positive contribution, after order-specific taxes, discounts and costs. The creator portal shows each saved input, your commission and the contribution Bhumivera retains before overhead.</p>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              ['Contribution', 'Discounted merchandise revenue excluding GST, less product cost, fulfillment, return reserve and applicable payment fees.'],
              ['Your commission', 'Your agreed rate applied to positive contribution, subject to the disclosed minimum-margin safeguard.'],
              ['What Bhumivera retains', 'Contribution left after creator commission; it is not company net profit and is not described as an automatic nature donation.'],
            ].map(([title, description]) => (
              <article key={title} className="rounded-xl border border-white/10 bg-[#07140e]/60 p-4">
                <h3 className="text-sm font-bold text-[#F0D98A]">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#C5D8CC]">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <p className="max-w-3xl text-[11px] leading-5 text-[#9BB0A5]">Supplier identities and invoices stay private; the order-level product cost is visible. Commissions are pending until delivery and reversals appear in the ledger.</p>
            <Link to="/affiliate" className="inline-flex items-center gap-2 text-xs font-bold text-[#F0D98A] hover:text-white">Read the full partnership and calculation terms <ArrowRight size={14}/></Link>
          </div>
        </section>

        <section aria-labelledby="botanical-collection-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">A first look at the ritual shelf</p>
              <h2 id="botanical-collection-title" className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">Stories rooted in real products</h2>
            </div>
            <Link to="/science" className="inline-flex items-center gap-2 text-xs font-semibold text-[#F0D98A] hover:text-white">Explore our formulation approach <ArrowRight size={14}/></Link>
          </div>
          <div className={`mx-auto mt-5 grid w-full gap-4 ${
            PROMOTION_PRODUCTS.length >= 5
              ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
              : PROMOTION_PRODUCTS.length === 4
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                : PROMOTION_PRODUCTS.length === 3
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'max-w-3xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'
          }`}>
            {PROMOTION_PRODUCTS.map(product => (
              <article key={product.name} className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D261B]/70 shadow-lg backdrop-blur-lg">
                <div className="aspect-[4/3] w-full bg-[#10251A] p-3">
                  <img
                    src={product.image}
                    alt={product.alt}
                    width="480"
                    height="480"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full rounded-xl object-contain object-center"
                  />
                </div>
                <h3 className="mt-auto flex min-h-12 items-center px-4 py-3 text-xs font-semibold leading-5 text-[#E7EEE8]">{product.name}</h3>
              </article>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-5 text-[#82998D]">Product availability and gifting depend on the campaign. Creator content must reflect verified product information and avoid medical or guaranteed-result claims.</p>
        </section>

        <section aria-labelledby="creator-perks-title">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">What makes it a partnership</p>
            <h2 id="creator-perks-title" className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">Clarity, contribution and room to grow</h2>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PERKS.map(([title, description], index) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-lg">
                <span className="text-xs font-bold tracking-widest text-[#D4AF37]">0{index + 1}</span>
                <h3 className="mt-3 font-serif text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#AFC2B5]">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="apply" aria-labelledby="apply-title" className="scroll-mt-8 grid items-start gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[1.75rem] border border-[#D4AF37]/20 bg-[#0D261B]/65 p-6 backdrop-blur-xl sm:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Your next small step</p>
            <h2 id="apply-title" className="mt-3 font-serif text-3xl font-bold text-white">Start with your account</h2>
            <p className="mt-3 text-sm leading-6 text-[#B7C9BD]">
              Sign in or create a verified Bhumivera account. Then tell us about your platform, content and audience—and what a meaningful, nature-minded partnership could look like beyond a single post.
            </p>
            <ul className="mt-5 space-y-3 text-xs leading-5 text-[#C5D8CC]">
              <li className="flex gap-2"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#D4AF37]"/>We review intent, audience fit and honesty—not follower count alone.</li>
              <li className="flex gap-2"><Clock3 size={15} className="mt-0.5 shrink-0 text-[#D4AF37]"/>We aim to send an update within 12–24 hours.</li>
              <li className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#D4AF37]"/>WhatsApp and delivery city/pincode are requested only after approval if a campaign needs them.</li>
            </ul>
          </div>

          <section className="rounded-[1.75rem] border border-white/10 bg-[#102A1E]/70 p-5 shadow-2xl backdrop-blur-xl sm:p-8" aria-label="Create or sign in to apply">
            <div className="flex items-start gap-3 rounded-xl border border-[#D4AF37]/20 bg-black/20 p-4">
              <Clock3 size={18} className="mt-0.5 shrink-0 text-[#D4AF37]"/>
              <p className="text-xs leading-5 text-[#C8D5CC]">
                Your application and promoter code remain inactive until approved. After account setup, we will ask for your partnership intent; gifting is selective and considered separately for specific campaigns.
              </p>
            </div>

            <form
              className="mt-6 space-y-4"
              onSubmit={event => {
                event.preventDefault();
                navigate(registrationPath, { state: accountState });
              }}
            >
              <label htmlFor="promotions-email" className="block space-y-2 text-sm font-semibold text-[#E7EEE8]">
                Email for your Bhumivera account
                <input
                  id="promotions-email"
                  ref={emailInput}
                  required
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-[#07140e]/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#82998D] focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                />
                <span className="block text-xs font-normal leading-5 text-[#9BB0A5]">We use the verified account to keep your application and status together.</span>
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 text-sm font-bold text-[#102219] transition hover:bg-[#FCE096]">
                  Create and verify account <ArrowRight size={15}/>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!emailInput.current?.reportValidity()) return;
                    navigate('/login', { state: { ...accountState, email: email.trim() } });
                  }}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white transition hover:border-[#D4AF37]/60 hover:bg-white/[0.04]"
                >
                  I already have an account
                </button>
              </div>
            </form>

            <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-[#9BB0A5]">
              By applying, you agree to follow the <Link to="/legal/warranty-affiliate-b2b" className="font-semibold text-[#F0D98A] underline underline-offset-2">Bhumivera partner terms</Link>. An application is not a promise of acceptance, product gifting, paid work, orders, or earnings.
            </p>
          </section>
        </section>

        <section aria-labelledby="creator-faq-title" className="rounded-[1.75rem] border border-white/10 bg-[#0D261B]/60 p-5 backdrop-blur-xl sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Clear answers before you apply</p>
          <h2 id="creator-faq-title" className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">Creator partnership FAQs</h2>
          <div className="mt-5 divide-y divide-white/10">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-[#E7EEE8] marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]">
                  {q}
                  <span aria-hidden="true" className="text-lg text-[#D4AF37] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-4xl text-xs leading-6 text-[#AFC2B5]">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="pb-6 text-center text-[11px] leading-5 text-[#82998D]">
          A partnership is built on honest recommendations. Follow applicable advertising disclosures and the <Link to="/legal/warranty-affiliate-b2b" className="text-[#F0D98A] underline underline-offset-2">Bhumivera partner terms</Link>.
        </p>
      </div>
    </main>
  );
}
