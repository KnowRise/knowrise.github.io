'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '../../../src/components/AdminSidebar';
import AdminToast from '../../../src/components/AdminToast';
import { supabase } from '../../../src/lib/supabase';
import type { BlogPost } from '../../../src/types';
import { Plus, Trash2, Edit, Loader2, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function BlogAdmin() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBlogs(); }, []);

  async function fetchBlogs() {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    setBlogs(data || []);
    setLoading(false);
  }

  const handleDelete = async (id: string, title: string) => {
    if (!supabase || !confirm(`Are you sure you want to delete the post: "${title}"?`)) return;
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (!error) setBlogs(blogs.filter(b => b.id !== id));
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
             <Link href="/admin/blog/editor" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-[var(--btn-active)] text-[var(--btn-active-text)] hover:opacity-90 font-bold transition-opacity">
               <Plus className="w-5 h-5" /> Write New Post
             </Link>
          </header>

          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[var(--green)]" /></div>
          ) : blogs.length === 0 ? (
             <div className="p-10 text-center border rounded-2xl" style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>No blog posts written yet. Start your journey!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map(post => (
                 <div key={post.id} className="relative border rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all hover:shadow-md" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                    
                    {/* Status Badge */}
                    <div className={`absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${post.is_published ? 'bg-green-500 flex text-white' : 'bg-yellow-500 text-yellow-950 flex'}`}>
                       {post.is_published ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                       {post.is_published ? 'Published' : 'Draft'}
                    </div>

                    {/* Cover Preview */}
                    <div className="h-32 border-b bg-black/10 flex items-center justify-center overflow-hidden" style={{ borderColor: 'var(--card-border)' }}>
                        {post.cover_url ? (
                           <img src={post.cover_url} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                           <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>No Cover Image</span>
                        )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                       <h3 className="font-bold text-lg mb-2 leading-tight line-clamp-2">{post.title}</h3>
                       <p className="text-xs mb-4 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>{post.excerpt || 'No excerpt provided...'}</p>
                       
                       <div className="mt-auto pt-4 flex gap-2 w-full">
                          <button 
                            onClick={() => handleTogglePublish(post.id, post.is_published)}
                            className="flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors"
                            style={{ 
                              borderColor: post.is_published ? 'var(--card-border)' : 'var(--green)', 
                              color: post.is_published ? 'var(--text-secondary)' : 'var(--green)',
                              background: post.is_published ? 'var(--btn-inactive)' : 'transparent'
                            }}
                          >
                             {post.is_published ? 'Unpublish' : 'Publish'}
                          </button>
                          
                          <Link href={`/admin/blog/editor?id=${post.id}`} className="px-3 py-1.5 rounded-lg border flex items-center justify-center transition-colors hover:border-blue-500 hover:text-blue-500" style={{ borderColor: 'var(--card-border)', background: 'var(--btn-inactive)' }}>
                             <Edit className="w-4 h-4" />
                          </Link>
                          
                          <button onClick={() => handleDelete(post.id, post.title)} className="px-3 py-1.5 rounded-lg border flex items-center justify-center transition-colors text-red-500 hover:bg-red-500/10" style={{ borderColor: 'var(--card-border)', background: 'var(--btn-inactive)' }}>
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
            </div>
          )}
       </div>
    </AdminSidebar>
  );
}
