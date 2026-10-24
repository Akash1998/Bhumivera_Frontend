import React, { useCallback, useEffect, useState } from 'react';
import { aiSupport, contact as contactApi } from '../services/api';
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

  const handleSendUnifiedMessage = async e => {
    e.preventDefault();
    const msg = supportTicket?.message?.trim();
    if (!msg) return;

    setSubmitting(true);
    try {
      const ordNum = selectedOrder?.order_number || selectedOrder?.id || supportTicket?.order_id || '';
      const subj =
        supportTicket?.subject?.trim() ||
        (ordNum ? `Assistance with Order #${ordNum}` : 'Direct Account Inquiry');

      await Promise.allSettled([
        contactApi.submit({
          name: name || 'Customer',
          email: email || '',
          subject: subj,
          message: msg,
          order_id: supportTicket?.order_id || null,
          product_id: supportTicket?.product_id || null,
        }),
        aiSupport.sendMessage({
          sessionToken,
          message: msg,
          orderContext: supportTicket?.order_id
            ? {
                orderId: supportTicket.order_id,
                orderNumber: ordNum,
                status: selectedOrder?.status,
              }
            : undefined,
        }),
      ]);

      if (showToast) {
        showToast(
          'Message sent to the Concierge support team!',
          'success'
        );
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `tmp_${Date.now()}`,
          sender: 'user',
          content: msg,
          createdAt: new Date().toISOString(),
        },
      ]);

      setSupportTicket(prev => ({
        ...prev,
        message: '',
        subject: '',
      }));
    } catch {
      if (showToast) {
        showToast('Unable to send message right now. Please try again.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEndChatAndReview = async e => {
    e.preventDefault();
    if (!sessionToken) return;
    try {
      await aiSupport.endSession({
        sessionToken,
        rating: reviewRating,
        feedback: reviewFeedback,
      });
      setReviewSubmitted(true);
      if (showToast) {
        showToast('Thank you for rating our concierge team!', 'success');
      }
    } catch {
      if (showToast) {
        showToast('Could not submit review at this moment.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 text-[#e2e8f0] font-sans">
      {/* 2-Tone Concierge Hero Header */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="two-tone-panel-gold lg:col-span-5 rounded-3xl p-7 relative overflow-hidden flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-sub-gold inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/35 text-[10px] font-semibold uppercase tracking-[0.22em]">
                <ShieldCheck className="w-3.5 h-3.5" /> Direct Concierge Channel
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#cbd5e1]">
                <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" /> Live Team
              </span>
            </div>

            <h2 className="mt-4 font-serif font-bold text-2xl sm:text-3xl tracking-tight">
              <span className="font-headline-gold">Artisanal</span>{' '}
              <span className="font-headline-silver">Concierge Desk</span>
            </h2>
            <div className="gold-hairline w-24 my-3" />
            <p className="mt-2 text-xs text-[#cbd5e1] leading-relaxed font-light">
              Direct line to our compounding apothecaries and logistics leads. Messages synchronize across our real-time Web Desk and customer support team.
            </p>

            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                onClick={handleOpenLiveChat}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b38728] text-[#070a0e] font-semibold text-xs shadow-md hover:brightness-110 transition"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#070a0e]" />
                  Launch Dedicated AI Concierge Chat
                </span>
                <span>Launch &rarr;</span>
              </button>

              <a
                href="mailto:support@bhumivera.com"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#070a0e]/60 hover:bg-[#070a0e] border border-[#d4af37]/20 text-xs text-[#cbd5e1] hover:text-white transition"
              >
                <Mail className="w-4 h-4 text-[#d4af37]" />
                <span>support@bhumivera.com</span>
              </a>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#d4af37]/20 text-[11px] text-[#94a3b8] flex items-center justify-between">
            <span>Encrypted Concierge Ledger</span>
            <span className="text-[#fce096]">Status: {sessionData?.status ? sessionData.status.toUpperCase() : 'ACTIVE'}</span>
          </div>
        </div>

        {/* Unified Order & Support Message Composer */}
        <form
          onSubmit={handleSendUnifiedMessage}
          className="two-tone-panel lg:col-span-7 rounded-3xl p-7 border border-[#d4af37]/25 space-y-4"
        >
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#d4af37]/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg">
                  <span className="font-headline-gold">Message</span>{' '}
                  <span className="font-headline-silver">Bhumivera Support</span>
                </h3>
                <p className="text-[11px] text-[#94a3b8]">
                  Synced directly with Live Chat and Email ({email || 'account'}).
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={loadUnifiedSupportChannel}
              className="p-2 rounded-xl border border-[#d4af37]/25 text-[#cbd5e1] hover:bg-white/5 transition-colors"
              title="Refresh conversation"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#d4af37]' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="support-order" className="text-xs font-medium text-[#cbd5e1] mb-1 block uppercase tracking-wider">
                Select Order (Optional)
              </label>
              <select
                id="support-order"
                value={supportTicket?.order_id || ''}
                onChange={event =>
                  setSupportTicket(prev => ({ ...prev, order_id: event.target.value, product_id: '' }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="" className="bg-[#0d1520] text-white">General Inquiry — No specific order</option>
                {orders.map(order => (
                  <option key={order.id} value={order.id} className="bg-[#0d1520] text-white">
                    Order #{order.order_number || order.id} &bull; {String(order.status || 'placed').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="support-product" className="text-xs font-medium text-[#cbd5e1] mb-1 block uppercase tracking-wider">
                Select Formulation (Optional)
              </label>
              <select
                id="support-product"
                value={supportTicket?.product_id || ''}
                disabled={!selectedOrder || selectedItems.length === 0}
                onChange={event =>
                  setSupportTicket(prev => ({ ...prev, product_id: event.target.value }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-xs text-white disabled:opacity-40 focus:outline-none focus:border-[#d4af37]"
              >
                <option value="" className="bg-[#0d1520] text-white">Select a specific item from order</option>
                {selectedItems.map((item, index) => {
                  const itemId = item.product_id || item.id || `item_${index}`;
                  const itemName = item.name || item.product_name || `Item #${itemId}`;
                  return (
                    <option key={itemId} value={String(itemId)} className="bg-[#0d1520] text-white">
                      {itemName}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#cbd5e1] mb-1 block uppercase tracking-wider">Subject</label>
            <input
              type="text"
              maxLength={200}
              value={supportTicket?.subject || ''}
              onChange={event => setSupportTicket(prev => ({ ...prev, subject: event.target.value }))}
              placeholder="e.g. Question on application timing, packaging check, or address correction"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-xs text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#cbd5e1] mb-1 block uppercase tracking-wider">Your Message</label>
            <textarea
              required
              rows={4}
              maxLength={6000}
              value={supportTicket?.message || ''}
              onChange={event => setSupportTicket(prev => ({ ...prev, message: event.target.value }))}
              placeholder="Describe how our team can help you…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-xs text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#d4af37] resize-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleOpenLiveChat}
              className="btn-silver-luxury px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider"
            >
              Continue in Floating Live Chat
            </button>

            <button
              disabled={submitting}
              type="submit"
              className="btn-gold-luxury inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-[#070a0e]" />
              {submitting ? 'Sending to Support…' : 'Send Message (Email & App Sync)'}
            </button>
          </div>
        </form>
      </section>

      {/* Active Conversation Timeline & Customer Satisfaction Review */}
      <section className="two-tone-panel rounded-3xl p-6 border border-[#d4af37]/25 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d4af37]/20 pb-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-white">
              Live Support Conversation &amp; Replies
            </h3>
            <p className="text-xs text-[#94a3b8]">
              All messages exchanged via Web Chat, Mobile App, and Email appear here.
            </p>
          </div>
          {sessionData?.status && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#d4af37]/15 text-[#fce096] border border-[#d4af37]/35">
              Status: {sessionData.status.replace(/_/g, ' ')}
            </span>
          )}
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {chatMessages.length === 0 ? (
            <p className="text-xs text-[#94a3b8] py-4 text-center">No messages yet. Send a message above to start a conversation.</p>
          ) : (
            chatMessages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id || idx}
                  className={`p-3.5 rounded-2xl text-xs max-w-[88%] ${
                    isUser
                      ? 'ml-auto bg-gradient-to-r from-[#d4af37] to-[#b38728] text-[#070a0e] font-medium'
                      : 'mr-auto bg-[#101a26] border border-[#d4af37]/20 text-[#e2e8f0]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 mb-1">
                    <span className="font-bold uppercase tracking-wider">
                      {isUser ? 'You' : msg.senderName || 'Bhumivera Support'}
                    </span>
                    <span>{formatDate(msg.createdAt)}</span>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              );
            })
          )}
        </div>

        {/* Satisfied? End Chat & Submit Review to SuperAdmin */}
        {!reviewSubmitted && sessionData?.status !== 'closed' && (
          <form
            onSubmit={handleEndChatAndReview}
            className="mt-4 p-4 rounded-2xl bg-[#070a0e]/80 border border-[#d4af37]/30 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                  Satisfied with our support reply? End Chat &amp; Leave a Review
                </h4>
                <p className="text-[11px] text-[#cbd5e1] font-light">
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
                        star <= reviewRating ? 'fill-[#d4af37] text-[#d4af37]' : 'text-[#94a3b8]/40'
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
                className="flex-1 px-3.5 py-2 rounded-xl border border-[#d4af37]/25 bg-[#070a0e] text-xs text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="submit"
                className="btn-gold-luxury px-4 py-2 rounded-xl font-semibold text-xs shrink-0 uppercase tracking-wider"
              >
                End Chat &amp; Submit Review ({reviewRating}&#9733;)
              </button>
            </div>
          </form>
        )}
      </section>

      {generalFaqs.length > 0 && (
        <section className="two-tone-panel rounded-3xl p-6 border border-[#d4af37]/25">
          <h3 className="mb-4 font-serif font-bold text-lg text-white">Frequently Asked Questions</h3>
          <div className="space-y-2">
            {generalFaqs.map((item, index) => (
              <div key={item.q} className="rounded-xl border border-[#d4af37]/15 bg-[#070a0e]/50">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                >
                  <span className="text-sm font-medium text-white">{item.q}</span>
                  <span className="text-[#d4af37] text-lg font-bold">{faqOpen.has(index) ? '−' : '+'}</span>
                </button>
                {faqOpen.has(index) && (
                  <p className="px-4 pb-4 text-sm leading-relaxed text-[#cbd5e1] font-light border-t border-[#d4af37]/10 pt-3">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
