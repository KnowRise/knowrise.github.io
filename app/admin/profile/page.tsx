'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '../../../src/components/AdminSidebar';
import AdminToast from '../../../src/components/AdminToast';
import { supabase } from '../../../src/lib/supabase';
import type { Profile } from '../../../src/types';
import { Save, Loader2, Camera, Link as LinkIcon, Edit3 } from 'lucide-react';

export default function ProfileAdmin() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'loading'|null}>({ msg: '', type: null });

  useEffect(() => {
    async function fetchProfile() {
      if (!supabase) return;
      const { data } = await supabase.from('profile').select('*').single();
      if (data) setProfile(data as Profile);
      setLoading(false);
    }
    fetchProfile();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !supabase) return;
    
    setSaving(true);
    setToast({ msg: 'Saving profile...', type: 'loading' });

    const { error } = await supabase
      .from('profile')
      .update({
        full_name: profile.full_name,
        tagline: profile.tagline,
        bio_paragraph_1: profile.bio_paragraph_1,
        bio_paragraph_2: profile.bio_paragraph_2,
        photo_url: profile.photo_url,
        cv_url: profile.cv_url,
        instagram_url: profile.instagram_url,
        github_url: profile.github_url
      })
      .eq('id', 'primary');

    if (error) {
      setToast({ msg: 'Failed to save changes.', type: 'error' });
    } else {
      setToast({ msg: 'Profile updated successfully!', type: 'success' });
    }
    setSaving(false);
    
    setTimeout(() => setToast({ msg: '', type: null }), 3000);
  }

  const InputLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
      {children}
    </label>
  );

  return (
    <AdminSidebar>
      <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: null })} />
      
      <div className="animate-in fade-in duration-500">
        <header className="mb-8 flex justify-between items-center">
          <div>
             <h1 className="text-2xl font-bold font-montserrat">Edit Global Profile</h1>
             <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>This data populates the Home page.</p>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
             <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--green)' }} />
          </div>
        ) : profile ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column */}
              <div className="space-y-6">
                <div className="p-6 rounded-2xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-[var(--green)]" /> Basic Info
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <InputLabel>Full Name</InputLabel>
                      <input 
                        type="text" required
                        value={profile.full_name}
                        onChange={e => setProfile({...profile, full_name: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none focus:border-[var(--green)]"
                        style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <InputLabel>Tagline / Role</InputLabel>
                      <input 
                        type="text" required
                        value={profile.tagline}
                        onChange={e => setProfile({...profile, tagline: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none focus:border-[var(--green)]"
                        style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-blue-500" /> Web Links
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <InputLabel>Instagram URL</InputLabel>
                      <input 
                        type="url"
                        value={profile.instagram_url || ''}
                        onChange={e => setProfile({...profile, instagram_url: e.target.value})}
                        placeholder="https://instagram.com/..."
                        className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none focus:border-[var(--green)]"
                        style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <InputLabel>GitHub URL</InputLabel>
                      <input 
                        type="url"
                        value={profile.github_url || ''}
                        onChange={e => setProfile({...profile, github_url: e.target.value})}
                        placeholder="https://github.com/..."
                        className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none focus:border-[var(--green)]"
                        style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <InputLabel>CV / Resume Document URL</InputLabel>
                      <input 
                        type="text"
                        value={profile.cv_url || ''}
                        onChange={e => setProfile({...profile, cv_url: e.target.value})}
                        placeholder="/cv.pdf OR https://..."
                        className="w-full px-4 py-2 rounded-lg border bg-transparent outline-none focus:border-[var(--green)]"
                        style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="p-6 rounded-2xl border h-full" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-purple-500" /> Photo & Bio
                  </h2>
                  
                  <div className="mb-6 flex items-start gap-4">
                     <img 
                       src={profile.photo_url || '/img/MyFoto.png'} 
                       alt="Profile Preview" 
                       className="w-20 h-20 rounded-full border-2 object-cover"
                       style={{ borderColor: 'var(--green)' }}
                     />
                     <div className="flex-1">
                       <InputLabel>Photo Image URL</InputLabel>
                        <input 
                          type="text"
                          value={profile.photo_url || ''}
                          onChange={e => setProfile({...profile, photo_url: e.target.value})}
                          placeholder="/img/MyFoto.png OR https://..."
                          className="w-full px-4 py-2 text-sm rounded-lg border bg-transparent outline-none focus:border-[var(--green)]"
                          style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                        />
                     </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <InputLabel>Biography Paragraph 1</InputLabel>
                      <textarea 
                        required rows={5}
                        value={profile.bio_paragraph_1}
                        onChange={e => setProfile({...profile, bio_paragraph_1: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border bg-transparent outline-none focus:border-[var(--green)] resize-none"
                        style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <InputLabel>Biography Paragraph 2</InputLabel>
                      <textarea 
                        required rows={4}
                        value={profile.bio_paragraph_2}
                        onChange={e => setProfile({...profile, bio_paragraph_2: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border bg-transparent outline-none focus:border-[var(--green)] resize-none"
                        style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={saving}
                className="px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all disabled:opacity-70"
                style={{ background: 'var(--btn-active)', color: 'var(--btn-active-text)' }}
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Profile
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 rounded-2xl border text-center text-red-500" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            Error loading profile data. Ensure the "primary" row exists in the database.
          </div>
        )}
      </div>
    </AdminSidebar>
  );
}
