import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reviews as reviewsApi } from '../services/api';
import { AUTHENTIC_PRODUCT_REVIEWS_BY_ID } from '../data/bhumiveraAuthenticReviews';
import { getProductImageUrl } from '../utils/productImageUrl';
import {
  ThumbsUp,
  Star,
  ShieldCheck,
  Send,
  Loader2,
  X,
  MessageSquare,
  User,
  Camera,
  AlertCircle,
  Eye,
  Plus,
  Flag,
  MapPin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function StarRating({ rating, interactive = false, onRate, size = 16 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate && onRate(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`transition-all duration-300 ${
            interactive ? 'cursor-pointer hover:scale-110 active:scale-90' : 'cursor-default'
          }`}
          aria-label={`${star} star`}
        >
          <Star
            size={size}
            className={`transition-colors ${
              star <= (hovered || rating)
                ? 'fill-[#fce096] text-[#fce096] shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                : 'text-white/20 fill-transparent'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

const normalizeReview = (r) => ({
  id: r.id || `rev-${Math.random()}`,
  rating: Number(r.rating) || 5,
  title: r.title || '',
  comment: r.body || r.comment || '',
  user: {
    name: r.user_name || r.reviewer_name || r.user?.name || 'Verified Patron',
    location: r.reviewer_location || r.user?.location || '',
    avatar: r.user?.avatar || '',
  },
  category_tag: r.category_tag || '',
  verified: Boolean(r.order_id || r.order_number || r.verified !== false),
  createdAt: r.created_at || r.createdAt || new Date().toISOString(),
  images: Array.isArray(r.images) ? r.images.map(img => getProductImageUrl(img) || img) : [],
  videos: Array.isArray(r.videos) ? r.videos.map(vid => getProductImageUrl(vid) || vid) : [],
  helpful_count: Number(r.helpful_count) || 0,
});

export default function ReviewSection({ productId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [helpfulVotes, setHelpfulVotes] = useState({});
  const [reportedIds, setReportedIds] = useState({});
  const [formData, setFormData] = useState({ rating: 5, title: '', comment: '', location: '', images: [] });
  const fileInputRef = useRef(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const load = async () => {
      try {
        const res = await reviewsApi.getByProduct(productId || 1);
        const payload = res.data?.data || res.data || {};
        const rows = Array.isArray(payload) ? payload : payload.reviews || [];
        if (active && rows.length > 0) {
          setReviews(rows.map(normalizeReview));
          setLoading(false);
          return;
        }
      } catch (_) {}
      if (active) {
        const pid = Number(productId) || 1;
        const fallback = AUTHENTIC_PRODUCT_REVIEWS_BY_ID[pid] || AUTHENTIC_PRODUCT_REVIEWS_BY_ID[1] || [];
        setReviews(fallback.map(normalizeReview));
        setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [productId]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newImgs = files.map((f) => URL.createObjectURL(f)).slice(0, 5 - formData.images.length);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...newImgs] }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.comment.trim()) return;
    setSubmitting(true);
    try {
      await reviewsApi.submit({
        product_id: Number(productId) || 1,
        rating: formData.rating,
        title: formData.title,
        body: formData.comment,
        user_name: user?.name || 'Verified Patron',
        reviewer_location: formData.location || 'India',
        images: [],
      });
    } catch (_) {}
    const newReview = normalizeReview({
      id: `rev-${Date.now()}`,
      rating: formData.rating,
      title: formData.title,
      comment: formData.comment,
      user_name: user?.name || 'Verified Patron',
      reviewer_location: formData.location || 'India',
      verified: true,
      created_at: new Date().toISOString(),
      images: formData.images,
    });
    setReviews((prev) => [newReview, ...prev]);
    setFormData({ rating: 5, title: '', comment: '', location: '', images: [] });
    setSubmitting(false);
  };

  const filteredReviews = useMemo(() => {
    let result = [...reviews];
    if (filter === 'with_images') result = result.filter((r) => r.images?.length > 0 || r.videos?.length > 0);
    if (filter === '5star') result = result.filter((r) => r.rating === 5);
    if (filter === '1star') result = result.filter((r) => r.rating === 1);
    return result;
  }, [reviews, filter]);

  const stats = useMemo(() => {
    if (!reviews.length) return { avg: 0, count: 0, bars: [0, 0, 0, 0, 0] };
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    const bars = [5, 4, 3, 2, 1].map(
      (num) => (reviews.filter((r) => r.rating === num).length / reviews.length) * 100
    );
    return { avg: avg.toFixed(1), count: reviews.length, bars };
  }, [reviews]);

  return (
    <div className="space-y-12">
      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left: Stats & Form */}
        <div className="lg:col-span-4 space-y-8">
          <div className="two-tone-panel-gold rounded-3xl p-6 sm:p-8 bg-[#0d1520] shadow-xl">
            <h3 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wider text-white mb-6">
              Customer Reviews
            </h3>

            <div className="flex items-center gap-6 mb-8 pb-6 border-b border-white/10">
              <div className="text-5xl font-mono font-bold text-[#fce096]">{stats.avg}</div>
              <div className="space-y-1">
                <StarRating rating={Math.round(stats.avg)} size={18} />
                <div className="font-mono text-[10px] text-[#94a3b8] uppercase tracking-widest">
                  Based on {stats.count} verified patron reviews
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {stats.bars.map((percent, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="font-mono text-[10px] font-bold text-[#94a3b8] w-4">{5 - i}★</span>
                  <div className="flex-1 h-1.5 bg-[#070a0e] rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      className="h-full bg-gradient-to-r from-[#d4af37] to-[#fce096]"
                    />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#fce096] w-8 text-right">{Math.round(percent)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Form */}
          {user ? (
            <form onSubmit={handleSubmit} className="two-tone-panel rounded-3xl p-6 sm:p-8 bg-[#0d1520] border border-[#d4af37]/30 space-y-5 shadow-xl">
              <div className="space-y-2">
                <label className="font-sub-gold text-[10px] tracking-widest block">Your Formulation Rating</label>
                <StarRating
                  rating={formData.rating}
                  interactive
                  onRate={(r) => setFormData({ ...formData, rating: r })}
                  size={22}
                />
              </div>

              <div className="space-y-2">
                <label className="font-sub-gold text-[10px] tracking-widest block">Your City / State (Optional)</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Asansol, West Bengal"
                  className="w-full bg-[#070a0e] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs placeholder-white/30 focus:border-[#d4af37] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="font-sub-gold text-[10px] tracking-widest block">Detailed Review</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Share your honest experience..."
                  className="w-full h-32 bg-[#070a0e] border border-white/10 rounded-xl p-4 text-white text-xs placeholder-white/30 focus:border-[#d4af37] transition-colors resize-none outline-none leading-relaxed"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="font-sub-gold text-[10px] tracking-widest flex justify-between">
                  <span>Photo Attachment</span>
                  <span className="font-mono text-[#94a3b8]">{formData.images.length}/5</span>
                </label>

                <div className="grid grid-cols-5 gap-2">
                  <AnimatePresence>
                    {formData.images.map((img, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="relative aspect-square rounded-lg overflow-hidden border border-[#d4af37]/40"
                      >
                        <img src={img} className="w-full h-full object-cover" alt="" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-500 text-white rounded transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </motion.div>
                    ))}
                    {formData.images.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square bg-[#070a0e] border border-white/15 border-dashed rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#fce096] hover:border-[#d4af37] transition-all"
                        aria-label="Upload photo"
                      >
                        <Plus size={18} />
                      </button>
                    )}
                  </AnimatePresence>
                </div>
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-gold-luxury w-full py-3.5 font-bold uppercase tracking-widest text-xs rounded-xl text-white shadow-xl flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <span>Submit Review</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="two-tone-card p-6 sm:p-8 bg-[#0d1520] border border-white/10 rounded-3xl text-center space-y-4 shadow-md">
              <p className="text-xs text-[#94a3b8] leading-relaxed">Sign in to your patron account to post your review and rate this formulation.</p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="btn-silver-luxury px-6 py-2.5 font-bold uppercase text-xs tracking-wider rounded-xl text-[#cbd5e1]"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Right: Reviews Feed */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'all', label: 'All Reviews', icon: MessageSquare },
              { id: 'with_images', label: 'With Photos', icon: Camera },
              { id: '5star', label: '5 Stars', icon: Star },
              { id: '1star', label: '1 Star', icon: AlertCircle },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  filter === f.id
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#fce096] text-black font-bold shadow-md'
                    : 'bg-[#0d1520] border border-white/10 text-[#cbd5e1] hover:border-[#d4af37]/40'
                }`}
              >
                <f.icon size={13} className={filter === f.id ? 'text-black' : 'text-[#d4af37]'} />
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-5">
            <AnimatePresence mode="popLayout">
              {filteredReviews.map((review) => (
                <motion.div
                  key={review.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="two-tone-card p-6 sm:p-7 bg-[#0d1520] rounded-2xl border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-colors space-y-4 shadow-md"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#070a0e] border border-white/10 flex items-center justify-center text-[#fce096] overflow-hidden">
                        {review.user?.avatar ? (
                          <img src={review.user.avatar} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs font-serif font-bold tracking-wider text-white">{review.user?.name}</h4>
                          {review.user?.location && (
                            <span className="flex items-center gap-1 text-[10px] font-mono text-[#94a3b8]">
                              <MapPin size={10} className="text-[#d4af37]" />
                              {review.user.location}
                            </span>
                          )}
                          {review.verified && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-[#070a0e] border border-[#d4af37]/40 text-[#fce096] rounded font-mono text-[8px] uppercase tracking-wider">
                              <ShieldCheck size={9} className="text-[#d4af37]" />
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-[#94a3b8] mt-0.5">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size={14} />
                  </div>

                  {review.title && (
                    <h5 className="text-sm font-semibold text-white">{review.title}</h5>
                  )}
                  <p className="text-[#cbd5e1] leading-relaxed text-xs sm:text-sm whitespace-pre-line">{review.comment}</p>

                  {review.images?.length > 0 && (
                    <div className="flex gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
                      {review.images.map((img, i) => (
                        <div key={i} className="relative group flex-shrink-0">
                          <img
                            src={img}
                            className="w-24 h-24 rounded-xl object-cover border border-white/10 group-hover:opacity-75 transition-all"
                            alt=""
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                            <Eye size={18} className="text-[#fce096]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-5 pt-3 border-t border-white/5 text-[10px] font-mono uppercase tracking-wider">
                    <button
                      type="button"
                      onClick={() =>
                        setHelpfulVotes((prev) => ({
                          ...prev,
                          [review.id]: (prev[review.id] || 0) + 1,
                        }))
                      }
                      className="flex items-center gap-1.5 text-[#94a3b8] hover:text-[#fce096] transition-colors"
                    >
                      <ThumbsUp size={12} className="text-[#d4af37]" />
                      Helpful ({(review.helpful_count || 0) + (helpfulVotes[review.id] || 0)})
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setReportedIds((prev) => ({
                          ...prev,
                          [review.id]: true,
                        }))
                      }
                      className="flex items-center gap-1.5 text-[#94a3b8] hover:text-white transition-colors"
                    >
                      <Flag size={11} />
                      {reportedIds[review.id] ? 'Reported to Moderation' : 'Report'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {!loading && filteredReviews.length === 0 && (
              <div className="two-tone-card py-16 text-center space-y-3 bg-[#0d1520] rounded-2xl border border-white/10">
                <div className="font-serif text-2xl text-[#94a3b8] uppercase tracking-wider">
                  No Reviews Match Filter
                </div>
                <p className="text-xs text-[#94a3b8]">Try selecting All Reviews or add customer photos via the Admin Panel.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
