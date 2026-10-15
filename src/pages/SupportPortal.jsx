import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supportPortal } from '../services/api';
import {
  LifeBuoy,
  LogOut,
  Mail,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  UserRound,
  MessageSquare,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Lock,
  RotateCcw,
  Ban,
  Gift,
  Package,
  Truck,
  KeyRound,
  ExternalLink,
} from 'lucide-react';

const TICKET_STATUSES = ['open', 'in_progress', 'resolved', 'closed'];
const CHAT_STATUSES = ['active', 'pending', 'waiting_for_review', 'escalated', 'resolved', 'closed'];
const formatDate = value => (value ? new Date(value).toLocaleString() : '—');
const errorText = error => error?.response?.data?.message || error?.message || 'The request could not be completed.';

const ROLE_LIMIT_RULES = {
  agent: {
    title: 'Support Executive (L1)',
    maxCouponPct: 10,
    maxWalletCredit: 0,
    canCancelOrder: false,
    canDeleteChat: false,
    summary: 'Can search by Order ID / Tracking ID / Email / Phone, verify customer identity, view full order details, reply to live & Telegram chats, create RMAs, and issue at most ONE courtesy coupon (max 10% off) per customer.',
  },
  supervisor: {
    title: 'Support Supervisor (L2)',
    maxCouponPct: 12,
    maxWalletCredit: 150,
    canCancelOrder: true,
    canDeleteChat: false,
    summary: 'Includes all L1 permissions + Order Cancellations, Chat Reassignment, at most ONE courtesy coupon (max 12% off) per customer, and at most ONE goodwill wallet credit (max ₹150) per customer.',
  },
  manager: {
    title: 'Support Manager (L3)',
    maxCouponPct: 15,
    maxWalletCredit: 250,
    canCancelOrder: true,
    canDeleteChat: false,
    summary: 'Includes all L2 permissions + Staff Management, at most ONE courtesy coupon (max 15% off) per customer, and at most ONE goodwill wallet credit (max ₹250) per customer.',
  },
  superadmin: {
    title: 'SuperAdmin / Owner',
    maxCouponPct: 50,
    maxWalletCredit: 2000,
    canCancelOrder: true,
    canDeleteChat: true,
    summary: 'Unrestricted access: Can delete resolved chats, issue multiple coupons without per-customer limits, and manage all security & Telegram settings.',
  },
};

const HELP_TERMS_GUIDE = [
  {
    term: 'Order / Tracking / Email / Phone Search',
    meaning: 'Finds any customer order immediately using the Order ID (#20), 9-digit Order Number (815899599), Courier Tracking ID (BHVM815899599), Customer Email, or 10-digit Phone Number.',
  },
  {
    term: 'Customer Identity Verification Checklist',
    meaning: 'Before sharing sensitive order details or issuing a return/coupon, verify at least 2 details with the customer (Registered Name, Email, Phone Number, or Delivery City/Pincode) and click "Mark Customer Verified".',
  },
  {
    term: 'Status: Pending vs. Waiting for Review vs. Resolved',
    meaning: 'Pending means Support is waiting for the customer to reply. Waiting for Review sends the case to a Supervisor/Manager. Resolved means the issue is solved (unlocks the customer’s 1–5 star review prompt).',
  },
  {
    term: 'Internal Note (Hidden from Customer)',
    meaning: 'Saves a private yellow note inside the chat transcript that only other support staff and managers can read.',
  },
  {
    term: 'One-Time Courtesy Coupon (Anti-Abuse Protected)',
    meaning: 'Generates a single-use discount code for the customer. Support staff can issue a coupon ONLY ONCE per customer (capped at 10%–15% by role). Only SuperAdmin can issue multiple coupons.',
  },
  {
    term: 'Telegram Sync (@BhumiveraBot)',
    meaning: 'Pulls customer messages sent to @BhumiveraBot on Telegram and delivers your replies straight back to their Telegram app.',
  },
];

export default function SupportPortal() {
  const [agent, setAgent] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('supportToken') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [section, setSection] = useState('search');
  const [showHelpGuide, setShowHelpGuide] = useState(false);

  // Universal Search & Customer Verification state
  const [universalQuery, setUniversalQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ orders: [], customers: [] });
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [verifiedOrderIds, setVerifiedOrderIds] = useState({});

  // Live Chat Sessions state
  const [chatSessions, setChatSessions] = useState([]);
  const [chatStatusFilter, setChatStatusFilter] = useState('all');
  const [selectedSessionToken, setSelectedSessionToken] = useState(null);
  const [selectedSessionDetail, setSelectedSessionDetail] = useState(null);
  const [chatReply, setChatReply] = useState('');
  const [isWhisperMode, setIsWhisperMode] = useState(false);
  const [actionOrderId, setActionOrderId] = useState('');
  const [goodwillAmount, setGoodwillAmount] = useState('100');
  const [couponPct, setCouponPct] = useState('10');

  // Tickets & Customers state
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [reply, setReply] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const roleRule = ROLE_LIMIT_RULES[agent?.role || 'agent'] || ROLE_LIMIT_RULES.agent;

  const loadWorkspaceData = useCallback(async () => {
    const [inboxRes, sessionsRes] = await Promise.all([
      supportPortal.tickets(),
      supportPortal.sessions ? supportPortal.sessions({ status: chatStatusFilter }) : Promise.resolve({ data: { sessions: [] } }),
    ]);
    setTickets(inboxRes.data?.tickets || []);
    setChatSessions(sessionsRes.data?.sessions || []);
  }, [chatStatusFilter]);

  useEffect(() => {
    if (!token) return undefined;
    let active = true;
    Promise.all([
      supportPortal.me(),
      supportPortal.tickets(),
      supportPortal.sessions ? supportPortal.sessions({}) : Promise.resolve({ data: { sessions: [] } }),
    ])
      .then(([profile, inbox, sessionsRes]) => {
        if (!active) return;
        setAgent(profile.data.agent);
        setTickets(inbox.data.tickets || []);
        setChatSessions(sessionsRes.data?.sessions || []);
        setError('');
      })
      .catch(requestError => {
        if (!active) return;
        localStorage.removeItem('supportToken');
        setToken('');
        setError(errorText(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  const loadSessionDetail = useCallback(async sessionTok => {
    if (!sessionTok || !supportPortal.sessionDetail) return;
    try {
      const res = await supportPortal.sessionDetail(sessionTok);
      setSelectedSessionDetail(res.data);
      const firstOrder = res.data?.customerSummary?.orders?.[0];
      if (firstOrder) {
        setActionOrderId(String(firstOrder.orderNumber || firstOrder.id));
      }
    } catch (err) {
      setError(errorText(err));
    }
  }, []);

  useEffect(() => {
    if (selectedSessionToken) {
      void loadSessionDetail(selectedSessionToken);
    }
  }, [selectedSessionToken, loadSessionDetail]);

  const signIn = async event => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await supportPortal.login({ username, password });
      localStorage.setItem('supportToken', response.data.token);
      setAgent(response.data.agent);
      setToken(response.data.token);
      setPassword('');
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setBusy(false);
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('supportToken');
    setToken('');
    setAgent(null);
    setTickets([]);
    setChatSessions([]);
  };

  const handleUniversalSearch = async event => {
    event?.preventDefault();
    if (!universalQuery.trim()) return;
    setBusy(true);
    setError('');
    try {
      const res = await supportPortal.universalSearch(universalQuery.trim());
      const ordersFound = res.data?.orders || [];
      const customersFound = res.data?.customers || [];
      setSearchResults({ orders: ordersFound, customers: customersFound });
      if (ordersFound.length > 0) {
        setSelectedOrderDetail(ordersFound[0]);
      } else {
        setSelectedOrderDetail(null);
      }
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSyncTelegram = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await supportPortal.syncTelegram();
      await loadWorkspaceData();
      setNotice(`Synced Telegram (@BhumiveraBot) — ${res.data?.synced || 0} new message(s) pulled.`);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSendChatReply = async event => {
    event.preventDefault();
    if (!selectedSessionToken || !chatReply.trim()) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await supportPortal.replySession(selectedSessionToken, {
        message: chatReply.trim(),
        isInternalNote: isWhisperMode,
      });
      setChatReply('');
      await loadSessionDetail(selectedSessionToken);
      await loadWorkspaceData();
      setNotice(
        isWhisperMode
          ? 'Private staff note saved.'
          : 'Reply delivered to customer (Web, Mobile App & Telegram if linked).'
      );
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateChatStatus = async nextStatus => {
    if (!selectedSessionToken) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await supportPortal.updateSessionStatus(selectedSessionToken, { status: nextStatus });
      await loadSessionDetail(selectedSessionToken);
      await loadWorkspaceData();
      setNotice(`Chat marked as ${nextStatus.replace(/_/g, ' ').toUpperCase()}.`);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  const handleExecuteChatAction = async actionType => {
    if (!selectedSessionToken) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const res = await supportPortal.executeSessionAction(selectedSessionToken, {
        action: actionType,
        orderId: actionOrderId,
        goodwillAmount: Number(goodwillAmount) || 100,
        discountPercent: Number(couponPct) || 10,
      });
      setNotice(res.data?.message || 'Action completed.');
      await loadSessionDetail(selectedSessionToken);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  const selectCustomer = async customer => {
    setSelectedCustomer(customer);
    setCustomerDetails(null);
    setBusy(true);
    setError('');
    try {
      const response = await supportPortal.customer(customer.id);
      setCustomerDetails(response.data);
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setBusy(false);
    }
  };

  const selectedTicket = useMemo(
    () => tickets.find(t => t.id === selectedTicketId) || tickets[0] || null,
    [tickets, selectedTicketId]
  );

  const updateTicket = async (status, message) => {
    if (!selectedTicket) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await supportPortal.updateTicket(selectedTicket.id, {
        status,
        ...(message ? { reply: message } : {}),
      });
      setReply('');
      await loadWorkspaceData();
      setNotice(response.data.message || 'Ticket updated.');
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071510] text-white flex items-center justify-center">
        Loading Bhumivera Support Workspace…
      </div>
    );
  }

  if (!token || !agent) {
    return (
      <main className="min-h-screen bg-[#071510] px-4 py-12 text-[#FDFBF7] flex items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-[#D4AF37]/30 bg-[#0B2419] p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37]">
              <LifeBuoy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                bhumivera.com/support
              </p>
              <h1 className="font-serif text-2xl font-bold text-white">Customer Support Portal</h1>
            </div>
          </div>
          <p className="text-xs text-emerald-100/75 mb-5 leading-relaxed">
            Sign in with your Support Executive, Supervisor, or Manager ID to search orders, verify customers, and
            manage live Web & Telegram chats.
          </p>
          {error && (
            <p role="alert" className="mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 p-3 text-xs text-rose-200">
              {error}
            </p>
          )}
          <form onSubmit={signIn} className="space-y-4">
            <label className="block text-xs text-emerald-100/80">
              Support Login ID or Email
              <input
                required
                value={username}
                onChange={event => setUsername(event.target.value)}
                placeholder="e.g. concierge_lead or agent.rahul"
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </label>
            <label className="block text-xs text-emerald-100/80">
              Password
              <input
                required
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="••••••••••••"
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </label>
            <button
              disabled={busy}
              className="w-full rounded-xl bg-[#D4AF37] hover:bg-[#c49f2f] py-3 text-sm font-bold text-[#071510] transition disabled:opacity-50"
            >
              {busy ? 'Signing in…' : 'Sign In to Support Desk'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#071510] text-[#FDFBF7] flex flex-col">
      {/* Luxury Header */}
      <header className="bg-[#0B2419] border-b border-[#D4AF37]/25 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold">
                  {roleRule.title}
                </span>
                <span className="text-xs text-emerald-100/70">
                  Signed in as <strong>{agent.name}</strong> (@{agent.username})
                </span>
              </div>
              <h1 className="text-lg font-serif font-bold text-white">
                Bhumivera Customer Support & Order Verification Desk
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHelpGuide(prev => !prev)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                showHelpGuide
                  ? 'bg-[#D4AF37] text-[#071510] border-[#D4AF37]'
                  : 'bg-white/5 text-emerald-100 border-white/15 hover:border-[#D4AF37]/50'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              ? Help & Role Rules
            </button>

            <button
              type="button"
              onClick={handleSyncTelegram}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-xs text-sky-200 font-semibold"
              title="Pull latest customer messages from @BhumiveraBot on Telegram"
            >
              <Send className="w-3.5 h-3.5" />
              Sync Telegram (@BhumiveraBot)
            </button>

            {['manager', 'superadmin'].includes(agent.role) && (
              <Link
                to="/superadminsupport"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500/20 border border-purple-400/40 text-xs text-purple-200 font-semibold"
              >
                SuperAdmin Center (/superadminsupport)
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}

            <button
              type="button"
              onClick={loadWorkspaceData}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-100"
              title="Refresh queues"
            >
              <RefreshCw className={`w-4 h-4 ${busy ? 'animate-spin text-[#D4AF37]' : ''}`} />
            </button>

            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs text-rose-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Role Benchmark & Help Drawer */}
      {showHelpGuide && (
        <div className="bg-[#0B2419]/90 border-b border-[#D4AF37]/30 px-6 py-4">
          <div className="max-w-[1600px] mx-auto space-y-3">
            <div className="p-3.5 rounded-2xl bg-black/30 border border-[#D4AF37]/30 text-xs">
              <strong className="text-[#D4AF37]">Your Role Benchmark ({roleRule.title}):</strong>{' '}
              <span className="text-emerald-100/90">{roleRule.summary}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {HELP_TERMS_GUIDE.map(item => (
                <div key={item.term} className="p-3 rounded-xl bg-black/30 border border-white/10 text-xs">
                  <div className="font-bold text-[#D4AF37] mb-1">? {item.term}</div>
                  <p className="text-emerald-100/80 text-[11px] leading-relaxed">{item.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(error || notice) && (
        <div className="max-w-[1600px] w-full mx-auto px-6 pt-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200">
              {error}
            </div>
          )}
          {notice && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-200">
              {notice}
            </div>
          )}
        </div>
      )}

      {/* Navigation Tabs (Flex-Wrap — Zero White Scrollbar) */}
      <div className="bg-[#0B2419]/60 border-b border-white/10 px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center gap-2">
          {[
            { id: 'search', label: '1. Order, Tracking, Email & Phone Search (Verify Customer)', icon: Search },
            { id: 'chats', label: `2. Live Customer & Telegram Chats (${chatSessions.length})`, icon: MessageSquare },
            { id: 'tickets', label: `3. Support Tickets (${tickets.length})`, icon: Mail },
            { id: 'customers', label: '4. Customer Accounts & Password Reset', icon: UserRound },
          ].map(tab => {
            const Icon = tab.icon;
            const active = section === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSection(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  active
                    ? 'bg-[#D4AF37] text-[#071510] border-[#D4AF37]'
                    : 'bg-white/5 text-emerald-100/80 border-white/10 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-6">
        {/* ===================================================================
            SECTION 1: DEEP SEARCH BY ORDER ID, TRACKING ID, EMAIL OR PHONE
           =================================================================== */}
        {section === 'search' && (
          <div className="space-y-6">
            <form
              onSubmit={handleUniversalSearch}
              className="p-5 rounded-2xl bg-[#0B2419] border border-[#D4AF37]/30 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-serif font-bold text-white">
                    Search Order ID, Tracking Number, Customer Email, or Phone Number
                  </h2>
                  <p className="text-xs text-emerald-100/70">
                    Enter an Order ID (e.g. <code>#20</code> or <code>815899599</code>), Tracking ID (e.g.{' '}
                    <code>BHVM815899599</code>), Email, or 10-digit Phone to authenticate the customer and inspect full
                    order details.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={universalQuery}
                  onChange={e => setUniversalQuery(e.target.value)}
                  placeholder="Enter Order ID (#20 / 815899599), Tracking ID (BHVM...), Email, or Phone…"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2f] text-[#071510] font-bold text-xs"
                >
                  {busy ? 'Searching…' : 'Search & Verify'}
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Matching Orders List */}
              <div className="lg:col-span-4 bg-[#0B2419] border border-white/10 rounded-2xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-white">
                  Matching Orders ({searchResults.orders.length})
                </h3>
                <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
                  {searchResults.orders.length === 0 ? (
                    <p className="text-xs text-emerald-100/60 py-8 text-center">
                      Search above to load matching orders and customer verification details.
                    </p>
                  ) : (
                    searchResults.orders.map(ord => (
                      <button
                        key={ord.id}
                        type="button"
                        onClick={() => setSelectedOrderDetail(ord)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs transition ${
                          selectedOrderDetail?.id === ord.id
                            ? 'bg-[#D4AF37]/15 border-[#D4AF37]'
                            : 'bg-black/30 border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-white">
                          <span>
                            Order #{ord.orderNumber} (ID: #{ord.id})
                          </span>
                          <span className="text-[#D4AF37]">₹{ord.total}</span>
                        </div>
                        <div className="text-[11px] text-emerald-100/75 mt-1">
                          {ord.customerName} · {ord.customerEmail || ord.customerPhone || 'Guest'}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-emerald-100/60 mt-1.5">
                          <span className="uppercase font-semibold text-emerald-300">{ord.status}</span>
                          <span>Tracking: {ord.trackingNumber || 'Pending'}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Customer Authentication & Full Order Details Inspector */}
              <div className="lg:col-span-8 bg-[#0B2419] border border-white/10 rounded-2xl p-6 space-y-5">
                {!selectedOrderDetail ? (
                  <div className="py-20 text-center text-xs text-emerald-100/60">
                    Select an order from the search results to authenticate the customer and view full item, payment,
                    and tracking details.
                  </div>
                ) : (
                  <>
                    {/* Customer Authentication Verification Box */}
                    <div className="p-4 rounded-2xl bg-black/40 border border-[#D4AF37]/40 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold">
                            Step 1 · Real Customer Identity Verification
                          </span>
                          <h4 className="text-sm font-bold text-white">
                            Confirm at least 2 details below with the customer before sharing sensitive info
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setVerifiedOrderIds(prev => ({
                              ...prev,
                              [selectedOrderDetail.id]: !prev[selectedOrderDetail.id],
                            }))
                          }
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                            verifiedOrderIds[selectedOrderDetail.id]
                              ? 'bg-emerald-500 text-[#071510]'
                              : 'bg-[#D4AF37] text-[#071510]'
                          }`}
                        >
                          {verifiedOrderIds[selectedOrderDetail.id]
                            ? '✓ Customer Identity Verified'
                            : 'Mark Customer Verified'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                          <span className="text-[10px] text-emerald-100/60 block">Registered Name</span>
                          <strong className="text-white">
                            {selectedOrderDetail.verificationChecklist?.registeredName}
                          </strong>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                          <span className="text-[10px] text-emerald-100/60 block">Registered Email</span>
                          <strong className="text-white">
                            {selectedOrderDetail.verificationChecklist?.registeredEmail}
                          </strong>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                          <span className="text-[10px] text-emerald-100/60 block">Registered Phone</span>
                          <strong className="text-white">
                            {selectedOrderDetail.verificationChecklist?.registeredPhone}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Full Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-1.5">
                        <div className="text-[#D4AF37] font-bold uppercase text-[10px] flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5" /> Shipment & Tracking Details
                        </div>
                        <div>
                          Order Number: <strong>#{selectedOrderDetail.orderNumber}</strong> (Internal ID: #
                          {selectedOrderDetail.id})
                        </div>
                        <div>
                          Status: <strong className="uppercase text-emerald-300">{selectedOrderDetail.status}</strong>
                        </div>
                        <div>
                          Tracking ID: <strong>{selectedOrderDetail.trackingNumber || 'Not assigned yet'}</strong>
                        </div>
                        <div>
                          Courier Partner: <strong>{selectedOrderDetail.courier || 'Standard Dispatch'}</strong>
                        </div>
                        <div>Placed At: {formatDate(selectedOrderDetail.createdAt)}</div>
                      </div>

                      <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-1.5">
                        <div className="text-[#D4AF37] font-bold uppercase text-[10px] flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5" /> Payment & Delivery Address
                        </div>
                        <div>
                          Payment: <strong>{selectedOrderDetail.paymentMode}</strong> (
                          {selectedOrderDetail.paymentStatus})
                        </div>
                        <div>
                          Subtotal: ₹{selectedOrderDetail.subtotal} · Discount: -₹{selectedOrderDetail.discount} ·
                          Shipping: ₹{selectedOrderDetail.shippingCost}
                        </div>
                        <div className="text-sm font-bold text-[#D4AF37]">
                          Total Paid: ₹{selectedOrderDetail.total}
                        </div>
                        <div className="text-emerald-100/75 pt-1">
                          Address:{' '}
                          {[
                            selectedOrderDetail.shippingAddress?.address ||
                              selectedOrderDetail.shippingAddress?.line1,
                            selectedOrderDetail.shippingAddress?.city,
                            selectedOrderDetail.shippingAddress?.state,
                            selectedOrderDetail.shippingAddress?.pincode,
                          ]
                            .filter(Boolean)
                            .join(', ') || 'On file'}
                        </div>
                      </div>
                    </div>

                    {/* Line Items in Order */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[#D4AF37] uppercase">
                        Ordered Items ({selectedOrderDetail.items?.length || 0})
                      </h4>
                      <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-black/30">
                        {(selectedOrderDetail.items || []).map(item => (
                          <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                            <div>
                              <div className="font-bold text-white">{item.name}</div>
                              <div className="text-[11px] text-emerald-100/60">
                                SKU: {item.sku || 'N/A'} · Qty: {item.quantity} × ₹{item.price}
                              </div>
                            </div>
                            <div className="font-bold text-[#D4AF37]">
                              ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            SECTION 2: LIVE CUSTOMER & TELEGRAM CHATS
           =================================================================== */}
        {section === 'chats' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-[#0B2419] border border-white/10 rounded-2xl p-4 flex flex-col h-[720px]">
              <div className="flex flex-wrap gap-1.5 pb-3 border-b border-white/10">
                {['all', ...CHAT_STATUSES].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setChatStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                      chatStatusFilter === st
                        ? 'bg-[#D4AF37] text-[#071510] border-[#D4AF37]'
                        : 'bg-black/30 text-emerald-100/70 border-white/10'
                    }`}
                  >
                    {st.replace(/_/g, ' ').toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 mt-3 pr-1">
                {chatSessions.map(sess => (
                  <button
                    key={sess.sessionToken}
                    type="button"
                    onClick={() => setSelectedSessionToken(sess.sessionToken)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition ${
                      selectedSessionToken === sess.sessionToken
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37]'
                        : 'bg-black/30 border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{sess.customerName || sess.guestName || 'Guest Customer'}</span>
                      <span className="text-[10px] uppercase text-[#D4AF37]">{sess.status}</span>
                    </div>
                    <div className="text-[11px] text-emerald-100/60 mt-1">
                      {sess.customerEmail || sess.guestEmail || 'Web / Telegram Session'}
                    </div>
                    {sess.lastMessagePreview && (
                      <p className="text-[11px] text-emerald-100/80 mt-1.5 line-clamp-1 bg-black/25 px-2 py-1 rounded">
                        {sess.lastMessagePreview}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 bg-[#0B2419] border border-white/10 rounded-2xl p-5 flex flex-col h-[720px]">
              {!selectedSessionDetail?.session ? (
                <div className="flex-1 flex items-center justify-center text-xs text-emerald-100/60">
                  Select a live chat session on the left to reply, verify orders, or update status.
                </div>
              ) : (
                <>
                  <div className="pb-3 border-b border-white/10 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          {selectedSessionDetail.session.guestName || 'Customer'} (
                          {selectedSessionDetail.session.guestEmail || 'Live Chat'})
                        </h3>
                        {selectedSessionDetail.session.csatRating && (
                          <span className="text-xs text-[#D4AF37] font-bold">
                            ★ Customer Rating: {selectedSessionDetail.session.csatRating}/5 — "
                            {selectedSessionDetail.session.csatFeedback || 'Satisfied'}"
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {CHAT_STATUSES.map(st => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleUpdateChatStatus(st)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                              selectedSessionDetail.session.status === st
                                ? 'bg-[#D4AF37] text-[#071510] border-[#D4AF37]'
                                : 'bg-black/30 text-emerald-100 border-white/15'
                            }`}
                          >
                            {st.replace(/_/g, ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Role-Benchmark Protected Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <input
                        type="text"
                        value={actionOrderId}
                        onChange={e => setActionOrderId(e.target.value)}
                        placeholder="Order # or ID"
                        className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/15 text-white w-28"
                      />
                      <button
                        type="button"
                        onClick={() => handleExecuteChatAction('initiate_return')}
                        className="px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-400/30 text-sky-200 text-[11px]"
                      >
                        <RotateCcw className="w-3 h-3 inline mr-1" />
                        Create Return RMA
                      </button>

                      {roleRule.canCancelOrder && (
                        <button
                          type="button"
                          onClick={() => handleExecuteChatAction('cancel_order')}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-400/30 text-rose-200 text-[11px]"
                        >
                          <Ban className="w-3 h-3 inline mr-1" />
                          Cancel Order
                        </button>
                      )}

                      {/* 1-Time Courtesy Coupon (Strictly Capped & Audited) */}
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="5"
                          max={roleRule.maxCouponPct}
                          value={couponPct}
                          onChange={e => setCouponPct(e.target.value)}
                          className="px-2 py-1 rounded-lg bg-black/40 border border-white/15 text-white w-14"
                        />
                        <button
                          type="button"
                          onClick={() => handleExecuteChatAction('issue_apology_coupon')}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-400/30 text-amber-200 text-[11px]"
                          title="Support staff can issue a courtesy coupon ONCE per customer"
                        >
                          <Gift className="w-3 h-3 inline mr-1" />
                          Issue 1-Time Coupon (Max {roleRule.maxCouponPct}%)
                        </button>
                      </div>

                      {roleRule.maxWalletCredit > 0 && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="10"
                            max={roleRule.maxWalletCredit}
                            value={goodwillAmount}
                            onChange={e => setGoodwillAmount(e.target.value)}
                            className="px-2 py-1 rounded-lg bg-black/40 border border-white/15 text-white w-16"
                          />
                          <button
                            type="button"
                            onClick={() => handleExecuteChatAction('goodwill_wallet_credit')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 text-[11px]"
                          >
                            + Wallet Credit (Max ₹{roleRule.maxWalletCredit})
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
                    {(selectedSessionDetail.messages || []).map(msg => {
                      const isNote = msg.isInternalNote || msg.sender === 'whisper';
                      const isUser = msg.sender === 'user';
                      return (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-xl text-xs max-w-[88%] ${
                            isNote
                              ? 'ml-auto bg-amber-500/15 border border-amber-500/40 text-amber-100'
                              : isUser
                              ? 'bg-black/40 border border-white/10 text-white'
                              : 'ml-auto bg-emerald-950/80 border border-emerald-500/30 text-emerald-50'
                          }`}
                        >
                          <div className="flex justify-between text-[10px] opacity-70 mb-1">
                            <span className="font-bold uppercase">
                              {isNote ? `🔒 PRIVATE STAFF NOTE (${msg.senderName})` : isUser ? 'CUSTOMER' : msg.senderName}
                            </span>
                            <span>{formatDate(msg.createdAt)}</span>
                          </div>
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={handleSendChatReply} className="pt-3 border-t border-white/10 space-y-2">
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isWhisperMode}
                        onChange={e => setIsWhisperMode(e.target.checked)}
                      />
                      <span className={isWhisperMode ? 'text-amber-300 font-bold' : 'text-emerald-100/70'}>
                        🔒 Private Internal Note (Hidden from Customer)
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatReply}
                        onChange={e => setChatReply(e.target.value)}
                        placeholder="Type reply to customer (delivers to Web, App & Telegram)…"
                        className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                      />
                      <button
                        type="submit"
                        disabled={busy}
                        className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#071510] font-bold text-xs"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            SECTION 3: SUPPORT TICKETS
           =================================================================== */}
        {section === 'tickets' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-[#0B2419] border border-white/10 rounded-2xl p-4 space-y-2 max-h-[680px] overflow-y-auto">
              {tickets.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs ${
                    selectedTicket?.id === t.id
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37]'
                      : 'bg-black/30 border-white/10'
                  }`}
                >
                  <div className="flex justify-between font-bold text-white">
                    <span>#{t.id} · {t.subject}</span>
                    <span className="uppercase text-[#D4AF37]">{t.status}</span>
                  </div>
                  <div className="text-[11px] text-emerald-100/70 mt-1">
                    {t.name} ({t.email})
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-7 bg-[#0B2419] border border-white/10 rounded-2xl p-5 space-y-4">
              {selectedTicket ? (
                <>
                  <h3 className="text-base font-bold text-white">
                    Ticket #{selectedTicket.id}: {selectedTicket.subject}
                  </h3>
                  <p className="text-xs text-emerald-100/80 whitespace-pre-wrap">{selectedTicket.message}</p>
                  <textarea
                    rows={4}
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Write email reply to customer…"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                  />
                  <div className="flex flex-wrap gap-2">
                    {TICKET_STATUSES.map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateTicket(st, reply)}
                        className="px-3.5 py-2 rounded-xl bg-[#D4AF37] text-[#071510] font-bold text-xs uppercase"
                      >
                        {reply.trim() ? `Send & Mark ${st}` : `Mark ${st}`}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-xs text-emerald-100/60">Select a ticket to view and reply.</p>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            SECTION 4: CUSTOMER ACCOUNTS & PASSWORD RESET
           =================================================================== */}
        {section === 'customers' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-[#0B2419] border border-white/10 rounded-2xl p-4 space-y-3">
              <input
                type="text"
                value={search}
                onChange={e => {
                  const val = e.target.value;
                  setSearch(val);
                  if (val.trim().length >= 2) {
                    supportPortal.customers(val.trim()).then(r => setCustomers(r.data?.customers || []));
                  }
                }}
                placeholder="Search customer by name, email, or phone…"
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
              />
              <div className="space-y-2 max-h-[540px] overflow-y-auto">
                {customers.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectCustomer(c)}
                    className="w-full text-left p-3 rounded-xl bg-black/30 border border-white/10 text-xs"
                  >
                    <div className="font-bold text-white">{c.name}</div>
                    <div className="text-[11px] text-emerald-100/70">{c.email} · {c.phone}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 bg-[#0B2419] border border-white/10 rounded-2xl p-5 space-y-4">
              {customerDetails?.customer ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white">{customerDetails.customer.name}</h3>
                      <p className="text-xs text-emerald-100/70">
                        {customerDetails.customer.email} · Wallet: ₹{customerDetails.customer.wallet_balance || 0}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        supportPortal
                          .createPasswordResetLink(customerDetails.customer.id)
                          .then(r => setNotice(r.data?.message || 'Reset link sent.'))
                      }
                      className="px-3.5 py-2 rounded-xl bg-[#D4AF37] text-[#071510] font-bold text-xs flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5" /> Send Password Reset Link
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-xs text-emerald-100/60">Search and select a customer to view details.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
