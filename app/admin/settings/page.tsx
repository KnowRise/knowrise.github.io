'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '../../../src/components/AdminSidebar';
import AdminToast from '../../../src/components/AdminToast';
import { getSettings, updateSettings, MENU_KEYS, menuLabelFull } from '../../../src/lib/settings';
import type { MenuKey, MenuVisibility, Settings } from '../../../src/types';
import { Save, Loader2, Eye, FileJson } from 'lucide-react';

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Settings['data'] | null>(null);
  const [visibility, setVisibility] = useState<Partial<MenuVisibility>>({});
  const [otherJson, setOtherJson] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jsonError, setJsonError] = useState('');
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'loading'|null}>({ msg: '', type: null });

  useEffect(() => {
    (async () => {
      const data = await getSettings();
      setSettings(data);
      setVisibility((data.menu_visibility || {}) as Partial<MenuVisibility>);
      const { menu_visibility, ...rest } = data;
      setOtherJson(JSON.stringify(rest, null, 2));
      setLoading(false);
    })();
  }, []);

  function notify(msg: string, type: 'success'|'error') {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: null }), 2500);
  }

  async function saveVisibility() {
    if (!settings) return;
    setSaving(true);
    const { error } = await updateSettings({ menu_visibility: visibility });
    setSaving(false);
    if (error) notify('Gagal menyimpan visibility.', 'error');
    else notify('Visibility tersimpan!', 'success');
  }

  async function saveOther() {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(otherJson);
      if (Array.isArray(parsed) || parsed === null || typeof parsed !== 'object') {
        throw new Error('root harus objek JSON');
      }
    } catch (e) {
      setJsonError(e instanceof Error ? `JSON tidak valid: ${e.message}` : 'JSON tidak valid');
      return;
    }
    setJsonError('');
    setSaving(true);
    const { error } = await updateSettings({ ...parsed, menu_visibility: visibility });
    setSaving(false);
    if (error) notify('Gagal menyimpan JSON.', 'error');
    else {
      notify('JSON tersimpan!', 'success');
      setSettings({ menu_visibility: visibility, ...parsed });
    }
  }

  const toggleItem = (key: MenuKey) => {
    setVisibility(v => ({ ...v, [key]: !(v[key] ?? true) }));
  };

  return (
    <AdminSidebar>
      <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: null })} />
      <div className="animate-in fade-in duration-500 max-w-3xl space-y-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold font-montserrat">Pengaturan</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Disimpan sebagai 1 baris JSON di tabel <code>settings</code>.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--green)' }} /></div>
        ) : (
          <>
            {/* Menu Visibility */}
            <section className="p-6 rounded-2xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                <Eye className="w-5 h-5" style={{ color: 'var(--green)' }} /> Visibilitas Menu
              </h2>
              <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                Menu yang dimatikan akan <b>disembunyikan dari navbar</b> dan <b>404 di server</b> — tidak bisa diakses lewat URL langsung.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MENU_KEYS.map((key) => (
                  <label
                    key={key}
                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors"
                    style={{
                      background: (visibility[key] ?? true) ? 'var(--green-dim)' : 'var(--btn-inactive)',
                      borderColor: (visibility[key] ?? true) ? 'var(--green)' : 'var(--card-border)',
                    }}
                  >
                    <span className="text-sm font-semibold">
                      {menuLabelFull(key)}
                      <span className="block text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>/{key === 'home' ? '' : key}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={visibility[key] ?? true}
                      onChange={() => toggleItem(key)}
                      className="w-4 h-4 rounded border-gray-300 text-(--green) focus:ring-(--green)"
                    />
                  </label>
                ))}
              </div>

              <div className="flex justify-end pt-5">
                <button
                  onClick={saveVisibility}
                  disabled={saving}
                  className="px-5 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-70"
                  style={{ background: 'var(--btn-active)', color: 'var(--btn-active-text)' }}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Visibilitas
                </button>
              </div>
            </section>

            {/* Raw JSON */}
            <section className="p-6 rounded-2xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                <FileJson className="w-5 h-5" style={{ color: 'var(--green)' }} /> JSON Lainnya
              </h2>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Untuk pengaturan masa depan yang belum ada form-nya. <code>menu_visibility</code> dikelola otomatis dari seksi atas.
              </p>
              <textarea
                rows={10}
                value={otherJson}
                onChange={e => { setOtherJson(e.target.value); setJsonError(''); }}
                className="w-full px-4 py-3 rounded-lg border bg-transparent font-mono text-xs outline-none focus:border-(--green) resize-y"
                style={{ borderColor: jsonError ? 'red' : 'var(--input-border)', color: 'var(--text-primary)' }}
              />
              {jsonError && <p className="text-xs mt-2 text-red-500">{jsonError}</p>}

              <div className="flex justify-end pt-4">
                <button
                  onClick={saveOther}
                  disabled={saving}
                  className="px-5 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-70"
                  style={{ background: 'var(--btn-active)', color: 'var(--btn-active-text)' }}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan JSON
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </AdminSidebar>
  );
}