import { useEffect, useState } from 'react';
import SkillCategory from '../components/SkillCategory';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { supabase } from '../lib/supabase';
import type { Skill } from '../types';

// Static fallback data disabled since categories are dynamic from DB now.
const STATIC_SKILLS: { categoryName: string, skills: Skill[] }[] = [];

export default function Skills() {
  const [groupedSkills, setGroupedSkills] = useState<{ categoryName: string, skills: Skill[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (supabase) {
        // Fetch categories and skills in parallel
        const [catRes, skillRes] = await Promise.all([
          supabase.from('skill_categories').select('*').order('sort_order'),
          supabase.from('skills').select('*').order('sort_order')
        ]);
        
        if (catRes.data && skillRes.data) {
          const categories = catRes.data;
          const allSkills = skillRes.data as Skill[];
          
          const grouped = categories.map(cat => ({
            categoryName: cat.name as string,
            skills: allSkills.filter(s => s.category_id === cat.id)
          }));
          
          setGroupedSkills(grouped);
        } else {
          setGroupedSkills(STATIC_SKILLS);
        }
      } else {
        setGroupedSkills(STATIC_SKILLS);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

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
          {groupedSkills.map((group) => (
            <SkillCategory key={group.categoryName} category={group.categoryName} skills={group.skills} />
          ))}
        </div>
      )}
    </div>
  );
}
