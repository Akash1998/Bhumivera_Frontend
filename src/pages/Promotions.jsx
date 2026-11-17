import React, { useMemo, useState } from 'react';
import {
  ArrowRight, Award, BookOpen, Calculator, CheckCircle2, ChevronDown, Clock3,
  Copy, Gift, HeartHandshake, Leaf, ShieldCheck, Sparkles, TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
    category: 'Skincare',
    badge: '4% Sea Buckthorn · pH 5.5',
    storyAngle: 'Barrier-friendly daily cleansing with Omega-7, Vitamin C, 5% Glycerin & Niacinamide—without post-wash tightness.',
    formats: 'AM/PM Routine Reel · Texture Close-Up · Ingredient Breakdown',
  },
  {
    name: 'Botanical 2-in-1 Shampoo',
    slug: 'luxury-2-in-1-botanical-shampoo-conditioner',
    alt: 'Bhumivera botanical shampoo and conditioner product',
    fallbackImage: '/images/products/bhumivera-royal-shampoo-front.webp',
    category: 'Haircare',
    badge: 'Reetha · Amla · Rosemary Oil',
    storyAngle: 'Traditional Ayurvedic saponin cleansing paired with built-in botanical conditioning for a calm scalp and soft lengths.',
    formats: 'Wash-Day Short · Scalp Care Guide · Before/After Combing',
  },
  {
    name: 'Artisanal Cleansing Bar',
    slug: 'artisanal-charcoal-handmade-soap',
    alt: 'Bhumivera handmade charcoal cleansing bar',
    fallbackImage: '/images/products/bhumivera-charcoal-cleansing-bar-front.webp',
    category: 'Skincare',
    badge: 'Activated Charcoal + Aloe Vera',
    storyAngle: 'Small-batch handcrafted Ayurvedic bar that lifts sweat and urban pollution while keeping skin comfortable.',
    formats: 'ASMR Lather Short · Post-Workout Ritual · Humid Climate Routine',
  },
  {
    name: 'Seven-Tulsi Drops',
    slug: 'kalpvriksh-satva-tulsi-7-tulsi-extract',
    alt: 'Bhumivera Kalpvriksh Satva Tulsi drops',
    fallbackImage: '/images/products/bhumivera-seven-tulsi-drops-front.webp',
    category: 'Wellness',
    badge: '90% 7-Tulsi Distillate',
    storyAngle: 'Seven sacred Tulsi varieties in a simple morning warm-water or tea ritual for inside-out daily vitality.',
    formats: 'Morning Wellness Vlog · Family Tea Ritual · Habit Tracker Reel',
  },
];

const PROMOTION_PRODUCTS = PRODUCT_SPECS
  .filter(product => product.fallbackImage)
  .map(product => ({ ...product, image: product.fallbackImage }));

const CREATOR_ROADMAP = [
  {
    stage: 'Stage 01',
    badge: 'Verified Co-Creator',
    requirement: 'Approved Application',
    reward: 'Custom Audience Offer Code + Open-Book Order Ledger',
    detail: 'Receive your personal audience discount code, agreed contribution profit-share rate, and direct access to campaign briefs within 12–24 hours of review.',
  },
  {
    stage: 'Stage 02',
    badge: 'Ritual Educator',
    requirement: '3 Delivered Orders',
    reward: '₹500 Bhumivera Luxury Store Credit',
    detail: 'Unlocked automatically in your referral wallet once 3 attributed community orders are delivered and verified.',
  },
  {
    stage: 'Stage 03',
    badge: 'Botanical Ambassador',
    requirement: '10 Delivered Orders',
    reward: '₹1,200 Creator Bonus + Full-Range PR Box Eligibility',
    detail: 'Recognizes sustained community trust with an automatic wallet bonus and priority consideration for full-collection seasonal campaigns.',
  },
  {
    stage: 'Stage 04',
    badge: 'Maison Partner',
    requirement: '25 Delivered Orders',
    reward: '₹2,500 VIP Credit + 25% Profit-Share Tier Upgrade',
    detail: 'Long-term partners unlock our highest contribution-share tier (up to 25% of positive contribution) and co-created community initiatives.',
  },
];

const SAMPLE_BASKETS = [
  {
    id: 'daily_duo',
    name: 'Daily Cleanse & Wellness Duo',
    items: 'Sea Buckthorn Face Wash + Botanical 2-in-1 Shampoo',
    mrpSubtotal: 674,
    unitCostTotal: 187,
    gstRate: 5,
  },
  {
    id: 'complete_trio',
    name: '3-Step Botanical Ritual Basket',
    items: 'Sea Buckthorn Face Wash + 2-in-1 Shampoo + Seven-Tulsi Drops',
    mrpSubtotal: 873,
    unitCostTotal: 262,
    gstRate: 5,
  },
  {
    id: 'family_collection',
    name: 'Complete Family Ayurvedic Shelf',
    items: '2x Face Wash + 2-in-1 Shampoo + Seven-Tulsi Drops + 2x Artisanal Bars',
    mrpSubtotal: 1429,
    unitCostTotal: 432,
    gstRate: 5,
  },
];

const FIT_CHECKS = [
  'I want to share honest, experience-led product education in my own voice.',
  'I care about ingredient clarity and will never make medical or miracle-cure claims.',
  'I am looking for an ongoing relationship with my community—not a one-post freebie.',
  'I clearly disclose creator codes, affiliate links, and gifted items (#ad / #BhumiveraPartner).',
];

const FAQS = [
  {
    q: 'Is there a minimum follower count?',
    a: 'No fixed minimum. We review audience fit, content quality, consistency, and engagement—not follower count alone.',
    category: 'Eligibility',
  },
  {
    q: 'What kind of collaboration can I choose?',
    a: 'The current track is an ongoing creator partnership with order-based profit sharing. Product gifting is campaign-specific and not guaranteed. Paid UGC and trial-order reimbursements are not currently open.',
    category: 'Program',
  },
  {
    q: 'Do I have to pay to apply or buy a product?',
    a: 'There is no application fee and you do not need to buy a product to apply. If selected for product gifting, the campaign scope and delivery details are shared before you agree.',
    category: 'Eligibility',
  },
  {
    q: 'When will I hear back, and when would a kit ship?',
    a: 'We aim to review applications within 12–24 hours. A product kit is only discussed after approval and selection for a campaign; the dispatch estimate is confirmed with you before shipping.',
    category: 'Program',
  },
  {
    q: 'When do you ask for WhatsApp and delivery details?',
    a: 'Only after approval, and only if needed for a campaign. We will request your WhatsApp number and delivery city/pincode separately; they are not required to apply.',
    category: 'Eligibility',
  },
  {
    q: 'Is this a free-product or one-post program?',
    a: 'No. We are looking for creators who want to contribute to an ongoing relationship with their community and Bhumivera. Product gifting is selective, never guaranteed, and an application is not a request for a free kit.',
    category: 'Program',
  },
  {
    q: 'How are affiliate orders and commissions tracked?',
    a: 'Your promoter desk shows the stored order-level calculation: revenue excluding tax, discounts, product cost total, fulfillment and return reserves, payment fee, contribution, your commission and the brand-retained contribution. Commissions depend on eligible, delivered orders; cancellations or returns are reversed and payouts are recorded after manual processing.',
    category: 'Earnings',
  },
  {
    q: 'Does a fixed part of every order go to nature?',
    a: 'No fixed percentage is promised. Customers may choose a contribution separately, and we report it as funded only after it is recorded as collected. Creators can help their communities discover verified impact initiatives without making unsupported funding claims.',
    category: 'Ethics',
  },
  {
    q: 'What should I disclose in a creator post?',
    a: 'Be clear when a product was gifted or a link may earn commission. Use applicable #gifted or #ad disclosures, follow the campaign brief, and stick to substantiated product information—never make medical or guaranteed-result claims.',
    category: 'Ethics',
  },
];

const formatInr = value => `₹${(Number(value) || 0).toFixed(2)}`;

export default function Promotions() {
  const { user, loading } = useAuth();
  const [previewHandle, setPreviewHandle] = useState('YOURNAME');
  const [copiedPreview, setCopiedPreview] = useState(false);
  const [selectedBasketId, setSelectedBasketId] = useState('complete_trio');
  const [simulatedOrders, setSimulatedOrders] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [faqCategory, setFaqCategory] = useState('All');
  const [checkedFit, setCheckedFit] = useState(() => FIT_CHECKS.map(() => false));
  const [showPartnershipDetails, setShowPartnershipDetails] = useState(false);

  const sanitizedCode = useMemo(() => {
    const cleaned = String(previewHandle || '')
      .replace(/^@+/, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 12);
    return cleaned ? `${cleaned}10` : 'CREATOR10';
  }, [previewHandle]);

  const selectedBasket = useMemo(
    () => SAMPLE_BASKETS.find(item => item.id === selectedBasketId) || SAMPLE_BASKETS[1],
    [selectedBasketId]
  );

  const simulation = useMemo(() => {
    const discountPct = 10;
    const sharePct = simulatedOrders >= 25 ? 25 : 20;
    const discountedPrice = Math.round(selectedBasket.mrpSubtotal * (1 - discountPct / 100) * 100) / 100;
    const revenueExTax = Math.round((discountedPrice / (1 + selectedBasket.gstRate / 100)) * 100) / 100;
    const fulfillmentAndRto = 150;
    const paymentFee = Math.round(discountedPrice * 0.02 * 100) / 100;
    const contributionPerOrder = Math.max(0, Math.round((revenueExTax - selectedBasket.unitCostTotal - fulfillmentAndRto - paymentFee) * 100) / 100);
    const minRetainedFloor = Math.round(revenueExTax * 0.15 * 100) / 100;
    const rawCommission = Math.round(contributionPerOrder * (sharePct / 100) * 100) / 100;
    const maxAllowedCommission = Math.max(0, Math.round((contributionPerOrder - minRetainedFloor) * 100) / 100);
    const commissionPerOrder = Math.min(rawCommission, maxAllowedCommission);
    const retainedPerOrder = Math.max(0, Math.round((contributionPerOrder - commissionPerOrder) * 100) / 100);
    const totalCommission = Math.round(commissionPerOrder * simulatedOrders * 100) / 100;
    const milestoneBonus = (simulatedOrders >= 3 ? 500 : 0) + (simulatedOrders >= 10 ? 1200 : 0) + (simulatedOrders >= 25 ? 2500 : 0);

    return {
      discountPct,
      sharePct,
      discountedPrice,
      revenueExTax,
      fulfillmentAndRto,
      paymentFee,
      contributionPerOrder,
      commissionPerOrder,
      retainedPerOrder,
      totalCommission,
      milestoneBonus,
      combinedValue: Math.round((totalCommission + milestoneBonus) * 100) / 100,
    };
  }, [selectedBasket, simulatedOrders]);

  const filteredProducts = useMemo(() => (
    selectedCategory === 'All'
      ? PROMOTION_PRODUCTS
      : PROMOTION_PRODUCTS.filter(item => item.category === selectedCategory)
  ), [selectedCategory]);

  const visibleFaqs = useMemo(() => (
    faqCategory === 'All' ? FAQS : FAQS.filter(item => item.category === faqCategory)
  ), [faqCategory]);

  const fitScore = checkedFit.filter(Boolean).length;
  const fitProgress = (fitScore / FIT_CHECKS.length) * 100;
  const fitFeedback = fitScore === 0
    ? {
      label: 'A quick reflection',
      title: 'What matters in the way you create?',
      message: 'Choose the principles that feel true to you. There is no pass or fail—this is a moment to reflect before you apply.',
    }
    : fitScore === FIT_CHECKS.length
      ? {
        label: 'All four principles resonate',
        title: 'Your values sound aligned',
        message: 'That is a thoughtful starting point. Our team reviews every application individually; this check is not an approval decision.',
      }
      : {
        label: `${fitScore} of ${FIT_CHECKS.length} principles resonate`,
        title: 'You’re finding your fit',
        message: 'A strong partnership starts with shared standards, not audience size. Select the principles that reflect how you work.',
      };

  if (loading) {
    return <main className="min-h-screen bg-[#07140e] px-4 py-20 text-center text-[#9BB0A5]">Loading your account…</main>;
  }

  if (user) return <PromoterPortal />;

  const accountState = { from: '/promotions' };

  const copyPreviewUrl = async () => {
    try {
      await navigator.clipboard.writeText(`https://www.bhumivera.com/?aff=${sanitizedCode}`);
      setCopiedPreview(true);
      window.setTimeout(() => setCopiedPreview(false), 1800);
    } catch {
      // ignore clipboard errors in preview
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07140e] px-2 py-6 text-[#DFD7C4] sm:px-4 sm:py-12">
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

      <div className="relative mx-auto max-w-7xl space-y-5 sm:space-y-8">
        <header className="relative overflow-hidden rounded-[2rem] border border-[#D4AF37]/25 bg-gradient-to-br from-[#143A29]/95 via-[#0D261B]/90 to-[#081A12]/95 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-10">
          <div aria-hidden="true" className="absolute -right-12 -top-20 h-72 w-72 rounded-full border border-[#D4AF37]/10 bg-[#D4AF37]/[0.03]"/>
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FCE096]">
                <Leaf size={13}/> For thoughtful creators · built to grow
              </p>
              <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-tight text-white sm:text-6xl">
                Your voice can build <span className="text-[#E8CD75]">something bigger than a post.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#C5D8CC] sm:text-base">
                Bring your honest point of view. We bring clear campaign terms, thoughtful product education and a partnership designed to grow with your community. Start with a free, 2-minute application—no follower minimum.
              </p>
              <p className="mt-4 max-w-2xl border-l-2 border-[#D4AF37]/55 pl-4 font-serif text-sm italic leading-6 text-[#F0D98A]">
                “Create with us, learn with us, and grow with your community.”
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['No follower minimum', 'Free 2-minute application', 'Human-reviewed', 'Transparent order ledger'].map(item => (
                  <span key={item} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-[#E7EEE8]">
                    <CheckCircle2 size={14} className="text-[#C4D99A]"/> {item}
                  </span>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a href="#apply" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-[#102219] transition hover:-translate-y-0.5 hover:bg-[#FCE096] hover:shadow-[0_8px_24px_rgba(212,175,55,0.18)]">
                  Start my application <ArrowRight size={16}/>
                </a>
                <a href="#interactive-calculator" onClick={() => setShowPartnershipDetails(true)} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#D4AF37]/35 bg-black/20 px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#FCE096] transition hover:border-[#D4AF37] hover:bg-white/[0.04]">
                  <Calculator size={15}/> Try Earnings &amp; Milestone Explorer
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md space-y-4">
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

                <div className="mt-4 rounded-xl border border-[#D4AF37]/25 bg-[#07140e]/85 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">Preview your creator code</span>
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">10% audience offer</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      aria-label="Preview your social handle"
                      maxLength={18}
                      value={previewHandle}
                      onChange={e => setPreviewHandle(e.target.value)}
                      placeholder="@yourhandle"
                      className="w-full rounded-lg border border-white/10 bg-[#10251A] px-3 py-1.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={copyPreviewUrl}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/15 px-2.5 py-1.5 text-[11px] font-bold text-[#FCE096] hover:bg-[#D4AF37]/25"
                    >
                      <Copy size={12}/> {copiedPreview ? 'Copied' : sanitizedCode}
                    </button>
                  </div>
                  <p className="mt-1.5 truncate font-mono text-[11px] text-[#9BB0A5]">
                    bhumivera.com/?aff=<span className="font-bold text-[#FCE096]">{sanitizedCode}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section aria-labelledby="creator-fit-check-title" className="relative overflow-hidden rounded-[1.5rem] border border-[#D4AF37]/20 bg-gradient-to-br from-[#0D261B] via-[#0A1E15] to-[#07140e] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.22)] sm:rounded-[1.75rem] sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border border-[#D4AF37]/10 bg-[#D4AF37]/[0.035] blur-2xl"/>
          <div className="relative grid items-center gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-7">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                <HeartHandshake size={14}/> 30-second creator compass
              </p>
              <h2 id="creator-fit-check-title" className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl">
                See if the Bhumivera Creator Partnership fits your style
              </h2>
              <p className="mt-2 max-w-2xl text-xs leading-6 text-[#B7C9BD]">
                Choose the principles that feel like you. This is a private reflection—not a test, and your score is not part of the application.
              </p>
              <div className="mt-4 space-y-2 sm:mt-5 sm:space-y-2.5">
                {FIT_CHECKS.map((statement, idx) => {
                  const checked = Boolean(checkedFit[idx]);
                  return (
                    <label
                      key={statement}
                      className={`group flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-xs leading-5 transition duration-200 focus-within:ring-2 focus-within:ring-[#FCE096]/70 sm:p-3.5 ${
                        checked
                          ? 'border-[#D4AF37]/55 bg-[#D4AF37]/[0.08] text-white shadow-[inset_0_0_24px_rgba(212,175,55,0.04)]'
                          : 'border-white/10 bg-black/20 text-[#C5D8CC] hover:border-[#D4AF37]/35 hover:bg-white/[0.035]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={e => setCheckedFit(curr => curr.map((value, i) => i === idx ? e.target.checked : value))}
                        className="peer sr-only"
                      />
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-mono text-[10px] font-bold transition ${
                        checked
                          ? 'border-[#D4AF37]/50 bg-[#D4AF37]/15 text-[#FCE096]'
                          : 'border-white/10 bg-black/20 text-[#82998D] group-hover:border-[#D4AF37]/30'
                      }`}>
                        {checked ? <CheckCircle2 size={16}/> : `0${idx + 1}`}
                      </span>
                      <span className="flex-1">{statement}</span>
                      <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full transition ${
                        checked ? 'bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.7)]' : 'bg-white/10'
                      }`}/>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-[#D4AF37]/25 bg-[#06130D]/75 p-3 text-center shadow-inner sm:p-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9BB0A5]">Your creator compass</p>
              <div
                role="progressbar"
                aria-label="Creator alignment score"
                aria-valuemin={0}
                aria-valuemax={FIT_CHECKS.length}
                aria-valuenow={fitScore}
                className="mx-auto mt-3 flex h-24 w-24 items-center justify-center rounded-full p-[5px] transition-[background] duration-500 sm:mt-4 sm:h-32 sm:w-32"
                style={{ background: `conic-gradient(#D4AF37 ${fitProgress}%, rgba(255,255,255,0.09) ${fitProgress}% 100%)` }}
              >
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-white/[0.06] bg-[#07140e]">
                  <span className="font-serif text-3xl font-bold leading-none text-white sm:text-4xl">{fitScore}</span>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#82998D]">of {FIT_CHECKS.length}</span>
                </div>
              </div>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#D4AF37] sm:mt-4">{fitFeedback.label}</p>
              <h3 className="mt-2 font-serif text-xl font-bold text-white">{fitFeedback.title}</h3>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#AFC2B5]">{fitFeedback.message}</p>
              <a
                href="#apply"
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#102219] transition hover:-translate-y-0.5 hover:bg-[#FCE096] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE096]"
              >
                Continue to application <ArrowRight size={14}/>
              </a>
              <p className="mt-2 text-[10px] leading-4 text-[#82998D]">No pass/fail score—your answers stay here.</p>
            </div>
          </div>
        </section>

        <section id="apply" aria-labelledby="apply-title" className="scroll-mt-5 grid items-stretch gap-3 lg:grid-cols-2 lg:gap-5">
          <div className="hidden rounded-[1.75rem] border border-[#D4AF37]/20 bg-[#0D261B]/65 p-6 backdrop-blur-xl lg:block lg:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Your next small step</p>
            <h2 id="apply-details-title" className="mt-3 font-serif text-3xl font-bold text-white">Start with your account</h2>
            <p className="mt-3 text-sm leading-6 text-[#B7C9BD]">
              Sign in or create a verified Bhumivera account. Then tell us about your platform, content and audience—and what a meaningful, nature-minded partnership could look like beyond a single post.
            </p>
            <ul className="mt-5 space-y-3 text-xs leading-5 text-[#C5D8CC]">
              <li className="flex gap-2"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#D4AF37]"/>We review intent, audience fit and honesty—not follower count alone.</li>
              <li className="flex gap-2"><Clock3 size={15} className="mt-0.5 shrink-0 text-[#D4AF37]"/>We aim to send an update within 12–24 hours.</li>
              <li className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#D4AF37]"/>WhatsApp and delivery city/pincode are requested only after approval if a campaign needs them.</li>
              <li className="flex gap-2"><BookOpen size={15} className="mt-0.5 shrink-0 text-[#D4AF37]"/>Once signed in, our guided form includes prompt starters to help you articulate your partnership vision in under 2 minutes.</li>
            </ul>
          </div>

          <section className="flex flex-col justify-between rounded-[1.5rem] border border-[#D4AF37]/30 bg-gradient-to-br from-[#102A1E]/95 to-[#0A1D14]/95 p-3 shadow-2xl sm:rounded-[1.75rem] sm:p-9 lg:min-h-[25rem] lg:p-10" aria-label="Register or sign in to apply">
            <div>
              <div className="flex items-start gap-3 rounded-xl border border-[#D4AF37]/20 bg-black/20 p-3 sm:gap-4 sm:rounded-2xl sm:p-6">
                <Clock3 size={18} className="mt-0.5 shrink-0 text-[#D4AF37] sm:h-[21px] sm:w-[21px]"/>
                <p className="text-xs leading-5 text-[#C8D5CC] sm:text-sm sm:leading-6">
                  Every application is reviewed by our team. If there’s a fit, you’ll agree on the campaign scope before sharing anything.
                </p>
              </div>

              <div className="mt-5 sm:mt-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Your next small step</p>
                <h2 id="apply-title" className="mt-1.5 font-serif text-2xl font-bold text-white sm:mt-2 sm:text-3xl">Let’s hear your story</h2>
                <p className="mt-2 text-xs leading-5 text-[#B7C9BD] sm:mt-3 sm:text-sm sm:leading-6">
                  Create or sign in to a verified account, then tell us what you’d love to build with your community. It takes about 2 minutes.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-2 sm:mt-8 sm:grid-cols-2 sm:gap-3">
              <Link
                to="/register"
                state={accountState}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 text-sm font-bold text-[#102219] shadow-lg shadow-black/20 transition hover:bg-[#FCE096] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE096] sm:min-h-16 sm:px-5 sm:py-4 sm:text-base"
              >
                Create account <ArrowRight size={17}/>
              </Link>
              <Link
                to="/login"
                state={accountState}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 px-4 py-3 text-sm font-bold text-white transition hover:border-[#D4AF37]/60 hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE096] sm:min-h-16 sm:px-4 sm:py-4 sm:text-base"
              >
                Already have an account? Sign in
              </Link>
            </div>

            <p className="mt-3 text-center text-[10px] font-semibold text-[#F0D98A]">No application fee · No purchase required · No follower minimum</p>

            <p className="mt-4 border-t border-white/10 pt-3 text-[10px] leading-4 text-[#9BB0A5] sm:mt-7 sm:pt-5 sm:text-xs sm:leading-6">
              No application fee or follower minimum. An application is not a promise of acceptance, product gifting, paid work, orders, or earnings. See the <Link to="/legal/warranty-affiliate-b2b" className="font-semibold text-[#F0D98A] underline underline-offset-2">partner terms</Link>.
            </p>
          </section>
        </section>

        <button
          type="button"
          id="partnership-details"
          aria-expanded={showPartnershipDetails}
          aria-controls="partnership-details-content"
          onClick={() => setShowPartnershipDetails(open => !open)}
          className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0D261B]/70 px-4 py-3 text-left transition hover:border-[#D4AF37]/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FCE096] lg:hidden"
        >
          <span>
            <span className="block text-sm font-semibold text-white">Explore partnership details</span>
            <span className="mt-1 block text-[11px] text-[#9BB0A5]">Stages, earnings, products and FAQs</span>
          </span>
          <ChevronDown size={18} className={`shrink-0 text-[#F0D98A] transition-transform ${showPartnershipDetails ? 'rotate-180' : ''}`}/>
        </button>

        <div
          id="partnership-details-content"
          className={`${showPartnershipDetails ? 'block' : 'hidden'} space-y-5 sm:space-y-8 lg:block`}
        >
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

        <section aria-labelledby="creator-roadmap-title" className="rounded-[1.75rem] border border-[#D4AF37]/25 bg-gradient-to-br from-[#123122]/90 to-[#081810]/95 p-6 shadow-xl sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                <Award size={14}/> 4-Stage Co-Creator Progression
              </p>
              <h2 id="creator-roadmap-title" className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">
                Grow from your first ritual story to Maison Partner
              </h2>
              <p className="mt-2 max-w-3xl text-xs leading-6 text-[#B7C9BD]">
                Every delivered community order counts toward automatic milestone recognition—unlocking store credits, seasonal PR box eligibility, and higher profit-share tiers.
              </p>
            </div>
            <a href="#apply" className="inline-flex items-center gap-1.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 px-4 py-2.5 text-xs font-bold text-[#FCE096] hover:bg-[#D4AF37]/25">
              Reserve your creator code <ArrowRight size={14}/>
            </a>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CREATOR_ROADMAP.map(item => (
              <article key={item.stage} className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#07140e]/65 p-5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">{item.stage}</span>
                    <span className="rounded-full border border-emerald-400/25 bg-emerald-950/40 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-200">{item.requirement}</span>
                  </div>
                  <h3 className="mt-3 font-serif text-lg font-bold text-white">{item.badge}</h3>
                  <p className="mt-1.5 text-xs font-semibold text-[#F0D98A]">{item.reward}</p>
                  <p className="mt-2 text-xs leading-5 text-[#AFC2B5]">{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
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

        <section id="interactive-calculator" aria-labelledby="creator-economics-title" className="rounded-[1.75rem] border border-[#D4AF37]/30 bg-gradient-to-br from-[#143A29]/75 to-[#081A12]/90 p-6 shadow-xl sm:p-8">
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

          <div className="mt-6 rounded-2xl border border-[#D4AF37]/25 bg-[#07140e]/80 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  <TrendingUp size={13}/> Interactive Order Contribution &amp; Milestone Simulator
                </p>
                <h3 className="mt-1 font-serif text-lg font-bold text-white">Explore how transparent order math works in practice</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] text-[#9BB0A5]">
                Illustrative simulator · actual orders vary by cart items
              </span>
            </div>

            <div className="mt-4 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-[#E7EEE8]">1. Choose a sample customer ritual basket</span>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    {SAMPLE_BASKETS.map(basket => {
                      const active = basket.id === selectedBasket.id;
                      return (
                        <button
                          key={basket.id}
                          type="button"
                          onClick={() => setSelectedBasketId(basket.id)}
                          className={`rounded-xl border p-3 text-left transition ${
                            active
                              ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white'
                              : 'border-white/10 bg-white/[0.03] text-[#C5D8CC] hover:border-white/25'
                          }`}
                        >
                          <p className="text-xs font-bold text-[#FCE096]">{basket.name}</p>
                          <p className="mt-1 text-[11px] leading-4 text-[#9BB0A5]">{basket.items}</p>
                          <p className="mt-2 font-mono text-xs font-semibold text-white">Catalog: ₹{basket.mrpSubtotal}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[#E7EEE8]">
                    <label htmlFor="simulated-orders-range">2. Delivered community orders in campaign</label>
                    <span className="font-mono text-sm font-bold text-[#FCE096]">{simulatedOrders} delivered orders</span>
                  </div>
                  <input
                    id="simulated-orders-range"
                    type="range"
                    min="1"
                    max="35"
                    value={simulatedOrders}
                    onChange={e => setSimulatedOrders(Number(e.target.value))}
                    className="mt-2 w-full accent-[#D4AF37]"
                  />
                  <div className="mt-1 flex justify-between text-[10px] text-[#9BB0A5]">
                    <span>1 order</span>
                    <span>3 orders (₹500 gift card)</span>
                    <span>10 orders (+₹1,200 bonus)</span>
                    <span>25+ orders (25% tier + ₹2,500)</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#315541] bg-[#0b1c14] p-4 text-xs">
                <p className="font-serif text-sm font-bold text-white">Per-order open-book breakdown ({selectedBasket.name})</p>
                <dl className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-[#9BB0A5]">
                    <dt>Customer pays after {simulation.discountPct}% creator code</dt>
                    <dd className="font-semibold text-white">{formatInr(simulation.discountedPrice)}</dd>
                  </div>
                  <div className="flex justify-between text-[#9BB0A5]">
                    <dt>Merchandise revenue excluding GST ({selectedBasket.gstRate}%)</dt>
                    <dd className="font-semibold text-white">{formatInr(simulation.revenueExTax)}</dd>
                  </div>
                  <div className="flex justify-between text-[#9BB0A5]">
                    <dt>Less product cost + fulfillment/RTO + gateway fee</dt>
                    <dd className="font-semibold text-white">−{formatInr(selectedBasket.unitCostTotal + simulation.fulfillmentAndRto + simulation.paymentFee)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-1.5 text-[#E7EEE8]">
                    <dt>Order contribution profit</dt>
                    <dd className="font-bold text-white">{formatInr(simulation.contributionPerOrder)}</dd>
                  </div>
                  <div className="flex justify-between text-[#FCE096]">
                    <dt>Your commission per order ({simulation.sharePct}% share)</dt>
                    <dd className="font-bold">{formatInr(simulation.commissionPerOrder)}</dd>
                  </div>
                  <div className="flex justify-between text-[#9BB0A5]">
                    <dt>Bhumivera retained contribution*</dt>
                    <dd>{formatInr(simulation.retainedPerOrder)}</dd>
                  </div>
                </dl>
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg border border-[#D4AF37]/30 bg-[#102A1E] p-3">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#9BB0A5]">Est. Commission ({simulatedOrders} orders)</span>
                    <strong className="mt-0.5 block font-serif text-lg text-[#FCE096]">{formatInr(simulation.totalCommission)}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#9BB0A5]">Unlocked Milestone Credits</span>
                    <strong className="mt-0.5 block font-serif text-lg text-emerald-300">+₹{simulation.milestoneBonus}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <p className="max-w-3xl text-[11px] leading-5 text-[#9BB0A5]">Supplier identities and invoices stay private; the order-level product cost is visible. Commissions are pending until delivery and reversals appear in the ledger.</p>
            <Link to="/affiliate" className="inline-flex items-center gap-2 text-xs font-bold text-[#F0D98A] hover:text-white">Read the full partnership and calculation terms <ArrowRight size={14}/></Link>
          </div>
        </section>

        <section aria-labelledby="botanical-collection-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">A first look at the ritual shelf &amp; briefs</p>
              <h2 id="botanical-collection-title" className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">Stories rooted in real products</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Skincare', 'Haircare', 'Wellness'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? 'bg-[#D4AF37] text-[#102219]'
                      : 'border border-white/15 bg-black/20 text-[#C5D8CC] hover:border-[#D4AF37]/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <Link to="/science" className="ml-2 inline-flex items-center gap-2 text-xs font-semibold text-[#F0D98A] hover:text-white">Explore our formulation approach <ArrowRight size={14}/></Link>
            </div>
          </div>
          <div className={`mx-auto mt-5 grid w-full gap-4 ${
            filteredProducts.length >= 4
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {filteredProducts.map(product => (
              <article key={product.name} className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D261B]/70 shadow-lg backdrop-blur-lg">
                <div className=" relative aspect-[4/3] w-full bg-[#10251A] p-3">
                  <span className="absolute left-3 top-3 rounded-full border border-[#D4AF37]/30 bg-[#07140e]/85 px-2.5 py-1 text-[10px] font-bold text-[#FCE096]">
                    {product.badge}
                  </span>
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
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">{product.category} Campaign Brief</span>
                    <h3 className="mt-1 text-sm font-bold leading-5 text-[#E7EEE8]">{product.name}</h3>
                    <p className="mt-2 text-xs leading-5 text-[#AFC2B5]">{product.storyAngle}</p>
                  </div>
                  <p className="mt-3 border-t border-white/10 pt-2.5 text-[11px] text-[#9BB0A5]">
                    <strong className="text-[#F0D98A]">Formats:</strong> {product.formats}
                  </p>
                </div>
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

        <section aria-labelledby="creator-faq-title" className="rounded-[1.75rem] border border-white/10 bg-[#0D261B]/60 p-5 backdrop-blur-xl sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Clear answers before you apply</p>
              <h2 id="creator-faq-title" className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">Creator partnership FAQs</h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Eligibility', 'Program', 'Earnings', 'Ethics'].map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFaqCategory(category)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    faqCategory === category
                      ? 'bg-[#D4AF37] text-[#102219]'
                      : 'border border-white/15 bg-black/20 text-[#C5D8CC] hover:border-[#D4AF37]/40'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 divide-y divide-white/10">
            {visibleFaqs.map(({ q, a }) => (
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
        </div>

        <p className="pb-6 text-center text-[11px] leading-5 text-[#82998D]">
          A partnership is built on honest recommendations. Follow applicable advertising disclosures and the <Link to="/legal/warranty-affiliate-b2b" className="text-[#F0D98A] underline underline-offset-2">Bhumivera partner terms</Link>.
        </p>
      </div>
    </main>
  );
}
