import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LifeBuoy,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  XCircle,
  Eye,
  RefreshCw,
  MessageSquare,
  User,
  Calendar,
  ArrowRight,
  Activity,
  Trash2,
  MailPlus,
  Download,
  ExternalLink,
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const STATUS_MAP = {
  open: { label: 'Awaiting Action', color: 'rose', icon: AlertTriangle },
  in_progress: { label: 'In Review', color: 'amber', icon: Clock },
  resolved: { label: 'Resolved', color: 'emerald', icon: CheckCircle },
  closed: { label: 'Closed', color: 'slate', icon: XCircle },
};

const CATEGORY_MAP = {
  technical_support: 'Tech Support',
  order_status: 'Logistics',
  returns_rma: 'RMA / Returns',
  general: 'General Comms',
};

export default function ContactManagement() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtering & Selection
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Inspector State
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [replyText, setReplyText] = useState('');

  const { showToast } = useToast() || {};

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact');
      const data = res.data?.contacts || res.data?.data || res.data || [];
      const enhancedData = data.map(t => ({ ...t, status: t.status || 'open' }));
      setTickets(enhancedData);
    } catch {
      showToast?.('Failed to sync Helpdesk Matrix.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus, adminReply) => {
    setIsUpdating(true);
    try {
      const response = await api.patch(`/contact/${id}/status`, {
        status: newStatus,
        admin_reply: adminReply,
      });
      showToast?.(
        response.data?.emailSent === false
          ? 'Reply saved, but email delivery failed.'
          : `Ticket updated to ${newStatus.replace('_', ' ')}.`,
        response.data?.emailSent === false ? 'error' : 'success'
      );
      setTickets(current =>
        current.map(t =>
          t.id === id || t._id === id
            ? { ...t, status: newStatus, ...(adminReply ? { admin_reply: adminReply } : {}) }
            : t
        )
      );
      setSelectedTicket(current =>
        current && (current.id === id || current._id === id)
          ? { ...current, status: newStatus, ...(adminReply ? { admin_reply: adminReply } : {}) }
          : current
      );
      return true;
    } catch (err) {
      showToast?.(err.normalized?.message || err.response?.data?.message || 'Ticket update failed.', 'error');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Permanently purge this ticket from the matrix?')) return;
    try {
      await api.delete(`/contact/${id}`);
      showToast?.('Ticket purged.', 'success');
      setTickets(prev => prev.filter(t => t.id !== id && t._id !== id));
      setSelectedIds(prev => prev.filter(item => item !== id));
      if (selectedTicket && (selectedTicket.id === id || selectedTicket._id === id)) {
        setSelectedTicket(null);
      }
    } catch (err) {
      showToast?.(err.normalized?.message || err.response?.data?.message || 'Ticket deletion failed.', 'error');
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(`Permanently purge ${selectedIds.length} selected inquiry ticket(s)?`)) return;
    setIsUpdating(true);
    try {
      for (const id of selectedIds) {
        await api.delete(`/contact/${id}`);
      }
      setTickets(prev => prev.filter(t => !selectedIds.includes(t.id || t._id)));
      setSelectedIds([]);
      showToast?.('Selected tickets purged.', 'success');
    } catch (err) {
      showToast?.(err.normalized?.message || 'Bulk purge failed.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendReply = e => {
    e.preventDefault();
    if (!replyText.trim()) return;
    void handleUpdateStatus(selectedTicket.id || selectedTicket._id, 'in_progress', replyText.trim()).then(
      saved => {
        if (saved) setReplyText('');
      }
    );
  };

  const filteredTickets = useMemo(() => {
    return tickets
      .filter(t => {
        const searchStr = `${t.name} ${t.email} ${t.phone || ''} ${t.order_id || ''} ${t.message || ''}`.toLowerCase();
        const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [tickets, searchTerm, statusFilter]);

  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportContactsCsv = () => {
    const headers = [
      'Ticket ID',
      'Client Name',
      'Client Email',
      'Client Phone',
      'Routing Category',
      'Linked Order ID',
      'Status',
      'Created At',
      'Client Message',
      'Admin Reply',
    ];
    const escapeCell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = filteredTickets.map(t =>
      [
        t.id || t._id,
        t.name,
        t.email,
        t.phone || '',
        CATEGORY_MAP[t.subject] || t.subject || 'General',
        t.order_id || '',
        t.status || 'open',
        t.created_at || '',
        t.message || '',
        t.admin_reply || '',
      ]
        .map(escapeCell)
        .join(',')
    );
    const csv = `\uFEFF${headers.map(escapeCell).join(',')}\n${rows.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bhumivera-contact-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Telemetry
  const pendingCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;
  const criticalCount = tickets.filter(
    ticket =>
      ticket.status === 'open' && Date.now() - new Date(ticket.created_at).getTime() >= 24 * 60 * 60 * 1000
  ).length;

  if (loading && tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">
          Syncing Helpdesk Matrix...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-slate-300 font-sans animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            Helpdesk <span className="text-blue-500">Command</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1 flex items-center gap-2">
            <LifeBuoy size={12} className="text-blue-500" /> Triage, Bulk Purge &amp; Comms Center
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/superadminsupport"
            className="px-3.5 py-2.5 bg-purple-500/15 border border-purple-400/30 rounded-xl text-xs font-bold text-purple-200 hover:bg-purple-500/25 flex items-center gap-1.5"
          >
            SuperAdmin Support <ExternalLink size={13} />
          </Link>
          <button
            type="button"
            onClick={handleExportContactsCsv}
            className="px-3.5 py-2.5 bg-emerald-500/15 border border-emerald-400/30 rounded-xl text-xs font-bold text-emerald-200 hover:bg-emerald-500/25 flex items-center gap-1.5"
          >
            <Download size={14} /> Export 10-Col CSV
          </button>
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              className="px-3.5 py-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs font-bold text-rose-200 hover:bg-rose-500/30 flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Bulk Purge ({selectedIds.length})
            </button>
          )}
          <button
            onClick={fetchTickets}
            className="p-3 bg-[#10241f]/85 backdrop-blur-xl border border-slate-800 text-slate-400 rounded-xl hover:bg-slate-800 hover:text-blue-400 transition-all shadow-lg"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* KPI DASHBOARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#10241f]/45 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden group">
          <div className="p-3 rounded-xl bg-[#081b15]/90 backdrop-blur-xl border border-slate-800 text-rose-500 z-10">
            <AlertTriangle size={20} />
          </div>
          <div className="z-10">
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Pending Action</p>
            <h4 className="text-xl font-black text-white tracking-tight mt-0.5">{pendingCount}</h4>
          </div>
        </div>
        <div className="bg-[#10241f]/45 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 rounded-xl bg-[#081b15]/90 backdrop-blur-xl border border-slate-800 text-amber-500 z-10">
            <Clock size={20} />
          </div>
          <div className="z-10">
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">In Review</p>
            <h4 className="text-xl font-black text-white tracking-tight mt-0.5">{inProgressCount}</h4>
          </div>
        </div>
        <div className="bg-[#10241f]/45 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 rounded-xl bg-[#081b15]/90 backdrop-blur-xl border border-slate-800 text-emerald-500 z-10">
            <CheckCircle size={20} />
          </div>
          <div className="z-10">
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Resolved Tickets</p>
            <h4 className="text-xl font-black text-white tracking-tight mt-0.5">{resolvedCount}</h4>
          </div>
        </div>
        <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 z-10">
            <Activity size={20} />
          </div>
          <div className="z-10">
            <p className="text-[9px] font-black uppercase text-rose-500/70 tracking-widest">SLA Critical</p>
            <h4 className="text-xl font-black text-white tracking-tight mt-0.5">{criticalCount}</h4>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row gap-3 bg-[#10241f]/45 backdrop-blur-xl border border-slate-800/80 p-3 rounded-2xl shadow-lg">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="Scan client identity, email, phone, message, or order hash..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#081b15]/90 backdrop-blur-xl border border-slate-800 focus:border-blue-500/50 rounded-xl py-3 pl-10 pr-4 text-white font-bold text-xs outline-none transition-all"
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#081b15]/90 backdrop-blur-xl border border-slate-800 focus:border-blue-500/50 rounded-xl py-3 pl-10 pr-4 text-white font-bold text-xs outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Triage States</option>
            {Object.entries(STATUS_MAP).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* EXPANDED 8-COLUMN TICKETS TABLE */}
      <div className="bg-[#10241f]/35 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left border-collapse">
            <thead>
              <tr className="bg-[#081b15]/80 border-b border-slate-800 backdrop-blur-md">
                <th className="p-4 text-[9px] font-black uppercase text-slate-500 tracking-widest">Select</th>
                <th className="p-4 text-[9px] font-black uppercase text-slate-500 tracking-widest">ID</th>
                <th className="p-4 text-[9px] font-black uppercase text-slate-500 tracking-widest">Client Payload</th>
                <th className="p-4 text-[9px] font-black uppercase text-slate-500 tracking-widest">Routing Tag</th>
                <th className="p-4 text-[9px] font-black uppercase text-slate-500 tracking-widest">Message Preview</th>
                <th className="p-4 text-[9px] font-black uppercase text-slate-500 tracking-widest">Timestamp</th>
                <th className="p-4 text-[9px] font-black uppercase text-slate-500 tracking-widest">SLA Status</th>
                <th className="p-4 text-[9px] font-black uppercase text-slate-500 tracking-widest text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-500 font-bold text-xs">
                    Helpdesk queue is completely clear.
                  </td>
                </tr>
              ) : (
                paginatedTickets.map(ticket => {
                  const status = STATUS_MAP[ticket.status] || STATUS_MAP.open;
                  const StatusIcon = status.icon;
                  const tId = ticket.id || ticket._id;

                  return (
                    <tr
                      key={tId}
                      className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <td className="p-4" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(tId)}
                          onChange={() =>
                            setSelectedIds(prev =>
                              prev.includes(tId) ? prev.filter(id => id !== tId) : [...prev, tId]
                            )
                          }
                          className="accent-rose-500"
                        />
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-400">#{tId}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#081b15]/90 border border-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                            {(ticket.name || 'C').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate max-w-[180px]">{ticket.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-[180px]">
                              {ticket.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-[#081b15]/90 border border-slate-800 text-slate-400 rounded-md text-[9px] font-black uppercase tracking-widest">
                          {CATEGORY_MAP[ticket.subject] || ticket.subject}
                        </span>
                        {ticket.order_id && (
                          <span className="block mt-1 text-[9px] font-mono text-blue-500">
                            Order: #{ticket.order_id}
                          </span>
                        )}
                      </td>
                      <td className="p-4 max-w-xs">
                        <p className="text-xs text-slate-300 truncate">{ticket.message}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-[10px] font-bold text-slate-300">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-[9px] text-slate-500 mt-0.5">
                          {new Date(ticket.created_at).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-slate-800/80 text-slate-200 border border-slate-700">
                          <StatusIcon size={10} /> {status.label}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedTicket(ticket);
                            }}
                            className="p-2 bg-[#081b15]/90 border border-slate-800 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleDelete(tId);
                            }}
                            className="p-2 bg-[#081b15]/90 border border-slate-800 rounded-lg text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TICKET DEEP DIVE MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#081b15]/90 backdrop-blur-sm">
          <div className="bg-[#10241f]/90 backdrop-blur-xl border border-slate-800 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-[#10241f]/55 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                    Ticket Hash:{' '}
                    <span className="text-blue-400 font-mono">
                      #{String(selectedTicket.id || selectedTicket._id).padStart(5, '0')}
                    </span>
                  </h2>
                  <div className="flex items-center gap-3 mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {new Date(selectedTicket.created_at).toLocaleString()}
                    </span>
                    <span>|</span>
                    <span className="text-slate-400">
                      {CATEGORY_MAP[selectedTicket.subject] || selectedTicket.subject}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-2.5 bg-[#081b15]/90 hover:bg-rose-500/10 border border-slate-800 text-slate-500 hover:text-rose-500 rounded-xl transition-all"
              >
                <XCircle size={18} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Col: Customer Info */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="p-5 bg-[#10241f]/35 border border-slate-800 rounded-2xl">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                      <User size={12} /> Client Profile
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[9px] text-slate-500 uppercase font-bold">Name</p>
                        <p className="text-xs text-white font-bold">{selectedTicket.name}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 uppercase font-bold">Email</p>
                        <p className="text-xs text-blue-400 font-mono">{selectedTicket.email}</p>
                      </div>
                      {selectedTicket.phone && (
                        <div>
                          <p className="text-[9px] text-slate-500 uppercase font-bold">Phone</p>
                          <p className="text-xs text-white font-mono">{selectedTicket.phone}</p>
                        </div>
                      )}
                      {selectedTicket.order_id && (
                        <div className="pt-3 border-t border-slate-800">
                          <p className="text-[9px] text-slate-500 uppercase font-bold">Linked Logistics Hash</p>
                          <p className="text-xs text-white font-mono">#{selectedTicket.order_id}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 bg-[#10241f]/35 border border-slate-800 rounded-2xl">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                      <Activity size={12} /> Triage Status
                    </h3>
                    <div className="flex flex-col gap-2">
                      {Object.entries(STATUS_MAP).map(([key, data]) => (
                        <button
                          key={key}
                          disabled={isUpdating || selectedTicket.status === key}
                          onClick={() => handleUpdateStatus(selectedTicket.id || selectedTicket._id, key)}
                          className={`w-full py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border transition-all ${
                            selectedTicket.status === key
                              ? 'bg-blue-500/15 border-blue-400/40 text-blue-300'
                              : 'bg-[#081b15]/90 border-slate-800 text-slate-500 hover:border-slate-600'
                          } disabled:opacity-50`}
                        >
                          <data.icon size={12} /> Force {data.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Col: Comms Matrix */}
                <div className="lg:col-span-2 space-y-4 flex flex-col">
                  <div className="p-6 bg-[#10241f]/35 border border-slate-800 rounded-2xl flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                        {(selectedTicket.name || 'C').charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Incoming Transmission</p>
                        <p className="text-[9px] text-slate-500">
                          {new Date(selectedTicket.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-[#081b15]/90 border border-slate-800 rounded-xl">
                      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {selectedTicket.message}
                      </p>
                    </div>
                  </div>

                  {/* Dispatch Reply Console */}
                  <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl mt-auto relative overflow-hidden">
                    <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-3 flex items-center gap-2 relative z-10">
                      <MailPlus size={14} /> Comms Dispatch Console
                    </h3>
                    <form onSubmit={handleSendReply} className="relative z-10">
                      <textarea
                        rows={3}
                        placeholder="Draft response to client..."
                        required
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        className="w-full bg-[#081b15]/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-blue-500/50 resize-none mb-3"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">
                          Replies dispatch via associated email
                        </span>
                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="px-6 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                          {isUpdating ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : (
                            <ArrowRight size={14} />
                          )}{' '}
                          Dispatch Comms
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
