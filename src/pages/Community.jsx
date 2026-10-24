import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  HandHeart,
  Heart,
  MessageSquare,
  Send,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ArrowRight,
  ShieldCheck,
  Share2,
  Download,
  AlertCircle,
  ThumbsUp,
} from 'lucide-react';
import SEO from '../components/SEO';

const INITIAL_COMMUNITY_POSTS = [
  {
    id: 101,
    author: 'Anirban Mukherjee',
    location: 'Raniganj Station Road',
    role: 'Animal Care Volunteer',
    action: 'Fed 14 street dogs & installed 2 water bowls',
    timestamp: '2 hours ago',
    likes: 18,
    text: 'Set up two heavy terracotta water bowls outside the vegetable market and fed 14 stray community dogs warm boiled rice with broth. Excited for the December winter bedding drive!',
  },
  {
    id: 102,
    author: 'Priyanka Das',
    location: 'Asansol Rail Colony',
    role: 'Annadaan Kitchen Lead',
    action: 'Pledged for Weekend Kitchen Drive',
    timestamp: 'Yesterday',
    likes: 24,
    text: 'Proud to see a local brand tackling real hunger right here on our own streets. Count me in for cooking and packing hot khichdi in sal leaves starting December 2026.',
  },
  {
    id: 103,
    author: 'Rohan Sen',
    location: 'Durgapur River Ghat',
    role: 'River & Earth Guardian',
    action: 'Surveyed Damodar riverbank silt',
    timestamp: '3 days ago',
    likes: 15,
    text: 'Inspected the mud erosion near the tributary crossing. Deep-rooting vetiver grass is the perfect low-cost, natural solution. Can’t wait for our first plantation drive!',
  },
  {
    id: 104,
    author: 'Sunita Chatterjee',
    location: 'Bardhaman',
    role: 'Elder Care Volunteer',
    action: 'Identified 8 isolated elderly widows',
    timestamp: '4 days ago',
    likes: 31,
    text: 'Identified 8 elderly widows living alone in the outskirts who urgently need winter woollen blankets and dry ration grains. Let us make sure no senior shivers this winter.',
  },
];

const UPCOMING_DRIVES = [
  {
    id: 'drive-1',
    title: 'Winter Warmth & Stray Bed Setup Drive',
    date: 'Sunday, December 6, 2026',
    time: '4:00 PM - 7:00 PM',
    location: 'Raniganj Market & Station Area',
    focus: 'Animal Welfare',
    desc: 'Placing straw-lined insulated wooden crates in shop verandas to give street dogs and cats dry sleeping beds for winter.',
    lead: 'Raniganj Volunteer Chapter',
  },
  {
    id: 'drive-2',
    title: 'Weekend Annadaan Community Kitchen (350+ Meals)',
    date: 'Sunday, December 13, 2026',
    time: '11:00 AM - 3:00 PM',
    location: 'Asansol Daily-Wage Colony & Station Periphery',
    focus: 'Hunger Relief',
    desc: 'Cooking and distributing hot nutritious khichdi, vegetable curry, and boiled eggs on biodegradable stitched sal leaves.',
    lead: 'Asansol Youth Volunteer Guild',
  },
  {
    id: 'drive-3',
    title: 'Elderly Dignity Rations & Woollen Blanket Delivery',
    date: 'Sunday, December 20, 2026',
    time: '10:00 AM - 2:00 PM',
    location: 'Paschim Bardhaman Rural Hamlets',
    focus: 'Elderly & Disability Care',
    desc: 'Delivering monthly ration kits (10kg rice, 2kg dal, mustard oil, salt) and thick woollen blankets directly to doorsteps of isolated seniors.',
    lead: 'Rural Outreach Circle',
  },
  {
    id: 'drive-4',
    title: 'Damodar Riverbank Plastic-Free Cleanup & Silt Audit',
    date: 'Sunday, December 27, 2026',
    time: '7:30 AM - 10:30 AM',
    location: 'Damodar River Tributary Crossing',
    focus: 'River Ecology',
    desc: 'Clearing plastic waste from river sands and prepping the bank slopes for the 2027 vetiver bio-filter planting.',
    lead: 'Eco-Action Volunteers',
  },
];

export default function Community() {
  // Volunteer form state
  const [volName, setVolName] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volTown, setVolTown] = useState('Asansol');
  const [volFocus, setVolFocus] = useState('Hunger Relief & Annadaan Kitchen');
  const [volunteerPass, setVolunteerPass] = useState(null);

  // Discussion forum state
  const [posts, setPosts] = useState(INITIAL_COMMUNITY_POSTS);
  const [newAuthor, setNewAuthor] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newRole, setNewRole] = useState('Community Member');
  const [newAction, setNewAction] = useState('');
  const [newText, setNewText] = useState('');
  const [postSuccess, setPostSuccess] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const storedPosts = localStorage.getItem('bv_community_feed');
      if (storedPosts) setPosts(JSON.parse(storedPosts));
    } catch {
      // ignore
    }
  }, []);

  const handleVolunteerSubmit = e => {
    e.preventDefault();
    if (!volName.trim() || !volPhone.trim()) return;

    const passId = `BV-VOL-${volTown.substring(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    const pass = {
      id: passId,
      name: volName.trim(),
      phone: volPhone.trim(),
      email: volEmail.trim(),
      town: volTown,
      focus: volFocus,
      registeredDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('bv_registered_volunteers') || '[]');
      existing.push(pass);
      localStorage.setItem('bv_registered_volunteers', JSON.stringify(existing));
    } catch {
      // ignore
    }

    setVolunteerPass(pass);
  };

  const handlePostSubmit = e => {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim()) return;

    const postObj = {
      id: Date.now(),
      author: newAuthor.trim(),
      location: newLocation.trim() || 'West Bengal',
      role: newRole.trim() || 'Community Steward',
      action: newAction.trim() || 'Community Stewardship Action',
      timestamp: 'Just now',
      likes: 1,
      text: newText.trim(),
    };

    const updated = [postObj, ...posts];
    setPosts(updated);
    try {
      localStorage.setItem('bv_community_feed', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setNewAuthor('');
    setNewLocation('');
    setNewAction('');
    setNewText('');
    setPostSuccess(true);
    setTimeout(() => setPostSuccess(false), 3500);
  };

  const handleLike = postId => {
    const updated = posts.map(p => (p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    setPosts(updated);
    try {
      localStorage.setItem('bv_community_feed', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const filteredPosts =
    activeFilter === 'all'
      ? posts
      : posts.filter(p => p.role.toLowerCase().includes(activeFilter.toLowerCase()) || p.action.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <main className="min-h-screen bg-[#070a0e] text-[#e2e8f0] pb-24 font-sans selection:bg-[#d4af37]/30 selection:text-white">
      <SEO
        title="Bhumivera Grassroots Community Hub | 100+ Volunteers Across West Bengal"
        description="Join the Bhumivera Grassroots Community: 100+ volunteer network in West Bengal for weekend Annadaan feeding, street animal rescue, elderly rations, and Damodar river cleanups."
        route="/community"
      />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#d4af37]/25 bg-gradient-to-b from-[#0b1410] via-[#070a0e] to-[#070a0e] pt-16 pb-20">
        <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-4xl space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-[#102219]/90 px-3.5 py-1 text-[10px] font-mono tracking-widest uppercase text-emerald-300">
                <Users size={12} className="text-emerald-400" /> Bhumivera Community Action Network
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/40 bg-[#070a0e] px-3 py-1 text-[10px] font-mono tracking-wider uppercase text-[#fce096]">
                100% Free to Join · Zero Financial Obligation
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[10px] font-mono tracking-wider uppercase text-amber-300">
                West Bengal Ground Action
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl text-white leading-[1.08] tracking-tight">
              Care Should Be Done <br />
              <span className="font-headline-gold">With Our Own Hands.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#cbd5e1] leading-7 max-w-3xl">
              You do not need money to heal the world. Real grassroots impact begins when ordinary neighbors come together on a Sunday to serve hot meals to daily-wage workers, build warm winter beds for street dogs, deliver food to lonely elderly widows, and plant native vetiver along riverbanks.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#register-volunteer"
                className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl hover:scale-105 transition-transform"
              >
                <HandHeart size={15} className="text-emerald-300" /> Sign Up as Volunteer (Free)
              </a>
              <a
                href="#community-wall"
                className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#cbd5e1] hover:text-white transition-colors"
              >
                <MessageSquare size={14} /> Community Action Wall
              </a>
              <Link
                to="/impact"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#fce096] hover:underline"
              >
                Inspect Public Stewardship Ledger <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 4 PILLARS OF COMMUNITY ACTION */}
      <section className="mx-auto max-w-7xl px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-rose-500/30 bg-[#070a0e] p-5 space-y-2 shadow-xl hover:border-rose-400 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300 block">Immediate Action · Dec 2026</span>
            <h3 className="font-serif text-lg font-bold text-white">Annadaan Community Kitchen</h3>
            <p className="text-xs text-[#cbd5e1] leading-5">Cooking &amp; serving hot wholesome meals on biodegradable sal leaves for daily-wage workers and children.</p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-[#070a0e] p-5 space-y-2 shadow-xl hover:border-amber-400 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 block">Immediate Action · Dec 2026</span>
            <h3 className="font-serif text-lg font-bold text-white">Street Dog &amp; Cat Rescue</h3>
            <p className="text-xs text-[#cbd5e1] leading-5">Daily evening feeding rounds, first-aid wound dressing, and straw-insulated winter beds in shop corridors.</p>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-[#070a0e] p-5 space-y-2 shadow-xl hover:border-cyan-400 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 block">Immediate Action · Dec 2026</span>
            <h3 className="font-serif text-lg font-bold text-white">Disabled &amp; Senior Rations</h3>
            <p className="text-xs text-[#cbd5e1] leading-5">Doorstep delivery of monthly grocery parcels (rice, dal, mustard oil) and thick woollen winter blankets.</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-[#070a0e] p-5 space-y-2 shadow-xl hover:border-emerald-400 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 block">2027 End - 2028 Roadmap</span>
            <h3 className="font-serif text-lg font-bold text-white">River Cleanups &amp; Trees</h3>
            <p className="text-xs text-[#cbd5e1] leading-5">Sunday Damodar plastic cleanups, living vetiver root bio-filters, and 2,000 native trees in jute bags.</p>
          </div>
        </div>
      </section>

      {/* 3. VOLUNTEER REGISTRATION PORTAL */}
      <section id="register-volunteer" className="mx-auto max-w-7xl px-6 pt-16">
        <div className="rounded-3xl border border-[#d4af37]/40 bg-gradient-to-r from-[#102219] via-[#070a0e] to-[#102219] p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-mono text-emerald-400 uppercase">
                <HandHeart size={13} /> Official Volunteer Registration
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl text-white">
                Join 100+ Citizens in West Bengal
              </h2>
              <p className="text-xs sm:text-sm text-[#cbd5e1] leading-6">
                Fill in your details to receive WhatsApp updates for weekend drives in Asansol, Raniganj, Durgapur, and neighboring districts. Zero fee. 100% action.
              </p>

              <div className="rounded-2xl border border-[#d4af37]/20 bg-[#070a0e]/70 p-4 space-y-2 text-xs text-[#cbd5e1]">
                <div className="flex items-center gap-2 text-white font-bold">
                  <CheckCircle2 size={14} className="text-emerald-400" /> What You Receive:
                </div>
                <ul className="space-y-1 text-[11px] text-[#cbd5e1] pl-6 list-disc">
                  <li>Official Digital Volunteer Pass &amp; ID number</li>
                  <li>Direct coordination in local WhatsApp/Telegram groups</li>
                  <li>Verified Ground Steward Certificate after your first drive</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7">
              {!volunteerPass ? (
                <form onSubmit={handleVolunteerSubmit} className="rounded-2xl border border-[#d4af37]/30 bg-[#070a0e] p-6 sm:p-8 space-y-4 shadow-xl">
                  <h3 className="font-serif text-lg font-bold text-white mb-2">Volunteer Enrollment Form</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#cbd5e1] mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Sourav Ganguly"
                        value={volName}
                        onChange={e => setVolName(e.target.value)}
                        className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#cbd5e1] mb-1">WhatsApp / Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g., 9832100000"
                        value={volPhone}
                        onChange={e => setVolPhone(e.target.value)}
                        className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#cbd5e1] mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g., sourav@example.com"
                        value={volEmail}
                        onChange={e => setVolEmail(e.target.value)}
                        className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#cbd5e1] mb-1">Your Town / Chapter</label>
                      <select
                        value={volTown}
                        onChange={e => setVolTown(e.target.value)}
                        className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                      >
                        <option value="Asansol">Asansol</option>
                        <option value="Raniganj">Raniganj</option>
                        <option value="Durgapur">Durgapur</option>
                        <option value="Bardhaman">Bardhaman</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Other West Bengal">Other West Bengal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#cbd5e1] mb-1">Preferred Volunteer Action *</label>
                    <select
                      value={volFocus}
                      onChange={e => setVolFocus(e.target.value)}
                      className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                    >
                      <option value="Hunger Relief & Annadaan Kitchen">Hunger Relief: Cooking, Packing &amp; Serving Hot Meals</option>
                      <option value="Street Dog & Cat Rescue / Feeding">Animal Care: Feeding Street Dogs &amp; Installing Winter Straw Beds</option>
                      <option value="Disabled & Elderly Ration Delivery">Elderly Outreach: Delivering Grain Bags &amp; Warm Blankets</option>
                      <option value="River Cleanups & Vetiver Planting">River &amp; Trees: Damodar Cleanup &amp; Jute Sapling Care</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn-gold-luxury w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xl hover:scale-[1.02] transition-transform"
                  >
                    Confirm Volunteer Enrollment
                  </button>
                </form>
              ) : (
                /* OFFICIAL VOLUNTEER PASS */
                <div className="rounded-3xl border-2 border-emerald-500/50 bg-[#070a0e] p-6 sm:p-8 space-y-4 shadow-2xl text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <Award size={26} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">Volunteer Enrollment Complete!</h3>
                  <p className="text-xs text-[#cbd5e1]">
                    Welcome, <strong className="text-[#fce096]">{volunteerPass.name}</strong>. You are officially enrolled in the Bhumivera Grassroots Stewardship Network.
                  </p>

                  <div className="rounded-2xl border-2 border-[#d4af37] bg-gradient-to-b from-[#102219] to-[#070a0e] p-5 text-left space-y-3">
                    <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-2 text-[10px] font-mono text-[#fce096]">
                      <span>BHUMIVERA COMMUNITY STEWARD PASS</span>
                      <span>{volunteerPass.id}</span>
                    </div>
                    <div className="font-serif text-xl font-bold text-white">{volunteerPass.name}</div>
                    <div className="text-xs text-[#cbd5e1]">
                      <strong>Role:</strong> {volunteerPass.focus}
                    </div>
                    <div className="text-xs text-[#cbd5e1]">
                      <strong>Chapter:</strong> {volunteerPass.town}, West Bengal
                    </div>
                    <div className="text-[10px] font-mono text-[#94a3b8] pt-2 border-t border-[#d4af37]/15">
                      Enrolled: {volunteerPass.registeredDate} · 100% Free Grassroots Service
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="btn-gold-luxury rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
                    >
                      <Download size={13} className="inline mr-1" /> Print / Save Pass
                    </button>
                    <button
                      type="button"
                      onClick={() => setVolunteerPass(null)}
                      className="rounded-xl border border-[#d4af37]/40 px-5 py-2.5 text-xs font-mono text-[#cbd5e1]"
                    >
                      Register Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. UPCOMING ON-GROUND WEEKEND DRIVE CALENDAR */}
      <section className="mx-auto max-w-7xl px-6 pt-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#d4af37]/20">
          <div>
            <span className="font-sub-gold text-[10px] tracking-[0.2em] uppercase text-[#fce096]">
              Action Schedule · December 2026
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white">Upcoming Weekend Ground Drives</h2>
          </div>
          <span className="text-xs font-mono text-[#94a3b8]">All volunteers welcome · Gloves &amp; supplies provided</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {UPCOMING_DRIVES.map(drive => (
            <div
              key={drive.id}
              className="rounded-2xl border border-[#d4af37]/25 bg-[#070a0e] p-6 space-y-3 hover:border-[#d4af37]/60 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="inline-flex items-center gap-1 text-[#fce096]">
                    <Calendar size={13} /> {drive.date}
                  </span>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] text-emerald-400 border border-emerald-500/30">
                    {drive.focus}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-white">{drive.title}</h3>

                <p className="text-xs text-[#cbd5e1] leading-5">{drive.desc}</p>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-[#94a3b8]">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-[#d4af37]" /> {drive.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-[#d4af37]" /> {drive.location}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#d4af37]/15 flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400">Coordinated by {drive.lead}</span>
                <a
                  href="#register-volunteer"
                  className="btn-silver-luxury rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#cbd5e1] hover:text-white"
                >
                  Join This Drive
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LIVE COMMUNITY ACTION WALL & DISCUSSION FORUM */}
      <section id="community-wall" className="mx-auto max-w-7xl px-6 pt-16">
        <div className="rounded-3xl border border-[#d4af37]/35 bg-[#070a0e] p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#d4af37]/20 pb-6">
            <div>
              <span className="font-sub-gold text-[10px] tracking-[0.25em] block uppercase text-[#fce096] mb-1">
                Open Community Action Wall
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-white">
                Voices, Rescues &amp; Deeds from the Ground
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {['all', 'animal', 'kitchen', 'river'].map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3 py-1 rounded-full text-xs font-mono uppercase transition-colors ${
                    activeFilter === tab
                      ? 'bg-[#d4af37] text-black font-bold'
                      : 'border border-[#d4af37]/30 text-[#cbd5e1] hover:text-white'
                  }`}
                >
                  {tab === 'all' ? 'All Updates' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Feed of Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPosts.map(post => (
              <div
                key={post.id}
                className="rounded-2xl border border-[#d4af37]/20 bg-[#102219]/30 p-5 space-y-3 hover:border-[#d4af37]/50 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-7 w-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                        {post.author[0]}
                      </span>
                      <div>
                        <strong className="text-xs text-white block">{post.author}</strong>
                        <span className="text-[10px] font-mono text-[#94a3b8]">{post.location} · {post.role}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#cbd5e1]">{post.timestamp}</span>
                  </div>

                  <div className="inline-block rounded-full bg-[#070a0e] px-2.5 py-0.5 text-[10px] font-mono text-[#fce096] border border-[#d4af37]/25">
                    {post.action}
                  </div>

                  <p className="text-xs text-[#cbd5e1] leading-5">{post.text}</p>
                </div>

                <div className="pt-3 border-t border-[#d4af37]/15 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleLike(post.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#fce096] hover:text-white transition-colors"
                  >
                    <ThumbsUp size={13} /> {post.likes} Applauds
                  </button>
                  <span className="text-[10px] font-mono text-emerald-400">Verified Citizen Steward</span>
                </div>
              </div>
            ))}
          </div>

          {/* Post Submission Form */}
          <form onSubmit={handlePostSubmit} className="rounded-2xl border border-[#d4af37]/40 bg-[#070a0e] p-5 sm:p-6 space-y-4">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <MessageSquare size={16} className="text-[#d4af37]" /> Share Your Thoughts or Report a Ground Action:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Your Name *"
                value={newAuthor}
                onChange={e => setNewAuthor(e.target.value)}
                className="rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Location (e.g., Asansol, Raniganj)"
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
                className="rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Action Taken (e.g., Fed 8 stray dogs)"
                value={newAction}
                onChange={e => setNewAction(e.target.value)}
                className="rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <textarea
              required
              rows={3}
              placeholder="Write your story, report a local animal in need, or share words of encouragement for fellow volunteers..."
              value={newText}
              onChange={e => setNewText(e.target.value)}
              className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-3 text-xs text-white focus:border-[#d4af37] focus:outline-none"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#94a3b8]">
                {postSuccess ? (
                  <span className="text-emerald-400 font-bold">Your update has been published on the wall!</span>
                ) : (
                  'Posts are reviewed by community moderators for kindness and authenticity.'
                )}
              </span>
              <button
                type="submit"
                className="btn-gold-luxury rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xl flex items-center gap-1.5"
              >
                <Send size={13} /> Post to Wall
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION */}
      <section className="mx-auto max-w-7xl px-6 pt-16">
        <div className="rounded-3xl border border-[#d4af37]/30 bg-gradient-to-r from-[#102219] via-[#070a0e] to-[#102219] p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="mx-auto max-w-3xl space-y-4">
            <span className="font-sub-gold text-[10px] tracking-[0.25em] block uppercase text-[#fce096]">
              Radical Kindness &amp; Open Collaboration
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white">
              Every Living Soul Deserves Food, Shelter &amp; Clean Water.
            </h2>
            <p className="text-xs sm:text-sm leading-6 text-[#cbd5e1] max-w-xl mx-auto">
              Whether you can volunteer 1 hour this Sunday or help co-sponsor a sack of rice, your presence matters. Let us heal West Bengal together.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <a
                href="#register-volunteer"
                className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl"
              >
                <HandHeart size={16} /> Enroll as Volunteer
              </a>
              <Link
                to="/impact"
                className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#cbd5e1] hover:text-white"
              >
                Inspect Public Ledger <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
