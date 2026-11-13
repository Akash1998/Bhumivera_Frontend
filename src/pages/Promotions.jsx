import React, { useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, Gift, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import PromoterPortal from './affiliate/PromoterPortal';

const STEPS = [
  ['01', 'Apply', 'Sign in, then share your profile, content niche, and collaboration preference.'],
  ['02', 'Human review', 'Our team reviews your application. We aim to reply within 12–24 hours.'],
  ['03', 'Grow together', 'Approved partners receive their affiliate details; product gifting is offered for selected campaigns.'],
];

const COLLABORATIONS = [
  {
    icon: Gift,
    title: 'Botanical Ritual Exchange',
    label: 'Product gifting · selected creators',
    description: 'A curated Bhumivera product may be gifted for an agreed, authentic ritual or unboxing story. No cash UGC fee; campaign terms are shared before you accept.',
    accent: 'text-[#F0D98A]',
  },
  {
    icon: Sparkles,
    title: 'Community Affiliate',
    label: 'Personal link · tracked orders',
    description: 'Approved partners receive a unique audience link or code. Commission settings and referred orders are visible in your promoter desk.',
    accent: 'text-emerald-200',
  },
];

const PERKS = [
  ['Curated product seeding', 'Selected creators may receive full-size products for a clearly briefed campaign.'],
  ['Your own audience offer', 'Approved partners can share a personal code with the discount set by Bhumivera.'],
  ['First looks at new rituals', 'Early product previews may be available for selected launches and creator matches.'],
  ['A chance to be featured', 'Standout, permissioned creator stories may be shared on Bhumivera channels.'],
];

const PRODUCTS = [
  {
    name: 'Sea Buckthorn Face Wash',
    image: '/images/products/bhumivera-seabuckthorn-luxury-face-wash.webp',
    alt: 'Bhumivera Sea Buckthorn face wash product',
  },
  {
    name: 'Activated Charcoal Face Wash',
    image: '/images/products/bhumivera-activated-charcoal-luxury-face-wash.webp',
    alt: 'Bhumivera Activated Charcoal face wash product',
  },
  {
    name: 'Botanical 2-in-1 Shampoo',
    image: '/images/products/bhumivera-luxury-2-in-1-shampoo-conditioner.webp',
    alt: 'Bhumivera botanical shampoo and conditioner product',
  },
  {
    name: 'Artisanal Cleansing Bar',
    image: '/images/products/bhumivera-artisanal-charcoal-handmade-soap.webp',
    alt: 'Bhumivera handmade charcoal cleansing bar',
  },
  {
    name: 'Seven-Tulsi Drops',
    image: '/images/products/bhumivera-kalpvriksh-satva-tulsi-drops.webp',
    alt: 'Bhumivera Kalpvriksh Satva Tulsi drops',
  },
];

const FAQS = [
  {
    q: 'Is there a minimum follower count?',
    a: 'No fixed minimum. We review audience fit, content quality, consistency, and engagement—not follower count alone.',
  },
  {
    q: 'What kind of collaboration can I choose?',
    a: 'You can express interest in product gifting/barter, affiliate commission, or both. Product gifting is selective and not guaranteed. Bhumivera does not currently offer cash-paid UGC fees.',
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
    q: 'How are affiliate orders and commissions tracked?',
    a: 'Your promoter desk shows attributed orders and commission status. Commissions depend on eligible, delivered orders, are adjusted for returns, and are paid manually by Bhumivera.',
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
        title="Bhumivera Creator & Promoter Program | Product Gifting and Affiliate Partnerships"
        description="Join the Bhumivera creator community. No fixed follower minimum; applications are reviewed by our team. Explore selective product gifting and transparent affiliate partnerships."
        keywords="Bhumivera creator program, skincare creator partnerships India, botanical skincare product gifting, Bhumivera affiliate program, beauty influencer collaboration"
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
                <Leaf size={13}/> The Transparent Maison · Creator community
              </p>
              <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-tight text-white sm:text-6xl">
                Make room for a more <span className="text-[#E8CD75]">botanical</span> kind of story.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#C5D8CC] sm:text-base">
                Create honest skincare and haircare content with Bhumivera. Choose product gifting, tracked affiliate partnerships, or both—then grow at your own pace.
              </p>
              <p className="mt-4 max-w-2xl border-l-2 border-[#D4AF37]/55 pl-4 font-serif text-sm italic leading-6 text-[#F0D98A]">
                “Trust is the beginning of every lasting collaboration.”
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['No fixed follower minimum', 'Human review', 'No application fee'].map(item => (
                  <span key={item} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-[#E7EEE8]">
                    <CheckCircle2 size={14} className="text-[#C4D99A]"/> {item}
                  </span>
                ))}
              </div>
              <a href="#apply" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-[#102219] transition hover:bg-[#FCE096]">
                Start your application <ArrowRight size={16}/>
              </a>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute inset-5 rounded-[2rem] bg-[#D4AF37]/10 blur-2xl"/>
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0A1D14]/70 p-4 shadow-2xl backdrop-blur-lg">
                <img
                  src="/images/products/bhumivera-seabuckthorn-luxury-face-wash.webp"
                  alt="Bhumivera Sea Buckthorn botanical face wash"
                  width="640"
                  height="640"
                  fetchPriority="high"
                  className="h-64 w-full rounded-2xl bg-[#10251A] object-contain p-4 sm:h-80"
                />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">Built on transparent rituals</p>
                    <p className="mt-1 font-serif text-lg font-bold text-white">Ingredient-led stories</p>
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
            <p className="text-xs text-[#9BB0A5]">Review target: 12–24 hours</p>
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">No paid-post pressure</p>
            <h2 id="collaboration-title" className="mt-3 font-serif text-3xl font-bold text-white">A thoughtful exchange.</h2>
            <p className="mt-3 text-sm leading-6 text-[#B7C9BD]">
              Our current creator model pairs selective product gifting with optional affiliate commissions. We do not currently offer cash-paid UGC fees. Every campaign is explained before you decide.
            </p>
            <p className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 text-xs leading-5 text-[#C5D8CC]">
              Product gifting is selective, not guaranteed. No purchase is needed to apply, and there is no fixed follower threshold.
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

        <section aria-labelledby="botanical-collection-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">A first look at the ritual shelf</p>
              <h2 id="botanical-collection-title" className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">Stories rooted in real products</h2>
            </div>
            <Link to="/science" className="inline-flex items-center gap-2 text-xs font-semibold text-[#F0D98A] hover:text-white">Explore our formulation approach <ArrowRight size={14}/></Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {PRODUCTS.map(product => (
              <article key={product.name} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0D261B]/70 shadow-lg backdrop-blur-lg">
                <div className="p-3">
                  <img
                    src={product.image}
                    alt={product.alt}
                    width="480"
                    height="480"
                    loading="lazy"
                    decoding="async"
                    className="h-36 w-full rounded-xl bg-[#10251A] object-contain p-2 sm:h-44"
                  />
                </div>
                <h3 className="px-4 pb-4 text-xs font-semibold leading-5 text-[#E7EEE8]">{product.name}</h3>
              </article>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-5 text-[#82998D]">Product availability and gifting depend on the campaign. Creator content must reflect verified product information and avoid medical or guaranteed-result claims.</p>
        </section>

        <section aria-labelledby="creator-perks-title">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">For partners, not just posts</p>
            <h2 id="creator-perks-title" className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">Room to create and grow</h2>
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
              Sign in or create a verified Bhumivera account. Then tell us your platform, content niche, audience tier, and preferred collaboration.
            </p>
            <ul className="mt-5 space-y-3 text-xs leading-5 text-[#C5D8CC]">
              <li className="flex gap-2"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#D4AF37]"/>Your application stays pending until our team reviews it.</li>
              <li className="flex gap-2"><Clock3 size={15} className="mt-0.5 shrink-0 text-[#D4AF37]"/>We aim to send an update within 12–24 hours.</li>
              <li className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#D4AF37]"/>WhatsApp and delivery city/pincode are requested only after approval if a campaign needs them.</li>
            </ul>
          </div>

          <section className="rounded-[1.75rem] border border-white/10 bg-[#102A1E]/70 p-5 shadow-2xl backdrop-blur-xl sm:p-8" aria-label="Create or sign in to apply">
            <div className="flex items-start gap-3 rounded-xl border border-[#D4AF37]/20 bg-black/20 p-4">
              <Clock3 size={18} className="mt-0.5 shrink-0 text-[#D4AF37]"/>
              <p className="text-xs leading-5 text-[#C8D5CC]">
                Your application and promoter code remain inactive until approved. Product gifting is considered separately for selected campaigns.
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
              By applying, you agree to follow the <Link to="/legal/warranty-affiliate-b2b" className="font-semibold text-[#F0D98A] underline underline-offset-2">Bhumivera partner terms</Link>. An application is not a promise of acceptance, product gifting, or earnings.
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
