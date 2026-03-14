'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '../../../src/components/AdminSidebar';
import AdminToast from '../../../src/components/AdminToast';
import { supabase } from '../../../src/lib/supabase';
import type { Skill, SkillCategory } from '../../../src/types';
import { Plus, Trash2, Loader2, Save, LayoutGrid, ArrowUpDown, ChevronDown, ChevronRight, Link as LinkIcon } from 'lucide-react';

export default function SkillsAdmin() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'loading'|null}>({ msg: '', type: null });
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    if (!supabase) return;
    setLoading(true);
    const [catRes, skillRes] = await Promise.all([
      supabase.from('skill_categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('skills').select('*').order('sort_order', { ascending: true })
    ]);
    setCategories(catRes.data || []);
    setSkills(skillRes.data || []);
    setLoading(false);
  }

  /* --- CATEGORY HANDLERS --- */
  const handleAddCategory = async () => {
    if (!supabase) return;
    const newOrder = categories.length > 0 ? Math.max(...categories.map(c => c.sort_order)) + 1 : 1;
    const { data, error } = await supabase.from('skill_categories').insert([{
      name: 'New Category',
      sort_order: newOrder
    }]).select().single();
    if (!error && data) {
      setCategories([...categories, data]);
      setExpandedCat(data.id);
    }
  };

  const saveCategory = async (id: string, updates: Partial<SkillCategory>) => {
    if (!supabase) return;
    setToast({ msg: 'Saving...', type: 'loading' });
    const { error } = await supabase.from('skill_categories').update(updates).eq('id', id);
    if (!error) {
      setCategories(categories.map(c => c.id === id ? { ...c, ...updates } : c));
      setToast({ msg: 'Saved!', type: 'success' });
    } else setToast({ msg: 'Failed', type: 'error' });
    setTimeout(() => setToast({ msg: '', type: null }), 1500);
  };

  const deleteCategory = async (id: string) => {
    if (!supabase || !confirm('Delete category AND all its skills?')) return;
    const { error } = await supabase.from('skill_categories').delete().eq('id', id);
    if (!error) {
      setCategories(categories.filter(c => c.id !== id));
      setSkills(skills.filter(s => s.category_id !== id));
    }
  };

  /* --- SKILL HANDLERS --- */
  const handleAddSkill = async (categoryId: string) => {
    if (!supabase) return;
    const catSkills = skills.filter(s => s.category_id === categoryId);
    const newOrder = catSkills.length > 0 ? Math.max(...catSkills.map(s => s.sort_order)) + 1 : 1;
    const { data, error } = await supabase.from('skills').insert([{
      category_id: categoryId,
      name: 'New Skill',
      sort_order: newOrder
    }]).select().single();
    if (!error && data) setSkills([...skills, data]);
  };

  const saveSkill = async (id: string, updates: Partial<Skill>) => {
    if (!supabase) return;
    setToast({ msg: 'Saving...', type: 'loading' });
    const { error } = await supabase.from('skills').update(updates).eq('id', id);
    if (!error) {
      setSkills(skills.map(s => s.id === id ? { ...s, ...updates } : s));
      setToast({ msg: 'Saved!', type: 'success' });
    } else setToast({ msg: 'Failed', type: 'error' });
    setTimeout(() => setToast({ msg: '', type: null }), 1500);
  };

  const deleteSkill = async (id: string) => {
    if (!supabase || !confirm('Delete this skill?')) return;
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (!error) setSkills(skills.filter(s => s.id !== id));
  };


  return (
    <AdminSidebar>
       <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: null })} />
       
       <div className="animate-in fade-in duration-500 space-y-6 max-w-5xl mx-auto">
          <header className="flex justify-between items-center mb-8">
             <div>
               <h1 className="text-2xl font-bold font-montserrat flex items-center gap-2"><LayoutGrid className="w-6 h-6 text-yellow-500" /> Skills Categories</h1>
               <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Organize your tools into distinct categories, then add linkable skills inside them.</p>
             </div>
             <button onClick={handleAddCategory} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-[var(--btn-active)] text-[var(--btn-active-text)] hover:opacity-90 font-bold transition-opacity">
               <Plus className="w-5 h-5" /> Add Category
             </button>
          </header>

          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[var(--green)]" /></div>
          ) : categories.length === 0 ? (
             <div className="p-10 text-center border rounded-2xl" style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>No categories found. Start by adding one above.</div>
          ) : (
            <div className="space-y-4">
              {categories.map((cat) => {
                const catSkills = skills.filter(s => s.category_id === cat.id).sort((a,b) => a.sort_order - b.sort_order);
                const isExpanded = expandedCat === cat.id;

                return (
                  <div key={cat.id} className="border rounded-xl overflow-hidden shadow-sm" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                    
                    {/* Category Header Row */}
                    <div className="flex items-center gap-4 p-4 border-b" style={{ borderColor: 'var(--card-border)', background: 'var(--bg-base)' }}>
                      <button onClick={() => setExpandedCat(isExpanded ? null : cat.id)} className="p-1 hover:bg-black/5 rounded">
                        {isExpanded ? <ChevronDown className="w-5 h-5"/> : <ChevronRight className="w-5 h-5"/>}
                      </button>
                      
                      <div className="flex flex-col gap-1 w-20">
                         <label className="text-[10px] font-bold uppercase text-[var(--text-muted)] flex items-center gap-1"><ArrowUpDown className="w-3 h-3"/> Order</label>
                         <input 
                            type="number" className="w-full px-2 py-1 bg-transparent border-b text-sm font-mono focus:outline-none" style={{ borderColor: 'var(--card-border)' }}
                            value={cat.sort_order}
                            onChange={e => setCategories(categories.map(c => c.id === cat.id ? {...c, sort_order: Number(e.target.value)} : c))}
                            onBlur={e => saveCategory(cat.id, { sort_order: Number(e.target.value) })}
                         />
                      </div>
                      
                      <div className="flex-1">
                         <input 
                            type="text" className="w-full px-3 py-1.5 bg-transparent text-lg font-bold font-montserrat focus:outline-none border-b border-transparent focus:border-[var(--green)]" 
                            value={cat.name}
                            onChange={e => setCategories(categories.map(c => c.id === cat.id ? {...c, name: e.target.value} : c))}
                            onBlur={e => saveCategory(cat.id, { name: e.target.value })}
                         />
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => { setExpandedCat(cat.id); handleAddSkill(cat.id); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-[var(--green-dim)] text-[var(--green)] hover:opacity-80 transition-opacity whitespace-nowrap">
                          <Plus className="w-4 h-4" /> Add Skill
                        </button>
                        <button onClick={() => deleteCategory(cat.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                            <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Skills List (Children) */}
                    {isExpanded && (
                      <div className="p-4 bg-transparent divide-y" style={{ borderColor: 'var(--card-border)' }}>
                        {catSkills.length === 0 && <p className="text-center text-sm py-4 text-[var(--text-muted)]">No skills in this category yet.</p>}
                        
                        {catSkills.map(skill => (
                          <div key={skill.id} className="grid grid-cols-12 gap-4 py-3 items-center hover:bg-black/5 transition-colors group">
                              <div className="col-span-2 md:col-span-1 pl-4 md:pl-8">
                                <input 
                                  type="number" className="w-12 px-2 py-1 rounded border bg-transparent text-xs text-center font-mono" style={{ borderColor: 'var(--input-border)' }}
                                  value={skill.sort_order}
                                  onChange={e => setSkills(skills.map(s => s.id === skill.id ? {...s, sort_order: Number(e.target.value)} : s))}
                                  onBlur={e => saveSkill(skill.id, { sort_order: Number(e.target.value) })}
                                />
                              </div>
                              <div className="col-span-10 md:col-span-5 pr-4 md:pr-0">
                                <input 
                                  type="text" placeholder="Skill Name (e.g. React)" className="w-full px-3 py-1.5 rounded border bg-[var(--bg-base)] text-sm font-semibold" style={{ borderColor: 'var(--input-border)' }}
                                  value={skill.name}
                                  onChange={e => setSkills(skills.map(s => s.id === skill.id ? {...s, name: e.target.value} : s))}
                                  onBlur={e => saveSkill(skill.id, { name: e.target.value })}
                                />
                              </div>
                              <div className="col-span-10 col-start-3 md:col-span-5 md:col-start-auto relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                <input 
                                  type="url" placeholder="URL (Optional, e.g. https://...)" className="w-full pl-9 pr-3 py-1.5 rounded border bg-[var(--bg-base)] text-sm" style={{ borderColor: 'var(--input-border)' }}
                                  value={skill.url || ''}
                                  onChange={e => setSkills(skills.map(s => s.id === skill.id ? {...s, url: e.target.value} : s))}
                                  onBlur={e => saveSkill(skill.id, { url: e.target.value })}
                                />
                              </div>
                              <div className="col-span-2 md:col-span-1 flex justify-center">
                                <button onClick={() => deleteSkill(skill.id)} className="text-red-500 opacity-50 hover:opacity-100 hover:bg-red-500/10 p-2 rounded-lg transition-all" aria-label="Delete Skill">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
       </div>
    </AdminSidebar>
  );
}
