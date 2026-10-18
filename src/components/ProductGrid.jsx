import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  ArrowRight, 
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  Eye,
  Zap
} from 'lucide-react';
import SkeletonLoader from './SkeletonLoader';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getProductImageUrl } from '../utils/productImageUrl';

const ProductGrid = ({ products = [], isLoading = false }) => {
  const { addToCart } = useCart() || {};
  const { toggleWishlist, isInWishlist } = useWishlist() || {};
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const sortedProducts = useMemo(() => {
    const list = [...products].filter(p => !inStockOnly || Number(p.stock ?? p.quantity ?? 1) > 0);
    if (sortBy === 'price-low') list.sort((a, b) => Number(a.discount_price || a.price || 0) - Number(b.discount_price || b.price || 0));
    else if (sortBy === 'price-high') list.sort((a, b) => Number(b.discount_price || b.price || 0) - Number(a.discount_price || a.price || 0));
    else if (sortBy === 'rating') list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    else if (sortBy === 'newest') list.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
    return list;
  }, [products, sortBy, inStockOnly]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <SkeletonLoader key={i} type="product" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Grid Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-[#d4af37]/20">
        <div className="flex items-center gap-4">
          <div className="flex bg-[#0d1520] rounded-xl p-1 border border-white/10">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gradient-to-r from-[#d4af37] to-[#fce096] text-black font-bold shadow-md' : 'text-[#94a3b8] hover:text-white'}`}
              aria-label="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gradient-to-r from-[#d4af37] to-[#fce096] text-black font-bold shadow-md' : 'text-[#94a3b8] hover:text-white'}`}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
          <span className="text-[#94a3b8] text-xs font-mono tracking-wider uppercase">
            Showing <span className="text-white font-bold">{sortedProducts.length}</span> formulations
          </span>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select 
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="w-full md:w-48 bg-[#0d1520] border border-white/10 text-white text-xs rounded-xl px-4 py-2.5 outline-none focus:border-[#d4af37] transition-colors appearance-none cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
          </div>
          
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 border px-4 py-2.5 rounded-xl text-xs transition-colors ${
              isFilterOpen || inStockOnly 
                ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#fce096] font-bold' 
                : 'bg-[#0d1520] border-white/10 text-white hover:border-[#d4af37]/40'
            }`}
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline font-medium">Filters</span>
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="mb-8 p-4 rounded-2xl bg-[#0d1520] border border-[#d4af37]/30 flex items-center justify-between">
          <label className="flex items-center gap-2.5 text-xs text-[#cbd5e1] cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => { setInStockOnly(e.target.checked); setCurrentPage(1); }}
              className="rounded border-white/20 accent-[#d4af37]"
            />
            Show In-Stock Formulations Only
          </label>
          <button
            onClick={() => { setInStockOnly(false); setSortBy('featured'); setCurrentPage(1); }}
            className="text-xs font-bold text-[#fce096] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className={`grid gap-8 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {paginatedProducts.map((product) => {
          const pid = product.id || product._id;
          const wished = isInWishlist ? isInWishlist(pid) : false;
          return (
            <div 
              key={pid} 
              className={`two-tone-card group transition-all duration-500 bg-[#0d1520] rounded-2xl border border-[#d4af37]/20 hover:border-[#d4af37]/60 shadow-lg ${
                viewMode === 'list' ? 'flex flex-col md:flex-row gap-8 p-6' : 'p-4'
              }`}
            >
              <div className={`${viewMode === 'list' ? 'md:w-72 shrink-0' : 'w-full'} relative aspect-square overflow-hidden rounded-xl bg-[#070a0e]`}>
                <img 
                  src={getProductImageUrl(product.image_url || product.images || product.image) || '/logo.webp'}
                  alt={product.name}
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = '/logo.webp'; 
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  {product.isNew && (
                    <span className="bg-gradient-to-r from-[#d4af37] to-[#fce096] text-black text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-lg">
                      New
                    </span>
                  )}
                  {product.discount_price && (
                    <span className="bg-black/85 border border-[#d4af37]/40 text-[#fce096] text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-lg backdrop-blur-sm">
                      -{Math.round(((product.price - product.discount_price)/product.price)*100)}%
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => toggleWishlist?.(product)}
                  className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 ${
                    wished ? 'bg-rose-500 text-white border-rose-500' : 'bg-black/60 border-white/20 text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#fce096]'
                  }`}
                  title={wished ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart size={16} className={wished ? "fill-current" : ""} />
                </button>
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => addToCart?.(product, 1)}
                    className="w-11 h-11 rounded-full bg-gradient-to-r from-[#d4af37] to-[#fce096] text-black flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                    title="Add to Cart"
                  >
                    <ShoppingBag size={18} />
                  </button>
                  <Link
                    to={`/product/${product.slug || product.id}`}
                    className="w-11 h-11 rounded-full bg-[#070a0e] border border-white/20 text-white flex items-center justify-center hover:border-[#d4af37] hover:text-[#fce096] hover:scale-110 transition-all shadow-xl"
                    title="View Product"
                  >
                    <Eye size={18} />
                  </Link>
                </div>
              </div>

              <div className={`flex flex-col ${viewMode === 'list' ? 'justify-center py-4 flex-1' : 'mt-4'}`}>
                {Number(product.rating) > 0 && Number(product.reviews) > 0 && (
                  <div className="flex items-center gap-2 mb-2" aria-label={`Rated ${product.rating} out of 5 from ${product.reviews} reviews`}>
                    <div className="flex text-[#fce096]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          fill={i < Math.round(Number(product.rating)) ? "currentColor" : "none"}
                          className={i < Math.round(Number(product.rating)) ? "" : "text-white/20"}
                        />
                      ))}
                    </div>
                    <span className="text-[#94a3b8] text-[10px] font-mono">({product.reviews})</span>
                  </div>
                )}
                
                <h3 className="text-white font-serif font-bold text-base mb-1.5 group-hover:text-[#fce096] transition-colors line-clamp-1">
                  <Link to={`/product/${product.slug || product.id}`}>{product.name}</Link>
                </h3>
                
                <p className={`text-[#94a3b8] text-xs leading-relaxed mb-3 line-clamp-2 ${viewMode === 'grid' ? 'hidden sm:block' : ''}`}>
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[#fce096] font-mono font-bold text-lg sm:text-xl">
                      ₹{product.discount_price || product.price}
                    </span>
                    {product.discount_price && (
                      <span className="text-[#94a3b8] text-xs line-through">
                        ₹{product.price}
                      </span>
                    )}
                  </div>
                  
                  {viewMode === 'list' && (
                    <button
                      type="button"
                      onClick={() => addToCart?.(product, 1)}
                      className="btn-gold-luxury flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold uppercase tracking-widest text-xs text-white shadow-lg"
                    >
                      <span>Add to Cart</span>
                      <Zap size={13} className="fill-current" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-16 flex justify-center">
          <nav className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-11 h-11 rounded-xl bg-[#0d1520] border border-white/10 text-white flex items-center justify-center hover:border-[#d4af37] transition-colors disabled:opacity-30"
              aria-label="Previous page"
            >
              <ArrowRight size={18} className="rotate-180" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button 
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-11 h-11 rounded-xl border font-bold text-xs transition-all ${
                  page === currentPage 
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#fce096] border-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20' 
                    : 'bg-[#0d1520] border-white/10 text-[#cbd5e1] hover:border-[#d4af37]/40 hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-11 h-11 rounded-xl bg-[#0d1520] border border-white/10 text-white flex items-center justify-center hover:border-[#d4af37] transition-colors disabled:opacity-30"
              aria-label="Next page"
            >
              <ArrowRight size={18} />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
