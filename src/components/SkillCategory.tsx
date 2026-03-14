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
        {skills.map((skill) => {
          const Tag = skill.url ? 'a' : 'div';
          return (
            <Tag
              key={skill.id}
              href={skill.url || undefined}
              target={skill.url ? "_blank" : undefined}
              rel={skill.url ? "noopener noreferrer" : undefined}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors duration-200 ${skill.url ? 'hover:border-[var(--green)] hover:text-[var(--green)]' : 'hover:border-[var(--green)]'}`}
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
              {skill.url && <span className="opacity-50 text-[10px] ml-1">↗</span>}
            </Tag>
          );
        })}
      </div>
    </div>
  );
}
