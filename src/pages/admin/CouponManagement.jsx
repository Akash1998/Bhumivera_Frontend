import React, { useState, useEffect, useMemo } from 'react';
import {
  Ticket,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Percent,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Copy,
  ShieldCheck,
  History,
  Sparkles,
  Users,
  Layers,
  Power,
  X,
} from 'lucide-react';
import { coupons as couponApi } from '../../services/api';

const EMPTY_FORM = {
  code: '',
  discount_type: 'percentage',
  discount_value: '',
  reward_type: 'standard',
  min_order_value: '',
  max_discount: '',
  usage_limit: '',
  per_user_limit: '1',
  first_order_only: false,
  allowed_payment_modes: '',
  restricted_user_id: '',
  campaign_tag: '',
  description: '',
  expiry_date: '',
  status: 'active',
};

const EMPTY_BULK_FORM = {
  prefix: 'BHVM',
  count: 10,
  discount_type: 'percentage',
  discount_value: 15,
  min_order_value: 499,
  max_discount: 300,
  usage_limit: 1,
  per_user_limit: 1,
  first_order_only: false,
  reward_type: 'standard',
  campaign_tag: 'VIP_DROP',
  expiry_date: '',
};

export default function CouponManagement() {
  const [coupons, setCoupons] = useState([]);
  const [summary, setSummary] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    expiredCoupons: 0,
    disabledCoupons: 0,
    totalRedemptions: 0,
    reversedRedemptions: 0,
    uniqueCustomers: 0,
    totalDiscountAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkForm, setBulkForm] = useState(EMPTY_BULK_FORM);

  const [redemptionModalCoupon, setRedemptionModalCoupon] = useState(null);
  const [redemptionLogs, setRedemptionLogs] = useState([]);
  const [loadingRedemptions, setLoadingRedemptions] = useState(false);

  const fetchCoupons = async (showSpinner = false) => {
    try {
      if (showSpinner) setRefreshing(true);
      else setLoading(true);
      setError('');
      const response = await couponApi.getAllAdmin();
      const rows = Array.isArray(response.data?.data) ? response.data.data : [];
      setCoupons(rows);
      if (response.data?.summary) {
        setSummary(response.data.summary);
      } else {
        const now = new Date();
        setSummary({
          totalCoupons: rows.length,
          activeCoupons: rows.filter(
            (c) => c.status === 'active' && (!c.expiry_date || new Date(c.expiry_date) > now)
          ).length,
          expiredCoupons: rows.filter(
            (c) => c.status === 'expired' || (c.expiry_date && new Date(c.expiry_date) <= now)
          ).length,
          disabledCoupons: rows.filter((c) => c.status === 'disabled').length,
          totalRedemptions: rows.reduce((s, c) => s + Number(c.verified_redemptions ?? c.used_count ?? 0), 0),
          reversedRedemptions: 0,
          uniqueCustomers: rows.reduce((s, c) => s + Number(c.unique_redeemers || 0), 0),
          totalDiscountAmount: rows.reduce((s, c) => s + Number(c.total_discount_given || 0), 0),
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load coupons.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const flashNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => {
      setNotice((prev) => (prev === msg ? '' : prev));
    }, 4500);
  };

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      flashNotice(`Copied coupon code "${code}" to clipboard.`);
    } catch {
      flashNotice(`Coupon code: ${code}`);
    }
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let suffix = '';
    for (let i = 0; i < 6; i += 1) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, code: `BHVM-${suffix}` }));
  };

  const handleOpenModal = (coupon = null) => {
    setError('');
    if (coupon) {
      setEditingCoupon(coupon);
      const rawDate = coupon.expiry_date || coupon.expires_at;
      const formattedDate = rawDate ? new Date(rawDate).toISOString().slice(0, 16) : '';
      setFormData({
        code: coupon.code || '',
        discount_type: coupon.discount_type || 'percentage',
        discount_value: coupon.discount_value ?? '',
        reward_type: coupon.reward_type || 'standard',
        min_order_value: coupon.min_order_value ?? coupon.minimum_order_amount ?? '',
        max_discount: coupon.max_discount || '',
        usage_limit: coupon.usage_limit || '',
        per_user_limit:
          coupon.per_user_limit !== undefined && coupon.per_user_limit !== null
            ? String(coupon.per_user_limit)
            : '1',
        first_order_only: Boolean(Number(coupon.first_order_only)),
        allowed_payment_modes: coupon.allowed_payment_modes || '',
        restricted_user_id: coupon.restricted_user_id || '',
        campaign_tag: coupon.campaign_tag || '',
        description: coupon.description || '',
        expiry_date: formattedDate,
        status: coupon.status || 'active',
      });
    } else {
      setEditingCoupon(null);
      const defaultExpiry = new Date(Date.now() + 30 * 86400 * 1000).toISOString().slice(0, 16);
      setFormData({ ...EMPTY_FORM, expiry_date: defaultExpiry });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: type === 'checkbox' ? checked : name === 'code' ? value.toUpperCase() : value,
      };
      if (name === 'discount_type' && value === 'free_shipping') {
        next.reward_type = 'free_shipping';
        next.discount_value = '0';
      } else if (name === 'reward_type' && value === 'free_shipping') {
        next.discount_type = 'free_shipping';
        next.discount_value = '0';
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...formData,
        discount_value:
          formData.discount_type === 'free_shipping' || formData.reward_type === 'free_shipping'
            ? 0
            : parseFloat(formData.discount_value || 0),
        min_order_value: formData.min_order_value ? parseFloat(formData.min_order_value) : 0,
        max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit, 10) : null,
        per_user_limit:
          formData.per_user_limit !== '' && formData.per_user_limit !== null
            ? Math.max(0, parseInt(formData.per_user_limit, 10))
            : 1,
        first_order_only: Boolean(formData.first_order_only),
        allowed_payment_modes: formData.allowed_payment_modes || null,
        restricted_user_id: formData.restricted_user_id ? parseInt(formData.restricted_user_id, 10) : null,
        campaign_tag: formData.campaign_tag || null,
        description: formData.description || null,
      };

      if (editingCoupon) {
        await couponApi.update(editingCoupon.id, payload);
        flashNotice(`Updated coupon ${payload.code} with tamper-proof promotional rules.`);
      } else {
        await couponApi.create(payload);
        flashNotice(`Created coupon ${payload.code} (Max ${payload.per_user_limit || 'Unlimited'} use(s) per customer).`);
      }

      handleCloseModal();
      fetchCoupons(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not save coupon.');
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await couponApi.bulkGenerate(bulkForm);
      setIsBulkModalOpen(false);
      flashNotice(res.data?.message || `Generated ${res.data?.coupons?.length || 0} campaign coupons.`);
      fetchCoupons(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Bulk generation failed.');
    }
  };

  const handleToggleStatus = async (coupon) => {
    try {
      const nextStatus = coupon.status === 'active' ? 'disabled' : 'active';
      const res = await couponApi.toggleStatus(coupon.id, nextStatus);
      flashNotice(res.data?.message || `Coupon ${coupon.code} marked ${nextStatus}.`);
      fetchCoupons(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not toggle status.');
    }
  };

  const handleOpenRedemptions = async (coupon) => {
    setRedemptionModalCoupon(coupon);
    setRedemptionLogs([]);
    setLoadingRedemptions(true);
    try {
      const res = await couponApi.redemptions(coupon.id);
      setRedemptionLogs(res.data?.redemptions || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load redemption ledger.');
    } finally {
      setLoadingRedemptions(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this coupon?')) return;
    try {
      await couponApi.delete(id);
      flashNotice('Coupon deleted.');
      fetchCoupons(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete coupon.');
    }
  };

  const filteredCoupons = useMemo(() => {
    const now = new Date();
    return coupons.filter((coupon) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        String(coupon.code || '').toLowerCase().includes(q) ||
        String(coupon.campaign_tag || '').toLowerCase().includes(q) ||
        String(coupon.description || '').toLowerCase().includes(q) ||
        String(coupon.restricted_user_email || '').toLowerCase().includes(q);

      const isExpired =
        coupon.status === 'expired' || (coupon.expiry_date && new Date(coupon.expiry_date) <= now);
      const effectiveStatus = isExpired && coupon.status === 'active' ? 'expired' : coupon.status;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && effectiveStatus === 'active') ||
        (statusFilter === 'expired' && effectiveStatus === 'expired') ||
        (statusFilter === 'disabled' && effectiveStatus === 'disabled') ||
        (statusFilter === 'personal' && Boolean(coupon.restricted_user_id));

      const matchesType =
        typeFilter === 'all' ||
        coupon.discount_type === typeFilter ||
        coupon.reward_type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [coupons, searchQuery, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCoupons.length / itemsPerPage));
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-200 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck size={12} /> Tamper-Proof Promotional Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2 mt-1">
            <Ticket className="text-emerald-400" /> Coupon Issuance, Anti-Reuse & Redemption Ledger
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Enforces strict per-customer redemption limits (default 1 use per customer), first-order rules, payment-mode guards, and automatic cancellation reversal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchCoupons(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition"
            title="Refresh live coupon ledger"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin text-emerald-400' : ''} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => {
              const defaultExpiry = new Date(Date.now() + 30 * 86400 * 1000).toISOString().slice(0, 16);
              setBulkForm({ ...EMPTY_BULK_FORM, expiry_date: defaultExpiry });
              setIsBulkModalOpen(true);
            }}
            className="flex items-center gap-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 px-4 py-2.5 rounded-xl text-xs font-bold transition"
          >
            <Sparkles size={15} /> Bulk Generate Codes
          </button>

          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-900/20"
          >
            <Plus size={16} /> Create New Coupon
          </button>
        </div>
      </div>

      {/* Interactive KPI Cards — Every Card Filters or Inspects */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {
            key: 'all',
            label: 'Total Coupons',
            value: summary.totalCoupons,
            sub: 'Click to view all',
            color: 'text-white',
          },
          {
            key: 'active',
            label: 'Active Coupons',
            value: summary.activeCoupons,
            sub: 'Live & redeemable',
            color: 'text-emerald-400',
          },
          {
            key: 'expired',
            label: 'Expired',
            value: summary.expiredCoupons,
            sub: 'Past expiry date',
            color: 'text-amber-400',
          },
          {
            key: 'disabled',
            label: 'Disabled',
            value: summary.disabledCoupons,
            sub: 'Paused by admin',
            color: 'text-rose-400',
          },
          {
            key: 'personal',
            label: 'Verified Redemptions',
            value: summary.totalRedemptions,
            sub: `${summary.uniqueCustomers} unique customer(s)`,
            color: 'text-sky-400',
          },
          {
            key: 'all',
            label: 'Total Discount Given',
            value: `₹${Number(summary.totalDiscountAmount || 0).toLocaleString('en-IN')}`,
            sub: `${summary.reversedRedemptions || 0} reversed on cancel`,
            color: 'text-purple-400',
          },
        ].map((card, idx) => (
          <button
            key={`${card.label}-${idx}`}
            type="button"
            onClick={() => {
              setStatusFilter(card.key);
              setCurrentPage(1);
            }}
            className={`text-left p-4 rounded-2xl border transition ${
              statusFilter === card.key && idx < 5
                ? 'bg-slate-800/90 border-emerald-500/60 ring-1 ring-emerald-500/30'
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {card.label}
            </div>
            <div className={`text-2xl font-bold mt-1.5 ${card.color}`}>{card.value}</div>
            <div className="text-[11px] text-slate-500 mt-1">{card.sub}</div>
          </button>
        ))}
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl flex items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2">
            <AlertCircle size={18} /> {error}
          </span>
          <button type="button" onClick={() => setError('')} className="text-rose-300 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}
      {notice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs font-medium">
          <span className="flex items-center gap-2">
            <CheckCircle size={16} /> {notice}
          </span>
          <button type="button" onClick={() => setNotice('')} className="text-emerald-300 hover:text-white">
            <X size={15} />
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search by coupon code, campaign tag, description, or customer email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="expired">Expired Only</option>
            <option value="disabled">Disabled Only</option>
            <option value="personal">Customer-Restricted Only</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Reward Types</option>
            <option value="percentage">Percentage Discount (%)</option>
            <option value="flat">Flat Discount (₹)</option>
            <option value="free_shipping">Free Shipping</option>
            <option value="referral_wallet">Referral Wallet</option>
            <option value="coupon_credit">Coupon Credit</option>
          </select>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-5 font-semibold">Code & Campaign</th>
                <th className="py-3.5 px-5 font-semibold">Reward & Discount</th>
                <th className="py-3.5 px-5 font-semibold">Anti-Abuse Rules</th>
                <th className="py-3.5 px-5 font-semibold">Redemption Ledger</th>
                <th className="py-3.5 px-5 font-semibold">Expiry</th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
                <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-500">
                    Loading tamper-proof coupon registry...
                  </td>
                </tr>
              ) : paginatedCoupons.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-500">
                    No coupons match the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedCoupons.map((coupon) => {
                  const isExpired =
                    coupon.expiry_date && new Date(coupon.expiry_date) < new Date();
                  const currentStatus =
                    isExpired && coupon.status === 'active' ? 'expired' : coupon.status || 'active';
                  const perUserLimit =
                    coupon.per_user_limit !== undefined && coupon.per_user_limit !== null
                      ? Number(coupon.per_user_limit)
                      : 1;
                  const usedCount = Number(coupon.verified_redemptions ?? coupon.used_count ?? 0);

                  return (
                    <tr key={coupon.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                            {coupon.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(coupon.code)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                            title="Copy coupon code"
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-slate-400">
                          {coupon.campaign_tag && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                              #{coupon.campaign_tag}
                            </span>
                          )}
                          {coupon.restricted_user_id && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                              User #{coupon.restricted_user_id}
                              {coupon.restricted_user_name ? ` (${coupon.restricted_user_name})` : ''}
                            </span>
                          )}
                          {coupon.description && (
                            <span className="truncate max-w-[200px]">{coupon.description}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-white">
                          {coupon.reward_type === 'free_shipping' || coupon.discount_type === 'free_shipping' ? (
                            <span className="text-sky-400">FREE SHIPPING</span>
                          ) : coupon.discount_type === 'percentage' ? (
                            <span>{coupon.discount_value}% OFF</span>
                          ) : (
                            <span>₹{coupon.discount_value} OFF</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Min Order: ₹{coupon.min_order_value || 0}
                          {coupon.max_discount ? ` · Cap: ₹${coupon.max_discount}` : ''}
                        </div>
                      </td>

                      <td className="py-3.5 px-5 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                          <Users size={13} />
                          {perUserLimit === 0
                            ? 'Unlimited per customer'
                            : `Max ${perUserLimit} use${perUserLimit > 1 ? 's' : ''} / customer`}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {Number(coupon.first_order_only) === 1 && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                              1st Order Only
                            </span>
                          )}
                          {coupon.allowed_payment_modes && (
                            <span className="px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30 text-[10px] font-bold">
                              {coupon.allowed_payment_modes} Only
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-200 font-semibold">
                            {usedCount} / {coupon.usage_limit ? coupon.usage_limit : '∞'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenRedemptions(coupon)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-emerald-400 border border-slate-700 transition"
                            title="Inspect customer redemption audit log"
                          >
                            <History size={12} /> Audit Log
                          </button>
                        </div>
                        <div className="w-28 bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{
                              width: coupon.usage_limit
                                ? `${Math.min((usedCount / coupon.usage_limit) * 100, 100)}%`
                                : '20%',
                            }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-5 text-slate-300 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-500" />
                          {coupon.expiry_date
                            ? new Date(coupon.expiry_date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'No Expiry'}
                        </div>
                      </td>

                      <td className="py-3.5 px-5">
                        {currentStatus === 'active' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle size={12} /> Active
                          </span>
                        )}
                        {currentStatus === 'expired' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <AlertCircle size={12} /> Expired
                          </span>
                        )}
                        {currentStatus === 'disabled' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <XCircle size={12} /> Disabled
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(coupon)}
                            className={`p-2 rounded-lg transition ${
                              coupon.status === 'active'
                                ? 'text-emerald-400 hover:bg-emerald-500/10'
                                : 'text-slate-400 hover:bg-slate-800'
                            }`}
                            title={coupon.status === 'active' ? 'Disable coupon' : 'Activate coupon'}
                          >
                            <Power size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenModal(coupon)}
                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                            title="Edit coupon rules"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(coupon.id)}
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                            title="Delete coupon"
                          >
                            <Trash2 size={15} />
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-800 flex justify-between items-center bg-slate-950/30">
            <span className="text-xs text-slate-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredCoupons.length)} of {filteredCoupons.length} coupons
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create Tamper-Proof Coupon'}
                </h3>
                <p className="text-xs text-slate-400">
                  Protected by atomic per-user locking and cryptographic SHA-512 redemption signatures.
                </p>
              </div>
              <button type="button" onClick={handleCloseModal} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Coupon Code *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="code"
                      required
                      placeholder="e.g. WELCOME20"
                      value={formData.code}
                      onChange={handleChange}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={generateRandomCode}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 border border-slate-700"
                    >
                      Auto-Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Campaign Tag</label>
                  <input
                    type="text"
                    name="campaign_tag"
                    placeholder="e.g. FESTIVE2026"
                    value={formData.campaign_tag}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Discount Type</label>
                  <select
                    name="discount_type"
                    value={formData.discount_type}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Discount Value {formData.discount_type === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="discount_value"
                    disabled={formData.discount_type === 'free_shipping'}
                    required={formData.discount_type !== 'free_shipping'}
                    placeholder={formData.discount_type === 'percentage' ? '15' : '200'}
                    value={formData.discount_value}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Reward Category</label>
                  <select
                    name="reward_type"
                    value={formData.reward_type}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="standard">Standard Promo</option>
                    <option value="free_shipping">Free Shipping</option>
                    <option value="coupon_credit">Coupon Credit</option>
                    <option value="referral_wallet">Referral Wallet</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="min_order_value"
                    placeholder="0.00"
                    value={formData.min_order_value}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Max Discount Cap (₹) <span className="text-slate-600">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="max_discount"
                    placeholder="No Cap"
                    value={formData.max_discount}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Anti-Abuse & Per-Customer Limits */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/25 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Anti-Abuse & Tamper-Proof Controls
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Max Uses Per Customer *
                    </label>
                    <input
                      type="number"
                      min="0"
                      name="per_user_limit"
                      value={formData.per_user_limit}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-500">Default 1 (prevents duplicate reuse). Set 0 for unlimited.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Global Total Limit
                    </label>
                    <input
                      type="number"
                      min="1"
                      name="usage_limit"
                      placeholder="Unlimited"
                      value={formData.usage_limit}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-500">Total redemptions across all users.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Restrict to User ID
                    </label>
                    <input
                      type="number"
                      min="1"
                      name="restricted_user_id"
                      placeholder="Public (Anyone)"
                      value={formData.restricted_user_id}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-500">Locks code to 1 specific customer ID.</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Allowed Payment Modes
                    </label>
                    <select
                      name="allowed_payment_modes"
                      value={formData.allowed_payment_modes}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">All Payment Modes (Online, Wallet, COD)</option>
                      <option value="ONLINE">Prepaid / Online (Razorpay) Only</option>
                      <option value="ONLINE,WALLET">Online & Bhumivera Wallet Only (No COD)</option>
                      <option value="WALLET">Bhumivera Wallet Only</option>
                      <option value="COD">Cash on Delivery (COD) Only</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        name="first_order_only"
                        checked={Boolean(formData.first_order_only)}
                        onChange={handleChange}
                        className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span>
                        <strong>First-Order Only</strong> (Block if customer has prior orders)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Expiry Date & Time *</label>
                  <input
                    type="datetime-local"
                    name="expiry_date"
                    required
                    value={formData.expiry_date}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Customer-Facing Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="e.g. Flat 15% off on your botanical skincare ritual (Single use per customer)"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition shadow-lg shadow-emerald-900/20"
                >
                  {editingCoupon ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Campaign Generator Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-400" /> Bulk Single-Use Coupon Generator
                </h3>
                <p className="text-xs text-slate-400">
                  Generate unique single-use codes for VIP drops, influencers, or customer care.
                </p>
              </div>
              <button type="button" onClick={() => setIsBulkModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleBulkSubmit} className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Code Prefix</label>
                  <input
                    type="text"
                    required
                    value={bulkForm.prefix}
                    onChange={(e) => setBulkForm((p) => ({ ...p, prefix: e.target.value.toUpperCase() }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Number of Codes (1–100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={bulkForm.count}
                    onChange={(e) => setBulkForm((p) => ({ ...p, count: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Type</label>
                  <select
                    value={bulkForm.discount_type}
                    onChange={(e) => setBulkForm((p) => ({ ...p, discount_type: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Value</label>
                  <input
                    type="number"
                    required
                    value={bulkForm.discount_value}
                    onChange={(e) => setBulkForm((p) => ({ ...p, discount_value: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={bulkForm.min_order_value}
                    onChange={(e) => setBulkForm((p) => ({ ...p, min_order_value: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Expiry Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={bulkForm.expiry_date}
                  onChange={(e) => setBulkForm((p) => ({ ...p, expiry_date: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Generate {bulkForm.count} Unique Coupons
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Redemption Audit Ledger Modal */}
      {redemptionModalCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History size={18} className="text-emerald-400" /> Redemption Audit Ledger:{' '}
                  <span className="font-mono text-emerald-400">{redemptionModalCoupon.code}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Every checkout redemption is cryptographically signed (SHA-512) and linked to the customer & order.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRedemptionModalCoupon(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[65vh] overflow-y-auto">
              {loadingRedemptions ? (
                <p className="text-center text-slate-400 py-8 text-sm">Loading redemption history...</p>
              ) : redemptionLogs.length === 0 ? (
                <p className="text-center text-slate-500 py-8 text-sm">
                  No redemptions recorded for {redemptionModalCoupon.code} yet.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {redemptionLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">
                          {log.user_name || `User #${log.user_id || 'Guest'}`}{' '}
                          <span className="text-slate-400 font-normal">({log.user_email || 'Verified'})</span>
                        </div>
                        <div className="text-slate-400 mt-0.5">
                          Order: <strong className="text-emerald-400">#{log.order_number || log.order_id}</strong> ·
                          Discount Saved: <strong className="text-white">₹{log.discount_amount}</strong> · Subtotal: ₹
                          {log.order_subtotal}
                        </div>
                        {log.signature_sha512 && (
                          <div className="font-mono text-[10px] text-slate-500 mt-1">
                            SHA-512: {log.signature_sha512.slice(0, 32)}...
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            log.status === 'active'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {log.status}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {log.redeemed_at ? new Date(log.redeemed_at).toLocaleString() : ''}
                        </div>
                      </div>
                    </div>
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
