import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, Ban, CheckCircle, ChevronLeft, ChevronRight, Eye, Gift, Mail,
  Key, RefreshCw, Search, Shield, Users, X
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const PAGE_SIZE = 25;
const money = value => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const csvCell = value => {
  const text = String(value ?? '');
  const safeText = /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({ total: 0, active: 0, disabled: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [activity, setActivity] = useState('all');
  const [sort, setSort] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeMode, setNoticeMode] = useState('notification');
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [sendingNotice, setSendingNotice] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [resettingPasswordId, setResettingPasswordId] = useState(null);
  const { showToast } = useToast() || {};
  const selectedUserId = selectedUser?.id;

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get('/admin/users', {
      params: { page, limit: PAGE_SIZE, search: debouncedSearch, status, activity, sort }
    }).then(({ data }) => {
      if (cancelled) return;
      setUsers(Array.isArray(data?.users) ? data.users : []);
      setSummary(data?.summary || { total: 0, active: 0, disabled: 0 });
      setPagination(data?.pagination || { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
    }).catch(() => {
      if (!cancelled) showToast?.('Could not load customers. Please try again.', 'error');
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [page, debouncedSearch, status, activity, sort, refreshKey, showToast]);

  useEffect(() => {
    if (!selectedUserId) return undefined;
    let cancelled = false;
    setOrdersLoading(true);
    Promise.all([
      api.get(`/admin/users/${selectedUserId}`),
      api.get(`/admin/users/${selectedUserId}/orders`)
    ]).then(([userResponse, orderResponse]) => {
      if (cancelled) return;
      setSelectedUser(current => ({ ...current, ...userResponse.data }));
      setCustomerOrders(Array.isArray(orderResponse.data) ? orderResponse.data : []);
    }).catch(() => {
      if (!cancelled) {
        setCustomerOrders([]);
        showToast?.('Could not load customer details or order history.', 'error');
      }
    }).finally(() => {
      if (!cancelled) setOrdersLoading(false);
    });
    return () => { cancelled = true; };
  }, [selectedUserId, showToast]);

  const pageIds = useMemo(() => users.map(user => Number(user.id)), [users]);
  const allPageSelected = pageIds.length > 0 && pageIds.every(id => selectedIds.includes(id));
  const togglePageSelection = () => {
    if (!allPageSelected && selectedIds.length + pageIds.filter(id => !selectedIds.includes(id)).length > 500) {
      showToast?.('Bulk notifications can target up to 500 customers at a time.', 'error');
      return;
    }
    setSelectedIds(current => allPageSelected
      ? current.filter(id => !pageIds.includes(id))
      : [...new Set([...current, ...pageIds])]);
  };
  const toggleCustomerSelection = id => {
    if (!selectedIds.includes(id) && selectedIds.length >= 500) {
      showToast?.('Bulk notifications can target up to 500 customers at a time.', 'error');
      return;
    }
    setSelectedIds(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  };

  const changeFilter = setter => event => {
    setter(event.target.value);
    setPage(1);
  };

  const toggleStatus = async user => {
    const id = Number(user.id);
    const nextStatus = Number(user.is_active) === 1 ? 'disabled' : 'active';
    const action = nextStatus === 'disabled' ? 'disable' : 'reactivate';
    if (!window.confirm(`Are you sure you want to ${action} ${user.name || user.email}'s account?`)) return;
    setUpdatingId(id);
    try {
      const { data } = await api.put(`/admin/users/${id}/status`, { status: nextStatus });
      const isActive = Number(data?.is_active) === 1;
      const update = customer => customer.id === id ? { ...customer, is_active: isActive ? 1 : 0 } : customer;
      setUsers(current => current.map(update));
      setSelectedUser(current => current?.id === id ? update(current) : current);
      setSummary(current => ({
        ...current,
        active: current.active + (isActive ? 1 : -1),
        disabled: current.disabled + (isActive ? -1 : 1)
      }));
      setPage(1);
      setRefreshKey(value => value + 1);
      showToast?.(`Customer account ${isActive ? 'reactivated' : 'disabled'}.`, 'success');
    } catch (error) {
      showToast?.(error.response?.data?.message || 'Could not update customer status.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const sendNotification = async event => {
    event.preventDefault();
    if (noticeMode === 'email' && !window.confirm('Send this email campaign to the selected customers who opted in?')) return;
    setSendingNotice(true);
    try {
      const endpoint = noticeMode === 'email'
        ? '/admin/users/email-campaigns'
        : '/admin/users/notifications';
      const { data } = await api.post(endpoint, {
        userIds: selectedIds,
        title: noticeTitle,
        message: noticeMessage,
        ...(noticeMode === 'notification' ? { type: 'promotion' } : {})
      }, { notify: false });
      showToast?.(
        noticeMode === 'email'
          ? data.message || `Campaign sent to ${data.recipientCount} opted-in customer(s).`
          : `Notification sent to ${data.recipientCount} customer(s).`,
        'success'
      );
      setSelectedIds([]);
      setNoticeOpen(false);
      setNoticeTitle('');
      setNoticeMessage('');
    } catch (error) {
      showToast?.(error.response?.data?.message || 'Could not send customer notification.', 'error');
    } finally {
      setSendingNotice(false);
    }
  };

  const sendPasswordResetOtp = async customer => {
    if (customer.role !== 'customer') return;
    if (!window.confirm(`Send a password reset OTP to ${customer.email}?`)) return;
    setResettingPasswordId(Number(customer.id));
    try {
      const { data } = await api.post(`/admin/users/${customer.id}/reset-password`);
      showToast?.(data?.message || `Password reset OTP sent to ${customer.email}.`, 'success');
    } catch (error) {
      showToast?.(error.response?.data?.message || 'Could not send password reset OTP.', 'error');
    } finally {
      setResettingPasswordId(null);
    }
  };

  const exportCurrentPage = () => {
    const csvRows = [
      ['Name', 'Email', 'Phone', 'Status', 'Orders', 'Lifetime value', 'Loyalty points', 'Joined'],
      ...users.map(user => [
        user.name, user.email, user.phone || '', Number(user.is_active) === 1 ? 'Active' : 'Disabled',
        user.order_count, user.total_spent, user.loyalty_points, user.created_at
      ])
    ];
    const csv = csvRows.map(row => row.map(csvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `bhumivera-customers-page-${page}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Number(pagination.totalPages || 0);

  return (
    <div className="space-y-5 text-slate-200">
      <header className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-black uppercase text-white md:text-3xl">
            <Users className="text-cyan-400" /> Customer management
          </h1>
          <p className="mt-2 text-sm text-slate-400">Search customer accounts, review their orders, and manage account access.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setRefreshKey(value => value + 1)} aria-label="Refresh customers" className="rounded-xl border border-slate-700 bg-[#10241f]/85 backdrop-blur-xl p-3 text-slate-300 hover:border-cyan-500">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={exportCurrentPage} disabled={!users.length} className="rounded-xl border border-slate-700 bg-[#10241f]/85 backdrop-blur-xl px-4 py-2 text-sm font-semibold hover:border-cyan-500 disabled:opacity-40">
            Export this page
          </button>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          ['All customers', summary.total, Users],
          ['Active accounts', summary.active, CheckCircle],
          ['Disabled accounts', summary.disabled, Ban]
        ].map(([label, value, Icon]) => (
          <div key={label} className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-[#10241f]/65 backdrop-blur-xl p-5">
            {React.createElement(Icon, { className: 'text-cyan-400', size: 22 })}
            <div><p className="text-xs uppercase tracking-widest text-slate-500">{label}</p><p className="mt-1 text-2xl font-black text-white">{Number(value || 0).toLocaleString()}</p></div>
          </div>
        ))}
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-[#10241f]/45 backdrop-blur-xl p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_repeat(3,minmax(150px,auto))]">
          <label className="relative">
            <Search size={17} className="absolute left-3 top-3.5 text-slate-500" />
            <input aria-label="Search customers" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} placeholder="Name, email, or phone" className="w-full rounded-xl border border-slate-700 bg-[#081b15]/90 backdrop-blur-xl py-3 pl-10 pr-3 text-sm outline-none focus:border-cyan-500" />
          </label>
          <select aria-label="Account status" value={status} onChange={changeFilter(setStatus)} className="rounded-xl border border-slate-700 bg-[#081b15]/90 backdrop-blur-xl px-3 py-3 text-sm">
            <option value="all">All account statuses</option><option value="active">Active</option><option value="disabled">Disabled</option>
          </select>
          <select aria-label="Order and loyalty filter" value={activity} onChange={changeFilter(setActivity)} className="rounded-xl border border-slate-700 bg-[#081b15]/90 backdrop-blur-xl px-3 py-3 text-sm">
            <option value="all">All customers</option><option value="ordered">Has orders</option><option value="no-orders">No orders</option><option value="loyalty">Has loyalty points</option>
          </select>
          <select aria-label="Sort customers" value={sort} onChange={changeFilter(setSort)} className="rounded-xl border border-slate-700 bg-[#081b15]/90 backdrop-blur-xl px-3 py-3 text-sm">
            <option value="recent">Recently joined</option><option value="orders">Most orders</option><option value="loyalty">Most loyalty points</option><option value="value">Highest lifetime value</option>
          </select>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan-900 bg-cyan-950/30 p-3">
            <span className="text-sm font-semibold text-cyan-200">{selectedIds.length} customer(s) selected</span>
            <div className="flex gap-2">
              <button onClick={() => { setNoticeOpen(noticeMode === 'notification' ? !noticeOpen : true); setNoticeMode('notification'); }} className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-bold text-slate-950"><Mail size={16} /> Send in-app promo</button>
              <button onClick={() => { setNoticeOpen(noticeMode === 'email' ? !noticeOpen : true); setNoticeMode('email'); }} className="inline-flex items-center gap-2 rounded-lg border border-cyan-700 px-3 py-2 text-sm font-bold text-cyan-200 hover:bg-cyan-950"><Mail size={16} /> Email campaign</button>
              <button onClick={() => setSelectedIds([])} className="rounded-lg border border-slate-700 px-3 py-2 text-sm">Clear</button>
            </div>
          </div>
        )}
        {noticeOpen && (
          <form onSubmit={sendNotification} className="grid gap-3 rounded-xl border border-slate-700 bg-[#081b15]/90 backdrop-blur-xl p-4">
            <p className="text-sm text-slate-400">
              {noticeMode === 'email'
                ? 'Email is sent only to selected customers who explicitly opted in. Customers who have not opted in or have opted out are excluded. The email includes a link to manage preferences.'
                : 'Send an in-app promotional notification to the selected customer accounts.'}
            </p>
            <input value={noticeTitle} onChange={event => setNoticeTitle(event.target.value)} maxLength={noticeMode === 'email' ? 200 : 255} required placeholder={noticeMode === 'email' ? 'Email subject' : 'Notification title'} className="rounded-lg border border-slate-700 bg-[#10241f]/85 backdrop-blur-xl px-3 py-2 text-sm" />
            <textarea value={noticeMessage} onChange={event => setNoticeMessage(event.target.value)} maxLength={noticeMode === 'email' ? 10000 : 5000} required rows={3} placeholder={noticeMode === 'email' ? 'Email message' : 'Notification message'} className="rounded-lg border border-slate-700 bg-[#10241f]/85 backdrop-blur-xl px-3 py-2 text-sm" />
            <div><button disabled={sendingNotice} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-50">{sendingNotice ? 'Sending…' : noticeMode === 'email' ? `Email selected customers who opted in` : `Send to ${selectedIds.length} selected`}</button></div>
          </form>
        )}

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-[#081b15]/90 backdrop-blur-xl text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="p-4"><input aria-label="Select current page" type="checkbox" checked={allPageSelected} onChange={togglePageSelection} /></th>
                <th className="p-4">Customer</th><th className="p-4">Status</th><th className="p-4">Orders / value</th><th className="p-4">Loyalty</th><th className="p-4">Joined</th><th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan="7" className="p-10 text-center text-slate-400">Loading customers…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="7" className="p-10 text-center text-slate-400">No customers found for these filters.</td></tr>
              ) : users.map(user => {
                const id = Number(user.id);
                const active = Number(user.is_active) === 1;
                return (
                  <tr key={id} className="hover:bg-slate-800/40">
                    <td className="p-4"><input aria-label={`Select ${user.name || user.email}`} type="checkbox" checked={selectedIds.includes(id)} onChange={() => toggleCustomerSelection(id)} /></td>
                    <td className="p-4"><p className="font-semibold text-white">{user.name}</p><p className="mt-1 text-xs text-slate-400">{user.email}</p><p className="text-xs text-slate-500">{user.phone || 'No phone on file'}</p></td>
                    <td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${active ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>{active ? 'Active' : 'Disabled'}</span></td>
                    <td className="p-4"><span className="font-semibold text-white">{Number(user.order_count || 0)} orders</span><span className="block text-xs text-emerald-300">{money(user.total_spent)}</span></td>
                    <td className="p-4"><span className="inline-flex items-center gap-1 text-amber-300"><Gift size={14} />{Number(user.loyalty_points || 0)}</span><span className="block text-xs text-slate-500">points</span></td>
                    <td className="p-4 text-xs text-slate-400">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</td>
                    <td className="p-4"><div className="flex gap-2">
                      <button onClick={() => setSelectedUser(user)} aria-label={`View ${user.name || user.email}`} className="rounded-lg border border-slate-700 p-2 text-cyan-300 hover:border-cyan-500"><Eye size={16} /></button>
                      <button disabled={updatingId === id} onClick={() => toggleStatus(user)} aria-label={active ? 'Disable customer' : 'Reactivate customer'} className="rounded-lg border border-slate-700 p-2 text-amber-300 hover:border-amber-500 disabled:opacity-50">{active ? <Ban size={16} /> : <CheckCircle size={16} />}</button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
          <span>{pagination.total ? `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, pagination.total)} of ${Number(pagination.total).toLocaleString()} customers` : 'No customers'}</span>
          <div className="flex items-center gap-3">
            <span>Page {page} of {Math.max(1, totalPages)}</span>
            <button aria-label="Previous page" disabled={page <= 1 || loading} onClick={() => setPage(value => value - 1)} className="rounded-lg border border-slate-700 p-2 disabled:opacity-40"><ChevronLeft size={17} /></button>
            <button aria-label="Next page" disabled={page >= totalPages || loading} onClick={() => setPage(value => value + 1)} className="rounded-lg border border-slate-700 p-2 disabled:opacity-40"><ChevronRight size={17} /></button>
          </div>
        </div>
      </section>

      {selectedUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[#081b15]/90 backdrop-blur-xl/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Customer details">
          <div className="my-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-[#10241f]/85 backdrop-blur-xl shadow-2xl">
            <div className="sticky top-0 flex items-start justify-between border-b border-slate-700 bg-[#10241f]/85 backdrop-blur-xl p-5">
              <div><h2 className="text-xl font-bold text-white">{selectedUser.name}</h2><p className="mt-1 text-sm text-slate-400">{selectedUser.email} {selectedUser.phone ? `· ${selectedUser.phone}` : ''}</p>
                {selectedUser.role === 'customer' && <button disabled={resettingPasswordId === Number(selectedUser.id)} onClick={() => sendPasswordResetOtp(selectedUser)} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-cyan-300 hover:border-cyan-500 disabled:opacity-50"><Key size={14} />{resettingPasswordId === Number(selectedUser.id) ? 'Sending OTP…' : 'Send password reset OTP'}</button>}
              </div>
              <button aria-label="Close customer details" onClick={() => setSelectedUser(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800"><X size={20} /></button>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-4">
              <div className="rounded-xl bg-[#081b15]/90 backdrop-blur-xl p-4"><p className="text-xs uppercase text-slate-500">Account</p><p className="mt-1 font-semibold">{Number(selectedUser.is_active) === 1 ? 'Active' : 'Disabled'}</p></div>
              <div className="rounded-xl bg-[#081b15]/90 backdrop-blur-xl p-4"><p className="text-xs uppercase text-slate-500">Orders</p><p className="mt-1 font-semibold">{Number(selectedUser.order_count || customerOrders.length)}</p></div>
              <div className="rounded-xl bg-[#081b15]/90 backdrop-blur-xl p-4"><p className="text-xs uppercase text-slate-500">Loyalty points</p><p className="mt-1 inline-flex items-center gap-1 font-semibold"><Activity size={15} className="text-amber-300" />{Number(selectedUser.loyalty_points || 0)}</p></div>
              <div className="rounded-xl bg-[#081b15]/90 backdrop-blur-xl p-4"><p className="text-xs uppercase text-slate-500">Marketing email</p><p className="mt-1 font-semibold">{Number(selectedUser.marketing_email_opt_in) === 1 ? 'Opted in' : 'Opted out'}</p></div>
            </div>
            <div className="px-5 pb-5">
              <h3 className="mb-3 font-bold text-white">Order history</h3>
              {ordersLoading ? <p className="py-6 text-center text-slate-400">Loading order history…</p> : customerOrders.length === 0 ? <p className="rounded-xl bg-[#081b15]/90 backdrop-blur-xl p-5 text-sm text-slate-400">No orders found.</p> : (
                <div className="space-y-3">
                  {customerOrders.map(order => (
                    <article key={order.id} className="rounded-xl border border-slate-800 bg-[#081b15]/90 backdrop-blur-xl p-4">
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="font-semibold text-white">Order #{order.id}</span><span className="text-emerald-300">{money(order.total)}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-slate-400">
                        <span>{order.status || 'Status unavailable'}</span><span>{order.created_at ? new Date(order.created_at).toLocaleString() : ''}</span>
                      </div>
                      {Array.isArray(order.items) && order.items.length > 0 && <p className="mt-2 text-xs text-slate-500">{order.items.length} line item(s)</p>}
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
