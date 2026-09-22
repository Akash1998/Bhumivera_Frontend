import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { cart as cartApi } from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); 
  const [upsells, setUpsells] = useState([]); 
  const { isAuthenticated } = useAuth();

  const loadCart = useCallback(async () => {
    if (isAuthenticated) {
      setCartLoading(true);
      try {
        const res = await cartApi.get();
        const fetchedData = res.data?.items || res.data;
        setCart(Array.isArray(fetchedData) ? fetchedData : []);
      } catch (err) {
        console.error("Cart sync failed:", err);
        setCart([]);
      } finally {
        setCartLoading(false);
      }
    } else {
      try {
        const saved = localStorage.getItem("Bhumivera_guest_cart");
        const parsed = saved ? JSON.parse(saved) : [];
        setCart(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error("Local cart parse failed:", e);
        setCart([]);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // ZERO-LATENCY OPTIMISTIC UPDATE
  const addToCart = async (product, qty = 1) => {
    const prodId = product._id || product.id;
    
    // 1. Immediately open sidebar
    setIsCartOpen(true); 
    
    // 2. Immediately update local state without waiting for DB
    setCart(prev => {
      const safeCart = Array.isArray(prev) ? prev : [];
      const updated = [...safeCart];
      const idx = updated.findIndex(i => i.product_id === prodId || i.id === prodId);
      if (idx > -1) updated[idx].quantity += qty;
      else updated.push({ product_id: prodId, id: prodId, product, quantity: qty });
      
      if (!isAuthenticated) localStorage.setItem("Bhumivera_guest_cart", JSON.stringify(updated));
      return updated;
    });

    if (product.category === 'Lights' || product.category_name === 'Lights') {
      setUpsells([{ _id: 'rel_1', name: 'Heavy Duty Wiring Relay', price: 499, img: '/logo.webp' }]);
    }

    // 3. Background DB Sync
    if (isAuthenticated) {
      try {
        await cartApi.add({ productId: prodId, quantity: qty });
        await loadCart(); // Re-sync to assure accuracy
      } catch (err) {
        console.error("Failed to sync cart add to DB, reverting state", err);
        await loadCart(); // Auto-revert if offline/error
      }
    }
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return removeFromCart(productId);
    
    // Optimistic Update
    setCart(prev => {
      const safeCart = Array.isArray(prev) ? prev : [];
      const updated = [...safeCart];
      const idx = updated.findIndex(i => i.product_id === productId || i.id === productId);
      if (idx > -1) updated[idx].quantity = newQty;
      if (!isAuthenticated) localStorage.setItem("Bhumivera_guest_cart", JSON.stringify(updated));
      return updated;
    });
    
    if (isAuthenticated) {
      try {
        await cartApi.updateQuantity(productId, newQty);
        await loadCart();
      } catch (err) {
        console.error("Quantity update failed", err);
        await loadCart();
      }
    }
  };

  const removeFromCart = async (id) => {
    // Optimistic Update
    setCart(prev => {
      const safeCart = Array.isArray(prev) ? prev : [];
      const updated = safeCart.filter(i => i.product_id !== id && i.id !== id);
      if (!isAuthenticated) localStorage.setItem("Bhumivera_guest_cart", JSON.stringify(updated));
      return updated;
    });

    if (isAuthenticated) {
      try {
        await cartApi.remove(id);
        await loadCart();
      } catch (err) {
        console.error("Remove failed", err);
        await loadCart();
      }
    }
  };
  
  const clearCart = async () => {
    setCart([]); // Optimistic
    if (isAuthenticated) {
      await cartApi.clear();
    } else {
      localStorage.removeItem("Bhumivera_guest_cart");
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
  
  const freeShippingThreshold = 5000;
  const shippingProgress = Math.min((getSubtotal() / freeShippingThreshold) * 100, 100);

  return (
    <CartContext.Provider value={{ 
      cartItems: Array.isArray(cart) ? cart : [], 
      loading: cartLoading, 
      isCartOpen, 
      setIsCartOpen,
      addToCart, 
      updateQuantity, 
      removeFromCart,
      clearCart,
      upsells,
      getSubtotal,
      shippingProgress,
      freeShippingThreshold,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
