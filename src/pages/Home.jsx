import React, { useState, useEffect, Suspense, lazy, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Droplets, ShoppingBag, Star, Leaf, Wind, CheckCircle, ShieldCheck, Heart, Feather, Sun, Moon, ArrowDown, ChevronRight, Quote, Plus, Minus } from 'lucide-react';
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

export default function Home() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yPosHero = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ products: [], categories: [], flashSales: [] });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);

  const heroContent = [
    { 
      img: "Promo1.webp", 
      title: "Earth to Skin.", 
      subtitle: "The Purest Hydration", 
      quote: "We don't manufacture beauty. We harvest it. Experience the unfiltered potency of raw, earth-derived botanicals.",
      tag: "100% Natural Formulation"
    },
    { 
      img: "Promo2.webp", 
      title: "Ancient Wisdom.", 
      subtitle: "Modern Elegance", 
      quote: "Ayurvedic secrets preserved in every drop. Let the soil, the sun, and the rain restore your skin's true vitality.",
      tag: "Therapeutic Grade Ingredients"
    },
    { 
      img: "Promo3.webp", 
      title: "Unapologetic Purity.", 
      subtitle: "Zero Synthetics", 
      quote: "Your skin is a living, breathing ecosystem. Nourish it with ingredients that come from the earth, not a laboratory.",
      tag: "Cruelty-Free & Vegan"
    }
  ];

  const editorialGallery = [
    { img: "Promo4.webp", quote: "Nature’s quiet embrace heals the deepest layers.", author: "The Bhumivera Ethos", span: "col-span-1 md:col-span-2 row-span-2" },
    { img: "Promo5.webp", quote: "Radiance born from the soil.", author: "Botanical Truth", span: "col-span-1 row-span-1" },
    { img: "Promo6.webp", quote: "Purified by timeless clays.", author: "Earth's Magnet", span: "col-span-1 row-span-1" },
    { img: "Promo7.webp", quote: "Hydration mimicking the morning dew.", author: "Liquid Life", span: "col-span-1 md:col-span-2 row-span-1" },
    { img: "Promo8.webp", quote: "Defy time with earth's resilience.", author: "Eternal Bloom", span: "col-span-1 row-span-2" },
    { img: "Promo9.webp", quote: "Unfiltered, unmasked, unapologetic.", author: "Raw Beauty", span: "col-span-1 row-span-1" },
    { img: "Promo10.webp", quote: "A return to the roots of self-care.", author: "The Ritual", span: "col-span-1 md:col-span-2 row-span-1" }
  ];

  const ingredientsList = [
    { 
      name: "Multani Mitti (Fuller's Earth)", 
      desc: "Sourced from the deep, mineral-rich layers of the earth, this potent therapeutic clay acts as a magnetic exfoliator. It draws out deep-seated impurities, absorbs excess sebum without stripping natural lipids, and refines your pore architecture for a clarified, luminous complexion.", 
      icon: <Sun size={28} className="text-[#8b5a2b]" />,
      benefits: ["Deep Pore Cleansing", "Sebum Regulation", "Cellular Renewal"]
    },
    { 
      name: "Cold-Pressed Aloe Vera", 
      desc: "Harvested at peak potency and cold-pressed within hours to preserve its enzymatic integrity. Our aloe delivers multi-dimensional cellular hydration, instantly calming inflammation, accelerating micro-healing, and leaving the skin extraordinarily supple.", 
      icon: <Droplets size={28} className="text-[#8b5a2b]" />,
      benefits: ["Intense Hydration", "Redness Reduction", "Barrier Repair"]
    },
    { 
      name: "Wildcrafted Botanical Oils", 
      desc: "A proprietary, cold-pressed blend of non-comedogenic seed and nut oils. Designed to biomimic your skin's natural sebum, these oils lock in moisture and deliver a potent dose of antioxidant protection against daily environmental stress and free radicals.", 
      icon: <Sparkles size={28} className="text-[#8b5a2b]" />,
      benefits: ["Antioxidant Shield", "Lipid Replenishment", "Glow Enhancing"]
    }
  ];

  const philosophicalQuotes = [
    "We believe that the earth has already perfected the art of healing. Our only job is to bottle it without interference. No artificial colors, no synthetic fragrances, just the raw essence of nature.",
    "True luxury is not found in sterile laboratories, but in the untamed, unadulterated purity of the botanical world. It is the feeling of earth melting into your skin.",
    "Bhumivera is a profound rejection of modern chemical overload. It is a mindful return to the roots of holistic self-care, honoring the symbiotic relationship between human skin and nature."
  ];

  const testimonials = [
    { text: "I abandoned my entire 10-step chemical routine for the Multani Mitti and Aloe regimen. My skin has never felt this breathable and balanced.", author: "Elena R.", type: "Combination Skin" },
    { text: "You can literally smell the earth and rain in these products. It's not just skincare; it's a grounding daily ritual that brings me back to center.", author: "Priya S.", type: "Sensitive Skin" },
    { text: "The glass-like glow I get from the botanical oils is unmatched. Finally, a luxury brand that respects the skin's natural intelligence.", author: "Sarah M.", type: "Dry/Mature Skin" }
  ];

  const faqs = [
    { q: "Are your products truly 100% natural?", a: "Absolutely. We strictly formulate without parabens, sulfates, silicones, artificial dyes, or synthetic fragrances. Every ingredient is ethically sourced directly from the earth." },
    { q: "How do I know which regimen is right for my skin?", a: "We recommend using our 'Clinical Assessment' engine below. It analyzes your unique skin type, concerns, and environment to generate a bespoke botanical routine." },
    { q: "Is the packaging eco-friendly?", a: "Yes. Our commitment to the earth extends to our packaging. We use recyclable glass, biodegradable materials, and minimalistic design to reduce our carbon footprint." },
    { q: "Do you test on animals?", a: "Never. Bhumivera is fiercely cruelty-free. We believe in compassionate beauty and test our formulations exclusively on human volunteers in clinical settings." }
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
    <div className="min-h-screen bg-[#faf8f5] pt-24 px-6 space-y-12">
       <SkeletonBlock className="w-full h-[85vh] rounded-[3rem]" />
       <ProductGridSkeleton count={4} />
    </div>
  );

  return (
    <div className="bg-[#faf8f5] text-[#2c2c2c] selection:bg-[#8b5a2b] selection:text-[#faf8f5] font-sans overflow-hidden">
      
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-[#8b5a2b] origin-left z-[100]" style={{ scaleX: scrollYProgress }} />

      <section className="relative w-full h-[100svh] overflow-hidden bg-[#1a1a1a]">
        <div className="absolute inset-0 flex transition-transform duration-[1800ms] ease-[cubic-bezier(0.25,1,0.5,1)]" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {heroContent.map((slide, idx) => (
            <div key={idx} className="min-w-full h-full relative overflow-hidden">
              <motion.img 
                src={`/assets/images/${slide.img}`} 
                className="w-full h-full object-cover opacity-90" 
                alt={`Bhumivera ${idx}`} 
                style={{ y: yPosHero, opacity: opacityHero }}
              />
              <div className="absolute inset-0 bg-black/20" />
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
              <div className="glass-panel bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-14 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)]">
                <div className="mb-6 inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#8b5a2b]/50 bg-[#1a1a1a]/50 backdrop-blur-md">
                  <Sparkles size={12} className="text-[#8b5a2b]" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#e8dcc4]">{heroContent[currentSlide].tag}</span>
                  <Sparkles size={12} className="text-[#8b5a2b]" />
                </div>
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif text-[#f4eedc] tracking-tight mb-4 drop-shadow-lg leading-tight">
                  {heroContent[currentSlide].title}
                </h1>
                <h2 className="text-sm md:text-2xl text-[#8b5a2b] font-serif italic mb-8 drop-shadow-md">
                  {heroContent[currentSlide].subtitle}
                </h2>
                <div className="w-12 h-px bg-white/30 mx-auto mb-8" />
                <p className="text-[#f4eedc]/90 font-light text-sm md:text-lg leading-relaxed max-w-xl mx-auto tracking-wide">
                  "{heroContent[currentSlide].quote}"
                </p>
                <div className="mt-10 pointer-events-auto">
                  <Link to="/shop" className="px-10 py-4 bg-[#8b5a2b] text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-[#1a1a1a] transition-all duration-500 shadow-xl inline-flex items-center gap-3">
                    Discover Collection <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce text-white/50 flex flex-col items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-widest">Explore</span>
          <ArrowDown size={16} />
        </div>
      </section>

      <section className="py-32 px-6 max-w-6xl mx-auto relative z-10 bg-[#faf8f5]">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center">
          <motion.h2 variants={fadeUp} className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.5em] mb-10 flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-[#8b5a2b]/30" />
            The Manifesto
            <div className="w-12 h-px bg-[#8b5a2b]/30" />
          </motion.h2>
          <motion.h3 variants={fadeUp} className="text-3xl md:text-5xl lg:text-7xl font-serif text-[#1a1a1a] leading-[1.1] mb-20 max-w-5xl mx-auto">
            We are redefining the dialogue between human skin and the natural world. No synthetics. No compromises.
          </motion.h3>
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
            {philosophicalQuotes.map((quote, idx) => (
              <div key={idx} className="space-y-6 relative group">
                <div className="w-12 h-12 rounded-full bg-[#f4eedc] flex items-center justify-center text-[#8b5a2b] group-hover:bg-[#8b5a2b] group-hover:text-white transition-colors duration-500">
                  <Leaf size={20} />
                </div>
                <p className="text-[#5c4a3d] font-light leading-loose text-lg">{quote}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="py-32 bg-[#1a1a1a] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#8b5a2b]/10 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-[100rem] mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-24">
            <motion.h2 variants={fadeUp} className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.5em] mb-6">The Lookbook</motion.h2>
            <motion.h3 variants={fadeUp} className="text-4xl md:text-6xl font-serif text-[#f4eedc]">Botanical Aesthetics.</motion.h3>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[350px] md:auto-rows-[450px]">
            {editorialGallery.map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 1.2, delay: (idx % 4) * 0.1, ease: easeFluid }}
                className={`relative overflow-hidden rounded-[2.5rem] group cursor-pointer ${item.span}`}
              >
                <img src={`/assets/images/${item.img}`} className="w-full h-full object-cover transition-transform duration-[5000ms] ease-out group-hover:scale-110" alt="Bhumivera Aesthetic" />
                <div className={`absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-700 flex flex-col ${item.align} p-6 md:p-10`}>
                  <div className="glass-panel bg-[#1a1a1a]/40 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                    <Quote size={24} className="text-[#8b5a2b] mb-4 opacity-50" />
                    <p className="text-[#f4eedc] font-serif text-2xl md:text-3xl italic mb-4">"{item.quote}"</p>
                    <p className="text-[#8b5a2b] text-[10px] font-bold uppercase tracking-widest">— {item.author}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-40 px-6 max-w-7xl mx-auto overflow-hidden bg-[#faf8f5]">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="mb-32 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="max-w-2xl">
            <motion.h2 variants={slideInLeft} className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.5em] mb-6">Materia Medica</motion.h2>
            <motion.h3 variants={slideInLeft} className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#1a1a1a] leading-tight">
              The anatomy of our formulations.
            </motion.h3>
          </div>
          <motion.div variants={slideInRight}>
            <p className="text-[#5c4a3d] font-light max-w-md text-xl leading-relaxed">We refuse to use filler ingredients. Every single element in a Bhumivera product serves a distinct, scientifically-backed therapeutic purpose.</p>
          </motion.div>
        </motion.div>

        <div className="space-y-40">
          {ingredientsList.map((ing, idx) => (
            <motion.div 
              key={idx}
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
              className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-16 lg:gap-24 items-center`}
            >
              <motion.div variants={fadeScale} className="w-full md:w-1/2 aspect-square rounded-[3rem] overflow-hidden bg-white relative p-4 shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-[#e8dcc4]">
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative group">
                  <img src={`/assets/images/Promo${idx + 1}.webp`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms] ease-out" alt={ing.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
              </motion.div>
              <motion.div variants={idx % 2 !== 0 ? slideInLeft : slideInRight} className="w-full md:w-1/2 space-y-8">
                <div className="inline-flex items-center justify-center p-5 rounded-2xl bg-[#f4eedc] border border-[#e8dcc4] shadow-sm">
                  {ing.icon}
                </div>
                <h4 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1a1a1a]">{ing.name}</h4>
                <p className="text-[#5c4a3d] font-light text-xl leading-loose">{ing.desc}</p>
                <div className="flex flex-wrap gap-3 pt-4">
                  {ing.benefits.map((ben, i) => (
                    <span key={i} className="px-4 py-2 rounded-full bg-white border border-[#e8dcc4] text-[10px] font-bold uppercase tracking-widest text-[#8b5a2b] shadow-sm">
                      {ben}
                    </span>
                  ))}
                </div>
                <div className="pt-8">
                  <Link to="/shop" className="px-10 py-4 bg-[#8b5a2b] text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-[#1a1a1a] transition-all duration-500 shadow-xl inline-flex items-center gap-3">
                    Discover Collection <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce text-white/50 flex flex-col items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-widest">Explore</span>
          <ArrowDown size={16} />
        </div>
      </section>

      <section className="py-32 px-6 max-w-6xl mx-auto relative z-10 bg-[#faf8f5]">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center">
          <motion.h2 variants={fadeUp} className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.5em] mb-10 flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-[#8b5a2b]/30" />
            The Manifesto
            <div className="w-12 h-px bg-[#8b5a2b]/30" />
          </motion.h2>
          <motion.h3 variants={fadeUp} className="text-3xl md:text-5xl lg:text-7xl font-serif text-[#1a1a1a] leading-[1.1] mb-20 max-w-5xl mx-auto">
            We are redefining the dialogue between human skin and the natural world. No synthetics. No compromises.
          </motion.h3>
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
            {philosophicalQuotes.map((quote, idx) => (
              <div key={idx} className="space-y-6 relative group">
                <div className="w-12 h-12 rounded-full bg-[#f4eedc] flex items-center justify-center text-[#8b5a2b] group-hover:bg-[#8b5a2b] group-hover:text-white transition-colors duration-500">
                  <Leaf size={20} />
                </div>
                <p className="text-[#5c4a3d] font-light leading-loose text-lg">{quote}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="py-32 bg-[#1a1a1a] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#8b5a2b]/10 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-[100rem] mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-24">
            <motion.h2 variants={fadeUp} className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.5em] mb-6">The Lookbook</motion.h2>
            <motion.h3 variants={fadeUp} className="text-4xl md:text-6xl font-serif text-[#f4eedc]">Botanical Aesthetics.</motion.h3>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[350px] md:auto-rows-[450px]">
            {editorialGallery.map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 1.2, delay: (idx % 4) * 0.1, ease: easeFluid }}
                className={`relative overflow-hidden rounded-[2.5rem] group cursor-pointer ${item.span}`}
              >
                <img src={`/assets/images/${item.img}`} className="w-full h-full object-cover transition-transform duration-[5000ms] ease-out group-hover:scale-110" alt="Bhumivera Aesthetic" />
                <div className={`absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-700 flex flex-col ${item.align} p-6 md:p-10`}>
                  <div className="glass-panel bg-[#1a1a1a]/40 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                    <Quote size={24} className="text-[#8b5a2b] mb-4 opacity-50" />
                    <p className="text-[#f4eedc] font-serif text-2xl md:text-3xl italic mb-4">"{item.quote}"</p>
                    <p className="text-[#8b5a2b] text-[10px] font-bold uppercase tracking-widest">— {item.author}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-40 px-6 max-w-7xl mx-auto overflow-hidden bg-[#faf8f5]">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="mb-32 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="max-w-2xl">
            <motion.h2 variants={slideInLeft} className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.5em] mb-6">Materia Medica</motion.h2>
            <motion.h3 variants={slideInLeft} className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#1a1a1a] leading-tight">
              The anatomy of our formulations.
            </motion.h3>
          </div>
          <motion.div variants={slideInRight}>
            <p className="text-[#5c4a3d] font-light max-w-md text-xl leading-relaxed">We refuse to use filler ingredients. Every single element in a Bhumivera product serves a distinct, scientifically-backed therapeutic purpose.</p>
          </motion.div>
        </motion.div>

        <div className="space-y-40">
          {ingredientsList.map((ing, idx) => (
            <motion.div 
              key={idx}
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
              className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-16 lg:gap-24 items-center`}
            >
              <motion.div variants={fadeScale} className="w-full md:w-1/2 aspect-square rounded-[3rem] overflow-hidden bg-white relative p-4 shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-[#e8dcc4]">
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative group">
                  <img src={`/assets/images/Promo${idx + 1}.webp`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms] ease-out" alt={ing.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
              </motion.div>
              <motion.div variants={idx % 2 !== 0 ? slideInLeft : slideInRight} className="w-full md:w-1/2 space-y-8">
                <div className="inline-flex items-center justify-center p-5 rounded-2xl bg-[#f4eedc] border border-[#e8dcc4] shadow-sm">
                  {ing.icon}
                </div>
                <h4 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1a1a1a]">{ing.name}</h4>
                <p className="text-[#5c4a3d] font-light text-xl leading-loose">{ing.desc}</p>
                <div className="flex flex-wrap gap-3 pt-4">
                  {ing.benefits.map((ben, i) => (
                    <span key={i} className="px-4 py-2 rounded-full bg-white border border-[#e8dcc4] text-[10px] font-bold uppercase tracking-widest text-[#8b5a2b] shadow-sm">
                      {ben}
                    </span>
                  ))}
                </div>
                <div className="pt-8">
                  <Link to="/shop" className="group inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] hover:text-[#8b5a2b] transition-colors">
                    Explore Products <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>
<section className="py-40 bg-white border-y border-[#e8dcc4] relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div>
              <h2 className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.5em] mb-4">Curated Collection</h2>
              <h3 className="text-5xl md:text-7xl font-serif text-[#1a1a1a]">The Apothecary.</h3>
            </div>
            <Link to="/shop" className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] hover:text-[#8b5a2b] transition-all px-10 py-5 rounded-full border border-[#1a1a1a] hover:border-[#8b5a2b]">
              View Full Directory <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {data.products.length > 0 && (
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {data.products.map((prod) => (
                <motion.div variants={fadeUp} key={prod.id || prod._id} className="group flex flex-col">
                  <div className="relative aspect-[3/4] bg-[#faf8f5] rounded-[2.5rem] overflow-hidden border border-[#e8dcc4] mb-8 shadow-sm group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700">
                    <Link to={`/product/${prod.slug || prod.id || prod._id}`}>
                      <img src={getImageUrl(prod.images?.[0] || prod.image_url)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out mix-blend-multiply p-6" alt={prod.name} onError={(e) => { e.target.src = '/logo.webp'; }} />
                    </Link>
                    <div className="absolute top-5 left-5 z-20">
                      {prod.is_featured && <span className="bg-[#8b5a2b]/90 backdrop-blur-md text-white text-[8px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-[#8b5a2b]">Iconic</span>}
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 translate-y-[150%] group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] z-20">
                      <button onClick={(e) => handleQuickAdd(e, prod.id || prod._id)} className="w-full glass-panel bg-white/80 backdrop-blur-xl border border-white hover:bg-[#8b5a2b] hover:text-white text-[#1a1a1a] font-bold text-[10px] uppercase tracking-widest py-5 rounded-2xl transition-all shadow-lg flex justify-center items-center gap-3">
                        <ShoppingBag size={14} /> Add to Bag
                      </button>
                    </div>
                  </div>
                  <div className="px-4 text-center space-y-3">
                    <Link to={`/product/${prod.slug || prod.id || prod._id}`}>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-[#1a1a1a] group-hover:text-[#8b5a2b] transition-colors line-clamp-1">{prod.name}</h4>
                    </Link>
                    <div className="flex items-center justify-center gap-2 text-[#8b5a2b]">
                      <Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" />
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-base font-serif text-[#5c4a3d]">₹{prod.discount_price || prod.price}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-40 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-24">
            <motion.h2 variants={fadeUp} className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.5em] mb-4">Community</motion.h2>
            <motion.h3 variants={fadeUp} className="text-4xl md:text-6xl font-serif text-[#1a1a1a]">Skin Transformations.</motion.h3>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2, duration: 1 }}
                className="bg-white p-10 md:p-14 rounded-[3rem] border border-[#e8dcc4] shadow-sm hover:shadow-xl transition-shadow duration-500 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 text-[#f4eedc] opacity-50">
                  <Quote size={80} />
                </div>
                <div className="relative z-10">
                  <div className="flex gap-1 text-[#8b5a2b] mb-8">
                    <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
                  </div>
                  <p className="text-[#5c4a3d] font-light text-lg leading-loose mb-12 italic">"{test.text}"</p>
                </div>
                <div className="border-t border-[#e8dcc4] pt-8 relative z-10">
                  <p className="text-[#1a1a1a] font-bold uppercase tracking-widest text-xs mb-2">{test.author}</p>
                  <p className="text-[#8b5a2b] text-[10px] uppercase tracking-[0.2em]">{test.type}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-40 relative overflow-hidden bg-[#1a1a1a] text-center">
        <motion.div style={{ y: yPosParallax }} className="absolute inset-0 opacity-30 pointer-events-none">
           <img src="/assets/images/Promo8.webp" className="w-full h-full object-cover mix-blend-luminosity" alt="Background" />
           <div className="absolute inset-0 bg-black/40" />
        </motion.div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }} 
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }} 
            viewport={{ once: true }} 
            transition={{ duration: 1.2, ease: easeFluid }}
            className="glass-panel bg-white/5 backdrop-blur-xl border border-white/10 p-12 md:p-24 rounded-[4rem] shadow-2xl"
          >
            <div className="w-24 h-24 mx-auto bg-[#8b5a2b]/20 border border-[#8b5a2b]/50 rounded-full flex items-center justify-center mb-10 text-[#8b5a2b] backdrop-blur-md">
              <ShieldCheck size={36} />
            </div>
            <h2 className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.8em] mb-8">Clinical Assessment</h2>
            <h3 className="text-4xl md:text-6xl font-serif text-[#f4eedc] mb-10 leading-tight">
              Stop guessing. <br/> Start listening to your skin.
            </h3>
            <p className="text-base md:text-xl text-[#f4eedc]/80 font-light mx-auto mb-16 leading-relaxed">
              Every complexion is a unique ecosystem. Utilize our proprietary Skin Assessment Engine to diagnose your specific needs and generate a personalized, 100% botanical regimen.
            </p>
            <button onClick={handleFitmentSearch} className="px-14 py-6 bg-[#8b5a2b] text-white font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white hover:text-[#1a1a1a] transition-all duration-500 shadow-[0_0_40px_rgba(139,90,43,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:-translate-y-2">
              Analyze My Skin Profile
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-40 px-6 bg-white border-b border-[#e8dcc4]">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-24">
            <motion.h2 variants={fadeUp} className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-[0.5em] mb-4">Knowledge Base</motion.h2>
            <motion.h3 variants={fadeUp} className="text-4xl md:text-6xl font-serif text-[#1a1a1a]">The Inquiry.</motion.h3>
          </motion.div>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className="border border-[#e8dcc4] rounded-[2rem] overflow-hidden bg-[#faf8f5]"
              >
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-8 text-left focus:outline-none"
                >
                  <span className="text-sm md:text-base font-bold uppercase tracking-widest text-[#1a1a1a] pr-8">{faq.q}</span>
                  <span className="text-[#8b5a2b] bg-white p-2 rounded-full border border-[#e8dcc4] transition-transform duration-300">
                    {activeFaq === idx ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="px-8 pb-8 text-[#5c4a3d] font-light text-lg leading-relaxed border-t border-[#e8dcc4] pt-8"
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

      <section className="py-32 px-6 bg-[#faf8f5]">
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
                className="text-center space-y-6 p-10 rounded-[3rem] bg-white border border-[#e8dcc4] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-20 h-20 mx-auto bg-[#faf8f5] border border-[#e8dcc4] text-[#8b5a2b] rounded-full flex items-center justify-center">
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
)