'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '../../../src/components/AdminSidebar';
import { supabase } from '../../../src/lib/supabase';
import type { BlogPost } from '../../../src/types';
import { usePagination } from '../../../src/hooks/usePagination';
import { useDebouncedValue } from '../../../src/hooks/useDebouncedValue';
import { useResourceControls } from '../../../src/hooks/useResourceControls';
import { bulkDeleteByIds } from '../../../src/lib/bulkDelete';
import PaginationControls from '../../../src/components/PaginationControls';
import AdminListToolbar from '../../../src/components/AdminListToolbar';
import { Plus, Trash2, Edit, Loader2, CheckCircle, Clock, ArrowUpDown, ChevronDown, ChevronRight, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogAdmin() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const pg = usePagination(12);
  const ctl = useResourceControls('desc');
  const orderDir = ctl.orderDir;
  const debouncedSearch = useDebouncedValue(ctl.search, 350);

  useEffect(() => {
    if (pg.page !== 1) pg.resetPage();
  }, [debouncedSearch, orderDir]);

  useEffect(() => { fetchBlogs(); }, [pg.page, debouncedSearch, orderDir]);

  async function fetchBlogs() {
    if (!supabase) return;
    setLoading(true);
    let query: any = supabase.from('blogs').select('*', { count: 'exact' });
    const term = debouncedSearch.trim();
    if (term) {
      const esc = term.replace(/[%_]/g, (m) => '\\' + m);
      query = query.or(`title.ilike.%${esc}%,excerpt.ilike.%${esc}%`);
    }
    const { data, count } = await query
      .order('created_at', { ascending: orderDir === 'asc' })
      .range(pg.from, pg.to);
    setBlogs(data || []);
    if (count !== null) pg.setTotal(count);
    setLoading(false);
  }

  const handleDelete = async (id: string, title: string) => {
    if (!supabase || !confirm(`Are you sure you want to delete the post: "${title}"?`)) return;
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (!error) {
      if (blogs.length === 1 && pg.page > 1) {
        pg.setPage(pg.page - 1);
      } else {
        setBlogs(blogs.filter(b => b.id !== id));
        pg.setTotal(Math.max(0, pg.total - 1));
      }
    }
  };

  const handleBulkDelete = async () => {
    const ids = [...ctl.selected];
    if (!supabase || ids.length === 0) return;
    if (!confirm(`Delete ${ids.length} post(s)?`)) return;
    const { error } = await bulkDeleteByIds(supabase, 'blogs', ids);
    if (!error) {
      ctl.clearSelection();
      setBlogs(blogs.filter(b => !ids.includes(b.id)));
      const remaining = Math.max(0, pg.total - ids.length);
      if (blogs.length > 0 && blogs.every(b => ids.includes(b.id)) && pg.page > 1) {
        pg.setPage(pg.page - 1);
      } else {
        pg.setTotal(remaining);
      }
    }
  };

  const handleSelectAll = async () => {
    if (!supabase || pg.total === 0) return;
    if (ctl.selected.size >= pg.total && pg.total > 0) {
      ctl.clearSelection();
      return;
    }
    let query: any = supabase.from('blogs').select('id');
    const term = debouncedSearch.trim();
    if (term) {
      const esc = term.replace(/[%_]/g, (m) => '\\' + m);
      query = query.or(`title.ilike.%${esc}%,excerpt.ilike.%${esc}%`);
    }
    const { data } = await query;
    if (data) ctl.setSelectedIds((data as { id: string }[]).map((r) => r.id));
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    if (!supabase) return;
    const newStatus = !currentStatus;
    const updates = { 
      is_published: newStatus,
      published_at: newStatus ? new Date().toISOString() : null
    };
    
    const { error } = await supabase.from('blogs').update(updates).eq('id', id);
    if (!error) {
      setBlogs(blogs.map(b => b.id === id ? { ...b, ...updates } : b));
    }
  };

  return (
    <AdminSidebar>
       <div className="animate-in fade-in duration-500 space-y-8">
          <header className="flex justify-between items-center">
             <div>
               <h1 className="text-2xl font-bold font-montserrat">Blog Management</h1>
               <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Write and publish markdown articles.</p>
             </div>
             {/* Note: In a real app we'd route this to a specific editor page like /admin/blog/new */}
             <Link href="/admin/blog/editor" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-(--btn-active) text-(--btn-active-text) hover:opacity-90 font-bold transition-opacity">
               <Plus className="w-5 h-5" /> Write New Post
             </Link>
          </header>

          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-(--green)" /></div>
          ) : blogs.length === 0 ? (
             <div className="p-10 text-center border rounded-2xl" style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
               {ctl.search.trim() ? `Tidak ada hasil untuk "${ctl.search}".` : 'No blog posts written yet. Start your journey!'}
             </div>
          ) : (
            <div className="space-y-3">
              <AdminListToolbar
                placeholder="Cari postingan (judul/ekscerpt)..."
                search={ctl.search}
                onSearch={ctl.setSearch}
                selectedCount={ctl.selected.size}
                onDeleteSelected={handleBulkDelete}
                onSelectPage={() => ctl.toggleMany(blogs.map(b => b.id))}
                onSelectAll={handleSelectAll}
                selectAllTotal={pg.total}
                onClearSelection={ctl.clearSelection}
              >
                <button
                  type="button"
                  onClick={ctl.toggleOrder}
                  title="Ubah urutan tanggal (asc/desc)"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-semibold transition-colors hover:opacity-80 whitespace-nowrap"
                  style={{ borderColor: 'var(--input-border)', background: 'var(--card-bg)', color: 'var(--text-secondary)' }}
                >
                  <ArrowUpDown className="w-4 h-4" /> {orderDir === 'desc' ? 'Terbaru' : 'Terlama'}
                </button>
              </AdminListToolbar>
              {blogs.map(post => {
                const isExpanded = expandedId === post.id;
                const fmt = (d: string | null) => d
                  ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '—';
                return (
                <div key={post.id} className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: ctl.isSelected(post.id) ? 'var(--green)' : 'var(--card-border)', boxShadow: ctl.isSelected(post.id) ? '0 0 0 1px var(--green)' : 'none' }}>

                  {/* Header (collapsed view) */}
                  <div className="flex items-center gap-3 p-3 cursor-pointer" style={{ background: 'var(--bg-base)' }} onClick={(e) => {
                    if ((e.target as HTMLElement).closest('button, input, a, label')) return;
                    ctl.toggleSelected(post.id);
                  }}>
                    <input
                      type="checkbox" aria-label={`Select ${post.title}`}
                      checked={ctl.isSelected(post.id)}
                      onChange={() => ctl.toggleSelected(post.id)}
                      className="w-4 h-4 shrink-0 accent-(--green)"
                    />
                    <button onClick={() => setExpandedId(isExpanded ? null : post.id)} className="p-1 hover:bg-black/5 rounded">
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>

                    <div className="w-14 h-10 rounded-md overflow-hidden relative shrink-0 border flex items-center justify-center" style={{ borderColor: 'var(--card-border)', background: 'var(--tag-bg)' }}>
                      {post.cover_url ? (
                        <Image src={post.cover_url} alt={post.title} fill sizes="56px" className="object-cover" />
                      ) : (
                        <ImageIcon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate">{post.title}</div>
                      <div className="text-xs flex items-center gap-2 mt-0.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                            post.is_published ? 'bg-green-500 text-white' : 'bg-yellow-500 text-yellow-950'
                          }`}
                        >
                          {post.is_published ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {post.is_published ? 'Published' : 'Draft'}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>{fmt(post.created_at)}</span>
                      </div>
                    </div>

                    <button onClick={() => handleDelete(post.id, post.title)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Expanded: detail + actions */}
                  {isExpanded && (
                    <div className="p-4 border-t space-y-4" style={{ borderColor: 'var(--card-border)' }}>
                      <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                        {post.excerpt || 'No excerpt provided...'}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <div>
                          <div className="font-bold uppercase text-[10px] tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Slug</div>
                          <span className="font-mono">/{post.slug}</span>
                        </div>
                        <div>
                          <div className="font-bold uppercase text-[10px] tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Published</div>
                          {fmt(post.published_at)}
                        </div>
                        <div>
                          <div className="font-bold uppercase text-[10px] tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Updated</div>
                          {fmt(post.updated_at)}
                        </div>
                      </div>

                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map(tag => (
                            <span key={tag} className="text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={{ background: 'var(--green-tag-bg)', color: 'var(--green-tag-text)' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleTogglePublish(post.id, post.is_published)}
                          className="flex-1 py-2 text-xs font-bold rounded-lg border transition-colors"
                          style={{
                            borderColor: post.is_published ? 'var(--card-border)' : 'var(--green)',
                            color: post.is_published ? 'var(--text-secondary)' : 'var(--green)',
                            background: post.is_published ? 'var(--btn-inactive)' : 'transparent'
                          }}
                        >
                          {post.is_published ? 'Unpublish' : 'Publish'}
                        </button>

                        <Link href={`/admin/blog/editor?id=${post.id}`} className="px-4 py-2 rounded-lg border flex items-center justify-center gap-1 transition-colors hover:border-blue-500 hover:text-blue-500" style={{ borderColor: 'var(--card-border)', background: 'var(--btn-inactive)' }}>
                          <Edit className="w-4 h-4" /> Edit
                        </Link>
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
