import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Lock, Truck, CreditCard, CheckCircle, 
  Award, ArrowLeft, Tag, Info, AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: 'West Bengal',
    pincode: '',
    paymentMethod: 'cod' // default to COD
  });

  const [couponCode, setCouponCode] = useState('BHUMI17');
  const [appliedDiscount, setActiveDiscount] = useState(0.15); // 15% default applied coupon
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculations
  const subtotal = getCartTotal() || 499; // Fallback demo total if empty
  const discountAmount = Math.round(subtotal * appliedDiscount);
  const shippingFee = subtotal > 499 ? 0 : 50;
  const finalTotal = subtotal - discountAmount + shippingFee;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'BHUMI17') {
      setActiveDiscount(0.15);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid Coupon Code. Try BHUMI17');
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.phone || !formData.firstName || !formData.address || !formData.pincode) {
      setErrorMessage('Please fill in all mandatory contact and shipping fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        customer: formData,
        items: cartItems,
        subtotal,
        discount: discountAmount,
        shippingFee,
        totalAmount: finalTotal,
        paymentMethod: formData.paymentMethod
      };

      const res = await api.post('/orders/create', orderPayload);
      if (res.data && res.data.success) {
        clearCart();
        navigate('/order-success', { state: { orderId: res.data.orderId || 'ORD-2026-9812' } });
      } else {
        // Fallback demo redirect if backend API pending
        clearCart();
        navigate('/order-success', { state: { orderId: 'ORD-2026-9812' } });
      }
    } catch (err) {
      // Fallback demo success
      clearCart();
      navigate('/order-success', { state: { orderId: 'ORD-2026-9812' } });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header / Brand Bar */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-emerald-950 tracking-tight">BHUMIVERA</span>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">Est. 2009</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>256-Bit SSL Encrypted Express Checkout</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: EXPRESS CHECKOUT & SHIPPING FORM */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Express Checkout Options */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">Express 1-Click Checkout</p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                  className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <CreditCard className="w-4 h-4 text-amber-400" /> Pay via UPI / Razorpay
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                  className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Truck className="w-4 h-4" /> Cash On Delivery (COD)
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Contact Information */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center justify-between">
                  <span>1. Contact Information</span>
                  <span className="text-xs text-emerald-800 font-normal">Registered user? <Link to="/login" className="underline font-bold">Log in</Link></span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      placeholder="name@example.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Phone (For Order Updates) *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      placeholder="+91 98765 43210" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-base font-bold text-gray-900 mb-4">2. Shipping Address</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">First Name *</label>
                    <input 
                      type="text" 
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Street Address / House No. *</label>
                    <input 
                      type="text" 
                      name="address"
                      required
                      placeholder="House/Flat No., Road, Area"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                      <input 
                        type="text" 
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">State *</label>
                      <input 
                        type="text" 
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Pincode *</label>
                      <input 
                        type="text" 
                        name="pincode"
                        required
                        placeholder="700001"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-800 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-base font-bold text-gray-900 mb-4">3. Payment Option</h3>
                <div className="space-y-3">
                  <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${formData.paymentMethod === 'cod' ? 'border-emerald-800 bg-emerald-50/50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        className="text-emerald-800 focus:ring-emerald-800"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900">Cash On Delivery (COD)</p>
                        <p className="text-xs text-gray-500">Pay cash upon express courier arrival</p>
                      </div>
                    </div>
                    <Truck className="w-5 h-5 text-emerald-800" />
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${formData.paymentMethod === 'upi' ? 'border-emerald-800 bg-emerald-50/50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="upi"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={handleInputChange}
                        className="text-emerald-800 focus:ring-emerald-800"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900">Online Payment (UPI / GPay / Paytm / Cards)</p>
                        <p className="text-xs text-gray-500">Instant 100% secure payment Gateway</p>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-emerald-800" />
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black py-4 px-6 rounded-2xl shadow-xl transition-all text-base md:text-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Processing Order...' : `Complete Order • ₹${finalTotal}`}
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: STICKY ORDER SUMMARY DRAWER & TRUST ANCHORS */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold">{cartItems.length || 1} Item(s)</span>
              </h3>

              {/* Cart Items List */}
              <div className="space-y-4 max-h-60 overflow-y-auto mb-6 pr-1">
                {(cartItems.length > 0 ? cartItems : [{
                  id: 1,
                  name: "Multani Mitti Skin Glow Pack (200g)",
                  price: 499,
                  quantity: 1,
                  image: "/assets/images/multanimitti.webp"
                }]).map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image || '/assets/images/multanimitti.webp'} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=100&q=80'; }}
                      />
                      <div>
                        <p className="font-bold text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">₹{item.price * (item.quantity || 1)}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input 
                    type="text" 
                    placeholder="Discount Coupon" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs uppercase font-bold focus:ring-2 focus:ring-emerald-800 outline-none"
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-emerald-950 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-emerald-900 transition-colors"
                >
                  Apply
                </button>
              </form>

              {/* Totals Breakdown */}
              <div className="space-y-2 text-sm border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>17-Year Celebration Discount (15%)</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Express Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700 uppercase text-xs">FREE</strong> : `₹${shippingFee}`}</span>
                </div>

                <div className="flex justify-between text-base font-black text-gray-900 border-t border-gray-200 pt-3">
                  <span>Total Amount</span>
                  <span className="text-emerald-900">₹{finalTotal}</span>
                </div>
              </div>

              {/* Trust Guarantee Box */}
              <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/60 space-y-2 text-xs text-amber-950">
                <div className="flex items-center gap-2 font-bold">
                  <Award className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>17 Years Quality Promise</span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  100% Organic, zero synthetic chemicals. 30-Day Money-Back Guarantee if you are not satisfied with your skin glow.
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
