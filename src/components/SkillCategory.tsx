import type { SkillCategoryProps } from '../types';

export default function SkillCategory({ category, skills }: SkillCategoryProps) {
  const isLearning = category.toLowerCase().includes('learning');

  return (
    <div
      className="rounded-xl p-5 border backdrop-blur-sm"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      data-aos="fade-up"
    >
      <h3
        className="text-xs uppercase tracking-widest font-bold font-montserrat mb-4"
        style={{ color: 'var(--green)' }}
      >
        {category}
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors duration-200 hover:border-[var(--green)]"
            style={{
              background: 'var(--tag-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-secondary)',
            }}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: isLearning ? '#f59e0b' : 'var(--green)' }}
            />
            {skill.name}
          </div>
        ))}
      </div>
    </div>
  );
}
