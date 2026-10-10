import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useSettings } from "./SettingsContext";
import { cart as cartApi } from "../services/api";
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); 
  const [cartAddEvent, setCartAddEvent] = useState(null);
  const [upsells, setUpsells] = useState([]); 
  const [rulePreview, setRulePreview] = useState(null);
  const [abandonment, setAbandonment] = useState(null);
  const [couponStackPolicy, setCouponStackPolicy] = useState('rule_first');
  const [rulePreviewLoading, setRulePreviewLoading] = useState(false);
  const previousRuleIds = useRef(null);
  const { isAuthenticated } = useAuth();
  const { settings } = useSettings();
  const toast = useToast();

  const loadCart = useCallback(async () => {
    if (isAuthenticated) {
      setCartLoading(true);
      setRulePreviewLoading(true);
      try {
        const res = await cartApi.get();
        const fetchedData = res.data?.items || res.data;
        setCart(Array.isArray(fetchedData) ? fetchedData : []);
        setRulePreview(res.data?.rulePreview || null);
        setAbandonment(res.data?.abandonment || null);
        setCouponStackPolicy(res.data?.couponStackPolicy || 'rule_first');
      } catch (err) {
        console.error("Cart sync failed:", err);
        setCart([]);
        setRulePreview(null);
        setAbandonment(null);
        setCouponStackPolicy('rule_first');
      } finally {
        setCartLoading(false);
        setRulePreviewLoading(false);
      }
    } else {
      try {
        const saved = localStorage.getItem("Bhumivera_guest_cart");
        const parsed = saved ? JSON.parse(saved) : [];
        setCart(Array.isArray(parsed) ? parsed : []);
        setRulePreview(null);
        setAbandonment(null);
        setCouponStackPolicy('rule_first');
      } catch (e) {
        console.error("Local cart parse failed:", e);
        setCart([]);
      }
    }
  }, [isAuthenticated]);

  const saveGuestCart = (nextCart, failureMessage) => {
    try {
      localStorage.setItem("Bhumivera_guest_cart", JSON.stringify(nextCart));
      setCart(nextCart);
      return true;
    } catch (error) {
      console.error("Guest cart update failed:", error);
      toast.error(failureMessage);
      return false;
    }
  };

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // ZERO-LATENCY OPTIMISTIC UPDATE
  const addToCart = async (product, qty = 1) => {
    const prodId = product._id || product.id;
    
    const addProduct = prev => {
      const safeCart = Array.isArray(prev) ? prev : [];
      const updated = [...safeCart];
      const idx = updated.findIndex(i => String(i.product_id || i.id) === String(prodId));
      if (idx > -1) updated[idx] = { ...updated[idx], quantity: (Number(updated[idx].quantity) || 0) + qty };
      else updated.push({ product_id: prodId, id: prodId, product, quantity: qty });
      return updated;
    };

    if (isAuthenticated) setCart(prev => addProduct(prev));
    else if (!saveGuestCart(addProduct(cart), 'Could not add this product to your cart.')) return false;

    setIsCartOpen(true);

    if (product.category === 'Lights' || product.category_name === 'Lights') {
      setUpsells([{ _id: 'rel_1', name: 'Heavy Duty Wiring Relay', price: 499, img: '/logo.webp' }]);
    }

    // 3. Background DB Sync
    if (isAuthenticated) {
      try {
        await cartApi.add({ productId: prodId, quantity: qty });
        await loadCart(); // Re-sync to assure accuracy
        setCartAddEvent({ id: Date.now(), productName: product.name || 'your selection' });
        toast.success('Added to cart successfully.');
        return true;
      } catch (err) {
        console.error("Failed to sync cart add to DB, reverting state", err);
        await loadCart(); // Auto-revert if offline/error
        toast.error(err.normalized?.message || 'Could not add this product to your cart.');
        return false;
      }
    }
    setCartAddEvent({ id: Date.now(), productName: product.name || 'your selection' });
    toast.success('Added to cart successfully.');
    return true;
  };

  const updateQuantity = async (productId, newQty, { notify = true } = {}) => {
    if (newQty < 1) return removeFromCart(productId);
    
    // Optimistic Update
    const update = prev => {
      const safeCart = Array.isArray(prev) ? prev : [];
      const updated = [...safeCart];
      const idx = updated.findIndex(i => String(i.product_id || i.id) === String(productId));
      if (idx > -1) updated[idx] = { ...updated[idx], quantity: newQty };
      return updated;
    };
    if (isAuthenticated) setCart(prev => update(prev));
    else if (!saveGuestCart(update(cart), 'Could not update the cart quantity.')) return false;
    
    if (isAuthenticated) {
      try {
        await cartApi.updateQuantity(productId, newQty, { notify });
        await loadCart();
      } catch (err) {
        console.error("Quantity update failed", err);
        await loadCart();
        toast.error(err.normalized?.message || 'Could not update the cart quantity.');
        return false;
      }
    } else {
      if (notify) toast.success('Cart quantity updated successfully.');
    }
    return true;
  };

  const removeFromCart = async (id, { notify = true } = {}) => {
    // Optimistic Update
    const remove = prev => {
      const safeCart = Array.isArray(prev) ? prev : [];
      const updated = safeCart.filter(i => String(i.product_id || i.id) !== String(id));
      return updated;
    };
    if (isAuthenticated) setCart(prev => remove(prev));
    else if (!saveGuestCart(remove(cart), 'Could not remove this item from your cart.')) return false;

    if (isAuthenticated) {
      try {
        await cartApi.remove(id, { notify });
        await loadCart();
      } catch (err) {
        console.error("Remove failed", err);
        await loadCart();
        toast.error(err.normalized?.message || 'Could not remove this item from your cart.');
        return false;
      }
    } else {
      if (notify) toast.success('Item removed from your cart.');
    }
    return true;
  };
  
  const clearCart = async () => {
    const previousCart = cart;
    try {
      if (isAuthenticated) {
        setCart([]);
        await cartApi.clear();
      } else {
        localStorage.removeItem("Bhumivera_guest_cart");
        setCart([]);
      }
      toast.success('Cart cleared successfully.');
      return true;
    } catch (err) {
      setCart(previousCart);
      toast.error(err.normalized?.message || 'Could not clear your cart.');
      return false;
    }
  };

  const getSubtotal = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((acc, item) => {
      const p = item.product || item;
      const price = p.discount_price || p.price || item.unit_price || 0;
      return acc + (price * (item.quantity || 1));
    }, 0);
  };

  useEffect(() => {
    if (!rulePreview) return;
    const currentIds = new Set((rulePreview.matchedRuleIds || []).map(String));
    if (previousRuleIds.current) {
      const newlyUnlocked = (rulePreview.matchedRules || []).filter(rule => currentIds.has(String(rule.id)) && !previousRuleIds.current.has(String(rule.id)));
      newlyUnlocked.forEach(rule => toast.success(`🎉 You unlocked ${rule.badge_text || rule.name}`));
    }
    previousRuleIds.current = currentIds;
  }, [rulePreview, toast]);
  
  const rawThreshold = settings?.free_shipping_threshold;
  const parsedThreshold = Number(rawThreshold);
  const freeShippingThreshold = rawThreshold !== null && rawThreshold !== undefined && rawThreshold !== '' && Number.isFinite(parsedThreshold)
    ? parsedThreshold
    : 5000;
  const shippingProgress = freeShippingThreshold > 0
    ? Math.min((getSubtotal() / freeShippingThreshold) * 100, 100)
    : 100;

  return (
    <CartContext.Provider value={{ 
      cartItems: Array.isArray(cart) ? cart : [], 
      loading: cartLoading, 
      isCartOpen, 
      setIsCartOpen,
      cartAddEvent,
      addToCart, 
      updateQuantity, 
      removeFromCart,
      clearCart,
      upsells,
      getSubtotal,
      shippingProgress,
      freeShippingThreshold,
      rulePreview,
      couponStackPolicy,
      rulePreviewLoading,
      abandonment,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
