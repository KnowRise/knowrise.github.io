'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '../../../src/components/AdminSidebar';
import AdminToast from '../../../src/components/AdminToast';
import { supabase } from '../../../src/lib/supabase';
import { Trash2, Loader2, Mail, Calendar, User } from 'lucide-react';

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

  useEffect(() => { fetchMessages(); }, []);

  async function fetchMessages() {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    setMessages(data || []);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm('Permanently delete this message?')) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (!error) {
      setMessages(messages.filter(m => m.id !== id));
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
             <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[var(--green)]" /></div>
          ) : messages.length === 0 ? (
             <div className="p-10 text-center border rounded-2xl flex flex-col items-center gap-4" style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
                <div className="p-4 rounded-full bg-black/5"><Mail className="w-8 h-8 opacity-50" /></div>
                <p>Your inbox is empty.</p>
             </div>
          ) : (
             <div className="space-y-4">
                {messages.map(msg => (
                   <div key={msg.id} className="border rounded-2xl p-6 relative group transition-all hover:bg-black/5" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                      
                      <button 
                        onClick={() => handleDelete(msg.id)} 
                        className="absolute top-6 right-6 p-2 rounded-lg text-red-500 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Delete message"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="pr-12">
                         <h3 className="text-lg font-bold font-montserrat mb-1">{msg.subject}</h3>
                         
                         <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wider mb-6" style={{ color: 'var(--text-muted)' }}>
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {msg.name}</span>
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> <a href={`mailto:${msg.email}`} className="hover:text-[var(--text-primary)] hover:underline">{msg.email}</a></span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(msg.created_at)}</span>
                         </div>

                         <div className="p-4 rounded-xl border font-source-serif-4 leading-relaxed" style={{ background: 'rgba(0,0,0,0.02)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
                            {msg.message.split('\n').map((line, i) => <p key={i} className="mb-2 last:mb-0">{line}</p>)}
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
