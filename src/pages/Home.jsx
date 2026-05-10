import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Shield, Truck, Clock, Zap, Star, ChevronRight, ShoppingBag, Award, Headphones, Flame, Search, Heart, Car, Timer, PlayCircle } from 'lucide-react';
import { products as productsApi, categories as categoriesApi, flashSales as flashSalesApi, cart as cartApi } from '../services/api';
import HeroSection from '../components/HeroSection';
import { ProductGridSkeleton, SkeletonBlock } from '../components/SkeletonLoader';

const CategoryCard = lazy(() => import('../components/CategoryCard'));

const getImageUrl = (img) => {
  if (!img) return 'https://www.bhumivera.com/logo.webp';
  let path = typeof img === 'object' ? (img.file_path || img.url || img.path) : img;
  if (!path) return 'https://www.bhumivera.com/logo.webp';
  if (path.startsWith('http')) return path;
  
  const baseUrl = import.meta.env.VITE_R2_PUBLIC_URL || import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-22cd43cce9bc475680ad496e199706c4.r2.dev';
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Home() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    products: [],
    categories: [],
    flashSales: []
  });
  
  const [fitment, setFitment] = useState({ make: '', model: '', year: '' });

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodRes, catRes, flashRes] = await Promise.all([
          productsApi.getAllActive({ limit: 8, featured: true }),
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
    navigate(`/fitment-engine?make=${fitment.make}&model=${fitment.model}&year=${fitment.year}`);
  };

  const heroImages = [
    "pomelli_creative_image_9_16_0422 (1).png",
    "pomelli_creative_image_9_16_0422 (2).png",
    "pomelli_creative_image_9_16_0422.png"
  ];

  const soapAds = [
    "SOAP_AD (1).png",
    "SOAP_AD (3).png",
    "SOAP_AD (8).png",
    "SOAP_AD (11).png",
    "SOAP_AD (12).png",
    "SOAP_AD (13).png",
    "SOAP_AD (14).png"
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % heroImages.length), 4000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  if (loading) return (
    <div className="min-h-screen bg-[#faf8f5] pt-24 px-6 space-y-12">
       <SkeletonBlock className="w-full h-[60vh] rounded-3xl" />
    </div>
  );

  return (
    <div className="bg-[#faf8f5] text-[#2c2c2c] selection:bg-[#8b5a2b] selection:text-white font-sans overflow-hidden">
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-[#8b5a2b] origin-left z-50" 
        style={{ scaleX: scrollYProgress }} 
      />

      <section className="relative w-full h-screen overflow-hidden bg-[#1a1a1a]">
        <div className="absolute inset-0 flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {heroImages.map((img, idx) => (
            <div key={idx} className="min-w-full h-full relative">
              <img src={`/assets/images/${img}`} className="w-full h-full object-cover opacity-80" alt={`Bhumivera Aesthetic ${idx}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} 
            className="text-6xl md:text-9xl font-serif text-[#f4eedc] tracking-widest uppercase mb-6 drop-shadow-2xl"
          >
            Bhumivera
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} 
            className="text-sm md:text-xl text-[#e8dcc4] font-light max-w-2xl tracking-[0.3em] uppercase"
          >
            The Essence of Multani Mitti & Aloe Vera
          </motion.p>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="text-center max-w-4xl mx-auto">
          <motion.h2 variants={fadeUp} className="text-xs font-bold text-[#8b5a2b] uppercase tracking-[0.4em] mb-6">Our Philosophy</motion.h2>
          <motion.h3 variants={fadeUp} className="text-3xl md:text-5xl font-serif text-[#1a1a1a] leading-tight mb-8">
            Crafted from the earth, designed for your skin. We bring you the purest elements of nature.
          </motion.h3>
          <motion.div variants={fadeUp} className="w-24 h-1 bg-[#8b5a2b] mx-auto"></motion.div>
        </motion.div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-[90rem] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {soapAds.map((ad, idx) => (
            <motion.div 
              key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} transition={{ delay: idx * 0.1 }} 
              className="relative aspect-[4/5] overflow-hidden group rounded-xl shadow-2xl"
            >
              <img src={`/assets/images/${ad}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out" alt={`Bhumivera Collection ${idx}`} />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <Link to="/shop" className="px-8 py-3 bg-white/90 backdrop-blur-sm text-[#1a1a1a] font-bold uppercase tracking-widest text-xs hover:bg-[#8b5a2b] hover:text-white transition-colors duration-300">
                  Discover
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-32 bg-[#1a1a1a] text-[#f4eedc] text-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2 className="text-4xl md:text-6xl font-serif mb-8">Embrace Pure Beauty</h2>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-light mb-12 tracking-wide leading-relaxed">
            Experience the transformative power of ancient skincare secrets merged with modern elegance. Rejuvenate naturally.
          </p>
          <Link to="/shop" className="inline-block px-12 py-5 bg-[#8b5a2b] text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#6b4421] transition-colors duration-300 shadow-xl">
            Enter The Boutique
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
