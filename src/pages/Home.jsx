import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Droplets, ShoppingBag, Star, Leaf, Wind, ShieldCheck, Heart, Feather, Sun, ChevronRight, Quote, Plus, Minus } from 'lucide-react';
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

const easeFluid = [0.25, 1, 0.5, 1];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: easeFluid } }
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: easeFluid } }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  show: { opacity: 1, x: 0, transition: { duration: 1.2, ease: easeFluid } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  show: { opacity: 1, x: 0, transition: { duration: 1.2, ease: easeFluid } }
};

export default function Home() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yPosHero = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const yPosParallax = useTransform(scrollYProgress, [0, 1], [0, -150]);
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ products: [], categories: [], flashSales: [] });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);

  const heroContent = [
    { 
      img: "Promo1.webp", 
      title: "Earth to Skin.", 
      subtitle: "The Purest Hydration", 
      quote: "We don't manufacture beauty. We harvest it. Experience the unfiltered potency of raw, earth-sourced botanicals.",
      tag: "Plant-Powered Formulation"
    },
    { 
      img: "Promo2.webp", 
      title: "Ancient Wisdom.", 
      subtitle: "Modern Elegance", 
      quote: "Ayurvedic secrets preserved in every drop. Let the soil, the sun, and the rain restore your skin's true vitality.",
      tag: "Pure Botanical Extracts"
    },
    { 
      img: "Promo3.webp", 
      title: "Unapologetic Purity.", 
      subtitle: "Consciously Crafted", 
      quote: "Your skin is a living, breathing ecosystem. Nourish it with ingredients that are naturally derived and wholesome.",
      tag: "Ethical & Plant-Based"
    }
  ];

  const editorialGallery = [
    { img: "Promo4.webp", quote: "Nature’s quiet embrace nourishes the deepest layers.", author: "The Bhumivera Ethos", span: "col-span-1 md:col-span-2 row-span-2", align: "justify-end" },
    { img: "Promo5.webp", quote: "Radiance born from the soil.", author: "Botanical Truth", span: "col-span-1 row-span-1", align: "justify-center" },
    { img: "Promo6.webp", quote: "Refined by timeless clays.", author: "Earth's Magnet", span: "col-span-1 row-span-1", align: "justify-center" },
    { img: "Promo7.webp", quote: "Hydration mimicking the morning dew.", author: "Liquid Life", span: "col-span-1 md:col-span-2 row-span-1", align: "justify-start" },
    { img: "Promo8.webp", quote: "Defy time with earth's resilience.", author: "Eternal Bloom", span: "col-span-1 row-span-2", align: "justify-end" },
    { img: "Promo9.webp", quote: "Unfiltered, unmasked, unapologetic.", author: "Raw Beauty", span: "col-span-1 row-span-1", align: "justify-center" },
    { img: "Promo10.webp", quote: "A return to the roots of self-care.", author: "The Ritual", span: "col-span-1 md:col-span-2 row-span-1", align: "justify-end" }
  ];

  const ingredientsList = [
    { 
      name: "Multani Mitti (Fuller's Earth)", 
      desc: "Sourced from the deep, mineral-rich layers of the earth, this potent botanical clay acts as a natural exfoliator. It draws out deep-seated impurities, manages excess sebum without stripping essential lipids, and refines your pore architecture for a clarified, luminous complexion.", 
      icon: <Sun size={28} className="text-[#6b4226]" />,
      benefits: ["Deep Pore Cleansing", "Sebum Management", "Glow Enhancing"]
    },
    { 
      name: "Cold-Pressed Aloe Vera", 
      desc: "Harvested at peak freshness and cold-pressed within hours to preserve its natural integrity. Our aloe delivers multi-dimensional hydration, instantly calming the skin, providing a refreshing feel, and leaving the skin extraordinarily supple.", 
      icon: <Droplets size={28} className="text-[#6b4226]" />,
      benefits: ["Intense Hydration", "Calming Sensation", "Barrier Support"]
    },
    { 
      name: "Wildcrafted Botanical Oils", 
      desc: "A proprietary, cold-pressed blend of plant-based seed and nut oils. Designed to harmonize with your skin's natural moisture, these oils lock in hydration and deliver a potent dose of antioxidant protection against daily environmental stress.", 
      icon: <Sparkles size={28} className="text-[#6b4226]" />,
      benefits: ["Antioxidant Shield", "Moisture Replenishment", "Radiance Boosting"]
    }
  ];
  
  const philosophicalQuotes = [
    "We believe that the earth has already perfected the art of self-care. Our only job is to bottle it without interference. No harsh chemicals, no synthetic fragrances, just the raw essence of nature.",
    "True luxury is not found in sterile laboratories, but in the untamed, unadulterated purity of the botanical world. It is the feeling of earth melting into your skin.",
    "Bhumivera is a mindful return to the roots of holistic wellness, honoring the symbiotic relationship between human skin and the natural world around us."
  ];

  const testimonials = [
    { text: "I abandoned my entire complex routine for the Multani Mitti and Aloe regimen. My skin has never felt this breathable and balanced.", author: "Elena R.", type: "Combination Skin" },
    { text: "You can literally smell the earth and rain in these products. It's not just skincare; it's a grounding daily ritual that brings me back to center.", author: "Priya S.", type: "Sensitive Skin" },
    { text: "The glass-like glow I get from the botanical oils is unmatched. Finally, a luxury brand that respects the skin's natural balance.", author: "Sarah M.", type: "Mature Skin" }
  ];

  const faqs = [
    { q: "Are your products naturally derived?", a: "Absolutely. We consciously craft our formulas without harsh sulfates, silicones, artificial dyes, or synthetic fragrances. We prioritize ingredients ethically sourced directly from the earth." },
    { q: "How do I know which regimen is right for my skin?", a: "We recommend using our 'Holistic Skin Assessment' below. It reviews your unique skin type, environment, and preferences to suggest a bespoke botanical routine." },
    { q: "Is the packaging eco-friendly?", a: "Yes. Our commitment to the earth extends to our packaging. We use recyclable materials and minimalistic design to prioritize eco-conscious practices." },
    { q: "Are your products cruelty-free?", a: "Never tested on animals. Bhumivera believes in compassionate beauty and ethical testing standards exclusively." }
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
          products: Array.isArray(prodRes.data?.data) ? prodRes.data.data : (Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.products || [])),
          categories: Array.isArray(catRes.data?.data) ? catRes.data.data : (Array.isArray(catRes.data) ? catRes.data : (catRes.data?.categories || [])),
          flashSales: Array.isArray(flashRes.data?.data) ? flashRes.data.data : (Array.isArray(flashRes.data) ? flashRes.data : (flashRes.data?.flashSales || []))
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
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % heroContent.length), 7000);
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

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f6f0e4] pt-24 px-6 space-y-12">
       <SkeletonBlock className="w-full h-[85vh] rounded-[3rem]" />
       <ProductGridSkeleton count={4} />
    </div>
  );

  return (
    <div className="bg-[#f6f0e4] text-[#2c2c2c] selection:bg-[#6b4226] selection:text-[#f6f0e4] font-sans overflow-hidden">
      
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#6b4226] origin-left z-[100]" style={{ scaleX: scrollYProgress }} />

      <section className="relative w-full h-[100svh] overflow-hidden bg-[#1e1510]">
        <div className="absolute inset-0 flex transition-transform duration-[1800ms] ease-[cubic-bezier(0.25,1,0.5,1)]" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {heroContent.map((slide, idx) => (
            <div key={idx} className="min-w-full h-full relative overflow-hidden">
              <motion.img 
                src={`/assets/images/${slide.img}`} 
                className="w-full h-full object-cover opacity-80 mix-blend-overlay" 
                alt={`Bhumivera ${idx}`} 
                style={{ y: yPosHero, opacity: opacityHero }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-[#1e1510]/80" />
            </div>
          ))}
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-20 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={`container-${currentSlide}`}
              initial={{ opacity: 0, y: 40, filter: "blur(15px)" }} 
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} 
              exit={{ opacity: 0, y: -40, filter: "blur(15px)" }} 
              transition={{ duration: 1.2, ease: easeFluid }}
              className="flex flex-col items-center text-center max-w-4xl"
            >
              <div className="glass-panel bg-[#1e1510]/40 backdrop-blur-2xl border border-[#6b4226]/30 p-10 md:p-16 rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
                <div className="mb-6 inline-flex items-center gap-3 px-6 py-2 rounded-full border border-[#6b4226] bg-[#1e1510]/80">
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">{heroContent[currentSlide].tag}</span>
                </div>
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif text-[#f6f0e4] tracking-tight mb-4 drop-shadow-2xl leading-tight">
                  {heroContent[currentSlide].title}
                </h1>
                <h2 className="text-sm md:text-2xl text-[#d4af37] font-serif italic mb-8 drop-shadow-md">
                  {heroContent[currentSlide].subtitle}
                </h2>
                <div className="w-16 h-px bg-[#6b4226] mx-auto mb-8" />
                <p className="text-[#e2d8c8] font-light text-sm md:text-lg leading-relaxed max-w-xl mx-auto tracking-wide">
                  "{heroContent[currentSlide].quote}"
                </p>
                <div className="mt-12 pointer-events-auto">
                  <Link to="/shop" className="px-12 py-5 bg-[#6b4226] text-[#f6f0e4] text-[10px] font-bold uppercase tracking-[0.2em] rounded-none hover:bg-[#d4af37] hover:text-[#1e1510] transition-all duration-500 shadow-2xl inline-flex items-center gap-4">
                    Discover Collection <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="py-32 px-6 max-w-6xl mx-auto relative z-10 bg-[#f6f0e4]">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center">
          <motion.h2 variants={fadeUp} className="text-[10px] font-bold text-[#6b4226] uppercase tracking-[0.5em] mb-10 flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-[#6b4226]/40" />
            The Manifesto
            <div className="w-16 h-px bg-[#6b4226]/40" />
          </motion.h2>
          <motion.h3 variants={fadeUp} className="text-3xl md:text-5xl lg:text-7xl font-serif text-[#1e1510] leading-[1.15] mb-24 max-w-5xl mx-auto">
            We are redefining the dialogue between human skin and the natural world. Plant-based. Consciously crafted.
          </motion.h3>
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
            {philosophicalQuotes.map((quote, idx) => (
              <div key={idx} className="space-y-6 relative group border-l border-[#6b4226]/20 pl-8">
                <p className="text-[#4a3628] font-light leading-loose text-lg">{quote}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="py-32 bg-[#1e1510] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#6b4226]/20 rounded-full blur-[180px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-[100rem] mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-24">
            <motion.h2 variants={fadeUp} className="text-[10px] font-bold text-[#d4af37] uppercase tracking-[0.5em] mb-6">The Lookbook</motion.h2>
            <motion.h3 variants={fadeUp} className="text-4xl md:text-6xl font-serif text-[#f6f0e4]">Botanical Aesthetics.</motion.h3>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[350px] md:auto-rows-[450px]">
            {editorialGallery.map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 1.2, delay: (idx % 4) * 0.1, ease: easeFluid }}
                className={`relative overflow-hidden group cursor-pointer ${item.span}`}
              >
                <img src={`/assets/images/${item.img}`} className="w-full h-full object-cover transition-transform duration-[7000ms] ease-out group-hover:scale-105 opacity-90" alt="Bhumivera Aesthetic" />
                <div className={`absolute inset-0 bg-[#1e1510]/30 group-hover:bg-[#1e1510]/60 transition-colors duration-700 flex flex-col ${item.align} p-8 md:p-12`}>
                  <div className="bg-[#1e1510]/80 backdrop-blur-md border border-[#6b4226]/30 p-8 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                    <p className="text-[#f6f0e4] font-serif text-2xl md:text-3xl italic mb-6 leading-relaxed">"{item.quote}"</p>
                    <p className="text-[#d4af37] text-[9px] font-bold uppercase tracking-[0.2em]">— {item.author}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-40 px-6 max-w-7xl mx-auto overflow-hidden bg-[#f6f0e4]">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="mb-32 flex flex-col md:flex-row justify-between items-end gap-12 border-b border-[#6b4226]/20 pb-16">
          <div className="max-w-2xl">
            <motion.h2 variants={slideInLeft} className="text-[10px] font-bold text-[#6b4226] uppercase tracking-[0.5em] mb-6">Key Botanicals</motion.h2>
            <motion.h3 variants={slideInLeft} className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#1e1510] leading-tight">
              The anatomy of our formulations.
            </motion.h3>
          </div>
          <motion.div variants={slideInRight}>
            <p className="text-[#4a3628] font-light max-w-md text-xl leading-relaxed">We focus on high-impact natural actives. Every single element in a Bhumivera product serves a distinct, holistic purpose for your skin's well-being.</p>
          </motion.div>
        </motion.div>

        <div className="space-y-40">
          {ingredientsList.map((ing, idx) => (
            <motion.div 
              key={idx}
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
              className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-16 lg:gap-24 items-center`}
            >
              <motion.div variants={fadeScale} className="w-full md:w-1/2 aspect-[4/5] overflow-hidden bg-[#ebe1d1] relative p-4 shadow-[0_20px_50px_rgba(107,66,38,0.08)]">
                <div className="w-full h-full overflow-hidden relative group">
                  <img src={`/assets/images/Promo${idx + 1}.webp`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4000ms] ease-out mix-blend-multiply" alt={ing.name} />
                </div>
              </motion.div>
              <motion.div variants={idx % 2 !== 0 ? slideInLeft : slideInRight} className="w-full md:w-1/2 space-y-8">
                <h4 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1e1510] border-l-4 border-[#6b4226] pl-6">{ing.name}</h4>
                <p className="text-[#4a3628] font-light text-xl leading-loose">{ing.desc}</p>
                <div className="flex flex-wrap gap-4 pt-6">
                  {ing.benefits.map((ben, i) => (
                    <span key={i} className="px-5 py-3 border border-[#6b4226]/30 text-[9px] font-bold uppercase tracking-[0.2em] text-[#6b4226] bg-[#f6f0e4]">
                      {ben}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-40 bg-[#ebe1d1] border-y border-[#dccfb8] relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div>
              <h2 className="text-[10px] font-bold text-[#6b4226] uppercase tracking-[0.5em] mb-4">Curated Collection</h2>
              <h3 className="text-5xl md:text-7xl font-serif text-[#1e1510]">The Apothecary.</h3>
            </div>
            <Link to="/shop" className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1e1510] hover:text-[#d4af37] transition-all px-10 py-5 border border-[#1e1510] hover:border-[#d4af37] hover:bg-[#1e1510]">
              View Full Directory <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {Array.isArray(data.products) && data.products.length > 0 && (
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {data.products.map((prod) => (
                <motion.div variants={fadeUp} key={prod.id || prod._id} className="group flex flex-col">
                  <div className="relative aspect-[3/4] bg-[#f6f0e4] overflow-hidden border border-[#dccfb8] mb-8 shadow-sm group-hover:shadow-[0_20px_40px_rgba(107,66,38,0.15)] transition-all duration-700">
                    <Link to={`/product/${prod.slug || prod.id || prod._id}`}>
                      <img src={getImageUrl(prod.images?.[0] || prod.image_url)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out mix-blend-multiply p-8" alt={prod.name} onError={(e) => { e.target.src = '/logo.webp'; }} />
                    </Link>
                    <div className="absolute top-0 left-0 p-6 z-20">
                      {prod.is_featured && <span className="bg-[#6b4226] text-[#f6f0e4] text-[8px] font-bold uppercase tracking-[0.2em] px-4 py-2">Signature</span>}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] z-20 bg-[#f6f0e4]/95 backdrop-blur-md border-t border-[#dccfb8]">
                      <button onClick={(e) => handleQuickAdd(e, prod.id || prod._id)} className="w-full text-[#1e1510] hover:text-[#d4af37] font-bold text-[10px] uppercase tracking-[0.2em] py-6 transition-colors flex justify-center items-center gap-3">
                        <ShoppingBag size={14} /> Add to Bag
                      </button>
                    </div>
                  </div>
                  <div className="text-center space-y-4 px-2">
                    <Link to={`/product/${prod.slug || prod.id || prod._id}`}>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-[#1e1510] group-hover:text-[#6b4226] transition-colors line-clamp-1">{prod.name}</h4>
                    </Link>
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-lg font-serif text-[#4a3628]">₹{prod.discount_price || prod.price}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-40 bg-[#f6f0e4]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-24">
            <motion.h2 variants={fadeUp} className="text-[10px] font-bold text-[#6b4226] uppercase tracking-[0.5em] mb-4">Community</motion.h2>
            <motion.h3 variants={fadeUp} className="text-4xl md:text-6xl font-serif text-[#1e1510]">Skin Transformations.</motion.h3>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2, duration: 1 }}
                className="bg-[#ebe1d1] p-12 border border-[#dccfb8] shadow-sm hover:shadow-[0_20px_40px_rgba(107,66,38,0.08)] transition-shadow duration-500 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 text-[#f6f0e4] opacity-70">
                  <Quote size={100} />
                </div>
                <div className="relative z-10">
                  <div className="flex gap-1 text-[#6b4226] mb-10">
                    <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
                  </div>
                  <p className="text-[#4a3628] font-light text-lg leading-loose mb-12 italic">"{test.text}"</p>
                </div>
                <div className="border-t border-[#dccfb8] pt-8 relative z-10 flex justify-between items-end">
                  <p className="text-[#1e1510] font-bold uppercase tracking-widest text-xs">{test.author}</p>
                  <p className="text-[#6b4226] text-[9px] uppercase tracking-[0.2em]">{test.type}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-40 relative overflow-hidden bg-[#1e1510] text-center border-y border-[#6b4226]/30">
        <motion.div style={{ y: yPosParallax }} className="absolute inset-0 opacity-20 pointer-events-none">
           <img src="/assets/images/Promo8.webp" className="w-full h-full object-cover mix-blend-luminosity" alt="Background" />
        </motion.div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }} 
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }} 
            viewport={{ once: true }} 
            transition={{ duration: 1.2, ease: easeFluid }}
            className="bg-[#1e1510]/80 backdrop-blur-md border border-[#d4af37]/20 p-16 md:p-24 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="w-20 h-20 mx-auto bg-[#6b4226] flex items-center justify-center mb-10 text-[#f6f0e4]">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-[10px] font-bold text-[#d4af37] uppercase tracking-[0.5em] mb-8">Skin Tone Engine</h2>
            <h3 className="text-4xl md:text-6xl font-serif text-[#f6f0e4] mb-10 leading-tight">
              Stop guessing. <br/> Understand your origin.
            </h3>
            <p className="text-lg md:text-xl text-[#a89f91] font-light mx-auto mb-16 leading-relaxed max-w-2xl">
              Analyze your complexion profile to uncover the raw, botanical elements designed specifically for your skin's unique ecosystem.
            </p>
            <button onClick={handleFitmentSearch} className="px-12 py-5 bg-[#d4af37] text-[#1e1510] font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[#f6f0e4] transition-all duration-500 shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:shadow-[0_0_60px_rgba(246,240,228,0.4)]">
              Analyze My Profile
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-40 px-6 bg-[#f6f0e4]">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-24">
            <motion.h2 variants={fadeUp} className="text-[10px] font-bold text-[#6b4226] uppercase tracking-[0.5em] mb-4">Knowledge Base</motion.h2>
            <motion.h3 variants={fadeUp} className="text-4xl md:text-6xl font-serif text-[#1e1510]">The Inquiry.</motion.h3>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className="border-b border-[#dccfb8]"
              >
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between py-8 text-left focus:outline-none group"
                >
                  <span className="text-sm md:text-base font-bold uppercase tracking-widest text-[#1e1510] group-hover:text-[#6b4226] transition-colors">{faq.q}</span>
                  <span className="text-[#6b4226] transition-transform duration-300">
                    {activeFaq === idx ? <Minus size={20} /> : <Plus size={20} />}
                  </span>
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="pb-8 text-[#4a3628] font-light text-lg leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
