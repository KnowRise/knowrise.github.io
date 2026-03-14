import { useEffect, useState } from 'react';
import SkillCategory from '../components/SkillCategory';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { supabase } from '../lib/supabase';
import type { Skill } from '../types';

// Static fallback data
const STATIC_SKILLS: Skill[] = [
  { id: '1', name: 'Go', category: 'Backend', sort_order: 0 },
  { id: '2', name: 'Laravel', category: 'Backend', sort_order: 1 },
  { id: '3', name: 'Node.js', category: 'Backend', sort_order: 2 },
  { id: '4', name: 'REST API', category: 'Backend', sort_order: 3 },
  { id: '5', name: 'React', category: 'Frontend', sort_order: 0 },
  { id: '6', name: 'TypeScript', category: 'Frontend', sort_order: 1 },
  { id: '7', name: 'Tailwind CSS', category: 'Frontend', sort_order: 2 },
  { id: '8', name: 'HTML / CSS', category: 'Frontend', sort_order: 3 },
  { id: '9', name: 'MySQL', category: 'Database', sort_order: 0 },
  { id: '10', name: 'PostgreSQL', category: 'Database', sort_order: 1 },
  { id: '11', name: 'Supabase', category: 'Database', sort_order: 2 },
  { id: '12', name: 'Git', category: 'Tools & DevOps', sort_order: 0 },
  { id: '13', name: 'Docker', category: 'Tools & DevOps', sort_order: 1 },
  { id: '14', name: 'Linux', category: 'Tools & DevOps', sort_order: 2 },
  { id: '15', name: 'Postman', category: 'Tools & DevOps', sort_order: 3 },
  { id: '16', name: 'gRPC', category: 'Currently Learning', sort_order: 0 },
  { id: '17', name: 'Kubernetes', category: 'Currently Learning', sort_order: 1 },
  { id: '18', name: 'Redis', category: 'Currently Learning', sort_order: 2 },
];

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (supabase) {
        const { data } = await supabase.from('skills').select('*').order('sort_order');
        if (data) setSkills(data as Skill[]);
        else setSkills(STATIC_SKILLS);
      } else {
        setSkills(STATIC_SKILLS);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Group by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="py-14 page-in">
      <h1 className="text-3xl font-bold font-montserrat text-center mb-3" style={{ color: 'var(--text-primary)' }}>
        Skills &amp; Tech Stack
      </h1>
      <p className="text-center mb-10 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Technologies I work with day-to-day, and what I'm currently learning.
      </p>

      {loading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(grouped).map(([category, categorySkills]) => (
            <SkillCategory key={category} category={category} skills={categorySkills} />
          ))}
        </div>
      )}
    </div>
  );
}
