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
  FiInfo,
  FiTag,
  FiMessageSquare
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
  
  // 10X UPGRADE: Added robust support for backend-supported capabilities
  const [couponCode, setCouponCode] = useState('');
  const [notes, setNotes] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const subtotal = getSubtotal();
  const shippingCost = shippingMethod === 'EXPRESS' ? 150 : 0;
  const finalTotal = subtotal + shippingCost;

  const fetchData = useCallback(async () => {
    try {
      const addrRes = await addressesApi.getAll();
      const list = addrRes.data.data || addrRes.data || [];
      setAddresses(list);
      
      const def = list.find(a => a.is_default) || list[0];
      if (def) setSelectedAddress(def.id);
    } catch (err) {
      console.error("Failed to fetch checkout addresses", err);
    }

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
    if (!selectedAddress) return alert("Please select a shipping destination to proceed.");
    if (paymentMode === 'WALLET' && walletBalance < finalTotal) return alert("Insufficient Digital Wallet balance for this transaction.");

    setLoading(true);
    try {
      const payload = {
        addressId: selectedAddress,
        paymentMode: isFastCheckout ? 'WALLET' : paymentMode,
        isFastCheckout,
        deliveryType: shippingMethod.toLowerCase(), // FIXED: Mapped correctly to backend expectation
        couponCode: couponCode.trim() || undefined,
        notes: notes.trim() || undefined
      };
      
      const res = await (isFastCheckout ? ordersApi.fastCheckout(payload) : ordersApi.create(payload));
      clearCart();
      navigate(`/order-success/${res.data.orderId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Checkout sequence failed. Please verify your details and try again.");
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
            <p className="text-gray-500 text-sm mt-2 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ENCRYPTED SESSION // {user?.email || 'GUEST'}
            </p>
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
              className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light text-white flex items-center gap-3">
                  <FiMapPin className="text-emerald-500" /> Shipping Destination
                </h2>
                <button 
                  onClick={() => navigate('/address-book')}
                  className="text-emerald-500 hover:text-emerald-400 text-sm font-mono flex items-center gap-1 transition-colors bg-emerald-500/10 px-3 py-1.5 rounded-lg"
                >
                  <FiPlus /> NEW
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.length === 0 ? (
                  <div className="col-span-2 bg-black/50 border border-white/10 p-8 rounded-xl text-center">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiMapPin className="text-gray-400 text-xl" />
                    </div>
                    <p className="text-gray-400 mb-4">No shipping addresses configured in your portfolio.</p>
                    <button 
                      onClick={() => navigate('/address-book')}
                      className="bg-white text-black px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors"
                    >
                      Establish Address
                    </button>
                  </div>
                ) : (
                  addresses.map(addr => (
                    <div 
                      key={addr.id} 
                      onClick={() => setSelectedAddress(addr.id)} 
                      className={`relative p-5 rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                        selectedAddress === addr.id 
                          ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                          : 'bg-black/50 border-white/10 hover:border-white/30 hover:bg-white/5'
                      }`}
                    >
                      {selectedAddress === addr.id && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 text-emerald-500">
                          <FiCheckCircle size={20} className="fill-emerald-500/20" />
                        </motion.div>
                      )}
                      <p className="text-white font-medium mb-1 pr-8">{addr.full_name}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{addr.address_line1 || addr.street_address}</p>
                      <p className="text-gray-400 text-sm">{addr.city}, {addr.state} - <span className="font-mono text-emerald-400/70">{addr.pincode || addr.postal_code}</span></p>
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
                    <p className="font-medium flex items-center gap-2">Standard Logistics {shippingMethod === 'STANDARD' && <FiCheckCircle className="text-emerald-500"/>}</p>
                    <p className="text-sm text-gray-500 mt-1">3-5 Business Days</p>
                  </div>
                  <span className="font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded text-xs">FREE</span>
                </div>
                <div 
                  onClick={() => setShippingMethod('EXPRESS')}
                  className={`p-5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${shippingMethod === 'EXPRESS' ? 'bg-emerald-500/10 border-emerald-500' : 'bg-black/50 border-white/10 hover:border-white/30'}`}
                >
                  <div>
                    <p className="font-medium flex items-center gap-2">Priority Air {shippingMethod === 'EXPRESS' && <FiCheckCircle className="text-emerald-500"/>}</p>
                    <p className="text-sm text-gray-500 mt-1">1-2 Business Days</p>
                  </div>
                  <span className="font-mono text-white">₹150</span>
                </div>
              </div>
            </motion.section>

            {/* Additional Info: Promo & Notes */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-8"
            >
              <h2 className="text-xl font-light text-white mb-6 flex items-center gap-3">
                <FiTag className="text-emerald-500" /> Order Modifiers
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Promotional Code</label>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="ENTER CODE" 
                      className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-emerald-500 transition-colors uppercase"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><FiInfo/> Discount applied dynamically at processing.</p>
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-2"><FiMessageSquare/> Concierge Notes</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specific delivery instructions or gift notes..."
                    rows={3}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  ></textarea>
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
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="w-full lg:w-[400px]"
          >
            <div className="bg-[#0d0d0d] border border-emerald-500/20 rounded-2xl p-8 sticky top-24 shadow-[0_10px_40px_rgba(16,185,129,0.05)]">
              <h3 className="text-xl font-light text-white mb-6 flex items-center justify-between">
                Order Manifest
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-mono">{cartItems?.length || 0} ITEMS</span>
              </h3>
              
              {/* Cart Items Preview */}
              <div className="max-h-60 overflow-y-auto mb-6 pr-2 space-y-4 custom-scrollbar">
                {cartItems?.length > 0 ? cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div className="w-16 h-16 bg-black rounded-lg border border-white/10 overflow-hidden flex-shrink-0 relative group">
                      <img src={item.image || '/assets/images/placeholder.webp'} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-0 right-0 bg-black/80 backdrop-blur text-[10px] font-mono px-1.5 py-0.5 rounded-bl-lg">x{item.quantity}</div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white line-clamp-2 leading-tight">{item.name}</p>
                    </div>
                    <div className="text-sm font-mono text-emerald-400">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <FiPackage size={32} className="mb-2 opacity-50" />
                    <p className="text-sm italic text-center">Awaiting acquisitions.</p>
                  </div>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-4 mb-8 font-mono text-sm bg-black/40 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Logistics</span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-500">COMPLIMENTARY</span>
                  ) : (
                    <span className="text-white">₹{shippingCost}</span>
                  )}
                </div>
                {couponCode && (
                  <div className="flex justify-between text-emerald-400/80 text-xs">
                    <span>Promo: {couponCode}</span>
                    <span>Pending DB Evaluation</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-4 flex justify-between items-center text-lg font-sans font-light text-white">
                  <span>Final Authorization</span>
                  <span className="font-mono text-emerald-400 text-xl font-bold">₹{finalTotal}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <button 
                  onClick={() => handlePlaceOrder(false)} 
                  disabled={loading || !selectedAddress || cartItems?.length === 0} 
                  className="w-full bg-white text-black font-bold uppercase tracking-[0.2em] text-xs py-4 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? <span className="animate-pulse">Processing Block...</span> : <><FiShield/> Confirm & Dispatch</>}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                </button>

                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute border-t border-white/10 w-full"></div>
                  <span className="relative bg-[#0d0d0d] px-4 text-[10px] font-black tracking-widest text-gray-600">OR</span>
                </div>

                <button 
                  onClick={() => handlePlaceOrder(true)} 
                  disabled={loading || walletBalance < finalTotal || !selectedAddress || cartItems?.length === 0} 
                  className="w-full bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 font-bold uppercase tracking-[0.2em] text-xs py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FiZap size={16} /> Instapay Checkout
                </button>
                <p className="text-center text-gray-500 text-[10px] uppercase tracking-widest mt-2 flex items-center justify-center gap-1">
                  <FiInfo /> 1-Click Wallet Deduction
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
    className={`p-6 rounded-xl border flex flex-col items-start gap-4 cursor-pointer transition-all duration-300 relative overflow-hidden ${
      disabled 
        ? 'opacity-30 cursor-not-allowed border-white/5 bg-black/20' 
        : active === id 
          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] scale-[1.02]' 
          : 'bg-black/50 border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5 hover:text-white'
    }`}
  >
    {active === id && <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 blur-xl rounded-full"></div>}
    <div className={`${active === id ? 'text-emerald-500 bg-emerald-500/10' : 'text-gray-500 bg-white/5'} p-3 rounded-lg flex items-center justify-center transition-colors`}>
      {icon}
    </div>
    <span className="font-medium text-sm tracking-wide">{label}</span>
    {active === id && <FiCheckCircle className="absolute bottom-4 right-4 text-emerald-500 opacity-50" />}
  </div>
);
