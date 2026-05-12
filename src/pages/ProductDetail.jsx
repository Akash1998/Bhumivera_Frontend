import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Star, Leaf, Heart, Shield, Truck, Zap, ChevronRight, 
  Minus, Plus, CheckCircle2, AlertCircle, Play, Droplet, Microscope
} from 'lucide-react';
import { 
  products as productsApi, 
  reviews as reviewsApi, 
  fitment as fitmentApi, 
  cart as cartApi
} from '../services/api';

// --- Safe Image URL Helper ---
const getImageUrl = (img) => {
  if (!img) return '/logo.webp';
  let path = typeof img === 'object' ? (img.url || img.file_path || img.path) : img;
  if (!path) return '/logo.webp';
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_R2_PUBLIC_URL || import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-22cd43cce9bc475680ad496e199706c4.r2.dev';
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // --- STATE HOOKS ---
  const [product, setProduct] = useState(null);
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [isAdding, setIsAdding] = useState(false);

  // --- ANIMATION HOOKS ---
  const { scrollY } = useScroll();
  const showStickyBar = useTransform(scrollY, [0, 800], [0, 1]);
  const stickyYOffset = useTransform(showStickyBar, [0, 1], [50, 0]);

  // --- EFFECT HOOKS ---
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        let fetchedProduct = null;
        try {
          const prodRes = await productsApi.getById(id);
          fetchedProduct = prodRes.data?.data || prodRes.data;
        } catch (err) {
          const slugRes = await productsApi.getBySlug(id);
          fetchedProduct = slugRes.data?.data || slugRes.data;
        }
        
        setProduct(fetchedProduct);
        if (fetchedProduct?.images?.length > 0) {
          setActiveMedia(fetchedProduct.images[0]);
        }

        if (fetchedProduct && fetchedProduct.id) {
          try {
            const revRes = await reviewsApi.getByProduct(fetchedProduct.id);
            setReviewsData(revRes.data?.data || revRes.data || []);
          } catch (revErr) {
            setReviewsData([]);
          }
        }
      } catch (err) {
        console.error("Failed to load product ecosystem:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    try {
      await cartApi.add({ productId: product.id, quantity });
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      setTimeout(() => setIsAdding(false), 800);
    }
  };

  const isOutOfStock = product?.quantity <= 0;
  const savings = product?.discount_price ? product.price - product.discount_price : 0;

  return (
    <>
      {loading && <SkeletonPDP />}

      {!loading && !product && (
        <div className="min-h-screen flex items-center justify-center text-olive-800 bg-alabaster font-black uppercase tracking-widest text-2xl">
          Botanical Profile Not Found.
        </div>
      )}

      {!loading && product && (
        <div className="bg-alabaster text-[#1A1C18] min-h-screen selection:bg-olive-500 selection:text-white pt-24 pb-32 font-sans relative">
          
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-striped-olive pointer-events-none opacity-20"></div>

          <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 relative z-10">
            <Link to="/" className="hover:text-olive-600 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to={`/shop?category=${product.category_id}`} className="hover:text-olive-600 transition-colors">{product.category_name || 'Botanicals'}</Link>
            <ChevronRight size={14} />
            <span className="text-olive-800 truncate max-w-[200px]">{product.name}</span>
          </div>

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
            
            {/* MEDIA GALLERY */}
            <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6 relative">
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 shrink-0 no-scrollbar py-1">
                {product.images?.map((media, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveMedia(media)}
                    className={`relative w-20 h-20 md:w-24 md:h-24 rounded-none overflow-hidden border-2 transition-all duration-300 shrink-0 ${
                      activeMedia?.url === media.url ? 'border-olive-600 shadow-[2px_2px_0px_#6b6b00]' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {media.type === 'video' ? (
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center"><Play size={24} className="text-olive-600" /></div>
                    ) : (
                      <img src={getImageUrl(media)} alt="Thumbnail" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                    )}
                  </button>
                ))}
              </div>

              <div className="relative w-full aspect-square md:aspect-auto md:h-[700px] bg-white border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center lg:sticky lg:top-32 group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMedia?.url}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-full p-8"
                  >
                    {activeMedia?.type === 'video' ? (
                      <video src={getImageUrl(activeMedia)} autoPlay loop muted controls className="w-full h-full object-contain" />
                    ) : (
                      <img src={getImageUrl(activeMedia)} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
                  {product.is_new_arrival === 1 && <span className="bg-olive-600 text-white px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest">SOP-104 Validated</span>}
                </div>
                
                <button className="absolute top-6 right-6 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-olive-600 hover:border-olive-600 transition-all duration-300 z-10">
                  <Heart size={20} />
                </button>
              </div>
            </div>

            {/* PRODUCT DETAILS (BOTANICAL SPEC SHEET) */}
            <div className="lg:col-span-5 flex flex-col relative">
              <div className="mb-8 border-b border-gray-200 pb-8">
                <div className="text-olive-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-2 block">
                  Batch Status: Active // SKU: {product.sku || 'N/A'}
                </div>
                <h1 className="text-4xl md:text-5xl font-light tracking-tighter leading-[1.1] mb-6 italic text-[#1A1C18]">
                  {product.name}
                </h1>
                
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-end gap-4">
                    <span className="text-4xl font-light tracking-tighter text-olive-800">
                      ₹{product.discount_price || product.price}
                    </span>
                    {product.discount_price && (
                      <span className="text-xl font-medium text-gray-400 line-through mb-1">₹{product.price}</span>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed font-medium">
                  {product.description?.substring(0, 200)}...
                </p>
              </div>

              {/* ACTION AREA */}
              <div className="bg-white border border-gray-200 p-8 mb-8 relative">
                <div className="flex items-center gap-4 mb-6">
                  <span className={`flex items-center gap-2 text-xs font-mono uppercase tracking-widest ${isOutOfStock ? 'text-red-500' : 'text-olive-600'}`}>
                    <Microscope size={16} />
                    {isOutOfStock ? 'Lab Reserves Depleted' : 'In Stock & Ready for Transit'}
                  </span>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-between bg-gray-50 border border-gray-200 w-32 px-2 py-1">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-olive-600 transition-colors">
                      <Minus size={16} />
                    </button>
                    <span className="font-mono text-lg w-8 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-olive-600 transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>

                  <button 
                    onClick={handleAddToCart} 
                    disabled={isOutOfStock || isAdding}
                    className="flex-1 bg-olive-600 hover:bg-olive-700 text-white font-mono uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-1 active:translate-x-1"
                  >
                    <span className={`flex items-center gap-2 transition-transform duration-300 ${isAdding ? '-translate-y-12' : ''}`}>
                      <Leaf size={16} /> Acquire Formulation
                    </span>
                    <span className={`absolute inset-0 flex items-center justify-center gap-2 bg-olive-500 transition-transform duration-300 ${isAdding ? 'translate-y-0' : 'translate-y-12'}`}>
                      <CheckCircle2 size={16} /> Logged to Ledger
                    </span>
                  </button>
                </div>
              </div>

              {/* BRAND TRUST WIDGETS */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Shield />, title: "Somatic Registry", sub: "Verify Batch Origin via SNA-2" },
                  { icon: <Droplet />, title: "Zero Heat Damage", sub: "SOP-104 Cold Saponification" }
                ].map((item, i) => (
                  <Link to={i === 0 ? "/somatic-registry" : "/science"} key={i} className="flex flex-col gap-2 p-6 bg-white border border-gray-200 hover:border-olive-500 transition-colors group cursor-pointer">
                    <div className="text-olive-500 group-hover:scale-110 transition-transform origin-left">{item.icon}</div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-800">{item.title}</h4>
                      <p className="text-[9px] font-mono text-gray-500 mt-1">{item.sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* TABBED INTERFACE */}
          <div className="max-w-7xl mx-auto px-6 mt-32 relative z-10">
            <div className="flex border-b border-gray-200 mb-12 relative overflow-x-auto no-scrollbar">
              {['details', 'specifications', 'clinical reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-6 px-8 text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap relative ${
                    activeTab === tab ? 'text-olive-600' : 'text-gray-400 hover:text-gray-800'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 w-full h-0.5 bg-olive-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === 'details' && (
                  <motion.div key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-gray-600 leading-loose text-base max-w-4xl whitespace-pre-wrap">
                    {product.description}
                  </motion.div>
                )}
                
                {activeTab === 'specifications' && (
                  <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl border border-gray-200 bg-white p-8">
                    <h3 className="text-xl font-light italic mb-8 border-b border-gray-100 pb-4">Molecular Inventory Spec</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                      {[
                        { label: 'Formulation Code', value: product.sku },
                        { label: 'Extraction Origin', value: product.brand || 'Bhumivera Asansol' },
                        { label: 'pH Balance', value: 'Buffered to 5.5' },
                        { label: 'Bioavailability', value: 'Maximized via Cold-Process' },
                      ].map((spec, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-gray-100 border-dashed">
                          <span className="text-gray-400 font-mono uppercase text-[10px] tracking-widest">{spec.label}</span>
                          <span className="text-olive-800 font-medium text-sm">{spec.value || 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'clinical reviews' && (
                  <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl">
                    {reviewsData.length > 0 ? (
                      reviewsData.map((review, i) => (
                        <div key={i} className="p-8 bg-white border border-gray-200 mb-6 relative">
                          <div className="absolute top-0 right-0 p-4 text-[10px] font-mono text-gray-300 uppercase">SNA-2 Verified</div>
                          <div className="flex items-center gap-1 text-olive-500 mb-4">
                            {[...Array(5)].map((_, idx) => <Star key={idx} size={14} fill={idx < review.rating ? "currentColor" : "none"} />)}
                          </div>
                          <h4 className="text-lg font-medium text-gray-800 mb-2 italic">"{review.title}"</h4>
                          <p className="text-gray-500 text-sm mb-6">{review.comment}</p>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-t border-gray-100 pt-4">{review.user_name}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-24 bg-white border border-gray-200">
                        <Microscope className="mx-auto text-gray-300 mb-4" size={40} />
                        <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest">No Clinical Data Available</h3>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* STICKY BAR */}
          <motion.div 
            style={{ opacity: showStickyBar, y: stickyYOffset }}
            className="fixed bottom-0 left-0 w-full z-50 p-4 pointer-events-none"
          >
            <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl border border-olive-500/20 p-3 shadow-lg flex items-center justify-between pointer-events-auto">
              <div className="hidden md:flex items-center gap-4 pl-2">
                <div className="w-10 h-10 border border-gray-200 overflow-hidden">
                  <img src={getImageUrl(activeMedia)} className="w-full h-full object-cover mix-blend-multiply" alt="sticky" />
                </div>
                <div>
                  <h4 className="text-xs font-medium italic text-gray-800 line-clamp-1">{product.name}</h4>
                  <p className="text-olive-600 font-mono text-[10px] tracking-widest">₹{product.discount_price || product.price}</p>
                </div>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full md:w-auto px-8 py-3 bg-olive-600 text-white font-mono uppercase tracking-widest text-[10px] hover:bg-olive-700 transition-colors disabled:opacity-50"
              >
                Acquire Formulation
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

const SkeletonPDP = () => (
  <div className="bg-alabaster min-h-screen pt-24 pb-32 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse opacity-50">
      <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
        <div className="flex md:flex-col gap-4 w-full md:w-24">
          {[1,2,3,4].map(i => <div key={i} className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 shrink-0"></div>)}
        </div>
        <div className="w-full h-[500px] md:h-[700px] bg-gray-200"></div>
      </div>
      <div className="lg:col-span-5 flex flex-col gap-8 pt-8">
        <div className="h-12 bg-gray-200 w-3/4"></div>
        <div className="h-6 bg-gray-200 w-1/3"></div>
        <div className="h-24 bg-gray-200 w-full"></div>
        <div className="h-32 bg-gray-200 w-full mt-10"></div>
      </div>
    </div>
  </div>
);
