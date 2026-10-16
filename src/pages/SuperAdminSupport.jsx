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
  Trash2,
  Star,
  Truck,
  Package,
  Lock,
} from 'lucide-react';

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
  const candidates = [localStorage.getItem('adminToken'), localStorage.getItem('supportToken')];
  for (const token of candidates) {
    if (decodeStaffOrAdminJwt(token)) return token;
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
    label: 'Support Executive (L1)',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    description: 'Order/Tracking/Email/Phone search, customer verification, live chat replies, RMA creation, and 1 single-use coupon (max 10% off) per customer. Cannot cancel orders, issue wallet credits, or delete chats.',
  },
  supervisor: {
    label: 'Support Supervisor (L2)',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    description: 'Includes all L1 rights + Order Cancellation, Chat Reassignment, 1 courtesy coupon per customer (max 12% off), and 1 goodwill wallet credit per customer (max ₹150). Cannot delete chats.',
  },
  manager: {
    label: 'Support Manager (L3)',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    description: 'Includes all L2 rights + Staff Login creation, 1 courtesy coupon per customer (max 15% off), and 1 goodwill wallet credit per customer (max ₹250). Cannot delete chats or issue multiple coupons to the same customer.',
  },
  superadmin: {
    label: 'SuperAdmin / Owner',
    badge: 'bg-[#D4AF37]/25 text-[#D4AF37] border-[#D4AF37]/50',
    description: 'Full Owner Authority: Can permanently delete resolved chats, issue multiple coupons without per-customer limits, override credit caps, and govern cryptographic security & Telegram settings.',
  },
};

const PERMISSION_LABELS = {
  can_view_chats: { label: 'View Live Chats', desc: 'Read active and past customer chat transcripts.' },
  can_reply_chats: { label: 'Reply & Private Notes', desc: 'Send live replies or private internal staff notes.' },
  can_close_chats: { label: 'Mark Resolved & Close Chats', desc: 'Mark customer conversations Resolved or Closed.' },
  can_mark_pending_review: { label: 'Mark Pending / Waiting Review', desc: 'Move chats to Pending Customer or Waiting for Review.' },
  can_escalate: { label: 'Escalate Urgent Cases', desc: 'Escalate high-priority cases to L2/L3 and alert Telegram/Email.' },
  can_view_customers: { label: 'Search Orders & Verify Customers', desc: 'Search by Order ID, Tracking ID, Email, or Phone and view order details.' },
  can_send_reset_link: { label: 'Send Password Reset Links', desc: 'Send 1-time 30-minute password reset emails to customers.' },
  can_initiate_returns: { label: 'Create Return RMAs', desc: 'Create return or replacement requests for delivered orders.' },
  can_cancel_orders: { label: 'Cancel Customer Orders', desc: 'Cancel eligible orders and restore inventory stock.' },
  can_adjust_wallet_goodwill: { label: 'Issue Goodwill Wallet & Loyalty Credits', desc: 'Credit wallet balance or loyalty points within strict role limits.' },
  can_reassign_chats: { label: 'Reassign Chats Across Staff', desc: 'Transfer chat ownership to another Executive, Supervisor, or Manager.' },
  can_barge_in_chats: { label: 'Join Active Chats', desc: 'Step in and reply inside another agent’s active conversation.' },
  can_approve_waiting_review: { label: 'Approve Waiting-for-Review Queue', desc: 'Sign off on L2 quality review cases.' },
  can_manage_agents: { label: 'Manage Staff Logins & Roles', desc: 'Create support logins, assign roles, and suspend accounts.' },
  can_manage_ai_features: { label: 'Manage Support Rules & Macros', desc: 'Configure automated support rules, SLA timers, and quick replies.' },
  can_view_analytics: { label: 'View Reports, Reviews & Audit Logs', desc: 'View customer satisfaction reviews, audit trail, and CSV exports.' },
};

const HELP_DICTIONARY = [
  { no: 1, term: 'Dashboard Overview', category: 'Overview', desc: 'Shows live counts of Active, Pending, Waiting for Review, Escalated, Resolved, and Closed chats, plus staff workload and customer satisfaction ratings.' },
  { no: 2, term: 'Order, Tracking, Email & Phone Search', category: 'Verification', desc: 'Searches across all orders by Order ID (#20), 9-digit Order Number, Courier Tracking ID (BHVM...), Email, or Phone Number, and displays the Customer Verification Checklist.' },
  { no: 3, term: 'Delete Resolved Chat (SuperAdmin Only)', category: 'Security', desc: 'Permanently deletes a Resolved or Closed chat transcript. Restricted strictly to SuperAdmin — Agents, Supervisors, and Managers cannot delete chats.' },
  { no: 4, term: 'One-Time Staff Coupon vs. Unlimited SuperAdmin Coupon', category: 'Anti-Fraud', desc: 'Support Staff can issue a courtesy coupon ONLY ONCE per customer (capped at 10%–15% by role) so no agent can abuse discounts. Only SuperAdmin can issue coupons multiple times.' },
  { no: 5, term: 'Goodwill Wallet Credit Guardrail', category: 'Anti-Fraud', desc: 'Agents cannot issue wallet credits (₹0). Supervisors are capped at ₹150 once per customer; Managers at ₹250 once per customer. Every credit is signed with a cryptographic SHA-512 hash.' },
  { no: 6, term: 'Two-Way Telegram Bot (@BhumiveraBot)', category: 'Telegram', desc: 'Customers can message @BhumiveraBot on Telegram and their messages appear here in Live Customer Chats. When you reply here, your reply is sent straight back to their Telegram app.' },
  { no: 7, term: 'Order-Gated Live Agent Rule', category: 'Protection', desc: 'Customers cannot demand a live human agent unless they have placed an order after payment. Visitors without an order chat with the AI Bot or leave a message for Email/App reply.' },
  { no: 8, term: 'Customer Satisfaction Reviews', category: 'Quality', desc: 'When a customer is satisfied with Support’s reply, they can end the chat and leave a 1–5 star rating and written review, which is saved and displayed in the Customer Reviews tab.' },
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
  const [selectedBulkTicketIds, setSelectedBulkTicketIds] = useState([]);
  const [ticketReply, setTicketReply] = useState('');

  // Deep Order / Tracking / Email / Phone Search state
  const [universalQuery, setUniversalQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ orders: [], customers: [] });
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [verifiedOrderIds, setVerifiedOrderIds] = useState({});
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState(null);
  const [customerEmailForm, setCustomerEmailForm] = useState({ subject: '', message: '' });

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
  const [loyaltyPointsBonus, setLoyaltyPointsBonus] = useState('200');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState('15');

  const [newAgent, setNewAgent] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'agent',
    department: 'Customer Care',
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
        showNotice('error', err.response?.data?.message || 'Could not synchronize support data.');
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

  const handleUniversalSearch = async e => {
    e?.preventDefault();
    if (!universalQuery.trim()) return;
    setLoading(true);
    try {
      const res = await api.get(
        `/support/universal-search?q=${encodeURIComponent(universalQuery.trim())}`,
        requestConfig
      );
      const ordersFound = res.data?.orders || [];
      const customersFound = res.data?.customers || [];
      setSearchResults({ orders: ordersFound, customers: customersFound });
      if (ordersFound.length > 0) setSelectedOrderDetail(ordersFound[0]);
      if (customersFound.length > 0) {
        const custRes = await api.get(`/support/customers/${customersFound[0].id}`, requestConfig);
        setSelectedCustomerDetail(custRes.data);
      }
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncTelegram = async () => {
    setLoading(true);
    try {
      const res = await api.post('/support/telegram/sync', {}, requestConfig);
      await fetchCommandCenterData();
      showNotice(
        'success',
        `Telegram (@BhumiveraBot) synced — ${res.data?.synced || 0} new customer message(s) pulled.`
      );
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Telegram sync failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResolvedSession = async sessionTok => {
    try {
      const res = await api.delete(`/support/sessions/${encodeURIComponent(sessionTok)}`, requestConfig);
      if (selectedSessionToken === sessionTok) {
        setSelectedSessionToken(null);
        setSelectedSessionDetail(null);
      }
      await fetchCommandCenterData();
      showNotice('success', res.data?.message || 'Deleted resolved chat session.');
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Only SuperAdmin can delete resolved/closed chats.');
    }
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
        department: 'Customer Care',
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
      showNotice(
        'success',
        isWhisper ? 'Private staff note saved.' : 'Reply delivered to customer (Web, App & Telegram).'
      );
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
          resolutionNote: status === 'resolved' ? 'Marked resolved by Support Center' : undefined,
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
      const refund = action === 'cancel_order' ? res.data?.refundSummary : null;
      if (refund) {
        const amount = Number(refund.gatewayRefundAmount || refund.walletCreditedAmount || 0);
        const formattedAmount = `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (refund.refundDestination === 'ORIGINAL_GATEWAY') {
          const status = String(refund.gatewayStatus || 'INITIATED').replace(/_/g, ' ').toLowerCase();
          const reference = refund.gatewayRefundId ? ` (Refund ID: ${refund.gatewayRefundId})` : '';
          showNotice(
            'success',
            `${res.data?.message || `Order #${res.data?.orderNumber || actionOrderId} cancelled.`} Refund of ${formattedAmount} to the original payment method is ${status}${reference}.`
          );
        } else if (refund.refundDestination === 'WALLET_INSTANT') {
          showNotice(
            'success',
            `${res.data?.message || `Order #${res.data?.orderNumber || actionOrderId} cancelled.`} ${formattedAmount} was credited to the customer's wallet.`
          );
        } else {
          showNotice('success', res.data?.message || `Completed ${action}. No payment refund was due for this order.`);
        }
      } else {
        showNotice('success', res.data?.message || `Completed ${action}.`);
      }
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Action blocked by role security guardrail.');
    }
  };

  const handleSelectCustomer = async customerId => {
    try {
      const res = await api.get(`/support/customers/${customerId}`, requestConfig);
      setSelectedCustomerDetail(res.data);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not load customer profile.');
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
      showNotice('success', res.data?.message || 'Direct email sent to customer.');
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not send email.');
    }
  };

  const handleDeleteSupportTicket = async ticketId => {
    if (!isSuperAdminViewer) {
      showNotice('error', 'Only SuperAdmin can permanently delete support tickets.');
      return;
    }
    if (!window.confirm(`SuperAdmin Action: Permanently delete support ticket #${ticketId}? This cannot be undone.`)) {
      return;
    }
    try {
      const res = await api.delete(`/support/tickets/${ticketId}`, requestConfig);
      setSelectedBulkTicketIds(prev => prev.filter(id => id !== ticketId));
      if (selectedTicketId === ticketId) setSelectedTicketId(null);
      await fetchCommandCenterData();
      showNotice('success', res.data?.message || `Ticket #${ticketId} permanently deleted.`);
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Could not delete support ticket.');
    }
  };

  const handleBulkDeleteSupportTickets = async () => {
    if (!isSuperAdminViewer || !selectedBulkTicketIds.length) return;
    if (
      !window.confirm(
        `SuperAdmin Action: Permanently delete ${selectedBulkTicketIds.length} selected support ticket(s)? This cannot be undone.`
      )
    ) {
      return;
    }
    try {
      const res = await api.post(
        '/support/tickets/bulk-delete',
        { ticketIds: selectedBulkTicketIds },
        requestConfig
      );
      setSelectedBulkTicketIds([]);
      setSelectedTicketId(null);
      await fetchCommandCenterData();
      showNotice('success', res.data?.message || 'Selected support tickets deleted.');
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Bulk ticket delete failed.');
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
      showNotice('success', 'Support rules and settings saved.');
    } catch (err) {
      showNotice('error', err.response?.data?.message || 'Failed to update settings.');
    }
  };

  const handleTestWebhook = async channel => {
    try {
      const res = await api.post('/support/superadmin/test-webhook', { channel }, requestConfig);
      showNotice('success', res.data?.message || `Test alert sent to ${channel}.`);
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
      a.download = `bhumivera_support_report_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showNotice('success', 'Downloaded CSV report.');
    } catch {
      showNotice('error', 'Could not download CSV report.');
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

  if (!authToken) {
    return (
      <div className="min-h-screen bg-[#071510] text-[#FDFBF7] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0B2419] border border-[#D4AF37]/30 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                bhumivera.com/superadminsupport
              </span>
              <h1 className="text-2xl font-serif font-bold text-white">
                SuperAdmin Support Center
              </h1>
            </div>
          </div>

          <p className="text-xs text-emerald-100/75 mb-5 leading-relaxed">
            Sign in with your <strong>Website Admin Email</strong> or <strong>Support Manager ID</strong> to govern live
            chats, order verification, staff permissions, and Telegram support.
          </p>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs">
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-[#D4AF37] text-sm text-white focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2f] text-[#071510] font-bold text-sm transition"
            >
              {loginLoading
                ? 'Signing in…'
                : otpStep
                ? 'Verify OTP & Enter Support Center'
                : 'Sign In to SuperAdmin Support'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-100/60">
            <Link to="/admin/login" className="hover:text-[#D4AF37]">
              → Website Admin (/admin)
            </Link>
            <Link to="/support" className="hover:text-[#D4AF37]">
              → Staff Support Desk (/support)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusBreakdown = overview?.metrics?.statusCounts || {};
  const customerReviews = overview?.customerReviews || [];
  const isSuperAdminViewer =
    overview?.viewer?.role === 'superadmin' || decodeStaffOrAdminJwt(authToken)?.role === 'superadmin';
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
      {/* LUXURY HEADER (NO WHITE SCROLLBARS, NO BUZZWORDS) */}
      <header className="sticky top-0 z-40 bg-[#0B2419]/95 backdrop-blur-md border-b border-[#D4AF37]/25 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold">
                  SuperAdmin Support Center
                </span>
                <span className="text-xs text-emerald-200/70 font-mono">
                  bhumivera.com/superadminsupport
                </span>
              </div>
              <h1 className="text-xl font-serif font-bold text-white">
                Bhumivera SuperAdmin Support & Access Control Center
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setExplainMode(prev => !prev)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                explainMode
                  ? 'bg-[#D4AF37] text-[#071510] border-[#D4AF37]'
                  : 'bg-white/5 text-emerald-100 border-white/15 hover:border-[#D4AF37]/50'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              {explainMode ? '? Help Mode: ON' : '? Help & Terms Guide'}
            </button>

            <button
              type="button"
              onClick={handleSyncTelegram}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-xs text-sky-200 font-semibold"
              title="Sync customer messages from @BhumiveraBot on Telegram"
            >
              <Send className="w-3.5 h-3.5" />
              Sync Telegram (@BhumiveraBot)
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs text-emerald-200 font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              Download CSV Report
            </button>

            <Link
              to="/support"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-emerald-100"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
              Staff Desk (/support)
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-emerald-100"
            >
              <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
              Website Admin (/admin)
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

            <button
              type="button"
              onClick={fetchCommandCenterData}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-100"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs text-rose-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* INLINE HELP MODE BANNER */}
      {explainMode && (
        <div className="bg-[#D4AF37]/15 border-b border-[#D4AF37]/40 px-6 py-3">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>
                <strong>Interactive Help Active:</strong> Hover over any tab or button below to see what it does, or
                click{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('guide')}
                  className="underline font-bold text-[#D4AF37]"
                >
                  7. Security Audit & Help Guide
                </button>{' '}
                for the full glossary.
              </span>
            </div>
            {hoveredExplain && (
              <div className="bg-[#071510] border border-[#D4AF37]/50 px-3 py-1.5 rounded-xl text-[#D4AF37]">
                <strong>? {hoveredExplain.title}:</strong> {hoveredExplain.desc}
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

      {/* NAVIGATION TABS — FLEX-WRAP SO THERE IS NEVER A WHITE HORIZONTAL SCROLLBAR */}
      <div className="bg-[#0B2419]/70 border-b border-white/10 px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center gap-2">
          {[
            {
              id: 'overview',
              label: '1. Dashboard Overview',
              icon: Activity,
              explain: 'Shows live chat counts by status, staff workload, customer satisfaction score, and recent reviews.',
            },
            {
              id: 'monitor',
              label: `2. Live Customer Chats (${sessions.length})`,
              icon: MessageSquare,
              explain: 'Reply to Web & Telegram chats, change chat status, delete resolved chats (SuperAdmin only), or issue coupons/credits.',
            },
            {
              id: 'crm360',
              label: '3. Order, Tracking & Customer Lookup',
              icon: Search,
              explain: 'Search by Order ID, Tracking Number, Email, or Phone to verify the real customer and view full order details.',
            },
            {
              id: 'tickets',
              label: `4. Messages, Tickets & Reviews (${tickets.length + customerReviews.length})`,
              icon: Ticket,
              explain: 'Reply to customer support tickets, handle priority escalations, and read customer satisfaction reviews.',
            },
            {
              id: 'rbac',
              label: `5. Staff Logins & Role Limits (${agents.length})`,
              icon: Users,
              explain: 'Create login IDs for /support, assign Executive (L1), Supervisor (L2), or Manager (L3) roles, and set permissions.',
            },
            {
              id: 'features',
              label: '6. Support Rules, Macros & Telegram Bot',
              icon: Sliders,
              explain: 'Control automated order rules, SLA timers, quick-reply templates, and @BhumiveraBot Telegram settings.',
            },
            {
              id: 'guide',
              label: `7. Security Audit & Help Guide (${auditLogs.length})`,
              icon: BookOpen,
              explain: 'View cryptographic audit logs of every coupon/credit/action and read the plain-English help guide.',
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#071510] border-[#D4AF37] shadow-md'
                    : 'bg-white/5 text-emerald-100/85 border-white/10 hover:bg-white/10'
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
            TAB 1: DASHBOARD OVERVIEW
           =================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Role Benchmark & Anti-Abuse Protection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(ROLE_CONFIG).map(([roleKey, cfg]) => (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => setActiveTab(roleKey === "superadmin" ? "guide" : "rbac")}
                  className="text-left p-4 rounded-2xl bg-[#0B2419] border border-white/10 hover:border-[#D4AF37]/50 transition space-y-1.5"
                >
                  <span className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border font-bold ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                  <p className="text-xs text-emerald-100/75 leading-relaxed pt-1">{cfg.description}</p>
                </button>
              ))}
            </div>

            {/* Chat Status Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { key: 'active', label: 'Active Chats', desc: 'Live conversations in progress' },
                { key: 'pending', label: 'Marked Pending', desc: 'Waiting on customer details' },
                { key: 'waiting_for_review', label: 'Waiting for Review', desc: 'Queued for Supervisor/Manager' },
                { key: 'escalated', label: 'Escalated', desc: 'High-priority specialist queue' },
                { key: 'resolved', label: 'Marked Resolved', desc: 'Solved & ready for review/cleanup' },
                { key: 'closed', label: 'Closed', desc: 'Archived conversations' },
              ].map(card => (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => {
                    setStatusFilter(card.key);
                    setActiveTab('monitor');
                  }}
                  className="text-left p-4 rounded-2xl bg-[#0B2419] border border-white/10 hover:border-[#D4AF37]/50 transition"
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
              {/* Staff Presence */}
              <div className="p-5 rounded-2xl bg-[#0B2419] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#D4AF37]" />
                    Support Staff Workload ({agents.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('rbac')}
                    className="text-xs text-[#D4AF37] hover:underline"
                  >
                    Manage Staff →
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <div className="font-bold text-purple-300 text-base">{roleCounts.manager}</div>
                    <div className="text-[10px] text-emerald-100/60">Managers</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <div className="font-bold text-amber-300 text-base">{roleCounts.supervisor}</div>
                    <div className="text-[10px] text-emerald-100/60">Supervisors</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <div className="font-bold text-emerald-300 text-base">{roleCounts.agent}</div>
                    <div className="text-[10px] text-emerald-100/60">Executives</div>
                  </div>
                </div>
              </div>

              {/* Customer Satisfaction & Telegram Bot Status */}
              <div className="p-5 rounded-2xl bg-[#0B2419] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  Customer Satisfaction & Telegram Bot
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab("tickets")}
                    className="text-left p-3 rounded-xl bg-black/30 border border-white/5 hover:border-[#D4AF37]/40 transition"
                  >
                    <span className="text-emerald-100/60">Customer Rating Avg</span>
                    <div className="text-xl font-bold text-[#D4AF37] mt-1">
                      {overview?.metrics?.averageCsat ? `${overview.metrics.averageCsat} / 5.0 ★` : '4.9 ★'}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("features")}
                    className="text-left p-3 rounded-xl bg-black/30 border border-white/5 hover:border-sky-400/40 transition"
                  >
                    <span className="text-emerald-100/60">Telegram Bot Bridge</span>
                    <div className="text-sm font-bold text-sky-300 mt-1.5">@BhumiveraBot Active →</div>
                  </button>
                </div>
              </div>

              {/* Latest Customer Reviews */}
              <div className="p-5 rounded-2xl bg-[#0B2419] border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#D4AF37]" />
                  Recent Customer Support Reviews ({customerReviews.length})
                </h3>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1 text-xs">
                  {customerReviews.length === 0 ? (
                    <p className="text-emerald-100/60">
                      Customer reviews submitted when ending chats will appear here.
                    </p>
                  ) : (
                    customerReviews.slice(0, 6).map(rev => (
                      <div key={rev.sessionToken} className="p-2.5 rounded-xl bg-black/30 border border-white/10">
                        <div className="flex items-center justify-between font-bold text-[#D4AF37]">
                          <span>{rev.customerName}</span>
                          <span>{'★'.repeat(rev.rating)} ({rev.rating}/5)</span>
                        </div>
                        <p className="text-emerald-100/85 text-[11px] mt-0.5">"{rev.feedback}"</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: LIVE CUSTOMER CHATS (WITH SUPERADMIN DELETE & UNLIMITED COUPONS)
           =================================================================== */}
        {activeTab === 'monitor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-[#0B2419] border border-white/10 rounded-2xl p-4 flex flex-col h-[780px]">
              <div className="space-y-3 pb-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">All Customer Chats ({sessions.length})</h3>
                  <button
                    type="button"
                    onClick={fetchCommandCenterData}
                    className="text-xs text-[#D4AF37] hover:underline"
                  >
                    Refresh Queue
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Filter by customer name, email, phone, or session token…"
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {['all', 'active', 'pending', 'waiting_for_review', 'escalated', 'resolved', 'closed'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                        statusFilter === st
                          ? 'bg-[#D4AF37] text-[#071510] border-[#D4AF37] font-bold'
                          : 'bg-black/30 text-emerald-100/70 border-white/10'
                      }`}
                    >
                      {st === 'all' ? 'All Statuses' : STATUS_BADGES[st]?.label || st}
                    </button>
                  ))}
                </div>

                {selectedBulkTokens.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex flex-wrap items-center justify-between gap-2 text-[11px]">
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
                        Mark Pending
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBulkSessionAction({ status: 'resolved' })}
                        className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/40"
                      >
                        Mark Resolved
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBulkSessionAction({ status: 'closed' })}
                        className="px-2 py-0.5 rounded bg-slate-500/30 text-slate-200 border border-slate-500/40"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 mt-3 pr-1">
                {sessions.map(sess => {
                  const isSelected = selectedSessionToken === sess.sessionToken;
                  const isChecked = selectedBulkTokens.includes(sess.sessionToken);
                  const canDelete = isSuperAdminViewer && ['resolved', 'closed'].includes(sess.status);
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
                          <span className="truncate">{sess.customerEmail || sess.guestEmail || 'Anonymous'}</span>
                          {sess.csatRating && (
                            <span className="text-[#D4AF37] font-bold">★ {sess.csatRating}/5</span>
                          )}
                        </div>
                        {sess.lastMessagePreview && (
                          <p className="text-xs text-emerald-100/80 mt-2 line-clamp-1 bg-black/25 px-2 py-1 rounded">
                            {sess.lastMessagePreview}
                          </p>
                        )}
                      </button>
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDeleteResolvedSession(sess.sessionToken)}
                          title="SuperAdmin Only: Permanently delete this resolved/closed chat"
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 text-rose-300 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#0B2419] border border-white/10 rounded-2xl p-5 flex flex-col h-[780px]">
              {!selectedSessionDetail?.session ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-emerald-100/60">
                  <Eye className="w-10 h-10 text-[#D4AF37] mb-3 opacity-80" />
                  <h4 className="text-sm font-bold text-white">Select a Chat Session to View or Reply</h4>
                  <p className="text-xs max-w-md mt-1">
                    Reply to Web, Mobile App, and Telegram (@BhumiveraBot) conversations, transition chat statuses, or
                    delete resolved chats (SuperAdmin only).
                  </p>
                </div>
              ) : (
                <>
                  <div className="pb-3 border-b border-white/10 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          {selectedSessionDetail.customerSummary?.account?.name ||
                            selectedSessionDetail.session.guestName ||
                            'Guest Customer'}{' '}
                          <span className="text-xs font-normal text-emerald-100/60">
                            (
                            {selectedSessionDetail.customerSummary?.account?.email ||
                              selectedSessionDetail.session.guestEmail ||
                              'No email'}
                            )
                          </span>
                        </h3>
                        {selectedSessionDetail.session.csatRating && (
                          <p className="text-xs text-[#D4AF37] font-bold mt-0.5">
                            ★ Customer Review: {selectedSessionDetail.session.csatRating}/5 — "
                            {selectedSessionDetail.session.csatFeedback || 'Satisfied'}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={selectedSessionDetail.session.assignedAgentId || ''}
                          onChange={e =>
                            handleSessionStatusChange(
                              selectedSessionDetail.session.sessionToken,
                              selectedSessionDetail.session.status,
                              e.target.value ? Number(e.target.value) : null
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-black/50 border border-white/15 text-xs text-white"
                        >
                          <option value="">AI Assistant (Unassigned)</option>
                          {agents.map(ag => (
                            <option key={ag.id} value={ag.id}>
                              {ag.name} ({ag.role.toUpperCase()})
                            </option>
                          ))}
                        </select>

                        {isSuperAdminViewer &&
                          ['resolved', 'closed'].includes(selectedSessionDetail.session.status) && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteResolvedSession(selectedSessionDetail.session.sessionToken)
                              }
                              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete Chat
                            </button>
                          )}
                      </div>
                    </div>

                    {/* Support-Exclusive Status Bar */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-[#D4AF37] font-bold mr-1">Chat Status:</span>
                      {[
                        { id: 'active', label: 'Active' },
                        { id: 'pending', label: 'Pending' },
                        { id: 'waiting_for_review', label: 'Waiting for Review' },
                        { id: 'escalated', label: 'Escalated' },
                        { id: 'resolved', label: 'Resolved' },
                        { id: 'closed', label: 'Closed' },
                      ].map(st => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() =>
                            handleSessionStatusChange(selectedSessionDetail.session.sessionToken, st.id)
                          }
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                            selectedSessionDetail.session.status === st.id
                              ? 'bg-[#D4AF37] text-[#071510] border-[#D4AF37] font-bold'
                              : 'bg-black/30 text-emerald-100/80 border-white/15'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>

                    {/* SuperAdmin Unlimited Coupon & Order Actions Bar */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <input
                        type="text"
                        value={actionOrderId}
                        onChange={e => setActionOrderId(e.target.value)}
                        placeholder="Order # or ID"
                        className="px-2 py-1 rounded-lg bg-black/40 border border-white/15 text-xs text-white w-28"
                      />
                      <button
                        type="button"
                        disabled={!isSuperAdminViewer} onClick={() => handleExecuteQuickAction('cancel_order')}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-[11px] text-rose-200"
                      >
                        Cancel Order
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExecuteQuickAction('initiate_return')}
                        className="px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-500/30 text-[11px] text-sky-200"
                      >
                        Create RMA
                      </button>

                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="10"
                          max="2000"
                          value={goodwillAmount}
                          onChange={e => setGoodwillAmount(e.target.value)}
                          className="px-1.5 py-1 rounded-lg bg-black/40 border border-white/15 text-xs text-white w-16"
                        />
                        <button
                          type="button"
                          onClick={() => handleExecuteQuickAction('goodwill_wallet_credit')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[11px] text-emerald-200"
                        >
                          + Wallet ₹
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="5"
                          max="50"
                          value={couponDiscountPercent}
                          onChange={e => setCouponDiscountPercent(e.target.value)}
                          className="px-1.5 py-1 rounded-lg bg-black/40 border border-white/15 text-xs text-white w-14"
                        />
                        <button
                          type="button"
                          onClick={() => handleExecuteQuickAction('issue_apology_coupon')}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-200 flex items-center gap-1"
                          title="SuperAdmin can issue coupons multiple times; Support Staff are restricted to once per customer"
                        >
                          <Gift className="w-3 h-3" /> + {couponDiscountPercent}% Coupon (SuperAdmin Unlimited)
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
                                ? `🔒 PRIVATE STAFF NOTE (${msg.senderName || 'Supervisor'})`
                                : isUser
                                ? 'CUSTOMER'
                                : msg.senderName || 'SUPPORT'}
                            </span>
                            <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                          </div>
                          <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                        </div>
                      );
                    })}
                  </div>

                  {availableMacros.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 py-1.5 border-t border-white/10 text-[11px]">
                      <span className="text-emerald-100/60">Quick Replies:</span>
                      {availableMacros.map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setReplyText(m.content || m.text || '')}
                          className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 border border-white/10 text-emerald-100"
                        >
                          {m.title || m.label}
                        </button>
                      ))}
                    </div>
                  )}

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
                          🔒 Private Internal Note (Hidden from Customer)
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
                            ? 'Write a private note visible only to support staff…'
                            : 'Type reply to customer (delivers to Web, Mobile App & Telegram)…'
                        }
                        className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2f] text-[#071510] font-bold text-xs flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {isWhisper ? 'Save Note' : 'Send Reply'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 3: ORDER, TRACKING, EMAIL & PHONE LOOKUP + CUSTOMER AUTHENTICATOR
           =================================================================== */}
        {activeTab === 'crm360' && (
          <div className="space-y-6">
            <form
              onSubmit={handleUniversalSearch}
              className="p-5 rounded-2xl bg-[#0B2419] border border-[#D4AF37]/30 flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                value={universalQuery}
                onChange={e => setUniversalQuery(e.target.value)}
                placeholder="Search by Order ID (#20 / 815899599), Tracking ID (BHVM...), Customer Email, or Phone Number…"
                className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-[#071510] font-bold text-xs"
              >
                Search Orders & Customers
              </button>
            </form>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 bg-[#0B2419] border border-white/10 rounded-2xl p-4 space-y-3">
                {searchResults.customers?.length > 0 && (
                  <div className="space-y-2 pb-3 border-b border-white/10">
                    <h3 className="text-xs font-bold text-[#D4AF37] uppercase">
                      Matching Customer Accounts ({searchResults.customers.length})
                    </h3>
                    {searchResults.customers.map(cust => (
                      <div key={cust.id} className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate">{cust.name}</div>
                          <div className="text-[10px] text-emerald-100/70 truncate">{cust.email} · {cust.phone || "No phone"}</div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleSelectCustomer(cust.id)}
                            className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] text-white font-semibold"
                          >
                            Dossier
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendPasswordResetLink(cust.id)}
                            className="px-2 py-1 rounded bg-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-[#071510] text-[10px] text-[#D4AF37] font-bold"
                            title="Send Password Reset Link"
                          >
                            Reset Link
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <h3 className="text-sm font-bold text-white">
                  Matching Orders ({searchResults.orders.length})
                </h3>
                <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
                  {searchResults.orders.map(ord => (
                    <button
                      key={ord.id}
                      type="button"
                      onClick={() => setSelectedOrderDetail(ord)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs ${
                        selectedOrderDetail?.id === ord.id
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37]'
                          : 'bg-black/30 border-white/10'
                      }`}
                    >
                      <div className="flex justify-between font-bold text-white">
                        <span>Order #{ord.orderNumber} (#{ord.id})</span>
                        <span className="text-[#D4AF37]">₹{ord.total}</span>
                      </div>
                      <div className="text-[11px] text-emerald-100/75 mt-1">
                        {ord.customerName} · {ord.customerEmail || ord.customerPhone}
                      </div>
                      <div className="text-[10px] text-emerald-300 mt-1">
                        Status: {ord.status.toUpperCase()} · Tracking: {ord.trackingNumber || 'Pending'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8 bg-[#0B2419] border border-white/10 rounded-2xl p-6 space-y-5">
                {selectedOrderDetail ? (
                  <>
                    <div className="p-4 rounded-2xl bg-black/40 border border-[#D4AF37]/40 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold">
                            Real Customer Authentication Checklist
                          </span>
                          <h4 className="text-sm font-bold text-white">
                            Verify Customer Identity for Order #{selectedOrderDetail.orderNumber}
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
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold ${
                            verifiedOrderIds[selectedOrderDetail.id]
                              ? 'bg-emerald-500 text-[#071510]'
                              : 'bg-[#D4AF37] text-[#071510]'
                          }`}
                        >
                          {verifiedOrderIds[selectedOrderDetail.id]
                            ? '✓ Customer Verified'
                            : 'Verify Customer Identity'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                          <span className="text-[10px] text-emerald-100/60 block">Customer Name</span>
                          <strong className="text-white">
                            {selectedOrderDetail.verificationChecklist?.registeredName}
                          </strong>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                          <span className="text-[10px] text-emerald-100/60 block">Customer Email</span>
                          <strong className="text-white">
                            {selectedOrderDetail.verificationChecklist?.registeredEmail}
                          </strong>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                          <span className="text-[10px] text-emerald-100/60 block">Customer Phone</span>
                          <strong className="text-white">
                            {selectedOrderDetail.verificationChecklist?.registeredPhone}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-1.5">
                        <div className="font-bold text-[#D4AF37] uppercase text-[10px]">
                          Order & Tracking Summary
                        </div>
                        <div>Order Number: <strong>#{selectedOrderDetail.orderNumber}</strong> (#{selectedOrderDetail.id})</div>
                        <div>Status: <strong className="uppercase text-emerald-300">{selectedOrderDetail.status}</strong></div>
                        <div>Tracking ID: <strong>{selectedOrderDetail.trackingNumber || 'Pending'}</strong></div>
                        <div>Courier: <strong>{selectedOrderDetail.courier || 'Standard'}</strong></div>
                      </div>
                      <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-1.5">
                        <div className="font-bold text-[#D4AF37] uppercase text-[10px]">
                          Payment & Financials
                        </div>
                        <div>Payment Mode: <strong>{selectedOrderDetail.paymentMode}</strong> ({selectedOrderDetail.paymentStatus})</div>
                        <div>Subtotal: ₹{selectedOrderDetail.subtotal} · Discount: -₹{selectedOrderDetail.discount}</div>
                        <div className="text-sm font-bold text-[#D4AF37]">Total Paid: ₹{selectedOrderDetail.total}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[#D4AF37] uppercase">
                        Full Order Items ({selectedOrderDetail.items?.length || 0})
                      </h4>
                      <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-black/30">
                        {(selectedOrderDetail.items || []).map(it => (
                          <div key={it.id} className="p-3 flex justify-between text-xs">
                            <div>
                              <div className="font-bold text-white">{it.name}</div>
                              <div className="text-[11px] text-emerald-100/60">
                                SKU: {it.sku || 'N/A'} · Qty: {it.quantity} × ₹{it.price}
                              </div>
                            </div>
                            <div className="font-bold text-[#D4AF37]">
                              ₹{(Number(it.price || 0) * Number(it.quantity || 1)).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-emerald-100/60 py-16 text-center">
                    Search by Order ID, Tracking Number, Email, or Phone above to inspect full order details.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: MESSAGES, TICKETS & CUSTOMER REVIEWS
           =================================================================== */}
        {activeTab === 'tickets' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-[#0B2419] border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-[#D4AF37]" />
                Saved Customer Satisfaction Reviews ({customerReviews.length})
              </h3>
              <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1 text-xs">
                {customerReviews.map(rev => (
                  <div key={rev.sessionToken} className="p-3.5 rounded-xl bg-black/30 border border-[#D4AF37]/30 space-y-1">
                    <div className="flex justify-between font-bold text-[#D4AF37]">
                      <span>{rev.customerName}</span>
                      <span>{'★'.repeat(rev.rating)} ({rev.rating}/5)</span>
                    </div>
                    <p className="text-white">"{rev.feedback}"</p>
                    <div className="text-[10px] text-emerald-100/60">
                      Handled by: {rev.assignedAgentName} · {new Date(rev.updatedAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#0B2419] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white">Support Tickets & Async Messages ({tickets.length})</h3>
                {isSuperAdminViewer && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedBulkTicketIds(prev =>
                          prev.length === tickets.length ? [] : tickets.map(t => t.id)
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] text-emerald-100"
                    >
                      {selectedBulkTicketIds.length === tickets.length && tickets.length > 0
                        ? 'Unselect All'
                        : 'Select All Tickets'}
                    </button>
                    {selectedBulkTicketIds.length > 0 && (
                      <button
                        type="button"
                        onClick={handleBulkDeleteSupportTickets}
                        className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/40 text-[11px] font-bold text-rose-200 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedBulkTicketIds.length})
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                  {tickets.map(t => {
                    const isChecked = selectedBulkTicketIds.includes(t.id);
                    return (
                      <div
                        key={t.id}
                        className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                          selectedTicket?.id === t.id
                            ? 'bg-[#D4AF37]/15 border-[#D4AF37]'
                            : 'bg-black/30 border-white/10'
                        }`}
                      >
                        {isSuperAdminViewer && (
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={e =>
                              setSelectedBulkTicketIds(prev =>
                                e.target.checked ? [...prev, t.id] : prev.filter(id => id !== t.id)
                              )
                            }
                            className="mt-1 rounded border-white/20"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedTicketId(t.id)}
                          className="flex-1 text-left min-w-0"
                        >
                          <div className="flex justify-between font-bold text-white gap-2">
                            <span className="truncate">#{t.id} · {t.subject}</span>
                            <span className="uppercase text-[10px] text-[#D4AF37] shrink-0">{t.status}</span>
                          </div>
                          <div className="text-[11px] text-emerald-100/70 mt-1 truncate">
                            {t.name} ({t.email})
                          </div>
                        </button>
                        {isSuperAdminViewer && (
                          <button
                            type="button"
                            onClick={() => handleDeleteSupportTicket(t.id)}
                            title="SuperAdmin Only: Permanently delete this support ticket"
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 text-rose-300 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {selectedTicket && (
                  <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-3 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-white text-sm">
                        Ticket #{selectedTicket.id}: {selectedTicket.subject}
                      </div>
                      {isSuperAdminViewer && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSupportTicket(selectedTicket.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/40 text-[11px] font-bold text-rose-200 flex items-center gap-1 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Ticket
                        </button>
                      )}
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
            TAB 5: STAFF LOGINS & ROLE PERMISSIONS MATRIX
           =================================================================== */}
        {activeTab === 'rbac' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-[#0B2419] border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-base font-bold text-white">
                Create Support Staff Login ID (bhumivera.com/support)
              </h3>
              <form onSubmit={handleCreateAgent} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-emerald-100/80 mb-1">Login User ID (username)</label>
                  <input
                    type="text"
                    required
                    value={newAgent.username}
                    onChange={e => setNewAgent(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="e.g., agent.rahul or sup.ananya"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
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
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-emerald-100/80 mb-1">Assign Role</label>
                    <select
                      value={newAgent.role}
                      onChange={e => setNewAgent(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-[#D4AF37]/40 text-white font-semibold"
                    >
                      <option value="agent">Executive (L1 — Max 10% Coupon Once)</option>
                      <option value="supervisor">Supervisor (L2 — Max 12% Coupon / ₹150 Credit Once)</option>
                      <option value="manager">Manager (L3 — Max 15% Coupon / ₹250 Credit Once)</option>
                    </select>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-[11px] text-emerald-100/80">
                  <strong>{ROLE_CONFIG[newAgent.role]?.label}:</strong> {ROLE_CONFIG[newAgent.role]?.description}
                </div>
                <div>
                  <label className="block text-emerald-100/80 mb-1">Password (min 8 chars)</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newAgent.password}
                    onChange={e => setNewAgent(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-[#071510] font-bold flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create {newAgent.role.toUpperCase()} Login ID
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-[#0B2419] border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-base font-bold text-white">Staff Directory & Permission Controls</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {agents.map(agent => {
                  const isEditing = editingAgent?.id === agent.id;
                  return (
                    <div key={agent.id} className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-sm font-bold text-white">{agent.name}</span>{' '}
                          <code className="text-xs text-[#D4AF37]">@{agent.username}</code>{' '}
                          <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-white/10 text-emerald-300 font-bold">
                            {agent.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={agent.role}
                            onChange={e => handleUpdateAgent(agent.id, { role: e.target.value })}
                            className="px-2.5 py-1 rounded bg-black/50 border border-white/15 text-xs text-white"
                          >
                            <option value="agent">Role: Executive (L1)</option>
                            <option value="supervisor">Role: Supervisor (L2)</option>
                            <option value="manager">Role: Manager (L3)</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => setEditingAgent(isEditing ? null : agent)}
                            className="px-3 py-1 rounded bg-white/10 text-xs text-white"
                          >
                            {isEditing ? 'Hide Permissions' : 'Edit Permissions'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateAgent(agent.id, { is_active: !agent.is_active })}
                            className="px-2.5 py-1 rounded bg-rose-500/15 text-rose-200 text-xs"
                          >
                            {agent.is_active ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/10">
                          {Object.entries(PERMISSION_LABELS).map(([permKey, meta]) => {
                            const enabled = Boolean(agent.permissions?.[permKey]);
                            return (
                              <button
                                key={permKey}
                                type="button"
                                onClick={() =>
                                  handleUpdateAgent(agent.id, {
                                    permissions: { ...(agent.permissions || {}), [permKey]: !enabled },
                                  })
                                }
                                className={`p-2.5 rounded-lg border text-left flex justify-between gap-2 ${
                                  enabled
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                                    : 'bg-black/20 border-white/5 text-white/50'
                                }`}
                              >
                                <div>
                                  <div className="text-xs font-semibold">{meta.label}</div>
                                  <div className="text-[10px] opacity-75">{meta.desc}</div>
                                </div>
                                <span className="text-[10px] font-bold">{enabled ? 'ON' : 'OFF'}</span>
                              </button>
                            );
                          })}
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
            TAB 6: SUPPORT RULES, MACROS & TELEGRAM BOT
           =================================================================== */}
        {activeTab === 'features' && features && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-[#0B2419] border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-base font-bold text-white">Support Automation Rules & Telegram Bot (@BhumiveraBot)</h3>
              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-400/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-sky-200">Live Telegram Bot Connected: t.me/BhumiveraBot</div>
                  <p className="text-[11px] text-emerald-100/75 mt-0.5">
                    Customers can message @BhumiveraBot and receive live replies directly from this panel.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSyncTelegram}
                  className="px-3.5 py-2 rounded-xl bg-sky-400 text-[#071510] font-bold text-xs"
                >
                  Sync Telegram Messages Now
                </button>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    key: 'ai_support_enabled',
                    title: 'Enable AI Support Assistant',
                    desc: 'Answers product, order tracking, and shipping questions automatically.',
                  },
                  {
                    key: 'ai_auto_cancel_enabled',
                    title: 'Allow Self-Service Order Cancellation (Pending/Confirmed Orders)',
                    desc: 'Lets customers cancel eligible unshipped orders and restores product stock.',
                  },
                  {
                    key: 'ai_auto_return_rma_enabled',
                    title: 'Allow Self-Service Return RMA Creation (Delivered Orders)',
                    desc: 'Lets customers submit return/replacement requests within the return window.',
                  },
                  {
                    key: 'telegram_alerts_enabled',
                    title: 'Enable Two-Way Telegram Support & Alerts (@BhumiveraBot)',
                    desc: 'Routes customer Telegram messages and priority alerts through @BhumiveraBot.',
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                          isOn ? 'bg-emerald-500 text-[#071510]' : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {isOn ? 'ENABLED' : 'DISABLED'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0B2419] border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-base font-bold text-white">Quick-Reply Templates (Macros)</h3>
              <form onSubmit={handleAddMacro} className="space-y-2.5 text-xs">
                <input
                  type="text"
                  required
                  value={newMacro.title}
                  onChange={e => setNewMacro(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Template Name (e.g., Dispatch Update)"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
                <textarea
                  rows={3}
                  required
                  value={newMacro.content}
                  onChange={e => setNewMacro(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Template message…"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#071510] font-bold text-xs"
                  >
                    + Save Quick Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTestWebhook("telegram")}
                    className="px-3.5 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 text-sky-200 font-bold text-xs"
                  >
                    Test @BhumiveraBot Alert
                  </button>
                </div>
              </form>

              <div className="space-y-2 pt-3 border-t border-white/10 max-h-64 overflow-y-auto pr-1">
                {availableMacros.map(m => (
                  <div key={m.id} className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-start justify-between gap-2 text-xs">
                    <div>
                      <div className="font-bold text-[#D4AF37]">{m.title || m.label}</div>
                      <p className="text-emerald-100/80 text-[11px] mt-0.5">{m.content || m.text}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const filtered = availableMacros.filter(item => item.id !== m.id);
                        handleSaveFeatures({ ...features, macros: filtered });
                      }}
                      className="p-1.5 rounded bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 shrink-0"
                      title="Delete Macro"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 7: 512-BIT SECURITY AUDIT LOG & PLAIN-ENGLISH HELP GUIDE
           =================================================================== */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <div className="bg-[#0B2419] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#D4AF37]" />
                Cryptographic Security & Action Audit Log ({auditLogs.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-xs">
                {auditLogs.map(log => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-black/30 border border-white/10 flex flex-wrap items-center justify-between gap-2"
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
                ))}
              </div>
            </div>

            <div className="bg-[#0B2419] border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-serif font-bold text-white">
                ? Help Guide — What Each Term & Control Does
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {HELP_DICTIONARY.map(item => (
                  <div key={item.no} className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-white pt-1">? {item.term}</h3>
                    <p className="text-xs text-emerald-100/80 leading-relaxed">{item.desc}</p>
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
