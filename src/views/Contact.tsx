import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface FormState {
  name: string;
  email: string;
  message: string;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      if (supabase) {
        const { error } = await supabase.from('contact_messages').insert([
          { name: form.name, email: form.email, message: form.message },
        ]);
        if (error) throw error;
      } else {
        // Fallback: open email client
        window.location.href = `mailto:rifaasiraajuddin.123@gmail.com?subject=Portfolio Contact: ${form.name}&body=${form.message}`;
      }
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const inputStyle = {
    background: 'var(--input-bg)',
    borderColor: 'var(--input-border)',
    color: 'var(--text-primary)',
  };

  return (
    <div className="py-14 page-in">
      <h1 className="text-3xl font-bold font-montserrat text-center mb-3" style={{ color: 'var(--text-primary)' }}>
        Contact
      </h1>
      <p className="text-center mb-10 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Punya pertanyaan, tawaran project, atau hanya ingin menyapa? Kirim pesan!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Info */}
        <div className="flex flex-col gap-5">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Aku terbuka untuk peluang baru, kolaborasi proyek, atau sekadar ngobrol soal teknologi. Kirim pesan dan aku akan balas segera.
          </p>

          {[
            { icon: '✉', label: 'rifaasiraajuddin.123@gmail.com', href: 'mailto:rifaasiraajuddin.123@gmail.com' },
            { icon: '📸', label: '@rifaa_srjdn', href: 'https://www.instagram.com/rifaa_srjdn/' },
            { icon: '🐙', label: 'KnowRise', href: 'https://github.com/KnowRise' },
          ].map(({ icon, label, href }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm transition-colors hover:opacity-75"
              style={{ color: 'var(--green)' }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </a>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { name: 'name', label: 'Nama', type: 'text', placeholder: 'Nama kamu' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'email@kamu.com' },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name} className="flex flex-col gap-1">
              <label className="text-xs font-semibold font-montserrat uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={form[name as keyof FormState]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                className="rounded-lg px-4 py-2.5 text-sm border outline-none focus:border-[var(--green)] transition-colors"
                style={inputStyle}
              />
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold font-montserrat uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Pesan
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Hai Rifaa, aku mau ngobrol soal..."
              rows={5}
              required
              className="rounded-lg px-4 py-2.5 text-sm border outline-none focus:border-[var(--green)] transition-colors resize-y"
              style={inputStyle}
            />
          </div>

          {status === 'success' && (
            <p className="text-sm text-center" style={{ color: 'var(--green)' }}>
              ✅ Pesan terkirim! Aku akan balas segera.
            </p>
          )}
          {status === 'error' && (
            <p className="text-sm text-center" style={{ color: '#f87171' }}>
              ❌ Gagal mengirim. Coba lagi atau hubungi via email langsung.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="py-2.5 rounded-lg font-bold font-montserrat text-sm transition-opacity disabled:opacity-60"
            style={{ background: 'var(--btn-active)', color: 'var(--btn-active-text)' }}
          >
            {status === 'sending' ? 'Mengirim...' : 'Kirim Pesan'}
          </button>
        </form>
      </div>
    </div>
  );
}
