'use client';

import { CheckCheck, ListChecks, Trash2, X } from 'lucide-react';
import SearchInput from './SearchInput';

interface Props {
  placeholder: string;
  search: string;
  onSearch: (v: string) => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  onSelectPage?: () => void;
  onSelectAll?: () => void;
  selectAllTotal?: number;
  onClearSelection?: () => void;
  children?: React.ReactNode;
}

export default function AdminListToolbar({
  placeholder,
  search,
  onSearch,
  selectedCount,
  onDeleteSelected,
  onSelectPage,
  onSelectAll,
  selectAllTotal,
  onClearSelection,
  children,
}: Props) {
  const selBtnCls =
    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap cursor-pointer';
  const selIdle = {
    background: 'var(--btn-inactive)',
    borderColor: 'var(--card-border)',
    color: 'var(--text-secondary)',
  };
  const selActive = {
    background: 'rgba(74, 222, 128, 0.1)',
    borderColor: 'var(--green)',
    color: 'var(--green)',
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center mb-4">
      <div className="flex-1 min-w-[220px]">
        <SearchInput value={search} onChange={onSearch} placeholder={placeholder} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {onSelectPage && (
          <button className={selBtnCls} style={selIdle} onClick={onSelectPage} title="Pilih semua item di halaman ini">
            <ListChecks className="w-4 h-4" /> Select page
          </button>
        )}
        {onSelectAll && (
          <button className={selBtnCls} style={selActive} onClick={onSelectAll} title="Pilih semua sesuai pencarian/filter">
            <CheckCheck className="w-4 h-4" /> Select all {typeof selectAllTotal === 'number' && `(${selectAllTotal})`}
          </button>
        )}
        {children}
        {selectedCount > 0 && onClearSelection && (
          <button
            onClick={onClearSelection}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap hover:border-(--text-muted)"
            style={{ background: 'var(--btn-inactive)', borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}
            title="Bersihkan pilihan"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        )}
        {selectedCount > 0 && (
          <button
            onClick={onDeleteSelected}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4" /> Delete ({selectedCount})
          </button>
        )}
      </div>
    </div>
  );
}