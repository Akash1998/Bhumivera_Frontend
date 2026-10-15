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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { aiSupport as aiSupportApi, BASE_URL } from '../services/api';

const STORAGE_KEY = 'bhumivera_ai_support_state_v1';
const SESSION_TOKEN_KEY = 'bhumivera_ai_support_token_v1';
const PROACTIVE_TRIGGERED_KEY = 'bhumivera_ai_proactive_shown_v1';
const LINGER_THRESHOLD_MS = 45000; // 45 seconds

const DEFAULT_CHIPS = [
  { id: 'track_order', label: 'Where is my order?', prompt: 'Where is my order?' },
  { id: 'initiate_return', label: 'Initiate Return', prompt: 'I want to initiate a return or replacement for my delivered order.' },
  { id: 'cancel_order', label: 'Cancel Order', prompt: 'I need help cancelling my recent order.' },
  { id: 'refund_status', label: 'Check Refund Status', prompt: 'What is my current refund or RMA status?' },
  { id: 'shipping_policy', label: 'Shipping Policy', prompt: 'What are your shipping charges and delivery timelines?' },
  { id: 'talk_to_human', label: 'Talk to Human', prompt: 'Please connect me with a human support agent.' },
];

const ORDER_STEPS = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

/**
 * Synthesizes a subtle, pleasant two-tone notification chime using the Web Audio API
 * (Zero external audio file dependencies).
 */
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
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.14); // A5
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.29);
    setTimeout(() => ctx.close().catch(() => {}), 400);
  } catch {
    // Ignore audio context autoplay restrictions
  }
}

/**
 * Lightweight, XSS-safe Markdown Renderer for Support Assistant Messages.
 * Supports bold, italic, inline code, internal/external links, and bullet lists.
 */
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

/**
 * Interactive Rich Order Card rendered inside the chat timeline.
 */
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

      {/* 5-Step Progress Bar */}
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

      {/* Delivery Estimate & Tracking */}
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

      {/* Order Items Preview */}
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

      {/* Self-Service Action Buttons */}
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

/**
 * Error Boundary to guarantee zero storefront regression even if a rendering error occurs.
 */
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
            <MessageSquare className="w-4 h-4 text-[#D4AF37]" /> Support Concierge
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

  // Load persisted widget state from localStorage / sessionStorage
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

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const clickTrackerRef = useRef([]);
  const sessionInitializedRef = useRef(false);

  // Sync state to localStorage + sessionStorage across refreshes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const snapshot = JSON.stringify({
        isOpen,
        isDark,
        soundEnabled,
        messages: messages.slice(-40),
        quickActions,
      });
      localStorage.setItem(STORAGE_KEY, snapshot);
      sessionStorage.setItem(STORAGE_KEY, snapshot);
      if (sessionToken) {
        localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
        sessionStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [isOpen, isDark, soundEnabled, messages, quickActions, sessionToken]);

  // Smooth auto-scroll on new messages
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isTyping, isOpen]);

  // Build current page context for backend context injection
  const currentPageContext = useMemo(() => ({
    pathname: location.pathname,
    search: location.search,
    isCartOpen: Boolean(isCartOpen),
    cartItemCount: Array.isArray(cart) ? cart.length : 0,
    authenticated: Boolean(user?.id),
  }), [location.pathname, location.search, isCartOpen, cart, user?.id]);

  // Initialize or restore session with backend on first open
  const ensureSession = useCallback(async (customContext = {}) => {
    try {
      const response = await aiSupportApi.initSession({
        sessionToken,
        pageContext: { ...currentPageContext, ...customContext },
      });
      const data = response?.data || {};
      if (data.sessionToken) {
        setSessionToken(data.sessionToken);
      }
      if (Array.isArray(data.messages) && data.messages.length > 0 && messages.length === 0) {
        setMessages(data.messages);
      }
      if (Array.isArray(data.quickActions) && data.quickActions.length > 0) {
        setQuickActions(data.quickActions);
      }
      return data.sessionToken || sessionToken;
    } catch {
      if (messages.length === 0) {
        setMessages([
          {
            id: Date.now(),
            sender: 'assistant',
            content:
              "Namaste! I'm your Bhumivera AI Support Concierge. I can check live order status, initiate returns or cancellations, verify Razorpay refunds, or answer product & shipping questions.",
            quickActions: DEFAULT_CHIPS,
            orderCards: [],
            createdAt: new Date().toISOString(),
          },
        ]);
      }
      return sessionToken;
    }
  }, [sessionToken, currentPageContext, messages.length]);

  useEffect(() => {
    if (isOpen && !sessionInitializedRef.current) {
      sessionInitializedRef.current = true;
      setUnreadCount(0);
      setProactiveBubble(null);
      void ensureSession();
    }
  }, [isOpen, ensureSession]);

  // PROACTIVE TRIGGER 1: Linger >45s on Checkout, Cart, Order Tracking, or Returns pages
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
      } catch {
        // Fallback to local contextual nudge
      }

      setProactiveBubble({ text: nudge, triggerType });
      setUnreadCount(prev => Math.max(1, prev));
      playSupportChime(soundEnabled);
    }, lingerThresholdMs);

    return () => window.clearTimeout(timer);
  }, [location.pathname, isCartOpen, isOpen, lingerThresholdMs, sessionToken, currentPageContext, soundEnabled]);

  // PROACTIVE TRIGGER 2: Rage-Click / Dead-End Detection (4+ rapid clicks within 1.5s in same 60px zone)
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

  // Handle image attachment selection & preview
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
   * Sends a user message with optimistic UI update, attempting SSE streaming first
   * and gracefully falling back to standard JSON POST if streaming is unavailable.
   */
  const sendMessage = useCallback(async (overridePrompt = null) => {
    const text = String(overridePrompt !== null ? overridePrompt : input).trim();
    if ((!text && attachments.length === 0) || isTyping) return;

    const currentAttachments = [...attachments];
    if (overridePrompt === null) setInput('');
    setAttachments([]);
    setProactiveBubble(null);

    const userMsgId = `user-${Date.now()}`;
    const assistantStreamId = `assistant-${Date.now() + 1}`;
    const optimisticUserMsg = {
      id: userMsgId,
      sender: 'user',
      content: text || '[Attached Photo]',
      attachments: currentAttachments,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, optimisticUserMsg]);
    setIsTyping(true);
    setStatusLabel('Checking records…');

    const authToken = localStorage.getItem('token') || localStorage.getItem('ms_token') || '';

    try {
      // Attempt SSE Streaming endpoint first when fetch + ReadableStream are available
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

          // Insert placeholder assistant message for live streaming tokens
          setMessages(prev => [
            ...prev,
            {
              id: assistantStreamId,
              sender: 'assistant',
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

      // Fallback / Standard JSON API call
      const response = await aiSupportApi.sendMessage({
        sessionToken,
        message: text,
        attachments: currentAttachments.map(a => ({ name: a.name, url: a.url, type: a.type })),
        pageContext: currentPageContext,
      });

      const data = response?.data || {};
      if (data.sessionToken) setSessionToken(data.sessionToken);
      if (Array.isArray(data.quickActions) && data.quickActions.length) {
        setQuickActions(data.quickActions);
      }
      if (data.sentiment) setSentimentBadge(data.sentiment);

      setMessages(prev => [
        ...prev,
        {
          id: data.message?.id || assistantStreamId,
          sender: 'assistant',
          content: data.reply || data.message?.content || 'How else can I help you today?',
          orderCards: data.orderCards || [],
          quickActions: data.quickActions || [],
          sentiment: data.sentiment || null,
          escalation: data.escalation || null,
          createdAt: new Date().toISOString(),
        },
      ]);
      playSupportChime(soundEnabled);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: assistantStreamId,
          sender: 'assistant',
          content:
            'I encountered a temporary connection delay while reaching our support servers. You can retry your message right here, or contact our Senior Concierge directly at **support@bhumivera.com** or WhatsApp **+91 7430985647**.',
          orderCards: [],
          quickActions: DEFAULT_CHIPS,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
      setStatusLabel('');
    }
  }, [input, attachments, isTyping, sessionToken, currentPageContext, user?.id, soundEnabled]);

  const handleInstantEscalate = async () => {
    if (isTyping) return;
    setIsTyping(true);
    setStatusLabel('Connecting Senior Concierge…');
    try {
      const res = await aiSupportApi.escalate({
        sessionToken,
        reason: 'Customer clicked Instant Human Escalation in widget',
        message: input || 'Please connect me with a human support specialist.',
      });
      const data = res?.data || {};
      setMessages(prev => [
        ...prev,
        {
          id: `esc-${Date.now()}`,
          sender: 'assistant',
          content:
            data.reply ||
            'Your conversation has been escalated to our Senior Concierge team. A specialist will reach out shortly.',
          escalation: data.escalation || { escalated: true, priority: 'High' },
          createdAt: new Date().toISOString(),
        },
      ]);
      playSupportChime(soundEnabled);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `esc-err-${Date.now()}`,
          sender: 'assistant',
          content:
            'You can reach our Senior Concierge desk immediately at **support@bhumivera.com** or via WhatsApp at **+91 7430985647**.',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
      setStatusLabel('');
    }
  };

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
              <Sparkles className="w-3.5 h-3.5" /> Bhumivera Concierge
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
            Open Concierge <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <section
          aria-label="Bhumivera AI Support Assistant"
          className={`flex flex-col overflow-hidden rounded-3xl border shadow-[0_24px_60px_rgba(0,0,0,0.28)] transition-all duration-200 ${
            isMaximized
              ? 'w-[calc(100vw-2rem)] h-[calc(100vh-7rem)] md:w-[540px] md:h-[680px]'
              : 'w-[calc(100vw-2rem)] sm:w-[390px] h-[540px] max-h-[calc(100vh-7.5rem)]'
          } ${
            isDark
              ? 'bg-[#071510] border-white/15 text-stone-100'
              : 'bg-[#FDFBF7] border-[#0B2419]/15 text-[#0B2419]'
          }`}
        >
          {/* Header */}
          <header className="bg-gradient-to-r from-[#0B2419] via-[#14251c] to-[#2C3E2D] px-4 py-3.5 text-[#FDFBF7] flex items-center justify-between gap-2 border-b border-[#D4AF37]/30 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-serif text-base font-bold tracking-wide truncate">Bhumivera Concierge</h2>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Online" />
                </div>
                <p className="text-[11px] text-stone-300 truncate">
                  Autonomous Order, Return & Botanical Care Desk
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {sentimentBadge?.priority && ['High', 'Critical'].includes(sentimentBadge.priority) && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-200 border border-rose-400/30">
                  {sentimentBadge.priority} Priority
                </span>
              )}
              <button
                type="button"
                onClick={handleInstantEscalate}
                title="Escalate to Human Specialist"
                aria-label="Escalate to Human Specialist"
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
                title="Minimize Concierge"
                aria-label="Minimize Concierge"
                className="p-1.5 rounded-lg text-stone-200 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Messages Stream */}
          <div
            className={`flex-1 overflow-y-auto px-4 py-3.5 space-y-3.5 ${
              isDark ? 'bg-[#071510]' : 'bg-[#FDFBF7]'
            }`}
          >
            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id || idx}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 ${
                      isUser
                        ? 'bg-[#0B2419] text-[#FDFBF7] rounded-br-sm shadow-sm'
                        : isDark
                        ? 'bg-[#10241f] text-stone-100 border border-white/10 rounded-bl-sm'
                        : 'bg-white text-[#0B2419] border border-[#0B2419]/10 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <FormattedMarkdown
                      content={msg.content}
                      isDark={isUser || isDark}
                      onNavigate={href => navigate(href)}
                    />

                    {/* Attached Photos Preview */}
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

                    {/* Rich Order Cards */}
                    {Array.isArray(msg.orderCards) &&
                      msg.orderCards.map(order => (
                        <ChatOrderCard
                          key={order.id || order.orderNumber}
                          order={order}
                          isDark={isDark}
                          onQuickPrompt={promptText => void sendMessage(promptText)}
                        />
                      ))}

                    {/* Escalation Status Banner */}
                    {msg.escalation?.escalated && (
                      <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-amber-500/15 border border-amber-500/30 px-3 py-2 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>
                          Senior Concierge Ticket {msg.escalation.ticketId ? `#${msg.escalation.ticketId}` : ''} active ({msg.escalation.priority} Priority)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing / Tool Execution Indicator */}
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
              className={`px-3.5 py-2 border-t flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 ${
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
              placeholder="Ask about an order, return, refund, or product…"
              maxLength={2000}
              aria-label="Message Bhumivera AI Support"
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
          aria-label="Open Bhumivera AI Support Concierge"
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
          <span className="text-xs font-semibold tracking-wide pr-0.5">AI Concierge</span>
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
