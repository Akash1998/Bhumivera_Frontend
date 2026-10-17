import React, { useEffect } from 'react';
import { DollarSign, TrendingUp, Target, Award, ShieldCheck, Scale, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BhumiveraVideo from '../components/BhumiveraVideo';

export default function Affiliate() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f5ef] font-sans pb-20 text-[#1b2921]">
      {/* Hero Section with Live Botanical Video */}
      <div className="relative isolate overflow-hidden bg-[#111e18] text-white py-24 px-4 text-center">
        <div className="absolute inset-0 -z-20 opacity-35">
          <BhumiveraVideo
            src="/assets/videos/founder-manifesto.mp4"
            poster="/assets/images/foundermanifesto.webp"
            alt="Bhumivera Partner and Affiliate Program Video"
            className="h-full w-full object-cover"
            containerClassName="relative h-full w-full overflow-hidden"
            showControls
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
            Interested in collaborating with Bhumivera or sharing our botanical rituals? Explore our written partner terms, Brand Ambassador referral rules, and compliance standards.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="px-7 py-3.5 bg-[#d4af37] text-[#0b1410] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#e5c247] transition-all shadow-lg">
              Apply for Written Terms
            </Link>
            <Link to="/legal?section=warranty_affiliate" className="px-7 py-3.5 border border-white/25 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all inline-flex items-center gap-2">
              <Scale size={14} /> Read Affiliate &amp; Partner Legal Terms
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits & Governance */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: DollarSign, title: "Written Commission Terms", desc: "Any commercial commission, eligibility rules, TDS compliance, and payout schedule depend strictly on a signed written partner agreement." },
            { icon: Award, title: "ASCI & CCPA Compliance", desc: "Partners must use accurate product disclosures, include mandatory #ad/#affiliate tags, and never make unapproved medical claims." },
            { icon: Target, title: "Retail Referral Credits", desc: "Existing retail customers can share their personal referral code from their Profile under our Restricted Referral Balance rules (Part IV of Legal Terms)." },
            { icon: TrendingUp, title: "Anti-Fraud & Fair Use", desc: "Self-referrals, brand-keyword ad bidding, coupon hijacking, and synthetic traffic are strictly prohibited and audited server-side." }
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

        <div className="mt-12 grid lg:grid-cols-[1fr_1fr] gap-8 items-center rounded-2xl border border-[#26392c]/15 bg-white p-6 sm:p-10 shadow-sm">
          <div className="aspect-[16/9] overflow-hidden rounded-xl bg-[#111e18]">
            <BhumiveraVideo
              src="/assets/videos/seabuckthorn-botanical.mp4"
              poster="/assets/images/seabuckthorn nature.webp"
              alt="Bhumivera botanical story film"
              className="h-full w-full object-cover"
              containerClassName="relative h-full w-full overflow-hidden"
              badge="Bhumivera Brand Story · HD Video"
              showControls
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
              <Link to="/legal?section=referrals" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#142019] underline underline-offset-4">
                Referral Rewards Rules <ArrowRight size={13} />
              </Link>
              <Link to="/legal?section=warranty_affiliate" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6b4226] underline underline-offset-4">
                Partner &amp; B2B Legal Terms <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
