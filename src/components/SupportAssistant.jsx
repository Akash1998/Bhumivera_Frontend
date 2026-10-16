import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Minimize2,
  Maximize2,
  Send,
  Sparkles,
  Package,
  Truck,
  RotateCcw,
  ShieldAlert,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Paperclip,
  CheckCircle2,
  Clock,
  PhoneCall,
  RefreshCw,
  Copy,
  Check,
  ChevronRight,
  Image as ImageIcon,
  Star,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api, { aiSupport as aiSupportApi, BASE_URL } from '../services/api';
import { normalizeTelegramBotUrl } from '../utils/telegramUrl';
import {
  AI_COPILOT_ADD_CART_RETRY_EVENT,
  AI_COPILOT_EVENT,
  analyzePasswordForAiGuide,
} from '../utils/aiCopilotBus';
import { resolveClientSideConciergeFallback } from '../utils/bhumiveraAiConciergeFallback';

const STORAGE_KEY = 'bhumivera_client_concierge_state_v3';
const SESSION_TOKEN_KEY = 'bhumivera_client_concierge_token_v3';
const PROACTIVE_TRIGGERED_KEY = 'bhumivera_concierge_proactive_v3';
const LINGER_THRESHOLD_MS = 45000;

const PUBLIC_GENERAL_CHIPS = [
  { id: 'know_sb_fw', label: 'Know More: Sea Buckthorn Face Wash', prompt: 'Tell me about Sea Buckthorn Face Wash and its key ingredients', category: 'product_discovery' },
  { id: 'ing_niacinamide', label: 'Ingredient: Niacinamide', prompt: 'Tell me about Niacinamide in Sea Buckthorn Face Wash', category: 'ingredient_discovery' },
  { id: 'how_to_join', label: 'Brand Ambassador Program', prompt: 'How do I join the Bhumivera Brand Ambassador Program?', category: 'ambassador' },
  { id: 'usage_time', label: 'How & What Time to Use Face Wash', prompt: 'How do I really use Sea Buckthorn Face Wash step-by-step and what time of day should I use it?', category: 'usage_and_timing' },
  { id: 'shipping_policy', label: 'Shipping & Delivery', prompt: 'What are your shipping charges and delivery timelines?', category: 'policy' },
  { id: 'verify_order', label: 'Order Support & Verification', prompt: '__OPEN_VERIFICATION_FLOW__', category: 'verification' },
];

const VERIFIED_BUYER_CHIPS = [
  { id: 'track_order', label: 'Track My Order', prompt: 'Where is my latest order?' },
  { id: 'initiate_return', label: 'Return or Replacement', prompt: 'I want to initiate a return or replacement for my delivered order.' },
  { id: 'order_assistance', label: 'Order Modification / Escalation', prompt: '__OPEN_VERIFICATION_FLOW__' },
  { id: 'wallet_loyalty', label: 'Wallet & Privilege Tier', prompt: 'What is my current wallet balance and loyalty points?' },
  { id: 'active_coupons', label: 'Available Offers', prompt: 'Show me active coupons and offers for my account.' },
];

const CALLBACK_SLOTS = [
  'Morning (10 AM–1 PM)',
  'Afternoon (1 PM–5 PM)',
  'Evening (5 PM–8 PM)',
];

const ORDER_STEPS = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

const STATUS_META = {
  active: {
    label: 'Concierge Online',
    badgeClass: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
  },
  pending: {
    label: 'Awaiting Details',
    badgeClass: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
  },
  waiting_for_review: {
    label: 'Specialist Review',
    badgeClass: 'bg-sky-500/20 text-sky-200 border-sky-400/40',
  },
  escalated: {
    label: 'Specialist Assigned',
    badgeClass: 'bg-rose-500/20 text-rose-200 border-rose-400/40',
  },
  resolved: {
    label: 'Resolved',
    badgeClass: 'bg-teal-500/20 text-teal-200 border-teal-400/40',
  },
  closed: {
    label: 'Archived',
    badgeClass: 'bg-stone-500/20 text-stone-200 border-stone-400/40',
  },
};

function playSupportChime(enabled = true) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.14);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.29);
    setTimeout(() => ctx.close().catch(() => {}), 400);
  } catch {}
}

function FormattedMarkdown({ content, isDark, onNavigate }) {
  const renderInline = (text, keyPrefix) => {
    if (!text) return null;
    const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
    const parts = String(text).split(pattern);
    return parts.map((part, idx) => {
      const key = `${keyPrefix}-${idx}`;
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={key} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={key}
            className={`px-1.5 py-0.5 rounded font-mono text-[11px] ${
              isDark ? 'bg-white/10 text-[#D4AF37]' : 'bg-[#0B2419]/10 text-[#0B2419]'
            }`}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (match) {
          const [, label, href] = match;
          const isInternal = href.startsWith('/');
          return (
            <a
              key={key}
              href={href}
              onClick={e => {
                if (isInternal && onNavigate) {
                  e.preventDefault();
                  onNavigate(href);
                }
              }}
              target={isInternal ? undefined : '_blank'}
              rel={isInternal ? undefined : 'noopener noreferrer'}
              className="underline underline-offset-2 font-medium text-[#D4AF37] hover:opacity-80"
            >
              {label}
            </a>
          );
        }
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={key} className="italic">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const blocks = String(content || '').split(/\n{2,}/);
  return (
    <div className="space-y-2 text-[13px] leading-relaxed">
      {blocks.map((block, bIdx) => {
        const lines = block.split('\n');
        const isList = lines.every(l => /^\s*([-•*]|\d+\.)\s+/.test(l));
        if (isList) {
          return (
            <ul key={bIdx} className="space-y-1 pl-4 list-disc">
              {lines.map((line, lIdx) => (
                <li key={lIdx}>{renderInline(line.replace(/^\s*([-•*]|\d+\.)\s+/, ''), `${bIdx}-${lIdx}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bIdx} className="whitespace-pre-wrap break-words">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {renderInline(line, `${bIdx}-${lIdx}`)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function ChatOrderCard({ order, isDark, onQuickPrompt, onRequestOrderIntervention }) {
  const [copied, setCopied] = useState(false);
  const status = String(order.status || 'pending').toLowerCase();
  const isTerminal = ['cancelled', 'returned'].includes(status);
  const stepIndex = Math.max(0, Math.min(4, Number(order.currentStep ?? 0)));

  const copyTracking = () => {
    if (!order.trackingNumber || !navigator.clipboard) return;
    navigator.clipboard.writeText(order.trackingNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {});
  };

  return (
    <div
      className={`mt-2.5 rounded-2xl border p-3.5 text-xs transition-all ${
        isDark
          ? 'bg-[#071510]/90 border-white/15 text-stone-100'
          : 'bg-white border-[#0B2419]/15 text-[#0B2419] shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-current/10">
        <div>
          <span className="text-[10px] uppercase tracking-wider opacity-60 block">Order Reference</span>
          <span className="font-mono font-bold text-sm">#{order.orderNumber || order.id}</span>
        </div>
        <div className="text-right">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isTerminal
                ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                : status === 'delivered'
                ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                : 'bg-[#D4AF37]/20 text-[#b38f22] dark:text-[#D4AF37] border border-[#D4AF37]/40'
            }`}
          >
            {status}
          </span>
          <span className="block font-bold text-xs mt-0.5">₹{Number(order.total || 0).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {!isTerminal && (
        <div className="py-3">
          <div className="grid grid-cols-5 gap-1 text-[9px] font-medium text-center">
            {ORDER_STEPS.map((label, idx) => {
              const active = idx <= stepIndex;
              return (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div
                    className={`h-1.5 w-full rounded-full transition-all ${
                      active ? 'bg-[#D4AF37]' : isDark ? 'bg-white/10' : 'bg-stone-200'
                    }`}
                  />
                  <span className={active ? 'opacity-100 font-semibold' : 'opacity-45'}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-1 text-[11px] opacity-85 pt-1">
        {order.deliveryEstimate && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span>{order.deliveryEstimate}</span>
          </div>
        )}
        {order.trackingNumber && (
          <div className="flex items-center justify-between gap-2 rounded-lg bg-current/5 px-2 py-1">
            <span className="flex items-center gap-1.5 truncate">
              <Truck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="font-mono truncate">
                {order.courier ? `${order.courier}: ` : ''}{order.trackingNumber}
              </span>
            </span>
            <button
              type="button"
              onClick={copyTracking}
              className="p-1 rounded hover:bg-current/10 shrink-0"
              title="Copy tracking number"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        )}
      </div>

      {Array.isArray(order.items) && order.items.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-current/10 space-y-1.5">
          {order.items.slice(0, 2).map((item, idx) => (
            <div key={item.id || idx} className="flex items-center justify-between gap-2 text-[11px]">
              <span className="truncate font-medium">
                {item.quantity || 1}× {item.name}
              </span>
              <span className="shrink-0 opacity-75">₹{Number(item.price || 0).toLocaleString('en-IN')}</span>
            </div>
          ))}
          {order.items.length > 2 && (
            <p className="text-[10px] opacity-60">+{order.items.length - 2} more item(s)</p>
          )}
        </div>
      )}

      {/* Strict Order Policy: Self-service cancellation is disabled; customers use Verified Specialist Escalation */}
      <div className="mt-3 pt-2 border-t border-current/10 flex flex-wrap gap-1.5">
        {!isTerminal && status !== 'delivered' && (
          <button
            type="button"
            onClick={() => onRequestOrderIntervention?.(order.orderNumber || order.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#D4AF37]/15 text-[#8a6a12] dark:text-[#D4AF37] hover:bg-[#D4AF37]/25 transition-colors"
          >
            <PhoneCall className="w-3 h-3" /> Request Specialist Assistance
          </button>
        )}
        {order.canReturn && (
          <>
            <button
              type="button"
              onClick={() => onQuickPrompt(`Initiate return for order #${order.orderNumber}`)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#D4AF37]/15 text-[#8a6a12] dark:text-[#D4AF37] hover:bg-[#D4AF37]/25 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Initiate Return
            </button>
            <button
              type="button"
              onClick={() => onQuickPrompt(`Request replacement for order #${order.orderNumber}`)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25 transition-colors"
            >
              <Package className="w-3 h-3" /> Request Replacement
            </button>
          </>
        )}
        {order.activeReturn && (
          <button
            type="button"
            onClick={() => onQuickPrompt(`Check refund status for ${order.activeReturn.rmaNumber || `order #${order.orderNumber}`}`)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-sky-500/15 text-sky-700 dark:text-sky-300"
          >
            <RefreshCw className="w-3 h-3" /> Status: {order.activeReturn.rmaNumber}
          </button>
        )}
      </div>
    </div>
  );
}

class SupportWidgetErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.error('[SUPPORT_WIDGET_BOUNDARY]', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[250]">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B2419] px-4 py-3 text-xs font-semibold text-[#FDFBF7] shadow-xl border border-[#D4AF37]/40"
          >
            <MessageSquare className="w-4 h-4 text-[#D4AF37]" /> Client Concierge
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

export function SupportAssistantInner({ lingerThresholdMs = LINGER_THRESHOLD_MS }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  const { cart = [], isCartOpen = false } = useCart() || {};

  const persisted = useMemo(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, []);

  const [isOpen, setIsOpen] = useState(Boolean(persisted.isOpen));
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof persisted.isDark === 'boolean') return persisted.isDark;
    return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  });
  const [soundEnabled, setSoundEnabled] = useState(persisted.soundEnabled !== false);
  const [sessionToken, setSessionToken] = useState(
    () => localStorage.getItem(SESSION_TOKEN_KEY) || sessionStorage.getItem(SESSION_TOKEN_KEY) || null
  );
  const [chatStatus, setChatStatus] = useState(persisted.chatStatus || 'active');
  const [assignedAgentName, setAssignedAgentName] = useState(persisted.assignedAgentName || null);
  const [messages, setMessages] = useState(() => (Array.isArray(persisted.messages) ? persisted.messages : []));
  const [hasPlacedOrder, setHasPlacedOrder] = useState(Boolean(persisted.hasPlacedOrder));
  const [quickActions, setQuickActions] = useState(() =>
    Array.isArray(persisted.quickActions) && persisted.quickActions.length
      ? persisted.quickActions
      : PUBLIC_GENERAL_CHIPS
  );
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [statusLabel, setStatusLabel] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [proactiveBubble, setProactiveBubble] = useState(null);
  const [csatRating, setCsatRating] = useState(5);
  const [csatFeedback, setCsatFeedback] = useState('');
  const [csatSubmitted, setCsatSubmitted] = useState(false);
  const [csatSubmitting, setCsatSubmitting] = useState(false);
  const [csatError, setCsatError] = useState('');
  const [telegramBotUrl, setTelegramBotUrl] = useState('https://web.telegram.org/k/#@BhumiveraBot');
  const [copilotRescue, setCopilotRescue] = useState(null);
  const [copilotEmailInput, setCopilotEmailInput] = useState('');
  const [copilotSendingReset, setCopilotSendingReset] = useState(false);
  const [conciergeFlow, setConciergeFlow] = useState(persisted.conciergeFlow || { activeProductId: null, lastIngredientId: null });

  // 3-Step Legitimate Customer Verification & Specialist Escalation Flow State
  const [escalationWizard, setEscalationWizard] = useState({
    open: false,
    step: 1, // 1 = Verify Order ID + Email/Phone, 2 = Contact Preference (Email vs Phone Call + Slot), 3 = Confirmed
    orderId: '',
    emailOrPhone: '',
    verifiedOrder: null,
    contactPreference: 'email', // 'email' | 'phone_call'
    callbackPhone: '',
    callbackTimeSlot: CALLBACK_SLOTS[0],
    queryDetails: '',
    busy: false,
    error: '',
    ticketReference: '',
  });

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const sessionInitializedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const snapshot = JSON.stringify({
        isOpen,
        isDark,
        soundEnabled,
        chatStatus,
        assignedAgentName,
        hasPlacedOrder,
        messages: messages.slice(-50),
        quickActions,
      });
      localStorage.setItem(STORAGE_KEY, snapshot);
      sessionStorage.setItem(STORAGE_KEY, snapshot);
      if (sessionToken) {
        localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
        sessionStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
      }
    } catch {}
  }, [isOpen, isDark, soundEnabled, chatStatus, assignedAgentName, hasPlacedOrder, messages, quickActions, sessionToken]);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isTyping, isOpen, escalationWizard.open]);

  const currentPageContext = useMemo(() => ({
    pathname: location.pathname,
    search: location.search,
    isCartOpen: Boolean(isCartOpen),
    cartItemCount: Array.isArray(cart) ? cart.length : 0,
    authenticated: Boolean(user?.id),
  }), [location.pathname, location.search, isCartOpen, cart, user?.id]);

  // Single Persistent Thread Initialization (Never creates duplicate threads)
  const ensureSession = useCallback(async ({ customContext = {} } = {}) => {
    try {
      const response = await aiSupportApi.initSession({
        sessionToken,
        forceNew: false,
        pageContext: { ...currentPageContext, ...customContext },
      });
      const data = response?.data || {};
      if (data.sessionToken) {
        setSessionToken(data.sessionToken);
      }
      if (data.session?.status) {
        setChatStatus(data.session.status);
      }
      setAssignedAgentName(data.session?.assignedAgentName || null);
      const buyerVerified = Boolean(data.hasPlacedOrder);
      setHasPlacedOrder(buyerVerified);
      if (data.telegramBotUrl) setTelegramBotUrl(normalizeTelegramBotUrl(data.telegramBotUrl));
      if (Array.isArray(data.messages) && data.messages.length > 0 && messages.length === 0) {
        setMessages(data.messages);
      }
      if (Array.isArray(data.quickActions) && data.quickActions.length > 0) {
        setQuickActions(data.quickActions);
      } else {
        setQuickActions(buyerVerified ? VERIFIED_BUYER_CHIPS : PUBLIC_GENERAL_CHIPS);
      }
      return data.sessionToken || sessionToken;
    } catch {
      if (messages.length === 0) {
        setChatStatus('active');
        setMessages([
          {
            id: Date.now(),
            sender: 'assistant',
            senderName: 'Bhumivera Client Concierge',
            content: user?.name
              ? `Welcome back, ${user.name.split(' ')[0]}. How may the Bhumivera Client Concierge assist you today?`
              : 'Welcome to Bhumivera. Ask about our botanical ingredients, shipping policies, Brand Ambassador Program, or verify an Order ID for dedicated order support.',
            quickActions: PUBLIC_GENERAL_CHIPS,
            orderCards: [],
            createdAt: new Date().toISOString(),
          },
        ]);
      }
      return sessionToken;
    }
  }, [sessionToken, currentPageContext, messages.length, user?.name]);

  useEffect(() => {
    if (isOpen && !sessionInitializedRef.current) {
      sessionInitializedRef.current = true;
      setUnreadCount(0);
      setProactiveBubble(null);
      void ensureSession();
    }
  }, [isOpen, ensureSession]);

  // Poll for live specialist replies ONLY when buyer has a verified order thread
  useEffect(() => {
    if (!isOpen || !sessionToken || !hasPlacedOrder || typeof aiSupportApi.getHistory !== 'function') return undefined;
    const interval = window.setInterval(async () => {
      if (isTyping) return;
      try {
        const res = await aiSupportApi.getHistory(sessionToken);
        const remoteSession = res?.data?.session;
        const remoteMessages = res?.data?.messages;
        if (remoteSession?.status) setChatStatus(remoteSession.status);
        if (remoteSession?.assignedAgentName !== undefined) {
          setAssignedAgentName(remoteSession.assignedAgentName || null);
        }
        if (Array.isArray(remoteMessages) && remoteMessages.length > messages.length) {
          setMessages(remoteMessages);
          playSupportChime(soundEnabled);
        }
      } catch {}
    }, 10000);
    return () => window.clearInterval(interval);
  }, [isOpen, sessionToken, hasPlacedOrder, isTyping, messages.length, soundEnabled]);

  // Client Concierge Friction Rescue Listener
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleAiCopilotAssist = async event => {
      const detail = event?.detail || {};
      if (detail.email) setCopilotEmailInput(detail.email);
      else if (user?.email) setCopilotEmailInput(user.email);

      const initialRescue = {
        frictionType: detail.frictionType || 'general',
        headline: detail.headline || 'Bhumivera Client Concierge Assistance',
        explanation:
          detail.explanation ||
          detail.errorMessage ||
          'Here is step-by-step guidance to complete your action smoothly.',
        steps: Array.isArray(detail.steps) && detail.steps.length ? detail.steps : [],
        productId: detail.productId || null,
        productName: detail.productName || '',
        requestedQuantity: detail.requestedQuantity || 1,
        maxAddable: detail.maxAddable ?? null,
        email: detail.email || user?.email || '',
        passwordDiagnostics: detail.candidatePassword
          ? analyzePasswordForAiGuide(detail.candidatePassword, detail.email || user?.email || '')
          : null,
        alternatives: [],
      };

      setCopilotRescue(initialRescue);
      if (detail.autoOpen !== false) {
        setIsOpen(true);
        setUnreadCount(0);
        setProactiveBubble(null);
      }
    };

    window.addEventListener(AI_COPILOT_EVENT, handleAiCopilotAssist);
    return () => window.removeEventListener(AI_COPILOT_EVENT, handleAiCopilotAssist);
  }, [user?.email]);

  // Subtle Linger Nudge on High-Intent Pages
  useEffect(() => {
    const path = location.pathname;
    const isHighIntentPage =
      path.startsWith('/checkout') ||
      path.startsWith('/order-tracking') ||
      path.startsWith('/returns') ||
      Boolean(isCartOpen);

    if (!isHighIntentPage || isOpen) return undefined;
    const alreadyTriggeredForPath = sessionStorage.getItem(`${PROACTIVE_TRIGGERED_KEY}:${path}`);
    if (alreadyTriggeredForPath) return undefined;

    const timer = window.setTimeout(async () => {
      sessionStorage.setItem(`${PROACTIVE_TRIGGERED_KEY}:${path}`, '1');
      let nudge = path.startsWith('/checkout') || isCartOpen
        ? 'Need a hand with checkout? Free standard shipping on orders ₹500+.'
        : 'Looking for live tracking or order assistance? Our Client Concierge is here.';
      try {
        if (typeof aiSupportApi.updateContext === 'function') {
          const ctxRes = await aiSupportApi.updateContext({
            sessionToken,
            pageContext: { ...currentPageContext, proactiveTrigger: 'checkout_linger' },
          });
          if (ctxRes?.data?.proactiveMessage) {
            nudge = ctxRes.data.proactiveMessage;
          }
          if (Array.isArray(ctxRes?.data?.quickActions) && ctxRes.data.quickActions.length > 0) {
            setQuickActions(ctxRes.data.quickActions);
          }
        }
      } catch {}
      setProactiveBubble({ text: nudge });
      setUnreadCount(prev => Math.max(1, prev));
    }, lingerThresholdMs);

    return () => window.clearTimeout(timer);
  }, [location.pathname, isCartOpen, isOpen, lingerThresholdMs]);

  const handleFileChange = event => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    files.slice(0, 3 - attachments.length).forEach(file => {
      if (!file.type.startsWith('image/') || file.size > 8 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = () => {
        setAttachments(prev => [
          ...prev.slice(0, 2),
          {
            name: file.name,
            type: file.type,
            size: file.size,
            previewUrl: typeof reader.result === 'string' ? reader.result : '',
            url: `returns/${user?.id || 'guest'}/${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    event.target.value = '';
  };

  // Opens the 3-Step Legitimate Customer Verification & Callback/Email Escalation Wizard
  const openVerificationFlow = useCallback((prefillOrderId = '') => {
    setEscalationWizard({
      open: true,
      step: 1,
      orderId: prefillOrderId ? String(prefillOrderId) : '',
      emailOrPhone: user?.email || user?.phone || '',
      verifiedOrder: null,
      contactPreference: 'email',
      callbackPhone: user?.phone ? String(user.phone).replace(/\D/g, '').slice(-10) : '',
      callbackTimeSlot: CALLBACK_SLOTS[0],
      queryDetails: '',
      busy: false,
      error: '',
      ticketReference: '',
    });
  }, [user?.email, user?.phone]);

  // Step 1 Handler: Verify Order ID + Registered Email/Phone against backend database
  const handleVerifyOrderStep1 = async e => {
    e.preventDefault();
    if (!escalationWizard.orderId.trim() || !escalationWizard.emailOrPhone.trim()) {
      setEscalationWizard(prev => ({
        ...prev,
        error: 'Please enter both your Order ID (e.g., BHVM...) and your registered Email or 10-digit Phone Number.',
      }));
      return;
    }

    setEscalationWizard(prev => ({ ...prev, busy: true, error: '' }));
    try {
      const res = await api.post(
        '/support/chat/verify-escalation',
        {
          sessionToken,
          step: 'verify_order',
          orderId: escalationWizard.orderId.trim(),
          emailOrPhone: escalationWizard.emailOrPhone.trim(),
        },
        { notify: false }
      );
      const verifiedOrder = res.data?.order;
      setHasPlacedOrder(true);
      setQuickActions(VERIFIED_BUYER_CHIPS);
      setEscalationWizard(prev => ({
        ...prev,
        busy: false,
        step: 2,
        verifiedOrder,
        callbackPhone: verifiedOrder?.verifiedPhone || prev.callbackPhone,
        error: '',
      }));
      setMessages(prev => [
        ...prev,
        {
          id: `ver-step2-${Date.now()}`,
          sender: 'assistant',
          senderName: 'Bhumivera Client Concierge',
          content:
            res.data?.conciergePrompt ||
            'Our specialist team will reach out to you within 12 hours. Would you prefer to receive our update via Email or a Direct Phone Call?',
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setEscalationWizard(prev => ({
        ...prev,
        busy: false,
        error:
          err.response?.data?.message ||
          'Could not verify Order ID with the provided Email/Phone. Please check your details and try again.',
      }));
    }
  };

  // Step 2 & 3 Handler: Submit Contact Preference (Email vs Phone Call + Slot) & Create Single Verified Ticket
  const handleSubmitEscalationStep2 = async e => {
    e.preventDefault();
    const {
      orderId,
      emailOrPhone,
      contactPreference,
      callbackPhone,
      callbackTimeSlot,
      queryDetails,
    } = escalationWizard;

    const cleanPhone = String(callbackPhone || '').replace(/\D/g, '').slice(-10);
    if (contactPreference === 'phone_call' && cleanPhone.length !== 10) {
      setEscalationWizard(prev => ({
        ...prev,
        error: 'Please enter a valid 10-digit Phone Number for your callback.',
      }));
      return;
    }

    setEscalationWizard(prev => ({ ...prev, busy: true, error: '' }));
    try {
      const res = await api.post(
        '/support/chat/verify-escalation',
        {
          sessionToken,
          step: 'submit_preference',
          orderId,
          emailOrPhone,
          contactPreference,
          callbackPhone: cleanPhone,
          callbackTimeSlot,
          queryDetails: queryDetails.trim() || `Verified assistance request for Order #${orderId}`,
        },
        { notify: false }
      );
      const data = res.data || {};
      setChatStatus('escalated');
      setEscalationWizard(prev => ({
        ...prev,
        busy: false,
        step: 3,
        ticketReference: data.ticketReference || data.ticketId || 'VERIFIED',
      }));
      setMessages(prev => [
        ...prev,
        {
          id: `esc-done-${Date.now()}`,
          sender: 'assistant',
          senderName: 'Bhumivera Client Concierge',
          content:
            data.reply ||
            'Your verified specialist request has been logged. Our team will reach out within 12 hours via your chosen preference.',
          escalation: {
            escalated: true,
            ticketId: data.ticketReference || data.ticketId,
          },
          createdAt: new Date().toISOString(),
        },
      ]);
      playSupportChime(soundEnabled);
    } catch (err) {
      setEscalationWizard(prev => ({
        ...prev,
        busy: false,
        error: err.response?.data?.message || 'Could not submit specialist escalation request.',
      }));
    }
  };

  const handleEndChat = async () => {
    if (!sessionToken) return;
    setCsatSubmitting(true);
    setCsatError('');
    try {
      const response = await aiSupportApi.endSatisfied(sessionToken, {});
      setChatStatus('resolved');
      if (response?.data?.systemMessage) {
        setMessages(prev => [...prev, response.data.systemMessage]);
      }
    } catch (error) {
      setCsatError(error?.response?.data?.message || 'Could not close the conversation.');
    } finally {
      setCsatSubmitting(false);
    }
  };

  const handleSubmitCsat = async () => {
    if (!sessionToken) return;
    setCsatSubmitting(true);
    setCsatError('');
    try {
      await aiSupportApi.submitRating(sessionToken, {
        rating: csatRating,
        feedback: csatFeedback.trim(),
      });
      setCsatSubmitted(true);
    } catch (error) {
      setCsatError(error?.response?.data?.message || 'Could not save your feedback.');
    } finally {
      setCsatSubmitting(false);
    }
  };

  const sendMessage = useCallback(async (overridePrompt = null) => {
    if (overridePrompt === '__OPEN_VERIFICATION_FLOW__') {
      openVerificationFlow('');
      return;
    }

    const text = String(overridePrompt !== null ? overridePrompt : input).trim();
    if ((!text && attachments.length === 0) || isTyping) return;

    // Intercept direct cancellation or human escalation phrases to open the 3-Step Verification Wizard if not yet verified
    if (
      /\b(cancel\s*(?:my\s*|this\s*|the\s*)?order|connect\s*me\s*to\s*an?\s*associate|speak\s*to\s*(?:a\s*)?(?:human|agent|specialist)|human\s*agent)\b/i.test(text) &&
      !escalationWizard.verifiedOrder
    ) {
      const matchOrd = text.match(/(?:BHVM[-_\s]*)?(\d{6,12})\b/i);
      openVerificationFlow(matchOrd?.[1] || '');
    }

    const currentAttachments = [...attachments];
    if (overridePrompt === null) setInput('');
    setAttachments([]);
    setProactiveBubble(null);
    if (['resolved', 'closed'].includes(chatStatus)) {
      setChatStatus('active');
    }

    const userMsgId = `user-${Date.now()}`;
    const assistantStreamId = `assistant-${Date.now() + 1}`;
    const optimisticUserMsg = {
      id: userMsgId,
      sender: 'user',
      senderName: user?.name || 'You',
      content: text || '[Attached Photo]',
      attachments: currentAttachments,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, optimisticUserMsg]);
    setIsTyping(true);
    setStatusLabel('Consulting Bhumivera Client Concierge…');

    try {
      const response = await aiSupportApi.sendMessage({
        sessionToken,
        message: text,
        attachments: currentAttachments.map(a => ({ name: a.name, url: a.url, type: a.type })),
        pageContext: { ...currentPageContext, conciergeFlow },
      });

      const data = response?.data || {};
      if (data.sessionToken) setSessionToken(data.sessionToken);
      if (data.status) setChatStatus(data.status);
      if (data.conciergeFlow) setConciergeFlow(data.conciergeFlow);
      if (Array.isArray(data.orderCards) && data.orderCards.length > 0) {
        setHasPlacedOrder(true);
      }
      if (Array.isArray(data.quickActions) && data.quickActions.length > 0) {
        setQuickActions(data.quickActions);
      }

      if (data.escalation?.verificationStep === 'STEP_1_VERIFY_ORDER') {
        openVerificationFlow('');
      }

      setMessages(prev => [
        ...prev,
        {
          id: data.message?.id || assistantStreamId,
          sender: 'assistant',
          senderName: 'Bhumivera Client Concierge',
          content: data.reply || data.message?.content || 'How else may I assist you today?',
          orderCards: data.orderCards || [],
          quickActions: data.quickActions || [],
          conciergeFlow: data.conciergeFlow || null,
          escalation: data.escalation || null,
          createdAt: new Date().toISOString(),
        },
      ]);
      playSupportChime(soundEnabled);
    } catch {
      const localConcierge = resolveClientSideConciergeFallback(text);
      if (Array.isArray(localConcierge.quickActions) && localConcierge.quickActions.length > 0) {
        setQuickActions(localConcierge.quickActions);
      }
      setMessages(prev => [
        ...prev,
        {
          id: assistantStreamId,
          sender: 'assistant',
          senderName: 'Bhumivera Client Concierge',
          content: localConcierge.reply,
          orderCards: [],
          quickActions: localConcierge.quickActions || (hasPlacedOrder ? VERIFIED_BUYER_CHIPS : PUBLIC_GENERAL_CHIPS),
          createdAt: new Date().toISOString(),
        },
      ]);
      playSupportChime(soundEnabled);
    } finally {
      setIsTyping(false);
      setStatusLabel('');
    }
  }, [
    input,
    attachments,
    isTyping,
    chatStatus,
    sessionToken,
    currentPageContext,
    user?.name,
    soundEnabled,
    hasPlacedOrder,
    escalationWizard.verifiedOrder,
    openVerificationFlow,
  ]);

  useEffect(() => {
    const handleExternalOpen = event => {
      const detail = event?.detail || {};
      setIsOpen(true);
      setProactiveBubble(null);
      setUnreadCount(0);
      if (detail.verifyOrderId) {
        openVerificationFlow(detail.verifyOrderId);
      } else if (detail.prompt) {
        if (detail.autoSend !== false) {
          void sendMessage(detail.prompt);
        } else {
          setInput(detail.prompt);
        }
      }
    };
    window.addEventListener('bhumivera:open-support-chat', handleExternalOpen);
    return () => window.removeEventListener('bhumivera:open-support-chat', handleExternalOpen);
  }, [openVerificationFlow]);

  const activeStatusMeta = STATUS_META[chatStatus] || STATUS_META.active;

  return (
    <div
      data-testid="bhumivera-support-assistant"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[250] flex flex-col items-end font-sans"
    >
      {/* Subtle Luxury Assistance Nudge */}
      {!isOpen && proactiveBubble && (
        <div
          role="status"
          aria-live="polite"
          className={`mb-3 max-w-xs rounded-2xl border p-4 shadow-2xl transition-all ${
            isDark
              ? 'bg-[#0B2419] border-[#D4AF37]/40 text-[#FDFBF7]'
              : 'bg-white border-[#0B2419]/15 text-[#0B2419]'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5" /> Bhumivera Client Concierge
            </div>
            <button
              type="button"
              aria-label="Dismiss assistance prompt"
              onClick={() => setProactiveBubble(null)}
              className="opacity-60 hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="mt-2 text-xs leading-relaxed">{proactiveBubble.text}</p>
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setProactiveBubble(null);
              setUnreadCount(0);
            }}
            className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-[#D4AF37] hover:underline"
          >
            Open Concierge <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Expanded Luxury Concierge Window */}
      {isOpen && (
        <section
          aria-label="Bhumivera Client Concierge"
          className={`flex flex-col overflow-hidden rounded-3xl border shadow-[0_24px_60px_rgba(0,0,0,0.28)] transition-all duration-200 ${
            isMaximized
              ? 'w-[calc(100vw-1.5rem)] h-[calc(100vh-6rem)] md:w-[560px] md:h-[700px]'
              : 'w-[calc(100vw-1.5rem)] sm:w-[410px] h-[580px] max-h-[calc(100vh-7rem)]'
          } ${
            isDark
              ? 'bg-[#071510] border-white/15 text-stone-100'
              : 'bg-[#FDFBF7] border-[#0B2419]/15 text-[#0B2419]'
          }`}
        >
          {/* Minimal Luxury Header (No '+' New Chat Spam Button) */}
          <header className="bg-gradient-to-r from-[#0B2419] via-[#14251c] to-[#1f3528] px-5 py-3.5 text-[#FDFBF7] flex items-center justify-between gap-3 border-b border-[#D4AF37]/30 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/45 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-base font-semibold tracking-wide truncate">
                    Bhumivera Client Concierge
                  </h2>
                </div>
                <p className="text-[10px] text-[#d6dfd9] truncate">
                  {assignedAgentName
                    ? `Specialist: ${assignedAgentName}`
                    : hasPlacedOrder
                    ? 'Verified Order Concierge · Single Active Thread'
                    : 'Botanical Guidance, Policies & Order Verification'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => openVerificationFlow('')}
                title="Verify Order ID for Specialist Callback or Email Assistance"
                aria-label="Verify Order for Specialist Escalation"
                className="px-2.5 py-1 rounded-xl text-[10px] font-semibold tracking-wider uppercase border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/15 transition-colors"
              >
                Verify Order
              </button>
              <button
                type="button"
                onClick={() => setSoundEnabled(prev => !prev)}
                title={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
                aria-label={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
                className="p-1.5 rounded-lg text-stone-200 hover:bg-white/10 transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-60" />}
              </button>
              <button
                type="button"
                onClick={() => setIsDark(prev => !prev)}
                title={isDark ? 'Light mode' : 'Dark mode'}
                aria-label={isDark ? 'Light mode' : 'Dark mode'}
                className="p-1.5 rounded-lg text-stone-200 hover:bg-white/10 transition-colors"
              >
                {isDark ? <Sun className="w-4 h-4 text-[#D4AF37]" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsMaximized(prev => !prev)}
                title={isMaximized ? 'Restore size' : 'Expand window'}
                aria-label={isMaximized ? 'Restore size' : 'Expand window'}
                className="hidden sm:inline-flex p-1.5 rounded-lg text-stone-200 hover:bg-white/10 transition-colors"
              >
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize Concierge"
                aria-label="Minimize Concierge"
                className="p-1.5 rounded-lg text-stone-200 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Two-Tier Status Bar */}
          <div
            className={`px-4 py-2 border-b flex items-center justify-between gap-2 text-[11px] shrink-0 ${
              isDark ? 'bg-[#0a1c15] border-white/10 text-stone-300' : 'bg-[#f4f1e9] border-[#0B2419]/10 text-[#1b2921]'
            }`}
          >
            <span className="inline-flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              {hasPlacedOrder ? (
                <span><strong>Verified Buyer Concierge:</strong> Dedicated Order Thread Active</span>
              ) : (
                <span><strong>General Inquiry Mode:</strong> Verify an Order ID to unlock live specialist support</span>
              )}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border shrink-0 ${activeStatusMeta.badgeClass}`}>
              {activeStatusMeta.label}
            </span>
          </div>

          {/* 3-Step Legitimate Customer Verification & Specialist Callback/Email Drawer */}
          {escalationWizard.open && (
            <div
              className={`px-4 py-3.5 border-b space-y-3 text-xs shrink-0 max-h-80 overflow-y-auto ${
                isDark ? 'bg-[#0d2219] border-[#D4AF37]/40 text-stone-100' : 'bg-[#fbf9f2] border-[#D4AF37]/50 text-[#0B2419]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D4AF37]">
                  {escalationWizard.step === 1
                    ? 'Step 1 of 2 · Customer Order Verification'
                    : escalationWizard.step === 2
                    ? 'Step 2 of 2 · Specialist Contact Preference (12-Hr SLA)'
                    : 'Verified Specialist Request Logged'}
                </span>
                <button
                  type="button"
                  onClick={() => setEscalationWizard(prev => ({ ...prev, open: false }))}
                  className="text-xs opacity-70 hover:opacity-100"
                >
                  ✕
                </button>
              </div>

              {escalationWizard.error && (
                <div className="rounded-xl bg-rose-500/15 border border-rose-500/30 px-3 py-2 text-[11px] text-rose-500 dark:text-rose-300">
                  {escalationWizard.error}
                </div>
              )}

              {escalationWizard.step === 1 && (
                <form onSubmit={handleVerifyOrderStep1} className="space-y-2.5">
                  <p className="text-[11px] opacity-85 leading-relaxed">
                    To protect your account and prevent automated spam, please validate your <strong>Order ID</strong> and <strong>Registered Email or 10-Digit Phone Number</strong>.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={escalationWizard.orderId}
                      onChange={e => setEscalationWizard(prev => ({ ...prev, orderId: e.target.value }))}
                      placeholder="Order ID (e.g. BHVM815899599)"
                      className={`px-3 py-2 rounded-xl border text-xs outline-none ${
                        isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-white border-stone-300 text-[#0B2419]'
                      }`}
                    />
                    <input
                      type="text"
                      required
                      value={escalationWizard.emailOrPhone}
                      onChange={e => setEscalationWizard(prev => ({ ...prev, emailOrPhone: e.target.value }))}
                      placeholder="Registered Email or 10-Digit Phone"
                      className={`px-3 py-2 rounded-xl border text-xs outline-none ${
                        isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-white border-stone-300 text-[#0B2419]'
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={escalationWizard.busy}
                    className="w-full py-2 rounded-xl bg-[#0B2419] text-[#D4AF37] border border-[#D4AF37]/40 font-semibold text-xs hover:bg-[#163829] disabled:opacity-50"
                  >
                    {escalationWizard.busy ? 'Verifying Order Record…' : 'Verify Order & Continue'}
                  </button>
                </form>
              )}

              {escalationWizard.step === 2 && (
                <form onSubmit={handleSubmitEscalationStep2} className="space-y-2.5">
                  <p className="text-[11px] leading-relaxed">
                    Verified <strong>Order #{escalationWizard.verifiedOrder?.orderNumber}</strong>. Our specialist team will reach out to you within 12 hours. Would you prefer to receive our update via <strong>Email</strong> or a <strong>Direct Phone Call</strong>?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEscalationWizard(prev => ({ ...prev, contactPreference: 'email' }))}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                        escalationWizard.contactPreference === 'email'
                          ? 'bg-[#D4AF37] text-[#0B2419] border-[#D4AF37]'
                          : 'border-current/20 opacity-80'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" /> Email Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setEscalationWizard(prev => ({ ...prev, contactPreference: 'phone_call' }))}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                        escalationWizard.contactPreference === 'phone_call'
                          ? 'bg-[#D4AF37] text-[#0B2419] border-[#D4AF37]'
                          : 'border-current/20 opacity-80'
                      }`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Direct Phone Call
                    </button>
                  </div>

                  {escalationWizard.contactPreference === 'phone_call' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={escalationWizard.callbackPhone}
                        onChange={e =>
                          setEscalationWizard(prev => ({
                            ...prev,
                            callbackPhone: e.target.value.replace(/\D/g, '').slice(0, 10),
                          }))
                        }
                        placeholder="10-Digit Phone Number"
                        className={`px-3 py-2 rounded-xl border text-xs outline-none ${
                          isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-white border-stone-300 text-[#0B2419]'
                        }`}
                      />
                      <select
                        value={escalationWizard.callbackTimeSlot}
                        onChange={e => setEscalationWizard(prev => ({ ...prev, callbackTimeSlot: e.target.value }))}
                        className={`px-3 py-2 rounded-xl border text-xs outline-none ${
                          isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-white border-stone-300 text-[#0B2419]'
                        }`}
                      >
                        {CALLBACK_SLOTS.map(slot => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <textarea
                    rows={2}
                    required
                    value={escalationWizard.queryDetails}
                    onChange={e => setEscalationWizard(prev => ({ ...prev, queryDetails: e.target.value }))}
                    placeholder="Briefly describe how our specialist team may assist with this order…"
                    className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                      isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-white border-stone-300 text-[#0B2419]'
                    }`}
                  />

                  <button
                    type="submit"
                    disabled={escalationWizard.busy}
                    className="w-full py-2 rounded-xl bg-[#0B2419] text-[#D4AF37] border border-[#D4AF37]/40 font-semibold text-xs hover:bg-[#163829] disabled:opacity-50"
                  >
                    {escalationWizard.busy ? 'Logging Verified Request…' : 'Confirm & Schedule Specialist Outreach'}
                  </button>
                </form>
              )}

              {escalationWizard.step === 3 && (
                <div className="space-y-2 py-1">
                  <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Escalation Ticket #{escalationWizard.ticketReference} Confirmed</span>
                  </div>
                  <p className="text-[11px] opacity-85">
                    Our specialist team will reach out within 12 hours via your selected preference.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Client Concierge Friction Rescue Card */}
          {copilotRescue && (
            <div
              className={`px-4 py-3 border-b max-h-56 overflow-y-auto text-xs space-y-2 shrink-0 ${
                isDark
                  ? 'bg-gradient-to-br from-[#122b22] to-[#0a1c15] border-[#D4AF37]/50 text-stone-100'
                  : 'bg-[#fffbeb] border-[#D4AF37] text-[#0B2419]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                    <Sparkles className="w-3 h-3" /> Bhumivera Client Concierge
                  </span>
                  <h3 className="font-bold text-xs mt-0.5">{copilotRescue.headline}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCopilotRescue(null)}
                  className="text-[11px] opacity-70 hover:opacity-100"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">{copilotRescue.explanation}</p>
              {String(copilotRescue.frictionType || '').includes('password') ||
              String(copilotRescue.frictionType || '').includes('login') ? (
                <div className="pt-1 flex gap-1.5">
                  <input
                    type="email"
                    value={copilotEmailInput}
                    onChange={e => setCopilotEmailInput(e.target.value)}
                    placeholder="Your registered email…"
                    className="flex-1 rounded-lg border border-current/20 bg-black/10 px-2.5 py-1 text-[11px] outline-none"
                  />
                  <button
                    type="button"
                    disabled={copilotSendingReset || !copilotEmailInput.trim()}
                    onClick={async () => {
                      setCopilotSendingReset(true);
                      try {
                        const res = await aiSupportApi.passwordRescue?.({
                          email: copilotEmailInput.trim(),
                          sendRecoveryLink: true,
                          stage: 'concierge_widget',
                        });
                        setCopilotRescue(prev => ({
                          ...prev,
                          explanation:
                            res?.data?.recoveryNotice ||
                            `Dispatched a 30-minute password setup link to ${copilotEmailInput.trim()}.`,
                        }));
                      } catch {
                        navigate('/forgot-password');
                      } finally {
                        setCopilotSendingReset(false);
                      }
                    }}
                    className="rounded-lg bg-[#D4AF37] px-2.5 py-1 text-[10px] font-bold uppercase text-[#0B2419] disabled:opacity-50"
                  >
                    {copilotSendingReset ? 'Sending…' : 'Send Reset Link'}
                  </button>
                </div>
              ) : null}
              {copilotRescue.productId && (
                <button
                  type="button"
                  onClick={() => {
                    const qtyToAdd =
                      copilotRescue.maxAddable && copilotRescue.maxAddable > 0
                        ? copilotRescue.maxAddable
                        : 1;
                    window.dispatchEvent(
                      new CustomEvent(AI_COPILOT_ADD_CART_RETRY_EVENT, {
                        detail: {
                          productId: copilotRescue.productId,
                          productName: copilotRescue.productName,
                          quantity: qtyToAdd,
                        },
                      })
                    );
                    setCopilotRescue(null);
                  }}
                  className="rounded-lg bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase text-[#071510]"
                >
                  Add Available Quantity to Cart
                </button>
              )}
            </div>
          )}

          {/* Messages Stream */}
          <div
            className={`flex-1 overflow-y-auto px-5 py-4 space-y-4 ${
              isDark ? 'bg-[#071510]' : 'bg-[#FDFBF7]'
            }`}
          >
            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              const isSystem = msg.sender === 'system';
              const isHumanStaff = ['agent', 'supervisor', 'manager', 'superadmin'].includes(msg.sender);

              if (isSystem) {
                return (
                  <div key={msg.id || idx} className="flex justify-center">
                    <div className="max-w-[92%] rounded-xl px-3.5 py-2 text-[11px] text-center bg-[#D4AF37]/15 border border-[#D4AF37]/30">
                      <FormattedMarkdown content={msg.content} isDark={isDark} onNavigate={href => navigate(href)} />
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id || idx}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  {!isUser && (
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#D4AF37] mb-1 pl-1">
                      {isHumanStaff ? msg.senderName || 'Bhumivera Specialist' : 'Bhumivera Client Concierge'}
                    </span>
                  )}
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 ${
                      isUser
                        ? 'bg-[#0B2419] text-[#FDFBF7] rounded-br-sm shadow-sm'
                        : isHumanStaff
                        ? 'bg-emerald-950 text-emerald-50 border border-emerald-400/40 rounded-bl-sm shadow-md'
                        : isDark
                        ? 'bg-[#10241f] text-stone-100 border border-white/10 rounded-bl-sm'
                        : 'bg-white text-[#0B2419] border border-[#0B2419]/10 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <FormattedMarkdown
                      content={msg.content}
                      isDark={isUser || isHumanStaff || isDark}
                      onNavigate={href => navigate(href)}
                    />

                    {Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {msg.attachments.map((att, aIdx) => (
                          <div
                            key={aIdx}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/20 text-[11px]"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span className="truncate max-w-[140px]">{att.name || 'Photo'}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {Array.isArray(msg.orderCards) &&
                      msg.orderCards.map(order => (
                        <ChatOrderCard
                          key={order.id || order.orderNumber}
                          order={order}
                          isDark={isDark}
                          onQuickPrompt={promptText => void sendMessage(promptText)}
                          onRequestOrderIntervention={ordRef => openVerificationFlow(ordRef)}
                        />
                      ))}

                    {msg.escalation?.escalated && (
                      <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-amber-500/15 border border-amber-500/30 px-3 py-2 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>
                          Verified Specialist Ticket{msg.escalation.ticketId ? ` #${msg.escalation.ticketId}` : ''} logged (12-hour response guarantee).
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {['resolved', 'closed'].includes(chatStatus) && (
              <div
                className={`rounded-2xl border p-3.5 space-y-2 ${
                  isDark ? 'bg-[#10241f] border-[#D4AF37]/30' : 'bg-white border-[#0B2419]/15 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold">
                    {csatSubmitted ? 'Thank you for your feedback.' : 'How was your support experience?'}
                  </span>
                  <a
                    href={telegramBotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-semibold text-[#D4AF37] underline"
                  >
                    Telegram Concierge
                  </a>
                </div>
                {!csatSubmitted && (
                  <>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setCsatRating(star)}
                          disabled={csatSubmitting}
                          aria-label={`Rate ${star} stars`}
                          className="p-0.5 hover:scale-110 transition-transform disabled:opacity-60"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= csatRating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-stone-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={csatFeedback}
                        onChange={e => setCsatFeedback(e.target.value)}
                        placeholder="Share a note on your experience…"
                        className={`flex-1 px-2.5 py-1.5 rounded-lg border text-[11px] ${
                          isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-stone-50 border-stone-200 text-[#0B2419]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => void handleSubmitCsat()}
                        disabled={csatSubmitting}
                        className="px-2.5 py-1.5 rounded-lg bg-[#0B2419] text-[#D4AF37] text-[10px] font-bold shrink-0 disabled:opacity-60"
                      >
                        {csatSubmitting ? 'Saving…' : 'Send'}
                      </button>
                    </div>
                  </>
                )}
                {csatError && <p role="alert" className="text-[11px] text-red-600">{csatError}</p>}
              </div>
            )}

            {!['resolved', 'closed'].includes(chatStatus) && hasPlacedOrder && messages.length > 2 && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => void handleEndChat()}
                  disabled={csatSubmitting || isTyping}
                  aria-label="End chat"
                  className="rounded-lg border border-[#0B2419]/15 px-3 py-1.5 text-[11px] font-semibold text-[#0B2419] hover:bg-[#0B2419]/5 disabled:opacity-60 dark:text-stone-100 dark:border-white/15"
                >
                  {csatSubmitting ? 'Closing…' : 'End chat'}
                </button>
              </div>
            )}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs opacity-75 pl-1">
                <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-[#0B2419]/10 dark:bg-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:300ms]" />
                </div>
                {statusLabel && <span className="text-[11px] italic">{statusLabel}</span>}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Dynamic AI Next Auto-Suggestions (Product -> Ingredient -> 2+1 Related + Usage Guide) */}
          {Array.isArray(quickActions) && quickActions.length > 0 && (
            <div
              className={`px-4 py-2.5 border-t space-y-1.5 shrink-0 ${
                isDark ? 'bg-[#0a1c15] border-white/10' : 'bg-[#f4f1e9] border-[#0B2419]/10'
              }`}
            >
              {quickActions.some(c => c.category === 'ingredient_deep_dive' || c.category === 'closely_related_ingredient') && (
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.14em] text-[#D4AF37]">
                  <span>AI Auto-Suggestions · 2 Ingredient Insights + 1 Related Active + Usage</span>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-1.5">
                {quickActions.map(chip => {
                  const isRelated = chip.category === 'closely_related_ingredient';
                  const isUsage = chip.category === 'usage_and_timing';
                  return (
                    <button
                      key={chip.id || chip.label}
                      type="button"
                      disabled={isTyping}
                      onClick={() => void sendMessage(chip.prompt || chip.label)}
                      className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                        isRelated
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#0B2419] dark:text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B2419]'
                          : isUsage
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-600 hover:text-white'
                          : isDark
                          ? 'bg-[#10241f] border-[#D4AF37]/30 text-stone-200 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                          : 'bg-white border-[#0B2419]/15 text-[#0B2419] hover:border-[#0B2419] hover:bg-[#0B2419] hover:text-white'
                      } disabled:opacity-50`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pending Image Attachments Bar */}
          {attachments.length > 0 && (
            <div className="px-4 py-1.5 border-t border-current/10 flex items-center gap-2 overflow-x-auto shrink-0">
              {attachments.map((att, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#D4AF37]/15 text-[11px] font-medium"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span className="truncate max-w-[110px]">{att.name}</span>
                  <button
                    type="button"
                    onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                    aria-label={`Remove ${att.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Composer Input Bar */}
          <form
            onSubmit={e => {
              e.preventDefault();
              void sendMessage();
            }}
            className={`p-3.5 border-t flex items-center gap-2 shrink-0 ${
              isDark ? 'bg-[#071510] border-white/10' : 'bg-white border-[#0B2419]/10'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              className="hidden"
              aria-label="Attach product or order photo"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach photo for return inspection"
              aria-label="Attach photo"
              className={`p-2 rounded-xl border transition-colors ${
                isDark
                  ? 'border-white/15 text-stone-300 hover:bg-white/10'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={
                hasPlacedOrder
                  ? 'Ask about your order, returns, or botanical rituals…'
                  : 'Ask about ingredients, shipping, or verify an Order ID…'
              }
              maxLength={2000}
              aria-label="Message Bhumivera Client Concierge"
              className={`flex-1 min-w-0 px-3.5 py-2 rounded-xl border text-xs outline-none transition-colors ${
                isDark
                  ? 'bg-[#10241f] border-white/15 text-stone-100 placeholder:text-stone-400 focus:border-[#D4AF37]'
                  : 'bg-[#FDFBF7] border-stone-200 text-[#0B2419] placeholder:text-stone-400 focus:border-[#0B2419]'
              }`}
            />
            <button
              type="submit"
              disabled={isTyping || (!input.trim() && attachments.length === 0)}
              aria-label="Send message"
              className="p-2.5 rounded-xl bg-[#0B2419] text-[#D4AF37] hover:bg-[#1e4031] disabled:opacity-40 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>
      )}

      {/* Floating Concierge Launcher */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setUnreadCount(0);
            setProactiveBubble(null);
          }}
          aria-label="Open Bhumivera Support"
          className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#0B2419] to-[#1e4031] px-4 py-3.5 text-[#FDFBF7] shadow-[0_14px_34px_rgba(11,36,25,0.45)] border border-[#D4AF37]/45 hover:scale-[1.03] active:scale-[0.98] transition-all"
        >
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold tracking-wide pr-0.5">Client Concierge</span>
        </button>
      )}
    </div>
  );
}

export default function SupportAssistant(props) {
  return (
    <SupportWidgetErrorBoundary>
      <SupportAssistantInner {...props} />
    </SupportWidgetErrorBoundary>
  );
}
