import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Droplets, ShoppingBag, Star, Leaf, Wind, ShieldCheck, Heart, Feather, Sun, ArrowDown, ChevronRight } from 'lucide-react';
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
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  show: { opacity: 1, x: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  show: { opacity: 1, x: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

export default function Home() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yPosHero = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const yPosParallax = useTransform(scrollYProgress, [0, 1], [0, -150]);
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ products: [], categories: [], flashSales: [] });
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroContent = [
    { img: "Promo1.webp", title: "Bhumivera", subtitle: "The Essence of Earth & Water", quote: "Where ancient soil meets the purest hydration." },
    { img: "Promo2.webp", title: "Pure Botanicals", subtitle: "Unearthing Ancient Beauty Secrets", quote: "Nature does not hurry, yet everything is accomplished." },
    { img: "Promo3.webp", title: "Earthy Elegance", subtitle: "100% Natural, 100% You", quote: "Your skin is a garden. Tend to it with truth." }
  ];

  const editorialGallery = [
    { img: "Promo4.webp", quote: "Nature's Embrace.", span: "col-span-1 md:col-span-2 row-span-2", align: "justify-end" },
    { img: "Promo5.webp", quote: "Glow From Within.", span: "col-span-1 row-span-1", align: "justify-center" },
    { img: "Promo6.webp", quote: "Purified by Clay.", span: "col-span-1 row-span-1", align: "justify-center" },
    { img: "Promo7.webp", quote: "Soothing Aloe.", span: "col-span-1 md:col-span-2 row-span-1", align: "justify-start" },
    { img: "Promo8.webp", quote: "Timeless Radiance.", span: "col-span-1 row-span-2", align: "justify-end" },
    { img: "Promo9.webp", quote: "Unfiltered Beauty.", span: "col-span-1 row-span-1", align: "justify-center" },
    { img: "Promo10.webp", quote: "Earth's Remedy.", span: "col-span-1 md:col-span-2 row-span-1", align: "justify-end" }
  ];

  const ingredientsList = [
    { name: "Multani Mitti", desc: "Sourced from the deep mineral-rich layers of the earth, this potent clay magnetically extracts impurities, absorbs excess sebum, and refines pore architecture without disrupting your natural lipid barrier.", icon: <Sun size={24} /> },
    { name: "Pure Aloe Vera", desc: "Cold-pressed within hours of harvest to preserve its enzymatic integrity, our aloe delivers multi-dimensional cellular hydration, instantly calming inflammation and accelerating skin recovery.", icon: <Droplets size={24} /> },
    { name: "Botanical Oils", desc: "A proprietary blend of non-comedogenic, cold-pressed seed oils that mimic your skin's natural sebum, locking in moisture and delivering a potent dose of antioxidant protection against daily stress.", icon: <Sparkles size={24} /> }
  ];

  const philosophicalQuotes = [
    "We believe that the earth has already perfected the art of healing. Our only job is to bottle it without interference.",
    "True luxury is not found in synthetic laboratories, but in the untamed, unadulterated purity of the botanical world.",
    "Bhumivera is a rejection of modern chemical overload. It is a return to the roots of holistic, mindful self-care."
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
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % heroContent.length), 6000);
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
    navigate('/fitment-engine');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#faf8f5] pt-24 px-6 space-y-12">
       <SkeletonBlock className="w-full h-[80vh] rounded-[2rem]" />
       <ProductGridSkeleton count={4} />
    </div>
  );

  return (
    <div className="bg-[#faf8f5] text-[#2c2c2c] selection:bg-[#8b5a2b] selection:text-white font-sans overflow-hidden">
      
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#8b5a2b] origin-left z-[100]" style={{ scaleX: scrollYProgress }} />

      <section className="relative w-full h-[100svh] overflow-hidden bg-[#1a1a1a]">
        <div className="absolute inset-0 flex transition-transform duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)]" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {heroContent.map((slide, idx) => (
            <div key={idx} className="min-w-full h-full relative overflow-hidden">
              <motion.img 
                src={`/assets/images/${slide.img}`} 
                className="w-full h-full object-cover opacity-70" 
                alt={`Bhumivera ${idx}`} 
                style={{ y: yPosHero }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#1a1a1a]/30 to-[#1a1a1a]/50" />
            </div>
          ))}
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={`container-${currentSlide}`}
              initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }} 
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} 
              exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }} 
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <div className="mb-6 inline-flex items-center gap-3 px-6 py-2 rounded-full border border-[#e8dcc4]/20 bg-[#1a1a1a]/40 backdrop-blur-md">
                <Sparkles size={14} className="text-[#8b5a2b]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#e8dcc4]">100% Natural Ingredients</span>
                <Sparkles size={14} className="text-[#8b5a2b]" />
              </div>
              <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-serif text-[#f4eedc] tracking-tight mb-4 drop-shadow-2xl leading-none">
                {heroContent[currentSlide].title}
              </h1>
              <p className="text-xs sm:text-sm md:text-xl text-[#e8dcc4] font-light tracking-[0.4em] sm:tracking-[0.6em] uppercase mb-8">
                {heroContent[currentSlide].subtitle}
              </p>
              <div className="w-px h-16 bg-[#8b5a2b] mb-8" />
              <p className="text-[#e8dcc4]/80 font-serif text-lg md:text-2xl italic max-w-2xl font-light">
                "{heroContent[currentSlide].quote}"
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 animate-bounce text-[#e8dcc4]/50 flex flex-col items-center gap-2">
          <span className="text-[8px] uppercase tracking-widest">Scroll</span>
          <ArrowDown size={20} />
        </div>
      </section>

      <section className="py-40 px-6 max-w-6xl mx-auto relative">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center">
          <motion.h2 variants={fadeUp} className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.5em] mb-10">The Manifesto</motion.h2>
          <motion.h3 variants={fadeUp} className="text-4xl md:text-7xl font-serif text-[#1a1a1a] leading-[1.1] mb-16">
            We are redefining the dialogue between human skin and the natural world. No synthetics. No compromises.
          </motion.h3>
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left mt-24">
            {philosophicalQuotes.map((quote, idx) => (
              <div key={idx} className="space-y-6">
                <div className="w-8 h-px bg-[#8b5a2b]" />
                <p className="text-[#5c4a3d] font-light leading-relaxed text-lg">{quote}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="py-24 bg-[#1a1a1a] border-y border-[#8b5a2b]/30">
        <div className="max-w-[100rem] mx-auto px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-20">
            <motion.h2 variants={fadeUp} className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.5em] mb-6">The Lookbook</motion.h2>
            <motion.h3 variants={fadeUp} className="text-4xl md:text-6xl font-serif text-[#f4eedc]">Botanical Aesthetics.</motion.h3>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[400px]">
            {editorialGallery.map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 1, delay: (idx % 4) * 0.1 }}
                className={`relative overflow-hidden rounded-[2rem] group cursor-pointer border border-[#8b5a2b]/20 ${item.span}`}
              >
                <img src={`/assets/images/${item.img}`} className="w-full h-full object-cover transition-transform duration-[4000ms] ease-out group-hover:scale-105" alt="Bhumivera Aesthetic" />
                <div className={`absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700 flex flex-col ${item.align} p-10`}>
                  <p className="text-[#f4eedc] font-serif text-3xl md:text-4xl italic translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out mb-4">
                    "{item.quote}"
                  </p>
                  <div className="overflow-hidden">
                    <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8b5a2b] translate-y-8 group-hover:translate-y-0 transition-transform duration-700 delay-100">
                      View Formula <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-40 px-6 max-w-7xl mx-auto overflow-hidden">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="mb-24 flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-2xl">
            <motion.h2 variants={slideInLeft} className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.5em] mb-6">Materia Medica</motion.h2>
            <motion.h3 variants={slideInLeft} className="text-4xl md:text-6xl font-serif text-[#1a1a1a] leading-tight">
              The anatomy of our formulations.
            </motion.h3>
          </div>
          <motion.div variants={slideInRight}>
            <p className="text-[#5c4a3d] font-light max-w-md text-lg">We refuse to use filler ingredients. Every single element in a Bhumivera product serves a distinct, scientifically-backed therapeutic purpose.</p>
          </motion.div>
        </motion.div>

        <div className="space-y-32">
          {ingredientsList.map((ing, idx) => (
            <motion.div 
              key={idx}
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
              className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-16 items-center`}
            >
              <motion.div variants={idx % 2 !== 0 ? slideInRight : slideInLeft} className="w-full md:w-1/2 aspect-square rounded-full overflow-hidden bg-[#f4eedc] relative p-4 border border-[#e8dcc4] border-dashed">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <img src={`/assets/images/Promo${idx + 1}.webp`} className="w-full h-full object-cover mix-blend-multiply" alt={ing.name} />
                  <div className="absolute inset-0 bg-[#8b5a2b]/10 mix-blend-overlay" />
                </div>
              </motion.div>
              <motion.div variants={idx % 2 !== 0 ? slideInLeft : slideInRight} className="w-full md:w-1/2 space-y-8">
                <div className="w-16 h-16 rounded-full bg-[#f4eedc] border border-[#e8dcc4] flex items-center justify-center text-[#8b5a2b]">
                  {ing.icon}
                </div>
                <h4 className="text-4xl md:text-5xl font-serif text-[#1a1a1a]">{ing.name}</h4>
                <p className="text-[#5c4a3d] font-light text-xl leading-relaxed">{ing.desc}</p>
                <div className="pt-4">
                  <Link to="/shop" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] border-b border-[#1a1a1a] pb-1 hover:text-[#8b5a2b] hover:border-[#8b5a2b] transition-colors">
                    Explore Products with {ing.name}
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-32 bg-[#f4eedc] border-y border-[#e8dcc4]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <h2 className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.5em] mb-4">Curated Collection</h2>
              <h3 className="text-4xl md:text-6xl font-serif text-[#1a1a1a]">The Apothecary.</h3>
            </div>
            <Link to="/shop" className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] hover:text-[#8b5a2b] transition-all px-10 py-5 rounded-full border border-[#1a1a1a] hover:border-[#8b5a2b]">
              View Full Directory <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {data.products.length > 0 && (
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {data.products.map((prod) => (
                <motion.div variants={fadeUp} key={prod.id || prod._id} className="group flex flex-col">
                  <div className="relative aspect-[3/4] bg-white rounded-[2rem] overflow-hidden border border-[#e8dcc4] mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                    <Link to={`/product/${prod.slug || prod.id || prod._id}`}>
                      <img src={getImageUrl(prod.images?.[0] || prod.image_url)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out mix-blend-multiply p-4" alt={prod.name} onError={(e) => { e.target.src = '/logo.webp'; }} />
                    </Link>
                    <div className="absolute top-4 left-4 z-20">
                      {prod.is_featured && <span className="bg-[#8b5a2b] text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">Iconic</span>}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20 bg-gradient-to-t from-white via-white to-transparent">
                      <button onClick={(e) => handleQuickAdd(e, prod.id || prod._id)} className="w-full bg-[#1a1a1a] hover:bg-[#8b5a2b] text-white font-bold text-[10px] uppercase tracking-widest py-4 rounded-xl transition-colors flex justify-center items-center gap-2">
                        <ShoppingBag size={14} /> Add to Bag
                      </button>
                    </div>
                  </div>
                  <div className="px-2 text-center space-y-3">
                    <Link to={`/product/${prod.slug || prod.id || prod._id}`}>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-[#1a1a1a] group-hover:text-[#8b5a2b] transition-colors line-clamp-1">{prod.name}</h4>
                    </Link>
                    <div className="flex items-center justify-center gap-2 text-[#8b5a2b] text-[10px]">
                      <Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" />
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-sm font-serif text-[#5c4a3d]">₹{prod.discount_price || prod.price}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-40 relative overflow-hidden bg-[#1a1a1a] text-center">
        <motion.div style={{ y: yPosParallax }} className="absolute inset-0 opacity-20 pointer-events-none">
           <img src="/assets/images/Promo8.webp" className="w-full h-full object-cover mix-blend-luminosity" alt="Background" />
        </motion.div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <div className="w-20 h-20 mx-auto border border-[#8b5a2b] rounded-full flex items-center justify-center mb-10 text-[#8b5a2b]">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.8em] mb-8">Clinical Assessment</h2>
            <h3 className="text-4xl md:text-6xl font-serif text-[#f4eedc] mb-10 leading-tight">
              Stop guessing. <br/> Start listening to your skin.
            </h3>
            <p className="text-base md:text-xl text-gray-400 font-light mx-auto mb-16 leading-relaxed">
              Every complexion is a unique ecosystem. Utilize our proprietary Skin Assessment Engine to diagnose your specific needs and generate a personalized, 100% botanical regimen.
            </p>
            <button onClick={handleFitmentSearch} className="px-12 py-6 bg-[#8b5a2b] text-white font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white hover:text-[#1a1a1a] transition-all duration-500 shadow-[0_0_40px_rgba(139,90,43,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:-translate-y-2">
              Analyze My Skin Profile
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: <Leaf />, title: "Vegan Formulations", desc: "100% plant-derived ingredients with zero animal byproducts." },
              { icon: <Feather />, title: "Cruelty Free", desc: "Never tested on animals. We believe in compassionate beauty." },
              { icon: <Heart />, title: "Dermatologically Tested", desc: "Clinically proven to be safe and effective for sensitive skin." },
              { icon: <Wind />, title: "Carbon Neutral", desc: "Sustainable packaging and eco-conscious manufacturing processes." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="text-center space-y-6 p-8 rounded-3xl hover:bg-[#faf8f5] transition-colors border border-transparent hover:border-[#e8dcc4]"
              >
                <div className="w-16 h-16 mx-auto bg-[#f4eedc] text-[#8b5a2b] rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-[#1a1a1a]">{feature.title}</h4>
                <p className="text-[#5c4a3d] font-light text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
