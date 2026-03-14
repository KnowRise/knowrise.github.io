'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '../../../src/components/AdminSidebar';
import AdminToast from '../../../src/components/AdminToast';
import { supabase } from '../../../src/lib/supabase';
import type { Skill } from '../../../src/types';
import { Plus, Trash2, Loader2, Save, LayoutGrid, ArrowUpDown } from 'lucide-react';

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'loading'|null}>({ msg: '', type: null });

  useEffect(() => { fetchSkills(); }, []);

  async function fetchSkills() {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase.from('skills').select('*').order('sort_order', { ascending: true });
    setSkills(data || []);
    setLoading(false);
  }

  const handleAddSkill = async () => {
    if (!supabase) return;
    const newSortOrder = skills.length > 0 ? Math.max(...skills.map(s => s.sort_order)) + 1 : 1;
    const { data, error } = await supabase.from('skills').insert([{
      name: 'New Skill',
      category: 'Frontend', // Default category
      sort_order: newSortOrder
    }]).select().single();
    if (!error && data) setSkills([...skills, data]);
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm('Delete this skill?')) return;
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (!error) setSkills(skills.filter(s => s.id !== id));
  };

  const saveChanges = async (id: string, updates: Partial<Skill>) => {
    if (!supabase) return;
    setToast({ msg: 'Saving...', type: 'loading' });
    const { error } = await supabase.from('skills').update(updates).eq('id', id);
    if (error) setToast({ msg: 'Failed to save', type: 'error' });
    else {
      setToast({ msg: 'Saved!', type: 'success' });
      setSkills(skills.map(s => s.id === id ? { ...s, ...updates } : s));
    }
    setTimeout(() => setToast({ msg: '', type: null }), 1500);
  };

  // Group skills by category for display
  const categories = Array.from(new Set(skills.map(s => s.category)));

  return (
    <AdminSidebar>
       <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: null })} />
       
       <div className="animate-in fade-in duration-500 space-y-6 max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-8">
             <div>
               <h1 className="text-2xl font-bold font-montserrat flex items-center gap-2"><LayoutGrid className="w-6 h-6 text-yellow-500" /> Skills Matrix</h1>
               <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage tools and technologies. Grouped by Category on public view.</p>
             </div>
             <button onClick={handleAddSkill} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-[var(--btn-active)] text-[var(--btn-active-text)] hover:opacity-90 font-bold transition-opacity">
               <Plus className="w-5 h-5" /> Add Skill
             </button>
          </header>

          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[var(--green)]" /></div>
          ) : skills.length === 0 ? (
             <div className="p-10 text-center border rounded-2xl" style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>No skills found. Let's add your first one!</div>
          ) : (
             <div className="bg-[var(--card-bg)] border rounded-2xl overflow-hidden" style={{ borderColor: 'var(--card-border)' }}>
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b text-xs font-bold uppercase tracking-wider" style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
                   <div className="col-span-2 flex items-center gap-1"><ArrowUpDown className="w-3 h-3" /> Order</div>
                   <div className="col-span-5">Name / Tool</div>
                   <div className="col-span-4">Category Group</div>
                   <div className="col-span-1 text-center">Act</div>
                </div>

                {/* Table Body */}
                <div className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
                   {skills.map(s => (
                      <div key={s.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-black/5 transition-colors">
                         <div className="col-span-2">
                            <input 
                              type="number" className="w-16 px-2 py-1.5 rounded border bg-transparent text-sm text-center font-mono" style={{ borderColor: 'var(--input-border)' }}
                              value={s.sort_order}
                              onChange={e => setSkills(skills.map(x => x.id === s.id ? {...x, sort_order: Number(e.target.value)} : x))}
                              onBlur={e => saveChanges(s.id, { sort_order: Number(e.target.value) })}
                            />
                         </div>
                         <div className="col-span-5">
                            <input 
                              type="text" className="w-full px-3 py-1.5 rounded border bg-transparent text-sm font-semibold" style={{ borderColor: 'var(--input-border)' }}
                              value={s.name}
                              onChange={e => setSkills(skills.map(x => x.id === s.id ? {...x, name: e.target.value} : x))}
                              onBlur={e => saveChanges(s.id, { name: e.target.value })}
                            />
                         </div>
                         <div className="col-span-4">
                            <input 
                              type="text" className="w-full px-3 py-1.5 rounded border bg-transparent text-sm" style={{ borderColor: 'var(--input-border)' }}
                              value={s.category}
                              onChange={e => setSkills(skills.map(x => x.id === s.id ? {...x, category: e.target.value} : x))}
                              onBlur={e => saveChanges(s.id, { category: e.target.value })}
                            />
                         </div>
                         <div className="col-span-1 flex justify-center">
                            <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors" aria-label="Delete">
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}
       </div>
    </AdminSidebar>
  );
}
