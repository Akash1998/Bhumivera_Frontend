import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpen, CheckCircle2, Copy, ExternalLink, FileSpreadsheet,
  Gift, MessageSquare, Plus, RefreshCw, Save, Sparkles, Trash2, Users
} from 'lucide-react';
import { affiliate as affiliateApi } from '../../services/api';
import PromoterProgramManagement from './PromoterProgramManagement';
import AffiliateManagement from './AffiliateManagement';

const DEFAULT_BRIEFS = [
  {
    id: 1,
    slug: 'seabuckthorn-radiance-ritual',
    title: 'Himalayan Sea Buckthorn Barrier & Radiance Ritual',
    product_name: 'Sea Buckthorn Face Wash (100ml)',
    product_slug: 'himalayan-seabuckthorn-luxury-face-wash',
    category: 'Skincare',
    hook_angle: 'Why pH 5.5 barrier balance + 4% Cold-Pressed Himalayan Sea Buckthorn changes how your skin feels after cleansing',
    key_talking_points: '4% Cold-Pressed Sea Buckthorn (Omega-7 & Vitamin C) · 5% Vegetable Glycerin · Hyaluronic Acid & Niacinamide · Sulfate-free & Paraben-free',
    disclosure_rules: 'Clearly include #ad, #BhumiveraPartner, or #gifted in the first lines. Avoid medical or guaranteed-result claims.',
    recommended_formats: 'Instagram Reels (30–45s), YouTube Shorts, AM/PM Sink-Side Routine',
    is_active: 1,
  },
  {
    id: 2,
    slug: 'royal-botanical-hair-ritual',
    title: 'Saponin-Rich Ayurvedic Hair & Scalp Wash Day',
    product_name: 'Botanical 2-in-1 Shampoo (200ml)',
    product_slug: 'luxury-2-in-1-botanical-shampoo-conditioner',
    category: 'Haircare',
    hook_angle: 'Switching from harsh sulfates to traditional Ayurvedic Reetha, Amla, Shikakai & Rosemary Oil in a single 2-in-1 step',
    key_talking_points: '25mg Reetha (natural saponins) · 20mg Amla & Bhringraj · 10mg Pure Rosemary Oil · Built-in botanical conditioning',
    disclosure_rules: 'Clearly disclose creator code & commission relationship (#ad / #BhumiveraPartner).',
    recommended_formats: 'Wash-Day Reel, Ingredient Breakdown Carousel, YouTube Routine',
    is_active: 1,
  },
  {
    id: 3,
    slug: 'artisanal-charcoal-detox-ritual',
    title: 'Daily Pollution & Pore Detox Bathing Ritual',
    product_name: 'Artisanal Cleansing Bar (100g)',
    product_slug: 'artisanal-charcoal-handmade-soap',
    category: 'Skincare',
    hook_angle: 'How microporous Activated Charcoal + soothing Aloe Vera lift urban grime and sweat without drying out skin',
    key_talking_points: 'Handcrafted small-batch Ayurvedic bar · Microporous Activated Charcoal · Soothing Aloe Vera base',
    disclosure_rules: 'Use #ad or #BhumiveraPartner disclosure. Highlight lather texture and post-bath skin comfort.',
    recommended_formats: 'ASMR Lather & Texture Short, Gym/Commute Post-Bath Routine',
    is_active: 1,
  },
  {
    id: 4,
    slug: 'kalpvriksh-seven-tulsi-ritual',
    title: 'Inside-Out Botanical Vitality: 7-Tulsi Morning Ritual',
    product_name: 'Seven-Tulsi Drops (30ml)',
    product_slug: 'kalpvriksh-satva-tulsi-7-tulsi-extract',
    category: 'Wellness',
    hook_angle: '2 drops in warm water every morning: exploring 7 sacred varieties of Tulsi for daily botanical wellness',
    key_talking_points: '90% concentrated liquid distillate · 7 Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi)',
    disclosure_rules: 'Disclose partnership (#ad / #BhumiveraPartner). Present as a traditional Ayurvedic wellness ritual.',
    recommended_formats: 'Morning Desk/Tea Ritual Reel, Wellness Habit Vlog',
    is_active: 1,
  },
];

export default function AffiliateProgramManagement() {
  const [activePanel, setActivePanel] = useState('promoters');
  const [inviteVars, setInviteVars] = useState({
    creatorName: 'Creator',
    handle: '@creator',
    platform: 'Instagram',
    niche: 'Skincare & Botanical Rituals',
    discountPercent: '10',
    sharePercent: '20',
    promoCode: 'CREATOR10',
  });
  const [copiedTemplate, setCopiedTemplate] = useState('');
  const [briefs, setBriefs] = useState(DEFAULT_BRIEFS);
  const [briefsLoading, setBriefsLoading] = useState(false);
  const [briefNotice, setBriefNotice] = useState('');
  const [newBrief, setNewBrief] = useState({
    title: '',
    product_name: 'Sea Buckthorn Face Wash (100ml)',
    product_slug: 'himalayan-seabuckthorn-luxury-face-wash',
    category: 'Skincare',
    hook_angle: '',
    key_talking_points: '',
    recommended_formats: 'Instagram Reels, YouTube Shorts',
    disclosure_rules: 'Use #ad, #BhumiveraPartner, or #gifted clearly. Avoid medical or guaranteed-result claims.',
  });

  const loadBriefs = useCallback(async () => {
    if (!affiliateApi.getAdminCampaignBriefs) return;
    setBriefsLoading(true);
    try {
      const { data } = await affiliateApi.getAdminCampaignBriefs();
      if (Array.isArray(data?.briefs) && data.briefs.length) {
        setBriefs(data.briefs);
      }
    } catch {
      // keep default briefs
    } finally {
      setBriefsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activePanel === 'briefs') {
      loadBriefs();
    }
  }, [activePanel, loadBriefs]);

  const onboardingTemplates = useMemo(() => {
    const name = inviteVars.creatorName.trim() || 'there';
    const handle = inviteVars.handle.trim() || 'your channel';
    const platform = inviteVars.platform || 'Instagram';
    const niche = inviteVars.niche || 'Skincare';
    const code = inviteVars.promoCode.trim().toUpperCase() || 'CREATOR10';
    const discount = inviteVars.discountPercent || '10';
    const share = inviteVars.sharePercent || '20';

    return [
      {
        id: 'executive_invite',
        title: 'Option 1 · Warm Executive Creator Onboarding Invite (Email / DM)',
        badge: '3-Step Official Onboarding',
        text: `Hi ${name},\n\nWe’ve been following your ${niche.toLowerCase()} content on ${platform} (${handle}) and love your honest, educational approach with your community.\n\nWe’d love to invite you to join the Bhumivera Co-Creator & Brand Partner Program. Here is how our 3-step onboarding works:\n\n1. Register at https://www.bhumivera.com/promotions — sign in or create your verified Bhumivera account and submit your 2-minute creator profile.\n2. 12–24 Hour Team Verification — our curation team reviews your profile and activates your reserved creator code.\n3. Campaign Brief & Code Activation — once approved, we share your campaign brief, ${discount}% audience offer code, and ${share}% contribution profit-share ledger.\n\nWhenever you’re ready, you can explore the program and apply here: https://www.bhumivera.com/promotions\n\nWarm regards,\nBhumivera Partnerships Team\nBhumivera Organics India Private Limited`,
      },
      {
        id: 'quick_dm',
        title: 'Option 2 · Fast Instagram / WhatsApp Creator DM',
        badge: 'High-Response Short DM',
        text: `Hi ${name}! Loved your recent ${niche.toLowerCase()} posts on ${handle} 🌿 We’re onboarding select creators for long-term partnerships at Bhumivera.\n\nIt’s a simple 3-step process:\n1️⃣ Apply in 2 mins at https://www.bhumivera.com/promotions\n2️⃣ Our team verifies your profile within 12–24 hours\n3️⃣ We share your campaign brief, ${discount}% community code & open-book earnings portal\n\nWould love to have you apply at https://www.bhumivera.com/promotions ✨`,
      },
      {
        id: 'approved_welcome',
        title: 'Option 3 · Post-Approval Welcome & Campaign Kickoff',
        badge: 'Send After Approving',
        text: `Hi ${name},\n\nWelcome to the Bhumivera Creator Partnership! Your application for ${handle} has been approved.\n\n• Your Active Audience Code: ${code} (${discount}% off for your community)\n• Your Direct Storefront Link: https://www.bhumivera.com/?aff=${code}\n• Your Contribution Profit Share: ${share}% of qualifying order contribution\n• Your Creator Desk & Ledger: https://www.bhumivera.com/promotions\n\nSign in to your Creator Desk to copy ready-to-post captions, review product talking points, and track every attributed order in real time.\n\nLet’s grow together,\nBhumivera Partnerships Team`,
      },
    ];
  }, [inviteVars]);

  const copyTemplateText = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTemplate(id);
      window.setTimeout(() => setCopiedTemplate(''), 1800);
    } catch {
      // ignore clipboard errors
    }
  };

  const saveBrief = async event => {
    event.preventDefault();
    setBriefNotice('');
    if (affiliateApi.saveAdminCampaignBrief) {
      try {
        const { data } = await affiliateApi.saveAdminCampaignBrief(newBrief);
        if (Array.isArray(data?.briefs)) setBriefs(data.briefs);
        setBriefNotice('Campaign brief saved and published to the creator portal.');
        setNewBrief(curr => ({ ...curr, title: '', hook_angle: '', key_talking_points: '' }));
        return;
      } catch {
        // fallback to local state
      }
    }
    setBriefs(curr => [
      ...curr,
      { ...newBrief, id: Date.now(), slug: `brief-${Date.now()}`, is_active: 1 },
    ]);
    setBriefNotice('Campaign brief added.');
    setNewBrief(curr => ({ ...curr, title: '', hook_angle: '', key_talking_points: '' }));
  };

  const removeBrief = async id => {
    if (affiliateApi.deleteAdminCampaignBrief) {
      try {
        const { data } = await affiliateApi.deleteAdminCampaignBrief(id);
        if (Array.isArray(data?.briefs)) {
          setBriefs(data.briefs);
          return;
        }
      } catch {
        // fallback to local filter
      }
    }
    setBriefs(curr => curr.filter(item => item.id !== id));
  };

  const tabClass = panel => `inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
    activePanel === panel
      ? 'bg-[#D4AF37] text-[#102219] shadow-md'
      : 'border border-[#315541] text-[#DFD7C4] hover:border-[#D4AF37]'
  }`;

  const inputClass = 'w-full rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]';

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#244A38] bg-[#102219] px-4 py-3 md:px-6">
        <div className="flex flex-wrap gap-2">
          <button type="button" className={tabClass('promoters')} onClick={() => setActivePanel('promoters')}>
            <Users size={14}/> Influencer &amp; promoter program
          </button>
          <button type="button" className={tabClass('referrals')} onClick={() => setActivePanel('referrals')}>
            <Gift size={14}/> Customer referral rewards
          </button>
          <button type="button" className={tabClass('onboarding')} onClick={() => setActivePanel('onboarding')}>
            <MessageSquare size={14}/> Creator Onboarding &amp; Outreach Studio
          </button>
          <button type="button" className={tabClass('briefs')} onClick={() => setActivePanel('briefs')}>
            <BookOpen size={14}/> Campaign Briefs &amp; Playbooks
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <a
            href="/promotions"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-1.5 text-xs font-semibold text-[#FCE096] hover:border-[#D4AF37]"
          >
            Open /promotions live page <ExternalLink size={12}/>
          </a>
        </div>
      </div>

      {activePanel === 'promoters' && <PromoterProgramManagement/>}
      {activePanel === 'referrals' && <AffiliateManagement/>}

      {activePanel === 'onboarding' && (
        <div className="space-y-6 p-4 text-[#DFD7C4] md:p-6">
          <header className="rounded-2xl border border-[#244A38] bg-[#102219] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Creator Acquisition &amp; Activation</p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-white">3-Step Creator Onboarding Message Studio</h2>
            <p className="mt-2 max-w-3xl text-xs leading-6 text-[#9BB0A5]">
              Generate personalized outreach invites and approval messages guiding creators through Bhumivera’s 3-step workflow: (1) Register at bhumivera.com/promotions, (2) 12–24h team verification, and (3) Campaign detail sharing &amp; code activation.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">
                Creator Name
                <input value={inviteVars.creatorName} onChange={e => setInviteVars(c => ({ ...c, creatorName: e.target.value }))} className={inputClass}/>
              </label>
              <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">
                Social Handle
                <input value={inviteVars.handle} onChange={e => setInviteVars(c => ({ ...c, handle: e.target.value }))} className={inputClass}/>
              </label>
              <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">
                Platform
                <select value={inviteVars.platform} onChange={e => setInviteVars(c => ({ ...c, platform: e.target.value }))} className={inputClass}>
                  {['Instagram', 'YouTube', 'Facebook', 'X'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">
                Content Niche
                <input value={inviteVars.niche} onChange={e => setInviteVars(c => ({ ...c, niche: e.target.value }))} className={inputClass}/>
              </label>
              <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">
                Audience Discount %
                <input type="number" value={inviteVars.discountPercent} onChange={e => setInviteVars(c => ({ ...c, discountPercent: e.target.value }))} className={inputClass}/>
              </label>
              <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">
                Contribution Share %
                <input type="number" value={inviteVars.sharePercent} onChange={e => setInviteVars(c => ({ ...c, sharePercent: e.target.value }))} className={inputClass}/>
              </label>
              <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">
                Assigned / Preview Promo Code
                <input value={inviteVars.promoCode} onChange={e => setInviteVars(c => ({ ...c, promoCode: e.target.value.toUpperCase() }))} className={inputClass}/>
              </label>
            </div>
          </header>

          <div className="grid gap-4 lg:grid-cols-3">
            {onboardingTemplates.map(tpl => (
              <article key={tpl.id} className="flex flex-col justify-between rounded-2xl border border-[#244A38] bg-[#102219] p-5">
                <div>
                  <span className="rounded-full bg-[#D4AF37]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FCE096]">
                    {tpl.badge}
                  </span>
                  <h3 className="mt-3 font-serif text-base font-bold text-white">{tpl.title}</h3>
                  <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-[#315541] bg-[#0b1c14] p-3.5 font-sans text-xs leading-5 text-[#E7EEE8]">
                    {tpl.text}
                  </pre>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => copyTemplateText(tpl.id, tpl.text)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#D4AF37] px-3 py-2 text-xs font-bold text-[#102219] hover:bg-[#FCE096]"
                  >
                    <Copy size={13}/> {copiedTemplate === tpl.id ? 'Copied!' : 'Copy Message'}
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(tpl.text)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-emerald-400/30 bg-emerald-950/30 px-3 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-900/40"
                  >
                    WhatsApp <ExternalLink size={12}/>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {activePanel === 'briefs' && (
        <div className="space-y-6 p-4 text-[#DFD7C4] md:p-6">
          <header className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-[#244A38] bg-[#102219] p-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Product Education Standards</p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-white">Creator Campaign Briefs &amp; Talking Points</h2>
              <p className="mt-1 max-w-3xl text-xs leading-6 text-[#9BB0A5]">
                Manage the product storytelling briefs, substantiated ingredient potencies, and ASCI/FTC disclosure rules shown to creators on /promotions.
              </p>
            </div>
            <button type="button" onClick={loadBriefs} disabled={briefsLoading} className="inline-flex items-center gap-1.5 rounded-lg border border-[#315541] px-3 py-2 text-xs font-semibold text-white">
              <RefreshCw size={13} className={briefsLoading ? 'animate-spin' : ''}/> Refresh Briefs
            </button>
          </header>

          {briefNotice && (
            <p role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-950/20 p-3 text-xs text-emerald-200">
              {briefNotice}
            </p>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {briefs.map(brief => (
              <article key={brief.id || brief.slug} className="rounded-2xl border border-[#244A38] bg-[#102219] p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="rounded-full bg-[#D4AF37]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-[#FCE096]">{brief.category}</span>
                    <h3 className="mt-2 font-serif text-lg font-bold text-white">{brief.title}</h3>
                    <p className="text-xs font-semibold text-emerald-200">{brief.product_name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBrief(brief.id)}
                    className="rounded-lg border border-rose-400/30 p-1.5 text-rose-200 hover:bg-rose-950/40"
                    title="Delete brief"
                  >
                    <Trash2 size={14}/>
                  </button>
                </div>
                <p className="mt-3 text-xs text-[#E7EEE8]"><strong className="text-[#FCE096]">Hook Angle:</strong> {brief.hook_angle}</p>
                <p className="mt-2 text-xs text-[#9BB0A5]"><strong className="text-white">Talking Points:</strong> {brief.key_talking_points}</p>
                <p className="mt-2 text-[11px] text-[#9BB0A5]"><strong className="text-white">Formats:</strong> {brief.recommended_formats}</p>
                <p className="mt-2 rounded-lg border border-[#315541] bg-[#0b1c14] p-2.5 text-[11px] text-[#FCE096]">
                  <strong>Disclosure:</strong> {brief.disclosure_rules}
                </p>
              </article>
            ))}
          </div>

          <form onSubmit={saveBrief} className="space-y-4 rounded-2xl border border-[#244A38] bg-[#102219] p-5">
            <div className="flex items-center gap-2">
              <Plus size={16} className="text-[#D4AF37]"/>
              <h3 className="font-serif text-lg font-bold text-white">Publish a New Creator Campaign Brief</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">
                Campaign Brief Title
                <input required value={newBrief.title} onChange={e => setNewBrief(c => ({ ...c, title: e.target.value }))} placeholder="e.g., Monsoon Scalp Detox Ritual" className={inputClass}/>
              </label>
              <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">
                Featured Product Name
                <input required value={newBrief.product_name} onChange={e => setNewBrief(c => ({ ...c, product_name: e.target.value }))} className={inputClass}/>
              </label>
              <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">
                Category
                <select value={newBrief.category} onChange={e => setNewBrief(c => ({ ...c, category: e.target.value }))} className={inputClass}>
                  {['Skincare', 'Haircare', 'Wellness', 'Lifestyle', 'Unboxing'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">
                Creator Hook Angle
                <input required value={newBrief.hook_angle} onChange={e => setNewBrief(c => ({ ...c, hook_angle: e.target.value }))} placeholder="What story hook should the creator lead with?" className={inputClass}/>
              </label>
              <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">
                Recommended Content Formats
                <input required value={newBrief.recommended_formats} onChange={e => setNewBrief(c => ({ ...c, recommended_formats: e.target.value }))} className={inputClass}/>
              </label>
            </div>
            <label className="block space-y-1 text-[10px] font-semibold text-[#9BB0A5]">
              Substantiated Key Talking Points (Ingredients, pH, Ritual Steps)
              <textarea required rows={2} value={newBrief.key_talking_points} onChange={e => setNewBrief(c => ({ ...c, key_talking_points: e.target.value }))} placeholder="List verified label claims and botanical ingredients..." className={inputClass}/>
            </label>
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2 text-xs font-bold text-[#102219] hover:bg-[#FCE096]">
              <Save size={14}/> Publish Campaign Brief
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
