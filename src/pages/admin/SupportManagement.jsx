import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { support } from '../../services/api';
import { CheckCircle, Clock3, LifeBuoy, Mail, RefreshCw, Search, Send, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const formatDate = value => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString();
};

const isResolved = status => ['resolved', 'closed'].includes(String(status || '').toLowerCase());

export default function SupportManagement() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [reply, setReply] = useState('');
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast() || {};

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await support.getAllAdmin();
      const data = response.data?.data || response.data?.tickets || response.data;
      setTickets(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to load support requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTickets(); }, [loadTickets]);

  const selectedTicket = tickets.find(ticket => ticket.id === selectedId);
  const filtered = useMemo(() => tickets.filter(ticket => {
    const text = `${ticket.name || ''} ${ticket.email || ''} ${ticket.subject || ''} ${ticket.message || ''} ${ticket.order_id || ''} ${ticket.product_name || ''}`.toLowerCase();
    const matchesStatus = activeTab === 'all' ||
      (activeTab === 'open' && !isResolved(ticket.status)) ||
      (activeTab === 'resolved' && isResolved(ticket.status));
    return matchesStatus && text.includes(searchTerm.toLowerCase());
  }), [tickets, searchTerm, activeTab]);

  const saveStatus = async (ticket, status) => {
    try {
      await support.updateStatus(ticket.id, status);
      showToast?.(`Ticket marked ${status.replaceAll('_', ' ')}.`, 'success');
      await loadTickets();
    } catch (requestError) {
      showToast?.(requestError.response?.data?.message || 'Failed to update ticket status.', 'error');
    }
  };

  const sendReply = async event => {
    event.preventDefault();
    const message = reply.trim();
    if (!selectedTicket || !message) return;
    setSaving(true);
    try {
      const response = await support.updateStatus(selectedTicket.id, 'in_progress', message);
      setReply('');
      await loadTickets();
      if (response.data?.emailSent === false) {
        showToast?.(response.data.emailError || 'Reply saved, but the notification email was not sent.', 'error');
      } else {
        showToast?.('Reply sent and the customer email notification was submitted.', 'success');
      }
    } catch (requestError) {
      showToast?.(requestError.response?.data?.message || 'Failed to send the reply.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteTicket = async ticket => {
    if (!window.confirm(`Delete support ticket #${ticket.id}? This cannot be undone.`)) return;
    try {
      await support.delete(ticket.id);
      if (selectedId === ticket.id) setSelectedId(null);
      await loadTickets();
      showToast?.('Support ticket deleted.', 'success');
    } catch (requestError) {
      showToast?.(requestError.response?.data?.message || 'Failed to delete ticket.', 'error');
    }
  };

  if (loading && !tickets.length) return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-slate-400">
      <RefreshCw className="animate-spin text-cyan-400" size={28} />
      <p>Loading support messages…</p>
    </div>
  );

  return (
    <div className="min-h-screen space-y-6 bg-[#030712] p-6 text-slate-300 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3"><LifeBuoy className="text-cyan-400" size={26} /></div>
          <div><h1 className="text-3xl font-black uppercase tracking-tight text-white">Support Inbox</h1><p className="text-xs text-slate-500">Customer messages and in-app conversations</p></div>
        </div>
        <button onClick={loadTickets} className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-xs font-bold uppercase text-black hover:bg-cyan-400">
          <RefreshCw size={15} /> Refresh
        </button>
      </header>

      {error && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</p>}

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['All requests', tickets.length],
          ['Open', tickets.filter(ticket => !isResolved(ticket.status)).length],
          ['Resolved', tickets.filter(ticket => isResolved(ticket.status)).length]
        ].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-xs font-bold uppercase text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-white">{value}</p></div>)}
      </section>

      <div className="grid min-h-[60vh] gap-5 xl:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.5fr)]">
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
          <div className="space-y-3 border-b border-slate-800 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Search messages…" className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-cyan-500" />
            </div>
            <div className="flex gap-1 rounded-lg bg-slate-950 p-1">
              {['all', 'open', 'resolved'].map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 rounded-md py-2 text-xs font-bold capitalize ${activeTab === tab ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'}`}>{tab}</button>)}
            </div>
          </div>
          <div className="max-h-[70vh] overflow-y-auto divide-y divide-slate-800">
            {filtered.map(ticket => (
              <button key={ticket.id} onClick={() => { setSelectedId(ticket.id); setReply(''); }} className={`w-full p-4 text-left hover:bg-slate-800/60 ${selectedId === ticket.id ? 'bg-slate-800/80' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{ticket.subject || 'Support request'}</p>
                    <p className="mt-1 truncate text-xs text-slate-400">{ticket.name} · {ticket.email}{ticket.order_id ? ` · Order #${ticket.order_id}` : ''}</p>
                    {ticket.product_name && <p className="mt-1 truncate text-[11px] text-cyan-300">Product: {ticket.product_name}</p>}
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase ${isResolved(ticket.status) ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-300'}`}>{String(ticket.status || 'open').replaceAll('_', ' ')}</span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-slate-400">{ticket.message}</p>
                <p className="mt-3 flex items-center gap-1 text-[11px] text-slate-500"><Clock3 size={12} /> {formatDate(ticket.updated_at || ticket.created_at)}</p>
              </button>
            ))}
            {!filtered.length && <p className="p-6 text-center text-sm text-slate-500">No support requests found.</p>}
          </div>
        </section>

        <section className="flex min-h-[55vh] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
          {!selectedTicket ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-slate-500"><Mail size={32} /><p>Select a customer request to read and reply.</p></div>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 p-5">
                <div><p className="text-xs font-bold uppercase text-cyan-400">Ticket #{selectedTicket.id}{selectedTicket.order_id ? ` · Order #${selectedTicket.order_id}` : ''}</p><h2 className="mt-1 text-xl font-bold text-white">{selectedTicket.subject}</h2><p className="mt-1 text-sm text-slate-400">{selectedTicket.name} · <a className="hover:text-cyan-300" href={`mailto:${selectedTicket.email}`}>{selectedTicket.email}</a>{selectedTicket.product_name ? ` · Product: ${selectedTicket.product_name}` : ''}</p></div>
                <div className="flex gap-2">
                  <button onClick={() => saveStatus(selectedTicket, isResolved(selectedTicket.status) ? 'open' : 'resolved')} className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/10">
                    <CheckCircle size={14} /> {isResolved(selectedTicket.status) ? 'Reopen' : 'Resolve'}
                  </button>
                  <button onClick={() => deleteTicket(selectedTicket)} className="rounded-lg border border-rose-500/30 p-2 text-rose-300 hover:bg-rose-500/10" aria-label="Delete ticket"><Trash2 size={15} /></button>
                </div>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {(selectedTicket.messages || []).map((message, index) => {
                  const fromSupport = message.sender_type === 'admin';
                  return <article key={message.id || index} className={`max-w-[90%] rounded-xl border p-4 ${fromSupport ? 'mr-auto border-cyan-500/20 bg-cyan-500/5' : 'ml-auto border-slate-700 bg-slate-950/70'}`}>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><span className={`text-xs font-bold ${fromSupport ? 'text-cyan-300' : 'text-slate-200'}`}>{fromSupport ? 'Support team' : selectedTicket.name}</span><span className="text-[11px] text-slate-500">{formatDate(message.created_at)}</span></div>
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-300">{message.message}</p>
                  </article>;
                })}
              </div>
              <form onSubmit={sendReply} className="space-y-3 border-t border-slate-800 bg-slate-950/50 p-5">
                <label htmlFor="support-reply" className="text-xs font-bold uppercase tracking-wider text-slate-400">Reply to customer</label>
                <textarea id="support-reply" required maxLength={10000} rows={4} value={reply} onChange={event => setReply(event.target.value)} placeholder="Write a reply. The customer can read and respond in Profile > Support." className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-cyan-500" />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">An email notification will be attempted after saving.</p>
                  <button disabled={saving || !reply.trim()} type="submit" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black hover:bg-cyan-400 disabled:opacity-50">
                    <Send size={15} /> {saving ? 'Sending…' : 'Send Reply'}
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
