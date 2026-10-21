import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Calendar,
  MapPin,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Heart,
  Share2,
  Download,
  Info,
  Scale,
  Award,
  Sparkles,
  ExternalLink,
  Users,
  HandHeart,
} from 'lucide-react';
import SEO from '../components/SEO';
import {
  IMPACT_PROJECTS,
  findProjectById,
  LEGAL_CHARTER_FRAMEWORK,
} from '../data/impactDeepDiveData';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const formatInr = num => `₹${Number(num || 0).toLocaleString('en-IN')}`;

export default function ImpactProjectDetail() {
  const { imageId, projectId } = useParams();
  const { user, isAuthenticated } = useAuth() || {};
  const currentId = projectId || imageId || 'hungry-feeding';
  const project = findProjectById(currentId);

  // Pledge / Volunteer modal & Certificate state
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('sponsor'); // 'sponsor' or 'volunteer'
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [patronName, setPatronName] = useState('');
  const [patronEmail, setPatronEmail] = useState('');
  const [patronPhone, setPatronPhone] = useState('');
  const [volunteerRole, setVolunteerRole] = useState('Ground Volunteer (Food / Planting)');
  const [dedicationMessage, setDedicationMessage] = useState('');
  const [certificateData, setCertificateData] = useState(null);
  const [pledgeSuccess, setPledgeSuccess] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [certificateSent, setCertificateSent] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Project totals are loaded from the verified public contribution ledger.
  const [livePledged, setLivePledged] = useState(0);
  const [liveBackers, setLiveBackers] = useState(0);
  const [impactLedgerLoaded, setImpactLedgerLoaded] = useState(false);
  const [impactLedgerError, setImpactLedgerError] = useState(false);

  useEffect(() => {
    let active = true;
    setLivePledged(0);
    setLiveBackers(0);
    setImpactLedgerLoaded(false);
    setImpactLedgerError(false);
    try {
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      // ignore
    }

    api.get('/impact/public')
      .then(({ data }) => {
        if (!active) return;
        const total = data.totals?.find(row => row.project_key === project.id);
        setLivePledged(Number(total?.collected_amount) || 0);
        setLiveBackers(Number(total?.contributions) || 0);
        setImpactLedgerLoaded(true);
      })
      .catch(error => {
        console.error('[IMPACT_PROJECT_LEDGER_LOAD]', error);
        if (active) {
          setImpactLedgerLoaded(true);
          setImpactLedgerError(true);
        }
      });

    if (project.funding?.unitPackages?.length > 0) {
      setSelectedUnit(project.funding.unitPackages[0]);
    }
    return () => { active = false; };
  }, [project.id, project.funding?.unitPackages]);

  const confirmImpactPayment = async verification => {
    const { data: result } = await api.post('/impact/donations/verify-payment', verification, { notify: false });
    const certificate = {
      ...result.certificate,
      type: 'sponsor',
      date: new Date(result.certificate.issuedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      impactEquivalence: selectedUnit?.impactEquivalence || `Direct grassroots support for ${project.title}.`,
      location: project.location,
    };
    setCertificateData(certificate);
    setCertificateSent(result.certificateSent);
    setPledgeSuccess(true);
    try {
      const { data } = await api.get('/impact/public');
      const total = data.totals?.find(row => row.project_key === project.id);
      setLivePledged(Number(total?.collected_amount) || 0);
      setLiveBackers(Number(total?.contributions) || 0);
      setImpactLedgerLoaded(true);
      setImpactLedgerError(false);
    } catch (error) {
      console.error('[IMPACT_PROJECT_LEDGER_REFRESH]', error);
      setImpactLedgerError(true);
    }
    return result;
  };

  const handlePledgeSubmit = async e => {
    e.preventDefault();
    setPaymentError('');

    const finalAmount =
      modalMode === 'volunteer'
        ? 0
        : customAmount
        ? Number(customAmount)
        : selectedUnit
        ? selectedUnit.amount
        : 100;

    if (modalMode === 'volunteer') {
      if (!patronName.trim() || !patronEmail.trim()) return;
      const timestamp = Date.now();
      const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
      setCertificateData({
        code: `BV-${project.id.toUpperCase().substring(0, 4)}-${timestamp.toString(36).toUpperCase()}-${randomHex}`,
        type: 'volunteer',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        name: patronName.trim(),
        amount: 0,
        volunteerRole,
        projectTitle: project.title,
        targetYear: project.phaseYear,
        impactEquivalence: `Registered Ground Volunteer · ${volunteerRole}`,
        dedication: '',
        location: project.location,
      });
      setPledgeSuccess(true);
      return;
    }

    if (!isAuthenticated || !user?.email) {
      setPaymentError('Sign in to your Bhumivera account before co-sponsoring materials. Your certificate is sent to your registered email address.');
      return;
    }
    if (!Number.isSafeInteger(finalAmount) || finalAmount < 50 || finalAmount > 500000) {
      setPaymentError('Enter a contribution amount between ₹50 and ₹5,00,000.');
      return;
    }

    setPaymentLoading(true);
    let razorpayOrder;
    try {
      const { data } = await api.post('/impact/donations/create-order', {
        amount: finalAmount,
        projectKey: project.id,
        dedication: dedicationMessage.trim(),
      }, { notify: false });
      razorpayOrder = data;
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Unable to load the secure payment checkout.'));
          document.body.appendChild(script);
        });
      }
      if (!window.Razorpay) throw new Error('Secure payment checkout is unavailable. Please try again.');

      const checkout = new window.Razorpay({
        key: razorpayOrder.key_id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Bhumivera',
        description: `Grassroots co-sponsorship · ${project.title}`,
        order_id: razorpayOrder.order_id,
        prefill: {
          name: user.name || '',
          email: user.email,
          contact: user.phone || '',
        },
        theme: { color: '#0b2419' },
        handler: async response => {
          const verification = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amountPaise: razorpayOrder.amount,
            dedication: dedicationMessage.trim(),
          };
          setPaymentReceipt(verification);
          try {
            await confirmImpactPayment(verification);
          } catch (error) {
            setPaymentError(error.response?.data?.message || error.message || 'Payment completed, but verification could not be confirmed. Retry verification before making another payment.');
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: () => setPaymentLoading(false),
        },
      });
      checkout.on('payment.failed', event => {
        setPaymentError(event.error?.description || 'Payment did not complete. You have not been charged.');
        setPaymentLoading(false);
      });
      checkout.open();
    } catch (error) {
      setPaymentError(error.response?.data?.message || error.message || 'Unable to start payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  const retryPaymentVerification = async () => {
    if (!paymentReceipt) return;
    setPaymentLoading(true);
    setPaymentError('');
    try {
      await confirmImpactPayment(paymentReceipt);
    } catch (error) {
      setPaymentError(error.response?.data?.message || 'Unable to verify this payment yet. Retry verification or contact support; do not pay again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const retryCertificateEmail = async () => {
    if (!paymentReceipt) return;
    setPaymentLoading(true);
    setPaymentError('');
    try {
      const { data: result } = await api.post('/impact/donations/verify-payment', paymentReceipt, { notify: false });
      setCertificateSent(result.certificateSent);
      if (!result.certificateSent) {
        setPaymentError('Your payment is recorded, but the certificate email could not be delivered yet. Please retry or contact support.');
      }
    } catch (error) {
      setPaymentError(error.response?.data?.message || 'Unable to retry certificate delivery. Please contact support.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${project.title} | Bhumivera Grassroots Dossier`,
          text: project.tagline,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const percentFunded = Math.min(
    100,
    Math.round((livePledged / (project.funding.targetAmount || 1)) * 100)
  );

  const relatedProjects = IMPACT_PROJECTS.filter(p => p.id !== project.id).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#070a0e] text-[#e2e8f0] pb-24 font-sans selection:bg-[#d4af37]/30 selection:text-white">
      <SEO
        title={`${project.title} | Bhumivera Community & Impact Dossier`}
        description={project.tagline}
        route={`/impact/${project.slug}`}
      />

      {/* TOP NAVIGATION BREADCRUMB */}
      <div className="border-b border-[#d4af37]/20 bg-[#070a0e]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 text-xs">
          <Link
            to="/impact#ledger"
            className="inline-flex items-center gap-2 text-[#cbd5e1] hover:text-[#fce096] transition-colors"
          >
            <ArrowLeft size={14} className="text-[#d4af37]" /> Back to Public Stewardship Ledger
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400">
              <ShieldCheck size={12} /> {project.statusBadge}
            </span>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#d4af37]/30 bg-[#070a0e] px-2.5 py-1 text-[11px] font-semibold text-[#fce096] hover:bg-[#d4af37]/15 transition-colors"
            >
              <Share2 size={12} /> {copiedLink ? 'Link Copied!' : 'Share Dossier'}
            </button>
          </div>
        </div>
      </div>

      {/* 1. HERO DOSSIER SECTION */}
      <section className="relative overflow-hidden border-b border-[#d4af37]/25 bg-gradient-to-b from-[#0b1410] via-[#070a0e] to-[#070a0e] pt-10 pb-16">
        <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Metadata, Badges, Title & Tagline */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/40 bg-[#102219]/90 px-3.5 py-1 text-[10px] font-mono tracking-widest text-[#fce096] uppercase">
                  <Leaf size={12} className="text-[#d4af37]" /> {project.phaseYear}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[10px] font-mono text-cyan-300">
                  <MapPin size={11} /> {project.location}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-mono text-amber-300">
                  <Calendar size={11} /> Target Launch: {project.targetLaunch}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight">
                {project.title}
              </h1>

              <p className="font-serif italic text-lg sm:text-xl text-[#fce096]/90 border-l-2 border-[#d4af37] pl-4 py-1">
                "{project.tagline}"
              </p>

              <p className="text-xs sm:text-sm text-[#94a3b8] font-mono flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#d4af37]" /> Lead Community Desk:{' '}
                <span className="text-[#cbd5e1] font-sans font-medium">{project.leadScientist}</span>
              </p>

              {/* Quick Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setModalMode('volunteer');
                    setIsPledgeModalOpen(true);
                  }}
                  className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-2xl hover:scale-[1.02] transition-transform"
                >
                  <HandHeart size={15} className="text-emerald-300" /> Join as a Volunteer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalMode('sponsor');
                    setIsPledgeModalOpen(true);
                  }}
                  className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#cbd5e1] hover:text-white transition-colors"
                >
                  <Heart size={14} className="text-rose-400" /> Co-Sponsor Materials
                </button>
                <a
                  href="#problem-crisis"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#fce096] hover:underline"
                >
                  Inspect Ground Scarcity <TrendingUp size={13} />
                </a>
              </div>
            </div>

            {/* Right Column: Authentic Poster Artwork Frame */}
            <div className="lg:col-span-5">
              <div className="relative group overflow-hidden rounded-3xl border-2 border-[#d4af37]/40 bg-[#070a0e] shadow-2xl">
                <img
                  src={project.posterImage}
                  alt={project.title}
                  className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#070a0e] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-[#fce096] bg-[#070a0e]/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#d4af37]/30">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[#d4af37]" /> Authentic Field Record
                  </span>
                  <span className="text-emerald-400 font-bold">{project.phaseYear.split('·')[0]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME PUBLIC CONTRIBUTION LEDGER */}
      <section className="mx-auto max-w-7xl px-6 -mt-8 relative z-20">
        <div className="rounded-3xl border border-[#d4af37]/40 bg-gradient-to-r from-[#102219] via-[#070a0e] to-[#102219] p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#d4af37]/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-sub-gold text-[10px] tracking-[0.2em] uppercase text-[#fce096]">
                  Grassroots Field Deployment Fund · Verified Live Ledger
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-mono text-emerald-400 border border-emerald-500/30 uppercase">
                  Zero Fake Numbers
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {impactLedgerLoaded && !impactLedgerError ? formatInr(livePledged) : '—'}{' '}
                <span className="text-sm font-sans font-normal text-[#94a3b8]">
                  raised of modest {formatInr(project.funding.targetAmount)} target
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="font-serif text-2xl font-bold text-[#fce096]">
                  {impactLedgerLoaded && !impactLedgerError ? liveBackers : '—'}
                </div>
                <div className="text-[11px] font-mono text-[#94a3b8] uppercase">Ground Patrons</div>
              </div>
              <div className="text-right border-l border-[#d4af37]/20 pl-6">
                <div className="font-serif text-2xl font-bold text-emerald-400">
                  {impactLedgerLoaded && !impactLedgerError ? `${percentFunded}%` : '—'}
                </div>
                <div className="text-[11px] font-mono text-[#94a3b8] uppercase">Funded</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setModalMode('sponsor');
                  setIsPledgeModalOpen(true);
                }}
                className="btn-gold-luxury rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xl hover:scale-105 transition-transform shrink-0"
              >
                Co-Sponsor
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-5 space-y-2">
            <div className="h-3 w-full rounded-full bg-[#070a0e] border border-[#d4af37]/30 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#d4af37] via-[#fce096] to-emerald-400 transition-all duration-700"
                style={{ width: `${percentFunded}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#94a3b8]">
              <span>Every single rupee goes directly into buying on-ground materials. Zero admin overhead.</span>
              <span>Launch: {project.phaseYear}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GROUND SCARCITY: THE LOCAL REALITY WE MUST FIX */}
      <section id="problem-crisis" className="mx-auto max-w-7xl px-6 pt-16">
        <div className="rounded-3xl two-tone-card border border-rose-900/30 bg-[#070a0e] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-rose-500/5 blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-rose-400" />
            <span className="font-sub-gold text-[10px] tracking-[0.25em] uppercase text-rose-300">
              Grassroots Scarcity &amp; Ground Reality Dossier
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl text-white max-w-3xl leading-tight">
            {project.problemDossier.headline}
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-[#cbd5e1] leading-7 max-w-4xl">
            {project.problemDossier.historicalContext}
          </p>

          {/* 4 Stark Scarcity Metrics Grid */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {project.problemDossier.scarcityStats.map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-5 text-left"
              >
                <div className="font-serif text-3xl sm:text-4xl font-bold text-rose-300">{stat.value}</div>
                <div className="mt-1 text-xs font-semibold text-white">{stat.label}</div>
                <div className="mt-1 text-[10px] font-mono text-rose-200/60">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Key Human Factors */}
          <div className="mt-8 rounded-2xl border border-[#d4af37]/20 bg-[#070a0e]/70 p-6">
            <h3 className="font-serif text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-rose-400">●</span> Key Ground Realities We Are Addressing:
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#cbd5e1]">
              {project.problemDossier.keyFactors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. WHAT HAPPENS WITHOUT ACTION */}
      <section className="mx-auto max-w-7xl px-6 pt-12">
        <div className="rounded-3xl border border-amber-900/40 bg-gradient-to-br from-[#18110b] via-[#070a0e] to-[#070a0e] p-6 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-sub-gold text-[10px] tracking-[0.25em] uppercase text-amber-300">
              The Cost of Inaction
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white">
            {project.futureWithout.headline}
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#cbd5e1] leading-6 max-w-3xl">
            {project.futureWithout.summary}
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.futureWithout.consequences.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-5 flex items-start gap-3.5"
              >
                <span className="rounded-full bg-amber-500/20 p-2 text-amber-400 font-mono text-xs font-bold shrink-0">
                  0{idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-[#e2e8f0] leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THE PRACTICAL GROUND BLUEPRINT */}
      <section className="mx-auto max-w-7xl px-6 pt-16">
        <div className="rounded-3xl two-tone-card border border-emerald-500/30 bg-[#070a0e] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 mb-2">
            <Leaf size={16} className="text-emerald-400" />
            <span className="font-sub-gold text-[10px] tracking-[0.25em] uppercase text-emerald-400">
              Practical On-Ground Action Blueprint
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl text-white max-w-3xl">
            {project.solutionBlueprint.headline}
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-[#cbd5e1] leading-7 max-w-4xl">
            {project.solutionBlueprint.methodology}
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.solutionBlueprint.pillars.map((pillar, i) => (
              <div
                key={i}
                className="rounded-2xl border border-emerald-500/20 bg-[#102219]/40 p-6 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                    0{i + 1}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white">{pillar.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-6 pl-10">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. QUANTIFIABLE IMPACT DATA COLUMNS */}
      <section className="mx-auto max-w-7xl px-6 pt-16">
        <div className="rounded-3xl border border-[#d4af37]/35 bg-gradient-to-b from-[#0b1410] to-[#070a0e] p-6 sm:p-10 shadow-2xl">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="font-sub-gold text-[10px] tracking-[0.25em] block uppercase text-[#fce096] mb-2">
              Measurable Local Change
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white">
              Quantifiable Impact: Before vs After
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#94a3b8]">
              Realistic, ground-level outcomes that directly improve lives and nature in our local region.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.impactColumns.map((col, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#d4af37]/20 bg-[#070a0e]/80 p-6 space-y-4 hover:border-[#d4af37]/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white">{col.metric}</h3>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/30">
                    {col.gain}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3">
                    <span className="block text-[10px] font-mono text-rose-300 uppercase tracking-wider">
                      Current Baseline
                    </span>
                    <span className="font-serif text-lg font-bold text-white mt-1 block">{col.before}</span>
                  </div>
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3">
                    <span className="block text-[10px] font-mono text-emerald-300 uppercase tracking-wider">
                      Bhumivera Target
                    </span>
                    <span className="font-serif text-lg font-bold text-[#fce096] mt-1 block">{col.after2027}</span>
                  </div>
                </div>

                <p className="text-xs text-[#cbd5e1] leading-5 pt-1 border-t border-[#d4af37]/15">
                  {col.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Academic Citations */}
          {project.academicCitations?.length > 0 && (
            <div className="mt-8 rounded-2xl border border-[#d4af37]/15 bg-[#070a0e]/60 p-5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#94a3b8] block mb-2">
                Field References &amp; Local Documentation
              </span>
              <ul className="space-y-1.5 text-xs text-[#cbd5e1] font-mono">
                {project.academicCitations.map((cite, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <ExternalLink size={12} className="text-[#d4af37] shrink-0" />
                    <span>{cite}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* 7. PRACTICAL LOW-COST UNIT SPONSORSHIP PACKAGES */}
      <section id="funding-packages" className="mx-auto max-w-7xl px-6 pt-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="font-sub-gold text-[10px] tracking-[0.25em] block uppercase text-[#fce096] mb-2">
            Grassroots Co-Sponsorship Options
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-white">
            Simple, Transparent, Low-Budget Units
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#94a3b8]">
            Even ₹100 directly feeds 3 hungry people or plants 10 deep-rooting vetiver grass slips. 100% of funds go to physical ingredients and materials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {project.funding.unitPackages.map((pkg, i) => {
            const isSelected = selectedUnit?.amount === pkg.amount && !customAmount && modalMode === 'sponsor';
            return (
              <div
                key={i}
                onClick={() => {
                  setSelectedUnit(pkg);
                  setCustomAmount('');
                  setModalMode('sponsor');
                  setIsPledgeModalOpen(true);
                }}
                className={`cursor-pointer rounded-2xl p-6 border transition-all duration-300 relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#d4af37] bg-[#102219]/90 shadow-2xl scale-[1.02]'
                    : 'border-[#d4af37]/25 bg-[#070a0e] hover:border-[#d4af37]/60 hover:bg-[#102219]/40'
                }`}
              >
                <div>
                  <span className="inline-block rounded-full bg-[#d4af37]/20 px-2.5 py-0.5 text-[10px] font-mono text-[#fce096] uppercase mb-3">
                    {pkg.tag}
                  </span>
                  <div className="font-serif text-2xl font-bold text-white mb-2">{formatInr(pkg.amount)}</div>
                  <h3 className="font-serif text-base font-bold text-[#fce096] mb-2">{pkg.title}</h3>
                  <p className="text-xs text-[#cbd5e1] leading-5">{pkg.impactEquivalence}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#d4af37]/15 flex items-center justify-between text-xs font-bold text-white">
                  <span>Co-Sponsor This Unit</span>
                  <ArrowRight size={14} className="text-[#d4af37]" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={() => {
              setModalMode('volunteer');
              setIsPledgeModalOpen(true);
            }}
            className="btn-gold-luxury rounded-xl px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xl hover:scale-105 transition-transform"
          >
            <HandHeart size={14} className="inline mr-1 text-emerald-300" /> Sign Up to Volunteer Hands-On
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedUnit(null);
              setModalMode('sponsor');
              setIsPledgeModalOpen(true);
            }}
            className="btn-silver-luxury rounded-xl px-6 py-3 text-xs font-mono uppercase tracking-wider text-[#cbd5e1] hover:text-white"
          >
            Sponsor Custom Amount
          </button>
        </div>
      </section>

      {/* 8. INDIAN LEGAL RULES & HOW WE OPERATE CHARTER */}
      <section id="legal-rules" className="mx-auto max-w-7xl px-6 pt-16">
        <div className="rounded-3xl border border-[#d4af37]/35 bg-[#070a0e] p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center gap-2">
            <Scale size={20} className="text-[#d4af37]" />
            <div>
              <span className="font-sub-gold text-[10px] tracking-[0.25em] block uppercase text-[#fce096]">
                Legal Transparency &amp; Compliance Under Indian Law
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-white">
                Can An Indian Company Take Donations? The Full Legal Truth
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#cbd5e1] leading-6">
            At Bhumivera, we reject ambiguous corporate greenwashing. Indian corporate and tax jurisprudence creates clear, uncompromising rules regarding public money and environmental action. Here is how we comply 100%:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {LEGAL_CHARTER_FRAMEWORK.rules.map(rule => (
              <div
                key={rule.id}
                className="rounded-2xl border border-[#d4af37]/20 bg-[#102219]/30 p-6 space-y-3"
              >
                <h3 className="font-serif text-base font-bold text-white">{rule.title}</h3>
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs font-semibold text-amber-200">
                  {rule.shortAnswer}
                </div>
                <p className="text-xs text-[#cbd5e1] leading-5">{rule.fullExplanation}</p>
                <div className="pt-2 border-t border-[#d4af37]/15 text-[11px] font-mono text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 size={13} className="shrink-0" />
                  <span>{rule.implication}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                The 2028 Bhumivera Earth Foundation Commitment
              </h4>
              <p className="text-xs text-[#cbd5e1]">
                By 2028, our independent Section 8 not-for-profit company will offer direct 80G tax deductions for individual donors and receive corporate CSR-1 contributions.
              </p>
            </div>
            <Link
              to="/impact#ledger"
              className="btn-gold-luxury rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shrink-0 text-center"
            >
              Inspect Public Ledger
            </Link>
          </div>
        </div>
      </section>

      {/* 9. EXPLORE OTHER CORRIDORS */}
      <section className="mx-auto max-w-7xl px-6 pt-16">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#d4af37]/20">
          <div>
            <span className="font-sub-gold text-[10px] tracking-[0.2em] uppercase text-[#fce096]">
              Grassroots Action Roadmap
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white">Explore Other Community Drives</h2>
          </div>
          <Link
            to="/impact#ledger"
            className="text-xs font-mono text-[#fce096] hover:underline flex items-center gap-1.5"
          >
            All Initiatives <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {relatedProjects.map(rel => (
            <Link
              key={rel.id}
              to={`/impact/${rel.slug}`}
              className="group overflow-hidden rounded-2xl border border-[#d4af37]/25 bg-[#070a0e] transition-all hover:border-[#d4af37]/80 hover:shadow-2xl"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#070a0e]">
                <img
                  src={rel.posterImage}
                  alt={rel.title}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 space-y-2">
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-mono uppercase text-emerald-400">
                  {rel.statusBadge}
                </span>
                <h3 className="font-serif text-base font-bold text-white group-hover:text-[#fce096] transition-colors line-clamp-1">
                  {rel.title}
                </h3>
                <p className="text-xs text-[#94a3b8] line-clamp-2">{rel.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* INTERACTIVE PLEDGE / VOLUNTEER & CERTIFICATE MODAL */}
      {isPledgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-[#d4af37]/50 bg-[#070a0e] p-6 sm:p-8 shadow-2xl my-8">
            <button
              type="button"
              onClick={() => {
                setIsPledgeModalOpen(false);
                setPledgeSuccess(false);
                setCertificateData(null);
              }}
              className="absolute top-5 right-5 text-[#94a3b8] hover:text-white text-xl font-bold font-mono"
            >
              ✕
            </button>

            {!pledgeSuccess ? (
              <form onSubmit={handlePledgeSubmit} className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setModalMode('volunteer')}
                      className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase transition-colors ${
                        modalMode === 'volunteer'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                          : 'text-[#94a3b8] hover:text-white'
                      }`}
                    >
                      <HandHeart size={12} className="inline mr-1" /> Volunteer Hands-On (₹0)
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalMode('sponsor')}
                      className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase transition-colors ${
                        modalMode === 'sponsor'
                          ? 'bg-[#d4af37]/20 text-[#fce096] border border-[#d4af37]/40 font-bold'
                          : 'text-[#94a3b8] hover:text-white'
                      }`}
                    >
                      <Heart size={12} className="inline mr-1 text-rose-400" /> Co-Sponsor Materials
                    </button>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-white">
                    {modalMode === 'volunteer'
                      ? `Sign Up to Volunteer for ${project.title}`
                      : `Co-Sponsor Materials for ${project.title}`}
                  </h3>
                  <p className="mt-1 text-xs text-[#94a3b8]">
                    {modalMode === 'volunteer'
                      ? 'Join 100+ local citizens taking direct action in West Bengal. Give your hands and heart.'
                      : '100% of your voluntary co-sponsorship goes directly into buying physical materials. Zero admin cuts.'}
                  </p>
                </div>

                {/* VOLUNTEER FORM FIELDS */}
                {modalMode === 'volunteer' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#cbd5e1] mb-1">
                        Select Your Preferred Volunteer Role *
                      </label>
                      <select
                        value={volunteerRole}
                        onChange={e => setVolunteerRole(e.target.value)}
                        className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                      >
                        <option value="Ground Volunteer (Food Preparation / Distribution)">
                          Ground Volunteer: Food Preparation, Packing &amp; Serving
                        </option>
                        <option value="Animal Rescuer (Feeding Rounds & Stray Bed Setup)">
                          Animal Care: Stray Dog/Cat Feeding Rounds &amp; Bed Setup
                        </option>
                        <option value="Tree Planter (Riverbank Vetiver & Sapling Care)">
                          Ecological Volunteer: Tree Planting &amp; Riverbank Cleanups
                        </option>
                        <option value="Logistics & Driving (Transporting Grains & Tools)">
                          Logistics: Driving / Transporting Food &amp; Plantation Tools
                        </option>
                        <option value="Field Photographer & Public Ledger Auditor">
                          Media &amp; Audit: Taking Photos &amp; Verifying Field Receipts
                        </option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#cbd5e1] mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Sourav Ganguly"
                          value={patronName}
                          onChange={e => setPatronName(e.target.value)}
                          className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#cbd5e1] mb-1">
                          WhatsApp / Mobile Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g., 9876543210 (For drive updates)"
                          value={patronPhone}
                          onChange={e => setPatronPhone(e.target.value)}
                          className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#cbd5e1] mb-1">
                        Email Address (For Volunteer Certificate) *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g., sourav@example.com"
                        value={patronEmail}
                        onChange={e => setPatronEmail(e.target.value)}
                        className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  /* CO-SPONSOR FORM FIELDS */
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#cbd5e1]">
                        Select or Enter Co-Sponsorship Amount:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {project.funding.unitPackages.map(pkg => (
                          <button
                            key={pkg.amount}
                            type="button"
                            onClick={() => {
                              setSelectedUnit(pkg);
                              setCustomAmount('');
                            }}
                            className={`rounded-xl border p-3 text-left transition-all ${
                              selectedUnit?.amount === pkg.amount && !customAmount
                                ? 'border-[#d4af37] bg-[#102219] text-[#fce096] shadow-md'
                                : 'border-[#d4af37]/20 bg-[#070a0e] text-white hover:border-[#d4af37]/50'
                            }`}
                          >
                            <div className="font-serif font-bold text-base">{formatInr(pkg.amount)}</div>
                            <div className="text-[10px] font-mono text-[#94a3b8] truncate">{pkg.tag}</div>
                          </button>
                        ))}
                      </div>

                      <div className="pt-2">
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-serif text-sm text-[#d4af37]">₹</span>
                          <input
                            type="number"
                            min="50"
                            max="500000"
                            step="50"
                            placeholder="Or enter custom amount in INR"
                            value={customAmount}
                            onChange={e => {
                              setCustomAmount(e.target.value);
                              setSelectedUnit(null);
                            }}
                            className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] py-2.5 pl-8 pr-4 text-xs font-mono text-white placeholder-[#64748b] focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#cbd5e1] mb-1">
                          Account Name
                        </label>
                        <input
                          type="text"
                          value={user?.name || ''}
                          readOnly
                          className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#cbd5e1] mb-1">
                          Registered Email (Certificate Delivery)
                        </label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          readOnly
                          className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#cbd5e1] mb-1">
                        Optional Dedication (Printed on Certificate)
                      </label>
                      <input
                        type="text"
                        maxLength={100}
                        placeholder="e.g., In memory of my mother, or for street animals of Bengal."
                        value={dedicationMessage}
                        onChange={e => setDedicationMessage(e.target.value)}
                        className="w-full rounded-xl border border-[#d4af37]/30 bg-[#070a0e] p-2.5 text-xs text-white placeholder-[#64748b] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Legal Notice */}
                <div className="rounded-xl border border-[#d4af37]/20 bg-[#070a0e] p-3 text-[11px] text-[#94a3b8] leading-5 space-y-1">
                  <p className="flex items-center gap-1.5 font-bold text-amber-300">
                    <Info size={13} /> Legal &amp; Fiscal Notice Under Indian Law:
                  </p>
                  <p>
                    Bhumivera is a commercial botanical enterprise. This is a voluntary grassroots community pledge of tangible materials / volunteer participation, NOT an 80G tax-exempt charitable donation. 100% goes directly to field execution with 0% administrative cuts.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  {paymentError && (
                    <p role="alert" className="mr-auto max-w-sm text-left text-xs leading-5 text-rose-300">
                      {paymentError}
                      {!isAuthenticated && (
                        <> <Link to="/login" className="font-bold text-[#fce096] underline">Sign in</Link></>
                      )}
                    </p>
                  )}
                  {paymentReceipt && !pledgeSuccess && (
                    <button
                      type="button"
                      onClick={retryPaymentVerification}
                      disabled={paymentLoading}
                      className="rounded-xl border border-emerald-500/40 px-4 py-2.5 text-xs font-mono text-emerald-200 disabled:opacity-60"
                    >
                      {paymentLoading ? 'Verifying…' : 'Verify Completed Payment'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsPledgeModalOpen(false)}
                    className="rounded-xl border border-[#d4af37]/30 px-5 py-2.5 text-xs font-mono text-[#cbd5e1] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={paymentLoading}
                    className="btn-gold-luxury rounded-xl px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xl hover:scale-105 transition-transform"
                  >
                    {paymentLoading
                      ? 'Processing Secure Payment…'
                      : modalMode === 'volunteer'
                        ? 'Confirm Volunteer Registration'
                        : `Pay ${formatInr(customAmount ? Number(customAmount) : selectedUnit?.amount || 100)} & Co-Sponsor`}
                  </button>
                </div>
              </form>
            ) : (
              /* CERTIFICATE DISPLAY */
              <div className="space-y-6 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-1">
                  <Award size={26} />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {certificateData?.type === 'volunteer'
                    ? 'Volunteer Registration Confirmed!'
                    : 'Stewardship Certificate Issued!'}
                </h3>
                <p className="text-xs text-[#cbd5e1] max-w-md mx-auto">
                  Thank you, <strong className="text-[#fce096]">{certificateData?.name}</strong>. Your commitment is recorded in our verifiable community ledger registry.
                </p>
                {certificateData?.type === 'sponsor' && (
                  <p className={`text-xs ${certificateSent ? 'text-emerald-300' : 'text-amber-300'}`}>
                    {certificateSent
                      ? `Your payment is verified. The certificate was emailed to ${certificateData.email}.`
                      : 'Your payment is verified and recorded. Certificate email delivery needs a retry.'}
                  </p>
                )}
                {paymentError && <p role="alert" className="text-xs text-rose-300">{paymentError}</p>}

                {/* Styled Verifiable Certificate Frame */}
                <div
                  id="bhumivera-certificate"
                  className="rounded-3xl border-2 border-[#d4af37] bg-gradient-to-b from-[#102219] via-[#070a0e] to-[#102219] p-6 sm:p-8 text-left shadow-2xl relative overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Leaf size={18} className="text-[#d4af37]" />
                      <span className="font-serif font-bold text-base tracking-widest text-white uppercase">
                        Bhumivera Grassroots Stewardship
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      Verifiable Community Record
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#94a3b8] block">
                        {certificateData?.type === 'volunteer'
                          ? 'Official Volunteer Certificate'
                          : 'Patron Certificate of Ecological Co-Sponsorship'}
                      </span>
                      <h4 className="font-serif text-2xl font-bold text-[#fce096] mt-0.5">
                        {certificateData?.name}
                      </h4>
                    </div>

                    <p className="text-xs text-[#e2e8f0] leading-6">
                      {certificateData?.type === 'volunteer' ? (
                        <>
                          Is officially enrolled as a{' '}
                          <strong className="text-emerald-300">{certificateData?.volunteerRole}</strong> for{' '}
                          <strong className="text-white">{certificateData?.projectTitle}</strong> in{' '}
                          <strong className="text-[#fce096]">{certificateData?.location}</strong>.
                        </>
                      ) : (
                        <>
                          Has co-sponsored the on-ground materials for{' '}
                          <strong className="text-white">{certificateData?.projectTitle}</strong> in the amount of{' '}
                          <strong className="text-[#fce096]">{formatInr(certificateData?.amount)}</strong>.
                        </>
                      )}
                    </p>

                    <div className="rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/80 p-3 text-xs text-[#cbd5e1]">
                      <span className="font-mono text-[10px] uppercase text-[#94a3b8] block mb-0.5">
                        Allocated Field Action:
                      </span>
                      <span>{certificateData?.impactEquivalence}</span>
                    </div>

                    {certificateData?.dedication && (
                      <p className="font-serif italic text-xs text-[#fce096] border-l-2 border-[#d4af37] pl-3 py-0.5">
                        Dedication: "{certificateData.dedication}"
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#d4af37]/20 text-[10px] font-mono text-[#94a3b8]">
                      <div>
                        <span className="block uppercase">Certificate ID:</span>
                        <span className="text-white font-bold">{certificateData?.code}</span>
                      </div>
                      <div className="text-right">
                        <span className="block uppercase">Issued Date:</span>
                        <span className="text-white font-bold">{certificateData?.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xl"
                  >
                    <Download size={14} /> Print / Save Certificate
                  </button>
                  {certificateData?.type === 'sponsor' && !certificateSent && (
                    <button
                      type="button"
                      onClick={retryCertificateEmail}
                      disabled={paymentLoading}
                      className="rounded-xl border border-[#d4af37]/40 px-6 py-3 text-xs font-mono uppercase text-[#fce096] hover:text-white disabled:opacity-60"
                    >
                      {paymentLoading ? 'Retrying…' : 'Retry Email'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsPledgeModalOpen(false);
                      setPledgeSuccess(false);
                      setCertificateData(null);
                    }}
                    className="rounded-xl border border-[#d4af37]/40 px-6 py-3 text-xs font-mono uppercase text-[#cbd5e1] hover:text-white"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
