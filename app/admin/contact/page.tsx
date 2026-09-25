'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '../../../src/components/AdminSidebar';
import AdminToast from '../../../src/components/AdminToast';
import { supabase } from '../../../src/lib/supabase';
import { usePagination } from '../../../src/hooks/usePagination';
import { useDebouncedValue } from '../../../src/hooks/useDebouncedValue';
import { useResourceControls } from '../../../src/hooks/useResourceControls';
import { bulkDeleteByIds } from '../../../src/lib/bulkDelete';
import PaginationControls from '../../../src/components/PaginationControls';
import AdminListToolbar from '../../../src/components/AdminListToolbar';
import { Trash2, Loader2, Mail, Calendar, User, ArrowUpDown } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function ContactAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'loading'|null}>({ msg: '', type: null });
  const pg = usePagination(10);
  const ctl = useResourceControls('desc');
  const orderDir = ctl.orderDir;
  const debouncedSearch = useDebouncedValue(ctl.search, 350);

  useEffect(() => {
    if (pg.page !== 1) pg.resetPage();
  }, [debouncedSearch, orderDir]);

  useEffect(() => { fetchMessages(); }, [pg.page, debouncedSearch, orderDir]);

  async function fetchMessages() {
    if (!supabase) return;
    setLoading(true);
    let query: any = supabase.from('contact_messages').select('*', { count: 'exact' });
    const term = debouncedSearch.trim();
    if (term) {
      const esc = term.replace(/[%_]/g, (m) => '\\' + m);
      query = query.or(`name.ilike.%${esc}%,email.ilike.%${esc}%,subject.ilike.%${esc}%,message.ilike.%${esc}%`);
    }
    const { data, count } = await query
      .order('created_at', { ascending: orderDir === 'asc' })
      .range(pg.from, pg.to);
    setMessages(data || []);
    if (count !== null) pg.setTotal(count);
    setLoading(false);
  }

  const handleBulkDelete = async () => {
    const ids = [...ctl.selected];
    if (!supabase || ids.length === 0) return;
    if (!confirm(`Permanently delete ${ids.length} message(s)?`)) return;
    const { error } = await bulkDeleteByIds(supabase, 'contact_messages', ids);
    if (!error) {
      ctl.clearSelection();
      setMessages(messages.filter(m => !ids.includes(m.id)));
      const remaining = Math.max(0, pg.total - ids.length);
      if (messages.length > 0 && messages.every(m => ids.includes(m.id)) && pg.page > 1) {
        pg.setPage(pg.page - 1);
      } else {
        pg.setTotal(remaining);
      }
      setToast({ msg: `Deleted ${ids.length}`, type: 'success' });
      setTimeout(() => setToast({ msg: '', type: null }), 2000);
    } else {
      setToast({ msg: 'Failed to delete', type: 'error' });
      setTimeout(() => setToast({ msg: '', type: null }), 2000);
    }
  };

  const handleSelectAll = async () => {
    if (!supabase || pg.total === 0) return;
    if (ctl.selected.size >= pg.total && pg.total > 0) {
      ctl.clearSelection();
      return;
    }
    let query: any = supabase.from('contact_messages').select('id');
    const term = debouncedSearch.trim();
    if (term) {
      const esc = term.replace(/[%_]/g, (m) => '\\' + m);
      query = query.or(`name.ilike.%${esc}%,email.ilike.%${esc}%,subject.ilike.%${esc}%,message.ilike.%${esc}%`);
    }
    const { data } = await query;
    if (data) ctl.setSelectedIds((data as { id: string }[]).map((r) => r.id));
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm('Permanently delete this message?')) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (!error) {
      if (messages.length === 1 && pg.page > 1) {
        pg.setPage(pg.page - 1);
      } else {
        setMessages(messages.filter(m => m.id !== id));
        pg.setTotal(Math.max(0, pg.total - 1));
      }
      setToast({ msg: 'Message deleted', type: 'success' });
      setTimeout(() => setToast({ msg: '', type: null }), 2000);
    }
  };

  const formatDate = (dateStr: string) => {
     return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
     });
  };

  return (
    <AdminSidebar>
       <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: null })} />

       <div className="animate-in fade-in duration-500 space-y-6 max-w-4xl mx-auto">
          <header className="mb-8">
             <h1 className="text-2xl font-bold font-montserrat flex items-center gap-2"><Mail className="w-6 h-6 text-blue-500" /> Inbox</h1>
             <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Messages submitted from the public contact form.</p>
          </header>

          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-(--green)" /></div>
          ) : messages.length === 0 ? (
             <div className="p-10 text-center border rounded-2xl flex flex-col items-center gap-4" style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
                <div className="p-4 rounded-full bg-black/5"><Mail className="w-8 h-8 opacity-50" /></div>
                <p>{ctl.search.trim() ? `Tidak ada hasil untuk "${ctl.search}".` : 'Your inbox is empty.'}</p>
             </div>
          ) : (
<div className="space-y-4">
                 <AdminListToolbar
                   placeholder="Cari nama/email/subjek..."
                   search={ctl.search}
                   onSearch={ctl.setSearch}
                   selectedCount={ctl.selected.size}
                   onDeleteSelected={handleBulkDelete}
                   onSelectPage={() => ctl.toggleMany(messages.map(m => m.id))}
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
                 {messages.map(msg => (
                    <div key={msg.id} className="border rounded-2xl p-6 relative group transition-all hover:bg-black/5 cursor-pointer" style={{ background: 'var(--card-bg)', borderColor: ctl.isSelected(msg.id) ? 'var(--green)' : 'var(--card-border)', boxShadow: ctl.isSelected(msg.id) ? '0 0 0 1px var(--green)' : 'none' }} onClick={(e) => {
                          if ((e.target as HTMLElement).closest('button, input, a, label')) return;
                          ctl.toggleSelected(msg.id);
                        }}>
                       
                       <button 
                         onClick={() => handleDelete(msg.id)} 
                         className="absolute top-6 right-6 p-2 rounded-lg text-red-500 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                         aria-label="Delete message"
                       >
                          <Trash2 className="w-4 h-4" />
                       </button>

                       <div className="flex gap-3">
                         <input
                           type="checkbox" aria-label={`Select message from ${msg.name}`}
                           checked={ctl.isSelected(msg.id)}
                           onChange={() => ctl.toggleSelected(msg.id)}
                           className="w-4 h-4 shrink-0 accent-(--green) mt-1"
                         />
                         <div className="flex-1 min-w-0 pr-10">
                            <h3 className="text-lg font-bold font-montserrat mb-1">{msg.subject}</h3>
                            
                            <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wider mb-6" style={{ color: 'var(--text-muted)' }}>
                               <span className="flex items-center gap-1"><User className="w-3 h-3" /> {msg.name}</span>
                               <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> <a href={`mailto:${msg.email}`} className="hover:text-(--text-primary) hover:underline">{msg.email}</a></span>
                               <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(msg.created_at)}</span>
                            </div>

                            <div className="p-4 rounded-xl border font-source-serif-4 leading-relaxed" style={{ background: 'rgba(0,0,0,0.02)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
                               {msg.message.split('\n').map((line, i) => <p key={i} className="mb-2 last:mb-0">{line}</p>)}
                            </div>
                         </div>
                       </div>
                    </div>
                 ))}
                 <PaginationControls page={pg.page} pageSize={pg.pageSize} total={pg.total} onChange={pg.setPage} />
              </div>
          )}
       </div>
    </AdminSidebar>
  );
}
