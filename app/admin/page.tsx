'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '../../src/components/AdminSidebar';
import { supabase } from '../../src/lib/supabase';
import { FileText, MessageSquare, Briefcase, Hash } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blogs: 0,
    messages: 0,
    work: 0,
    skills: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      if (!supabase) return;
      
      const [
        { count: blogCount },
        { count: msgCount },
        { count: workCount },
        { count: skillCount },
      ] = await Promise.all([
        supabase.from('blogs').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('work_experiences').select('*', { count: 'exact', head: true }),
        supabase.from('skills').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        blogs: blogCount || 0,
        messages: msgCount || 0,
        work: workCount || 0,
        skills: skillCount || 0,
      });
    }

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="p-6 rounded-2xl border flex items-start gap-4" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="p-3 rounded-xl" style={{ background: `rgba(${color}, 0.15)`, color: `rgb(${color})` }}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>{title}</p>
        <h3 className="text-3xl font-bold font-montserrat">{value}</h3>
      </div>
    </div>
  );

  return (
    <AdminSidebar>
      <div className="space-y-6 animate-in fade-in duration-500">
        <header>
          <h1 className="text-3xl font-bold font-montserrat mb-2">Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome to your portfolio CMS. Manage your content from the sidebar.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Blogs" value={stats.blogs} icon={FileText} color="74, 222, 128" />
          <StatCard title="Inbox Messages" value={stats.messages} icon={MessageSquare} color="59, 130, 246" />
          <StatCard title="Work Experiences" value={stats.work} icon={Briefcase} color="168, 85, 247" />
          <StatCard title="Listed Skills" value={stats.skills} icon={Hash} color="234, 179, 8" />
        </div>
      </div>
    </AdminSidebar>
  );
}
