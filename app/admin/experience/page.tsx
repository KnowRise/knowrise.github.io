'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '../../../src/components/AdminSidebar';
import AdminToast from '../../../src/components/AdminToast';
import { supabase } from '../../../src/lib/supabase';
import type { WorkExperience, Education } from '../../../src/types';
import { Plus, Trash2, Save, Loader2, ArrowUpDown } from 'lucide-react';

export default function ExperienceAdmin() {
  const [work, setWork] = useState<WorkExperience[]>([]);
  const [edu, setEdu] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'loading'|null}>({ msg: '', type: null });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    if (!supabase) return;
    setLoading(true);
    const [workRes, eduRes] = await Promise.all([
      supabase.from('work_experiences').select('*').order('sort_order', { ascending: true }),
      supabase.from('education_history').select('*').order('sort_order', { ascending: true })
    ]);
    setWork(workRes.data || []);
    setEdu(eduRes.data || []);
    setLoading(false);
  }

  const handleAddWork = async () => {
    if (!supabase) return;
    const newSortOrder = work.length > 0 ? Math.max(...work.map(w => w.sort_order)) + 1 : 1;
    const { data, error } = await supabase.from('work_experiences').insert([{
      period: 'New Period',
      title: 'New Position',
      company: 'New Company',
      description: 'Description here',
      sort_order: newSortOrder
    }]).select().single();
    
    if (!error && data) setWork([...work, data]);
  };

  const handleAddEdu = async () => {
    if (!supabase) return;
    const newSortOrder = edu.length > 0 ? Math.max(...edu.map(e => e.sort_order)) + 1 : 1;
    const { data, error } = await supabase.from('education_history').insert([{
      period: 'New Period',
      title: 'New Degree',
      institution: 'New Institution',
      description: 'Description here',
      sort_order: newSortOrder
    }]).select().single();
    
    if (!error && data) setEdu([...edu, data]);
  };

  const handleDeleteWork = async (id: string) => {
    if (!supabase || !confirm('Are you sure?')) return;
    const { error } = await supabase.from('work_experiences').delete().eq('id', id);
    if (!error) setWork(work.filter(w => w.id !== id));
  };

  const handleDeleteEdu = async (id: string) => {
    if (!supabase || !confirm('Are you sure?')) return;
    const { error } = await supabase.from('education_history').delete().eq('id', id);
    if (!error) setEdu(edu.filter(e => e.id !== id));
  };

  const saveWorkChanges = async (id: string, updates: Partial<WorkExperience>) => {
    if (!supabase) return;
    setSaving(true);
    setToast({ msg: 'Saving...', type: 'loading' });
    const { error } = await supabase.from('work_experiences').update(updates).eq('id', id);
    if (error) setToast({ msg: 'Failed to save', type: 'error' });
    else {
      setToast({ msg: 'Saved!', type: 'success' });
      setWork(work.map(w => w.id === id ? { ...w, ...updates } : w));
    }
    setSaving(false);
    setTimeout(() => setToast({ msg: '', type: null }), 2000);
  };

  const saveEduChanges = async (id: string, updates: Partial<Education>) => {
    if (!supabase) return;
    setSaving(true);
    setToast({ msg: 'Saving...', type: 'loading' });
    const { error } = await supabase.from('education_history').update(updates).eq('id', id);
    if (error) setToast({ msg: 'Failed to save', type: 'error' });
    else {
      setToast({ msg: 'Saved!', type: 'success' });
      setEdu(edu.map(e => e.id === id ? { ...e, ...updates } : e));
    }
    setSaving(false);
    setTimeout(() => setToast({ msg: '', type: null }), 2000);
  };

  return (
    <AdminSidebar>
      <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: null })} />

      <div className="animate-in fade-in duration-500 space-y-12">
        <header>
           <h1 className="text-2xl font-bold font-montserrat">Experience & Education</h1>
           <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your timeline records. Use sort_order to arrange them (lower number = top).</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[var(--green)]" /></div>
        ) : (
          <>
            {/* WORK EXPERIENCES */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Work Experiences</h2>
                <button onClick={handleAddWork} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-[var(--green-dim)] text-[var(--green)] hover:opacity-80 transition-opacity">
                  <Plus className="w-4 h-4" /> Add Record
                </button>
              </div>

              <div className="space-y-4">
                {work.length === 0 && <p className="text-sm text-center py-4 text-[var(--text-muted)]">No work records yet.</p>}
                {work.map(item => (
                  <div key={item.id} className="p-4 rounded-xl border flex gap-4" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                    <div className="flex flex-col gap-2 w-24 flex-shrink-0">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1"><ArrowUpDown className="w-3 h-3"/> Order</label>
                      <input 
                        type="number" className="w-full px-2 py-1.5 rounded border bg-transparent text-sm" style={{ borderColor: 'var(--input-border)' }}
                        value={item.sort_order}
                        onChange={e => setWork(work.map(w => w.id === item.id ? { ...w, sort_order: Number(e.target.value) } : w))}
                        onBlur={e => saveWorkChanges(item.id, { sort_order: Number(e.target.value) })}
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="grid grid-cols-3 gap-3 col-span-1 md:col-span-2">
                          <input type="text" placeholder="Title" className="col-span-1 px-3 py-1.5 rounded border bg-transparent text-sm font-bold" style={{ borderColor: 'var(--input-border)' }} value={item.title} onChange={e => setWork(work.map(w => w.id === item.id ? { ...w, title: e.target.value } : w))} onBlur={e => saveWorkChanges(item.id, { title: e.target.value })} />
                          <input type="text" placeholder="Company" className="col-span-1 px-3 py-1.5 rounded border bg-transparent text-sm" style={{ borderColor: 'var(--input-border)' }} value={item.company} onChange={e => setWork(work.map(w => w.id === item.id ? { ...w, company: e.target.value } : w))} onBlur={e => saveWorkChanges(item.id, { company: e.target.value })} />
                          <input type="text" placeholder="Period (e.g. 2021 - Present)" className="col-span-1 px-3 py-1.5 rounded border bg-transparent text-sm" style={{ borderColor: 'var(--input-border)' }} value={item.period} onChange={e => setWork(work.map(w => w.id === item.id ? { ...w, period: e.target.value } : w))} onBlur={e => saveWorkChanges(item.id, { period: e.target.value })} />
                        </div>
                        <input type="url" placeholder="Company URL (Optional)" className="col-span-1 md:col-span-2 px-3 py-1.5 rounded border bg-transparent text-sm" style={{ borderColor: 'var(--input-border)' }} value={item.company_url || ''} onChange={e => setWork(work.map(w => w.id === item.id ? { ...w, company_url: e.target.value } : w))} onBlur={e => saveWorkChanges(item.id, { company_url: e.target.value })} />
                      </div>
                      <textarea placeholder="Description" rows={2} className="w-full px-3 py-2 rounded border bg-transparent text-sm resize-none" style={{ borderColor: 'var(--input-border)' }} value={item.description} onChange={e => setWork(work.map(w => w.id === item.id ? { ...w, description: e.target.value } : w))} onBlur={e => saveWorkChanges(item.id, { description: e.target.value })} />
                    </div>
                    <button onClick={() => handleDeleteWork(item.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg self-start transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* EDUCATION */}
            <section className="pt-6 border-t" style={{ borderColor: 'var(--card-border)' }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Education History</h2>
                <button onClick={handleAddEdu} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-[var(--green-dim)] text-[var(--green)] hover:opacity-80 transition-opacity">
                  <Plus className="w-4 h-4" /> Add Record
                </button>
              </div>

              <div className="space-y-4">
                {edu.length === 0 && <p className="text-sm text-center py-4 text-[var(--text-muted)]">No education records yet.</p>}
                {edu.map(item => (
                  <div key={item.id} className="p-4 rounded-xl border flex gap-4" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                    <div className="flex flex-col gap-2 w-24 flex-shrink-0">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1"><ArrowUpDown className="w-3 h-3"/> Order</label>
                      <input 
                        type="number" className="w-full px-2 py-1.5 rounded border bg-transparent text-sm" style={{ borderColor: 'var(--input-border)' }}
                        value={item.sort_order}
                        onChange={e => setEdu(edu.map(w => w.id === item.id ? { ...w, sort_order: Number(e.target.value) } : w))}
                        onBlur={e => saveEduChanges(item.id, { sort_order: Number(e.target.value) })}
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="grid grid-cols-3 gap-3 col-span-1 md:col-span-2">
                          <input type="text" placeholder="Degree / Title" className="col-span-1 px-3 py-1.5 rounded border bg-transparent text-sm font-bold" style={{ borderColor: 'var(--input-border)' }} value={item.title} onChange={e => setEdu(edu.map(w => w.id === item.id ? { ...w, title: e.target.value } : w))} onBlur={e => saveEduChanges(item.id, { title: e.target.value })} />
                          <input type="text" placeholder="Institution" className="col-span-1 px-3 py-1.5 rounded border bg-transparent text-sm" style={{ borderColor: 'var(--input-border)' }} value={item.institution} onChange={e => setEdu(edu.map(w => w.id === item.id ? { ...w, institution: e.target.value } : w))} onBlur={e => saveEduChanges(item.id, { institution: e.target.value })} />
                          <input type="text" placeholder="Period (e.g. 2021 - 2025)" className="col-span-1 px-3 py-1.5 rounded border bg-transparent text-sm" style={{ borderColor: 'var(--input-border)' }} value={item.period} onChange={e => setEdu(edu.map(w => w.id === item.id ? { ...w, period: e.target.value } : w))} onBlur={e => saveEduChanges(item.id, { period: e.target.value })} />
                        </div>
                        <input type="url" placeholder="Institution URL (Optional)" className="col-span-1 md:col-span-2 px-3 py-1.5 rounded border bg-transparent text-sm" style={{ borderColor: 'var(--input-border)' }} value={item.institution_url || ''} onChange={e => setEdu(edu.map(w => w.id === item.id ? { ...w, institution_url: e.target.value } : w))} onBlur={e => saveEduChanges(item.id, { institution_url: e.target.value })} />
                      </div>
                      <textarea placeholder="Description" rows={2} className="w-full px-3 py-2 rounded border bg-transparent text-sm resize-none" style={{ borderColor: 'var(--input-border)' }} value={item.description} onChange={e => setEdu(edu.map(w => w.id === item.id ? { ...w, description: e.target.value } : w))} onBlur={e => saveEduChanges(item.id, { description: e.target.value })} />
                    </div>
                    <button onClick={() => handleDeleteEdu(item.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg self-start transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </AdminSidebar>
  );
}
