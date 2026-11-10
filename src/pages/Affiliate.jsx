import React, { useEffect } from 'react';
import { DollarSign, TrendingUp, Target, Award, ShieldCheck, Scale, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { AFFILIATE_PAGE_DATA } from '../data/bhumiveraUniqueData';

export default function Affiliate() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#070a0e] font-sans pb-24 text-[#e2e8f0] selection:bg-[#d4af37]/30 selection:text-white">
      <SEO
        title="Brand Ambassador & Affiliate Partner Program | Bhumivera"
        description="Explore Bhumivera's Brand Ambassador & Affiliate program, ASCI disclosure standards, and real-life creator collaborations."
        route="/affiliate"
      />
      {/* Hero Section with Unique Real-Life Photography */}
      <div className="relative isolate overflow-hidden bg-[#070a0e] text-white py-24 px-4 text-center">
        <div className="absolute inset-0 -z-20 opacity-25">
          <img
            src={AFFILIATE_PAGE_DATA.heroImage}
            alt="Bhumivera Brand Ambassador and Partner Program"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#070a0e]/95 via-[#070a0e]/80 to-[#070a0e]/95" />
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#0d1520] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fce096] mb-6">
            <ShieldCheck size={14} className="text-[#d4af37]" /> Bhumivera Brand Ambassador &amp; Partner Program
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 tracking-tight text-white">
            <span className="font-headline-gold">Bhumivera</span> <span className="font-headline-silver">Partner Program</span>
          </h1>
          <div className="gold-hairline my-5 max-w-xs mx-auto" />
          <p className="text-base md:text-lg text-[#cbd5e1] max-w-2xl mx-auto leading-relaxed">
            Collaborate with Bhumivera through transparent ingredient education, real-life skincare demonstrations, and ASCI-compliant botanical storytelling.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-gold-luxury px-7 py-3.5 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-xl">
              Apply for Written Partner Terms
            </Link>
            <Link to="/legal/warranty-affiliate-b2b" className="btn-silver-luxury px-7 py-3.5 text-[#cbd5e1] font-semibold text-xs uppercase tracking-widest rounded-xl inline-flex items-center gap-2">
              <Scale size={14} className="text-[#d4af37]" /> Read Affiliate Legal Terms
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits & Governance */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: DollarSign, title: "Written Commission Terms", desc: "Commercial commission tiers, TDS compliance, and payout schedules are governed by a signed written partner agreement." },
            { icon: Award, title: "ASCI & CCPA Compliance", desc: "Partners must use accurate ingredient disclosures, include mandatory #ad/#affiliate tags, and never make medical claims." },
            { icon: Target, title: "Retail Referral Credits", desc: "Existing retail customers can share their personal referral code from their Profile under our Dual-Ledger Referral rules." },
            { icon: TrendingUp, title: "Anti-Fraud & Fair Use", desc: "Self-referrals, brand-keyword ad bidding, coupon hijacking, and synthetic traffic are audited server-side." }
          ].map((item, i) => (
            <div key={i} className="p-7 rounded-2xl two-tone-card border border-[#d4af37]/25 hover:border-[#d4af37]/60 transition-all shadow-lg">
              <div className="w-12 h-12 bg-[#070a0e] border border-[#d4af37]/30 rounded-xl flex items-center justify-center mb-5 text-[#fce096]">
                <item.icon className="w-6 h-6 text-[#d4af37]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">{item.title}</h3>
              <p className="text-[#cbd5e1] text-xs sm:text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Real-Life Creator & Educator Case Studies */}
        <section className="mt-16">
          <div className="mb-8">
            <span className="font-sub-gold text-[10px] tracking-[0.2em] block">
              Real-Life Collaborations
            </span>
            <h2 className="mt-2 font-serif text-3xl text-white">
              <span className="font-headline-gold">How Educators &amp; Studios</span> <span className="font-headline-silver">Share Bhumivera</span>
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {AFFILIATE_PAGE_DATA.creatorCaseStudies.map((cs) => (
              <article key={cs.name} className="overflow-hidden rounded-2xl two-tone-card border border-[#d4af37]/25 shadow-lg hover:border-[#d4af37]/60 transition-all">
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#070a0e]">
                  <img src={cs.image} alt={cs.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                </div>
                <div className="p-6">
                  <span className="rounded bg-[#070a0e] border border-[#d4af37]/30 px-2.5 py-1 font-mono text-[10px] font-bold text-[#fce096] inline-block">
                    {cs.tier} · {cs.location}
                  </span>
                  <h3 className="mt-3 font-serif text-xl font-bold text-white">{cs.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-[#fce096]">{cs.focus}</p>
                  <p className="mt-3 text-xs leading-6 text-[#cbd5e1]">{cs.outcome}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-14 grid lg:grid-cols-[1fr_1fr] gap-8 items-center rounded-3xl two-tone-panel-gold border border-[#d4af37]/40 p-6 sm:p-10 shadow-2xl">
          <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-[#070a0e] border border-[#d4af37]/25">
            <img
              src={AFFILIATE_PAGE_DATA.editorialImage}
              alt="Bhumivera botanical partner showcase"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <span className="font-sub-gold text-[10px] tracking-[0.2em] block">
              Legal &amp; Commercial Clarity
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white">
              Every partnership is grounded in written transparency.
            </h2>
            <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
              Submitting an inquiry does not create an employment, agency, franchise, or guaranteed-income relationship. Review Part IV (Referral Rewards) and Part V (Affiliate &amp; B2B Partner Terms) of our Master Legal Suite before participating.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link to="/legal/wallet-loyalty-referrals" className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-[#cbd5e1]">
                Referral Rewards Rules <ArrowRight size={13} className="text-[#d4af37]" />
              </Link>
              <Link to="/legal/warranty-affiliate-b2b" className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white">
                Partner &amp; B2B Legal Terms <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
