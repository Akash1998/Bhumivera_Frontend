import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { wishlist as wishlistApi } from '../services/api';
import toast from 'react-hot-toast';

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

  const removeFromWishlist = useCallback(async productId => {
    if (productId === undefined || productId === null) return false;
    setWishlist(current => current.filter(item => String(productIdOf(item)) !== String(productId)));
    if (user && token) {
      try {
        await wishlistApi.remove(productId);
        return true;
      } catch (requestError) {
        console.error('[WISHLIST_REMOVE]', requestError);
        await fetchWishlistFromAPI();
        toast.error(requestError.response?.data?.message || 'Could not remove this product.');
        return false;
      }
    }
    const updated = wishlist.filter(item => String(productIdOf(item)) !== String(productId));
    localStorage.setItem('guest_wishlist', JSON.stringify(updated));
    return true;
  }, [wishlist, user, token, fetchWishlistFromAPI]);

  const toggleWishlist = useCallback(async product => {
    const productId = productIdOf(product);
    if (productId === undefined || productId === null) {
      toast.error('This product cannot be saved right now.');
      return false;
    }
    if (isWishlisted(productId)) return removeFromWishlist(productId);

    if (user && token) {
      try {
        await wishlistApi.add(productId);
        setWishlist(current => current.some(item => String(productIdOf(item)) === String(productId)) ? current : [...current, product]);
        return true;
      } catch (requestError) {
        console.error('[WISHLIST_ADD]', requestError);
        toast.error(requestError.response?.data?.message || 'Could not save this product.');
        return false;
      }
    }

    const updated = [...wishlist, product];
    setWishlist(updated);
    localStorage.setItem('guest_wishlist', JSON.stringify(updated));
    return true;
  }, [wishlist, user, token, isWishlisted, removeFromWishlist]);

  const clearWishlist = useCallback(async () => {
    if (user && token) {
      const results = await Promise.all(wishlist.map(item => removeFromWishlist(productIdOf(item))));
      return results.every(Boolean);
    }
    setWishlist([]);
    localStorage.removeItem('guest_wishlist');
    return true;
  }, [wishlist, user, token, removeFromWishlist]);

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
