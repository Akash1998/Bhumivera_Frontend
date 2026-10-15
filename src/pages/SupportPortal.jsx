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
  Clock,
  Lock,
  Eye,
  RotateCcw,
  Ban,
  Gift,
  Sparkles,
  Crown,
} from 'lucide-react';

const TICKET_STATUSES = ['open', 'in_progress', 'resolved', 'closed'];
const CHAT_STATUSES = ['active', 'pending', 'waiting_for_review', 'escalated', 'resolved', 'closed'];
const formatDate = value => (value ? new Date(value).toLocaleString() : '—');
const errorText = error => error?.response?.data?.message || error?.message || 'The request could not be completed.';

const SUPPORT_PORTAL_BUTTON_GUIDE = [
  {
    name: 'Live Chats Tab',
    role: 'Agent / Supervisor / Manager',
    desc: 'Monitors real-time customer AI & human chat sessions. Click any session to view its transcript, order cards, and sentiment score.',
  },
  {
    name: 'Send Live Reply vs. Whisper Note',
    role: 'Agent / Supervisor / Manager',
    desc: 'Live Reply sends your message directly into the customer’s floating chat widget. Whisper Note saves an internal yellow note visible only to support staff.',
  },
  {
    name: 'Chat Status Selector (Active / Pending / Waiting for Review / Escalated / Resolved / Closed)',
    role: 'Agent / Supervisor / Manager',
    desc: 'Transitions the live chat lifecycle state and notifies the customer in real time.',
  },
  {
    name: 'Initiate Return (RMA)',
    role: 'Agent / Supervisor / Manager',
    desc: 'Generates an official RMA-XXXXXXXX return or replacement record for a delivered order directly from the chat desk.',
  },
  {
    name: 'Cancel Customer Order',
    role: 'Supervisor / Manager Only',
    desc: 'Cancels a pending/confirmed order and restores inventory (or queues a priority Razorpay refund for paid online orders).',
  },
  {
    name: 'Issue Goodwill Wallet Credit (₹)',
    role: 'Supervisor / Manager Only',
    desc: 'Credits instant compensation (₹1–₹2,000) to the customer’s Bhumivera Wallet and posts confirmation in chat.',
  },
  {
    name: 'SuperAdmin Command Center Link',
    role: 'Manager / SuperAdmin Only',
    desc: 'Opens /superadminsupport to create new staff login IDs, assign Agent/Supervisor/Manager roles, and control AI feature flags.',
  },
];

export default function SupportPortal() {
  const [agent, setAgent] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('supportToken') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [section, setSection] = useState('chats');
  const [showHelpGuide, setShowHelpGuide] = useState(false);

  // Live Chat Sessions state
  const [chatSessions, setChatSessions] = useState([]);
  const [chatStatusFilter, setChatStatusFilter] = useState('all');
  const [selectedSessionToken, setSelectedSessionToken] = useState(null);
  const [selectedSessionDetail, setSelectedSessionDetail] = useState(null);
  const [chatReply, setChatReply] = useState('');
  const [isWhisperMode, setIsWhisperMode] = useState(false);
  const [actionOrderId, setActionOrderId] = useState('');
  const [goodwillAmount, setGoodwillAmount] = useState('100');

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

  useEffect(() => {
    if (!token || !agent) return undefined;
    const timer = window.setInterval(() => {
      loadWorkspaceData().catch(requestError => setError(errorText(requestError)));
    }, 10000);
    return () => window.clearInterval(timer);
  }, [token, agent, loadWorkspaceData]);

  const loadSessionDetail = useCallback(async sessionTok => {
    if (!sessionTok || !supportPortal.sessionDetail) return;
    try {
      const res = await supportPortal.sessionDetail(sessionTok);
      setSelectedSessionDetail(res.data);
      const firstOrder = res.data?.customerSummary?.orders?.[0];
      if (firstOrder && !actionOrderId) {
        setActionOrderId(String(firstOrder.orderNumber || firstOrder.id));
      }
    } catch (err) {
      setError(errorText(err));
    }
  }, [actionOrderId]);

  useEffect(() => {
    if (selectedSessionToken) {
      void loadSessionDetail(selectedSessionToken);
    }
  }, [selectedSessionToken, loadSessionDetail]);

  useEffect(() => {
    if (section !== 'customers' || search.trim().length < 2) {
      setCustomers([]);
      return undefined;
    }
    let active = true;
    const timer = window.setTimeout(() => {
      supportPortal
        .customers(search.trim())
        .then(response => {
          if (active) setCustomers(response.data.customers || []);
        })
        .catch(requestError => {
          if (active) setError(errorText(requestError));
        });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [section, search]);

  const selectedTicket = useMemo(
    () => tickets.find(ticket => ticket.id === selectedTicketId),
    [tickets, selectedTicketId]
  );

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
    setSelectedTicketId(null);
    setSelectedSessionToken(null);
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
      setNotice(isWhisperMode ? 'Internal whisper note saved.' : 'Live reply delivered to customer chat.');
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
      setNotice(`Chat marked as ${nextStatus.replace(/_/g, ' ')}.`);
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
      setNotice(
        response.data.emailSent === false
          ? 'Reply saved, but the customer email could not be sent.'
          : response.data.message
      );
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setBusy(false);
    }
  };

  const submitReply = event => {
    event.preventDefault();
    const message = reply.trim();
    if (!message) return;
    updateTicket('in_progress', message);
  };

  const sendEmail = async event => {
    event.preventDefault();
    if (!selectedCustomer || !emailSubject.trim() || !emailMessage.trim()) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await supportPortal.sendCustomerEmail(selectedCustomer.id, {
        subject: emailSubject.trim(),
        message: emailMessage.trim(),
      });
      setEmailSubject('');
      setEmailMessage('');
      setNotice(response.data.message);
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setBusy(false);
    }
  };

  const sendResetLink = async () => {
    if (!selectedCustomer) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await supportPortal.createPasswordResetLink(selectedCustomer.id);
      setNotice(response.data.message);
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setBusy(false);
    }
  };

  const toggleCustomerStatus = async () => {
    if (!customerDetails?.customer) return;
    const status = Number(customerDetails.customer.is_active) ? 'disabled' : 'active';
    setBusy(true);
    setError('');
    try {
      await supportPortal.updateCustomerStatus(customerDetails.customer.id, status);
      await selectCustomer(customerDetails.customer);
      setNotice(`Customer account ${status}.`);
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07150f] text-slate-300">
        Loading secure support desk…
      </main>
    );
  }

  if (!token || !agent) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07150f] px-4 text-slate-100">
        <form
          onSubmit={signIn}
          className="w-full max-w-md space-y-5 rounded-3xl border border-emerald-400/20 bg-[#10241b] p-8 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300">
              <LifeBuoy />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-300">Bhumivera</p>
              <h1 className="text-2xl font-black">Support Desk</h1>
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-400">
            Sign in with your assigned Support Login ID (<strong>Agent</strong>, <strong>Supervisor</strong>, or{' '}
            <strong>Manager</strong>).
          </p>
          {error && (
            <p role="alert" className="rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">
              {error}
            </p>
          )}
          <label className="block text-sm text-slate-300">
            Support user ID
            <input
              required
              autoComplete="username"
              value={username}
              onChange={event => setUsername(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-[#081a13] px-4 py-3 text-white outline-none focus:border-emerald-400"
            />
          </label>
          <label className="block text-sm text-slate-300">
            Password
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-[#081a13] px-4 py-3 text-white outline-none focus:border-emerald-400"
            />
          </label>
          <button
            disabled={busy}
            className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-bold text-[#07150f] disabled:opacity-50"
          >
            {busy ? 'Signing in…' : 'Sign in securely'}
          </button>
          <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" /> Role-gated 8h session
            </span>
            <Link to="/superadminsupport" className="text-emerald-300 hover:underline font-semibold">
              SuperAdmin Command Center →
            </Link>
          </div>
        </form>
      </main>
    );
  }

  const roleBadgeColor =
    agent.role === 'manager' || agent.role === 'superadmin'
      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
      : agent.role === 'supervisor'
      ? 'bg-sky-400/20 text-sky-300 border-sky-400/40'
      : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40';

  return (
    <main className="min-h-screen bg-[#07150f] text-slate-100">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#0b1d15] px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <LifeBuoy className="text-emerald-300" />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-300">Bhumivera Concierge</p>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${roleBadgeColor}`}>
                {agent.role || 'agent'}
              </span>
            </div>
            <h1 className="text-xl font-black">Customer Support Workspace</h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowHelpGuide(prev => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition-colors ${
              showHelpGuide
                ? 'border-amber-400 bg-amber-400 text-[#07150f]'
                : 'border-white/15 text-amber-300 hover:bg-white/5'
            }`}
          >
            <HelpCircle size={14} /> What does each button do?
          </button>
          {(agent.role === 'manager' || agent.role === 'superadmin' || agent.permissions?.can_manage_agents) && (
            <Link
              to="/superadminsupport"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400/20 border border-amber-400/40 px-3 py-2 text-xs font-bold text-amber-200 hover:bg-amber-400/30"
            >
              <Crown size={14} /> SuperAdmin Support Center
            </Link>
          )}
          <span className="text-sm text-slate-400">
            {agent.name} · @{agent.username}
          </span>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </header>

      {/* Interactive Button Explainer Panel */}
      {showHelpGuide && (
        <section className="border-b border-amber-400/30 bg-[#10241b] px-4 py-4 md:px-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <Sparkles size={15} /> Interactive Support Workspace Control Guide
            </h2>
            <button
              type="button"
              onClick={() => setShowHelpGuide(false)}
              className="text-xs text-slate-300 underline"
            >
              Close Guide
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SUPPORT_PORTAL_BUTTON_GUIDE.map(item => (
              <div key={item.name} className="rounded-xl border border-white/10 bg-[#07150f]/80 p-3 text-xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-emerald-300">{item.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-amber-200">{item.role}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 p-4 lg:border-b-0 lg:border-r space-y-5">
          <nav className="flex gap-2 lg:flex-col">
            {[
              ['chats', `Live AI & Human Chats (${chatSessions.length})`],
              ['inbox', `Support Tickets (${tickets.length})`],
              ['customers', 'Customer 360° Lookup'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSection(id);
                  setSearch('');
                  setNotice('');
                }}
                className={`rounded-xl px-4 py-3 text-left text-sm font-semibold ${
                  section === id ? 'bg-emerald-400 text-[#07150f]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Active Role Permissions Summary Card */}
          <div className="hidden lg:block rounded-xl border border-white/10 bg-[#0b1d15] p-4 text-xs space-y-2">
            <p className="font-bold uppercase tracking-wider text-emerald-300">
              Your Role: {String(agent.role || 'agent').toUpperCase()}
            </p>
            <p className="text-slate-400">Department: {agent.department || 'General Concierge'}</p>
            <ul className="space-y-1 text-[11px] text-slate-300 pt-1">
              <li>✓ View & Reply Live Chats</li>
              <li>✓ Initiate Return RMAs</li>
              <li className={agent.permissions?.can_cancel_orders ? 'text-emerald-300' : 'text-slate-500'}>
                {agent.permissions?.can_cancel_orders ? '✓' : '✗'} Cancel Orders (Supervisor+)
              </li>
              <li className={agent.permissions?.can_adjust_wallet_goodwill ? 'text-emerald-300' : 'text-slate-500'}>
                {agent.permissions?.can_adjust_wallet_goodwill ? '✓' : '✗'} Goodwill Wallet Credit (Supervisor+)
              </li>
              <li className={agent.permissions?.can_reassign_chats ? 'text-emerald-300' : 'text-slate-500'}>
                {agent.permissions?.can_reassign_chats ? '✓' : '✗'} Reassign Chats (Supervisor+)
              </li>
            </ul>
          </div>
        </aside>

        <section className="min-w-0 p-4 md:p-7">
          {error && (
            <p role="alert" className="mb-4 rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">
              {error}
            </p>
          )}
          {notice && (
            <p
              role="status"
              className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200"
            >
              {notice}
            </p>
          )}

          {section === 'chats' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Live Omnichannel Chat Queue</h2>
                  <p className="text-sm text-slate-400">
                    Monitor AI conversations, take over escalated sessions, or transition chat status.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {['all', ...CHAT_STATUSES].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setChatStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border ${
                        chatStatusFilter === st
                          ? 'bg-emerald-400 text-[#07150f] border-emerald-400'
                          : 'border-white/10 text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => loadWorkspaceData().catch(err => setError(errorText(err)))}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5"
                  >
                    <RefreshCw size={14} /> Refresh
                  </button>
                </div>
              </div>

              <div className="grid min-h-[68vh] gap-4 xl:grid-cols-[minmax(280px,.85fr)_minmax(0,1.6fr)]">
                {/* Chat Sessions List */}
                <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1d15]">
                  <div className="max-h-[68vh] divide-y divide-white/5 overflow-auto">
                    {chatSessions
                      .filter(s => chatStatusFilter === 'all' || s.status === chatStatusFilter)
                      .map(sess => (
                        <button
                          key={sess.sessionToken}
                          type="button"
                          onClick={() => {
                            setSelectedSessionToken(sess.sessionToken);
                            setNotice('');
                          }}
                          className={`w-full p-4 text-left hover:bg-white/5 ${
                            selectedSessionToken === sess.sessionToken ? 'bg-white/10' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-white truncate">
                              {sess.guestName || sess.guestEmail || `Session #${sess.id}`}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-400/15 text-emerald-300">
                              {sess.status?.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                            <span>Priority: {sess.priority}</span>
                            <span>Frustration: {sess.frustrationScore || 0}/100</span>
                          </div>
                          {sess.assignedAgentName && (
                            <p className="mt-1 text-[11px] text-amber-300">
                              Assigned: {sess.assignedAgentName} ({sess.assignedRole || 'agent'})
                            </p>
                          )}
                          <p className="mt-1.5 text-[10px] text-slate-500">{formatDate(sess.updatedAt)}</p>
                        </button>
                      ))}
                    {!chatSessions.length && (
                      <p className="p-5 text-sm text-slate-500">No active chat sessions match the current filter.</p>
                    )}
                  </div>
                </section>

                {/* Active Chat Inspector & Takeover Console */}
                <section className="flex min-h-[68vh] flex-col rounded-2xl border border-white/10 bg-[#0b1d15]">
                  {!selectedSessionDetail?.session ? (
                    <div className="m-auto text-sm text-slate-500">
                      Select a live chat session on the left to inspect or take over.
                    </div>
                  ) : (
                    <>
                      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
                        <div>
                          <h3 className="font-bold text-white">
                            {selectedSessionDetail.session.guestName ||
                              selectedSessionDetail.session.guestEmail ||
                              `Session #${selectedSessionDetail.session.id}`}
                          </h3>
                          <p className="text-xs text-slate-400">
                            Status:{' '}
                            <strong className="text-emerald-300 uppercase">
                              {selectedSessionDetail.session.status?.replace(/_/g, ' ')}
                            </strong>{' '}
                            · Priority: <strong>{selectedSessionDetail.session.priority}</strong> · Frustration:{' '}
                            <strong>{selectedSessionDetail.session.frustrationScore}/100</strong>
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {CHAT_STATUSES.map(st => (
                            <button
                              key={st}
                              type="button"
                              disabled={busy}
                              onClick={() => void handleUpdateChatStatus(st)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase border ${
                                selectedSessionDetail.session.status === st
                                  ? 'bg-emerald-400 text-[#07150f] border-emerald-400'
                                  : 'border-white/10 text-slate-300 hover:bg-white/5'
                              }`}
                            >
                              {st.replace(/_/g, ' ')}
                            </button>
                          ))}
                        </div>
                      </header>

                      {/* Role-Gated Quick Resolution Bar */}
                      <div className="border-b border-white/10 bg-[#081711] px-4 py-2.5 flex flex-wrap items-center gap-2 text-xs">
                        <input
                          value={actionOrderId}
                          onChange={e => setActionOrderId(e.target.value)}
                          placeholder="Order # (e.g. 918273646)"
                          className="w-40 rounded-lg border border-white/10 bg-[#07150f] px-2.5 py-1.5 text-xs text-white"
                        />
                        <button
                          type="button"
                          disabled={busy || !actionOrderId}
                          onClick={() => void handleExecuteChatAction('initiate_return')}
                          title="Generate an official RMA return request for this order"
                          className="inline-flex items-center gap-1 rounded-lg bg-amber-400/15 border border-amber-400/30 px-2.5 py-1.5 text-amber-200 font-semibold hover:bg-amber-400/25 disabled:opacity-40"
                        >
                          <RotateCcw size={13} /> Initiate Return RMA
                        </button>
                        <button
                          type="button"
                          disabled={busy || !actionOrderId || !agent.permissions?.can_cancel_orders}
                          onClick={() => void handleExecuteChatAction('cancel_order')}
                          title={
                            agent.permissions?.can_cancel_orders
                              ? 'Cancel this order immediately'
                              : 'Requires Supervisor or Manager role'
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-rose-400/15 border border-rose-400/30 px-2.5 py-1.5 text-rose-200 font-semibold hover:bg-rose-400/25 disabled:opacity-40"
                        >
                          <Ban size={13} /> Cancel Order
                        </button>
                        {agent.permissions?.can_adjust_wallet_goodwill && (
                          <div className="flex items-center gap-1 ml-auto">
                            <input
                              type="number"
                              min="1"
                              max="2000"
                              value={goodwillAmount}
                              onChange={e => setGoodwillAmount(e.target.value)}
                              className="w-20 rounded-lg border border-white/10 bg-[#07150f] px-2 py-1.5 text-xs text-white"
                            />
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void handleExecuteChatAction('goodwill_wallet_credit')}
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-400/15 border border-emerald-400/30 px-2.5 py-1.5 text-emerald-200 font-semibold hover:bg-emerald-400/25"
                            >
                              <Gift size={13} /> Credit Wallet ₹
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Messages Transcript */}
                      <div className="flex-1 space-y-3 overflow-y-auto p-4 max-h-[45vh]">
                        {(selectedSessionDetail.messages || []).map(m => (
                          <article
                            key={m.id}
                            className={`max-w-[88%] rounded-2xl p-3 text-sm ${
                              m.isInternalNote || m.sender === 'whisper'
                                ? 'bg-amber-500/15 border border-amber-400/40 text-amber-100 mx-auto w-full'
                                : m.sender === 'user'
                                ? 'bg-white/5 text-slate-200'
                                : 'ml-auto bg-emerald-400/10 border border-emerald-400/20 text-emerald-100'
                            }`}
                          >
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {m.isInternalNote ? '🔒 INTERNAL WHISPER NOTE · ' : ''}
                              {m.senderName || m.sender} · {formatDate(m.createdAt)}
                            </p>
                            <p className="whitespace-pre-wrap">{m.content}</p>
                          </article>
                        ))}
                      </div>

                      {/* Reply / Whisper Composer */}
                      <form onSubmit={handleSendChatReply} className="border-t border-white/10 p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <label className="inline-flex items-center gap-2 cursor-pointer text-amber-300">
                            <input
                              type="checkbox"
                              checked={isWhisperMode}
                              onChange={e => setIsWhisperMode(e.target.checked)}
                              className="rounded"
                            />
                            <span>Internal Whisper Note (hidden from customer)</span>
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <textarea
                            required
                            maxLength={10000}
                            rows={2}
                            value={chatReply}
                            onChange={e => setChatReply(e.target.value)}
                            placeholder={
                              isWhisperMode
                                ? 'Write an internal note for Supervisors/Managers…'
                                : 'Write a live reply to the customer…'
                            }
                            className="min-w-0 flex-1 resize-y rounded-xl border border-white/10 bg-[#07150f] p-3 text-sm outline-none focus:border-emerald-400"
                          />
                          <button
                            disabled={busy || !chatReply.trim()}
                            aria-label="Send chat reply"
                            className="self-end rounded-xl bg-emerald-400 p-3 text-[#07150f] font-bold disabled:opacity-50"
                          >
                            <Send size={18} />
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </section>
              </div>
            </div>
          )}

          {section === 'inbox' && (
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Support inbox</h2>
                  <p className="mt-1 text-sm text-slate-500">Ticket conversations refresh automatically.</p>
                </div>
                <button
                  type="button"
                  onClick={() => loadWorkspaceData().catch(requestError => setError(errorText(requestError)))}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
                >
                  <RefreshCw size={15} /> Refresh
                </button>
              </div>
              <div className="grid min-h-[68vh] gap-4 xl:grid-cols-[minmax(270px,.75fr)_minmax(0,1.5fr)]">
                <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1d15]">
                  <label className="relative block border-b border-white/10 p-3">
                    <Search size={16} className="absolute left-6 top-6 text-slate-500" />
                    <input
                      value={search}
                      onChange={event => setSearch(event.target.value)}
                      placeholder="Filter tickets"
                      className="w-full rounded-lg border border-white/10 bg-[#07150f] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-400"
                    />
                  </label>
                  <div className="max-h-[68vh] divide-y divide-white/5 overflow-auto">
                    {tickets
                      .filter(ticket =>
                        `${ticket.name} ${ticket.email} ${ticket.subject}`.toLowerCase().includes(search.toLowerCase())
                      )
                      .map(ticket => (
                        <button
                          key={ticket.id}
                          type="button"
                          onClick={() => {
                            setSelectedTicketId(ticket.id);
                            setNotice('');
                          }}
                          className={`w-full p-4 text-left hover:bg-white/5 ${
                            selectedTicketId === ticket.id ? 'bg-white/5' : ''
                          }`}
                        >
                          <div className="flex justify-between gap-2">
                            <span className="truncate font-semibold text-white">{ticket.subject}</span>
                            <span className="shrink-0 text-[10px] uppercase text-emerald-300">
                              {ticket.status?.replaceAll('_', ' ')}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-xs text-slate-400">
                            {ticket.name} · {ticket.email}
                          </p>
                          <p className="mt-2 line-clamp-2 text-xs text-slate-500">{ticket.message}</p>
                          <p className="mt-2 text-[10px] text-slate-600">
                            #{ticket.id} · {formatDate(ticket.updated_at)}
                          </p>
                        </button>
                      ))}
                    {!tickets.length && <p className="p-5 text-sm text-slate-500">No support tickets yet.</p>}
                  </div>
                </section>
                <section className="flex min-h-[68vh] flex-col rounded-2xl border border-white/10 bg-[#0b1d15]">
                  {!selectedTicket ? (
                    <div className="m-auto text-sm text-slate-500">Select a conversation to review it.</div>
                  ) : (
                    <>
                      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
                        <div>
                          <h3 className="font-semibold">{selectedTicket.subject}</h3>
                          <p className="mt-1 text-xs text-slate-500">
                            {selectedTicket.name} · {selectedTicket.email}
                            {selectedTicket.order_id ? ` · Order #${selectedTicket.order_id}` : ''}
                          </p>
                        </div>
                        <select
                          aria-label="Ticket status"
                          disabled={busy}
                          value={selectedTicket.status}
                          onChange={event => updateTicket(event.target.value)}
                          className="rounded-lg border border-white/10 bg-[#07150f] px-3 py-2 text-xs"
                        >
                          {TICKET_STATUSES.map(status => (
                            <option key={status} value={status}>
                              {status.replaceAll('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </header>
                      <div className="flex-1 space-y-3 overflow-y-auto p-4">
                        {(selectedTicket.messages || []).map(message => (
                          <article
                            key={message.id}
                            className={`max-w-[88%] rounded-2xl p-3 text-sm ${
                              message.sender_type === 'customer'
                                ? 'bg-white/5 text-slate-200'
                                : 'ml-auto bg-emerald-400/10 text-emerald-100'
                            }`}
                          >
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              {message.sender_type === 'customer' ? selectedTicket.name : 'Support'} ·{' '}
                              {formatDate(message.created_at)}
                            </p>
                            <p className="whitespace-pre-wrap">{message.message}</p>
                          </article>
                        ))}
                      </div>
                      <form onSubmit={submitReply} className="border-t border-white/10 p-3">
                        <div className="flex gap-2">
                          <textarea
                            required
                            maxLength={10000}
                            rows={3}
                            value={reply}
                            onChange={event => setReply(event.target.value)}
                            placeholder="Write a reply…"
                            className="min-w-0 flex-1 resize-y rounded-xl border border-white/10 bg-[#07150f] p-3 text-sm outline-none focus:border-emerald-400"
                          />
                          <button
                            disabled={busy || !reply.trim()}
                            aria-label="Send reply"
                            className="self-end rounded-xl bg-emerald-400 p-3 text-[#07150f] disabled:opacity-50"
                          >
                            <Send size={18} />
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </section>
              </div>
            </div>
          )}

          {section === 'customers' && (
            <div className="grid gap-4 xl:grid-cols-[minmax(260px,.75fr)_minmax(0,1.5fr)]">
              <section className="rounded-2xl border border-white/10 bg-[#0b1d15] p-3">
                <label className="relative block">
                  <Search size={16} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder="Name, email, phone…"
                    className="w-full rounded-lg border border-white/10 bg-[#07150f] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-400"
                  />
                </label>
                <div className="mt-2 divide-y divide-white/5">
                  {customers.map(customer => (
                    <button
                      key={customer.id}
                      type="button"
                      onClick={() => selectCustomer(customer)}
                      className={`w-full rounded-lg p-3 text-left hover:bg-white/5 ${
                        selectedCustomer?.id === customer.id ? 'bg-white/5' : ''
                      }`}
                    >
                      <p className="font-semibold">{customer.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{customer.email}</p>
                      <p className="mt-1 text-xs text-slate-600">
                        {customer.phone || 'No phone'} · #{customer.id}
                      </p>
                    </button>
                  ))}
                </div>
                {search.trim().length < 2 && <p className="p-3 text-xs text-slate-500">Type at least two characters.</p>}
                {search.trim().length >= 2 && !customers.length && (
                  <p className="p-3 text-xs text-slate-500">No matching customers.</p>
                )}
              </section>
              <section className="space-y-4">
                {!selectedCustomer ? (
                  <div className="rounded-2xl border border-white/10 bg-[#0b1d15] p-8 text-center text-sm text-slate-500">
                    <UserRound className="mx-auto mb-3 text-slate-600" />
                    Choose a customer to see their profile, orders, returns, and previous cases.
                  </div>
                ) : (
                  <>
                    <article className="rounded-2xl border border-white/10 bg-[#0b1d15] p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold">{customerDetails?.customer?.name || selectedCustomer.name}</h3>
                          <p className="mt-1 text-sm text-slate-400">
                            {selectedCustomer.email} · {selectedCustomer.phone || 'No phone'} · Customer #{selectedCustomer.id}
                          </p>
                          <p className="mt-2 text-xs text-slate-500">
                            Joined {formatDate(customerDetails?.customer?.created_at)} · Wallet ₹
                            {customerDetails?.customer?.wallet_balance ?? '—'} · Loyalty{' '}
                            {customerDetails?.customer?.loyalty_points ?? '—'} points
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={busy || !customerDetails}
                          onClick={toggleCustomerStatus}
                          className="rounded-lg border border-amber-400/30 px-3 py-2 text-xs text-amber-200 disabled:opacity-50"
                        >
                          {Number(customerDetails?.customer?.is_active) ? 'Disable account' : 'Enable account'}
                        </button>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={sendResetLink}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-3 py-2 text-xs font-bold text-[#07150f] disabled:opacity-50"
                        >
                          <ShieldCheck size={14} /> Email 30-minute reset link
                        </button>
                        <a
                          href={`mailto:${selectedCustomer.email}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5"
                        >
                          <Mail size={14} /> Open email
                        </a>
                      </div>
                    </article>
                    <article className="rounded-2xl border border-white/10 bg-[#0b1d15] p-5">
                      <h4 className="mb-3 font-semibold">Order history</h4>
                      {customerDetails?.orders?.length ? (
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[760px] text-left text-xs">
                            <thead className="text-slate-500">
                              <tr>
                                <th className="pb-2">Order</th>
                                <th className="pb-2">Date</th>
                                <th className="pb-2">Items</th>
                                <th className="pb-2">Status</th>
                                <th className="pb-2">Payment</th>
                                <th className="pb-2">Tracking</th>
                                <th className="pb-2 text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {customerDetails.orders.map(order => (
                                <tr key={order.id}>
                                  <td className="py-3">#{order.order_number || order.id}</td>
                                  <td className="py-3">{formatDate(order.created_at)}</td>
                                  <td className="max-w-52 py-3">
                                    {order.items?.map(item => `${item.name} × ${item.quantity}`).join(', ') || '—'}
                                  </td>
                                  <td className="py-3 capitalize">{order.status}</td>
                                  <td className="py-3 capitalize">{order.payment_status || order.payment_mode || '—'}</td>
                                  <td className="py-3">
                                    {order.courier || ''} {order.tracking_number || '—'}
                                  </td>
                                  <td className="py-3 text-right">₹{order.total ?? '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">{busy ? 'Loading profile…' : 'No orders found.'}</p>
                      )}
                    </article>
                    <article className="rounded-2xl border border-white/10 bg-[#0b1d15] p-5">
                      <h4 className="mb-3 font-semibold">Send customer email</h4>
                      <form onSubmit={sendEmail} className="space-y-3">
                        <input
                          required
                          maxLength={200}
                          value={emailSubject}
                          onChange={event => setEmailSubject(event.target.value)}
                          placeholder="Subject"
                          className="w-full rounded-lg border border-white/10 bg-[#07150f] px-3 py-2 text-sm outline-none focus:border-emerald-400"
                        />
                        <textarea
                          required
                          maxLength={10000}
                          rows={4}
                          value={emailMessage}
                          onChange={event => setEmailMessage(event.target.value)}
                          placeholder="Message"
                          className="w-full rounded-lg border border-white/10 bg-[#07150f] p-3 text-sm outline-none focus:border-emerald-400"
                        />
                        <button
                          disabled={busy}
                          className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5 disabled:opacity-50"
                        >
                          Send email
                        </button>
                      </form>
                    </article>
                  </>
                )}
              </section>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
