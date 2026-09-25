'use client';
import { useEffect, useState } from 'react';
import { Loader2, FileText, ExternalLink, Award } from 'lucide-react';
import PaginationControls from '../components/PaginationControls';
import SearchInput from '../components/SearchInput';
import { usePagination } from '../hooks/usePagination';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { supabase } from '../lib/supabase';
import type { HkiEntry } from '../types';

const TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  patent: { label: 'Paten', icon: '⚙️' },
  copyright_creator: { label: 'Hak Cipta', icon: '🎨' },
  copyright_software: { label: 'Hak Cipta Perangkat Lunak', icon: '💻' },
  trademark: { label: 'Merek', icon: '🏷️' },
  industrial_design: { label: 'Desain Industri', icon: '📐' },
};

export default function Hki() {
  const [items, setItems] = useState<HkiEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const pg = usePagination(8);
  const debounced = useDebouncedValue(search, 350);

  useEffect(() => {
    if (pg.page !== 1) pg.resetPage();
  }, [debounced]);

  useEffect(() => { fetchData(); }, [pg.page, debounced]);

  async function fetchData() {
    setLoading(true);
    if (supabase) {
      let query: any = supabase.from('hki').select('*', { count: 'exact' });
      const term = debounced.trim();
      if (term) {
        const esc = term.replace(/[%_]/g, (m) => '\\' + m);
        query = query.or(`title.ilike.%${esc}%,type.ilike.%${esc}%,status.ilike.%${esc}%,holder.ilike.%${esc}%`);
      }
      const { data, count } = await query.order('sort_order', { ascending: true }).range(pg.from, pg.to);
      setItems((data || []) as HkiEntry[]);
      if (count !== null) pg.setTotal(count);
    } else {
      setItems([]);
      pg.setTotal(0);
    }
    setLoading(false);
  }

  const pageItems = items;

  return (
    <div className="py-14 page-in">
      <h1 className="text-3xl font-bold font-montserrat text-center mb-3" style={{ color: 'var(--text-primary)' }}>
        Hak Kekayaan Intelektual
      </h1>
      <p className="text-center mb-10 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Karya yang tercatat dan terlindungi secara hukum.
      </p>

      {!loading && (
        <div className="mb-8">
          <SearchInput value={search} onChange={setSearch} placeholder="Cari judul/tipe/status..." className="max-w-md mx-auto" />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--green)' }} /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
          <Award className="w-10 h-10 mx-auto mb-3" />
          {search.trim() ? <p>Tidak ada hasil untuk pencarian ini.</p> : <p>Belum ada catatan HKI untuk ditampilkan.</p>}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pageItems.map((item) => {
            const typeInfo = TYPE_LABELS[item.type] || { label: item.type, icon: '📄' };
            return (
              <div
                key={item.id}
                className="p-5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                data-aos="fade-up"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{typeInfo.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold font-montserrat" style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold mt-1" style={{ color: 'var(--green)' }}>
                      {typeInfo.label}
                      {item.status && ` · ${item.status}`}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-sm mb-4">
                  {item.registration_number && (
                    <p style={{ color: 'var(--text-secondary)' }}>
                      <span className="font-semibold">No. Pendaftaran:</span> {item.registration_number}
                    </p>
                  )}
                  {item.holder && (
                    <p style={{ color: 'var(--text-secondary)' }}>
                      <span className="font-semibold">Pemegang:</span> {item.holder}
                    </p>
                  )}
                  {item.grant_date && (
                    <p style={{ color: 'var(--text-secondary)' }}>
                      <span className="font-semibold">Tanggal:</span> {new Date(item.grant_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                  {item.description && (
                    <p className="pt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                  )}
                </div>

                {(item.document_url || item.url) && (
                  <div className="flex flex-wrap gap-3 text-sm font-semibold">
                    {item.document_url && (
                      <a href={item.document_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:opacity-80 transition-opacity" style={{ color: 'var(--green)' }}>
                        <FileText className="w-3.5 h-3.5" /> Dokumen
                      </a>
                    )}
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:opacity-80 transition-opacity" style={{ color: 'var(--green)' }}>
                        <ExternalLink className="w-3.5 h-3.5" /> Detail
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          </div>
          <PaginationControls page={pg.page} pageSize={pg.pageSize} total={pg.total} onChange={pg.setPage} />
        </div>
      )}
    </div>
  );
}