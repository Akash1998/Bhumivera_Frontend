import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  MessageSquare, Star, CheckCircle, XCircle, AlertTriangle, 
  Search, Filter, RefreshCw, Archive, Eye, User, Box, 
  ShieldAlert, ThumbsUp, BarChart2, Camera, Video, Play, Save, X,
  Calendar, MapPin, Plus, Image as ImageIcon, ChevronLeft, ChevronRight, Edit3, Layers, Truck, Trash2
} from 'lucide-react';
import axios from 'axios';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import compressImageForUpload from '../../utils/compressImageForUpload';
import { getProductImageUrl as getImageUrl } from '../../utils/productImageUrl';

const REVIEW_MEDIA_PLACEHOLDER = '/images/review-placeholder.svg';
const MAX_REVIEW_MEDIA_BYTES = 25 * 1024 * 1024;

const STATUS_MAP = {
  'pending': { label: 'Awaiting Moderation', color: 'amber', icon: AlertTriangle },
  'approved': { label: 'Published (Live)', color: 'emerald', icon: CheckCircle },
  'rejected': { label: 'Filtered (Hidden)', color: 'rose', icon: XCircle }
};

const DEFAULT_PRODUCT_OPTIONS = [
  { id: 11, legacyId: 2, skuNumber: 2, name: 'Bhumivera Himalayan Sea Buckthorn Cellular Radiance Face Wash (₹799)', shortName: 'Sea Buckthorn Face Wash', slug: 'himalayan-seabuckthorn-luxury-face-wash', price: 799 },
  { id: 10, legacyId: 1, skuNumber: 1, name: 'Bhumivera Activated Charcoal Purifying Luxury Face Wash (₹699)', shortName: 'Activated Charcoal Face Wash', slug: 'activated-charcoal-luxury-face-wash', price: 699 },
  { id: 15, legacyId: 6, skuNumber: 6, name: 'Bhumivera Kalpvriksh Satva Tulsi — 7-Tulsi Liquid Extract (₹499)', shortName: 'Kalpvriksh 7-Tulsi Drops', slug: 'kalpvriksh-satva-tulsi-7-tulsi-extract', price: 499 },
  { id: 12, legacyId: 3, skuNumber: 3, name: 'Bhumivera Royal Botanical 2-in-1 Luxury Shampoo with Conditioner (₹899)', shortName: 'Royal 2-in-1 Shampoo', slug: 'luxury-2-in-1-botanical-shampoo-conditioner', price: 899 },
  { id: 13, legacyId: 4, skuNumber: 4, name: 'Bhumivera Charcoal Deep Cleansing Bar — Handmade Ayurvedic Soap (₹399)', shortName: 'Charcoal Cleansing Bar', slug: 'artisanal-charcoal-handmade-soap', price: 399 },
  { id: 14, legacyId: 5, skuNumber: 5, name: 'Bhumivera Soothing Bar — Aloe Vera, Neem & Tulsi Soap (₹349)', shortName: 'Aloe Neem Tulsi Bar', slug: 'artisanal-aloe-vera-handmade-soap', price: 349 },
];

const PRODUCT_OPTIONS = DEFAULT_PRODUCT_OPTIONS;

const CATEGORY_OPTIONS = [
  'Quick & Everyday Impressions',
  'Combo Pack Ritual',
  'Sensitive & Acne-Prone Skin',
  'Oily & Combination Skin',
  'Dry Skin, Aging & Barrier Health',
  'Hair & Scalp Ritual',
  'Internal Wellness & Immunity',
  'Balanced & Constructive',
  'Shipping & Packaging Feedback'
];

const PRESET_PRODUCT_PHOTOS = [
  { label: 'Sea Buckthorn Wash', url: '/images/products/bhumivera-seabuckthorn-luxury-face-wash.webp' },
  { label: 'Charcoal Face Wash', url: '/images/products/bhumivera-activated-charcoal-luxury-face-wash.webp' },
  { label: 'Kalpvriksh 7-Tulsi', url: '/images/products/bhumivera-kalpvriksh-satva-tulsi-drops.webp' },
  { label: 'Royal 2-in-1 Shampoo', url: '/images/products/bhumivera-luxury-2-in-1-shampoo-conditioner.webp' },
  { label: 'Bubble Wrap Parcel', url: '/assets/images/tracking-bubble-wrap.webp' },
  { label: 'Tamper Seal Check', url: '/assets/images/tracking-tamper-seal.webp' },
];

const PRESET_PRODUCT_VIDEOS = [
  { label: 'Sea Buckthorn Ritual Video', url: '/assets/videos/seabuckthorn-botanical.mp4' },
  { label: 'Charcoal Purification Video', url: '/assets/videos/charcoal-purification.mp4' },
  { label: '7-Tulsi Extract Video', url: '/assets/videos/tulsi-botanical.mp4' },
  { label: 'Unboxing & Seal Video', url: '/assets/videos/unboxing-protection.mp4' },
  { label: 'Aloe Cellular Lab Video', url: '/assets/videos/aloevera-cellular.mp4' },
];

const toDateInputValue = isoString => {
  if (!isoString) return new Date().toISOString().slice(0, 10);
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
};

export default function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoadError, setReviewLoadError] = useState('');
  
  // Filtering & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [mediaFilter, setMediaFilter] = useState('all'); // all | photos | videos | combo
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Inspector / Editor Modal State
  const [selectedReview, setSelectedReview] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [reviewDraft, setReviewDraft] = useState(null);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [mediaUploading, setMediaUploading] = useState(false);

  const { showToast } = useToast() || {};

  const normalizeReviewRecord = useCallback(r => {
    const slug = r.product_slug ||
      PRODUCT_OPTIONS.find(p => Number(p.id) === Number(r.product_id) || Number(p.legacyId) === Number(r.product_id))?.slug ||
      '';
    const prod = PRODUCT_OPTIONS.find(p => p.slug === slug || Number(p.id) === Number(r.product_id) || Number(p.legacyId) === Number(r.product_id));
    return {
      ...r,
      id: r.id || r._id,
      product_id: prod?.id || Number(r.product_id) || 10,
      product_slug: slug || prod?.slug || '',
      product_name: r.product_name || prod?.name || 'Bhumivera Product',
      user_name: r.user_name || r.reviewer_name || r.user?.name || 'Verified Patron',
      reviewer_name: r.reviewer_name || r.user_name || r.user?.name || 'Verified Patron',
      reviewer_location: r.reviewer_location || 'India',
      category_tag: r.category_tag || 'Quick & Everyday Impressions',
      is_combo_review: Boolean(r.is_combo_review || r.category_tag === 'Combo Pack Ritual'),
      status: Number(r.is_approved ?? 1) === 1 ? 'approved' : 'pending',
      is_approved: Number(r.is_approved ?? 1) === 1 ? 1 : 0,
      body: r.body || r.comment || '',
      comment: r.comment || r.body || '',
      images: Array.isArray(r.images) ? r.images : [],
      videos: Array.isArray(r.videos) ? r.videos : [],
    };
  }, []);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews', { adminAuth: true });
      const data = Array.isArray(res.data) ? res.data : (res.data?.reviews || res.data?.data || []);
      if (!Array.isArray(data)) {
        throw new Error('The reviews API returned an invalid response.');
      }
      setReviews(data.map(normalizeReviewRecord));
      setReviewLoadError('');
    } catch (error) {
      console.error('[ADMIN_REVIEWS_LOAD]', error);
      setReviews([]);
      setReviewLoadError('Reviews could not be loaded from the database. Check the API connection and retry.');
      showToast?.('Could not load reviews from the database.', 'error');
    } finally {
      setLoading(false);
    }
  }, [normalizeReviewRecord, showToast]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleInspect = review => {
    setIsCreatingNew(false);
    setSelectedReview(review);
    setCustomImageUrl('');
    setCustomVideoUrl('');
    const prod = PRODUCT_OPTIONS.find(p => p.slug === review.product_slug || Number(p.id) === Number(review.product_id) || Number(p.legacyId) === Number(review.product_id)) || PRODUCT_OPTIONS[0];
    setReviewDraft({
      product_id: prod.id,
      product_slug: prod.slug,
      product_name: prod.name,
      user_name: review.user_name || review.reviewer_name || 'Verified Patron',
      reviewer_location: review.reviewer_location || 'India',
      rating: Number(review.rating) || 5,
      category_tag: review.category_tag || 'Quick & Everyday Impressions',
      is_combo_review: Boolean(review.is_combo_review || review.category_tag === 'Combo Pack Ritual'),
      title: review.title || '',
      body: review.body || review.comment || '',
      created_date: toDateInputValue(review.created_at),
      is_approved: Number(review.is_approved ?? 1) === 1,
      images: Array.isArray(review.images) ? [...review.images] : [],
      videos: Array.isArray(review.videos) ? [...review.videos] : [],
    });
  };

  const handleStartCreateNew = () => {
    setIsCreatingNew(true);
    setCustomImageUrl('');
    setCustomVideoUrl('');
    const defaultProd = PRODUCT_OPTIONS[0];
    const blankReview = {
      id: `new-${Date.now()}`,
      product_id: defaultProd.id,
      product_name: defaultProd.name,
      user_name: '',
      reviewer_location: 'Asansol, WB',
      rating: 5,
      category_tag: 'Combo Pack Ritual',
      is_combo_review: true,
      title: '',
      body: '',
      status: 'approved',
      is_approved: 1,
      created_at: new Date().toISOString(),
      images: [],
      videos: [],
    };
    setSelectedReview(blankReview);
    setReviewDraft({
      product_id: defaultProd.id,
      user_name: '',
      reviewer_location: 'Asansol, WB',
      rating: 5,
      category_tag: 'Combo Pack Ritual',
      is_combo_review: true,
      title: '',
      body: '',
      created_date: toDateInputValue(new Date().toISOString()),
      is_approved: true,
      images: [],
      videos: [],
    });
  };

  const fileToDataUrl = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read local media file.'));
    reader.readAsDataURL(file);
  });

  const uploadAdminReviewMedia = async file => {
    if (file.size > MAX_REVIEW_MEDIA_BYTES) {
      throw new Error('Review media must be 25 MB or smaller.');
    }
    try {
      const response = await api.post('/reviews/admin/upload-url', {
        filename: file.name,
        fileType: file.type,
        size: file.size,
      }, { adminAuth: true });
      const { uploadUrl, key, fallbackDataUrlMode } = response.data || {};
      if (fallbackDataUrlMode || !uploadUrl || !key) {
        return await fileToDataUrl(file);
      }
      await axios.put(uploadUrl, file, { headers: { 'Content-Type': file.type } });
      return key;
    } catch {
      return await fileToDataUrl(file);
    }
  };

  const handleAdminImageAdd = async event => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length || !reviewDraft) return;
    const remainingSlots = 5 - (reviewDraft.images?.length || 0);
    if (remainingSlots <= 0) {
      showToast?.('Reviews can include up to 5 photos.', 'error');
      return;
    }
    setMediaUploading(true);
    try {
      const added = [];
      for (const file of files.slice(0, remainingSlots)) {
        const compressed = await compressImageForUpload(file);
        const key = await uploadAdminReviewMedia(compressed);
        added.push(key);
        setReviewDraft(cur => ({ ...cur, images: [...(cur.images || []), key].slice(0, 5) }));
      }
      if (added.length) {
        showToast?.(`${added.length} photo(s) attached to review.`, 'success');
      }
    } catch (error) {
      console.error('[ADMIN_REVIEW_IMAGE_UPLOAD]', error);
      showToast?.(error.response?.data?.message || error.message || 'Could not upload review photo.', 'error');
    } finally {
      setMediaUploading(false);
    }
  };

  const handleAdminVideoAdd = async event => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length || !reviewDraft) return;
    const remainingSlots = 3 - (reviewDraft.videos?.length || 0);
    if (remainingSlots <= 0) {
      showToast?.('Reviews can include up to 3 videos.', 'error');
      return;
    }
    setMediaUploading(true);
    try {
      const added = [];
      for (const file of files.slice(0, remainingSlots)) {
        const key = await uploadAdminReviewMedia(file);
        added.push(key);
        setReviewDraft(cur => ({ ...cur, videos: [...(cur.videos || []), key].slice(0, 3) }));
      }
      if (added.length) {
        showToast?.(`${added.length} video(s) attached to review.`, 'success');
      }
    } catch (error) {
      console.error('[ADMIN_REVIEW_VIDEO_UPLOAD]', error);
      showToast?.(error.response?.data?.message || error.message || 'Could not upload review video.', 'error');
    } finally {
      setMediaUploading(false);
    }
  };

  const saveReviewChanges = async () => {
    if (!selectedReview || !reviewDraft) return;
    if (!reviewDraft.body?.trim()) {
      showToast?.('Please enter customer review text before saving.', 'error');
      return;
    }
    setIsUpdating(true);
    try {
      const prodObj = PRODUCT_OPTIONS.find(p => Number(p.id) === Number(reviewDraft.product_id) || p.slug === reviewDraft.product_slug || Number(p.legacyId) === Number(reviewDraft.product_id)) || PRODUCT_OPTIONS[0];
      const isoCreatedAt = reviewDraft.created_date
        ? new Date(`${reviewDraft.created_date}T12:00:00Z`).toISOString()
        : new Date().toISOString();

      const payload = {
        product_id: Number(prodObj.id),
        product_name: prodObj.name,
        product_slug: prodObj.slug,
        user_name: (reviewDraft.user_name || 'Verified Patron').trim(),
        reviewer_name: (reviewDraft.user_name || 'Verified Patron').trim(),
        reviewer_location: (reviewDraft.reviewer_location || 'India').trim(),
        rating: Number(reviewDraft.rating) || 5,
        category_tag: reviewDraft.category_tag || 'Quick & Everyday Impressions',
        is_combo_review: Boolean(reviewDraft.is_combo_review || reviewDraft.category_tag === 'Combo Pack Ritual'),
        title: (reviewDraft.title || '').trim(),
        body: (reviewDraft.body || '').trim(),
        comment: (reviewDraft.body || '').trim(),
        created_at: isoCreatedAt,
        images: Array.isArray(reviewDraft.images) ? reviewDraft.images : [],
        videos: Array.isArray(reviewDraft.videos) ? reviewDraft.videos : [],
        is_approved: reviewDraft.is_approved ? 1 : 0,
        status: reviewDraft.is_approved ? 'approved' : 'pending'
      };

      if (isCreatingNew) {
        const response = await api.post('/reviews/admin', payload, { adminAuth: true });
        if (!response.data?.review?.id) throw new Error('The server did not return the saved review.');
        const savedReview = normalizeReviewRecord(response.data.review);
        setReviews(current => [savedReview, ...current]);
        showToast?.('Customer review saved to the database.', 'success');
      } else {
        const reviewId = selectedReview.id || selectedReview._id;
        const response = await api.put(`/reviews/admin/${reviewId}`, payload, { adminAuth: true });
        if (!response.data?.review) throw new Error('The server did not return the updated review.');
        const savedReview = normalizeReviewRecord(response.data.review);
        setReviews(current => current.map(review =>
          String(review.id) === String(reviewId) ? savedReview : review
        ));
        showToast?.('Review updated in the database.', 'success');
      }

      setSelectedReview(null);
      setReviewDraft(null);
      setIsCreatingNew(false);
    } catch (error) {
      console.error('[ADMIN_REVIEW_SAVE]', error);
      showToast?.(error.response?.data?.message || error.message || 'Could not save the review.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteReview = async (reviewId, isPermanent = true) => {
    const actionText = isPermanent ? 'permanently delete' : 'hide/archive';
    if (!window.confirm(`Are you sure you want to ${actionText} review #${reviewId}?`)) return;
    try {
      await api.delete(`/reviews/admin/${reviewId}?permanent=${isPermanent}`, { adminAuth: true });
      setReviews(current => current.filter(review => String(review.id) !== String(reviewId)));
      showToast?.(`Review #${reviewId} deleted successfully.`, 'success');
      if (selectedReview && String(selectedReview.id) === String(reviewId)) {
        setSelectedReview(null);
        setReviewDraft(null);
      }
    } catch (error) {
      console.error('[ADMIN_REVIEW_DELETE]', error);
      showToast?.(error.response?.data?.message || 'Could not delete the review.', 'error');
    }
  };

  const handleArchive = async (reviewId) => {
    return handleDeleteReview(reviewId, false);
  };

  // --- ANALYTICS & PRODUCT BREAKDOWN ---
  const productBreakdown = useMemo(() => {
    return PRODUCT_OPTIONS.map(prod => {
      const pRevs = reviews.filter(r =>
        (r.product_slug === prod.slug ||
         Number(r.product_id) === Number(prod.id) ||
         Number(r.product_id) === Number(prod.legacyId)) &&
        r.status === 'approved'
      );
      const count = pRevs.length;
      const avg = count > 0
        ? (pRevs.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / count).toFixed(2)
        : '0.00';
      return { ...prod, count, avg };
    });
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const searchStr = `${r.title || ''} ${r.body || r.comment || ''} ${r.user_name || ''} ${r.reviewer_location || ''} ${r.product_name || ''} ${r.category_tag || ''} ${r.order_number || ''}`.toLowerCase();
      if (searchTerm.trim() && !searchStr.includes(searchTerm.toLowerCase())) return false;
      if (productFilter !== 'all') {
        const matchesSlug = r.product_slug === productFilter;
        const matchesOption = PRODUCT_OPTIONS.some(p => p.slug === productFilter && (Number(p.id) === Number(r.product_id) || Number(p.legacyId) === Number(r.product_id)));
        if (!matchesSlug && !matchesOption) return false;
      }
      if (categoryFilter !== 'all') {
        if (categoryFilter === 'Combo Pack Ritual') {
          if (!r.is_combo_review && r.category_tag !== 'Combo Pack Ritual') return false;
        } else if (r.category_tag !== categoryFilter) {
          return false;
        }
      }
      if (yearFilter !== 'all' && !String(r.created_at || '').startsWith(yearFilter)) return false;
      if (ratingFilter !== 'all' && parseInt(r.rating, 10) !== parseInt(ratingFilter, 10)) return false;
      if (mediaFilter === 'photos' && (!Array.isArray(r.images) || r.images.length === 0)) return false;
      if (mediaFilter === 'videos' && (!Array.isArray(r.videos) || r.videos.length === 0)) return false;
      return true;
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [reviews, searchTerm, productFilter, categoryFilter, yearFilter, ratingFilter, mediaFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / itemsPerPage));
  const paginatedReviews = filteredReviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Telemetry KPIs
  const totalReviews = reviews.length;
  const comboRevs = reviews.filter(r => r.is_combo_review || r.category_tag === 'Combo Pack Ritual');
  const comboAvg = comboRevs.length > 0
    ? (comboRevs.reduce((a, r) => a + (Number(r.rating) || 5), 0) / comboRevs.length).toFixed(2)
    : '0.00';
  const oneStarShippingCount = reviews.filter(r =>
    Number(r.rating) === 1 && /shipping|packaging|transit/i.test(r.category_tag || '')
  ).length;
  const mediaReviewsCount = reviews.filter(r => (r.images?.length || 0) > 0 || (r.videos?.length || 0) > 0).length;
  const reviewedProductCount = productBreakdown.filter(product => product.count > 0).length;

  return (
    <div className="space-y-6 text-slate-300 font-sans animate-in fade-in duration-500">
      
      {/* COMMAND HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d4af37]/20">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-3">
            Customer Reviews &amp; Media Database ({totalReviews} reviews)
          </h1>
          <p className="text-slate-400 text-xs mt-1 flex items-center gap-2">
            <BarChart2 size={13} className="text-[#d4af37]" /> Database-backed reviews across {reviewedProductCount} of 6 products · Manual date, star rating, photo &amp; video uploads
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleStartCreateNew}
            className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[#081b15] hover:bg-[#fce096] transition-all shadow-lg"
          >
            <Plus size={16} /> Add Review (Photo / Video)
          </button>
          <button
            type="button"
            onClick={fetchReviews}
            disabled={loading}
            aria-label="Refresh customer reviews"
            className="p-2.5 bg-[#10241f]/85 border border-slate-800 text-slate-300 rounded-xl hover:bg-slate-800 hover:text-amber-400 transition-all"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      {reviewLoadError && <p role="alert" className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-4 text-sm text-rose-200">{reviewLoadError}</p>}

      {/* KPI DASHBOARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#10241f]/45 border border-slate-800/80 p-5 rounded-3xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#081b15]/90 border border-slate-800 text-emerald-400"><MessageSquare size={22} /></div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Database Reviews</p>
            <h4 className="text-2xl font-black text-white mt-0.5">{totalReviews} <span className="text-xs font-normal text-emerald-400">{reviewedProductCount} products</span></h4>
          </div>
        </div>
        <div className="bg-[#10241f]/45 border border-[#d4af37]/35 p-5 rounded-3xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#081b15]/90 border border-[#d4af37]/40 text-[#d4af37]"><Layers size={22} /></div>
          <div>
            <p className="text-[10px] font-black uppercase text-[#fce096] tracking-widest">Best Mid-Priced Combo</p>
            <h4 className="text-2xl font-black text-white mt-0.5">{comboAvg} ★ <span className="text-xs text-[#fce096]">({comboRevs.length} reviews)</span></h4>
          </div>
        </div>
        <div className="bg-[#10241f]/45 border border-slate-800/80 p-5 rounded-3xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#081b15]/90 border border-slate-800 text-amber-400"><Truck size={22} /></div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">1★ Shipping / Packaging</p>
            <h4 className="text-2xl font-black text-white mt-0.5">{oneStarShippingCount} <span className="text-xs text-amber-300">database reviews</span></h4>
          </div>
        </div>
        <div className="bg-[#10241f]/45 border border-slate-800/80 p-5 rounded-3xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#081b15]/90 border border-slate-800 text-cyan-400"><Video size={22} /></div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Photo &amp; Video Reviews</p>
            <h4 className="text-2xl font-black text-white mt-0.5">{mediaReviewsCount} <span className="text-xs text-cyan-300">Rich Media</span></h4>
          </div>
        </div>
      </div>

      {/* 6 PRODUCTS RATING & VOLUME MATRIX (ALL > 4.5★) */}
      <div className="bg-[#10241f]/45 border border-slate-800/80 rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">
            Product-wise database reviews · Click a SKU to filter
          </span>
          {productFilter !== 'all' && (
            <button
              type="button"
              onClick={() => { setProductFilter('all'); setCurrentPage(1); }}
              className="text-xs text-amber-400 underline"
            >
              Show All 6 Products ({totalReviews})
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {productBreakdown.map(item => {
            const active = productFilter === item.slug;
            return (
              <button
                key={item.slug || item.id}
                type="button"
                onClick={() => { setProductFilter(active ? 'all' : item.slug); setCurrentPage(1); }}
                className={`text-left p-3 rounded-2xl border transition-all ${
                  active
                    ? 'bg-[#d4af37]/25 border-[#d4af37] text-white ring-2 ring-[#d4af37]/40 shadow-lg'
                    : 'bg-[#081b15]/80 border-slate-800/90 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-black text-amber-400">{item.avg} ★</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">{item.count} rev</span>
                </div>
                <p className="text-[11px] font-bold text-white truncate mt-1">{item.shortName}</p>
                <p className="text-[10px] text-slate-400 font-mono">SKU #{item.skuNumber || item.legacyId || item.id} · ₹{item.price}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col lg:flex-row gap-3 bg-[#10241f]/45 border border-slate-800/80 p-4 rounded-3xl shadow-lg">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500" size={17} />
          <input 
            type="text"
            placeholder="Search 1,080+ reviews by customer, city, keyword, order #…"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-[#081b15]/90 border border-slate-800 focus:border-amber-500/50 rounded-xl py-3 pl-11 pr-4 text-white font-semibold text-xs outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2.5">
          <select 
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            aria-label="Filter by classification category"
            className="bg-[#081b15]/90 border border-slate-800 rounded-xl py-3 px-3 text-white font-bold text-xs outline-none cursor-pointer"
          >
            <option value="all">All Classifications</option>
            {CATEGORY_OPTIONS.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            value={ratingFilter}
            onChange={(e) => { setRatingFilter(e.target.value); setCurrentPage(1); }}
            aria-label="Filter by star rating"
            className="bg-[#081b15]/90 border border-slate-800 rounded-xl py-3 px-3 text-white font-bold text-xs outline-none cursor-pointer"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">5 ★ Only</option>
            <option value="4">4 ★ Only</option>
            <option value="3">3 ★ (Constructive)</option>
            <option value="2">2 ★ (Mixed)</option>
            <option value="1">1 ★ (50 Shipping/Box Only)</option>
          </select>

          <select 
            value={yearFilter}
            onChange={(e) => { setYearFilter(e.target.value); setCurrentPage(1); }}
            aria-label="Filter by review year"
            className="bg-[#081b15]/90 border border-slate-800 rounded-xl py-3 px-3 text-white font-bold text-xs outline-none cursor-pointer"
          >
            <option value="all">All Years (2020–2026)</option>
            {['2026', '2025', '2024', '2023', '2022', '2021', '2020'].map(yr => (
              <option key={yr} value={yr}>Year {yr}</option>
            ))}
          </select>

          <select 
            value={mediaFilter}
            onChange={(e) => { setMediaFilter(e.target.value); setCurrentPage(1); }}
            aria-label="Filter by media attachment"
            className="bg-[#081b15]/90 border border-slate-800 rounded-xl py-3 px-3 text-white font-bold text-xs outline-none cursor-pointer"
          >
            <option value="all">All Media Types</option>
            <option value="photos">With Photos</option>
            <option value="videos">With Videos</option>
          </select>

          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            aria-label="Reviews per page"
            className="bg-[#081b15]/90 border border-slate-800 rounded-xl py-3 px-3 text-white font-bold text-xs outline-none cursor-pointer"
          >
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
            <option value={1200}>Show All ({filteredReviews.length})</option>
          </select>
        </div>
      </div>

      {/* MODERATION FEED TABLE */}
      <div className="bg-[#10241f]/35 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#081b15]/80 border-b border-slate-800">
                <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Product &amp; Category</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Patron &amp; Date</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Rating &amp; Review</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Photo / Video</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Manual Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {paginatedReviews.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-sm text-slate-400">
                    {loading ? 'Loading reviews from the database…' : reviewLoadError || 'No database reviews match these filters.'}
                  </td>
                </tr>
              )}
              {paginatedReviews.map(review => {
                const rRating = parseInt(review.rating, 10) || 5;
                return (
                  <tr key={review.id || review._id} className="hover:bg-amber-500/[0.03] transition-colors">
                    <td className="p-4">
                      <div className="max-w-[190px]">
                        <p className="text-xs font-bold text-white line-clamp-1">{review.product_name}</p>
                        <span className="inline-block mt-1 text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-[#d4af37]">
                          {review.category_tag}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-xs font-bold text-white">{review.user_name}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} className="text-[#d4af37]" /> {review.reviewer_location}
                      </p>
                      <p className="text-[10px] text-cyan-300 font-mono mt-1 flex items-center gap-1">
                        <Calendar size={10} /> {toDateInputValue(review.created_at)}
                      </p>
                    </td>
                    <td className="p-4 max-w-md">
                      {(() => {
                        const reviewText = review.body || review.comment || '';
                        const wordCount = reviewText.trim() ? reviewText.trim().split(/\s+/).length : 0;
                        return (
                          <>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-1 text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={12} fill={i < rRating ? "currentColor" : "none"} className={i < rRating ? "" : "text-slate-700"} />
                                ))}
                                <span className="ml-1 text-[10px] font-bold text-white">{rRating}/5</span>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-bold">
                                {wordCount} {wordCount === 1 ? 'word' : 'words'} · {reviewText.length} chars
                              </span>
                            </div>
                            {review.title && <p className="text-xs font-bold text-white">{review.title}</p>}
                            <p className="text-xs text-slate-300 line-clamp-3 mt-0.5 whitespace-pre-wrap">{reviewText}</p>
                          </>
                        );
                      })()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {review.images?.length > 0 && (
                          <div className="flex items-center gap-1">
                            <img
                              src={getImageUrl(review.images[0])}
                              alt="Attachment"
                              className="w-9 h-9 rounded-lg object-cover border border-[#d4af37]/40"
                              onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/logo.webp'; }}
                            />
                            <span className="text-[10px] font-bold text-cyan-300">{review.images.length}P</span>
                          </div>
                        )}
                        {review.videos?.length > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 px-2 py-1 text-[10px] font-bold text-emerald-300">
                            <Video size={11} /> {review.videos.length}V
                          </span>
                        )}
                        {!review.images?.length && !review.videos?.length && (
                          <span className="text-[10px] text-slate-500">Text only</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button 
                          type="button"
                          onClick={() => handleInspect(review)}
                          className="px-3 py-1.5 bg-[#081b15] border border-[#d4af37]/40 rounded-xl text-[#fce096] hover:bg-[#d4af37] hover:text-slate-950 transition-all text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow"
                          title="View / Edit review details & media"
                        >
                          <Edit3 size={13} /> View / Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(review.id || review._id, true)}
                          className="p-2 bg-rose-950/60 border border-rose-500/30 rounded-xl text-rose-300 hover:bg-rose-600 hover:text-white transition-all text-[10px]"
                          title="Permanently delete review from database"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-[#081b15]/90 border-t border-slate-800 text-xs">
          <span className="text-slate-400">
            Showing <strong className="text-white">{(currentPage - 1) * itemsPerPage + 1}</strong>–<strong className="text-white">{Math.min(currentPage * itemsPerPage, filteredReviews.length)}</strong> of <strong className="text-[#fce096]">{filteredReviews.length}</strong> reviews
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#10241f] border border-slate-700 text-white disabled:opacity-40"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span className="px-3 py-1 font-mono text-xs text-[#fce096]">
              Page {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#10241f] border border-slate-700 text-white disabled:opacity-40"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* MANUAL REVIEW & MEDIA EDITOR MODAL */}
      {selectedReview && reviewDraft && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#10241f] border border-[#d4af37]/40 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto">
            
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#081b15]">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Edit3 size={20} className="text-[#d4af37]" />
                  {isCreatingNew ? 'Add New Customer Review to Database' : `Edit Database Review #${selectedReview.id}`}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Change review date (2020–2029+), star rating (1–5), product classification, and attach customer photos &amp; videos
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setSelectedReview(null); setReviewDraft(null); setIsCreatingNew(false); }}
                className="p-2.5 bg-[#10241f] border border-slate-700 hover:text-rose-400 rounded-xl"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="block text-xs font-bold uppercase text-slate-300">
                  Assigned Product (1–6)
                  <select
                    value={reviewDraft.product_id}
                    onChange={e => setReviewDraft(cur => ({ ...cur, product_id: Number(e.target.value) }))}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 text-xs text-white"
                  >
                    {PRODUCT_OPTIONS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </label>

                <label className="block text-xs font-bold uppercase text-slate-300">
                  Classification Category
                  <select
                    value={reviewDraft.category_tag}
                    onChange={e => setReviewDraft(cur => ({
                      ...cur,
                      category_tag: e.target.value,
                      is_combo_review: e.target.value === 'Combo Pack Ritual'
                    }))}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 text-xs text-white"
                  >
                    {CATEGORY_OPTIONS.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </label>

                <label className="block text-xs font-bold uppercase text-slate-300">
                  Rating Out of 5 Stars
                  <div className="mt-1.5 flex items-center gap-2">
                    <select
                      value={reviewDraft.rating}
                      onChange={e => setReviewDraft(cur => ({ ...cur, rating: Number(e.target.value) }))}
                      className="rounded-xl border border-slate-700 bg-[#081b15] p-3 text-xs font-bold text-amber-400"
                    >
                      {[5, 4, 3, 2, 1].map(r => (
                        <option key={r} value={r}>{r} / 5 Stars</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(starNum => (
                        <button
                          key={starNum}
                          type="button"
                          onClick={() => setReviewDraft(cur => ({ ...cur, rating: starNum }))}
                          className="p-0.5 text-amber-400 hover:scale-110"
                        >
                          <Star size={18} fill={starNum <= Number(reviewDraft.rating) ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="block text-xs font-bold uppercase text-slate-300">
                  Customer Name
                  <input
                    type="text"
                    value={reviewDraft.user_name}
                    onChange={e => setReviewDraft(cur => ({ ...cur, user_name: e.target.value }))}
                    placeholder="e.g. Rakesh K."
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 text-sm text-white"
                  />
                </label>

                <label className="block text-xs font-bold uppercase text-slate-300">
                  Customer City / State
                  <input
                    type="text"
                    value={reviewDraft.reviewer_location}
                    onChange={e => setReviewDraft(cur => ({ ...cur, reviewer_location: e.target.value }))}
                    placeholder="e.g. Asansol, WB"
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 text-sm text-white"
                  />
                </label>

                <label className="block text-xs font-bold uppercase text-[#fce096]">
                  Review Date (2020 – 2029+)
                  <input
                    type="date"
                    min="2016-01-01"
                    max="2030-12-31"
                    value={reviewDraft.created_date}
                    onChange={e => setReviewDraft(cur => ({ ...cur, created_date: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-[#d4af37]/50 bg-[#081b15] p-3 text-sm font-mono text-[#fce096]"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase text-slate-300">
                  Review Headline
                  <input
                    type="text"
                    maxLength={255}
                    value={reviewDraft.title}
                    onChange={e => setReviewDraft(cur => ({ ...cur, title: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 text-sm text-white"
                  />
                </label>

                <label className="block text-xs font-bold uppercase text-slate-300">
                  <div className="flex items-center justify-between mb-1">
                    <span>Customer Review Text</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold normal-case">
                      {((reviewDraft.body || '').trim().split(/\s+/).filter(Boolean).length)} words · {(reviewDraft.body || '').length} characters
                    </span>
                  </div>
                  <textarea
                    maxLength={5000}
                    rows={6}
                    value={reviewDraft.body}
                    onChange={e => setReviewDraft(cur => ({ ...cur, body: e.target.value }))}
                    className="w-full resize-y rounded-xl border border-slate-700 bg-[#081b15] p-3 text-sm text-white leading-relaxed focus:border-amber-400 outline-none"
                    placeholder="Enter customer review text..."
                  />
                </label>
              </div>

              {/* PHOTO ATTACHMENT STUDIO */}
              <div className="rounded-2xl border border-slate-800 bg-[#081b15]/90 p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Camera size={16} className="text-[#d4af37]" />
                      Customer Photos ({reviewDraft.images?.length || 0} / 5)
                    </h4>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#d4af37] px-4 py-2 text-xs font-black uppercase text-[#081b15] hover:bg-[#fce096]">
                    <Camera size={14} /> Upload Photo File
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleAdminImageAdd} />
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customImageUrl}
                    onChange={e => setCustomImageUrl(e.target.value)}
                    placeholder="Or paste photo URL..."
                    className="flex-1 rounded-xl border border-slate-700 bg-[#10241f] px-3 py-2 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!customImageUrl.trim() || (reviewDraft.images?.length || 0) >= 5) return;
                      setReviewDraft(cur => ({ ...cur, images: [...(cur.images || []), customImageUrl.trim()] }));
                      setCustomImageUrl('');
                    }}
                    className="px-4 py-2 rounded-xl border border-cyan-500/40 text-cyan-300 text-xs font-bold"
                  >
                    Attach Photo URL
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {PRESET_PRODUCT_PHOTOS.map(preset => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => {
                        if ((reviewDraft.images?.length || 0) >= 5) return;
                        setReviewDraft(cur => ({ ...cur, images: [...(cur.images || []), preset.url] }));
                      }}
                      className="rounded-lg border border-slate-700 bg-[#10241f] px-2.5 py-1 text-[11px] text-slate-200 hover:border-[#d4af37]"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  {(reviewDraft.images || []).map((image, index) => (
                    <div key={`${image}-${index}`} className="relative h-20 w-20 overflow-hidden rounded-xl border border-[#d4af37]/50 bg-black">
                      <img src={getImageUrl(image)} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setReviewDraft(cur => ({ ...cur, images: cur.images.filter((_, idx) => idx !== index) }))}
                        className="absolute right-1 top-1 rounded-full bg-black/80 p-1 text-white hover:bg-rose-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* VIDEO ATTACHMENT STUDIO */}
              <div className="rounded-2xl border border-slate-800 bg-[#081b15]/90 p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Video size={16} className="text-emerald-400" />
                      Customer Videos ({reviewDraft.videos?.length || 0} / 3)
                    </h4>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black uppercase text-[#081b15] hover:bg-emerald-400">
                    <Video size={14} /> Upload Video File (MP4/WebM)
                    <input type="file" accept="video/mp4,video/webm" multiple className="hidden" onChange={handleAdminVideoAdd} />
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customVideoUrl}
                    onChange={e => setCustomVideoUrl(e.target.value)}
                    placeholder="Or paste video URL (e.g. /assets/videos/seabuckthorn-botanical.mp4)"
                    className="flex-1 rounded-xl border border-slate-700 bg-[#10241f] px-3 py-2 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!customVideoUrl.trim() || (reviewDraft.videos?.length || 0) >= 3) return;
                      setReviewDraft(cur => ({ ...cur, videos: [...(cur.videos || []), customVideoUrl.trim()] }));
                      setCustomVideoUrl('');
                    }}
                    className="px-4 py-2 rounded-xl border border-emerald-500/40 text-emerald-300 text-xs font-bold"
                  >
                    Attach Video URL
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {PRESET_PRODUCT_VIDEOS.map(preset => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => {
                        if ((reviewDraft.videos?.length || 0) >= 3) return;
                        setReviewDraft(cur => ({ ...cur, videos: [...(cur.videos || []), preset.url] }));
                      }}
                      className="rounded-lg border border-slate-700 bg-[#10241f] px-2.5 py-1 text-[11px] text-emerald-300 hover:border-emerald-400"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  {(reviewDraft.videos || []).map((vid, index) => (
                    <div key={`${vid}-${index}`} className="relative h-24 w-32 overflow-hidden rounded-xl border border-emerald-500/50 bg-black">
                      {vid === REVIEW_MEDIA_PLACEHOLDER
                        ? <img src={getImageUrl(vid)} alt="Video placeholder; replace with the uploaded customer video" className="h-full w-full object-cover" />
                        : <video src={getImageUrl(vid)} controls className="h-full w-full object-cover" />}
                      <button
                        type="button"
                        onClick={() => setReviewDraft(cur => ({ ...cur, videos: cur.videos.filter((_, idx) => idx !== index) }))}
                        className="absolute right-1 top-1 rounded-full bg-black/80 p-1 text-white hover:bg-rose-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <label className="flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(reviewDraft.is_approved)}
                    onChange={event => setReviewDraft(cur => ({ ...cur, is_approved: event.target.checked }))}
                    className="h-4 w-4 accent-emerald-500"
                  />
                  Published &amp; Visible on Product Page
                </label>

                <div className="flex items-center gap-3">
                  {!isCreatingNew && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(selectedReview.id, false)}
                        className="px-3.5 py-2.5 bg-amber-950/40 border border-amber-500/30 text-amber-300 font-bold uppercase text-xs rounded-xl hover:bg-amber-600 hover:text-white flex items-center gap-1.5 transition-all"
                        title="Hide review without removing from database"
                      >
                        <Archive size={14} /> Unpublish
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(selectedReview.id, true)}
                        className="px-3.5 py-2.5 bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold uppercase text-xs rounded-xl hover:bg-rose-600 hover:text-white flex items-center gap-1.5 transition-all"
                        title="Permanently delete review from database"
                      >
                        <Trash2 size={14} /> Delete Review
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    disabled={isUpdating || mediaUploading}
                    onClick={saveReviewChanges}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3 text-xs font-black uppercase tracking-widest text-[#081b15] hover:bg-[#fce096] disabled:opacity-50 shadow-lg"
                  >
                    <Save size={15} /> {isUpdating ? 'Saving…' : 'Save Review to Database'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
