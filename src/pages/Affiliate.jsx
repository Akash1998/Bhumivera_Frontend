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
    <div className="min-h-screen bg-[#f7f5ef] font-sans pb-20 text-[#1b2921]">
      <SEO
        title="Brand Ambassador & Affiliate Partner Program | Bhumivera"
        description="Explore Bhumivera's Brand Ambassador & Affiliate program, ASCI disclosure standards, and real-life creator collaborations."
        route="/affiliate"
      />
      {/* Hero Section with Unique Real-Life Photography */}
      <div className="relative isolate overflow-hidden bg-[#111e18] text-white py-24 px-4 text-center">
        <div className="absolute inset-0 -z-20 opacity-35">
          <img
            src={AFFILIATE_PAGE_DATA.heroImage}
            alt="Bhumivera Brand Ambassador and Partner Program"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b1410]/90 via-[#0b1410]/75 to-[#0b1410]/95" />
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-6">
            <ShieldCheck size={14} /> Bhumivera Brand Ambassador &amp; Partner Program
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight">
            Bhumivera Partner Program
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Collaborate with Bhumivera through transparent ingredient education, real-life skincare demonstrations, and ASCI-compliant botanical storytelling.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="px-7 py-3.5 bg-[#d4af37] text-[#0b1410] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#e5c247] transition-all shadow-lg">
              Apply for Written Partner Terms
            </Link>
            <Link to="/legal/warranty-affiliate-b2b" className="px-7 py-3.5 border border-white/25 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all inline-flex items-center gap-2">
              <Scale size={14} /> Read Affiliate &amp; Partner Legal Terms
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
            <div key={i} className="p-7 rounded-2xl bg-white border border-[#26392c]/15 hover:border-[#26392c]/40 transition-colors shadow-sm">
              <div className="w-12 h-12 bg-[#eef0e6] rounded-xl flex items-center justify-center mb-5 text-[#142019]">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#142019] mb-2">{item.title}</h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Real-Life Creator & Educator Case Studies */}
        <section className="mt-16">
          <div className="mb-8">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b4226]">
              Real-Life Collaborations
            </span>
            <h2 className="mt-2 font-serif text-3xl text-[#142019]">
              How Educators &amp; Studios Share Bhumivera
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {AFFILIATE_PAGE_DATA.creatorCaseStudies.map((cs) => (
              <article key={cs.name} className="overflow-hidden rounded-2xl border border-[#26392c]/15 bg-white shadow-sm">
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#111e18]">
                  <img src={cs.image} alt={cs.name} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <span className="rounded bg-[#eef0e6] px-2.5 py-1 font-mono text-[10px] font-bold text-[#26392c]">
                    {cs.tier} · {cs.location}
                  </span>
                  <h3 className="mt-3 font-serif text-xl font-bold text-[#142019]">{cs.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-[#6b4226]">{cs.focus}</p>
                  <p className="mt-3 text-xs leading-6 text-stone-600">{cs.outcome}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-14 grid lg:grid-cols-[1fr_1fr] gap-8 items-center rounded-2xl border border-[#26392c]/15 bg-white p-6 sm:p-10 shadow-sm">
          <div className="aspect-[16/9] overflow-hidden rounded-xl bg-[#111e18]">
            <img
              src={AFFILIATE_PAGE_DATA.editorialImage}
              alt="Bhumivera botanical partner showcase"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b4226]">
              Legal &amp; Commercial Clarity
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#142019]">
              Every partnership is grounded in written transparency.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Submitting an inquiry does not create an employment, agency, franchise, or guaranteed-income relationship. Review Part IV (Referral Rewards) and Part V (Affiliate &amp; B2B Partner Terms) of our Master Legal Suite before participating.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/legal/wallet-loyalty-referrals" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#142019] underline underline-offset-4">
                Referral Rewards Rules <ArrowRight size={13} />
              </Link>
              <Link to="/legal/warranty-affiliate-b2b" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6b4226] underline underline-offset-4">
                Partner &amp; B2B Legal Terms <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
