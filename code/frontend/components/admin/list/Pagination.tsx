import { useCallback, useRef, useState } from 'react';

type Fetcher<T, P extends object> =
  (params: P & { page: number; limit: number }) =>
  Promise<{ data: T[]; page: number; limit: number; total: number }>;

export default function usePaginatedList<T, P extends object>(
  fetcher: Fetcher<T, P>,
  baseParams: P,
  limit = 20
) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const reachedEndRef = useRef(false);

  const load = useCallback(async (pageNum: number, append = false, params?: Partial<P>) => {
    setLoading(true);
    try {
      const merged = { ...baseParams, ...(params || {}) } as P;
      const res = await fetcher({ ...(merged as any), page: pageNum, limit });
      append ? setItems(prev => [...prev, ...res.data]) : setItems(res.data);
      setPage(res.page);
      setTotal(res.total);
      reachedEndRef.current = res.data.length < limit || (res.page * limit >= res.total);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetcher, baseParams, limit]);

  const refresh = useCallback(() => { setRefreshing(true); reachedEndRef.current = false; load(1, false); }, [load]);
  const loadMore = useCallback(() => { if (!loading && !reachedEndRef.current) load(page + 1, true); }, [loading, page, load]);

  return { items, page, total, loading, refreshing, load, refresh, loadMore };
}
