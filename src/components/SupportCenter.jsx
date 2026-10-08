import React, { useCallback, useEffect, useState } from 'react';
import { contact as contactApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { LifeBuoy, Mail, MessageSquare, Phone, RefreshCw, Send } from 'lucide-react';

const formatDate = value => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString();
};

export default function SupportCenter({ name, email, orders = [], supportTicket, setSupportTicket, onSubmit, faqItems, faqOpen, toggleFaq }) {
  const { showToast } = useToast() || {};
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [replyDrafts, setReplyDrafts] = useState({});
  const [sendingId, setSendingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const generalFaqs = faqItems.filter(item => !/warranty|10.year/i.test(`${item.q} ${item.a}`));
  const selectedOrder = orders.find(order => String(order.id) === String(supportTicket.order_id));
  const selectedItems = selectedOrder?.items || selectedOrder?.order_items || [];

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const response = await contactApi.getMine();
      const data = response.data?.data;
      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      setLoadError(error.response?.data?.message || 'Unable to load your support messages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTickets(); }, [loadTickets]);

  const handleSubmit = async event => {
    event.preventDefault();
    setSubmitting(true);
    const succeeded = await onSubmit(event);
    setSubmitting(false);
    if (succeeded) await loadTickets();
  };

  const handleReply = async (event, ticketId) => {
    event.preventDefault();
    const message = (replyDrafts[ticketId] || '').trim();
    if (!message) return;
    setSendingId(ticketId);
    try {
      await contactApi.reply(ticketId, message);
      setReplyDrafts(previous => ({ ...previous, [ticketId]: '' }));
      showToast?.('Reply sent.', 'success');
      await loadTickets();
    } catch (error) {
      showToast?.(error.response?.data?.message || 'Could not send your reply.', 'error');
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B2419] to-[#2C3E2D] p-6 text-white shadow-lg">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center mb-4">
              <LifeBuoy className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Customer Care</h3>
            <p className="text-sm text-stone-300 mb-5 leading-relaxed">Send us a message and continue the conversation here in your profile.</p>
            <div className="space-y-3">
              <a href="mailto:support@bhumivera.com" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                <Mail className="w-5 h-5 text-[#D4AF37]" />
                <span className="font-semibold">support@bhumivera.com</span>
              </a>
              {['7430985647', '8370804458'].map(phone => (
                <a key={phone} href={`tel:${phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                  <Phone className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-semibold">+91 {phone}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-3 rounded-2xl bg-white border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 mb-1">
            <MessageSquare className="w-5 h-5 text-[#3f503c]" />
            <div><h3 className="font-semibold text-[#0B2419] text-lg">Send us a Message</h3><p className="text-xs text-stone-500">We will reply to this account's support inbox.</p></div>
          </div>
          <div>
            <label htmlFor="support-order" className="text-xs font-semibold text-stone-600 mb-1.5 block">Related order (optional)</label>
            <select
              id="support-order"
              value={supportTicket.order_id || ''}
              onChange={event => setSupportTicket({ ...supportTicket, order_id: event.target.value, product_id: '' })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white focus:border-[#0B2419] text-sm"
            >
              <option value="">General question — no order</option>
              {orders.map(order => <option key={order.id} value={order.id}>Order #{order.id} · {String(order.status || 'processing').replaceAll('_', ' ')}</option>)}
            </select>
          </div>
          {selectedOrder && selectedItems.length > 0 && (
            <div>
              <label htmlFor="support-product" className="text-xs font-semibold text-stone-600 mb-1.5 block">Product (optional)</label>
              <select
                id="support-product"
                value={supportTicket.product_id || ''}
                onChange={event => setSupportTicket({ ...supportTicket, product_id: event.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white focus:border-[#0B2419] text-sm"
              >
                <option value="">Order-wide support</option>
                {selectedItems.map((item, index) => {
                  const productId = item.product_id || item.id;
                  return <option key={`${productId}-${index}`} value={productId}>{item.product_name || item.name || `Product #${productId}`}</option>;
                })}
              </select>
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Subject</label>
            <input
              required maxLength={200}
              value={supportTicket.subject}
              onChange={event => setSupportTicket({ ...supportTicket, subject: event.target.value })}
              placeholder="How can we help you today?"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#0B2419] focus:ring-4 focus:ring-[#0B2419]/5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Your message</label>
            <textarea
              required maxLength={10000} rows={5}
              value={supportTicket.message}
              onChange={event => setSupportTicket({ ...supportTicket, message: event.target.value })}
              placeholder="Include your order number or other details that may help us."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#0B2419] focus:ring-4 focus:ring-[#0B2419]/5 text-sm resize-y"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-stone-500">{name || email || 'Your account'}</span>
            <button disabled={submitting} type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B2419] text-[#FDFBF7] text-sm font-medium hover:bg-[#1e4031] disabled:opacity-50">
              <Send className="w-4 h-4" /> {submitting ? 'Sending…' : 'Send Message'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl bg-white border border-stone-200 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div><h3 className="font-semibold text-[#0B2419] text-lg">Your Support Messages</h3><p className="text-xs text-stone-500">Read replies and respond to your support team.</p></div>
          <button onClick={loadTickets} disabled={loading} className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50" aria-label="Refresh support messages">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {loading && <p className="text-sm text-stone-500">Loading your messages…</p>}
        {!loading && loadError && <p role="alert" className="text-sm text-rose-700">{loadError}</p>}
        {!loading && !loadError && tickets.length === 0 && <p className="text-sm text-stone-500">You have not sent a support message yet.</p>}
        <div className="space-y-4">
          {tickets.map(ticket => (
            <article key={ticket.id} className="rounded-xl border border-stone-200 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-stone-50 border-b border-stone-200">
                <div><h4 className="font-semibold text-[#0B2419]">{ticket.subject}</h4><p className="text-xs text-stone-500">Ticket #{ticket.id}{ticket.order_id ? ` · Order #${ticket.order_id}` : ''}{ticket.product_name ? ` · ${ticket.product_name}` : ''} · {formatDate(ticket.created_at)}</p></div>
                <span className="text-xs capitalize px-2.5 py-1 rounded-full bg-amber-50 text-amber-800">{String(ticket.status || 'open').replaceAll('_', ' ')}</span>
              </div>
              <div className="p-4 space-y-3">
                {(ticket.messages || []).map((message, index) => {
                  const fromSupport = message.sender_type === 'admin';
                  return (
                    <div key={message.id || `${ticket.id}-${index}`} className={`max-w-[92%] rounded-xl p-3 ${fromSupport ? 'bg-emerald-50 border border-emerald-100 mr-auto' : 'bg-stone-100 ml-auto'}`}>
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className="text-xs font-semibold text-[#0B2419]">{fromSupport ? 'Bhumivera Support' : 'You'}</span>
                        <span className="text-[11px] text-stone-500">{formatDate(message.created_at)}</span>
                      </div>
                      <p className="text-sm text-stone-700 whitespace-pre-wrap break-words">{message.message}</p>
                    </div>
                  );
                })}
                <form onSubmit={event => handleReply(event, ticket.id)} className="flex flex-col sm:flex-row gap-2 pt-2">
                  <textarea
                    rows={2} maxLength={10000} required
                    aria-label={`Reply to support ticket ${ticket.id}`}
                    value={replyDrafts[ticket.id] || ''}
                    onChange={event => setReplyDrafts(previous => ({ ...previous, [ticket.id]: event.target.value }))}
                    placeholder="Write a reply…"
                    className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-stone-200 text-sm focus:border-[#0B2419] focus:outline-none"
                  />
                  <button disabled={sendingId === ticket.id} type="submit" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#0B2419] text-white text-sm font-medium disabled:opacity-50">
                    <Send className="w-4 h-4" /> {sendingId === ticket.id ? 'Sending…' : 'Reply'}
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white border border-stone-200 p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-[#0B2419] text-lg">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {generalFaqs.map((item, index) => (
            <div key={item.q} className="rounded-xl border border-stone-200">
              <button type="button" onClick={() => toggleFaq(index)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
                <span className="text-sm font-medium text-[#0B2419]">{item.q}</span>
                <span className="text-stone-500">{faqOpen.has(index) ? '−' : '+'}</span>
              </button>
              {faqOpen.has(index) && <p className="px-4 pb-4 text-sm leading-relaxed text-stone-600">{item.a}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
