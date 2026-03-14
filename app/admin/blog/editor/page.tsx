'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminSidebar from '../../../../src/components/AdminSidebar';
import AdminToast from '../../../../src/components/AdminToast';
import { supabase } from '../../../../src/lib/supabase';
import type { BlogPost } from '../../../../src/types';
import { Save, Loader2, ArrowLeft, Image as ImageIcon, FileText, Tag } from 'lucide-react';
import Link from 'next/link';

function BlogEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get('id');

  const [post, setPost] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    cover_url: '',
    tags: [],
    is_published: false
  });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'loading'|null}>({ msg: '', type: null });

  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  async function fetchPost() {
    if (!supabase || !id) return;
    const { data } = await supabase.from('blogs').select('*').eq('id', id).single();
    if (data) setPost(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    
    // Auto-generate slug if empty
    let finalSlug = post.slug;
    if (!finalSlug && post.title) {
       finalSlug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (!finalSlug) {
       setToast({ msg: 'Title or Slug is required', type: 'error' });
       return;
    }

    setSaving(true);
    setToast({ msg: 'Saving post...', type: 'loading' });

    const payload = {
       ...post,
       slug: finalSlug,
       updated_at: new Date().toISOString()
    };

    let result;
    if (id) {
       result = await supabase.from('blogs').update(payload).eq('id', id);
    } else {
       result = await supabase.from('blogs').insert([payload]);
    }

    if (result.error) {
       setToast({ msg: result.error.message || 'Failed to save', type: 'error' });
    } else {
       setToast({ msg: 'Blog post saved!', type: 'success' });
       if (!id) {
          setTimeout(() => router.push('/admin/blog'), 1000);
       }
    }
    setSaving(false);
    setTimeout(() => setToast({ msg: '', type: null }), 3000);
  };

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--green)]" /></div>
  );

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
      <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: null })} />
      
      <header className="flex items-center gap-4 mb-8">
         <Link href="/admin/blog" className="p-2 rounded-lg border hover:bg-black/5 transition-colors" style={{ borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}>
           <ArrowLeft className="w-5 h-5" />
         </Link>
         <div>
           <h1 className="text-2xl font-bold font-montserrat">{id ? 'Edit Post' : 'Write New Post'}</h1>
           <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Use Markdown for content styling.</p>
         </div>
         
         <div className="ml-auto flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
              <input 
                 type="checkbox" 
                 checked={post.is_published} 
                 onChange={e => setPost({...post, is_published: e.target.checked})}
                 className="w-4 h-4 rounded border-gray-300 text-[var(--green)] focus:ring-[var(--green)]"
              />
              Publish immediately?
            </label>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm bg-[var(--btn-active)] text-[var(--btn-active-text)] hover:opacity-90 font-bold transition-opacity disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Post
            </button>
         </div>
      </header>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Left Col: Content */}
         <div className="lg:col-span-2 space-y-6">
            <div className="p-1 rounded-2xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
               <input 
                 type="text" 
                 placeholder="Post Title..." 
                 required
                 value={post.title}
                 onChange={e => setPost({...post, title: e.target.value})}
                 className="w-full px-5 py-4 text-2xl font-bold font-montserrat bg-transparent border-b outline-none"
                 style={{ borderColor: 'var(--card-border)' }}
               />
               <textarea 
                 placeholder="Write your markdown content here..." 
                 required
                 rows={25}
                 value={post.content}
                 onChange={e => setPost({...post, content: e.target.value})}
                 className="w-full px-5 py-4 bg-transparent outline-none font-mono text-sm resize-y"
                 style={{ minHeight: '500px' }}
               />
            </div>
         </div>

         {/* Right Col: Metadata */}
         <div className="space-y-6">
            <div className="p-5 rounded-2xl border space-y-5" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
               <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}><FileText className="w-4 h-4" /> Meta Info</h3>
               
               <div>
                 <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>URL Slug</label>
                 <input 
                   type="text" 
                   value={post.slug}
                   onChange={e => setPost({...post, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                   placeholder="leave-blank-to-auto-generate"
                   className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm outline-none focus:border-[var(--green)]"
                   style={{ borderColor: 'var(--input-border)' }}
                 />
               </div>

               <div>
                 <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Short Excerpt</label>
                 <textarea 
                   rows={3}
                   value={post.excerpt || ''}
                   onChange={e => setPost({...post, excerpt: e.target.value})}
                   placeholder="Brief summary for cards..."
                   className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm outline-none focus:border-[var(--green)] resize-none"
                   style={{ borderColor: 'var(--input-border)' }}
                 />
               </div>

               <div>
                 <label className="block text-xs font-bold mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}><Tag className="w-3 h-3"/> Tags (Comma Separated)</label>
                 <input 
                   type="text" 
                   value={(post.tags || []).join(', ')}
                   onChange={e => setPost({...post, tags: e.target.value.split(',').map(t=>t.trim())})}
                   placeholder="Nextjs, React, Supabase..."
                   className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm outline-none focus:border-[var(--green)]"
                   style={{ borderColor: 'var(--input-border)' }}
                 />
               </div>
            </div>

            <div className="p-5 rounded-2xl border space-y-5" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
               <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}><ImageIcon className="w-4 h-4" /> Cover Image</h3>
               
               {post.cover_url && (
                  <div className="w-full h-32 rounded-lg overflow-hidden border" style={{ borderColor: 'var(--card-border)' }}>
                     <img src={post.cover_url} alt="Cover Preview" className="w-full h-full object-cover" />
                  </div>
               )}

               <input 
                 type="text" 
                 value={post.cover_url || ''}
                 onChange={e => setPost({...post, cover_url: e.target.value})}
                 placeholder="https://image-url.com/img.png"
                 className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm outline-none focus:border-[var(--green)]"
                 style={{ borderColor: 'var(--input-border)' }}
               />
               <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Paste an absolute image URL to be used as the blog cover.</p>
            </div>
         </div>
         
      </form>
    </div>
  );
}

export default function BlogEditorWrapper() {
  return (
    <AdminSidebar>
      <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
        <BlogEditorContent />
      </Suspense>
    </AdminSidebar>
  );
}
