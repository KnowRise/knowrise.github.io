import { useEffect, useState } from 'react';
import WorkCard from '../components/WorkCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { supabase } from '../lib/supabase';
import type { Project } from '../types';
import worksJson from '../assets/json/works.json';

export default function Work() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (supabase) {
        const { data } = await supabase.from('projects').select('*').order('sort_order');
        if (data) setProjects(data as Project[]);
      } else {
        // Fallback: map JSON to Project interface
        setProjects(worksJson.map((w) => ({
          id: String(w.id),
          title: w.title,
          description: w.description,
          image_url: w.imageSrc,
          project_url: w.workLink,
          tags: w.tags,
          sort_order: w.id,
          created_at: '',
        })));
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="py-14 page-in">
      <h1 className="text-3xl font-bold font-montserrat text-center mb-14" style={{ color: 'var(--text-primary)' }}>
        My Projects
      </h1>

      {loading ? (
        <div className="space-y-12">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col md:flex-row gap-8 animate-pulse">
              <div className="w-full md:w-1/2 h-48 rounded-xl" style={{ background: 'var(--tag-bg)' }} />
              <div className="w-full md:w-1/2 space-y-3">
                <div className="h-5 rounded-full w-3/4" style={{ background: 'var(--tag-bg)' }} />
                <div className="h-3 rounded-full w-full" style={{ background: 'var(--tag-bg)' }} />
                <div className="h-3 rounded-full w-5/6" style={{ background: 'var(--tag-bg)' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {projects.map((project, index) => (
            <WorkCard
              key={project.id}
              work={project}
              direction={index % 2 === 0 ? 'right' : 'left'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
