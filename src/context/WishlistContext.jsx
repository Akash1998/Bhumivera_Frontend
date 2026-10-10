import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { wishlist as wishlistApi } from '../services/api';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

const productIdOf = item => item?.product_id ?? item?.id ?? item?._id ?? item;

function readGuestWishlist() {
  try {
    const stored = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    console.error('[WISHLIST_GUEST_STORAGE]', error);
    localStorage.removeItem('guest_wishlist');
    return [];
  }
}

export function WishlistProvider({ children }) {
  const { user, token } = useAuth();
  const toast = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWishlistFromAPI = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await wishlistApi.get();
      const items = Array.isArray(data) ? data : data?.items || data?.wishlist || data?.data;
      if (!Array.isArray(items)) throw new Error('Unexpected wishlist response.');
      setWishlist(items);
    } catch (requestError) {
      console.error('[WISHLIST_FETCH]', requestError);
      setError(requestError.response?.data?.message || 'Could not load your saved products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && token) {
      fetchWishlistFromAPI();
    } else {
      setError('');
      setWishlist(readGuestWishlist());
      setLoading(false);
    }
  }, [user, token, fetchWishlistFromAPI]);

  const isWishlisted = useCallback(productId => {
    return wishlist.some(item => String(productIdOf(item)) === String(productId));
  }, [wishlist]);

  const removeFromWishlist = useCallback(async (productId, { notify = true } = {}) => {
    if (productId === undefined || productId === null) return false;
    if (user && token) {
      setWishlist(current => current.filter(item => String(productIdOf(item)) !== String(productId)));
      try {
        await wishlistApi.remove(productId, { notify });
        return true;
      } catch (requestError) {
        console.error('[WISHLIST_REMOVE]', requestError);
        await fetchWishlistFromAPI();
        if (notify) toast.error(requestError.response?.data?.message || 'Could not remove this product.');
        return false;
      }
    }
    const updated = wishlist.filter(item => String(productIdOf(item)) !== String(productId));
    try {
      localStorage.setItem('guest_wishlist', JSON.stringify(updated));
      setWishlist(updated);
      if (notify) toast.success('Product removed from your wishlist.');
    } catch (storageError) {
      console.error('[WISHLIST_GUEST_REMOVE]', storageError);
      toast.error('Could not remove this product from your wishlist.');
      return false;
    }
    return true;
  }, [wishlist, user, token, fetchWishlistFromAPI, toast]);

  const toggleWishlist = useCallback(async (product, { notify = true } = {}) => {
    const productId = productIdOf(product);
    if (productId === undefined || productId === null) {
      toast.error('This product cannot be saved right now.');
      return false;
    }
    if (isWishlisted(productId)) return removeFromWishlist(productId);

    if (user && token) {
      try {
        await wishlistApi.add(productId, { notify });
        setWishlist(current => current.some(item => String(productIdOf(item)) === String(productId)) ? current : [...current, product]);
        return true;
      } catch (requestError) {
        console.error('[WISHLIST_ADD]', requestError);
        toast.error(requestError.response?.data?.message || 'Could not save this product.');
        return false;
      }
    }

    const updated = [...wishlist, product];
    try {
      localStorage.setItem('guest_wishlist', JSON.stringify(updated));
      setWishlist(updated);
      if (notify) toast.success('Product added to your wishlist.');
    } catch (storageError) {
      console.error('[WISHLIST_GUEST_ADD]', storageError);
      toast.error('Could not save this product to your wishlist.');
      return false;
    }
    return true;
  }, [wishlist, user, token, isWishlisted, removeFromWishlist, toast]);

  const clearWishlist = useCallback(async () => {
    if (user && token) {
      const results = await Promise.all(wishlist.map(item => removeFromWishlist(productIdOf(item), { notify: false })));
      if (results.every(Boolean)) {
        toast.success('Wishlist cleared successfully.');
        return true;
      }
      toast.error('Some products could not be removed from your wishlist.');
      return false;
    }
    try {
      localStorage.removeItem('guest_wishlist');
      setWishlist([]);
      toast.success('Wishlist cleared successfully.');
    } catch (storageError) {
      console.error('[WISHLIST_GUEST_CLEAR]', storageError);
      toast.error('Could not clear your wishlist.');
      return false;
    }
    return true;
  }, [wishlist, user, token, removeFromWishlist, toast]);

  return (
    <WishlistContext.Provider value={{ wishlist, loading, error, isWishlisted, toggleWishlist, removeFromWishlist, clearWishlist, refreshWishlist: fetchWishlistFromAPI, count: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}

export default WishlistContext;
