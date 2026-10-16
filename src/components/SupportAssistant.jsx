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
  Ban,
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
  PlusCircle,
  HelpCircle,
  Star,
  Lock,
  Unlock,
  Eye,
  PauseCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { aiSupport as aiSupportApi, BASE_URL } from '../services/api';
import { normalizeTelegramBotUrl } from '../utils/telegramUrl';
import {
  AI_COPILOT_ADD_CART_RETRY_EVENT,
  AI_COPILOT_EVENT,
  COMPLETE_SITE_NAVIGATION_DIRECTORY,
  analyzePasswordForAiGuide,
} from '../utils/aiCopilotBus';

const STORAGE_KEY = 'bhumivera_ai_support_state_v2';
const SESSION_TOKEN_KEY = 'bhumivera_ai_support_token_v2';
const PROACTIVE_TRIGGERED_KEY = 'bhumivera_ai_proactive_shown_v2';
const LINGER_THRESHOLD_MS = 45000;

const DEFAULT_CHIPS = [
  { id: 'track_order', label: 'Where is my order?', prompt: 'Where is my order?' },
  { id: 'initiate_return', label: 'Initiate Return / Replace', prompt: 'I want to initiate a return or replacement for my delivered order.' },
  { id: 'cancel_order', label: 'Cancel Order', prompt: 'I need help cancelling my recent order.' },
  { id: 'refund_status', label: 'Check Refund / RMA', prompt: 'What is my current refund or RMA status?' },
  { id: 'wallet_loyalty', label: 'Wallet & Loyalty', prompt: 'What is my current wallet balance and loyalty points?' },
  { id: 'active_coupons', label: 'Available Coupons', prompt: 'Show me active coupons and offers for my account.' },
  { id: 'shipping_policy', label: 'Shipping Policy', prompt: 'What are your shipping charges and delivery timelines?' },
  { id: 'talk_to_human', label: 'Talk to Support', prompt: 'Please connect me with a support specialist.' },
];

const ORDER_STEPS = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

const STATUS_META = {
  active: {
    label: 'Active Chat',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    description: 'Live conversation with Bhumivera Support.',
  },
  pending: {
    label: 'Pending',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    description: 'Conversation paused while awaiting order details, photos, or verification.',
  },
  waiting_for_review: {
    label: 'Waiting for Review',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    description: 'Queued for a Support Supervisor or Quality Lead to review and approve.',
  },
  escalated: {
    label: 'Escalated',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    description: 'Your request has been sent to a support specialist.',
  },
  resolved: {
    label: 'Resolved',
    badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
    description: 'Issue marked solved. You can rate your experience or reopen anytime.',
  },
  closed: {
    label: 'Closed',
    badgeClass: 'bg-stone-500/20 text-stone-300 border-stone-400/40',
    description: 'Chat session ended and archived. Click Reopen or Start New Chat anytime.',
  },
};

const WIDGET_BUTTON_GUIDE = [
  {
    button: 'New Chat (+)',
    whatItDoes: 'Starts a brand-new support session with a fresh token while keeping your previous order records safe.',
  },
  {
    button: 'Live Support Status Badge (Read-Only)',
    whatItDoes: 'Shows the real-time status set by Bhumivera Customer Support (Active, Pending, Waiting for Review, Escalated, Resolved, or Closed). Status transitions are managed exclusively by our Support Executive team.',
  },
  {
    button: 'Escalate to Specialist (Phone Icon)',
    whatItDoes: 'Asks a support specialist to follow up with you.',
  },
  {
    button: 'Quick-Action Chips',
    whatItDoes: 'Triggers 1-click real-time order tracking, self-service returns (RMA), cancellations, refund status checks, wallet/loyalty lookups, and active coupon checks.',
  },
  {
    button: 'Attach Photo (Paperclip)',
    whatItDoes: 'Attaches up to 3 photos (JPEG/PNG/WebP) of damaged, leaking, or wrong items for instant RMA verification.',
  },
];

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

function ChatOrderCard({ order, isDark, onQuickPrompt }) {
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

      <div className="mt-3 pt-2 border-t border-current/10 flex flex-wrap gap-1.5">
        {order.cancellable && (
          <button
            type="button"
            onClick={() => onQuickPrompt(`Cancel my order #${order.orderNumber}`)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
          >
            <Ban className="w-3 h-3" /> Cancel Order
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
            <MessageSquare className="w-4 h-4 text-[#D4AF37]" /> Support
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
  const [showButtonGuide, setShowButtonGuide] = useState(false);
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
  const [quickActions, setQuickActions] = useState(() =>
    Array.isArray(persisted.quickActions) && persisted.quickActions.length ? persisted.quickActions : DEFAULT_CHIPS
  );
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [statusLabel, setStatusLabel] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [proactiveBubble, setProactiveBubble] = useState(null);
  const [sentimentBadge, setSentimentBadge] = useState(null);
  const [csatRating, setCsatRating] = useState(5);
  const [csatFeedback, setCsatFeedback] = useState('');
  const [csatSubmitted, setCsatSubmitted] = useState(false);
  const [csatSubmitting, setCsatSubmitting] = useState(false);
  const [csatError, setCsatError] = useState('');
  const [hasPlacedOrder, setHasPlacedOrder] = useState(false);
  const [telegramBotUrl, setTelegramBotUrl] = useState('https://web.telegram.org/k/#@BhumiveraBot');
  const [showAsyncForm, setShowAsyncForm] = useState(false);
  const [copilotRescue, setCopilotRescue] = useState(null);
  const [showSiteDirectory, setShowSiteDirectory] = useState(false);
  const [siteDirectoryFilter, setSiteDirectoryFilter] = useState('');
  const [copilotEmailInput, setCopilotEmailInput] = useState('');
  const [copilotSendingReset, setCopilotSendingReset] = useState(false);
  const [asyncSubject, setAsyncSubject] = useState('Support Inquiry');
  const [asyncBody, setAsyncBody] = useState('');

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const clickTrackerRef = useRef([]);
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
  }, [isOpen, isDark, soundEnabled, chatStatus, assignedAgentName, messages, quickActions, sessionToken]);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isTyping, isOpen]);

  const currentPageContext = useMemo(() => ({
    pathname: location.pathname,
    search: location.search,
    isCartOpen: Boolean(isCartOpen),
    cartItemCount: Array.isArray(cart) ? cart.length : 0,
    authenticated: Boolean(user?.id),
  }), [location.pathname, location.search, isCartOpen, cart, user?.id]);

  const ensureSession = useCallback(async ({ forceNew = false, customContext = {} } = {}) => {
    try {
      const response = await aiSupportApi.initSession({
        sessionToken: forceNew ? null : sessionToken,
        forceNew,
        pageContext: { ...currentPageContext, ...customContext },
      });
      const data = response?.data || {};
      if (data.sessionToken) {
        setSessionToken(data.sessionToken);
      }
      if (data.session?.status) {
        setChatStatus(data.session.status);
      } else if (forceNew) {
        setChatStatus('active');
      }
      setAssignedAgentName(data.session?.assignedAgentName || null);
      if (data.hasPlacedOrder !== undefined) setHasPlacedOrder(Boolean(data.hasPlacedOrder));
      if (data.telegramBotUrl) setTelegramBotUrl(normalizeTelegramBotUrl(data.telegramBotUrl));
      if (forceNew) {
        setCsatRating(0);
        setCsatSubmitted(false);
        setCsatFeedback('');
        setCsatError('');
        setSentimentBadge(null);
      }
      if (Array.isArray(data.messages) && data.messages.length > 0 && (forceNew || messages.length === 0)) {
        setMessages(data.messages);
      }
      if (Array.isArray(data.quickActions) && data.quickActions.length > 0) {
        setQuickActions(data.quickActions);
      }
      return data.sessionToken || sessionToken;
    } catch {
      if (forceNew || messages.length === 0) {
        setChatStatus('active');
        setMessages([
          {
            id: Date.now(),
            sender: 'assistant',
            senderName: 'Bhumivera Support',
            content: user?.name
              ? `Hi ${user.name.split(' ')[0]}, how can I help you today?`
              : 'Hi, how can I help you today?',
            quickActions: DEFAULT_CHIPS,
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

  // Poll for live human agent/supervisor/manager replies or status updates when widget is open
  useEffect(() => {
    if (!isOpen || !sessionToken || typeof aiSupportApi.getHistory !== 'function') return undefined;
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
    }, 8000);
    return () => window.clearInterval(interval);
  }, [isOpen, sessionToken, isTyping, messages.length, soundEnabled]);

  // 100X AI CO-PILOT FRICTION RESCUE LISTENER (Cart, Password, Login, Checkout)
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleAiCopilotAssist = async event => {
      const detail = event?.detail || {};
      if (detail.email) setCopilotEmailInput(detail.email);
      else if (user?.email) setCopilotEmailInput(user.email);

      const initialRescue = {
        frictionType: detail.frictionType || 'general',
        headline: detail.headline || 'AI Co-Pilot Guided Assistance',
        explanation:
          detail.explanation ||
          detail.errorMessage ||
          'I detected an issue and prepared step-by-step guidance to resolve it immediately.',
        steps: Array.isArray(detail.steps) && detail.steps.length
          ? detail.steps
          : [
              'Review the diagnostic details below.',
              'Click one of the 1-click quick fixes to resolve the issue immediately.',
            ],
        productId: detail.productId || null,
        productName: detail.productName || '',
        requestedQuantity: detail.requestedQuantity || 1,
        maxAddable: detail.maxAddable ?? null,
        email: detail.email || user?.email || '',
        passwordDiagnostics: detail.candidatePassword
          ? analyzePasswordForAiGuide(detail.candidatePassword, detail.email || user?.email || '')
          : null,
        alternatives: [],
        quickFixes: [],
      };

      setCopilotRescue(initialRescue);
      if (detail.autoOpen !== false) {
        setIsOpen(true);
        setUnreadCount(0);
        setProactiveBubble(null);
      }

      if (typeof aiSupportApi.diagnoseFriction === 'function') {
        try {
          const res = await aiSupportApi.diagnoseFriction({
            ...detail,
            pagePath: location.pathname,
          });
          if (res?.data?.success) {
            setCopilotRescue(prev => ({
              ...prev,
              ...res.data,
              passwordDiagnostics: res.data.passwordDiagnostics || prev?.passwordDiagnostics || null,
            }));
          }
        } catch {
          // Keep client-side diagnostic card if offline
        }
      }
    };

    window.addEventListener(AI_COPILOT_EVENT, handleAiCopilotAssist);
    return () => window.removeEventListener(AI_COPILOT_EVENT, handleAiCopilotAssist);
  }, [location.pathname, user?.email]);

  // PROACTIVE TRIGGER 1: Linger >45s
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
      const triggerType = path.startsWith('/checkout') || isCartOpen
        ? 'checkout_linger'
        : path.startsWith('/order-tracking')
        ? 'tracking_linger'
        : 'returns_linger';

      let nudge =
        triggerType === 'checkout_linger'
          ? 'Need help with shipping, coupons, or payment at checkout? Ask me anything!'
          : triggerType === 'tracking_linger'
          ? 'Looking for live tracking on your Bhumivera order? I can look it up right now.'
          : 'Need to start a return, replacement, or check your refund status?';

      try {
        const res = await aiSupportApi.updateContext({
          sessionToken,
          pageContext: { ...currentPageContext, proactiveTrigger: triggerType },
        });
        if (res.data?.proactiveMessage) nudge = res.data.proactiveMessage;
        if (Array.isArray(res.data?.quickActions)) setQuickActions(res.data.quickActions);
      } catch {}

      setProactiveBubble({ text: nudge, triggerType });
      setUnreadCount(prev => Math.max(1, prev));
      playSupportChime(soundEnabled);
    }, lingerThresholdMs);

    return () => window.clearTimeout(timer);
  }, [location.pathname, isCartOpen, isOpen, lingerThresholdMs, sessionToken, currentPageContext, soundEnabled]);

  // PROACTIVE TRIGGER 2: Rage-Click Detection
  useEffect(() => {
    const handleDocumentClick = event => {
      if (isOpen) return;
      const now = Date.now();
      const { clientX = 0, clientY = 0 } = event;
      const recent = clickTrackerRef.current.filter(
        c => now - c.t < 1500 && Math.hypot(c.x - clientX, c.y - clientY) < 60
      );
      recent.push({ t: now, x: clientX, y: clientY });
      clickTrackerRef.current = recent;

      if (recent.length >= 4) {
        clickTrackerRef.current = [];
        setProactiveBubble({
          text: 'Having trouble on this page? Tap here for instant assistance or human support.',
          triggerType: 'rage_click',
        });
        setUnreadCount(prev => Math.max(1, prev));
      }
    };

    window.addEventListener('click', handleDocumentClick, { passive: true });
    return () => window.removeEventListener('click', handleDocumentClick);
  }, [isOpen]);

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

  /**
   * Transitions the chat session status ('active', 'pending', 'waiting_for_review', 'escalated', 'resolved', 'closed')
   */
  const handleStatusTransition = async nextStatus => {
    if (isTyping || !nextStatus) return;
    if (nextStatus === 'escalated') {
      await handleInstantEscalate();
      return;
    }
    setChatStatus(nextStatus);
    if (!sessionToken || typeof aiSupportApi.updateSessionStatus !== 'function') {
      setMessages(prev => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: 'system',
          senderName: 'Bhumivera Support',
          content: `Chat status updated to **${nextStatus.replace(/_/g, ' ').toUpperCase()}**.`,
          createdAt: new Date().toISOString(),
        },
      ]);
      return;
    }
    try {
      const res = await aiSupportApi.updateSessionStatus(sessionToken, { status: nextStatus });
      const sysMsg = res?.data?.systemMessage;
      if (sysMsg) {
        setMessages(prev => [...prev, sysMsg]);
      }
    } catch {
      // Optimistic status already set
    }
  };

  const handleStartNewChat = async () => {
    if (isTyping) return;
    localStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    setSessionToken(null);
    setMessages([]);
    await ensureSession({ forceNew: true });
  };

  const handleEndChat = async () => {
    if (!sessionToken) {
      setCsatError('This chat could not be ended. Please start a new chat and try again.');
      return;
    }
    setCsatSubmitting(true);
    setCsatError('');
    try {
      const response = await aiSupportApi.endSatisfied(sessionToken, {});
      setChatStatus('resolved');
      if (response?.data?.systemMessage) {
        setMessages(prev => [...prev, response.data.systemMessage]);
      }
    } catch (error) {
      setCsatError(error?.response?.data?.message || 'We couldn’t end the chat. Please try again.');
    } finally {
      setCsatSubmitting(false);
    }
  };

  const handleSubmitCsat = async () => {
    if (!sessionToken) {
      setCsatError('This rating could not be saved. Please start a new chat and try again.');
      return;
    }
    setCsatSubmitting(true);
    setCsatError('');
    try {
      await aiSupportApi.submitRating(sessionToken, {
        rating: csatRating,
        feedback: csatFeedback.trim(),
      });
      setCsatSubmitted(true);
    } catch (error) {
      setCsatError(error?.response?.data?.message || 'We couldn’t save your rating. Please try again.');
    } finally {
      setCsatSubmitting(false);
    }
  };

  const sendMessage = useCallback(async (overridePrompt = null) => {
    const text = String(overridePrompt !== null ? overridePrompt : input).trim();
    if ((!text && attachments.length === 0) || isTyping) return;

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
    setStatusLabel('Checking live Bhumivera records…');

    const authToken = localStorage.getItem('token') || localStorage.getItem('ms_token') || '';

    try {
      if (typeof window !== 'undefined' && typeof window.fetch === 'function' && !aiSupportApi._forceJsonMode) {
        const streamResponse = await window.fetch(`${BASE_URL}/api/support/chat/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify({
            sessionToken,
            message: text,
            attachments: currentAttachments.map(a => ({ name: a.name, url: a.url, type: a.type })),
            pageContext: currentPageContext,
          }),
        });

        const contentType = streamResponse.headers?.get?.('content-type') || '';
        if (streamResponse.ok && contentType.includes('text/event-stream') && streamResponse.body?.getReader) {
          const reader = streamResponse.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let assembledReply = '';
          let streamMeta = {};

          setMessages(prev => [
            ...prev,
            {
              id: assistantStreamId,
              sender: 'assistant',
              senderName: 'Bhumivera Support',
              content: '',
              orderCards: [],
              quickActions: [],
              createdAt: new Date().toISOString(),
            },
          ]);

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const frames = buffer.split('\n\n');
            buffer = frames.pop() || '';

            for (const frame of frames) {
              const eventMatch = frame.match(/^event:\s*(.+)$/m);
              const dataMatch = frame.match(/^data:\s*(.+)$/m);
              if (!eventMatch || !dataMatch) continue;
              const eventType = eventMatch[1].trim();
              let parsedData = {};
              try {
                parsedData = JSON.parse(dataMatch[1]);
              } catch {
                continue;
              }

              if (eventType === 'status') {
                setStatusLabel(parsedData.detail || 'Processing…');
              } else if (eventType === 'tool_call') {
                setStatusLabel(`Running ${String(parsedData.name || 'lookup').replace(/_/g, ' ')}…`);
              } else if (eventType === 'token' && parsedData.delta) {
                assembledReply += parsedData.delta;
                const snapshotReply = assembledReply;
                setMessages(prev =>
                  prev.map(m => (m.id === assistantStreamId ? { ...m, content: snapshotReply } : m))
                );
              } else if (eventType === 'metadata') {
                streamMeta = parsedData;
                if (parsedData.sessionToken) setSessionToken(parsedData.sessionToken);
                if (parsedData.status) setChatStatus(parsedData.status);
                if (Array.isArray(parsedData.quickActions) && parsedData.quickActions.length) {
                  setQuickActions(parsedData.quickActions);
                }
                if (parsedData.sentiment) setSentimentBadge(parsedData.sentiment);
              }
            }
          }

          setMessages(prev =>
            prev.map(m =>
              m.id === assistantStreamId
                ? {
                    ...m,
                    content: assembledReply || 'How else can I assist you today?',
                    orderCards: streamMeta.orderCards || [],
                    quickActions: streamMeta.quickActions || [],
                    sentiment: streamMeta.sentiment || null,
                    escalation: streamMeta.escalation || null,
                  }
                : m
            )
          );
          playSupportChime(soundEnabled);
          setIsTyping(false);
          setStatusLabel('');
          return;
        }
      }

      const response = await aiSupportApi.sendMessage({
        sessionToken,
        message: text,
        attachments: currentAttachments.map(a => ({ name: a.name, url: a.url, type: a.type })),
        pageContext: currentPageContext,
      });

      const data = response?.data || {};
      if (data.sessionToken) setSessionToken(data.sessionToken);
      if (data.status) setChatStatus(data.status);
      if (Array.isArray(data.quickActions) && data.quickActions.length) {
        setQuickActions(data.quickActions);
      }
      if (data.sentiment) setSentimentBadge(data.sentiment);

      setMessages(prev => [
        ...prev,
        {
          id: data.message?.id || assistantStreamId,
          sender: 'assistant',
          senderName: 'Bhumivera Support',
          content: data.reply || data.message?.content || 'How else can I help you today?',
          orderCards: data.orderCards || [],
          quickActions: data.quickActions || [],
          sentiment: data.sentiment || null,
          escalation: data.escalation || null,
          createdAt: new Date().toISOString(),
        },
      ]);
      playSupportChime(soundEnabled);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: assistantStreamId,
          sender: 'assistant',
          senderName: 'Bhumivera Support',
          content:
            'Sorry, I couldn’t connect just now. Please try again or contact support@bhumivera.com or WhatsApp +91 7430985647.',
          orderCards: [],
          quickActions: DEFAULT_CHIPS,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
      setStatusLabel('');
    }
  }, [input, attachments, isTyping, chatStatus, sessionToken, currentPageContext, user?.name, soundEnabled]);

  const handleInstantEscalate = async () => {
    if (isTyping) return;
    setIsTyping(true);
    setStatusLabel('Connecting you to support…');
    try {
      const res = await aiSupportApi.escalate({
        sessionToken,
        reason: 'Customer clicked Instant Human Escalation in widget',
        message: input || 'Please connect me with a human support specialist.',
      });
      const data = res?.data || {};
      setChatStatus('escalated');
      setMessages(prev => [
        ...prev,
        {
          id: `esc-${Date.now()}`,
          sender: 'assistant',
          senderName: 'Bhumivera Support',
          content:
            data.reply ||
            'I’ve sent your request to a support specialist. They’ll be in touch as soon as possible.',
          escalation: data.escalation || { escalated: true, priority: 'High' },
          createdAt: new Date().toISOString(),
        },
      ]);
      playSupportChime(soundEnabled);
    } catch (err) {
      if (err?.response?.data?.code === 'ORDER_REQUIRED_FOR_LIVE_AGENT') {
        setShowAsyncForm(true);
        setMessages(prev => [
          ...prev,
          {
            id: `esc-order-gate-${Date.now()}`,
            sender: 'assistant',
            senderName: 'Bhumivera Support',
            content:
              err.response.data.message ||
              'A support specialist can help once you have a paid order. You can still ask us about products or shipping here, or leave a message and our team will reply by email or in the app.',
            createdAt: new Date().toISOString(),
          },
        ]);
      } else {
        setShowAsyncForm(true);
      }
    } finally {
      setIsTyping(false);
      setStatusLabel('');
    }
  };

  useEffect(() => {
    const handleExternalOpen = event => {
      const detail = event?.detail || {};
      setIsOpen(true);
      setProactiveBubble(null);
      setUnreadCount(0);
      if (detail.prompt) {
        setInput(detail.prompt);
      }
    };
    window.addEventListener('bhumivera:open-support-chat', handleExternalOpen);
    return () => window.removeEventListener('bhumivera:open-support-chat', handleExternalOpen);
  }, []);

  const activeStatusMeta = STATUS_META[chatStatus] || STATUS_META.active;

  return (
    <div
      data-testid="bhumivera-support-assistant"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[250] flex flex-col items-end font-sans"
    >
      {/* Proactive Assistance Nudge Bubble */}
      {!isOpen && proactiveBubble && (
        <div
          role="status"
          aria-live="polite"
          className={`mb-3 max-w-xs rounded-2xl border p-3.5 shadow-2xl transition-all ${
            isDark
              ? 'bg-[#0B2419] border-[#D4AF37]/40 text-[#FDFBF7]'
              : 'bg-white border-[#0B2419]/15 text-[#0B2419]'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5" /> Bhumivera Support
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
          <p className="mt-1.5 text-xs leading-relaxed">{proactiveBubble.text}</p>
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setProactiveBubble(null);
              setUnreadCount(0);
            }}
            className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-[#D4AF37] hover:underline"
          >
            Open Support <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <section
          aria-label="Bhumivera Support"
          className={`flex flex-col overflow-hidden rounded-3xl border shadow-[0_24px_60px_rgba(0,0,0,0.28)] transition-all duration-200 ${
            isMaximized
              ? 'w-[calc(100vw-1.5rem)] h-[calc(100vh-6rem)] md:w-[580px] md:h-[720px]'
              : 'w-[calc(100vw-1.5rem)] sm:w-[410px] h-[590px] max-h-[calc(100vh-7rem)]'
          } ${
            isDark
              ? 'bg-[#071510] border-white/15 text-stone-100'
              : 'bg-[#FDFBF7] border-[#0B2419]/15 text-[#0B2419]'
          }`}
        >
          {/* Header */}
          <header className="bg-gradient-to-r from-[#0B2419] via-[#14251c] to-[#2C3E2D] px-4 py-3 text-[#FDFBF7] flex items-center justify-between gap-2 border-b border-[#D4AF37]/30 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-serif text-base font-bold tracking-wide truncate">Bhumivera Support</h2>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${activeStatusMeta.badgeClass}`}
                    title={activeStatusMeta.description}
                  >
                    {activeStatusMeta.label}
                  </span>
                </div>
                <p className="text-[10px] text-stone-300 truncate">
                  {assignedAgentName
                    ? `Assigned Specialist: ${assignedAgentName}`
                    : 'Order Tracking, Returns & Customer Care'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleStartNewChat}
                title="Start a brand-new chat session"
                aria-label="Start New Chat"
                className="p-1.5 rounded-lg text-stone-200 hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowSiteDirectory(prev => !prev)}
                title="All Website Links & AI Site Navigator"
                aria-label="Open All Website Links Directory"
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors border ${
                  showSiteDirectory
                    ? 'bg-[#D4AF37] text-[#0B2419] border-[#D4AF37]'
                    : 'border-[#D4AF37]/40 text-[#D4AF37] hover:bg-white/10'
                }`}
              >
                All Links
              </button>
              <button
                type="button"
                onClick={() => setShowButtonGuide(prev => !prev)}
                title="What do these buttons do? (Interactive Guide)"
                aria-label="What do these buttons do?"
                className={`p-1.5 rounded-lg transition-colors ${
                  showButtonGuide ? 'bg-[#D4AF37] text-[#0B2419]' : 'text-stone-200 hover:bg-white/10 hover:text-[#D4AF37]'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleInstantEscalate}
                title="Request a support specialist"
                aria-label="Request a support specialist"
                className="p-1.5 rounded-lg text-stone-200 hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSoundEnabled(prev => !prev)}
                title={soundEnabled ? 'Mute sound chimes' : 'Enable sound chimes'}
                aria-label={soundEnabled ? 'Mute sound chimes' : 'Enable sound chimes'}
                className="p-1.5 rounded-lg text-stone-200 hover:bg-white/10 transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-60" />}
              </button>
              <button
                type="button"
                onClick={() => setIsDark(prev => !prev)}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
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
                title="Minimize chat"
                aria-label="Minimize chat"
                className="p-1.5 rounded-lg text-stone-200 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Read-Only Support Status Banner (Managed Exclusively by Customer Support Staff) */}
          {(chatStatus !== 'active' || assignedAgentName) && (
            <div
              className={`px-3.5 py-1.5 border-b flex items-center justify-between gap-2 text-[11px] shrink-0 ${
                isDark ? 'bg-[#0a1c15] border-white/10 text-stone-200' : 'bg-[#f4f1e9] border-[#0B2419]/10 text-[#0B2419]'
              }`}
            >
              <span className="truncate">
                <strong>Support Status:</strong> {activeStatusMeta.label} — {activeStatusMeta.description}
              </span>
              {sentimentBadge?.priority && ['High', 'Critical'].includes(sentimentBadge.priority) && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-500 border border-rose-500/30 shrink-0">
                  {sentimentBadge.priority} Priority
                </span>
              )}
            </div>
          )}

          {/* Interactive "What does this button do?" Explainer Drawer */}
          {showButtonGuide && (
            <div
              className={`px-4 py-3 border-b max-h-52 overflow-y-auto text-xs space-y-2 shrink-0 ${
                isDark ? 'bg-[#10241f] border-[#D4AF37]/30 text-stone-200' : 'bg-[#fffdf7] border-[#D4AF37]/50 text-[#0B2419]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] uppercase tracking-wider text-[#D4AF37]">
                  Interactive Guide: What Each Button Does
                </span>
                <button
                  type="button"
                  onClick={() => setShowButtonGuide(false)}
                  className="text-[11px] underline opacity-75 hover:opacity-100"
                >
                  Hide Guide
                </button>
              </div>
              <div className="space-y-1.5">
                {WIDGET_BUTTON_GUIDE.map(item => (
                  <div key={item.button} className="rounded-xl p-2 bg-current/5 border border-current/10">
                    <span className="font-bold text-[#D4AF37] block text-[11px]">{item.button}</span>
                    <span className="text-[11px] opacity-85 leading-snug">{item.whatItDoes}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complete A-to-Z Website Links & Missing Link Directory Drawer */}
          {showSiteDirectory && (
            <div
              className={`px-4 py-3 border-b max-h-60 overflow-y-auto text-xs space-y-2.5 shrink-0 ${
                isDark ? 'bg-[#0d2119] border-[#D4AF37]/40 text-stone-100' : 'bg-[#fffdf7] border-[#D4AF37]/50 text-[#0B2419]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[11px] uppercase tracking-wider text-[#D4AF37]">
                  Complete Bhumivera Website Directory ({COMPLETE_SITE_NAVIGATION_DIRECTORY.length} Pages)
                </span>
                <button
                  type="button"
                  onClick={() => setShowSiteDirectory(false)}
                  className="text-[11px] underline opacity-75 hover:opacity-100"
                >
                  Close
                </button>
              </div>
              <input
                type="text"
                value={siteDirectoryFilter}
                onChange={e => setSiteDirectoryFilter(e.target.value)}
                placeholder="Filter links (e.g. GST, warranty, returns, password, shop)…"
                className="w-full rounded-lg border border-current/20 bg-black/10 px-2.5 py-1.5 text-[11px] outline-none"
              />
              <div className="grid grid-cols-1 gap-1.5">
                {COMPLETE_SITE_NAVIGATION_DIRECTORY.filter(
                  item =>
                    !siteDirectoryFilter.trim() ||
                    item.title.toLowerCase().includes(siteDirectoryFilter.toLowerCase()) ||
                    item.description.toLowerCase().includes(siteDirectoryFilter.toLowerCase()) ||
                    item.path.toLowerCase().includes(siteDirectoryFilter.toLowerCase())
                ).map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setShowSiteDirectory(false);
                      navigate(item.path);
                    }}
                    className="text-left rounded-xl p-2 bg-current/5 hover:bg-[#D4AF37]/15 border border-current/10 transition flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-[11px] truncate">{item.title}</div>
                      <div className="text-[10px] opacity-75 truncate">{item.description}</div>
                    </div>
                    <span className="shrink-0 rounded bg-[#D4AF37]/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#D4AF37]">
                      {item.path}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 100X AI Co-Pilot Friction Rescue Card (Cart / Password / Login / Checkout) */}
          {copilotRescue && (
            <div
              className={`px-4 py-3 border-b max-h-64 overflow-y-auto text-xs space-y-2.5 shrink-0 ${
                isDark
                  ? 'bg-gradient-to-br from-[#122b22] to-[#0a1c15] border-[#D4AF37]/50 text-stone-100'
                  : 'bg-[#fffbeb] border-[#D4AF37] text-[#0B2419]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                    <Sparkles className="w-3 h-3" /> 100X AI Co-Pilot Live Rescue
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

              {Array.isArray(copilotRescue.steps) && copilotRescue.steps.length > 0 && (
                <ul className="space-y-1 text-[11px] pl-1">
                  {copilotRescue.steps.map((st, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="font-bold text-[#D4AF37]">{idx + 1}.</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Password rescue direct email link sender */}
              {String(copilotRescue.frictionType || '').includes('password') ||
              String(copilotRescue.frictionType || '').includes('login') ? (
                <div className="pt-1 space-y-1.5">
                  <div className="flex gap-1.5">
                    <input
                      type="email"
                      value={copilotEmailInput}
                      onChange={e => setCopilotEmailInput(e.target.value)}
                      placeholder="Your email for 1-click password setup link…"
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
                            stage: 'ai_copilot_widget',
                          });
                          setCopilotRescue(prev => ({
                            ...prev,
                            explanation:
                              res?.data?.recoveryNotice ||
                              `Sent a 30-minute one-click password setup link to ${copilotEmailInput.trim()}!`,
                          }));
                        } catch {
                          navigate('/forgot-password');
                        } finally {
                          setCopilotSendingReset(false);
                        }
                      }}
                      className="rounded-lg bg-[#D4AF37] px-2.5 py-1 text-[10px] font-black uppercase text-[#0B2419] disabled:opacity-50"
                    >
                      {copilotSendingReset ? 'Sending…' : 'Send 1-Click Link'}
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Cart rescue 1-click actions */}
              <div className="flex flex-wrap gap-1.5 pt-1">
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
                    className="rounded-lg bg-emerald-500 px-2.5 py-1 text-[10px] font-black uppercase text-[#071510]"
                  >
                    {copilotRescue.maxAddable && copilotRescue.maxAddable > 0
                      ? `Add ${copilotRescue.maxAddable} Available Unit(s)`
                      : 'Retry Add 1 Unit to Cart'}
                  </button>
                )}

                {Array.isArray(copilotRescue.alternatives) &&
                  copilotRescue.alternatives.slice(0, 2).map(alt => (
                    <button
                      key={alt.id}
                      type="button"
                      onClick={() => {
                        setCopilotRescue(null);
                        navigate(`/product/${alt.slug || alt.id}`);
                      }}
                      className="rounded-lg border border-[#D4AF37]/50 bg-[#D4AF37]/15 px-2.5 py-1 text-[10px] font-bold text-[#D4AF37]"
                    >
                      In-Stock: {alt.name} (₹{alt.price})
                    </button>
                  ))}

                <button
                  type="button"
                  onClick={() => {
                    const q =
                      copilotRescue.headline ||
                      'Please help me resolve my issue with adding to cart or setting my password';
                    setCopilotRescue(null);
                    void sendMessage(q);
                  }}
                  className="rounded-lg border border-current/25 px-2.5 py-1 text-[10px] font-bold"
                >
                  Ask AI in Chat
                </button>
              </div>
            </div>
          )}

          {/* Messages Stream */}
          <div
            className={`flex-1 overflow-y-auto px-4 py-3.5 space-y-3.5 ${
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
                    <div className="max-w-[92%] rounded-xl px-3 py-1.5 text-[11px] text-center bg-[#D4AF37]/15 border border-[#D4AF37]/30">
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
                  {!isUser && msg.senderName && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37] mb-1 pl-1">
                      {msg.senderName.replace(/AI (?:Concierge|Assistant)/, 'Support')}
                    </span>
                  )}
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 ${
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
                        />
                      ))}

                    {msg.escalation?.escalated && (
                      <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-amber-500/15 border border-amber-500/30 px-3 py-2 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>
                          Your support request{msg.escalation.ticketId ? ` #${msg.escalation.ticketId}` : ''} has been sent to a specialist.
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
                    Telegram support
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
                        placeholder="Write a short review of our support…"
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

            {!['resolved', 'closed'].includes(chatStatus) && messages.length > 1 && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => void handleEndChat()}
                  disabled={csatSubmitting || isTyping}
                  className="rounded-lg border border-[#0B2419]/15 px-3 py-1.5 text-[11px] font-semibold text-[#0B2419] hover:bg-[#0B2419]/5 disabled:opacity-60 dark:text-stone-100 dark:border-white/15"
                >
                  {csatSubmitting ? 'Ending chat…' : 'End chat'}
                </button>
                {csatError && <p role="alert" className="ml-2 self-center text-[11px] text-red-600">{csatError}</p>}
              </div>
            )}

            {/* Inline Async Message Form when customer has not placed an order yet */}
            {showAsyncForm && (
              <div
                className={`rounded-2xl border p-3.5 space-y-2 ${
                  isDark ? 'bg-[#10241f] border-amber-400/40' : 'bg-amber-50/70 border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#D4AF37]">
                    Send Message to Support (Replies via Email & App)
                  </span>
                  <button type="button" onClick={() => setShowAsyncForm(false)} className="text-xs opacity-70">✕</button>
                </div>
                <input
                  type="text"
                  value={asyncSubject}
                  onChange={e => setAsyncSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs text-[#0B2419] bg-white"
                />
                <textarea
                  rows={2}
                  value={asyncBody}
                  onChange={e => setAsyncBody(e.target.value)}
                  placeholder="Write your message — we will reply to your email and mobile app…"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs text-[#0B2419] bg-white"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!asyncBody.trim()) return;
                    try {
                      const res = await aiSupportApi.sendAsyncMessage?.({
                        sessionToken,
                        subject: asyncSubject,
                        message: asyncBody.trim(),
                      });
                      setShowAsyncForm(false);
                      setAsyncBody('');
                      setMessages(prev => [
                        ...prev,
                        {
                          id: `async-${Date.now()}`,
                          sender: 'assistant',
                          senderName: 'Bhumivera Support',
                          content: res?.data?.reply || 'Message sent! We will reply to your Email and Mobile App inbox.',
                          createdAt: new Date().toISOString(),
                        },
                      ]);
                    } catch {}
                  }}
                  className="w-full py-1.5 rounded-lg bg-[#0B2419] text-[#D4AF37] font-bold text-xs"
                >
                  Send Message to Support
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

          {/* Quick-Action Chips Bar */}
          {Array.isArray(quickActions) && quickActions.length > 0 && (
            <div
              className={`px-3.5 py-2 border-t flex flex-wrap items-center gap-1.5 shrink-0 ${
                isDark ? 'bg-[#0a1c15] border-white/10' : 'bg-[#f4f1e9] border-[#0B2419]/10'
              }`}
            >
              {quickActions.map(chip => (
                <button
                  key={chip.id || chip.label}
                  type="button"
                  disabled={isTyping}
                  onClick={() => void sendMessage(chip.prompt || chip.label)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                    isDark
                      ? 'bg-[#10241f] border-[#D4AF37]/30 text-stone-200 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                      : 'bg-white border-[#0B2419]/15 text-[#0B2419] hover:border-[#0B2419] hover:bg-[#0B2419] hover:text-white'
                  } disabled:opacity-50`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          {/* Pending Image Attachments Bar */}
          {attachments.length > 0 && (
            <div className="px-3.5 py-1.5 border-t border-current/10 flex items-center gap-2 overflow-x-auto shrink-0">
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
            className={`p-3 border-t flex items-center gap-2 shrink-0 ${
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
              title="Attach photo for return or damage inspection"
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
                chatStatus === 'closed'
                  ? 'Type a message to reopen this chat…'
                  : 'Ask about an order, return, refund, wallet, or product…'
              }
              maxLength={2000}
              aria-label="Message Bhumivera Support"
              className={`flex-1 min-w-0 px-3.5 py-2 rounded-xl border text-xs outline-none transition-colors ${
                isDark
                  ? 'bg-[#10241f] border-white/15 text-stone-100 placeholder:text-stone-400 focus:border-[#D4AF37]'
                  : 'bg-[#FDFBF7] border-stone-200 text-[#0B2419] placeholder:text-stone-400 focus:border-[#0B2419]'
              }`}
            />
            <button
              type="submit"
              disabled={isTyping || (!input.trim() && attachments.length === 0)}
              aria-label="Send support message"
              className="p-2.5 rounded-xl bg-[#0B2419] text-[#D4AF37] hover:bg-[#1e4031] disabled:opacity-40 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>
      )}

      {/* Floating Launcher Button */}
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
          <span className="text-xs font-semibold tracking-wide pr-0.5">Support</span>
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
