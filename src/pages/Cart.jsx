import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, ArrowLeft, Trash2, Plus, Minus, 
  ShieldCheck, Zap, ArrowRight, Truck, PackageCheck 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const getImageUrl = (img) => {
  if (!img) return '/logo.webp';
  let path = typeof img === 'object' ? (img.url || img.file_path || img.path) : img;
  if (!path) return '/logo.webp';
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_R2_PUBLIC_URL || import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-22cd43cce9bc475680ad496e199706c4.r2.dev';
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

export default function Cart() {
  const { 
    cartItems = [], 
    removeFromCart, 
    updateQuantity, 
    getSubtotal, 
    shippingProgress = 0,
    freeShippingThreshold = 5000,
    addToCart
  } = useCart();
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const cartTotal = typeof getSubtotal === 'function' ? getSubtotal() : 0;
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const amountLeftForFreeShipping = Math.max(freeShippingThreshold - cartTotal, 0);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 selection:bg-[#8b5a2b] selection:text-white pt-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="bg-white p-12 rounded-[3rem] shadow-sm flex flex-col items-center text-center max-w-lg border border-[#e8dcc4] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-[#8b5a2b] opacity-20"></div>
          <div className="w-32 h-32 bg-[#faf8f5] rounded-full flex items-center justify-center mb-8 text-[#8b5a2b] border border-[#e8dcc4]">
            <ShoppingBag size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-serif text-[#1A1C18] mb-4">Your Cart is Empty</h2>
          <p className="text-stone-500 mb-10 leading-relaxed font-medium">Discover our natural botanicals and begin your skincare journey.</p>
          <Link to="/shop" className="bg-[#8b5a2b] hover:bg-[#6b4421] text-white px-10 py-5 rounded-full font-bold tracking-widest uppercase text-sm transition-all shadow-md flex items-center gap-3">
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1C18] selection:bg-[#8b5a2b] selection:text-white py-32 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-end justify-between mb-12 border-b border-[#e8dcc4] pb-6">
          <div>
            <h1 className="text-5xl font-serif tracking-tight mb-2 text-[#2C3E2D]">Your Shopping Cart</h1>
            <p className="text-[#8b5a2b] font-bold tracking-widest text-sm uppercase">{cartCount} Items in Cart</p>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-2 text-stone-500 hover:text-[#8b5a2b] font-bold uppercase tracking-widest text-xs transition-colors">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence>
              {cartItems.map(item => {
                const product = item.product || item;
                const id = item.product_id || product._id || product.id;
                const img = Array.isArray(product.images) ? product.images[0] : (product.image_url || product.image);
                const qty = item.quantity || 1;
                const price = product.discount_price || product.price || item.unit_price || 0;

                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    key={id} 
                    className="bg-white border border-[#e8dcc4] rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start group hover:border-[#8b5a2b]/30 transition-colors shadow-sm"
                  >
                    <div className="w-full sm:w-32 h-32 bg-[#faf8f5] rounded-2xl border border-[#e8dcc4] overflow-hidden shrink-0 relative flex items-center justify-center p-2">
                      <img src={getImageUrl(img)} alt={product.name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
                    </div>

                    <div className="flex-1 w-full flex flex-col h-full justify-between">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-bold uppercase tracking-tight line-clamp-2 mb-2 group-hover:text-[#8b5a2b] transition-colors">{product.name}</h3>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-stone-500 text-xs font-bold uppercase tracking-widest">SKU: {product.sku || 'N/A'}</span>
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                              <PackageCheck size={12} /> In Stock
                            </span>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(id)} className="p-2.5 bg-[#faf8f5] text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0">
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold text-[#1A1C18]">₹{parseFloat(price).toLocaleString()}</span>
                        </div>

                        <div className="flex items-center bg-[#faf8f5] border border-[#e8dcc4] rounded-xl p-1">
                          <button onClick={() => updateQuantity(id, qty - 1)} className="w-10 h-10 flex items-center justify-center text-stone-500 hover:text-[#8b5a2b] rounded-lg hover:bg-white transition-colors">
                            <Minus size={16} />
                          </button>
                          <span className="w-12 text-center font-bold text-lg">{qty}</span>
                          <button onClick={() => updateQuantity(id, qty + 1)} className="w-10 h-10 flex items-center justify-center text-stone-500 hover:text-[#8b5a2b] rounded-lg hover:bg-white transition-colors">
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <div className="text-right hidden sm:block">
                          <span className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-0.5">Line Total</span>
                          <span className="text-[#8b5a2b] font-bold text-xl">₹{(price * qty).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="mt-12 p-8 bg-[#faf8f5] border border-[#e8dcc4] rounded-[2.5rem] relative overflow-hidden shadow-inner"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-[#8b5a2b]"><Zap size={100} /></div>
              <h3 className="text-lg font-bold uppercase tracking-widest text-[#2C3E2D] mb-6 flex items-center gap-2">
                <Zap size={18} className="text-[#8b5a2b]" /> You May Also Like
              </h3>
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-[#e8dcc4] shadow-sm">
                <div className="w-16 h-16 bg-[#faf8f5] rounded-xl flex items-center justify-center text-[#8b5a2b] border border-[#e8dcc4] shrink-0">
                  <PackageCheck size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#1A1C18] mb-1">Premium Organic Gift Packaging</h4>
                  <p className="text-xs text-stone-500">Elevate your order with our sustainable signature box.</p>
                </div>
                <div className="text-right">
                  <div className="text-[#8b5a2b] font-bold text-sm mb-2">+ ₹249</div>
                  <button className="text-[10px] font-bold uppercase tracking-widest bg-white border border-[#e8dcc4] hover:bg-[#8b5a2b] text-stone-600 hover:text-white px-4 py-2 rounded-lg transition-colors">
                    Add to order
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white border border-[#e8dcc4] rounded-[2.5rem] p-8 sticky top-32 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-[#8b5a2b]">
                <ShieldCheck size={200} />
              </div>

              <h2 className="text-2xl font-serif tracking-tight mb-8 border-b border-[#e8dcc4] pb-6 relative z-10 text-[#2C3E2D]">Order Summary</h2>
              
              <div className="mb-8 relative z-10">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3">
                  <span className="text-stone-500">Shipping Status</span>
                  {amountLeftForFreeShipping > 0 ? (
                    <span className="text-[#8b5a2b]">Add ₹{amountLeftForFreeShipping.toLocaleString()} for Free</span>
                  ) : (
                    <span className="text-green-600 flex items-center gap-1"><Truck size={14}/> Free Shipping Unlocked</span>
                  )}
                </div>
                <div className="h-2 w-full bg-[#faf8f5] rounded-full overflow-hidden border border-[#e8dcc4]">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${Math.min(100, (cartTotal / freeShippingThreshold) * 100)}%` }} transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${amountLeftForFreeShipping === 0 ? 'bg-green-500' : 'bg-[#8b5a2b]'}`}
                  />
                </div>
              </div>

              <div className="space-y-4 mb-8 relative z-10">
                <div className="flex justify-between text-stone-600 font-medium">
                  <span>Subtotal ({cartCount} Items)</span>
                  <span className="font-bold text-[#1A1C18]">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600 font-medium pb-6 border-b border-[#e8dcc4]">
                  <span>Logistics & Handling</span>
                  {amountLeftForFreeShipping === 0 ? (
                    <span className="text-green-600 font-bold uppercase tracking-widest text-xs bg-green-50 px-2 py-1 rounded">Free</span>
                  ) : (
                    <span className="font-bold text-[#1A1C18]">Calculated next</span>
                  )}
                </div>
                
                <div className="flex justify-between items-end pt-2">
                  <span className="text-sm font-bold uppercase tracking-widest text-stone-500">Final Total</span>
                  <span className="text-4xl font-serif text-[#8b5a2b]">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout} 
                className="w-full bg-[#8b5a2b] hover:bg-[#6b4421] text-white font-bold uppercase tracking-[0.2em] text-sm py-5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-3 relative z-10 group"
              >
                {user ? 'Proceed to Checkout' : 'Login & Checkout'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest relative z-10">
                <ShieldCheck size={14} className="text-[#8b5a2b]" /> Secure 256-Bit SSL Encrypted Link
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
