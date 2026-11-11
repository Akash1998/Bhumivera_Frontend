import { useEffect, useMemo, useState } from 'react';
import { scarcitySimulator } from '../services/api';

export default function useScarcitySimulator(productIds = []) {
  const idsKey = useMemo(
    () => [...new Set(productIds.map(String).filter(id => /^\d+$/.test(id)))].join(','),
    [productIds]
  );
  const [products, setProducts] = useState({});
  const [enabled, setEnabled] = useState(false);
  const [sampleActivityEnabled, setSampleActivityEnabled] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const requestedIds = idsKey ? idsKey.split(',') : [];
      if (requestedIds.length === 0) {
        setProducts({});
        setEnabled(false);
        setSampleActivityEnabled(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const chunks = [];
        for (let index = 0; index < requestedIds.length; index += 100) {
          chunks.push(requestedIds.slice(index, index + 100));
        }
        const responses = await Promise.all(chunks.map(ids => scarcitySimulator.getPublic(ids)));
        const data = responses[0]?.data || {};
        if (!active) return;
        setProducts(Object.assign({}, ...responses.map(response => response.data?.products || {})));
        setEnabled(data?.enabled === true);
        setSampleActivityEnabled(data?.sampleActivityEnabled === true);
        setError('');
      } catch {
        if (active) {
          setProducts({});
          setEnabled(false);
          setSampleActivityEnabled(false);
          setError('');
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    const handleFocus = () => {
      if (!document.hidden) load();
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      active = false;
      window.removeEventListener('focus', handleFocus);
    };
  }, [idsKey]);

  return { products, enabled, sampleActivityEnabled, error, loading };
}
