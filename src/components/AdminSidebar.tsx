'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, 
  UserCircle, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  BookOpen, 
  MessageSquare,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Protected route check
  useEffect(() => {
    async function checkAuth() {
      if (!supabase) {
        router.push('/login');
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push('/login');
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/profile', label: 'Profile', icon: UserCircle },
    { href: '/admin/experience', label: 'Experience', icon: Briefcase },
    { href: '/admin/work', label: 'Projects', icon: FolderGit2 },
    { href: '/admin/skills', label: 'Skills', icon: GraduationCap },
    { href: '/admin/blog', label: 'Blogs', icon: BookOpen },
    { href: '/admin/contact', label: 'Messages', icon: MessageSquare },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] text-[var(--text-primary)]">
      Loading Admin...
    </div>
  );

  return (
    <div className="flex w-full h-screen overflow-hidden text-[var(--text-primary)] font-montserrat bg-transparent">
      
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 w-64 border-r z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      >
        <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: 'var(--card-border)' }}>
          <h2 className="text-xl font-bold font-montserrat tracking-tight" style={{ color: 'var(--green)' }}>Admin Panel</h2>
          <button 
            className="md:hidden p-1 rounded-md" 
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive ? 'bg-[var(--green-dim)] text-[var(--green)]' : 'hover:bg-[var(--btn-inactive)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[var(--green)]' : ''}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t mt-auto" style={{ borderColor: 'var(--card-border)' }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-red-500 hover:bg-red-500/10"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b backdrop-blur-md" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <h2 className="font-bold relative z-10">Admin Panel</h2>
          <button onClick={() => setIsOpen(true)} className="p-2 rounded-md relative z-10" style={{ background: 'var(--btn-inactive)' }}>
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative bg-transparent">
          <div className="relative z-10 w-full max-w-none mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
