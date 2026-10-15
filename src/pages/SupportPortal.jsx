import { useCallback, useEffect, useMemo, useState } from 'react';
import { supportPortal } from '../services/api';
import { LifeBuoy, LogOut, Mail, RefreshCw, Search, Send, ShieldCheck, UserRound } from 'lucide-react';

const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];
const formatDate = value => value ? new Date(value).toLocaleString() : '—';
const errorText = error => error.response?.data?.message || error.message || 'The request could not be completed.';

export default function SupportPortal() {
  const [agent, setAgent] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('supportToken') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [section, setSection] = useState('inbox');
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [reply, setReply] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadTickets = useCallback(async () => {
    const response = await supportPortal.tickets();
    setTickets(response.data.tickets || []);
  }, []);

  useEffect(() => {
    if (!token) return undefined;
    let active = true;
    Promise.all([supportPortal.me(), supportPortal.tickets()])
      .then(([profile, inbox]) => {
        if (!active) return;
        setAgent(profile.data.agent);
        setTickets(inbox.data.tickets || []);
        setError('');
      })
      .catch(requestError => {
        if (!active) return;
        localStorage.removeItem('supportToken');
        setToken('');
        setError(errorText(requestError));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);

  useEffect(() => {
    if (!token || !agent) return undefined;
    const timer = window.setInterval(() => {
      loadTickets().catch(requestError => setError(errorText(requestError)));
    }, 15000);
    return () => window.clearInterval(timer);
  }, [token, agent, loadTickets]);

  useEffect(() => {
    if (section !== 'customers' || search.trim().length < 2) {
      setCustomers([]);
      return undefined;
    }
    let active = true;
    const timer = window.setTimeout(() => {
      supportPortal.customers(search.trim())
        .then(response => { if (active) setCustomers(response.data.customers || []); })
        .catch(requestError => { if (active) setError(errorText(requestError)); });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [section, search]);

  const selectedTicket = useMemo(
    () => tickets.find(ticket => ticket.id === selectedTicketId),
    [tickets, selectedTicketId]
  );

  const signIn = async event => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await supportPortal.login({ username, password });
      localStorage.setItem('supportToken', response.data.token);
      setAgent(response.data.agent);
      setToken(response.data.token);
      setPassword('');
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setBusy(false);
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('supportToken');
    setToken('');
    setAgent(null);
    setTickets([]);
    setSelectedTicketId(null);
  };

  const selectCustomer = async customer => {
    setSelectedCustomer(customer);
    setCustomerDetails(null);
    setBusy(true);
    setError('');
    try {
      const response = await supportPortal.customer(customer.id);
      setCustomerDetails(response.data);
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setBusy(false);
    }
  };

  const updateTicket = async (status, message) => {
    if (!selectedTicket) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await supportPortal.updateTicket(selectedTicket.id, { status, ...(message ? { reply: message } : {}) });
      setReply('');
      await loadTickets();
      setNotice(response.data.emailSent === false ? 'Reply saved, but the customer email could not be sent.' : response.data.message);
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setBusy(false);
    }
  };

  const submitReply = event => {
    event.preventDefault();
    const message = reply.trim();
    if (!message) return;
    updateTicket('in_progress', message);
  };

  const sendEmail = async event => {
    event.preventDefault();
    if (!selectedCustomer || !emailSubject.trim() || !emailMessage.trim()) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await supportPortal.sendCustomerEmail(selectedCustomer.id, {
        subject: emailSubject.trim(),
        message: emailMessage.trim(),
      });
      setEmailSubject('');
      setEmailMessage('');
      setNotice(response.data.message);
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setBusy(false);
    }
  };

  const sendResetLink = async () => {
    if (!selectedCustomer) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await supportPortal.createPasswordResetLink(selectedCustomer.id);
      setNotice(response.data.message);
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setBusy(false);
    }
  };

  const toggleCustomerStatus = async () => {
    if (!customerDetails?.customer) return;
    const status = Number(customerDetails.customer.is_active) ? 'disabled' : 'active';
    setBusy(true);
    setError('');
    try {
      await supportPortal.updateCustomerStatus(customerDetails.customer.id, status);
      await selectCustomer(customerDetails.customer);
      setNotice(`Customer account ${status}.`);
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-[#07150f] text-slate-300">Loading secure support desk…</main>;

  if (!token || !agent) return (
    <main className="flex min-h-screen items-center justify-center bg-[#07150f] px-4 text-slate-100">
      <form onSubmit={signIn} className="w-full max-w-md space-y-5 rounded-3xl border border-emerald-400/20 bg-[#10241b] p-8 shadow-2xl">
        <div className="flex items-center gap-3"><span className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300"><LifeBuoy/></span><div><p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-300">Bhumivera</p><h1 className="text-2xl font-black">Support Desk</h1></div></div>
        <p className="text-sm leading-6 text-slate-400">Sign in with your support user ID. Customer information and support conversations are restricted to authorized staff.</p>
        {error && <p role="alert" className="rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}
        <label className="block text-sm text-slate-300">Support user ID<input required autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-[#081a13] px-4 py-3 text-white outline-none focus:border-emerald-400"/></label>
        <label className="block text-sm text-slate-300">Password<input required type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-[#081a13] px-4 py-3 text-white outline-none focus:border-emerald-400"/></label>
        <button disabled={busy} className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-bold text-[#07150f] disabled:opacity-50">{busy ? 'Signing in…' : 'Sign in securely'}</button>
        <p className="flex items-center justify-center gap-2 text-xs text-slate-500"><ShieldCheck size={14}/> Support session expires after 8 hours.</p>
      </form>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#07150f] text-slate-100">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#0b1d15] px-4 py-4 md:px-8">
        <div className="flex items-center gap-3"><LifeBuoy className="text-emerald-300"/><div><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-300">Bhumivera Concierge</p><h1 className="text-xl font-black">Customer support</h1></div></div>
        <div className="flex items-center gap-3"><span className="text-sm text-slate-400">{agent.name} · @{agent.username}</span><button type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"><LogOut size={15}/> Sign out</button></div>
      </header>
      <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 p-4 lg:border-b-0 lg:border-r">
          <nav className="flex gap-2 lg:flex-col">
            {[['inbox', 'Live inbox'], ['customers', 'Customer profiles']].map(([id, label]) => (
              <button key={id} type="button" onClick={() => { setSection(id); setSearch(''); setNotice(''); }} className={`rounded-xl px-4 py-3 text-left text-sm font-semibold ${section === id ? 'bg-emerald-400 text-[#07150f]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>{label}</button>
            ))}
          </nav>
          <div className="mt-6 hidden rounded-xl border border-white/10 p-4 text-xs leading-5 text-slate-500 lg:block"><p className="font-semibold text-slate-300">Privacy reminder</p>Verify the customer using approved account details before changing access or sending a password reset link.</div>
        </aside>
        <section className="min-w-0 p-4 md:p-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-bold">{section === 'inbox' ? 'Support inbox' : 'Customer lookup'}</h2><p className="mt-1 text-sm text-slate-500">{section === 'inbox' ? 'Ticket conversations refresh automatically every 15 seconds.' : 'Search by customer name, email, or phone number.'}</p></div>{section === 'inbox' && <button type="button" onClick={() => loadTickets().catch(requestError => setError(errorText(requestError)))} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"><RefreshCw size={15}/> Refresh</button>}</div>
          {error && <p role="alert" className="mb-4 rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}
          {notice && <p role="status" className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">{notice}</p>}
          {section === 'inbox' ? (
            <div className="grid min-h-[68vh] gap-4 xl:grid-cols-[minmax(270px,.75fr)_minmax(0,1.5fr)]">
              <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1d15]">
                <label className="relative block border-b border-white/10 p-3"><Search size={16} className="absolute left-6 top-6 text-slate-500"/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Filter tickets" className="w-full rounded-lg border border-white/10 bg-[#07150f] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-400"/></label>
                <div className="max-h-[68vh] divide-y divide-white/5 overflow-auto">
                  {tickets.filter(ticket => `${ticket.name} ${ticket.email} ${ticket.subject}`.toLowerCase().includes(search.toLowerCase())).map(ticket => <button key={ticket.id} type="button" onClick={() => { setSelectedTicketId(ticket.id); setNotice(''); }} className={`w-full p-4 text-left hover:bg-white/5 ${selectedTicketId === ticket.id ? 'bg-white/5' : ''}`}><div className="flex justify-between gap-2"><span className="truncate font-semibold text-white">{ticket.subject}</span><span className="shrink-0 text-[10px] uppercase text-emerald-300">{ticket.status?.replaceAll('_', ' ')}</span></div><p className="mt-1 truncate text-xs text-slate-400">{ticket.name} · {ticket.email}</p><p className="mt-2 line-clamp-2 text-xs text-slate-500">{ticket.message}</p><p className="mt-2 text-[10px] text-slate-600">#{ticket.id} · {formatDate(ticket.updated_at)}</p></button>)}
                  {!tickets.length && <p className="p-5 text-sm text-slate-500">No support tickets yet.</p>}
                </div>
              </section>
              <section className="flex min-h-[68vh] flex-col rounded-2xl border border-white/10 bg-[#0b1d15]">
                {!selectedTicket ? <div className="m-auto text-sm text-slate-500">Select a conversation to review it.</div> : <>
                  <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4"><div><h3 className="font-semibold">{selectedTicket.subject}</h3><p className="mt-1 text-xs text-slate-500">{selectedTicket.name} · {selectedTicket.email}{selectedTicket.order_id ? ` · Order #${selectedTicket.order_id}` : ''}</p></div><select aria-label="Ticket status" disabled={busy} value={selectedTicket.status} onChange={event => updateTicket(event.target.value)} className="rounded-lg border border-white/10 bg-[#07150f] px-3 py-2 text-xs">{STATUSES.map(status => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}</select></header>
                  <div className="flex-1 space-y-3 overflow-y-auto p-4">{(selectedTicket.messages || []).map(message => <article key={message.id} className={`max-w-[88%] rounded-2xl p-3 text-sm ${message.sender_type === 'customer' ? 'bg-white/5 text-slate-200' : 'ml-auto bg-emerald-400/10 text-emerald-100'}`}><p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{message.sender_type === 'customer' ? selectedTicket.name : 'Support'} · {formatDate(message.created_at)}</p><p className="whitespace-pre-wrap">{message.message}</p></article>)}</div>
                  <form onSubmit={submitReply} className="border-t border-white/10 p-3"><div className="flex gap-2"><textarea required maxLength={10000} rows={3} value={reply} onChange={event => setReply(event.target.value)} placeholder="Write a reply…" className="min-w-0 flex-1 resize-y rounded-xl border border-white/10 bg-[#07150f] p-3 text-sm outline-none focus:border-emerald-400"/><button disabled={busy || !reply.trim()} aria-label="Send reply" className="self-end rounded-xl bg-emerald-400 p-3 text-[#07150f] disabled:opacity-50"><Send size={18}/></button></div></form>
                </>}
              </section>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-[minmax(260px,.75fr)_minmax(0,1.5fr)]">
              <section className="rounded-2xl border border-white/10 bg-[#0b1d15] p-3">
                <label className="relative block"><Search size={16} className="absolute left-3 top-3 text-slate-500"/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Name, email, phone…" className="w-full rounded-lg border border-white/10 bg-[#07150f] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-400"/></label>
                <div className="mt-2 divide-y divide-white/5">{customers.map(customer => <button key={customer.id} type="button" onClick={() => selectCustomer(customer)} className={`w-full rounded-lg p-3 text-left hover:bg-white/5 ${selectedCustomer?.id === customer.id ? 'bg-white/5' : ''}`}><p className="font-semibold">{customer.name}</p><p className="mt-1 text-xs text-slate-500">{customer.email}</p><p className="mt-1 text-xs text-slate-600">{customer.phone || 'No phone'} · #{customer.id}</p></button>)}</div>
                {search.trim().length < 2 && <p className="p-3 text-xs text-slate-500">Type at least two characters.</p>}
                {search.trim().length >= 2 && !customers.length && <p className="p-3 text-xs text-slate-500">No matching customers.</p>}
              </section>
              <section className="space-y-4">
                {!selectedCustomer ? <div className="rounded-2xl border border-white/10 bg-[#0b1d15] p-8 text-center text-sm text-slate-500"><UserRound className="mx-auto mb-3 text-slate-600"/>Choose a customer to see their profile, orders, and previous cases.</div> : <>
                  <article className="rounded-2xl border border-white/10 bg-[#0b1d15] p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="text-xl font-bold">{customerDetails?.customer?.name || selectedCustomer.name}</h3><p className="mt-1 text-sm text-slate-400">{selectedCustomer.email} · {selectedCustomer.phone || 'No phone'} · Customer #{selectedCustomer.id}</p><p className="mt-2 text-xs text-slate-500">Joined {formatDate(customerDetails?.customer?.created_at)} · Wallet ₹{customerDetails?.customer?.wallet_balance ?? '—'} · Loyalty {customerDetails?.customer?.loyalty_points ?? '—'} points</p></div><button type="button" disabled={busy || !customerDetails} onClick={toggleCustomerStatus} className="rounded-lg border border-amber-400/30 px-3 py-2 text-xs text-amber-200 disabled:opacity-50">{Number(customerDetails?.customer?.is_active) ? 'Disable account' : 'Enable account'}</button></div>
                    <div className="mt-4 flex flex-wrap gap-2"><button type="button" disabled={busy} onClick={sendResetLink} className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-3 py-2 text-xs font-bold text-[#07150f] disabled:opacity-50"><ShieldCheck size={14}/> Email 30-minute reset link</button><a href={`mailto:${selectedCustomer.email}`} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5"><Mail size={14}/> Open email</a></div>
                  </article>
                  <article className="rounded-2xl border border-white/10 bg-[#0b1d15] p-5"><h4 className="mb-3 font-semibold">Order history</h4>{customerDetails?.orders?.length ? <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="text-slate-500"><tr><th className="pb-2">Order</th><th className="pb-2">Date</th><th className="pb-2">Items</th><th className="pb-2">Status</th><th className="pb-2">Payment</th><th className="pb-2">Tracking</th><th className="pb-2 text-right">Total</th></tr></thead><tbody className="divide-y divide-white/5">{customerDetails.orders.map(order => <tr key={order.id}><td className="py-3">#{order.order_number || order.id}</td><td className="py-3">{formatDate(order.created_at)}</td><td className="max-w-52 py-3">{order.items?.map(item => `${item.name} × ${item.quantity}`).join(', ') || '—'}</td><td className="py-3 capitalize">{order.status}</td><td className="py-3 capitalize">{order.payment_status || order.payment_mode || '—'}</td><td className="py-3">{order.courier || ''} {order.tracking_number || '—'}</td><td className="py-3 text-right">₹{order.total ?? '—'}</td></tr>)}</tbody></table></div> : <p className="text-sm text-slate-500">{busy ? 'Loading profile…' : 'No orders found.'}</p>}</article>
                  <article className="rounded-2xl border border-white/10 bg-[#0b1d15] p-5"><h4 className="mb-3 font-semibold">Send customer email</h4><form onSubmit={sendEmail} className="space-y-3"><input required maxLength={200} value={emailSubject} onChange={event => setEmailSubject(event.target.value)} placeholder="Subject" className="w-full rounded-lg border border-white/10 bg-[#07150f] px-3 py-2 text-sm outline-none focus:border-emerald-400"/><textarea required maxLength={10000} rows={4} value={emailMessage} onChange={event => setEmailMessage(event.target.value)} placeholder="Message" className="w-full rounded-lg border border-white/10 bg-[#07150f] p-3 text-sm outline-none focus:border-emerald-400"/><button disabled={busy} className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5 disabled:opacity-50">Send email</button></form></article>
                  <article className="rounded-2xl border border-white/10 bg-[#0b1d15] p-5"><h4 className="mb-3 font-semibold">Previous support requests</h4>{customerDetails?.tickets?.length ? <ul className="space-y-2">{customerDetails.tickets.map(ticket => <li key={ticket.id} className="flex justify-between gap-3 text-sm"><span>{ticket.subject}</span><span className="shrink-0 text-xs capitalize text-slate-500">{ticket.status?.replaceAll('_', ' ')}</span></li>)}</ul> : <p className="text-sm text-slate-500">No previous tickets.</p>}</article>
                </>}
              </section>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
