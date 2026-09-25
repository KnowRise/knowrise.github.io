'use client';

import { useState } from 'react';

export function usePagination(pageSize: number) {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return {
    page,
    setPage,
    from,
    to,
    pageSize,
    total,
    setTotal,
    resetPage: () => setPage(1),
  };
}