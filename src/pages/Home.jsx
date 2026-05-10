import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Droplets, ShoppingBag, Star, PlayCircle, Leaf, Wind } from 'lucide-react';
import { products as productsApi, categories as categoriesApi, flashSales as flashSalesApi, cart as cartApi } from '../services/api';
import { SkeletonBlock, ProductGridSkeleton } from '../components/SkeletonLoader';

const CategoryCard = lazy(() => import('../components/CategoryCard'));

const getImageUrl = (img) => {
  if (!img) return '/logo.webp';
  let path = typeof img === 'object' ? (img.file_path || img.url || img.path) : img;
  if (!path) return '/logo.webp';
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_R2_PUBLIC_URL || import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-22cd43cce9bc475680ad496e199706c4.r2.dev';
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Home() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yPos = useTransform(scrollYProgress, [0, 1], [0, 200]);
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ products: [], categories: [], flashSales: [] });
  const [fitment, setFitment] = useState({ make: '', model: '', year: '' });
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroContent = [
    { img: "AD1.webp", title: "Bhumivera", subtitle: "The Essence of Earth & Water" },
    { img: "AD2.webp", title: "Pure Botanicals", subtitle: "Unearthing Ancient Beauty Secrets" },
    { img: "AD3.webp", title: "Earthy Elegance", subtitle: "100% Natural, 100% You" }
  ];

  const editorialGallery = [
    { img: "AD4.webp", quote: "Nature's Embrace.", span: "col-span-1 md:col-span-2 row-span-2" },
    { img: "AD5.webp", quote: "Glow From Within.", span: "col-span-1 row-span-1" },
    { img: "AD6.webp", quote: "Purified by Clay.", span: "col-span-1 row-span-1" },
    { img: "AD7.webp", quote: "Soothing Aloe.", span: "col-span-1 md:col-span-2 row-span-1" },
    { img: "AD8.webp", quote: "Timeless Radiance.", span: "col-span-1 row-span-1" },
    { img: "AD9.webp", quote: "Unfiltered Beauty.", span: "col-span-1 row-span-1" },
    { img: "AD10.webp", quote: "Earth's Remedy.", span: "col-span-1 md:col-span-2 row-span-1" }
  ];

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodRes, catRes, flashRes] = await Promise.all([
          productsApi.getAllActive({ limit: 4, featured: true }),
          categoriesApi.getAll(),
          flashSalesApi.getActive().catch(() => ({ data: [] }))
        ]);
        setData({
          products: prodRes.data?.data || prodRes.data || [],
          categories: catRes.data?.data || catRes.data || [],
          flashSales: flashRes.data?.data || flashRes.data || []
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % heroContent.length), 5000);
    return () => clearInterval(timer);
  }, [heroContent.length]);

  const handleQuickAdd = async (e, productId) => {
    e.preventDefault();
    try {
      await cartApi.add({ productId, quantity: 1 });
    } catch (error) {
      console.error(error);
    }
  };

  const handleFitmentSearch = (e) => {
    e.preventDefault();
    navigate(`/fitment-engine?type=${fitment.make}&concern=${fitment.model}&age=${fitment.year}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#faf8f5] pt-24 px-6 space-y-12">
       <SkeletonBlock className="w-full h-[70vh] rounded-[2rem]" />
       <ProductGridSkeleton count={4} />
    </div>
  );

  return (
    <div className="bg-[#faf8f5] text-[#2c2c2c] selection:bg-[#8b5a2b] selection:text-white font-sans overflow-hidden">
      
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#8b5a2b] origin-left z-50" style={{ scaleX: scrollYProgress }} />

      <section className="relative w-full h-[100svh] overflow-hidden bg-[#1a1a1a]">
        <div className="absolute inset-0 flex transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)]" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {heroContent.map((slide, idx) => (
            <div key={idx} className="min-w-full h-full relative">
              <motion.img 
                src={`/assets/images/${slide.img}`} 
                className="w-full h-full object-cover opacity-80" 
                alt={`Bhumivera ${idx}`} 
                style={{ y: yPos }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/20 to-[#1a1a1a]/40" />
            </div>
          ))}
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.h1 
              key={currentSlide}
              initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }} 
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }} 
              exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }} 
              transition={{ duration: 1.2, ease: "easeInOut" }} 
              className="text-5xl sm:text-7xl md:text-9xl font-serif text-[#f4eedc] tracking-widest uppercase mb-6 drop-shadow-2xl"
            >
              {heroContent[currentSlide].title}
            </motion.h1>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p 
              key={`sub-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8, delay: 0.3 }} 
              className="text-xs sm:text-sm md:text-xl text-[#e8dcc4] font-light max-w-2xl tracking-[0.3em] sm:tracking-[0.5em] uppercase px-4"
            >
              {heroContent[currentSlide].subtitle}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 animate-bounce text-[#e8dcc4]/50">
          <Wind size={24} />
        </div>
      </section>

      <section className="py-32 px-6 max-w-5xl mx-auto relative">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center">
          <motion.div variants={fadeUp} className="flex justify-center mb-8">
            <Sparkles className="text-[#8b5a2b]" size={32} />
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.5em] mb-8">The Philosophy</motion.h2>
          <motion.h3 variants={fadeUp} className="text-3xl md:text-6xl font-serif text-[#1a1a1a] leading-[1.2] mb-12">
            "Skin is an ecosystem. We do not disrupt it; we provide the earth it needs to heal itself."
          </motion.h3>
          <motion.div variants={fadeUp} className="w-px h-24 bg-[#8b5a2b]/30 mx-auto"></motion.div>
        </motion.div>
      </section>

      <section className="py-12 px-6 max-w-[100rem] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[400px]">
          {editorialGallery.map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay: (idx % 3) * 0.1 }}
              className={`relative overflow-hidden rounded-[2rem] group cursor-pointer ${item.span}`}
            >
              <img src={`/assets/images/${item.img}`} className="w-full h-full object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-110" alt="Bhumivera Aesthetic" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-10">
                <p className="text-[#f4eedc] font-serif text-3xl md:text-5xl italic translate-y-10 group-hover:translate-y-0 transition-transform duration-700 ease-out mb-6">
                  "{item.quote}"
                </p>
                <div className="overflow-hidden">
                  <Link to="/shop" className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#e8dcc4] hover:text-white translate-y-10 group-hover:translate-y-0 transition-transform duration-700 delay-100">
                    Explore <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-32 bg-white border-y border-[#e8dcc4]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.5em] mb-4">Curated Collection</h2>
              <h3 className="text-4xl md:text-6xl font-serif text-[#1a1a1a]">Botanical Regimen.</h3>
            </div>
            <Link to="/shop" className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b5a2b] hover:text-[#1a1a1a] transition-all px-8 py-4 rounded-full border border-[#e8dcc4] hover:bg-[#faf8f5]">
              View Complete Line <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {data.products.length > 0 && (
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {data.products.map((prod) => (
                <motion.div variants={fadeUp} key={prod.id || prod._id} className="group flex flex-col">
                  <div className="relative aspect-[4/5] bg-[#faf8f5] rounded-[2rem] overflow-hidden border border-[#e8dcc4] mb-6 shadow-sm group-hover:shadow-xl transition-all duration-500">
                    <Link to={`/product/${prod.slug || prod.id || prod._id}`}>
                      <img src={getImageUrl(prod.images?.[0] || prod.image_url)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply" alt={prod.name} onError={(e) => { e.target.src = '/logo.webp'; }} />
                    </Link>
                    <div className="absolute bottom-4 left-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                      <button onClick={(e) => handleQuickAdd(e, prod.id || prod._id)} className="w-full bg-[#1a1a1a] hover:bg-[#8b5a2b] text-white font-bold text-[10px] uppercase tracking-widest py-4 rounded-xl transition-colors flex justify-center items-center gap-2">
                        <ShoppingBag size={14} /> Add to Regimen
                      </button>
                    </div>
                  </div>
                  <div className="px-2 text-center">
                    <Link to={`/product/${prod.slug || prod.id || prod._id}`}>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-[#1a1a1a] group-hover:text-[#8b5a2b] transition-colors mb-2">{prod.name}</h4>
                    </Link>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-sm font-serif text-[#8b5a2b]">₹{prod.discount_price || prod.price}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-32 relative overflow-hidden bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#2a2a2a] border border-[#8b5a2b]/20 rounded-[3rem] p-12 md:p-24 text-center overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 opacity-5 text-[#8b5a2b] pointer-events-none -translate-y-1/2 translate-x-1/4">
              <Leaf size={600} strokeWidth={0.5} />
            </div>
            <h2 className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.8em] mb-6">Bespoke Rituals</h2>
            <h3 className="text-4xl md:text-7xl font-serif text-[#f4eedc] mb-8 leading-tight">
              Discover Your <br/> <span className="italic text-[#8b5a2b]">Skin Profile.</span>
            </h3>
            <p className="text-sm md:text-base text-gray-400 font-light max-w-xl mx-auto mb-12 leading-relaxed tracking-wide">
              Every skin tells a different story. Utilize our advanced botanical assessment engine to formulate a regimen exclusively curated for your unique complexion.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/fitment-engine" className="px-10 py-5 bg-[#8b5a2b] text-white font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-white hover:text-[#1a1a1a] transition-all shadow-xl flex items-center justify-center gap-3">
                <Droplets size={14} /> Begin Assessment
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
