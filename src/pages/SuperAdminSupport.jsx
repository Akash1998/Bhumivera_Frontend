import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  ShieldCheck,
  Users,
  MessageSquare,
  Sliders,
  HelpCircle,
  BookOpen,
  Plus,
  RefreshCw,
  Send,
  AlertTriangle,
  Eye,
  Sparkles,
  Activity,
  Search,
  ChevronRight,
  Award,
  Layers,
  ExternalLink,
  LogOut,
} from 'lucide-react';

const STATUS_BADGES = {
  active: { label: 'Active Chat', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  pending: { label: 'Pending Customer', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  waiting_for_review: { label: 'Waiting for Review', bg: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  escalated: { label: 'Escalated', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  resolved: { label: 'Resolved', bg: 'bg-teal-500/15 text-teal-300 border-teal-500/30' },
  closed: { label: 'Closed', bg: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
};

const ROLE_CONFIG = {
  agent: {
    label: 'Support Agent (L1)',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    description: 'Handles live customer chats, order tracking, RMA creation, and standard status transitions (Active, Pending, Waiting for Review, Resolved, Closed).',
  },
  supervisor: {
    label: 'Support Supervisor (L2)',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    description: 'Includes all Agent rights plus Chat Reassignment, Barge-In, Order Cancellations, Goodwill Wallet Credits, and SLA Queue Monitoring.',
  },
  manager: {
    label: 'Support Manager (L3)',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    description: 'Full Command Center governance: Create/Edit Agent Login IDs, Assign Roles & Permissions, Manage AI Feature Flags, and Override Any Chat or Ticket.',
  },
};

const PERMISSION_LABELS = {
  can_view_chats: { label: 'View Live Chats', desc: 'Read active and historical AI & human chat transcripts.' },
  can_reply_chats: { label: 'Reply & Whisper in Chats', desc: 'Send live agent messages or internal staff whisper notes.' },
  can_close_chats: { label: 'Close & Archive Chats', desc: 'Mark conversations Resolved or Closed.' },
  can_mark_pending_review: { label: 'Mark Pending / Waiting Review', desc: 'Transition chats to Pending Customer or Waiting for Review.' },
  can_escalate: { label: 'Trigger Escalations', desc: 'Escalate high-risk chats to L2/L3 and dispatch webhooks.' },
  can_view_customers: { label: 'View Customer 360° Profile', desc: 'Inspect customer email, phone, wallet ledger, and loyalty tier.' },
  can_send_reset_link: { label: 'Send Password Reset Links', desc: 'Trigger 1-time 30-minute password reset emails for customers.' },
  can_initiate_returns: { label: 'Generate & Approve RMAs', desc: 'Initiate returns or replacements for delivered orders.' },
  can_cancel_orders: { label: 'Execute Order Cancellations', desc: 'Cancel eligible customer orders and release inventory directly from chat.' },
  can_adjust_wallet_goodwill: { label: 'Issue Goodwill Wallet Credits', desc: 'Credit up to ₹2,000 directly into a customer spendable wallet.' },
  can_reassign_chats: { label: 'Reassign Chats Across Staff', desc: 'Transfer chat ownership to another Agent, Supervisor, or Manager.' },
  can_barge_in_chats: { label: 'Live Chat Barge-In', desc: 'Join and reply inside another agent’s active conversation.' },
  can_approve_waiting_review: { label: 'Approve Waiting-for-Review Queue', desc: 'Sign off on L2 quality review cases.' },
  can_manage_agents: { label: 'Manage Staff Login IDs & Roles', desc: 'Create support logins, assign Agent/Supervisor/Manager roles, and suspend accounts.' },
  can_manage_ai_features: { label: 'Manage AI & Support Feature Flags', desc: 'Toggle AI self-service tools, SLA timers, frustration thresholds, and macros.' },
  can_view_analytics: { label: 'View Telemetry & SLA Analytics', desc: 'Access full SLA, CSAT, and escalation performance metrics.' },
};

const BUTTON_DICTIONARY = [
  {
    id: 'tab_overview',
    category: 'Navigation',
    button: 'Live Command Overview',
    whatItDoes: 'Displays real-time telemetry across all chat statuses (Active, Pending, Waiting for Review, Escalated, Resolved, Closed), active staff by role, CSAT scores, and priority escalations.',
    whenToUse: 'Use at the start of a shift or during peak traffic to spot bottlenecks or Critical escalations immediately.',
  },
  {
    id: 'tab_monitor',
    category: 'Navigation',
    button: 'Omnichannel Chat Monitor & Barge-In',
    whatItDoes: 'Streams every customer conversation happening on Bhumivera in real time. Allows SuperAdmins and Managers to inspect tool calls, send a live Barge-In reply to the customer, drop a hidden Whisper Note for the assigned agent, reassign the chat, or change its status.',
    whenToUse: 'Use when a customer escalates, when frustration exceeds threshold, or when auditing an agent’s live handling.',
  },
  {
    id: 'tab_rbac',
    category: 'Access Control',
    button: 'Staff Login IDs & Role Matrix (Agent / Supervisor / Manager)',
    whatItDoes: 'Creates multiple dedicated login IDs for bhumivera.com/support, assigns each staff member to Agent (L1), Supervisor (L2), or Manager (L3), and lets you customize all 16 granular permission switches per user.',
    whenToUse: 'Use when onboarding new support staff, promoting an agent to supervisor/manager, or revoking access.',
  },
  {
    id: 'tab_features',
    category: 'Feature Governance',
    button: 'AI & Support Feature Engine',
    whatItDoes: 'Controls the live behavior of the 20X AI Support Engine without redeploying code — toggle AI auto-cancellation, AI auto-RMA generation, proactive checkout linger popups, frustration escalation thresholds, SLA timers, and canned macros.',
    whenToUse: 'Use during flash sales, policy changes, or maintenance windows to tune AI autonomy and escalation sensitivity.',
  },
  {
    id: 'status_controls',
    category: 'Chat Lifecycle',
    button: 'Start / Active / Pending / Waiting Review / Escalate / Resolved / Close',
    whatItDoes: 'Transitions the conversation state machine in MySQL and synchronizes immediately with both the customer’s floating chat widget and the /support staff queue.',
    whenToUse: 'Use "Pending" when waiting on customer input, "Waiting for Review" when L2/QA needs to inspect photos/refunds, "Escalated" for urgent specialist action, "Resolved" when solved (triggers CSAT survey), and "Close" to archive.',
  },
  {
    id: 'whisper_mode',
    category: 'Live Coaching',
    button: 'Internal Whisper Note vs. Public Reply',
    whatItDoes: 'Public Reply sends your message straight to the customer’s chat window. Internal Whisper Note saves a yellow coaching note inside the chat timeline that ONLY support agents, supervisors, and managers can see.',
    whenToUse: 'Use Whisper Mode to guide a junior agent on how to resolve a tricky refund without the customer seeing your internal instructions.',
  },
  {
    id: 'instant_exec',
    category: '1-Click Resolution',
    button: 'Cancel Order / Generate RMA / Goodwill Wallet Credit',
    whatItDoes: 'Executes transactional MySQL operations directly from the chat monitor — cancels eligible orders, generates an RMA-XXXXXXXX return ticket, or credits ₹1–₹2,000 to the customer’s Bhumivera Wallet with an automatic system confirmation in chat.',
    whenToUse: 'Use to delight VIP or frustrated customers in seconds without switching screens.',
  },
];

export default function SuperAdminSupport() {
  const [authToken, setAuthToken] = useState(
    () => localStorage.getItem('adminToken') || localStorage.getItem('supportToken') || ''
  );
  const [authMode, setAuthMode] = useState('admin');
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');
  const [explainMode, setExplainMode] = useState(false);
  const [hoveredExplain, setHoveredExplain] = useState(null);

  const [overview, setOverview] = useState(null);
  const [agents, setAgents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSessionToken, setSelectedSessionToken] = useState(null);
  const [selectedSessionDetail, setSelectedSessionDetail] = useState(null);
  const [features, setFeatures] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [replyText, setReplyText] = useState('');
  const [isWhisper, setIsWhisper] = useState(false);
  const [statusAfterReply, setStatusAfterReply] = useState('');
  const [actionOrderId, setActionOrderId] = useState('');
  const [goodwillAmount, setGoodwillAmount] = useState('100');

  const [newAgent, setNewAgent] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'agent',
    department: 'Customer Concierge',
    max_concurrent_chats: 10,
    permissions: {},
  });
  const [editingAgent, setEditingAgent] = useState(null);
  const [newMacro, setNewMacro] = useState({ title: '', category: 'orders', content: '' });

  const requestConfig = useMemo(
    () => ({
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      notify: false,
    }),
    [authToken]
  );

  const showNotice = (type, message) => {
    setFeedbackBanner({ type, message });
    setTimeout(() => {
      setFeedbackBanner(prev => (prev?.message === message ? null : prev));
    }, 5000);
  };

  const fetchCommandCenterData = useCallback(async () => {
    if (!authToken) return;
    setLoading(true);
    try {
      const [overviewRes, sessionsRes, agentsRes, featuresRes] = await Promise.all([
        api.get('/support/superadmin/overview', requestConfig),
        api.get(
          `/support/sessions?status=${statusFilter}&priority=${priorityFilter}&search=${encodeURIComponent(searchQuery)}&limit=80`,
          requestConfig
        ),
        api.get('/support/agents', requestConfig),
        api.get('/support/superadmin/features', requestConfig),
      ]);

      setOverview(overviewRes.data);
      setSessions(sessionsRes.data?.sessions || overviewRes.data?.sessions || []);
      setAgents(agentsRes.data?.agents || overviewRes.data?.agents || []);
      setFeatures(featuresRes.data?.featureConfig || overviewRes.data?.featureConfig || null);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setLoginError(
          err.response?.data?.message ||
            'Please sign in with an Admin, SuperAdmin, or Support Manager account to access /superadminsupport.'
        );
        setAuthToken('');
      } else {
        showNotice('error', err.response?.data?.message || 'Could not synchronize command center telemetry.');
      }
    } finally {
      setLoading(false);
    }
  }, [authToken, requestConfig, statusFilter, priorityFilter, searchQuery]);

  const fetchSessionDetail = useCallback(
    async token => {
      if (!token || !authToken) return;
      try {
        const res = await api.get(`/support/sessions/${token}`, requestConfig);
        setSelectedSessionDetail(res.data);
      } catch (err) {
        showNotice('error', err.response?.data?.message || 'Could not load chat transcript.');
      }
    },
    [authToken, requestConfig]
  );

  useEffect(() => {
    if (authToken) {
      fetchCommandCenterData();
    }
  }, [authToken, fetchCommandCenterData]);

  useEffect(() => {
    if (selectedSessionToken) {
      fetchSessionDetail(selectedSessionToken);
    }
  }, [selectedSessionToken, fetchSessionDetail]);

  const handleLogin = async e => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      if (authMode === 'admin') {
        const res = await api.post(
          '/auth/admin/login',
          { email: loginForm.identifier.trim(), password: loginForm.password },
          { notify: false }
        );
        const tok = res.data?.token;
        if (!tok) throw new Error('Invalid admin login response.');
        localStorage.setItem('adminToken', tok);
        setAuthToken(tok);
      } else {
        const res = await api.post(
          '/support/login',
          { username: loginForm.identifier.trim(), password: loginForm.password },
          { notify: false }
        );
        const tok = res.data?.token;
        if (!tok) throw new Error('Invalid support login response.');
        localStorage.setItem('supportToken', tok);
        setAuthToken(tok);
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || err.message || 'Sign in failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('supportToken');
    setAuthToken('');
    setOverview(null);
  };

  const handleCreateAgent = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/support/agents', newAgent, requestConfig);
      setAgents(prev => [res.data.agent, ...prev]);
      setNewAgent({
        username: '',
        name: '',
        email: '',
        password: '',
        role: 'agent',
        department: 'Customer Concierge',
        max_concurrent_chats: 10,
        permissions: {},
      });
      showNotice('success', `Created ${res.data.agent.role.toUpperCase()} login ID '${res.data.agent.username}'.`);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Failed to create staff login ID.');
    }
  };

  const handleUpdateAgent = async (agentId, patch) => {
    try {
      const res = await api.patch(`/support/agents/${agentId}`, patch, requestConfig);
      setAgents(prev => prev.map(a => (a.id === agentId ? res.data.agent : a)));
      if (editingAgent?.id === agentId) {
        setEditingAgent(res.data.agent);
      }
      showNotice('success', `Updated access controls for ${res.data.agent.name} (${res.data.agent.role}).`);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not update staff role/permissions.');
    }
  };

  const handleSendSessionReply = async e => {
    e.preventDefault();
    if (!selectedSessionToken || !replyText.trim()) return;
    try {
      await api.post(
        `/support/sessions/${selectedSessionToken}/reply`,
        {
          message: replyText.trim(),
          isInternalNote: isWhisper,
          nextStatus: statusAfterReply || undefined,
        },
        requestConfig
      );
      setReplyText('');
      await fetchSessionDetail(selectedSessionToken);
      await fetchCommandCenterData();
      showNotice('success', isWhisper ? 'Internal whisper note added.' : 'Live reply delivered to customer chat.');
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not send message.');
    }
  };

  const handleSessionStatusChange = async (sessionToken, status, assignedAgentId = undefined) => {
    try {
      const targetAgent = assignedAgentId ? agents.find(a => a.id === Number(assignedAgentId)) : null;
      await api.patch(
        `/support/sessions/${sessionToken}/status`,
        {
          status,
          assignedAgentId,
          assignedAgentName: targetAgent ? targetAgent.name : undefined,
          assignedRole: targetAgent ? targetAgent.role : undefined,
          resolutionNote: status === 'resolved' ? 'Marked resolved by SuperAdmin Command Center' : undefined,
        },
        requestConfig
      );
      if (selectedSessionToken === sessionToken) {
        await fetchSessionDetail(sessionToken);
      }
      await fetchCommandCenterData();
      showNotice('success', `Chat status updated to ${status.replace(/_/g, ' ').toUpperCase()}.`);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not update chat status.');
    }
  };

  const handleExecuteQuickAction = async (action, extra = {}) => {
    if (!selectedSessionToken) return;
    try {
      const res = await api.post(
        `/support/sessions/${selectedSessionToken}/execute-action`,
        {
          action,
          orderId: actionOrderId || undefined,
          goodwillAmount: Number(goodwillAmount) || 100,
          ...extra,
        },
        requestConfig
      );
      await fetchSessionDetail(selectedSessionToken);
      showNotice('success', res.data?.message || `Executed ${action} on chat.`);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Action execution failed.');
    }
  };

  const handleSaveFeatures = async updatedFeatures => {
    try {
      const res = await api.put('/support/superadmin/features', updatedFeatures, requestConfig);
      setFeatures(res.data.featureConfig);
      showNotice('success', 'AI Support & SLA feature switches saved and activated globally.');
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Failed to update feature switches.');
    }
  };

  const handleAddMacro = async e => {
    e.preventDefault();
    if (!newMacro.title.trim() || !newMacro.content.trim() || !features) return;
    const nextMacros = [
      ...(features.canned_macros || []),
      {
        id: `macro_${Date.now()}`,
        label: newMacro.title.trim(),
        category: newMacro.category,
        text: newMacro.content.trim(),
      },
    ];
    await handleSaveFeatures({ ...features, canned_macros: nextMacros });
    setNewMacro({ title: '', category: 'orders', content: '' });
  };

  if (!authToken) {
    return (
      <div className="min-h-screen bg-[#071510] text-[#FDFBF7] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0B2419] border border-[#D4AF37]/30 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                bhumivera.com/superadminsupport
              </span>
              <h1 className="text-2xl font-serif font-bold text-white">
                SuperAdmin Support Command
              </h1>
            </div>
          </div>

          <p className="text-xs text-emerald-100/70 mb-5 leading-relaxed">
            Sign in with your Website Admin credentials (<code className="text-[#D4AF37]">/admin/login</code>) or a
            Support Manager ID (<code className="text-[#D4AF37]">/support</code>) to govern chat monitoring, multi-role
            staff logins, and AI feature flags.
          </p>

          <div className="grid grid-cols-2 gap-2 p-1 bg-black/30 rounded-lg mb-5 border border-white/10">
            <button
              type="button"
              onClick={() => setAuthMode('admin')}
              className={`py-2 text-xs font-medium rounded-md transition ${
                authMode === 'admin' ? 'bg-[#D4AF37] text-[#071510] font-semibold' : 'text-emerald-100/70'
              }`}
            >
              Admin / SuperAdmin
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('support')}
              className={`py-2 text-xs font-medium rounded-md transition ${
                authMode === 'support' ? 'bg-[#D4AF37] text-[#071510] font-semibold' : 'text-emerald-100/70'
              }`}
            >
              Support Manager ID
            </button>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-emerald-100/80 mb-1">
                {authMode === 'admin' ? 'Admin Email Address' : 'Support Manager Username'}
              </label>
              <input
                type="text"
                required
                value={loginForm.identifier}
                onChange={e => setLoginForm(prev => ({ ...prev, identifier: e.target.value }))}
                placeholder={authMode === 'admin' ? 'admin@bhumivera.com' : 'concierge_lead'}
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/15 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-emerald-100/80 mb-1">Password</label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/15 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2f] text-[#071510] font-semibold text-sm transition"
            >
              {loginLoading ? 'Authenticating Command Center…' : 'Enter SuperAdmin Support Command'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-100/60">
            <Link to="/admin/login" className="hover:text-[#D4AF37]">
              → Website Admin (/admin)
            </Link>
            <Link to="/support" className="hover:text-[#D4AF37]">
              → Agent Workspace (/support)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusBreakdown = overview?.metrics?.statusCounts || {};
  const roleCounts = agents.reduce(
    (acc, a) => {
      const r = a.role || 'agent';
      acc[r] = (acc[r] || 0) + 1;
      return acc;
    },
    { agent: 0, supervisor: 0, manager: 0 }
  );

  return (
    <div className="min-h-screen bg-[#071510] text-[#FDFBF7] flex flex-col">
      {/* TOP ENTERPRISE HEADER */}
      <header className="sticky top-0 z-40 bg-[#0B2419]/95 backdrop-blur-md border-b border-[#D4AF37]/25 px-6 py-3.5">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-semibold">
                  20X Enterprise Command
                </span>
                <span className="text-xs text-emerald-200/70 font-mono">
                  bhumivera.com/superadminsupport
                </span>
              </div>
              <h1 className="text-lg font-serif font-bold text-white">
                Bhumivera SuperAdmin Support & Access Control Center
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setExplainMode(prev => !prev)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition ${
                explainMode
                  ? 'bg-[#D4AF37] text-[#071510] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20'
                  : 'bg-white/5 text-emerald-100 border-white/15 hover:border-[#D4AF37]/50'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              {explainMode ? 'Explainer Mode: ON (Hover any control)' : 'What Will This Button Do? (?)'}
            </button>

            <Link
              to="/support"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-emerald-100"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
              Agent Portal (/support)
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-emerald-100"
            >
              <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
              Website Admin (/admin)
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

            <button
              type="button"
              onClick={fetchCommandCenterData}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-100"
              title="Refresh live telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs text-rose-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {explainMode && (
        <div className="bg-[#D4AF37]/15 border-b border-[#D4AF37]/40 px-6 py-3">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 text-xs text-[#FDFBF7]">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>
                <strong>Interactive Button Explainer Active:</strong> Hover over any tab or action button below to see
                what it does in MySQL and the live customer chat widget, or open the{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('guide')}
                  className="underline font-semibold text-[#D4AF37]"
                >
                  Full Button & Architecture Guide
                </button>
                .
              </span>
            </div>
            {hoveredExplain && (
              <div className="text-xs bg-[#071510]/90 border border-[#D4AF37]/50 px-3 py-1.5 rounded-lg text-[#D4AF37]">
                <strong>{hoveredExplain.title}:</strong> {hoveredExplain.desc}
              </div>
            )}
          </div>
        </div>
      )}

      {feedbackBanner && (
        <div
          className={`px-6 py-2.5 text-xs font-medium border-b ${
            feedbackBanner.type === 'error'
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-200'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
          }`}
        >
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <span>{feedbackBanner.message}</span>
            <button type="button" onClick={() => setFeedbackBanner(null)} className="text-white/70 hover:text-white">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* PRIMARY NAVIGATION TABS */}
      <div className="bg-[#0B2419]/60 border-b border-white/10 px-6">
        <div className="max-w-[1600px] mx-auto flex items-center gap-2 overflow-x-auto py-2.5">
          {[
            {
              id: 'overview',
              label: '1. Live Command Overview',
              icon: Activity,
              explain: 'Real-time SLA telemetry, status distribution, CSAT ratings, and priority escalation queue.',
            },
            {
              id: 'monitor',
              label: `2. Omnichannel Chat Monitor (${sessions.length})`,
              icon: MessageSquare,
              explain: 'Inspect any live customer chat, barge-in with public replies, post internal whisper notes, reassign agents, or execute 1-click refunds/cancellations.',
            },
            {
              id: 'rbac',
              label: `3. Staff Login IDs & Roles (${agents.length})`,
              icon: Users,
              explain: 'Create multiple support login IDs, assign Agent (L1), Supervisor (L2), or Manager (L3) roles, and toggle 16 granular access permissions.',
            },
            {
              id: 'features',
              label: '4. AI & Feature Management',
              icon: Sliders,
              explain: 'Control autonomous AI self-service switches, frustration thresholds, SLA target timers, and canned response macros.',
            },
            {
              id: 'guide',
              label: '5. What Will This Button Do? (Guide)',
              icon: BookOpen,
              explain: 'Complete interactive manual explaining every button, chat status, role permission, and portal route.',
            },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                onMouseEnter={() => explainMode && setHoveredExplain({ title: tab.label, desc: tab.explain })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
                  isActive
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

      {/* MAIN WORKSPACE CONTENT */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-6 space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#0B2419] border border-white/10">
                <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold">
                  1. Website Maintenance Portal
                </span>
                <h3 className="text-sm font-bold text-white mt-1">bhumivera.com/admin/login</h3>
                <p className="text-xs text-emerald-100/70 mt-1">
                  Catalog, inventory, pricing, orders, banners, and accounting management for website administrators.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0B2419] border border-white/10">
                <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                  2. Support Staff Workspace
                </span>
                <h3 className="text-sm font-bold text-white mt-1">bhumivera.com/support</h3>
                <p className="text-xs text-emerald-100/70 mt-1">
                  Dedicated multi-role desk for Support Agents (L1), Supervisors (L2), and Managers (L3) to handle live
                  chats and tickets.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0B2419] border border-[#D4AF37]/40">
                <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                  3. SuperAdmin Support Command (Current)
                </span>
                <h3 className="text-sm font-bold text-white mt-1">bhumivera.com/superadminsupport</h3>
                <p className="text-xs text-emerald-100/70 mt-1">
                  Full omnichannel chat monitoring, staff login ID & role provisioning, and 20X AI feature governance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { key: 'active', label: 'Active Chats', desc: 'Live conversations in progress' },
                { key: 'pending', label: 'Marked Pending', desc: 'Awaiting customer response' },
                { key: 'waiting_for_review', label: 'Waiting for Review', desc: 'Queued for L2/QA verification' },
                { key: 'escalated', label: 'Escalated (Urgent)', desc: 'Breached SLA or human handoff' },
                { key: 'resolved', label: 'Marked Resolved', desc: 'Issue solved & CSAT requested' },
                { key: 'closed', label: 'Closed & Archived', desc: 'Completed support sessions' },
              ].map(card => (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => {
                    setStatusFilter(card.key);
                    setActiveTab('monitor');
                  }}
                  className="text-left p-4 rounded-xl bg-[#0B2419] border border-white/10 hover:border-[#D4AF37]/50 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${STATUS_BADGES[card.key]?.bg}`}>
                      {card.label}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-3">
                    {statusBreakdown[card.key] || 0}
                  </div>
                  <p className="text-[11px] text-emerald-100/60 mt-1">{card.desc}</p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-[#0B2419] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#D4AF37]" />
                    Support Staff Role Hierarchy
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('rbac')}
                    className="text-xs text-[#D4AF37] hover:underline"
                  >
                    Manage Logins →
                  </button>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/5">
                    <span>Support Managers (L3 — Full Control)</span>
                    <span className="font-bold text-purple-300">{roleCounts.manager}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/5">
                    <span>Support Supervisors (L2 — Escalations & Credits)</span>
                    <span className="font-bold text-amber-300">{roleCounts.supervisor}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/5">
                    <span>Support Agents (L1 — Live Chat & Orders)</span>
                    <span className="font-bold text-emerald-300">{roleCounts.agent}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#0B2419] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  Sentiment, CSAT & Uptime Health
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-emerald-100/60">Avg Customer CSAT</span>
                    <div className="text-xl font-bold text-[#D4AF37] mt-1">
                      {overview?.metrics?.averageCsat ? `${overview.metrics.averageCsat} / 5.0 ★` : '4.9 ★'}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-emerald-100/60">Avg Frustration Score</span>
                    <div className="text-xl font-bold text-white mt-1">
                      {overview?.metrics?.averageFrustration || 0} / 100
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-emerald-100/60">Critical / High Priority</span>
                    <div className="text-xl font-bold text-rose-300 mt-1">
                      {(overview?.metrics?.priorityCounts?.Critical || 0) +
                        (overview?.metrics?.priorityCounts?.High || 0)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-emerald-100/60">Engine Availability</span>
                    <div className="text-xl font-bold text-emerald-300 mt-1">
                      {overview?.metrics?.uptimePercent || 100}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#0B2419] border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Recent Escalations & Alerts
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(overview?.escalations || []).length === 0 ? (
                    <p className="text-xs text-emerald-100/60">No open escalations — all SLAs healthy.</p>
                  ) : (
                    overview.escalations.slice(0, 5).map(esc => (
                      <div
                        key={esc.id}
                        className="p-2.5 rounded-lg bg-black/30 border border-rose-500/20 flex items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <span className="font-semibold text-rose-300">[{esc.priority}]</span>{' '}
                          <span className="text-white">{esc.customer_name || esc.customer_email || 'Guest'}</span>
                          <p className="text-[11px] text-emerald-100/60 truncate max-w-[220px]">{esc.reason}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSessionToken(esc.session_token);
                            setActiveTab('monitor');
                          }}
                          className="px-2.5 py-1 rounded bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30 shrink-0"
                        >
                          Inspect
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OMNICHANNEL CHAT MONITOR & BARGE-IN */}
        {activeTab === 'monitor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-[#0B2419] border border-white/10 rounded-xl p-4 flex flex-col h-[740px]">
              <div className="space-y-3 pb-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">All Platform Chat Sessions ({sessions.length})</h3>
                  <button
                    type="button"
                    onClick={fetchCommandCenterData}
                    className="text-xs text-[#D4AF37] hover:underline"
                  >
                    Sync Now
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by customer name, email, phone, or token…"
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {['all', 'active', 'pending', 'waiting_for_review', 'escalated', 'resolved', 'closed'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium border transition ${
                        statusFilter === st
                          ? 'bg-[#D4AF37] text-[#071510] border-[#D4AF37] font-semibold'
                          : 'bg-black/30 text-emerald-100/70 border-white/10'
                      }`}
                    >
                      {st === 'all' ? 'All Statuses' : STATUS_BADGES[st]?.label || st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 mt-3 pr-1">
                {sessions.length === 0 ? (
                  <p className="text-xs text-emerald-100/60 text-center py-12">
                    No chat sessions match the current filter.
                  </p>
                ) : (
                  sessions.map(sess => {
                    const isSelected = selectedSessionToken === sess.sessionToken;
                    return (
                      <button
                        key={sess.sessionToken}
                        type="button"
                        onClick={() => setSelectedSessionToken(sess.sessionToken)}
                        className={`w-full text-left p-3.5 rounded-xl border transition ${
                          isSelected
                            ? 'bg-[#D4AF37]/15 border-[#D4AF37]'
                            : 'bg-black/30 border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white truncate">
                            {sess.customerName || sess.guestName || 'Guest Shopper'}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded border ${
                              STATUS_BADGES[sess.status]?.bg || STATUS_BADGES.active.bg
                            }`}
                          >
                            {STATUS_BADGES[sess.status]?.label || sess.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-100/60 mt-1 flex items-center justify-between">
                          <span>{sess.customerEmail || sess.guestEmail || 'Anonymous session'}</span>
                          <span className="font-mono text-[10px] text-[#D4AF37]">Priority: {sess.priority}</span>
                        </div>
                        {sess.lastMessagePreview && (
                          <p className="text-xs text-emerald-100/80 mt-2 line-clamp-1 bg-black/25 px-2 py-1 rounded">
                            {sess.lastMessagePreview}
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between text-[10px] text-emerald-100/50">
                          <span>
                            Assigned: {sess.assignedAgentName ? `${sess.assignedAgentName} (${sess.assignedRole})` : 'AI Autonomous'}
                          </span>
                          <span>Msgs: {sess.messageCount || 1}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#0B2419] border border-white/10 rounded-xl p-5 flex flex-col h-[740px]">
              {!selectedSessionDetail?.session ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-emerald-100/60">
                  <Eye className="w-10 h-10 text-[#D4AF37] mb-3 opacity-80" />
                  <h4 className="text-sm font-bold text-white">Select a Chat Session to Monitor or Barge In</h4>
                  <p className="text-xs max-w-md mt-1">
                    Inspect real-time customer conversations, change statuses (Active, Pending, Waiting for Review,
                    Escalated, Resolved, Closed), reassign to any Agent/Supervisor/Manager, or issue instant refunds.
                  </p>
                </div>
              ) : (
                <>
                  <div className="pb-3 border-b border-white/10 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          {selectedSessionDetail.customerSummary?.customer?.name ||
                            selectedSessionDetail.session.guestName ||
                            'Guest Customer'}{' '}
                          <span className="text-xs font-normal text-emerald-100/60">
                            ({selectedSessionDetail.customerSummary?.customer?.email || selectedSessionDetail.session.guestEmail || 'No email'})
                          </span>
                        </h3>
                        <p className="text-[11px] text-emerald-100/60">
                          Session Token: <code className="text-[#D4AF37]">{selectedSessionDetail.session.sessionToken}</code>
                          {selectedSessionDetail.customerSummary?.customer && (
                            <>
                              {' · '}Wallet: <strong>₹{selectedSessionDetail.customerSummary.customer.wallet_balance || 0}</strong>
                              {' · '}Loyalty: <strong>{selectedSessionDetail.customerSummary.customer.loyalty_points || 0} pts</strong>
                            </>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-[11px] text-emerald-100/70">Assign Staff:</label>
                        <select
                          value={selectedSessionDetail.session.assignedAgentId || ''}
                          onChange={e =>
                            handleSessionStatusChange(
                              selectedSessionDetail.session.sessionToken,
                              selectedSessionDetail.session.status,
                              e.target.value ? Number(e.target.value) : null
                            )
                          }
                          className="px-2.5 py-1 rounded bg-black/50 border border-white/15 text-xs text-white"
                        >
                          <option value="">AI Concierge (Unassigned)</option>
                          {agents.map(ag => (
                            <option key={ag.id} value={ag.id}>
                              {ag.name} ({ag.role.toUpperCase()})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-emerald-100/60 mr-1">Set Status:</span>
                      {[
                        { id: 'active', label: 'Start / Active' },
                        { id: 'pending', label: 'Mark Pending' },
                        { id: 'waiting_for_review', label: 'Waiting for Review' },
                        { id: 'escalated', label: 'Escalate' },
                        { id: 'resolved', label: 'Mark Resolved' },
                        { id: 'closed', label: 'Close Chat' },
                      ].map(st => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() =>
                            handleSessionStatusChange(selectedSessionDetail.session.sessionToken, st.id)
                          }
                          className={`px-2.5 py-1 rounded text-[11px] font-medium border transition ${
                            selectedSessionDetail.session.status === st.id
                              ? 'bg-[#D4AF37] text-[#071510] border-[#D4AF37] font-bold'
                              : 'bg-black/30 text-emerald-100/80 border-white/15 hover:border-[#D4AF37]/50'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={actionOrderId}
                        onChange={e => setActionOrderId(e.target.value)}
                        placeholder="Order # or ID (optional)"
                        className="px-2.5 py-1 rounded bg-black/40 border border-white/15 text-xs text-white w-36"
                      />
                      <button
                        type="button"
                        onClick={() => handleExecuteQuickAction('cancel_order')}
                        className="px-2.5 py-1 rounded bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-[11px] text-rose-200"
                      >
                        1-Click Cancel Order
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExecuteQuickAction('initiate_return')}
                        className="px-2.5 py-1 rounded bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-[11px] text-sky-200"
                      >
                        1-Click Generate RMA
                      </button>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="10"
                          max="2000"
                          value={goodwillAmount}
                          onChange={e => setGoodwillAmount(e.target.value)}
                          className="px-2 py-1 rounded bg-black/40 border border-white/15 text-xs text-white w-20"
                        />
                        <button
                          type="button"
                          onClick={() => handleExecuteQuickAction('goodwill_wallet_credit')}
                          className="px-2.5 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-[11px] text-emerald-200"
                        >
                          + Goodwill Wallet ₹
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
                    {(selectedSessionDetail.messages || []).map(msg => {
                      const isWhisperMsg = msg.isInternalNote || msg.sender === 'whisper';
                      const isUser = msg.sender === 'user';
                      return (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-xl text-xs max-w-[88%] ${
                            isWhisperMsg
                              ? 'ml-auto bg-amber-500/15 border border-amber-500/40 text-amber-100'
                              : isUser
                              ? 'bg-black/40 border border-white/10 text-white'
                              : 'ml-auto bg-emerald-950/80 border border-emerald-500/30 text-emerald-50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 text-[10px] opacity-70 mb-1">
                            <span className="font-semibold uppercase">
                              {isWhisperMsg
                                ? `🔒 WHISPER NOTE (${msg.senderName || 'Supervisor'})`
                                : isUser
                                ? 'CUSTOMER'
                                : msg.senderName || 'AI CONCIERGE'}
                            </span>
                            <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                          </div>
                          <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={handleSendSessionReply} className="pt-3 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isWhisper}
                          onChange={e => setIsWhisper(e.target.checked)}
                          className="rounded border-white/20"
                        />
                        <span className={isWhisper ? 'text-amber-300 font-semibold' : 'text-emerald-100/70'}>
                          🔒 Internal Whisper Note (Hidden from Customer)
                        </span>
                      </label>

                      <select
                        value={statusAfterReply}
                        onChange={e => setStatusAfterReply(e.target.value)}
                        className="px-2 py-1 rounded bg-black/40 border border-white/15 text-[11px] text-white"
                      >
                        <option value="">Keep current status after send</option>
                        <option value="active">Set Active</option>
                        <option value="pending">Set Pending Customer</option>
                        <option value="waiting_for_review">Set Waiting for Review</option>
                        <option value="resolved">Set Resolved</option>
                        <option value="closed">Set Closed</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder={
                          isWhisper
                            ? 'Write an internal coaching note visible only to support agents…'
                            : 'Type a live SuperAdmin reply to the customer…'
                        }
                        className="flex-1 px-3.5 py-2 rounded-lg bg-black/40 border border-white/15 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2f] text-[#071510] font-semibold text-xs flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {isWhisper ? 'Post Whisper' : 'Send Reply'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: STAFF LOGIN IDs & ROLE ACCESS CONTROL */}
        {activeTab === 'rbac' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-[#0B2419] border border-white/10 rounded-xl p-5 space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                  Multi-Role Provisioning
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Create Support Login ID (bhumivera.com/support)
                </h3>
                <p className="text-xs text-emerald-100/70 mt-1">
                  Create dedicated login credentials and assign the role of <strong>Agent</strong>,{' '}
                  <strong>Supervisor</strong>, or <strong>Manager</strong>.
                </p>
              </div>

              <form onSubmit={handleCreateAgent} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-emerald-100/80 mb-1">Login User ID (username)</label>
                  <input
                    type="text"
                    required
                    value={newAgent.username}
                    onChange={e => setNewAgent(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="e.g., agent.rahul or sup.ananya"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-emerald-100/80 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newAgent.name}
                      onChange={e => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Rahul Sharma"
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-emerald-100/80 mb-1">Email (optional)</label>
                    <input
                      type="email"
                      value={newAgent.email}
                      onChange={e => setNewAgent(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="rahul@bhumivera.com"
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-emerald-100/80 mb-1">Assign Role Tier</label>
                    <select
                      value={newAgent.role}
                      onChange={e => setNewAgent(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-[#D4AF37]/40 text-white font-semibold"
                    >
                      <option value="agent">Agent (L1 — Chat & Orders)</option>
                      <option value="supervisor">Supervisor (L2 — Escalations & Credits)</option>
                      <option value="manager">Manager (L3 — Full Support Admin)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-emerald-100/80 mb-1">Max Concurrent Chats</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newAgent.max_concurrent_chats}
                      onChange={e => setNewAgent(prev => ({ ...prev, max_concurrent_chats: Number(e.target.value) }))}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-black/30 border border-white/10 text-[11px] text-emerald-100/80">
                  <strong>{ROLE_CONFIG[newAgent.role]?.label}:</strong> {ROLE_CONFIG[newAgent.role]?.description}
                </div>

                <div>
                  <label className="block text-emerald-100/80 mb-1">Initial Password (min 8 chars)</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newAgent.password}
                    onChange={e => setNewAgent(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2f] text-[#071510] font-semibold flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create {newAgent.role.toUpperCase()} Login ID
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-[#0B2419] border border-white/10 rounded-xl p-5 space-y-4">
              <h3 className="text-base font-bold text-white">Active Support Staff Directory & Access Matrix</h3>
              <p className="text-xs text-emerald-100/70">
                Click <strong>Configure Access</strong> on any login ID to promote/demote roles or customize individual
                permissions.
              </p>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {agents.map(agent => {
                  const isEditing = editingAgent?.id === agent.id;
                  return (
                    <div
                      key={agent.id}
                      className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{agent.name}</span>
                            <code className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                              @{agent.username}
                            </code>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded border font-semibold uppercase ${
                                ROLE_CONFIG[agent.role]?.badge || ROLE_CONFIG.agent.badge
                              }`}
                            >
                              {agent.role}
                            </span>
                            {!agent.is_active && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                Suspended
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-emerald-100/60 mt-1">
                            Department: {agent.department || 'Customer Concierge'} · Max Chats:{' '}
                            {agent.max_concurrent_chats || 10}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={agent.role}
                            onChange={e => handleUpdateAgent(agent.id, { role: e.target.value })}
                            className="px-2.5 py-1 rounded bg-black/50 border border-white/15 text-xs text-white"
                          >
                            <option value="agent">Role: Agent (L1)</option>
                            <option value="supervisor">Role: Supervisor (L2)</option>
                            <option value="manager">Role: Manager (L3)</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => setEditingAgent(isEditing ? null : agent)}
                            className="px-3 py-1 rounded bg-white/10 hover:bg-white/15 text-xs text-white"
                          >
                            {isEditing ? 'Hide Matrix' : 'Configure Access'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleUpdateAgent(agent.id, { is_active: !agent.is_active })}
                            className={`px-2.5 py-1 rounded text-xs font-medium ${
                              agent.is_active
                                ? 'bg-rose-500/15 text-rose-200 hover:bg-rose-500/25'
                                : 'bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25'
                            }`}
                          >
                            {agent.is_active ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="pt-3 border-t border-white/10 space-y-3">
                          <h4 className="text-xs font-bold text-[#D4AF37]">
                            Granular Permission Switches for @{agent.username}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Object.entries(PERMISSION_LABELS).map(([permKey, meta]) => {
                              const enabled = Boolean(agent.permissions?.[permKey]);
                              return (
                                <button
                                  key={permKey}
                                  type="button"
                                  onClick={() =>
                                    handleUpdateAgent(agent.id, {
                                      permissions: {
                                        ...(agent.permissions || {}),
                                        [permKey]: !enabled,
                                      },
                                    })
                                  }
                                  className={`p-2.5 rounded-lg border text-left transition flex items-start justify-between gap-2 ${
                                    enabled
                                      ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                                      : 'bg-black/20 border-white/5 text-white/50'
                                  }`}
                                >
                                  <div>
                                    <div className="text-xs font-semibold">{meta.label}</div>
                                    <div className="text-[10px] opacity-75 mt-0.5">{meta.desc}</div>
                                  </div>
                                  <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                      enabled ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white/60'
                                    }`}
                                  >
                                    {enabled ? 'ON' : 'OFF'}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AI & SUPPORT FEATURE MANAGEMENT CONSOLE */}
        {activeTab === 'features' && features && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-[#0B2419] border border-white/10 rounded-xl p-5 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D4AF37]" />
                Autonomous AI Capabilities & Guardrail Switches
              </h3>
              <p className="text-xs text-emerald-100/70">
                Toggle real-time AI self-service capabilities immediately across the entire storefront.
              </p>

              <div className="space-y-2.5">
                {[
                  {
                    key: 'ai_support_enabled',
                    title: 'Master AI Support Concierge Engine',
                    desc: 'Enables the floating AI chat assistant and multi-turn orchestration across all storefront pages.',
                  },
                  {
                    key: 'ai_auto_cancel_enabled',
                    title: 'Autonomous Self-Service Order Cancellation',
                    desc: 'Allows AI to automatically cancel pending/confirmed orders and restore product inventory in MySQL.',
                  },
                  {
                    key: 'ai_auto_return_rma_enabled',
                    title: 'Autonomous RMA Return & Replacement Generation',
                    desc: 'Allows AI to verify delivery windows and create RMA-XXXXXXXX return requests automatically.',
                  },
                  {
                    key: 'ai_auto_wallet_goodwill_enabled',
                    title: 'Supervisor/Manager Instant Goodwill Wallet Credit',
                    desc: 'Enables 1-click spendable wallet credits for delayed or high-frustration orders.',
                  },
                  {
                    key: 'ai_proactive_triggers_enabled',
                    title: 'Proactive Checkout Linger (>45s) & Rage-Click Popups',
                    desc: 'Automatically offers contextual assistance when a shopper stalls on checkout/tracking or rage-clicks.',
                  },
                  {
                    key: 'allow_customer_csat_rating',
                    title: 'Post-Resolution 1–5★ CSAT Rating Prompt',
                    desc: 'Prompts the customer to rate their support experience whenever a chat is marked Resolved.',
                  },
                ].map(item => {
                  const isOn = Boolean(features[item.key]);
                  return (
                    <div
                      key={item.key}
                      className="p-3.5 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.title}</h4>
                        <p className="text-[11px] text-emerald-100/60 mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSaveFeatures({ ...features, [item.key]: !isOn })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                          isOn
                            ? 'bg-emerald-500 text-[#071510]'
                            : 'bg-white/10 text-white/60 hover:bg-white/20'
                        }`}
                      >
                        {isOn ? 'ENABLED' : 'DISABLED'}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
                <div className="p-3 rounded-lg bg-black/30 border border-white/10">
                  <label className="block text-emerald-100/70 mb-1">
                    Auto-Escalation Frustration Threshold (20–100)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="100"
                    value={features.support_frustration_threshold || 70}
                    onChange={e =>
                      setFeatures(prev => ({
                        ...prev,
                        support_frustration_threshold: Number(e.target.value),
                      }))
                    }
                    className="w-full px-2.5 py-1.5 rounded bg-black/50 border border-white/15 text-white"
                  />
                </div>
                <div className="p-3 rounded-lg bg-black/30 border border-white/10">
                  <label className="block text-emerald-100/70 mb-1">Proactive Linger Trigger (Seconds)</label>
                  <input
                    type="number"
                    min="15"
                    max="300"
                    value={features.ai_proactive_linger_seconds || 45}
                    onChange={e =>
                      setFeatures(prev => ({
                        ...prev,
                        ai_proactive_linger_seconds: Number(e.target.value),
                      }))
                    }
                    className="w-full px-2.5 py-1.5 rounded bg-black/50 border border-white/15 text-white"
                  />
                </div>
                <div className="p-3 rounded-lg bg-black/30 border border-white/10">
                  <label className="block text-emerald-100/70 mb-1">Critical SLA Window (Minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={features.support_sla_critical_minutes || 15}
                    onChange={e =>
                      setFeatures(prev => ({
                        ...prev,
                        support_sla_critical_minutes: Number(e.target.value),
                      }))
                    }
                    className="w-full px-2.5 py-1.5 rounded bg-black/50 border border-white/15 text-white"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSaveFeatures(features)}
                className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#071510] font-semibold text-xs"
              >
                Save Thresholds & SLA Configuration
              </button>
            </div>

            <div className="lg:col-span-5 bg-[#0B2419] border border-white/10 rounded-xl p-5 space-y-4">
              <h3 className="text-base font-bold text-white">Staff Canned Response Macros</h3>
              <p className="text-xs text-emerald-100/70">
                Create 1-click response templates available to all Agents, Supervisors, and Managers in{' '}
                <code>/support</code>.
              </p>

              <form onSubmit={handleAddMacro} className="space-y-2.5 text-xs">
                <input
                  type="text"
                  required
                  value={newMacro.title}
                  onChange={e => setNewMacro(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Macro Title (e.g., Expedited Dispatch Apology)"
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white"
                />
                <textarea
                  rows={3}
                  required
                  value={newMacro.content}
                  onChange={e => setNewMacro(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Macro message content…"
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg bg-[#D4AF37] text-[#071510] font-semibold text-xs"
                >
                  + Add Canned Macro
                </button>
              </form>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 pt-2 border-t border-white/10">
                {(features.canned_macros || []).map(macro => (
                  <div key={macro.id} className="p-3 rounded-lg bg-black/30 border border-white/10 text-xs">
                    <div className="font-bold text-[#D4AF37]">{macro.label || macro.title}</div>
                    <p className="text-emerald-100/80 mt-1 text-[11px]">{macro.text || macro.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: INTERACTIVE "WHAT WILL THIS BUTTON DO?" DICTIONARY */}
        {activeTab === 'guide' && (
          <div className="bg-[#0B2419] border border-white/10 rounded-xl p-6 space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                Interactive Control Reference
              </span>
              <h2 className="text-xl font-serif font-bold text-white mt-1">
                “What Will This Button Do?” — Complete 20X Support Control Guide
              </h2>
              <p className="text-xs text-emerald-100/70 mt-1">
                Every control across the Customer Chat Widget, the <code>/support</code> Agent Workspace, and{' '}
                <code>/superadminsupport</code> is documented below.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BUTTON_DICTIONARY.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-semibold">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{item.button}</h3>
                  <p className="text-xs text-emerald-100/80 leading-relaxed">
                    <strong>What it does:</strong> {item.whatItDoes}
                  </p>
                  <p className="text-[11px] text-[#D4AF37]/90">
                    <strong>When to use:</strong> {item.whenToUse}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
