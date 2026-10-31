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

  useEffect(() => {
    let active = true;
    let timer;
    const load = async () => {
      try {
        const requestedIds = idsKey ? idsKey.split(',') : [];
        const chunks = [];
        for (let index = 0; index < requestedIds.length; index += 100) {
          chunks.push(requestedIds.slice(index, index + 100));
        }
        if (chunks.length === 0) chunks.push([]);
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
      }
    };
    load();
    timer = window.setInterval(load, 30_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [idsKey]);

  return { products, enabled, sampleActivityEnabled, error };
}
