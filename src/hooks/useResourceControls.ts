'use client';

import { useCallback, useState } from 'react';

export type OrderDir = 'asc' | 'desc';

export function useResourceControls(initialDir: OrderDir = 'asc') {
  const [search, setSearch] = useState('');
  const [orderDir, setOrderDir] = useState<OrderDir>(initialDir);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleOrder = useCallback(() => {
    setOrderDir(d => (d === 'asc' ? 'desc' : 'asc'));
  }, []);

  const toggleSelected = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectMany = useCallback((ids: string[]) => {
    setSelected(prev => {
      const next = new Set(prev);
      for (const id of ids) next.add(id);
      return next;
    });
  }, []);

  const deselectMany = useCallback((ids: string[]) => {
    setSelected(prev => {
      const next = new Set(prev);
      for (const id of ids) next.delete(id);
      return next;
    });
  }, []);

  const toggleMany = useCallback((ids: string[]) => {
    setSelected(prev => {
      const next = new Set(prev);
      const allSelected = ids.every(id => next.has(id));
      if (allSelected) for (const id of ids) next.delete(id);
      else for (const id of ids) next.add(id);
      return next;
    });
  }, []);

  const setSelectedIds = useCallback((ids: string[]) => setSelected(new Set(ids)), []);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  const isSelected = useCallback((id: string) => selected.has(id), [selected]);

  return { search, setSearch, orderDir, toggleOrder, selected, toggleSelected, selectMany, deselectMany, toggleMany, setSelectedIds, clearSelection, isSelected };
}