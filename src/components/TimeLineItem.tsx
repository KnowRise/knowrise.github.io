import type { TimelineItemProps } from '../types';

export default function TimelineItem({ title, period, company, description, direction }: TimelineItemProps) {
  const isRight = direction === 'right';

  return (
    <div className="relative w-full mb-7 pl-10 md:pl-0">
      {/* Center line (left on mobile, center on desktop) */}
      <div className="absolute inset-y-0 left-0 w-10 md:inset-0 md:w-full flex items-center justify-center">
        <div
          className="absolute w-3 h-3 rounded-full z-10"
          style={{ background: 'var(--green)', boxShadow: '0 0 0 4px var(--green-dim)' }}
        />
      </div>

      {/* Card */}
      <div
        className={`rounded-xl p-5 w-full md:w-5/12 border backdrop-blur-sm ${
          isRight ? 'md:ml-auto text-left' : 'md:mr-auto md:text-right'
        }`}
        style={{
          background: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
        }}
        data-aos={isRight ? 'fade-left' : 'fade-right'}
      >
        <p className="text-sm font-semibold" style={{ color: 'var(--green)' }}>{period}</p>
        <h3 className="text-lg font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{company}</p>
        <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{description}</p>
      </div>
    </div>
  );
}
