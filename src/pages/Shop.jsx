import SEO from '../components/SEO';
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, Mic, Camera, SlidersHorizontal, Grid, List, 
  Star, ShoppingBag, Heart, Eye
} from 'lucide-react';
import { products as productsApi, categories as categoriesApi } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  return (
    <div className="group relative flex flex-col bg-white border border-[#e8dcc4] rounded-[2.5rem] overflow-hidden hover:shadow-[0_20px_50px_rgba(139,90,43,0.1)] hover:border-[#8b5a2b]/30 transition-all duration-700">
      <Link to={`/product/${product.slug || product.id}`} className="relative aspect-[4/5] overflow-hidden bg-[#faf8f5]">
        <img 
          src={product.image_url || '/logo.webp'} 
          className="w-full h-full object-cover p-8 group-hover:scale-105 transition-transform duration-[2000ms] ease-out mix-blend-multiply" 
          alt={product.name} 
        />
        <div className="absolute top-6 right-6 flex flex-col gap-3 translate-x-12 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
          <button className="p-4 bg-white/90 backdrop-blur-md text-[#1a1a1a] border border-[#e8dcc4] rounded-full hover:bg-[#8b5a2b] hover:text-white transition-all shadow-sm">
            <Heart size={16} />
          </button>
          <button className="p-4 bg-white/90 backdrop-blur-md text-[#1a1a1a] border border-[#e8dcc4] rounded-full hover:bg-[#8b5a2b] hover:text-white transition-all shadow-sm">
            <Eye size={16} />
          </button>
        </div>
        {product.is_featured && (
          <div className="absolute top-6 left-6 px-4 py-1.5 bg-[#8b5a2b]/90 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest rounded-full border border-[#8b5a2b]">
            Artisan Crafted
          </div>
        )}
      </Link>
      
      <div className="p-8 flex flex-col flex-1 text-center">
        <div className="flex justify-center items-center mb-3 gap-1 text-[#8b5a2b]">
          <Star size={12} fill="currentColor" />
          <Star size={12} fill="currentColor" />
          <Star size={12} fill="currentColor" />
          <Star size={12} fill="currentColor" />
          <Star size={12} fill="currentColor" />
        </div>
        
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#1a1a1a] group-hover:text-[#8b5a2b] transition-colors line-clamp-2 mb-2">
          {product.name}
        </h3>
        
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#5c4a3d] mb-6 block">
          {product.category_name || "Botanical Blend"}
        </span>

        <div className="mt-auto pt-6 border-t border-[#e8dcc4] flex flex-col gap-4">
          <div className="flex justify-center items-center gap-3">
            <span className="text-xl font-serif text-[#1a1a1a]">₹{product.discount_price || product.price}</span>
            {product.discount_price && (
              <span className="text-xs font-serif text-[#8b5a2b]/60 line-through">₹{product.price}</span>
            )}
          </div>
          <button 
            onClick={() => addToCart(product)}
            className="w-full py-4 bg-[#f4eedc] text-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest rounded-2xl border border-[#e8dcc4] hover:bg-[#8b5a2b] hover:text-white hover:border-[#8b5a2b] transition-all duration-300 flex justify-center items-center gap-2"
          >
            <ShoppingBag size={14} /> Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          productsApi.getAllActive(),
          categoriesApi.getAll()
        ]);
        setProducts(prodRes.data?.data || prodRes.data || []);
        setCategories(catRes.data?.data || catRes.data || []);
      } catch (err) {
        console.error("Shop fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'all' || p.category_id?.toString() === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice search not supported in this browser.");
    
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setSearchTerm(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a] pt-40 pb-32 font-sans">
      <SEO 
        title="Botanical Collection | Bhumivera"
        description="Browse Bhumivera's exclusive collection of naturally derived, plant-powered organic soaps and luxury skincare treatments."
        keywords="buy organic soap, plant-based skincare, natural body wash, buy bhumivera"
        route="/shop"
      />
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
          <div className="max-w-xl">
            <h2 className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.5em] mb-4">Curated Offerings</h2>
            <h1 className="text-5xl md:text-7xl font-serif text-[#1a1a1a] leading-none mb-6">
              The <span className="text-[#8b5a2b] italic">Collection.</span>
            </h1>
            <p className="text-[#5c4a3d] font-light text-lg">
              Showing {filteredProducts.length} plant-powered formulations crafted for authentic radiance.
            </p>
          </div>

          <div className="flex-1 max-w-2xl w-full">
            <div className="relative group">
              <div className="absolute inset-y-0 left-6 flex items-center text-[#8b5a2b]/50 group-focus-within:text-[#8b5a2b] transition-colors">
                <Search size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Search botanicals, ingredients, or rituals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#e8dcc4] rounded-full pl-16 pr-32 py-5 text-sm font-light text-[#1a1a1a] outline-none focus:ring-4 focus:ring-[#8b5a2b]/10 focus:border-[#8b5a2b]/50 transition-all shadow-sm"
              />
              <div className="absolute inset-y-2 right-2 flex gap-2">
                <button 
                  onClick={startVoiceSearch}
                  className={`p-3 rounded-full transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-[#faf8f5] text-[#8b5a2b] hover:bg-[#8b5a2b] hover:text-white border border-[#e8dcc4]'}`}
                >
                  <Mic size={18} />
                </button>
                <button className="p-3 bg-[#faf8f5] text-[#8b5a2b] rounded-full border border-[#e8dcc4] hover:bg-[#8b5a2b] hover:text-white transition-all">
                  <Camera size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-8 py-8 border-y border-[#e8dcc4] mb-16">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all flex-shrink-0 ${selectedCategory === 'all' ? 'bg-[#8b5a2b] border-[#8b5a2b] text-white shadow-md' : 'bg-white border-[#e8dcc4] text-[#5c4a3d] hover:border-[#8b5a2b] hover:text-[#8b5a2b]'}`}
            >
              All Formulations
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id.toString())}
                className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all flex-shrink-0 ${selectedCategory === cat.id.toString() ? 'bg-[#8b5a2b] border-[#8b5a2b] text-white shadow-md' : 'bg-white border-[#e8dcc4] text-[#5c4a3d] hover:border-[#8b5a2b] hover:text-[#8b5a2b]'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-white border border-[#e8dcc4] rounded-full p-1 shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-full transition-all ${viewMode === 'grid' ? 'bg-[#faf8f5] text-[#8b5a2b] shadow-sm' : 'text-[#5c4a3d] hover:text-[#8b5a2b]'}`}
              >
                <Grid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-full transition-all ${viewMode === 'list' ? 'bg-[#faf8f5] text-[#8b5a2b] shadow-sm' : 'text-[#5c4a3d] hover:text-[#8b5a2b]'}`}
              >
                <List size={18} />
              </button>
            </div>
            <button className="flex items-center gap-3 px-8 py-3 bg-white border border-[#e8dcc4] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a] hover:border-[#8b5a2b] hover:text-[#8b5a2b] transition-all shadow-sm">
              <SlidersHorizontal size={16} /> Refine
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-white rounded-[2.5rem] animate-pulse border border-[#e8dcc4]"></div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10" : "flex flex-col gap-6"}>
            {filteredProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white rounded-[3rem] border border-[#e8dcc4] shadow-sm">
            <div className="inline-flex p-8 bg-[#faf8f5] rounded-full text-[#8b5a2b] mb-8 border border-[#e8dcc4]">
              <Search size={40} />
            </div>
            <h3 className="text-3xl font-serif text-[#1a1a1a] mb-4">No Botanicals Found</h3>
            <p className="text-[#5c4a3d] font-light text-lg mb-8 max-w-md mx-auto">We couldn't find any formulations matching "{searchTerm}" in the selected category.</p>
            <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} className="px-10 py-4 bg-[#8b5a2b] text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#1a1a1a] transition-all shadow-lg">
              View All Formulations
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
