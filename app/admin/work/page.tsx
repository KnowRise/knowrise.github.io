'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '../../../src/components/AdminSidebar';
import AdminToast from '../../../src/components/AdminToast';
import { supabase } from '../../../src/lib/supabase';
import type { Project } from '../../../src/types';
import { Plus, Trash2, ArrowUpDown, Loader2, Image as ImageIcon, Link as LinkIcon, Tag } from 'lucide-react';

export default function WorkAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'loading'|null}>({ msg: '', type: null });

  useEffect(() => { fetchProjects(); }, []);

  async function fetchProjects() {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
    setProjects(data || []);
    setLoading(false);
  }

  const handleAddProject = async () => {
    if (!supabase) return;
    const newSortOrder = projects.length > 0 ? Math.max(...projects.map(p => p.sort_order)) + 1 : 1;
    const { data, error } = await supabase.from('projects').insert([{
      title: 'New Project',
      description: 'Project description',
      image_url: '/img/placeholder.png',
      project_url: '#',
      tags: ['Website'],
      sort_order: newSortOrder
    }]).select().single();
    if (!error && data) setProjects([...projects, data]);
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm('Are you sure?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) setProjects(projects.filter(p => p.id !== id));
  };

  const saveChanges = async (id: string, updates: Partial<Project>) => {
    if (!supabase) return;
    setToast({ msg: 'Saving...', type: 'loading' });
    const { error } = await supabase.from('projects').update(updates).eq('id', id);
    if (error) setToast({ msg: 'Failed to save', type: 'error' });
    else {
      setToast({ msg: 'Saved!', type: 'success' });
      setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
    }
    setTimeout(() => setToast({ msg: '', type: null }), 2000);
  };

  return (
    <AdminSidebar>
       <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: null })} />
       <div className="animate-in fade-in duration-500 space-y-6">
          <header className="flex justify-between items-center mb-8">
             <div>
               <h1 className="text-2xl font-bold font-montserrat">Work & Projects</h1>
               <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your completed projects shown on the /work page.</p>
             </div>
             <button onClick={handleAddProject} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-[var(--btn-active)] text-[var(--btn-active-text)] hover:opacity-90 font-bold transition-opacity">
               <Plus className="w-5 h-5" /> Add Project
             </button>
          </header>

          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[var(--green)]" /></div>
          ) : projects.length === 0 ? (
             <div className="p-10 text-center border rounded-2xl" style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>No projects found. Create one above!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map(p => (
                <div key={p.id} className="border rounded-2xl overflow-hidden shadow-sm flex flex-col" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                  
                  {/* Image Preview & URL */}
                  <div className="h-40 border-b relative group" style={{ borderColor: 'var(--card-border)' }}>
                    {p.image_url ? (
                      <img src={p.image_url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center bg-black/10">No Image</div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur p-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                       <ImageIcon className="w-4 h-4 text-white" />
                       <input 
                         type="text" 
                         value={p.image_url} 
                         onChange={e => setProjects(projects.map(x => x.id === p.id ? {...x, image_url: e.target.value} : x))}
                         onBlur={e => saveChanges(p.id, { image_url: e.target.value })}
                         className="flex-1 bg-transparent text-white text-xs outline-none px-2"
                         placeholder="Image URL..."
                       />
                    </div>
                  </div>

                  {/* Form Content */}
                  <div className="p-4 space-y-4 flex-1">
                     <div className="flex gap-4 items-start">
                        <div className="w-16 flex-shrink-0">
                           <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Order</label>
                           <input 
                             type="number" className="w-full px-2 py-1.5 rounded border bg-transparent text-sm mt-1" style={{ borderColor: 'var(--input-border)' }}
                             value={p.sort_order}
                             onChange={e => setProjects(projects.map(x => x.id === p.id ? {...x, sort_order: Number(e.target.value)} : x))}
                             onBlur={e => saveChanges(p.id, { sort_order: Number(e.target.value) })}
                           />
                        </div>
                        <div className="flex-1">
                           <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Title</label>
                           <input 
                             type="text" className="w-full px-2 py-1.5 rounded border bg-transparent text-sm mt-1 font-bold" style={{ borderColor: 'var(--input-border)' }}
                             value={p.title}
                             onChange={e => setProjects(projects.map(x => x.id === p.id ? {...x, title: e.target.value} : x))}
                             onBlur={e => saveChanges(p.id, { title: e.target.value })}
                           />
                        </div>
                     </div>

                     <div>
                        <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Description</label>
                        <textarea 
                           className="w-full px-2 py-1.5 rounded border bg-transparent text-sm mt-1 resize-none" style={{ borderColor: 'var(--input-border)' }} rows={3}
                           value={p.description}
                           onChange={e => setProjects(projects.map(x => x.id === p.id ? {...x, description: e.target.value} : x))}
                           onBlur={e => saveChanges(p.id, { description: e.target.value })}
                        />
                     </div>

                     <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider flex items-center gap-1"><LinkIcon className="w-3 h-3"/> Target URL</label>
                            <input 
                              type="text" className="w-full px-2 py-1.5 rounded border bg-transparent text-sm md:text-xs mt-1" style={{ borderColor: 'var(--input-border)' }}
                              value={p.project_url}
                              onChange={e => setProjects(projects.map(x => x.id === p.id ? {...x, project_url: e.target.value} : x))}
                              onBlur={e => saveChanges(p.id, { project_url: e.target.value })}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider flex items-center gap-1"><Tag className="w-3 h-3"/> Tags (Comma Separated)</label>
                            <input 
                              type="text" className="w-full px-2 py-1.5 rounded border bg-transparent text-sm md:text-xs mt-1" style={{ borderColor: 'var(--input-border)' }}
                              value={p.tags.join(', ')}
                              onChange={e => setProjects(projects.map(x => x.id === p.id ? {...x, tags: e.target.value.split(',').map(t=>t.trim())} : x))}
                              onBlur={e => saveChanges(p.id, { tags: e.target.value.split(',').map(t=>t.trim()).filter(Boolean) })}
                            />
                        </div>
                     </div>
                  </div>

                  <div className="p-3 border-t bg-red-500/5 flex justify-end" style={{ borderColor: 'var(--card-border)' }}>
                     <button onClick={() => handleDelete(p.id)} className="text-red-500 text-sm font-semibold hover:underline flex items-center gap-1">
                        <Trash2 className="w-4 h-4" /> Delete Project
                     </button>
                  </div>
                </div>
              ))}
            </div>
          )}
       </div>
    </AdminSidebar>
  );
}
