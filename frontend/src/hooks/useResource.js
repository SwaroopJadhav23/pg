import { useEffect, useState } from 'react';

export function useResource(loader, fallback) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(Boolean(loader));
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    if (!loader) return undefined;

    setLoading(true);
    loader()
      .then((payload) => {
        if (active) setData(payload);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || 'Showing demo data until backend data is available.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loader]);

  return { data, setData, loading, error };
}
