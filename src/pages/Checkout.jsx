import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { addresses as addressesApi, orders as ordersApi, wallet as walletApi } from '../services/api';
import { 
  FiMapPin, 
  FiTruck, 
  FiCreditCard, 
  FiCheckCircle, 
  FiZap, 
  FiPlus, 
  FiShield, 
  FiPackage, 
  FiChevronRight,
  FiInfo 
} from 'react-icons/fi';
import { Wallet } from 'lucide-react';

export default function Checkout() {
  const { user } = useAuth();
  const { cartItems, getSubtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMode, setPaymentMode] = useState('COD');
  const [shippingMethod, setShippingMethod] = useState('STANDARD');
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const subtotal = getSubtotal();
  const shippingCost = shippingMethod === 'EXPRESS' ? 150 : 0;
  const finalTotal = subtotal + shippingCost;

  const fetchData = useCallback(async () => {
    // 1. Fetch Addresses Independently
    try {
      const addrRes = await addressesApi.getAll();
      const list = addrRes.data.data || addrRes.data || [];
      setAddresses(list);
      
      const def = list.find(a => a.is_default) || list[0];
      if (def) setSelectedAddress(def.id);
    } catch (err) {
      console.error("Failed to fetch checkout addresses", err);
    }

    // 2. Fetch Wallet Independently (Prevents a 404 from freezing the address render)
    try {
      const walletRes = await walletApi.getBalance();
      setWalletBalance(walletRes.data.balance || 0);
    } catch (err) {
      console.error("Failed to fetch wallet balance, defaulting to 0", err);
      setWalletBalance(0);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePlaceOrder = async (isFastCheckout = false) => {
    if (!selectedAddress) return alert("Please select a shipping address.");
    if (paymentMode === 'WALLET' && walletBalance < finalTotal) return alert("Insufficient wallet balance for this transaction.");

    setLoading(true);
    try {
      const payload = {
        addressId: selectedAddress,
        paymentMode: isFastCheckout ? 'WALLET' : paymentMode,
        isFastCheckout,
        shippingMethod
      };
      
      const res = await (isFastCheckout ? ordersApi.fastCheckout(payload) : ordersApi.create(payload));
      clearCart();
      navigate(`/order-success/${res.data.orderId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Checkout sequence failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-24 pb-16 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 border-b border-white/10 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tight flex items-center gap-3">
              <FiShield className="text-emerald-500" /> Secure Checkout
            </h1>
            <p className="text-gray-500 text-sm mt-2 font-mono">ENCRYPTED SESSION // {user?.email || 'GUEST'}</p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-mono text-gray-500">
            <span className="text-emerald-500 flex items-center gap-1"><FiCheckCircle /> Cart</span>
            <FiChevronRight />
            <span className="text-white flex items-center gap-1"><FiTruck /> Details</span>
            <FiChevronRight />
            <span>Payment</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT COLUMN: Data Entry */}
          <div className="flex-1 space-y-10">
            
            {/* Addresses */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light text-white flex items-center gap-3">
                  <FiMapPin className="text-emerald-500" /> Shipping Destination
                </h2>
                <button 
                  onClick={() => navigate('/address-book')}
                  className="text-emerald-500 hover:text-emerald-400 text-sm font-mono flex items-center gap-1 transition-colors"
                >
                  <FiPlus /> NEW ADDRESS
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.length === 0 ? (
                  <div className="col-span-2 bg-black/50 border border-white/10 p-6 rounded-xl text-center">
                    <p className="text-gray-400 mb-4">No shipping addresses found.</p>
                    <button 
                      onClick={() => navigate('/address-book')}
                      className="bg-white text-black px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors"
                    >
                      Add Address Now
                    </button>
                  </div>
                ) : (
                  addresses.map(addr => (
                    <div 
                      key={addr.id} 
                      onClick={() => setSelectedAddress(addr.id)} 
                      className={`relative p-5 rounded-xl border cursor-pointer transition-all duration-300 ${
                        selectedAddress === addr.id 
                          ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                          : 'bg-black/50 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {selectedAddress === addr.id && (
                        <div className="absolute top-4 right-4 text-emerald-500">
                          <FiCheckCircle size={20} />
                        </div>
                      )}
                      <p className="text-white font-medium mb-1">{addr.full_name}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{addr.address_line1}</p>
                      <p className="text-gray-400 text-sm">{addr.city}, {addr.state} - <span className="font-mono text-emerald-400/70">{addr.pincode}</span></p>
                    </div>
                  ))
                )}
              </div>
            </motion.section>

            {/* Delivery Method */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-8"
            >
              <h2 className="text-xl font-light text-white mb-6 flex items-center gap-3">
                <FiPackage className="text-emerald-500" /> Delivery Protocol
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={() => setShippingMethod('STANDARD')}
                  className={`p-5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${shippingMethod === 'STANDARD' ? 'bg-emerald-500/10 border-emerald-500' : 'bg-black/50 border-white/10 hover:border-white/30'}`}
                >
                  <div>
                    <p className="font-medium">Standard Logistics</p>
                    <p className="text-sm text-gray-500">3-5 Business Days</p>
                  </div>
                  <span className="font-mono text-emerald-500">FREE</span>
                </div>
                <div 
                  onClick={() => setShippingMethod('EXPRESS')}
                  className={`p-5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${shippingMethod === 'EXPRESS' ? 'bg-emerald-500/10 border-emerald-500' : 'bg-black/50 border-white/10 hover:border-white/30'}`}
                >
                  <div>
                    <p className="font-medium">Priority Air</p>
                    <p className="text-sm text-gray-500">1-2 Business Days</p>
                  </div>
                  <span className="font-mono text-white">₹150</span>
                </div>
              </div>
            </motion.section>

            {/* Payment Method */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-8"
            >
              <h2 className="text-xl font-light text-white mb-6 flex items-center gap-3">
                <FiCreditCard className="text-emerald-500" /> Payment Gateway
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PaymentCard 
                  id="COD" 
                  label="Cash on Delivery" 
                  icon={<FiTruck size={24} />} 
                  active={paymentMode} 
                  set={setPaymentMode} 
                />
                <PaymentCard 
                  id="WALLET" 
                  label={`Digital Wallet (₹${walletBalance})`} 
                  icon={<Wallet size={24} />} 
                  active={paymentMode} 
                  set={setPaymentMode} 
                  disabled={walletBalance < finalTotal} 
                />
              </div>
            </motion.section>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-[400px]"
          >
            <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-8 sticky top-24">
              <h3 className="text-xl font-light text-white mb-6">Order Manifest</h3>
              
              {/* Cart Items Preview */}
              <div className="max-h-60 overflow-y-auto mb-6 pr-2 space-y-4 custom-scrollbar">
                {cartItems?.length > 0 ? cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 border-b border-white/5 pb-4">
                    <div className="w-16 h-16 bg-black rounded-lg border border-white/10 overflow-hidden flex-shrink-0">
                      <img src={item.image || '/assets/images/placeholder.webp'} alt={item.name} className="w-full h-full object-cover opacity-80" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500 font-mono mt-1">QTY: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-mono text-emerald-400">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 italic text-center py-4">Your cart is empty.</p>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-4 mb-8 font-mono text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-500">FREE</span>
                  ) : (
                    <span className="text-white">₹{shippingCost}</span>
                  )}
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between text-lg font-sans font-light text-white">
                  <span>Final Total</span>
                  <span className="font-mono text-emerald-400">₹{finalTotal}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <button 
                  onClick={() => handlePlaceOrder(false)} 
                  disabled={loading || !selectedAddress || cartItems?.length === 0} 
                  className="w-full bg-white text-black font-bold uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Confirm & Pay"}
                </button>

                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute border-t border-white/10 w-full"></div>
                  <span className="relative bg-[#0d0d0d] px-4 text-xs font-mono text-gray-600">OR</span>
                </div>

                <button 
                  onClick={() => handlePlaceOrder(true)} 
                  disabled={loading || walletBalance < finalTotal || !selectedAddress || cartItems?.length === 0} 
                  className="w-full bg-emerald-600/20 border border-emerald-500 text-emerald-400 font-bold uppercase tracking-widest text-xs py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 hover:text-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FiZap size={16} /> Fast Checkout
                </button>
                <p className="text-center text-gray-500 text-[10px] uppercase tracking-widest mt-2 flex items-center justify-center gap-1">
                  <FiInfo /> Instantly deducts from wallet
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const PaymentCard = ({ id, label, icon, active, set, disabled }) => (
  <div 
    onClick={() => !disabled && set(id)} 
    className={`p-5 rounded-xl border flex items-center gap-4 cursor-pointer transition-all duration-300 ${
      disabled 
        ? 'opacity-30 cursor-not-allowed border-white/5 bg-black/20' 
        : active === id 
          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
          : 'bg-black/50 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
    }`}
  >
    <div className={`${active === id ? 'text-emerald-500' : 'text-gray-500'} flex items-center justify-center`}>
      {icon}
    </div>
    <span className="font-medium text-sm">{label}</span>
  </div>
);
