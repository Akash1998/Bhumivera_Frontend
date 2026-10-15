import React, { useCallback, useEffect, useState } from 'react';
import { aiSupport, contact as contactApi } from '../services/api';
import { normalizeTelegramBotUrl } from '../utils/telegramUrl';
import { useToast } from '../context/ToastContext';
import {
  LifeBuoy,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Send,
  Star,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const formatDate = value => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString();
};

export default function SupportCenter({
  name,
  email,
  orders = [],
  supportTicket,
  setSupportTicket,
  faqItems = [],
  faqOpen = new Set(),
  toggleFaq = () => {},
}) {
  const { showToast } = useToast() || {};
  const [sessionToken, setSessionToken] = useState(
    () => localStorage.getItem('bhumivera_ai_support_session_v1') || ''
  );
  const [sessionData, setSessionData] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [hasPlacedOrder, setHasPlacedOrder] = useState(orders.length > 0);
  const [telegramUrl, setTelegramUrl] = useState('https://web.telegram.org/k/#@BhumiveraBot');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Satisfaction & Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const selectedOrder = orders.find(order => String(order.id) === String(supportTicket?.order_id));
  const selectedItems = selectedOrder?.items || selectedOrder?.order_items || [];
  const generalFaqs = (faqItems || []).filter(item => !/warranty|10.year/i.test(`${item.q} ${item.a}`));

  const loadUnifiedSupportChannel = useCallback(async () => {
    setLoading(true);
    try {
      const [sessRes, ticketRes] = await Promise.all([
        aiSupport.initSession({
          sessionToken: sessionToken || undefined,
          pageContext: { pathname: '/profile', tab: 'support' },
          guestInfo: { name, email },
        }),
        contactApi.getMine().catch(() => ({ data: { data: [] } })),
      ]);

      const data = sessRes?.data || {};
      if (data.sessionToken) {
        setSessionToken(data.sessionToken);
        localStorage.setItem('bhumivera_ai_support_session_v1', data.sessionToken);
      }
      setSessionData(data.session || null);
      setChatMessages(data.messages || []);
      setHasPlacedOrder(Boolean(data.hasPlacedOrder || orders.length > 0));
      if (data.telegramBotUrl) setTelegramUrl(normalizeTelegramBotUrl(data.telegramBotUrl));
      setTickets(Array.isArray(ticketRes.data?.data) ? ticketRes.data.data : []);
    } catch {
      // Fallback silently
    } finally {
      setLoading(false);
    }
  }, [sessionToken, name, email, orders.length]);

  useEffect(() => {
    loadUnifiedSupportChannel();
  }, [loadUnifiedSupportChannel]);

  const handleOpenLiveChat = () => {
    const ordNum = selectedOrder?.order_number || selectedOrder?.id || supportTicket?.order_id || '';
    const prompt =
      supportTicket?.message?.trim() ||
      (ordNum ? `I need help with Order #${ordNum}.` : 'Hello, I need help with my Bhumivera account.');
    window.dispatchEvent(
      new CustomEvent('bhumivera:open-support-chat', {
        detail: {
          orderId: selectedOrder?.id || supportTicket?.order_id || null,
          orderNumber: ordNum,
          prompt,
        },
      })
    );
  };

  const handleSendUnifiedMessage = async event => {
    event.preventDefault();
    if (!supportTicket?.message?.trim()) {
      showToast?.('Please enter your message.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await aiSupport.sendAsyncMessage({
        sessionToken: sessionToken || undefined,
        name,
        email,
        orderId: supportTicket.order_id || null,
        productId: supportTicket.product_id || null,
        subject: supportTicket.subject || 'Order & Account Support Inquiry',
        message: supportTicket.message.trim(),
      });
      if (res.data?.sessionToken) {
        setSessionToken(res.data.sessionToken);
        localStorage.setItem('bhumivera_ai_support_session_v1', res.data.sessionToken);
      }
      setSupportTicket(prev => ({ ...prev, message: '' }));
      showToast?.(
        'Message sent to Bhumivera Support. Replies will arrive in your Email, Mobile App, and Live Chat.',
        'success'
      );
      await loadUnifiedSupportChannel();
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Could not send message.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEndChatAndReview = async event => {
    event.preventDefault();
    if (!sessionToken) return;
    try {
      await aiSupport.endSatisfied(sessionToken, {
        rating: reviewRating,
        feedback: reviewFeedback.trim() || 'Satisfied with support resolution.',
      });
      setReviewSubmitted(true);
      showToast?.('Thank you! Your chat has been marked Resolved and your review was saved.', 'success');
      await loadUnifiedSupportChannel();
    } catch {
      showToast?.('Could not submit review.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Unified Support Hero & Channel Selector */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-[#0B2419] via-[#133325] to-[#1e4031] p-7 text-white shadow-xl border border-[#D4AF37]/30 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Unified Bhumivera Support
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">Customer Care & Order Desk</h3>
            <p className="text-xs text-emerald-100/80 leading-relaxed mb-5">
              {hasPlacedOrder
                ? 'Your account has verified order history. You have full access to Live Support Chat, Instant Order/RMA Self-Service, and Two-Way Telegram Support.'
                : 'Get help with products and orders here, or send a message below — our support team will reply by email or in the app.'}
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleOpenLiveChat}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#D4AF37] hover:bg-[#c49f2f] text-[#071510] font-bold text-xs transition shadow-md"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Open Live Support Chat Widget
                </span>
                <span>Launch →</span>
              </button>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-100 font-semibold text-xs transition"
              >
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-sky-300" />
                  Chat on Telegram (@BhumiveraBot)
                </span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <a
                href="mailto:support@bhumivera.com"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs transition"
              >
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>support@bhumivera.com</span>
              </a>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-emerald-100/70 flex items-center justify-between">
            <span>512-Bit Encrypted Support Ledger</span>
            <span>Status: {sessionData?.status ? sessionData.status.toUpperCase() : 'ACTIVE'}</span>
          </div>
        </div>

        {/* Unified Order & Support Message Composer */}
        <form
          onSubmit={handleSendUnifiedMessage}
          className="lg:col-span-7 rounded-3xl bg-white border border-stone-200 p-7 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-[#0B2419]" />
              <div>
                <h3 className="font-serif font-bold text-[#0B2419] text-lg">
                  Message Bhumivera Support
                </h3>
                <p className="text-xs text-stone-500">
                  Synced directly with your Live Chat, Email ({email || 'account'}), Mobile App, and Telegram.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={loadUnifiedSupportChannel}
              className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
              title="Refresh conversation"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="support-order" className="text-xs font-semibold text-stone-600 mb-1 block">
                Select Order (Optional)
              </label>
              <select
                id="support-order"
                value={supportTicket?.order_id || ''}
                onChange={event =>
                  setSupportTicket(prev => ({ ...prev, order_id: event.target.value, product_id: '' }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-[#0B2419]"
              >
                <option value="">General Inquiry — No specific order</option>
                {orders.map(order => (
                  <option key={order.id} value={order.id}>
                    Order #{order.order_number || order.id} · {String(order.status || 'placed').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {selectedOrder && selectedItems.length > 0 && (
              <div>
                <label htmlFor="support-product" className="text-xs font-semibold text-stone-600 mb-1 block">
                  Select Item in Order
                </label>
                <select
                  id="support-product"
                  value={supportTicket?.product_id || ''}
                  onChange={event => setSupportTicket(prev => ({ ...prev, product_id: event.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-[#0B2419]"
                >
                  <option value="">Entire Order</option>
                  {selectedItems.map((item, idx) => {
                    const pid = item.product_id || item.id;
                    return (
                      <option key={`${pid}-${idx}`} value={pid}>
                        {item.product_name || item.name || `Item #${pid}`}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-600 mb-1 block">Subject</label>
            <input
              required
              maxLength={200}
              value={supportTicket?.subject || ''}
              onChange={event => setSupportTicket(prev => ({ ...prev, subject: event.target.value }))}
              placeholder="e.g., Help with Order #815899599 or Delivery Update"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-[#0B2419]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-600 mb-1 block">Your Message</label>
            <textarea
              required
              rows={4}
              maxLength={6000}
              value={supportTicket?.message || ''}
              onChange={event => setSupportTicket(prev => ({ ...prev, message: event.target.value }))}
              placeholder="Describe how our team can help you…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-[#0B2419]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleOpenLiveChat}
              className="px-4 py-2.5 rounded-xl border border-[#0B2419]/20 text-[#0B2419] hover:bg-stone-100 text-xs font-semibold"
            >
              Continue in Floating Live Chat
            </button>

            <button
              disabled={submitting}
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B2419] text-[#FDFBF7] text-xs font-semibold hover:bg-[#1e4031] disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
              {submitting ? 'Sending to Support…' : 'Send Message (Email & App Sync)'}
            </button>
          </div>
        </form>
      </section>

      {/* Active Conversation Timeline & Customer Satisfaction Review */}
      <section className="rounded-3xl bg-white border border-stone-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-serif font-bold text-[#0B2419] text-lg">
              Live Support Conversation & Replies
            </h3>
            <p className="text-xs text-stone-500">
              All messages exchanged via Web Chat, Mobile App, Email, and Telegram (@BhumiveraBot) appear here.
            </p>
          </div>
          {sessionData?.status && (
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-50 text-[#0B2419] border border-emerald-200">
              Status: {sessionData.status.replace(/_/g, ' ')}
            </span>
          )}
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {chatMessages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id || idx}
                className={`p-3.5 rounded-2xl text-xs max-w-[88%] ${
                  isUser
                    ? 'ml-auto bg-[#0B2419] text-white'
                    : 'mr-auto bg-stone-100 border border-stone-200 text-[#0B2419]'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-[10px] opacity-70 mb-1">
                  <span className="font-bold uppercase">
                    {isUser ? 'You' : msg.senderName || 'Bhumivera Support'}
                  </span>
                  <span>{formatDate(msg.createdAt)}</span>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            );
          })}
        </div>

        {/* Satisfied? End Chat & Submit Review to SuperAdmin */}
        {!reviewSubmitted && sessionData?.status !== 'closed' && (
          <form
            onSubmit={handleEndChatAndReview}
            className="mt-4 p-4 rounded-2xl bg-[#f8f6f0] border border-[#D4AF37]/40 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-[#0B2419] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Satisfied with our support reply? End Chat & Leave a Review
                </h4>
                <p className="text-[11px] text-stone-600">
                  Your rating and review are saved directly to our SuperAdmin quality board.
                </p>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= reviewRating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={reviewFeedback}
                onChange={e => setReviewFeedback(e.target.value)}
                placeholder="Write a brief review of your support experience (optional)…"
                className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-xs text-[#0B2419]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0B2419] text-[#D4AF37] font-semibold text-xs shrink-0"
              >
                End Chat & Submit Review ({reviewRating}★)
              </button>
            </div>
          </form>
        )}
      </section>

      {generalFaqs.length > 0 && (
        <section className="rounded-3xl bg-white border border-stone-200 p-6 shadow-sm">
          <h3 className="mb-4 font-serif font-bold text-[#0B2419] text-lg">Frequently Asked Questions</h3>
          <div className="space-y-2">
            {generalFaqs.map((item, index) => (
              <div key={item.q} className="rounded-xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                >
                  <span className="text-sm font-medium text-[#0B2419]">{item.q}</span>
                  <span className="text-stone-500">{faqOpen.has(index) ? '−' : '+'}</span>
                </button>
                {faqOpen.has(index) && (
                  <p className="px-4 pb-4 text-sm leading-relaxed text-stone-600">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
