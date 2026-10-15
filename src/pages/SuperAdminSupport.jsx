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
  Download,
  Mail,
  KeyRound,
  Ticket,
  Gift,
  CheckSquare,
  BellRing,
  FileText,
  UserCheck,
} from 'lucide-react';

/**
 * Safely decodes a JWT payload on the client to verify it is a genuine Support Staff
 * or Admin/SuperAdmin token (and NEVER a customer storefront token).
 */
function decodeStaffOrAdminJwt(rawToken) {
  if (!rawToken || typeof rawToken !== 'string') return null;
  try {
    const parts = rawToken.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(window.atob(base64));
    if (json.exp && Date.now() >= json.exp * 1000) return null;
    if (
      json.scope === 'support-agent' ||
      ['admin', 'superadmin', 'manager', 'supervisor', 'agent', 'support_agent'].includes(json.role)
    ) {
      return json;
    }
    return null;
  } catch {
    return null;
  }
}

function getInitialValidStaffToken() {
  const candidates = [
    localStorage.getItem('supportToken'),
    localStorage.getItem('adminToken'),
  ];
  for (const tok of candidates) {
    if (decodeStaffOrAdminJwt(tok)) return tok;
  }
  return '';
}

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
    description: 'Handles live customer chats, order tracking, RMA creation, and support-controlled status transitions (Active, Pending, Waiting for Review, Resolved, Closed).',
  },
  supervisor: {
    label: 'Support Supervisor (L2)',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    description: 'Includes all Agent rights plus Chat Reassignment, Barge-In, Order Cancellations, Goodwill Wallet Credits, Bonus Loyalty Points, and SLA Queue Monitoring.',
  },
  manager: {
    label: 'Support Manager (L3)',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    description: 'Full Command Center governance: Create/Edit Agent Login IDs, Assign Roles & Permissions, Manage AI Feature Flags, and Override Any Chat or Ticket.',
  },
  superadmin: {
    label: 'SuperAdmin Executive',
    badge: 'bg-[#D4AF37]/25 text-[#D4AF37] border-[#D4AF37]/50',
    description: 'Unrestricted executive access across all 20 Customer Support Admin Panel features.',
  },
};

const PERMISSION_LABELS = {
  can_view_chats: { label: 'View Live Chats', desc: 'Read active and historical AI & human chat transcripts.' },
  can_reply_chats: { label: 'Reply & Whisper in Chats', desc: 'Send live agent messages or internal staff whisper notes.' },
  can_close_chats: { label: 'Mark Resolved & Close Chats', desc: 'Exclusively mark customer conversations Resolved or Closed.' },
  can_mark_pending_review: { label: 'Mark Pending / Waiting Review', desc: 'Transition chats to Pending Customer or Waiting for Review.' },
  can_escalate: { label: 'Trigger Escalations', desc: 'Escalate high-risk chats to L2/L3 and dispatch webhooks.' },
  can_view_customers: { label: 'View Customer 360° Profile', desc: 'Inspect customer email, phone, wallet ledger, and loyalty tier.' },
  can_send_reset_link: { label: 'Send Password Reset Links', desc: 'Trigger 1-time 30-minute password reset emails for customers.' },
  can_initiate_returns: { label: 'Generate & Approve RMAs', desc: 'Initiate returns or replacements for delivered orders.' },
  can_cancel_orders: { label: 'Execute Order Cancellations', desc: 'Cancel eligible customer orders and release inventory directly from chat.' },
  can_adjust_wallet_goodwill: { label: 'Issue Goodwill Wallet & Loyalty Credits', desc: 'Credit up to ₹2,000 or 5,000 loyalty points directly to a customer.' },
  can_reassign_chats: { label: 'Reassign Chats Across Staff', desc: 'Transfer chat ownership to another Agent, Supervisor, or Manager.' },
  can_barge_in_chats: { label: 'Live Chat Barge-In', desc: 'Join and reply inside another agent’s active conversation.' },
  can_approve_waiting_review: { label: 'Approve Waiting-for-Review Queue', desc: 'Sign off on L2 quality review cases.' },
  can_manage_agents: { label: 'Manage Staff Login IDs & Roles', desc: 'Create support logins, assign Agent/Supervisor/Manager roles, and suspend accounts.' },
  can_manage_ai_features: { label: 'Manage AI & Support Feature Flags', desc: 'Toggle AI self-service tools, SLA timers, frustration thresholds, and macros.' },
  can_view_analytics: { label: 'View Telemetry, Audit Logs & CSV Export', desc: 'Access full SLA, CSAT, audit trail, and CSV export tools.' },
};

const TWENTY_EXECUTIVE_FEATURES = [
  { no: 1, title: 'Live Omnichannel Queue & Telemetry', category: 'Command Overview', whatItDoes: 'Real-time counters and 1-click filters across Active, Pending, Waiting for Review, Escalated, Resolved, and Closed chats.' },
  { no: 2, title: 'Support-Exclusive Status Control', category: 'Chat Lifecycle', whatItDoes: 'Places all status transitions (Pending, Waiting for Review, Escalated, Resolved, Closed) 100% in Customer Support hands—customers see a read-only status badge.' },
  { no: 3, title: 'Live Barge-In Public Reply', category: 'Chat Monitor', whatItDoes: 'Lets SuperAdmins, Managers, and Supervisors jump into any live chat and send an immediate public response to the customer.' },
  { no: 4, title: 'Internal Whisper Coaching Notes (🔒)', category: 'Chat Monitor', whatItDoes: 'Posts hidden yellow coaching notes inside the chat timeline visible only to Support Agents, Supervisors, and Managers.' },
  { no: 5, title: 'Intelligent Agent Assignment & Reassignment', category: 'Chat Monitor', whatItDoes: 'Assigns or transfers any conversation to a specific Agent (L1), Supervisor (L2), or Manager (L3).' },
  { no: 6, title: 'Bulk Session Queue Operations', category: 'Chat Monitor', whatItDoes: 'Selects multiple chat sessions at once to bulk-transition statuses or bulk-assign to a support executive.' },
  { no: 7, title: '1-Click Order Cancellation & Stock Restore', category: 'Instant Resolution', whatItDoes: 'Cancels eligible customer orders and restores MySQL product stock directly from the chat monitor.' },
  { no: 8, title: '1-Click Instant RMA Return / Replacement', category: 'Instant Resolution', whatItDoes: 'Generates an official RMA-XXXXXXXX return or replacement record for delivered orders in one click.' },
  { no: 9, title: '1-Click Goodwill Wallet Credit (+ ₹)', category: 'Instant Resolution', whatItDoes: 'Credits ₹1–₹2,000 directly into the customer’s spendable Bhumivera Wallet with an automatic confirmation in chat.' },
  { no: 10, title: '1-Click Bonus Loyalty Points Award (+ Pts)', category: 'Instant Resolution', whatItDoes: 'Awards 10–5,000 bonus loyalty points directly to the customer’s loyalty ledger and posts a confirmation message.' },
  { no: 11, title: '1-Click Personal Apology Coupon Generator', category: 'Instant Resolution', whatItDoes: 'Mints a single-use courtesy discount coupon (e.g., CARE15-XXXX) in MySQL and drops it into the customer’s chat.' },
  { no: 12, title: 'Customer 360° Deep CRM & Account Controls', category: 'Customer 360°', whatItDoes: 'Searches any customer by name/email/phone, inspects orders/wallet/loyalty, sends 1-time password reset links, sends direct emails, or toggles account status.' },
  { no: 13, title: 'Unified Support Tickets & Contact Inbox', category: 'Tickets & Escalations', whatItDoes: 'Manages all traditional contact/support tickets (Open, In Progress, Resolved, Closed) with direct email replies.' },
  { no: 14, title: 'Priority AI Escalations Triage Board', category: 'Tickets & Escalations', whatItDoes: 'Tracks Critical and High frustration escalations with 1-click Acknowledge, Resolve, and Jump-to-Chat controls.' },
  { no: 15, title: 'Multi-Role Staff Login ID Provisioning', category: 'RBAC & Staff', whatItDoes: 'Creates multiple login IDs for bhumivera.com/support and assigns Agent (L1), Supervisor (L2), or Manager (L3) roles.' },
  { no: 16, title: '16-Permission Matrix & Staff Password Reset', category: 'RBAC & Staff', whatItDoes: 'Customizes 16 granular permissions per login ID, resets staff passwords, or suspends/activates accounts immediately.' },
  { no: 17, title: 'Staff Live Presence & Workload Balancer', category: 'RBAC & Staff', whatItDoes: 'Shows each agent’s online status, active assigned chat count vs. max capacity, and last sign-in timestamp.' },
  { no: 18, title: 'Autonomous AI Feature & SLA Timer Governance', category: 'AI & Features', whatItDoes: 'Toggles AI Auto-Cancel, Auto-RMA, Goodwill Wallet, Proactive Checkout Linger, Frustration Threshold, and SLA target timers.' },
  { no: 19, title: 'Canned Response Macros & Webhook Test Ping', category: 'AI & Features', whatItDoes: 'Creates shared 1-click response macros for agents and dispatches live test alerts to Telegram, WhatsApp, and Email.' },
  { no: 20, title: 'Immutable Audit Log, CSAT & CSV Export', category: 'Audit & Guide', whatItDoes: 'Records every support executive action in ai_support_audit_logs, displays CSAT scores, and exports telemetry as CSV.' },
];

export default function SuperAdminSupport() {
  const [authToken, setAuthToken] = useState(getInitialValidStaffToken);
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '', otp: '' });
  const [otpStep, setOtpStep] = useState(false);
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
  const [selectedBulkTokens, setSelectedBulkTokens] = useState([]);
  const [features, setFeatures] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [ticketReply, setTicketReply] = useState('');

  // Customer 360° CRM state
  const [customerSearch, setCustomerSearch] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState(null);
  const [customerEmailForm, setCustomerEmailForm] = useState({ subject: '', message: '' });

  const [loading, setLoading] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState(null);

  // Filters for Chat Monitor
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Reply & Action states in Chat Monitor
  const [replyText, setReplyText] = useState('');
  const [isWhisper, setIsWhisper] = useState(false);
  const [statusAfterReply, setStatusAfterReply] = useState('');
  const [actionOrderId, setActionOrderId] = useState('');
  const [goodwillAmount, setGoodwillAmount] = useState('100');
  const [loyaltyPointsBonus, setLoyaltyPointsBonus] = useState('200');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState('15');

  // Create / Edit Staff Login state
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
  const [resetAgentPassword, setResetAgentPassword] = useState('');
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
    }, 5500);
  };

  const fetchCommandCenterData = useCallback(async () => {
    if (!authToken) return;
    setLoading(true);
    try {
      const [overviewRes, sessionsRes, agentsRes, featuresRes, ticketsRes, auditRes] = await Promise.all([
        api.get('/support/superadmin/overview', requestConfig),
        api.get(
          `/support/sessions?status=${statusFilter}&priority=${priorityFilter}&search=${encodeURIComponent(searchQuery)}&limit=100`,
          requestConfig
        ),
        api.get('/support/agents', requestConfig),
        api.get('/support/superadmin/features', requestConfig),
        api.get('/support/tickets', requestConfig).catch(() => ({ data: { tickets: [] } })),
        api.get('/support/superadmin/audit-logs?limit=60', requestConfig).catch(() => ({ data: { logs: [] } })),
      ]);

      setOverview(overviewRes.data);
      setSessions(sessionsRes.data?.sessions || overviewRes.data?.sessions || []);
      setAgents(agentsRes.data?.agents || overviewRes.data?.agents || []);
      setFeatures(featuresRes.data?.featureConfig || overviewRes.data?.featureConfig || null);
      setTickets(ticketsRes.data?.tickets || []);
      setAuditLogs(auditRes.data?.logs || overviewRes.data?.auditLogs || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setLoginError(
          err.response?.data?.message ||
            'Please sign in with your Admin Email or Support Staff ID to access /superadminsupport.'
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
        const firstOrder = res.data?.customerSummary?.orders?.[0];
        if (firstOrder) {
          setActionOrderId(String(firstOrder.orderNumber || firstOrder.id));
        }
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

  /**
   * Unified 1-Step Sign-In:
   * Authenticates against `/api/support/login` (which supports Support Agents/Supervisors/Managers
   * AND Website Admins/SuperAdmins from `admin_users` / `users`), with fallback to `/api/auth/admin/login` + OTP.
   */
  const handleLogin = async e => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      if (otpStep) {
        const verifyRes = await api.post(
          '/auth/admin/verify-otp',
          { email: loginForm.identifier.trim(), otp: loginForm.otp.trim() },
          { notify: false }
        );
        const tok = verifyRes.data?.token;
        if (!tok) throw new Error(verifyRes.data?.message || 'OTP verification failed.');
        localStorage.setItem('adminToken', tok);
        localStorage.setItem('supportToken', tok);
        setOtpStep(false);
        setAuthToken(tok);
        return;
      }

      // First try unified `/api/support/login` (accepts both support_agents username/email AND admin_users email)
      try {
        const res = await api.post(
          '/support/login',
          {
            username: loginForm.identifier.trim(),
            email: loginForm.identifier.trim(),
            identifier: loginForm.identifier.trim(),
            password: loginForm.password,
          },
          { notify: false }
        );
        const tok = res.data?.token;
        if (tok) {
          localStorage.setItem('supportToken', tok);
          if (res.data?.agent?.role === 'superadmin') {
            localStorage.setItem('adminToken', tok);
          }
          setAuthToken(tok);
          return;
        }
      } catch (supportLoginErr) {
        // If identifier is an email, also check `/auth/admin/login` in case OTP flow is required
        if (!loginForm.identifier.includes('@')) {
          throw supportLoginErr;
        }
      }

      const adminRes = await api.post(
        '/auth/admin/login',
        { email: loginForm.identifier.trim(), password: loginForm.password },
        { notify: false }
      );
      if (adminRes.data?.token) {
        localStorage.setItem('adminToken', adminRes.data.token);
        localStorage.setItem('supportToken', adminRes.data.token);
        setAuthToken(adminRes.data.token);
      } else if (adminRes.data?.requiresOtp) {
        setOtpStep(true);
        showNotice('success', adminRes.data.message || 'Verification code sent to your admin email.');
      } else {
        throw new Error(adminRes.data?.message || 'Invalid credentials.');
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || err.message || 'Sign in failed. Check your ID/email and password.');
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
      showNotice('success', `Created ${res.data.agent.role.toUpperCase()} login ID '@${res.data.agent.username}'.`);
      fetchCommandCenterData();
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
      showNotice('success', isWhisper ? 'Internal whisper note saved.' : 'Live reply delivered to customer chat.');
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
          resolutionNote: status === 'resolved' ? 'Marked resolved by Customer Support Executive' : undefined,
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

  const handleBulkSessionAction = async ({ status, assignedAgentId }) => {
    if (!selectedBulkTokens.length) return;
    try {
      const targetAgent = assignedAgentId ? agents.find(a => a.id === Number(assignedAgentId)) : null;
      const res = await api.post(
        '/support/sessions/bulk-action',
        {
          sessionTokens: selectedBulkTokens,
          status: status || undefined,
          assignedAgentId: assignedAgentId !== undefined ? assignedAgentId : undefined,
          assignedAgentName: targetAgent ? targetAgent.name : undefined,
          assignedRole: targetAgent ? targetAgent.role : undefined,
        },
        requestConfig
      );
      setSelectedBulkTokens([]);
      await fetchCommandCenterData();
      showNotice('success', res.data?.message || 'Bulk session update completed.');
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Bulk update failed.');
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
          points: Number(loyaltyPointsBonus) || 200,
          discountPercent: Number(couponDiscountPercent) || 15,
          ...extra,
        },
        requestConfig
      );
      await fetchSessionDetail(selectedSessionToken);
      await fetchCommandCenterData();
      showNotice('success', res.data?.message || `Executed ${action} on chat.`);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Action execution failed.');
    }
  };

  const handleSearchCustomers = async e => {
    e?.preventDefault();
    if (customerSearch.trim().length < 2) return;
    try {
      const res = await api.get(
        `/support/customers?search=${encodeURIComponent(customerSearch.trim())}`,
        requestConfig
      );
      setCustomers(res.data?.customers || []);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Customer search failed.');
    }
  };

  const handleSelectCustomer = async customerId => {
    try {
      const res = await api.get(`/support/customers/${customerId}`, requestConfig);
      setSelectedCustomerDetail(res.data);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not load customer 360° profile.');
    }
  };

  const handleSendPasswordResetLink = async customerId => {
    try {
      const res = await api.post(`/support/customers/${customerId}/password-reset-link`, {}, requestConfig);
      showNotice('success', res.data?.message || 'One-time password reset link sent.');
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not send reset link.');
    }
  };

  const handleSendCustomerDirectEmail = async e => {
    e.preventDefault();
    const custId = selectedCustomerDetail?.customer?.id;
    if (!custId || !customerEmailForm.subject.trim() || !customerEmailForm.message.trim()) return;
    try {
      const res = await api.post(`/support/customers/${custId}/email`, customerEmailForm, requestConfig);
      setCustomerEmailForm({ subject: '', message: '' });
      showNotice('success', res.data?.message || 'Direct email dispatched to customer.');
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not send email.');
    }
  };

  const handleToggleCustomerActive = async customer => {
    const nextStatus = customer.is_active ? 'disabled' : 'active';
    try {
      await api.patch(`/support/customers/${customer.id}/status`, { status: nextStatus }, requestConfig);
      await handleSelectCustomer(customer.id);
      showNotice('success', `Customer account marked ${nextStatus.toUpperCase()}.`);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not update customer status.');
    }
  };

  const handleUpdateTicket = async (ticketId, status, reply = '') => {
    try {
      const res = await api.patch(
        `/support/tickets/${ticketId}`,
        { status, ...(reply.trim() ? { reply: reply.trim() } : {}) },
        requestConfig
      );
      setTicketReply('');
      await fetchCommandCenterData();
      showNotice('success', res.data?.message || `Ticket #${ticketId} updated to ${status}.`);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not update ticket.');
    }
  };

  const handleUpdateEscalationStatus = async (escId, status) => {
    try {
      const res = await api.patch(`/support/ai-escalations/${escId}`, { status }, requestConfig);
      await fetchCommandCenterData();
      showNotice('success', res.data?.message || `Escalation #${escId} marked ${status}.`);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not update escalation.');
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

  const handleTestWebhook = async channel => {
    try {
      const res = await api.post('/support/superadmin/test-webhook', { channel }, requestConfig);
      showNotice('success', res.data?.message || `Webhook ping dispatched to ${channel}.`);
      fetchCommandCenterData();
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Webhook test failed.');
    }
  };

  const handleExportCsv = async () => {
    try {
      const res = await api.get('/support/superadmin/export-csv', {
        ...requestConfig,
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bhumivera_support_telemetry_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showNotice('success', 'Exported live chat & SLA telemetry CSV report.');
    } catch {
      showNotice('error', 'Could not download CSV export.');
    }
  };

  const handleAddMacro = async e => {
    e.preventDefault();
    if (!newMacro.title.trim() || !newMacro.content.trim() || !features) return;
    const nextMacros = [
      ...(features.macros || []),
      {
        id: `macro_${Date.now()}`,
        title: newMacro.title.trim(),
        category: newMacro.category,
        content: newMacro.content.trim(),
      },
    ];
    await handleSaveFeatures({ ...features, macros: nextMacros });
    setNewMacro({ title: '', category: 'orders', content: '' });
  };

  // ============================================================================
  // UNIFIED LOGIN GATE IF NOT AUTHENTICATED AS STAFF / ADMIN
  // ============================================================================
  if (!authToken) {
    return (
      <div className="min-h-screen bg-[#071510] text-[#FDFBF7] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0B2419] border border-[#D4AF37]/30 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-5">
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

          <p className="text-xs text-emerald-100/75 mb-5 leading-relaxed">
            Sign in with your <strong>Website Admin Email</strong> or any <strong>Support Staff Login ID</strong> (
            <code className="text-[#D4AF37]">Manager / Supervisor / Agent</code>) to access the 20-Feature Customer
            Support Executive Command Center.
          </p>

          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-emerald-100/80 mb-1">
                Admin Email or Support Login ID
              </label>
              <input
                type="text"
                required
                value={loginForm.identifier}
                onChange={e => setLoginForm(prev => ({ ...prev, identifier: e.target.value }))}
                placeholder="admin@bhumivera.com or concierge_lead"
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

            {otpStep && (
              <div>
                <label className="block text-xs text-[#D4AF37] mb-1">
                  Admin Email Verification Code (OTP)
                </label>
                <input
                  type="text"
                  required
                  value={loginForm.otp}
                  onChange={e => setLoginForm(prev => ({ ...prev, otp: e.target.value }))}
                  placeholder="6-digit OTP code"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-[#D4AF37] text-sm text-white focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2f] text-[#071510] font-semibold text-sm transition"
            >
              {loginLoading
                ? 'Authenticating Command Center…'
                : otpStep
                ? 'Verify OTP & Enter Command Center'
                : 'Enter SuperAdmin Support Command'}
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
  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0] || null;
  const availableMacros = features?.macros || features?.canned_macros || [];

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
                  20-Feature Executive Command
                </span>
                <span className="text-xs text-emerald-200/70 font-mono">
                  bhumivera.com/superadminsupport
                </span>
              </div>
              <h1 className="text-lg font-serif font-bold text-white">
                Bhumivera SuperAdmin Support & Omnichannel Access Control Center
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
              {explainMode ? 'Explainer Mode: ON' : 'What Will This Button Do? (?)'}
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs text-emerald-200 font-semibold"
              title="Download CSV report of all chat sessions, SLAs, and CSAT scores"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>

            <Link
              to="/support"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-emerald-100"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
              Agent Desk (/support)
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

            <Link
              to="/admin"
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
                <strong>Interactive Button Explainer Active:</strong> Hover over any workspace tab or button to see
                exactly what it does, or open the{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('guide')}
                  className="underline font-semibold text-[#D4AF37]"
                >
                  20-Feature & Button Guide
                </button>
                . All chat statuses (Pending, Waiting for Review, Escalated, Resolved, Closed) are controlled
                exclusively by Customer Support.
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

      {/* 7 INTERCONNECTED EXECUTIVE WORKSPACE TABS */}
      <div className="bg-[#0B2419]/60 border-b border-white/10 px-6">
        <div className="max-w-[1600px] mx-auto flex items-center gap-2 overflow-x-auto py-2.5">
          {[
            {
              id: 'overview',
              label: '1. Executive Command Overview',
              icon: Activity,
              explain: 'Live SLA telemetry, support-controlled status breakdown, CSAT ratings, and staff workload balancer.',
            },
            {
              id: 'monitor',
              label: `2. Live Chat Monitor & Barge-In (${sessions.length})`,
              icon: MessageSquare,
              explain: 'Control chat statuses (Active, Pending, Waiting Review, Escalated, Resolved, Closed), barge-in, whisper, bulk-assign, or execute 1-click refunds/credits/coupons.',
            },
            {
              id: 'crm360',
              label: '3. Customer 360° CRM Lookup',
              icon: UserCheck,
              explain: 'Deep customer lookup across orders, items, wallet, loyalty points, password reset links, and direct email dispatch.',
            },
            {
              id: 'tickets',
              label: `4. Tickets & Escalations (${tickets.length + (overview?.escalations?.length || 0)})`,
              icon: Ticket,
              explain: 'Manage traditional support tickets and triage Critical/High AI escalations in one unified queue.',
            },
            {
              id: 'rbac',
              label: `5. Staff Logins & Role Matrix (${agents.length})`,
              icon: Users,
              explain: 'Create multiple login IDs for /support, assign Agent (L1), Supervisor (L2), or Manager (L3) roles, and toggle 16 granular permissions.',
            },
            {
              id: 'features',
              label: '6. AI Governance, Macros & Webhooks',
              icon: Sliders,
              explain: 'Toggle AI self-service tools, tune SLA timers & frustration thresholds, manage canned macros, and ping webhooks.',
            },
            {
              id: 'guide',
              label: `7. Audit Log & 20-Feature Guide (${auditLogs.length})`,
              icon: BookOpen,
              explain: 'Inspect the immutable support executive audit trail and the complete "What Will This Button Do?" reference.',
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
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
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
        {/* ===================================================================
            TAB 1: EXECUTIVE COMMAND OVERVIEW
           =================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#0B2419] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold">
                    1. Website Maintenance Portal
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">bhumivera.com/admin/login</h3>
                  <p className="text-xs text-emerald-100/70 mt-1">
                    Catalog, inventory, pricing, orders, banners, and accounting management.
                  </p>
                </div>
                <Link to="/admin" className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-[#D4AF37] shrink-0">
                  Open →
                </Link>
              </div>
              <div className="p-4 rounded-xl bg-[#0B2419] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                    2. Support Staff Workspace
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">bhumivera.com/support</h3>
                  <p className="text-xs text-emerald-100/70 mt-1">
                    Multi-role desk for Support Agents (L1), Supervisors (L2), and Managers (L3).
                  </p>
                </div>
                <Link to="/support" className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-[#D4AF37] shrink-0">
                  Open →
                </Link>
              </div>
              <div className="p-4 rounded-xl bg-[#0B2419] border border-[#D4AF37]/40">
                <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                  3. SuperAdmin Support Command (Active)
                </span>
                <h3 className="text-sm font-bold text-white mt-1">bhumivera.com/superadminsupport</h3>
                <p className="text-xs text-emerald-100/70 mt-1">
                  All chat statuses (Pending, Waiting for Review, Escalated, Resolved, Closed) are 100% controlled by
                  Support Staff.
                </p>
              </div>
            </div>

            {/* Support-Controlled Status Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { key: 'active', label: 'Active Chats', desc: 'Live conversations in progress' },
                { key: 'pending', label: 'Marked Pending', desc: 'Support awaiting customer info' },
                { key: 'waiting_for_review', label: 'Waiting for Review', desc: 'Queued for L2/QA verification' },
                { key: 'escalated', label: 'Escalated (Urgent)', desc: 'Routed to senior specialist' },
                { key: 'resolved', label: 'Marked Resolved', desc: 'Solved by support executive' },
                { key: 'closed', label: 'Closed & Archived', desc: 'Archived by support team' },
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
              {/* Feature 17: Staff Live Presence & Workload Balancer */}
              <div className="p-5 rounded-xl bg-[#0B2419] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#D4AF37]" />
                    Staff Live Presence & Workload ({agents.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('rbac')}
                    className="text-xs text-[#D4AF37] hover:underline"
                  >
                    Manage Logins →
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                    <div className="font-bold text-purple-300 text-base">{roleCounts.manager}</div>
                    <div className="text-[10px] text-emerald-100/60">Managers (L3)</div>
                  </div>
                  <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                    <div className="font-bold text-amber-300 text-base">{roleCounts.supervisor}</div>
                    <div className="text-[10px] text-emerald-100/60">Supervisors (L2)</div>
                  </div>
                  <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                    <div className="font-bold text-emerald-300 text-base">{roleCounts.agent}</div>
                    <div className="text-[10px] text-emerald-100/60">Agents (L1)</div>
                  </div>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs">
                  {agents.map(ag => {
                    const activeLoad = sessions.filter(
                      s => Number(s.assignedAgentId) === Number(ag.id) && ['active', 'pending', 'escalated'].includes(s.status)
                    ).length;
                    return (
                      <div key={ag.id} className="flex items-center justify-between p-2 rounded-lg bg-black/25 border border-white/5">
                        <div>
                          <span className="font-semibold text-white">{ag.name}</span>{' '}
                          <span className="text-[10px] uppercase text-[#D4AF37]">({ag.role})</span>
                        </div>
                        <span className="text-[11px] text-emerald-200">
                          Load: {activeLoad} / {ag.max_concurrent_chats || 10}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sentiment & CSAT Health */}
              <div className="p-5 rounded-xl bg-[#0B2419] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  Sentiment, CSAT & SLA Health
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
                    <span className="text-emerald-100/60">Open Support Tickets</span>
                    <div className="text-xl font-bold text-sky-300 mt-1">
                      {tickets.filter(t => t.status === 'open').length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Priority Escalations */}
              <div className="p-5 rounded-xl bg-[#0B2419] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    Recent Escalations & Alerts
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('tickets')}
                    className="text-xs text-[#D4AF37] hover:underline"
                  >
                    Triage All →
                  </button>
                </div>
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

        {/* ===================================================================
            TAB 2: OMNICHANNEL CHAT MONITOR, BARGE-IN & BULK OPERATIONS
           =================================================================== */}
        {activeTab === 'monitor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Filterable Live Sessions Queue + Bulk Operations */}
            <div className="lg:col-span-5 bg-[#0B2419] border border-white/10 rounded-xl p-4 flex flex-col h-[780px]">
              <div className="space-y-3 pb-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">All Platform Chat Sessions ({sessions.length})</h3>
                  <button
                    type="button"
                    onClick={fetchCommandCenterData}
                    className="text-xs text-[#D4AF37] hover:underline"
                  >
                    Sync Queue
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

                {/* Feature 6: Bulk Queue Operations Bar */}
                {selectedBulkTokens.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <span className="font-bold text-[#D4AF37]">
                      <CheckSquare className="w-3.5 h-3.5 inline mr-1" />
                      {selectedBulkTokens.length} Selected:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => handleBulkSessionAction({ status: 'pending' })}
                        className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/40"
                      >
                        Bulk Pending
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBulkSessionAction({ status: 'waiting_for_review' })}
                        className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-200 border border-sky-500/40"
                      >
                        Bulk Review
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBulkSessionAction({ status: 'resolved' })}
                        className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/40"
                      >
                        Bulk Resolve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBulkSessionAction({ status: 'closed' })}
                        className="px-2 py-0.5 rounded bg-slate-500/30 text-slate-200 border border-slate-500/40"
                      >
                        Bulk Close
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedBulkTokens([])}
                        className="px-2 py-0.5 rounded bg-black/40 text-white/70"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 mt-3 pr-1">
                {sessions.length === 0 ? (
                  <p className="text-xs text-emerald-100/60 text-center py-12">
                    No chat sessions match the current filter.
                  </p>
                ) : (
                  sessions.map(sess => {
                    const isSelected = selectedSessionToken === sess.sessionToken;
                    const isChecked = selectedBulkTokens.includes(sess.sessionToken);
                    return (
                      <div
                        key={sess.sessionToken}
                        className={`p-3 rounded-xl border transition flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-[#D4AF37]/15 border-[#D4AF37]'
                            : 'bg-black/30 border-white/10 hover:border-white/25'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            const checked = e.target.checked;
                            setSelectedBulkTokens(prev =>
                              checked ? [...prev, sess.sessionToken] : prev.filter(t => t !== sess.sessionToken)
                            );
                          }}
                          className="mt-1 rounded border-white/20"
                          title="Select for bulk status/assignment update"
                        />
                        <button
                          type="button"
                          onClick={() => setSelectedSessionToken(sess.sessionToken)}
                          className="flex-1 text-left min-w-0"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-white truncate">
                              {sess.customerName || sess.guestName || 'Guest Shopper'}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded border shrink-0 ${
                                STATUS_BADGES[sess.status]?.bg || STATUS_BADGES.active.bg
                              }`}
                            >
                              {STATUS_BADGES[sess.status]?.label || sess.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-emerald-100/60 mt-1 flex items-center justify-between">
                            <span className="truncate">{sess.customerEmail || sess.guestEmail || 'Anonymous session'}</span>
                            <span className="font-mono text-[10px] text-[#D4AF37] shrink-0">
                              Priority: {sess.priority}
                            </span>
                          </div>
                          {sess.lastMessagePreview && (
                            <p className="text-xs text-emerald-100/80 mt-2 line-clamp-1 bg-black/25 px-2 py-1 rounded">
                              {sess.lastMessagePreview}
                            </p>
                          )}
                          <div className="mt-2 flex items-center justify-between text-[10px] text-emerald-100/50">
                            <span>
                              Assigned:{' '}
                              {sess.assignedAgentName
                                ? `${sess.assignedAgentName} (${sess.assignedRole})`
                                : 'AI Autonomous'}
                            </span>
                            <span>Msgs: {sess.messageCount || 1}</span>
                          </div>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Live Chat Inspector, Support-Exclusive Status Bar, Barge-In & 5 Instant Executive Actions */}
            <div className="lg:col-span-7 bg-[#0B2419] border border-white/10 rounded-xl p-5 flex flex-col h-[780px]">
              {!selectedSessionDetail?.session ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-emerald-100/60">
                  <Eye className="w-10 h-10 text-[#D4AF37] mb-3 opacity-80" />
                  <h4 className="text-sm font-bold text-white">Select a Chat Session to Monitor or Barge In</h4>
                  <p className="text-xs max-w-md mt-1">
                    All chat statuses (Active, Pending, Waiting for Review, Escalated, Resolved, Closed) are controlled
                    exclusively here and in <code>/support</code>.
                  </p>
                </div>
              ) : (
                <>
                  <div className="pb-3 border-b border-white/10 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          {selectedSessionDetail.customerSummary?.customer?.name ||
                            selectedSessionDetail.session.guestName ||
                            'Guest Customer'}{' '}
                          <span className="text-xs font-normal text-emerald-100/60">
                            (
                            {selectedSessionDetail.customerSummary?.customer?.email ||
                              selectedSessionDetail.session.guestEmail ||
                              'No email'}
                            )
                          </span>
                        </h3>
                        <p className="text-[11px] text-emerald-100/60">
                          Token: <code className="text-[#D4AF37]">{selectedSessionDetail.session.sessionToken}</code>
                          {selectedSessionDetail.customerSummary?.customer && (
                            <>
                              {' · '}Wallet:{' '}
                              <strong>₹{selectedSessionDetail.customerSummary.customer.wallet_balance || 0}</strong>
                              {' · '}Loyalty:{' '}
                              <strong>{selectedSessionDetail.customerSummary.customer.loyalty_points || 0} pts</strong>
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

                    {/* Feature 2: Support-Exclusive Status Lifecycle Controller */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-[#D4AF37] font-semibold mr-1">Support Status Control:</span>
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

                    {/* Features 7, 8, 9, 10, 11: 1-Click Executive Resolution Bar */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <input
                        type="text"
                        value={actionOrderId}
                        onChange={e => setActionOrderId(e.target.value)}
                        placeholder="Order # or ID"
                        className="px-2 py-1 rounded bg-black/40 border border-white/15 text-xs text-white w-28"
                      />
                      <button
                        type="button"
                        onClick={() => handleExecuteQuickAction('cancel_order')}
                        className="px-2 py-1 rounded bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-[11px] text-rose-200"
                      >
                        Cancel Order
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExecuteQuickAction('initiate_return')}
                        className="px-2 py-1 rounded bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-[11px] text-sky-200"
                      >
                        Generate RMA
                      </button>

                      {/* Goodwill Wallet Credit */}
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="10"
                          max="2000"
                          value={goodwillAmount}
                          onChange={e => setGoodwillAmount(e.target.value)}
                          className="px-1.5 py-1 rounded bg-black/40 border border-white/15 text-xs text-white w-14"
                        />
                        <button
                          type="button"
                          onClick={() => handleExecuteQuickAction('goodwill_wallet_credit')}
                          className="px-2 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-[11px] text-emerald-200"
                        >
                          + Wallet ₹
                        </button>
                      </div>

                      {/* Bonus Loyalty Points */}
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="10"
                          max="5000"
                          value={loyaltyPointsBonus}
                          onChange={e => setLoyaltyPointsBonus(e.target.value)}
                          className="px-1.5 py-1 rounded bg-black/40 border border-white/15 text-xs text-white w-14"
                        />
                        <button
                          type="button"
                          onClick={() => handleExecuteQuickAction('award_loyalty_points')}
                          className="px-2 py-1 rounded bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-[11px] text-purple-200"
                        >
                          + Loyalty Pts
                        </button>
                      </div>

                      {/* Personal Apology Coupon */}
                      <button
                        type="button"
                        onClick={() => handleExecuteQuickAction('issue_apology_coupon')}
                        className="px-2 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-[11px] text-amber-200 flex items-center gap-1"
                      >
                        <Gift className="w-3 h-3" /> + {couponDiscountPercent}% Coupon
                      </button>
                    </div>
                  </div>

                  {/* Transcript Stream */}
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

                  {/* Canned Macros Quick-Insert Strip */}
                  {availableMacros.length > 0 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 border-t border-white/10 text-[11px]">
                      <span className="text-emerald-100/60 shrink-0">Macros:</span>
                      {availableMacros.map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setReplyText(m.content || m.text || '')}
                          className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 border border-white/10 text-emerald-100 shrink-0"
                        >
                          {m.title || m.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Barge-In / Whisper Composer */}
                  <form onSubmit={handleSendSessionReply} className="pt-2 border-t border-white/10 space-y-2">
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
                            : 'Type a live reply to the customer…'
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

        {/* ===================================================================
            TAB 3: CUSTOMER 360° DEEP CRM & ACCOUNT CONTROLS (FEATURE 12)
           =================================================================== */}
        {activeTab === 'crm360' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-[#0B2419] border border-white/10 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Customer 360° Directory Search</h3>
              <form onSubmit={handleSearchCustomers} className="flex gap-2">
                <input
                  type="text"
                  value={customerSearch}
                  onChange={e => setCustomerSearch(e.target.value)}
                  placeholder="Name, email, or 10-digit phone…"
                  className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs text-white"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg bg-[#D4AF37] text-[#071510] font-semibold text-xs"
                >
                  Search
                </button>
              </form>

              <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
                {customers.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCustomer(c.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                      selectedCustomerDetail?.customer?.id === c.id
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37]'
                        : 'bg-black/30 border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="font-bold text-white">{c.name}</div>
                    <div className="text-[11px] text-emerald-100/70">{c.email}</div>
                    <div className="text-[10px] text-[#D4AF37] mt-1">
                      Wallet: ₹{c.wallet_balance || 0} · Loyalty: {c.loyalty_points || 0} pts
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 bg-[#0B2419] border border-white/10 rounded-xl p-5 space-y-5">
              {!selectedCustomerDetail?.customer ? (
                <div className="py-20 text-center text-xs text-emerald-100/60">
                  Search and select a customer to inspect their 360° profile, orders, wallet, and account security
                  controls.
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {selectedCustomerDetail.customer.name}{' '}
                        <span className="text-xs text-emerald-100/60">
                          ({selectedCustomerDetail.customer.email} · {selectedCustomerDetail.customer.phone || 'No phone'})
                        </span>
                      </h3>
                      <p className="text-xs text-[#D4AF37] mt-1">
                        Spendable Wallet: ₹{selectedCustomerDetail.customer.wallet_balance || 0} · Loyalty Points:{' '}
                        {selectedCustomerDetail.customer.loyalty_points || 0} pts
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSendPasswordResetLink(selectedCustomerDetail.customer.id)}
                        className="px-3 py-1.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-xs text-sky-200 flex items-center gap-1.5"
                      >
                        <KeyRound className="w-3.5 h-3.5" /> Send 30m Password Reset Link
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleCustomerActive(selectedCustomerDetail.customer)}
                        className={`px-3 py-1.5 rounded-lg border text-xs ${
                          selectedCustomerDetail.customer.is_active
                            ? 'bg-rose-500/15 border-rose-500/30 text-rose-200'
                            : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                        }`}
                      >
                        {selectedCustomerDetail.customer.is_active ? 'Disable Account' : 'Enable Account'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[#D4AF37] uppercase">
                        Order History ({selectedCustomerDetail.orders?.length || 0})
                      </h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {(selectedCustomerDetail.orders || []).map(ord => (
                          <div key={ord.id} className="p-3 rounded-lg bg-black/30 border border-white/10 text-xs">
                            <div className="flex justify-between font-bold text-white">
                              <span>Order #{ord.order_number || ord.id}</span>
                              <span>₹{ord.total}</span>
                            </div>
                            <div className="text-[11px] text-emerald-100/70 mt-0.5">
                              Status: {ord.status.toUpperCase()} · {ord.payment_mode} ({ord.payment_status})
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <form onSubmit={handleSendCustomerDirectEmail} className="space-y-2.5 text-xs">
                      <h4 className="text-xs font-bold text-[#D4AF37] uppercase flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> Send Direct Concierge Email
                      </h4>
                      <input
                        type="text"
                        required
                        value={customerEmailForm.subject}
                        onChange={e => setCustomerEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Email subject…"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white"
                      />
                      <textarea
                        rows={4}
                        required
                        value={customerEmailForm.message}
                        onChange={e => setCustomerEmailForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Write personalized message to customer…"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#071510] font-semibold text-xs"
                      >
                        Dispatch Email
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: UNIFIED SUPPORT TICKETS & ESCALATIONS TRIAGE (FEATURES 13 & 14)
           =================================================================== */}
        {activeTab === 'tickets' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Priority AI Escalations Triage */}
            <div className="lg:col-span-5 bg-[#0B2419] border border-white/10 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                AI Priority Escalations Queue ({(overview?.escalations || []).length})
              </h3>
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {(overview?.escalations || []).map(esc => (
                  <div key={esc.id} className="p-3.5 rounded-xl bg-black/30 border border-rose-500/25 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-300">
                        #{esc.id} · {esc.priority} Priority
                      </span>
                      <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-white/10">{esc.status}</span>
                    </div>
                    <div className="text-white font-semibold">
                      {esc.customer_name || 'Customer'} ({esc.customer_email || 'No email'})
                    </div>
                    <p className="text-[11px] text-emerald-100/75">{esc.reason}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateEscalationStatus(esc.id, 'acknowledged')}
                        className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-200 text-[11px]"
                      >
                        Acknowledge
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateEscalationStatus(esc.id, 'resolved')}
                        className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-200 text-[11px]"
                      >
                        Mark Resolved
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSessionToken(esc.session_token);
                          setActiveTab('monitor');
                        }}
                        className="px-2.5 py-1 rounded bg-[#D4AF37] text-[#071510] font-semibold text-[11px]"
                      >
                        Open Live Chat →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Traditional Support Tickets Inbox */}
            <div className="lg:col-span-7 bg-[#0B2419] border border-white/10 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Support Tickets Inbox ({tickets.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
                  {tickets.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTicketId(t.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs ${
                        selectedTicket?.id === t.id
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37]'
                          : 'bg-black/30 border-white/10'
                      }`}
                    >
                      <div className="flex justify-between font-bold text-white">
                        <span>#{t.id} · {t.subject}</span>
                        <span className="uppercase text-[10px] text-[#D4AF37]">{t.status}</span>
                      </div>
                      <div className="text-[11px] text-emerald-100/70 mt-1">
                        {t.name} ({t.email})
                      </div>
                    </button>
                  ))}
                </div>

                {selectedTicket && (
                  <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-3 text-xs">
                    <div className="font-bold text-white text-sm">
                      Ticket #{selectedTicket.id}: {selectedTicket.subject}
                    </div>
                    <p className="text-emerald-100/80 whitespace-pre-wrap">{selectedTicket.message}</p>
                    <textarea
                      rows={3}
                      value={ticketReply}
                      onChange={e => setTicketReply(e.target.value)}
                      placeholder="Write email reply to customer…"
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {['open', 'in_progress', 'resolved', 'closed'].map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleUpdateTicket(selectedTicket.id, st, ticketReply)}
                          className="px-2.5 py-1.5 rounded bg-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-[#071510] text-[#D4AF37] font-semibold uppercase text-[10px]"
                        >
                          {ticketReply.trim() ? `Send & Set ${st}` : `Set ${st}`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 5: STAFF LOGIN IDs & ROLE ACCESS MATRIX (FEATURES 15 & 16)
           =================================================================== */}
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
              <h3 className="text-base font-bold text-white">Active Support Staff Directory & 16-Permission Matrix</h3>
              <p className="text-xs text-emerald-100/70">
                Click <strong>Configure Access</strong> on any login ID to promote/demote roles, reset passwords, or
                customize individual permissions.
              </p>

              <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
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
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="text-xs font-bold text-[#D4AF37]">
                              16 Granular Permission Switches for @{agent.username}
                            </h4>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="password"
                                value={resetAgentPassword}
                                onChange={e => setResetAgentPassword(e.target.value)}
                                placeholder="New password (8+ chars)"
                                className="px-2.5 py-1 rounded bg-black/50 border border-white/15 text-xs text-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (resetAgentPassword.trim().length >= 8) {
                                    handleUpdateAgent(agent.id, { password: resetAgentPassword.trim() });
                                    setResetAgentPassword('');
                                  }
                                }}
                                className="px-2.5 py-1 rounded bg-[#D4AF37] text-[#071510] font-semibold text-xs"
                              >
                                Reset Password
                              </button>
                            </div>
                          </div>

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

        {/* ===================================================================
            TAB 6: AI FEATURE GOVERNANCE, SLA TIMERS, MACROS & WEBHOOK PING
           =================================================================== */}
        {activeTab === 'features' && features && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-[#0B2419] border border-white/10 rounded-xl p-5 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D4AF37]" />
                Autonomous AI Capabilities & Guardrail Switches
              </h3>

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
                    desc: 'Enables 1-click spendable wallet credits and bonus loyalty points for high-frustration orders.',
                  },
                  {
                    key: 'ai_proactive_triggers_enabled',
                    title: 'Proactive Checkout Linger (>45s) & Rage-Click Popups',
                    desc: 'Automatically offers contextual assistance when a shopper stalls on checkout/tracking or rage-clicks.',
                  },
                  {
                    key: 'allow_customer_csat_rating',
                    title: 'Post-Resolution 1–5★ CSAT Rating Prompt',
                    desc: 'Prompts the customer to rate their support experience after Support marks the chat Resolved.',
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

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveFeatures(features)}
                  className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#071510] font-semibold text-xs"
                >
                  Save Thresholds & SLA Configuration
                </button>

                {/* Feature 19: Multi-Channel Webhook Test Ping */}
                <button
                  type="button"
                  onClick={() => handleTestWebhook('all')}
                  className="px-3.5 py-2 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-xs text-sky-200 flex items-center gap-1.5"
                >
                  <BellRing className="w-3.5 h-3.5" /> Test Telegram / WhatsApp / Email Webhooks
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0B2419] border border-white/10 rounded-xl p-5 space-y-4">
              <h3 className="text-base font-bold text-white">Staff Canned Response Macros</h3>
              <p className="text-xs text-emerald-100/70">
                Create 1-click response templates available to all Agents, Supervisors, and Managers in{' '}
                <code>/support</code> and <code>/superadminsupport</code>.
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
                {availableMacros.map(macro => (
                  <div key={macro.id} className="p-3 rounded-lg bg-black/30 border border-white/10 text-xs">
                    <div className="font-bold text-[#D4AF37]">{macro.title || macro.label}</div>
                    <p className="text-emerald-100/80 mt-1 text-[11px]">{macro.content || macro.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 7: IMMUTABLE AUDIT LOG & 20-FEATURE EXPLAINER DICTIONARY
           =================================================================== */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            {/* Immutable Audit Log */}
            <div className="bg-[#0B2419] border border-white/10 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#D4AF37]" />
                    Immutable Support Executive Audit Trail ({auditLogs.length})
                  </h3>
                  <p className="text-xs text-emerald-100/70">
                    Every status transition, refund, goodwill wallet credit, loyalty bonus, and role change is recorded
                    automatically.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#071510] font-semibold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download CSV Report
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-xs">
                {auditLogs.length === 0 ? (
                  <p className="text-emerald-100/60">No audit events recorded yet in this session.</p>
                ) : (
                  auditLogs.map(log => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg bg-black/30 border border-white/10 flex flex-wrap items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-bold text-[#D4AF37]">[{log.action_type}]</span>{' '}
                        <span className="text-white font-semibold">
                          {log.actor_name} ({log.actor_role})
                        </span>{' '}
                        — <span className="text-emerald-100/80">{log.details}</span>
                      </div>
                      <span className="text-[10px] text-emerald-100/50">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 20-Feature & Button Explainer Dictionary */}
            <div className="bg-[#0B2419] border border-white/10 rounded-xl p-6 space-y-5">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                  Complete Executive Reference
                </span>
                <h2 className="text-xl font-serif font-bold text-white mt-1">
                  20 Customer Support Executive Admin Panel Features — “What Will This Button Do?”
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TWENTY_EXECUTIVE_FEATURES.map(feat => (
                  <div key={feat.no} className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-semibold">
                        Feature #{feat.no} · {feat.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{feat.title}</h3>
                    <p className="text-xs text-emerald-100/80 leading-relaxed">{feat.whatItDoes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
