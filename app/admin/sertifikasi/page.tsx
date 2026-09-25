'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '../../../src/components/AdminSidebar';
import AdminToast from '../../../src/components/AdminToast';
import FileUploader from '../../../src/components/FileUploader';
import { supabase } from '../../../src/lib/supabase';
import type { Certification } from '../../../src/types';
import { usePagination } from '../../../src/hooks/usePagination';
import { useDebouncedValue } from '../../../src/hooks/useDebouncedValue';
import { useResourceControls } from '../../../src/hooks/useResourceControls';
import { bulkDeleteByIds } from '../../../src/lib/bulkDelete';
import PaginationControls from '../../../src/components/PaginationControls';
import AdminListToolbar from '../../../src/components/AdminListToolbar';
import { Plus, Trash2, ArrowUpDown, Loader2, ChevronDown, ChevronRight, FileText, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function CertificationsAdmin() {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'loading'|null}>({ msg: '', type: null });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const pg = usePagination(12);
  const ctl = useResourceControls();
  const orderDir = ctl.orderDir;
  const debouncedSearch = useDebouncedValue(ctl.search, 350);

  useEffect(() => {
    if (pg.page !== 1) pg.resetPage();
  }, [debouncedSearch, orderDir]);

  useEffect(() => { fetchData(); }, [pg.page, debouncedSearch, orderDir]);

  async function fetchData() {
    if (!supabase) return;
    setLoading(true);
    let query: any = supabase.from('certifications').select('*', { count: 'exact' });
    const term = debouncedSearch.trim();
    if (term) {
      const esc = term.replace(/[%_]/g, (m) => '\\' + m);
      query = query.or(`title.ilike.%${esc}%,issuer.ilike.%${esc}%`);
    }
    const { data, count } = await query
      .order('sort_order', { ascending: orderDir === 'asc' })
      .range(pg.from, pg.to);
    setItems(data || []);
    if (count !== null) pg.setTotal(count);
    setLoading(false);
  }

  const handleAdd = async () => {
    if (!supabase) return;
    const newSortOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order)) + 1 : 1;
    const { data, error } = await supabase.from('certifications').insert([{
      title: 'New Certification',
      issuer: 'Issuer',
      sort_order: newSortOrder
    }]).select().single();
    if (!error && data) {
      setExpandedId(data.id);
      if (pg.page === 1) fetchData();
      else pg.setPage(1);
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm('Hapus sertifikasi ini?')) return;
    const { error } = await supabase.from('certifications').delete().eq('id', id);
    if (!error) {
      if (items.length === 1 && pg.page > 1) {
        pg.setPage(pg.page - 1);
      } else {
        setItems(items.filter(i => i.id !== id));
        pg.setTotal(Math.max(0, pg.total - 1));
      }
    }
  };

  const handleBulkDelete = async () => {
    const ids = [...ctl.selected];
    if (!supabase || ids.length === 0) return;
    if (!confirm(`Hapus ${ids.length} sertifikasi?`)) return;
    const { error } = await bulkDeleteByIds(supabase, 'certifications', ids);
    if (!error) {
      ctl.clearSelection();
      setItems(items.filter(i => !ids.includes(i.id)));
      const remaining = Math.max(0, pg.total - ids.length);
      if (items.length > 0 && items.every(i => ids.includes(i.id)) && pg.page > 1) {
        pg.setPage(pg.page - 1);
      } else {
        pg.setTotal(remaining);
      }
      setToast({ msg: `Terhapus ${ids.length}`, type: 'success' });
      setTimeout(() => setToast({ msg: '', type: null }), 2000);
    } else {
      setToast({ msg: 'Gagal menghapus', type: 'error' });
      setTimeout(() => setToast({ msg: '', type: null }), 2000);
    }
  };

  const handleSelectAll = async () => {
    if (!supabase || pg.total === 0) return;
    if (ctl.selected.size >= pg.total && pg.total > 0) {
      ctl.clearSelection();
      return;
    }
    let query: any = supabase.from('certifications').select('id');
    const term = debouncedSearch.trim();
    if (term) {
      const esc = term.replace(/[%_]/g, (m) => '\\' + m);
      query = query.or(`title.ilike.%${esc}%,issuer.ilike.%${esc}%`);
    }
    const { data } = await query;
    if (data) ctl.setSelectedIds((data as { id: string }[]).map((r) => r.id));
  };

  const saveChanges = async (id: string, updates: Partial<Certification>) => {
    if (!supabase) return;
    setToast({ msg: 'Menyimpan...', type: 'loading' });
    const { error } = await supabase.from('certifications').update(updates).eq('id', id);
    if (error) setToast({ msg: 'Gagal menyimpan', type: 'error' });
    else {
      setToast({ msg: 'Tersimpan!', type: 'success' });
      setItems(items.map(i => i.id === id ? { ...i, ...updates } : i));
    }
    setTimeout(() => setToast({ msg: '', type: null }), 2000);
  };

  const patch = (id: string, key: keyof Certification, value: unknown) =>
    setItems(items.map(i => i.id === id ? { ...i, [key]: value } as Certification : i));

  const inputCls = "w-full px-2 py-1.5 rounded border bg-transparent text-sm";
  const labelCls = "text-[10px] uppercase font-bold text-(--text-muted) tracking-wider";

  return (
    <AdminSidebar>
      <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: null })} />
      <div className="animate-in fade-in duration-500 space-y-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold font-montserrat">Sertifikasi</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Kelola sertifikat keahlian dan link verifikasinya.</p>
          </div>
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-(--btn-active) text-(--btn-active-text) hover:opacity-90 font-bold transition-opacity">
            <Plus className="w-5 h-5" /> Add Certification
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-(--green)" /></div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center border rounded-2xl" style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
            {ctl.search.trim() ? `Tidak ada hasil untuk "${ctl.search}".` : 'Belum ada sertifikasi.'}
          </div>
        ) : (
          <div className="space-y-3">
            <AdminListToolbar
              placeholder="Cari sertifikasi (judul/issuer)..."
              search={ctl.search}
              onSearch={ctl.setSearch}
              selectedCount={ctl.selected.size}
              onDeleteSelected={handleBulkDelete}
              onSelectPage={() => ctl.toggleMany(items.map(i => i.id))}
              onSelectAll={handleSelectAll}
              selectAllTotal={pg.total}
              onClearSelection={ctl.clearSelection}
            />
            {items.map(item => {
              const isExpanded = expandedId === item.id;
              return (
              <div key={item.id} className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: ctl.isSelected(item.id) ? 'var(--green)' : 'var(--card-border)', boxShadow: ctl.isSelected(item.id) ? '0 0 0 1px var(--green)' : 'none' }}>

                {/* Header (collapsed view) */}
                <div className="flex items-center gap-3 p-3 cursor-pointer" style={{ background: 'var(--bg-base)' }} onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button, input, a, label')) return;
                  ctl.toggleSelected(item.id);
                }}>
                  <input
                    type="checkbox" aria-label={`Select ${item.title}`}
                    checked={ctl.isSelected(item.id)}
                    onChange={() => ctl.toggleSelected(item.id)}
                    className="w-4 h-4 shrink-0 accent-(--green)"
                  />
                  <button onClick={() => setExpandedId(isExpanded ? null : item.id)} className="p-1 hover:bg-black/5 rounded">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>

                  <div className="flex flex-col gap-1 w-20 shrink-0">
                    <button type="button" onClick={ctl.toggleOrder} title="Ubah urutan (asc/desc)"
                      className={labelCls + " flex items-center gap-1 hover:text-(--text-primary)"}>
                      <ArrowUpDown className="w-3 h-3" /> Order {orderDir === 'asc' ? '↑' : '↓'}
                    </button>
                    <input type="number" className={inputCls} style={{ borderColor: 'var(--input-border)' }}
                      value={item.sort_order} onChange={e => patch(item.id, 'sort_order', Number(e.target.value))}
                      onBlur={e => saveChanges(item.id, { sort_order: Number(e.target.value) })} />
                  </div>

                  <div className="w-14 h-10 rounded-md overflow-hidden relative shrink-0 border flex items-center justify-center" style={{ borderColor: 'var(--card-border)', background: 'var(--tag-bg)' }}>
                    {item.image_url ? (
                      /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(item.image_url) ? (
                        <Image src={item.image_url} alt={item.title} fill sizes="56px" className="object-cover" />
                      ) : (
                        <FileText className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      )
                    ) : (
                      <ImageIcon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{item.title}</div>
                    <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{item.issuer}</div>
                    {item.issue_date && (
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.issue_date}</div>
                    )}
                  </div>

                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Expanded: edit fields */}
                {isExpanded && (
                  <div className="p-4 border-t space-y-3" style={{ borderColor: 'var(--card-border)' }}>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-40 shrink-0">
                        <FileUploader
                          folder="certifications"
                          compact
                          accept="image/png,image/jpeg,image/webp,.pdf"
                          label="File Sertifikat"
                          hint="jpeg/png/webp atau PDF, max 5MB"
                          value={item.image_url || ''}
                          onChange={(url) => saveChanges(item.id, { image_url: url })}
                        />
                      </div>

                      <div className="flex-1 space-y-3">
                        <input type="text" placeholder="Title" className={`${inputCls} font-bold`} style={{ borderColor: 'var(--input-border)' }}
                          value={item.title} onChange={e => patch(item.id, 'title', e.target.value)}
                          onBlur={e => saveChanges(item.id, { title: e.target.value })} />
                        <input type="text" placeholder="Issuer (Dicoding, BNSP, dsb.)" className={inputCls} style={{ borderColor: 'var(--input-border)' }}
                          value={item.issuer} onChange={e => patch(item.id, 'issuer', e.target.value)}
                          onBlur={e => saveChanges(item.id, { issuer: e.target.value })} />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className={labelCls}>Tanggal Terbit</label>
                            <input type="date" className={inputCls} style={{ borderColor: 'var(--input-border)' }}
                              value={item.issue_date || ''} onChange={e => patch(item.id, 'issue_date', e.target.value || null)}
                              onBlur={e => saveChanges(item.id, { issue_date: e.target.value || null })} />
                          </div>
                          <div>
                            <label className={labelCls}>Kedaluwarsa (opsional)</label>
                            <input type="date" className={inputCls} style={{ borderColor: 'var(--input-border)' }}
                              value={item.expiration_date || ''} onChange={e => patch(item.id, 'expiration_date', e.target.value || null)}
                              onBlur={e => saveChanges(item.id, { expiration_date: e.target.value || null })} />
                          </div>
                          <div>
                            <label className={labelCls}>Credential ID</label>
                            <input type="text" className={inputCls} style={{ borderColor: 'var(--input-border)' }}
                              value={item.credential_id || ''} onChange={e => patch(item.id, 'credential_id', e.target.value)}
                              onBlur={e => saveChanges(item.id, { credential_id: e.target.value })} />
                          </div>
                          <div>
                            <label className={labelCls}>Link Verifikasi</label>
                            <input type="url" className={inputCls} style={{ borderColor: 'var(--input-border)' }}
                              value={item.credential_url || ''} onChange={e => patch(item.id, 'credential_url', e.target.value)}
                              onBlur={e => saveChanges(item.id, { credential_url: e.target.value })} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )}
          <PaginationControls page={pg.page} pageSize={pg.pageSize} total={pg.total} onChange={pg.setPage} />
      </div>
    </AdminSidebar>
  );
}